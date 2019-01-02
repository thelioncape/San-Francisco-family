/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function() {

	var docElem = document.documentElement,
		header = document.querySelector( '.site-header' ),
		didScroll = false,
		changeHeaderOn = 300;

	function init() {
		window.addEventListener( 'scroll', function( event ) {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false );
	}

	function scrollPage() {
		var sy = scrollY();
		if ( sy >= changeHeaderOn ) {
			classie.add( header, 'site-header-shrink' );
		}
		else {
			classie.remove( header, 'site-header-shrink' );
		}
		didScroll = false;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();


/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

/*
* Copyright (C) 2009 Joel Sutherland
* Licenced under the MIT license
* http://www.newmediacampaigns.com/page/jquery-flickr-plugin
*
* Available tags for templates:
* title, link, date_taken, description, published, author, author_id, tags, image*
*/
(function($) {
  $.fn.jflickrfeed = function(settings, callback) {
    settings = $.extend(true, {
      flickrbase: 'http://api.flickr.com/services/feeds/',
      feedapi: 'photos_public.gne',
      limit: 20,
      qstrings: {
        lang: 'en-us',
        format: 'json',
        jsoncallback: '?'
      },
      cleanDescription: true,
      useTemplate: true,
      itemTemplate: '',
      itemCallback: function(){}
    }, settings);

    var url = settings.flickrbase + settings.feedapi + '?';
    var first = true;

    for(var key in settings.qstrings){
      if(!first)
        url += '&';
      url += key + '=' + settings.qstrings[key];
      first = false;
    }

    return $(this).each(function(){
      var $container = $(this);
      var container = this;
      $.getJSON(url, function(data){
        $.each(data.items, function(i,item){
          if(i < settings.limit){
          
            // Clean out the Flickr Description
            if(settings.cleanDescription){
              var regex = /<p>(.*?)<\/p>/g;
              var input = item.description;
              if(regex.test(input)) {
                item.description = input.match(regex)[2]
                if(item.description!=undefined)
                  item.description = item.description.replace('<p>','').replace('</p>','');
              }
            }
            
            // Add Image Sizes
            // http://www.flickr.com/services/api/misc.urls.html
            item['image_s'] = item.media.m.replace('_m', '_s');
            item['image_t'] = item.media.m.replace('_m', '_t');
            item['image_m'] = item.media.m.replace('_m', '_m');
            item['image'] = item.media.m.replace('_m', '');
            item['image_b'] = item.media.m.replace('_m', '_b');
            delete item.media;
            
            // Use Template
            if(settings.useTemplate){
              var template = settings.itemTemplate;
              for(var key in item){
                var rgx = new RegExp('{{' + key + '}}', 'g');
                template = template.replace(rgx, item[key]);
              }
              $container.append(template)
            }
            
            //itemCallback
            settings.itemCallback.call(container, item);
          }
        });
        if($.isFunction(callback)){
          callback.call(container, data);
        }
      });
    });
  }
})(jQuery);


/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */

;(function($){

  var plugin = {};

  var defaults = {

    // GENERAL
    mode: 'horizontal',
    slideSelector: '',
    infiniteLoop: true,
    hideControlOnEnd: false,
    speed: 500,
    easing: null,
    slideMargin: 0,
    startSlide: 0,
    randomStart: false,
    captions: false,
    ticker: false,
    tickerHover: false,
    adaptiveHeight: false,
    adaptiveHeightSpeed: 500,
    video: false,
    useCSS: true,
    preloadImages: 'visible',
    responsive: true,

    // TOUCH
    touchEnabled: true,
    swipeThreshold: 50,
    oneToOneTouch: true,
    preventDefaultSwipeX: true,
    preventDefaultSwipeY: false,

    // PAGER
    pager: true,
    pagerType: 'full',
    pagerShortSeparator: ' / ',
    pagerSelector: null,
    buildPager: null,
    pagerCustom: null,

    // CONTROLS
    controls: true,
    nextText: 'Next',
    prevText: 'Prev',
    nextSelector: null,
    prevSelector: null,
    autoControls: false,
    startText: 'Start',
    stopText: 'Stop',
    autoControlsCombine: false,
    autoControlsSelector: null,

    // AUTO
    auto: false,
    pause: 4000,
    autoStart: true,
    autoDirection: 'next',
    autoHover: false,
    autoDelay: 0,

    // CAROUSEL
    minSlides: 1,
    maxSlides: 1,
    moveSlides: 0,
    slideWidth: 0,

    // CALLBACKS
    onSliderLoad: function() {},
    onSlideBefore: function() {},
    onSlideAfter: function() {},
    onSlideNext: function() {},
    onSlidePrev: function() {}
  }

  $.fn.bxSlider = function(options){

    if(this.length == 0) return this;

    // support mutltiple elements
    if(this.length > 1){
      this.each(function(){$(this).bxSlider(options)});
      return this;
    }

    // create a namespace to be used throughout the plugin
    var slider = {};
    // set a reference to our slider element
    var el = this;
    plugin.el = this;

    /**
     * Makes slideshow responsive
     */
    // first get the original window dimens (thanks alot IE)
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();



    /**
     * ===================================================================================
     * = PRIVATE FUNCTIONS
     * ===================================================================================
     */

    /**
     * Initializes namespace settings to be used throughout plugin
     */
    var init = function(){
      // merge user-supplied options with the defaults
      slider.settings = $.extend({}, defaults, options);
      // parse slideWidth setting
      slider.settings.slideWidth = parseInt(slider.settings.slideWidth);
      // store the original children
      slider.children = el.children(slider.settings.slideSelector);
      // check if actual number of slides is less than minSlides / maxSlides
      if(slider.children.length < slider.settings.minSlides) slider.settings.minSlides = slider.children.length;
      if(slider.children.length < slider.settings.maxSlides) slider.settings.maxSlides = slider.children.length;
      // if random start, set the startSlide setting to random number
      if(slider.settings.randomStart) slider.settings.startSlide = Math.floor(Math.random() * slider.children.length);
      // store active slide information
      slider.active = { index: slider.settings.startSlide }
      // store if the slider is in carousel mode (displaying / moving multiple slides)
      slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1;
      // if carousel, force preloadImages = 'all'
      if(slider.carousel) slider.settings.preloadImages = 'all';
      // calculate the min / max width thresholds based on min / max number of slides
      // used to setup and update carousel slides dimensions
      slider.minThreshold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
      slider.maxThreshold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
      // store the current state of the slider (if currently animating, working is true)
      slider.working = false;
      // initialize the controls object
      slider.controls = {};
      // initialize an auto interval
      slider.interval = null;
      // determine which property to use for transitions
      slider.animProp = slider.settings.mode == 'vertical' ? 'top' : 'left';
      // determine if hardware acceleration can be used
      slider.usingCSS = slider.settings.useCSS && slider.settings.mode != 'fade' && (function(){
        // create our test div element
        var div = document.createElement('div');
        // css transition properties
        var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
        // test for each property
        for(var i in props){
          if(div.style[props[i]] !== undefined){
            slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
            slider.animProp = '-' + slider.cssPrefix + '-transform';
            return true;
          }
        }
        return false;
      }());
      // if vertical mode always make maxSlides and minSlides equal
      if(slider.settings.mode == 'vertical') slider.settings.maxSlides = slider.settings.minSlides;
      // save original style data
      el.data("origStyle", el.attr("style"));
      el.children(slider.settings.slideSelector).each(function() {
        $(this).data("origStyle", $(this).attr("style"));
      });
      // perform all DOM / CSS modifications
      setup();
    }

    /**
     * Performs all DOM and CSS modifications
     */
    var setup = function(){
      // wrap el in a wrapper
      el.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>');
      // store a namspace reference to .bx-viewport
      slider.viewport = el.parent();
      // add a loading div to display while images are loading
      slider.loader = $('<div class="bx-loading" />');
      slider.viewport.prepend(slider.loader);
      // set el to a massive width, to hold any needed slides
      // also strip any margin and padding from el
      el.css({
        width: slider.settings.mode == 'horizontal' ? (slider.children.length * 100 + 215) + '%' : 'auto',
        position: 'relative'
      });
      // if using CSS, add the easing property
      if(slider.usingCSS && slider.settings.easing){
        el.css('-' + slider.cssPrefix + '-transition-timing-function', slider.settings.easing);
      // if not using CSS and no easing value was supplied, use the default JS animation easing (swing)
      }else if(!slider.settings.easing){
        slider.settings.easing = 'swing';
      }
      var slidesShowing = getNumberSlidesShowing();
      // make modifications to the viewport (.bx-viewport)
      slider.viewport.css({
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      });
      slider.viewport.parent().css({
        maxWidth: getViewportMaxWidth()
      });
      // make modification to the wrapper (.bx-wrapper)
      if(!slider.settings.pager) {
        slider.viewport.parent().css({
        margin: '0 auto 0px'
        });
      }
      // apply css to all slider children
      slider.children.css({
        'float': slider.settings.mode == 'horizontal' ? 'left' : 'none',
        listStyle: 'none',
        position: 'relative'
      });
      // apply the calculated width after the float is applied to prevent scrollbar interference
      slider.children.css('width', getSlideWidth());
      // if slideMargin is supplied, add the css
      if(slider.settings.mode == 'horizontal' && slider.settings.slideMargin > 0) slider.children.css('marginRight', slider.settings.slideMargin);
      if(slider.settings.mode == 'vertical' && slider.settings.slideMargin > 0) slider.children.css('marginBottom', slider.settings.slideMargin);
      // if "fade" mode, add positioning and z-index CSS
      if(slider.settings.mode == 'fade'){
        slider.children.css({
          position: 'absolute',
          zIndex: 0,
          display: 'none'
        });
        // prepare the z-index on the showing element
        slider.children.eq(slider.settings.startSlide).css({zIndex: 50, display: 'block'});
      }
      // create an element to contain all slider controls (pager, start / stop, etc)
      slider.controls.el = $('<div class="bx-controls" />');
      // if captions are requested, add them
      if(slider.settings.captions) appendCaptions();
      // check if startSlide is last slide
      slider.active.last = slider.settings.startSlide == getPagerQty() - 1;
      // if video is true, set up the fitVids plugin
      if(slider.settings.video) el.fitVids();
      // set the default preload selector (visible)
      var preloadSelector = slider.children.eq(slider.settings.startSlide);
      if (slider.settings.preloadImages == "all") preloadSelector = slider.children;
      // only check for control addition if not in "ticker" mode
      if(!slider.settings.ticker){
        // if pager is requested, add it
        if(slider.settings.pager) appendPager();
        // if controls are requested, add them
        if(slider.settings.controls) appendControls();
        // if auto is true, and auto controls are requested, add them
        if(slider.settings.auto && slider.settings.autoControls) appendControlsAuto();
        // if any control option is requested, add the controls wrapper
        if(slider.settings.controls || slider.settings.autoControls || slider.settings.pager) slider.viewport.after(slider.controls.el);
      // if ticker mode, do not allow a pager
      }else{
        slider.settings.pager = false;
      }
      // preload all images, then perform final DOM / CSS modifications that depend on images being loaded
      loadElements(preloadSelector, start);
    }

    var loadElements = function(selector, callback){
      var total = selector.find('img, iframe').length;
      if (total == 0){
        callback();
        return;
      }
      var count = 0;
      selector.find('img, iframe').each(function(){
        $(this).one('load', function() {
          if(++count == total) callback();
        }).each(function() {
          if(this.complete) $(this).load();
        });
      });
    }

    /**
     * Start the slider
     */
    var start = function(){
      // if infinite loop, prepare additional slides
      if(slider.settings.infiniteLoop && slider.settings.mode != 'fade' && !slider.settings.ticker){
        var slice = slider.settings.mode == 'vertical' ? slider.settings.minSlides : slider.settings.maxSlides;
        var sliceAppend = slider.children.slice(0, slice).clone().addClass('bx-clone');
        var slicePrepend = slider.children.slice(-slice).clone().addClass('bx-clone');
        el.append(sliceAppend).prepend(slicePrepend);
      }
      // remove the loading DOM element
      slider.loader.remove();
      // set the left / top position of "el"
      setSlidePosition();
      // if "vertical" mode, always use adaptiveHeight to prevent odd behavior
      if (slider.settings.mode == 'vertical') slider.settings.adaptiveHeight = true;
      // set the viewport height
      slider.viewport.height(getViewportHeight());
      // make sure everything is positioned just right (same as a window resize)
      el.redrawSlider();
      // onSliderLoad callback
      slider.settings.onSliderLoad(slider.active.index);
      // slider has been fully initialized
      slider.initialized = true;
      // bind the resize call to the window
      if (slider.settings.responsive) $(window).bind('resize', resizeWindow);
      // if auto is true, start the show
      if (slider.settings.auto && slider.settings.autoStart) initAuto();
      // if ticker is true, start the ticker
      if (slider.settings.ticker) initTicker();
      // if pager is requested, make the appropriate pager link active
      if (slider.settings.pager) updatePagerActive(slider.settings.startSlide);
      // check for any updates to the controls (like hideControlOnEnd updates)
      if (slider.settings.controls) updateDirectionControls();
      // if touchEnabled is true, setup the touch events
      if (slider.settings.touchEnabled && !slider.settings.ticker) initTouch();
    }

    /**
     * Returns the calculated height of the viewport, used to determine either adaptiveHeight or the maxHeight value
     */
    var getViewportHeight = function(){
      var height = 0;
      // first determine which children (slides) should be used in our height calculation
      var children = $();
      // if mode is not "vertical" and adaptiveHeight is false, include all children
      if(slider.settings.mode != 'vertical' && !slider.settings.adaptiveHeight){
        children = slider.children;
      }else{
        // if not carousel, return the single active child
        if(!slider.carousel){
          children = slider.children.eq(slider.active.index);
        // if carousel, return a slice of children
        }else{
          // get the individual slide index
          var currentIndex = slider.settings.moveSlides == 1 ? slider.active.index : slider.active.index * getMoveBy();
          // add the current slide to the children
          children = slider.children.eq(currentIndex);
          // cycle through the remaining "showing" slides
          for (i = 1; i <= slider.settings.maxSlides - 1; i++){
            // if looped back to the start
            if(currentIndex + i >= slider.children.length){
              children = children.add(slider.children.eq(i - 1));
            }else{
              children = children.add(slider.children.eq(currentIndex + i));
            }
          }
        }
      }
      // if "vertical" mode, calculate the sum of the heights of the children
      if(slider.settings.mode == 'vertical'){
        children.each(function(index) {
          height += $(this).outerHeight();
        });
        // add user-supplied margins
        if(slider.settings.slideMargin > 0){
          height += slider.settings.slideMargin * (slider.settings.minSlides - 1);
        }
      // if not "vertical" mode, calculate the max height of the children
      }else{
        height = Math.max.apply(Math, children.map(function(){
          return $(this).outerHeight(false);
        }).get());
      }
      return height;
    }

    /**
     * Returns the calculated width to be used for the outer wrapper / viewport
     */
    var getViewportMaxWidth = function(){
      var width = '100%';
      if(slider.settings.slideWidth > 0){
        if(slider.settings.mode == 'horizontal'){
          width = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
        }else{
          width = slider.settings.slideWidth;
        }
      }
      return width;
    }

    /**
     * Returns the calculated width to be applied to each slide
     */
    var getSlideWidth = function(){
      // start with any user-supplied slide width
      var newElWidth = slider.settings.slideWidth;
      // get the current viewport width
      var wrapWidth = slider.viewport.width();
      // if slide width was not supplied, or is larger than the viewport use the viewport width
      if(slider.settings.slideWidth == 0 ||
        (slider.settings.slideWidth > wrapWidth && !slider.carousel) ||
        slider.settings.mode == 'vertical'){
        newElWidth = wrapWidth;
      // if carousel, use the thresholds to determine the width
      }else if(slider.settings.maxSlides > 1 && slider.settings.mode == 'horizontal'){
        if(wrapWidth > slider.maxThreshold){
          // newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.maxSlides - 1))) / slider.settings.maxSlides;
        }else if(wrapWidth < slider.minThreshold){
          newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
        }
      }
      return newElWidth;
    }

    /**
     * Returns the number of slides currently visible in the viewport (includes partially visible slides)
     */
    var getNumberSlidesShowing = function(){
      var slidesShowing = 1;
      if(slider.settings.mode == 'horizontal' && slider.settings.slideWidth > 0){
        // if viewport is smaller than minThreshold, return minSlides
        if(slider.viewport.width() < slider.minThreshold){
          slidesShowing = slider.settings.minSlides;
        // if viewport is larger than minThreshold, return maxSlides
        }else if(slider.viewport.width() > slider.maxThreshold){
          slidesShowing = slider.settings.maxSlides;
        // if viewport is between min / max thresholds, divide viewport width by first child width
        }else{
          var childWidth = slider.children.first().width();
          slidesShowing = Math.floor(slider.viewport.width() / childWidth);
        }
      // if "vertical" mode, slides showing will always be minSlides
      }else if(slider.settings.mode == 'vertical'){
        slidesShowing = slider.settings.minSlides;
      }
      return slidesShowing;
    }

    /**
     * Returns the number of pages (one full viewport of slides is one "page")
     */
    var getPagerQty = function(){
      var pagerQty = 0;
      // if moveSlides is specified by the user
      if(slider.settings.moveSlides > 0){
        if(slider.settings.infiniteLoop){
          pagerQty = slider.children.length / getMoveBy();
        }else{
          // use a while loop to determine pages
          var breakPoint = 0;
          var counter = 0
          // when breakpoint goes above children length, counter is the number of pages
          while (breakPoint < slider.children.length){
            ++pagerQty;
            breakPoint = counter + getNumberSlidesShowing();
            counter += slider.settings.moveSlides <= getNumberSlidesShowing() ? slider.settings.moveSlides : getNumberSlidesShowing();
          }
        }
      // if moveSlides is 0 (auto) divide children length by sides showing, then round up
      }else{
        pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
      }
      return pagerQty;
    }

    /**
     * Returns the number of indivual slides by which to shift the slider
     */
    var getMoveBy = function(){
      // if moveSlides was set by the user and moveSlides is less than number of slides showing
      if(slider.settings.moveSlides > 0 && slider.settings.moveSlides <= getNumberSlidesShowing()){
        return slider.settings.moveSlides;
      }
      // if moveSlides is 0 (auto)
      return getNumberSlidesShowing();
    }

    /**
     * Sets the slider's (el) left or top position
     */
    var setSlidePosition = function(){
      // if last slide, not infinite loop, and number of children is larger than specified maxSlides
      if(slider.children.length > slider.settings.maxSlides && slider.active.last && !slider.settings.infiniteLoop){
        if (slider.settings.mode == 'horizontal'){
          // get the last child's position
          var lastChild = slider.children.last();
          var position = lastChild.position();
          // set the left position
          setPositionProperty(-(position.left - (slider.viewport.width() - lastChild.width())), 'reset', 0);
        }else if(slider.settings.mode == 'vertical'){
          // get the last showing index's position
          var lastShowingIndex = slider.children.length - slider.settings.minSlides;
          var position = slider.children.eq(lastShowingIndex).position();
          // set the top position
          setPositionProperty(-position.top, 'reset', 0);
        }
      // if not last slide
      }else{
        // get the position of the first showing slide
        var position = slider.children.eq(slider.active.index * getMoveBy()).position();
        // check for last slide
        if (slider.active.index == getPagerQty() - 1) slider.active.last = true;
        // set the repective position
        if (position != undefined){
          if (slider.settings.mode == 'horizontal') setPositionProperty(-position.left, 'reset', 0);
          else if (slider.settings.mode == 'vertical') setPositionProperty(-position.top, 'reset', 0);
        }
      }
    }

    /**
     * Sets the el's animating property position (which in turn will sometimes animate el).
     * If using CSS, sets the transform property. If not using CSS, sets the top / left property.
     *
     * @param value (int)
     *  - the animating property's value
     *
     * @param type (string) 'slider', 'reset', 'ticker'
     *  - the type of instance for which the function is being
     *
     * @param duration (int)
     *  - the amount of time (in ms) the transition should occupy
     *
     * @param params (array) optional
     *  - an optional parameter containing any variables that need to be passed in
     */
    var setPositionProperty = function(value, type, duration, params){
      // use CSS transform
      if(slider.usingCSS){
        // determine the translate3d value
        var propValue = slider.settings.mode == 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
        // add the CSS transition-duration
        el.css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
        if(type == 'slide'){
          // set the property value
          el.css(slider.animProp, propValue);
          // bind a callback method - executes when CSS transition completes
          el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
            // unbind the callback
            el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
            updateAfterSlideTransition();
          });
        }else if(type == 'reset'){
          el.css(slider.animProp, propValue);
        }else if(type == 'ticker'){
          // make the transition use 'linear'
          el.css('-' + slider.cssPrefix + '-transition-timing-function', 'linear');
          el.css(slider.animProp, propValue);
          // bind a callback method - executes when CSS transition completes
          el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
            // unbind the callback
            el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
            // reset the position
            setPositionProperty(params['resetValue'], 'reset', 0);
            // start the loop again
            tickerLoop();
          });
        }
      // use JS animate
      }else{
        var animateObj = {};
        animateObj[slider.animProp] = value;
        if(type == 'slide'){
          el.animate(animateObj, duration, slider.settings.easing, function(){
            updateAfterSlideTransition();
          });
        }else if(type == 'reset'){
          el.css(slider.animProp, value)
        }else if(type == 'ticker'){
          el.animate(animateObj, speed, 'linear', function(){
            setPositionProperty(params['resetValue'], 'reset', 0);
            // run the recursive loop after animation
            tickerLoop();
          });
        }
      }
    }

    /**
     * Populates the pager with proper amount of pages
     */
    var populatePager = function(){
      var pagerHtml = '';
      var pagerQty = getPagerQty();
      // loop through each pager item
      for(var i=0; i < pagerQty; i++){
        var linkContent = '';
        // if a buildPager function is supplied, use it to get pager link value, else use index + 1
        if(slider.settings.buildPager && $.isFunction(slider.settings.buildPager)){
          linkContent = slider.settings.buildPager(i);
          slider.pagerEl.addClass('bx-custom-pager');
        }else{
          linkContent = i + 1;
          slider.pagerEl.addClass('bx-default-pager');
        }
        // var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i) : i + 1;
        // add the markup to the string
        pagerHtml += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a></div>';
      };
      // populate the pager element with pager links
      slider.pagerEl.html(pagerHtml);
    }

    /**
     * Appends the pager to the controls element
     */
    var appendPager = function(){
      if(!slider.settings.pagerCustom){
        // create the pager DOM element
        slider.pagerEl = $('<div class="bx-pager" />');
        // if a pager selector was supplied, populate it with the pager
        if(slider.settings.pagerSelector){
          $(slider.settings.pagerSelector).html(slider.pagerEl);
        // if no pager selector was supplied, add it after the wrapper
        }else{
          slider.controls.el.addClass('bx-has-pager').append(slider.pagerEl);
        }
        // populate the pager
        populatePager();
      }else{
        slider.pagerEl = $(slider.settings.pagerCustom);
      }
      // assign the pager click binding
      slider.pagerEl.delegate('a', 'click', clickPagerBind);
    }

    /**
     * Appends prev / next controls to the controls element
     */
    var appendControls = function(){
      slider.controls.next = $('<a class="bx-next" href="">' + slider.settings.nextText + '</a>');
      slider.controls.prev = $('<a class="bx-prev" href="">' + slider.settings.prevText + '</a>');
      // bind click actions to the controls
      slider.controls.next.bind('click', clickNextBind);
      slider.controls.prev.bind('click', clickPrevBind);
      // if nextSlector was supplied, populate it
      if(slider.settings.nextSelector){
        $(slider.settings.nextSelector).append(slider.controls.next);
      }
      // if prevSlector was supplied, populate it
      if(slider.settings.prevSelector){
        $(slider.settings.prevSelector).append(slider.controls.prev);
      }
      // if no custom selectors were supplied
      if(!slider.settings.nextSelector && !slider.settings.prevSelector){
        // add the controls to the DOM
        slider.controls.directionEl = $('<div class="bx-controls-direction" />');
        // add the control elements to the directionEl
        slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
        // slider.viewport.append(slider.controls.directionEl);
        slider.controls.el.addClass('bx-has-controls-direction').append(slider.controls.directionEl);
      }
    }

    /**
     * Appends start / stop auto controls to the controls element
     */
    var appendControlsAuto = function(){
      slider.controls.start = $('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + slider.settings.startText + '</a></div>');
      slider.controls.stop = $('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + slider.settings.stopText + '</a></div>');
      // add the controls to the DOM
      slider.controls.autoEl = $('<div class="bx-controls-auto" />');
      // bind click actions to the controls
      slider.controls.autoEl.delegate('.bx-start', 'click', clickStartBind);
      slider.controls.autoEl.delegate('.bx-stop', 'click', clickStopBind);
      // if autoControlsCombine, insert only the "start" control
      if(slider.settings.autoControlsCombine){
        slider.controls.autoEl.append(slider.controls.start);
      // if autoControlsCombine is false, insert both controls
      }else{
        slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
      }
      // if auto controls selector was supplied, populate it with the controls
      if(slider.settings.autoControlsSelector){
        $(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
      // if auto controls selector was not supplied, add it after the wrapper
      }else{
        slider.controls.el.addClass('bx-has-controls-auto').append(slider.controls.autoEl);
      }
      // update the auto controls
      updateAutoControls(slider.settings.autoStart ? 'stop' : 'start');
    }

    /**
     * Appends image captions to the DOM
     */
    var appendCaptions = function(){
      // cycle through each child
      slider.children.each(function(index){
        // get the image title attribute
        var title = $(this).find('img:first').attr('title');
        // append the caption
        if (title != undefined && ('' + title).length) {
                    $(this).append('<div class="bx-caption"><span>' + title + '</span></div>');
                }
      });
    }

    /**
     * Click next binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickNextBind = function(e){
      // if auto show is running, stop it
      if (slider.settings.auto) el.stopAuto();
      el.goToNextSlide();
      e.preventDefault();
    }

    /**
     * Click prev binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickPrevBind = function(e){
      // if auto show is running, stop it
      if (slider.settings.auto) el.stopAuto();
      el.goToPrevSlide();
      e.preventDefault();
    }

    /**
     * Click start binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickStartBind = function(e){
      el.startAuto();
      e.preventDefault();
    }

    /**
     * Click stop binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickStopBind = function(e){
      el.stopAuto();
      e.preventDefault();
    }

    /**
     * Click pager binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickPagerBind = function(e){
      // if auto show is running, stop it
      if (slider.settings.auto) el.stopAuto();
      var pagerLink = $(e.currentTarget);
      var pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
      // if clicked pager link is not active, continue with the goToSlide call
      if(pagerIndex != slider.active.index) el.goToSlide(pagerIndex);
      e.preventDefault();
    }

    /**
     * Updates the pager links with an active class
     *
     * @param slideIndex (int)
     *  - index of slide to make active
     */
    var updatePagerActive = function(slideIndex){
      // if "short" pager type
      var len = slider.children.length; // nb of children
      if(slider.settings.pagerType == 'short'){
        if(slider.settings.maxSlides > 1) {
          len = Math.ceil(slider.children.length/slider.settings.maxSlides);
        }
        slider.pagerEl.html( (slideIndex + 1) + slider.settings.pagerShortSeparator + len);
        return;
      }
      // remove all pager active classes
      slider.pagerEl.find('a').removeClass('active');
      // apply the active class for all pagers
      slider.pagerEl.each(function(i, el) { $(el).find('a').eq(slideIndex).addClass('active'); });
    }

    /**
     * Performs needed actions after a slide transition
     */
    var updateAfterSlideTransition = function(){
      // if infinte loop is true
      if(slider.settings.infiniteLoop){
        var position = '';
        // first slide
        if(slider.active.index == 0){
          // set the new position
          position = slider.children.eq(0).position();
        // carousel, last slide
        }else if(slider.active.index == getPagerQty() - 1 && slider.carousel){
          position = slider.children.eq((getPagerQty() - 1) * getMoveBy()).position();
        // last slide
        }else if(slider.active.index == slider.children.length - 1){
          position = slider.children.eq(slider.children.length - 1).position();
        }
        if (slider.settings.mode == 'horizontal') { setPositionProperty(-position.left, 'reset', 0);; }
        else if (slider.settings.mode == 'vertical') { setPositionProperty(-position.top, 'reset', 0);; }
      }
      // declare that the transition is complete
      slider.working = false;
      // onSlideAfter callback
      slider.settings.onSlideAfter(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
    }

    /**
     * Updates the auto controls state (either active, or combined switch)
     *
     * @param state (string) "start", "stop"
     *  - the new state of the auto show
     */
    var updateAutoControls = function(state){
      // if autoControlsCombine is true, replace the current control with the new state
      if(slider.settings.autoControlsCombine){
        slider.controls.autoEl.html(slider.controls[state]);
      // if autoControlsCombine is false, apply the "active" class to the appropriate control
      }else{
        slider.controls.autoEl.find('a').removeClass('active');
        slider.controls.autoEl.find('a:not(.bx-' + state + ')').addClass('active');
      }
    }

    /**
     * Updates the direction controls (checks if either should be hidden)
     */
    var updateDirectionControls = function(){
      if(getPagerQty() == 1){
        slider.controls.prev.addClass('disabled');
        slider.controls.next.addClass('disabled');
      }else if(!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd){
        // if first slide
        if (slider.active.index == 0){
          slider.controls.prev.addClass('disabled');
          slider.controls.next.removeClass('disabled');
        // if last slide
        }else if(slider.active.index == getPagerQty() - 1){
          slider.controls.next.addClass('disabled');
          slider.controls.prev.removeClass('disabled');
        // if any slide in the middle
        }else{
          slider.controls.prev.removeClass('disabled');
          slider.controls.next.removeClass('disabled');
        }
      }
    }

    /**
     * Initialzes the auto process
     */
    var initAuto = function(){
      // if autoDelay was supplied, launch the auto show using a setTimeout() call
      if(slider.settings.autoDelay > 0){
        var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
      // if autoDelay was not supplied, start the auto show normally
      }else{
        el.startAuto();
      }
      // if autoHover is requested
      if(slider.settings.autoHover){
        // on el hover
        el.hover(function(){
          // if the auto show is currently playing (has an active interval)
          if(slider.interval){
            // stop the auto show and pass true agument which will prevent control update
            el.stopAuto(true);
            // create a new autoPaused value which will be used by the relative "mouseout" event
            slider.autoPaused = true;
          }
        }, function(){
          // if the autoPaused value was created be the prior "mouseover" event
          if(slider.autoPaused){
            // start the auto show and pass true agument which will prevent control update
            el.startAuto(true);
            // reset the autoPaused value
            slider.autoPaused = null;
          }
        });
      }
    }

    /**
     * Initialzes the ticker process
     */
    var initTicker = function(){
      var startPosition = 0;
      // if autoDirection is "next", append a clone of the entire slider
      if(slider.settings.autoDirection == 'next'){
        el.append(slider.children.clone().addClass('bx-clone'));
      // if autoDirection is "prev", prepend a clone of the entire slider, and set the left position
      }else{
        el.prepend(slider.children.clone().addClass('bx-clone'));
        var position = slider.children.first().position();
        startPosition = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
      }
      setPositionProperty(startPosition, 'reset', 0);
      // do not allow controls in ticker mode
      slider.settings.pager = false;
      slider.settings.controls = false;
      slider.settings.autoControls = false;
      // if autoHover is requested
      if(slider.settings.tickerHover && !slider.usingCSS){
        // on el hover
        slider.viewport.hover(function(){
          el.stop();
        }, function(){
          // calculate the total width of children (used to calculate the speed ratio)
          var totalDimens = 0;
          slider.children.each(function(index){
            totalDimens += slider.settings.mode == 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
          });
          // calculate the speed ratio (used to determine the new speed to finish the paused animation)
          var ratio = slider.settings.speed / totalDimens;
          // determine which property to use
          var property = slider.settings.mode == 'horizontal' ? 'left' : 'top';
          // calculate the new speed
          var newSpeed = ratio * (totalDimens - (Math.abs(parseInt(el.css(property)))));
          tickerLoop(newSpeed);
        });
      }
      // start the ticker loop
      tickerLoop();
    }

    /**
     * Runs a continuous loop, news ticker-style
     */
    var tickerLoop = function(resumeSpeed){
      speed = resumeSpeed ? resumeSpeed : slider.settings.speed;
      var position = {left: 0, top: 0};
      var reset = {left: 0, top: 0};
      // if "next" animate left position to last child, then reset left to 0
      if(slider.settings.autoDirection == 'next'){
        position = el.find('.bx-clone').first().position();
      // if "prev" animate left position to 0, then reset left to first non-clone child
      }else{
        reset = slider.children.first().position();
      }
      var animateProperty = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
      var resetValue = slider.settings.mode == 'horizontal' ? -reset.left : -reset.top;
      var params = {resetValue: resetValue};
      setPositionProperty(animateProperty, 'ticker', speed, params);
    }

    /**
     * Initializes touch events
     */
    var initTouch = function(){
      // initialize object to contain all touch values
      slider.touch = {
        start: {x: 0, y: 0},
        end: {x: 0, y: 0}
      }
      slider.viewport.bind('touchstart', onTouchStart);
    }

    /**
     * Event handler for "touchstart"
     *
     * @param e (event)
     *  - DOM event object
     */
    var onTouchStart = function(e){
      if(slider.working){
        e.preventDefault();
      }else{
        // record the original position when touch starts
        slider.touch.originalPos = el.position();
        var orig = e.originalEvent;
        // record the starting touch x, y coordinates
        slider.touch.start.x = orig.changedTouches[0].pageX;
        slider.touch.start.y = orig.changedTouches[0].pageY;
        // bind a "touchmove" event to the viewport
        slider.viewport.bind('touchmove', onTouchMove);
        // bind a "touchend" event to the viewport
        slider.viewport.bind('touchend', onTouchEnd);
      }
    }

    /**
     * Event handler for "touchmove"
     *
     * @param e (event)
     *  - DOM event object
     */
    var onTouchMove = function(e){
      var orig = e.originalEvent;
      // if scrolling on y axis, do not prevent default
      var xMovement = Math.abs(orig.changedTouches[0].pageX - slider.touch.start.x);
      var yMovement = Math.abs(orig.changedTouches[0].pageY - slider.touch.start.y);
      // x axis swipe
      if((xMovement * 3) > yMovement && slider.settings.preventDefaultSwipeX){
        e.preventDefault();
      // y axis swipe
      }else if((yMovement * 3) > xMovement && slider.settings.preventDefaultSwipeY){
        e.preventDefault();
      }
      if(slider.settings.mode != 'fade' && slider.settings.oneToOneTouch){
        var value = 0;
        // if horizontal, drag along x axis
        if(slider.settings.mode == 'horizontal'){
          var change = orig.changedTouches[0].pageX - slider.touch.start.x;
          value = slider.touch.originalPos.left + change;
        // if vertical, drag along y axis
        }else{
          var change = orig.changedTouches[0].pageY - slider.touch.start.y;
          value = slider.touch.originalPos.top + change;
        }
        setPositionProperty(value, 'reset', 0);
      }
    }

    /**
     * Event handler for "touchend"
     *
     * @param e (event)
     *  - DOM event object
     */
    var onTouchEnd = function(e){
      slider.viewport.unbind('touchmove', onTouchMove);
      var orig = e.originalEvent;
      var value = 0;
      // record end x, y positions
      slider.touch.end.x = orig.changedTouches[0].pageX;
      slider.touch.end.y = orig.changedTouches[0].pageY;
      // if fade mode, check if absolute x distance clears the threshold
      if(slider.settings.mode == 'fade'){
        var distance = Math.abs(slider.touch.start.x - slider.touch.end.x);
        if(distance >= slider.settings.swipeThreshold){
          slider.touch.start.x > slider.touch.end.x ? el.goToNextSlide() : el.goToPrevSlide();
          el.stopAuto();
        }
      // not fade mode
      }else{
        var distance = 0;
        // calculate distance and el's animate property
        if(slider.settings.mode == 'horizontal'){
          distance = slider.touch.end.x - slider.touch.start.x;
          value = slider.touch.originalPos.left;
        }else{
          distance = slider.touch.end.y - slider.touch.start.y;
          value = slider.touch.originalPos.top;
        }
        // if not infinite loop and first / last slide, do not attempt a slide transition
        if(!slider.settings.infiniteLoop && ((slider.active.index == 0 && distance > 0) || (slider.active.last && distance < 0))){
          setPositionProperty(value, 'reset', 200);
        }else{
          // check if distance clears threshold
          if(Math.abs(distance) >= slider.settings.swipeThreshold){
            distance < 0 ? el.goToNextSlide() : el.goToPrevSlide();
            el.stopAuto();
          }else{
            // el.animate(property, 200);
            setPositionProperty(value, 'reset', 200);
          }
        }
      }
      slider.viewport.unbind('touchend', onTouchEnd);
    }

    /**
     * Window resize event callback
     */
    var resizeWindow = function(e){
      // get the new window dimens (again, thank you IE)
      var windowWidthNew = $(window).width();
      var windowHeightNew = $(window).height();
      // make sure that it is a true window resize
      // *we must check this because our dinosaur friend IE fires a window resize event when certain DOM elements
      // are resized. Can you just die already?*
      if(windowWidth != windowWidthNew || windowHeight != windowHeightNew){
        // set the new window dimens
        windowWidth = windowWidthNew;
        windowHeight = windowHeightNew;
        // update all dynamic elements
        el.redrawSlider();
      }
    }

    /**
     * ===================================================================================
     * = PUBLIC FUNCTIONS
     * ===================================================================================
     */

    /**
     * Performs slide transition to the specified slide
     *
     * @param slideIndex (int)
     *  - the destination slide's index (zero-based)
     *
     * @param direction (string)
     *  - INTERNAL USE ONLY - the direction of travel ("prev" / "next")
     */
    el.goToSlide = function(slideIndex, direction){
      // if plugin is currently in motion, ignore request
      if(slider.working || slider.active.index == slideIndex) return;
      // declare that plugin is in motion
      slider.working = true;
      // store the old index
      slider.oldIndex = slider.active.index;
      // if slideIndex is less than zero, set active index to last child (this happens during infinite loop)
      if(slideIndex < 0){
        slider.active.index = getPagerQty() - 1;
      // if slideIndex is greater than children length, set active index to 0 (this happens during infinite loop)
      }else if(slideIndex >= getPagerQty()){
        slider.active.index = 0;
      // set active index to requested slide
      }else{
        slider.active.index = slideIndex;
      }
      // onSlideBefore, onSlideNext, onSlidePrev callbacks
      slider.settings.onSlideBefore(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
      if(direction == 'next'){
        slider.settings.onSlideNext(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
      }else if(direction == 'prev'){
        slider.settings.onSlidePrev(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
      }
      // check if last slide
      slider.active.last = slider.active.index >= getPagerQty() - 1;
      // update the pager with active class
      if(slider.settings.pager) updatePagerActive(slider.active.index);
      // // check for direction control update
      if(slider.settings.controls) updateDirectionControls();
      // if slider is set to mode: "fade"
      if(slider.settings.mode == 'fade'){
        // if adaptiveHeight is true and next height is different from current height, animate to the new height
        if(slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()){
          slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
        }
        // fade out the visible child and reset its z-index value
        slider.children.filter(':visible').fadeOut(slider.settings.speed).css({zIndex: 0});
        // fade in the newly requested slide
        slider.children.eq(slider.active.index).css('zIndex', 51).fadeIn(slider.settings.speed, function(){
          $(this).css('zIndex', 50);
          updateAfterSlideTransition();
        });
      // slider mode is not "fade"
      }else{
        // if adaptiveHeight is true and next height is different from current height, animate to the new height
        if(slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()){
          slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
        }
        var moveBy = 0;
        var position = {left: 0, top: 0};
        // if carousel and not infinite loop
        if(!slider.settings.infiniteLoop && slider.carousel && slider.active.last){
          if(slider.settings.mode == 'horizontal'){
            // get the last child position
            var lastChild = slider.children.eq(slider.children.length - 1);
            position = lastChild.position();
            // calculate the position of the last slide
            moveBy = slider.viewport.width() - lastChild.outerWidth();
          }else{
            // get last showing index position
            var lastShowingIndex = slider.children.length - slider.settings.minSlides;
            position = slider.children.eq(lastShowingIndex).position();
          }
          // horizontal carousel, going previous while on first slide (infiniteLoop mode)
        }else if(slider.carousel && slider.active.last && direction == 'prev'){
          // get the last child position
          var eq = slider.settings.moveSlides == 1 ? slider.settings.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (slider.children.length - slider.settings.maxSlides);
          var lastChild = el.children('.bx-clone').eq(eq);
          position = lastChild.position();
        // if infinite loop and "Next" is clicked on the last slide
        }else if(direction == 'next' && slider.active.index == 0){
          // get the last clone position
          position = el.find('> .bx-clone').eq(slider.settings.maxSlides).position();
          slider.active.last = false;
        // normal non-zero requests
        }else if(slideIndex >= 0){
          var requestEl = slideIndex * getMoveBy();
          position = slider.children.eq(requestEl).position();
        }

        /* If the position doesn't exist
         * (e.g. if you destroy the slider on a next click),
         * it doesn't throw an error.
         */
        if ("undefined" !== typeof(position)) {
          var value = slider.settings.mode == 'horizontal' ? -(position.left - moveBy) : -position.top;
          // plugin values to be animated
          setPositionProperty(value, 'slide', slider.settings.speed);
        }
      }
    }

    /**
     * Transitions to the next slide in the show
     */
    el.goToNextSlide = function(){
      // if infiniteLoop is false and last page is showing, disregard call
      if (!slider.settings.infiniteLoop && slider.active.last) return;
      var pagerIndex = parseInt(slider.active.index) + 1;
      el.goToSlide(pagerIndex, 'next');
    }

    /**
     * Transitions to the prev slide in the show
     */
    el.goToPrevSlide = function(){
      // if infiniteLoop is false and last page is showing, disregard call
      if (!slider.settings.infiniteLoop && slider.active.index == 0) return;
      var pagerIndex = parseInt(slider.active.index) - 1;
      el.goToSlide(pagerIndex, 'prev');
    }

    /**
     * Starts the auto show
     *
     * @param preventControlUpdate (boolean)
     *  - if true, auto controls state will not be updated
     */
    el.startAuto = function(preventControlUpdate){
      // if an interval already exists, disregard call
      if(slider.interval) return;
      // create an interval
      slider.interval = setInterval(function(){
        slider.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
      }, slider.settings.pause);
      // if auto controls are displayed and preventControlUpdate is not true
      if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('stop');
    }

    /**
     * Stops the auto show
     *
     * @param preventControlUpdate (boolean)
     *  - if true, auto controls state will not be updated
     */
    el.stopAuto = function(preventControlUpdate){
      // if no interval exists, disregard call
      if(!slider.interval) return;
      // clear the interval
      clearInterval(slider.interval);
      slider.interval = null;
      // if auto controls are displayed and preventControlUpdate is not true
      if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('start');
    }

    /**
     * Returns current slide index (zero-based)
     */
    el.getCurrentSlide = function(){
      return slider.active.index;
    }

    /**
     * Returns number of slides in show
     */
    el.getSlideCount = function(){
      return slider.children.length;
    }

    /**
     * Update all dynamic slider elements
     */
    el.redrawSlider = function(){
      // resize all children in ratio to new screen size
      slider.children.add(el.find('.bx-clone')).outerWidth(getSlideWidth());
      // adjust the height
      slider.viewport.css('height', getViewportHeight());
      // update the slide position
      if(!slider.settings.ticker) setSlidePosition();
      // if active.last was true before the screen resize, we want
      // to keep it last no matter what screen size we end on
      if (slider.active.last) slider.active.index = getPagerQty() - 1;
      // if the active index (page) no longer exists due to the resize, simply set the index as last
      if (slider.active.index >= getPagerQty()) slider.active.last = true;
      // if a pager is being displayed and a custom pager is not being used, update it
      if(slider.settings.pager && !slider.settings.pagerCustom){
        populatePager();
        updatePagerActive(slider.active.index);
      }
    }

    /**
     * Destroy the current instance of the slider (revert everything back to original state)
     */
    el.destroySlider = function(){
      // don't do anything if slider has already been destroyed
      if(!slider.initialized) return;
      slider.initialized = false;
      $('.bx-clone', this).remove();
      slider.children.each(function() {
        $(this).data("origStyle") != undefined ? $(this).attr("style", $(this).data("origStyle")) : $(this).removeAttr('style');
      });
      $(this).data("origStyle") != undefined ? this.attr("style", $(this).data("origStyle")) : $(this).removeAttr('style');
      $(this).unwrap().unwrap();
      if(slider.controls.el) slider.controls.el.remove();
      if(slider.controls.next) slider.controls.next.remove();
      if(slider.controls.prev) slider.controls.prev.remove();
      if(slider.pagerEl) slider.pagerEl.remove();
      $('.bx-caption', this).remove();
      if(slider.controls.autoEl) slider.controls.autoEl.remove();
      clearInterval(slider.interval);
      if(slider.settings.responsive) $(window).unbind('resize', resizeWindow);
    }

    /**
     * Reload the slider (revert all DOM changes, and re-initialize)
     */
    el.reloadSlider = function(settings){
      if (settings != undefined) options = settings;
      el.destroySlider();
      init();
    }

    init();

    // returns the current jQuery object
    return this;
  }

})(jQuery);


/*!
 * fancyBox - jQuery Plugin
 * version: 2.1.5 (Fri, 14 Jun 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */

(function (window, document, $, undefined) {
  "use strict";

  var H = $("html"),
    W = $(window),
    D = $(document),
    F = $.fancybox = function () {
      F.open.apply( this, arguments );
    },
    IE =  navigator.userAgent.match(/msie/i),
    didUpdate = null,
    isTouch   = document.createTouch !== undefined,

    isQuery = function(obj) {
      return obj && obj.hasOwnProperty && obj instanceof $;
    },
    isString = function(str) {
      return str && $.type(str) === "string";
    },
    isPercentage = function(str) {
      return isString(str) && str.indexOf('%') > 0;
    },
    isScrollable = function(el) {
      return (el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
    },
    getScalar = function(orig, dim) {
      var value = parseInt(orig, 10) || 0;

      if (dim && isPercentage(orig)) {
        value = F.getViewport()[ dim ] / 100 * value;
      }

      return Math.ceil(value);
    },
    getValue = function(value, dim) {
      return getScalar(value, dim) + 'px';
    };

  $.extend(F, {
    // The current version of fancyBox
    version: '2.1.5',

    defaults: {
      padding : 15,
      margin  : 20,

      width     : 800,
      height    : 600,
      minWidth  : 100,
      minHeight : 100,
      maxWidth  : 9999,
      maxHeight : 9999,
      pixelRatio: 1, // Set to 2 for retina display support

      autoSize   : true,
      autoHeight : false,
      autoWidth  : false,

      autoResize  : true,
      autoCenter  : !isTouch,
      fitToView   : true,
      aspectRatio : false,
      topRatio    : 0.5,
      leftRatio   : 0.5,

      scrolling : 'auto', // 'auto', 'yes' or 'no'
      wrapCSS   : '',

      arrows     : true,
      closeBtn   : true,
      closeClick : false,
      nextClick  : false,
      mouseWheel : true,
      autoPlay   : false,
      playSpeed  : 3000,
      preload    : 3,
      modal      : false,
      loop       : true,

      ajax  : {
        dataType : 'html',
        headers  : { 'X-fancyBox': true }
      },
      iframe : {
        scrolling : 'auto',
        preload   : true
      },
      swf : {
        wmode: 'transparent',
        allowfullscreen   : 'true',
        allowscriptaccess : 'always'
      },

      keys  : {
        next : {
          13 : 'left', // enter
          34 : 'up',   // page down
          39 : 'left', // right arrow
          40 : 'up'    // down arrow
        },
        prev : {
          8  : 'right',  // backspace
          33 : 'down',   // page up
          37 : 'right',  // left arrow
          38 : 'down'    // up arrow
        },
        close  : [27], // escape key
        play   : [32], // space - start/stop slideshow
        toggle : [70]  // letter "f" - toggle fullscreen
      },

      direction : {
        next : 'left',
        prev : 'right'
      },

      scrollOutside  : true,

      // Override some properties
      index   : 0,
      type    : null,
      href    : null,
      content : null,
      title   : null,

      // HTML templates
      tpl: {
        wrap     : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
        image    : '<img class="fancybox-image" src="{href}" alt="" />',
        iframe   : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
        error    : '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
        closeBtn : '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
        next     : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
        prev     : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
      },

      // Properties for each animation type
      // Opening fancyBox
      openEffect  : 'fade', // 'elastic', 'fade' or 'none'
      openSpeed   : 250,
      openEasing  : 'swing',
      openOpacity : true,
      openMethod  : 'zoomIn',

      // Closing fancyBox
      closeEffect  : 'fade', // 'elastic', 'fade' or 'none'
      closeSpeed   : 250,
      closeEasing  : 'swing',
      closeOpacity : true,
      closeMethod  : 'zoomOut',

      // Changing next gallery item
      nextEffect : 'elastic', // 'elastic', 'fade' or 'none'
      nextSpeed  : 250,
      nextEasing : 'swing',
      nextMethod : 'changeIn',

      // Changing previous gallery item
      prevEffect : 'elastic', // 'elastic', 'fade' or 'none'
      prevSpeed  : 250,
      prevEasing : 'swing',
      prevMethod : 'changeOut',

      // Enable default helpers
      helpers : {
        overlay : true,
        title   : true
      },

      // Callbacks
      onCancel     : $.noop, // If canceling
      beforeLoad   : $.noop, // Before loading
      afterLoad    : $.noop, // After loading
      beforeShow   : $.noop, // Before changing in current item
      afterShow    : $.noop, // After opening
      beforeChange : $.noop, // Before changing gallery item
      beforeClose  : $.noop, // Before closing
      afterClose   : $.noop  // After closing
    },

    //Current state
    group    : {}, // Selected group
    opts     : {}, // Group options
    previous : null,  // Previous element
    coming   : null,  // Element being loaded
    current  : null,  // Currently loaded element
    isActive : false, // Is activated
    isOpen   : false, // Is currently open
    isOpened : false, // Have been fully opened at least once

    wrap  : null,
    skin  : null,
    outer : null,
    inner : null,

    player : {
      timer    : null,
      isActive : false
    },

    // Loaders
    ajaxLoad   : null,
    imgPreload : null,

    // Some collections
    transitions : {},
    helpers     : {},

    /*
     *  Static methods
     */

    open: function (group, opts) {
      if (!group) {
        return;
      }

      if (!$.isPlainObject(opts)) {
        opts = {};
      }

      // Close if already active
      if (false === F.close(true)) {
        return;
      }

      // Normalize group
      if (!$.isArray(group)) {
        group = isQuery(group) ? $(group).get() : [group];
      }

      // Recheck if the type of each element is `object` and set content type (image, ajax, etc)
      $.each(group, function(i, element) {
        var obj = {},
          href,
          title,
          content,
          type,
          rez,
          hrefParts,
          selector;

        if ($.type(element) === "object") {
          // Check if is DOM element
          if (element.nodeType) {
            element = $(element);
          }

          if (isQuery(element)) {
            obj = {
              href    : element.data('fancybox-href') || element.attr('href'),
              title   : element.data('fancybox-title') || element.attr('title'),
              isDom   : true,
              element : element
            };

            if ($.metadata) {
              $.extend(true, obj, element.metadata());
            }

          } else {
            obj = element;
          }
        }

        href  = opts.href  || obj.href || (isString(element) ? element : null);
        title = opts.title !== undefined ? opts.title : obj.title || '';

        content = opts.content || obj.content;
        type    = content ? 'html' : (opts.type  || obj.type);

        if (!type && obj.isDom) {
          type = element.data('fancybox-type');

          if (!type) {
            rez  = element.prop('class').match(/fancybox\.(\w+)/);
            type = rez ? rez[1] : null;
          }
        }

        if (isString(href)) {
          // Try to guess the content type
          if (!type) {
            if (F.isImage(href)) {
              type = 'image';

            } else if (F.isSWF(href)) {
              type = 'swf';

            } else if (href.charAt(0) === '#') {
              type = 'inline';

            } else if (isString(element)) {
              type    = 'html';
              content = element;
            }
          }

          // Split url into two pieces with source url and content selector, e.g,
          // "/mypage.html #my_id" will load "/mypage.html" and display element having id "my_id"
          if (type === 'ajax') {
            hrefParts = href.split(/\s+/, 2);
            href      = hrefParts.shift();
            selector  = hrefParts.shift();
          }
        }

        if (!content) {
          if (type === 'inline') {
            if (href) {
              content = $( isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href ); //strip for ie7

            } else if (obj.isDom) {
              content = element;
            }

          } else if (type === 'html') {
            content = href;

          } else if (!type && !href && obj.isDom) {
            type    = 'inline';
            content = element;
          }
        }

        $.extend(obj, {
          href     : href,
          type     : type,
          content  : content,
          title    : title,
          selector : selector
        });

        group[ i ] = obj;
      });

      // Extend the defaults
      F.opts = $.extend(true, {}, F.defaults, opts);

      // All options are merged recursive except keys
      if (opts.keys !== undefined) {
        F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false;
      }

      F.group = group;

      return F._start(F.opts.index);
    },

    // Cancel image loading or abort ajax request
    cancel: function () {
      var coming = F.coming;

      if (!coming || false === F.trigger('onCancel')) {
        return;
      }

      F.hideLoading();

      if (F.ajaxLoad) {
        F.ajaxLoad.abort();
      }

      F.ajaxLoad = null;

      if (F.imgPreload) {
        F.imgPreload.onload = F.imgPreload.onerror = null;
      }

      if (coming.wrap) {
        coming.wrap.stop(true, true).trigger('onReset').remove();
      }

      F.coming = null;

      // If the first item has been canceled, then clear everything
      if (!F.current) {
        F._afterZoomOut( coming );
      }
    },

    // Start closing animation if is open; remove immediately if opening/closing
    close: function (event) {
      F.cancel();

      if (false === F.trigger('beforeClose')) {
        return;
      }

      F.unbindEvents();

      if (!F.isActive) {
        return;
      }

      if (!F.isOpen || event === true) {
        $('.fancybox-wrap').stop(true).trigger('onReset').remove();

        F._afterZoomOut();

      } else {
        F.isOpen = F.isOpened = false;
        F.isClosing = true;

        $('.fancybox-item, .fancybox-nav').remove();

        F.wrap.stop(true, true).removeClass('fancybox-opened');

        F.transitions[ F.current.closeMethod ]();
      }
    },

    // Manage slideshow:
    //   $.fancybox.play(); - toggle slideshow
    //   $.fancybox.play( true ); - start
    //   $.fancybox.play( false ); - stop
    play: function ( action ) {
      var clear = function () {
          clearTimeout(F.player.timer);
        },
        set = function () {
          clear();

          if (F.current && F.player.isActive) {
            F.player.timer = setTimeout(F.next, F.current.playSpeed);
          }
        },
        stop = function () {
          clear();

          D.unbind('.player');

          F.player.isActive = false;

          F.trigger('onPlayEnd');
        },
        start = function () {
          if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
            F.player.isActive = true;

            D.bind({
              'onCancel.player beforeClose.player' : stop,
              'onUpdate.player'   : set,
              'beforeLoad.player' : clear
            });

            set();

            F.trigger('onPlayStart');
          }
        };

      if (action === true || (!F.player.isActive && action !== false)) {
        start();
      } else {
        stop();
      }
    },

    // Navigate to next gallery item
    next: function ( direction ) {
      var current = F.current;

      if (current) {
        if (!isString(direction)) {
          direction = current.direction.next;
        }

        F.jumpto(current.index + 1, direction, 'next');
      }
    },

    // Navigate to previous gallery item
    prev: function ( direction ) {
      var current = F.current;

      if (current) {
        if (!isString(direction)) {
          direction = current.direction.prev;
        }

        F.jumpto(current.index - 1, direction, 'prev');
      }
    },

    // Navigate to gallery item by index
    jumpto: function ( index, direction, router ) {
      var current = F.current;

      if (!current) {
        return;
      }

      index = getScalar(index);

      F.direction = direction || current.direction[ (index >= current.index ? 'next' : 'prev') ];
      F.router    = router || 'jumpto';

      if (current.loop) {
        if (index < 0) {
          index = current.group.length + (index % current.group.length);
        }

        index = index % current.group.length;
      }

      if (current.group[ index ] !== undefined) {
        F.cancel();

        F._start(index);
      }
    },

    // Center inside viewport and toggle position type to fixed or absolute if needed
    reposition: function (e, onlyAbsolute) {
      var current = F.current,
        wrap    = current ? current.wrap : null,
        pos;

      if (wrap) {
        pos = F._getPosition(onlyAbsolute);

        if (e && e.type === 'scroll') {
          delete pos.position;

          wrap.stop(true, true).animate(pos, 200);

        } else {
          wrap.css(pos);

          current.pos = $.extend({}, current.dim, pos);
        }
      }
    },

    update: function (e) {
      var type = (e && e.type),
        anyway = !type || type === 'orientationchange';

      if (anyway) {
        clearTimeout(didUpdate);

        didUpdate = null;
      }

      if (!F.isOpen || didUpdate) {
        return;
      }

      didUpdate = setTimeout(function() {
        var current = F.current;

        if (!current || F.isClosing) {
          return;
        }

        F.wrap.removeClass('fancybox-tmp');

        if (anyway || type === 'load' || (type === 'resize' && current.autoResize)) {
          F._setDimension();
        }

        if (!(type === 'scroll' && current.canShrink)) {
          F.reposition(e);
        }

        F.trigger('onUpdate');

        didUpdate = null;

      }, (anyway && !isTouch ? 0 : 300));
    },

    // Shrink content to fit inside viewport or restore if resized
    toggle: function ( action ) {
      if (F.isOpen) {
        F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;

        // Help browser to restore document dimensions
        if (isTouch) {
          F.wrap.removeAttr('style').addClass('fancybox-tmp');

          F.trigger('onUpdate');
        }

        F.update();
      }
    },

    hideLoading: function () {
      D.unbind('.loading');

      $('#fancybox-loading').remove();
    },

    showLoading: function () {
      var el, viewport;

      F.hideLoading();

      el = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo('body');

      // If user will press the escape-button, the request will be canceled
      D.bind('keydown.loading', function(e) {
        if ((e.which || e.keyCode) === 27) {
          e.preventDefault();

          F.cancel();
        }
      });

      if (!F.defaults.fixed) {
        viewport = F.getViewport();

        el.css({
          position : 'absolute',
          top  : (viewport.h * 0.5) + viewport.y,
          left : (viewport.w * 0.5) + viewport.x
        });
      }
    },

    getViewport: function () {
      var locked = (F.current && F.current.locked) || false,
        rez    = {
          x: W.scrollLeft(),
          y: W.scrollTop()
        };

      if (locked) {
        rez.w = locked[0].clientWidth;
        rez.h = locked[0].clientHeight;

      } else {
        // See http://bugs.jquery.com/ticket/6724
        rez.w = isTouch && window.innerWidth  ? window.innerWidth  : W.width();
        rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
      }

      return rez;
    },

    // Unbind the keyboard / clicking actions
    unbindEvents: function () {
      if (F.wrap && isQuery(F.wrap)) {
        F.wrap.unbind('.fb');
      }

      D.unbind('.fb');
      W.unbind('.fb');
    },

    bindEvents: function () {
      var current = F.current,
        keys;

      if (!current) {
        return;
      }

      // Changing document height on iOS devices triggers a 'resize' event,
      // that can change document height... repeating infinitely
      W.bind('orientationchange.fb' + (isTouch ? '' : ' resize.fb') + (current.autoCenter && !current.locked ? ' scroll.fb' : ''), F.update);

      keys = current.keys;

      if (keys) {
        D.bind('keydown.fb', function (e) {
          var code   = e.which || e.keyCode,
            target = e.target || e.srcElement;

          // Skip esc key if loading, because showLoading will cancel preloading
          if (code === 27 && F.coming) {
            return false;
          }

          // Ignore key combinations and key events within form elements
          if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is('[contenteditable]')))) {
            $.each(keys, function(i, val) {
              if (current.group.length > 1 && val[ code ] !== undefined) {
                F[ i ]( val[ code ] );

                e.preventDefault();
                return false;
              }

              if ($.inArray(code, val) > -1) {
                F[ i ] ();

                e.preventDefault();
                return false;
              }
            });
          }
        });
      }

      if ($.fn.mousewheel && current.mouseWheel) {
        F.wrap.bind('mousewheel.fb', function (e, delta, deltaX, deltaY) {
          var target = e.target || null,
            parent = $(target),
            canScroll = false;

          while (parent.length) {
            if (canScroll || parent.is('.fancybox-skin') || parent.is('.fancybox-wrap')) {
              break;
            }

            canScroll = isScrollable( parent[0] );
            parent    = $(parent).parent();
          }

          if (delta !== 0 && !canScroll) {
            if (F.group.length > 1 && !current.canShrink) {
              if (deltaY > 0 || deltaX > 0) {
                F.prev( deltaY > 0 ? 'down' : 'left' );

              } else if (deltaY < 0 || deltaX < 0) {
                F.next( deltaY < 0 ? 'up' : 'right' );
              }

              e.preventDefault();
            }
          }
        });
      }
    },

    trigger: function (event, o) {
      var ret, obj = o || F.coming || F.current;

      if (!obj) {
        return;
      }

      if ($.isFunction( obj[event] )) {
        ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
      }

      if (ret === false) {
        return false;
      }

      if (obj.helpers) {
        $.each(obj.helpers, function (helper, opts) {
          if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
            F.helpers[helper][event]($.extend(true, {}, F.helpers[helper].defaults, opts), obj);
          }
        });
      }

      D.trigger(event);
    },

    isImage: function (str) {
      return isString(str) && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
    },

    isSWF: function (str) {
      return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i);
    },

    _start: function (index) {
      var coming = {},
        obj,
        href,
        type,
        margin,
        padding;

      index = getScalar( index );
      obj   = F.group[ index ] || null;

      if (!obj) {
        return false;
      }

      coming = $.extend(true, {}, F.opts, obj);

      // Convert margin and padding properties to array - top, right, bottom, left
      margin  = coming.margin;
      padding = coming.padding;

      if ($.type(margin) === 'number') {
        coming.margin = [margin, margin, margin, margin];
      }

      if ($.type(padding) === 'number') {
        coming.padding = [padding, padding, padding, padding];
      }

      // 'modal' propery is just a shortcut
      if (coming.modal) {
        $.extend(true, coming, {
          closeBtn   : false,
          closeClick : false,
          nextClick  : false,
          arrows     : false,
          mouseWheel : false,
          keys       : null,
          helpers: {
            overlay : {
              closeClick : false
            }
          }
        });
      }

      // 'autoSize' property is a shortcut, too
      if (coming.autoSize) {
        coming.autoWidth = coming.autoHeight = true;
      }

      if (coming.width === 'auto') {
        coming.autoWidth = true;
      }

      if (coming.height === 'auto') {
        coming.autoHeight = true;
      }

      /*
       * Add reference to the group, so it`s possible to access from callbacks, example:
       * afterLoad : function() {
       *     this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
       * }
       */

      coming.group  = F.group;
      coming.index  = index;

      // Give a chance for callback or helpers to update coming item (type, title, etc)
      F.coming = coming;

      if (false === F.trigger('beforeLoad')) {
        F.coming = null;

        return;
      }

      type = coming.type;
      href = coming.href;

      if (!type) {
        F.coming = null;

        //If we can not determine content type then drop silently or display next/prev item if looping through gallery
        if (F.current && F.router && F.router !== 'jumpto') {
          F.current.index = index;

          return F[ F.router ]( F.direction );
        }

        return false;
      }

      F.isActive = true;

      if (type === 'image' || type === 'swf') {
        coming.autoHeight = coming.autoWidth = false;
        coming.scrolling  = 'visible';
      }

      if (type === 'image') {
        coming.aspectRatio = true;
      }

      if (type === 'iframe' && isTouch) {
        coming.scrolling = 'scroll';
      }

      // Build the neccessary markup
      coming.wrap = $(coming.tpl.wrap).addClass('fancybox-' + (isTouch ? 'mobile' : 'desktop') + ' fancybox-type-' + type + ' fancybox-tmp ' + coming.wrapCSS).appendTo( coming.parent || 'body' );

      $.extend(coming, {
        skin  : $('.fancybox-skin',  coming.wrap),
        outer : $('.fancybox-outer', coming.wrap),
        inner : $('.fancybox-inner', coming.wrap)
      });

      $.each(["Top", "Right", "Bottom", "Left"], function(i, v) {
        coming.skin.css('padding' + v, getValue(coming.padding[ i ]));
      });

      F.trigger('onReady');

      // Check before try to load; 'inline' and 'html' types need content, others - href
      if (type === 'inline' || type === 'html') {
        if (!coming.content || !coming.content.length) {
          return F._error( 'content' );
        }

      } else if (!href) {
        return F._error( 'href' );
      }

      if (type === 'image') {
        F._loadImage();

      } else if (type === 'ajax') {
        F._loadAjax();

      } else if (type === 'iframe') {
        F._loadIframe();

      } else {
        F._afterLoad();
      }
    },

    _error: function ( type ) {
      $.extend(F.coming, {
        type       : 'html',
        autoWidth  : true,
        autoHeight : true,
        minWidth   : 0,
        minHeight  : 0,
        scrolling  : 'no',
        hasError   : type,
        content    : F.coming.tpl.error
      });

      F._afterLoad();
    },

    _loadImage: function () {
      // Reset preload image so it is later possible to check "complete" property
      var img = F.imgPreload = new Image();

      img.onload = function () {
        this.onload = this.onerror = null;

        F.coming.width  = this.width / F.opts.pixelRatio;
        F.coming.height = this.height / F.opts.pixelRatio;

        F._afterLoad();
      };

      img.onerror = function () {
        this.onload = this.onerror = null;

        F._error( 'image' );
      };

      img.src = F.coming.href;

      if (img.complete !== true) {
        F.showLoading();
      }
    },

    _loadAjax: function () {
      var coming = F.coming;

      F.showLoading();

      F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
        url: coming.href,
        error: function (jqXHR, textStatus) {
          if (F.coming && textStatus !== 'abort') {
            F._error( 'ajax', jqXHR );

          } else {
            F.hideLoading();
          }
        },
        success: function (data, textStatus) {
          if (textStatus === 'success') {
            coming.content = data;

            F._afterLoad();
          }
        }
      }));
    },

    _loadIframe: function() {
      var coming = F.coming,
        iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
          .attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling)
          .attr('src', coming.href);

      // This helps IE
      $(coming.wrap).bind('onReset', function () {
        try {
          $(this).find('iframe').hide().attr('src', '//about:blank').end().empty();
        } catch (e) {}
      });

      if (coming.iframe.preload) {
        F.showLoading();

        iframe.one('load', function() {
          $(this).data('ready', 1);

          // iOS will lose scrolling if we resize
          if (!isTouch) {
            $(this).bind('load.fb', F.update);
          }

          // Without this trick:
          //   - iframe won't scroll on iOS devices
          //   - IE7 sometimes displays empty iframe
          $(this).parents('.fancybox-wrap').width('100%').removeClass('fancybox-tmp').show();

          F._afterLoad();
        });
      }

      coming.content = iframe.appendTo( coming.inner );

      if (!coming.iframe.preload) {
        F._afterLoad();
      }
    },

    _preloadImages: function() {
      var group   = F.group,
        current = F.current,
        len     = group.length,
        cnt     = current.preload ? Math.min(current.preload, len - 1) : 0,
        item,
        i;

      for (i = 1; i <= cnt; i += 1) {
        item = group[ (current.index + i ) % len ];

        if (item.type === 'image' && item.href) {
          new Image().src = item.href;
        }
      }
    },

    _afterLoad: function () {
      var coming   = F.coming,
        previous = F.current,
        placeholder = 'fancybox-placeholder',
        current,
        content,
        type,
        scrolling,
        href,
        embed;

      F.hideLoading();

      if (!coming || F.isActive === false) {
        return;
      }

      if (false === F.trigger('afterLoad', coming, previous)) {
        coming.wrap.stop(true).trigger('onReset').remove();

        F.coming = null;

        return;
      }

      if (previous) {
        F.trigger('beforeChange', previous);

        previous.wrap.stop(true).removeClass('fancybox-opened')
          .find('.fancybox-item, .fancybox-nav')
          .remove();
      }

      F.unbindEvents();

      current   = coming;
      content   = coming.content;
      type      = coming.type;
      scrolling = coming.scrolling;

      $.extend(F, {
        wrap  : current.wrap,
        skin  : current.skin,
        outer : current.outer,
        inner : current.inner,
        current  : current,
        previous : previous
      });

      href = current.href;

      switch (type) {
        case 'inline':
        case 'ajax':
        case 'html':
          if (current.selector) {
            content = $('<div>').html(content).find(current.selector);

          } else if (isQuery(content)) {
            if (!content.data(placeholder)) {
              content.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter( content ).hide() );
            }

            content = content.show().detach();

            current.wrap.bind('onReset', function () {
              if ($(this).find(content).length) {
                content.hide().replaceAll( content.data(placeholder) ).data(placeholder, false);
              }
            });
          }
        break;

        case 'image':
          content = current.tpl.image.replace('{href}', href);
        break;

        case 'swf':
          content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
          embed   = '';

          $.each(current.swf, function(name, val) {
            content += '<param name="' + name + '" value="' + val + '"></param>';
            embed   += ' ' + name + '="' + val + '"';
          });

          content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + '></embed></object>';
        break;
      }

      if (!(isQuery(content) && content.parent().is(current.inner))) {
        current.inner.append( content );
      }

      // Give a chance for helpers or callbacks to update elements
      F.trigger('beforeShow');

      // Set scrolling before calculating dimensions
      current.inner.css('overflow', scrolling === 'yes' ? 'scroll' : (scrolling === 'no' ? 'hidden' : scrolling));

      // Set initial dimensions and start position
      F._setDimension();

      F.reposition();

      F.isOpen = false;
      F.coming = null;

      F.bindEvents();

      if (!F.isOpened) {
        $('.fancybox-wrap').not( current.wrap ).stop(true).trigger('onReset').remove();

      } else if (previous.prevMethod) {
        F.transitions[ previous.prevMethod ]();
      }

      F.transitions[ F.isOpened ? current.nextMethod : current.openMethod ]();

      F._preloadImages();
    },

    _setDimension: function () {
      var viewport   = F.getViewport(),
        steps      = 0,
        canShrink  = false,
        canExpand  = false,
        wrap       = F.wrap,
        skin       = F.skin,
        inner      = F.inner,
        current    = F.current,
        width      = current.width,
        height     = current.height,
        minWidth   = current.minWidth,
        minHeight  = current.minHeight,
        maxWidth   = current.maxWidth,
        maxHeight  = current.maxHeight,
        scrolling  = current.scrolling,
        scrollOut  = current.scrollOutside ? current.scrollbarWidth : 0,
        margin     = current.margin,
        wMargin    = getScalar(margin[1] + margin[3]),
        hMargin    = getScalar(margin[0] + margin[2]),
        wPadding,
        hPadding,
        wSpace,
        hSpace,
        origWidth,
        origHeight,
        origMaxWidth,
        origMaxHeight,
        ratio,
        width_,
        height_,
        maxWidth_,
        maxHeight_,
        iframe,
        body;

      // Reset dimensions so we could re-check actual size
      wrap.add(skin).add(inner).width('auto').height('auto').removeClass('fancybox-tmp');

      wPadding = getScalar(skin.outerWidth(true)  - skin.width());
      hPadding = getScalar(skin.outerHeight(true) - skin.height());

      // Any space between content and viewport (margin, padding, border, title)
      wSpace = wMargin + wPadding;
      hSpace = hMargin + hPadding;

      origWidth  = isPercentage(width)  ? (viewport.w - wSpace) * getScalar(width)  / 100 : width;
      origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;

      if (current.type === 'iframe') {
        iframe = current.content;

        if (current.autoHeight && iframe.data('ready') === 1) {
          try {
            if (iframe[0].contentWindow.document.location) {
              inner.width( origWidth ).height(9999);

              body = iframe.contents().find('body');

              if (scrollOut) {
                body.css('overflow-x', 'hidden');
              }

              origHeight = body.outerHeight(true);
            }

          } catch (e) {}
        }

      } else if (current.autoWidth || current.autoHeight) {
        inner.addClass( 'fancybox-tmp' );

        // Set width or height in case we need to calculate only one dimension
        if (!current.autoWidth) {
          inner.width( origWidth );
        }

        if (!current.autoHeight) {
          inner.height( origHeight );
        }

        if (current.autoWidth) {
          origWidth = inner.width();
        }

        if (current.autoHeight) {
          origHeight = inner.height();
        }

        inner.removeClass( 'fancybox-tmp' );
      }

      width  = getScalar( origWidth );
      height = getScalar( origHeight );

      ratio  = origWidth / origHeight;

      // Calculations for the content
      minWidth  = getScalar(isPercentage(minWidth) ? getScalar(minWidth, 'w') - wSpace : minWidth);
      maxWidth  = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, 'w') - wSpace : maxWidth);

      minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, 'h') - hSpace : minHeight);
      maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, 'h') - hSpace : maxHeight);

      // These will be used to determine if wrap can fit in the viewport
      origMaxWidth  = maxWidth;
      origMaxHeight = maxHeight;

      if (current.fitToView) {
        maxWidth  = Math.min(viewport.w - wSpace, maxWidth);
        maxHeight = Math.min(viewport.h - hSpace, maxHeight);
      }

      maxWidth_  = viewport.w - wMargin;
      maxHeight_ = viewport.h - hMargin;

      if (current.aspectRatio) {
        if (width > maxWidth) {
          width  = maxWidth;
          height = getScalar(width / ratio);
        }

        if (height > maxHeight) {
          height = maxHeight;
          width  = getScalar(height * ratio);
        }

        if (width < minWidth) {
          width  = minWidth;
          height = getScalar(width / ratio);
        }

        if (height < minHeight) {
          height = minHeight;
          width  = getScalar(height * ratio);
        }

      } else {
        width = Math.max(minWidth, Math.min(width, maxWidth));

        if (current.autoHeight && current.type !== 'iframe') {
          inner.width( width );

          height = inner.height();
        }

        height = Math.max(minHeight, Math.min(height, maxHeight));
      }

      // Try to fit inside viewport (including the title)
      if (current.fitToView) {
        inner.width( width ).height( height );

        wrap.width( width + wPadding );

        // Real wrap dimensions
        width_  = wrap.width();
        height_ = wrap.height();

        if (current.aspectRatio) {
          while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
            if (steps++ > 19) {
              break;
            }

            height = Math.max(minHeight, Math.min(maxHeight, height - 10));
            width  = getScalar(height * ratio);

            if (width < minWidth) {
              width  = minWidth;
              height = getScalar(width / ratio);
            }

            if (width > maxWidth) {
              width  = maxWidth;
              height = getScalar(width / ratio);
            }

            inner.width( width ).height( height );

            wrap.width( width + wPadding );

            width_  = wrap.width();
            height_ = wrap.height();
          }

        } else {
          width  = Math.max(minWidth,  Math.min(width,  width  - (width_  - maxWidth_)));
          height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
        }
      }

      if (scrollOut && scrolling === 'auto' && height < origHeight && (width + wPadding + scrollOut) < maxWidth_) {
        width += scrollOut;
      }

      inner.width( width ).height( height );

      wrap.width( width + wPadding );

      width_  = wrap.width();
      height_ = wrap.height();

      canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
      canExpand = current.aspectRatio ? (width < origMaxWidth && height < origMaxHeight && width < origWidth && height < origHeight) : ((width < origMaxWidth || height < origMaxHeight) && (width < origWidth || height < origHeight));

      $.extend(current, {
        dim : {
          width : getValue( width_ ),
          height  : getValue( height_ )
        },
        origWidth  : origWidth,
        origHeight : origHeight,
        canShrink  : canShrink,
        canExpand  : canExpand,
        wPadding   : wPadding,
        hPadding   : hPadding,
        wrapSpace  : height_ - skin.outerHeight(true),
        skinSpace  : skin.height() - height
      });

      if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
        inner.height('auto');
      }
    },

    _getPosition: function (onlyAbsolute) {
      var current  = F.current,
        viewport = F.getViewport(),
        margin   = current.margin,
        width    = F.wrap.width()  + margin[1] + margin[3],
        height   = F.wrap.height() + margin[0] + margin[2],
        rez      = {
          position: 'absolute',
          top  : margin[0],
          left : margin[3]
        };

      if (current.autoCenter && current.fixed && !onlyAbsolute && height <= viewport.h && width <= viewport.w) {
        rez.position = 'fixed';

      } else if (!current.locked) {
        rez.top  += viewport.y;
        rez.left += viewport.x;
      }

      rez.top  = getValue(Math.max(rez.top,  rez.top  + ((viewport.h - height) * current.topRatio)));
      rez.left = getValue(Math.max(rez.left, rez.left + ((viewport.w - width)  * current.leftRatio)));

      return rez;
    },

    _afterZoomIn: function () {
      var current = F.current;

      if (!current) {
        return;
      }

      F.isOpen = F.isOpened = true;

      F.wrap.css('overflow', 'visible').addClass('fancybox-opened');

      F.update();

      // Assign a click event
      if ( current.closeClick || (current.nextClick && F.group.length > 1) ) {
        F.inner.css('cursor', 'pointer').bind('click.fb', function(e) {
          if (!$(e.target).is('a') && !$(e.target).parent().is('a')) {
            e.preventDefault();

            F[ current.closeClick ? 'close' : 'next' ]();
          }
        });
      }

      // Create a close button
      if (current.closeBtn) {
        $(current.tpl.closeBtn).appendTo(F.skin).bind('click.fb', function(e) {
          e.preventDefault();

          F.close();
        });
      }

      // Create navigation arrows
      if (current.arrows && F.group.length > 1) {
        if (current.loop || current.index > 0) {
          $(current.tpl.prev).appendTo(F.outer).bind('click.fb', F.prev);
        }

        if (current.loop || current.index < F.group.length - 1) {
          $(current.tpl.next).appendTo(F.outer).bind('click.fb', F.next);
        }
      }

      F.trigger('afterShow');

      // Stop the slideshow if this is the last item
      if (!current.loop && current.index === current.group.length - 1) {
        F.play( false );

      } else if (F.opts.autoPlay && !F.player.isActive) {
        F.opts.autoPlay = false;

        F.play();
      }
    },

    _afterZoomOut: function ( obj ) {
      obj = obj || F.current;

      $('.fancybox-wrap').trigger('onReset').remove();

      $.extend(F, {
        group  : {},
        opts   : {},
        router : false,
        current   : null,
        isActive  : false,
        isOpened  : false,
        isOpen    : false,
        isClosing : false,
        wrap   : null,
        skin   : null,
        outer  : null,
        inner  : null
      });

      F.trigger('afterClose', obj);
    }
  });

  /*
   *  Default transitions
   */

  F.transitions = {
    getOrigPosition: function () {
      var current  = F.current,
        element  = current.element,
        orig     = current.orig,
        pos      = {},
        width    = 50,
        height   = 50,
        hPadding = current.hPadding,
        wPadding = current.wPadding,
        viewport = F.getViewport();

      if (!orig && current.isDom && element.is(':visible')) {
        orig = element.find('img:first');

        if (!orig.length) {
          orig = element;
        }
      }

      if (isQuery(orig)) {
        pos = orig.offset();

        if (orig.is('img')) {
          width  = orig.outerWidth();
          height = orig.outerHeight();
        }

      } else {
        pos.top  = viewport.y + (viewport.h - height) * current.topRatio;
        pos.left = viewport.x + (viewport.w - width)  * current.leftRatio;
      }

      if (F.wrap.css('position') === 'fixed' || current.locked) {
        pos.top  -= viewport.y;
        pos.left -= viewport.x;
      }

      pos = {
        top     : getValue(pos.top  - hPadding * current.topRatio),
        left    : getValue(pos.left - wPadding * current.leftRatio),
        width   : getValue(width  + wPadding),
        height  : getValue(height + hPadding)
      };

      return pos;
    },

    step: function (now, fx) {
      var ratio,
        padding,
        value,
        prop       = fx.prop,
        current    = F.current,
        wrapSpace  = current.wrapSpace,
        skinSpace  = current.skinSpace;

      if (prop === 'width' || prop === 'height') {
        ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);

        if (F.isClosing) {
          ratio = 1 - ratio;
        }

        padding = prop === 'width' ? current.wPadding : current.hPadding;
        value   = now - padding;

        F.skin[ prop ](  getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) ) );
        F.inner[ prop ]( getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) - (skinSpace * ratio) ) );
      }
    },

    zoomIn: function () {
      var current  = F.current,
        startPos = current.pos,
        effect   = current.openEffect,
        elastic  = effect === 'elastic',
        endPos   = $.extend({opacity : 1}, startPos);

      // Remove "position" property that breaks older IE
      delete endPos.position;

      if (elastic) {
        startPos = this.getOrigPosition();

        if (current.openOpacity) {
          startPos.opacity = 0.1;
        }

      } else if (effect === 'fade') {
        startPos.opacity = 0.1;
      }

      F.wrap.css(startPos).animate(endPos, {
        duration : effect === 'none' ? 0 : current.openSpeed,
        easing   : current.openEasing,
        step     : elastic ? this.step : null,
        complete : F._afterZoomIn
      });
    },

    zoomOut: function () {
      var current  = F.current,
        effect   = current.closeEffect,
        elastic  = effect === 'elastic',
        endPos   = {opacity : 0.1};

      if (elastic) {
        endPos = this.getOrigPosition();

        if (current.closeOpacity) {
          endPos.opacity = 0.1;
        }
      }

      F.wrap.animate(endPos, {
        duration : effect === 'none' ? 0 : current.closeSpeed,
        easing   : current.closeEasing,
        step     : elastic ? this.step : null,
        complete : F._afterZoomOut
      });
    },

    changeIn: function () {
      var current   = F.current,
        effect    = current.nextEffect,
        startPos  = current.pos,
        endPos    = { opacity : 1 },
        direction = F.direction,
        distance  = 200,
        field;

      startPos.opacity = 0.1;

      if (effect === 'elastic') {
        field = direction === 'down' || direction === 'up' ? 'top' : 'left';

        if (direction === 'down' || direction === 'right') {
          startPos[ field ] = getValue(getScalar(startPos[ field ]) - distance);
          endPos[ field ]   = '+=' + distance + 'px';

        } else {
          startPos[ field ] = getValue(getScalar(startPos[ field ]) + distance);
          endPos[ field ]   = '-=' + distance + 'px';
        }
      }

      // Workaround for http://bugs.jquery.com/ticket/12273
      if (effect === 'none') {
        F._afterZoomIn();

      } else {
        F.wrap.css(startPos).animate(endPos, {
          duration : current.nextSpeed,
          easing   : current.nextEasing,
          complete : F._afterZoomIn
        });
      }
    },

    changeOut: function () {
      var previous  = F.previous,
        effect    = previous.prevEffect,
        endPos    = { opacity : 0.1 },
        direction = F.direction,
        distance  = 200;

      if (effect === 'elastic') {
        endPos[ direction === 'down' || direction === 'up' ? 'top' : 'left' ] = ( direction === 'up' || direction === 'left' ? '-' : '+' ) + '=' + distance + 'px';
      }

      previous.wrap.animate(endPos, {
        duration : effect === 'none' ? 0 : previous.prevSpeed,
        easing   : previous.prevEasing,
        complete : function () {
          $(this).trigger('onReset').remove();
        }
      });
    }
  };

  /*
   *  Overlay helper
   */

  F.helpers.overlay = {
    defaults : {
      closeClick : true,      // if true, fancyBox will be closed when user clicks on the overlay
      speedOut   : 200,       // duration of fadeOut animation
      showEarly  : true,      // indicates if should be opened immediately or wait until the content is ready
      css        : {},        // custom CSS properties
      locked     : !isTouch,  // if true, the content will be locked into overlay
      fixed      : true       // if false, the overlay CSS position property will not be set to "fixed"
    },

    overlay : null,      // current handle
    fixed   : false,     // indicates if the overlay has position "fixed"
    el      : $('html'), // element that contains "the lock"

    // Public methods
    create : function(opts) {
      opts = $.extend({}, this.defaults, opts);

      if (this.overlay) {
        this.close();
      }

      this.overlay = $('<div class="fancybox-overlay"></div>').appendTo( F.coming ? F.coming.parent : opts.parent );
      this.fixed   = false;

      if (opts.fixed && F.defaults.fixed) {
        this.overlay.addClass('fancybox-overlay-fixed');

        this.fixed = true;
      }
    },

    open : function(opts) {
      var that = this;

      opts = $.extend({}, this.defaults, opts);

      if (this.overlay) {
        this.overlay.unbind('.overlay').width('auto').height('auto');

      } else {
        this.create(opts);
      }

      if (!this.fixed) {
        W.bind('resize.overlay', $.proxy( this.update, this) );

        this.update();
      }

      if (opts.closeClick) {
        this.overlay.bind('click.overlay', function(e) {
          if ($(e.target).hasClass('fancybox-overlay')) {
            if (F.isActive) {
              F.close();
            } else {
              that.close();
            }

            return false;
          }
        });
      }

      this.overlay.css( opts.css ).show();
    },

    close : function() {
      var scrollV, scrollH;

      W.unbind('resize.overlay');

      if (this.el.hasClass('fancybox-lock')) {
        $('.fancybox-margin').removeClass('fancybox-margin');

        scrollV = W.scrollTop();
        scrollH = W.scrollLeft();

        this.el.removeClass('fancybox-lock');

        W.scrollTop( scrollV ).scrollLeft( scrollH );
      }

      $('.fancybox-overlay').remove().hide();

      $.extend(this, {
        overlay : null,
        fixed   : false
      });
    },

    // Private, callbacks

    update : function () {
      var width = '100%', offsetWidth;

      // Reset width/height so it will not mess
      this.overlay.width(width).height('100%');

      // jQuery does not return reliable result for IE
      if (IE) {
        offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

        if (D.width() > offsetWidth) {
          width = D.width();
        }

      } else if (D.width() > W.width()) {
        width = D.width();
      }

      this.overlay.width(width).height(D.height());
    },

    // This is where we can manipulate DOM, because later it would cause iframes to reload
    onReady : function (opts, obj) {
      var overlay = this.overlay;

      $('.fancybox-overlay').stop(true, true);

      if (!overlay) {
        this.create(opts);
      }

      if (opts.locked && this.fixed && obj.fixed) {
        if (!overlay) {
          this.margin = D.height() > W.height() ? $('html').css('margin-right').replace("px", "") : false;
        }

        obj.locked = this.overlay.append( obj.wrap );
        obj.fixed  = false;
      }

      if (opts.showEarly === true) {
        this.beforeShow.apply(this, arguments);
      }
    },

    beforeShow : function(opts, obj) {
      var scrollV, scrollH;

      if (obj.locked) {
        if (this.margin !== false) {
          $('*').filter(function(){
            return ($(this).css('position') === 'fixed' && !$(this).hasClass("fancybox-overlay") && !$(this).hasClass("fancybox-wrap") );
          }).addClass('fancybox-margin');

          this.el.addClass('fancybox-margin');
        }

        scrollV = W.scrollTop();
        scrollH = W.scrollLeft();

        this.el.addClass('fancybox-lock');

        W.scrollTop( scrollV ).scrollLeft( scrollH );
      }

      this.open(opts);
    },

    onUpdate : function() {
      if (!this.fixed) {
        this.update();
      }
    },

    afterClose: function (opts) {
      // Remove overlay if exists and fancyBox is not opening
      // (e.g., it is not being open using afterClose callback)
      //if (this.overlay && !F.isActive) {
      if (this.overlay && !F.coming) {
        this.overlay.fadeOut(opts.speedOut, $.proxy( this.close, this ));
      }
    }
  };

  /*
   *  Title helper
   */

  F.helpers.title = {
    defaults : {
      type     : 'float', // 'float', 'inside', 'outside' or 'over',
      position : 'bottom' // 'top' or 'bottom'
    },

    beforeShow: function (opts) {
      var current = F.current,
        text    = current.title,
        type    = opts.type,
        title,
        target;

      if ($.isFunction(text)) {
        text = text.call(current.element, current);
      }

      if (!isString(text) || $.trim(text) === '') {
        return;
      }

      title = $('<div class="fancybox-title fancybox-title-' + type + '-wrap">' + text + '</div>');

      switch (type) {
        case 'inside':
          target = F.skin;
        break;

        case 'outside':
          target = F.wrap;
        break;

        case 'over':
          target = F.inner;
        break;

        default: // 'float'
          target = F.skin;

          title.appendTo('body');

          if (IE) {
            title.width( title.width() );
          }

          title.wrapInner('<span class="child"></span>');

          //Increase bottom margin so this title will also fit into viewport
          F.current.margin[2] += Math.abs( getScalar(title.css('margin-bottom')) );
        break;
      }

      title[ (opts.position === 'top' ? 'prependTo'  : 'appendTo') ](target);
    }
  };

  // jQuery plugin initialization
  $.fn.fancybox = function (options) {
    var index,
      that     = $(this),
      selector = this.selector || '',
      run      = function(e) {
        var what = $(this).blur(), idx = index, relType, relVal;

        if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !what.is('.fancybox-wrap')) {
          relType = options.groupAttr || 'data-fancybox-group';
          relVal  = what.attr(relType);

          if (!relVal) {
            relType = 'rel';
            relVal  = what.get(0)[ relType ];
          }

          if (relVal && relVal !== '' && relVal !== 'nofollow') {
            what = selector.length ? $(selector) : that;
            what = what.filter('[' + relType + '="' + relVal + '"]');
            idx  = what.index(this);
          }

          options.index = idx;

          // Stop an event from bubbling if everything is fine
          if (F.open(what, options) !== false) {
            e.preventDefault();
          }
        }
      };

    options = options || {};
    index   = options.index || 0;

    if (!selector || options.live === false) {
      that.unbind('click.fb-start').bind('click.fb-start', run);

    } else {
      D.undelegate(selector, 'click.fb-start').delegate(selector + ":not('.fancybox-item, .fancybox-nav')", 'click.fb-start', run);
    }

    this.filter('[data-fancybox-start=1]').trigger('click');

    return this;
  };

  // Tests that need a body at doc ready
  D.ready(function() {
    var w1, w2;

    if ( $.scrollbarWidth === undefined ) {
      // http://benalman.com/projects/jquery-misc-plugins/#scrollbarwidth
      $.scrollbarWidth = function() {
        var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
          child  = parent.children(),
          width  = child.innerWidth() - child.height( 99 ).innerWidth();

        parent.remove();

        return width;
      };
    }

    if ( $.support.fixedPosition === undefined ) {
      $.support.fixedPosition = (function() {
        var elem  = $('<div style="position:fixed;top:20px;"></div>').appendTo('body'),
          fixed = ( elem[0].offsetTop === 20 || elem[0].offsetTop === 15 );

        elem.remove();

        return fixed;
      }());
    }

    $.extend(F.defaults, {
      scrollbarWidth : $.scrollbarWidth(),
      fixed  : $.support.fixedPosition,
      parent : $('body')
    });

    //Get real width of page scroll-bar
    w1 = $(window).width();

    H.addClass('fancybox-lock-test');

    w2 = $(window).width();

    H.removeClass('fancybox-lock-test');

    $("<style type='text/css'>.fancybox-margin{margin-right:" + (w2 - w1) + "px;}</style>").appendTo("head");
  });

}(window, document, jQuery));


/*
 * jQuery FlexSlider v2.2.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;
(function ($) {

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);

    // making variables public
    slider.vars = $.extend({}, $.flexslider.defaults, options);

    var namespace = slider.vars.namespace,
        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
        // depricating this idea, as devices are being released with both of these events
        //eventType = (touch) ? "touchend" : "click",
        eventType = "click touchend MSPointerUp",
        watchedEvent = "",
        watchedEventClearTimer,
        vertical = slider.vars.direction === "vertical",
        reverse = slider.vars.reverse,
        carousel = (slider.vars.itemWidth > 0),
        fade = slider.vars.animation === "fade",
        asNav = slider.vars.asNavFor !== "",
        methods = {},
        focused = true;

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Private slider methods
    methods = {
      init: function() {
        slider.animating = false;
        // Get current slide and make sure it is a number
        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0) );
        if ( isNaN( slider.currentSlide ) ) slider.currentSlide = 0;
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
        slider.slides = $(slider.vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(slider.vars.sync).length > 0;
        // SLIDE:
        if (slider.vars.animation === "slide") slider.vars.animation = "swing";
        slider.prop = (vertical) ? "top" : "marginLeft";
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        slider.stopped = false;
        //PAUSE WHEN INVISIBLE
        slider.started = false;
        slider.startTimeout = null;
        // TOUCH/USECSS:
        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        // CONTROLSCONTAINER:
        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
        // MANUAL:
        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

        // RANDOMIZE:
        if (slider.vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (slider.vars.controlNav) methods.controlNav.setup();

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.setup();

        // KEYBOARD:
        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (keycode === 39) ? slider.getTarget('next') :
                           (keycode === 37) ? slider.getTarget('prev') : false;
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (slider.vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (slider.vars.pausePlay) methods.pausePlay.setup();

        //PAUSE WHEN INVISIBLE
        if (slider.vars.slideshow && slider.vars.pauseInvisible) methods.pauseInvisible.init();

        // SLIDSESHOW
        if (slider.vars.slideshow) {
          if (slider.vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) slider.pause();
            }, function() {
              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) slider.play();
            });
          }
          // initialize animation
          //If we're visible, or we don't use PageVisibility API
          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
          }
        }

        // ASNAV:
        if (asNav) methods.asNav.setup();

        // TOUCH
        if (touch && slider.vars.touch) methods.touch();

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && slider.vars.smoothHeight)) $(window).bind("resize orientationchange focus", methods.resize);

        slider.find("img").attr("draggable", "false");

        // API: start() Callback
        setTimeout(function(){
          slider.vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          if(!msGesture){
              slider.slides.click(function(e){
                e.preventDefault();
                var $slide = $(this),
                    target = $slide.index();
                var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                if( posFromLeft <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
                  slider.flexAnimate(slider.getTarget("prev"), true);
                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                }
              });
          }else{
              el._slider = slider;
              slider.slides.each(function (){
                  var that = this;
                  that._gesture = new MSGesture();
                  that._gesture.target = that;
                  that.addEventListener("MSPointerDown", function (e){
                      e.preventDefault();
                      if(e.currentTarget._gesture)
                          e.currentTarget._gesture.addPointer(e.pointerId);
                  }, false);
                  that.addEventListener("MSGestureTap", function (e){
                      e.preventDefault();
                      var $slide = $(this),
                          target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                      }
                  });
              });
          }
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item,
              slide;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              slide = slider.slides.eq(i);
              item = (slider.vars.controlNav === "thumbnails") ? '<img src="' + slide.attr( 'data-thumb' ) + '"/>' : '<a>' + j + '</a>';
              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
                var captn = slide.attr( 'data-thumbcaption' );
                if ( '' != captn && undefined != captn ) item += '<span class="' + namespace + 'caption">' + captn + '</span>';
              }
              slider.controlNavScaffold.append('<li>' + item + '</li>');
              j++;
            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();

          });
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        set: function() {
          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a>' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + '</a></li></ul>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target;

            if (watchedEvent === "" || watchedEvent === event.type) {
              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
          } else if (!slider.vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
            } else {
              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
            }
          } else {
            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              if ($(this).hasClass(namespace + 'pause')) {
                slider.manualPause = true;
                slider.manualPlay = false;
                slider.pause();
              } else {
                slider.manualPause = false;
                slider.manualPlay = true;
                slider.play();
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          scrolling = false,
          localX = 0,
          localY = 0,
          accDx = 0;

        if(!msGesture){
            el.addEventListener('touchstart', onTouchStart, false);

            function onTouchStart(e) {
              if (slider.animating) {
                e.preventDefault();
              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
                slider.pause();
                // CAROUSEL:
                cwidth = (vertical) ? slider.h : slider. w;
                startT = Number(new Date());
                // CAROUSEL:

                // Local vars for X and Y points.
                localX = e.touches[0].pageX;
                localY = e.touches[0].pageY;

                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                startX = (vertical) ? localY : localX;
                startY = (vertical) ? localX : localY;

                el.addEventListener('touchmove', onTouchMove, false);
                el.addEventListener('touchend', onTouchEnd, false);
              }
            }

            function onTouchMove(e) {
              // Local vars for X and Y points.

              localX = e.touches[0].pageX;
              localY = e.touches[0].pageY;

              dx = (vertical) ? startX - localY : startX - localX;
              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));

              var fxms = 500;

              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
                e.preventDefault();
                if (!fade && slider.transitions) {
                  if (!slider.vars.animationLoop) {
                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                  }
                  slider.setProps(offset + dx, "setTouch");
                }
              }
            }

            function onTouchEnd(e) {
              // finish the touch by undoing the touch session
              el.removeEventListener('touchmove', onTouchMove, false);

              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                var updateDx = (reverse) ? -dx : dx,
                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                } else {
                  if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                }
              }
              el.removeEventListener('touchend', onTouchEnd, false);

              startX = null;
              startY = null;
              dx = null;
              offset = null;
            }
        }else{
            el.style.msTouchAction = "none";
            el._gesture = new MSGesture();
            el._gesture.target = el;
            el.addEventListener("MSPointerDown", onMSPointerDown, false);
            el._slider = slider;
            el.addEventListener("MSGestureChange", onMSGestureChange, false);
            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

            function onMSPointerDown(e){
                e.stopPropagation();
                if (slider.animating) {
                    e.preventDefault();
                }else{
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider. w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                }
            }

            function onMSGestureChange(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                var transX = -e.translationX,
                    transY = -e.translationY;

                //Accumulate translations.
                accDx = accDx + ((vertical) ? transY : transX);
                dx = accDx;
                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
                    setImmediate(function (){
                        el._gesture.stop();
                    });

                    return;
                }

                if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                        if (!slider.vars.animationLoop) {
                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                        }
                        slider.setProps(offset + dx, "setTouch");
                    }
                }
            }

            function onMSGestureEnd(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                        if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                    }
                }

                startX = null;
                startY = null;
                dx = null;
                offset = null;
                accDx = 0;
            }
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) slider.doMath();

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
        }
      },
      sync: function(action) {
        var $obj = $(slider.vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      },
      pauseInvisible: {
        visProp: null,
        init: function() {
          var prefixes = ['webkit','moz','ms','o'];

          if ('hidden' in document) return 'hidden';
          for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document) 
            methods.pauseInvisible.visProp = prefixes[i] + 'Hidden';
          }
          if (methods.pauseInvisible.visProp) {
            var evtname = methods.pauseInvisible.visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
            document.addEventListener(evtname, function() {
              if (methods.pauseInvisible.isHidden()) {
                if(slider.startTimeout) clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                else slider.pause(); //Or just pause
              }
              else {
                if(slider.started) slider.play(); //Initiated before, just play
                else (slider.vars.initDelay > 0) ? setTimeout(slider.play, slider.vars.initDelay) : slider.play(); //Didn't init before: simply init or wait for it
              }
            });
          }       
        },
        isHidden: function() {
          return document[methods.pauseInvisible.visProp] || false;
        }
      },
      setToClearWatchedEvent: function() {
        clearTimeout(watchedEventClearTimer);
        watchedEventClearTimer = setTimeout(function() {
          watchedEvent = "";
        }, 3000);
      }
    }

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
      }

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(slider.vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;

        // SLIDESHOW:
        if (pause) slider.pause();

        // API: before() animation Callback
        slider.vars.before(slider);

        // SYNC:
        if (slider.syncExists && !fromNav) methods.sync("animate");

        // CONTROLNAV
        if (slider.vars.controlNav) methods.controlNav.active();

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide');

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.update();

        if (target === slider.last) {
          // API: end() of cycle Callback
          slider.vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!slider.vars.animationLoop) slider.pause();
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            //margin = (slider.vars.itemWidth > slider.w) ? slider.vars.itemMargin * 2 : slider.vars.itemMargin;
            margin = slider.vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", slider.vars.animationSpeed);
          if (slider.transitions) {
            if (!slider.vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              slider.wrapup(dimension);
            });
          } else {
            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
            //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
            slider.wrapup(dimension);
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight(slider.vars.animationSpeed);
      }
    }
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      slider.vars.after(slider);
    }

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating && focused ) slider.flexAnimate(slider.getTarget("next"));
    }
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.animatedSlides = null;
      slider.playing = false;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("play");
      // SYNC:
      if (slider.syncExists) methods.sync("pause");
    }
    // SLIDESHOW:
    slider.play = function() {
      if (slider.playing) clearInterval(slider.animatedSlides);
      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      slider.started = slider.playing = true;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("pause");
      // SYNC:
      if (slider.syncExists) methods.sync("play");
    }
    // STOP:
    slider.stop = function () {
      slider.pause();
      slider.stopped = true;
    }
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (slider.vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    }
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    }

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());

            return (posCalc * -1) + "px";
          }());

      if (slider.transitions) {
        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) slider.container.css(slider.args);
    }

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (slider.vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") slider.container.find('.clone').remove();
          slider.container.append(slider.slides.first().clone().addClass('clone').attr('aria-hidden', 'true')).prepend(slider.slides.last().clone().addClass('clone').attr('aria-hidden', 'true'));
        }
        slider.newSlides = $(slider.vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
            slider.newSlides.css({"width": slider.computedW, "float": "left", "display": "block"});
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
        if (type === "init") {
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight();
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide");
    }


    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = slider.vars.itemMargin,
          minItems = slider.vars.minItems,
          maxItems = slider.vars.maxItems;

      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = slider.vars.itemWidth + slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

        slider.visible = Math.floor(slider.w/(slider.itemW));
        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
    }


    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (slider.vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (slider.vars.directionNav) methods.directionNav.update();

    }

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      slider.vars.added(slider);
    }
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      slider.vars.removed(slider);
    }

    //FlexSlider: Initialize
    methods.init();
  }

  // Ensure the slider isn't focussed if the window loses focus.
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order
    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    pauseInvisible: true,       //{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next",               //String: Set the text for the "next" directionNav item

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){}           //{NEW} Callback: function(slider) - Fires after a slide is removed
  }


  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) options = {};

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

      if ( ( $slides.length === 1 && options.allowOneSlide === true ) || $slides.length === 0 ) {
          $slides.fadeIn(400);
          if (options.start) options.start($this);
        } else if ($this.data('flexslider') === undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "stop": $slider.stop(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") $slider.flexAnimate(options, true);
      }
    }
  }
})(jQuery);



/*
 Plugin: jQuery Parallax
 Version 1.1.3
 Author: Ian Lunn
 Twitter: @IanLunn
 Author URL: http://www.ianlunn.co.uk/
 Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

 Dual licensed under the MIT and GPL licenses:
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 */

(function( $ ){
    var $window = $(window);
    var windowHeight = $window.height();

    $window.resize(function () {
        windowHeight = $window.height();
    });

    $.fn.parallax = function(xpos, speedFactor, outerHeight) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var paddingTop = 0;

        //get the starting position of each element to have parallax applied to it
        $this.each(function(){
            firstTop = $this.offset().top;
        });

        if (outerHeight) {
            getHeight = function(jqo) {
                return jqo.outerHeight(true);
            };
        } else {
            getHeight = function(jqo) {
                return jqo.height();
            };
        }

        // setup defaults if arguments aren't specified
        if (arguments.length < 1 || xpos === null) xpos = "50%";
        if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
        if (arguments.length < 3 || outerHeight === null) outerHeight = true;

        // function to be called whenever the window is scrolled or resized
        function update(){
            var pos = $window.scrollTop();

            $this.each(function(){
                var $element = $(this);
                var top = $element.offset().top;
                var height = getHeight($element);

                // Check if totally above or totally below viewport
                if (top + height < pos || top > pos + windowHeight) {
                    return;
                }

                $this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
            });
        }

        $window.bind('scroll', update).resize(update);
        update();
    };
})(jQuery);


jQuery(document).ready(function($){

// SmoothScroll v0.9.9
// Licensed under the terms of the MIT license.

// People involved
// - Balazs Galambosi: maintainer (CHANGELOG.txt)
// - Patrick Brunner (patrickb1991@gmail.com)
// - Michael Herf: ssc_pulse Algorithm

// Scroll Variables (tweakable)
    var ssc_framerate = 150; // [Hz]
    var ssc_animtime  = 500; // [px]
    var ssc_stepsize  = 150; // [px]

// ssc_pulse (less tweakable)
// ratio of "tail" to "acceleration"
    var ssc_pulseAlgorithm = true;
    var ssc_pulseScale     = 6;
    var ssc_pulseNormalize = 1;

// Keyboard Settings
    var ssc_keyboardsupport = true;
    var ssc_arrowscroll     = 50; // [px]

// Other Variables
    var ssc_frame = false;
    var ssc_direction = { x: 0, y: 0 };
    var ssc_initdone  = false;
    var ssc_fixedback = true;
    var ssc_root = document.documentElement;
    var ssc_activeElement;

    var ssc_key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36 };

    /***********************************************
     * INITIALIZE
     ***********************************************/

    /**
     * Sets up scrolls array, determines if ssc_frames are involved.
     */
    function ssc_init() {

        if (!document.body) return;

        var body = document.body;
        var html = document.documentElement;
        var windowHeight = window.innerHeight;
        var scrollHeight = body.scrollHeight;

        // check compat mode for ssc_root element
        ssc_root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
        ssc_activeElement = body;

        ssc_initdone = true;

        // Checks if this script is running in a ssc_frame
        if (top != self) {
            ssc_frame = true;
        }

        /**
         * This fixes a bug where the areas left and right to
         * the content does not trigger the onmousewheel event
         * on some pages. e.g.: html, body { height: 100% }
         */
        else if (scrollHeight > windowHeight &&
            (body.offsetHeight <= windowHeight ||
                html.offsetHeight <= windowHeight)) {
            ssc_root.style.height = "auto";
            if (ssc_root.offsetHeight <= windowHeight) {
                var underlay = document.createElement("div");
                underlay.style.clear = "both";
                body.appendChild(underlay);
            }
        }

        if (!ssc_fixedback) {
            body.style.backgroundAttachment = "scroll";
            html.style.backgroundAttachment = "scroll";
        }

        if (ssc_keyboardsupport) {
            ssc_addEvent("keydown", ssc_keydown);
        }
    }


    /************************************************
     * SCROLLING
     ************************************************/

    var ssc_que = [];
    var ssc_pending = false;

    /**
     * Pushes scroll actions to the scrolling queue.
     */
    function ssc_scrollArray(elem, left, top, delay) {

        delay || (delay = 1000);
        ssc_directionCheck(left, top);

        // push a scroll command
        ssc_que.push({
            x: left,
            y: top,
            lastX: (left < 0) ? 0.99 : -0.99,
            lastY: (top  < 0) ? 0.99 : -0.99,
            start: +new Date
        });

        // don't act if there's a ssc_pending queue
        if (ssc_pending) {
            return;
        }

        var step = function() {

            var now = +new Date;
            var scrollX = 0;
            var scrollY = 0;

            for (var i = 0; i < ssc_que.length; i++) {

                var item = ssc_que[i];
                var elapsed  = now - item.start;
                var finished = (elapsed >= ssc_animtime);

                // scroll position: [0, 1]
                var position = (finished) ? 1 : elapsed / ssc_animtime;

                // easing [optional]
                if (ssc_pulseAlgorithm) {
                    position = ssc_pulse(position);
                }

                // only need the difference
                var x = (item.x * position - item.lastX) >> 0;
                var y = (item.y * position - item.lastY) >> 0;

                // add this to the total scrolling
                scrollX += x;
                scrollY += y;

                // update last values
                item.lastX += x;
                item.lastY += y;

                // delete and step back if it's over
                if (finished) {
                    ssc_que.splice(i, 1); i--;
                }
            }

            // scroll left
            if (left) {
                var lastLeft = elem.scrollLeft;
                elem.scrollLeft += scrollX;

                // scroll left failed (edge)
                if (scrollX && elem.scrollLeft === lastLeft) {
                    left = 0;
                }
            }

            // scroll top
            if (top) {
                var lastTop = elem.scrollTop;
                elem.scrollTop += scrollY;

                // scroll top failed (edge)
                if (scrollY && elem.scrollTop === lastTop) {
                    top = 0;
                }
            }

            // clean up if there's nothing left to do
            if (!left && !top) {
                ssc_que = [];
            }

            if (ssc_que.length) {
                setTimeout(step, delay / ssc_framerate + 1);
            } else {
                ssc_pending = false;
            }
        }

        // start a new queue of actions
        setTimeout(step, 0);
        ssc_pending = true;
    }


    /***********************************************
     * EVENTS
     ***********************************************/

    /**
     * Mouse ssc_wheel handler.
     * @param {Object} event
     */
    function ssc_wheel(event) {

        if (!ssc_initdone) {
            init();
        }

        var target = event.target;
        var overflowing = ssc_overflowingAncestor(target);

        // use default if there's no overflowing
        // element or default action is prevented
        if (!overflowing || event.defaultPrevented ||
            ssc_isNodeName(ssc_activeElement, "embed") ||
            (ssc_isNodeName(target, "embed") && /\.pdf/i.test(target.src))) {
            return true;
        }

        var deltaX = event.wheelDeltaX || 0;
        var deltaY = event.wheelDeltaY || 0;

        // use wheelDelta if deltaX/Y is not available
        if (!deltaX && !deltaY) {
            deltaY = event.wheelDelta || 0;
        }

        // scale by step size
        // delta is 120 most of the time
        // synaptics seems to send 1 sometimes
        if (Math.abs(deltaX) > 1.2) {
            deltaX *= ssc_stepsize / 120;
        }
        if (Math.abs(deltaY) > 1.2) {
            deltaY *= ssc_stepsize / 120;
        }

        ssc_scrollArray(overflowing, -deltaX, -deltaY);
        event.preventDefault();
    }

    /**
     * ssc_keydown event handler.
     * @param {Object} event
     */
    function ssc_keydown(event) {

        var target   = event.target;
        var modifier = event.ctrlKey || event.altKey || event.metaKey;

        // do nothing if user is editing text
        // or using a modifier ssc_key (except shift)
        if ( /input|textarea|embed/i.test(target.nodeName) ||
            target.isContentEditable ||
            event.defaultPrevented   ||
            modifier ) {
            return true;
        }
        // spacebar should trigger button press
        if (ssc_isNodeName(target, "button") &&
            event.keyCode === ssc_key.spacebar) {
            return true;
        }

        var shift, x = 0, y = 0;
        var elem = ssc_overflowingAncestor(ssc_activeElement);
        var clientHeight = elem.clientHeight;

        if (elem == document.body) {
            clientHeight = window.innerHeight;
        }

        switch (event.keyCode) {
            case ssc_key.up:
                y = -ssc_arrowscroll;
                break;
            case ssc_key.down:
                y = ssc_arrowscroll;
                break;
            case ssc_key.spacebar: // (+ shift)
                shift = event.shiftKey ? 1 : -1;
                y = -shift * clientHeight * 0.9;
                break;
            case ssc_key.pageup:
                y = -clientHeight * 0.9;
                break;
            case ssc_key.pagedown:
                y = clientHeight * 0.9;
                break;
            case ssc_key.home:
                y = -elem.scrollTop;
                break;
            case ssc_key.end:
                var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
                y = (damt > 0) ? damt+10 : 0;
                break;
            case ssc_key.left:
                x = -ssc_arrowscroll;
                break;
            case ssc_key.right:
                x = ssc_arrowscroll;
                break;
            default:
                return true; // a ssc_key we don't care about
        }

        ssc_scrollArray(elem, x, y);
        event.preventDefault();
    }

    /**
     * ssc_mousedown event only for updating ssc_activeElement
     */
    function ssc_mousedown(event) {
        ssc_activeElement = event.target;
    }


    /***********************************************
     * OVERFLOW
     ***********************************************/

    var ssc_cache = {}; // cleared out every once in while
    setInterval(function(){ ssc_cache = {}; }, 10 * 1000);

    var ssc_uniqueID = (function() {
        var i = 0;
        return function (el) {
            return el.ssc_uniqueID || (el.ssc_uniqueID = i++);
        };
    })();

    function ssc_setCache(elems, overflowing) {
        for (var i = elems.length; i--;)
            ssc_cache[ssc_uniqueID(elems[i])] = overflowing;
        return overflowing;
    }

    function ssc_overflowingAncestor(el) {
        var elems = [];
        var ssc_rootScrollHeight = ssc_root.scrollHeight;
        do {
            var cached = ssc_cache[ssc_uniqueID(el)];
            if (cached) {
                return ssc_setCache(elems, cached);
            }
            elems.push(el);
            if (ssc_rootScrollHeight === el.scrollHeight) {
                if (!ssc_frame || ssc_root.clientHeight + 10 < ssc_rootScrollHeight) {
                    return ssc_setCache(elems, document.body); // scrolling ssc_root in WebKit
                }
            } else if (el.clientHeight + 10 < el.scrollHeight) {
                overflow = getComputedStyle(el, "").getPropertyValue("overflow");
                if (overflow === "scroll" || overflow === "auto") {
                    return ssc_setCache(elems, el);
                }
            }
        } while (el = el.parentNode);
    }


    /***********************************************
     * HELPERS
     ***********************************************/

    function ssc_addEvent(type, fn, bubble) {
        window.addEventListener(type, fn, (bubble||false));
    }

    function ssc_removeEvent(type, fn, bubble) {
        window.removeEventListener(type, fn, (bubble||false));
    }

    function ssc_isNodeName(el, tag) {
        return el.nodeName.toLowerCase() === tag.toLowerCase();
    }

    function ssc_directionCheck(x, y) {
        x = (x > 0) ? 1 : -1;
        y = (y > 0) ? 1 : -1;
        if (ssc_direction.x !== x || ssc_direction.y !== y) {
            ssc_direction.x = x;
            ssc_direction.y = y;
            ssc_que = [];
        }
    }


    /***********************************************
     * ssc_pulse
     ***********************************************/

    /**
     * Viscous fluid with a ssc_pulse for part and decay for the rest.
     * - Applies a fixed force over an interval (a damped acceleration), and
     * - Lets the exponential bleed away the velocity over a longer interval
     * - Michael Herf, http://stereopsis.com/stopping/
     */
    function ssc_pulse_(x) {
        var val, start, expx;
        // test
        x = x * ssc_pulseScale;
        if (x < 1) { // acceleartion
            val = x - (1 - Math.exp(-x));
        } else {     // tail
            // the previous animation ended here:
            start = Math.exp(-1);
            // simple viscous drag
            x -= 1;
            expx = 1 - Math.exp(-x);
            val = start + (expx * (1 - start));
        }
        return val * ssc_pulseNormalize;
    }

    function ssc_pulse(x) {
        if (x >= 1) return 1;
        if (x <= 0) return 0;

        if (ssc_pulseNormalize == 1) {
            ssc_pulseNormalize /= ssc_pulse_(1);
        }
        return ssc_pulse_(x);
    }

    $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    if ( $.browser.chrome ) {
        ssc_addEvent("mousedown", ssc_mousedown);
        ssc_addEvent("mousewheel", ssc_wheel);
        ssc_addEvent("load", ssc_init);
    }
});




/*
 *  jQuery OwlCarousel v1.3.2
 *
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owlgraphic.com/owlcarousel/
 *
 *  Licensed under MIT
 *
 */

/*JS Lint helpers: */
/*global dragMove: false, dragEnd: false, $, jQuery, alert, window, document */
/*jslint nomen: true, continue:true */

if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {

    var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"))
                      .data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = $(base.options.responsiveBaseWidth).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };

    $.fn.owlCarousel.options = {

        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
    };
}(jQuery, window, document));


/*
 * jQuery Superfish Menu Plugin
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
  "use strict";

  var methods = (function () {
    // private properties and methods go here
    var c = {
        bcClass: 'sf-breadcrumb',
        menuClass: 'sf-js-enabled',
        anchorClass: 'sf-with-ul',
        menuArrowClass: 'sf-arrows'
      },
      ios = (function () {
        var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (ios) {
          // iOS clicks only bubble as far as body children
          $(window).load(function () {
            $('body').children().on('click', $.noop);
          });
        }
        return ios;
      })(),
      wp7 = (function () {
        var style = document.documentElement.style;
        return ('behavior' in style && 'fill' in style && /iemobile/i.test(navigator.userAgent));
      })(),
      toggleMenuClasses = function ($menu, o) {
        var classes = c.menuClass;
        if (o.cssArrows) {
          classes += ' ' + c.menuArrowClass;
        }
        $menu.toggleClass(classes);
      },
      setPathToCurrent = function ($menu, o) {
        return $menu.find('li.' + o.pathClass).slice(0, o.pathLevels)
          .addClass(o.hoverClass + ' ' + c.bcClass)
            .filter(function () {
              return ($(this).children(o.popUpSelector).hide().show().length);
            }).removeClass(o.pathClass);
      },
      toggleAnchorClass = function ($li) {
        $li.children('a').toggleClass(c.anchorClass);
      },
      toggleTouchAction = function ($menu) {
        var touchAction = $menu.css('ms-touch-action');
        touchAction = (touchAction === 'pan-y') ? 'auto' : 'pan-y';
        $menu.css('ms-touch-action', touchAction);
      },
      applyHandlers = function ($menu, o) {
        var targets = 'li:has(' + o.popUpSelector + ')';
        if ($.fn.hoverIntent && !o.disableHI) {
          $menu.hoverIntent(over, out, targets);
        }
        else {
          $menu
            .on('mouseenter.superfish', targets, over)
            .on('mouseleave.superfish', targets, out);
        }
        var touchevent = 'MSPointerDown.superfish';
        if (!ios) {
          touchevent += ' touchend.superfish';
        }
        if (wp7) {
          touchevent += ' mousedown.superfish';
        }
        $menu
          .on('focusin.superfish', 'li', over)
          .on('focusout.superfish', 'li', out)
          .on(touchevent, 'a', o, touchHandler);
      },
      touchHandler = function (e) {
        var $this = $(this),
          $ul = $this.siblings(e.data.popUpSelector);

        if ($ul.length > 0 && $ul.is(':hidden')) {
          $this.one('click.superfish', false);
          if (e.type === 'MSPointerDown') {
            $this.trigger('focus');
          } else {
            $.proxy(over, $this.parent('li'))();
          }
        }
      },
      over = function () {
        var $this = $(this),
          o = getOptions($this);
        clearTimeout(o.sfTimer);
        $this.siblings().superfish('hide').end().superfish('show');
      },
      out = function () {
        var $this = $(this),
          o = getOptions($this);
        if (ios) {
          $.proxy(close, $this, o)();
        }
        else {
          clearTimeout(o.sfTimer);
          o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
        }
      },
      close = function (o) {
        o.retainPath = ($.inArray(this[0], o.$path) > -1);
        this.superfish('hide');

        if (!this.parents('.' + o.hoverClass).length) {
          o.onIdle.call(getMenu(this));
          if (o.$path.length) {
            $.proxy(over, o.$path)();
          }
        }
      },
      getMenu = function ($el) {
        return $el.closest('.' + c.menuClass);
      },
      getOptions = function ($el) {
        return getMenu($el).data('sf-options');
      };

    return {
      // public methods
      hide: function (instant) {
        if (this.length) {
          var $this = this,
            o = getOptions($this);
          if (!o) {
            return this;
          }
          var not = (o.retainPath === true) ? o.$path : '',
            $ul = $this.find('li.' + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),
            speed = o.speedOut;

          if (instant) {
            $ul.show();
            speed = 0;
          }
          o.retainPath = false;
          o.onBeforeHide.call($ul);
          $ul.stop(true, true).animate(o.animationOut, speed, function () {
            var $this = $(this);
            o.onHide.call($this);
          });
        }
        return this;
      },
      show: function () {
        var o = getOptions(this);
        if (!o) {
          return this;
        }
        var $this = this.addClass(o.hoverClass),
          $ul = $this.children(o.popUpSelector);

        o.onBeforeShow.call($ul);
        $ul.stop(true, true).animate(o.animation, o.speed, function () {
          o.onShow.call($ul);
        });
        return this;
      },
      destroy: function () {
        return this.each(function () {
          var $this = $(this),
            o = $this.data('sf-options'),
            $hasPopUp;
          if (!o) {
            return false;
          }
          $hasPopUp = $this.find(o.popUpSelector).parent('li');
          clearTimeout(o.sfTimer);
          toggleMenuClasses($this, o);
          toggleAnchorClass($hasPopUp);
          toggleTouchAction($this);
          // remove event handlers
          $this.off('.superfish').off('.hoverIntent');
          // clear animation's inline display style
          $hasPopUp.children(o.popUpSelector).attr('style', function (i, style) {
            return style.replace(/display[^;]+;?/g, '');
          });
          // reset 'current' path classes
          o.$path.removeClass(o.hoverClass + ' ' + c.bcClass).addClass(o.pathClass);
          $this.find('.' + o.hoverClass).removeClass(o.hoverClass);
          o.onDestroy.call($this);
          $this.removeData('sf-options');
        });
      },
      init: function (op) {
        return this.each(function () {
          var $this = $(this);
          if ($this.data('sf-options')) {
            return false;
          }
          var o = $.extend({}, $.fn.superfish.defaults, op),
            $hasPopUp = $this.find(o.popUpSelector).parent('li');
          o.$path = setPathToCurrent($this, o);

          $this.data('sf-options', o);

          toggleMenuClasses($this, o);
          toggleAnchorClass($hasPopUp);
          toggleTouchAction($this);
          applyHandlers($this, o);

          $hasPopUp.not('.' + c.bcClass).superfish('hide', true);

          o.onInit.call(this);
        });
      }
    };
  })();

  $.fn.superfish = function (method, args) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    }
    else {
      return $.error('Method ' +  method + ' does not exist on jQuery.fn.superfish');
    }
  };

  $.fn.superfish.defaults = {
    popUpSelector: 'ul,.sf-mega', // within menu context
    hoverClass: 'sfHover',
    pathClass: 'overrideThisToUse',
    pathLevels: 1,
    delay: 800,
    animation: {opacity: 'show'},
    animationOut: {opacity: 'hide'},
    speed: 'normal',
    speedOut: 'fast',
    cssArrows: true,
    disableHI: false,
    onInit: $.noop,
    onBeforeShow: $.noop,
    onShow: $.noop,
    onBeforeHide: $.noop,
    onHide: $.noop,
    onIdle: $.noop,
    onDestroy: $.noop
  };

  // soon to be deprecated
  $.fn.extend({
    hideSuperfishUl: methods.hide,
    showSuperfishUl: methods.show
  });

})(jQuery);






/*
* MIXITUP - A CSS3 and JQuery Filter & Sort Plugin
* Version: 1.5.5
* License: Creative Commons Attribution-NoDerivs 3.0 Unported - CC BY-ND 3.0
* http://creativecommons.org/licenses/by-nd/3.0/
* This software may be used freely on commercial and non-commercial projects with attribution to the author/copyright holder.
* Author: Patrick Kunka
* Copyright 2012-2013 Patrick Kunka, Barrel LLC, All Rights Reserved
* 
* http://mixitup.io
*/

(function($){
  
  // DECLARE METHODS
 
  var methods = {

    // "INIT" METHOD
  
      init: function(settings){

      return this.each(function(){
        
        var browser = window.navigator.appVersion.match(/Chrome\/(\d+)\./),
          ver = browser ? parseInt(browser[1], 10) : false,
          chromeFix = function(id){
            var grid = document.getElementById(id),
                  parent = grid.parentElement,
                  placeholder = document.createElement('div'),
                  frag = document.createDocumentFragment();

              parent.insertBefore(placeholder, grid);  
              frag.appendChild(grid);
              parent.replaceChild(grid, placeholder);
              frag = null;
              placeholder = null;
          };
        
        if(ver && ver == 31 || ver == 32){
          chromeFix(this.id);
        };
        
        // BUILD CONFIG OBJECT

        var config = {
          
          // PUBLIC PROPERTIES
          
          targetSelector : '.mix',
          filterSelector : '.filter',
          sortSelector : '.sort',
          buttonEvent: 'click',
          effects : ['fade', 'scale'],
          listEffects : null,
          easing : 'smooth',
          layoutMode: 'grid',
          targetDisplayGrid : 'inline-block',
          targetDisplayList: 'block',
          listClass : '',
          gridClass : '',
          transitionSpeed : 600,
          showOnLoad : 'all',
          sortOnLoad : false,
          multiFilter : false,
          filterLogic : 'or',
          resizeContainer : true,
          minHeight : 0,
          failClass : 'fail',
          perspectiveDistance : '3000',
          perspectiveOrigin : '50% 50%',
          animateGridList : true,
          onMixLoad: null,
          onMixStart : null,
          onMixEnd : null,

          // MISC

          container : null,
          origOrder : [],
          startOrder : [],
          newOrder : [],
          origSort: [],
          checkSort: [],
          filter : '',
          mixing : false,
          origDisplay : '',
          origLayout: '',
          origHeight : 0, 
          newHeight : 0,
          isTouch : false,
          resetDelay : 0,
          failsafe : null,

          // CSS
          
          prefix : '',
          easingFallback : 'ease-in-out',
          transition : {}, 
          perspective : {}, 
          clean : {},
          fade : '1',
          scale : '',
          rotateX : '',
          rotateY : '',
          rotateZ : '',
          blur : '',
          grayscale : ''
        };
        
        if(settings){
          $.extend(config, settings);
        };

        // ADD CONFIG OBJECT TO CONTAINER OBJECT PER INSTANTIATION
        
        this.config = config;
        
        // DETECT TOUCH
        
        $.support.touch = 'ontouchend' in document;

        if ($.support.touch) {
          config.isTouch = true;
          config.resetDelay = 350;
        };
        
        // LOCALIZE CONTAINER
  
        config.container = $(this);
        var $cont = config.container;
        
        // GET VENDOR PREFIX
        
        config.prefix = prefix($cont[0]);
        config.prefix = config.prefix ? '-'+config.prefix.toLowerCase()+'-' : '';
        
        // CACHE 'DEFAULT' SORTING ORDER
      
        $cont.find(config.targetSelector).each(function(){
          config.origOrder.push($(this));
        });
        
        // PERFORM SORT ON LOAD 
        
        if(config.sortOnLoad){
          var sortby, order;
          if($.isArray(config.sortOnLoad)){
            sortby = config.sortOnLoad[0], order = config.sortOnLoad[1];
            $(config.sortSelector+'[data-sort='+config.sortOnLoad[0]+'][data-order='+config.sortOnLoad[1]+']').addClass('active');
          } else {
            $(config.sortSelector+'[data-sort='+config.sortOnLoad+']').addClass('active');
            sortby = config.sortOnLoad, config.sortOnLoad = 'desc';
          };
          sort(sortby, order, $cont, config);
        };
        
        // BUILD TRANSITION AND PERSPECTIVE OBJECTS
        
        for(var i = 0; i<2; i++){
          var a = i==0 ? a = config.prefix : '';
          config.transition[a+'transition'] = 'all '+config.transitionSpeed+'ms ease-in-out';
          config.perspective[a+'perspective'] = config.perspectiveDistance+'px';
          config.perspective[a+'perspective-origin'] = config.perspectiveOrigin;
        };
        
        // BUILD TRANSITION CLEANER
        
        for(var i = 0; i<2; i++){
          var a = i==0 ? a = config.prefix : '';
          config.clean[a+'transition'] = 'none';
        };
  
        // CHOOSE GRID OR LIST
  
        if(config.layoutMode == 'list'){
          $cont.addClass(config.listClass);
          config.origDisplay = config.targetDisplayList;
        } else {
          $cont.addClass(config.gridClass);
          config.origDisplay = config.targetDisplayGrid;
        };
        config.origLayout = config.layoutMode;
        
        // PARSE 'SHOWONLOAD'
        
        var showOnLoadArray = config.showOnLoad.split(' ');
        
        // GIVE ACTIVE FILTER ACTIVE CLASS
        
        $.each(showOnLoadArray, function(){
          $(config.filterSelector+'[data-filter="'+this+'"]').addClass('active');
        });
        
        // RENAME "ALL" CATEGORY TO "MIX_ALL"
  
        $cont.find(config.targetSelector).addClass('mix_all');
        if(showOnLoadArray[0]  == 'all'){
          showOnLoadArray[0] = 'mix_all',
          config.showOnLoad = 'mix_all';
        };
        
        // FADE IN 'SHOWONLOAD'
        
        var $showOnLoad = $();
        $.each(showOnLoadArray, function(){
          $showOnLoad = $showOnLoad.add($('.'+this))
        });
        
        $showOnLoad.each(function(){
          var $t = $(this);
          if(config.layoutMode == 'list'){
            $t.css('display',config.targetDisplayList);
          } else {
            $t.css('display',config.targetDisplayGrid);
          };
          $t.css(config.transition);
        });
        
        // WRAP FADE-IN TO PREVENT RACE CONDITION
        
        var delay = setTimeout(function(){
          
          config.mixing = true;
          
          $showOnLoad.css('opacity','1');
          
          // CLEAN UP
          
          var reset = setTimeout(function(){
            if(config.layoutMode == 'list'){
              $showOnLoad.removeStyle(config.prefix+'transition, transition').css({
                display: config.targetDisplayList,
                opacity: 1
              });
            } else {
              $showOnLoad.removeStyle(config.prefix+'transition, transition').css({
                display: config.targetDisplayGrid,
                opacity: 1
              });
            };
            
            // FIRE "ONMIXLOAD" CALLBACK
            
            config.mixing = false;

            if(typeof config.onMixLoad == 'function') {
              var output = config.onMixLoad.call(this, config);

              // UPDATE CONFIG IF DATA RETURNED

              config = output ? output : config;
            };
            
          },config.transitionSpeed);
        },10);
        
        // PRESET ACTIVE FILTER
        
        config.filter = config.showOnLoad;
      
        // BIND SORT CLICK HANDLERS
      
        $(config.sortSelector).bind(config.buttonEvent,function(){
          
          if(!config.mixing){
            
            // PARSE SORT ARGUMENTS FROM BUTTON CLASSES
            
            var $t = $(this),
            sortby = $t.attr('data-sort'),
            order = $t.attr('data-order');
            
            if(!$t.hasClass('active')){
              $(config.sortSelector).removeClass('active');
              $t.addClass('active');
            } else {
              if(sortby != 'random')return false;
            };
            
            $cont.find(config.targetSelector).each(function(){
              config.startOrder.push($(this));
            });
        
            goMix(config.filter,sortby,order,$cont, config);
        
          };
        
        });

        // BIND FILTER CLICK HANDLERS

        $(config.filterSelector).bind(config.buttonEvent,function(){
        
          if(!config.mixing){
            
            var $t = $(this);
            
            // PARSE FILTER ARGUMENTS FROM BUTTON CLASSES
    
            if(config.multiFilter == false){
              
              // SINGLE ACTIVE BUTTON
              
              $(config.filterSelector).removeClass('active');
              $t.addClass('active');
            
              config.filter = $t.attr('data-filter');
            
              $(config.filterSelector+'[data-filter="'+config.filter+'"]').addClass('active');

            } else {
            
              // MULTIPLE ACTIVE BUTTONS
              
              var thisFilter = $t.attr('data-filter'); 
            
              if($t.hasClass('active')){
                $t.removeClass('active');
                
                // REMOVE FILTER FROM SPACE-SEPERATED STRING
                
                var re = new RegExp('(\\s|^)'+thisFilter);
                config.filter = config.filter.replace(re,'');
              } else {
                
                // ADD FILTER TO SPACE-SEPERATED STRING
                
                $t.addClass('active');
                config.filter = config.filter+' '+thisFilter;
                
              };
            };
            
            // GO MIX
            
            goMix(config.filter, null, null, $cont, config);

          };
        
        });
          
      });
    },
  
    // "TOGRID" METHOD
  
    toGrid: function(){
      return this.each(function(){
        var config = this.config;
        if(config.layoutMode != 'grid'){
          config.layoutMode = 'grid';
          goMix(config.filter, null, null, $(this), config);
        };
      });
    },
  
    // "TOLIST" METHOD
  
    toList: function(){
      return this.each(function(){
        var config = this.config;
        if(config.layoutMode != 'list'){
          config.layoutMode = 'list';
          goMix(config.filter, null, null, $(this), config);
        };
      });
    },
  
    // "FILTER" METHOD
  
    filter: function(arg){
      return this.each(function(){
        var config = this.config;
        if(!config.mixing){ 
          $(config.filterSelector).removeClass('active');
          $(config.filterSelector+'[data-filter="'+arg+'"]').addClass('active');
          goMix(arg, null, null, $(this), config);
        };
      }); 
    },
  
    // "SORT" METHOD
  
    sort: function(args){
      return this.each(function(){
        var config = this.config,
          $t = $(this);
        if(!config.mixing){
          $(config.sortSelector).removeClass('active');
          if($.isArray(args)){
            var sortby = args[0], order = args[1];
            $(config.sortSelector+'[data-sort="'+args[0]+'"][data-order="'+args[1]+'"]').addClass('active');
          } else {
            $(config.sortSelector+'[data-sort="'+args+'"]').addClass('active');
            var sortby = args, order = 'desc';
          };
          $t.find(config.targetSelector).each(function(){
            config.startOrder.push($(this));
          });
          
          goMix(config.filter,sortby,order, $t, config);
        
        };
      });
    },
    
    // "MULTIMIX" METHOD
    
    multimix: function(args){
      return this.each(function(){
        var config = this.config,
          $t = $(this);
          multiOut = {
            filter: config.filter,
            sort: null,
            order: 'desc',
            layoutMode: config.layoutMode
          };
        $.extend(multiOut, args);
        if(!config.mixing){
          $(config.filterSelector).add(config.sortSelector).removeClass('active');
          $(config.filterSelector+'[data-filter="'+multiOut.filter+'"]').addClass('active');
          if(typeof multiOut.sort !== 'undefined'){
            $(config.sortSelector+'[data-sort="'+multiOut.sort+'"][data-order="'+multiOut.order+'"]').addClass('active');
            $t.find(config.targetSelector).each(function(){
              config.startOrder.push($(this));
            });
          };
          config.layoutMode = multiOut.layoutMode;
          goMix(multiOut.filter,multiOut.sort,multiOut.order, $t, config);
        };
      });
    },
    
    // "REMIX" METHOD

    remix: function(arg){
      return this.each(function(){
        var config = this.config,
          $t = $(this); 
        config.origOrder = [];
        $t.find(config.targetSelector).each(function(){
          var $th = $(this);
          $th.addClass('mix_all'); 
            config.origOrder.push($th);
        });
        if(!config.mixing && typeof arg !== 'undefined'){
          $(config.filterSelector).removeClass('active');
          $(config.filterSelector+'[data-filter="'+arg+'"]').addClass('active');
          goMix(arg, null, null, $t, config);
        };
      });
    }
  };
  
  // DECLARE PLUGIN

  $.fn.mixitup = function(method, arg){
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call(arguments,1));
    } else if (typeof method === 'object' || ! method){
      return methods.init.apply( this, arguments );
    };
  };
  
  /* ==== THE MAGIC ==== */
  
  function goMix(filter, sortby, order, $cont, config){
    
    // WE ARE NOW MIXING

    clearInterval(config.failsafe);
    config.mixing = true; 
    
    // APPLY ARGS TO CONFIG
    
    config.filter = filter;
    
    // FIRE "ONMIXSTART" CALLBACK
    
    if(typeof config.onMixStart == 'function') {
      var output = config.onMixStart.call(this, config);
      
      // UPDATE CONFIG IF DATA RETURNED
      
      config = output ? output : config;
    };
    
    // SHORT LOCAL VARS
    
    var speed = config.transitionSpeed;
    
    // REBUILD TRANSITION AND PERSPECTIVE OBJECTS
    
    for(var i = 0; i<2; i++){
      var a = i==0 ? a = config.prefix : '';
      config.transition[a+'transition'] = 'all '+speed+'ms linear';
      config.transition[a+'transform'] = a+'translate3d(0,0,0)';
      config.perspective[a+'perspective'] = config.perspectiveDistance+'px';
      config.perspective[a+'perspective-origin'] = config.perspectiveOrigin;
    };
    
    // CACHE TARGET ELEMENTS FOR QUICK ACCESS
    
    var mixSelector = config.targetSelector,
    $targets = $cont.find(mixSelector);
    
    // ADD DATA OBJECT TO EACH TARGET
    
    $targets.each(function(){
      this.data = {};
    });
    
    // RE-DEFINE CONTAINER INCASE NOT IMMEDIATE PARENT OF TARGET ELEMENTS 
    
    var $par = $targets.parent();
  
    // ADD PERSPECTIVE TO CONTAINER 
    
    $par.css(config.perspective);
    
    // SETUP EASING

    config.easingFallback = 'ease-in-out';
    if(config.easing == 'smooth')config.easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    if(config.easing == 'snap')config.easing = 'cubic-bezier(0.77, 0, 0.175, 1)';
    if(config.easing == 'windback'){
      config.easing = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
      config.easingFallback = 'cubic-bezier(0.175, 0.885, 0.320, 1)'; // Fall-back for old webkit, with no values > 1 or < 1
    };
    if(config.easing == 'windup'){
      config.easing = 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
      config.easingFallback = 'cubic-bezier(0.6, 0.28, 0.735, 0.045)';
    };
    
    // USE LIST SPECIFIC EFFECTS IF DECLARED
    
    var effectsOut = config.layoutMode == 'list' && config.listEffects != null ? config.listEffects : config.effects;
  
    // BUILD EFFECTS STRINGS & SKIP IF IE8
  
    if (Array.prototype.indexOf){
      config.fade = effectsOut.indexOf('fade') > -1 ? '0' : '';
      config.scale = effectsOut.indexOf('scale') > -1 ? 'scale(.01)' : '';
      config.rotateZ = effectsOut.indexOf('rotateZ') > -1 ? 'rotate(180deg)' : '';
      config.rotateY = effectsOut.indexOf('rotateY') > -1 ? 'rotateY(90deg)' : '';
      config.rotateX = effectsOut.indexOf('rotateX') > -1 ? 'rotateX(90deg)' : '';
      config.blur = effectsOut.indexOf('blur') > -1 ? 'blur(8px)' : '';
      config.grayscale = effectsOut.indexOf('grayscale') > -1 ? 'grayscale(100%)' : '';
    };
    
    // DECLARE NEW JQUERY OBJECTS FOR GROUPING
    
    var $show = $(), 
    $hide = $(),
    filterArray = [],
    multiDimensional = false;
    
    // BUILD FILTER ARRAY(S)
    
    if(typeof filter === 'string'){
      
      // SINGLE DIMENSIONAL FILTERING
      
      filterArray = buildFilterArray(filter);
      
    } else {
      
      // MULTI DIMENSIONAL FILTERING
      
      multiDimensional = true;
      
      $.each(filter,function(i){
        filterArray[i] = buildFilterArray(this);
      });
    };

    // "OR" LOGIC (DEFAULT)
    
    if(config.filterLogic == 'or'){
      
      if(filterArray[0] == '') filterArray.shift(); // IF FIRST ITEM IN ARRAY IS AN EMPTY SPACE, DELETE
      
      // IF NO ELEMENTS ARE DESIRED THEN HIDE ALL VISIBLE ELEMENTS
    
      if(filterArray.length < 1){
        
        $hide = $hide.add($cont.find(mixSelector+':visible'));
        
      } else {

      // ELSE CHECK EACH TARGET ELEMENT FOR ANY FILTER CATEGORY:
      
        $targets.each(function(){
          var $t = $(this);
          if(!multiDimensional){
            // IF HAS ANY FILTER, ADD TO "SHOW" OBJECT
            if($t.is('.'+filterArray.join(', .'))){
              $show = $show.add($t);
            // ELSE IF HAS NO FILTERS, ADD TO "HIDE" OBJECT
            } else {
              $hide = $hide.add($t);
            };
          } else {
            
            var pass = 0;
            // FOR EACH DIMENSION
            
            $.each(filterArray,function(i){
              if(this.length){
                if($t.is('.'+this.join(', .'))){
                  pass++
                };
              } else if(pass > 0){
                pass++;
              };
            });
            // IF PASSES ALL DIMENSIONS, SHOW
            if(pass == filterArray.length){
              $show = $show.add($t);
            // ELSE HIDE
            } else {
              $hide = $hide.add($t);
            };
          };
        });
      
      };
  
    } else {
      
    // "AND" LOGIC
      
      // ADD "MIX_SHOW" CLASS TO ELEMENTS THAT HAVE ALL FILTERS
      
      $show = $show.add($par.find(mixSelector+'.'+filterArray.join('.')));
      
      // ADD "MIX_HIDE" CLASS TO EVERYTHING ELSE
      
      $hide = $hide.add($par.find(mixSelector+':not(.'+filterArray.join('.')+'):visible'));
    };
    
    // GET TOTAL NUMBER OF ELEMENTS TO SHOW
    
    var total = $show.length;
    
    // DECLARE NEW JQUERY OBJECTS

    var $tohide = $(),
    $toshow = $(),
    $pre = $();
    
    // FOR ELEMENTS TO BE HIDDEN, IF NOT ALREADY HIDDEN THEN ADD TO OBJECTS "TOHIDE" AND "PRE" 
    // TO INDICATE PRE-EXISTING ELEMENTS TO BE HIDDEN
    
    $hide.each(function(){
      var $t = $(this);
      if($t.css('display') != 'none'){
        $tohide = $tohide.add($t);
        $pre = $pre.add($t);
      };
    });
    
    // IF ALL ELEMENTS ARE ALREADY SHOWN AND THERE IS NOTHING TO HIDE, AND NOT PERFORMING A LAYOUT CHANGE OR SORT:
    
    if($show.filter(':visible').length == total && !$tohide.length && !sortby){
      
      if(config.origLayout == config.layoutMode){
        
        // THEN CLEAN UP AND GO HOME

        resetFilter();
        return false;
      } else {
        
        // IF ONLY ONE ITEM AND CHANGING FORM GRID TO LIST, MOST LIKELY POSITION WILL NOT CHANGE SO WE'RE DONE
      
        if($show.length == 1){ 
          
          if(config.layoutMode == 'list'){ 
            $cont.addClass(config.listClass);
            $cont.removeClass(config.gridClass);
            $pre.css('display',config.targetDisplayList);
          } else {
            $cont.addClass(config.gridClass);
            $cont.removeClass(config.listClass);
            $pre.css('display',config.targetDisplayGrid);
          };
          
          // THEN CLEAN UP AND GO HOME

          resetFilter();
          return false;
        }
      };
    };
    
    // GET CONTAINER'S STARTING HEIGHT

    config.origHeight = $par.height();
    
    // IF THERE IS SOMETHING TO BE SHOWN:

    if($show.length){
      
      // REMOVE "FAIL CLASS" FROM CONTAINER IF EXISTS
      
      $cont.removeClass(config.failClass);
      
      
      // FOR ELEMENTS TO BE SHOWN, IF NOT ALREADY SHOWN THEN ADD TO OBJECTS "TOSHOW" ELSE ADD CLASS "MIX_PRE"
      // TO INDICATE PRE-EXISTING ELEMENT

      $show.each(function(){ 
        var $t = $(this);
        if($t.css('display') == 'none'){
          $toshow = $toshow.add($t)
        } else {
          $pre = $pre.add($t);
        };
      });
  
      // IF NON-ANIMATED LAYOUT MODE TRANSITION:
    
      if((config.origLayout != config.layoutMode) && config.animateGridList == false){ 
      
        // ADD NEW DISPLAY TYPES, CLEAN UP AND GO HOME
        
        if(config.layoutMode == 'list'){ 
          $cont.addClass(config.listClass);
          $cont.removeClass(config.gridClass);
          $pre.css('display',config.targetDisplayList);
        } else {
          $cont.addClass(config.gridClass);
          $cont.removeClass(config.listClass);
          $pre.css('display',config.targetDisplayGrid);
        };
        
        resetFilter();
        return false;
      };
      
      // IF IE, FUCK OFF, AND THEN CLEAN UP AND GO HOME
    
      if(!window.atob){
        resetFilter();
        return false;
      };
      
      // OVERRIDE ANY EXISTING TRANSITION TIMING FOR CALCULATIONS
      
      $targets.css(config.clean);
      
      // FOR EACH PRE-EXISTING ELEMENT, ADD STARTING POSITION TO 'ORIGPOS' ARRAY
      
      $pre.each(function(){
        this.data.origPos = $(this).offset();
      });
  
      // TEMPORARILY SHOW ALL ELEMENTS TO SHOW (THAT ARE NOT ALREADY SHOWN), WITHOUT HIDING ELEMENTS TO HIDE
      // AND ADD/REMOVE GRID AND LIST CLASSES FROM CONTAINER
  
      if(config.layoutMode == 'list'){
        $cont.addClass(config.listClass);
        $cont.removeClass(config.gridClass);
        $toshow.css('display',config.targetDisplayList);
      } else {
        $cont.addClass(config.gridClass);
        $cont.removeClass(config.listClass);
        $toshow.css('display',config.targetDisplayGrid);
      };
      
      // FOR EACH ELEMENT NOW SHOWN, ADD ITS INTERMEDIATE POSITION TO 'SHOWINTERPOS' ARRAY
  
      $toshow.each(function(){
        this.data.showInterPos = $(this).offset();
      });
      
      // FOR EACH ELEMENT TO BE HIDDEN, BUT NOT YET HIDDEN, AND NOW MOVED DUE TO SHOWN ELEMENTS,
      // ADD ITS INTERMEDIATE POSITION TO 'HIDEINTERPOS' ARRAY

      $tohide.each(function(){
        this.data.hideInterPos = $(this).offset();
      });
      
      // FOR EACH PRE-EXISTING ELEMENT, NOW MOVED DUE TO SHOWN ELEMENTS, ADD ITS POSITION TO 'PREINTERPOS' ARRAY
  
      $pre.each(function(){
        this.data.preInterPos = $(this).offset();
      });
      
      // SET DISPLAY PROPERTY OF PRE-EXISTING ELEMENTS INCASE WE ARE CHANGING LAYOUT MODE
  
      if(config.layoutMode == 'list'){
        $pre.css('display',config.targetDisplayList);
      } else {
        $pre.css('display',config.targetDisplayGrid);
      };
      
      // IF A SORT ARGUMENT HAS BEEN SENT, RUN SORT FUNCTION SO OBJECTS WILL MOVE TO THEIR FINAL ORDER
      
      if(sortby){
        sort(sortby, order, $cont, config); 
      };
      
      // IF VISIBLE SORT ORDER IS THE SAME (WHICH WOULD NOT TRIGGER A TRANSITION EVENT)
    
      if(sortby && compareArr(config.origSort, config.checkSort)){
        
        // THEN CLEAN UP AND GO HOME
        resetFilter();
        return false;
      };
      
      // TEMPORARILY HIDE ALL SHOWN ELEMENTS TO HIDE

      $tohide.hide();
      
      // FOR EACH ELEMENT TO SHOW, AND NOW MOVED DUE TO HIDDEN ELEMENTS BEING REMOVED, 
      // ADD ITS POSITION TO 'FINALPOS' ARRAY
      
      $toshow.each(function(i){
        this.data.finalPos = $(this).offset();
      });
      
      // FOR EACH PRE-EXISTING ELEMENT NOW MOVED DUE TO HIDDEN ELEMENTS BEING REMOVED,
      // ADD ITS POSITION TO 'FINALPREPOS' ARRAY
  
      $pre.each(function(){
        this.data.finalPrePos = $(this).offset();
      });
      
      // SINCE WE ARE IN OUT FINAL STATE, GET NEW HEIGHT OF CONTAINER
  
      config.newHeight = $par.height();
      
      // IF A SORT ARGUMENT AS BEEN SENT, RUN SORT FUNCTION 'RESET' TO MOVE ELEMENTS BACK TO THEIR STARTING ORDER
      
      if(sortby){
        sort('reset', null, $cont, config);
      };
      
      // RE-HIDE ALL ELEMENTS TEMPORARILY SHOWN
      
      $toshow.hide();
      
      // SET DISPLAY PROPERTY OF PRE-EXISTING ELEMENTS BACK TO THEIR 
      // ORIGINAL PROPERTY, INCASE WE ARE CHANGING LAYOUT MODE
      
      $pre.css('display',config.origDisplay);
      
      // ADD/REMOVE GRID AND LIST CLASSES FROM CONTAINER
  
      if(config.origDisplay == 'block'){
        $cont.addClass(config.listClass);
        $toshow.css('display', config.targetDisplayList);
      } else {
        $cont.removeClass(config.listClass);
        $toshow.css('display', config.targetDisplayGrid);
      };
      
      // IF WE ARE ANIMATING CONTAINER, RESET IT TO ITS STARTING HEIGHT
    
      if(config.resizeContainer)$par.css('height', config.origHeight+'px');
  
      // ADD TRANSFORMS TO ALL ELEMENTS TO SHOW
      
      var toShowCSS = {};
      
      for(var i = 0; i<2; i++){
        var a = i==0 ? a = config.prefix : '';
        toShowCSS[a+'transform'] = config.scale+' '+config.rotateX+' '+config.rotateY+' '+config.rotateZ;
        toShowCSS[a+'filter'] = config.blur+' '+config.grayscale;
      };
      
      $toshow.css(toShowCSS);
  
      // FOR EACH PRE-EXISTING ELEMENT, SUBTRACT ITS INTERMEDIATE POSITION FROM ITS ORIGINAL POSITION 
      // TO GET ITS STARTING OFFSET
  
      $pre.each(function(){
        var data = this.data,
        $t = $(this);
        
        if ($t.hasClass('mix_tohide')){
          data.preTX = data.origPos.left - data.hideInterPos.left;
          data.preTY = data.origPos.top - data.hideInterPos.top;
        } else {
          data.preTX = data.origPos.left - data.preInterPos.left;
          data.preTY = data.origPos.top - data.preInterPos.top;
        };
        var preCSS = {};
        for(var i = 0; i<2; i++){
          var a = i==0 ? a = config.prefix : '';
          preCSS[a+'transform'] = 'translate('+data.preTX+'px,'+data.preTY+'px)';
        };
        
        $t.css(preCSS); 
      });
      
      // ADD/REMOVE GRID AND LIST CLASSES FROM CONTAINER
  
      if(config.layoutMode == 'list'){
        $cont.addClass(config.listClass);
        $cont.removeClass(config.gridClass);
      } else {
        $cont.addClass(config.gridClass);
        $cont.removeClass(config.listClass);
      };
      
      // WRAP ANIMATION FUNCTIONS IN 10ms TIMEOUT TO PREVENT RACE CONDITION
      
      var delay = setTimeout(function(){
    
        // APPLY TRANSITION TIMING TO CONTAINER, AND BEGIN ANIMATION TO NEW HEIGHT
        
        if(config.resizeContainer){
          var containerCSS = {};
          for(var i = 0; i<2; i++){
            var a = i==0 ? a = config.prefix : '';
            containerCSS[a+'transition'] = 'all '+speed+'ms ease-in-out';
            containerCSS['height'] = config.newHeight+'px';
          };
          $par.css(containerCSS);
        };
  
        // BEGIN FADING IN/OUT OF ALL ELEMENTS TO SHOW/HIDE
        $tohide.css('opacity',config.fade);
        $toshow.css('opacity',1);
  
        // FOR EACH ELEMENT BEING SHOWN, CALCULATE ITS TRAJECTORY BY SUBTRACTING
        // ITS INTERMEDIATE POSITION FROM ITS FINAL POSITION.
        // ALSO ADD SPEED AND EASING
        
        $toshow.each(function(){
          var data = this.data;
          data.tX = data.finalPos.left - data.showInterPos.left;
          data.tY = data.finalPos.top - data.showInterPos.top;
          
          var toShowCSS = {};
          for(var i = 0; i<2; i++){
            var a = i==0 ? a = config.prefix : '';
            toShowCSS[a+'transition-property'] = a+'transform, '+a+'filter, opacity';
            toShowCSS[a+'transition-timing-function'] = config.easing+', linear, linear';
            toShowCSS[a+'transition-duration'] = speed+'ms';
            toShowCSS[a+'transition-delay'] = '0';
            toShowCSS[a+'transform'] = 'translate('+data.tX+'px,'+data.tY+'px)';
            toShowCSS[a+'filter'] = 'none';
          };
          
          $(this).css('-webkit-transition', 'all '+speed+'ms '+config.easingFallback).css(toShowCSS);
        });
        
        // FOR EACH PRE-EXISTING ELEMENT, IF IT HAS A FINAL POSITION, CALCULATE 
        // ITS TRAJETORY BY SUBTRACTING ITS INTERMEDIATE POSITION FROM ITS FINAL POSITION.
        // ALSO ADD SPEED AND EASING
        
        $pre.each(function(){
          var data = this.data
          data.tX = data.finalPrePos.left != 0 ? data.finalPrePos.left - data.preInterPos.left : 0;
          data.tY = data.finalPrePos.left != 0 ? data.finalPrePos.top - data.preInterPos.top : 0;
          
          var preCSS = {};
          for(var i = 0; i<2; i++){
            var a = i==0 ? a = config.prefix : '';
            preCSS[a+'transition'] = 'all '+speed+'ms '+config.easing;
            preCSS[a+'transform'] = 'translate('+data.tX+'px,'+data.tY+'px)';
          };
          
          $(this).css('-webkit-transition', 'all '+speed+'ms '+config.easingFallback).css(preCSS);
        });
    
        // BEGIN TRANSFORMS ON ALL ELEMENTS TO BE HIDDEN
        
        var toHideCSS = {};
        for(var i = 0; i<2; i++){
          var a = i==0 ? a = config.prefix : '';
          toHideCSS[a+'transition'] = 'all '+speed+'ms '+config.easing+', '+a+'filter '+speed+'ms linear, opacity '+speed+'ms linear';
          toHideCSS[a+'transform'] = config.scale+' '+config.rotateX+' '+config.rotateY+' '+config.rotateZ;
          toHideCSS[a+'filter'] = config.blur+' '+config.grayscale;
          toHideCSS['opacity'] = config.fade;
        };
        
        $tohide.css(toHideCSS);
        
        // ALL ANIMATIONS HAVE NOW BEEN STARTED, NOW LISTEN FOR TRANSITION END:
        
        $par.bind('webkitTransitionEnd transitionend otransitionend oTransitionEnd',function(e){
          
          if (e.originalEvent.propertyName.indexOf('transform') > -1 || e.originalEvent.propertyName.indexOf('opacity') > -1){
            
            if(mixSelector.indexOf('.') > -1){
            
            // IF MIXSELECTOR IS A CLASS NAME
            
              if($(e.target).hasClass(mixSelector.replace('.',''))){
                resetFilter();
              };
            
            } else {
              
            // IF MIXSELECTOR IS A TAG
            
              if($(e.target).is(mixSelector)){
                resetFilter();
              };
              
            };
            
          };
        }); 
  
      },10);
      
      // LAST RESORT EMERGENCY FAILSAFE
      
      config.failsafe = setTimeout(function(){
        if(config.mixing){
          resetFilter();
        };
      }, speed + 400);
  
    } else {
      
    // ELSE IF NOTHING TO SHOW, AND EVERYTHING TO BE HIDDEN
    
      // IF WE ARE RESIZING CONTAINER, SET ITS STARTING HEIGHT
  
      if(config.resizeContainer)$par.css('height', config.origHeight+'px');
      
      // IF IE, FUCK OFF, AND THEN GO HOME
      
      if(!window.atob){
        resetFilter();
        return false;
      };
      
      // GROUP ALL ELEMENTS TO HIDE INTO JQUERY OBJECT
      
      $tohide = $hide;
      
      // WRAP ANIMATION FUNCTIONS IN A 10ms DELAY TO PREVENT RACE CONDITION
  
      var delay = setTimeout(function(){
        
        // APPLY PERSPECTIVE TO CONTAINER
  
        $par.css(config.perspective);
        
        // APPLY TRANSITION TIMING TO CONTAINER, AND BEGIN ANIMATION TO NEW HEIGHT
    
        if(config.resizeContainer){
          var containerCSS = {};
          for(var i = 0; i<2; i++){
            var a = i==0 ? a = config.prefix : '';
            containerCSS[a+'transition'] = 'height '+speed+'ms ease-in-out';
            containerCSS['height'] = config.minHeight+'px';
          };
          $par.css(containerCSS);
        };
  
        // APPLY TRANSITION TIMING TO ALL TARGET ELEMENTS
        
        $targets.css(config.transition);
        
        // GET TOTAL NUMBER OF ELEMENTS TO HIDE
  
        var totalHide = $hide.length;
        
        // IF SOMETHING TO HIDE:
  
        if(totalHide){
          
          // BEGIN TRANSFORMS ON ALL ELEMENTS TO BE HIDDEN

          var toHideCSS = {};
          for(var i = 0; i<2; i++){
            var a = i==0 ? a = config.prefix : '';
            toHideCSS[a+'transform'] = config.scale+' '+config.rotateX+' '+config.rotateY+' '+config.rotateZ;
            toHideCSS[a+'filter'] = config.blur+' '+config.grayscale;
            toHideCSS['opacity'] = config.fade;
          };

          $tohide.css(toHideCSS);
          
          // ALL ANIMATIONS HAVE NOW BEEN STARTED, NOW LISTEN FOR TRANSITION END:

          $par.bind('webkitTransitionEnd transitionend otransitionend oTransitionEnd',function(e){
            if (e.originalEvent.propertyName.indexOf('transform') > -1 || e.originalEvent.propertyName.indexOf('opacity') > -1){
              $cont.addClass(config.failClass);
              resetFilter();
            };
          });
    
        } else {
          
        // ELSE, WE'RE DONE MIXING
          
          config.mixing = false;
        };
  
      }, 10);
    }; 
    
    // CLEAN UP AND RESET FUNCTION

    function resetFilter(){
      
      // UNBIND TRANSITION END EVENTS FROM CONTAINER
      
      $par.unbind('webkitTransitionEnd transitionend otransitionend oTransitionEnd');
      
      // IF A SORT ARGUMENT HAS BEEN SENT, SORT ELEMENTS TO THEIR FINAL ORDER
      
      if(sortby){
        sort(sortby, order, $cont, config);
      };
      
      // EMPTY SORTING ARRAYS
    
      config.startOrder = [], config.newOrder = [], config.origSort = [], config.checkSort = [];
    
      // REMOVE INLINE STYLES FROM ALL TARGET ELEMENTS AND SLAM THE BRAKES ON
      
      $targets.removeStyle(
        config.prefix+'filter, filter, '+config.prefix+'transform, transform, opacity, display'
      ).css(config.clean).removeAttr('data-checksum');
      
      // BECAUSE IE SUCKS
      
      if(!window.atob){
        $targets.css({
          display: 'none',
          opacity: '0'
        });
      };
      
      // REMOVE HEIGHT FROM CONTAINER ONLY IF RESIZING
      
      var remH = config.resizeContainer ? 'height' : '';
      
      // REMOVE INLINE STYLES FROM CONTAINER
    
      $par.removeStyle(
        config.prefix+'transition, transition, '+config.prefix+'perspective, perspective, '+config.prefix+'perspective-origin, perspective-origin, '+remH
      );
      
      // ADD FINAL DISPLAY PROPERTIES AND OPACITY TO ALL SHOWN ELEMENTS
      // CACHE CURRENT LAYOUT MODE & SORT FOR NEXT MIX
      
      if(config.layoutMode == 'list'){
        $show.css({display:config.targetDisplayList, opacity:'1'});
        config.origDisplay = config.targetDisplayList;
      } else {
        $show.css({display:config.targetDisplayGrid, opacity:'1'});
        config.origDisplay = config.targetDisplayGrid;
      };
      config.origLayout = config.layoutMode;
        
      var wait = setTimeout(function(){
        
        // LET GO OF THE BRAKES
        
        $targets.removeStyle(config.prefix+'transition, transition');
      
        // WE'RE DONE MIXING
      
        config.mixing = false;
      
        // FIRE "ONMIXEND" CALLBACK
      
        if(typeof config.onMixEnd == 'function') {
          var output = config.onMixEnd.call(this, config);
        
          // UPDATE CONFIG IF DATA RETURNED
        
          config = output ? output : config;
        };
      });
    };
  };
  
  // SORT FUNCTION
  
  function sort(sortby, order, $cont, config){

    // COMPARE BY ATTRIBUTE

    function compare(a,b) {
      var sortAttrA = isNaN(a.attr(sortby) * 1) ? a.attr(sortby).toLowerCase() : a.attr(sortby) * 1,
        sortAttrB = isNaN(b.attr(sortby) * 1) ? b.attr(sortby).toLowerCase() : b.attr(sortby) * 1;
        if (sortAttrA < sortAttrB)
          return -1;
        if (sortAttrA > sortAttrB)
          return 1;
        return 0;
    };
    
    // REBUILD DOM

    function rebuild(element){
      if(order == 'asc'){
        $sortWrapper.prepend(element).prepend(' ');
      } else {
        $sortWrapper.append(element).append(' ');
      };
    };
    
    // RANDOMIZE ARRAY

    function arrayShuffle(oldArray){
      var newArray = oldArray.slice();
      var len = newArray.length;
      var i = len;
      while (i--){
        var p = parseInt(Math.random()*len);
        var t = newArray[i];
          newArray[i] = newArray[p];
          newArray[p] = t;
      };
      return newArray; 
    };
    
    // SORT
    
    $cont.find(config.targetSelector).wrapAll('<div class="mix_sorter"/>');
    
    var $sortWrapper = $cont.find('.mix_sorter');
    
    if(!config.origSort.length){
      $sortWrapper.find(config.targetSelector+':visible').each(function(){
        $(this).wrap('<s/>');
        config.origSort.push($(this).parent().html().replace(/\s+/g, ''));
        $(this).unwrap();
      });
    };
    
    
    
    $sortWrapper.empty();
    
    if(sortby == 'reset'){
      $.each(config.startOrder,function(){
        $sortWrapper.append(this).append(' ');
      });
    } else if(sortby == 'default'){
      $.each(config.origOrder,function(){
        rebuild(this);
      });
    } else if(sortby == 'random'){
      if(!config.newOrder.length){
        config.newOrder = arrayShuffle(config.startOrder);
      };
      $.each(config.newOrder,function(){
        $sortWrapper.append(this).append(' ');
      }); 
    } else if(sortby == 'custom'){
      $.each(order, function(){
        rebuild(this);
      });
    } else { 
      // SORT BY ATTRIBUTE
      
      if(typeof config.origOrder[0].attr(sortby) === 'undefined'){
        console.log('No such attribute found. Terminating');
        return false;
      };
      
      if(!config.newOrder.length){
        $.each(config.origOrder,function(){
          config.newOrder.push($(this));
        });
        config.newOrder.sort(compare);
      };
      $.each(config.newOrder,function(){
        rebuild(this);
      });
      
    };
    config.checkSort = [];
    $sortWrapper.find(config.targetSelector+':visible').each(function(i){
      var $t = $(this);
      if(i == 0){
        
        // PREVENT COMPARE RETURNING FALSE POSITIVES ON ELEMENTS WITH NO CLASS/ATTRIBUTES
        
        $t.attr('data-checksum','1');
      };
      $t.wrap('<s/>');
      config.checkSort.push($t.parent().html().replace(/\s+/g, ''));
      $t.unwrap();
    });
    
    $cont.find(config.targetSelector).unwrap();
  };
  
  // FIND VENDOR PREFIX

  function prefix(el) {
      var prefixes = ["Webkit", "Moz", "O", "ms"];
      for (var i = 0; i < prefixes.length; i++){
          if (prefixes[i] + "Transition" in el.style){
              return prefixes[i];
          };
      };
      return "transition" in el.style ? "" : false;
  };
  
  // REMOVE SPECIFIC STYLES
  
  $.fn.removeStyle = function(style){
    return this.each(function(){
      var obj = $(this);
      style = style.replace(/\s+/g, '');
      var styles = style.split(',');
      $.each(styles,function(){
        
        var search = new RegExp(this.toString() + '[^;]+;?', 'g');
        obj.attr('style', function(i, style){
          if(style) return style.replace(search, '');
          });
      });
    });
    };

  // COMPARE ARRAYS 
  
  function compareArr(a,b){
      if (a.length != b.length) return false;
      for (var i = 0; i < b.length; i++){
          if (a[i].compare) { 
              if (!a[i].compare(b[i])) return false;
          };
          if (a[i] !== b[i]) return false;
      };
      return true;
  };
  
  // BUILD FILTER ARRAY(S)
  
  function buildFilterArray(str){
    // CLEAN FILTER STRING
    str = str.replace(/\s{2,}/g, ' ');
    // FOR EACH PEROID SEPERATED CLASS NAME, ADD STRING TO FILTER ARRAY
    var arr = str.split(' ');
    // IF ALL, REPLACE WITH MIX_ALL
    $.each(arr,function(i){
      if(this == 'all')arr[i] = 'mix_all';
    });
    if(arr[0] == "")arr.shift(); 
    return arr;
  };

  
})(jQuery);

