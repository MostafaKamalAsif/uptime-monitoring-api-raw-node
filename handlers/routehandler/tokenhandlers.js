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
handler._token.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length == 20
            ? requestProperties.queryStringObject.id
            : false;
    data.read('tokens', id, (err, tData) => {
        const tokenData = { ...parseJSON(tData) };
        if (!err && tokenData) {
            callback(200, tokenData);
        } else {
            callback(404, { error: 'Requested token not found' });
        }
    });
};

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
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObj = {
                    phone,
                    id: tokenId,
                    expires,
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
handler._token.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length == 20
            ? requestProperties.body.id
            : false;
    const extend =
        typeof requestProperties.body.extend === 'boolean' &&
        requestProperties.body.extend === true;
    data.read('tokens', id, (err1, tData) => {
        const tokenObj = parseJSON(tData);
        if (id && extend) {
            if (tokenObj.id === id && !err1) {
                if (tokenObj.expires > Date.now()) {
                    tokenObj.expires = Date.now() + 60 * 60 * 1000;
                    data.update('tokens', id, tokenObj, (err2) => {
                        if (!err2) {
                            callback(200, { success: 'Token extend successfuly.' });
                        } else {
                            callback(500, { error: 'Problen shown in server side!' });
                        }
                    });
                } else {
                    callback(404, { error: 'Requested token alrady expired!' });
                }
            } else {
                callback(404, { error: 'Requested token not found' });
            }
        } else {
            callback(404, { error: 'Invalid token id! ' });
        }
    });
};

// DELETE
handler._token.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length == 20
            ? requestProperties.queryStringObject.id
            : false;
    data.read('tokens', id, (err, tData) => {
        const tokenData = parseJSON(tData);
        if (!err && tokenData) {
            data.delete('tokens', id, (err2) => {
                if (!err2) {
                    callback(200, { success: 'Token deleted successfuly.' });
                } else {
                    callback(500, { error: 'There is an problem. Try again!' });
                }
            });
        } else {
            callback(404, { error: 'Requested token not found' });
        }
    });
};

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenDataRaw) => {
        if (err || !tokenDataRaw) {
            return callback(false);
        }

        const tokenData = parseJSON(tokenDataRaw);

        if (tokenData.phone === phone && tokenData.expires > Date.now()) {
            callback(true);
        } else {
            callback(false);
        }
    });
};
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
