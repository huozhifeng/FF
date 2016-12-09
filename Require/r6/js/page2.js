require.config({
	baseUrl: 'js',
	paths: {
		'jquery': 'http://code.jquery.com/jquery-1.11.3.min'
	}
});

require(['jquery', 'event', 'selector'], function($, E, S) {
	alert($);
	alert(E);
	alert(S);
});