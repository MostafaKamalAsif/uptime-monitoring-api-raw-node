// dependancies
const { log } = require('console');
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const envionment = require('./enviornment');
// app object-module scaffolding
const app = {};

// create server
app.CreateServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(envionment.port, () => {
        log(`server is listening on port ${envionment.port}`);
    });
};
// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.CreateServer();
