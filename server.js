const app = require('./app.js');
const http = require('http');

//set port
const port = process.env.PORT || '3000';
 app.set('port', port);

//create http server
const server = http.createServer(app);

//listen
server.listen(port);
console.log("listening on port " + port);