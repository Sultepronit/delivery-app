const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = process.env.PORT || 3030;

var goodsJson = '';
var orders = '';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

fs.readFile('./db/goods.json', 'utf8', function(err, data) {
	goodsJson = data;
});

fs.readFile('./db/orders.json', 'utf8', function(err, data) {
	orders = JSON.parse(data);
});

var server = app.listen(PORT, function() {
	console.log(`server started on port ${PORT}`);
});

app.get('*', function(req, res) {
	console.log(req.url);
	if(req.url == '/data') {
		res.send(goodsJson);
	} else if(req.url == '/orders') {
		var json = JSON.stringify(orders, null, 1);
		res.send(json);
	}
});

app.post('/cart', function (req, res) {
	var lastOrder = req.body;
	console.log(lastOrder);

	orders.push(lastOrder);
	console.log('Order number: ' + orders.length);
	var json = JSON.stringify(orders, null, 1);
	fs.writeFile('./db/orders.json', json, function(err){console.log('db updated!');});
	
	res.send(orders.length + '');
	return res.end();
	
});


