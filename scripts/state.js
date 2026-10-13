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