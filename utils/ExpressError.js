class ExpressError extends Error {
    constructor (message, statusCode, stack='Null Stack') {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.stack = stack;
    }
}

module.exports = ExpressError;