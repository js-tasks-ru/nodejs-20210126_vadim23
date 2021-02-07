const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
    constructor(options) {
        super(options);
        this.buffer = '';
    }

    _transform(chunk, encoding, callback) {
        this.buffer += chunk.toString();

        if (this.buffer.indexOf(os.EOL) !== -1) {
            const lines = this.buffer.split(os.EOL);
            this.buffer = lines.pop();
            lines.map(data => this.push(data));
        }

        callback();
    }

    _flush(callback) {
        if (this.buffer) {
            this.push(this.buffer)
        }
        callback()
    }
}

module.exports = LineSplitStream;
