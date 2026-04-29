// dependancies
const { log } = require('console');
const http = require('http');

const url = require('url');

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
app.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const { headers } = req;
    res.end('Hello world');
    // log(parsedUrl);
    // log(path);
    // log(trimmedPath);
    // log(method);
    // log(queryStringObject);
    // log(headers);
};
// start the server
app.CreateServer();
