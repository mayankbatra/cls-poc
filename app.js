var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

var cls = require('continuation-local-storage');
cls.createNamespace('poc');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


var context = require('./context');

app.use(context.middleware);

app.get('/', function (req, res, next) {
    console.log()
    setTimeout(function () {
        var getPoc = cls.getNamespace('poc');
        res.send(getPoc.get('body'));
    }, 5000)

})


module.exports = app;
