// depandancies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilties');
const { parseJSON } = require('../../helpers/utilties');
const tokenhandler = require('./tokenhandlers');
// MODULE SCAFFOLDING
const handler = {};

// ================= USERS SUB HANDLERS =================
handler._users = {};

// GET
handler._users.get = (requestProperties, callback) => {
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
handler._users.post = (requestProperties, callback) => {
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
    const tosAgrement =
        typeof requestProperties.body.tosAgrement === 'boolean'
            ? requestProperties.body.tosAgrement
            : false;

    if (firstName && lastName && phone && password && tosAgrement) {
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgrement,
                };
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, { success: 'User created succesfuly' });
                    } else {
                        callback(500, { error: 'Could not create user' });
                    }
                });
            } else {
                callback(500, {
                    error: 'User alrady exits',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in you request',
        });
    }
};

// PUT
handler._users.put = (requestProperties, callback) => {
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
handler._users.delete = (requestProperties, callback) => {
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
handler.userhandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    const { method } = requestProperties;

    if (acceptedMethods.includes(method)) {
        handler._users[method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

module.exports = handler;
