
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

$("#again").click(function(){

	loading_screen = window.pleaseWait({
		logo: "img/rekindle.png",
		backgroundColor: '#f46d3b',
		loadingHtml: "<div class='spinner'><div class='cube1'></div><div class='cube2'></div></div>"
	});

	setTimeout(function(){
		loading_screen.finish();
	},4000);

	$("#again,#reconnect").fadeOut();
	$(".cover-heading").text("Relive your Kodak Moments")
    $("#main-text").text("A platform to help you reconnect with friends. Solve the puzzle to rediscover a random moment from your past! Then ReKindle with your tagged contacts!");
});