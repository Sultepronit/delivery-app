const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = process.env.PORT || 3030;

var goodsDb = {};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

fs.readFile('./db/goods.json', 'utf8', function(err, data) {
	goodsDb = JSON.parse(data);
	console.log(goodsDb);
});

var server = app.listen(PORT, function() {
	console.log(`server started on port ${PORT}`);
});

app.get('/', function(req, res) {
	res.send('<h1>Hello world!<h1>');
});


