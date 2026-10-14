export function renderTable(records, highlightRegex, emptyMessage) {
    const tBody = document.querySelector("#records tbody");
    tBody.textContent = "";

    if (records.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = emptyMessage || "No expenses yet. Add one in the form below.";
        tr.appendChild(td);
        tBody.appendChild(tr);
        return;
    }
    for (const record of records) {
        const tr = document.createElement("tr");

        for (const value of [record.date, record.description, record.category, record.amount.toFixed(2)]) {
            tr.appendChild(makeCell(value, highlightRegex));
        }

        const actionTd = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.dataset.id = record.id;
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", `Delete expense ${record.description} on ${record.date}`);
        actionTd.appendChild(deleteButton);
        tr.appendChild(actionTd);
        tBody.appendChild(tr);
    }
}

function makeCell(text, regex) {
    const td = document.createElement("td");
    if (!regex) {
        td.textContent = text;
        return td;
    }

    let last = 0;
    for (const match of text.matchAll(regex)) {
        if (match[0] === "") continue;

        td.append(text.slice(last, match.index));
        const mark = document.createElement("mark");
        mark.textContent = match[0];
        td.append(mark);
        last = match.index + match[0].length;
    }
    td.append(text.slice(last));
    return td;
}