var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 9000;

let users=[];

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type"),
    next();
});

app.post('/user', function(req, res) {
    if(users.indexOf(req.body.user)==-1){
        users.push(req.body.user);
        res.send({color:'#'+(Math.random()*0xFFFFFF<<0).toString(16)});
    }
    else res.status(500).send({error:"Usuario ya registrado"});
});

// start the server
app.listen(port);
console.log(`Server started! At http://localhost:${port}`);