var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

var fs = require("fs");
var handlebars = require("handlebars");
var WebPageTest = require('webpagetest');

// Web Page Test - API key.
var wpt = new WebPageTest('www.webpagetest.org', 'A.7c407efa32ff3142c53dad9e242269aa');

/*var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 5000;*/

var router = express.Router();

app.use(router);

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img", express.static(__dirname + '/img'));

var hbs = require('hbs');

app.engine('hbs', hbs.__express);
app.engine('html', hbs.__express);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.localsAsTemplateData(app);

/***** Views *****/
// Homepage.
app.get('/', function(req, res) {

  res.render('index.html');

});

// Har page.
app.get('/timing', function(req, res) {

  res.render('timing.html');

});

/***** APIs *****/
// Webpagetest API.
app.get('/api/site', function(req, res) {

  wpt.runTest('http://nbcnews.com', {location: 'ec2-us-west-1'}, function(err, data) {
    res.json({ urls: data });

  });

});

/**** DEMO with handlebars functionality *****/
/*app.get('/test', function(req, res) {
  res.render('test.html', {
    message: 'Homepage!'
  });
});*/
/**** /DEMO with handlebars functionality *****/

/***** Start App *****/
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 5000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});