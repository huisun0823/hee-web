$(function(){

	var isHome = false;

    $(document).on('click', '.pj', function(e){

    	e.preventDefault();
    	//console.log('click');
        let href = $(this).attr('href');

        if( $(this).hasClass('home') ){
			isHome = true;
        }

        $('#main').animate({
        	/*width : "0%",*/
        	/*top : 1000,*/
		    opacity : 0
		  }, 'slow', function() {

		  	e.preventDefault();
        	$.pjax( {
	            url: href,
	            container: '#main',
	            fragment: '#main',
	            timeout : 1000
	        }); 

        });


    });


    

    $(document).on('pjax:end', function() {

    	if(isHome){

    		$('#home').css('animation', 'removeBlur 1s both');
    		isHome = false;

    	}else{

    		 $('#home').css('animation', 'blurEffect 1s both');
    		 setTimeout(function(){
    		 	$('#home').css('filter', 'blur(30px)');
    		 },1500);

			$('#main').animate({
				/*width : "100%",*/
				/*top : 0,*/
				opacity : 1,
			}, 'slow');

		}

	});


});