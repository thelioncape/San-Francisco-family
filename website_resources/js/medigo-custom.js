jQuery(document).ready(function($){


	$(window).resize(function(){
		if ($(window).width() >= 768){	
			$(".responsive_menu").hide();
		}	
	});

	/************** SuperFish Menu *********************/
		function initSuperFish(){
			
			$(".sf-menu").superfish({
				 delay:  50,
				 autoArrows: true,
				 animation:   {opacity:'show'}
				 //cssArrows: true
			});
			
			// Replace SuperFish CSS Arrows to Font Awesome Icons
			$('nav > ul.sf-menu > li').each(function(){
				$(this).find('.sf-with-ul').append('<i class="fa fa-angle-down"></i>');
			});
		}
		
		initSuperFish();



	/************** Portfolio Carousel *********************/
		function initOwlCarousel(){

			$("#portfolio-carousel").owlCarousel({
				items : 4,
				navigation : false,
				pagination : false,
				autoPlay : true,
				navigationText : ["",""],
			}); 

		}

		initOwlCarousel();



	/************** bxSlider (Testimonials) *********************/
		function initbxSlider(){

			$('.bxslider').bxSlider({
				adaptiveHeight : true,
				controls : false,
				auto : true,
				mode : 'fade',
			});

		}

		initbxSlider();



	/************** FlexSlider *********************/
		function initFlexSlider(){

			$('.flexslider').flexslider({
				controlNav: false,
				animation: 'slide',
				prevText: '',
				nextText: ''
			});

		}

		initFlexSlider();



	/************** FancyBox *********************/
		function initFancyBox(){

			$(".fancybox").fancybox({
				padding: 5,
				titlePosition: 'over'
			});

		}

		initFancyBox();



	/************** MixitUp *********************/
		$('#Grid').mixitup({
	        effects: ['fade','grayscale'],
	        easing: 'snap',
	        transitionSpeed: 400
	    });




	/************** Flickr Feed *********************/
		function initFlickrFeed(){

			$('#flickr-feed').jflickrfeed({
				limit: 8,
				qstrings: {
					id: '44802888@N04'
				},
				itemTemplate: 
				'<li>' +
					'<a href="{{image_b}}" class="fancybox"><img src="{{image_s}}" alt="{{title}}" /></a>' +
				'</li>'
			});

		}

		initFlickrFeed();




	/************** Parallax Scrolling Backgrounds *********************/
		$('#homeIntro').parallax("50%", 0.3);
		$('#blogPosts').parallax("80%", 0.3);
		$('.pageTitle').parallax("50%", 0.3);
		



	/************** Responsive Navigation *********************/
		$('.menu-toggle-btn').click(function(){
	        $('.responsive_menu').slideToggle();
	    });


	/************** Contact Form *********************/
	    $(".contact-form #submit").click(function() { 
	        //collect input field values
	        var user_name       = $('input[name=name]').val(); 
	        var user_email      = $('input[name=email]').val();
	        var user_subject      = $('input[name=subject]').val();
	        var user_message    = $('textarea[name=message]').val();
	        
	        //simple validation at client's end
	        //we simply change border color to red if empty field using .css()
	        var proceed = true;
	        if(user_name==""){ 
	            $('input[name=name]').css('border-color','red'); 
	            proceed = false;
	        }
	        if(user_email==""){ 
	            $('input[name=email]').css('border-color','red'); 
	            proceed = false;
	        }
	        if(user_subject=="") {    
	            $('input[name=subject]').css('border-color','red'); 
	            proceed = false;
	        }
	        if(user_message=="") {  
	            $('textarea[name=message]').css('border-color','red'); 
	            proceed = false;
	        }

	        	

	        //everything looks good! proceed...
	        if(proceed) 
	        {
	            //data to be sent to server
	            post_data = {'userName':user_name, 'userEmail':user_email, 'userSubject':user_subject, 'userMessage':user_message};
	            
	            //Ajax post data to server
	            $.post('contact.php', post_data, function(data){  
	                
	                //load success massage in #result div element, with slide effect.       
	                $("#result").hide().html('<div class="success">'+data+'</div>').slideDown();

	                //reset values in all input fields
                	$('.widget-inner input').val(''); 
                	$('.widget-inner textarea').val(''); 
	                
	            }).fail(function(err) {  //load any error data
	                $("#result").hide().html('<div class="error">'+err.statusText+'</div>').slideDown();
	            });
	        }
	                
	    });
	    
	    //reset previously set border colors and hide all message on .keyup()
	    $(".contact-form input, .contact-form textarea").keyup(function() { 
	        $(".contact-form input, .contact-form textarea").css('border-color',''); 
	        $("#result").slideUp();
	    });
    
   
    

});