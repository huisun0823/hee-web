$(document).ready(function(){
        setTimeout(function() {
                //jQuery('.loading').css('display', 'block');
                $(".loading").fadeIn(30);
        },500);
});



$(window).on('load', function(){
  //ページ全体が読み込まれた時の処理
  	setTimeout(function() {
	    $(".loading").fadeOut(300);
	    $("#home").fadeIn(1000);
    },2500);
});