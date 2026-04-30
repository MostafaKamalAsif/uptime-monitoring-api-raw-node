// modual scaffolding
const handler = {};

handler.samplehandler = (requestProperties, callback) => {
    callback(200, {
        message: 'this is sample handler',
    });
};
module.exports = handler;
