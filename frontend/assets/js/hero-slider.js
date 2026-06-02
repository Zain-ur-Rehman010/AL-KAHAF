// Modern Hero Slider JavaScript
(function() {
	'use strict';

	// Initialize Modern Swiper
	const modernSwiper = new Swiper('.modern-swiper', {
		// Basic Options
		loop: true,
		speed: 800,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		 
		// Autoplay
		autoplay: {
			delay: 9000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true
		},
		
		// Pagination
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			dynamicBullets: false,
			renderBullet: function (index, className) {
				return '<span class="' + className + '"></span>';
			}
		},
		
		// Navigation
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		
		// Keyboard Control
		keyboard: {
			enabled: true,
			onlyInViewport: true,
		},
		
		// Mouse Wheel Control
		mousewheel: {
			enabled: true,
			forceToAxis: true,
		},
		
		// Parallax Effect
		parallax: true,
		
		// Touch Control
		touchRatio: 1,
		touchAngle: 45,
		grabCursor: true,
		
		// Accessibility
		a11y: {
			enabled: true
		},
		
		// Lazy Loading
		lazy: {
			loadPrevNext: true,
		},
		
		// Events
		on: {
			init: function () {
				console.log('Modern Swiper initialized');
			},
			slideChange: function () {
				console.log('Slide changed to: ' + this.activeIndex);
			},
		}
	});

	// Custom Cursor Follower
	if (window.innerWidth >= 1024) {
		const cursor = document.querySelector('.cursor-follower');

		if (cursor) {
			document.addEventListener('mousemove', (e) => {
				cursor.style.left = e.clientX + 'px';
				cursor.style.top = e.clientY + 'px';
			});

			document.querySelectorAll('a, button, .swiper-slide').forEach(el => {
				el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
				el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
			});
		}
	}

	// Pause autoplay on button hover
	const buttons = document.querySelectorAll('.modern-btn');
	buttons.forEach(button => {
		button.addEventListener('mouseenter', () => {
			if (modernSwiper && modernSwiper.autoplay) {
				modernSwiper.autoplay.stop();
			}
		});
		
		button.addEventListener('mouseleave', () => {
			if (modernSwiper && modernSwiper.autoplay) {
				modernSwiper.autoplay.start();
			}
		});
	});

	// Enhanced Animation on Slide Change
	if (modernSwiper) {
		modernSwiper.on('slideChange', function () {
			const activeSlide = document.querySelector('.swiper-slide-active');
			if (activeSlide) {
				const elements = activeSlide.querySelectorAll('.modern-badge, .modern-title, .modern-description, .modern-stats, .modern-buttons, .slide-image-content');
				
				elements.forEach((el, index) => {
					el.style.animation = 'none';
					setTimeout(() => {
						el.style.animation = `slideUp 0.8s ease-out ${index * 0.2}s both`;
					}, 10);
				});
			}
		});
	}

})();
