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
const formalTitle = "OptBound: A Unified Benchmark of Lower and Upper Complexity Bounds in Optimization";
const statusOrder = ["EXACT", "COND", "LOG", "GAP", "UB?", "LB?", "Unknown"];
const suites = [
  {
    id: "centralized",
    label: "Vanilla centralized optimization",
    shortLabel: "Vanilla centralized",
    status: "Planned",
    description: "Reserved for a future benchmark of lower and upper complexity bounds in vanilla centralized optimization.",
  },
  {
    id: "decentralized",
    label: "Vanilla decentralized optimization",
    shortLabel: "Vanilla decentralized",
    status: "Current release",
    description: "Current coverage: paper-backed lower and upper complexity bounds for vanilla decentralized optimization.",
  },
  {
    id: "constrained",
    label: "Constrained optimization",
    shortLabel: "Constrained",
    status: "Planned",
    description: "Reserved for a future benchmark of lower and upper complexity bounds in constrained optimization.",
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderReviewerCard(reviewer) {
  return `
    <article class="reviewer-card" data-reviewer-card="${escapeHtml(reviewer.id)}">
      <header class="reviewer-card-header">
        <div>
          <p class="reviewer-role">Contribution · Review &amp; Validation</p>
          <h3>${escapeHtml(reviewer.name)}</h3>
        </div>
        <p class="reviewer-stats">
          <span>${reviewer.papers.length} papers</span>
          <span>${reviewer.rowNumbers.length} rows</span>
          <span>${reviewer.settingCount} settings</span>
        </p>
      </header>
      <ul class="review-paper-list">
        ${reviewer.papers.map((paper) => `
          <li class="review-paper">
            <a class="review-paper-title" href="#${escapeHtml(paper.referenceId)}">
              <span class="review-paper-number">[${paper.number}]</span>
              <span>${escapeHtml(paper.title)}</span>
            </a>
            <ul class="review-occurrence-list" aria-label="Settings and rows for reference ${paper.number}">
              ${paper.occurrences.map((occurrence) => `
                <li>
                  <span class="review-side">${escapeHtml(occurrence.side)}</span>
                  <span class="review-row">Row ${occurrence.rowNumber}</span>
                  <code>${escapeHtml(occurrence.setting)}</code>
                </li>
              `).join("")}
            </ul>
          </li>
        `).join("")}
      </ul>
      <button class="command-button secondary reviewer-row-button" type="button" data-view-reviewer="${escapeHtml(reviewer.id)}" aria-controls="results-body" aria-label="View rows reviewed by ${escapeHtml(reviewer.name)}" aria-pressed="false">
        View reviewed rows
      </button>
    </article>`;
}

app.innerHTML = `
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="#top" aria-label="OptBound home">
        <span class="brand-mark">Opt</span><span class="brand-name">Bound</span>
      </a>
      <nav class="main-nav" aria-label="Primary navigation">
        <a href="#benchmarks">Benchmarks</a>
        <a href="#table">Table</a>
        <a href="#notation">Notation</a>
        <a href="#tags">Tags</a>
        <a href="#remarks">Remarks</a>
        <a href="#summary">Summary</a>
        <a href="#people" data-scroll-target="people">People</a>
        <a href="#references">References</a>
      </nav>
      <div class="topbar-actions">
        <a class="icon-button" href="https://github.com/iHengRui/OptBound" target="_blank" rel="noreferrer" aria-label="Open GitHub repository" title="GitHub repository">
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
        <p class="eyebrow">Optimization complexity benchmark</p>
        <h1>OptBound</h1>
        <p class="hero-subtitle">A Unified Benchmark of Lower and Upper Complexity Bounds in Optimization</p>
        <p class="lede">The current release covers vanilla decentralized optimization. Vanilla centralized and constrained optimization are planned as the benchmark expands.</p>
        <div class="hero-contributors">
          <span class="hero-contributors-label">Authors</span>
          <ul class="hero-contributors-list" aria-label="Authors">
            ${data.contributors.map((contributor) => `
              <li>
                <strong>${escapeHtml(contributor.name)}</strong>
                <span>${escapeHtml(contributor.affiliation)}</span>
              </li>
            `).join("")}
          </ul>
        </div>
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
          <span class="suite-count">1 current release / 2 planned</span>
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
        <p class="section-kicker">Planned benchmark suite</p>
        <h2 id="suite-empty-title">Coming soon</h2>
        <p id="suite-empty-description">This table is planned for a future OptBound release.</p>
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
        <div class="metric"><strong>${data.meta.counts.explicit_empty_settings}</strong><span>Explicit unknown</span></div>
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
            <button type="button" data-mode="unknown" aria-pressed="false">Unknown</button>
          </div>
          <button class="icon-button clear-button" id="clear-filters" type="button" aria-label="Clear filters" title="Clear filters">
            <i data-lucide="rotate-ccw"></i>
          </button>
        </div>

        <div class="review-scope" id="review-scope" hidden aria-live="polite">
          <p>
            <span class="review-scope-label">Reviewed by</span>
            <strong id="review-scope-name"></strong>
            <span id="review-scope-detail"></span>
          </p>
          <button type="button" id="clear-review-scope">Show all rows</button>
        </div>

        <div class="table-shell">
          <div class="table-scroll" tabindex="0" aria-labelledby="current-suite-name">
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

    <section class="summary-band" id="summary">
      <div class="content-width section-layout">
        <aside class="section-index">
          <p class="section-kicker">Coverage</p>
          <h2>Summary</h2>
        </aside>
        <article class="prose summary-prose">${data.sections.summary}</article>
      </div>
    </section>

    <section class="section-band people-band" id="people" aria-labelledby="people-heading">
      <div class="content-width">
        <div class="people-heading">
          <div>
            <p class="section-kicker">Attribution</p>
            <h2 id="people-heading">Authors &amp; Contributors</h2>
          </div>
          <p>Authors maintain OptBound. The contributors below review and validate assigned papers; each contribution is linked to the exact bound side, visible setting, and current table row.</p>
        </div>

        <section class="contributors-panel" aria-labelledby="authors-heading">
          <h3 id="authors-heading">Authors</h3>
          <ol class="contributors-list">
            ${data.contributors.map((contributor, index) => `
              <li>
                <span class="contributor-order">${String(index + 1).padStart(2, "0")}</span>
                <div class="contributor-details">
                  <strong>${escapeHtml(contributor.name)}</strong>
                  <span class="contributor-affiliation">${escapeHtml(contributor.affiliation)}</span>
                </div>
              </li>
            `).join("")}
          </ol>
        </section>

        <div class="review-coverage-note">
          <div>
            <strong>${data.reviewMeta.attributedRows} of ${data.rows.length} rows have named review attribution.</strong>
            <span>The remaining ${data.reviewMeta.pendingCoverageRows} <code>Unknown</code> rows cite no paper and remain ${escapeHtml(data.reviewMeta.unassignedCoverageLabel)}.</span>
          </div>
          <span class="reviewer-count">${data.reviewers.length} contributors · ${data.meta.references} papers</span>
        </div>

        <div class="reviewer-grid" aria-label="Contributors: Review and validation">
          ${data.reviewers.map(renderReviewerCard).join("")}
        </div>
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
      <span>OptBound</span>
      <span>Current release: vanilla decentralized optimization · v${data.meta.version}</span>
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
const reviewScope = document.querySelector("#review-scope");
const reviewScopeName = document.querySelector("#review-scope-name");
const reviewScopeDetail = document.querySelector("#review-scope-detail");
const suiteTabs = [...document.querySelectorAll(".suite-tab")];
const suiteParam = new URLSearchParams(window.location.search).get("suite");
let currentSuiteId = suites.some((suite) => suite.id === suiteParam) ? suiteParam : "decentralized";
let mode = "all";
let activeReviewerId = null;

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
  document.title = isActive ? formalTitle : `${suite.label} (planned) | OptBound`;

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
  if (mode === "evidence") return row.status !== "Unknown";
  if (mode === "unknown") return row.status === "Unknown";
  return true;
}

function normalizeSearchText(value) {
  return value
    .toLowerCase()
    .replace(/\\(?:varepsilon|epsilon|eps)\b/g, "\\eps")
    .replaceAll("ε", "\\eps");
}

function matchesSearchQuery(row, query) {
  if (!query) return true;
  return query.split(/\s+/).every((term) => row.searchText.includes(term));
}

function matchesActiveReviewer(row) {
  return !activeReviewerId || row.review.reviewerIds.includes(activeReviewerId);
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
  const query = normalizeSearchText(controls.search.value.trim());
  const requiredTags = [controls.objective.value, controls.geometry.value, controls.oracle.value].filter(Boolean);
  let visibleCount = 0;

  rowEntries.forEach(({ element, row }) => {
    const visible = matchesMode(row)
      && (!controls.status.value || row.status === controls.status.value)
      && !requiredTags.some((tag) => !row.tags.includes(tag))
      && matchesActiveReviewer(row)
      && matchesSearchQuery(row, query);
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

function setMode(nextMode) {
  mode = nextMode;
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.mode === nextMode));
  });
}

function updateReviewScope() {
  const reviewer = data.reviewers.find((item) => item.id === activeReviewerId);
  reviewScope.hidden = !reviewer;
  reviewScopeName.textContent = reviewer?.name || "";
  reviewScopeDetail.textContent = reviewer ? ` · ${reviewer.rowNumbers.length} reviewed rows` : "";

  document.querySelectorAll("[data-view-reviewer]").forEach((button) => {
    const selected = button.dataset.viewReviewer === activeReviewerId;
    button.setAttribute("aria-pressed", String(selected));
    button.closest(".reviewer-card")?.classList.toggle("active", selected);
  });
}

function resetAllTableFilters() {
  Object.values(controls).forEach((control) => {
    control.value = "";
  });
  activeReviewerId = null;
  setMode("all");
  updateReviewScope();
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
    filterRows();
  });
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  resetAllTableFilters();
  filterRows();
});

document.querySelector("#clear-review-scope").addEventListener("click", () => {
  resetAllTableFilters();
  filterRows();
});

document.querySelectorAll("[data-view-reviewer]").forEach((button) => {
  button.addEventListener("click", () => {
    resetAllTableFilters();
    activeReviewerId = button.dataset.viewReviewer;
    updateReviewScope();
    filterRows();
    clearFragment();
    requestAnimationFrame(() => {
      document.querySelector("#table")?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  });
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
  const scrollLink = event.target instanceof Element ? event.target.closest("[data-scroll-target]") : null;
  if (scrollLink) {
    event.preventDefault();
    document.getElementById(scrollLink.dataset.scrollTarget)?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    clearFragment();
    return;
  }

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
