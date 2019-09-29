


var facialAnimation = function(){
			

	var controller, distortions, rgbbshifts, gui, onGUIChange;
	var shader;

	var camera, renderer, scene, composer;

	var material, geometry, mesh;

	var distortionShaderPass,rgbshiftShaderPass,copyPass;
	var distortion_shader, rgbshift_shader;

	var material2, geometry2, mesh2;
	var texture, texture2, texture3;

	var glitchShaderPass;

	var isMainTexture = true; 
	var counter = 0;

	var shaderTime = 0;

	var defaultOrientation; // window.orientationが0または180の時に縦長であればtrue

	init();
	animate();
/*
	gui = new dat.GUI();

	controller = {
		show: true,
		amount:0.5,
		size:4.0                                                                        
	};

	distortions = {
		distortion:1.1,
		distortion2:1.7,
		speed:0.2,
		rollSpeed:0.0                                                                     
	};

	rgbbshifts = {
		amount: 0.005,
		angle: 0.0
	}

	gui.add( controller, 'amount', 0.0,1.0).step(0.01).listen().onChange( onGUIChange );
	gui.add( controller, 'size', 1.0,100.0).step(1.0).onChange( onGUIChange );

	var f1 = gui.addFolder('distortion');

	f1.add(distortions, 'distortion', 0.1, 20).step(0.1).listen().name('Thick Distort').onChange(onGUIChange);
	f1.add(distortions, 'distortion2', 0.1, 20).step(0.1).listen().name('Fine Distort').onChange(onGUIChange);
	f1.add(distortions, 'speed', 0.0,1.0).step(0.01).listen().name('Distort Speed').onChange(onGUIChange);
	f1.add(distortions, 'rollSpeed', 0.0,1.0).step(0.01).listen().name('Roll Speed').onChange(onGUIChange);
	f1.open();
	f1.close();

	var f2 = gui.addFolder('rgbbshifts');
	f2.add(rgbbshifts, 'amount', 0.0, 0.1).listen().name('amount').onChange(onGUIChange);
	f2.add(rgbbshifts, 'angle', 0.0, 2.0).listen().name('angle').onChange(onGUIChange);
	*/

	function init(){
		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set(0,  0, /*(window.innerWidth/2)*1.7325*/1000);

	 	//init renderer
		renderer = new THREE.WebGLRenderer({ alpha: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setClearColor( 0xffffff, 1 );

		//renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

		var main = document.getElementById('home');

		main.appendChild( renderer.domElement );

		// Sceneを用意
		scene = new THREE.Scene();


		texture = new THREE.TextureLoader().load( "images/hee.png" );
  		texture2 = new THREE.TextureLoader().load( "images/hee2.png" );
  		texture3 = new THREE.TextureLoader().load( "images/hee3.png" );

  		//customシェーダー 
  		shader = {

  			uniforms: {
				"tDiffuse": { type: "t", value: texture},
				"time":     { type: "f", value: 0.0 },
				"amount":   { type: "f", value: 0.5 },
				"size":     { type: "f", value: 4.0 }
			},
			vertexShader: document.getElementById('vs').textContent,
			fragmentShader: document.getElementById('fs').textContent
  		}

		material = new THREE.ShaderMaterial(shader);
			

		geometry = new THREE.PlaneGeometry(500, 500,1,1);
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(0,0,0);
  		scene.add( mesh );



  		distortion_shader = {

  			uniforms: {
				"tDiffuse": 	{ type: "t", value: null },
				"time": 		{ type: "f", value: 0.0 },
				"distortion":   { type: "f", value: 1.1 },
				"distortion2":  { type: "f", value: 1.7 },
				"speed":     	{ type: "f", value: 0.2 },
				"rollSpeed":    { type: "f", value: 0.0 },
			},
			vertexShader: document.getElementById('vs').textContent,
			fragmentShader: document.getElementById('fs-distortion').textContent
  		}

  		rgbshift_shader  = {

  			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"amount":   { type: "f", value: 0.005 },
				"angle":    { type: "f", value: 0.0 }
			},
			vertexShader: document.getElementById('vs1').textContent,
			fragmentShader: document.getElementById('fs-rgbshift').textContent
  		}



  		//scene.add( new THREE.AmbientLight( 0x222222 ) );

  		light = new THREE.DirectionalLight( 0xffffff );


  		// postprocessing
  		
		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );


		distortionShaderPass = new THREE.ShaderPass(distortion_shader);
		//distortionShaderPass.renderToScreen = true;
		composer.addPass( distortionShaderPass );

		rgbshiftShaderPass =  new THREE.ShaderPass(rgbshift_shader);
		//rgbshiftShaderPass.renderToScreen = true;
		composer.addPass(rgbshiftShaderPass);

		copyPass = new THREE.ShaderPass( THREE.CopyShader );
		
		composer.addPass(copyPass);
		copyPass.renderToScreen = true;
		
/*				
		
*/
		//glitchPass.goWild = wildGlitch.checked;

		

		// 初期化処理
		window.addEventListener('load', function() {
		  if('orientation' in window) {
		    var o1 = (window.innerWidth < window.innerHeight);
		    var o2 = (window.orientation % 180 == 0);
		    defaultOrientation = (o1 && o2) || !(o1 || o2);
		    checkOrientation();
		  }
		  // もしあれば、その他Webアプリの初期化処理
		}, false);

		window.addEventListener( 'resize', onWindowResize, false );
		/*
		window.addEventListener("orientationchange", function() {
    		

	    	setTimeout(function(){

		    	if (window.innerHeight > window.innerWidth) {
		        	
		        	mesh.position.set(0,0,0);
		    		console.log("vertical");

				} else {
		    		
		    		mesh.position.set(0,-200,0);
		        	console.log("horizontal");
				}

			}, 100);

		});
		*/

	}

	
	function onGUIChange() {
		// update uniforms
		material.uniforms[ 'amount' ].value = controller.amount;
		material.uniforms[ 'size' ].value = controller.size;

		distortionShaderPass.uniforms["distortion"].value = distortions.distortion;
		distortionShaderPass.uniforms["distortion2"].value = distortions.distortion2;
		distortionShaderPass.uniforms["speed"].value = distortions.speed;
		distortionShaderPass.uniforms["rollSpeed"].value = distortions.rollSpeed;

		rgbshiftShaderPass.uniforms["amount"].value = rgbbshifts.amount;
		rgbshiftShaderPass.uniforms["angle"].value = rgbbshifts.angle;


		console.log(material.uniforms[ "amount" ].value);
	}




	function onWindowResize() {
	setTimeout(function(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		composer.setSize( window.innerWidth, window.innerHeight );
		checkOrientation();
		
	}, 100);


	}

	function checkOrientation() {
		if('orientation' in window) {
		    // defaultOrientationがtrueの場合、window.orientationが0か180の時は縦長
		    // defaultOrientationがfalseの場合、window.orientationが-90か90の時は縦長
		    var o = (window.orientation % 180 == 0);
		    if((o && defaultOrientation) || !(o || defaultOrientation)) {
		      // ここに縦長画面への切り替え処理を記述
		        console.log('landscape');
		      mesh.position.set(0,-200,0);
		 
		    }
		    else {
		      // ここに横長画面への切り替え処理を記述
		      console.log('portrait');
		      mesh.position.set(0,0,0);
		    }
		}
	}


    function animate(){

    	shaderTime += 0.1;
    	material.uniforms[ 'time' ].value = shaderTime;
    	distortionShaderPass.uniforms["time"].value = shaderTime; 
    	//console.log(material.uniforms[ "u_resolution" ]);

    	
    	if(counter >= parseInt(Math.random()*60*3)){
    		//console.log(parseInt(Math.random()*60));

    		var random3 = Math.floor( Math.random () * 3);

				if(random3 == 0){
					material.uniforms[ "tDiffuse" ].value = texture;
					//isMainTexture = false;
					counter = 0;
				}else if (random3 == 1){
					material.uniforms[ "tDiffuse" ].value = texture2;
					//isMainTexture = true;
					counter = 0;
				}else if (random3 == 2){
					material.uniforms[ "tDiffuse" ].value = texture3;
					counter = 0;
				}
				//counter = 0;
			}
				counter ++;
		

			//glitchShaderPass.needsUpdate = true;
    	//renderer.render( scene, camera );
    	//renderer.render( distortion_scene, distortion_camera);
    	
    	composer.render();
			requestAnimationFrame( animate );

			

	}

}	
	



$(document).ready(function(){
  
  facialAnimation();


});


