define(["model/Area","model/Check","json!data/areas.json","json!data/checks.json"],function(e,t,n,r){function s(e){this.app=e,this.prepareChecks(r),this.prepareAreas(n)}return s.prototype.getArea=function(e){if(!(e in this.areas))throw"Unrecognised area: "+e;return this.areas[e]},s.prototype.getAreaByName=function(e){if(!(e in this.areasByName))throw"Unrecognised area: "+e;return this.areasByName[e]},s.prototype.getCheck=function(e){if(!(e in this.checks))throw"Unrecognised check ID: "+e;return this.checks[e]},s.prototype.getAllAreas=function(){var e=[];for(var t in this.areas)this.areas.hasOwnProperty(t)&&e.push(this.getArea(t));return e},s.prototype.getAllChecks=function(){var e=[];for(var t in this.checks)this.checks.hasOwnProperty(t)&&e.push(this.getCheck(t));return e},s.prototype.createArea=function(t,n){var r=new e(this.app.getStore(),t.name,t.class,t.type,t.label,n);return this.updateAreaCount(r,!1),r.getElement().addEventListener("click",function(){this.app.getList().changeArea(r)}.bind(this)),r.getElement().addEventListener("contextmenu",function(e){r.toggleState("barren");var t=r.hasState("barren");r.getChecks().forEach(function(e){"GossipStone"!==e.getType()&&(t?e.addState("barren"):e.removeState("barren"))}),this.updateAreaCount(r,!0),e.preventDefault()}.bind(this)),n.forEach(function(e){e.setArea(r)},this),this.app.getEvents().add("Reset",function(){r.reset(),this.updateAreaCount(r,!0)}.bind(this)),this.app.getEvents().add("Reload",function(){this.updateAreaCount(r,!0)}.bind(this)),r},s.prototype.createCheck=function(e){var n=new t(this.app.getStore(),e.name,e.type,e.location,e.count,e.requires);return n.getElement().addEventListener("click",function(e){0===e.button&&(n.toggleState("checked"),this.updateAreaCount(n.getArea(),!0))}.bind(this)),n.getElement().addEventListener("contextmenu",function(e){n.toggleState("barren"),this.updateAreaCount(n.getArea(),!0),e.preventDefault()}.bind(this)),this.app.getEvents().add("Reset",function(){n.reset()}),n},s.prototype.getChecksByArea=function(e){return e in this.checksByArea?this.checksByArea[e]:[]},s.prototype.prepareAreas=function(){this.areas={},this.areasByName={};for(var e in n)if(n.hasOwnProperty(e)){var t=this.createArea(n[e],this.getChecksByArea(e));this.areas[t.getID()]=t,this.areasByName[e]=t}},s.prototype.prepareChecks=function(){this.checks={},this.checksByArea={};for(var e in r)if(r.hasOwnProperty(e)){var t=this.createCheck(r[e]);t.getLocation()in this.checksByArea||(this.checksByArea[t.getLocation()]=[]),this.checks[t.getID()]=t,this.checksByArea[t.getLocation()].push(t)}},s.prototype.updateAreaCount=function(e,t){var n=e.getChecks().filter(function(e){return-1===this.getCountExclusions().indexOf(e.getType())&&e.meetsRequirements(this.app.getSettings())&&!(e.hasState("checked")||e.hasState("barren"))},this).reduce(function(e,t){return e+t.getCount()},0),r=e.getChecks().filter(function(e){return-1===this.getCountExclusions().indexOf(e.getType())&&e.meetsRequirements(this.app.getSettings())},this).reduce(function(e,t){return e+t.getCount()},0);e.setCompletionCount(n,r),t&&this.app.updateTotalCount()},s.prototype.getCountExclusions=function(){var e=[];return this.app.getSettings().get("count.gstoken")||e.push("GSToken"),this.app.getSettings().get("count.gossipstone")||e.push("GossipStone"),e},s});