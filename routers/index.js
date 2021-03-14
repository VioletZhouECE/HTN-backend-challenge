const path = require('path');

module.exports = (app)=>{

    app.use('/users', userRoutes);
    app.use('/skills', skillsRoute);

    // catch-all endpoint
    app.use((req, res) => {
        return res.status(404).send('wrong endpoint');
    });

    return app;
}