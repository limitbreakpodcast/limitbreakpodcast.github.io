 AOS.init({
	duration: 800,
	easing: 'slide',
	once: true
});

let currentPage = 0;
let pagesCount = 0;

jQuery(document).ready(function($) {
	
	"use strict";
	
	const feedUrl = 'https://anchor.fm/s/1d3bd2fc/podcast/rss';
	const apiKey = '';
	const feedCount = 10;
	const pageSize = 5;

	/**
	 * Download the rss feed and setup page using data
	 * @param {string} feedUrl 
	 * @param {string} apiKey
	 * @param {number} count
	 */
	var setupPageWithRss = function(feedUrl, apiKey, count) {
		fetch('https://api.rss2json.com/v1/api.json?rss_url='+feedUrl+'&api_key='+apiKey+'&count='+count)
		.then(data => data.json())
		.then(response => {
			console.log(response);
			if(response.status == 'ok') {
				fillEpisodesList(response.items);
				showPage(currentPage);
			} else {
				console.error("Cannot download rss feed");
			}
		});
	};
	setupPageWithRss(feedUrl, apiKey, feedCount);

	var fillEpisodesList = function(items) {
		if(!items || items.length == 0)
			return;
		// Fill last episode
		const lastEpisode = items[0];
		console.log(lastEpisode);
		$('#lastEpisodeHeader').text(lastEpisode.title);
		$('#lastEpisodeAuthor').text(lastEpisode.author);
		// Set url
		$('#lastEpisodeLink').attr('href', lastEpisode.link)
		$('#lastEpisodeIframe').attr('src', lastEpisode.link.replace('/episodes/', '/embed/episodes/'));
		// Get the date only (not so good way)
		const episodeDate = lastEpisode.pubDate.split(' ')[0];
		$('#lastEpisodeDate').text(episodeDate);
		const firstContainer = $('.episodeContainer');
		const parent = firstContainer.parent();

		items.forEach(item => {
			fillEpisode(item, firstContainer, parent);
		});
		firstContainer.remove();

		const firstPageCounter = $('.pageCounter');
		pagesCount = items.length / pageSize;
		for(let i = 0; i < pagesCount; i++) {
			createPageCursor(firstPageCounter, i);
		}
		firstPageCounter.remove();
	};

	var fillEpisode = function(item, firstContainer, parent) {
		const clone = firstContainer.clone();
		const episodeLink = clone.find('.episodeLink');
		episodeLink.text(item.title);
		episodeLink.attr('href', item.link);
		const episodeIframe = clone.find('.episodeIframe');
		episodeIframe.attr('src', item.link.replace('/episodes/', '/embed/episodes/'));
		const episodeAuthor = clone.find('.episodeAuthor');
		episodeAuthor.text(item.author);
		const episodeDescription = clone.find('.episodeDescription');
		episodeDescription.html(item.description.substring(0, 80) + '...');
		const episodeDate = clone.find('.episodeDate');
		episodeDate.text(item.pubDate.split(' ')[0]);
		const episodeImage = clone.find('.episodeImage');
		episodeImage.attr('style', 'background-image: url('+item.thumbnail+')');
		clone.appendTo(parent);
	};

	var createPageCursor = function(firstPageCounter, i) {
		const counter = firstPageCounter.clone();
		counter.find('span').text(i + 1);
		counter.appendTo(firstPageCounter.parent());
		if(i == 0)
			$(counter).addClass('active');
		$(counter).click(function() {
			$('.pageCounter').removeClass('active');
			showPage(i);
			$(this).addClass('active');
		});
	};

	var showPage = function(index) {
		const countPerPage = pageSize;
		const limitMin = countPerPage * index;
		const limitMax = limitMin + countPerPage;
		currentPage = index;
		$('.episodeContainer').each((index, container) => {
			if(index >= limitMin && index < limitMax){
				$(container).show();
			}else{
				// Hide does not work due to style with important
				$(container).attr('style','display:none !important');
			}
		});
	};
	
	var siteMenuClone = function() {
		
		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});
		
		
		setTimeout(function() {
			
			var counter = 0;
			$('.site-mobile-menu .has-children').each(function(){
				var $this = $(this);
				
				$this.prepend('<span class="arrow-collapse collapsed">');
				
				$this.find('.arrow-collapse').attr({
					'data-toggle' : 'collapse',
					'data-target' : '#collapseItem' + counter,
				});
				
				$this.find('> ul').attr({
					'class' : 'collapse',
					'id' : 'collapseItem' + counter,
				});
				
				counter++;
				
			});
			
		}, 1000);
		
		$('body').on('click', '.arrow-collapse', function(e) {
			var $this = $(this);
			if ( $this.closest('li').find('.collapse').hasClass('show') ) {
				$this.removeClass('active');
			} else {
				$this.addClass('active');
			}
			e.preventDefault();  
			
		});
		
		$(window).resize(function() {
			var $this = $(this),
			w = $this.width();
			
			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})
		
		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();
			
			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 
		
		// click outisde offcanvas
		$(document).mouseup(function(e) {
			var container = $(".site-mobile-menu");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		});
	}; 
	siteMenuClone();
	
	
	var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();
	
	
	var siteSliderRange = function() {
		$( "#slider-range" ).slider({
			range: true,
			min: 0,
			max: 500,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			}
		});
		$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
		" - $" + $( "#slider-range" ).slider( "values", 1 ) );
	};
	// siteSliderRange();
	
	
	var siteMagnificPopup = function() {
		$('.image-popup').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			closeBtnInside: false,
			fixedContentPos: true,
			mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1] // Will preload 0 - before current, and 1 after the current image
			},
			image: {
				verticalFit: true
			},
			zoom: {
				enabled: true,
				duration: 300 // don't foget to change the duration also in CSS
			}
		});
		
		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			
			fixedContentPos: false
		});
	};
	siteMagnificPopup();
	
	
	var siteCarousel = function () {
		if ( $('.nonloop-block-13').length > 0 ) {
			$('.nonloop-block-13').owlCarousel({
				center: false,
				items: 1,
				loop: false,
				stagePadding: 0,
				margin: 20,
				nav: true,
				navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
				responsive:{
					600:{
						margin: 20,
						items: 2
					},
					1000:{
						margin: 20,
						stagePadding: 0,
						items: 2
					},
					1200:{
						margin: 20,
						stagePadding: 0,
						items: 3
					}
				}
			});
		}
		
		$('.slide-one-item').owlCarousel({
			center: false,
			items: 1,
			loop: true,
			stagePadding: 0,
			margin: 0,
			autoplay: true,
			pauseOnHover: false,
			nav: true,
			navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">']
		});
	};
	siteCarousel();
	
	var siteStellar = function() {
		$(window).stellar({
			responsive: false,
			parallaxBackgrounds: true,
			parallaxElements: true,
			horizontalScrolling: false,
			hideDistantElements: false,
			scrollProperty: 'scroll'
		});
	};
	siteStellar();
	
	var siteCountDown = function() {
		
		$('#date-countdown').countdown('2020/10/10', function(event) {
			var $this = $(this).html(event.strftime(''
			+ '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
			+ '<span class="countdown-block"><span class="label">%d</span> days </span>'
			+ '<span class="countdown-block"><span class="label">%H</span> hr </span>'
			+ '<span class="countdown-block"><span class="label">%M</span> min </span>'
			+ '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});
		
	};
	siteCountDown();
	
});