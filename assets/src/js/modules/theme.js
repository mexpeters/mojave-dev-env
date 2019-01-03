// ------------------------------------
//
// Theme
//
// ------------------------------------

(function($) { // eslint-disable-line no-unused-vars

	if (typeof window.Theme == 'undefined') window.Theme = {};

	Theme = {

		settings: {},

		/*
		 * Theme init
		 */

		init: function() {

			this.example();
			console.log('Theme initilised');

		},

		example: function() {
			console.log('Start Working!');
		}
	};
	
	module.exports = Theme;

})(jQuery);