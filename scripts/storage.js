//Using the persistent state Starter Snippet from the assignment instructions.
const KEY = 'stufina:records';

export function load() {
    try {
        const storedData = localStorage.getItem(KEY);
        const data = storedData ? JSON.parse(storedData) : [];
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.warn('Error loading data from localStorage', e);
        return [];
    }
}

export const save = data => localStorage.setItem(KEY, JSON.stringify(data));

const CAP_KEY = 'stufina:settings';

// Creating an exported function for saving settings to localStorage
export function saveSettings(newSettings) {
    try {
        localStorage.setItem(CAP_KEY, JSON.stringify(newSettings));
    } catch (e) {
        console.warn('Error saving settings to localStorage', e);
    }
}

// creating an exported function for loading settings from localStorage
export function loadSettings() {
    try {
        const storedData = localStorage.getItem(CAP_KEY);
        const data = storedData ? JSON.parse(storedData) : {};
        return data || {};
    } catch (e) {
        console.warn('Error loading settings from localStorage', e);
        return {};
    }
}