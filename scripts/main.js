import { getDuplicateWordWarning, normalizeDescription } from "./validators.js";

const descriptionInput = document.querySelector("#expense-description");
const descriptionWarning = document.querySelector("#expense-description-warning");

descriptionInput?.addEventListener("input", () => {
	if (descriptionWarning) {
		descriptionWarning.textContent = getDuplicateWordWarning(descriptionInput.value);
	}
});

descriptionInput?.addEventListener("blur", () => {
	descriptionInput.value = normalizeDescription(descriptionInput.value);
});
