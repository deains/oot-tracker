define([], function() {
	/**
	 * List constructor
	 *
	 * @param	{App}			app
	 * @param	{HTMLElement}	element	The element containing the list this object is responsible for
	 *
	 * @constructor
	 */
	function List(app, element) {
		this.app = app;
		this.element = element;

		this.init();
	}

	/**
	 * Set current area
	 *
	 * @param	{Area}	area
	 */
	List.prototype.changeArea = function(area) {
		if (!!this.currentArea) {
			this.currentArea.removeState('active');
		}
		this.currentArea = area;
		area.addState('active');
		this.loadArea(area);
	};

	/**
	 * Reutrn currently highlighted area, if any
	 *
	 * @returns {Area|null}
	 */
	List.prototype.getCurrentArea = function() {
		return this.currentArea || null;
	};

	/**
	 * Return the list element
	 *
	 * @returns	{HTMLElement}
	 */
	List.prototype.getElement = function() {
		return this.element;
	};

	/**
	 * Reload the current area
	 */
	List.prototype.reload = function() {
		if (this.getCurrentArea()) {
			this.loadArea(this.getCurrentArea());
		}
	};

	/**
	 * Initialise the list
	 *
	 * @private
	 */
	List.prototype.init = function() {
		this.app.getEvents().add('Reload', function() {
			this.reload();
		}.bind(this));
	};

	/**
	 * Display a new area in the list
	 *
	 * @private
	 *
	 * @param	{Area}	area
	 */
	List.prototype.loadArea = function(area) {
		this.element.querySelector('.header .title').innerHTML = area.getName();
		this.element.className = 'list '+ area.getClass();
		this.loadChecks(area.getChecks());
	};

	/**
	 * Display checks in the list
	 *
	 * @private
	 *
	 * @param	{Array<Check>}	checks
	 */
	List.prototype.loadChecks = function(checks) {
		var ul = this.element.querySelector('.checks');

		while (ul.hasChildNodes()) {
			ul.removeChild(ul.lastChild);
		}

		checks.forEach(function(check) {
			if (check.meetsRequirements(this.app.getSettings())) {
				ul.appendChild(check.getElement());
			}
		}, this);
	};

	return List;
});
