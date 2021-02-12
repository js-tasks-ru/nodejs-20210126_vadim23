const url = require('url');
const fs = require('fs');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream')

const server = new http.Server();

const STREAM_ERRORS = {
    'DEFAULT': { code: 500, message: 'Error' },
    'LIMIT_EXCEEDED': { code: 413, message: 'Error' },
    'EEXIST': { code: 409, message: 'Error' },
    'NESTED_LEVEL': { code: 400, message: 'Error' },
}

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);

    const errorHandler = (errorCode = 'DEFAULT', removeFile = true) => {
        const { code, message } = STREAM_ERRORS[errorCode] ?? STREAM_ERRORS.DEFAULT;
        res.statusCode = code;
        if (removeFile) {
            fs.unlink(filepath, () => {
                res.end(message);
            })
        } else {
            res.end(message);
        }
    }

    if (pathname.indexOf('/') !== -1) {
        errorHandler('NESTED_LEVEL', false)
        return;
    }

    switch (req.method) {
        case 'POST':

            const limitStream = new LimitSizeStream({ limit: 1024 * 1024 });
            const writeStream = fs.createWriteStream(filepath, { flags: 'wx' });

            req.pipe(limitStream).pipe(writeStream)

            req
                .on('error', errorHandler)
                .on('aborted', errorHandler);

            limitStream.on('error', (error) => errorHandler(error.code));
            writeStream
                .on('error', (error) => errorHandler(error.code, false))
                .on('finish', function() {
                    res.statusCode = 201;
                    res.end('200');
                });

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
