// ================= DEPENDENCIES =================
const { log } = require('console'); // console.log shortcut
const { StringDecoder } = require('string_decoder'); // convert Buffer → string
const url = require('url'); // parse URL
const routes = require('../routes'); // import route handlers
const { notFound } = require('../handlers/routehandler/notFound'); // fallback handler
const {parseJSON} =require('./utilties')
// ================= MODULE SCAFFOLDING =================
const handle = {};

// ================= MAIN REQUEST HANDLER =================
handle.handleReqRes = (req, res) => {
    // ---------- PARSE REQUEST ----------
    const parsedUrl = url.parse(req.url, true); // full parsed URL
    const path = parsedUrl.pathname; // e.g. "/sample"
    const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // "sample"
    const method = req.method.toLowerCase(); // get/post/put/delete
    const queryStringObject = parsedUrl.query; // query params object
    const { headers } = req; // request headers
   
    // ---------- STORE REQUEST DATA ----------
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headers,
    };

    // ---------- ROUTE MATCHING ----------
    const chosenHandler =
        typeof routes[trimmedPath] === 'function' ? routes[trimmedPath] : notFound;

    // ---------- HANDLE REQUEST BODY ----------
    const decoder = new StringDecoder('utf-8'); // for decoding buffer
    let realdata = ''; // store incoming data

    // receive data in chunks
    req.on('data', (buffer) => {
        realdata += decoder.write(buffer);
    });

    // when all data received
    req.on('end', () => {
        realdata += decoder.end(); // finalize decoding

        // attach body to request object
        requestProperties.body = parseJSON(realdata);

        // ---------- CALL ROUTE HANDLER ----------
        chosenHandler(requestProperties, (statuscode, payload) => {
            // ensure valid status code
            statuscode = typeof statuscode === 'number' ? statuscode : 500;

            // ensure payload is object
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload); // convert to JSON

            // ---------- SEND RESPONSE ----------
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statuscode);
            res.end(payloadString);
        });
    });
};

// ================= EXPORT MODULE =================
module.exports = handle;
