const url = require('url');
const fs = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

const STREAM_ERRORS = {
    'DEFAULT': { code: 500, message: 'Error' },
    'ENOENT': { code: 404, message: 'Error' },
    'NESTED_LEVEL': { code: 400, message: 'Error' },
}

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);

    const errorHandler = (errorCode = 'DEFAULT') => {
        const { code, message } = STREAM_ERRORS[errorCode] ?? STREAM_ERRORS.DEFAULT;
        res.statusCode = code;
        res.end(message);
    }

    if (pathname.indexOf('/') !== -1) {
        errorHandler('NESTED_LEVEL', false)
        return;
    }

    switch (req.method) {
        case 'DELETE':
            fs.unlink(filepath, (error) => {
                if (error) {
                    errorHandler(error.code)
                }
                res.statusCode = 200;
                res.end();
            })
            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
