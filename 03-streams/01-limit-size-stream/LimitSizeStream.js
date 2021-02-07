const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
    constructor(options) {
        super(options);
        this.options = options;
        this.counter = 0;
    }

    _transform(chunk, encoding, callback) {

        const { limit, objectMode } = this.options;

        this.counter += objectMode ? Buffer.byteLength(chunk, encoding) : chunk.length;

        if (this.counter > limit) {
            callback(new LimitExceededError('limit exceeded'));
        } else {
            callback(null, chunk);
        }
    }
}

module.exports = LimitSizeStream;
