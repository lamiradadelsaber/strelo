const net = require('net')

process.on('uncaughtException', (err) => {
    console.error('Error FATAL: ' + err.message);
    process.exit(1);
})

const test = async () => {

    console.time('test')
    new Array(200000).fill(0).map(a=>{
        var s = net.Socket();
        s.connect(8080, 'localhost');
        s.write('GET /img/17978723-0101.jpg HTTP/1.1\n\n');
        s.end();
    });
    console.timeEnd('test')
}

test()
