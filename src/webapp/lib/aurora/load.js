$(document).ready(function() { 
$('.chart-tabs-tabs a').click(function(){
	switch_tabs($(this));
});

switch_tabs($('.defaulttab'));
//select all the a tag with name equal to modal
$('button[name=modal],div[name=modal]').click(function(e) {
	//Cancel the link behavior
	e.preventDefault();
	
	//Get the A tag
	var id = $(this).attr('id');

	//Get the screen height and width
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();

	//Set heigth and width to mask to fill up the whole screen
	$('#mask').css({'width':maskWidth,'height':maskHeight});
	
	//transition effect		
	$('#mask').fadeIn(200);	
	$('#mask').fadeTo("slow",0.8);	

	//Get the window height and width
	var winH = $(window).height()+2*$(window).scrollTop();
	var winW = $(window).width();
		  
	//Set the popup window to center
	$(id).css('top',  winH/2-$(id).height()/2);
	$(id).css('left', winW/2-$(id).width()/2);

	//transition effect
	$(id).fadeIn(500);
});


//if close button is clicked
$('.window .close').click(function (e) {
	e.preventDefault();
	
	$('#mask').hide();
	$('.window').hide();
});		

//if mask is clicked
$('#mask').click(function () {
	$(this).hide();
	$('.window').hide();
});

});    

function switch_tabs(obj) {
$('.chart-tabs-tab-content').hide();
$('.chart-tabs-tabs a').removeClass("selected");
var id = obj.attr("rel");

$('#'+id).show();
obj.addClass("selected");
} 
