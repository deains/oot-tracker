define([
	'model/Area'
], function(Area) {
	/**
	 * Store constructor
	 *
	 * @param	{App}		app
	 * @param	{Storage}	storage		Storage object we can import/export state data to
	 * @param	{string}	key			Key name for storage item
	 *
	 * @constructor
	 */
	function Store(app, storage, key) {
		this.app = app;
		this.storage = storage;
		this.storageKey = key;

		this.save = {};

		this.import();
	}

	/**
	 * Read data from model and save it to storage
	 *
	 * @param	{Model}	model
	 */
	Store.prototype.saveFrom = function(model) {
		var data = {
			state: model.getState()
		};

		if (model instanceof Area) {
			data.keys = {
				small: model.getSmallKeyCount(),
				big: model.getBigKeyCount()
			};
		}

		this.setSaveItem(this.getModelKey(model), data);
	};

	/**
	 * Load data from storage and write it to model
	 *
	 * @param	{Model}	model
	 */
	Store.prototype.loadTo = function(model) {
		var data = this.getSaveItem(this.getModelKey(model));

		if (data !== null) {
			if ('state' in data) {
				model.loadState(data.state);
			}
			if ('keys' in data && model instanceof Area) {
				model.loadKeyCounts(data.keys.small || 0, data.keys.big || 0);
			}
		}
	};

	/**
	 * Get user settings
	 *
	 * @returns	{Object<string>|null}
	 */
	Store.prototype.getSettings = function() {
		return this.settings || null;
	};

	/**
	 * Store user settings
	 *
	 * @param	{Object<string>}	settings
	 */
	Store.prototype.setSettings = function(settings) {
		this.settings = settings;
		this.export();
	};

	/**
	 * Reset current state back to default
	 *
	 * Note: does not reset user settings
	 */
	Store.prototype.reset = function() {
		this.save = {};
		this.export();
	};

	/**
	 * Return key string for a model
	 *
	 * @private
	 *
	 * @param	{Model}	model
	 *
	 * @returns	{string}
	 */
	Store.prototype.getModelKey = function(model) {
		return model.constructor.name +':'+ model.getID();
	};

	/**
	 * Return save data
	 *
	 * @private
	 *
	 * @param	{string}	name
	 *
	 * @returns	{object|null}
	 */
	Store.prototype.getSaveItem = function(name) {
		if (name in this.save && typeof this.save[name] === 'object') {
			return this.save[name];
		}
		return null;
	};

	/**
	 * Set save data
	 *
	 * @private
	 *
	 * @param	{string}	name
	 * @param	{object}	value
	 */
	Store.prototype.setSaveItem = function(name, value) {
		this.save[name] = value;
		this.export();
	};

	/**
	 * Return current save data
	 *
	 * @private
	 *
	 * @returns	{object}
	 */
	Store.prototype.getSave = function() {
		return this.save;
	};

	/**
	 * Import state data from storage
	 *
	 * @private
	 *
	 * @returns	{boolean}	True if data was successfully imported
	 */
	Store.prototype.import = function() {
		try {
			var data = this.storage.getItem(this.storageKey);
		} catch (e) {
			return false;
		}

		if (typeof data === 'string') {
			try {
				data = JSON.parse(data);
			} catch (e) {
				return false;
			}

			if (typeof data.save === 'object') {
				this.save = data.save;
			}
			if (typeof data.settings === 'object') {
				this.settings = data.settings;
			}

			return true;
		}

		return false;
	};

	/**
	 * Export state data to storage
	 *
	 * @private
	 */
	Store.prototype.export = function() {
		try {
			this.storage.setItem(this.storageKey, JSON.stringify({
				save: this.getSave(),
				settings: this.getSettings()
			}));
		} catch (e) {}
	};

	return Store;
});
