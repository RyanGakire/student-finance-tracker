import { getTotal, getTopCategory } from "./stats.js";

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

export function renderStats(records, cap) {
    const statCount = document.querySelector("#stat-count");
    const statTotal = document.querySelector("#stat-total");
    const statTopCategory = document.querySelector("#stat-top-category");
    const statCap = document.querySelector("#stat-cap");
    const total = getTotal(records);

    statCount.textContent = records.length;
    statTotal.textContent = total.toFixed(2);
    statTopCategory.textContent = getTopCategory(records) || "—";
    statCap.textContent = cap !== null ? cap.toFixed(2) : "—";
    renderCapMessage(total, cap);
}

export function renderCapMessage(total, cap) {
    const message = document.querySelector(".cap-message");
    if (!message) return;

    if (cap === null) {
        message.textContent = "";
        message.classList.remove("over-cap");
        return;
    }

    const remaining = cap - total;
    message.setAttribute("aria-live", "polite");

    if (remaining < 0) {
        message.textContent = `You are $${Math.abs(remaining).toFixed(2)} over your $${cap.toFixed(2)} cap.`;
        message.classList.add("over-cap");
    } else {
        message.textContent = `You have $${remaining.toFixed(2)} left of your $${cap.toFixed(2)} cap.`;
        message.classList.remove("over-cap");
    }
}

export function renderChart(days) {
    const chartBox = document.querySelector(".chart-box");
    chartBox.textContent = "";

    const maxTotal = Math.max(...days.map(day => day.total), 1);
    const chartHeight = 200;

    for (const day of days) {
        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${(day.total / maxTotal) * chartHeight}px`;
        bar.setAttribute("title", `$${day.total.toFixed(2)} on ${day.date}`);
        bar.setAttribute("aria-label", `$${day.total.toFixed(2)} on ${day.date}`);
        barContainer.appendChild(bar);

        const label = document.createElement("div");
        label.className = "bar-label";
        label.textContent = day.date.slice(5);
        barContainer.appendChild(label);

        chartBox.appendChild(barContainer);
    }
}