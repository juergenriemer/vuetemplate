const net = require('net');

const Ping = {
    test(port, host, cb) {
        const error = (e, key) => e[key] || e.toString().substring(0, 20);
        try {
            net.createConnection(port, host).on("connect", e => {
                cb({
                    ok: true
                });
            }).on("error", e => {
                cb({
                    ok: false
                    , error: error(e, "errno")
                })
            });
        } catch (e) {
            cb({
                ok: false
                , error: error(e, "code")
            })
        }
    }
}

module.exports = Ping;