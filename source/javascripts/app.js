jQuery(function($){
	
	/**
	* Custom select
	*/
	(function(){
		
		$('.fancybox').fancybox({
			'width':     '80%',
			'autoSize':  false,
			'maxWidth':  980,
			'padding':   [45, 45, 45, 45]
		});
		
	}());
	
	/**
	* Popover activate
	*/
	(function(){
		var $popover = $("[data-toggle=popover]");
		
		$popover.popover();
	
		$(document).on("click", ".popover-title", function() {
			$popover.filter("[aria-describedby^='popover']").trigger("click");
		});
	}());
	
});