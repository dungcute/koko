(function(e){e.fn.tile=function(t){var n,r,i,s,o,u,a=document.body.style,f=["height"],l=this.length-1;if(!t)t=this.length;u=a.removeProperty?a.removeProperty:a.removeAttribute;return this.each(function(){u.apply(this.style,f)}).each(function(u){s=u%t;if(s==0)n=[];r=n[s]=e(this);o=r.css("box-sizing")=="border-box"?r.outerHeight():r.innerHeight();if(s==0||o>i)i=o;if(u==l||s==t-1){e.each(n,function(){this.css("height",i)})}})}})(jQuery)

$(window).load(function() {

	if (window.matchMedia('screen and (min-width:641px)').matches) {

		$('#index_route > div article > div > div').tile();
		$('#driver li dl').tile(4);
		$('#safety_efforts_quarity li').tile(2);
		$('#inquiry_phone li').tile(2);
		$('#discount_list li').tile(2);
		$('#reserve_steps li').tile(4);
		$('#pay_convenience li .text').tile();
		$('#column_list a').tile(4);
		$('#column_entries a').tile(3);

	} else {

		$('#driver li dl').tile(2);
		$('#pay_convenience li .text').tile(2);
		$('#seat_list > ul > li').tile(2);
		$('#column_list a').tile(2);
		$('#column_entries a').tile(2);
		$('#udon_airport_shuttle_timetable section div').tile(3);
	}

	$('#en #header_menu_main nav li a').tile();
	$('#campaign_list li a').tile();
	$('#guide_list li').tile();
	$('#seat_list a').tile(2);

});