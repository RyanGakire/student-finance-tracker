import {
	getDuplicateWordWarning,
	normalizeDescription,
	validateAmount,
	validateCategory,
	validateDate,
	validateDescription
} from "./validators.js";

const descriptionInput = document.querySelector("#expense-description");
const descriptionWarning = document.querySelector("#expense-description-warning");
const descriptionError = document.querySelector("#expense-description-error");
const categoryInput = document.querySelector("#expense-category");
const categoryError = document.querySelector("#expense-category-error");
const amountInput = document.querySelector("#expense-amount");
const amountError = document.querySelector("#expense-amount-error");
const dateInput = document.querySelector("#expense-date");
const dateError = document.querySelector("#expense-date-error");

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
	return !message;
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
