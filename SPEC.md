# StuFina Tracker: M1 data model, sketches, and a11y plan
A simple web application that helps a student record expenses, see totals, and stay under a monthly 
budget cap. It works on all devices (mobile phones, tablets, desktops).

## 1. Data Model
Each transaction has:

- **ID**: which is unique and automatically made by the app
- **Description**: which don't have spaces at the start or end
- **Amount**: which is a number. It can be 0 or more, max 2 decimals
- **Category**: which can be made of letters, spaces, and hyphens
- **Date**: which is in the YYYY-MM-DD format
- **createdAt**: which is set when record is added
- **updatedAt**: which changes on every edit

Settings (saved separately):
- Base currency: USD
- Other currencies: RWF and EUR (the rates are entered by the user)
- Monthly spending cap (number)
- Categories list (by default, they are: Food, Books, Transport, Entertainment, Fees, Other - editable)

Storage keys (localStorage):
- `finance:records` array of transactions
- `finance:settings` settings object

## 2. Accessibility plan
- Landmarks: `header`, `nav`, `main`, `section` (each with a heading), `footer`.
- One `h1`, then `h2` for each section, `h3` inside sections.No skipped levels.
- "Skip to content" link as the first focusable item.
- Every input has a `<label for>`. Error text linked with `aria-describedby`.
- Visible focus outline on every interactive element (never removed).
- Status messages in a `role="status"` region (polite). Cap exceed uses `aria-live="assertive"`.
- Search highlights use `<mark>`; the text says readable by screen readers.
- Delete asks for confirmation before removing.
- Colour contrast at least 4.5:1 for text.
- Whole app usable with Tab, Shift+Tab, Enter, Space, Escape.

## 3. Wireframes
- [Phone (~360px)](/assets/wireframes/mobile.png)
- [Tablet (768px)](/assets/wireframes/Tablet.png)
- [Desktop (1024px+)](/assets/wireframes/Desktop.png)

## 4. File structure
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
scripts/stats.js
scripts/tests.js
scripts/header.js
assets/android-chrome-512x12.png
assets/favicon.ico
assets/wireframes/Desktop.png
assets/wireframes/mobile.png
assets/wireframes/Tablet.png
```