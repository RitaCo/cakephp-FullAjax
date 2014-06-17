
(function ($) {
    'use strict';
	
var CakeAjax = function(){};

function _findUrl(el){
	return el.attr('href') || el.data('remote') || el.attr('action') || false;
}

function _findContainer(el) {
	var container = el.data('ajax-inner');
	if(container=== undefined) {
		container = _getId(el.closest('[data-ajax-container]'));
	}

	return container
}




function _isPushable(el){
	var push = true;
	push = el.data('ajax-push');
		
	if(jQuery.isEmptyObject(push)){
	
		push = el.closest('[data-ajax]').data('ajax-push');	
		
	} 
	if(!push && typeof push === "boolean"){
		return false;
	}

	return  true;
}

function _getId(el) {
	
  var id  = el.attr('id');	
  if (id === undefined){
  	id = (new Date).getTime();
  	el.attr('id',id);
  }		
  return  '#'+id;
}

CakeAjax.prototype.click = function(event) {

	var $this = $(this);
	
	var $params = {};
	$params.url = _findUrl($this);
	$params.container = _findContainer($this);
	$params.push = _isPushable($this);
	if($params.url && $params.container){
		event.preventDefault();	
	}
	
	
	l($params);
	$.pjax($params);
	
	
	

}

	  
    $(function () {
    	
/**
* Ajax Setup
*/ 	
//    $(document).ajaxStart(function(){
//    	$('#busy-indicator').slideDown('fast');
//    });
//   
//    $(document).ajaxComplete(function(){
//    	$('#busy-indicator').slideUp();
//    });
	    	
		$('body').on('click', '[data-ajax] a ,a[data-ajax]', CakeAjax.prototype.click);
        //$('body').on('submit', '.ajax', Ajax.prototype.submit);
        //$('body').on('click', 'a[data-cancel-closest]', Ajax.prototype.cancel);

    //    $(document).on('cake-ajax:begin', Handlers.prototype.begin);
//        $(document).on('cake-ajax:success', Handlers.prototype.redirect);
//        $(document).on('cake-ajax:success', Handlers.prototype.fragments);
//        $(document).on('cake-ajax:success', '[data-replace]', Handlers.prototype.replace);
//        $(document).on('cake-ajax:success', '[data-replace-closest]', Handlers.prototype.replaceClosest);
//        $(document).on('cake-ajax:success', '[data-inner]', Handlers.prototype.replaceInner);
//        $(document).on('cake-ajax:success', '[data-replace-closest-inner]', Handlers.prototype.replaceClosestInner);
//        $(document).on('cake-ajax:success', '[data-append]', Handlers.prototype.append);
//        $(document).on('cake-ajax:success', '[data-prepend]', Handlers.prototype.prepend);
//        $(document).on('cake-ajax:success', '[data-refresh]', Handlers.prototype.refresh);
//        $(document).on('cake-ajax:success', '[data-refresh-closest]', Handlers.prototype.refreshClosest);
//        $(document).on('cake-ajax:success', '[data-clear]', Handlers.prototype.clear);
//        $(document).on('cake-ajax:success', '[data-remove]', Handlers.prototype.remove);
//        $(document).on('cake-ajax:success', '[data-clear-closest]', Handlers.prototype.clearClosest);
//        $(document).on('cake-ajax:success', '[data-remove-closest]', Handlers.prototype.removeClosest);
    });
}(window.jQuery));
