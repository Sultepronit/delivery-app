"use strict";

var goodsData = '';
var currentShop = '';
//var goodsInCart = {};
var goodsInCart = [];
var countGoodsInCart = 0;
var totalPrice = 0;
var currentPage = 'SHOP';

function removeFromCart(id) {
	console.log(id);
	countGoodsInCart -= goodsInCart[id];
	$('.counter').text(countGoodsInCart);
	totalPrice -= goodsInCart[id] * goodsData[currentShop][id].price;
	$('#price').text(totalPrice);
	goodsInCart[id] = 0;
	$('#c' + id).replaceWith('');
}

function quantChange(id) {
	//console.log(id);
	var newQuant = $('#q' + id).val();
	/*console.log(newQuant);
	console.log(goodsInCart[id]);*/
	countGoodsInCart += (newQuant - goodsInCart[id]);
	$('.counter').text(countGoodsInCart);
	totalPrice -= goodsInCart[id] * goodsData[currentShop][id].price;
	totalPrice += newQuant * goodsData[currentShop][id].price;
	$('#price').text(totalPrice);
	goodsInCart[id] = newQuant;
}

function displayCardInCart(src, name, price, id, quant) {
	var card = '<div class="cart-card" id="c##"> \
			<img src="img_src"> \
			<div class="details"> \
				<p class="cart-name">product_name</p> \
				<p class="cart-price">product_price</p> \
				<input class="quant" onchange="quantChange(\'##\')" \
					type="number" min="0" max="99" \
					id="q##" step="1" value="quantity"> \
				<button class="remove-product" onclick="removeFromCart(\'##\')"> \
					remove</button> \
			</div> \
		</div>';
	
	var re = card.replace('img_src', src);
	re = re.replace('product_name', name);
	re = re.replace('product_price', price + ' uah');
	re = re.replace(/##/g, id);
	re = re.replace('quantity', quant);
	$('.chosen-goods').append(re);
}

function goToCart() {
	if(!countGoodsInCart) {
		return;
	}
	
	//currentPage = 'CART';
	$('.sidebar').hide();
	$('.goods').hide();
	$('.cart').show();
	/*$('#price').text(totalPrice);
	
	var goods = goodsData[currentShop];
	for(var i = 0; i < goodsInCart.length; i++) {
		if(!goodsInCart[i]) continue;
		
		displayCardInCart('img/' + goods[i].img_src,
			goods[i].name,
			goods[i].price,
			i,
			goodsInCart[i]);
	}*/
	
}

function added(n) {
	if(goodsInCart[n]) { // already in cart!
		goToCart();
	} else { // add to cart!
		var product = goodsData[currentShop][n];
		console.log(n);
		console.log(product);
		
		goodsInCart[n] = 1;
		countGoodsInCart++;
		totalPrice += product.price*1;
		
		console.log(goodsInCart);
		console.log(countGoodsInCart);
		console.log(totalPrice);
		
		$('#price').text(totalPrice);
		$('.counter').text(countGoodsInCart);
		
		displayCardInCart('img/' + product.img_src,
			product.name, product.price, n,	1);
		
		//change button(s) style
		var id = '#' + n;
		$(id).text('go to cart');
		$(id).css('background-color', 'green');
		$(id).css('border-color', 'green');
		$(id).css('color', 'white');
		$(id).css('font-weight', 'bold');
		
		//change cart style 
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
	$('.cart').hide();
	getData();
	
	// shops
	$('#burger').on('click', function() {
		changeShop('burger');
	});
	$('#kurcha').on('click', function() {
		changeShop('kurcha');
	});
	$('#sushi').on('click', function() {
		changeShop('sushi');
	});
	
	// cart
	$('#cart').on('click', function() {
		goToCart();
	});
	
	/*$("input").change(function(){
		alert("The text has been changed.");
	});*/
}

$(document).ready(main);
