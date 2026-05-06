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
        return crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex');
    }
    return false;
};

// Random token
utilites.createRandomString = (strLength) => {
    const length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCharacter = 'abcdefghijklmnopqrstuvwxyz123475689';
        let output = '';
        for (let i = 1; i <= length; i++) {
            const randomCharacter = possibleCharacter.charAt(
                Math.floor(Math.random() * possibleCharacter.length)
            );
            output += randomCharacter;
        }
        return output;
    } else {
        return false;
    }
};

module.exports = utilites;
