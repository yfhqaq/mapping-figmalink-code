const { fork } = require('child_process');
const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const ip = require('ip');
const cors = require('cors');
const proxy = require('http-proxy-middleware');
const path = require('path');

const app = express();
const sender = fork(__dirname + '/auth.js');

sender.on('message', (msg) => {
    console.log(msg);
});

app.engine('.html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

const cookiePath = './cookie.txt';
let myAppSessionValidationCookie = fs.existsSync(cookiePath)
    ? fs.readFileSync(cookiePath)
    : fs.writeFileSync(cookiePath, '', 'utf-8');

fs.watchFile(cookiePath, (cur, prv) => {
    if (cookiePath) {
        // 根据修改时间判断做下区分，以分辨是否更改
        if (cur.mtime != prv.mtime) {
            console.log(`Cookie updated at ${cur.mtime.toLocaleString()}`);
            myAppSessionValidationCookie = fs.readFileSync(cookiePath);
        }
    }
});

app.set('port', '6005');

const httpProxy = proxy.createProxyMiddleware('/api', {
    target: 'http://api.dev.spotterio.com',
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: { '^/api': '' },
    onProxyReq: function (proxyReq) {
        if (myAppSessionValidationCookie) {
            proxyReq.setHeader('Authentication-Token', myAppSessionValidationCookie);
            proxyReq.setHeader('x-app', 'gmesh');
        }
    },
});

app.use(express.static(path.join(__dirname, 'storybook-static')));
app.use(httpProxy);
app.use(cors());

const getParams = () => ({
    locals: {
        applicationBootData: {
            app: {
                apiUrl: process.env.apiUrl || `http://${ip.address()}:${app.get('port')}/api`,
                code: 'gmesh',
                name: 'Spotter',
            },
        },
    },
});

app.get('/', function (req, res) {
    res.render('index', getParams());
});

app.get(['/iframe', '/iframe.html'], function (req, res) {
    res.render('iframe', getParams());
});

app.listen(app.get('port'), () => {
    console.log(`反向代理已开启，Listen：http://${ip.address()}:${app.get('port')}`);
});
