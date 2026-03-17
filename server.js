const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 8081;

const server = http.createServer((req, res) => {
    const requestPath = decodeURIComponent(req.url);
    let filePath = path.join(
        __dirname,
        requestPath === '/' ? 'index.html' : requestPath
    );

    const extname = path.extname(filePath);

    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.glb':
        case '.gltf':
            contentType = 'model/gltf-binary';
            break;
        case '.mp3':
            contentType = 'audio/mpeg';
            break;
        case '.ogg':
        case '.wav':
            contentType = 'audio/' + (extname === '.ogg' ? 'ogg' : 'wav');
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
                console.log(`Файл не найден: ${filePath}`);
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
                console.error(err);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    const ipAddress = getIPAddress();
    console.log(`Pizza Collector: http://localhost:${PORT}`);
    console.log(`В сети: http://${ipAddress}:${PORT}`);
});

function getIPAddress() {
    const interfaces = require('os').networkInterfaces();
    for (const interfaceName in interfaces) {
        const iface = interfaces[interfaceName];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1';
}
