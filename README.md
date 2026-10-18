<p align="left"><img src="assets/android-chrome-512x512.png" alt="StuFina Tracker logo" width="120"></p>

- [**Live app (Github pages):**](https://ryangakire.github.io/student-finance-tracker/)
- [**Repository:**](https://github.com/RyanGakire/student-finance-tracker)
- [**Demo Video:**](https://drive.google.com/file/d/1G0rKNlPysS6CwUqeWTeE-mAOfh-T2ABA/view?usp=drive_link)

# StuFina Tracker - Student Finance Tracker
This is an expense tracker specifically made for students. You can record and edit transactions/expenses.

## Features
- **Add, edit, and delete expenses**: You can add, edite, and delete a recorded transaction, and when deleting, you will get a confirmation prompt for double-checking.
- **Regex validation** on every field, with messages as you type and a warning for repeated words.
- **Sort** by date, description, or amount.
- **Live regex search with a case-insensitive option** and highlighted matches.
- **Dashboard** showing total records, total spent, the top category, a spending cap alert, and a 7-day spending chart.
- **Currency**: USD base with RWF and EUR, using rates you set yourself.
- **Editable categories**
- **Auto-save** in the browser.
- **JSON import and export**
- **Responsive**: can adjust depending on the screen size. Cards on phones and tables on larger screens.
- **Accessible**: can be fully used with only a keyboard, has visible focus, and screen-reader announcements.

## Regex catalog
### Validation rules

| Field | Pattern | Valid examples | Invalid examples |
|---|---|---|---|
| Description (no space at start or end) | `/^\S(?:.*\S)?$/` | `"Lunch at cafeteria"` | `" Lunch"`, `"Lunch "` |
| Amount (0 or more, max 2 decimals, no leading zeros) | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | `0`, `12.50`, `1250` | `012`, `12.555`, `-5` |
| Date (YYYY-MM-DD) | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | `2026-10-12`, `2024-02-29` | `2026-13-01`, `12-10-2026` |
| Category (letters, single spaces or hyphens) | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | `Food`, `Late-night snacks` | `Food123`, `Food Court` |
| **Advanced: repeated word (back-reference)** | `/\b(\w+)\s+\1\b/i` |warns on `the the`, `The the` | no warning on `Coffee with friends` |

Double spaces in descriptions are turned into single spaces with `/ {2,}/g`.
### Search examples
| Pattern | Finds |
|---|---|
| `coffee\|tea` (case-insensitive on) | Coffee and tea purchases |
| `\.\d{2}\b` | Amounts with cents |
| `\b(\w+)\s+\1\b` | Descriptions with a repeated word |
| `(` | Shows "Invalid search pattern" instead of crashing |

## Keyboard map

| Key | Action |
|---|---|
| Tab/ Shift+Tab | Move between controls |
| Enter | Submit form, activate button or link |
| Space | Toggle checkbox (case-insensitive search) |
| Escape | Cancel inline edit |

## Accessibility notes

- **Structure:** `header`, `nav`, `main`, `section`, `footer` landmarks, with one `h1`, then `h2` and `h3` in order
- **Skip link:** the first Tab shows "Skip to main content"
- **Forms:** every input has a label; errors are linked with `aria-describedby`, and wrong fields get `aria-invalid` plus a red border, so it's not shown by colour alone
- **Focus:** clear outline on everything you can Tab to; after an error, focus moves to the first wrong field; when editing a row, focus moves into it
- **Announcements:** messages use `role="status"`; the cap message is polite when under the cap and assertive when over it
- **Table:** sort buttons sit inside the headers with `aria-sort`; Edit and Delete buttons name the expense they act on
- **Chart:** `role="img"` with a text summary of the last 7 days
- **Search highlight:** `<mark>` built safely with `textContent` , so text stays readable and can't run as HTML
- **Colour and motion:** contrast checked with the WebAIM contrast checker; animations turn off when "reduce motion" is on

## How to run tests

**On the live site:** open https://ryangakire.github.io/student-finance-tracker/tests.html

**On your computer:**
1. Start a local server in the project folder, e.g. `python3 -m http.server 8000`
   (opening the file by double-clicking won't work, because the app uses JavaScript modules)
2. Open `http://localhost:8000/tests.html`

The page runs the tests automatically and shows **PASS** or **FAIL** for each one, with a summary at the bottom (e.g. "Passed 25 out of 25 tests").

The tests check the validation rules for description, amount, date and category, the category list, the repeated-word warning, and the double-space clean-up.

## Developer
[RyanGakire](https://github.com/RyanGakire)