// modual scaffolding
const handler = {};

handler.notFound = (requestProperties, callback) => {
    callback(404, {
        message: '404 not found',
    });
};
module.exports = handler;
