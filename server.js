
const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    var path = req.url;
    var data = "ooooo";
    res.setHeader('Content-type', 'text/html');


    switch (path) {

        case '/dashboard':



            fs.readFile('./index.html', (err, dat) => {
                if (!err) {
                    data = dat.toString('UTF-8');
                    res.write(data);
                    res.end();
                
                
                } else {
                    data = "This page might have been moved permanetly";
                    res.write(data);
                    res.end();
                
                }
            });


            return;

            case '/about':



            fs.readFile('./about.html', (err, dat) => {
                if (!err) {
                    data = dat.toString('UTF-8');
                    res.write(data);
                    res.end();
                
                
                } else {
                    data = "This page might have been moved permanetly";
                    res.write(data);
                    res.end();
                
                }
            });


            return;

        // case '/about':

        // res.setHeader('Content-type', 'text/html');
        //  data=fs.readFile('./about.html');
        // res.write(data);
        // res.end;

        // break;

        default:
            data="404";
            break;

    }


    res.write(data);
    res.end();

});


server.listen(3000, 'localhost', () => {
    console.log('listening on 3000 localhost');
});

