const http = require('http')
const router = require('routes')()
const env = require('./environment').getEnvironment()
const svg = require('./assets/svg')
const cachePage = require('./cache/page')
const cacheImg = require('./cache/image')
const security = require('./security/banned')

process.on('uncaughtException', (err) => {
    console.error('Error FATAL: ' + err.message);
    process.exit(1);
})

router.addRoute('GET /favicon.ico', async (req, res, params) => {
    res.setHeader('server', env.server.icons);
    res.setHeader('cache-control', 'public, max-age=' + env.cache.iconMaxAge);
    res.writeHead(200, { 'Content-Type': 'image/x-icon; charset=utf8' });
    res.end();
})

router.addRoute('GET /img/:text', async (req, res, params) => await cacheImg.getImage(req, res, params.text))

router.addRoute('GET /product/:text', async (req, res, params) => await cachePage.getPage(req, res, params.text))

const replyError = async (code, res) => {
    if (!res.finished){
        res.setHeader('server', env.server.images);
        res.setHeader('cache-control', 'public, max-age=' + env.cache.imageMaxAge);
        res.writeHead(code, { 'Content-Type': 'image/svg+xml; charset=utf-8' });
        res.end(svg.svgBug);
    }
}

const getBody = (req, res, cb) => {
    let body = '';
    req.on('data', (data) => body += data)
    req.on('end', () => {
        try {
            cb(body ? JSON.parse(body) : undefined)
        } catch (error) {
            replyError(400, res)
        }
    })
}

const server = http.createServer((req, res) => {
    try {
        if (!security.isBanned(req)){
            let m = router.match(req.method + ' ' + req.url)
            if (m) getBody(req, res, body => {
                req.body = body
                m.fn(req, res, m.params).catch(e => {
                    replyError(204, res)
                })
            })
            else {
                replyError(404, res)
            }
        }
        else {
            if (!res.finished) replyError(404, res)
        }
    } catch (error) {
        if (!res.finished) res.end();
    }
})

cachePage.init();
cacheImg.init();

server.setTimeout(10000)
server.headersTimeout=2000
server.keepAliveTimeout=5000
server.maxHeadersCount=50
server.listen(env.server.port);

console.log(env.server.msg)
console.log('Port: ' + env.server.port + ' Timeout: ' + server.timeout + ' Header Timeout: ' + server.headersTimeout + ' Keep Alive Timeout: ' + server.keepAliveTimeout);
console.log('Max. Listeners: ' + server.getMaxListeners() );
