//error handler used in development
module.exports = (err, req, res, next) => {
    //for debugging
    console.log(err);

    if (!err.status || !err.message){
        err.status = 500;
        err.message = "Server error";
    }

    res.status(err.status);

    //send error message
    res.json({
        message: err.message
      });
}