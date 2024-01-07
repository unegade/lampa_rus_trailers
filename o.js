(function () {
	'use strict';

	function remove_default_trailers() {
		Lampa.Listener.follow('full', function (e) {
			if (e.type == 'complite') {
				e.object.activity.render().find('.view--trailer').remove();
			}
		});
	}

	function render_trailers(filmName) {
		var token = 'AIzaSyDIWii53ZrXWVTEMOWf6lX2Ix347eFPTww';
		var searchName = filmName + ' русский трейлер';
		$.get('https://www.googleapis.com/youtube/v3/search?key=' + token + '&q=' + searchName + '&part=snippet&maxResults=10', function (data) {
			data['items'].map((item) => {
				console.log(item);
			});
			Lampa.Select.show({
				title: 'Трейлеры',
				items: data['items'].map((item) => {
					var id = item['id']['videoId'];
					var title = item['snippet']['title'];
					var image = item['snippet']['thumbnails']['medium']['url'];
					var html = '<div><img src="' + image + '"/>'+ title + '</div>'
					return {id: id, title: html}
				}),
				onSelect: function onSelect(a) {
					Lampa.YouTube.play(a.id)
					// Lampa.Activity.push({ url: a.url, title: a.tvmedia, component: 'iptvskaz_n', page: 1 });
				},
				onBack: function onBack() {
					Lampa.Controller.toggle('content');
				}
			});
		});
		// console.log(filmName);
		// Lampa.Noty.show(filmName);
	}


	function startPlugin() {
		window.trailer_plugin = true;
		Lampa.Listener.follow('full', function (e) {
			if (e.type == 'complite') {
				e.object.activity.render().find('.view--trailer').remove();
				var render = e.object.activity.render();
				var filmName = $('.full-start-new__title', render).text();
				$('.full-start-new__buttons', render).prepend('<div class="full-start__button selector button--trailer"><svg height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="1.5" y="1.5" width="25" height="31" rx="2.5" stroke="currentColor" stroke-width="3"></rect><rect x="6" y="7" width="9" height="9" rx="1" fill="currentColor"></rect><rect x="6" y="19" width="16" height="3" rx="1.5" fill="currentColor"></rect><rect x="6" y="25" width="11" height="3" rx="1.5" fill="currentColor"></rect><rect x="17" y="7" width="5" height="3" rx="1.5" fill="currentColor"></rect> </svg><span>Трейлеры</span></div>');
				$('.button--trailer', render).on('hover:enter', function (card) {
					render_trailers(filmName);
				});
			}

		});

	}
	if (!window.trailer_plugin) startPlugin();

})();
