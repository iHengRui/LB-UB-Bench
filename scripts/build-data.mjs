import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const md = new MarkdownIt({ html: true, linkify: true, typographer: false });
md.disable("escape");

const mathPattern = /\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g;

function protectMath(source) {
  const formulas = [];
  const protectedSource = source.replace(mathPattern, (formula) => {
    const token = `MATHTOKEN${formulas.length}Z`;
    formulas.push([token, formula]);
    return token;
  });
  return { protectedSource, formulas };
}

function restoreMath(rendered, formulas) {
  return formulas.reduce((output, [token, formula]) => output.replaceAll(token, formula), rendered);
}

function renderInline(source) {
  const { protectedSource, formulas } = protectMath(source);
  return restoreMath(md.renderInline(protectedSource), formulas);
}

function renderBlock(source) {
  const { protectedSource, formulas } = protectMath(source);
  return restoreMath(md.render(protectedSource), formulas);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addNotationDefinitions(source, symbols) {
  return symbols.reduce((output, symbol) => {
    const startPattern = `\\\\\\(${escapeRegExp(symbol.latex)}\\\\\\)(?=\\s+denotes)`;
    const start = new RegExp(startPattern).exec(output);
    if (!start) return output;

    const nextNotation = new RegExp(`\\\\\\([^\\n]+?\\\\\\)(?=\\s+denotes)`, "g");
    nextNotation.lastIndex = start.index + start[0].length;
    const next = nextNotation.exec(output);
    const end = next ? next.index : output.length;
    const definition = output.slice(start.index, end);
    return `${output.slice(0, start.index)}<span id="notation-${symbol.key}" class="notation-definition">${definition}</span>${output.slice(end)}`;
  }, source);
}

const files = {
  table: "table_cells_manual_expanded_v8.yaml",
  notation: "notation_manual_expanded_v8.yaml",
  remarks: "remark_notes_manual_expanded_v8.yaml",
  tags: "tag_definitions_manual_expanded_v8.yaml",
  locations: "statement_locations_manual_expanded_v8.yaml",
  bibliography: "bibliography_manual_expanded_v8.yaml",
  delivery: "decentralized_lb_ub_table_manual_expanded_v8.md",
  reviewAttribution: "review_attribution_manual_expanded_v8.yaml",
};

async function load(name) {
  return readFile(path.join(dataDir, files[name]), "utf8");
}

function between(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) {
    throw new Error(`Missing section boundary: ${start} -> ${end}`);
  }
  return source.slice(startIndex + start.length, endIndex).trim();
}

function splitTableRow(line) {
  const cells = [];
  let current = "";
  let inMath = false;
  let inCode = false;

  for (let index = 1; index < line.length - 1; index += 1) {
    const pair = line.slice(index, index + 2);
    if (pair === "\\(") inMath = true;
    if (pair === "\\)") inMath = false;
    if (line[index] === "`" && !inMath) inCode = !inCode;

    if (line[index] === "|" && !inMath && !inCode && line[index - 1] !== "\\") {
      cells.push(current.trim());
      current = "";
    } else {
      current += line[index];
    }
  }
  cells.push(current.trim());
  return cells;
}

function parseTable(markdown) {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|(?:\s*:?-+:?\s*\|)+$/.test(line))
    .map(splitTableRow);
}

function cleanCell(value) {
  return value
    .replace(/<sup>[\s\S]*?<\/sup>/g, "")
    .replaceAll("`", "")
    .trim();
}

function plainText(value) {
  return renderInline(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\\[()[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const raw = {};
for (const key of Object.keys(files)) raw[key] = await load(key);

const table = YAML.parse(raw.table);
const notation = YAML.parse(raw.notation);
const remarks = YAML.parse(raw.remarks);
const tags = YAML.parse(raw.tags);
const locations = YAML.parse(raw.locations);
const reviewAttribution = YAML.parse(raw.reviewAttribution);
const reviewers = reviewAttribution.reviewers || [];
const reviewerIdByReference = new Map();

for (const reviewer of reviewers) {
  for (const referenceId of reviewer.reference_ids || []) {
    if (reviewerIdByReference.has(referenceId)) {
      throw new Error(`Reference ${referenceId} has more than one reviewer`);
    }
    reviewerIdByReference.set(referenceId, reviewer.id);
  }
}

function unique(values) {
  return [...new Set(values)];
}

function referenceIdsFromCell(value) {
  return [...value.matchAll(/href="#(ref-[^"]+)"/g)].map((match) => match[1]);
}

const tableStart = raw.delivery.indexOf("| No. | Problem Type |");
const remarksStart = raw.delivery.indexOf("## Remark Notes");
if (tableStart < 0 || remarksStart < 0) throw new Error("Delivery table not found");

const parsedRows = parseTable(raw.delivery.slice(tableStart, remarksStart));
const header = parsedRows.shift();
const hiddenTags = new Set(table.presentation.hidden_row_tags || []);

if (header.length !== 8) throw new Error(`Expected 8 columns, found ${header.length}`);
if (parsedRows.length !== table.cells.length) {
  throw new Error(`Markdown/YAML row mismatch: ${parsedRows.length}/${table.cells.length}`);
}

const rows = parsedRows.map((cells, index) => {
  const source = table.cells[index];
  const visibleTags = source.problem_tags.filter((tag) => !hiddenTags.has(tag));
  const number = Number(cleanCell(cells[0]));
  const renderedTags = cleanCell(cells[1]);
  const renderedStatus = cleanCell(cells[5]);
  const renderedCells = cells.map((cell) => renderInline(cell));
  const lbReviewerIds = unique(
    referenceIdsFromCell(renderedCells[6]).map((referenceId) => reviewerIdByReference.get(referenceId)).filter(Boolean),
  );
  const ubReviewerIds = unique(
    referenceIdsFromCell(renderedCells[7]).map((referenceId) => reviewerIdByReference.get(referenceId)).filter(Boolean),
  );
  const reviewerIds = unique([...lbReviewerIds, ...ubReviewerIds]);
  const reviewState = reviewerIds.length
    ? "assigned"
    : source.status === "Unknown" ? "coverage-pending" : "unassigned";

  if (number !== index + 1) throw new Error(`Non-sequential row number at ${index + 1}`);
  if (renderedTags !== visibleTags.join(" ")) {
    throw new Error(`Tag mismatch on row ${number}: ${renderedTags}`);
  }
  if (renderedStatus !== source.status) {
    throw new Error(`Status mismatch on row ${number}: ${renderedStatus}`);
  }

  return {
    number,
    cellId: source.cell_id,
    tags: visibleTags,
    status: source.status,
    cells: renderedCells,
    review: {
      state: reviewState,
      reviewerIds,
      lbReviewerIds,
      ubReviewerIds,
    },
    searchText: cells.map(plainText).join(" ").toLowerCase(),
  };
});

const notationMarkdown = addNotationDefinitions(
  between(raw.delivery, "## Notation", "## Tags"),
  notation.symbols,
);
const tagsStart = raw.delivery.indexOf("## Tags");
const tagsMarkdown = raw.delivery.slice(tagsStart + "## Tags".length, tableStart).trim();
const remarksMarkdown = between(raw.delivery, "## Remark Notes", "## Summary");
const summaryMarkdown = between(raw.delivery, "## Summary", "## References");
const referencesMarkdown = raw.delivery.slice(raw.delivery.indexOf("## References") + "## References".length).trim();

const referenceMatches = [...raw.delivery.matchAll(
  /<a id="(ref-[^"]+)"><\/a>\s*\n\[(\d+)\]\s+\[([^\]]+)\]\(([^)]+)\)/g,
)];
const referenceById = new Map(referenceMatches.map((match) => [
  match[1],
  {
    referenceId: match[1],
    number: Number(match[2]),
    title: match[3],
    url: match[4],
  },
]));
const reviewerProfiles = reviewers.map((reviewer) => {
  const papers = (reviewer.reference_ids || []).map((referenceId) => {
    const reference = referenceById.get(referenceId);
    if (!reference) throw new Error(`Reviewer ${reviewer.id} points to missing reference ${referenceId}`);

    const occurrences = rows.flatMap((row) => {
      const appearsInLb = referenceIdsFromCell(row.cells[6]).includes(referenceId);
      const appearsInUb = referenceIdsFromCell(row.cells[7]).includes(referenceId);
      if (!appearsInLb && !appearsInUb) return [];
      return [{
        cellId: row.cellId,
        rowNumber: row.number,
        side: appearsInLb && appearsInUb ? "LB + UB" : appearsInLb ? "LB" : "UB",
        setting: row.tags.join(" "),
      }];
    });
    const settingRows = new Map();
    for (const occurrence of occurrences) {
      const label = occurrence.setting;
      if (!settingRows.has(label)) settingRows.set(label, []);
      settingRows.get(label).push(occurrence.rowNumber);
    }

    return {
      ...reference,
      occurrences,
      rowNumbers: occurrences.map((occurrence) => occurrence.rowNumber),
      settings: [...settingRows].map(([label, rowNumbers]) => ({ label, rowNumbers })),
    };
  });
  const rowNumbers = unique(papers.flatMap((paper) => paper.rowNumbers)).sort((a, b) => a - b);

  return {
    id: reviewer.id,
    name: reviewer.name,
    papers,
    rowNumbers,
    settingCount: unique(papers.flatMap((paper) => paper.settings.map((setting) => setting.label))).length,
  };
});
const sourceHashes = Object.fromEntries(
  Object.entries(raw).map(([key, value]) => [key, createHash("sha256").update(value).digest("hex")]),
);

const statusCounts = rows.reduce((counts, row) => {
  counts[row.status] = (counts[row.status] || 0) + 1;
  return counts;
}, {});

const output = {
  meta: {
    version: table.presentation.version,
    generatedAt: table.generated_at,
    counts: table.counts,
    statusCounts,
    claimSides: locations.counts.claim_sides,
    references: referenceMatches.length,
    notationSymbols: notation.symbols.length,
    remarkNotes: remarks.notes.length,
    tagSections: tags.sections.length,
    sourceHashes,
  },
  header,
  contributors: reviewAttribution.contributors,
  reviewers: reviewerProfiles,
  reviewMeta: {
    unassignedCoverageLabel: reviewAttribution.unassigned_coverage_label,
    attributedRows: rows.filter((row) => row.review.reviewerIds.length > 0).length,
    pendingCoverageRows: rows.filter((row) => row.review.state === "coverage-pending").length,
  },
  notationSymbols: notation.symbols.map(({ key, latex, aliases }) => ({ key, latex, aliases })),
  rows,
  referenceIds: referenceMatches.map((match) => match[1]),
  remarkIds: remarks.notes.map((note) => note.id),
  sections: {
    notation: renderBlock(notationMarkdown),
    tags: renderBlock(tagsMarkdown),
    remarks: renderBlock(remarksMarkdown),
    summary: renderBlock(summaryMarkdown),
    references: renderBlock(referencesMarkdown),
  },
};

await writeFile(path.join(root, "src", "generated-data.json"), `${JSON.stringify(output)}\n`);
console.log(`Built web data: ${rows.length} rows, ${referenceMatches.length} references.`);
