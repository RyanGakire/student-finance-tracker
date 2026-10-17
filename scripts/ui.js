import { getTotal, getTopCategory } from "./stats.js";

function formatMoney(amountUSD, settings) {
    const currency = settings.currency ?? "USD";
    const exchangeRate = settings.exchangeRateRwf ?? { RWF: 1, EUR: 1 };
    let amount = amountUSD;

    if (currency === "RWF") {
        amount *= exchangeRate.RWF;
    } else if (currency === "EUR") {
        amount *= exchangeRate.EUR;
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);
}

export function renderTable(records, highlightRegex, emptyMessage, editingId) {
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
        if (record.id === editingId) {
            tBody.appendChild(makeEditRow(record));
            continue;
        }
        const tr = document.createElement("tr");

        for (const [label, value] of [["Date", record.date], ["Description", record.description], ["Category", record.category], ["Amount", formatMoney(record.amount, settings)]]) {
            const cell = makeCell(value, highlightRegex);
            cell.dataset.label = label;
            tr.appendChild(cell);
        }

        const actionTd = document.createElement("td");
        actionTd.className = "actions";
        actionTd.dataset.label = "Actions";
        const editButton = document.createElement("button");
        editButton.className = "edit-button"
        editButton.dataset.id = record.id;
        editButton.textContent = "Edit"
        editButton.type = "button";
        editButton.setAttribute("aria-label", `Edit expense ${record.description} on ${record.date}`);
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.dataset.id = record.id;
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", `Delete expense ${record.description} on ${record.date}`);
        actionTd.appendChild(editButton);
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

function makeEditRow(record) {
    const tr = document.createElement("tr");
    tr.className = "editing";
    const fields = [
        ["date", "date", record.date],
        ["description", "text", record.description],
        ["category", "text", record.category],
        ["amount", "text", formatMoney(record.amount, settings)],
    ];

    for (const [name, type, value] of fields) {
        const td = document.createElement("td");
        td.className = "actions";
        td.dataset.label = name[0].toUpperCase() + name.slice(1);
        const input = document.createElement("input");
        input.type = type;
        input.value = value;
        input.name = name;
        input.setAttribute("aria-label", "Edit " + name);

        if (name === "amount") {
            input.inputMode = "decimal";
        }
        if (name === "category") {
            input.setAttribute("list", "expense-category-options");
        }

        td.appendChild(input);
        tr.appendChild(td);
    }

    const actionTd = document.createElement("td");
    actionTd.className = "actions";
    actionTd.dataset.label = "Actions";
    const saveButton = document.createElement("button");
    saveButton.className = "save-button";
    saveButton.dataset.id = record.id;
    saveButton.textContent = "Save";
    saveButton.type = "button";
    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-button";
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    actionTd.appendChild(saveButton);
    actionTd.appendChild(cancelButton);
    tr.appendChild(actionTd);

    return tr;
}

export function renderStats(records, settings) {
    const statCount = document.querySelector("#stat-count");
    const statTotal = document.querySelector("#stat-total");
    const statTopCategory = document.querySelector("#stat-top-category");
    const statCap = document.querySelector("#stat-cap");
    const total = getTotal(records);

    statCount.textContent = records.length;
    statTotal.textContent = formatMoney(total, settings);
    statTopCategory.textContent = getTopCategory(records) || "—";
    statCap.textContent = typeof settings.cap === "number" ? formatMoney(settings.cap, settings) : "Not Set";
}

export function renderCapMessage(total, settings) {
    const message = document.querySelector(".cap-message");
    if (!message) return;

    if (typeof settings.cap !== "number") {
        message.textContent = "";
        message.classList.remove("over-cap");
        return;
    }

    const remaining = settings.cap - total;

    if (remaining < 0) {
        message.setAttribute("aria-live", "assertive");
        message.textContent = `You are ${formatMoney(Math.abs(remaining), settings)} over your ${formatMoney(settings.cap, settings)} cap.`;
        message.classList.add("over-cap");
    } else {
        message.setAttribute("aria-live", "polite");
        message.textContent = `You have ${formatMoney(remaining, settings)} left of your ${formatMoney(settings.cap, settings)} cap.`;
        message.classList.remove("over-cap");
    }
}

export function renderChart(days, settings) {
    const chartBox = document.querySelector(".chart-box");
    chartBox.textContent = "";

    const maxTotal = Math.max(...days.map(day => day.total), 1);
    const chartHeight = 150;

    for (const day of days) {
        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${(day.total / maxTotal) * chartHeight}px`;
        bar.setAttribute("title", `${formatMoney(day.total, settings)} on ${day.date}`);
        barContainer.appendChild(bar);

        const label = document.createElement("div");
        label.className = "bar-label";
        label.textContent = day.date.slice(5);
        barContainer.appendChild(label);

        chartBox.appendChild(barContainer);
    }
    const actualMaxTotal = days.reduce((max, day) => day.total > max ? day.total : max, 0);
    if (actualMaxTotal === 0) {
        chartBox.setAttribute("aria-label", "No spending in the last 7 days.");
    } else {
        chartBox.setAttribute("aria-label", `Chart showing spending over the last 7 days. Maximum spending was ${formatMoney(actualMaxTotal, settings)} on ${days.find(d => d.total === actualMaxTotal).date}.`);
    }
}