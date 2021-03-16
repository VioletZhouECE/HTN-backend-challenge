const app = require('./app.js');
const http = require('http');
const setup = require("./db_scripts");

//connect to and setup db
setup().then(() => {
    
    //set port
    const port = process.env.PORT || '3000';
    app.set('port', port);

    //create http server
    const server = http.createServer(app);

    //listen
    server.listen(port);
    console.log("listening on port " + port);
}
);