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

/***** Views *****/
// Homepage.
app.get('/', function(req, res) {

  var template = fs.readFileSync("views/index.html", "utf8");

  // handlebars data, optional.
  var source = {
    message : "Homepage!"
  };

  var pageBuilder = handlebars.compile(template);
  var pageText = pageBuilder(source);
  res.writeHead(200, {"Context-Type": "text/html"});
  res.write(pageText);
  res.end();

});

// Har page.
app.get('/timing', function(req, res) {

  var template = fs.readFileSync("views/timing.html", "utf8");

  // handlebars data, optional.
  var source = {
    message : "Homepage!"
  };

  var pageBuilder = handlebars.compile(template);
  var pageText = pageBuilder(source);
  res.writeHead(200, {"Context-Type": "text/html"});
  res.write(pageText);
  res.end();

});

/***** APIs *****/
// Webpagetest API.
app.get('/api/site', function(req, res) {

  wpt.runTest('http://nbcnews.com', function(err, data) {
    res.json({ urls: data });

  });

});

/***** Start App *****/
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 5000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});