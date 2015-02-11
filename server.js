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

// Performance.
app.get('/timing', function(req, res) {

  res.render('timing.html');

});

// Ad Block.
app.get('/ad-block', function(req, res) {

  res.render('adblock.html');

});

// Ad Block Error.
app.get('/ad-block-error', function(req, res) {

  res.render('adblock-error.html');

});

// Ad Block Error.
app.get('/ad-block-ajax', function(req, res) {

  res.render('adblock-ajax-detect.html');

});

// Ad Scaling.
app.get('/ad-scaling', function(req, res) {

  res.render('ad-scaling.html');

});

// Ad Block in MPS.
app.get('/ad-loaded', function(req, res) {

  res.render('ad-loaded.html');

});

// Ad Block Fandango Component Detection.
app.get('/adblock-fandango', function(req, res) {

  res.render('adblock-fandango.html');

});

// Error Tracking.
app.get('/error-tracking', function(req, res) {

  res.render('error-tracking.html');

});

// iFrame Integration.
app.get('/iframe', function(req, res) {

  res.render('iframe.html');

});

// Detect Display.
app.get('/detect-display', function(req, res) {

  res.render('detect.html');

});

// Ad Block Callback.
app.get('/adblock-callback', function(req, res) {

  res.render('adblock-callback.html');

});

// Fandango.
app.get('/fandango', function(req, res) {

  res.render('fandango.html');

});

// JS Tree.
app.get('/jstree', function(req, res) {

  res.render('jstree.html');

});

/***** APIs *****/
// Webpagetest API.
app.get('/api/site/', function(req, res) {

  wpt.runTest(req.query.url, function(err, data) {
    res.json({ urls: data, errors: err });
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