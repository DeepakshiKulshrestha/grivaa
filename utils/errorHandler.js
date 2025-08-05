// Centralized error handling
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production error response
        if (err.isOperational) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
        } else {
            // Programming or unknown errors
            console.error('ERROR 💥', err);
            res.status(500).json({
                success: false,
                message: 'Something went wrong!'
            });
        }
    }
};

// Async error wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Database error handler
const handleDatabaseError = (error) => {
    if (error.code === 'ER_DUP_ENTRY') {
        return new AppError('Duplicate entry found', 400);
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return new AppError('Referenced record not found', 400);
    }
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return new AppError('Cannot delete record as it is referenced by other records', 400);
    }
    return new AppError('Database operation failed', 500);
};

// File upload error handler
const handleFileUploadError = (error) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return new AppError('File size too large', 400);
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return new AppError('Unexpected file field', 400);
    }
    return new AppError('File upload failed', 500);
};

module.exports = {
    AppError,
    globalErrorHandler,
    catchAsync,
    handleDatabaseError,
    handleFileUploadError
}; 