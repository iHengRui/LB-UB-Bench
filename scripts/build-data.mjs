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

const files = {
  table: "table_cells_manual_expanded_v8.yaml",
  notation: "notation_manual_expanded_v8.yaml",
  remarks: "remark_notes_manual_expanded_v8.yaml",
  tags: "tag_definitions_manual_expanded_v8.yaml",
  locations: "statement_locations_manual_expanded_v8.yaml",
  bibliography: "bibliography_manual_expanded_v8.yaml",
  delivery: "decentralized_lb_ub_table_manual_expanded_v8.md",
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
    cells: cells.map((cell) => renderInline(cell)),
    searchText: cells.map(plainText).join(" ").toLowerCase(),
  };
});

const notationMarkdown = between(raw.delivery, "## Notation", "## Tags");
const tagsStart = raw.delivery.indexOf("## Tags");
const tagsMarkdown = raw.delivery.slice(tagsStart + "## Tags".length, tableStart).trim();
const remarksMarkdown = between(raw.delivery, "## Remark Notes", "## Summary");
const summaryMarkdown = between(raw.delivery, "## Summary", "## References");
const referencesMarkdown = raw.delivery.slice(raw.delivery.indexOf("## References") + "## References".length).trim();

const referenceMatches = [...raw.delivery.matchAll(/<a id="(ref-[^"]+)"><\/a>\s*\n\[(\d+)\]/g)];
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
