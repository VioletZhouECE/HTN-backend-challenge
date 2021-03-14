const path = require('path');
const userRoute = require('./users');
const skillsRoute = require('./skills');

module.exports = (app)=>{

    app.use('/users', userRoute);
    app.use('/skills', skillsRoute);

    // catch-all endpoint
    app.use((req, res) => {
        return res.status(404).send('wrong endpoint');
    });

    return app;
}