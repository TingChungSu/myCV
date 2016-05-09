$(document).ready(function($) {
	/* scroll animation */
	$("a.scroll-to-target").click(function() {
		var url = $(this).attr("href");
		var target = $(url);
		$('html,body').animate({
			scrollTop: target.offset().top}, 200
		);
		return false;
   });   
});