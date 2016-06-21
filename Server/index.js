var express = require('express');
var multer  = require('multer');
var apks = multer({dest: 'apks/'});
var gcm = require('node-gcm');
var bodyParser = require('body-parser')

var sender = new gcm.Sender('AIzaSyBzhEqZ8Bsa14lHlLe_NU8qOk2qqzODv6E');
var regTokens = [];

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post('/apk',apks.single('apk'), function(req,res,next){
	console.log(req.file);
	var message = new gcm.Message({
    	data: { filename: req.file.filename }
	});

	sender.send(message, { registrationTokens: regTokens }, 
		function (err, response) {
			if(err) 
				console.error(err);
			else 	
				console.log(response);
		});
	res.send(req.file);
});

app.post('/register',function(req,res){
	console.log(req.body);
	var token = req.body.token;
	console.log("register token "+token);
	regTokens.push(token);
	res.send(JSON.stringify({response:"OK"}));
});

app.listen(5000, function(){
	console.log('app started');
});

app.use(express.static('apks'));

