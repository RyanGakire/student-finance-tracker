import { getDuplicateWordWarning, normalizeDescription, validateDescription } from "./validators.js";

const descriptionInput = document.querySelector("#expense-description");
const descriptionWarning = document.querySelector("#expense-description-warning");
const descriptionError = document.querySelector("#expense-description-error");

descriptionInput?.addEventListener("input", () => {
	if (descriptionWarning) {
		descriptionWarning.textContent = getDuplicateWordWarning(descriptionInput.value);
	}
});

descriptionInput?.addEventListener("blur", () => {
	descriptionInput.value = normalizeDescription(descriptionInput.value);
	const message = validateDescription(descriptionInput.value);

	if (descriptionError) {
		descriptionError.textContent = message;
	}

	if (message) {
		descriptionInput.setAttribute("aria-invalid", "true");
	} else {
		descriptionInput.removeAttribute("aria-invalid");
	}
});
