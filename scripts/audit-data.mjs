import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generated = JSON.parse(await readFile(path.join(root, "src/generated-data.json"), "utf8"));
const table = YAML.parse(
  await readFile(path.join(root, "data/table_cells_manual_expanded_v8.yaml"), "utf8"),
);

const expectedStatuses = { EXACT: 2, COND: 7, LOG: 1, GAP: 3, "UB?": 1, "LB?": 48, Unknown: 12 };
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

check(generated.rows.length === 74, `Expected 74 rows, found ${generated.rows.length}`);
check(generated.rows.length === table.counts.rows, "Generated rows differ from YAML counts");
check(generated.meta.references === 50, `Expected 50 references, found ${generated.meta.references}`);
check(generated.meta.claimSides === 75, `Expected 75 claim sides, found ${generated.meta.claimSides}`);
check(generated.meta.remarkNotes === 87, `Expected 87 remark notes, found ${generated.meta.remarkNotes}`);
check(new Set(generated.rows.map((row) => row.cellId)).size === 74, "Duplicate cell IDs detected");
check(JSON.stringify(generated.meta.statusCounts) === JSON.stringify(expectedStatuses), "Status totals changed");

const referenceSet = new Set(generated.referenceIds);
const remarkSet = new Set(generated.remarkIds);
for (const row of generated.rows) {
  const markup = row.cells.join(" ");
  for (const match of markup.matchAll(/href="\#(ref-[^"]+)"/g)) {
    check(referenceSet.has(match[1]), `Row ${row.number} links to missing reference ${match[1]}`);
  }
  for (const match of markup.matchAll(/href="\#remark-([^"]+)"/g)) {
    check(remarkSet.has(match[1]), `Row ${row.number} links to missing remark ${match[1]}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Web parity audit passed: 74 rows, 75 claim sides, 87 remarks, 50 references.");
