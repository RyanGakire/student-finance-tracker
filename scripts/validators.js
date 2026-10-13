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
        : "Remove the space at the start or end and enter a non-negative number with up to two decimal places.";
}

export function validateDate(value) {
    if (!value.trim()) {
        return "Date is required.";
    }

    return DATE_REGEX.test(value)
        ? ""
        : "Remove the space at the start or end and enter a date in YYYY-MM-DD format.";
}

export function validateCategory(value) {
    if (!value.trim()) {
        return "Category is required.";
    }

    return CATEGORY_REGEX.test(value)
        ? ""
        : "Remove the space at the start or end and use letters, single spaces, or hyphens in the category.";
}

export function getDuplicateWordWarning(value) {
    return value.match(DUPLICATE_WORD_REGEX)
        ? "This description contains a repeated word."
        : "";
}
