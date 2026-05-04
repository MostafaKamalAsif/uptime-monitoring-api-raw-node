// dependancies
const { samplehandler } = require('./handlers/routehandler/samplehandlers');
const { userhandler } = require('./handlers/routehandler/userhandler')

const routes = {
  sample: samplehandler,
  user: userhandler
};
module.exports = routes;
