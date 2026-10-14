export function getTotal(records) {
    return records.reduce((total, record) => total + record.amount, 0);
}

export function getTopCategory(records) {
    const totals = {};
    for (const record of records) {
        if (!totals[record.category]) {
            totals[record.category] = 0;
        }
        totals[record.category] += record.amount;
    }
    return Object.entries(totals).reduce((max, entry) => entry[1] > max[1] ? entry : max, ["", 0])[0] || "-";
}

function toDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function getLast7Days(records) {
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = toDateString(date);
        const total = getTotal(records.filter(
            record => record.date === dateString
        ));
        last7Days.push({ date: dateString, total });
    }
    return last7Days;
}