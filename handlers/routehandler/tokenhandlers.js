// depandancies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilties');
const { createRandomString } = require('../../helpers/utilties');
const { parseJSON } = require('../../helpers/utilties');
// MODULE SCAFFOLDING
const handler = {};

// ================= USERS SUB HANDLERS =================
handler._token = {};

// GET
handler._token.get = (requestProperties, callback) => {};

// POST
handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length == 11
            ? requestProperties.body.phone
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashPassword = hash(password);
            if (
                phone === parseJSON(userData).phone &&
                hashPassword === parseJSON(userData).password
            ) {
                const tokenId = createRandomString(20);
                const expiere = Date.now() + 3 * 60 * 1000;
                const tokenObj = {
                    phone,
                    id: tokenId,
                    expiere,
                };
                data.create('tokens', tokenId, tokenObj, (err2) => {
                    if (!err2) {
                        callback(200, tokenObj);
                    } else {
                        callback(500, { error: 'There is a problem in server side.' });
                    }
                });
            } else {
                callback(400, { error: 'Wrong phone or password! please try again.' });
            }
        });
    }
};

// PUT
handler._token.put = (requestProperties, callback) => {};

// DELETE
handler._token.delete = (requestProperties, callback) => {};

// ================= MAIN USER HANDLER =================
handler.tokenhandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    const { method } = requestProperties;

    if (acceptedMethods.includes(method)) {
        handler._token[method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

module.exports = handler;
