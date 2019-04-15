define([
	'app/App',
	'json!data/app.json'
], function(App, config) {
	var app = new App(
		config,
		document.getElementById('places'),
		document.getElementById('list'),
		window.localStorage
	);

	document.getElementById('reset').addEventListener('click', function() {
		app.reset();
	});

	app.getEvents().add('StyleChange', function() {
		if (app.getSettings().get('darkmode')) {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		}
	});
	app.getEvents().trigger('StyleChange');

	['settings', 'about'].forEach(function(id) {
		var el = document.getElementById(id);
		var opener = document.getElementById('open-'+ id);
		document.addEventListener('click', function(event) {
			if (event.target instanceof Node && !el.contains(event.target) && el !== event.target && !opener.contains(event.target) && opener !== event.target) {
				el.style.opacity = '';
				setTimeout(function() {
					el.classList.remove('open');
				}, 200);
			}
		});
		opener.addEventListener('click', function() {
			if (!el.classList.contains('open')) {
				el.classList.add('open');
				setTimeout(function() {
					el.style.opacity = '1';
				}, 4);
			} else {
				el.style.opacity = '';
				setTimeout(function() {
					el.classList.remove('open');
				}, 200);
			}
		});
	});

	(function() {
		var ul = document.getElementById('settings').querySelector('ul');
		var tpl = document.getElementById('settings').querySelector('.template');
		tpl.classList.remove('template');
		tpl.remove();

		app.getSettings().all().forEach(function(setting) {
			if (setting.showInMenu) {
				var li = tpl.cloneNode(true);

				li.querySelector('.title').innerHTML = setting.title;
				li.querySelectorAll('input').forEach(function(input) {
					input.name = setting.name;

					if (setting.value === (input.value === 'true')) {
						input.checked = true;
					}

					input.addEventListener('change', function() {
						app.getSettings().set(setting.name, this.value === 'true');
					});
				});

				ul.appendChild(li);
			}
		});
	})();

	document.querySelectorAll('#about .shields').forEach(function(div) {
		for (var i in config.shields) {
			if (!config.shields.hasOwnProperty(i)) continue;

			var a = document.createElement('a');
			a.href = config.shields[i].url.replace(/REPO/, config.repo);
			a.target = '_blank';

			var img = document.createElement('img');
			if (!config.shields[i].enc) {
				img.src = config.shields[i].img.replace(/REPO/, config.repo);
			} else {
				img.src = config.shields[i].img.replace(/REPO/, encodeURI(config.repo.replace('-', '--')));
			}

			a.appendChild(img);
			div.appendChild(a);
		}
	});

	(function() {
		var loadingMsg = document.getElementById('loading-msg');
		loadingMsg.style.opacity = '0';
		setTimeout(function() {
			loadingMsg.remove();
		}, 500);
		document.getElementById('container').classList.remove('loading');
	})();

	window.app = app;
	window.debugState = function() {
		console.debug(app.getStore().getSave());
	};
});
