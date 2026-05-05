const crypto = require('crypto');
const environment = require('./environment'); // FIXED spelling

const utilites = {};

// parse json string to object
utilites.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// Hashing
utilites.hash = (str) => {
    if (typeof str === 'string' && str.length > 0 && environment.secretKey) {
        return crypto
            .createHmac('sha256', environment.secretKey)
            .update(str)
            .digest('hex');
    } else {
        return false;
    }
};

module.exports = utilites;