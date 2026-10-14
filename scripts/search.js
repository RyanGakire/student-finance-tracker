// using the Safe rege compiler  Starter Snippet from the assignment instructions.
export function compileRegex(input, flags = 'i') {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch (e) {
        console.warn('Invalid regex pattern:', input, e);
        return null;
    }
}

export function filterRecords(records, regex) {
    if (!regex) {
        return records;
    }

    return records.filter(record =>
        [record.description, record.category, record.date, record.amount.toFixed(2)]
            .some(value => {
                regex.lastIndex = 0;
                return regex.test(String(value));
            })
    );
}