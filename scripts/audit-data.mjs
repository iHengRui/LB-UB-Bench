import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generated = JSON.parse(await readFile(path.join(root, "src/generated-data.json"), "utf8"));
const table = YAML.parse(
  await readFile(path.join(root, "data/table_cells_manual_expanded_v8.yaml"), "utf8"),
);
const reviewAttribution = YAML.parse(
  await readFile(path.join(root, "data/review_attribution_manual_expanded_v8.yaml"), "utf8"),
);

const expectedStatuses = { EXACT: 2, COND: 7, LOG: 1, GAP: 3, "UB?": 1, "LB?": 48, Unknown: 12 };
const expectedContributors = [
  { name: "Hengrui Zhang", affiliation: "SMS, Peking University" },
  { name: "Zhaojin Gong", affiliation: "SMS, Fudan University" },
  { name: "Benqi Liu", affiliation: "BICMR, Peking University" },
  { name: "Kun Yuan", affiliation: "CMLR, Peking University" },
];
const expectedReviewerNames = [
  "Yutong He",
  "Boao Kong",
  "Jiahao Wang",
  "Hengrui Zhang",
  "Shuchen Zhu",
  "Ming Sun",
  "Mingyu Mo",
  "Wenxuan Wu",
  "Feiyue Ye",
  "Feiming Wang",
];
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function referenceIdsFromCell(value) {
  return [...value.matchAll(/href="#(ref-[^"]+)"/g)].map((match) => match[1]);
}

const reviewerById = new Map(reviewAttribution.reviewers.map((reviewer) => [reviewer.id, reviewer]));
const generatedReviewerById = new Map(generated.reviewers.map((reviewer) => [reviewer.id, reviewer]));
const reviewerIdByReference = new Map();
for (const reviewer of reviewAttribution.reviewers) {
  check(reviewer.reference_ids.length === 5, `Reviewer ${reviewer.id} must have exactly five papers`);
  for (const referenceId of reviewer.reference_ids) {
    check(!reviewerIdByReference.has(referenceId), `Reference ${referenceId} has duplicate reviewer assignments`);
    reviewerIdByReference.set(referenceId, reviewer.id);
  }
}

check(generated.rows.length === 74, `Expected 74 rows, found ${generated.rows.length}`);
check(generated.rows.length === table.counts.rows, "Generated rows differ from YAML counts");
check(generated.meta.references === 50, `Expected 50 references, found ${generated.meta.references}`);
check(generated.meta.claimSides === 75, `Expected 75 claim sides, found ${generated.meta.claimSides}`);
check(generated.meta.remarkNotes === 87, `Expected 87 remark notes, found ${generated.meta.remarkNotes}`);
check(new Set(generated.rows.map((row) => row.cellId)).size === 74, "Duplicate cell IDs detected");
check(JSON.stringify(generated.meta.statusCounts) === JSON.stringify(expectedStatuses), "Status totals changed");
check(
  JSON.stringify(reviewAttribution.contributors) === JSON.stringify(expectedContributors)
    && JSON.stringify(generated.contributors) === JSON.stringify(expectedContributors),
  "Contributor metadata or order changed",
);
check(new Set(generated.contributors.map((contributor) => contributor.name)).size === 4, "Duplicate contributor names detected");
check(
  generated.contributors.every((contributor) => contributor.name?.trim() && contributor.affiliation?.trim()),
  "Contributor name or affiliation is missing",
);
check(generated.reviewers.length === 10, `Expected 10 reviewers, found ${generated.reviewers.length}`);
check(new Set(generated.reviewers.map((reviewer) => reviewer.id)).size === 10, "Duplicate reviewer IDs detected");
check(
  JSON.stringify(generated.reviewers.map((reviewer) => reviewer.name)) === JSON.stringify(expectedReviewerNames),
  "Reviewer English names or order changed",
);
check(new Set(expectedReviewerNames).size === expectedReviewerNames.length, "Duplicate reviewer English names detected");
check(reviewerIdByReference.size === 50, `Expected 50 reviewed references, found ${reviewerIdByReference.size}`);
check(generated.reviewMeta.attributedRows === 62, `Expected 62 attributed rows, found ${generated.reviewMeta.attributedRows}`);
check(generated.reviewMeta.pendingCoverageRows === 12, `Expected 12 coverage-pending rows, found ${generated.reviewMeta.pendingCoverageRows}`);

const referenceSet = new Set(generated.referenceIds);
const remarkSet = new Set(generated.remarkIds);
for (const referenceId of referenceSet) {
  check(reviewerIdByReference.has(referenceId), `Reference ${referenceId} has no reviewer assignment`);
}
for (const referenceId of reviewerIdByReference.keys()) {
  check(referenceSet.has(referenceId), `Reviewer assignment points to missing reference ${referenceId}`);
}

for (const sourceReviewer of reviewAttribution.reviewers) {
  const reviewer = generatedReviewerById.get(sourceReviewer.id);
  check(Boolean(reviewer), `Generated reviewer ${sourceReviewer.id} is missing`);
  if (!reviewer) continue;

  check(reviewer.name === sourceReviewer.name, `Reviewer name changed for ${sourceReviewer.id}`);
  check(reviewer.papers.length === 5, `Reviewer ${sourceReviewer.id} does not display five papers`);
  check(
    JSON.stringify(reviewer.papers.map((paper) => paper.referenceId)) === JSON.stringify(sourceReviewer.reference_ids),
    `Reviewer paper order changed for ${sourceReviewer.id}`,
  );

  for (const paper of reviewer.papers) {
    check(Number.isInteger(paper.number) && paper.number >= 1 && paper.number <= 50, `Invalid paper number for ${paper.referenceId}`);
    check(Boolean(paper.title?.trim()), `Missing paper title for ${paper.referenceId}`);
    check(Boolean(paper.url?.trim()), `Missing paper URL for ${paper.referenceId}`);

    const expectedOccurrences = generated.rows.flatMap((row) => {
      const lbIds = referenceIdsFromCell(row.cells[6]);
      const ubIds = referenceIdsFromCell(row.cells[7]);
      const appearsInLb = lbIds.includes(paper.referenceId);
      const appearsInUb = ubIds.includes(paper.referenceId);
      if (!appearsInLb && !appearsInUb) return [];
      return [{
        cellId: row.cellId,
        rowNumber: row.number,
        side: appearsInLb && appearsInUb ? "LB + UB" : appearsInLb ? "LB" : "UB",
        setting: row.tags.join(" "),
      }];
    });
    check(
      JSON.stringify(paper.occurrences) === JSON.stringify(expectedOccurrences),
      `Paper-to-row occurrences changed for ${paper.referenceId}`,
    );
  }

  const expectedRows = generated.rows
    .filter((row) => row.review.reviewerIds.includes(sourceReviewer.id))
    .map((row) => row.number);
  check(
    JSON.stringify(reviewer.rowNumbers) === JSON.stringify(expectedRows),
    `Reviewer row list changed for ${sourceReviewer.id}`,
  );
  check(
    reviewer.settingCount === new Set(reviewer.papers.flatMap((paper) => paper.occurrences.map((item) => item.setting))).size,
    `Reviewer setting count changed for ${sourceReviewer.id}`,
  );
}

check(
  generated.reviewers.reduce((total, reviewer) => total + reviewer.rowNumbers.length, 0) === 63,
  "Expected 63 reviewer-row memberships",
);
const sharedRow = generated.rows.find((row) => row.number === 11);
check(
  sharedRow?.review.lbReviewerIds.includes("reviewer-10")
    && sharedRow?.review.ubReviewerIds.includes("reviewer-07"),
  "Row 11 LB/UB reviewer split changed",
);

for (const row of generated.rows) {
  const markup = row.cells.join(" ");
  for (const match of markup.matchAll(/href="\#(ref-[^"]+)"/g)) {
    check(referenceSet.has(match[1]), `Row ${row.number} links to missing reference ${match[1]}`);
  }
  for (const match of markup.matchAll(/href="\#remark-([^"]+)"/g)) {
    check(remarkSet.has(match[1]), `Row ${row.number} links to missing remark ${match[1]}`);
  }

  const expectedLbReviewerIds = referenceIdsFromCell(row.cells[6])
    .map((referenceId) => reviewerIdByReference.get(referenceId));
  const expectedUbReviewerIds = referenceIdsFromCell(row.cells[7])
    .map((referenceId) => reviewerIdByReference.get(referenceId));
  check(
    JSON.stringify(row.review.lbReviewerIds) === JSON.stringify(expectedLbReviewerIds),
    `Row ${row.number} LB reviewer mapping changed`,
  );
  check(
    JSON.stringify(row.review.ubReviewerIds) === JSON.stringify(expectedUbReviewerIds),
    `Row ${row.number} UB reviewer mapping changed`,
  );

  for (const reviewerId of row.review.reviewerIds) {
    check(reviewerById.has(reviewerId), `Row ${row.number} has unknown reviewer ${reviewerId}`);
  }

  check(
    !reviewAttribution.reviewers.some((reviewer) => row.searchText.includes(reviewer.name.toLowerCase())),
    `Row ${row.number} search text unexpectedly includes reviewer data`,
  );
  check(
    !row.searchText.includes(reviewAttribution.unassigned_coverage_label.toLowerCase()),
    `Row ${row.number} search text unexpectedly includes review-status data`,
  );

  if (row.status === "Unknown") {
    check(row.review.state === "coverage-pending", `Unknown row ${row.number} is not coverage-pending`);
    check(row.review.reviewerIds.length === 0, `Unknown row ${row.number} has an inferred reviewer`);
  } else {
    check(row.review.state === "assigned", `Evidence row ${row.number} has no reviewer assignment`);
    check(row.review.reviewerIds.length > 0, `Evidence row ${row.number} has no reviewer`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Web parity audit passed: 74 rows, 75 claim sides, 87 remarks, 50 references.");
