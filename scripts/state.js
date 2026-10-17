import {
    load,
    save
} from './storage.js';

let records = load();

export function getRecords() {
    return records;
}

export function addRecord(record) {
    records.push(record);
    save(records);
}

export function deleteRecord(id) {
    records = records.filter(record => record.id !== id);
    save(records);
}

export function sortRecords(records, key, direction) {
    const sortedRecords = [...records];
    sortedRecords.sort((a, b) => {
        if (key === 'amount') {
            return direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else {
            return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
        }
    });

    return sortedRecords;
}

export function setRecords(newRecords) {
    records = newRecords;
    save(records);
}

export function updateRecord(id, changes) {
    records = records.map(record =>
        record.id === id ? { ...record, ...changes } : record
    );
    save(records);
}