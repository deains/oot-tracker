define([
	'model/Model'
], function(Model) {
	/**
	 * Area constructor
	 *
	 * @param	{Store}			store
	 * @param	{string}		name
	 * @param	{string}		className
	 * @param	{string}		type
	 * @param	{Object}		keys
	 * @param	{number}		keys.small
	 * @param	{number}		keys.big
	 * @param	{boolean}		mapCompass
	 * @param	{string}		label
	 * @param	{Array<Check>}	checks
	 *
	 * @constructor
	 */
	function Area(store, name, className, type, keys, mapCompass, label, checks) {
		this.name = name;
		this.class = className;
		this.type = type;
		this.keys = keys || null;
		this.mapCompass = mapCompass;
		this.label = label;
		this.checks = checks;

		this.currentKeys = { small: 0, big: 0 };

		Model.call(this, store);
	}

	Area.prototype = Object.create(Model.prototype);
	Area.prototype.constructor = Area;

	/**
	 * Return the area ID
	 *
	 * @returns	{number}
	 */
	Area.prototype.getID = function() {
		return this.hash(this.getName());
	};

	/**
	 * Return area name
	 *
	 * @returns	{string}
	 */
	Area.prototype.getName = function() {
		return this.name;
	};

	/**
	 * Return area class
	 *
	 * @returns	{string}
	 */
	Area.prototype.getClass = function() {
		return this.class;
	};

	/**
	 * Return area type
	 *
	 * @returns	{string}
	 */
	Area.prototype.getType = function() {
		return this.type;
	};

	/**
	 * Determine if this area holds dungeon keys
	 *
	 * @returns	{boolean}
	 */
	Area.prototype.hasKeys = function() {
		return this.keys !== null && (this.keys.small + this.keys.big) > 0;
	};

	/**
	 * Return how many small keys this area has
	 *
	 * @returns	{number}
	 */
	Area.prototype.getSmallKeyTotal = function() {
		if (this.keys !== null) {
			return this.keys.small;
		}
		return 0;
	};

	/**
	 * Return how many big keys this area has
	 *
	 * @returns	{number}
	 */
	Area.prototype.getBigKeyTotal = function() {
		if (this.keys !== null) {
			return this.keys.big;
		}
		return 0;
	};

	/**
	 * Determine if this area has a map and compass
	 *
	 * @returns	{boolean}
	 */
	Area.prototype.hasMapCompass = function() {
		return this.mapCompass;
	};

	/**
	 * Return an array of checks in this area
	 *
	 * @returns	{Array<Check>}
	 */
	Area.prototype.getChecks = function() {
		return this.checks;
	};

	/**
	 * Load key counts from the provided values
	 *
	 * This method should only be used when restoring from saved data
	 *
	 * @param	{number}	smallCount
	 * @param	{number}	bigCount
	 */
	Area.prototype.loadKeyCounts = function(smallCount, bigCount) {
		this.currentKeys.small = Math.min(smallCount, this.getSmallKeyTotal());
		this.currentKeys.big = Math.min(bigCount, this.getBigKeyTotal());
	};

	/**
	 * Get current small key count
	 *
	 * @returns	{number}
	 */
	Area.prototype.getSmallKeyCount = function() {
		return this.currentKeys.small;
	};

	/**
	 * Increase small key count by one
	 */
	Area.prototype.incrementSmallKeyCount = function() {
		this.currentKeys.small = Math.min(this.getSmallKeyCount() + 1, this.getSmallKeyTotal());
		this.update();
	};

	/**
	 * Reduce small key count by one
	 */
	Area.prototype.decrementSmallKeyCount = function() {
		this.currentKeys.small = Math.max(0, this.getSmallKeyCount() - 1);
		this.update();
	};

	/**
	 * Get current big key count
	 *
	 * @returns	{number}
	 */
	Area.prototype.getBigKeyCount = function() {
		return this.currentKeys.big;
	};

	/**
	 * Increase big key count by one
	 */
	Area.prototype.incrementBigKeyCount = function() {
		this.currentKeys.big = Math.min(this.getBigKeyCount() + 1, this.getBigKeyTotal());
		this.update();
	};

	/**
	 * Reduce big key count by one
	 */
	Area.prototype.decrementBigKeyCount = function() {
		this.currentKeys.big = Math.max(0, this.getBigKeyCount() - 1);
		this.update();
	};

	/**
	 * Reset model state
	 */
	Area.prototype.reset = function() {
		Model.prototype.reset.call(this);
		this.loadKeyCounts(0, 0);
	};

	/**
	 * Set the number of uncompleted checks in this area
	 *
	 * @param	{number}	count
	 */
	Area.prototype.setCompletionCount = function(count) {
		this.getElement().querySelector('.checks').innerHTML = count.toString();

		if (count === 0) {
			this.addState('complete');
		} else {
			this.removeState('complete');
		}
	};

	/**
	 * Return valid states for this model
	 *
	 * @protected
	 *
	 * @returns	{string[]}
	 */
	Area.prototype.getValidStates = function() {
		return ['active', 'barren', 'complete'];
	};

	/**
	 * Generate HTML element for this area
	 *
	 * @protected
	 *
	 * @returns	{HTMLElement}
	 */
	Area.prototype.generateElement = function() {
		var element = document.createElement('div');

		element.classList.add('area');
		element.innerHTML = '<div class="label">' + this.getName() + '</div><div class="checks">' + this.getChecks().length + '</div>';

		return element;
	};

	return Area;
});
