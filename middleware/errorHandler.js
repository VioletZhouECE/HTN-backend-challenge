//error handler used in development
module.exports = (err, req, res, next) => {
    if (!err.status || !err.message){
        err.status = 500;
        err.message = "Server error";
    }

    res.status(err.status);

    //send error message
    res.json({
        message: err.message
      });

    console.log("An error occurred!")
    console.log("Error message: " + err.message);
    console.log("Stack trace: " + err.stack);
    console.log(err);
}