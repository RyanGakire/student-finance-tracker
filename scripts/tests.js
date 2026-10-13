import {
    getDuplicateWordWarning,
    normalizeDescription,
    validateAmount,
    validateCategory,
    validateCategoryList,
    validateDate,
    validateDescription
} from "./validators.js";

const results = document.querySelector("#results");
const summary = document.querySelector("#summary");

let passed = 0;
let total = 0;

function check(name, actual, expected) {
    total += 1;
    const li = document.createElement("li");

    if (actual === expected) {
        passed += 1;
        li.textContent = "PASS: " + name;
    } else {
        li.textContent = "FAIL: " + name;
    }

    results.appendChild(li);
}

check("amount 12.50 is valid", validateAmount("12.50") === "", true);
check("amount 0 is valid", validateAmount("0") === "", true);
check("amount -5 is invalid", validateAmount("-5") === "", false);
check("amount abc is invalid", validateAmount("abc") === "", false);
check("amount 012 is invalid", validateAmount("012") === "", false);
check("amount 12.345 is invalid", validateAmount("12.345") === "", false);
check("amount 1250 is valid", validateAmount("1250") === "", true);

check("category 'Food' is valid", validateCategory("Food") === "", true);
check("category '' is invalid", validateCategory("") === "Category cannot be empty.", true);
check("category 'Food123' is invalid", validateCategory("Food123") === "", false);
check("category 'Food!' is invalid", validateCategory("Food!") === "", false);
check("category 'Food   Court' is invalid", validateCategory("Food   Court") === "", false);

check("description 'Lunch' is valid", validateDescription("Lunch") === "", true);
check("description '' is invalid", validateDescription("") === "Description cannot be empty.", true);
check("description ' Lunch' is invalid", validateDescription(" Lunch") === "", false);
check("description 'Lunch ' is invalid", validateDescription("Lunch ") === "", false);

check("date '2026-01-01' is valid", validateDate("2026-01-01") === "", true);
check("date '2026-13-01' is invalid", validateDate("2026-13-01") === "", false);
check("date '2026-01-32' is invalid", validateDate("2026-01-32") === "", false);

check("category list with duplicates is invalid", validateCategoryList("Food\nBooks\nFood") === "", false);
check("category list without duplicates is valid", validateCategoryList("Food\nBooks") === "", true);
check("category list with empty category is invalid", validateCategoryList("Food\n") === "Category cannot be empty.", true);

check("get duplicate word warning for 'Food Food' returns warning", getDuplicateWordWarning("Food Food") === "Warning: Duplicate word 'Food' found.", true);
check("get duplicate word warning for 'Food Books' returns empty", getDuplicateWordWarning("Food Books") === "", true);

check("normalize description trims whitespace", normalizeDescription("  Lunch  ") === "Lunch", true);
check("normalize description collapses spaces", normalizeDescription("Lunch   with   friends") === "Lunch with friends", true);

summary.textContent = `Passed ${passed} out of ${total} tests.`;
