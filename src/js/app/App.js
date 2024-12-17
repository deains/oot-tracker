define([
	'app/Events',
	'app/List',
	'app/Loader',
	'app/Places',
	'app/Settings',
	'app/Store'
], function(Events, List, Loader, Places, Settings, Store) {
	/**
	 * App constructor
	 *
	 * @param	{object}		config					App configuration
	 * @param	{string[]}		config.layout			Layout name to load
	 * @param	{string}		config.storageKey		Key name for state storage
	 * @param	{string}		config.startingArea		Which area to load initially
	 * @param	{HTMLElement}	placesElement			Element containing the area list
	 * @param	{HTMLElement}	listElement				Element containing the current area list
	 * @param	{HTMLElement}	totalElement			Element containing the total counter
	 * @param	{Storage}		storage					Storage for importing/exporting state data
	 *
	 * @constructor
	 */
	function App(config, placesElement, listElement, totalElement, storage) {
		this.startingArea = config.startingArea;
		this.totalElement = totalElement;

		this.events = new Events();
		this.store = new Store(this, storage, config.storageKey);
		this.settings = new Settings(this);
		this.loader = new Loader(this);
		this.places = new Places(this, placesElement, config.layout);
		this.list = new List(this, listElement);

		this.updateTotalCount();
		this.loadStartingArea();
	}

	/**
	 * Reset the tracker
	 */
	App.prototype.reset = function() {
		this.getStore().reset();
		this.getEvents().trigger('Reset');
		this.loadStartingArea();
	};

	/**
	 * Return Events object
	 *
	 * @returns {Events}
	 */
	App.prototype.getEvents = function() {
		return this.events;
	};

	/**
	 * Return List object
	 *
	 * @returns {List}
	 */
	App.prototype.getList = function() {
		return this.list;
	};

	/**
	 * Return Loader object
	 *
	 * @returns {Loader}
	 */
	App.prototype.getLoader = function() {
		return this.loader;
	};

	/**
	 * Return Places object
	 *
	 * @returns {Places}
	 */
	App.prototype.getPlaces = function() {
		return this.places;
	};

	/**
	 * Return Settings object
	 *
	 * @returns {Settings}
	 */
	App.prototype.getSettings = function() {
		return this.settings;
	};

	/**
	 * Return Store object
	 *
	 * @returns {Store}
	 */
	App.prototype.getStore = function() {
		return this.store;
	};

	/**
	 * Update total count
	 */
	App.prototype.updateTotalCount = function() {
		var count = 0;
		var total = 0;

		this.loader.getAllAreas().forEach(function(area) {
			count += area.count;
			total += area.total;
		});

		this.totalElement.innerText = `${count} / ${total}`;
	};

	/**
	 * Load the starting area
	 *
	 * @private
	 */
	App.prototype.loadStartingArea = function() {
		this.getList().changeArea(this.getLoader().getAreaByName(this.startingArea));
	};

	return App;
});
