// dependancies
const { log } = require('console');
const http = require('http');
const data = require('./lib/data');
const { handleReqRes } = require('./helpers/handleReqRes');
const envionment = require('./helpers/environment');
// app object-module scaffolding
const app = {};

// Testing file system
// data.create('Test', 'Newfile', { name: 'Mostafa kamal', Age: '19' }, (err) => {
//     log(`Error is ${err}`);
// });

// updated file system
// data.update('Test', 'Newfile', { name: 'Mostafa kamal', Age: '23' }, (err) => {
//     log(`Error is ${err}`);
// });

// read file system
// data.read('Test', 'Newfile', (err, result) => {
//     log(err, result);
// });

// Deleting file system
// data.delete('Test', 'Newfile', (err) => {
//     log(`Error is ${err}`);
// });

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
