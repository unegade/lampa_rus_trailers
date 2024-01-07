(function () {
	'use strict';

	var icon_trailer = '<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M7 5V19M17 5V19M3 8H7M17 8H21M3 16H7M17 16H21M3 12H21M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
	
	function remove_default_trailers() {
		Lampa.Listener.follow('full', function (e) {
			if (e.type == 'complite') {
				e.object.activity.render().find('.view--trailer').remove();
			}
		});
	}

	function find_trailers(filmName) {
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
					var html = '<div><img src="' + image + '"/>' + title + '</div>'
					return { id: id, title: html }
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

	function init_settings() {
		Lampa.SettingsApi.addComponent({
			component: 'trailer_settings',
			name: 'Трейлеры',
			icon: icon_trailer
		});
		Lampa.SettingsApi.addParam({
			component: 'trailer_settings',
			param: {
				name: 'youtube_token',
				type: 'input',
			},
			field: {
				name: 'Youtube token'
			},
			// onRender: function (item) {
			// 	item.on('hover:enter', function () {
			// 		Lampa.Settings.create('add_interface_plugin');
			// 		Lampa.Controller.enabled().controller.back = function () {
			// 			Lampa.Settings.create('add_plugin');
			// 		}
			// 	});
			// }
		});
	}


	function startPlugin() {
		window.trailer_plugin = true;
		Lampa.Listener.follow('app', function (e) {
			if (e.type === 'ready') init_settings()
		});
		Lampa.Listener.follow('full', function (e) {
			if (e.type == 'complite') {
				var render = e.object.activity.render();
				render.find('.view--trailer').remove();  // удаление дефолтных трейлеров
				var filmName = $('.full-start-new__title', render).text();
				$('.full-start-new__buttons', render).prepend('<div class="full-start__button selector button--trailer"><svg height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="1.5" y="1.5" width="25" height="31" rx="2.5" stroke="currentColor" stroke-width="3"></rect><rect x="6" y="7" width="9" height="9" rx="1" fill="currentColor"></rect><rect x="6" y="19" width="16" height="3" rx="1.5" fill="currentColor"></rect><rect x="6" y="25" width="11" height="3" rx="1.5" fill="currentColor"></rect><rect x="17" y="7" width="5" height="3" rx="1.5" fill="currentColor"></rect> </svg><span>Трейлеры</span></div>');
				$('.button--trailer', render).on('hover:enter', function (card) {
					find_trailers(filmName);
				});
			}

		});

	}
	if (!window.trailer_plugin) startPlugin();

})();
