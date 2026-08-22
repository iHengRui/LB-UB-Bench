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
const suites = [
  {
    id: "decentralized",
    label: "Vanilla decentralized optimization",
    shortLabel: "Vanilla decentralized",
    status: "Active",
    description: "Lower and upper bounds for the current decentralized optimization benchmark.",
  },
  {
    id: "federated",
    label: "Vanilla federated optimization",
    shortLabel: "Vanilla federated",
    status: "Reserved",
    description: "A dedicated table for federated optimization lower and upper bounds.",
  },
  {
    id: "compression",
    label: "Decentralized optimization with compression",
    shortLabel: "Decentralized + compression",
    status: "Reserved",
    description: "A dedicated table for communication-compressed decentralized methods.",
  },
  {
    id: "asynchrony",
    label: "Decentralized optimization with asynchrony",
    shortLabel: "Decentralized + asynchrony",
    status: "Reserved",
    description: "A dedicated table for asynchronous decentralized methods.",
  },
];
const tableHeaders = [...data.header.slice(0, 6), "References (LB / UB)"];
const mathOptions = {
  delimiters: [
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ],
  throwOnError: false,
  strict: false,
  trust: (context) => context.command === "\\htmlClass",
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
        <a href="#benchmarks">Benchmarks</a>
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
    <section class="hero directory-hero" id="directory">
      <div class="content-width hero-inner">
        <p class="eyebrow">Research benchmark directory</p>
        <h1>LB / UB Bench</h1>
        <p class="lede">A paper-backed directory of lower and upper bounds for distributed optimization. Choose a benchmark suite below to open its table.</p>
        <div class="hero-actions">
          <a class="command-button primary" href="#suite-tabs">Browse benchmark suites</a>
          <a class="command-button secondary" href="${import.meta.env.BASE_URL}decentralized-lb-ub-table-v8.pdf" download>
            <i data-lucide="download"></i><span>PDF</span>
          </a>
        </div>
      </div>
    </section>

    <section class="suite-band" id="benchmarks" aria-labelledby="benchmarks-heading">
      <div class="content-width">
        <div class="suite-heading">
          <div>
            <p class="section-kicker">Directory</p>
            <h2 id="benchmarks-heading">Benchmark suites</h2>
          </div>
          <span class="suite-count">1 table available / 3 reserved</span>
        </div>
        <div class="suite-tabs" id="suite-tabs" role="tablist" aria-label="Benchmark suites">
          ${suites.map((suite) => `
            <button class="suite-tab${suite.id === "decentralized" ? " active" : ""}" type="button" role="tab" data-suite="${suite.id}" aria-selected="${suite.id === "decentralized"}">
              <span class="suite-tab-status">${suite.status}</span>
              <strong>${suite.label}</strong>
              <span>${suite.description}</span>
            </button>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="suite-empty" id="suite-empty" hidden aria-live="polite">
      <div class="content-width suite-empty-inner">
        <p class="section-kicker">Reserved benchmark suite</p>
        <h2 id="suite-empty-title">Coming soon</h2>
        <p id="suite-empty-description">This table is reserved for a future benchmark suite.</p>
        <button class="command-button secondary" type="button" id="return-to-directory">Return to directory</button>
      </div>
    </section>

    <div id="suite-content" class="suite-content">
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
            <h2 id="current-suite-name">Vanilla decentralized optimization</h2>
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
                <tr>${tableHeaders.map((heading) => `<th scope="col">${heading}</th>`).join("")}</tr>
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
        <article class="prose notation-prose">${data.sections.notation}</article>
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
    </div>
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
const suiteContent = document.querySelector("#suite-content");
const suiteEmpty = document.querySelector("#suite-empty");
const suiteEmptyTitle = document.querySelector("#suite-empty-title");
const suiteEmptyDescription = document.querySelector("#suite-empty-description");
const currentSuiteName = document.querySelector("#current-suite-name");
const suiteTabs = [...document.querySelectorAll(".suite-tab")];
const suiteParam = new URLSearchParams(window.location.search).get("suite");
let currentSuiteId = suites.some((suite) => suite.id === suiteParam) ? suiteParam : "decentralized";
let mode = "all";

function renderSuiteView({ updateUrl = false, scroll = false } = {}) {
  const suite = suites.find((item) => item.id === currentSuiteId) || suites[0];
  currentSuiteId = suite.id;
  const isActive = suite.id === "decentralized";

  suiteTabs.forEach((tab) => {
    const selected = tab.dataset.suite === suite.id;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  suiteContent.hidden = !isActive;
  suiteEmpty.hidden = isActive;
  suiteEmptyTitle.textContent = suite.label;
  suiteEmptyDescription.textContent = suite.description;
  currentSuiteName.textContent = suite.label;
  document.title = `${suite.label} | LB / UB Bench`;

  if (updateUrl) {
    const nextUrl = suite.id === "decentralized"
      ? window.location.pathname
      : `${window.location.pathname}?suite=${encodeURIComponent(suite.id)}`;
    window.history.pushState({ suite: suite.id }, "", nextUrl);
  }

  if (scroll) {
    document.querySelector("#suite-tabs")?.scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

suiteTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentSuiteId = tab.dataset.suite;
    renderSuiteView({ updateUrl: true });
    if (currentSuiteId === "decentralized") {
      document.querySelector("#table")?.scrollIntoView({ block: "start", behavior: "smooth" });
    } else {
      suiteEmpty?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  });
});

document.querySelector("#return-to-directory")?.addEventListener("click", () => {
  currentSuiteId = "decentralized";
  renderSuiteView({ updateUrl: true, scroll: true });
});

window.addEventListener("popstate", () => {
  const nextSuite = new URLSearchParams(window.location.search).get("suite");
  currentSuiteId = suites.some((suite) => suite.id === nextSuite) ? nextSuite : "decentralized";
  renderSuiteView();
});

function renderMath(root = document.body) {
  renderMathInElement(root, mathOptions);
}

const notationTerms = data.notationSymbols
  .flatMap((symbol) => [symbol.latex, ...(symbol.aliases || [])]
    .filter(Boolean)
    .flatMap((term) => {
      const baseTerm = term.endsWith("(\\cdot)") ? term.slice(0, -7) : null;
      const candidates = [term, baseTerm].filter(Boolean);
      const accentPrefixes = [
        "\\widehat", "\\hat", "\\bar", "\\tilde", "\\vec", "\\overline", "\\underline",
        "\\mathbf", "\\mathbb", "\\mathrm", "\\mathcal", "\\mathsf", "\\mathit", "\\rm",
        "\\text", "\\operatorname",
      ];
      const functionPrefixes = ["\\frac1"];
      const scriptPrefixes = ["^", "_"];
      return candidates.flatMap((candidate) => [
        { symbol, term: candidate },
        ...accentPrefixes.map((prefix) => ({ symbol, term: `${prefix} ${candidate}` })),
        ...functionPrefixes.map((prefix) => ({ symbol, term: `${prefix}${candidate}` })),
        ...scriptPrefixes.map((prefix) => ({ symbol, term: `${prefix}${candidate}` })),
      ]);
    }))
  .sort((a, b) => b.term.length - a.term.length);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const notationTermPattern = new RegExp(
  notationTerms
    .map(({ term }) => {
      return /^[\\^_]/.test(term)
        ? `${escapeRegExp(term)}(?![A-Za-z])`
        : `(?<![A-Za-z\\\\])${escapeRegExp(term)}(?![A-Za-z])`;
    })
    .join("|"),
  "g",
);

function decorateFormula(formula) {
  return formula.replace(notationTermPattern, (match, offset, source) => {
    const entry = notationTerms.find(({ term }) => {
      const pattern = `^${escapeRegExp(term)}(?![A-Za-z])`;
      return new RegExp(pattern).test(source.slice(offset));
    });
    if (!entry) return match;
    return `\\htmlClass{notation-token notation-${entry.symbol.key}}{${match}}`;
  });
}

function decorateNotationMath(root) {
  const cells = root.querySelectorAll(".measure-cell, .bound-cell");
  cells.forEach((cell) => {
    const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      node.nodeValue = node.nodeValue.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g, (full, inline, block) => {
        const body = inline ?? block;
        const decorated = decorateFormula(body);
        return full[1] === "(" ? `\\(${decorated}\\)` : `\\[${decorated}\\]`;
      });
    });
  });
}

function linkNotationMath(root) {
  root.querySelectorAll(".measure-cell .notation-token, .bound-cell .notation-token").forEach((token) => {
    const key = [...token.classList].find((className) => className.startsWith("notation-") && className !== "notation-token")?.slice("notation-".length);
    if (!key) return;
    token.classList.add("notation-link");
    token.dataset.notationTarget = `notation-${key}`;
    token.setAttribute("aria-label", `Notation ${key}`);
  });
}

function matchesMode(row) {
  if (mode === "evidence") return row.status !== "EMPTY";
  if (mode === "empty") return row.status === "EMPTY";
  return true;
}

let rowEntries = [];
const noResultsRow = document.createElement("tr");
noResultsRow.innerHTML = `<td colspan="7" class="no-results">No matching rows</td>`;

function buildRows() {
  tbody.innerHTML = data.rows
    .map(
      (row, index) => `
        <tr data-row-index="${index}" data-status="${row.status}">
          <td class="row-number">${row.cells[0]}</td>
          <td class="problem-type">${row.cells[1]}</td>
          <td class="measure-cell">${row.cells[2]}</td>
          <td class="bound-cell">${row.cells[3]}</td>
          <td class="bound-cell">${row.cells[4]}</td>
          <td><span class="status-badge status-${row.status.replace("?", "q").toLowerCase()}">${row.status}</span></td>
          <td class="reference-cell">
            <div class="reference-pair">
              <div class="reference-line"><span class="reference-kind">LB</span><span>${row.cells[6]}</span></div>
              <div class="reference-line"><span class="reference-kind">UB</span><span>${row.cells[7]}</span></div>
            </div>
          </td>
        </tr>`,
    )
    .join("");

  decorateNotationMath(tbody);
  renderMath(tbody);
  linkNotationMath(tbody);
  rowEntries = [...tbody.querySelectorAll("tr[data-row-index]")].map((element) => ({
    element,
    row: data.rows[Number(element.dataset.rowIndex)],
  }));
}

function filterRows() {
  const query = controls.search.value.trim().toLowerCase();
  const requiredTags = [controls.objective.value, controls.geometry.value, controls.oracle.value].filter(Boolean);
  let visibleCount = 0;

  rowEntries.forEach(({ element, row }) => {
    const visible = matchesMode(row)
      && (!controls.status.value || row.status === controls.status.value)
      && !requiredTags.some((tag) => !row.tags.includes(tag))
      && (!query || row.searchText.includes(query));
    element.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  noResultsRow.remove();
  if (visibleCount === 0) tbody.append(noResultsRow);
  resultCount.textContent = `${visibleCount} of ${data.rows.length} rows`;
}

controls.search.addEventListener("input", filterRows);
[controls.status, controls.objective, controls.geometry, controls.oracle]
  .forEach((control) => control.addEventListener("change", filterRows));

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    filterRows();
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
  filterRows();
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

function clearFragment() {
  if (window.location.hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
}

function highlightTarget(id) {
  document.querySelectorAll(".anchor-highlight").forEach((item) => item.classList.remove("anchor-highlight"));

  if (!/^(remark|ref|notation)-/.test(id)) return;

  const target = document.getElementById(id);
  const container = target?.closest(".notation-definition") || target?.closest("p") || target;
  if (!container) return;

  container.classList.add("anchor-highlight");
  requestAnimationFrame(() => container.scrollIntoView({ block: "start", behavior: "smooth" }));
}

function highlightHashTarget() {
  let id = window.location.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    return;
  }
  if (!id) return;

  highlightTarget(id);
  clearFragment();
}

window.addEventListener("hashchange", highlightHashTarget);
document.addEventListener("click", (event) => {
  const notation = event.target instanceof Element ? event.target.closest(".notation-link") : null;
  if (notation) {
    event.preventDefault();
    highlightTarget(notation.dataset.notationTarget);
    clearFragment();
    return;
  }

  const link = event.target instanceof Element
    ? event.target.closest("a[href^='#remark-'], a[href^='#ref-']")
    : null;
  if (!link) return;

  event.preventDefault();
  let id = link.getAttribute("href").slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    return;
  }

  highlightTarget(id);
  clearFragment();
});

document.addEventListener("animationend", (event) => {
  if (event.animationName === "anchor-highlight-pulse") {
    event.target.classList.remove("anchor-highlight");
  }
});

renderSuiteView();
buildRows();
filterRows();
renderMath(document.querySelector("main"));
highlightHashTarget();
