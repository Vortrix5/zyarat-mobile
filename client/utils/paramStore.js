// Simple store for passing parameters between screens
let _store = {};

export const setParams = (key, value) => {
    _store[key] = value;
    console.log(`Parameter stored: ${key}`);
};

export const getParams = (key) => {
    const value = _store[key];
    console.log(`Parameter retrieved: ${key}`);
    return value;
};

export const clearParams = (key) => {
    if (key) {
        delete _store[key];
        console.log(`Parameter cleared: ${key}`);
    } else {
        _store = {};
        console.log("All parameters cleared");
    }
};
