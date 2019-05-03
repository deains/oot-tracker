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
		this.getElement().querySelectorAll('.action-key').forEach(function(element) {
			element.addEventListener('click', function(event) {
				if (event.button === 0) {
					if (this.getCurrentArea()) {
						if (element.dataset.key === 'small') {
							this.getCurrentArea().incrementSmallKeyCount();
							this.setSmallKeyCount(this.getCurrentArea().getSmallKeyCount());
						} else {
							this.getCurrentArea().incrementBigKeyCount();
							this.setBigKeyCount(this.getCurrentArea().getBigKeyCount());
						}
					}
					event.preventDefault();
				}
			}.bind(this));

			element.addEventListener('contextmenu', function(event) {
				if (this.getCurrentArea()) {
					if (element.dataset.key === 'small') {
						this.getCurrentArea().decrementSmallKeyCount();
						this.setSmallKeyCount(this.getCurrentArea().getSmallKeyCount());
					} else {
						this.getCurrentArea().decrementBigKeyCount();
						this.setBigKeyCount(this.getCurrentArea().getBigKeyCount());
					}
				}
				event.preventDefault();
			}.bind(this));
		}, this);

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

		if (area.hasKeys()) {
			this.element.querySelector('.header .keys').classList.remove('hidden');

			this.setSmallKeyCount(area.getSmallKeyCount());
			this.setKeyTotal(area.getSmallKeyTotal(), 'small');
			this.setBigKeyCount(area.getBigKeyCount());
			this.setKeyTotal(area.getBigKeyTotal(), 'big');

			this.element.querySelector('.keys .small')
				.classList[area.getSmallKeyTotal() === 0 ? 'add' : 'remove']('hidden');
			this.element.querySelector('.keys .big')
				.classList[area.getBigKeyTotal() === 0 ? 'add' : 'remove']('hidden');
		} else {
			this.element.querySelector('.header .keys').classList.add('hidden');
		}
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

	/**
	 * Set small key count
	 *
	 * @private
	 *
	 * @param	{number}	count
	 */
	List.prototype.setSmallKeyCount = function(count) {
		var counter = this.element.querySelector('.small');
		counter.querySelector('.got').innerHTML = count.toString();
		if (count < this.getCurrentArea().getSmallKeyTotal()) {
			counter.classList.remove('complete');
		} else {
			counter.classList.add('complete');
		}
	};

	/**
	 * Set big key count
	 *
	 * @private
	 *
	 * @param	{number}	count
	 */
	List.prototype.setBigKeyCount = function(count) {
		var counter = this.element.querySelector('.big');
		counter.querySelector('.got').innerHTML = count.toString();
		if (count < this.getCurrentArea().getBigKeyTotal()) {
			counter.classList.remove('complete');
		} else {
			counter.classList.add('complete');
		}
	};

	/**
	 * Set key total
	 *
	 * @private
	 *
	 * @param	{number}	total
	 * @param	{string}	keyType	'small' or 'big'
	 */
	List.prototype.setKeyTotal = function(total, keyType) {
		this.element.querySelector('.'+ keyType +' .total').innerHTML = total.toString();
	};

	return List;
});
