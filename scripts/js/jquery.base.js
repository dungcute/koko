if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {eventName = 'orientationchange';} else {eventName = 'resize';}
$(window).on(eventName,function() {location.reload();});
var ua = navigator.userAgent.toLowerCase();
var isMobile = /iphone/.test(ua)||/android(.+)?mobile/.test(ua);
if (!isMobile) {$('a[href^="tel:"]').on('click', function(e) {e.preventDefault();});}



$(function() {

    $(".tab nav li").removeClass("active").eq(0).addClass("active");
    $(".tab > div").removeClass("show").eq(0).addClass("show");
    $(".tab nav li").click(function() {
        var index = $(".tab nav li").index(this);
        $(".tab nav li").removeClass("active");
        $(this).addClass("active");
        $(".tab > div").removeClass("show").eq(index).addClass("show");
		$('#udon_airport_shuttle_timetable section div').tile(3);
    });

	if (window.matchMedia('screen and (min-width:769px)').matches) {
	
		$(window).on('load', function() {
			divnav = $("#header > div > nav").width();
			divdiv = $("#header > div > div").width();
			$("#header aside").css({'padding-right' : divnav+divdiv+'px'});
		});

		$(window).on('load', function() {
			RouteH3Height = $("#index_route h3").height();
			RouteDetailHeight = $("#index_route article").height();
			$('#index_route > div').css({'height' : RouteDetailHeight+RouteH3Height+45+'px'});
		});

		$("#index_route #index_route_kagawa > div").css("display","block");
		$("#index_route #index_route_kagawa h3").addClass("active")
		$("#index_route > div h3").click(function() {
			$(this).next("div").fadeToggle("slow");
			$("#index_route > div h3.active").next("div").fadeToggle("slow");
			$("#index_route > div h3.active").removeClass("active");
			$(this).addClass("active");
			
		});
		
	} else {
		
		$(window).on('load',function() {
			$("#header section > div").css("display","none");
			$("#header section > h2").click(function(){
				$("main").css("display","none");
				$("footer").css("display","none");
				$(this).next().slideToggle("slow",function(){
					if ($(this).is(":hidden")) {
						$("main").css("display","block");
						$("footer").css("display","block");
						$("#header section > h2").removeClass("active");
					} else {
						$("#header section > h2").addClass("active");
					}
				});
			});
		});

		$("#footer nav h2").on('click', function() {
			if ($(this).hasClass("active")) {
				$("h2.active").next("ul").slideToggle("slow");
				$("h2.active").removeClass("active");
			} else {
				$(this).next("ul").slideToggle("slow");
				$("h2.active").next("ul").slideToggle("slow");
				$("h2.active").removeClass("active");
				$(this).addClass("active");
			}
			return false;
		});

		$("#index_route h3").click(function() {
			if ($(this).hasClass("active")) {
				$(this).next("div").slideToggle("slow");
				$("#index_route h3.active").removeClass("active");
			} else {
				$(this).next("div").slideToggle("slow");
				$("#index_route h3.active").next("div").slideToggle("slow");
				$("#index_route h3.active").removeClass("active");
				$(this).addClass("active");
			}
		});
	
	}

	$(window).on('load',function() {
		$("#header > div nav ul").css("display","none");
		$("#header > div nav h2").click(function(){
			$(this).next().slideToggle("slow");
		});
	});

	$(document).ready(function() {
		var topBtn = $('#footer > p');
		topBtn.hide();
		$(window).scroll(function(){
			if($(this).scrollTop() > 0){
				topBtn.fadeIn();
			} else {
				topBtn.fadeOut();
			}
		});
		topBtn.click(function () {
			$('body,html').animate({
				scrollTop: 0
			},1000);
			return false;
		});
	});

	$(document).ready(function(e) {
		var get = 0;
		$('#searchForm .minus').click(function(){
			get = parseInt($('+select' ,this).val());
			if(get <= 0){
				set = 0;
			}else{
				set = get-1;
			}
			$('+select' ,this).val(set);
		});
		$('#searchForm .plus').click(function(){
			get = parseInt($(this).prev().val());
			if(get >= 9){
				set = 9;
			}else{
				set = get+1;
			}
			$(this).prev().val(set);
		});
	});

	$('#faq dt').click(function(e){
		$('+dd', this).slideToggle(500);
		$(this).toggleClass('opened');
	})

});














/* Timeschedule table & Footer Nav */
var wwtimer = false;
var wwsize = window.innerWidth;

$(function() { 
	setTimeout(function() {
		$(window).resize(function(){
			if (wwtimer !== false) {
				clearTimeout(wwtimer);
			}
			wwtimer = setTimeout(function() {
				if(wwsize > 840 && window.innerWidth <= 840) {
					$('#time_schedule h3').removeClass('opened');
					$('#time_schedule div').hide();
					$('#footer_nav_in h2').removeClass('opened');
					$('#footer_nav_in ul').hide();
				}else if(wwsize <= 840 && window.innerWidth > 840) {
					$('#time_schedule div').show();
					$('#footer_nav_in ul').show();
				}
				wwsize= window.innerWidth;
			}, 500);
		});
	}, 100);
});


$(function() {
	if(window.innerWidth <= 840) {
		$('#time_schedule div').hide();
	}else{
		$('#time_schedule div').show();
	}
	$('#time_schedule h3').click(function(e){
		if (window.innerWidth <= 840) {
			$('+div', this).slideToggle(500);
			$(this).toggleClass('opened');
		}
	})
});
