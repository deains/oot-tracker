define(["model/Area","model/Check","json!data/areas.json","json!data/checks.json"],function(e,t,n,r){function a(e){this.app=e,this.prepareChecks(r),this.prepareAreas(n)}return a.prototype.getArea=function(e){if(!(e in this.areas))throw"Unrecognised area: "+e;return this.areas[e]},a.prototype.getAreaByName=function(e){if(!(e in this.areasByName))throw"Unrecognised area: "+e;return this.areasByName[e]},a.prototype.getCheck=function(e){if(!(e in this.checks))throw"Unrecognised check ID: "+e;return this.checks[e]},a.prototype.getAllAreas=function(){var e=[];for(var t in this.areas)this.areas.hasOwnProperty(t)&&e.push(this.getArea(t));return e},a.prototype.getAllChecks=function(){var e=[];for(var t in this.checks)this.checks.hasOwnProperty(t)&&e.push(this.getCheck(t));return e},a.prototype.createArea=function(t,n){var r=new e(this.app.getStore(),t.name,t.class,t.type,t.keys,t.mapcompass,t.label,n);return this.updateAreaCount(r),r.getElement().addEventListener("click",function(){this.app.getList().changeArea(r)}.bind(this)),r.getElement().addEventListener("contextmenu",function(e){r.toggleState("barren");var t=r.hasState("barren");r.getChecks().forEach(function(e){t?e.addState("barren"):e.removeState("barren")}),this.updateAreaCount(r),e.preventDefault()}.bind(this)),n.forEach(function(e){e.setArea(r)},this),this.app.getEvents().add("Reset",function(){r.reset(),this.updateAreaCount(r)}.bind(this)),this.app.getEvents().add("Reload",function(){this.updateAreaCount(r)}.bind(this)),r},a.prototype.createCheck=function(e){var n=new t(this.app.getStore(),e.name,e.type,e.location,e.requires);return n.getElement().addEventListener("click",function(e){0===e.button&&(n.toggleState("checked"),this.updateAreaCount(n.getArea()))}.bind(this)),n.getElement().addEventListener("contextmenu",function(e){n.toggleState("barren"),this.updateAreaCount(n.getArea()),e.preventDefault()}.bind(this)),this.app.getEvents().add("Reset",function(){n.reset()}),n},a.prototype.getChecksByArea=function(e){return e in this.checksByArea?this.checksByArea[e]:[]},a.prototype.prepareAreas=function(){this.areas={},this.areasByName={};for(var e in n)if(n.hasOwnProperty(e)){var t=this.createArea(n[e],this.getChecksByArea(e));this.areas[t.getID()]=t,this.areasByName[e]=t}},a.prototype.prepareChecks=function(){this.checks={},this.checksByArea={};for(var e in r)if(r.hasOwnProperty(e)){var t=this.createCheck(r[e]);t.getLocation()in this.checksByArea||(this.checksByArea[t.getLocation()]=[]),this.checks[t.getID()]=t,this.checksByArea[t.getLocation()].push(t)}},a.prototype.updateAreaCount=function(e){var t=e.getChecks().filter(function(e){return-1===this.getCountExclusions().indexOf(e.getType())&&e.meetsRequirements(this.app.getSettings())&&!(e.hasState("checked")||e.hasState("barren"))},this).length;e.setCompletionCount(t)},a.prototype.getCountExclusions=function(){var e=[];return this.app.getSettings().get("count.gstoken")||e.push("GSToken"),this.app.getSettings().get("count.gossipstone")||e.push("GossipStone"),e},a});