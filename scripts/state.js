// Importing the load and save functions from storage.js.
import {
    load,
    save
} from './storage.js';

let records = load();

// Creating an exported function for getting records from localStorage.
export function getRecords() {
    return records;
}

// Creating an exported function for adding records to localStorage.
export function addRecord(record) {
    records.push(record);
    save(records);
}

// Creating an exported function for deleting records to localStorage.
export function deleteRecord(id) {
    records = records.filter(record => record.id !== id);
    save(records);
}

// Creating an exported function for sorting records to localStorage.
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

// Creating an exported function for setting and saving the new records to localStorage.
export function setRecords(newRecords) {
    records = newRecords;
    save(records);
}

// Creating an exported function for mapping and replacing the old fields with new, entered fields.
export function updateRecord(id, changes) {
    records = records.map(record =>
        record.id === id ? { ...record, ...changes } : record
    );
    save(records);
}