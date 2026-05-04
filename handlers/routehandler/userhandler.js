// modual scaffolding
const handler = {};

handler.userhandler = (requestProperties, callback) => {
    callback(200, {
        message: 'this is user url',
    });
};
module.exports = handler;
