$(document).ready(function($) {
	/* scroll animation */
	$("a.scroll-to-target").click(function() {
		var url = $(this).attr("href");
		var target = $(url);
		$('html,body').animate({
			scrollTop: target.offset().top}, 500
		);
		return false;
	});   
	
	
	/* peel animation */   
	$("#peel").hover(function(){
		// when mouse cover, stop acting animation and enlarge pic in 500ms
		$("a img, a .peelBody", this).stop().animate({
				width: 500,
				height: 500
			}, 500);

	}, function(){	
		// when mouse leave, stop acting animation and recovery pic in 200ms
		$("a img, a .peelBody", this).stop().animate({
				width: 100,
				height: 100
			}, 200);
		timer = setTimeout(fish, 2000);
	});

	var speed = 1000;
	function fish(){
		// check mouse cover or not
		var width = $("#peel a img").width();
		if(width > 150)
			return;
		width = width > 0 ? 0 : 150;

		$("#peel a img, #peel a .peelBody").animate({
			width: width,
			height: width
		}, 700);
		timer = setTimeout(fish, speed);
	}

	timer = setTimeout(fish, 2000);
	
});