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
	 * @param	{string}		label
	 * @param	{Array<Check>}	checks
	 *
	 * @constructor
	 */
	function Area(store, name, className, type, label, checks) {
		this.name = name;
		this.class = className;
		this.type = type;
		this.label = label;
		this.checks = checks;

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
	 * Return an array of checks in this area
	 *
	 * @returns	{Array<Check>}
	 */
	Area.prototype.getChecks = function() {
		return this.checks;
	};

	/**
	 * Reset model state
	 */
	Area.prototype.reset = function() {
		Model.prototype.reset.call(this);
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
