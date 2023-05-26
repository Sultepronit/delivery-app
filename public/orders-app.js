'use strict';

var ordersDb = [];

function display() {
	//console.log('here!');
	//console.log(ordersDb.length);
	for(var i = 0; i < ordersDb.length; i++) {
		var $data = $('<div class="order">');
		
		var $number = $('<p class="number">').text(i + 1);
		
		var $client = $('<div class="personal">');
		$client.append($('<p>').text(ordersDb[i].name));
		$client.append($('<p>').text(ordersDb[i].email));
		$client.append($('<p>').text(ordersDb[i].phone));
		$client.append($('<p>').text(ordersDb[i].address));
		$client.append($('<p class="solid">').text(ordersDb[i].order.shop));
		
		var orderArray = Object.values(ordersDb[i].order);
		//console.log(orderArray);
		
		var $order = $('<table>');
		var header = '<tr><th>name</th><th>count</th><th>price</th></tr>';
		//$order.append($('<tr>').append(header));
		$order.append(header);
		for(var j = 0; j < (orderArray.length - 2); j++) {
			var $row = $('<tr>');
			$row.append($('<td>').text(orderArray[j].name));
			$row.append($('<td>').text(orderArray[j].quant));
			$row.append($('<td>').text(orderArray[j].price));
			$order.append($row); 
		}
		var last = '<tr><td></td><td></td><td><b>' + ordersDb[i].order.totalPrice + '</b></td></tr>';
		$order.append(last);
		
		$data.append($number);
		$data.append($client);
		$data.append($order);
		
		$('main').append($data);
	}

}

function getData() {
	var xhr = new XMLHttpRequest();
    xhr.open("GET", '/orders', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
			ordersDb = JSON.parse(xhr.response);
			console.log(ordersDb);
			display();
        }
    };
    try { xhr.send(); } catch (err) {console.log(err) }
}

var main = function() {	
	getData();
}

$(document).ready(main);
