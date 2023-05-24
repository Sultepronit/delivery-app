"use strict";
var goodsData = '';

function displayCard(src, name, price) {
	var card = '<div class="card"> \
		<img src="img_src"> \
		<p class="product-name">product_name</p> \
		<P class="product-price">product_price</p> \
		<button class="to-cart">add to cart</button> \
		</div>';
	
	var re = card.replace('img_src', src);
	re = re.replace('product_name', name);
	re = re.replace('product_price', price + ' uah');
	$('.goods').append(re);
}

function showGoodsAtStart() {
	var currentShop = goodsData["Burger Hetman"];
	//console.log(
	for(var i = 0; i < currentShop.length; i++) {
		displayCard('img/' + currentShop[i].img_src, currentShop[i].name, currentShop[i].price);
	}
}

function getData() {
	var xhr = new XMLHttpRequest();
    xhr.open("GET", '/data', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        	//console.log(xhr.response);
			goodsData = JSON.parse(xhr.response);
			console.log(goodsData);
			showGoodsAtStart();
        }
    };
    try { xhr.send(); } catch (err) {console.log(err) }
}

var main = function() {	
	getData();
	
	/*for(var i = 0; i < 3; i ++) {
		displayCard('img/burger_0.jpg', 'Burger sushi style');
	}
	for(var i = 0; i < 3; i ++) {
		displayCard('img/borshch_0.png', 'Fantastic borshch');
	}*/
}

$(document).ready(main);
