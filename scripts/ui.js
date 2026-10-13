export function renderTable(records) {
    const tBody = document.querySelector("#records tbody");
    tBody.textContent = "";

    if (records.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "No expenses yet. Add one in the form below.";
        tr.appendChild(td);
        tBody.appendChild(tr);
        return;
    }
    for (const record of records) {
        const tr = document.createElement("tr");

        for (const value of [record.date, record.description, record.category, record.amount.toFixed(2)]) {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
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