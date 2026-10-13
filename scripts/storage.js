//Using the persistent state Starter Snippet from the assignment instructions.
const KEY = 'stufina:records';

export function load() {
    try {
        const storedData = localStorage.getItem(KEY);
        const data = storedData ? JSON.parse(storedData) : [];
        return data || [];
    } catch (e) {
        console.warn('Error loading data from localStorage', e);
        return [];
    }
}

export const save = data => localStorage.setItem(KEY, JSON.stringify(data));