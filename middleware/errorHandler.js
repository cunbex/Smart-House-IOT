const errorHandler = (err, req, res, next) => {
    if (err.stack) {
        console.error(err.stack);
    }
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        status,
        message: err.message || 'Something went wrong',
        stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    });
};

module.exports = errorHandler;
