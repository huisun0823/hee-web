$(function(){

	var isHome = false;

  $(document).on('click', '.pj', function(e){

  	e.preventDefault();
  	//console.log('click');
    let href = $(this).attr('href');

    //if( $(this).hasClass('home') ){
	 //  isHome = true;
   // }

    $('#main').animate({
	    opacity : 0
	  }, 'slow', function() {

	  	e.preventDefault();
    	$.pjax( {
          url: href,
          container: '#main',
          fragment: '#main',
          timeout : 1000,
            load : { script: true } //書き換えたコンテンツに記載されているインラインスクリプトを実行
      }); 

    });


  });


    

  $(document).on('pjax:end', function() {

  	pageCheck();

  });

  $(document).ready( function(){
  // ページ読み込み時に実行したい処理
    pageCheck();
  });

    


  const PageEvents = {
      home: () => {

         removeBlur();
      },
      profile: () => {
        blurEffect();
          // ページ1の時にのみ実行したい処理
          if( document.querySelector('#contents .lazy') ){
              // 省略
          }
          if( document.querySelector('#contents .modal') ){
              // 省略
          }

      },
      works: () => {
        blurEffect();
          /*
          $('.grid').masonry({
              // options
              itemSelector: '.grid-item',
              columnWidth: '.grid-sizer'               
          });
          */

          var $grid = $('.grid').imagesLoaded( function() {
            // init Masonry after all images have loaded
            $grid.masonry({
              // options...
              itemSelector: '.grid-item',
              columnWidth: '.grid-sizer'
            });
          });

          $(document).ready(function() {
              $(".fancybox").fancybox({
                scrolling:"no"
              });

              $(".main-slider").on("init", function(slick){
                // スライダーオブジェクトを取得
                slick = $(slick.currentTarget);
                // iframeの埋め込み動画の表示サイズと位置を決定
                resizePlayer(iframes, 16/9);
              });
              $(".main-slider").slick({
                  autoplaySpeed: 4000,  // スライド表示時間
                  speed: 600,  // スライドの切り替え時間
                  // バックグラウンドでスライド画像をロード
                  arrows: false,
                  dots: true
              });
              
           });

      },
      elseFunc: () => {
          // それ以外の時にのみ実行したい処理
      }

  }

  function removeBlur(){
    $('#home').css('animation', 'removeBlur 1s both');

  }
  function blurEffect(){
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
/*
    function pagecheck(){
        if( document.getElementById('profile') ){
            PageEvents.profile();
        }else if( document.getElementById('works') ){
            PageEvents.works();
            
        }else{
            PageEvents.elseFunc();

        }
        PageEvents.commonFunc();
    }
*/
  function pageCheck(){
    const url = location.href;
    if( /index/.test(url) ){
        PageEvents.home();
        console.log(url);
    }else if( /profile/.test(url) ){
        PageEvents.profile();
        console.log(url);
    }else if( /works/.test(url) ){ 
        PageEvents.works();
        console.log(url);
    }else{
        console.log(url);
    }
  }

  function resizePlayer(iframes, ratio) {
    if (!iframes[0]) return;
    var win = $(".main-slider"),
        width = win.width(),
        playerWidth,
        height = win.height(),
        playerHeight,
        ratio = ratio || 16/9;
   
    iframes.each(function(){
      var current = $(this);
      if (width / ratio < height) {
        playerWidth = Math.ceil(height * ratio);
        current.width(playerWidth).height(height).css({
          left: (width - playerWidth) / 2,
           top: 0
          });
      } else {
        playerHeight = Math.ceil(width / ratio);
        current.width(width).height(playerHeight).css({
          left: 0,
          top: (height - playerHeight) / 2
        });
      }
    });
  }

});