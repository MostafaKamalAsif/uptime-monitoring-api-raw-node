// dependancies
const { samplehandler } = require('./handlers/routehandler/samplehandlers');
const { userhandler } = require('./handlers/routehandler/userhandler');
const { tokenhandler } = require('./handlers/routehandler/tokenhandlers');
const { checkhandler } = require('./handlers/routehandler/checkhandler');

const routes = {
    sample: samplehandler,
    user: userhandler,
    token: tokenhandler,
    check: checkhandler,
};
module.exports = routes;
