// dependancies
const { samplehandler } = require('./handlers/routehandler/samplehandlers');
const { userhandler } = require('./handlers/routehandler/userhandler');
const { tokenhandler } = require('./handlers/routehandler/tokenhandlers');

const routes = {
    sample: samplehandler,
    user: userhandler,
    token: tokenhandler,
};
module.exports = routes;
