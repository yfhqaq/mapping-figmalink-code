const http = require('http');
const https = require('https');
const fs = require('fs');

const cookiePath = './cookie.txt';
const protocol = 'https:';
const hostname = 'sso.dev.spotterio.com';
// const validate_path = '/spotter-guard-web/validate';
// http://api.dev.spotterio.com/spotter-guard-web/validate/v2
const validate_path = '/spotter-guard-web/validate/v2';
// const login_path = '/spotter-guard-web/user/login';
const login_path = '/sso/login-by-email';
const APP_CODE = 'gmesh';

const parseCookie = (cookies) => {
    const cookie_array = [];

    for (let cookie_str of cookies) {
        cookie_array.push(cookie_str.split(';')[0]);
    }

    return cookie_array.join('; ');
};

function parseUrlParams(url) {
    const params = {};
    const urlParts = url.split('?');

    if (urlParts.length > 1) {
        const queryString = urlParts[1];
        const pairs = queryString.split('&');

        pairs.forEach((pair) => {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
    }

    return params;
}

function getCookie() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            email: 'admin@spotterio.com',
            password: 'MTExMTEx',
            appCode: APP_CODE,
        });

        const options = {
            hostname,
            port: 443,
            path: login_path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            resolve(parseCookie(res.headers['set-cookie']));
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

function getTicket(cookie) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname,
            port: 443,
            path: `/sso/auth?redirect=http%3A%2F%2Fgmesh.dev.spotterio.com%2Ffinance%2Fmonth&appCode=${APP_CODE}`,
            method: 'GET',
            headers: {
                Cookie: cookie,
            },
        };

        const req = https.request(options, (res) => {
            resolve(parseUrlParams(res.headers['location'])?.spotter_sso_ticket);
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
}

function getToken(ticket) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            ticket,
            appCode: APP_CODE,
        });

        const options = {
            hostname,
            port: 443,
            path: '/sso/client/doLoginByTicket',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';

            // 当接收到数据时，将数据拼接到变量data中
            res.on('data', (chunk) => {
                data += chunk;
            });

            // 当请求完成时，输出响应数据
            res.on('end', () => {
                const token = JSON.parse(data)?.data?.token ?? '';
                resolve(token);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

function getValidate(cookie) {
    console.log('Validate Cookie =', cookie);
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.dev.spotterio.com',
            port: 80,
            path: validate_path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-app': APP_CODE,
                'Authentication-Token': cookie,
            },
        };

        const req = http.request(options, (res) => {
            let data = '';

            // 当接收到数据时，将数据拼接到变量data中
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.setEncoding('utf8');
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });

        req.on('error', (e) => {
            // console.error(`problem with request: ${e.message}`);
            reject(e);
        });

        // Write data to request body
        req.end();
    });
}

function check() {
    if (!fs.existsSync(cookiePath)) {
        // 文件不存在的时候创建一个空文件
        fs.writeFileSync(cookiePath, '', 'utf-8', (err) => {
            if (err) throw err;
            console.log('Cookie 更新成功!');
        });
    }
    const myAppSessionValidationCookie = fs.readFileSync(cookiePath, 'utf8');
    getValidate(myAppSessionValidationCookie).then((res) => {
        if (res.code !== 200) {
            console.log(`Token: ${myAppSessionValidationCookie} 过期了! 正在重新获取!`);
            getCookie().then((cookie) => {
                getTicket(cookie).then((ticket) => {
                    getToken(ticket).then((token) => {
                        console.log(
                            `Token Update: '${myAppSessionValidationCookie}' -> '${token}'`,
                        );
                        fs.writeFileSync(cookiePath, token, 'utf-8', (err) => {
                            if (err) throw err;
                            console.log('Cookie 更新是失败!');
                        });
                    });
                });
            });
        } else {
            console.log(`Token: ${myAppSessionValidationCookie} 验证成功!`);
        }
    });
}

const auth = function () {
    console.log('Auth 启动成功');
    process.send('Hey! Auth 启动成功');
    check();
    // 10 分钟检查一次是否正常运行
    setInterval(
        () => {
            check();
        },
        1000 * 60 * 10,
    );
};

auth();
