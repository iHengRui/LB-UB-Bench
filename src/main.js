import "katex/dist/katex.min.css";
import renderMathInElement from "katex/contrib/auto-render";
import {
  ArrowUp,
  createIcons,
  Download,
  Github,
  Moon,
  RotateCcw,
  Search,
  Sun,
} from "lucide";
import data from "./generated-data.json";
import "./styles.css";

const app = document.querySelector("#app");
const statusOrder = ["EXACT", "COND", "LOG", "GAP", "UB?", "LB?", "EMPTY"];
const mathOptions = {
  delimiters: [
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ],
  throwOnError: false,
  macros: {
    "\\eps": "\\varepsilon",
    "\\E": "\\mathbb{E}",
    "\\NFO": "N_{\\rm FO}",
    "\\NSFO": "N_{\\rm SFO}",
    "\\NSUBG": "N_{\\rm SUBG}",
  },
};

app.innerHTML = `
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="#top" aria-label="LB UB Bench home">
        <span class="brand-mark">LB</span><span class="brand-divider">/</span><span class="brand-mark">UB</span>
        <span class="brand-name">Bench</span>
      </a>
      <nav class="main-nav" aria-label="Primary navigation">
        <a href="#table">Table</a>
        <a href="#notation">Notation</a>
        <a href="#remarks">Remarks</a>
        <a href="#references">References</a>
      </nav>
      <div class="topbar-actions">
        <a class="icon-button" href="https://github.com/ihengrui/LB-UB-Bench" target="_blank" rel="noreferrer" aria-label="Open GitHub repository" title="GitHub repository">
          <i data-lucide="github"></i>
        </a>
        <button class="icon-button" id="theme-toggle" type="button" aria-label="Switch to light theme" title="Switch theme">
          <i data-lucide="sun" class="theme-icon-light"></i>
          <i data-lucide="moon" class="theme-icon-dark"></i>
        </button>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="content-width hero-inner">
        <p class="eyebrow">Vanilla decentralized optimization</p>
        <h1>Decentralized Optimization<br />Lower/Upper Bound Table</h1>
        <p class="lede">A paper-backed map of per-node oracle-query complexity across objective, geometry, oracle, and network settings.</p>
        <div class="hero-actions">
          <a class="command-button primary" href="#table">Explore table</a>
          <a class="command-button secondary" href="${import.meta.env.BASE_URL}decentralized-lb-ub-table-v8.pdf" download>
            <i data-lucide="download"></i><span>PDF</span>
          </a>
        </div>
      </div>
    </section>

    <section class="metrics-band" aria-label="Table summary">
      <div class="content-width metrics-grid">
        <div class="metric"><strong>${data.meta.counts.rows}</strong><span>Rows</span></div>
        <div class="metric"><strong>${data.meta.counts.represented_settings}</strong><span>Settings shown</span></div>
        <div class="metric"><strong>${data.meta.claimSides}</strong><span>Claim sides</span></div>
        <div class="metric"><strong>${data.meta.references}</strong><span>References</span></div>
        <div class="metric"><strong>${data.meta.counts.explicit_empty_settings}</strong><span>Explicit empty</span></div>
      </div>
    </section>

    <section class="section-band table-band" id="table">
      <div class="wide-content">
        <div class="section-heading table-heading">
          <div>
            <p class="section-kicker">Results</p>
            <h2>Complexity bounds</h2>
          </div>
          <span class="result-count" id="result-count" aria-live="polite"></span>
        </div>

        <div class="table-toolbar" aria-label="Table filters">
          <div class="search-field">
            <i data-lucide="search"></i>
            <label class="sr-only" for="table-search">Search the table</label>
            <input id="table-search" type="search" placeholder="Search settings, bounds, or references" autocomplete="off" />
          </div>
          <label class="sr-only" for="status-filter">Filter by status</label>
          <select id="status-filter">
            <option value="">All statuses</option>
            ${statusOrder.map((status) => `<option value="${status}">${status}</option>`).join("")}
          </select>
          <label class="sr-only" for="objective-filter">Filter by objective</label>
          <select id="objective-filter">
            <option value="">All objectives</option>
            <option value="SUM">SUM</option>
            <option value="STO">STO</option>
          </select>
          <label class="sr-only" for="geometry-filter">Filter by geometry</label>
          <select id="geometry-filter">
            <option value="">All geometries</option>
            <option value="SC">SC</option>
            <option value="C">C</option>
            <option value="NC">NC</option>
            <option value="PL">PL</option>
          </select>
          <label class="sr-only" for="oracle-filter">Filter by oracle</label>
          <select id="oracle-filter">
            <option value="">All oracles</option>
            <option value="FO">FO</option>
            <option value="SFO">SFO</option>
            <option value="SUBG">SUBG</option>
          </select>
          <div class="segmented-control" aria-label="Evidence mode">
            <button type="button" data-mode="all" aria-pressed="true">All</button>
            <button type="button" data-mode="evidence" aria-pressed="false">Evidence</button>
            <button type="button" data-mode="empty" aria-pressed="false">Empty</button>
          </div>
          <button class="icon-button clear-button" id="clear-filters" type="button" aria-label="Clear filters" title="Clear filters">
            <i data-lucide="rotate-ccw"></i>
          </button>
        </div>

        <div class="table-shell">
          <div class="table-scroll" tabindex="0">
            <table>
              <thead>
                <tr>${data.header.map((heading) => `<th scope="col">${heading}</th>`).join("")}</tr>
              </thead>
              <tbody id="results-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section class="section-band prose-band" id="notation">
      <div class="content-width section-layout">
        <aside class="section-index">
          <p class="section-kicker">Definitions</p>
          <h2>Notation</h2>
        </aside>
        <article class="prose">${data.sections.notation}</article>
      </div>
    </section>

    <section class="section-band prose-band alternate" id="tags">
      <div class="content-width section-layout">
        <aside class="section-index">
          <p class="section-kicker">Taxonomy</p>
          <h2>Tags</h2>
        </aside>
        <article class="prose">${data.sections.tags}</article>
      </div>
    </section>

    <section class="section-band prose-band" id="remarks">
      <div class="content-width section-layout">
        <aside class="section-index">
          <p class="section-kicker">Conditions</p>
          <h2>Remark notes</h2>
        </aside>
        <article class="prose remarks-prose">${data.sections.remarks}</article>
      </div>
    </section>

    <section class="summary-band">
      <div class="content-width section-layout">
        <aside class="section-index">
          <p class="section-kicker">Coverage</p>
          <h2>Summary</h2>
        </aside>
        <article class="prose summary-prose">${data.sections.summary}</article>
      </div>
    </section>

    <section class="section-band prose-band alternate" id="references">
      <div class="content-width section-layout">
        <aside class="section-index">
          <p class="section-kicker">Bibliography</p>
          <h2>References</h2>
        </aside>
        <article class="prose references-prose">${data.sections.references}</article>
      </div>
    </section>
  </main>

  <footer>
    <div class="content-width footer-inner">
      <span>LB / UB Bench</span>
      <span>v${data.meta.version} source snapshot</span>
      <a class="icon-button" href="#top" aria-label="Back to top" title="Back to top"><i data-lucide="arrow-up"></i></a>
    </div>
  </footer>
`;

createIcons({ icons: { ArrowUp, Download, Github, Moon, RotateCcw, Search, Sun } });

const controls = {
  search: document.querySelector("#table-search"),
  status: document.querySelector("#status-filter"),
  objective: document.querySelector("#objective-filter"),
  geometry: document.querySelector("#geometry-filter"),
  oracle: document.querySelector("#oracle-filter"),
};
const tbody = document.querySelector("#results-body");
const resultCount = document.querySelector("#result-count");
let mode = "all";

function renderMath(root = document.body) {
  renderMathInElement(root, mathOptions);
}

function matchesMode(row) {
  if (mode === "evidence") return row.status !== "EMPTY";
  if (mode === "empty") return row.status === "EMPTY";
  return true;
}

function renderRows() {
  const query = controls.search.value.trim().toLowerCase();
  const requiredTags = [controls.objective.value, controls.geometry.value, controls.oracle.value].filter(Boolean);
  const filtered = data.rows.filter((row) => {
    if (!matchesMode(row)) return false;
    if (controls.status.value && row.status !== controls.status.value) return false;
    if (requiredTags.some((tag) => !row.tags.includes(tag))) return false;
    return !query || row.searchText.includes(query);
  });

  resultCount.textContent = `${filtered.length} of ${data.rows.length} rows`;
  tbody.innerHTML = filtered.length
    ? filtered
        .map(
          (row) => `
            <tr data-status="${row.status}">
              <td class="row-number">${row.cells[0]}</td>
              <td class="problem-type">${row.cells[1]}</td>
              <td class="measure-cell">${row.cells[2]}</td>
              <td class="bound-cell">${row.cells[3]}</td>
              <td class="bound-cell">${row.cells[4]}</td>
              <td><span class="status-badge status-${row.status.replace("?", "q").toLowerCase()}">${row.status}</span></td>
              <td class="reference-cell">${row.cells[6]}</td>
              <td class="reference-cell">${row.cells[7]}</td>
            </tr>`,
        )
        .join("")
    : `<tr><td colspan="8" class="no-results">No matching rows</td></tr>`;

  renderMath(tbody);
}

Object.values(controls).forEach((control) => control.addEventListener("input", renderRows));

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    renderRows();
  });
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  Object.values(controls).forEach((control) => {
    control.value = "";
  });
  mode = "all";
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.mode === "all"));
  });
  renderRows();
});

document.querySelector("#theme-toggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  document.querySelector("meta[name='theme-color']").content = next === "dark" ? "#161817" : "#f7f8f5";
  document.querySelector("#theme-toggle").setAttribute(
    "aria-label",
    next === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
});

document.querySelectorAll("a[href^='http']").forEach((link) => {
  link.target = "_blank";
  link.rel = "noreferrer";
});

renderRows();
renderMath(document.querySelector("main"));
