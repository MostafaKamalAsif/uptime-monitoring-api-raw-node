// depandancies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilties');
const { parseJSON } = require('../../helpers/utilties');
const tokenhandler = require('./tokenhandlers');
const maxChecks= require('../../helpers/environment')
// MODULE SCAFFOLDING
const handler = {};

// ================= USERS SUB HANDLERS =================
handler._check = {};

// GET
handler._check.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length == 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        //verify token
        const token =
            typeof requestProperties.headers.token === 'string'
                ? requestProperties.headers.token
                : false;
        tokenhandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                //loolup the user
                data.read('users', phone, (err, data) => {
                    const user = { ...parseJSON(data) };
                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, { error: 'Requested user not found' });
                    }
                });
            } else {
                callback(403, { error: 'Authentication failure' });
            }
        });
    } else {
        callback(400, { error: 'Invalid phone number!' });
    }
};

// POST
handler._check.post = (requestProperties, callback) => {
    const protocol =
        typeof requestProperties.body.protocol == 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;
    const url =
        typeof requestProperties.body.url == 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;
    const method =
        typeof requestProperties.body.method == 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;
    const successCode =
        typeof requestProperties.body.successCode == 'object' &&
        requestProperties.body.successCode instanceof Array
            ? requestProperties.body.successCode
            : false;
    const timeoutSecond =
        typeof requestProperties.body.timeoutSecond == 'number' &&
        requestProperties.body.timeoutSecond % 1 == 0 &&
        requestProperties.body.timeoutSecond >= 1 &&
        requestProperties.body.timeoutSecond <= 5
            ? requestProperties.body.timeoutSecond
            : false;

    if (protocol && url && method && successCode && timeoutSecond) {
        const token =
            typeof requestProperties.headers.token === 'string'
                ? requestProperties.headers.token
                : false;
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                data.read('users', 'userPhone', (err2, userData) => {
                    if (!err2 && userData) {
                        tokenhandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                const userObj = parseJSON(userData);
                                const userChecks =
                                    typeof userObj.check == 'object' &&
                                    userObj.check instanceof Array
                                        ? userObj.check
                                        : [];

                                        if(userChecks.length <= maxChecks ){

                                        }else{
                                            
                                        }
                            } else {
                                callback(403, { error: 'Authentication failure' });
                            }
                        });
                    } else {
                        callback(403, { error: 'user not found' });
                    }
                });
            } else {
                callback(403, { error: 'Authentication failure' });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in request',
        });
    }
};

// PUT
handler._check.put = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length == 11
            ? requestProperties.body.phone
            : false;
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone) {
        if (firstName || lastName || password) {
            //verify token
            const token =
                typeof requestProperties.headers.token === 'string'
                    ? requestProperties.headers.token
                    : false;
            tokenhandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    //loolup the user

                    data.read('users', phone, (err1, uData) => {
                        const userData = parseJSON(uData);
                        if (!err1 && userData) {
                            // ← check if anything actually changed
                            const isFirstNameSame = firstName && firstName === userData.firstName;
                            const isLastNameSame = lastName && lastName === userData.lastName;
                            const isPasswordSame = password && hash(password) === userData.password;

                            const nothingChanged =
                                (!firstName || isFirstNameSame) &&
                                (!lastName || isLastNameSame) &&
                                (!password || isPasswordSame);

                            if (nothingChanged) {
                                return callback(400, {
                                    error: 'Nothing to update, all values are the same',
                                });
                            }

                            if (firstName && !isFirstNameSame) {
                                userData.firstName = firstName;
                            }
                            if (lastName && !isLastNameSame) {
                                userData.lastName = lastName;
                            }
                            if (password && !isPasswordSame) {
                                userData.password = hash(password);
                            }

                            data.update('users', phone, userData, (err2) => {
                                if (!err2) {
                                    callback(200, { success: 'User info updated successfuly.' });
                                } else {
                                    callback(500, {
                                        error: 'User info not updated successfuly. Please try again!',
                                    });
                                }
                            });
                        } else {
                            callback(400, { error: 'User not found' });
                        }
                    });
                } else {
                    callback(403, { error: 'Authentication failure' });
                }
            });
        } else {
            callback(400, { error: 'Nothing to update' });
        }
    } else {
        callback(400, { error: 'Phone number is invalid. Please try again !' });
    }
};

// DELETE
handler._check.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length == 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        //verify token
        const token =
            typeof requestProperties.headers.token === 'string'
                ? requestProperties.headers.token
                : false;
        tokenhandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                //loolup the user
                data.read('users', phone, (err, uData) => {
                    const user = parseJSON(uData);
                    if (!err && user) {
                        data.delete('users', phone, (err2) => {
                            if (!err2) {
                                callback(200, { success: 'User deleted successfuly.' });
                            } else {
                                callback(500, { error: 'There is an problem. Try again!' });
                            }
                        });
                    } else {
                        callback(404, { error: 'Requested user not found' });
                    }
                });
            } else {
                callback(403, { error: 'Authentication failure' });
            }
        });
    } else {
        callback(400, { error: 'Invalid phone number!' });
    }
};

// ================= MAIN USER HANDLER =================
handler.checkhandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    const { method } = requestProperties;

    if (acceptedMethods.includes(method)) {
        handler._check[method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

module.exports = handler;
