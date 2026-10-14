export const DESCRIPTION_REGEX = /^\S(?:.*\S)?$/;
export const AMOUNT_REGEX = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
export const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const CATEGORY_REGEX = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
export const DUPLICATE_WORD_REGEX = /\b(\w+)\s+\1\b/i;

export function normalizeDescription(value) {
    return value.replace(/ {2,}/g, " ");
}

export function validateDescription(value) {
    if (!value.trim()) {
        return "Description is required.";
    }

    return DESCRIPTION_REGEX.test(value)
        ? ""
        : "Remove the space at the start or end.";
}

export function validateAmount(value) {
    if (!value.trim()) {
        return "Amount is required.";
    }

    return AMOUNT_REGEX.test(value)
        ? ""
        : "Enter a non-negative number with up to two decimal places.";
}

export function validateDate(value) {
    if (!value.trim()) {
        return "Date is required.";
    }

    return DATE_REGEX.test(value)
        ? ""
        : "Enter a date in YYYY-MM-DD format.";
}

export function validateCategory(value) {
    if (!value.trim()) {
        return "Category is required.";
    }

    return CATEGORY_REGEX.test(value)
        ? ""
        : "Only use letters, single spaces, or hyphens in the category.";
}

export function validateCategoryList(text) {
    const lines = text.split("\n");
    const errors = [];
    let hasCategory = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
            continue;
        }
        hasCategory = true;

        const message = validateCategory(line);
        if (message) {
            errors.push(`Line ${i + 1}: ${message}`);
        }
    }

    if (!hasCategory) {
        return "Add at least one category.";
    }

    return errors.join("\n");
}

export function getDuplicateWordWarning(value) {
    return value.match(DUPLICATE_WORD_REGEX)
        ? "This description contains a repeated word."
        : "";
}

export function validateImport(data) {
    if (!Array.isArray(data)) {
        return "Invalid data format: The file must contain a list of expenses.";
    }

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (
            item === null ||
            typeof item !== "object" ||
            typeof item.id !== "string" ||
            !item.id
        ) {
            return `Item ${i + 1}: missing id.`;
        }

        const message =
            validateDescription(typeof item.description === "string" ? item.description : "") ||
            validateCategory(typeof item.category === "string" ? item.category : "") ||
            validateDate(typeof item.date === "string" ? item.date : "");
        if (message) {
            return `Item ${i + 1}: ${message}`;
        }

        const amountMessage =
            typeof item.amount === "number"
                ? validateAmount(String(item.amount))
                : "Enter a non-negative number with up to two decimal places.";
        if (amountMessage) {
            return `Item ${i + 1}: ${amountMessage}`;
        }

        if (typeof item.createdAt !== "string") {
            return `Item ${i + 1}: createdAt must be a string.`;
        }
        if (typeof item.updatedAt !== "string") {
            return `Item ${i + 1}: updatedAt must be a string.`;
        }


        return "";
    }
}
