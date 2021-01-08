const http = require('http');
const https = require('https');

module.exports = {
    objSize: function (obj) {
        var size = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },

    ReturnKey: (n, h) => {
        for (var a in h) {
            for (var b in h[a]) {
                if ((h[a][b] + '').indexOf(n) > -1) {
                    return a;
                }
            }
        }
        return null;
    },

    mto: (v, i, e = '') => {
        return v.length > 1 ? i : e;
    },

    returnProperty: (a, k, d) => {
        try {
            return a[k] || d;
        } catch {
            return d;
        }
    },

    excludeProperty: (a, k) => {
        var o = {};
        if (!a) return o;
        for (var i in a) {
            if (i === k) continue;
            o[i] = a[i];
        }
        return o;
    },

    getJSON: (options, onResult) => {
        let output = '';
        const port = options.port == 443 ? https : http;
        const req = port.request(options, (res) => {
            if (options.encoding) {
                res.setEncoding(options.encoding);
            }

            res.on('data', (chunk) => {
                output += chunk;
            });

            res.on('end', () => {
                let obj;

                try {
                    obj = JSON.parse(output);
                } catch {
                    obj = output;
                }

                onResult(undefined, res.statusCode, obj, res.headers);
            });
        });

        req.on('error', (err) => {
            onResult(err);
        });

        if (options.method === 'PUT' || options.method === 'POST') {
            req.write(options.data);
        }

        req.end();
    },
};
