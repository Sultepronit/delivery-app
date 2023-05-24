const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.send('<h1>Hello world!<h1>');
});

var server = app.listen(PORT, function() {
	var host = server.address().address;
	var port = server.address().port;
	//console.log('Example app listening at http://%s:%s', host, port);
	console.log(`server started on port ${PORT}`);
});
