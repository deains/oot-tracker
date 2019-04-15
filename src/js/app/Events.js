define([], function() {
	function Events() {
		this.listeners = {};
	}

	Events.prototype.add = function(type, callback) {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}

		this.listeners[type].push(callback);
	};

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
