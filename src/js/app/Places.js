define([
	'json!data/layout.json'
], function(layouts) {
	/**
	 * Places constructor
	 *
	 * @param	{App}			app
	 * @param	{HTMLElement}	element	The element containing the area list this object is responsible for
	 * @param	{string}		layout	Layout name
	 *
	 * @constructor
	 */
	function Places(app, element, layout) {
		this.app = app;
		this.element = element;

		this.init(layouts[layout]);
	}

	/**
	 * Return HTML element representing this area, to be used in the places list
	 *
	 * @private
	 *
	 * @returns	{HTMLElement}
	 */
	Places.prototype.getElement = function() {
		return this.element;
	};

	/**
	 * Initialise the area list
	 *
	 * @private
	 */
	Places.prototype.init = function(layout) {
		this.setSize(layout.size);
		this.initNodes(layout.nodes);
		this.initLines(layout.lines);
	};

	/**
	 * Set grid size from layout data
	 *
	 * @private
	 *
	 * @param	{number[]}	size
	 */
	Places.prototype.setSize = function(size) {
		this.getElement().querySelector('.nodes').style.gridTemplate = 'repeat('+ size[1] +', 1fr) / repeat('+ size[0] +', 1fr)';
		this.getElement().querySelector('.lines').style.gridTemplate = 'repeat('+ (size[1] * 2) +', 1fr) / repeat('+ (size[0] * 2) +', 1fr)';
	};

	/**
	 * Initialise area nodes from layout data
	 *
	 * @private
	 *
	 * @param	{object[]}	nodes
	 */
	Places.prototype.initNodes = function(nodes) {
		var parentElement = this.getElement().querySelector('.nodes');

		nodes.forEach(function(node) {
			var areaElement = this.app.getLoader().getAreaByName(node.areaName).getElement();

			areaElement.className = 'area '+ node.nodeClass;
			areaElement.style.gridArea = node.coords[1] +' / '+ node.coords[0];

			var labelElement = areaElement.querySelector('.label');
			labelElement.className = 'label '+ node.labelClass;

			parentElement.appendChild(areaElement);

			if (labelElement.classList.contains('pos-n') || labelElement.classList.contains('pos-s')) {
				labelElement.style.left = '-'+ (labelElement.offsetWidth / 2) + 'px';
			}
		}, this);
	};

	/**
	 * Initialise map vertices from layout data
	 *
	 * @private
	 *
	 * @param	{object[]}	lines
	 */
	Places.prototype.initLines = function(lines) {
		var parentElement = this.getElement().querySelector('.lines');

		lines.forEach(function(line) {
			line.segments.forEach(function(segment) {
				var segmentElement = document.createElement('div');

				segmentElement.dataset.id = segment.id;
				segmentElement.dataset.line = line.id;

				segmentElement.style.color = line.color;
				segmentElement.className = 'line '+ segment.class;
				segmentElement.style.gridArea = segment.coords[0][1] +' / '+ segment.coords[0][0] +' / '+ segment.coords[1][1] +' / '+ segment.coords[1][0];

				if ('extra' in segment) {
					for (var prop in segment.extra) {
						if (segment.extra.hasOwnProperty(prop)) {
							segmentElement.style[prop] = segment.extra[prop];
						}
					}
				}

				parentElement.appendChild(segmentElement);
			}, this);
		}, this);
	};

	return Places;
});
