define([
	'model/Area',
	'model/Check',
	'json!data/areas.json',
	'json!data/checks.json'
], function(Area, Check, areaData, checkData) {
	/**
	 * Loader constructor
	 *
	 * @param	{App}	app
	 *
	 * @constructor
	 */
	function Loader(app) {
		this.app = app;

		this.prepareChecks(checkData);
		this.prepareAreas(areaData);
	}

	/**
	 * Return an Area object
	 *
	 * @param	{number}	id
	 *
	 * @returns	{Area}
	 */
	Loader.prototype.getArea = function(id) {
		if (!(id in this.areas)) {
			throw 'Unrecognised area: '+ id;
		}
		return this.areas[id];
	};

	/**
	 * Return an Area object
	 *
	 * @param	{string}	name
	 *
	 * @returns	{Area}
	 */
	Loader.prototype.getAreaByName = function(name) {
		if (!(name in this.areasByName)) {
			throw 'Unrecognised area: '+ name;
		}
		return this.areasByName[name];
	};

	/**
	 * Return a Check object
	 *
	 * @param	{number}	id
	 *
	 * @returns	{Check}
	 */
	Loader.prototype.getCheck = function(id) {
		if (!(id in this.checks)) {
			throw 'Unrecognised check ID: '+ id;
		}
		return this.checks[id];
	};

	/**
	 * Return an array of all Area objects
	 *
	 * @returns	{Area[]}
	 */
	Loader.prototype.getAllAreas = function() {
		var areas = [];
		for (var id in this.areas) {
			if (this.areas.hasOwnProperty(id)) {
				areas.push(this.getArea(id));
			}
		}
		return areas;
	};

	/**
	 * Return an array of all Area objects
	 *
	 * @returns	{Check[]}
	 */
	Loader.prototype.getAllChecks = function() {
		var checks = [];
		for (var id in this.checks) {
			if (this.checks.hasOwnProperty(id)) {
				checks.push(this.getCheck(id));
			}
		}
		return checks;
	};

	/**
	 * Set up an Area object
	 *
	 * @param	{Object}		data
	 * @param	{string}		data.name
	 * @param	{string}		data.class
	 * @param	{string}		data.type
	 * @param	{string}		data.label
	 * @param	{Array<Check>}	checks
	 *
	 * @private
	 *
	 * @returns	{Area}
	 */
	Loader.prototype.createArea = function(data, checks) {
		var area = new Area(
			this.app.getStore(),
			data.name,
			data.class,
			data.type,
			data.label,
			checks
		);

		this.updateAreaCount(area, false);

		area.getElement().addEventListener('click', function() {
			this.app.getList().changeArea(area);
		}.bind(this));

		area.getElement().addEventListener('contextmenu', function(event) {
			area.toggleState('barren');
			var isBarren = area.hasState('barren');
			area.getChecks().forEach(function(check) {
				if (check.getType() === 'GossipStone') return;

				if (isBarren) {
					check.addState('barren');
				} else {
					check.removeState('barren');
				}
			});
			this.updateAreaCount(area, true);
			event.preventDefault();
		}.bind(this));

		checks.forEach(function(check) {
			check.setArea(area);
		}, this);

		this.app.getEvents().add('Reset', function() {
			area.reset();
			this.updateAreaCount(area, true);
		}.bind(this));
		this.app.getEvents().add('Reload', function() {
			this.updateAreaCount(area, true);
		}.bind(this));

		return area;
	};

	/**
	 * Set up a Check object
	 *
	 * @param	{Object}		data
	 * @param	{string}		data.name
	 * @param	{string}		data.type
	 * @param	{string}		data.location
	 * @param	{number}		data.count
	 * @param	{Array<string>}	[data.requires]
	 *
	 * @private
	 *
	 * @returns	{Check}
	 */
	Loader.prototype.createCheck = function(data) {
		var check = new Check(
			this.app.getStore(),
			data.name,
			data.type,
			data.location,
			data.count,
			data.requires
		);

		check.getElement().addEventListener('click', function(event) {
			if (event.button === 0) {
				check.toggleState('checked');
				this.updateAreaCount(check.getArea(), true);
			}
		}.bind(this));

		check.getElement().addEventListener('contextmenu', function(event) {
			check.toggleState('barren');
			this.updateAreaCount(check.getArea(), true);
			event.preventDefault();
		}.bind(this));

		this.app.getEvents().add('Reset', function() {
			check.reset();
		});

		return check;
	};

	/**
	 * Return all checks located in a particular area
	 *
	 * @private
	 *
	 * @param	{string}	name
	 *
	 * @returns	{Array<Check>}
	 */
	Loader.prototype.getChecksByArea = function(name) {
		if (name in this.checksByArea) {
			return this.checksByArea[name];
		}
		return [];
	};

	/**
	 * Prepare all areas
	 *
	 * @private
	 */
	Loader.prototype.prepareAreas = function() {
		this.areas = {};
		this.areasByName = {};

		for (var index in areaData) {
			if (areaData.hasOwnProperty(index)) {
				var area = this.createArea(areaData[index], this.getChecksByArea(index));
				this.areas[area.getID()] = area;
				this.areasByName[index] = area;
			}
		}
	};

	/**
	 * Prepare all checks
	 *
	 * @private
	 */
	Loader.prototype.prepareChecks = function() {
		this.checks = {};
		this.checksByArea = {};

		for (var index in checkData) {
			if (checkData.hasOwnProperty(index)) {
				var check = this.createCheck(checkData[index]);

				if (!(check.getLocation() in this.checksByArea)) {
					this.checksByArea[check.getLocation()] = [];
				}

				this.checks[check.getID()] = check;
				this.checksByArea[check.getLocation()].push(check);
			}
		}
	};

	/**
	 * Update the check count on an area
	 *
	 * @private
	 *
	 * @param	{Area}		area
	 * @param	{boolean}	updateTotal
	 */
	Loader.prototype.updateAreaCount = function(area, updateTotal) {
		var count = area.getChecks().filter(function(check) {
			return (
				this.getCountExclusions().indexOf(check.getType()) === -1 &&
				check.meetsRequirements(this.app.getSettings()) &&
				!(check.hasState('checked') || check.hasState('barren'))
			);
		}, this).reduce(function(accumulator, check) {
			return accumulator + check.getCount();
		}, 0);
		var total = area.getChecks().filter(function(check) {
			return (
				this.getCountExclusions().indexOf(check.getType()) === -1 &&
				check.meetsRequirements(this.app.getSettings())
			);
		}, this).reduce(function(accumulator, check) {
			return accumulator + check.getCount();
		}, 0);

		area.setCompletionCount(count, total);
		updateTotal && this.app.updateTotalCount();
	};

	/**
	 * Determine which check types should be excluded from area counts
	 *
	 * @private
	 *
	 * @returns	{string[]}
	 */
	Loader.prototype.getCountExclusions = function() {
		var excluded = ['KeatonTrade', 'SkullTrade', 'SpookyTrade', 'BunnyTrade'];
		if (!this.app.getSettings().get('count.gstoken')) {
			excluded.push('GSToken');
		}
		if (!this.app.getSettings().get('count.gossipstone')) {
			excluded.push('GossipStone');
		}
		return excluded;
	};

	return Loader;
});
