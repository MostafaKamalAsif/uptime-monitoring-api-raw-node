// dependancies
const { log } = require('console');
const http = require('http');
const data = require('./lib/data');
const { handleReqRes } = require('./helpers/handleReqRes');
const envionment = require('./enviornment');
// app object-module scaffolding
const app = {};

// Testing file system
// data.create('Test', 'Newfile', { name: 'Mostafa kamal', Age: '19' }, (err) => {
//     log(`Error was ${err}`);
// });
// read file system
data.read('Test', 'Newfile', (err, reasult) => {
    log(err, reasult);
});
// updated file system
data.update('Test', 'Newfile', { name: 'Omer faruk', Age: '23' }, (err) => {
    log(`Error was ${err}`);
});
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
