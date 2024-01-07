(function () {
	'use strict';

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
		var icon_trailer_settings = '<div class="settings-folder" style="padding:0!important"><div style="width:1.8em;height:1.3em;padding-right:.5em"><svg viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32"><path d="m17 14.5 4.2-4.5L4.9 1.2c-.1-.1-.3-.1-.6-.2L17 14.5zM23 21l5.9-3.2c.7-.4 1.1-1 1.1-1.8s-.4-1.5-1.1-1.8L23 11l-4.7 5 4.7 5zM2.4 1.9c-.3.3-.4.7-.4 1.1v26c0 .4.1.8.4 1.2L15.6 16 2.4 1.9zM17 17.5 4.3 31c.2 0 .4-.1.6-.2L21.2 22 17 17.5z" fill="currentColor" fill="#ffffff" class="fill-000000"></path></svg></div><div style="font-size:1.3em">Онлайн</div></div>';
		Lampa.SettingsApi.addComponent({
			component: 'trailer_settings',
			name: 'Трейлеры',
			icon: icon_trailer_settings
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
