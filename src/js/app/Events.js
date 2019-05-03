define([], function() {
	/**
	 * Events constructor
	 *
	 * @constructor
	 */
	function Events() {
		this.listeners = {};
	}

	/**
	 * Add an event listener
	 *
	 * @param	{string}	type
	 * @param	{function}	callback
	 */
	Events.prototype.add = function(type, callback) {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}

		this.listeners[type].push(callback);
	};

	/**
	 * Remove an event listener
	 *
	 * @param	{string}	type
	 * @param	{function}	callback
	 */
	Events.prototype.remove = function(type, callback) {
		if (!(type in this.listeners)) {
			return;
		}

		var stack = this.listeners[type];

		for (var i = 0, l = stack.length; i < l; i++) {
			if (stack[i] === callback) {
				stack.splice(i, 1);
				return;
			}
		}
	};

	/**
	 * Trigger an event
	 *
	 * @param	{string}	type
	 */
	Events.prototype.trigger = function(type) {
		if (!(type in this.listeners)) {
			return;
		}

		var stack = this.listeners[type].slice();

		for (var i = 0, l = stack.length; i < l; i++) {
			stack[i].apply(null, Array.prototype.slice.call(arguments, 1));
		}
	};

	return Events;
});
