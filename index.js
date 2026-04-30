// dependancies
const { log } = require('console');
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
// app object-module scaffolding
const app = {};

// configurations
app.config = {
    port: 3000,
};

// create server
app.CreateServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        log(`server is listening on port ${app.config.port}`);
    });
};
// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.CreateServer();
