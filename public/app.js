"use strict";

var goodsData = '';
var currentShop = '';
var goodsInCart = [];
var countGoodsInCart = 0;
var totalPrice = 0;
var errorDetected = false;
var orderSended = false;

function restart() {
	orderSended = true;
	$('#cart').addClass('empty-cart');
	$('.counter').text(0);
}

function sendData(data) {
	console.log('sending!');
	var xhr = new window.XMLHttpRequest();
	xhr.open('POST', '/cart', true);
	xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	xhr.send(JSON.stringify(data));

	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			var order = xhr.response;
			console.log(order);
			$('.cart').hide();
			$('#order').text(order);
			$('.congratulation').show();
			restart();
		}
	}
}

function submit() {
	var data = {};
	$('.form').find ('.name, .email, .phone, .address').each(function() {
		data[this.name] = $(this).val();
		if($(this).val().length < 3) {
			$(this).addClass('error');
			errorDetected = true;
		} else {
			$(this).removeClass('error');
		}
	});
	console.log(data);	
	if(errorDetected) return;
	
	data.order = {shop: currentShop, totalPrice: totalPrice};
	
	for(var i = 0; i < goodsInCart.length; i++)
	{
		console.log(i + ': ' + goodsInCart[i]);
		if(!goodsInCart[i]) continue;
		data.order[i] = {
			name: goodsData[currentShop][i].name,
			price: goodsData[currentShop][i].price,
			quant: goodsInCart[i]
		};
	}
	console.log(data);	
	sendData(data);
}

function removeFromCart(id) {
	console.log(id);
	countGoodsInCart -= goodsInCart[id];
	$('.counter').text(countGoodsInCart);
	totalPrice -= goodsInCart[id] * goodsData[currentShop][id].price;
	$('#price').text(totalPrice);
	goodsInCart[id] = 0;
	
	// cart remove
	$('#c' + id).replaceWith('');
	// shop return defaults
	$('#' + id).text('add to cart');
	$('#' + id).removeClass('added-mode');
	
	// empty cart
	if(countGoodsInCart < 1) {
		$('#cart').addClass('empty-cart');
		$('.shop-name').removeClass('inaccessible-shop');
		$('.cart').hide();
		$('.attention').show();
	}
}

function quantChange(id) {
	//console.log(id);
	var newQuant = $('#q' + id).val();
	if(newQuant < 1 || newQuant > 99) {
		newQuant = 1;
		$('#q' + id).addClass('error');
	} else {
		$('#q' + id).removeClass('error');
	}
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
					type="number" min="1" max="99" \
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

function goToShop() {
	if(orderSended) {
		location.reload();
		return;
	}
	$('.cart').hide();
	$('.attention').hide();
	$('.sidebar').show();
	$('.goods').show();
}

function goToCart() {
	if(!countGoodsInCart || orderSended) return;
	
	$('.sidebar').hide();
	$('.goods').hide();
	$('.cart').show();
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
		$(id).text('in the cart');
		$(id).addClass('added-mode');
		
		//change cart style 
		if(countGoodsInCart == 1) {
			$('#cart').removeClass('empty-cart');
			
			$('.shop-name').addClass('inaccessible-shop');
			$('#' + currentShop).removeClass('inaccessible-shop');
			
			$('.submit').show();
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
	if(countGoodsInCart) return; // you can change shop only with empty cart
	
	if(currentShop) {
		$('.goods').empty();
		shopId = '#' + currentShop;
		$(shopId).removeClass('chosen-shop');
	}
	currentShop = shop;
	
	var shopId = '#' + shop;
	$(shopId).addClass('chosen-shop');
	
	var goods = goodsData[shop];
	for(var i = 0; i < goods.length; i++) {
		displayCard('img/' + goods[i].img_src, goods[i].name, goods[i].price, i);
	}
}

function showGoodsAtStart() {
	function randomFromRange(from, to) {
		return Math.round((Math.random() * (to - from)) + from);
	}
	var random = randomFromRange(1,4);
	switch(random) {
		case 1:
			changeShop('burger');
			break;
		case 2:
			changeShop('kurcha');
			break;
		case 3:
			changeShop('sushi');
			break;
		case 4:
			changeShop('borscht');
			break;
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
	// start
	$('.cart').hide();
	$('#cart').addClass('empty-cart');
	$('.attention').hide();
	$('.congratulation').hide();
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
	$('#borscht').on('click', function() {
		changeShop('borscht');
	});
	
	// cart
	$('#cart').on('click', function() {
		goToCart();
	});
	$('#shop').on('click', function() {
		goToShop();
	});
	
	$('.submit').on('click', function() {
		console.log('submit!');
		submit();
	});
	
	//form erors
	$("input").change(function(){
		if(errorDetected) {
			$('input').removeClass('error');
		}
	});
}

$(document).ready(main);
