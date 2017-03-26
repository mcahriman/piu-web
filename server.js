var express = require('express');
var app = express();
var SerialPort = require("serialport");


var port = new SerialPort("/dev/ttyUSB0", {
  baudRate: 9600
});

port.on('data', function (data) {
  console.log('Data: ' + data);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/rotate/:x-:y', function (req,res) {
   command = "T" + req.params.x + "_" + req.params.y + "\n";
   port.write(command);
   console.log(command);
   console.log(req.params);
   res.send(JSON.stringify(req.params));
});

app.get('/lon', function (req,res) {
   port.write("LON\n");
   res.send(JSON.stringify(req.params));
});

app.get('/loff', function (req,res) {
   port.write("LOFF\n");
   res.send(JSON.stringify(req.params));
});

app.listen(3000);
console.log('Listening on port 3000');
