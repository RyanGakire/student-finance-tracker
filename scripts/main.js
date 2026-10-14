import {
	getDuplicateWordWarning,
	normalizeDescription,
	validateAmount,
	validateCategory,
	validateCategoryList,
	validateDate,
	validateDescription
} from "./validators.js";

import {
	getRecords,
	addRecord,
	deleteRecord,
	sortRecords
} from "./state.js";

import {
	renderTable,
	renderStats,
	renderChart,
	renderCapMessage
} from "./ui.js";

import {
	compileRegex,
	filterRecords
} from "./search.js";

import { getLast7Days, getTotal } from "./stats.js";

import { loadSettings, saveSettings, getCap } from "./storage.js";

let settings = loadSettings();

const descriptionInput = document.querySelector("#expense-description");
const descriptionWarning = document.querySelector("#expense-description-warning");
const descriptionError = document.querySelector("#expense-description-error");
const categoryInput = document.querySelector("#expense-category");
const categoryError = document.querySelector("#expense-category-error");
const amountInput = document.querySelector("#expense-amount");
const amountError = document.querySelector("#expense-amount-error");
const dateInput = document.querySelector("#expense-date");
const dateError = document.querySelector("#expense-date-error");
const categoriesInput = document.querySelector("#categories");
const categoriesError = document.querySelector("#categories-error");
const capInput = document.querySelector("#spending-cap");
const capError = document.querySelector("#spending-cap-error");
const form = document.querySelector("#expense-form");
const statusMessage = document.querySelector("#status-message");
const recordsBody = document.querySelector("#records tbody");
const recordsStatus = document.querySelector("#records-status");
const sortButtons = document.querySelectorAll(".sort-button");
const searchInput = document.querySelector("#records-search");
const caseInsensitiveCheckbox = document.querySelector("#case-insensitive");
const searchForm = document.querySelector("#records form[role='search']");

if (capInput) {
	capInput.value = settings.cap ?? "";
}

let sortKey = "date";
let sortDirection = "desc";

function render() {
	const pattern = searchInput.value.trim();
	const flags = caseInsensitiveCheckbox.checked ? "i" : "";

	let records = getRecords();
	let highlight = null;
	let emptyMessage = "No expenses yet. Add one in the form below.";

	if (pattern) {
		const regex = compileRegex(pattern, flags);
		if (regex) {
			records = filterRecords(records, regex);
			recordsStatus.textContent = `Found ${records.length} matching expense out of ${getRecords().length}.`;
			highlight = compileRegex(pattern, flags + "g");
			emptyMessage = "No matching expenses found.";
		} else {
			recordsStatus.textContent = "Invalid search pattern.";
			emptyMessage = "Invalid search pattern.";
		}
	} else {
		recordsStatus.textContent = "";
	}

	const sortedRecords = sortRecords(records, sortKey, sortDirection);
	renderTable(sortedRecords, highlight, emptyMessage);

	sortButtons.forEach(button => {
		const header = button.closest("th");

		if (button.dataset.key === sortKey) {
			header?.setAttribute("aria-sort", sortDirection === "asc" ? "ascending" : "descending");
		} else {
			header?.removeAttribute("aria-sort");
		}
	});

	renderStats(getRecords(), getCap());
	renderChart(getLast7Days(getRecords()), getCap());
	renderCapMessage(getTotal(getRecords()), getCap());
}

sortButtons.forEach(button => {
	button.addEventListener("click", () => {
		const key = button.dataset.key;

		if (sortKey === key) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortKey = key;
			sortDirection = "asc";
		}

		render();
	});
});

function showValidationResult(input, error, validator) {
	const message = validator(input.value);

	if (error) {
		error.textContent = message;
	}

	if (message) {
		input.setAttribute("aria-invalid", "true");
	} else {
		input.removeAttribute("aria-invalid");
	}
	return message;
}

descriptionInput?.addEventListener("input", () => {
	if (descriptionWarning) {
		descriptionWarning.textContent = getDuplicateWordWarning(descriptionInput.value);
	}
});

descriptionInput?.addEventListener("blur", () => {
	descriptionInput.value = normalizeDescription(descriptionInput.value);
	showValidationResult(descriptionInput, descriptionError, validateDescription);
});

categoryInput?.addEventListener("blur", () => {
	showValidationResult(categoryInput, categoryError, validateCategory);
});

amountInput?.addEventListener("blur", () => {
	showValidationResult(amountInput, amountError, validateAmount);
});

dateInput?.addEventListener("blur", () => {
	showValidationResult(dateInput, dateError, validateDate);
});

categoriesInput?.addEventListener("blur", () => {
	showValidationResult(categoriesInput, categoriesError, validateCategoryList);
});

capInput?.addEventListener("change", () => {
	if (!showValidationResult(capInput, capError, validateAmount)) {
		settings.cap = parseFloat(capInput.value);
		saveSettings(settings);
		render();
	}
});

form?.addEventListener("submit", (event) => {
	event.preventDefault();

	descriptionInput.value = normalizeDescription(descriptionInput.value);

	const descriptionMessage = showValidationResult(descriptionInput, descriptionError, validateDescription);
	const categoryMessage = showValidationResult(categoryInput, categoryError, validateCategory);
	const amountMessage = showValidationResult(amountInput, amountError, validateAmount);
	const dateMessage = showValidationResult(dateInput, dateError, validateDate);

	const invalidInputs = [
		dateMessage && dateInput,
		descriptionMessage && descriptionInput,
		categoryMessage && categoryInput,
		amountMessage && amountInput,
	].filter(Boolean);

	if (invalidInputs.length > 0) {
		invalidInputs[0].focus();
		statusMessage.textContent = "Please correct the errors above.";
		return;
	}

	const record = {
		id: "txn_" + Date.now(),
		description: descriptionInput.value,
		category: categoryInput.value,
		amount: parseFloat(amountInput.value),
		date: dateInput.value,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};

	addRecord(record);
	render();

	if (statusMessage) {
		statusMessage.textContent = "Expense saved";
	}

	form.reset();
	if (descriptionWarning) {
		descriptionWarning.textContent = "";
	}
});

recordsBody?.addEventListener("click", (event) => {
	if (event.target.classList.contains("delete-button")) {
		if (!confirm("Are you sure you want to delete this expense?")) {
			return;
		}
		const id = event.target.dataset.id;
		deleteRecord(id);
		render();
		if (recordsStatus) {
			recordsStatus.textContent = "Expense deleted";
		}
	}
});



searchInput?.addEventListener("input", () => {
	render();
});

caseInsensitiveCheckbox?.addEventListener("change", () => {
	render();
});

searchForm?.addEventListener("submit", (event) => {
	event.preventDefault();
	render();
});

render();
