// dependancies
const { log } = require('console');
const { StringDecoder } = require('string_decoder');
const url = require('url');
const routes = require('../routes');
const { notFound } = require('../handlers/routehandler/notFound');
// modules scaffolding
const handle = {};
// handle request response
handle.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const { headers } = req;

    const requestProperties = { parsedUrl, path, trimmedPath, method, queryStringObject, headers };

    const chosenHandler =
        typeof routes[trimmedPath] === 'function' ? routes[trimmedPath] : notFound;
    chosenHandler(requestProperties, (statuscode, payload) => {
        statuscode = typeof statuscode === 'number' ? statuscode : 500;
        payload = typeof payload === 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);
        // return final response
        res.writeHead(statuscode);
        res.end(payloadString);
    });
    // handle request data starting with string decoder
    const decoder = new StringDecoder('utf-8');
    let realdata = '';
    req.on('data', (buffer) => {
        realdata += decoder.write(buffer);
    });
    req.on('end', () => {
        realdata += decoder.end();
        log(realdata);
    });
    // handle request data ending

    // log(parsedUrl);
    // log(path);
    // log(trimmedPath);
    // log(method);
    // log(queryStringObject);
    // log(headers);
};
module.exports = handle;
