"use strict";
var goodsData = '';
var currentShop = '';
//var goodsInCart = {};
var goodsInCart = [];
var countGoodsInCart = 0;

function added(n) {
	console.log(n);
	console.log(goodsData[currentShop][n]);
	
	if(goodsInCart[n]) { // already in cart!
		
	} else { // add to cart!
		goodsInCart[n] = 1;
		countGoodsInCart++;
		console.log(goodsInCart);
		console.log(countGoodsInCart);
		
		$('.counter').text(countGoodsInCart);
		
		//change button(s)
		var id = '#' + n;
		$(id).text('go to cart');
		$(id).css('background-color', 'green');
		$(id).css('border-color', 'green');
		$(id).css('color', 'white');
		$(id).css('font-weight', 'bold');
		
		//change cart 
		if(countGoodsInCart == 1) {
			/*$('#cart').css('color', 'green');*/
			$('#cart').css('font-weight', 'bold');
		}
	}
}

function displayCard(src, name, price, id) {
	var card = '<div class="card"> \
		<img src="img_src"> \
		<p class="product-name">product_name</p> \
		<P class="product-price">product_price</p> \
		<button class="to-cart" onclick="added(##)" id="##">add to cart</button> \
		</div>';
	
	var re = card.replace('img_src', src);
	re = re.replace('product_name', name);
	re = re.replace('product_price', price + ' uah');
	re = re.replace(/##/g, id);
	$('.goods').append(re);
}

function changeShop(shop) {
	if(currentShop) {
		$('.goods').empty();
		shopId = '#' + currentShop;
		$(shopId).css('background-color', 'inherit');
		$(shopId).css('color', 'inherit');
	}
	currentShop = shop;
	
	var shopId = '#' + shop;
	$(shopId).css('background-color', 'red');
	$(shopId).css('color', 'white');
	
	var goods = goodsData[shop];
	for(var i = 0; i < goods.length; i++) {
		displayCard('img/' + goods[i].img_src, goods[i].name, goods[i].price, i);
	}
}

function showGoodsAtStart() {
	changeShop('burger');
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
	
	$('#burger').on('click', function() {
		changeShop('burger');
	});
	
	$('#kurcha').on('click', function() {
		changeShop('kurcha');
	});
	
	$('#sushi').on('click', function() {
		changeShop('sushi');
	});
}

$(document).ready(main);
