define([
	'model/Model'
], function(Model) {
	/**
	 * Check constructor
	 *
	 * @param	{Store}			store
	 * @param	{string}		name
	 * @param	{string}		type
	 * @param	{string}		location
	 * @param	{Array<string>}	[requires]
	 *
	 * @constructor
	 */
	function Check(store, name, type, location, requires) {
		this.name = name;
		this.type = type;
		this.location = location;
		this.requires = requires || [];

		Model.call(this, store);
	}

	Check.prototype = Object.create(Model.prototype);
	Check.prototype.constructor = Check;

	/**
	 * Return the check ID
	 *
	 * @returns	{number}
	 */
	Check.prototype.getID = function() {
		return this.hash(this.getName() + this.getLocation() + JSON.stringify(this.getRequirements()));
	};

	/**
	 * Return the check name
	 *
	 * @returns	{string}
	 */
	Check.prototype.getName = function() {
		return this.name;
	};

	/**
	 * Return the check type
	 *
	 * @returns	{string}
	 */
	Check.prototype.getType = function() {
		return this.type;
	};

	/**
	 * Return area name this check is located in
	 *
	 * @returns	{string}
	 */
	Check.prototype.getLocation = function() {
		return this.location;
	};

	/**
	 * Return setting values required to enable this check
	 *
	 * @returns	{Object<boolean>}
	 */
	Check.prototype.getRequirements = function() {
		return this.requires;
	};

	/**
	 * Return the area this check resides in
	 *
	 * @returns {Area}
	 */
	Check.prototype.getArea = function() {
		if (typeof this.area !== 'object') {
			throw 'Area has not been set';
		}
		return this.area;
	};

	/**
	 * Set the area this check resides in
	 *
	 * @param	{Area}	area
	 */
	Check.prototype.setArea = function(area) {
		this.area = area;
	};

	/**
	 * Determine if this check is enabled according to the given settings
	 *
	 * @param	{Settings}	settings
	 *
	 * @returns	{boolean}
	 */
	Check.prototype.meetsRequirements = function(settings) {
		var requires = this.getRequirements();
		for (var name in requires) {
			if (!requires.hasOwnProperty(name)) continue;
			if (settings.get(name) !== requires[name]) {
				return false;
			}
		}
		return true;
	};

	/**
	 * Return valid states for this model
	 *
	 * @protected
	 *
	 * @returns	{string[]}
	 */
	Check.prototype.getValidStates = function() {
		return ['barren', 'checked'];
	};

	/**
	 * Generate HTML element for this check
	 *
	 * @protected
	 *
	 * @returns	{HTMLElement}
	 */
	Check.prototype.generateElement = function() {
		var element = document.createElement('li');

		element.classList.add('check');
		element.id = this.getID().toString();
		element.innerHTML = this.getName();
		element.classList.add(this.getType());

		return element;
	};

	return Check;
});
