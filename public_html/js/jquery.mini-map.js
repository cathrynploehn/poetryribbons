/* 
jQuery Mini-Map plugin copyright Sam Croft <samcroft@gmail.com>
Licensed like jQuery - http://docs.jquery.com/License
*/

var SCALE = 8;
var index = 1;

(function($){
	$.fn.minimap = function() {
		var miniMap;
		var miniMapCurrentView;
		var offset;
		var mapIconY;
		
		var el = $("#originalLyrics-pane");
		var elPosition = el.offset();
		
		function setup() {

				miniMap = $('#mini-map');
				miniMap.append('<div id="current-view">');
			
			
			els = $("#originalLyrics-pane").children();
			
			els.each(function(i,t){

				var articleCoords = $(this).offset();
				var mapIconHeight = $(this).height()/SCALE;
				var mapIconMarginTop = parseInt($(this).css('margin-top'))/SCALE;
				var mapIconMarginBottom = parseInt($(this).css('margin-bottom'))/SCALE;
				
				if (i == 0) {
					mapIconY = (articleCoords.top/SCALE) - mapIconMarginTop;
				} else {
					mapIconY = (articleCoords.top/SCALE) + offset;
				}
				
				offset = mapIconMarginTop + mapIconMarginBottom;
				
				var mapIcon = $('<div>');
				mapIcon
					.css({'height':mapIconHeight+'px', 'margin-top':mapIconMarginTop+'px', 'margin-bottom':mapIconMarginBottom+'px', 'top':mapIconY+'px'})
					.addClass(t.tagName.toLowerCase());
				
				if(i == 0 || i >= ($(els).size()-1)){
					mapIcon.addClass("lyrics-pane-padding");
				} else if($(this).hasClass("space")){
					mapIcon.addClass("space");
				} else {
					mapIcon.addClass("line"+(index));
					index++;
				}

				mapIcon.appendTo(miniMap);
			});
			
			mapView();
		}
		
		function mapView() {
			var miniMapHeight = 0;
			$.each(miniMap.find('div'), function(){
				miniMapHeight += parseInt($(this).outerHeight(true));
			});
			miniMapHeight += 20;

			var elOffset = el.offset();
			$('#mini-map-container').css({'height':miniMapHeight+'px', 'right':'10px', 'top':elOffset.top+'px'});
			miniMapCurrentView = $('#current-view');
			var miniMapCurrentViewHeight = ($(".poem-lyrics-pane-lyrics").height()/(SCALE-1));
			var miniMapCurrentViewWidth = ($(".poem-lyrics-pane-lyrics").width()/SCALE);
			miniMapCurrentView.css({'height':miniMapCurrentViewHeight+'px'})
				.draggable({ axis: "y", containment:"#mini-map", drag: function( event, ui ) {
					var location = ($(miniMapCurrentView).position());		
					var locationY = (location.top)*(SCALE);
				  	//$(".poem-lyrics-pane-lyrics").stop().animate({ scrollTop: locationY }, '0');
				  	$(".poem-lyrics-pane-lyrics").scrollTop(locationY);
				} });
		}
		
		$(".poem-lyrics-pane-lyrics").scroll(function(){
			
			var miniMapCurrentViewY = ($(".poem-lyrics-pane-lyrics").scrollTop()/SCALE);
			
			miniMapCurrentView.css({'top':miniMapCurrentViewY+'px'});
		});
		
		setup();
	}
})(jQuery);