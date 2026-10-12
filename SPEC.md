# Student Finance Tracker – M1 Spec

## 1. Purpose
A simple web app that helps a student record expenses, search them, see totals, and stay under a monthly budget cap. Works on phone, tablet and desktop, and fully with the keyboard.

## 2. Data model
Each transaction:

| Field       | Type   | Example                    | Rule |
|-------------|--------|----------------------------|------|
| id          | string | `txn_0001`                 | Unique, made by the app |
| description | string | `Lunch at cafeteria`       | No spaces at start/end |
| amount      | number | `12.50`                    | 0 or more, max 2 decimals |
| category    | string | `Food`                     | Letters, spaces, hyphens |
| date        | string | `2026-10-12`               | YYYY-MM-DD |
| createdAt   | string | ISO timestamp              | Set when record is added |
| updatedAt   | string | ISO timestamp              | Changed on every edit |

Settings (saved separately):
- Base currency: USD
- Other currencies: RWF, EUR (rates typed in by the user, no API)
- Monthly spending cap (number)
- Categories list (default: Food, Books, Transport, Entertainment, Fees, Other – editable)

Storage keys (localStorage):
- `finance:records` – array of transactions
- `finance:settings` – settings object

## 3. Sections (one page, nav links jump to each)
1. **Dashboard** – total records, total spent, top category, last-7-days bar chart, cap status message.
2. **Records** – table on tablet/desktop, cards on phone. Sort buttons, regex search box, case toggle, edit and delete per row.
3. **Add / Edit form** – description, amount, category, date. Errors show under each field.
4. **Settings** – currency and rates, cap, categories, import JSON, export JSON.
5. **About** – purpose, GitHub link, email.

## 4. Regex validation rules
| # | Field       | Pattern | Meaning |
|---|-------------|---------|---------|
| 1 | Description | `/^\S(?:.*\S)?$/` | No leading or trailing spaces |
| 2 | Amount      | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | Whole number or up to 2 decimals, no leading zeros |
| 3 | Date        | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | YYYY-MM-DD |
| 4 | Category    | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, single spaces or hyphens between words |
| 5 | Advanced (back-reference) | `/\b(\w+)\s+\1\b/i` | Warns about repeated words, e.g. "the the" |

Search examples users can try:
- `\.\d{2}\b` – amounts with cents
- `(coffee|tea)` – drink purchases
- `\b(\w+)\s+\1\b` – duplicate words

## 5. Accessibility plan
- Landmarks: `header`, `nav`, `main`, `section` (each with a heading), `footer`.
- One `h1`, then `h2` for each section, `h3` inside sections. No skipped levels.
- "Skip to content" link as the first focusable item.
- Every input has a `<label for>`. Error text linked with `aria-describedby`.
- Visible focus outline on every interactive element (never removed).
- Status messages in a `role="status"` region (polite). Cap exceeded uses `aria-live="assertive"`.
- Search highlights use `<mark>`; the text stays readable by screen readers.
- Delete asks for confirmation before removing.
- Colour contrast at least 4.5:1 for text (check with WebAIM contrast checker).
- Whole app usable with Tab, Shift+Tab, Enter, Space, Escape.

## 6. Keyboard map (planned)
| Key | Action |
|-----|--------|
| Tab / Shift+Tab | Move between controls |
| Enter | Submit form, activate button or link |
| Space | Toggle checkbox (case-insensitive search) |
| Escape | Cancel inline edit |

## 7. Wireframes (sketch these on paper and photograph them)
**Phone (~360px):** stacked layout. Header with title and a nav menu. Dashboard cards one per row. Records shown as cards (description, amount, category, date, Edit/Delete buttons). Form fields full width.

**Tablet (768px):** dashboard cards in 2 columns. Records switch to a table. Form fields 2 per row.

**Desktop (1024px+):** nav across the top, dashboard cards in 4 columns, chart beside cap status, wide table, settings in two columns.

## 8. File structure
```
index.html
tests.html
seed.json
README.md
SPEC.md
.gitignore
styles/main.css
scripts/main.js
scripts/storage.js
scripts/state.js
scripts/ui.js
scripts/validators.js
scripts/search.js
assets/wireframes/
```
