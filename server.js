const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = process.env.PORT || 3030;

var goodsDb = {};
var goodsJson = '';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

fs.readFile('./db/goods.json', 'utf8', function(err, data) {
	goodsJson = data;
	/*goodsDb = JSON.parse(data);
	console.log(goodsDb);*/
});

var server = app.listen(PORT, function() {
	console.log(`server started on port ${PORT}`);
});

app.get('*', function(req, res) {
	console.log(req.url);
	if(req.url == '/data') {
		//res.send('<h1>Hello world!<h1>');
		res.send(goodsJson);
	}
});

app.post('/cart', function (req, res) {
	var lastOrder = req.body;
	console.log(lastOrder);
	fs.readFile('./db/orders.json', 'utf8', function(err, data) {
		var orders = JSON.parse(data);
		orders.push(lastOrder);
		console.log('Order number: ' + orders.length);
		var json = JSON.stringify(orders, null, 1);
		fs.writeFile('./db/orders.json', json, function(err){console.log('db updated!');});
		
		res.send('Success!');
		//return res.end('done');
		return res.end();
	});
	
});


