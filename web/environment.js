exports.getEnvironment = () => {
    if (process.env.NODE_ENV === 'production')
        return {
            server: {
                'msg': 'Strelo Server v0.1 Beta',
                'port': 8080,
                'icons': 'Google icons server',
                'images': 'Google images server',
                'html': 'Google frontend',
            },
            cache: {
                'iconMaxAge': '604800',  // 7 days in cache = 604800 seg
                'imageMaxAge': '86400',  // 1 day in cache = 86400 seg
                'htmlMaxAge': '3600',  // 1 hour in cache = 3600 seg
            },
            mongo: {
                url: 'mongodb://nextuser:pwd4nextuser@peslmnomona01.es.corp.leroymerlin.com:27017,peslmnomona02.es.corp.leroymerlin.com:27017,peslmnomona03.es.corp.leroymerlin.com:27017/pnext?replicaSet=peslmnomona',
                bd: 'pnext'
            },
            version: require('./package.json').version
        }
    else
        return {
            server: {
                'msg': 'Strelo Server v0.1 Beta',
                'port': 8080,
                'icons': 'Google icons server',
                'images': 'Google images server',
                'html': 'Google frontend',
            },
            cache: {
                'iconMaxAge': '604800',  // 7 days in cache = 604800 seg
                'imageMaxAge': '86400',  // 1 day in cache = 86400 seg
                'htmlMaxAge': '3600',  // 1 hour in cache = 3600 seg
            },
            mongo: {
                url: 'mongodb://nextuser:pwd4nextuser@peslmdbnext01:27017,peslmdbnext02:27017,peslmdbnext03:27017/pnext?replicaSet=peslmdbnext',
                bd: 'pnext'
            },
            version: require('./package.json').version
        }
}