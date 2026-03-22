# Localhost — connect to the latest UI (Option 2 & 3)

## Run (from this project folder)

```bash
cd /path/to/loan-reporting-dashboard
npm install
npm run dev
```

Use the **exact URL** Vite prints (default **http://localhost:5173**).

## If you do NOT see Option 2/3 features (repayment tables, funnel, etc.)

**Saved portal in the browser wins over dev defaults.**  
Clear it once, or **always** use `?portal=3` in the URL.

```js
// In browser DevTools → Console:
localStorage.removeItem('loan-dashboard-portal-option')
```

Then reload.

## Direct links (work even when localStorage says Option 1)

| What to see | URL (replace port if needed) |
|-------------|------------------------------|
| **Business Health** (Option 3) | http://localhost:5173/segment/business-dashboard/business-health?portal=3 |
| **Repayment overview** (Option 3 + **tables at top of Product-wise**) | http://localhost:5173/segment/business-dashboard/repayment-overview?portal=3 |
| Option 2 + Business Health | http://localhost:5173/segment/business-dashboard/business-health?portal=2 |

On **Repayment overview** with **portal=3**, scroll to **Product-wise metrics** — you should see the line **“Option 3 — tabular variant view”** and two tables (no KPI card grid).

On **Business health** with **portal=3**, expand **Repayment Overview** and scroll — same two tables appear after the four KPI cards.

## Preview build

```bash
npm run build && npm run preview
```

Then open **http://localhost:4173** and add the same paths + `?portal=3`.
