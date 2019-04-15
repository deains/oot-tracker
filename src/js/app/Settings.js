define([
	'json!data/settings.json'
], function(settings) {
	/**
	 * Settings constructor
	 *
	 * @param	{App}	app
	 *
	 * @constructor
	 */
	function Settings(app) {
		this.app = app;
		this.data = settings;

		this.settings = this.app.getStore().getSettings() || {};
	}

	/**
	 * Return a value for a setting
	 *
	 * @param	{string}	name
	 *
	 * @returns	{boolean}
	 */
	Settings.prototype.get = function(name) {
		if (!(name in this.data)) {
			throw 'Unrecognised setting name: '+ name;
		}

		if (name in this.settings) {
			return this.settings[name];
		}

		return this.data[name].default;
	};

	/**
	 * Set a user setting value
	 *
	 * @param	{string}	name
	 * @param	{boolean}	value
	 */
	Settings.prototype.set = function(name, value) {
		if (!(name in this.data)) {
			throw 'Unrecognised setting name: '+ name;
		}

		if (value !== this.get(name)) {
			this.settings[name] = value;

			for (var i in this.data[name].change) {
				this.app.getEvents().trigger(this.data[name].change[i]);
			}

			this.app.getStore().setSettings(this.settings);
		}
	};

	Settings.prototype.all = function() {
		var settings = [];
		for (var name in this.data) {
			if (this.data.hasOwnProperty(name)) {
				settings.push({
					name: name,
					value: this.get(name),
					title: this.data[name].title,
					showInMenu: this.data[name].showInMenu
				});
			}
		}
		return settings;
	};

	return Settings;
});
