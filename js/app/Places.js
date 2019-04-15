define(["json!data/layout.json"],function(e){function t(t,s,i){this.app=t,this.element=s,this.init(e[i])}return t.prototype.getElement=function(){return this.element},t.prototype.init=function(e){this.setSize(e.size),this.initNodes(e.nodes),this.initLines(e.lines)},t.prototype.setSize=function(e){this.getElement().querySelector(".nodes").style.gridTemplate="repeat("+e[1]+", 1fr) / repeat("+e[0]+", 1fr)",this.getElement().querySelector(".lines").style.gridTemplate="repeat("+2*e[1]+", 1fr) / repeat("+2*e[0]+", 1fr)"},t.prototype.initNodes=function(e){var t=this.getElement().querySelector(".nodes");e.forEach(function(e){var s=this.app.getLoader().getAreaByName(e.areaName).getElement();s.className="area "+e.nodeClass,s.style.gridArea=e.coords[1]+" / "+e.coords[0];var i=s.querySelector(".label");i.className="label "+e.labelClass,t.appendChild(s),(i.classList.contains("pos-n")||i.classList.contains("pos-s"))&&(i.style.left="-"+i.offsetWidth/2+"px")},this)},t.prototype.initLines=function(e){var t=this.getElement().querySelector(".lines");e.forEach(function(e){e.segments.forEach(function(s){var i=document.createElement("div");if(i.dataset.id=s.id,i.dataset.line=e.id,i.style.color=e.color,i.className="line "+s.class,i.style.gridArea=s.coords[0][1]+" / "+s.coords[0][0]+" / "+s.coords[1][1]+" / "+s.coords[1][0],"extra"in s)for(var n in s.extra)s.extra.hasOwnProperty(n)&&(i.style[n]=s.extra[n]);t.appendChild(i)},this)},this)},t});