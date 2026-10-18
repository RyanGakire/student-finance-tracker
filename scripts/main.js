/*
Importing functions from validators.js, state.js, ui.js, search.js, stats.js, storage.js,
and header.js
*/

import {
	getDuplicateWordWarning,
	normalizeDescription,
	validateAmount,
	validateCategory,
	validateCategoryList,
	validateDate,
	validateDescription,
	validateImport,
	validateExchangeRate
} from "./validators.js";

import {
	getRecords,
	addRecord,
	deleteRecord,
	setRecords,
	updateRecord,
	sortRecords,
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

import { loadSettings, saveSettings } from "./storage.js";

import { setupHeader } from "./header.js";

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
const exportButton = document.querySelector("#export-button");
const settingsStatusMessage = document.querySelector("#settings-status");
const importButton = document.querySelector("#import-button");
const categoryOptions = document.querySelector("#expense-category-options");
const exchangeRateRwfInput = document.querySelector("#exchange-rate-rwf");
const exchangeRateEurInput = document.querySelector("#exchange-rate-eur");
const exchangeRateRwfError = document.querySelector("#exchange-rate-rwf-error");
const exchangeRateEurError = document.querySelector("#exchange-rate-eur-error");
const currencySelect = document.querySelector("#currency");

if (capInput) {
	capInput.value = settings.cap ?? "";
}
settings.exchangeRateRwf = settings.exchangeRateRwf ?? { RWF: 1478.18, EUR: 0.89 };
settings.currency = settings.currency ?? "USD";
if (exchangeRateRwfInput) {
	exchangeRateRwfInput.value = settings.exchangeRateRwf.RWF ?? "";
}
if (exchangeRateEurInput) {
	exchangeRateEurInput.value = settings.exchangeRateRwf.EUR ?? "";
}
if (currencySelect) {
	currencySelect.value = settings.currency;
}
if (Array.isArray(settings.categories)) {
	categoriesInput.value = settings.categories.join("\n");
	updateCategoryOptions(settings.categories)
}

let sortKey = "date";
let sortDirection = "desc";
let editingId = null;

// Creating an inner function for rendering the stats, chart, and cap message.
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
			showStatus(recordsStatus, `Found ${records.length} matching expense out of ${getRecords().length}.`);
			highlight = compileRegex(pattern, flags + "g");
			emptyMessage = "No matching expenses found.";
		} else {
			showStatus(recordsStatus, "Invalid search pattern.", "error");
			emptyMessage = "Invalid search pattern.";
		}
	} else {
		recordsStatus.textContent = "";
	}

	const sortedRecords = sortRecords(records, sortKey, sortDirection);
	renderTable(sortedRecords, highlight, emptyMessage, editingId);

	sortButtons.forEach(button => {
		const header = button.closest("th");

		if (button.dataset.key === sortKey) {
			header?.setAttribute("aria-sort", sortDirection === "asc" ? "ascending" : "descending");
		} else {
			header?.removeAttribute("aria-sort");
		}
	});

	renderStats(getRecords(), settings);
	renderChart(getLast7Days(getRecords()), settings);
	renderCapMessage(getTotal(getRecords()), settings);
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

// Creating an inner function to show Status message.
function showStatus(element, text, type) {
	element.textContent = text;
	element.classList.toggle("is-success", type === "success");
	element.classList.toggle("is-error", type === "error");
}

// Creating an innner function to show validation result message.
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

function updateCategoryOptions(categories) {
	categoryOptions.textContent = "";
	for (const category of categories) {
		const option = document.createElement("option");
		option.value = category;
		categoryOptions.appendChild(option);
	}
}

// Creating an inner function for saving inline edits.
function saveEdit(row, id) {
	const dateInput = row.querySelector('[name="date"]');
	const descriptionInput = row.querySelector('[name="description"]');
	const categoryInput = row.querySelector('[name="category"]');
	const amountInput = row.querySelector('[name="amount"]');
	descriptionInput.value = normalizeDescription(descriptionInput.value);

	const inputs = [
		[dateInput, validateDate],
		[descriptionInput, validateDescription],
		[categoryInput, validateCategory],
		[amountInput, validateAmount],
	];

	for (const [input, validator] of inputs) {
		const message = validator(input.value);
		if (message) {
			input.setAttribute("aria-invalid", "true");
			showStatus(recordsStatus, message);
			input.focus();
			return;
		}
	}

	updateRecord(id, {
		date: dateInput.value,
		description: descriptionInput.value,
		category: categoryInput.value,
		amount: parseFloat(amountInput.value),
		updatedAt: new Date().toISOString()
	});

	editingId = null;
	render();
	showStatus(recordsStatus, "Expense updated.", "success");
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
	if (!showValidationResult(categoriesInput, categoriesError, validateCategoryList)) {
		const list = categoriesInput.value.split("\n").map((line) => line.trim()).filter(Boolean);
		settings.categories = list;
		saveSettings(settings);
		updateCategoryOptions(list);
		categoriesInput.value = list.join("\n");
		settingsStatusMessage.textContent = "Categories saved.";
	}
});

capInput?.addEventListener("change", () => {
	if (!showValidationResult(capInput, capError, validateAmount)) {
		settings.cap = parseFloat(capInput.value);
		saveSettings(settings);
		render();
	}
});

exchangeRateRwfInput?.addEventListener("change", () => {
	if (!showValidationResult(exchangeRateRwfInput, exchangeRateRwfError, validateExchangeRate)) {
		settings.exchangeRateRwf.RWF = parseFloat(exchangeRateRwfInput.value);
		saveSettings(settings);
		render();
	}
});

exchangeRateEurInput?.addEventListener("change", () => {
	if (!showValidationResult(exchangeRateEurInput, exchangeRateEurError, validateExchangeRate)) {
		settings.exchangeRateRwf.EUR = parseFloat(exchangeRateEurInput.value);
		saveSettings(settings);
		render();
	}
});

currencySelect?.addEventListener("change", () => {
	settings.currency = currencySelect.value;
	saveSettings(settings);
	render();
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
	const button = event.target.closest("button");
	if (!button) {
		return;
	}
	const id = button.dataset.id;
	if (button.classList.contains("delete-button")) {
		if (!confirm("Are you sure you want to delete this expense?")) {
			return;
		}
		deleteRecord(id);
		render();
		if (recordsStatus) {
			showStatus(recordsStatus, "Expense deleted.", "success");
		}
	} else if (button.classList.contains("edit-button")) {
		editingId = id;
		render();
		recordsBody.querySelector(".editing input")?.focus();
	} else if (button.classList.contains("cancel-button")) {
		editingId = null;
		render();
		if (recordsStatus) {
			showStatus(recordsStatus, "Edit cancelled.", "success");
		}
	} else if (button.classList.contains("save-button")) {
		saveEdit(button.closest("tr"), id);
	}
});

recordsBody?.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && editingId !== null) {
		editingId = null;
		render();
		if (recordsStatus) {
			showStatus(recordsStatus, "Edit cancelled.", "success");
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

exportButton?.addEventListener("click", () => {
	const records = getRecords();
	const text = JSON.stringify(records, null, 2);
	const blob = new Blob([text], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");

	link.href = url;
	link.download = "stufina-expenses.json";
	link.click();
	URL.revokeObjectURL(url);

	if (settingsStatusMessage) {
		settingsStatusMessage.textContent = `Exported ${records.length} expenses.`;
	}
});

importButton?.addEventListener("click", async () => {
	const importFile = document.querySelector("#import-file");
	const file = importFile?.files?.[0];
	if (!file) {
		if (settingsStatusMessage) {
			settingsStatusMessage.textContent = "Choose a JSON file first.";
		}
		return;
	}

	const text = await file.text();
	let data;
	try {
		data = JSON.parse(text);
	} catch {
		if (settingsStatusMessage) {
			settingsStatusMessage.textContent = "This file is not valid JSON.";
		}
		return;
	}

	const validationMessage = validateImport(data);
	if (validationMessage) {
		if (settingsStatusMessage) {
			settingsStatusMessage.textContent = validationMessage;
		}
		return;
	}

	if (!confirm("Replace your current expenses with the imported ones?")) {
		return;
	}

	setRecords(data);
	render();
	if (settingsStatusMessage) {
		settingsStatusMessage.textContent = `Imported ${data.length} expenses.`;
	}
});

setupHeader();
render();
