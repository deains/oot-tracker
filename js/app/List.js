define([],function(){function e(e,t){this.app=e,this.element=t,this.init()}return e.prototype.changeArea=function(e){this.currentArea&&this.currentArea.removeState("active"),this.currentArea=e,e.addState("active"),this.loadArea(e)},e.prototype.getCurrentArea=function(){return this.currentArea||null},e.prototype.getElement=function(){return this.element},e.prototype.reload=function(){this.getCurrentArea()&&this.loadArea(this.getCurrentArea())},e.prototype.init=function(){this.app.getEvents().add("Reload",function(){this.reload()}.bind(this))},e.prototype.loadArea=function(e){this.element.querySelector(".header .title").innerHTML=e.getName(),this.element.className="list "+e.getClass(),this.loadChecks(e.getChecks())},e.prototype.loadChecks=function(e){for(var t=this.element.querySelector(".checks");t.hasChildNodes();)t.removeChild(t.lastChild);e.forEach(function(e){e.meetsRequirements(this.app.getSettings())&&t.appendChild(e.getElement())},this)},e});