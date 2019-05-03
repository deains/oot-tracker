define([], function() {
	/**
	 * Model constructor
	 *
	 * @param	{Store}	store
	 *
	 * @constructor
	 */
	function Model(store) {
		this.store = store;

		this.getStore().loadTo(this);
	}

	/**
	 * Return the object's ID
	 *
	 * @abstract
	 *
	 * @returns	{number}
	 */
	Model.prototype.getID = function() {
		throw 'Method not implemented';
	};

	/**
	 * Return HTML element representing this model
	 *
	 * @returns	{HTMLElement}
	 */
	Model.prototype.getElement = function() {
		if (!this.element) {
			this.element = this.generateElement();
		}
		return this.element;
	};

	/**
	 * Add a state value on the model's element
	 *
	 * @param	{string}	state
	 */
	Model.prototype.addState = function(state) {
		this.assertValidState(state);
		this.getElement().classList.add(state);
		this.update();
	};

	/**
	 * Return all current states of this model
	 *
	 * @returns {string[]}
	 */
	Model.prototype.getState = function() {
		return this.getValidStates().filter(this.hasState, this);
	};

	/**
	 * Determine if this model currently has the given state
	 *
	 * @param	{string}	state
	 *
	 * @returns	{boolean}
	 */
	Model.prototype.hasState = function(state) {
		this.assertValidState(state);
		return this.getElement().classList.contains(state);
	};

	/**
	 * Load states from the provided values
	 *
	 * This method should only be used when restoring from saved data
	 *
	 * @param	{string[]}	states
	 */
	Model.prototype.loadState = function(states) {
		states.forEach(function(state) {
			try {
				this.assertValidState(state);
				this.getElement().classList.add(state);
			} catch (e) {
				// Ignore invalid states when loading from saved data
			}
		}, this);
	};

	/**
	 * Remove a state value on the model's element
	 *
	 * @param	{string}	state
	 */
	Model.prototype.removeState = function(state) {
		this.assertValidState(state);
		this.getElement().classList.remove(state);
		this.update();
	};

	/**
	 * Toggle a state value on the model's element
	 *
	 * @param	{string}	state
	 */
	Model.prototype.toggleState = function(state) {
		if (this.hasState(state)) {
			this.removeState(state);
		} else {
			this.addState(state);
		}
	};

	/**
	 * Reset model state
	 */
	Model.prototype.reset = function() {
		this.getValidStates().forEach(function(state) {
			this.getElement().classList.remove(state);
		}, this);
	};

	/**
	 * Generate HTML element for this model
	 *
	 * @abstract
	 * @protected
	 *
	 * @returns	{HTMLElement}
	 */
	Model.prototype.generateElement = function() {
		throw 'Method not implemented';
	};

	/**
	 * Return valid states for this model
	 *
	 * @protected
	 *
	 * @returns	{string[]}
	 */
	Model.prototype.getValidStates = function() {
		return [];
	};

	/**
	 * Save changes made to this model in the save state
	 *
	 * @protected
	 */
	Model.prototype.update = function() {
		this.getStore().saveFrom(this);
	};

	/**
	 * Return a hashed ID for the given string
	 *
	 * @protected
	 *
	 * @param	{string}	string
	 *
	 * @returns	{number}
	 */
	Model.prototype.hash = function(string) {
		var hash = 5381;
		var i = string.length;

		while (i) {
			hash = (hash * 33) ^ string.charCodeAt(--i);
		}

		return hash >>> 0;
	};

	/**
	 * Check that the given state is valid, if not, throw an error
	 *
	 * @private
	 *
	 * @param	{string}	state
	 */
	Model.prototype.assertValidState = function(state) {
		if (this.getValidStates().indexOf(state) === -1) {
			throw 'Incompatible state name: '+ state;
		}
	};

	/**
	 * Return state object
	 *
	 * @private
	 *
	 * @returns {Store}
	 */
	Model.prototype.getStore = function() {
		return this.store;
	};

	return Model;
});
