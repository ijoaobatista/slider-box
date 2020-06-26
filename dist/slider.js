/*
* The MIT License (MIT)
*
* Copyright (c) 2018 Slider João Batista
* https://mjobi.com/
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
*/

function slider (content, time = 5000) {
	
	var alert = $('.slider-content-top');
	var btnNextPrev = $('.slider-btn');
	var bg = $('.slider-wrapp');

	var dots = '<div class="slider-dot"></div>';
	var btnPlay = '<div class="slider-play"><i class="material-icons">pause</i></div>';

	var totalImages = content.image.length-1;
	var inite = 0;

	var isReturn = false;
	var isNext = true;
	var isPause = false;

	var pauseTime = null;

	if (content !== null) {
		setContent();
	}

	function setContent() {
		if (content.image.length === 1) {
			mediaSet(true);
		}else {
			mediaSet(false);
		}
	}

	function mediaSet(unique) {
		if (unique === true) {

			$(bg).css('background-image', 'url('+content.image[inite]+')');
			setPanel();
			setContentPanel(inite);

		}else {

			$(bg).hover(function() {
				showButtons(true);
			}, function() {
				hideButtons(true);
			});

			$(bg).css('background-image', 'url('+content.image[inite]+')');
			setDots();
			dotActive(inite);
			setPanel();
			setContentPanel(inite);
			
			autoPass();
		}
	}

	function uriSlide(i) {

		var obj = 'a[data-uri]';
		var uriSlide = $(obj);

		$(uriSlide).attr('href', content.uriSlide[i]);

	}

	function setPanel(position = 'left') {

		var onpanel = {
			html: '<div class="slider-column"><h2 class="slider-title"></h2><p class="slider-text"></p><a id="linkTo"><button class="slider-btn-action"></button></a></div>'
		};
		var pos = '.slider-content-'+position;

		$(alert).html('<span>'+content.title+'</span>');
		$(pos).append(onpanel.html);

	}

	function setContentPanel(i) {

		var iconName = 'keyboard_arrow_right';
		var icon = '<i class="material-icons">'+iconName+'</i>';

		$('.slider-title').text(content.titleSlide[i]);
		$('.slider-text').text(content.descriptionSlide[i]);
		$('#linkTo').attr('href', content.uriSlide[i]);
		$('.slider-btn-action').html(content.textActionSlide[i]+icon);

	}

	function autoPass() {

		var ind = getIndexDots();

		pauseTime = setTimeout(function() {

			if (isNext === true && isReturn === false && isPause === false) {
				
				if (ind.active >= totalImages) {
					isNext = false;
					isReturn = true;
					++inite;
					nextSlide(ind.prev);
					dotActive(ind.prev);
					setContentPanel(ind.prev);
				}else {
					++inite;
					nextSlide(ind.next);
					dotActive(ind.next);
					setContentPanel(ind.next);
				}
				

			}else if (isReturn === true && isNext === false && isPause === false) {

				if (ind.active <= 0) {
					isNext = true;
					isReturn = false;
					++inite;
					prevSlide(ind.next);
					dotActive(ind.next);
					setContentPanel(ind.next);
				}else {
					++inite;
					prevSlide(ind.prev);
					dotActive(ind.prev);
					setContentPanel(ind.prev);
				}

			}

			autoPass();

		}, time);
	}

	function dotActive(i) {

		var dots = $('.slider-dot');

		$.each(dots, function(index, val) {
			$(dots[index]).removeClass('active');
		});

		$(dots[i]).addClass('active');

	}

	function nextSlide(i) {
		$(bg).addClass('slider-anim-left');
		$(bg).css('background-image', 'url('+content.image[i]+')');
		setTimeout(function() {
			$(bg).removeClass('slider-anim-left');
		}, 300);
	}

	$(btnNextPrev[1]).click(function(event) {

		event.preventDefault();

		var src = getIndexDots();
		clearTimeout(pauseTime);

		if (src.next > totalImages) {

			inite = 0;

			nextSlide(inite);
			dotActive(inite);
			isNext = true;
			isReturn = false;
			setContentPanel(inite);
			autoPass();

		}else {

			nextSlide(src.next);
			dotActive(src.next);
			inite = src.active+1;
			isNext = true;
			isReturn = false;
			setContentPanel(src.next);
			autoPass();

		}

	});

	function prevSlide(i) {
		$(bg).addClass('slider-anim-right');
		$(bg).css('background-image', 'url('+content.image[i]+')');
		setTimeout(function() {
			$(bg).removeClass('slider-anim-right');
		}, 300);
	}

	$(btnNextPrev[0]).click(function(event) {

		event.preventDefault();

		var src = getIndexDots();
		clearTimeout(pauseTime);
		
		if (src.prev < 0) {

			inite = totalImages;

			prevSlide(inite);
			dotActive(inite);
			isNext = false;
			isReturn = true;
			setContentPanel(inite);
			autoPass();

		}else {

			prevSlide(src.prev);
			dotActive(src.prev);
			inite = src.active-1;
			isNext = false;
			isReturn = true;
			setContentPanel(src.prev);
			autoPass();

		}

	});

	function setDots() {

		var newDots = [];

		$.each(content.image, function(index) {
			 $('.slider-dots').append(dots);
		});

		newDots = $('.slider-dot');

		$.each(newDots, function(index) {
			 $(newDots[index]).attr('data-index', index);
		});

		$('.slider-dots').append(btnPlay);
	}

	function getIndexDots() {

		var obj = {};
		var dots = $('.active');
		var next = $(dots[0]).attr('data-index');
		var prev = $(dots[0]).attr('data-index');
		var active = $(dots[0]).attr('data-index');
		active = parseInt(active);
		next = parseInt(next);
		prev = parseInt(prev);
		next = next+1;
		prev = prev-1;

		obj = {
			next: next,
			prev: prev,
			active: active
		};

		return obj;

	}

	$('.slider-play').click(function(event) {

		event.preventDefault();

		var icon = $(this).children();

		if (isPause === false) {
			isPause = true;
			clearTimeout(pauseTime);
			$(icon).text('play_arrow');
		}else {
			isPause = false;
			$(icon).text('pause');
			autoPass();
		}
	});

	$('.slider-dot').click(function(event) {
		event.preventDefault();
		var index = $(this).attr('data-index');
		clearTimeout(pauseTime);
		nextSlide(index);
		dotActive(index);
		setContentPanel(index);
		inite = index;
		autoPass();
	});

	$(bg).click(function(event) {
		var i = getIndexDots();
		uriSlide(i.active);
	});

	function hideButtons(all) {
		if (all === true) {
			$.each(btnNextPrev, function(index) {
				 $(btnNextPrev[index]).css('visibility', 'hidden');
			});
		}
	}

	function showButtons(all) {
		if (all === true) {
			$.each(btnNextPrev, function(index) {
				 $(btnNextPrev[index]).css('visibility', 'visible');
			});
		}
	}

}

