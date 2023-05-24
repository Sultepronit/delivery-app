"use strict";

function displayCard(src, name) {
	var card = '<div class="card"> \
		<img src="img_src"> \
		<p class="product-name">product_name</p> \
		<button class="to-cart">add to cart</button> \
		</div>';
	
	var re = card.replace('img_src', src);
	re = re.replace('product_name', name);
	$('.goods').append(re);
}

var main = function() {	
	for(var i = 0; i < 3; i ++) {
		displayCard('img/burger_0.jpg', 'Burger sushi style');
	}
	for(var i = 0; i < 3; i ++) {
		displayCard('img/borshch_0.png', 'Fantastic borshch');
	}
}

$(document).ready(main);
