import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await copyFile(path.join(root, "source-template.html"), path.join(root, "index.html"));
console.log("Prepared Vite source entry.");
