// depandancies
const data = require('../../lib/data');
const { hash, createRandomString } = require('../../helpers/utilties');
const { parseJSON } = require('../../helpers/utilties');
const tokenhandler = require('./tokenhandlers');

// MODULE SCAFFOLDING
const handler = {};

// ================= USERS SUB HANDLERS =================
handler._check = {};

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
        console.log('token:', token);
        data.read('tokens', token, (err1, tokenData) => {
            console.log('err1:', err1); // ← add this
            console.log('tokenData:', tokenData);
            if (!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                console.log('userPhone:', userPhone);
                data.read('users', userPhone, (err2, userData) => {
                    console.log('err2:', err2); // ← add this
                    console.log('userData:', userData);
                    if (!err2 && userData) {
                        tokenhandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                const userObj = parseJSON(userData);
                                const userChecks =
                                    typeof userObj.check == 'object' &&
                                    userObj.check instanceof Array
                                        ? userObj.check
                                        : [];

                                if (userChecks.length <= 5) {
                                    const checkID = createRandomString(20);
                                    const checksObj = {
                                        id: checkID,
                                        userPhone: userPhone,
                                        protocol: protocol,
                                        url: url,
                                        method: method,
                                        successCode: successCode,
                                        timeoutSecond: timeoutSecond,
                                    };
                                    // save the object in checks folder
                                    data.create('check', checkID, checksObj, (err3) => {
                                        if (!err3) {
                                            //add check id to user's object
                                            userChecks.push(checkID);
                                            userObj.check = userChecks;
                                            //update user's folder
                                            data.update('users', userPhone, userObj, (err4) => {
                                                if (!err4) {
                                                    callback(200, {
                                                        message: 'Check created successfully',
                                                        check: checksObj,
                                                        totalChecks: userObj.check.length,
                                                        allCheckIds: userObj.check,
                                                    });
                                                } else {
                                                    callback(500, {
                                                        error: 'There is a problem in server side in update user',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'There is a problem in server side in create checks',
                                            });
                                        }
                                    });
                                } else {
                                    callback(500, { error: 'server side problem' });
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
