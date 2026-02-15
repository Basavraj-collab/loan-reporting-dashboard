# Loan Business Reporting Dashboard

A role-based reporting dashboard for banking teams to view loan business reports. Each team (Marketing, Finance, Legal, Executives, Product, Portfolio) sees only their relevant reports with seamless navigation.

## Run without Node (recommended if localhost fails)

**Option A – open in browser**  
Double-click or open this file in your browser:

**`standalone.html`**

No server or Node needed. If your browser blocks local file access, use Option B.

**Option B – simple local server (Python)**  
In Terminal, from this folder run:

```bash
cd /Users/basu/loan-reporting-dashboard
python3 -m http.server 8000
```

Then open: **http://localhost:8000/standalone.html**

---

## Run with Node (Vite dev server)

If you have Node.js installed and it runs without errors:

```bash
cd loan-reporting-dashboard
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Features

- **Dashboard** – Home page with **Loan process** and **Loan business** tiles so each team can navigate quickly to the right reports.
- **Team-based views** – Switch team via **Switch team** in the sidebar (Marketing, Finance, Legal, Executives, Product, Portfolio). Each team sees only its reports.
- **Loan process vs Loan business** – Reports are split into **Loan process** (origination, underwriting, disbursement, documentation) and **Loan business** (portfolio, risk, revenue, compliance, strategy). Use the sidebar or dashboard to filter.
- **Report hub** – **All reports** shows both groups; **Loan process** / **Loan business** show filtered lists by category.
- **Report detail** – Click any report to open it. Use **← / →** at the bottom to move between reports without going back to the list.
- **Navigation** – Dashboard, sidebar (Dashboard, All reports, Loan process, Loan business, Switch team), breadcrumbs, and prev/next. The current team is kept in the URL (`?team=...`) so links and refreshes stay in context.

## Tech

- React 18 + TypeScript
- React Router 6
- Vite
- CSS modules
