                 
// Move from login page to "go" page if connection

/*$('ifthingisconnected').click(function(){
	$("#go-button").fadeIn('slow');
	$("#logout-content").appendTo("#logout-space");
});*/

// Move from login page to "go" page after logging in

//Move from "go" page to loading page    
$("#go-button").click(function(){

	loading_screen = window.pleaseWait({
		logo: "img/rekindle.png",
		backgroundColor: '#f46d3b',
		loadingHtml: "<div class='spinner'><div class='cube1'></div><div class='cube2'></div></div>"
	});

	setTimeout(function(){
		loading_screen.finish();
	},4000);
	$('.intro').fadeOut();
	$("#canvas").fadeIn();
});
