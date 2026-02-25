var connect = require('connect'),
    serveStatic = require('serve-static');

connect().use(
    serveStatic("../angular-sports")
).listen(5000);