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
	deleteRecord
} from "./state.js";

import {
	renderTable
} from "./ui.js";

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
const form = document.querySelector("#expense-form");
const statusMessage = document.querySelector("#status-message");
const recordsBody = document.querySelector("#records tbody");
const recordsStatus = document.querySelector("#records-status");

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
	renderTable(getRecords());

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
		renderTable(getRecords());
		if (recordsStatus) {
			recordsStatus.textContent = "Expense deleted";
		}
	}
});

renderTable(getRecords());
