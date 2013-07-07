// (C) 2007-2013 Qualtrics, Inc.

var QModules={moduleBasePath:'../WRQualtricsShared/JavaScript/Modules/',basePath:'../',loadedModules:{},loadType:'script',loadModule:function(path,options)
{var parsedPath=QModules.parsePath(path);var defaultOptions={method:'get',asynchronous:false,modulePath:path};if(options&&options.onComplete)
{defaultOptions.asynchronous=true;options.customOnComplete=options.onComplete;options.onComplete=null;}
if(QModules.loadType=='script'||QModules.loadType=='head')
{defaultOptions.evalJS=false;}
defaultOptions.evalJS=false;options=Object.extend(defaultOptions,options);options.onComplete=QModules.onModuleLoad;if(!QModules.loadedModules[path])
{if(options.killCache)
{var prefix='?';if(parsedPath.indexOf('?')!=-1)
{prefix='&';}
parsedPath+=prefix+'CacheKiller='+Math.random();}
if(QModules.loadType=='head'&&(options.customOnComplete||options.asynchronous))
{console.log("head loading script: "+parsedPath);var script=QBuilder('script',{src:parsedPath});script.onload=script.onreadystatechange=function(_,isAbort)
{if(isAbort||!script.readyState||/loaded|complete/.test(script.readyState))
{script.onload=script.onreadystatechange=null;script=undefined;if(!isAbort)
{QModules.moduledLoaded(options);}}};document.head.appendChild(script);}
else
{var requestObj=new Ajax.Request(parsedPath,options);}}
else if(options.customOnComplete)
{options.customOnComplete.defer();}},onModuleLoad:function(transport)
{if(transport.status==412&&!transport.request.options.killCache)
{transport.request.options.killCache=true;QModules.loadModule(transport.request.options.modulePath,transport.request.options);return;}
if(QModules.loadType=='script'||QModules.loadType=='head')
{try
{QModules.exec(transport.responseText);}
catch(e)
{QES_Error('Error loading script module: '+e);}}
else if(transport.request.options.evalJS===false)
{try
{new Function(transport.responseText)();}
catch(e)
{QES_Error('Error running module: '+e);}}
if(transport.status==200)
{QModules.moduledLoaded(transport.request.options);}},moduledLoaded:function(options)
{if(options.modulePath)
{QModules.loadedModules[options.modulePath]='loaded';}
if(options.customOnComplete)
{try
{options.customOnComplete();}
catch(e)
{console.error(e)}}},loadStylesheet:function(path,options)
{options=options||{};(function(){var fullPath='';if(path.indexOf('/')==-1)
{fullPath='../WRQualtricsShared/Stylesheet.php?p=ControlPanel&s='+path;}
else
{fullPath='../'+path;}
fullPath=QModules.getVersionedFile(fullPath,true);if(!QModules.loadedModules[fullPath])
{QModules.loadedModules[fullPath]='loaded';var link=QBuilder('link',{rel:'stylesheet',type:'text/css',href:fullPath});document.getElementsByTagName("head")[0].appendChild(link);}
if(options.onLoad&&options.triggerClass)
{var triggerElement=QBuilder('span',{className:options.triggerClass});$(triggerElement).hide();document.body.appendChild(triggerElement);new PeriodicalExecuter(function(pe){var color=$(triggerElement).getStyle('color');if(color=='#abcdef'||color=='rgb(171, 205, 239)')
{pe.stop();options.onLoad(path,options.triggerClass);}},.2);}}).defer();},exec:function(code)
{if((code+='').blank())
return;var script,scriptId;var head=$$('head').first()||$(document.documentElement);if(document.loaded)
{try
{script=new Element('script',{type:'text/javascript'});try
{script.appendChild(document.createTextNode(code));}
catch(e)
{script.text=code}
head.insert(script);}
catch(e)
{console.error(e);}}
else
{scriptId='__prototype_exec_script';document.write('<script id="'+scriptId+'" type="text/javascript">'+code+'<\/script>');script=$(scriptId);}
script.remove();},loadExternalModule:function(path,callback)
{var head=$$('head').first()||$(document.documentElement);var script=new Element('script',{type:'text/javascript',src:path});head.insert(script);},isLoaded:function(path)
{if(!QModules.loadedModules[path])
return false;else
return true;},parsePath:function(path)
{path=QModules.getVersionedFile(path);if(path.indexOf('http')===0)
{QModules.loadType="script";return path;}
if(path.indexOf('./')==0)
{path=QModules.moduleBasePath+path.substr(2);}
else if(path.search('/')==-1)
{path=QModules.moduleBasePath+path;}
else
{path=QModules.basePath+path;}
return path;},unload:function(path)
{if(QModules.loadedModules[path])
{delete QModules.loadedModules[path];}},getVersionedFile:function(file,forceParamVersioning)
{if(typeof qVersion!='undefined')
{var matches=file.match(/(.*)\.(js|css|jpg|gif|png)$/i);if(matches&&!forceParamVersioning)
{return matches[1]+"."+qVersion+"."+matches[2];}
else
{var prefix='?';if(file.indexOf('?')!=-1)
{prefix='&';}
return file+prefix+'v='+qVersion;}}
else
return file;}}
// (C) 2007-2013 Qualtrics, Inc.

var Builder={NODEMAP:{AREA:'map',CAPTION:'table',COL:'table',COLGROUP:'table',LEGEND:'fieldset',OPTGROUP:'select',OPTION:'select',PARAM:'object',TBODY:'table',TD:'table',TFOOT:'table',TH:'table',THEAD:'table',TR:'table'},node:function(elementName){elementName=elementName.toUpperCase();var parentTag=this.NODEMAP[elementName]||'div';var parentElement=document.createElement(parentTag);try{parentElement.innerHTML="<"+elementName+"></"+elementName+">";}catch(e){}
var element=parentElement.firstChild||null;if(element&&(element.tagName.toUpperCase()!=elementName))
element=element.getElementsByTagName(elementName)[0];if(!element)element=document.createElement(elementName);if(!element)return;if(arguments[1])
if(this._isStringOrNumber(arguments[1])||(arguments[1]instanceof Array)||arguments[1].tagName){this._children(element,arguments[1]);}else{var attrs=this._attributes(arguments[1]);if(attrs.length){try{parentElement.innerHTML="<"+elementName+" "+
attrs+"></"+elementName+">";}catch(e){}
element=parentElement.firstChild||null;if(!element){element=document.createElement(elementName);for(attr in arguments[1])
element[attr=='class'?'className':attr]=arguments[1][attr];}
if(element.tagName.toUpperCase()!=elementName)
element=parentElement.getElementsByTagName(elementName)[0];}}
if(arguments[2])
this._children(element,arguments[2]);return element;},_text:function(text){return document.createTextNode(text);},ATTR_MAP:{'className':'class','htmlFor':'for'},_attributes:function(attributes){var attrs=[];for(attribute in attributes)
attrs.push((attribute in this.ATTR_MAP?this.ATTR_MAP[attribute]:attribute)+'="'+attributes[attribute].toString().escapeHTML().gsub(/"/,'&quot;')+'"');return attrs.join(" ");},_children:function(element,children){if(children.tagName){element.appendChild(children);return;}
if(typeof children=='object'){children.flatten().each(function(e){if(typeof e=='object')
element.appendChild(e)
else
if(Builder._isStringOrNumber(e))
element.appendChild(Builder._text(e));});}else
if(Builder._isStringOrNumber(children))
element.appendChild(Builder._text(children));},_isStringOrNumber:function(param){return(typeof param=='string'||typeof param=='number');},build:function(html){var element=this.node('div');$(element).update(html.strip());return element.down();},dump:function(scope){if(typeof scope!='object'&&typeof scope!='function')scope=window;var tags=("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY "+"BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET "+"FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+"KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+"PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+"TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);tags.each(function(tag){scope[tag]=function(){return Builder.node.apply(Builder,[tag].concat($A(arguments)));}});}}
// (C) 2007-2013 Qualtrics, Inc.

String.prototype.parseColor=function(){var color='#';if(this.slice(0,4)=='rgb('){var cols=this.slice(4,this.length-1).split(',');var i=0;do{color+=parseInt(cols[i]).toColorPart()}while(++i<3);}else{if(this.slice(0,1)=='#'){if(this.length==4)for(var i=1;i<4;i++)color+=(this.charAt(i)+this.charAt(i)).toLowerCase();if(this.length==7)color=this.toLowerCase();}}
return(color.length==7?color:(arguments[0]||this));};Element.collectTextNodes=function(element){return $A($(element).childNodes).collect(function(node){return(node.nodeType==3?node.nodeValue:(node.hasChildNodes()?Element.collectTextNodes(node):''));}).flatten().join('');};Element.collectTextNodesIgnoreClass=function(element,className){return $A($(element).childNodes).collect(function(node){return(node.nodeType==3?node.nodeValue:((node.hasChildNodes()&&!Element.hasClassName(node,className))?Element.collectTextNodesIgnoreClass(node,className):''));}).flatten().join('');};Element.setContentZoom=function(element,percent){element=$(element);element.setStyle({fontSize:(percent/100)+'em'});if(Prototype.Browser.WebKit)window.scrollBy(0,0);return element;};Element.getInlineOpacity=function(element){return $(element).style.opacity||'';};Element.forceRerendering=function(element){try{element=$(element);var n=document.createTextNode(' ');element.appendChild(n);element.removeChild(n);}catch(e){}};var Effect={_elementDoesNotExistError:{name:'ElementDoesNotExistError',message:'The specified DOM element does not exist, but is required for this effect to operate'},Transitions:{linear:Prototype.K,sinoidal:function(pos){return(-Math.cos(pos*Math.PI)/2)+0.5;},reverse:function(pos){return 1-pos;},flicker:function(pos){var pos=((-Math.cos(pos*Math.PI)/4)+0.75)+Math.random()/4;return pos>1?1:pos;},wobble:function(pos){return(-Math.cos(pos*Math.PI*(9*pos))/2)+0.5;},pulse:function(pos,pulses){pulses=pulses||5;return(((pos%(1/pulses))*pulses).round()==0?((pos*pulses*2)-(pos*pulses*2).floor()):1-((pos*pulses*2)-(pos*pulses*2).floor()));},spring:function(pos){return 1-(Math.cos(pos*4.5*Math.PI)*Math.exp(-pos*6));},none:function(pos){return 0;},full:function(pos){return 1;}},DefaultOptions:{duration:1.0,fps:100,sync:false,from:0.0,to:1.0,delay:0.0,queue:'parallel'},tagifyText:function(element){var tagifyStyle='position:relative';if(Prototype.Browser.IE)tagifyStyle+=';zoom:1';element=$(element);$A(element.childNodes).each(function(child){if(child.nodeType==3){child.nodeValue.toArray().each(function(character){element.insertBefore(new Element('span',{style:tagifyStyle}).update(character==' '?String.fromCharCode(160):character),child);});Element.remove(child);}});},multiple:function(element,effect){var elements;if(((typeof element=='object')||Object.isFunction(element))&&(element.length))
elements=element;else
elements=$(element).childNodes;var options=Object.extend({speed:0.1,delay:0.0},arguments[2]||{});var masterDelay=options.delay;$A(elements).each(function(element,index){new effect(element,Object.extend(options,{delay:index*options.speed+masterDelay}));});},PAIRS:{'slide':['SlideDown','SlideUp'],'blind':['BlindDown','BlindUp'],'appear':['Appear','Fade']},toggle:function(element,effect){element=$(element);effect=(effect||'appear').toLowerCase();var options=Object.extend({queue:{position:'end',scope:(element.id||'global'),limit:1}},arguments[2]||{});Effect[element.visible()?Effect.PAIRS[effect][1]:Effect.PAIRS[effect][0]](element,options);}};Effect.DefaultOptions.transition=Effect.Transitions.sinoidal;Effect.ScopedQueue=Class.create(Enumerable,{initialize:function(){this.effects=[];this.interval=null;},_each:function(iterator){this.effects._each(iterator);},add:function(effect){var timestamp=new Date().getTime();var position=Object.isString(effect.options.queue)?effect.options.queue:effect.options.queue.position;switch(position){case'front':this.effects.findAll(function(e){return e.state=='idle'}).each(function(e){e.startOn+=effect.finishOn;e.finishOn+=effect.finishOn;});break;case'with-last':timestamp=this.effects.pluck('startOn').max()||timestamp;break;case'end':timestamp=this.effects.pluck('finishOn').max()||timestamp;break;}
effect.startOn+=timestamp;effect.finishOn+=timestamp;if(!effect.options.queue.limit||(this.effects.length<effect.options.queue.limit))
this.effects.push(effect);if(!this.interval)
this.interval=setInterval(this.loop.bind(this),15);},remove:function(effect){this.effects=this.effects.reject(function(e){return e==effect});if(this.effects.length==0){clearInterval(this.interval);this.interval=null;}},loop:function(){var timePos=new Date().getTime();for(var i=0,len=this.effects.length;i<len;i++)
this.effects[i]&&this.effects[i].loop(timePos);}});Effect.Queues={instances:$H(),get:function(queueName){if(!Object.isString(queueName))return queueName;return this.instances.get(queueName)||this.instances.set(queueName,new Effect.ScopedQueue());}};Effect.Queue=Effect.Queues.get('global');Effect.Base=Class.create({position:null,start:function(options){function codeForEvent(options,eventName){return((options[eventName+'Internal']?'this.options.'+eventName+'Internal(this);':'')+
(options[eventName]?'this.options.'+eventName+'(this);':''));}
if(options&&options.transition===false)options.transition=Effect.Transitions.linear;this.options=Object.extend(Object.extend({},Effect.DefaultOptions),options||{});this.currentFrame=0;this.state='idle';this.startOn=this.options.delay*1000;this.finishOn=this.startOn+(this.options.duration*1000);this.fromToDelta=this.options.to-this.options.from;this.totalTime=this.finishOn-this.startOn;this.totalFrames=this.options.fps*this.options.duration;eval('this.render = function(pos){ '+'if (this.state=="idle"){this.state="running";'+
codeForEvent(this.options,'beforeSetup')+
(this.setup?'this.setup();':'')+
codeForEvent(this.options,'afterSetup')+'};if (this.state=="running"){'+'pos=this.options.transition(pos)*'+this.fromToDelta+'+'+this.options.from+';'+'this.position=pos;'+
codeForEvent(this.options,'beforeUpdate')+
(this.update?'this.update(pos);':'')+
codeForEvent(this.options,'afterUpdate')+'}}');this.event('beforeStart');if(!this.options.sync)
Effect.Queues.get(Object.isString(this.options.queue)?'global':this.options.queue.scope).add(this);},loop:function(timePos){if(timePos>=this.startOn){if(timePos>=this.finishOn){this.render(1.0);this.cancel();this.event('beforeFinish');if(this.finish)this.finish();this.event('afterFinish');return;}
var pos=(timePos-this.startOn)/this.totalTime,frame=(pos*this.totalFrames).round();if(frame>this.currentFrame){this.render(pos);this.currentFrame=frame;}}},cancel:function(){if(!this.options.sync)
Effect.Queues.get(Object.isString(this.options.queue)?'global':this.options.queue.scope).remove(this);this.state='finished';},event:function(eventName){if(this.options[eventName+'Internal'])this.options[eventName+'Internal'](this);if(this.options[eventName])this.options[eventName](this);},inspect:function(){var data=$H();for(property in this)
if(!Object.isFunction(this[property]))data.set(property,this[property]);return'#<Effect:'+data.inspect()+',options:'+$H(this.options).inspect()+'>';}});Effect.Parallel=Class.create(Effect.Base,{initialize:function(effects){this.effects=effects||[];this.start(arguments[1]);},update:function(position){this.effects.invoke('render',position);},finish:function(position){this.effects.each(function(effect){effect.render(1.0);effect.cancel();effect.event('beforeFinish');if(effect.finish)effect.finish(position);effect.event('afterFinish');});}});Effect.Tween=Class.create(Effect.Base,{initialize:function(object,from,to){object=Object.isString(object)?$(object):object;var args=$A(arguments),method=args.last(),options=args.length==5?args[3]:null;this.method=Object.isFunction(method)?method.bind(object):Object.isFunction(object[method])?object[method].bind(object):function(value){object[method]=value};this.start(Object.extend({from:from,to:to},options||{}));},update:function(position){this.method(position);}});Effect.Event=Class.create(Effect.Base,{initialize:function(){this.start(Object.extend({duration:0},arguments[0]||{}));},update:Prototype.emptyFunction});Effect.Opacity=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);if(Prototype.Browser.IE&&(!this.element.currentStyle.hasLayout))
this.element.setStyle({zoom:1});var options=Object.extend({from:this.element.getOpacity()||0.0,to:1.0},arguments[1]||{});this.start(options);},update:function(position){this.element.setOpacity(position);}});Effect.Move=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({x:0,y:0,mode:'relative'},arguments[1]||{});this.start(options);},setup:function(){this.element.makePositioned();this.originalLeft=parseFloat(this.element.getStyle('left')||'0');this.originalTop=parseFloat(this.element.getStyle('top')||'0');if(this.options.mode=='absolute'){this.options.x=this.options.x-this.originalLeft;this.options.y=this.options.y-this.originalTop;}},update:function(position){this.element.setStyle({left:(this.options.x*position+this.originalLeft).round()+'px',top:(this.options.y*position+this.originalTop).round()+'px'});}});Effect.MoveBy=function(element,toTop,toLeft){return new Effect.Move(element,Object.extend({x:toLeft,y:toTop},arguments[3]||{}));};Effect.Scale=Class.create(Effect.Base,{initialize:function(element,percent){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({scaleX:true,scaleY:true,scaleContent:true,scaleFromCenter:false,scaleMode:'box',scaleFrom:100.0,scaleTo:percent},arguments[2]||{});this.start(options);},setup:function(){this.restoreAfterFinish=this.options.restoreAfterFinish||false;this.elementPositioning=this.element.getStyle('position');this.originalStyle={};['top','left','width','height','fontSize'].each(function(k){this.originalStyle[k]=this.element.style[k];}.bind(this));this.originalTop=this.element.offsetTop;this.originalLeft=this.element.offsetLeft;var fontSize=this.element.getStyle('font-size')||'100%';['em','px','%','pt'].each(function(fontSizeType){if(fontSize.indexOf(fontSizeType)>0){this.fontSize=parseFloat(fontSize);this.fontSizeType=fontSizeType;}}.bind(this));this.factor=(this.options.scaleTo-this.options.scaleFrom)/100;this.dims=null;if(this.options.scaleMode=='box')
this.dims=[this.element.offsetHeight,this.element.offsetWidth];if(/^content/.test(this.options.scaleMode))
this.dims=[this.element.scrollHeight,this.element.scrollWidth];if(!this.dims)
this.dims=[this.options.scaleMode.originalHeight,this.options.scaleMode.originalWidth];},update:function(position){var currentScale=(this.options.scaleFrom/100.0)+(this.factor*position);if(this.options.scaleContent&&this.fontSize)
this.element.setStyle({fontSize:this.fontSize*currentScale+this.fontSizeType});this.setDimensions(this.dims[0]*currentScale,this.dims[1]*currentScale);},finish:function(position){if(this.restoreAfterFinish)this.element.setStyle(this.originalStyle);},setDimensions:function(height,width){var d={};if(this.options.scaleX)d.width=width.round()+'px';if(this.options.scaleY)d.height=height.round()+'px';if(this.options.scaleFromCenter){var topd=(height-this.dims[0])/2;var leftd=(width-this.dims[1])/2;if(this.elementPositioning=='absolute'){if(this.options.scaleY)d.top=this.originalTop-topd+'px';if(this.options.scaleX)d.left=this.originalLeft-leftd+'px';}else{if(this.options.scaleY)d.top=-topd+'px';if(this.options.scaleX)d.left=-leftd+'px';}}
this.element.setStyle(d);}});Effect.Highlight=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({startcolor:'#ffff99'},arguments[1]||{});this.start(options);},setup:function(){if(this.element.getStyle('display')=='none'){this.cancel();return;}
this.oldStyle={};if(!this.options.keepBackgroundImage){this.oldStyle.backgroundImage=this.element.getStyle('background-image');this.element.setStyle({backgroundImage:'none'});}
if(!this.options.endcolor)
this.options.endcolor=this.element.getStyle('background-color').parseColor('#ffffff');if(!this.options.restorecolor)
this.options.restorecolor=this.element.getStyle('background-color');this._base=$R(0,2).map(function(i){return parseInt(this.options.startcolor.slice(i*2+1,i*2+3),16)}.bind(this));this._delta=$R(0,2).map(function(i){return parseInt(this.options.endcolor.slice(i*2+1,i*2+3),16)-this._base[i]}.bind(this));},update:function(position){this.element.setStyle({backgroundColor:$R(0,2).inject('#',function(m,v,i){return m+((this._base[i]+(this._delta[i]*position)).round().toColorPart());}.bind(this))});},finish:function(){this.element.setStyle(Object.extend(this.oldStyle,{backgroundColor:this.options.restorecolor}));}});Effect.ScrollTo=function(element){var options=arguments[1]||{},scrollOffsets=document.viewport.getScrollOffsets(),elementOffsets=$(element).cumulativeOffset(),max=(window.height||document.body.scrollHeight)-document.viewport.getHeight();if(options.offset)elementOffsets[1]+=options.offset;return new Effect.Tween(null,scrollOffsets.top,elementOffsets[1]>max?max:elementOffsets[1],options,function(p){scrollTo(scrollOffsets.left,p.round())});};Effect.Fade=function(element){element=$(element);var oldOpacity=element.getInlineOpacity();var options=Object.extend({from:element.getOpacity()||1.0,to:0.0,afterFinishInternal:function(effect){if(effect.options.to!=0)return;effect.element.hide().setStyle({opacity:oldOpacity});}},arguments[1]||{});return new Effect.Opacity(element,options);};Effect.Appear=function(element){element=$(element);var options=Object.extend({from:(element.getStyle('display')=='none'?0.0:element.getOpacity()||0.0),to:1.0,afterFinishInternal:function(effect){effect.element.forceRerendering();},beforeSetup:function(effect){effect.element.setOpacity(effect.options.from).show();}},arguments[1]||{});return new Effect.Opacity(element,options);};Effect.Puff=function(element){element=$(element);var oldStyle={opacity:element.getInlineOpacity(),position:element.getStyle('position'),top:element.style.top,left:element.style.left,width:element.style.width,height:element.style.height};return new Effect.Parallel([new Effect.Scale(element,200,{sync:true,scaleFromCenter:true,scaleContent:true,restoreAfterFinish:true}),new Effect.Opacity(element,{sync:true,to:0.0})],Object.extend({duration:1.0,beforeSetupInternal:function(effect){Position.absolutize(effect.effects[0].element)},afterFinishInternal:function(effect){effect.effects[0].element.hide().setStyle(oldStyle);}},arguments[1]||{}));};Effect.BlindUp=function(element){element=$(element);element.makeClipping();return new Effect.Scale(element,0,Object.extend({scaleContent:false,scaleX:false,restoreAfterFinish:true,afterFinishInternal:function(effect){effect.element.hide().undoClipping();}},arguments[1]||{}));};Effect.BlindDown=function(element){element=$(element);var elementDimensions=element.getDimensions();return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:0,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makeClipping().setStyle({height:'0px'}).show();},afterFinishInternal:function(effect){effect.element.undoClipping();}},arguments[1]||{}));};Effect.SwitchOff=function(element){element=$(element);var oldOpacity=element.getInlineOpacity();return new Effect.Appear(element,Object.extend({duration:0.4,from:0,transition:Effect.Transitions.flicker,afterFinishInternal:function(effect){new Effect.Scale(effect.element,1,{duration:0.3,scaleFromCenter:true,scaleX:false,scaleContent:false,restoreAfterFinish:true,beforeSetup:function(effect){effect.element.makePositioned().makeClipping();},afterFinishInternal:function(effect){effect.element.hide().undoClipping().undoPositioned().setStyle({opacity:oldOpacity});}})}},arguments[1]||{}));};Effect.DropOut=function(element){element=$(element);var oldStyle={top:element.getStyle('top'),left:element.getStyle('left'),opacity:element.getInlineOpacity()};return new Effect.Parallel([new Effect.Move(element,{x:0,y:100,sync:true}),new Effect.Opacity(element,{sync:true,to:0.0})],Object.extend({duration:0.5,beforeSetup:function(effect){effect.effects[0].element.makePositioned();},afterFinishInternal:function(effect){effect.effects[0].element.hide().undoPositioned().setStyle(oldStyle);}},arguments[1]||{}));};Effect.Shake=function(element){element=$(element);var options=Object.extend({distance:20,duration:0.5},arguments[1]||{});var distance=parseFloat(options.distance);var split=parseFloat(options.duration)/10.0;var oldStyle={top:element.getStyle('top'),left:element.getStyle('left')};return new Effect.Move(element,{x:distance,y:0,duration:split,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance,y:0,duration:split,afterFinishInternal:function(effect){effect.element.undoPositioned().setStyle(oldStyle);}})}})}})}})}})}});};Effect.SlideDown=function(element){element=$(element).cleanWhitespace();var oldInnerBottom=element.down().getStyle('bottom');var elementDimensions=element.getDimensions();return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:window.opera?0:1,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makePositioned();effect.element.down().makePositioned();if(window.opera)effect.element.setStyle({top:''});effect.element.makeClipping().setStyle({height:'0px'}).show();},afterUpdateInternal:function(effect){effect.element.down().setStyle({bottom:(effect.dims[0]-effect.element.clientHeight)+'px'});},afterFinishInternal:function(effect){effect.element.undoClipping().undoPositioned();effect.element.down().undoPositioned().setStyle({bottom:oldInnerBottom});}},arguments[1]||{}));};Effect.SlideUp=function(element){element=$(element).cleanWhitespace();var oldInnerBottom=element.down().getStyle('bottom');var elementDimensions=element.getDimensions();return new Effect.Scale(element,window.opera?0:1,Object.extend({scaleContent:false,scaleX:false,scaleMode:'box',scaleFrom:100,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makePositioned();effect.element.down().makePositioned();if(window.opera)effect.element.setStyle({top:''});effect.element.makeClipping().show();},afterUpdateInternal:function(effect){effect.element.down().setStyle({bottom:(effect.dims[0]-effect.element.clientHeight)+'px'});},afterFinishInternal:function(effect){effect.element.hide().undoClipping().undoPositioned();effect.element.down().undoPositioned().setStyle({bottom:oldInnerBottom});}},arguments[1]||{}));};Effect.Squish=function(element){return new Effect.Scale(element,window.opera?1:0,{restoreAfterFinish:true,beforeSetup:function(effect){effect.element.makeClipping();},afterFinishInternal:function(effect){effect.element.hide().undoClipping();}});};Effect.Grow=function(element){element=$(element);var options=Object.extend({direction:'center',moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.full},arguments[1]||{});var oldStyle={top:element.style.top,left:element.style.left,height:element.style.height,width:element.style.width,opacity:element.getInlineOpacity()};var dims=element.getDimensions();var initialMoveX,initialMoveY;var moveX,moveY;switch(options.direction){case'top-left':initialMoveX=initialMoveY=moveX=moveY=0;break;case'top-right':initialMoveX=dims.width;initialMoveY=moveY=0;moveX=-dims.width;break;case'bottom-left':initialMoveX=moveX=0;initialMoveY=dims.height;moveY=-dims.height;break;case'bottom-right':initialMoveX=dims.width;initialMoveY=dims.height;moveX=-dims.width;moveY=-dims.height;break;case'center':initialMoveX=dims.width/2;initialMoveY=dims.height/2;moveX=-dims.width/2;moveY=-dims.height/2;break;}
return new Effect.Move(element,{x:initialMoveX,y:initialMoveY,duration:0.01,beforeSetup:function(effect){effect.element.hide().makeClipping().makePositioned();},afterFinishInternal:function(effect){new Effect.Parallel([new Effect.Opacity(effect.element,{sync:true,to:1.0,from:0.0,transition:options.opacityTransition}),new Effect.Move(effect.element,{x:moveX,y:moveY,sync:true,transition:options.moveTransition}),new Effect.Scale(effect.element,100,{scaleMode:{originalHeight:dims.height,originalWidth:dims.width},sync:true,scaleFrom:window.opera?1:0,transition:options.scaleTransition,restoreAfterFinish:true})],Object.extend({beforeSetup:function(effect){effect.effects[0].element.setStyle({height:'0px'}).show();},afterFinishInternal:function(effect){effect.effects[0].element.undoClipping().undoPositioned().setStyle(oldStyle);}},options))}});};Effect.Shrink=function(element){element=$(element);var options=Object.extend({direction:'center',moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.none},arguments[1]||{});var oldStyle={top:element.style.top,left:element.style.left,height:element.style.height,width:element.style.width,opacity:element.getInlineOpacity()};var dims=element.getDimensions();var moveX,moveY;switch(options.direction){case'top-left':moveX=moveY=0;break;case'top-right':moveX=dims.width;moveY=0;break;case'bottom-left':moveX=0;moveY=dims.height;break;case'bottom-right':moveX=dims.width;moveY=dims.height;break;case'center':moveX=dims.width/2;moveY=dims.height/2;break;}
return new Effect.Parallel([new Effect.Opacity(element,{sync:true,to:0.0,from:1.0,transition:options.opacityTransition}),new Effect.Scale(element,window.opera?1:0,{sync:true,transition:options.scaleTransition,restoreAfterFinish:true}),new Effect.Move(element,{x:moveX,y:moveY,sync:true,transition:options.moveTransition})],Object.extend({beforeStartInternal:function(effect){effect.effects[0].element.makePositioned().makeClipping();},afterFinishInternal:function(effect){effect.effects[0].element.hide().undoClipping().undoPositioned().setStyle(oldStyle);}},options));};Effect.Pulsate=function(element){element=$(element);var options=arguments[1]||{};var oldOpacity=element.getInlineOpacity();var transition=options.transition||Effect.Transitions.sinoidal;var reverser=function(pos){return transition(1-Effect.Transitions.pulse(pos,options.pulses))};reverser.bind(transition);return new Effect.Opacity(element,Object.extend(Object.extend({duration:2.0,from:0,afterFinishInternal:function(effect){effect.element.setStyle({opacity:oldOpacity});}},options),{transition:reverser}));};Effect.Fold=function(element){element=$(element);var oldStyle={top:element.style.top,left:element.style.left,width:element.style.width,height:element.style.height};element.makeClipping();return new Effect.Scale(element,5,Object.extend({scaleContent:false,scaleX:false,afterFinishInternal:function(effect){new Effect.Scale(element,1,{scaleContent:false,scaleY:false,afterFinishInternal:function(effect){effect.element.hide().undoClipping().setStyle(oldStyle);}});}},arguments[1]||{}));};Effect.Morph=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({style:{}},arguments[1]||{});if(!Object.isString(options.style))this.style=$H(options.style);else{if(options.style.include(':'))
this.style=options.style.parseStyle();else{this.element.addClassName(options.style);this.style=$H(this.element.getStyles());this.element.removeClassName(options.style);var css=this.element.getStyles();this.style=this.style.reject(function(style){return style.value==css[style.key];});options.afterFinishInternal=function(effect){effect.element.addClassName(effect.options.style);effect.transforms.each(function(transform){effect.element.style[transform.style]='';});}}}
this.start(options);},setup:function(){function parseColor(color){if(!color||['rgba(0, 0, 0, 0)','transparent'].include(color))color='#ffffff';color=color.parseColor();return $R(0,2).map(function(i){return parseInt(color.slice(i*2+1,i*2+3),16)});}
this.transforms=this.style.map(function(pair){var property=pair[0],value=pair[1],unit=null;if(value.parseColor('#zzzzzz')!='#zzzzzz'){value=value.parseColor();unit='color';}else if(property=='opacity'){value=parseFloat(value);if(Prototype.Browser.IE&&(!this.element.currentStyle.hasLayout))
this.element.setStyle({zoom:1});}else if(Element.CSS_LENGTH.test(value)){var components=value.match(/^([\+\-]?[0-9\.]+)(.*)$/);value=parseFloat(components[1]);unit=(components.length==3)?components[2]:null;}
var originalValue=this.element.getStyle(property);return{style:property.camelize(),originalValue:unit=='color'?parseColor(originalValue):parseFloat(originalValue||0),targetValue:unit=='color'?parseColor(value):value,unit:unit};}.bind(this)).reject(function(transform){return((transform.originalValue==transform.targetValue)||(transform.unit!='color'&&(isNaN(transform.originalValue)||isNaN(transform.targetValue))))});},update:function(position){var style={},transform,i=this.transforms.length;while(i--)
style[(transform=this.transforms[i]).style]=transform.unit=='color'?'#'+
(Math.round(transform.originalValue[0]+
(transform.targetValue[0]-transform.originalValue[0])*position)).toColorPart()+
(Math.round(transform.originalValue[1]+
(transform.targetValue[1]-transform.originalValue[1])*position)).toColorPart()+
(Math.round(transform.originalValue[2]+
(transform.targetValue[2]-transform.originalValue[2])*position)).toColorPart():(transform.originalValue+
(transform.targetValue-transform.originalValue)*position).toFixed(3)+
(transform.unit===null?'':transform.unit);this.element.setStyle(style,true);}});Effect.Transform=Class.create({initialize:function(tracks){this.tracks=[];this.options=arguments[1]||{};this.addTracks(tracks);},addTracks:function(tracks){tracks.each(function(track){track=$H(track);var data=track.values().first();this.tracks.push($H({ids:track.keys().first(),effect:Effect.Morph,options:{style:data}}));}.bind(this));return this;},play:function(){return new Effect.Parallel(this.tracks.map(function(track){var ids=track.get('ids'),effect=track.get('effect'),options=track.get('options');var elements=[$(ids)||$$(ids)].flatten();return elements.map(function(e){return new effect(e,Object.extend({sync:true},options))});}).flatten(),this.options);}});Element.CSS_PROPERTIES=$w('backgroundColor backgroundPosition borderBottomColor borderBottomStyle '+'borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth '+'borderRightColor borderRightStyle borderRightWidth borderSpacing '+'borderTopColor borderTopStyle borderTopWidth bottom clip color '+'fontSize fontWeight height left letterSpacing lineHeight '+'marginBottom marginLeft marginRight marginTop markerOffset maxHeight '+'maxWidth minHeight minWidth opacity outlineColor outlineOffset '+'outlineWidth paddingBottom paddingLeft paddingRight paddingTop '+'right textIndent top width wordSpacing zIndex');Element.CSS_LENGTH=/^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;String.__parseStyleElement=document.createElement('div');String.prototype.parseStyle=function(){var style,styleRules=$H();if(Prototype.Browser.WebKit)
style=new Element('div',{style:this}).style;else{String.__parseStyleElement.innerHTML='<div style="'+this+'"></div>';style=String.__parseStyleElement.childNodes[0].style;}
Element.CSS_PROPERTIES.each(function(property){if(style[property])styleRules.set(property,style[property]);});if(Prototype.Browser.IE&&this.include('opacity'))
styleRules.set('opacity',this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1]);return styleRules;};if(document.defaultView&&document.defaultView.getComputedStyle){Element.getStyles=function(element){var css=document.defaultView.getComputedStyle($(element),null);return Element.CSS_PROPERTIES.inject({},function(styles,property){styles[property]=css[property];return styles;});};}else{Element.getStyles=function(element){element=$(element);var css=element.currentStyle,styles;styles=Element.CSS_PROPERTIES.inject({},function(results,property){results[property]=css[property];return results;});if(!styles.opacity)styles.opacity=element.getOpacity();return styles;};};Effect.Methods={morph:function(element,style){element=$(element);new Effect.Morph(element,Object.extend({style:style},arguments[2]||{}));return element;},visualEffect:function(element,effect,options){element=$(element)
var s=effect.dasherize().camelize(),klass=s.charAt(0).toUpperCase()+s.substring(1);new Effect[klass](element,options);return element;},highlight:function(element,options){element=$(element);new Effect.Highlight(element,options);return element;}};$w('fade appear grow shrink fold blindUp blindDown slideUp slideDown '+'pulsate shake puff squish switchOff dropOut').each(function(effect){Effect.Methods[effect]=function(element,options){element=$(element);Effect[effect.charAt(0).toUpperCase()+effect.substring(1)](element,options);return element;}});$w('getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles').each(function(f){Effect.Methods[f]=Element[f];});Element.addMethods(Effect.Methods);
// (C) 2007-2013 Qualtrics, Inc.

if(Object.isUndefined(Effect))
throw("dragdrop.js requires including script.aculo.us' effects.js library");var Droppables={drops:[],remove:function(element){this.drops=this.drops.reject(function(d){return d.element==$(element)});},add:function(element){element=$(element);var options=Object.extend({greedy:true,hoverclass:null,tree:false},arguments[1]||{});if(options.containment){options._containers=[];var containment=options.containment;if(Object.isArray(containment)){containment.each(function(c){options._containers.push($(c))});}else{options._containers.push($(containment));}}
if(options.accept)options.accept=[options.accept].flatten();Element.makePositioned(element);options.element=element;this.drops.push(options);},findDeepestChild:function(drops){deepest=drops[0];for(i=1;i<drops.length;++i)
if(Element.isParent(drops[i].element,deepest.element))
deepest=drops[i];return deepest;},isContained:function(element,drop){var containmentNode;if(drop.tree){containmentNode=element.treeNode;}else{containmentNode=element.parentNode;}
return drop._containers.detect(function(c){return containmentNode==c});},isAffected:function(point,element,drop){return((drop.element!=element)&&((!drop._containers)||this.isContained(element,drop))&&((!drop.accept)||(Element.classNames(element).detect(function(v){return drop.accept.include(v)})))&&Position.within(drop.element,point[0],point[1]));},deactivate:function(drop){if(drop.hoverclass)
Element.removeClassName(drop.element,drop.hoverclass);this.last_active=null;},activate:function(drop){if(drop.hoverclass)
Element.addClassName(drop.element,drop.hoverclass);this.last_active=drop;},show:function(point,element){if(!this.drops.length)return;var drop,affected=[];this.drops.each(function(drop){if(Droppables.isAffected(point,element,drop))
affected.push(drop);});if(affected.length>0)
drop=Droppables.findDeepestChild(affected);if(this.last_active&&this.last_active!=drop)this.deactivate(this.last_active);if(drop){Position.within(drop.element,point[0],point[1]);if(drop.onHover)
drop.onHover(element,drop.element,Position.overlap(drop.overlap,drop.element));if(drop!=this.last_active)Droppables.activate(drop);}},fire:function(event,element){if(!this.last_active)return;Position.prepare();if(this.isAffected([Event.pointerX(event),Event.pointerY(event)],element,this.last_active))
if(this.last_active.onDrop){this.last_active.onDrop(element,this.last_active.element,event);return true;}},reset:function(){if(this.last_active)
this.deactivate(this.last_active);}}
var Draggables={drags:[],observers:[],register:function(draggable){if(this.drags.length==0){this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.updateDrag.bindAsEventListener(this);this.eventKeypress=this.keyPress.bindAsEventListener(this);Event.observe(document,"mouseup",this.eventMouseUp);Event.observe(document,"mousemove",this.eventMouseMove);Event.observe(document,"keypress",this.eventKeypress);}
this.drags.push(draggable);},unregister:function(draggable){this.drags=this.drags.reject(function(d){return d==draggable});if(this.drags.length==0){Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);Event.stopObserving(document,"keypress",this.eventKeypress);}},activate:function(draggable){if(draggable.options.delay){this._timeout=setTimeout(function(){Draggables._timeout=null;window.focus();Draggables.activeDraggable=draggable;}.bind(this),draggable.options.delay);}else{window.focus();this.activeDraggable=draggable;}},deactivate:function(){this.activeDraggable=null;},updateDrag:function(event){if(!this.activeDraggable)return;var pointer=[Event.pointerX(event),Event.pointerY(event)];if(this._lastPointer&&(this._lastPointer.inspect()==pointer.inspect()))return;this._lastPointer=pointer;this.activeDraggable.updateDrag(event,pointer);},endDrag:function(event){if(this._timeout){clearTimeout(this._timeout);this._timeout=null;}
if(!this.activeDraggable)return;this._lastPointer=null;this.activeDraggable.endDrag(event);this.activeDraggable=null;},keyPress:function(event){if(this.activeDraggable)
this.activeDraggable.keyPress(event);},addObserver:function(observer){this.observers.push(observer);this._cacheObserverCallbacks();},removeObserver:function(element){this.observers=this.observers.reject(function(o){return o.element==element});this._cacheObserverCallbacks();},notify:function(eventName,draggable,event){if(this[eventName+'Count']>0)
this.observers.each(function(o){if(o[eventName])o[eventName](eventName,draggable,event);});if(draggable.options[eventName])draggable.options[eventName](draggable,event);},_cacheObserverCallbacks:function(){['onStart','onEnd','onDrag'].each(function(eventName){Draggables[eventName+'Count']=Draggables.observers.select(function(o){return o[eventName];}).length;});}}
var Draggable=Class.create({initialize:function(element){var defaults={handle:false,reverteffect:function(element,top_offset,left_offset){var dur=Math.sqrt(Math.abs(top_offset^2)+Math.abs(left_offset^2))*0.02;new Effect.Move(element,{x:-left_offset,y:-top_offset,duration:dur,queue:{scope:'_draggable',position:'end'}});},endeffect:function(element){var toOpacity=Object.isNumber(element._opacity)?element._opacity:1.0;new Effect.Opacity(element,{duration:0.2,from:0.7,to:toOpacity,queue:{scope:'_draggable',position:'end'},afterFinish:function(){Draggable._dragging[element]=false}});},zindex:1000,revert:false,quiet:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,snap:false,delay:0};if(!arguments[1]||Object.isUndefined(arguments[1].endeffect))
Object.extend(defaults,{starteffect:function(element){element._opacity=Element.getOpacity(element);Draggable._dragging[element]=true;new Effect.Opacity(element,{duration:0.2,from:element._opacity,to:0.7});}});var options=Object.extend(defaults,arguments[1]||{});this.element=$(element);if(options.handle&&Object.isString(options.handle))
this.handle=this.element.down('.'+options.handle,0);if(!this.handle)this.handle=$(options.handle);if(!this.handle)this.handle=this.element;if(options.scroll&&!options.scroll.scrollTo&&!options.scroll.outerHTML){options.scroll=$(options.scroll);this._isScrollChild=Element.childOf(this.element,options.scroll);}
Element.makePositioned(this.element);this.options=options;this.dragging=false;this.eventMouseDown=this.initDrag.bindAsEventListener(this);Event.observe(this.handle,"mousedown",this.eventMouseDown);Draggables.register(this);},destroy:function(){Event.stopObserving(this.handle,"mousedown",this.eventMouseDown);Draggables.unregister(this);},currentDelta:function(){return([parseInt(Element.getStyle(this.element,'left')||'0'),parseInt(Element.getStyle(this.element,'top')||'0')]);},initDrag:function(event){if(!Object.isUndefined(Draggable._dragging[this.element])&&Draggable._dragging[this.element])return;if(Event.isLeftClick(event)){var src=Event.element(event);if((tag_name=src.tagName.toUpperCase())&&(tag_name=='INPUT'||tag_name=='SELECT'||tag_name=='OPTION'||tag_name=='BUTTON'||tag_name=='TEXTAREA'))return;var pointer=[Event.pointerX(event),Event.pointerY(event)];var pos=Position.cumulativeOffset(this.element);this.offset=[0,1].map(function(i){return(pointer[i]-pos[i])});Draggables.activate(this);Event.stop(event);}},startDrag:function(event){this.dragging=true;if(!this.delta)
this.delta=this.currentDelta();if(this.options.zindex){this.originalZ=parseInt(Element.getStyle(this.element,'z-index')||0);this.element.style.zIndex=this.options.zindex;}
if(this.options.ghosting){this._clone=this.element.cloneNode(true);this.element._originallyAbsolute=(this.element.getStyle('position')=='absolute');if(!this.element._originallyAbsolute)
Position.absolutize(this.element);this.element.parentNode.insertBefore(this._clone,this.element);}
if(this.options.scroll){if(this.options.scroll==window){var where=this._getWindowScroll(this.options.scroll);this.originalScrollLeft=where.left;this.originalScrollTop=where.top;}else{this.originalScrollLeft=this.options.scroll.scrollLeft;this.originalScrollTop=this.options.scroll.scrollTop;}}
Draggables.notify('onStart',this,event);if(this.options.starteffect)this.options.starteffect(this.element);},updateDrag:function(event,pointer){if(!this.dragging)this.startDrag(event);if(!this.options.quiet){Position.prepare();Droppables.show(pointer,this.element);}
Draggables.notify('onDrag',this,event);this.draw(pointer);if(this.options.change)this.options.change(this);if(this.options.scroll){this.stopScrolling();var p;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){p=[left,top,left+width,top+height];}}else{p=Position.page(this.options.scroll);p[0]+=this.options.scroll.scrollLeft+Position.deltaX;p[1]+=this.options.scroll.scrollTop+Position.deltaY;p.push(p[0]+this.options.scroll.offsetWidth);p.push(p[1]+this.options.scroll.offsetHeight);}
var speed=[0,0];if(pointer[0]<(p[0]+this.options.scrollSensitivity))speed[0]=pointer[0]-(p[0]+this.options.scrollSensitivity);if(pointer[1]<(p[1]+this.options.scrollSensitivity))speed[1]=pointer[1]-(p[1]+this.options.scrollSensitivity);if(pointer[0]>(p[2]-this.options.scrollSensitivity))speed[0]=pointer[0]-(p[2]-this.options.scrollSensitivity);if(pointer[1]>(p[3]-this.options.scrollSensitivity))speed[1]=pointer[1]-(p[3]-this.options.scrollSensitivity);this.startScrolling(speed);}
if(Prototype.Browser.WebKit)window.scrollBy(0,0);Event.stop(event);},finishDrag:function(event,success){this.dragging=false;if(this.options.quiet){Position.prepare();var pointer=[Event.pointerX(event),Event.pointerY(event)];Droppables.show(pointer,this.element);}
if(this.options.ghosting){if(!this.element._originallyAbsolute)
Position.relativize(this.element);delete this.element._originallyAbsolute;Element.remove(this._clone);this._clone=null;}
var dropped=false;if(success){dropped=Droppables.fire(event,this.element);if(!dropped)dropped=false;}
if(dropped&&this.options.onDropped)this.options.onDropped(this.element);Draggables.notify('onEnd',this,event);var revert=this.options.revert;if(revert&&Object.isFunction(revert))revert=revert(this.element);var d=this.currentDelta();if(revert&&this.options.reverteffect){if(dropped==0||revert!='failure')
this.options.reverteffect(this.element,d[1]-this.delta[1],d[0]-this.delta[0]);}else{this.delta=d;}
if(this.options.zindex)
this.element.style.zIndex=this.originalZ;if(this.options.endeffect)
this.options.endeffect(this.element);Draggables.deactivate(this);Droppables.reset();},keyPress:function(event){if(event.keyCode!=Event.KEY_ESC)return;this.finishDrag(event,false);Event.stop(event);},endDrag:function(event){if(!this.dragging)return;this.stopScrolling();this.finishDrag(event,true);Event.stop(event);},draw:function(point){var pos=Position.cumulativeOffset(this.element);if(this.options.ghosting){var r=Position.realOffset(this.element);pos[0]+=r[0]-Position.deltaX;pos[1]+=r[1]-Position.deltaY;}
var d=this.currentDelta();pos[0]-=d[0];pos[1]-=d[1];if(this.options.scroll&&(this.options.scroll!=window&&this._isScrollChild)){pos[0]-=this.options.scroll.scrollLeft-this.originalScrollLeft;pos[1]-=this.options.scroll.scrollTop-this.originalScrollTop;}
var p=[0,1].map(function(i){return(point[i]-pos[i]-this.offset[i])}.bind(this));if(this.options.snap){if(Object.isFunction(this.options.snap)){p=this.options.snap(p[0],p[1],this);}else{if(Object.isArray(this.options.snap)){p=p.map(function(v,i){return(v/this.options.snap[i]).round()*this.options.snap[i]}.bind(this))}else{p=p.map(function(v){return(v/this.options.snap).round()*this.options.snap}.bind(this))}}}
var style=this.element.style;if((!this.options.constraint)||(this.options.constraint=='horizontal'))
style.left=p[0]+"px";if((!this.options.constraint)||(this.options.constraint=='vertical'))
style.top=p[1]+"px";if(style.visibility=="hidden")style.visibility="";},stopScrolling:function(){if(this.scrollInterval){clearInterval(this.scrollInterval);this.scrollInterval=null;Draggables._lastScrollPointer=null;}},startScrolling:function(speed){if(!(speed[0]||speed[1]))return;this.scrollSpeed=[speed[0]*this.options.scrollSpeed,speed[1]*this.options.scrollSpeed];this.lastScrolled=new Date();this.scrollInterval=setInterval(this.scroll.bind(this),10);},scroll:function(){var current=new Date();var delta=current-this.lastScrolled;this.lastScrolled=current;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){if(this.scrollSpeed[0]||this.scrollSpeed[1]){var d=delta/1000;this.options.scroll.scrollTo(left+d*this.scrollSpeed[0],top+d*this.scrollSpeed[1]);}}}else{this.options.scroll.scrollLeft+=this.scrollSpeed[0]*delta/1000;this.options.scroll.scrollTop+=this.scrollSpeed[1]*delta/1000;}
Position.prepare();Droppables.show(Draggables._lastPointer,this.element);Draggables.notify('onDrag',this);if(this._isScrollChild){Draggables._lastScrollPointer=Draggables._lastScrollPointer||$A(Draggables._lastPointer);Draggables._lastScrollPointer[0]+=this.scrollSpeed[0]*delta/1000;Draggables._lastScrollPointer[1]+=this.scrollSpeed[1]*delta/1000;if(Draggables._lastScrollPointer[0]<0)
Draggables._lastScrollPointer[0]=0;if(Draggables._lastScrollPointer[1]<0)
Draggables._lastScrollPointer[1]=0;this.draw(Draggables._lastScrollPointer);}
if(this.options.change)this.options.change(this);},_getWindowScroll:function(w){var T,L,W,H;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;L=documentElement.scrollLeft;}else if(w.document.body){T=body.scrollTop;L=body.scrollLeft;}
if(w.innerWidth){W=w.innerWidth;H=w.innerHeight;}else if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;H=documentElement.clientHeight;}else{W=body.offsetWidth;H=body.offsetHeight}}
return{top:T,left:L,width:W,height:H};}});Draggable._dragging={};var SortableObserver=Class.create({initialize:function(element,observer){this.element=$(element);this.observer=observer;this.lastValue=Sortable.serialize(this.element);},onStart:function(){this.lastValue=Sortable.serialize(this.element);},onEnd:function(){Sortable.unmark();if(this.lastValue!=Sortable.serialize(this.element))
this.observer(this.element)}});var Sortable={SERIALIZE_RULE:/^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,sortables:{},_findRootElement:function(element){while(element.tagName.toUpperCase()!="BODY"){if(element.id&&Sortable.sortables[element.id])return element;element=element.parentNode;}},options:function(element){element=Sortable._findRootElement($(element));if(!element)return;return Sortable.sortables[element.id];},destroy:function(element){var s=Sortable.options(element);if(s){Draggables.removeObserver(s.element);s.droppables.each(function(d){Droppables.remove(d)});s.draggables.invoke('destroy');delete Sortable.sortables[s.element.id];}},create:function(element){element=$(element);var options=Object.extend({element:element,tag:'li',dropOnEmpty:false,tree:false,treeTag:'ul',overlap:'vertical',constraint:'vertical',containment:element,handle:false,only:false,delay:0,hoverclass:null,ghosting:false,quiet:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,format:this.SERIALIZE_RULE,elements:false,handles:false,onChange:Prototype.emptyFunction,onUpdate:Prototype.emptyFunction},arguments[1]||{});this.destroy(element);var options_for_draggable={revert:true,quiet:options.quiet,scroll:options.scroll,scrollSpeed:options.scrollSpeed,scrollSensitivity:options.scrollSensitivity,delay:options.delay,ghosting:options.ghosting,constraint:options.constraint,handle:options.handle};if(options.starteffect)
options_for_draggable.starteffect=options.starteffect;if(options.reverteffect)
options_for_draggable.reverteffect=options.reverteffect;else
if(options.ghosting)options_for_draggable.reverteffect=function(element){element.style.top=0;element.style.left=0;};if(options.endeffect)
options_for_draggable.endeffect=options.endeffect;if(options.zindex)
options_for_draggable.zindex=options.zindex;var options_for_droppable={overlap:options.overlap,containment:options.containment,tree:options.tree,hoverclass:options.hoverclass,onHover:Sortable.onHover}
var options_for_tree={onHover:Sortable.onEmptyHover,overlap:options.overlap,containment:options.containment,hoverclass:options.hoverclass}
Element.cleanWhitespace(element);options.draggables=[];options.droppables=[];if(options.dropOnEmpty||options.tree){Droppables.add(element,options_for_tree);options.droppables.push(element);}
(options.elements||this.findElements(element,options)||[]).each(function(e,i){var handle=options.handles?$(options.handles[i]):(options.handle?$(e).select('.'+options.handle)[0]:e);options.draggables.push(new Draggable(e,Object.extend(options_for_draggable,{handle:handle})));Droppables.add(e,options_for_droppable);if(options.tree)e.treeNode=element;options.droppables.push(e);});if(options.tree){(Sortable.findTreeElements(element,options)||[]).each(function(e){Droppables.add(e,options_for_tree);e.treeNode=element;options.droppables.push(e);});}
this.sortables[element.id]=options;Draggables.addObserver(new SortableObserver(element,options.onUpdate));},findElements:function(element,options){return Element.findChildren(element,options.only,options.tree?true:false,options.tag);},findTreeElements:function(element,options){return Element.findChildren(element,options.only,options.tree?true:false,options.treeTag);},onHover:function(element,dropon,overlap){if(Element.isParent(dropon,element))return;if(overlap>.33&&overlap<.66&&Sortable.options(dropon).tree){return;}else if(overlap>0.5){Sortable.mark(dropon,'before');if(dropon.previousSibling!=element){var oldParentNode=element.parentNode;element.style.visibility="hidden";dropon.parentNode.insertBefore(element,dropon);if(dropon.parentNode!=oldParentNode)
Sortable.options(oldParentNode).onChange(element);Sortable.options(dropon.parentNode).onChange(element);}}else{Sortable.mark(dropon,'after');var nextElement=dropon.nextSibling||null;if(nextElement!=element){var oldParentNode=element.parentNode;element.style.visibility="hidden";dropon.parentNode.insertBefore(element,nextElement);if(dropon.parentNode!=oldParentNode)
Sortable.options(oldParentNode).onChange(element);Sortable.options(dropon.parentNode).onChange(element);}}},onEmptyHover:function(element,dropon,overlap){var oldParentNode=element.parentNode;var droponOptions=Sortable.options(dropon);if(!Element.isParent(dropon,element)){var index;var children=Sortable.findElements(dropon,{tag:droponOptions.tag,only:droponOptions.only});var child=null;if(children){var offset=Element.offsetSize(dropon,droponOptions.overlap)*(1.0-overlap);for(index=0;index<children.length;index+=1){if(offset-Element.offsetSize(children[index],droponOptions.overlap)>=0){offset-=Element.offsetSize(children[index],droponOptions.overlap);}else if(offset-(Element.offsetSize(children[index],droponOptions.overlap)/2)>=0){child=index+1<children.length?children[index+1]:null;break;}else{child=children[index];break;}}}
dropon.insertBefore(element,child);Sortable.options(oldParentNode).onChange(element);droponOptions.onChange(element);}},unmark:function(){if(Sortable._marker)Sortable._marker.hide();},mark:function(dropon,position){var sortable=Sortable.options(dropon.parentNode);if(sortable&&!sortable.ghosting)return;if(!Sortable._marker){Sortable._marker=($('dropmarker')||Element.extend(document.createElement('DIV'))).hide().addClassName('dropmarker').setStyle({position:'absolute'});document.getElementsByTagName("body").item(0).appendChild(Sortable._marker);}
var offsets=Position.cumulativeOffset(dropon);Sortable._marker.setStyle({left:offsets[0]+'px',top:offsets[1]+'px'});if(position=='after')
if(sortable.overlap=='horizontal')
Sortable._marker.setStyle({left:(offsets[0]+dropon.clientWidth)+'px'});else
Sortable._marker.setStyle({top:(offsets[1]+dropon.clientHeight)+'px'});Sortable._marker.show();},_tree:function(element,options,parent){var children=Sortable.findElements(element,options)||[];for(var i=0;i<children.length;++i){var match=children[i].id.match(options.format);if(!match)continue;var child={id:encodeURIComponent(match?match[1]:null),element:element,parent:parent,children:[],position:parent.children.length,container:$(children[i]).down(options.treeTag)}
if(child.container)
this._tree(child.container,options,child)
parent.children.push(child);}
return parent;},tree:function(element){element=$(element);var sortableOptions=this.options(element);var options=Object.extend({tag:sortableOptions.tag,treeTag:sortableOptions.treeTag,only:sortableOptions.only,name:element.id,format:sortableOptions.format},arguments[1]||{});var root={id:null,parent:null,children:[],container:element,position:0}
return Sortable._tree(element,options,root);},_constructIndex:function(node){var index='';do{if(node.id)index='['+node.position+']'+index;}while((node=node.parent)!=null);return index;},sequence:function(element){element=$(element);var options=Object.extend(this.options(element),arguments[1]||{});return $(this.findElements(element,options)||[]).map(function(item){return item.id.match(options.format)?item.id.match(options.format)[1]:'';});},setSequence:function(element,new_sequence){element=$(element);var options=Object.extend(this.options(element),arguments[2]||{});var nodeMap={};this.findElements(element,options).each(function(n){if(n.id.match(options.format))
nodeMap[n.id.match(options.format)[1]]=[n,n.parentNode];n.parentNode.removeChild(n);});new_sequence.each(function(ident){var n=nodeMap[ident];if(n){n[1].appendChild(n[0]);delete nodeMap[ident];}});},serialize:function(element){element=$(element);var options=Object.extend(Sortable.options(element),arguments[1]||{});var name=encodeURIComponent((arguments[1]&&arguments[1].name)?arguments[1].name:element.id);if(options.tree){return Sortable.tree(element,arguments[1]).children.map(function(item){return[name+Sortable._constructIndex(item)+"[id]="+
encodeURIComponent(item.id)].concat(item.children.map(arguments.callee));}).flatten().join('&');}else{return Sortable.sequence(element,arguments[1]).map(function(item){return name+"[]="+encodeURIComponent(item);}).join('&');}}}
Element.isParent=function(child,element){if(!child.parentNode||child==element)return false;if(child.parentNode==element)return true;return Element.isParent(child.parentNode,element);}
Element.findChildren=function(element,only,recursive,tagName){if(!element.hasChildNodes())return null;tagName=tagName.toUpperCase();if(only)only=[only].flatten();var elements=[];$A(element.childNodes).each(function(e){if(e.tagName&&e.tagName.toUpperCase()==tagName&&(!only||(Element.classNames(e).detect(function(v){return only.include(v)}))))
elements.push(e);if(recursive){var grandchildren=Element.findChildren(e,only,recursive,tagName);if(grandchildren)elements.push(grandchildren);}});return(elements.length>0?elements.flatten():[]);}
Element.offsetSize=function(element,type){return element['offset'+((type=='vertical'||type=='height')?'Height':'Width')];}
// (C) 2007-2013 Qualtrics, Inc.

if(typeof Effect=='undefined')
throw("controls.js requires including script.aculo.us' effects.js library");var Autocompleter={}
Autocompleter.Base=Class.create({baseInitialize:function(element,update,options){element=$(element)
this.element=element;this.update=$(update);this.hasFocus=false;this.changed=false;this.active=false;this.index=0;this.entryCount=0;this.oldElementValue=this.element.value;if(this.setOptions)
this.setOptions(options);else
this.options=options||{};this.options.paramName=this.options.paramName||this.element.name;this.options.tokens=this.options.tokens||[];this.options.frequency=this.options.frequency||0.4;this.options.minChars=this.options.minChars||1;this.options.onShow=this.options.onShow||function(element,update){if(!update.style.position||update.style.position=='absolute'){update.style.position='absolute';Position.clone(element,update,{setHeight:false,offsetTop:element.offsetHeight});}
Effect.Appear(update,{duration:0.15});};this.options.onHide=this.options.onHide||function(element,update){new Effect.Fade(update,{duration:0.15})};if(typeof(this.options.tokens)=='string')
this.options.tokens=new Array(this.options.tokens);if(!this.options.tokens.include('\n'))
this.options.tokens.push('\n');this.observer=null;this.element.setAttribute('autocomplete','off');Element.hide(this.update);Event.observe(this.element,'blur',this.onBlur.bindAsEventListener(this));Event.observe(this.element,'keydown',this.onKeyPress.bindAsEventListener(this));},show:function(){if(Element.getStyle(this.update,'display')=='none')this.options.onShow(this.element,this.update);if(!this.iefix&&(Prototype.Browser.IE)&&(Element.getStyle(this.update,'position')=='absolute')){new Insertion.After(this.update,'<iframe id="'+this.update.id+'_iefix" '+'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" '+'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');this.iefix=$(this.update.id+'_iefix');}
if(this.iefix)setTimeout(this.fixIEOverlapping.bind(this),50);},fixIEOverlapping:function(){Position.clone(this.update,this.iefix,{setTop:(!this.update.style.height)});this.iefix.style.zIndex=1;this.update.style.zIndex=2;Element.show(this.iefix);},hide:function(){this.stopIndicator();if(Element.getStyle(this.update,'display')!='none')this.options.onHide(this.element,this.update);if(this.iefix)Element.hide(this.iefix);},startIndicator:function(){if(this.options.indicator)Element.show(this.options.indicator);},stopIndicator:function(){if(this.options.indicator)Element.hide(this.options.indicator);},onKeyPress:function(event){if(this.active)
switch(event.keyCode){case Event.KEY_TAB:case Event.KEY_RETURN:this.selectEntry();Event.stop(event);case Event.KEY_ESC:this.hide();this.active=false;Event.stop(event);return;case Event.KEY_LEFT:case Event.KEY_RIGHT:return;case Event.KEY_UP:this.markPrevious();this.render();Event.stop(event);return;case Event.KEY_DOWN:this.markNext();this.render();Event.stop(event);return;}
else
if(event.keyCode==Event.KEY_TAB||event.keyCode==Event.KEY_RETURN||(Prototype.Browser.WebKit>0&&event.keyCode==0))return;this.changed=true;this.hasFocus=true;if(this.observer)clearTimeout(this.observer);this.observer=setTimeout(this.onObserverEvent.bind(this),this.options.frequency*1000);},activate:function(){this.changed=false;this.hasFocus=true;this.getUpdatedChoices();},onHover:function(event){var element=Event.findElement(event,'LI');if(this.index!=element.autocompleteIndex)
{this.index=element.autocompleteIndex;this.render();}
Event.stop(event);},onClick:function(event){var element=Event.findElement(event,'LI');this.index=element.autocompleteIndex;this.selectEntry();this.hide();},onBlur:function(event){setTimeout(this.hide.bind(this),250);this.hasFocus=false;this.active=false;},render:function(){if(this.entryCount>0){for(var i=0;i<this.entryCount;i++)
this.index==i?Element.addClassName(this.getEntry(i),"selected"):Element.removeClassName(this.getEntry(i),"selected");if(this.hasFocus){this.show();this.active=true;}}else{this.active=false;this.hide();}},markPrevious:function(){if(this.index>0)this.index--
else this.index=this.entryCount-1;this.getEntry(this.index).scrollIntoView(true);},markNext:function(){if(this.index<this.entryCount-1)this.index++
else this.index=0;this.getEntry(this.index).scrollIntoView(false);},getEntry:function(index){return this.update.firstChild.childNodes[index];},getCurrentEntry:function(){return this.getEntry(this.index);},selectEntry:function(){this.active=false;this.updateElement(this.getCurrentEntry());},updateElement:function(selectedElement){if(this.options.updateElement){this.options.updateElement(selectedElement);return;}
var value='';if(this.options.select){var nodes=$(selectedElement).select('.'+this.options.select)||[];if(nodes.length>0)value=Element.collectTextNodes(nodes[0],this.options.select);}else
value=Element.collectTextNodesIgnoreClass(selectedElement,'informal');var bounds=this.getTokenBounds();if(bounds[0]!=-1){var newValue=this.element.value.substr(0,bounds[0]);var whitespace=this.element.value.substr(bounds[0]).match(/^\s+/);if(whitespace)
newValue+=whitespace[0];this.element.value=newValue+value+this.element.value.substr(bounds[1]);}else{this.element.value=value;}
this.oldElementValue=this.element.value;this.element.focus();if(this.options.afterUpdateElement)
this.options.afterUpdateElement(this.element,selectedElement);},updateChoices:function(choices){if(!this.changed&&this.hasFocus){this.update.innerHTML=choices;Element.cleanWhitespace(this.update);Element.cleanWhitespace(this.update.down());if(this.update.firstChild&&this.update.down().childNodes){this.entryCount=this.update.down().childNodes.length;for(var i=0;i<this.entryCount;i++){var entry=this.getEntry(i);entry.autocompleteIndex=i;this.addObservers(entry);}}else{this.entryCount=0;}
this.stopIndicator();this.index=0;if(this.entryCount==1&&this.options.autoSelect){this.selectEntry();this.hide();}else{this.render();}}},addObservers:function(element){Event.observe(element,"mouseover",this.onHover.bindAsEventListener(this));Event.observe(element,"click",this.onClick.bindAsEventListener(this));},onObserverEvent:function(){this.changed=false;this.tokenBounds=null;if(this.getToken().length>=this.options.minChars){this.getUpdatedChoices();}else{this.active=false;this.hide();}
this.oldElementValue=this.element.value;},getToken:function(){var bounds=this.getTokenBounds();return this.element.value.substring(bounds[0],bounds[1]).strip();},getTokenBounds:function(){if(null!=this.tokenBounds)return this.tokenBounds;var value=this.element.value;if(value.strip().empty())return[-1,0];var diff=arguments.callee.getFirstDifferencePos(value,this.oldElementValue);var offset=(diff==this.oldElementValue.length?1:0);var prevTokenPos=-1,nextTokenPos=value.length;var tp;for(var index=0,l=this.options.tokens.length;index<l;++index){tp=value.lastIndexOf(this.options.tokens[index],diff+offset-1);if(tp>prevTokenPos)prevTokenPos=tp;tp=value.indexOf(this.options.tokens[index],diff+offset);if(-1!=tp&&tp<nextTokenPos)nextTokenPos=tp;}
return(this.tokenBounds=[prevTokenPos+1,nextTokenPos]);}});Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos=function(newS,oldS){var boundary=Math.min(newS.length,oldS.length);for(var index=0;index<boundary;++index)
if(newS[index]!=oldS[index])
return index;return boundary;};Ajax.Autocompleter=Class.create(Autocompleter.Base,{initialize:function(element,update,url,options){this.baseInitialize(element,update,options);this.options.asynchronous=true;this.options.onComplete=this.onComplete.bind(this);this.options.defaultParams=this.options.parameters||null;this.url=url;},getUpdatedChoices:function(){this.startIndicator();var entry=encodeURIComponent(this.options.paramName)+'='+
encodeURIComponent(this.getToken());this.options.parameters=this.options.callback?this.options.callback(this.element,entry):entry;if(this.options.defaultParams)
this.options.parameters+='&'+this.options.defaultParams;new Ajax.Request(this.url,this.options);},onComplete:function(request){this.updateChoices(request.responseText);}});Autocompleter.Local=Class.create(Autocompleter.Base,{initialize:function(element,update,array,options){this.baseInitialize(element,update,options);this.options.array=array;},getUpdatedChoices:function(){this.updateChoices(this.options.selector(this));},setOptions:function(options){this.options=Object.extend({choices:10,partialSearch:true,partialChars:2,ignoreCase:true,fullSearch:false,selector:function(instance){var ret=[];var partial=[];var entry=instance.getToken();var count=0;for(var i=0;i<instance.options.array.length&&ret.length<instance.options.choices;i++){var elem=instance.options.array[i];var foundPos=instance.options.ignoreCase?elem.toLowerCase().indexOf(entry.toLowerCase()):elem.indexOf(entry);while(foundPos!=-1){if(foundPos==0&&elem.length!=entry.length){ret.push("<li><strong>"+elem.substr(0,entry.length)+"</strong>"+
elem.substr(entry.length)+"</li>");break;}else if(entry.length>=instance.options.partialChars&&instance.options.partialSearch&&foundPos!=-1){if(instance.options.fullSearch||/\s/.test(elem.substr(foundPos-1,1))){partial.push("<li>"+elem.substr(0,foundPos)+"<strong>"+
elem.substr(foundPos,entry.length)+"</strong>"+elem.substr(foundPos+entry.length)+"</li>");break;}}
foundPos=instance.options.ignoreCase?elem.toLowerCase().indexOf(entry.toLowerCase(),foundPos+1):elem.indexOf(entry,foundPos+1);}}
if(partial.length)
ret=ret.concat(partial.slice(0,instance.options.choices-ret.length))
return"<ul>"+ret.join('')+"</ul>";}},options||{});}});Field.scrollFreeActivate=function(field){setTimeout(function(){Field.activate(field);},1);}
Ajax.InPlaceEditor=Class.create({initialize:function(element,url,options){this.url=url;this.element=element=$(element);this.prepareOptions();this._controls={};arguments.callee.dealWithDeprecatedOptions(options);Object.extend(this.options,options||{});if(!this.options.formId&&this.element.id){this.options.formId=this.element.id+'-inplaceeditor';if($(this.options.formId))
this.options.formId='';}
if(this.options.externalControl)
this.options.externalControl=$(this.options.externalControl);if(!this.options.externalControl)
this.options.externalControlOnly=false;this._originalBackground=this.element.getStyle('background-color')||'transparent';this.element.title=this.options.clickToEditText;this._boundCancelHandler=this.handleFormCancellation.bind(this);this._boundComplete=(this.options.onComplete||Prototype.emptyFunction).bind(this);this._boundFailureHandler=this.handleAJAXFailure.bind(this);this._boundSubmitHandler=this.handleFormSubmission.bind(this);this._boundWrapperHandler=this.wrapUp.bind(this);this.registerListeners();},checkForEscapeOrReturn:function(e){if(!this._editing||e.ctrlKey||e.altKey||e.shiftKey)return;if(Event.KEY_ESC==e.keyCode)
this.handleFormCancellation(e);else if(Event.KEY_RETURN==e.keyCode)
this.handleFormSubmission(e);},createControl:function(mode,handler,extraClasses){var control=this.options[mode+'Control'];var text=this.options[mode+'Text'];if('button'==control){var btn=document.createElement('input');btn.type='submit';btn.value=text;btn.className='editor_'+mode+'_button';if('cancel'==mode)
btn.onclick=this._boundCancelHandler;this._form.appendChild(btn);this._controls[mode]=btn;}else if('link'==control){var link=document.createElement('a');link.href='#';link.appendChild(document.createTextNode(text));link.onclick='cancel'==mode?this._boundCancelHandler:this._boundSubmitHandler;link.className='editor_'+mode+'_link';if(extraClasses)
link.className+=' '+extraClasses;this._form.appendChild(link);this._controls[mode]=link;}},createEditField:function(){var text=(this.options.loadTextURL?this.options.loadingText:this.getText());var fld;if(1>=this.options.rows&&!/\r|\n/.test(this.getText())){fld=document.createElement('input');fld.type='text';var size=this.options.size||this.options.cols||0;if(0<size)fld.size=size;}else{fld=document.createElement('textarea');fld.rows=(1>=this.options.rows?this.options.autoRows:this.options.rows);fld.cols=this.options.cols||40;}
fld.name=this.options.paramName;fld.value=text;fld.className='editor_field';if(this.options.submitOnBlur)
fld.onblur=this._boundSubmitHandler;this._controls.editor=fld;if(this.options.loadTextURL)
this.loadExternalText();this._form.appendChild(this._controls.editor);},createForm:function(){var ipe=this;function addText(mode,condition){var text=ipe.options['text'+mode+'Controls'];if(!text||condition===false)return;ipe._form.appendChild(document.createTextNode(text));};this._form=$(document.createElement('form'));this._form.id=this.options.formId;this._form.addClassName(this.options.formClassName);this._form.onsubmit=this._boundSubmitHandler;this.createEditField();if('textarea'==this._controls.editor.tagName.toLowerCase())
this._form.appendChild(document.createElement('br'));if(this.options.onFormCustomization)
this.options.onFormCustomization(this,this._form);addText('Before',this.options.okControl||this.options.cancelControl);this.createControl('ok',this._boundSubmitHandler);addText('Between',this.options.okControl&&this.options.cancelControl);this.createControl('cancel',this._boundCancelHandler,'editor_cancel');addText('After',this.options.okControl||this.options.cancelControl);},destroy:function(){if(this._oldInnerHTML)
this.element.innerHTML=this._oldInnerHTML;this.leaveEditMode();this.unregisterListeners();},enterEditMode:function(e){if(this._saving||this._editing)return;this._editing=true;this.triggerCallback('onEnterEditMode');if(this.options.externalControl)
this.options.externalControl.hide();this.element.hide();this.createForm();this.element.parentNode.insertBefore(this._form,this.element);if(!this.options.loadTextURL)
this.postProcessEditField();if(e)Event.stop(e);},enterHover:function(e){if(this.options.hoverClassName)
this.element.addClassName(this.options.hoverClassName);if(this._saving)return;this.triggerCallback('onEnterHover');},getText:function(){return this.element.innerHTML;},handleAJAXFailure:function(transport){this.triggerCallback('onFailure',transport);if(this._oldInnerHTML){this.element.innerHTML=this._oldInnerHTML;this._oldInnerHTML=null;}},handleFormCancellation:function(e){this.wrapUp();if(e)Event.stop(e);},handleFormSubmission:function(e){var form=this._form;var value=$F(this._controls.editor);this.prepareSubmission();var params=this.options.callback(form,value)||'';if(Object.isString(params))
params=params.toQueryParams();params.editorId=this.element.id;if(this.options.htmlResponse){var options=Object.extend({evalScripts:true},this.options.ajaxOptions);Object.extend(options,{parameters:params,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});new Ajax.Updater({success:this.element},this.url,options);}else{var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:params,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});new Ajax.Request(this.url,options);}
if(e)Event.stop(e);},leaveEditMode:function(){this.element.removeClassName(this.options.savingClassName);this.removeForm();this.leaveHover();this.element.style.backgroundColor=this._originalBackground;this.element.show();if(this.options.externalControl)
this.options.externalControl.show();this._saving=false;this._editing=false;this._oldInnerHTML=null;this.triggerCallback('onLeaveEditMode');},leaveHover:function(e){if(this.options.hoverClassName)
this.element.removeClassName(this.options.hoverClassName);if(this._saving)return;this.triggerCallback('onLeaveHover');},loadExternalText:function(){this._form.addClassName(this.options.loadingClassName);this._controls.editor.disabled=true;var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){this._form.removeClassName(this.options.loadingClassName);var text=transport.responseText;if(this.options.stripLoadedTextTags)
text=text.stripTags();this._controls.editor.value=text;this._controls.editor.disabled=false;this.postProcessEditField();}.bind(this),onFailure:this._boundFailureHandler});new Ajax.Request(this.options.loadTextURL,options);},postProcessEditField:function(){var fpc=this.options.fieldPostCreation;if(fpc)
$(this._controls.editor)['focus'==fpc?'focus':'activate']();},prepareOptions:function(){this.options=Object.clone(Ajax.InPlaceEditor.DefaultOptions);Object.extend(this.options,Ajax.InPlaceEditor.DefaultCallbacks);[this._extraDefaultOptions].flatten().compact().each(function(defs){Object.extend(this.options,defs);}.bind(this));},prepareSubmission:function(){this._saving=true;this.removeForm();this.leaveHover();this.showSaving();},registerListeners:function(){this._listeners={};var listener;$H(Ajax.InPlaceEditor.Listeners).each(function(pair){listener=this[pair.value].bind(this);this._listeners[pair.key]=listener;if(!this.options.externalControlOnly)
this.element.observe(pair.key,listener);if(this.options.externalControl)
this.options.externalControl.observe(pair.key,listener);}.bind(this));},removeForm:function(){if(!this._form)return;this._form.remove();this._form=null;this._controls={};},showSaving:function(){this._oldInnerHTML=this.element.innerHTML;this.element.innerHTML=this.options.savingText;this.element.addClassName(this.options.savingClassName);this.element.style.backgroundColor=this._originalBackground;this.element.show();},triggerCallback:function(cbName,arg){if('function'==typeof this.options[cbName]){this.options[cbName](this,arg);}},unregisterListeners:function(){$H(this._listeners).each(function(pair){if(!this.options.externalControlOnly)
this.element.stopObserving(pair.key,pair.value);if(this.options.externalControl)
this.options.externalControl.stopObserving(pair.key,pair.value);}.bind(this));},wrapUp:function(transport){this.leaveEditMode();this._boundComplete(transport,this.element);}});Object.extend(Ajax.InPlaceEditor.prototype,{dispose:Ajax.InPlaceEditor.prototype.destroy});Ajax.InPlaceCollectionEditor=Class.create(Ajax.InPlaceEditor,{initialize:function($super,element,url,options){this._extraDefaultOptions=Ajax.InPlaceCollectionEditor.DefaultOptions;$super(element,url,options);},createEditField:function(){var list=document.createElement('select');list.name=this.options.paramName;list.size=1;this._controls.editor=list;this._collection=this.options.collection||[];if(this.options.loadCollectionURL)
this.loadCollection();else
this.checkForExternalText();this._form.appendChild(this._controls.editor);},loadCollection:function(){this._form.addClassName(this.options.loadingClassName);this.showLoadingText(this.options.loadingCollectionText);var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){var js=transport.responseText.strip();if(!/^\[.*\]$/.test(js))
throw'Server returned an invalid collection representation.';this._collection=eval(js);this.checkForExternalText();}.bind(this),onFailure:this.onFailure});new Ajax.Request(this.options.loadCollectionURL,options);},showLoadingText:function(text){this._controls.editor.disabled=true;var tempOption=this._controls.editor.firstChild;if(!tempOption){tempOption=document.createElement('option');tempOption.value='';this._controls.editor.appendChild(tempOption);tempOption.selected=true;}
tempOption.update((text||'').stripScripts().stripTags());},checkForExternalText:function(){this._text=this.getText();if(this.options.loadTextURL)
this.loadExternalText();else
this.buildOptionList();},loadExternalText:function(){this.showLoadingText(this.options.loadingText);var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){this._text=transport.responseText.strip();this.buildOptionList();}.bind(this),onFailure:this.onFailure});new Ajax.Request(this.options.loadTextURL,options);},buildOptionList:function(){this._form.removeClassName(this.options.loadingClassName);this._collection=this._collection.map(function(entry){return 2===entry.length?entry:[entry,entry].flatten();});var marker=('value'in this.options)?this.options.value:this._text;var textFound=this._collection.any(function(entry){return entry[0]==marker;}.bind(this));this._controls.editor.update('');var option;this._collection.each(function(entry,index){option=document.createElement('option');option.value=entry[0];option.selected=textFound?entry[0]==marker:0==index;option.appendChild(document.createTextNode(entry[1]));this._controls.editor.appendChild(option);}.bind(this));this._controls.editor.disabled=false;Field.scrollFreeActivate(this._controls.editor);}});Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions=function(options){if(!options)return;function fallback(name,expr){if(name in options||expr===undefined)return;options[name]=expr;};fallback('cancelControl',(options.cancelLink?'link':(options.cancelButton?'button':options.cancelLink==options.cancelButton==false?false:undefined)));fallback('okControl',(options.okLink?'link':(options.okButton?'button':options.okLink==options.okButton==false?false:undefined)));fallback('highlightColor',options.highlightcolor);fallback('highlightEndColor',options.highlightendcolor);};Object.extend(Ajax.InPlaceEditor,{DefaultOptions:{ajaxOptions:{},autoRows:3,cancelControl:'link',cancelText:'cancel',clickToEditText:'Click to edit',externalControl:null,externalControlOnly:false,fieldPostCreation:'activate',formClassName:'inplaceeditor-form',formId:null,highlightColor:'#ffff99',highlightEndColor:'#ffffff',hoverClassName:'',htmlResponse:true,loadingClassName:'inplaceeditor-loading',loadingText:'Loading...',okControl:'button',okText:'ok',paramName:'value',rows:1,savingClassName:'inplaceeditor-saving',savingText:'Saving...',size:0,stripLoadedTextTags:false,submitOnBlur:false,textAfterControls:'',textBeforeControls:'',textBetweenControls:''},DefaultCallbacks:{callback:function(form){return Form.serialize(form);},onComplete:function(transport,element){new Effect.Highlight(element,{startcolor:this.options.highlightColor,keepBackgroundImage:true});},onEnterEditMode:null,onEnterHover:function(ipe){ipe.element.style.backgroundColor=ipe.options.highlightColor;if(ipe._effect)
ipe._effect.cancel();},onFailure:function(transport,ipe){alert('Error communication with the server: '+transport.responseText.stripTags());},onFormCustomization:null,onLeaveEditMode:null,onLeaveHover:function(ipe){ipe._effect=new Effect.Highlight(ipe.element,{startcolor:ipe.options.highlightColor,endcolor:ipe.options.highlightEndColor,restorecolor:ipe._originalBackground,keepBackgroundImage:true});}},Listeners:{click:'enterEditMode',keydown:'checkForEscapeOrReturn',mouseover:'enterHover',mouseout:'leaveHover'}});Ajax.InPlaceCollectionEditor.DefaultOptions={loadingCollectionText:'Loading options...'};Form.Element.DelayedObserver=Class.create({initialize:function(element,delay,callback){this.delay=delay||0.5;this.element=$(element);this.callback=callback;this.timer=null;this.lastValue=$F(this.element);Event.observe(this.element,'keyup',this.delayedListener.bindAsEventListener(this));},delayedListener:function(event){if(this.lastValue==$F(this.element))return;if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(this.onTimerEvent.bind(this),this.delay*1000);this.lastValue=$F(this.element);},onTimerEvent:function(){this.timer=null;this.callback(this.element,$F(this.element));}});
// (C) 2007-2013 Qualtrics, Inc.

if(!Control)var Control={};Control.Slider=Class.create({initialize:function(handle,track,options){var slider=this;if(Object.isArray(handle)){this.handles=handle.collect(function(e){return $(e)});}else{this.handles=[$(handle)];}
this.track=$(track);this.options=options||{};this.axis=this.options.axis||'horizontal';this.increment=this.options.increment||1;this.step=parseInt(this.options.step||'1');this.range=this.options.range||$R(0,1);this.value=0;this.values=this.handles.map(function(){return 0});this.spans=this.options.spans?this.options.spans.map(function(s){return $(s)}):false;this.options.startSpan=$(this.options.startSpan||null);this.options.endSpan=$(this.options.endSpan||null);this.restricted=this.options.restricted||false;this.maximum=this.options.maximum||this.range.end;this.minimum=this.options.minimum||this.range.start;this.alignX=parseInt(this.options.alignX||'0');this.alignY=parseInt(this.options.alignY||'0');this.trackLength=this.maximumOffset()-this.minimumOffset();this.handleLength=this.isVertical()?(this.handles[0].offsetHeight!=0?this.handles[0].offsetHeight:this.handles[0].style.height.replace(/px$/,"")):(this.handles[0].offsetWidth!=0?this.handles[0].offsetWidth:this.handles[0].style.width.replace(/px$/,""));this.active=false;this.dragging=false;this.disabled=false;if(this.options.disabled)this.setDisabled();this.allowedValues=this.options.values?this.options.values.sortBy(Prototype.K):false;if(this.allowedValues){this.minimum=this.allowedValues.min();this.maximum=this.allowedValues.max();}
this.eventMouseDown=this.startDrag.bindAsEventListener(this);this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.update.bindAsEventListener(this);this.handles.each(function(h,i){i=slider.handles.length-1-i;slider.setValue(parseFloat((Object.isArray(slider.options.sliderValue)?slider.options.sliderValue[i]:slider.options.sliderValue)||slider.range.start),i);h.makePositioned().observe("mousedown",slider.eventMouseDown);});this.track.observe("mousedown",this.eventMouseDown);document.observe("mouseup",this.eventMouseUp);document.observe("mousemove",this.eventMouseMove);this.initialized=true;},dispose:function(){var slider=this;Event.stopObserving(this.track,"mousedown",this.eventMouseDown);Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);this.handles.each(function(h){Event.stopObserving(h,"mousedown",slider.eventMouseDown);});},setDisabled:function(){this.disabled=true;},setEnabled:function(){this.disabled=false;},getNearestValue:function(value){if(this.allowedValues){if(value>=this.allowedValues.max())return(this.allowedValues.max());if(value<=this.allowedValues.min())return(this.allowedValues.min());var offset=Math.abs(this.allowedValues[0]-value);var newValue=this.allowedValues[0];this.allowedValues.each(function(v){var currentOffset=Math.abs(v-value);if(currentOffset<=offset){newValue=v;offset=currentOffset;}});return newValue;}
if(value>this.range.end)return this.range.end;if(value<this.range.start)return this.range.start;return value;},setValue:function(sliderValue,handleIdx){if(!this.active){this.activeHandleIdx=handleIdx||0;this.activeHandle=this.handles[this.activeHandleIdx];this.updateStyles();}
handleIdx=handleIdx||this.activeHandleIdx||0;if(this.initialized&&this.restricted){if((handleIdx>0)&&(sliderValue<this.values[handleIdx-1]))
sliderValue=this.values[handleIdx-1];if((handleIdx<(this.handles.length-1))&&(sliderValue>this.values[handleIdx+1]))
sliderValue=this.values[handleIdx+1];}
sliderValue=this.getNearestValue(sliderValue);this.values[handleIdx]=sliderValue;this.value=this.values[0];this.handles[handleIdx].style[this.isVertical()?'top':'left']=this.translateToPx(sliderValue);this.drawSpans();if(!this.dragging||!this.event)this.updateFinished();},setValueBy:function(delta,handleIdx){this.setValue(this.values[handleIdx||this.activeHandleIdx||0]+delta,handleIdx||this.activeHandleIdx||0);},translateToPx:function(value){return Math.round(((this.trackLength-this.handleLength)/(this.range.end-this.range.start))*(value-this.range.start))+"px";},translateToValue:function(offset){return((offset/(this.trackLength-this.handleLength)*(this.range.end-this.range.start))+this.range.start);},getRange:function(range){var v=this.values.sortBy(Prototype.K);range=range||0;return $R(v[range],v[range+1]);},minimumOffset:function(){return(this.isVertical()?this.alignY:this.alignX);},maximumOffset:function(){return(this.isVertical()?(this.track.offsetHeight!=0?this.track.offsetHeight:this.track.style.height.replace(/px$/,""))-this.alignY:(this.track.offsetWidth!=0?this.track.offsetWidth:this.track.style.width.replace(/px$/,""))-this.alignX);},isVertical:function(){return(this.axis=='vertical');},drawSpans:function(){var slider=this;if(this.spans)
$R(0,this.spans.length-1).each(function(r){slider.setSpan(slider.spans[r],slider.getRange(r))});if(this.options.startSpan)
this.setSpan(this.options.startSpan,$R(0,this.values.length>1?this.getRange(0).min():this.value));if(this.options.endSpan)
this.setSpan(this.options.endSpan,$R(this.values.length>1?this.getRange(this.spans.length-1).max():this.value,this.maximum));},setSpan:function(span,range){if(this.isVertical()){span.style.top=this.translateToPx(range.start);span.style.height=this.translateToPx(range.end-range.start+this.range.start);}else{span.style.left=this.translateToPx(range.start);span.style.width=this.translateToPx(range.end-range.start+this.range.start);}},updateStyles:function(){this.handles.each(function(h){Element.removeClassName(h,'selected')});Element.addClassName(this.activeHandle,'selected');},startDrag:function(event){if(Event.isLeftClick(event)){if(!this.disabled){this.active=true;var handle=Event.element(event);var pointer=[Event.pointerX(event),Event.pointerY(event)];var track=handle;if(track==this.track){var offsets=this.track.cumulativeOffset();this.event=event;this.setValue(this.translateToValue((this.isVertical()?pointer[1]-offsets[1]:pointer[0]-offsets[0])-(this.handleLength/2)));var offsets=this.activeHandle.cumulativeOffset();this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}else{while((this.handles.indexOf(handle)==-1)&&handle.parentNode)
handle=handle.parentNode;if(this.handles.indexOf(handle)!=-1){this.activeHandle=handle;this.activeHandleIdx=this.handles.indexOf(this.activeHandle);this.updateStyles();var offsets=this.activeHandle.cumulativeOffset();this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}}}
Event.stop(event);}},update:function(event){if(this.active){if(!this.dragging)this.dragging=true;this.draw(event);if(Prototype.Browser.WebKit)window.scrollBy(0,0);Event.stop(event);}},draw:function(event){var pointer=[Event.pointerX(event),Event.pointerY(event)];var offsets=this.track.cumulativeOffset();pointer[0]-=this.offsetX+offsets[0];pointer[1]-=this.offsetY+offsets[1];this.event=event;this.setValue(this.translateToValue(this.isVertical()?pointer[1]:pointer[0]));if(this.initialized&&this.options.onSlide)
this.options.onSlide(this.values.length>1?this.values:this.value,this);},endDrag:function(event){if(this.active&&this.dragging){this.finishDrag(event,true);Event.stop(event);}
this.active=false;this.dragging=false;},finishDrag:function(event,success){this.active=false;this.dragging=false;this.updateFinished();},updateFinished:function(){if(this.initialized&&this.options.onChange)
this.options.onChange(this.values.length>1?this.values:this.value,this);this.event=null;}});
// (C) 2007-2013 Qualtrics, Inc.

function QBuilder(nodeName,options,children)
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<9&&(nodeName=='input'||nodeName=='textarea')||nodeName=='select')
{return QInputBuilder(nodeName,options,children);}
var el=document.createElement(nodeName);if(!children&&typeof options!='object')
{children=options;}
else
{for(var nom in options)
{if(nom=='className')
{el.className=options.className;}
else if(nom=='id')
{el.id=options.id;}
else if(nom=='name')
{el.name=options.name;}
else if(nom.substring(0,2)=='on')
{el[nom]=Function(options[nom]);}
else if(nom=='checked')
{if(options[nom])
{el.defaultChecked=true;el.setAttribute('checked','checked');}}
else if(nom=='htmlFor')
{el.htmlFor=options[nom];el.setAttribute('for',options[nom]);}
else if(nom=='style')
{$(el).setStyle(options[nom]);}
else if(typeof options[nom]!='undefined')
{el.setAttribute(nom,options[nom]);}}}
if(children)
{if(typeof children==='object')
{if(children.length)
{for(var i=0,len=children.length;i<len;++i)
{var ch=children[i];if(ch===undefined)
{ch='undefined';}
if((typeof ch=='string'||typeof ch=='number')&&ch!='')
{el.appendChild(document.createTextNode(ch));}
else if(ch)
{if(ch.nodeType)
{el.appendChild(ch);}
else
{el.appendChild(document.createTextNode(String(ch)));}}
else
{}}}}
else
{var node;if(typeof children=='string'||typeof children=='number')
{node=document.createTextNode(children);}
else
{node=children;}
el.appendChild(node);}}
return el;}
function QInputBuilder(nodeName,options,children)
{var attr='';for(var nom in options)
{var val=options[nom];var key='';switch(nom)
{case'className':key='class';break;case'id':key='id';break;case'checked':if(options[nom])
{key='checked';}
break;case'htmlFor':key='for'
break;default:key=nom;}
attr+=key+'="'+val+'" ';}
var parent=QBuilder('div');parent.innerHTML='<'+nodeName+' '+attr+' />';var el=parent.firstChild.cloneNode(true);removeElement(parent);if(children)
{var type=typeof children;if(type==='object')
{for(var i=0,len=children.length;i<len;++i)
{var ch=children[i];var node;if(typeof ch=='string'||typeof ch=='number')
{node=document.createTextNode(ch);}
else
{node=ch;}
if(node)
{el.appendChild(node);}}}
else if(type=='string'||type=='number')
{el.appendChild(document.createTextNode(children));}}
return el;}
function QEntity(str,mode){str=(str)?str:"";mode=(mode)?mode:"string";var e=document.createElement("div");e.innerHTML=str;if(mode=="numeric"){return"&#"+e.innerHTML.charCodeAt(0)+";";}
else if(mode=="utf16"){var un=e.innerHTML.charCodeAt(0).toString(16);while(un.length<4)un="0"+un;return"\\u"+un;}
else return e.innerHTML;}
// (C) 2007-2013 Qualtrics, Inc.

function makeSortable(listIds){if(listIds.constructor!=Array){var listIds=[listIds];}
for(var i=0;i<listIds.length;i++){var listId=listIds[i];Sortable.create(listId,{dropOnEmpty:true,containment:listIds,constraint:false,scroll:window,onChange:function(o){rankOrderAll(listIds,o);updateInputValues(listIds);},onUpdate:function(o){updateInputValues(listIds);adjustCSS(listIds);}});if('ontouchstart'in document.documentElement)
{var ul=$(listId);var sortable=Sortable.sortables[listId];for(var x=0,len=sortable.draggables.length;x<len;++x)
{var draggable=sortable.draggables[x];var li=draggable.element;Event.observe(li,'touchstart',draggable.eventMouseDown);Event.observe(document,'touchend',Draggables.eventMouseUp);Event.observe(document,'touchmove',Draggables.eventMouseMove);}}}}
function updateInputValues(listIds){if(listIds.constructor!=Array){var listIds=[listIds];}
for(var i=0;i<listIds.length;i++){var listId=listIds[i];var rank="";var choice="";var choiceId="";list=$(listId);var groupId=list.getAttribute('rel');for(var j=0;j<list.childNodes.length;j++){var choiceItem=list.childNodes[j];if(choiceItem.nodeName!='LI')
continue;choiceId=choiceItem.id;for(var ranki=0;ranki<choiceItem.childNodes.length;ranki++){if(choiceItem.childNodes[ranki].className=="rank"){rank=(choiceItem.childNodes[ranki].innerHTML);}}
for(var ranki=0;ranki<choiceItem.childNodes.length;ranki++){if(choiceItem.childNodes[ranki].className=="choice"){choice=(choiceItem.childNodes[ranki].innerHTML);}}
if($(choiceId+"~Group")){if(listId.indexOf('items')==-1){if(list.getAttribute("maxChoices"))
{if(list.childNodes.length>list.getAttribute("maxChoices"))
{list.previous(1).addClassName("ValidationError");list.previous().innerHTML=maxChoicesMsg;list.previous().addClassName("ValidationError");}
else
{list.previous(1).removeClassName("ValidationError");list.previous().innerHTML="";list.previous().removeClassName("ValidationError");}}
$(choiceId+"~Group").value=groupId;$(choiceId+"~Rank").value=rank;}else{$(choiceId+"~Group").value="";$(choiceId+"~Rank").value="";}}else if($(choiceId+"~Rank")){$(choiceId+"~Rank").value=rank;}else{console.error("Error! there is no input: "+listId+"~Rank");}}}}
function rankOrderAll(listIds,itemBeingDragged){for(var i=0;i<listIds.length;i++){var listId=listIds[i];list=$(listId);if(!list.edited)
{$(list).removeClassName('NotEdited');$(list).addClassName('Edited');list.edited=true;}
rankOrder(list,itemBeingDragged);}}
function rankOrder(list,itemBeingDragged){var rank=0;var stacked=false;if($(list).getAttribute('stacked'))
{stacked=true;var progressCounterID=list.getAttribute('progressCounter');var itemCount=list.getAttribute('itemCount');if($(progressCounterID))
{$(progressCounterID).innerHTML=list.childNodes.length+' / '+itemCount;}}
for(var i=0;i<list.childNodes.length;i++)
{var listItem=list.childNodes[i];if(!listItem||listItem.nodeName!='LI')
{continue;}
if(stacked)
{if($(listItem).getAttribute('id')==$(itemBeingDragged).getAttribute('id'))
{}
var stackedClasses='';if($(listItem).hasClassName('last'))
{stackedClasses+=' last';}
if($(listItem).hasClassName('penultimate'))
{stackedClasses+=' penultimate';}
if($(listItem).hasClassName('antepenultimate'))
{stackedClasses+=' antepenultimate';}}
rank++;if(i%2==0)
{listItem.className="BorderColor "+list.getAttribute('regularClass');}
else
{listItem.className="BorderColor "+list.getAttribute('altClass');}
if(stacked)
{listItem.className+=' stack';}
if(stacked)
{listItem.className+=stackedClasses;if($(listItem).getAttribute('id')==$(itemBeingDragged).getAttribute('id'))
{}
if($(listItem).getAttribute('id')!=$(itemBeingDragged).getAttribute('id'))
{}}
var listItemContents=(list.childNodes[i].childNodes);for(var j=0;j<listItemContents.length;j++){if(listItemContents[j].className=="rank"){listItemContents[j].innerHTML=rank;}}}}
function adjustCSS(listIds)
{for(var i=0;i<listIds.length;i++)
{var listId=listIds[i];list=$(listId);adjustListCSS(list);}}
function adjustListCSS(list){var rank=0;if($(list).getAttribute('stacked'))
{for(var i=0;i<list.childNodes.length;i++){var listItem=list.childNodes[i];if(!listItem||listItem.nodeName!='LI')
continue;rank++;$(listItem).removeClassName('antepenultimate');$(listItem).removeClassName('penultimate');if(list.childNodes.length>2)
{if(i==(list.childNodes.length-2))
{$(listItem).addClassName('penultimate');}
else if(i==(list.childNodes.length-3))
{$(listItem).addClassName('antepenultimate');}}
else if(list.childNodes.length==2)
{if(i==(list.childNodes.length-1))
{$(listItem).addClassName('penultimate');}
else if(i==(list.childNodes.length-2))
{$(listItem).addClassName('antepenultimate');}}
else if(list.childNodes.length==1)
{$(listItem).addClassName('antepenultimate');}}}}
// (C) 2007-2013 Qualtrics, Inc.

if(window.Effect)
{Effect.Scroll=Class.create();Object.extend(Object.extend(Effect.Scroll.prototype,Effect.Base.prototype),{initialize:function(element){this.element=$(element);var options=Object.extend({x:0,y:0,mode:'absolute'},arguments[1]||{});this.start(options);},setup:function(){if(this.options.continuous&&!this.element._ext){this.element.cleanWhitespace();this.element._ext=true;this.element.appendChild(this.element.firstChild);}
this.originalLeft=this.element.scrollLeft;this.originalTop=this.element.scrollTop;if(this.options.mode=='absolute'){this.options.x-=this.originalLeft;this.options.y-=this.originalTop;}else{}},update:function(position){if(this.element.offsetWidth)
{this.element.scrollLeft=this.options.x*position+this.originalLeft;this.element.scrollTop=this.options.y*position+this.originalTop;}}});Effect.ScrollContainerTo=Class.create();Object.extend(Object.extend(Effect.ScrollContainerTo.prototype,Effect.Scroll.prototype),{initialize:function(element,toElement){this.element=$(element);Position.prepare();if(!toElement.parentNode||!element.parentNode)
{return;}
var element_y=Position.cumulativeOffset($(element))[1];var toElement_y=Position.cumulativeOffset($(toElement))[1];var y=toElement_y-element_y;var offset=0;var options=arguments[2];if(options&&options.offset)
{offset=options.offset;}
options=Object.extend({x:0,y:y+offset,mode:'absolute'},options||{});this.start(options);}});Effect.ScrollToY=Class.create();Object.extend(Object.extend(Effect.ScrollToY.prototype,Effect.Base.prototype),{initialize:function(y){this.y=y;this.start(arguments[1]||{});},setup:function(){Position.prepare();var offsets=[0,this.y];var max=window.innerHeight?window.height-window.innerHeight:document.body.scrollHeight-
(document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight);this.scrollStart=Position.deltaY;this.delta=(offsets[1]>max?max:offsets[1])-this.scrollStart;if(!this.delta)
{this.cancel();}},update:function(position){Position.prepare();window.scrollTo(Position.deltaX,this.scrollStart+(position*this.delta));}});Effect.OverlayHighlight=function(element,options){var overlayOptions=Object.extend({color:'#ffff99'},arguments[1]||{});element=QualtricsCPTools.Highlighter.autoHighlight(element,overlayOptions).element;var oldOpacity=Element.getInlineOpacity(element);options=Object.extend({from:element.getOpacity()||1.0,to:0.0,afterFinishInternal:function(effect){if(effect.options.to!=0)return;effect.element.hide().setStyle({opacity:oldOpacity});}},arguments[1]||{});return new Effect.Opacity(element,options);}}
Draggable.prototype.updateDrag=function(event,pointer){if(!this.dragging)this.startDrag(event);var fixedOffset=[0,0];if(this.options.fixedPosition)
{fixedOffset=[getScrollInfo()[0],getScrollInfo()[1]]}
if(!this.options.quiet){Position.prepare();var point=pointer;point[0]-=fixedOffset[0];point[1]-=fixedOffset[1];Droppables.show(point,this.element);}
pointer[0]+=fixedOffset[0];pointer[1]+=fixedOffset[1];if(this.options.scroll)
{}
Draggables.notify('onDrag',this,event);this.draw(pointer);if(this.options.change)this.options.change(this);if(this.options.scroll){this.stopScrolling();var p;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){p=[left,top,left+width,top+height];}}else{p=Position.page(this.options.scroll).toArray();p[0]+=fixedOffset[0];p[1]+=fixedOffset[1];p.push(p[0]+this.options.scroll.offsetWidth);p.push(p[1]+this.options.scroll.offsetHeight);}
var speed=[0,0];if(pointer[0]<(p[0]+this.options.scrollSensitivity))speed[0]=pointer[0]-(p[0]+this.options.scrollSensitivity);if(pointer[1]<(p[1]+this.options.scrollSensitivity))speed[1]=pointer[1]-(p[1]+this.options.scrollSensitivity);if(pointer[0]>(p[2]-this.options.scrollSensitivity))speed[0]=pointer[0]-(p[2]-this.options.scrollSensitivity);if(pointer[1]>(p[3]-this.options.scrollSensitivity))speed[1]=pointer[1]-(p[3]-this.options.scrollSensitivity);this.startScrolling(speed);}
if(Prototype.Browser.WebKit&&!Qualtrics.Browser.MobileWebKit)window.scrollBy(0,0);var el=Event.element(event);if(el&&el.getAttribute&&el.getAttribute('distancedragged'))
{if(!el.dragTracker)
{el.dragTracker=[pointer[0],pointer[1]];}
var distanceDragged=[Math.abs(pointer[0]-el.dragTracker[0]),Math.abs(pointer[1]-el.dragTracker[1])];el.setAttribute('distancedraggedx',distanceDragged[0]);el.setAttribute('distancedraggedy',distanceDragged[1]);el.setAttribute('distancedragged',distanceDragged[0]+distanceDragged[1]);}
Event.stop(event);}
Draggable.prototype._getWindowScroll=function(w){var T,L,W,H;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;L=documentElement.scrollLeft;}else if(w.document.body){T=body.scrollTop||window.pageYOffset||0;L=body.scrollLeft||window.pageXOffset||0;}
if(w.innerWidth){W=w.innerWidth;H=w.innerHeight;}else if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;H=documentElement.clientHeight;}else{W=body.offsetWidth;H=body.offsetHeight}}
return{top:T,left:L,width:W,height:H};}
Draggable.prototype.scroll=function(){var current=new Date();var delta=current-this.lastScrolled;this.lastScrolled=current;if(this.scrollSpeed[1]<0&&this.options.scroll.scrollTop!==undefined&&this.options.scroll.scrollTop<1)
{return;}
if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){if(this.scrollSpeed[0]||this.scrollSpeed[1]){var d=delta/1000;this.options.scroll.scrollTo(left+d*this.scrollSpeed[0],top+d*this.scrollSpeed[1]);}}}else{this.options.scroll.scrollLeft+=this.scrollSpeed[0]*delta/1000;this.options.scroll.scrollTop+=this.scrollSpeed[1]*delta/1000;}
Position.prepare();Droppables.show(Draggables._lastPointer,this.element);Draggables.notify('onDrag',this);if(this._isScrollChild){Draggables._lastScrollPointer=Draggables._lastScrollPointer||$A(Draggables._lastPointer);Draggables._lastScrollPointer[0]+=this.scrollSpeed[0]*delta/1000;Draggables._lastScrollPointer[1]+=this.scrollSpeed[1]*delta/1000;if(Draggables._lastScrollPointer[0]<0)
Draggables._lastScrollPointer[0]=0;if(Draggables._lastScrollPointer[1]<0)
Draggables._lastScrollPointer[1]=0;this.draw(Draggables._lastScrollPointer);}
if(this.options.change)this.options.change(this);}
Draggable.prototype.initDrag=function(event){if(this.element.hasAttribute('grabClass'))
$(this.element).addClassName(this.element.getAttribute('grabClass'));var trash=$('g'+this.element.parentNode.id);if(trash)
QualtricsTools.fastDown($(trash),'icon').appear({duration:0.5});if(!Object.isUndefined(Draggable._dragging[this.element])&&Draggable._dragging[this.element])return;if(Event.isLeftClick(event)||event.touches){var src=Event.element(event);var el=Event.element(event)
if(el)
{el.dragTracker=null;el.setAttribute('distancedraggedx','0');el.setAttribute('distancedraggedy','0');el.setAttribute('distancedragged','0');}
if(src.getAttribute('preventDrag'))
{return}
if((tag_name=src.tagName.toUpperCase())&&(tag_name=='INPUT'||tag_name=='SELECT'||tag_name=='OPTION'||tag_name=='BUTTON'||tag_name=='TEXTAREA'))return;var pointer=[Event.pointerX(event),Event.pointerY(event)];var pos=Position.cumulativeOffset(this.element);this.offset=[0,1].map(function(i){return(pointer[i]-pos[i])});Draggables.activate(this);Event.stop(event);}}
Draggable.prototype.endDrag2=Draggable.prototype.endDrag;Draggable.prototype.endDrag=function(event)
{if(this.element.hasAttribute('grabClass'))
$(this.element).removeClassName(this.element.getAttribute('grabClass'));var trash=$('g'+this.element.parentNode.id);if(trash)
QualtricsTools.fastDown($(trash),'icon').fade({duration:0.5});this.endDrag2(event);}
Effect.SlideRight=function(element){element=$(element);Element.cleanWhitespace(element);var oldInnerRight=Element.getStyle(element.firstChild,'right');var elementDimensions=Element.getDimensions(element);return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleY:false,scaleFrom:0,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){with(Element){makePositioned(effect.element);makePositioned(effect.element.firstChild);if(window.opera)setStyle(effect.element,{top:''});makeClipping(effect.element);setStyle(effect.element,{width:'0px'});show(element);}},afterUpdateInternal:function(effect){with(Element){setStyle(effect.element.firstChild,{right:(effect.dims[0]-effect.element.clientWidth)+'px'});}},afterFinishInternal:function(effect){with(Element){undoClipping(effect.element);undoPositioned(effect.element.firstChild);undoPositioned(effect.element);setStyle(effect.element.firstChild,{right:oldInnerRight});}}},arguments[1]||{}));}
Effect.SlideLeft=function(element){element=$(element);Element.cleanWhitespace(element);var oldInnerRight=Element.getStyle(element.firstChild,'right');return new Effect.Scale(element,0,Object.extend({scaleContent:false,scaleY:false,scaleMode:'box',scaleFrom:100,restoreAfterFinish:true,beforeStartInternal:function(effect){with(Element){makePositioned(effect.element);makePositioned(effect.element.firstChild);if(window.opera)setStyle(effect.element,{top:''});makeClipping(effect.element);show(element);}},afterUpdateInternal:function(effect){with(Element){setStyle(effect.element.firstChild,{right:(effect.dims[0]-effect.element.clientWidth)+'px'});}},afterFinishInternal:function(effect){with(Element){[hide,undoClipping].call(effect.element);undoPositioned(effect.element.firstChild);undoPositioned(effect.element);setStyle(effect.element.firstChild,{right:oldInnerRight});}}},arguments[1]||{}));}
Effect.BlindLeft=function(element){element=$(element);element.makeClipping();return new Effect.Scale(element,0,Object.extend({scaleContent:false,scaleY:false,restoreAfterFinish:true,afterFinishInternal:function(effect){effect.element.hide().undoClipping();}},arguments[1]||{}));}
Effect.BlindRight=function(element){element=$(element);var elementDimensions=element.getDimensions();return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleY:false,scaleFrom:0,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makeClipping().setStyle({width:'0px'}).show();},afterFinishInternal:function(effect){effect.element.undoClipping();}},arguments[1]||{}));}
Effect.Transitions.InQuad=function(x){return x*x}
Effect.Transitions.OutQuad=function(x){return-1*x*(x-2);}
Effect.Transitions.InExpo=function(x){return(x==0)?0:Math.pow(2,10*(x-1));}
Effect.Transitions.Elastic=function(x){if(x==0||x==1)
return x;var p=0.3;var s=p/4;return-(Math.pow(2,10*(x-=1))*Math.sin((x*1-s)*(2*Math.PI)/p));}
var INQUAD=Effect.Transitions.InQuad;var OUTQUAD=Effect.Transitions.OutQuad
var INEXPO=Effect.Transitions.InExpo;var ELASTIC=Effect.Transitions.Elastic;Effect.Transitions.Elastic=function(pos){return-1*Math.pow(4,-8*pos)*Math.sin((pos*6-1)*(2*Math.PI)/2)+1;};Effect.Transitions.SwingFromTo=function(pos){var s=5.70158;if((pos/=0.5)<1)return 0.5*(pos*pos*(((s*=(1.525))+1)*pos-s));return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos+s)+2);};Effect.Transitions.SwingFrom=function(pos){var s=1.70158;return pos*pos*((s+1)*pos-s);};Effect.Transitions.SwingTo=function(pos){var s=1.70158;return(pos-=1)*pos*((s+1)*pos+s)+1;};Effect.Transitions.Bounce=function(pos){if(pos<(1/2.75)){return(7.5625*pos*pos);}else if(pos<(2/2.75)){return(7.5625*(pos-=(1.5/2.75))*pos+0.75);}else if(pos<(2.5/2.75)){return(7.5625*(pos-=(2.25/2.75))*pos+0.9375);}else{return(7.5625*(pos-=(2.625/2.75))*pos+0.984375);}};Effect.Transitions.BouncePast=function(pos){if(pos<(1/2.75)){return(7.5625*pos*pos);}else if(pos<(2/2.75)){return 2-(7.5625*(pos-=(1.5/2.75))*pos+0.75);}else if(pos<(2.5/2.75)){return 2-(7.5625*(pos-=(2.25/2.75))*pos+0.9375);}else{return 2-(7.5625*(pos-=(2.625/2.75))*pos+0.984375);}};Effect.Transitions.EaseFromTo=function(pos){if((pos/=0.5)<1)return 0.5*Math.pow(pos,4);return-0.5*((pos-=2)*Math.pow(pos,3)-2);};Effect.Transitions.EaseFrom=function(pos){return Math.pow(pos,4);};Effect.Transitions.EaseTo=function(pos){return Math.pow(pos,0.25);};Control.Slider.prototype.initialize=function(handle,track,options){var slider=this;if(Object.isArray(handle)){this.handles=handle.collect(function(e){return $(e)});}else{this.handles=[$(handle)];}
this.track=$(track);this.options=options||{};this.axis=this.options.axis||'horizontal';this.increment=this.options.increment||1;this.step=parseInt(this.options.step||'1');this.range=this.options.range||$R(0,1);this.value=0;this.values=this.handles.map(function(){return 0});this.spans=this.options.spans?this.options.spans.map(function(s){return $(s)}):false;this.options.startSpan=$(this.options.startSpan||null);this.options.endSpan=$(this.options.endSpan||null);this.restricted=this.options.restricted||false;this.maximum=this.options.maximum||this.range.end;this.minimum=this.options.minimum||this.range.start;this.alignX=parseInt(this.options.alignX||'0');this.alignY=parseInt(this.options.alignY||'0');this.trackLength=this.maximumOffset()-this.minimumOffset();this.handleLength=this.isVertical()?(this.handles[0].offsetHeight!=0?this.handles[0].offsetHeight:this.handles[0].style.height.replace(/px$/,"")):(this.handles[0].offsetWidth!=0?this.handles[0].offsetWidth:this.handles[0].style.width.replace(/px$/,""));this.active=false;this.dragging=false;this.disabled=false;if(this.options.disabled)this.setDisabled();this.allowedValues=this.options.values?this.options.values.sortBy(Prototype.K):false;if(this.allowedValues){this.minimum=this.allowedValues.min();this.maximum=this.allowedValues.max();}
this.eventMouseDown=this.startDrag.bindAsEventListener(this);this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.update.bindAsEventListener(this);this.handles.each(function(h,i){i=slider.handles.length-1-i;slider.setValue(parseFloat((Object.isArray(slider.options.sliderValue)?slider.options.sliderValue[i]:slider.options.sliderValue)||slider.range.start),i);h.makePositioned().observe("mousedown",slider.eventMouseDown);});this.track.observe("mousedown",this.eventMouseDown);document.observe("mouseup",this.eventMouseUp);document.observe("mousemove",this.eventMouseMove);this.track.observe("touchstart",this.eventMouseDown);document.observe("touchend",this.eventMouseUp);document.observe("touchmove",this.eventMouseMove);this.initialized=true;}
Control.Slider.prototype.update=function(event){if(this.active){if(!this.dragging)this.dragging=true;this.draw(event);if(Prototype.Browser.WebKit&&!event.touches)window.scrollBy(0,0);Event.stop(event);}}
Control.Slider.prototype.startDrag=function(event){if(Event.isLeftClick(event)||event.touches){if(!this.disabled){this.active=true;var handle=Event.element(event);var pointer=[Event.pointerX(event),Event.pointerY(event)];var track=handle;if(track==this.track){var offsets=Element.viewportOffset(this.track);this.event=event;this.setValue(this.translateToValue((this.isVertical()?pointer[1]-offsets[1]:pointer[0]-offsets[0])-(this.handleLength/2)));offsets=Position.cumulativeOffset(this.activeHandle);this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}else{while((this.handles.indexOf(handle)==-1)&&handle.parentNode)
handle=handle.parentNode;if(this.handles.indexOf(handle)!=-1){this.activeHandle=handle;this.activeHandleIdx=this.handles.indexOf(this.activeHandle);this.updateStyles();offsets=Position.cumulativeOffset(this.activeHandle);this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}}
this.draw(event);}
Event.stop(event);}}
Effect.MorphClip=Class.create();Object.extend(Object.extend(Effect.MorphClip.prototype,Effect.Base.prototype),{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({style:{}},arguments[1]||{});this.clip=options.clip;this.start(options);},setup:function(){this.transform={originalValue:this.parseCSSClip(this.element.getStyle('clip')),targetValue:this.parseCSSClip(this.clip)};},parseCSSClip:function(str)
{var regex=/rect\(([\d|.]+)px,*\s*([\d|.]+)px,*\s*([\d|.]+)px,*\s*([\d|.]+)px\)/;var matches=str.match(regex);return{top:matches[1]*1,right:matches[2]*1,bottom:matches[3]*1,left:matches[4]*1};},update:function(position){var o=this.transform.originalValue;var t=this.transform.targetValue;var top=o.top+Math.round(((t.top-o.top)*position)*1000)/1000;var right=o.right+Math.round(((t.right-o.right)*position)*1000)/1000;var bottom=o.bottom+Math.round(((t.bottom-o.bottom)*position)*1000)/1000;var left=o.left+Math.round(((t.left-o.left)*position)*1000)/1000;var style={clip:'rect('+top+'px,'+right+'px,'+bottom+'px,'+left+'px)'};this.element.setStyle(style,true);}});Effect.Opacity=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);if(Prototype.Browser.IE&&(this.element.currentStyle&&!this.element.currentStyle.hasLayout))
this.element.setStyle({zoom:1});var options=Object.extend({from:this.element.getOpacity()||0.0,to:1.0},arguments[1]||{});this.start(options);},update:function(position){this.element.setOpacity(position);}});
// (C) 2007-2013 Qualtrics, Inc.

Object.extend(Qualtrics,{Browser:{IE:!!(window.attachEvent&&!window.opera),Opera:!!window.opera,WebKit:navigator.userAgent.indexOf('AppleWebKit/')>-1,Safari:navigator.userAgent.indexOf('Safari/')>-1,MobileWebKit:navigator.userAgent.indexOf('AppleWebKit/')>-1&&navigator.userAgent.indexOf('Mobile/')>-1,Gecko:navigator.userAgent.indexOf('Gecko')>-1&&navigator.userAgent.indexOf('KHTML')==-1,Firefox:navigator.userAgent.indexOf('Firefox')>-1,Version:null,Features:null,getVersion:function()
{var ua=navigator.userAgent.toLowerCase();var v='99';if(Qualtrics.Browser.Firefox)
{v=ua.substring(ua.lastIndexOf('firefox/')+8,ua.lastIndexOf('firefox/')+10);}
else if(Qualtrics.Browser.WebKit)
{v=ua.substring(ua.indexOf('applewebkit/')+12,ua.indexOf(' (khtml'));}
else if(Qualtrics.Browser.IE)
{v=ua.substring(ua.indexOf('msie ')+5,ua.indexOf('; w'));}
if(v.indexOf('.')!=-1)
{v=v.substring(0,v.indexOf('.'));}
return Number(v);},getFeatures:function()
{var b=Qualtrics.Browser;var f={onPaste:(!((b.Firefox&&b.Version<3)||b.Opera))};return f;}},Error:function(msg)
{QError(msg);if(window.customErrorHandler)
{window.customErrorHandler(msg);}},isEmpty:function(obj)
{if(Object.isArray(obj))
{if(!obj.length)return true}
else if(!Object.values(obj).length)
{return true;}
return false;},getArrayValues:function(obj)
{if(Object.isArray(obj))
{return obj}
else
{return Object.values(obj);}},isNumericKey:function(evt)
{return((evt.keyCode>=48&&evt.keyCode<=57)||(evt.keyCode>=96&&evt.keyCode<=105)||(evt.keyCode==8)||(evt.keyCode==9)||(evt.keyCode==12)||(evt.keyCode==27)||(evt.keyCode==37)||(evt.keyCode==39)||(evt.keyCode==46)||(evt.keyCode==190&&!evt.shiftKey)||(evt.keyCode==110&&!evt.shiftKey)||(evt.keyCode==188&&!evt.shiftKey)||(evt.keyCode==109&&!evt.shiftKey)||(evt.keyCode==189&&!evt.shiftKey)||evt.metaKey||evt.ctrlKey||evt.altKey);},isNumberFormatKey:function(evt)
{return((evt.keyCode==190&&!evt.shiftKey)||(evt.keyCode==110&&!evt.shiftKey)||(evt.keyCode==188&&!evt.shiftKey));},alphaNumericValidation:function(el,evt)
{if(el.getAttribute('validation'))
{var validation=el.getAttribute('validation');if(validation=='Number'||validation=='AlphaNumeric'||validation=='Integer')
{if(this.isNumericKey(evt))
{if(validation=='Integer'&&this.isNumberFormatKey(evt))
{Event.stop(evt);return false;}}
else
{if(validation=='Number'||validation=='Integer')
{if(evt.keyCode==173)
{}
else
{Event.stop(evt);return false;}}
if(validation=='AlphaNumeric')
{if(evt.keyCode>=65&&evt.keyCode<=90)
{}
else
{Event.stop(evt);return false;}}}}}
return true;},alphaNumbericInputFilter:function(evt,el)
{var validation=el.getAttribute('validation');if(validation=='Number')
{var testStr=el.value.replace(/[^0-9\.\-\,]+/g,'');if(testStr!==el.value)
{el.value=testStr;}}
else if(validation=='AlphaNumeric')
{el.value=el.value.replace(/[^0-9a-zA-Z\.\-\,]+/g,'');}
else if(validation=='CharacterSet')
{var regex=el.getAttribute('charSet');if(regex)
{regex=regex.replace('[','[^')+'+';el.value=el.value.replace(new RegExp(regex,'g'),'');}}},getInputValue:function(input)
{var val=input.value,autoclear=input.getAttribute('autoclear');if(autoclear&&val==autoclear)
val='';return val;},Cache:{cache:{},set:function(key,val)
{this.cache[key]=val;},get:function(key)
{if(this.cache[key]!==null&&typeof(this.cache[key])!='undefined')
return this.cache[key];else
return null;},unset:function(key)
{delete this.cache[key];}},getMessage:function(var_args)
{var sectionName='Javascript',params=null,tag=arguments[1]||arguments[0];if(arguments[1])
{sectionName=arguments[0];params=Array.prototype.slice.call(arguments,2);}
var messages=window.javascriptMessages;if(window.javascriptMessages)
{if(tag&&messages&&window.javascriptMessages[sectionName])
{var message=window.javascriptMessages[sectionName][tag];if(message)
{if(Qualtrics&&Qualtrics.System&&Qualtrics.System.productName=='ThreeSixty'&&tag!='Survey'&&tag!='Survey1'&&tag!='Survey2'&&tag!='Survey3'&&tag!='Form'&&tag!='Form1'&&tag!='Form2'&&tag!='Form3')
{message=message.replace(getMessage('SiteWide','Survey'),getMessage('SiteWide','Form'));message=message.replace(getMessage('SiteWide','Survey1'),getMessage('SiteWide','Form1'));message=message.replace(getMessage('SiteWide','Survey2'),getMessage('SiteWide','Form2'));message=message.replace(getMessage('SiteWide','Survey3'),getMessage('SiteWide','Form3'));}
if(params&&params.length)
{for(i=0,len=params.length;i<len;++i)
{message=message.replace("%"+(i+1),params[i]);}}
return message;}}}
return'#'+tag;},parseJSON:function(json,opt_silent)
{try{if(json)
{if(typeof json=='string')
{var parsed=json.evalJSON();return parsed;}
else if(typeof json=='object')
{return json;}}}catch(e)
{if(!opt_silent)
console.error(e);}
return false;},getHashCode:function(str)
{var hash1=(5381<<16)+5381;var hash2=hash1;var hashPos=0;while(hashPos<str.length){hash1=((hash1<<5)+hash1+(hash1>>27))^str.charCodeAt(hashPos);if(hashPos==str.length-1){break;}
hash2=((hash2<<5)+hash2+(hash2>>27))^str.charCodeAt(hashPos+1);hashPos+=2;}
return hash1+(hash2*1566083941);},arrayCast:function(object)
{if(!object)
{return[];}
if(object.length!==undefined&&object.push)
{return object;}
var array=[];for(var key in object)
{array.push(object[key]);}
return array;}});Qualtrics.Browser.Version=Qualtrics.Browser.getVersion();Qualtrics.Browser.Features=Qualtrics.Browser.getFeatures();var OverRegistry=[]
var dragInProgress=false;var suspendOvers=false;function clearOverRegistry(){if(suspendOvers)return;for(i=0;i<OverRegistry.length;i++){var elem=OverRegistry[i];var cn=Element.classNames(elem);cn.remove("Over");}
OverRegistry.clear();}
function AddOver(el,options)
{if(!el)
return;if(window.dragInProgress!=undefined)
{if(window.dragInProgress)return;if(window.suspendOvers)return;}
var className=(options&&options.className||"Over");$(el).addClassName(className);OverRegistry.push(el);if(options&&options.onComplete){options.onComplete(el,options);}}
function RemoveOver(el,options){if(window.dragInProgress!=undefined)
{if(window.dragInProgress)return;if(window.suspendOvers)return;}
var className=(options&&options.className||"Over");$(el).removeClassName(className);clearOverRegistry();if(options&&options.onComplete){options.onComplete(el,options);}}
function getOverClosure(type,opt_options)
{return function(evt)
{evt=evt||window.event;if(evt)
{var el=(opt_options&&opt_options.element)||Event.element(evt);if(window[type])
{window[type](el,opt_options);}}}}
function AddOverHelper(el)
{if(!el.overAdded)
{el.overAdded=true;Event.observe(el,'mouseover',function()
{AddOver(el);});Event.observe(el,'mouseout',function()
{RemoveOver(el);});}}
var translationTip={originalText:'',suggestionText:'',section:'',item:'',userLang:'',userID:'',span:'',event:'',keepTip:false,off:function()
{if($('translationTip'))
{setTimeout("translationTip.removeTip()",750);}},on:function(el,ev,section,item,lang,userID)
{if($('translationTip'))
return;this.span=el;this.event=ev;this.section=section;this.item=item;this.userLang=lang;this.userID=userID;if(true)
setTimeout("translationTip.addTip()",750)},keepAlive:function(value)
{this.keepTip=value;if(value==false)
this.off();},removeTip:function(override){if((!this.keepTip&&$('translationTip')&&!$('suggestionText').value)||override)
{$('translationTip').remove();}},addTip:function(){var el=this.span;var coordinates=Element.positionedOffset(el);var event=this.event;if(!event)event=window.event;var mouseCoordinates=getMousePosition(event);this.originalText=el.innerHTML;var x=mouseCoordinates[0];var y=mouseCoordinates[1];var stripped=this.originalText.replace(/(<([^>]+)>)/ig,"");var translationTip=QBuilder('div',{id:'translationTip',onmouseover:'translationTip.keepAlive(true)',onmouseout:'translationTip.keepAlive(false)',style:'left:'+x+'px; top:'+y+'px;'},[QBuilder('div',{className:'header'},[QBuilder('h3',{},[getMessage('SiteWide','SuggestTranslation')])]),QBuilder('div',{className:'content'},[QBuilder('div',{id:'translationTipContent'},[QBuilder('div',{},[getMessage('SiteWide','CurrentText')]),QBuilder('div',{},[this.originalText])]),QBuilder('div',{},[getMessage('SiteWide','BetterSuggestion')]),QBuilder('input',{type:'text',id:'suggestionText'},[])]),QBuilder('div',{className:'footer'},[QBuilder('div',{className:'translationTipButton',id:'submitTranslation',onclick:'translationTip.submitSuggestion()'},[getMessage('SiteWide','Submit')]),QBuilder('div',{className:'translationTipButton',onclick:'translationTip.removeTip(true)'},[getMessage('SiteWide','Close')]),QBuilder('div',{className:'clear'},[])])]);$('body').appendChild(translationTip);},submitSuggestion:function(){if($('submitTranslation')&&$('submitTranslation').hasClassName('disabled'))
return;$('submitTranslation').addClassName('disabled');if($('suggestionText')&&$('suggestionText').value)
this.suggestionText=$('suggestionText').value;else
{$('translationTipContent').innerHTML=getMessage('SiteWide','NoSuggestion');this.off();return;}
var url='http://reporting.qualtrics.com/projects/translations.php?userID='+this.userID+'&suggestion='+this.suggestionText+'&sectionTag='+this.section+'&messageTag='+this.item+'&language='+this.userLang;new Ajax.Request(url,{params:{userID:this.userID,translation:this.suggestionText,sectionTag:this.section,messageTag:this.item,language:this.userLang},onSuccess:function(transport){$('translationTipContent').innerHTML=getMessage('SiteWide','TranslationReceived');this.off();},onFailure:function(transport){$('translationTipContent').innerHTML=getMessage('SiteWide','TranslationNotReceived');this.off();}});}}
Cookie={createCookie:function(name,value,days){if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString();}
else
expires="";document.cookie=name+"="+value+expires+"; path=/";},readCookie:function(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);}
return null;},readCookieNames:function(){var cookies=[];var ca=document.cookie.split(';');ca.each(function(item){var index=item.indexOf('=');cookies.push(item.substring(0,index));});return cookies;},eraseCookie:function(name){Cookie.createCookie(name,"",-1);},acceptsCookies:function(){if(typeof navigator.cookieEnabled=='boolean'){return navigator.cookieEnabled;}
Cookie.createCookie('_test','1');var val=Cookie.readCookie('_test');Cookie.eraseCookie('_test');return val=='1';}}
function stopEnterSubmit(evt)
{if(evt.keyCode==Event.KEY_RETURN)
{Event.stop(evt);return false;}}
function pressSubmitButtonOnEnter(evt,id)
{if(evt.keyCode==Event.KEY_RETURN)
{Event.stop(evt);$(id).click();return false;}}
function number_format(number,decimals,dec_point,thousands_sep)
{if(!decimals||decimals>0)
{var decimalPos=String(number).indexOf(".");if(decimalPos===-1)
{decimals=0;}
else
{var numOfCharactersAfterDecimal=String(number).substring(decimalPos+1).length;if(decimals)
decimals=Math.min(numOfCharactersAfterDecimal,decimals);else
decimals=numOfCharactersAfterDecimal;}}
var n=number;var c=isNaN(decimals=Math.abs(decimals))?2:decimals;var d=dec_point==undefined?".":dec_point;var t=thousands_sep==undefined?",":thousands_sep;var s=n<0?"-":"";var i=parseInt(n=Math.abs(+n||0).toFixed(c))+"";var j=(j=i.length)>3?j%3:0;var finalNum=s+(j?i.substr(0,j)+t:"")+i.substr(j).replace(/(\d{3})(?=\d)/g,"$1"+t)+(c?d+Math.abs(n-i).toFixed(c).slice(2):"");return finalNum;}
function trim(str)
{return str.replace(/^\s+|\s+$/g,'');}
function UpdateCSTotal(CSQuestion,DesiredSum)
{var displayOrderEl=$("QR~"+CSQuestion+"~DisplayOrder");var displayedChoices=(displayOrderEl)?displayOrderEl.value.split('|'):[];var TotalCount=0;for(var i=0;i<displayedChoices.length;i++)
{var CurrentChoice="QR~"+CSQuestion+"~"+displayedChoices[i];var choiceEl=$(CurrentChoice);if(choiceEl)
{TotalCount+=Number(choiceEl.value.replace(/,/g,''))*1000;}}
TotalCount/=1000;if(TotalCount==DesiredSum||DesiredSum==-1)
$(CSQuestion+"_Total").style.color="";else
$(CSQuestion+"_Total").style.color="red";TotalCount=number_format(TotalCount);$(CSQuestion+"_Total").value=TotalCount;}
function UpdateMatrixCSTotal(Question,choiceId,desiredSum)
{if(!desiredSum)
desiredSum=-1;var questionId=Question;if(questionId.indexOf('~')!=-1)
{choiceId=questionId.substring(questionId.indexOf('~')+1);questionId=questionId.substring(0,questionId.indexOf('~'));}
var displayOrderEl=$("QR~"+questionId+"~AnswerDisplayOrder");var displayedAnswers=(displayOrderEl)?displayOrderEl.value.split('|'):[];var TotalCount=0;for(var i=0;i<displayedAnswers.length;i++)
{var CurrentAnswer="QR~"+questionId+"~"+choiceId+"~"+displayedAnswers[i];var answerEl=$(CurrentAnswer);if(answerEl)
{TotalCount+=Number(answerEl.value.replace(/,/g,''))*1000;}}
TotalCount/=1000;var OutputCell=questionId+"~"+choiceId+"_Total";if(TotalCount==desiredSum||desiredSum==-1)
$(OutputCell).style.color="";else
$(OutputCell).style.color="red";TotalCount=number_format(TotalCount);$(OutputCell).value=TotalCount;}
function UpdateMatrixCSTotalVert(Question,answerId,desiredSum)
{if(!desiredSum)
desiredSum=-1;var questionId=Question;if(questionId.indexOf('~')!=-1)
{answerId=questionId.substring(questionId.indexOf('~')+1);questionId=questionId.substring(0,questionId.indexOf('~'));}
var displayOrderEl=$("QR~"+questionId+"~DisplayOrder");var displayedChoices=(displayOrderEl)?displayOrderEl.value.split('|'):[];var TotalCount=0;for(var i=0;i<displayedChoices.length;i++)
{var CurrentAnswer="QR~"+questionId+"~"+displayedChoices[i]+"~"+answerId;var answerEl=$(CurrentAnswer);if(answerEl)
{TotalCount+=Number(answerEl.value.replace(/,/g,''))*1000;}}
TotalCount/=1000;var OutputCell=questionId+"~"+answerId+"_Total";if(TotalCount==desiredSum||desiredSum==-1)
$(OutputCell).style.color="";else
$(OutputCell).style.color="red";TotalCount=number_format(TotalCount);$(OutputCell).value=TotalCount;}
function updateConjointTotal(prefix,total_levels)
{var conjoint_level=1;var total_count=0;var features=$('featuresShown').value.split(',');for(var i=0;i<features.length;i++)
{conjoint_level=features[i];level_element=prefix+"~"+conjoint_level+"~UCS";if($(level_element))
total_count+=Number($(level_element).value);conjoint_level++;}
var output_element=prefix+"~Total";if(total_count==100)
document.Page.elements[output_element].style.color="";else
document.Page.elements[output_element].style.color="red";document.Page.elements[output_element].value=total_count;}
function SBChangeOrder(selectionID,offset)
{offset=Number(offset);var element=$(selectionID);if((offset!=-1&&offset!=1)||element==null)
return;var index=element.selectedIndex;if(index==-1||index+offset<0||index+offset>=element.options.length)
return;var optionA=new Option(element.options[index].text,element.options[index].value,0,1);optionA.nomove=element.options[index].nomove;var optionB=new Option(element.options[index+offset].text,element.options[index+offset].value);optionB.nomove=element.options[index+offset].nomove;element.options[index]=optionB;element.options[index+offset]=optionA;element.focus();}
function moveItemToSelectionBox(oldSelectionBoxID,newSelectionBoxID,deleteOption){var old_element=$(oldSelectionBoxID);var new_element=$(newSelectionBoxID);if(old_element==null||new_element==null)
{return;}
var old_element_length=old_element.options.length;for(var index=0;index<old_element_length;index++)
{if(old_element.options[index].selected)
{var option=old_element.options[index];option=new Option(option.text,option.value);option.referer=oldSelectionBoxID;if(deleteOption)
{old_element.options[index--]=null;old_element_length=old_element.options.length;}
new_element.options.add(option);}}
old_element.focus();}
function deleteItemFromSelectionBox(selectionBoxID)
{var element=$(selectionBoxID);if(element==null)
{return;}
var index=element.selectedIndex;if(index==-1)
return;var newSelected=index-1;var element_length=element.options.length;for(index=0;index<element_length;index++)
{if(element.options[index].selected)
{element.options[index--]=null;element_length=element.options.length;if(index<0)
index=0;}}
if(newSelected>=0)
element.options[newSelected].selected=true;else
element.options[0].selected=true;element.focus();}
function updateDrillDown(selectPrefix,answerMap,answers,depth,maxDepth,value)
{var hasAnswerMap=false;for(var test in answerMap)
{hasAnswerMap=true;break;}
if(!hasAnswerMap||depth>maxDepth)
{return;}
var selectedAnswer=parseValue(value);var currentSelect=$(selectPrefix+depth);var nextSelect=$(selectPrefix+(depth+1));if(currentSelect&&selectedAnswer!=false)
{var selectValue="QR~"+selectPrefix+depth+"~"+selectedAnswer;currentSelect.value=selectValue;}
if(nextSelect)
{nextSelect.disabled=true;nextSelect.options.length=0;if(selectedAnswer!=false||depth==0)
{var valuePrefix=nextSelect.name+'~';var newAnswers=createDDAnswers(answerMap,answers,selectedAnswer,depth);var i=0;nextSelect.options[i++]=new Option('','');for(var answerID in newAnswers)
nextSelect.options[i++]=new Option(newAnswers[answerID],valuePrefix+answerID);nextSelect.disabled=false;}
for(i=depth+2;i<=maxDepth;i++)
{var select=$(selectPrefix+i);select.options.length=0;select.disabled=true;}}}
function parseValue(value)
{if(value==false||value.indexOf('~')==-1)
return value;var startIndex=value.lastIndexOf('~')+1;var endIndex=value.length;return value.substring(startIndex,endIndex);}
function createDDAnswers(answerMap,DDanswers,selectedAnswer,depth)
{var answerArray=getAnswerArray(answerMap,selectedAnswer,depth);var answers=new Object();for(var answerID in answerArray)
answers[answerID]=DDanswers[answerID].substring(DDanswers[answerID].lastIndexOf('~ ')+1);return answers;}
function getAnswerArray(answerMap,selectedAnswer,depth)
{if(answerMap=='')
return false;if(depth==0)
return answerMap;for(var answerID in answerMap)
{if(answerID==selectedAnswer)
return answerMap[answerID];var answerArray=getAnswerArray(answerMap[answerID],selectedAnswer);if(answerArray!=false)
return answerArray;}
return false;}
function validateNumber(event)
{var keyCode=event.keyCode;if(keyCode==8||keyCode==9||keyCode==35||keyCode==36||keyCode==37||keyCode==39||keyCode==46)
return true;if(keyCode==0)
keyCode=event.which;if(keyCode==46)
return true;if(keyCode==45)
return true;if(keyCode>=48&&keyCode<=57||keyCode<=97&&keyCode>=122)
return true;return false;}
function noneOfTheAboveCheck(postTag,choiceId,notAChoice,thisID)
{if(choiceId=="")
var items=document.Page.elements[postTag+"~DisplayOrder"].value.split('|');else
{items=document.Page.elements[postTag+"~AnswerDisplayOrder"].value.split('|');postTag=postTag+"~"+choiceId;}
if(thisID==notAChoice)
{var thisCheckBox=$(postTag+"~"+thisID);if(thisCheckBox.checked)
{for(var i=0;i<items.length;i++)
{var checkBox=$(postTag+"~"+items[i]);if(thisID==items[i]||!checkBox)
continue;checkBox.checked=false;}}}
else
{var notAChoiceCheckBox=$(postTag+"~"+notAChoice);notAChoiceCheckBox.checked=false;}}
function exclusiveAnswerCheck(postTag,group,elementId)
{try
{if($(postTag+"~AnswerDisplayOrder"))
var displayedChoices=$F(postTag+"~AnswerDisplayOrder").split('|');else if($(postTag+"~DisplayOrder"))
displayedChoices=$F(postTag+"~DisplayOrder").split('|');else
return;}
catch(e)
{console.log(e);}
var isExclusive=$(group+"~"+elementId).getAttribute('exclusive');for(var i=0;i<displayedChoices.length;i++)
{var checkBox=$(group+"~"+displayedChoices[i]);var id=displayedChoices[i];if(isExclusive==1)
{if(elementId==id||!checkBox)
continue;checkBox.checked=false;}
else
{if(checkBox&&checkBox.getAttribute('exclusive')==1)
checkBox.checked=false;}}}
function exclusiveChoiceCheck(postTag,group,choiceId,elementId)
{try
{if($(postTag+"~DisplayOrder"))
var displayedChoices=$F(postTag+"~DisplayOrder").split('|');else
return;}
catch(e)
{console.log(e);}
var isExclusive=$(group+"~"+elementId).getAttribute('choiceexclusive');for(var i=0;i<displayedChoices.length;i++)
{var checkBox=$(postTag+"~"+displayedChoices[i]+'~'+elementId);var id=displayedChoices[i];if(isExclusive==1)
{if(choiceId==id||!checkBox)
{continue;}
checkBox.checked=false;}
else
{if(checkBox&&checkBox.getAttribute('choiceexclusive')==1)
checkBox.checked=false;}}}
function rankOrderRadioCheck(colId,selectedRow,numRows)
{for(var row=0;row<numRows;row++)
{if(row==selectedRow)
continue;var radio=$(colId+"~"+row);if(radio.checked==true)
radio.checked=false;}}
function getTimeArray(d)
{d=Number(d);return{h:Math.floor(d/3600),m:Math.floor(d%3600/60),s:Math.floor(d%3600%60)}}
function startTimer(tId)
{$(tId+'Timer').timer=setInterval((function(){var t=$(tId+'Timer');var i=parseInt(t.getAttribute('time'));var e=i-parseInt(t.getAttribute('endTime'));if(e==0)
{clearInterval(t.timer);return;}
var j=i-e/Math.abs(e);t.setAttribute('time',j);i=getTimeArray(i);j=getTimeArray(j);flipNumber(i.s,j.s,tId+'S');if(i.m!=j.m)
flipNumber(i.m,j.m,tId+'M');if(i.h!=j.h)
flipNumber(i.h,j.h,tId+'H');}).bind(null,tId),1000);}
function flipNumber(i,j,hms)
{var flip=function(i,j,n)
{if(!(Qualtrics.Browser.WebKit||Qualtrics.Browser.Firefox))
{$(n).down('.Number').update(j);return;}
var field=QBuilder('fieldset',{},[QBuilder('span',{className:'Change B'},j+''),QBuilder('span',{className:'Change TF'},i+''),QBuilder('span',{className:'Change TB'},j+'')]);$(n).appendChild(field);(function(n){n.className+=' Flip'}).delay(.05,field);setTimeout((function(n,j){$(n).down('.Number').update(j);$(n).down('.Flip').hide();}).curry(n,j),800);}
if(i%10!=j%10)
{flip(i%10,j%10,hms+'2');}
i=Math.max(Math.floor(i/10),0);j=Math.max(Math.floor(j/10),0);if(i!=j)
{flip(i,j,hms+'1');}}
function InsertSlider(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue)
{var html=generateSliderDOM(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue);document.write(html.innerHTML);(function(){createSlider(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue)}).delay();}
function generateSliderDOM(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue)
{if(!!SliderValue)
DefaultValue=SliderValue;var SliderNM=SliderName;var SliderImage=SliderName+"_Image";var sliderPath='../WRQualtricsShared/SlidingScales/'+GraphicDirectory+'/';var ssImages=QBuilder('div',{className:'SSImage'});for(var i=min;i<=max;i++)
{var display=(i==DefaultValue)?'block':'none';var img=QBuilder('img',{src:sliderPath+i+'.gif',id:'Image_'+SliderName+'@'+i});$(img).setStyle({display:display});$(ssImages).appendChild(img);}
var track=QBuilder('a',{className:'SSTrack',id:'DV_'+SliderName},[QBuilder('span',{className:'handle',id:'H_'+SliderName})]);var ret=QBuilder('div');if(Direction=='vertical')
{ret.appendChild(QBuilder('table',{className:'SSDisplay '+Direction+'bar'},[QBuilder('tbody',{},[QBuilder('tr',{},[QBuilder('td',{},[ssImages]),QBuilder('td',{},[track])])])]));}
else
{ret.appendChild(QBuilder('table',{className:'SSDisplay '+Direction+'bar'},[QBuilder('tbody',{},[QBuilder('tr',{},[QBuilder('td',{},[ssImages])]),QBuilder('tr',{},[QBuilder('td',{},[track])])])]));}
var opts={'type':'hidden',id:SliderName,'name':SliderName};if(!!SliderValue)
opts['value']=SliderValue;ret.appendChild(Builder.node('input',opts));return ret;}
function createSlider(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue)
{if(!!SliderValue)
DefaultValue=SliderValue;var slider='DV_'+SliderName;var handle='H_'+SliderName;var range=$R(parseInt(min),parseInt(max));var defValue=DefaultValue;if(Direction=='vertical')
{DefaultValue=range.end-DefaultValue+parseInt(min);}
var activated=false;var mySlider=new Control.Slider(handle,slider,{range:range,values:$A(range),axis:Direction,sliderValue:DefaultValue,onSlide:function(value)
{if(!this.value&&this.value!=0)
{this.value=defValue;}
if(this.axis=='vertical')
value=this.range.end-value+this.range.start;if($('Image_'+SliderName+'@'+this.value))
$('Image_'+SliderName+'@'+this.value).setStyle({display:'none'});if($('Image_'+SliderName+'@'+value))
$('Image_'+SliderName+'@'+value).setStyle({display:'block'});this.value=value;},onChange:function(value){if(!activated)
{activated=true;$(slider).addClassName('activated');}
if(this.axis=='vertical')
value=this.range.end-value+this.range.start;$(SliderName).value=value;}});}
function submitForm(formID)
{var form=$(formID);if(form)
{Event.fire(form,'submit');if(form.onsubmit)
form.onsubmit();if(form.submit)
form.submit();return true;}}
function submitFormJumpTo(formID,jumpTo)
{$(formID).action=jumpTo;submitForm(formID);}
function getMousePosition(e)
{if(e.pageX&&e.pageY)
{posx=e.pageX;posy=e.pageY;}
else if(e.clientX&&e.clientY)
{posx=e.clientX+window.scrollInfo[0];posy=e.clientY+window.scrollInfo[1];}
return[posx,posy];}
function setPosition(obj,newX,newY)
{$(obj).setStyle({top:newY+'px',left:newX+'px'});}
function findPosX(obj)
{var curleft=0;if(obj.offsetParent)
{while(obj.offsetParent)
{curleft+=obj.offsetLeft
obj=obj.offsetParent;}}
else if(obj.x)
curleft+=obj.x;return curleft;}
function findPosY(obj)
{var curtop=0;if(obj.offsetParent)
{while(obj.offsetParent)
{curtop+=obj.offsetTop
obj=obj.offsetParent;}}
else if(obj.y)
curtop+=obj.y;return curtop;}
function autoCheck(id,text)
{var el=$(id);if(el==null)
return;if(el&&el.id!=id)
return;var type=el.getAttribute('type');if(type=='checkbox'||type=='radio')
{if(text==''||text==null)
el.checked=false;else
el.checked=true;}
if($(el).onclick)
$(el).onclick();}
var SEonSubmit={add:function(onSubmitFunction)
{Event.observe('Page','submit',onSubmitFunction);}}
var SEonClick={add:function(onClickFunction)
{Event.observe('Page','click',onClickFunction);}}
var SEonMouseDown={add:function(onMouseDownFunction)
{Event.observe('Page','mouseup',onMouseDownFunction);}}
var IeFixFlashFixOnload=function(){}
function refreshPage()
{}
function Q_UpdatePage()
{}
function SlideToggle(el,options)
{if(el.inAction!=true)
{el.inAction=true;if(options&&options.onStart)
{options.onStart();}
if(Element.getStyle(el,'display')=='block')
{if(options&&options.ExpandOnly==true)
{el.inAction=false;if(options&&options.onExit)
{options.onExit();}
return;}
if(options&&options.toggleArrow)
{ArrowToggle(options.toggleArrow,{ContractOnly:true});}
new Effect.BlindUp(el,{duration:options.duration||0.15,afterFinish:function()
{el.inAction=false;if(refreshPage)
{refreshPage();}
if(Q_UpdatePage)
{Q_UpdatePage();}
if(options&&options.onContract)
{options.onContract();}
if(options&&options.onFinish)
{options.onFinish();}
if(options&&options.onExit)
{options.onExit();}}});}
else
{if(options&&options.ContractOnly==true)
{el.inAction=false;if(options&&options.onExit)
{options.onExit();}
return;}
if(options&&options.toggleArrow)
{ArrowToggle(options.toggleArrow,{ExpandOnly:true});}
if(options&&options.beforeExpand){options.beforeExpand();}
new Effect.BlindDown(el,{duration:options.duration||0.15,afterFinish:function()
{el.inAction=false;if(refreshPage)
{refreshPage();}
if(Q_UpdatePage)
{Q_UpdatePage();}
if(options&&options.onExpand)
{options.onExpand();}
if(options&&options.onFinish)
{options.onFinish();}
if(options&&options.onExit)
{options.onExit();}}});}}}
function ArrowToggle(TitleDiv,options){if(options&&options.ContractOnly){$(TitleDiv).addClassName("Collapsed");return;}
if(options&&options.ExpandOnly){$(TitleDiv).removeClassName("Collapsed");return;}
if(Element.hasClassName(TitleDiv,'Collapsed')){$(TitleDiv).removeClassName("Collapsed");}else{$(TitleDiv).addClassName("Collapsed");}}
function HelpToggle()
{SlideToggle($('HelpContent'),{onContract:function()
{Element.setStyle($('HelpButton'),{borderBottom:'1px solid #FCD570'});$('GapCloser').hide();},beforeExpand:function()
{Element.setStyle($('HelpButton'),{borderBottom:'none'});$('GapCloser').show();}});}
function fillVerticalSpace(element,container)
{try
{if(element)
{if(!container||container.tagName=='body')
fillBody=true;else
fillBody=false;var newHeight=0;var headerAndFooterHeight=0;var mainContentDiv=$('mainContentDiv');if(mainContentDiv)
{if(fillBody)
{headerAndFooterHeight+=Position.cumulativeOffset(mainContentDiv)[1];}
else if($('popupMainHeaderDiv'))
{headerAndFooterHeight+=Position.cumulativeOffset(mainContentDiv)[1]-Position.cumulativeOffset($('popupMainHeaderDiv'))[1];}}
var topOfFooterDiv=$('topOfFooter');var botOfFooterDiv=$('bottomOfFooter');var footerDiv=$('popupMainFooterDiv');if(topOfFooterDiv&&botOfFooterDiv)
{var footerHeight=Position.cumulativeOffset(botOfFooterDiv)[1]-Position.cumulativeOffset(topOfFooterDiv)[1];headerAndFooterHeight+=footerHeight;}
else if(footerDiv)
{footerHeight=footerDiv.offsetHeight;headerAndFooterHeight+=footerHeight;}
if(fillBody)
{if(window.innerHeight)
{newHeight=window.innerHeight-headerAndFooterHeight;}
else
{newHeight=document.documentElement.clientHeight-headerAndFooterHeight;}}
else
{newHeight=$(container).offsetHeight-headerAndFooterHeight;}
element.style.height=newHeight+'px';}}
catch(e)
{console.error(e);}}
function resizedWindow()
{fillVerticalSpace($('mainContentDiv'));}
function removeElement(element){var garbageBin=$('IELeakGarbageBin');if(!garbageBin)
{garbageBin=QBuilder('DIV');garbageBin.id='IELeakGarbageBin';garbageBin.style.display='none';document.body.appendChild(garbageBin);}
garbageBin.appendChild(element);garbageBin.innerHTML='';}
function getMessage(msg)
{return'#'+msg;}
var QualtricsTools={createNewId:function(prefix)
{return prefix+'_'+(Math.round(Math.random()*100000000));},createFauxGUID:function(prefix)
{var S=function(){return"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random()*59));};return prefix+'_'+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S();},clearSelection:function()
{if(window.getSelection)
{if(window.getSelection().empty)
{window.getSelection().empty();}
else if(window.getSelection().removeAllRanges)
{window.getSelection().removeAllRanges();}
else if(document.selection)
{document.selection.empty();}}},focusInput:function(el,opt_pos)
{if(opt_pos==undefined)
{$(el).focus();return;}
if(el&&el.createTextRange)
{var range=el.createTextRange();if(range){range.collapse(true);range.moveStart('character',opt_pos);range.moveEnd('character',opt_pos);try{range.select();}catch(e){}}}
else if(el)
{if($(el).focus)
{$(el).focus();if(el.setSelectionRange)
{try{el.setSelectionRange(opt_pos,opt_pos);}catch(e)
{}}}}},getPageSize:function()
{var xScroll,yScroll;if(window.innerHeight&&window.scrollMaxY){xScroll=document.body.scrollWidth;yScroll=window.innerHeight+window.scrollMaxY;}else if(document.body.scrollHeight>document.body.offsetHeight){xScroll=document.body.scrollWidth;yScroll=document.body.scrollHeight;}else{xScroll=document.body.offsetWidth;yScroll=document.body.offsetHeight;}
var windowWidth,windowHeight;if(self.innerHeight){windowWidth=self.innerWidth;windowHeight=self.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){windowWidth=document.documentElement.clientWidth;windowHeight=document.documentElement.clientHeight;}else if(document.body){windowWidth=document.body.clientWidth;windowHeight=document.body.clientHeight;}
if(yScroll<windowHeight){pageHeight=windowHeight;}else{pageHeight=yScroll;}
if(xScroll<windowWidth){pageWidth=windowWidth;}else{pageWidth=xScroll;}
var arrayPageSize={pageWidth:pageWidth,pageHeight:pageHeight,windowWidth:windowWidth,windowHeight:windowHeight,0:pageWidth,1:pageHeight,2:windowWidth,3:windowHeight};return arrayPageSize;},getScrollInfo:function()
{if(document.viewport.getScrollOffsets)
{var scrollOffsets=document.viewport.getScrollOffsets();return[scrollOffsets.left,scrollOffsets.top];}
return[0,0]},getInstanceHelper:function(registry,idString)
{return function(id)
{if(registry.push)
{for(var i=0,len=registry.length;i<len;++i)
{if(registry[i][idString]==id)
{return registry[i];}}}
else
{if(registry[id])
{return registry[id];}}
return undefined;};},sortByKey:function(array,key)
{return array.sort(function(a,b){var x=a[key];var y=b[key];return((x<y)?-1:((x>y)?1:0));});},fastDown:function(startNode,className,maxDepth)
{if($(startNode).hasClassName(className))
{return startNode;}
var parentNode=startNode;var lastRealNode=null;if(maxDepth==undefined)
{maxDepth=10;}
for(var i=0;i<maxDepth;++i)
{if(!parentNode.firstChild)
{break;}
var child=parentNode.firstChild;if(child&&child.nodeType==3&&child.nextSibling)
{child=child.nextSibling;}
if(child)
{if(child.nodeType==1)
{if($(child).hasClassName(className))
{return child;}
else if(child.nextSibling&&child.nextSibling.nodeType==1&&$(child.nextSibling).hasClassName(className))
{return child.nextSibling;}
parentNode=child;}}}
if(!className)return child;return $(startNode).down('.'+className);},fastUp:function(startNode,className,maxDepth)
{if(!$(startNode))
return null;if($(startNode).hasClassName&&$(startNode).hasClassName(className))
{return startNode;}
var thisNode=startNode;if(maxDepth==undefined)
{maxDepth=10;}
for(var i=0;i<maxDepth;++i)
{var parent=thisNode.parentNode;if(parent)
{if(parent.nodeType==1)
{if($(parent).hasClassName&&$(parent).hasClassName(className))
{return parent;}
thisNode=parent;}}}
if($(startNode).up)
return $(startNode).up('.'+className);else
return null;},BrowserInfo:{cachedBrowserInfo:null,Flash:{isIE:(navigator.appVersion.indexOf("MSIE")!=-1)?true:false,isWin:(navigator.appVersion.toLowerCase().indexOf("win")!=-1)?true:false,isOpera:(navigator.userAgent.indexOf("Opera")!=-1)?true:false,ControlVersion:function()
{var version;var axo;var e;try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");version=axo.GetVariable("$version");}catch(e){}
if(!version)
{try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");version="WIN 6,0,21,0";axo.AllowScriptAccess="always";version=axo.GetVariable("$version");}catch(e){}}
if(!version)
{try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");version=axo.GetVariable("$version");}catch(e){}}
if(!version)
{try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");version="WIN 3,0,18,0";}catch(e){}}
if(!version)
{try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");version="WIN 2,0,0,11";}catch(e){version=-1;}}
return version;},GetSwfVer:function(){var flashVer=-1;if(navigator.plugins!=null&&navigator.plugins.length>0){if(navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]){var swVer2=navigator.plugins["Shockwave Flash 2.0"]?" 2.0":"";var flashDescription=navigator.plugins["Shockwave Flash"+swVer2].description;var descArray=flashDescription.split(" ");var tempArrayMajor=descArray[2].split(".");var versionMajor=tempArrayMajor[0];var versionMinor=tempArrayMajor[1];var versionRevision=descArray[3];if(versionRevision==""){versionRevision=descArray[4];}
if(versionRevision[0]=="d"){versionRevision=versionRevision.substring(1);}else if(versionRevision[0]=="r"){versionRevision=versionRevision.substring(1);if(versionRevision.indexOf("d")>0){versionRevision=versionRevision.substring(0,versionRevision.indexOf("d"));}}
flashVer=versionMajor+"."+versionMinor+"."+versionRevision;}}
else if(navigator.userAgent.toLowerCase().indexOf("webtv/2.6")!=-1)flashVer=4;else if(navigator.userAgent.toLowerCase().indexOf("webtv/2.5")!=-1)flashVer=3;else if(navigator.userAgent.toLowerCase().indexOf("webtv")!=-1)flashVer=2;else if(this.isIE&&this.isWin&&!this.isOpera){flashVer=this.ControlVersion();}
return flashVer;}},_parseUserAgent:function()
{var browserInfo={};var agentString=navigator.userAgent;browserInfo.ua=navigator.userAgent;console.log("UserAgent:",browserInfo.ua);var uaPattern=/(([^\/\s]*)\/([^\s;]*))/;var pattern;var matches=true;while(matches)
{matches=uaPattern.exec(agentString);if(matches)
{console.log('matches',matches);agentString=RegExp.rightContext;if(matches[2]&&matches[2].toLowerCase)
{switch(matches[2].toLowerCase())
{case'chrome':browserInfo.browser=matches[2];browserInfo.version=matches[3];matches=false;break;case'firefox':case'netscape':case'safari':case'camino':case'mosaic':case'galeon':case'opera':case'mozilla':case'konqueror':browserInfo.browser=matches[2];browserInfo.version=matches[3];}}}}
agentString=navigator.userAgent;if(browserInfo.browser=='Mozilla')
{if(browserInfo.browser=='Mozilla'&&agentString.indexOf('(compatible;')!=-1)
{pattern=/\(compatible; ([^ ]*)[ \/]([^;]*).*/;matches=pattern.exec(agentString);if(matches)
{browserInfo.browser=matches[1];browserInfo.version=matches[2];}}}
switch(browserInfo.browser.toLowerCase())
{case'msie':pattern=/\(compatible;[^;]*;\s*([^;\)]*)/;matches=pattern.exec(agentString);browserInfo.os=matches[1];break;case'opera':pattern=/\(([^;\)]*)/;matches=pattern.exec(agentString);browserInfo.os=matches[1];break;case'konqueror':pattern=/Konqueror[^;]*;\s*([^;\)]*)/;matches=pattern.exec(agentString);browserInfo.os=matches[1];break;case'safari':if(agentString.indexOf('iPhone')!=-1)
{browserInfo.browser+=" iPhone";}
pattern=/Version\/([^ ]*)/;matches=pattern.exec(agentString);browserInfo.version=matches&&matches[1];case'firefox':default:pattern=/U;\s*([^;\)]*)/;matches=pattern.exec(agentString);if(matches)
browserInfo.os=matches[1];else
{pattern=/\(([^)]*)\)/;matches=pattern.exec(agentString)[1].split(';');if(matches[0][0]=='X')
{browserInfo.os=matches[1];}
else
{browserInfo.os=matches[0];}}
break;}
browserInfo.resolution={x:screen.width,y:screen.height};browserInfo.java=navigator.javaEnabled()?1:0;browserInfo.flashVersion=this.Flash.GetSwfVer();if(browserInfo.flashVersion&&browserInfo.flashVersion.replace)
{browserInfo.flashVersion=browserInfo.flashVersion.replace(/,/g,'.');browserInfo.flashVersion=browserInfo.flashVersion.replace(/WIN /g,'');}
return browserInfo;},getBrowserInfo:function()
{if(!this.cachedBrowserInfo)
this.cachedBrowserInfo=this._parseUserAgent();return this.cachedBrowserInfo;},getCurrentPosition:function(callback)
{var timeout=10000;var maximumAge=60000;var highAccuracyOpts={enableHighAccuracy:true,timeout:timeout,maximumAge:maximumAge};var mediumAccuracyOpts={enableHighAccuracy:false,timeout:timeout,maximumAge:maximumAge};var mediumAccuracySuccess=function(pos){var returnData={accuracy:pos.coords.accuracy||-1,latitude:pos.coords.latitude,longitude:pos.coords.longitude};this.getBrowserInfo();this.cachedBrowserInfo.locationaccuracy=returnData.accuracy;this.cachedBrowserInfo.latitude=returnData.latitude;this.cachedBrowserInfo.longitude=returnDataos.longitude;if(callback)
callback(returnData);}.bind(this);var mediumAccuracyError=function(pos){this.getBrowserInfo();this.cachedBrowserInfo.locationerror=pos.code;if(callback)
callback({error:pos.code});}.bind(this);var highAccuracySuccess=function(pos){var returnData={accuracy:pos.coords.accuracy||-1,latitude:pos.coords.latitude,longitude:pos.coords.longitude};this.getBrowserInfo();this.cachedBrowserInfo.locationaccuracy=returnData.accuracy;this.cachedBrowserInfo.latitude=returnData.latitude;this.cachedBrowserInfo.longitude=returnData.longitude;if(callback)
callback(returnData);}.bind(this);var highAccuracyError=function(pos){this.geoPosition.getCurrentPosition(mediumAccuracySuccess,mediumAccuracyError,mediumAccuracyOpts);}.bind(this);if(!this.geoPosition.getCurrentPosition(highAccuracySuccess,highAccuracyError,highAccuracyOpts))
{this.getBrowserInfo();this.cachedBrowserInfo.locationerror=1;callback({locationerror:1});}},geoPosition:function()
{var pub={};var provider=null;var u="undefined";var getCurrentPosition;pub.getCurrentPosition=function(success,error,opts)
{try
{var hasGeolocation=typeof(navigator.geolocation)!=u;if(!hasGeolocation)
{if(!confirm('Qualtrics wants to use your location.\nDo you want to allow it?')())
{return false;}}
if((typeof(geoPositionSimulator)!=u)&&(geoPositionSimulator.length>0))
{provider=geoPositionSimulator;}
else if(typeof(bondi)!=u&&typeof(bondi.geolocation)!=u)
{provider=bondi.geolocation;}
else if(hasGeolocation)
{provider=navigator.geolocation;getCurrentPosition=function(success,error,opts)
{function _success(p)
{var params;if(typeof(p.latitude)!=u)
{params={timestamp:p.timestamp,coords:{latitude:p.latitude,longitude:p.longitude}};}
else
{params=p;}
success(params);}
provider.getCurrentPosition(_success,error,opts);}}
else if(typeof(window.blackberry)!=u&&blackberry.location.GPSSupported)
{if(typeof(blackberry.location.setAidMode)==u)
{return false;}
blackberry.location.setAidMode(2);getCurrentPosition=function(success,error,opts)
{var bb={success:0,error:0,blackberryTimeoutId:-1};function handleBlackBerryLocationTimeout()
{if(bb.blackberryTimeoutId!=-1)
{bb.error({message:"Timeout error",code:3});}}
bb.success=success;bb.error=error;if(opts['timeout'])
{bb.blackberryTimeoutId=setTimeout("handleBlackBerryLocationTimeout()",opts['timeout']);}
else
{bb.blackberryTimeoutId=setTimeout("handleBlackBerryLocationTimeout()",60000);}
blackberry.location.onLocationUpdate(function()
{clearTimeout(bb.blackberryTimeoutId);bb.blackberryTimeoutId=-1;if(bb.success&&bb.error)
{if(blackberry.location.latitude==0&&blackberry.location.longitude==0)
{bb.error({message:"Position unavailable",code:2});}
else
{var timestamp=null;if(blackberry.location.timestamp)
{timestamp=new Date(blackberry.location.timestamp);}
bb.success({timestamp:timestamp,coords:{latitude:blackberry.location.latitude,longitude:blackberry.location.longitude}});}
bb.success=null;bb.error=null;}});blackberry.location.refreshLocation();}
provider=blackberry.location;}
else if(typeof(Mojo)!=u&&typeof(Mojo.Service.Request)!="Mojo.Service.Request")
{provider=true;getCurrentPosition=function(success,error,opts)
{parameters={};if(opts)
{if(opts.enableHighAccuracy&&opts.enableHighAccuracy==true)
{parameters.accuracy=1;}
if(opts.maximumAge)
{parameters.maximumAge=opts.maximumAge;}
if(opts.responseTime)
{if(pts.responseTime<5)
{parameters.responseTime=1;}
else if(opts.responseTime<20)
{parameters.responseTime=2;}
else
{parameters.timeout=3;}}}
r=new Mojo.Service.Request('palm://com.palm.location',{method:"getCurrentPosition",parameters:parameters,onSuccess:function(p)
{success({timestamp:p.timestamp,coords:{latitude:p.latitude,longitude:p.longitude,heading:p.heading}});},onFailure:function(e)
{if(e.errorCode==1)
{error({code:3,message:"Timeout"});}
else if(e.errorCode==2)
{error({code:2,message:"Position unavailable"});}
else
{error({code:0,message:"Unknown Error: webOS-code"+errorCode});}}});}}
else if(typeof(device)!=u&&typeof(device.getServiceObject)!=u)
{provider=device.getServiceObject("Service.Location","ILocation");getCurrentPosition=function(success,error,opts)
{function callback(transId,eventCode,result)
{if(eventCode==4)
{error({message:"Position unavailable",code:2});}
else
{success({timestamp:null,coords:{latitude:result.ReturnValue.Latitude,longitude:result.ReturnValue.Longitude,altitude:result.ReturnValue.Altitude,heading:result.ReturnValue.Heading}});}}
var criteria=new Object();criteria.LocationInformationClass="BasicLocationInformation";provider.ILocation.GetLocation(criteria,callback);}}
else{provider=false;}
if(provider&&getCurrentPosition)
{getCurrentPosition(success,error,opts);return true;}else{return false}}
catch(e)
{if(typeof(console)!=u)console.log(e);return false;}
return provider!=null;}
return pub;}()},cumulativeScrollOffset:function(element)
{var scrollElement=element;var scrollOffset=[0,0];do{if(scrollElement.nodeName!=='HTML'&&scrollElement.nodeName!=='BODY')
{scrollOffset[0]+=scrollElement.scrollLeft||0;scrollOffset[1]+=scrollElement.scrollTop||0;}
scrollElement=scrollElement.parentNode;}while(scrollElement);return scrollOffset;},addToHiddenHelper:function(element)
{var hidden=$('QHiddenHelper');if(!hidden)
{hidden=QBuilder('div',{id:'QHiddenHelper'});document.body.appendChild(hidden);}
hidden.appendChild($(element));},getSurveySelectMenu:function(opt_filter,opt_action)
{opt_filter=(opt_filter==="")?undefined:opt_filter;if(!opt_action)
{opt_action='PageAction(setActiveSurvey, $surveyId)';}
var items=[];if(Qualtrics.folders&&opt_filter===undefined&&!Object.isArray(Qualtrics.folders['SurveyFolders']))
{for(var folderId in Qualtrics.folders['SurveyFolders'])
{var subMenuItems=[];for(var surveyId in Qualtrics.folders['Surveys'])
{if(typeof Qualtrics.folders['Surveys'][surveyId]=='function')
{continue;}
var containingFolderId=Qualtrics.folders['Surveys'][surveyId]
if(folderId==containingFolderId&&Qualtrics.surveys[surveyId])
{var current_action=opt_action.replace('$surveyId',surveyId);subMenuItems.push({label:Qualtrics.surveys[surveyId],action:current_action,className:'Survey',defer:true});}}
var item={label:Qualtrics.folders['SurveyFolders'][folderId],className:'Folder',submenu:{items:subMenuItems}}
items.push(item);}
items.push({separator:true});}
for(surveyId in Qualtrics.surveys)
{if(!Qualtrics.surveys.hasOwnProperty(surveyId))
{continue;}
var inFolder=Qualtrics.folders&&Qualtrics.folders['Surveys']&&Qualtrics.folders['Surveys'][surveyId];var showMenu=!inFolder;if(opt_filter!==undefined)
{showMenu=(Qualtrics.surveys[surveyId].toLowerCase().indexOf(opt_filter.toLowerCase())!=-1);}
if(showMenu)
{var current_action=opt_action.replace('$surveyId',surveyId);item={label:Qualtrics.surveys[surveyId],action:current_action,className:'Survey',defer:true}
items.push(item);}}
var searchValue=opt_filter||getMessage('EditSection','SearchExistingSurveys')+"...";var surveySelectMenuDef={items:items,searchText:searchValue,search:'QualtricsTools.getSurveySelectMenu($search, '+opt_action+')'}
return surveySelectMenuDef;},surveySelectKeyDownHandler:function(el,evt,callback)
{if(Qualtrics.Navigation.subSection=='Blocks')
{if(evt&&evt.shiftKey&&(evt.ctrlKey||evt.metaKey))
{if(evt.preventDefault)
evt.preventDefault();return QModules.loadModule('supportmode.js');}}
Qualtrics.Menu.showMenu(callback,el,null,evt);},decToHexString:function(dec,includeHash)
{if(typeof dec=='string'&&dec.substr(0,1)=='#')
{return dec;}
var hex=dec.toString(16);hex=QualtricsTools.leftPadString(hex,'0',6);return(includeHash===false?'':'#')+hex.toUpperCase();},hexStringToDec:function(hex)
{return parseInt(QualtricsTools.stripHash(hex),16);},hexStringToRgb:function(hex)
{hex=QualtricsTools.stripHash(hex);var splitHex=hex.match(/.{1,2}/g);var rgb=[];for(var i=0;i<splitHex.length;i++)
{rgb.push(parseInt(splitHex[i],16));}
return rgb;},rgbToHexString:function(rgb,includeHash)
{var hex=(includeHash===false)?'':'#';for(var i=0;i<rgb.length;i++)
{var val=Math.round(rgb[i]);if(val<0)
val=0;else if(val>255)
val=255;val=QualtricsTools.leftPadString(val.toString(16),'0',2);hex+=val.toUpperCase();}
return hex;},hexStringToHsv:function(hex)
{var rgb=QualtricsTools.hexStringToRgb(hex);return QualtricsTools.rgbToHsv(rgb);},hsvToHexString:function(hsv,includeHash)
{var rgb=QualtricsTools.hsvToRgb(hsv);return QualtricsTools.rgbToHexString(rgb,includeHash);},hsvToRgb:function(hsv)
{var rgb=[0,0,0];if(hsv[2]!=0)
{var i=Math.floor(hsv[0]*6);var f=(hsv[0]*6)-i;var p=hsv[2]*(1-hsv[1]);var q=hsv[2]*(1-(hsv[1]*f));var t=hsv[2]*(1-(hsv[1]*(1-f)));switch(i)
{case 1:rgb[0]=q;rgb[1]=hsv[2];rgb[2]=p;break;case 2:rgb[0]=p;rgb[1]=hsv[2];rgb[2]=t;break;case 3:rgb[0]=p;rgb[1]=q;rgb[2]=hsv[2];break;case 4:rgb[0]=t;rgb[1]=p;rgb[2]=hsv[2];break;case 5:rgb[0]=hsv[2];rgb[1]=p;rgb[2]=q;break;case 6:case 0:rgb[0]=hsv[2];rgb[1]=t;rgb[2]=p;break;}}
for(var index=0;index<rgb.length;index++)
{rgb[index]*=256;}
return rgb;},rgbToHsv:function(rgb)
{var max=rgb.max();var min=rgb.min();var hsv=[0,0,(max/256)];if(min!=max)
{var delta=max-min;hsv[1]=delta/max;if(rgb[0]==max)
{hsv[0]=(rgb[1]-rgb[2])/delta;}
else if(rgb[1]==max)
{hsv[0]=2+((rgb[2]-rgb[0])/delta);}
else
{hsv[0]=4+((rgb[0]-rgb[1])/delta);}
hsv[0]/=6;if(hsv[0]<0)
{hsv[0]+=1;}
if(hsv[0]>1)
{hsv[0]-=1;}}
return hsv;},stripHash:function(hex)
{return(hex.substr(0,1)=='#')?hex=hex.substr(1):hex;},leftPadString:function(string,pad,length)
{while(string.length<length)
{string=pad+string;}
return string;},getColorComplement:function(color)
{if(typeof color=='number')
{color=QualtricsTools.decToHexString(color,true);}
var hasHash=(color.substr(0,1)=='#');var hsv=QualtricsTools.hexStringToHsv(color);if(hsv[2]==0)
{hsv[2]=0.999;}
else if(hsv[2]<0.3)
{hsv[2]*=1.8;}
else
{hsv[2]*=0.2;}
return QualtricsTools.hsvToHexString(hsv,hasHash);}}
window.getPageSize=QualtricsTools.getPageSize;function deleteChildren(node)
{if(node)
{if(!Qualtrics.Browser.IE)
{node.innerHTML="";}
else
{for(var x=node.childNodes.length-1;x>=0;--x)
{var childNode=node.childNodes[x];if(childNode.onmouseover)
{childNode.onmouseover=null;}
if(childNode.onmouseout)
{childNode.onmouseout=null;}
if(childNode.onmousedown)
{childNode.onmousedown=null;}
if(childNode.onclick)
{childNode.onclick=null;}
if(childNode.hasChildNodes()){deleteChildren(childNode);}
node.removeChild(childNode);if(childNode.outerHTML){childNode.outerHTML='';}
childNode=null;}
node=null;}}}
var QualtricsSETools={highlightOn:false,killHighlight:false,highlightRegistry:[],unHighlightAll:function()
{for(var i=0,len=QualtricsSETools.highlightRegistry.length;i<len;++i)
{var questionNode=QualtricsSETools.highlightRegistry[i];$(questionNode).removeClassName('Highlight');questionNode=null;}
QualtricsSETools.highlightRegistry=[];},highlightHandler:function(evt)
{QualtricsSETools.unHighlightAll();if(QualtricsSETools.highlightOn==true)
{var clickedEl=Event.element(evt);var questionNode=QualtricsTools.fastUp(clickedEl,'QuestionOuter');if(questionNode)
{QualtricsSETools.highlightRegistry.push(questionNode);$(questionNode).addClassName('Highlight');}
questionNode=null;clickedEl=null;}},questionHighlighter:function()
{if(!this.highlightOn)
{Event.observe(document,'mousedown',QualtricsSETools.highlightHandler);if(!this.killHighlight)
this.highlightOn=true;}},killHighlighter:function()
{this.killHighlight=true;},scrollToDiv:function(id)
{new Effect.ScrollTo(id,{afterFinish:function(){try{var p=$(id);found=false;while(!found)
{p=$(p.nextSibling);if(p==null)
found=true;else if(p.hasClassName&&p.hasClassName('QuestionOuter'))
found=true;}
if(p)
{new Effect.Highlight(p);}}
catch(e)
{console.error(e);}}});},replaceButtons:function()
{var next=$('NextButton');var save=$('SaveButton');var prev=$('PreviousButton');var jump=$('JumpButton');var parentNode=next?next.parentNode:(prev?prev.parentNode:null);if(parentNode)
{var innerHTML="<input type=hidden id='buttonPressed' name='' value='1' />";if(next)
{innerHTML+="<button style=\"display: none;\" id=\"submitPageFeauBTN\" type=\"submit\"></button>"+"<div tabindex='0' id='NextButton' role='button' aria-labelledby='NextLabel' onkeypress=\"if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, 'NextButton'); };  \" onclick=\"if(!this.disabled){Qualtrics.SurveyEngine.navClick(this, 'NextButton'); };  \">"
+"<label id='NextLabel' class='offScreen'>Next</label><span class='ButtonLeft'></span><span class='ButtonText' id='NextButtonText'>"+next.value+"</span><span class='ButtonRight'></span></div>";}
if(save)
{innerHTML+="<button style=\"display: none;\" id=\"submitPageFeauBTN\" type=\"submit\"></button>"+"<div tabindex='0' id='SaveButton' role='button' aria-labelledby='SaveLabel' onkeypress=\"if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, 'SavePageButton'); };  \" onclick=\"if(!this.disabled){Qualtrics.SurveyEngine.navClick(this, 'SavePageButton'); };  \">"
+"<label id='SaveLabel' class='offScreen'>Save</label><span class='ButtonLeft'></span><span class='ButtonText' id='SaveButtonText'>"+save.value+"</span><span class='ButtonRight'></span></div>";}
if(prev)
{innerHTML+="<button style=\"display: none;\" id=\"submitPageFeauBTN\" type=\"submit\"></button>"+"<div tabindex='0' id='PreviousButton' role='button' aria-labelledby='PreviousLabel' onkeypress=\"if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, 'PreviousButton'); };  \" onclick=\"if(!this.disabled){Qualtrics.SurveyEngine.navClick(this, 'PreviousButton');};  \">"
+"<label id='PreviousLabel' class='offScreen' >Previous</label><span class='ButtonLeft'></span><span class='ButtonText' id='PreviousButtonText'>"+prev.value+"</span><span class='ButtonRight'></span></div>";}
if(jump)
{innerHTML+="<button style=\"display: none;\" id=\"submitPageFeauBTN\" type=\"submit\"></button>"+"<div tabindex='0' class='"+jump.className+"' id='JumpButton' role='button' aria-labelledby='JumpLabel' onkeypress=\"if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, 'JumpButton'); };  \" onclick=\"if(!this.disabled){Qualtrics.SurveyEngine.navClick(this, 'JumpButton'); };  \">"
+"<label id='JumpLabel' class='offScreen'>Table of Contents</label><span class='ButtonLeft'></span><span class='ButtonText' id='JumpButtonText'>"+jump.value+"</span><span class='ButtonRight'></span></div>";innerHTML+="<input type='hidden' value='' name='JumpIndex' id='JumpIndex'>";}
parentNode.innerHTML=innerHTML;return;if(next)
{parentNode.removeChild(next);var newNext=QBuilder('button',{type:'submit',id:'NextButton'},[QBuilder('span',{className:'ButtonLeft'}),QBuilder('span',{className:'ButtonText'},[next.value]),QBuilder('span',{className:'ButtonRight'})]);parentNode.appendChild(newNext);newNext.onclick=function()
{$('buttonPressed').name='NextButton';};}
if(prev)
{parentNode.removeChild(prev);var newPrev=QBuilder('button',{type:'submit',id:'PreviousButton'},[QBuilder('span',{className:'ButtonLeft'}),QBuilder('span',{className:'ButtonText'},[prev.value]),QBuilder('span',{className:'ButtonRight'})]);parentNode.appendChild(newPrev);newPrev.onclick=function()
{$('buttonPressed').name='PreviousButton';};}}}};var QHeatMap=Class.create({clickedPoint:null,clickCounter:1,clickHistory:1,maxClicks:1,id:null,initialize:function(id,opt_maxClicks)
{this.id=id;var that=this;if(opt_maxClicks)
this.maxClicks=opt_maxClicks;this.clickdownFunction=this.clickdown.bind(this);this.clickupFunction=this.clickup.bind(this);Event.observe($(this.id+"_Container"),'mousedown',that.clickdownFunction);Event.observe($(this.id+"_Container"),'mouseup',that.clickupFunction);this.imageContainer=$(this.id+"_Container");this.image=$(this.id);this.image.onload=this.imageLoaded.bind(this);},imageLoaded:function()
{try
{if($F(this.id+'_ClickY')&&$F(this.id+'_ClickX'))
{this.presetPoint($F(this.id+'_ClickX'),$F(this.id+'_ClickY'));}}
catch(e)
{}
try
{for(var click=1;click<=this.maxClicks;click++)
{if($F(this.id+'_Click_'+click))
{var xy=$F(this.id+'_Click_'+click).split(",");this.presetPoint(xy[0],xy[1]);}}}
catch(e)
{}},clickdown:function(event)
{Event.stop(event);},drawCrossHair:function()
{var height=$(this.image).offsetHeight;var width=$(this.image).offsetWidth;var horiz=QBuilder('div',{id:this.id+'_chh_'+this.clickCounter,className:'chh'},' ');var vert=QBuilder('div',{id:this.id+'_chv_'+this.clickCounter,className:'chv'},' ');$(horiz).setStyle({width:width+'px',top:'0px',left:'0px',opacity:0.6});$(vert).setStyle({height:height+'px',top:'0px',left:'0px',opacity:0.6});$(this.imageContainer).appendChild(horiz);$(this.imageContainer).appendChild(vert);},setPoint:function(event)
{if(!event)event=window.event;var pointerX=event.offsetX||event.layerX;var pointerY=event.offsetY||event.layerY;var element=Event.element(event);if(element.id.startsWith(this.id+'_chh'))
{pointerY=element.offsetTop;}
if(element.id.startsWith(this.id+'_chv'))
{pointerX=element.offsetLeft;}
var pointID=this.id+"_Point_"+this.clickCounter;var realX=pointerX;var realY=pointerY;this.clickedPoint=this.generatePoint(pointID,realX,realY);this.imageContainer.appendChild(this.clickedPoint);return[realX,realY];},generatePoint:function(id,x,y)
{if(!$(id))
{var point=QBuilder('div',{id:id,className:'point'});this.imageContainer.appendChild(point);}
else
{point=$(id);}
point.setStyle({top:y-2+'px',left:x-2+'px'});point.setAttribute('x',x);point.setAttribute('y',y);return point;},presetPoint:function(x,y)
{var pointID=this.id+"_Point_"+this.clickCounter;var realX=x;var realY=y;this.clickedPoint=this.generatePoint(pointID,realX,realY);var loc=[realX,realY];if(!$(this.id+'_chh_'+this.clickCounter))
{this.drawCrossHair();}
new Effect.Morph(this.id+'_chh_'+this.clickCounter,{transition:this.EaseFrom,duration:0.5,style:{top:loc[1]+'px'}});new Effect.Morph(this.id+'_chv_'+this.clickCounter,{transition:this.EaseFrom,duration:0.5,style:{left:loc[0]+'px'}});this.recordClick();this.clickCounter=(this.clickCounter%this.maxClicks)+1;this.clickedPoint=null;},clickup:function(event)
{if(!event)event=window.event;var element=Event.element(event);var loc=this.setPoint(event);if(!$(this.id+'_chh_'+this.clickCounter))
{this.drawCrossHair();}
new Effect.Morph(this.id+'_chh_'+this.clickCounter,{transition:this.EaseFrom,duration:0.5,style:{top:loc[1]+'px'}});new Effect.Morph(this.id+'_chv_'+this.clickCounter,{transition:this.EaseFrom,duration:0.5,style:{left:loc[0]+'px'}});this.recordClick();this.clickCounter=(this.clickCounter%this.maxClicks)+1;this.clickedPoint=null;},EaseFrom:function(pos){return Math.pow(pos,2);},recordClick:function()
{if(this.clickedPoint)
{var pointID=this.clickedPoint.id;var x=this.clickedPoint.getAttribute('x');var y=this.clickedPoint.getAttribute('y');try
{var clickData=$(this.id+'_Click_'+this.clickCounter);clickData.value=x+","+y;}
catch(e)
{var clickX=$(this.id+'_ClickX');var clickY=$(this.id+'_ClickY');clickX.value=x;clickY.value=y;}}}});var QHotSpot={selectRegion:function(selector,postTagChoiceId)
{console.log('toggling choice:'+postTagChoiceId);if(selector=='OnOff')
{if($(postTagChoiceId).value==1)
{$(postTagChoiceId).value=2;$(postTagChoiceId+'-Region').addClassName('Like');}
else
{$(postTagChoiceId).value=1;$(postTagChoiceId+'-Region').removeClassName('Like');}}
else if(selector=='LikeDislike')
{$(postTagChoiceId+'-Region').removeClassName('Like');$(postTagChoiceId+'-Region').removeClassName('Dislike');if($(postTagChoiceId).value==1)
{$(postTagChoiceId).value=2;}
else if($(postTagChoiceId).value==2)
{$(postTagChoiceId).value=3;$(postTagChoiceId+'-Region').addClassName('Like');}
else
{$(postTagChoiceId).value=1;$(postTagChoiceId+'-Region').addClassName('Dislike');}}
else
{console.log("WARNING: HotSpot.tpl::Unknown selector: '+selector+'");}},autoSizeRegions:function(imgId)
{var img=$(imgId);if(img)
{var hotSpotContainer=img.parentNode;if(hotSpotContainer&&hotSpotContainer.getAttribute('hotspotwidth'))
{var originalDimensions=[hotSpotContainer.getAttribute('hotspotwidth'),hotSpotContainer.getAttribute('hotspotheight')];var currentDimensions=[img.offsetWidth,img.offsetHeight];var ratio=[currentDimensions[0]/originalDimensions[0],currentDimensions[1]/originalDimensions[1]];if(ratio[0]!=1||ratio[1]!=1)
{var children=$(hotSpotContainer).childElements();var regions=[];for(var i=0,len=children.length;i<len;++i)
{if(children[i].nodeName=='A')
{regions.push(children[i]);QHotSpot.adjustRegion(children[i],ratio);}}}}}},adjustRegion:function(regionNode,ratio)
{$(regionNode).setStyle({left:regionNode.offsetLeft*ratio[0]+'px',top:regionNode.offsetTop*ratio[1]+'px'});var innerInner=$(regionNode).down('.RegionInnerInner');if(innerInner)
{$(innerInner).setStyle({width:innerInner.offsetWidth*ratio[0]+'px',height:innerInner.offsetHeight*ratio[1]+'px'});}}};var QHotSpot2={createRegionEditor:function(holderEl,regions,postTag,selector,visibility,size)
{var options={selectable:true,enableDescriptions:false,onSelect:QHotSpot2.selectRegion,style:{}};if(selector=="OnOff")
{options.selectionStates=[{fill:'rgb(0, 0, 0)','fill-opacity':0,iconSrc:null},{fill:'rgb(0%, 100%, 0%)','fill-opacity':.3,iconSrc:null}];}
else
{options.selectionStates=[{fill:'rgb(100%, 0%, 0%)','fill-opacity':.3,iconSrc:"../WRQualtricsShared/Graphics/icons/x_trans.png"},{fill:'rgb(0, 0, 0)','fill-opacity':0,iconSrc:null},{fill:'rgb(0%, 100%, 0%)','fill-opacity':.3,iconSrc:"../WRQualtricsShared/Graphics/icons/check_trans.png"}];}
if(visibility=="HiddenUntilHover"||!visibility)
{options.style.shape={stroke:"none",'stroke-opacity':0,'stroke-width':.75,fill:"none"};options.style.shapeHover={stroke:"#000",'stroke-opacity':1,'stroke-width':1.5};options.style.shapeGlowOpacity=0;}
var ret=new Qualtrics.RegionEditor(holderEl,null,regions,options);ret.postTag=postTag;if(!window.Raphael||!Raphael.type)
ret.element.setStyle({display:'block'});ret.render();Event.observe(window,"load",QHotSpot2.renderRegion.curry(postTag,size));this.readSelectionsFromInputs(ret);return ret;},readSelectionsFromInputs:function(editor)
{var regions=editor.getRegions();for(var regionId=0;regionId<regions.length;++regionId)
{var v=+$("QR~"+editor.postTag+"~"+regions[regionId].ChoiceID).value;editor.selectRegion(regionId,v-1);}},renderRegion:function(postTag,originalSize)
{var re=window.regionEditors[postTag];var img=$("HotSpot_"+postTag+"_Image");var layout=new Element.Layout(img);re.element.setStyle(layout.toCSS());re.rescaleRegions(originalSize,{w:layout.get('width'),h:layout.get('height')});re.render();re.element.setStyle({display:'block'});},selectRegion:function(editor,regionId)
{var choiceId=editor.getRegionProperty(regionId,"ChoiceID");$("QR~"+editor.postTag+"~"+choiceId).value=editor.selectedRegions[regionId]+1;}};if(Qualtrics.ofcData==undefined)
Qualtrics.ofcData={};if(Qualtrics.ofcImages==undefined)
Qualtrics.ofcImages={};Qualtrics.ofcGetData=function(id)
{return Qualtrics.ofcData[id];}
function ofc_ready(chart_id)
{Element.fire(document,"OFC:ofc_ready_"+chart_id[0]);}
function ofc_stoped_animating(chart_id)
{Element.fire(document,"Event:ofc_stoped_animating_"+chart_id[0]);}
function save_image(imageId)
{imageId=imageId[0];var eId=$(imageId).getAttribute('eid');var vId=$(imageId).getAttribute('vid');var filename=$(imageId).getAttribute('graphName')+".png";var binary=$(imageId).get_img_binary();new Ajax.Request('Ajax.php?action=SaveFlashImage',{parameters:{imageBinary:binary,vid:vId,eid:eId},onSuccess:function(transport){var link=transport.responseText;window.location='File.php?flashImage=true&F='+link+'&filename='+filename;}});}
function saveFlashImages(options)
{if(!options)
options={};if(Object.keys(Qualtrics.ofcImages).size()<=0)
{if(options&&options.onComplete)
options.onComplete();}
else
{var params;if(!options.url)
options.url="Ajax.php";if(options.reportId)
params="&ReportID="+options.reportId;else
params='';var binary=Object.toJSON(Qualtrics.ofcImages);new Ajax.Request(options.url+"?action=saveFlashImages"+params,{method:'post',parameters:{'binary':binary},onComplete:function()
{msg('Saving Flash Images...');Qualtrics.ofcImages={};if(options.onComplete)
options.onComplete();}});}}
function changePagePosition(foreward,pageCount)
{if(!Qualtrics.currentReportPage)
{Qualtrics.currentReportPage=0;}
var curPage=Qualtrics.currentReportPage;$('page'+curPage).toggleClassName('visible');if(foreward)
{curPage=(curPage<pageCount-1)?curPage+1:0;}
else
{curPage=(curPage>0)?curPage-1:pageCount-1;}
$('page'+curPage).toggleClassName('visible');$('pageNumberDisplay').update(curPage+1);Qualtrics.currentReportPage=curPage;}
function addReportNavigator(pageCount)
{return QBuilder('div',{id:'ReportNavigator'},[QBuilder('div',{},[QBuilder('a',{className:'qbutton',clickcallback:'changePagePosition',p1:false,p2:pageCount},[QBuilder('span',{className:'icon previous'})]),QBuilder('span',{id:'pageNumberDisplay'},1),QBuilder('a',{className:'qbutton',clickcallback:'changePagePosition',p1:true,p2:pageCount},[QBuilder('span',{className:'icon next'})])])]);}
FileUploader={prevFileID:'',buildFileUploadIFrame:function(qID,maxSize)
{var iframe=Builder.node('iframe',{id:'FileUploader',scrolling:'no',name:'FileUploader',frameBorder:0,src:'blank.html'});$(iframe).setStyle({width:'0px',height:'0px'});var fileField=QBuilder('input',{id:'fileField',type:'file',size:'48',name:'fileField',autocomplete:'off',qid:qID});var form=QBuilder('form',{id:'fileUploadForm',enctype:'multipart/form-data',method:'post',action:'Ajax.php?action=uploadRFile',target:'FileUploader'},[QBuilder('div',{className:'inputContainer'},[QBuilder('div',{className:'fileInputContainer',id:'fileInputContainer'},[QBuilder('input',{type:'hidden',value:maxSize,name:'MAX_FILE_SIZE'}),fileField])]),QBuilder('input',{type:'hidden',id:'QID',name:'QID',value:qID})]);var frameDiv=QBuilder('div',{},[form,iframe]);$('fIFrame~'+qID).contentWindow.document.write(frameDiv.innerHTML);$('fIFrame~'+qID).contentWindow.document.body.style.background='transparent';new Form.Element.Observer($('fIFrame~'+qID).contentWindow.document.getElementById('fileField'),0.2,FileUploader.clearOldAndSubmit);},clearOldAndSubmit:function(el,value)
{var qid=el.getAttribute('qid');if($('fileInfo~'+qid))
$('fileInfo~'+qid).remove();$('Filename~'+qid).value='';$('TmpFilepath~'+qid).value='';$('FileType~'+qid).value='';$('Size~'+qid).value='';$('loadingImage~'+qid).show();$('loadingError~'+qid).hide();$('fileInfoCont~'+qid).hide();if(value!='')
{$('fIFrame~'+qid).contentWindow.document.getElementById('fileUploadForm').submit();if(/AppleWebKit|MSIE/.test(navigator.userAgent)){new Ajax.Request("blank.html",{asynchronous:false});}}},fail:function(qid,errorMsg)
{$('fileInfoCont~'+qid).hide();if($('fileInfo~'+qid))
$('fileInfo~'+qid).remove();if(errorMsg)
$('loadingError~'+qid).innerHTML=errorMsg;$('loadingImage~'+qid).hide();$('loadingError~'+qid).show();$('Filename~'+qid).value='';$('TmpFilepath~'+qid).value='';$('FileType~'+qid).value='';$('Size~'+qid).value='';},uploadOnload:function(qID,fileData)
{if(fileData.errors&&fileData.errors!='')
{this.fail(qID,fileData.errors);return;}
$('loadingImage~'+qID).hide();$('loadingError~'+qID).hide();$('Filename~'+qID).value=fileData.origFilename;$('TmpFilepath~'+qID).value=fileData.fullpath;$('FileType~'+qID).value=fileData.type;$('Size~'+qID).value=fileData.size;$('fileInfoCont~'+qID).show();var filePreview=QBuilder('tr',{id:'filePreviewRow~'+qID},[QBuilder('td',{className:'right'},[QBuilder('img',{id:'imagePreviewRow~'+qID,src:'File.php?F='+fileData.fullpath+'&filePreview=true&PrevID='+this.prevFileID,className:'filePreview',onerror:'$(this).hide();'})])]);var nameInfo=QBuilder('tr',{id:'filenameInfoRow~'+qID},[QBuilder('td',{className:'right'},fileData.origFilename)])
var size=fileData.size;var sizeTag='B';if(size>1024)
{size/=1024;sizeTag='KB';}
if(size>1024)
{size/=1024;sizeTag='MB';}
var sizeInfo=QBuilder('tr',{id:'sizeInfoRow~'+qID},[QBuilder('td',{className:'right'},(Math.round(size*10)/10)+sizeTag)]);var typeInfo=QBuilder('tr',{id:'typeInfoRow~'+qID},[QBuilder('td',{className:'right'},fileData.type)]);var fileInfo=QBuilder('table',{className:'fileInfo',id:'fileInfo~'+qID},[QBuilder('tbody',{},[filePreview,nameInfo,sizeInfo,typeInfo])]);$('fileInfoCont~'+qID).appendChild(fileInfo);}};Qualtrics.objToHideButton=function(o,header)
{if(!header)
header='';var showButton=QBuilder('input',{type:'button',value:'show'});var hideButton=QBuilder('input',{type:'button',value:'hide'});var obj=QBuilder('div',{},[QBuilder('pre',{},Qualtrics.objToString(o))]);var inner=QBuilder('div',{},[header,obj,hideButton]);$(inner).hide();Event.observe(hideButton,'click',function(){$(inner).hide();showButton.value='show';});Event.observe(showButton,'click',function(){if(showButton.value=='show')
{showButton.value='hide';$(inner).show();}
else
{showButton.value='show';$(inner).hide();}});var container=QBuilder('div',{},[showButton,inner]);return container;}
Qualtrics.objToString=function(obj,tab)
{tab=tab||0;var ret='';if(Object.isArray(obj))
obj=obj.toObject();for(var id in obj)
{ret+='\t'.times(tab);ret+=(id+' => ');if(typeof obj[id]=='object')
{ret+='\n';ret+=Qualtrics.objToString(obj[id],tab+1);}
else
{ret+=String(obj[id]);}
ret+='\n';}
return ret;}
function isNumeric(input)
{input=input.replace(/,/g,'');return(input-0)==input&&input.length>0;}
// (C) 2007-2013 Qualtrics, Inc.

Qualtrics.SurveyEngine={registry:{},getInstance:function(id)
{return this.registry[id];},addOnload:function(f)
{if($('body')&&$('body').hasClassName('EditSection'))
return;try
{var obj=new Qualtrics.SurveyEngine.QuestionData();obj.onload=f;Event.observe(window,'load',obj.onload.bind(obj));}
catch(e)
{console.error('SE API Error: '+e);}},setAccessibleSkin:function()
{console.log('Changing skin....');this.addEmbeddedData('ED~Q_Skin','Qualtrics|MQ|Accessible');window.noSEAutoSave=true;submitForm('Page');},addEmbeddedData:function(key,value)
{$('Page').appendChild(QBuilder('input',{type:'hidden',name:key,value:value}));},setEmbeddedData:function(key,value)
{var fieldName='ED~'+key;if($(fieldName))
{$(fieldName).value=value;}
else
{$('Header').appendChild(QBuilder('input',{type:'hidden',id:fieldName,name:fieldName,value:value}));}},getEmbeddedData:function(key)
{var fieldName='ED~'+key;if($(fieldName))
{return $(fieldName).value;}},globalKeyDownHandler:function(evt)
{if(document.body.id=='SurveyEngineBody')
{if(!evt){evt=window.event}
var el=Event.element(evt);if(el&&el.getAttribute)
Qualtrics.alphaNumericValidation(el,evt);var isButton=el.tagName=='BUTTON'||(el.tagName=='INPUT'&&el.type=='button')||(el.id=='NextButton'||el.id=='PreviousButton');if(evt.keyCode==Event.KEY_RETURN&&el.tagName!='TEXTAREA'&&!isButton)
{Event.stop(evt);}}},globalKeyUpHandler:function(evt)
{if(!evt){evt=window.event}
var el=Event.element(evt);if(el.getAttribute('validation'))
{Qualtrics.alphaNumbericInputFilter(evt,el);}},displayErrorMessage:function(msg){alert(msg);},navEnter:function(e,el,opt_buttonName,opt_confirmValidation,jumpIndex)
{e=e||window.event;if(e.keyCode==Event.KEY_RETURN||e.charCode==32)
{Qualtrics.SurveyEngine.navClick(el,opt_buttonName,opt_confirmValidation,jumpIndex);}},navClick:function(el,opt_buttonName,opt_confirmValidation,jumpIndex)
{var event=null;if(el&&!el.nodeName)
{event=el;el=Event.element(el);}
if(el&&el.getAttribute&&el.getAttribute('confirmed'))
{opt_confirmValidation=true;}
if(opt_buttonName=='NextButton'||opt_buttonName=='PreviousButton'||opt_buttonName=='JumpButton')
{window.noSEAutoSave=true;}
if(opt_buttonName=='NextButton'&&Qualtrics.SurveyPage&&Qualtrics.SurveyPage.getInstance())
{var surveyPage=Qualtrics.SurveyPage.getInstance();var info=surveyPage.getValidationInfo();if(info.frontEndValidation&&info.valid==false)
{if(!opt_confirmValidation&&!Qualtrics.SurveyPage.getInstance().validatePage())
{if(event)
{Event.stop(event);}
return false;}}
if(Qualtrics.SurveyPage.getInstance().validate)
{if(!opt_confirmValidation&&!Qualtrics.SurveyPage.getInstance().validate())
{if(event)
{Event.stop(event);}
return false;}}}
if(opt_buttonName=='JumpButton')
{if(jumpIndex)
{console.log(jumpIndex);$('JumpIndex').value=jumpIndex;}
else if($('JumpIndex').value=='')
$('JumpIndex').value=-1;}
if(opt_buttonName&&$('buttonPressed'))
{$('buttonPressed').name=opt_buttonName;$('submitPageFeauBTN').click();}
else if(opt_buttonName&&$(opt_buttonName))
{$(opt_buttonName).setAttribute('confirmed',true);$(opt_buttonName).click();}
try{if(el)
{(function(){el.disabled=true;}).defer();(function(){el.disabled=false;}).delay(10);}}catch(e)
{}},restartResponse:function()
{window.noSEAutoSave=true;$('Page').appendChild(QBuilder('input',{hidden:'true',value:'true',name:'RestartResponse'}));submitForm('Page');}};Qualtrics.SurveyEngine.QuestionInfo={};Qualtrics.SurveyEngine.QuestionData=Class.create({initialize:function(opt_questionId)
{var el=null;if(opt_questionId)
{this.questionContainer=$(opt_questionId);}
if(!this.questionContainer)
{var d=document.getElementsByTagName('script');el=d[d.length-1];this.questionContainer=$(el).up('.QuestionOuter')||$(el).up('question');}
if(this.questionContainer)
{this.questionId=this.questionContainer.getAttribute('questionid')||this.questionContainer.getAttribute('posttag');this.addOnClick();Qualtrics.SurveyEngine.registry[this.questionId]=this;}},addOnClick:function()
{this.questionclick=function(){};var that=this;Event.observe(this.questionContainer,'click',(function(event){that.questionclick(event,Event.element(event));}).bind(this));},disableNextButton:function()
{if($('NextButton'))
$('NextButton').disabled=true;},enableNextButton:function()
{if($('NextButton'))
$('NextButton').disabled=false;},showNextButton:function()
{if($('NextButton'))
$('NextButton').show();},hideNextButton:function()
{if($('NextButton'))
$('NextButton').hide();},clickNextButton:function()
{var nextButton=$('NextButton');if(nextButton&&nextButton.click)
nextButton.click();else if(nextButton&&nextButton.onclick)
nextButton.onclick();},disablePreviousButton:function()
{if($('PreviousButton'))
$('PreviousButton').disabled=true;},enablePreviousButton:function()
{if($('PreviousButton'))
$('PreviousButton').disabled=false;},showPreviousButton:function()
{if($('PreviousButton'))
$('PreviousButton').show();},hidePreviousButton:function()
{if($('PreviousButton'))
$('PreviousButton').hide();},clickPreviousButton:function()
{var previousButton=$('PreviousButton');if(previousButton&&previousButton.click)
previousButton.click();else if(previousButton&&previousButton.onclick)
previousButton.onclick();},hideChoices:function()
{var choices=this.getChoiceContainer();if($(choices))
$(choices).hide();},getQuestionContainer:function()
{return this.questionContainer;},getQuestionTextContainer:function()
{return $(this.questionContainer).down('.QuestionText');},getChoiceContainer:function()
{return $(this.questionContainer).down('.ChoiceStructure');},getInput:function(choiceId,answerId,opt_returnArray)
{var postTag=this.getPostTag()||this.questionId;var inputName='QR~'+postTag+((!choiceId!==null&&choiceId!==undefined)?('~'+choiceId):'');var questionType=$('QR~'+postTag+'~QuestionType');var questionSelector=$('QR~'+postTag+'~Selector');if(questionType&&questionType.value==='MC'&&questionSelector&&(questionSelector.value==='DL'||questionSelector.value==='SB'))
{inputName='QR~'+postTag;}
var valueName=inputName+((answerId!==null&&answerId!==undefined)?'~'+answerId:'');var input=null;if($(inputName)&&$(inputName).id==inputName&&($(inputName).nodeName=='INPUT'||$(inputName).nodeName=='TEXTAREA'||$(inputName).nodeName=='SELECT'))
{input=$(inputName);}
else if($(valueName)&&($(valueName).nodeName=='INPUT'||$(valueName).nodeName=='TEXTAREA'||$(valueName).nodeName=='SELECT'))
{input=$(valueName);}
else if($('Select~'+postTag))
{input=$('Select~'+postTag);}
else if($(valueName+'~TEXT'))
{input=$(valueName+'~TEXT');}
else
{if($('Page')[inputName])
{var control=$('Page')[inputName];if(!control.getAttribute)
{for(var i=0,ilen=control.length;i<ilen;i++)
{if(control[i].value==valueName)
{input=control[i];return input;}}
if(opt_returnArray)
{return control;}}
else
{input=control;}}}
return input;},setChoiceValueByRecodeValue:function()
{var choiceIds=this.getChoicesFromRecodeValue(arguments[0]);console.log('ChoicesIds',choiceIds);for(var i=0,ilen=choiceIds.length;i<ilen;i++)
{var cid=choiceIds[i];if(arguments.length==3)
{this.setChoiceAnswerValue(cid,arguments[1],arguments[2]);}
else
{this.setChoiceAnswerValue(cid,null,arguments[1]);}}},setChoiceValueByVariableName:function()
{var choiceIds=this.getChoicesFromVariableName(arguments[0]);for(var i=0,ilen=choiceIds.length;i<ilen;i++)
{var cid=choiceIds[i];if(arguments.length==3)
{this.setChoiceAnswerValue(cid,arguments[1],arguments[2]);}
else
{this.setChoiceAnswerValue(cid,null,arguments[1]);}}},setChoiceValue:function()
{if(arguments.length==3)
{this.setChoiceAnswerValue(arguments[0],arguments[1],arguments[2]);}
else
{this.setChoiceAnswerValue(arguments[0],null,arguments[1]);}},setChoiceAnswerValue:function(choiceId,answerId,value)
{var input=this.getInput(choiceId,answerId);if(input&&(input.getAttribute('type')||input.tagName))
{var inputType=input.getAttribute('type')||input.tagName;switch(inputType)
{case'checkbox':case'radio':input.checked=value;input.defaultChecked=value;var postTag=this.getPostTag()||this.questionId;var questionInfo=this.getQuestionInfo();if(questionInfo['QuestionType']=='Matrix')
{exclusiveAnswerCheck('QR~'+postTag,'QR~'+postTag+'~'+choiceId,answerId);exclusiveChoiceCheck('QR~'+postTag,'QR~'+postTag+'~'+choiceId,choiceId,answerId);}
else if(questionInfo['QuestionType']=='MC')
{exclusiveAnswerCheck('QR~'+postTag,'QR~'+postTag,choiceId);exclusiveChoiceCheck('QR~'+postTag,'QR~'+postTag,choiceId,choiceId);}
break;case'SELECT':var postTag=this.getPostTag()||this.questionId;var valueName='QR~'+postTag+'~'+choiceId+(answerId!==null?'~'+answerId:'');for(var i=0,iLen=input.options.length;i<iLen;i++)
{if(input.options[i].value==valueName)
{var questionType=$('QR~'+postTag+'~QuestionType');var questionSelector=$('QR~'+postTag+'~Selector');if(questionType&&questionType.value==='MC'&&questionSelector&&(questionSelector.value==='DL'||questionSelector.value==='SB'))
{input.value=input.options[i].value;}
else
{input.options[i].setAttribute('selected',true);}}}
break;default:var postTag=this.getPostTag()||this.questionId;var questionType=$('QR~'+postTag+'~QuestionType');if(questionType&&questionType.value==='Slider')
{var slider=window['CS_'+postTag];var barTag=postTag+'~'+choiceId;if(slider&&slider.snapToGrid)
{value=(Math.round((value/100)*slider.gridLines)/slider.gridLines)*100;}
slider.sliders[barTag].setValue(value/100);}
input.value=value;break;}
return true;}
return false;},getChoiceValue:function(choiceId,subId)
{var ret=false;var input=this.getInput(choiceId,null,true);if(input&&input.getAttribute&&(input.getAttribute('type')||input.tagName))
{var inputType=input.getAttribute('type')||input.tagName;switch(inputType)
{case'checkbox':case'radio':ret=input.checked;break;case'SELECT':var postTag=this.getPostTag()||this.questionId
var valueName='QR~'+postTag+'~'+choiceId+(subId?'~'+subId:'');ret=input.options[input.selectedIndex].value==valueName;break;default:ret=input.value;break;}}
else if(input&&input.length)
{for(var i=0,ilen=input.length;i<ilen;i++)
{if(input[i].checked)
{return input[i].value;}}}
return ret;},getTextValue:function(opt_choiceId)
{var input=null;if(opt_choiceId)
{var input=this.getInput(opt_choiceId+'~TEXT',null);}
else
{var input=this.getInput();}
if(input)
{return input.value;}},getChoiceAnswerValue:function(choiceId,answerId,subId)
{var ret=null;var input=this.getInput(choiceId,answerId);if(input&&(input.getAttribute('type')||input.tagName))
{var inputType=input.getAttribute('type')||input.tagName;switch(inputType)
{case'checkbox':case'radio':ret=input.checked;break;case'SELECT':var postTag=this.getPostTag()||this.questionId
var valueName='QR~'+postTag+'~'+choiceId+(subId?'~'+subId:'');ret=input.options[input.selectedIndex].value==valueName;break;default:ret=input.value;break;}}
return ret;},getQuestionDisplayed:function()
{var questionIsHidden=this.questionContainer.getAttribute('hiddenbyinpagedisplaylogic')=='true'?true:false;return!questionIsHidden;},getChoiceDisplayed:function(choiceId,answerId,subId)
{var questionIsHidden=this.questionContainer.getAttribute('hiddenbyinpagedisplaylogic')=='true'?true:false;if(questionIsHidden)
{return false;}
var input=this.getInput(choiceId,answerId);if(input)
{if(subId)
{if(input.options[subId])
{return true;}}
else
{return true;}}
return false;},getQuestionInfo:function()
{if(Qualtrics.SurveyEngine&&Qualtrics.SurveyEngine.QuestionInfo&&Qualtrics.SurveyEngine.QuestionInfo[this.questionId])
{return Qualtrics.SurveyEngine.QuestionInfo[this.questionId];}
return null;},getPostTag:function()
{var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo.postTag)
{return questionInfo.postTag;}
return null;},getChoiceRecodeValue:function(choiceId)
{var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Choices'][choiceId])
{return questionInfo['Choices'][choiceId]['RecodeValue'];}},getChoiceVariableName:function(choiceId)
{var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Choices'][choiceId])
{return questionInfo['Choices'][choiceId]['VariableName'];}},getChoicesFromVariableName:function(varName)
{return this.getChoicesFromQuestionInfo('VariableName',varName);},getChoicesFromRecodeValue:function(recodeVal)
{console.log('RecodeVal:',recodeVal);return this.getChoicesFromQuestionInfo('RecodeValue',recodeVal);},getChoicesFromQuestionInfo:function(type,val)
{var choices=[];var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Choices'])
{console.log('Choices',questionInfo['Choices'],type,val);for(var cid in questionInfo['Choices'])
{if(val==questionInfo['Choices'][cid][type])
{choices.push(cid);}}}
console.log('Choices array',choices);return choices;},getChoices:function(type,val)
{var choices=[];var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Choices'])
{for(var cid in questionInfo['Choices'])
{if(val==questionInfo['Choices'][cid][type])
{choices.push(cid);}}}
return choices;},getAnswers:function(type,val)
{var answers=[];var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Answers'])
{for(var aid in questionInfo['Answers'])
{answers.push(aid);}}
return answers;},getSelectedChoices:function()
{var choices=this.getChoices();var selectedChoices=[];for(var i=0,len=choices.length;i<len;++i)
{if(this.getChoiceValue(choices[i]))
{selectedChoices.push(choices[i]);}}
return selectedChoices;},getSelectedAnswers:function()
{var choices=this.getChoices();var answers=this.getAnswers();var selectedAnswers={};for(var i=0,len=choices.length;i<len;++i)
{for(var a=0,alen=answers.length;a<alen;++a)
{if(this.getChoiceAnswerValue(choices[i],answers[a]))
{if(!selectedAnswers[answers[a]])
{selectedAnswers[answers[a]]=0;}
selectedAnswers[answers[a]]++;}}}
return selectedAnswers;},getSelectedAnswerValue:function(choiceId)
{var answers=this.getAnswers();var choices=this.getChoices();var selectedAnswerValue=null;for(var a=0,alen=answers.length;a<alen;++a)
{if(this.getChoiceAnswerValue(choiceId,answers[a],answers[a]))
{if(selectedAnswerValue==null||selectedAnswerValue>answers[a])
selectedAnswerValue=answers[a];}}
return selectedAnswerValue;}});Qualtrics.SurveyEngine.QuestionData.getInstance=function(questionId,opt_createNewInstance)
{if(Qualtrics.SurveyEngine.registry[questionId])
{return Qualtrics.SurveyEngine.registry[questionId];}
return new Qualtrics.SurveyEngine.QuestionData(questionId);}
Qualtrics.SurveyEngine.OnEndOfSurvey=function()
{try{if(window.top.postMessage&&$('SessionID'))
{var sid=$F('SurveyID');var ssid=$F('SessionID');window.top.postMessage('closeQSIWindow','*');window.top.postMessage('QualtricsEOS|'+sid+'|'+ssid,'*');}
if(window.parent&&window.parent.qualtricsEndOfSurvey)
{window.parent.qualtricsEndOfSurvey.call(window.parent);}}
catch(e)
{console.error(e);}};Qualtrics.SurveyEngine.onPageLoad=function()
{try{if(window.canCheckParent)
{if(window.parent)
{if(window.parent.qualtricsPageLoad)
{window.parent.qualtricsPageLoad.call(window.parent);}}}}
catch(e)
{}};Qualtrics.SurveyEngine.savePageBeforeUnload=function()
{if(!window.noSEAutoSave)
{if(!$('submitPageFeauBTN'))
{if($('PreviousButton'))
$('PreviousButton').disable();if($('NextButton'))
$('NextButton').disable();}
if($F('SessionID')!='DummySessionID')
$('Page').request({parameters:{SavePageButton:true},asynchronous:false});if($('PreviousButton'))
(function(){$('PreviousButton').disabled=false;}).defer(0.1);if($('NextButton'))
(function(){$('NextButton').disabled=false;}).defer(0.1);}}
Qualtrics.SurveyEngine.changeLanguage=function()
{window.noSEAutoSave=true;submitForm('Page');}
Qualtrics.inputClickHelper=function(e)
{e=e||window.event;var el=Event.element(e);var kids=el.childNodes;var count=0;var inputNode=null;if(kids&&kids.length)
{for(i=0;i<kids.length;i++)
{if(kids[i].nodeName=='INPUT'&&(kids[i].type=='radio'||kids[i].type=='checkbox'))
{count++;inputNode=kids[i];}}}
if(el.nodeName=='LABEL'||el.nodeName=='INPUT')
return;if(count==1&&inputNode)
{inputNode.click();}
if(el.parentNode&&el.parentNode.nodeName=='LABEL'&&el.parentNode.click&&Qualtrics.Browser.IE&&Qualtrics.Browser.Version<=8)
{el.parentNode.click();}}
Qualtrics.openPageInPDF=function()
{QModules.loadModule('WRQualtricsShared/JavaScript/Libraries/QPDFPrinter.js');var pages=[QBuilder('div',{},[$('SurveyEngineBody').cloneNode(true)])];QPDFPrinter.print(pages,{includeCSS:true,orientation:'portrait',filename:'surveysummary.pdf',paginate:true,background:true,margin:20,baseCSS:'width:860px; margin-left:20px; float:left;',customCSS:' .DownloadResponsesPDF { display: none; }'});}
Event.observe(window,'load',function()
{if($('SurveyEngineBody'))
{Event.observe('SurveyEngineBody','mousedown',Qualtrics.inputClickHelper);}});Event.observe(document,'keydown',Qualtrics.SurveyEngine.globalKeyDownHandler);Event.observe(document,'keyup',Qualtrics.SurveyEngine.globalKeyUpHandler);
// (C) 2007-2013 Qualtrics, Inc.

Qualtrics.SurveyPage=new Class.create();Qualtrics.SurveyPage.getInstance=function()
{return Qualtrics.SurveyPage._instance;}
Qualtrics.SurveyPage.prototype={questions:null,initialize:function()
{Qualtrics.SurveyPage._instance=this;this.questions=[];},generate:function(domNode)
{var questionsNode=$('Questions');if(questionsNode)
{var questionsChilds=$(questionsNode).childElements();for(var i=0,len=questionsChilds.length;i<len;++i)
{if(questionsChilds[i].getAttribute('questionid')!==null)
{this.questions.push(new Qualtrics.SurveyPage.Question(this,questionsChilds[i]));}}
if(this.hasInPageDisplayLogic)
{this.setupInPageDisplayLogicEvents();this.evaluateInPageDisplayLogic();}}},validatePage:function(opt_questionId)
{var info=this.getValidationInfo();if(info&&info.valid==false)
{var title=Qualtrics.getMessage('SurveyEngine','UnansweredQuestion');var answerButton=Qualtrics.getMessage('SurveyEngine','AnswerQuestion');var count=info.invalidQuestionCount+info.invalidRequiredQuestionCount;if(count>1)
{title=Qualtrics.getMessage('SurveyEngine','UnansweredQuestions',count);answerButton=Qualtrics.getMessage('SurveyEngine','AnswerQuestions');}
var winOptions={title:title,buttons:[{click:'Q_Window.closeWindow(ValidationConfirm)',text:answerButton},{id:'ContinueWithoutAnswering',click:'Qualtrics.SurveyPage.nextPage(true)',text:Qualtrics.getMessage('SurveyEngine','ContinueWithoutAnswering')}]};if(window.parent!=window)
{winOptions.overlayOpacity=0;}
if(window.Q_Window)
{var win=new Q_Window('ValidationConfirm',winOptions);win.setIframeParent(window.parent);win.setContent(this.buildValidationMessage(info));this.highlightQuestions(info);}
return false;}
return true;},getValidationInfo:function()
{var validationInfo={valid:true,frontEndValidation:false,invalidQuestionCount:0,invalidRequiredQuestionCount:0,invalidQuestions:[]}
for(var i=0,len=this.questions.length;i<len;++i)
{var q=this.questions[i];if(q.validate()===false)
{if(q.responseRequired())
{validationInfo.invalidRequiredQuestionCount++;}
else
{validationInfo.frontEndValidation=true;validationInfo.invalidQuestionCount++;}
validationInfo.valid=false;validationInfo.invalidQuestions.push(q.questionId);}}
return validationInfo;},buildValidationMessage:function(info)
{return QBuilder('strong',{},Qualtrics.getMessage('SurveyEngine','ContinueQuestion'));},highlightQuestions:function(validationInfo)
{if(validationInfo&&validationInfo.invalidQuestions)
{for(var i=0,len=validationInfo.invalidQuestions.length;i<len;++i)
{this.highlightQuestion(validationInfo.invalidQuestions[i]);}}},highlightQuestion:function(qid)
{QualtricsSETools.questionHighlighter();if($(qid))
{$(qid).addClassName('Highlight');}},nextPage:function(opt_confirmValidation)
{if(Q_Window.getInstance('ValidationConfirm'))
{Q_Window.getInstance('ValidationConfirm').busifyButton('ContinueWithoutAnswering');}
Qualtrics.SurveyEngine.navClick(null,'NextButton',opt_confirmValidation);},initInPageDisplayLogic:function()
{this.hasInPageDisplayLogic=true;},setupInPageDisplayLogicEvents:function()
{Event.observe(document,'mouseup',this.evaluateInPageDisplayLogicDefered.bind(this));Event.observe(document,'keyup',this.handleKeyUp.bind(this));},handleKeyUp:function(evt)
{var el=Event.element(evt)
if(el.nodeName=='INPUT'||'TEXTAREA')
{if(this.displayLogicDelay)
{clearTimeout(this.displayLogicDelay)}
this.displayLogicDelay=window.setTimeout(this.evaluateInPageDisplayLogic.bind(this),400);}},evaluateInPageDisplayLogicDefered:function()
{this.evaluateInPageDisplayLogic.bind(this).defer();},evaluateInPageDisplayLogic:function()
{for(var i=0,len=this.questions.length;i<len;++i)
{if(this.questions[i].hasInPageDisplayLogic)
{this.questions[i].evaluateInPageDisplayLogic();}}
document.body.className=document.body.className;}};Qualtrics.SurveyPage.Question=new Class.create();Qualtrics.SurveyPage.Question.prototype={questionId:null,hasValidation:null,surveyPage:null,hasInPageDisplayLogic:null,initialize:function(surveyPage,domNode)
{this.surveyPage=surveyPage;this.domNode=domNode;this.questionId=domNode.getAttribute('questionid');this.data=Qualtrics.SurveyEngine.QuestionInfo[this.questionId];if(this.data&&this.data['Validation']&&this.data['Validation']['Settings'])
{if(this.data['Validation']['Settings']['ForceResponse']=='ON')
{this.hasValidation=true;}}
if(this.data&&this.data['InPageDisplayLogic'])
{this.hasInPageDisplayLogic=true;surveyPage.initInPageDisplayLogic();}},validate:function()
{if(this.data&&this.data['Validation']&&this.data['Validation']['Settings']&&(this.data['Validation']['Settings']['ForceResponse']=='RequestResponse'||this.data['Validation']['Settings']['ForceResponse']=='ON'))
{if(this['validate'+this.data['QuestionType']])
{return this['validate'+this.data['QuestionType']]();}}
return true},responseRequired:function()
{if(this.data&&this.data['Validation']&&this.data['Validation']['Settings']&&this.data['Validation']['Settings']['ForceResponse']=='ON')
{return true;}
return false;},showLocalValidation:function()
{this.validationErrorClass=true;$(this.domNode).addClassName('ValidationErrorHighlight');},getPosition:function()
{for(var i=0,len=this.surveyPage.questions.length;i<len;++i)
{if(this.surveyPage.questions[i].questionId==this.questionId)
{return i;}}},getPrev:function()
{return this.surveyPage.questions[this.getPosition()-1]},getSelectionInfoByTag:function(tag)
{var parts=tag.split('~');if(isNaN(Number(parts[2])))
{if(parts[2]=='TEXT')
{return{type:'TextEntry'};}
return false;}
return{type:'Selection',choiceID:parts[2]}},validateMC:function()
{var s=this.data['Selector'];if(s=='SAVR'||s=='MAVR'||s=='SAHR'||s=='MAHR'||s=='SACOL'||s=='MACOL')
{var inputs=this.domNode.getElementsByTagName('input');for(var i=0,len=inputs.length;i<len;++i)
{if(inputs[i]['type']=='radio'||inputs[i]['type']=='checkbox')
{if(inputs[i].checked)
{return true;}}}
return false;}
else
{var selects=this.domNode.getElementsByTagName('select');for(var i=0,len=selects.length;i<len;++i)
{if(selects[i].value)
{return true}}
return false}
return true;},validateMatrix:function()
{var s=this.data['Selector'];var sub=this.data['SubSelector'];if(s=='Likert'||s=='Bipolar'||s=='RO'||s=='TE'||s=='Profile')
{if(sub=='DL')
{var selects=this.domNode.getElementsByTagName('select');for(var i=0,len=selects.length;i<len;++i)
{if(!selects[i].value)
{return false;}}
return true;}
else
{var inputs=this.domNode.getElementsByTagName('input');var possibleChoiceIDs={};for(var i=0,len=inputs.length;i<len;++i)
{var inputHasAnswer=false;var selectionInfo=this.getSelectionInfoByTag(inputs[i].name);if(selectionInfo&&selectionInfo.choiceID)
{var choiceID=selectionInfo.choiceID;if(inputs[i]['type']=='radio'||inputs[i]['type']=='checkbox')
{inputHasAnswer=inputs[i].checked;}
else if(inputs[i]['type']=='text')
{inputHasAnswer=inputs[i].value!='';}
if(possibleChoiceIDs[choiceID]===undefined)
{possibleChoiceIDs[choiceID]=inputHasAnswer;}
if(inputHasAnswer&&!possibleChoiceIDs[choiceID])
{possibleChoiceIDs[choiceID]=true;}}}
for(var id in possibleChoiceIDs)
{if(!possibleChoiceIDs[id])
{return false;}}}}
else if(s=='MaxDiff')
{var inputs=this.domNode.getElementsByTagName('input');var possibleChoiceIDs={};for(var i=0,len=inputs.length;i<len;++i)
{var inputHasAnswer=false;var selectionInfo=this.getSelectionInfoByTag(inputs[i].name);if(selectionInfo&&selectionInfo.choiceID)
{var choiceID=selectionInfo.choiceID;inputHasAnswer=inputs[i].checked;if(possibleChoiceIDs[choiceID]===undefined)
{possibleChoiceIDs[choiceID]=inputHasAnswer;}
if(inputHasAnswer&&!possibleChoiceIDs[choiceID])
{possibleChoiceIDs[choiceID]=true;}}}
var checkedCount=0;for(var id in possibleChoiceIDs)
{if(possibleChoiceIDs[id])
{checkedCount++;}}
var statementCount=Object.keys(this.data.Choices).length;var allStatementsAnswered=(checkedCount==statementCount);return(checkedCount==2||allStatementsAnswered);}
return true;},validateTE:function()
{var s=this.data['Selector'];if(s=='FORM')
{var inputs=this.domNode.getElementsByTagName('textarea');var inputs2=this.domNode.getElementsByTagName('input');var inputArray=[];for(var i=0;i<inputs.length;i++)
inputArray.push(inputs[i]);for(i=0;i<inputs2.length;i++)
inputArray.push(inputs2[i]);inputs=inputArray;}
else if(s=='ESTB'||s=='ML')
{inputs=this.domNode.getElementsByTagName('textarea');}
else
{inputs=this.domNode.getElementsByTagName('input');}
for(var i=0,len=inputs.length;i<len;++i)
{if(inputs[i]['type']=='text'||inputs[i]['type']=='password'||inputs[i].tagName=='TEXTAREA')
{var selectionInfo=this.getSelectionInfoByTag(inputs[i].name);if(selectionInfo.type=='TextEntry'&&!inputs[i].value)
{return false;}
else if(selectionInfo.type=='Selection'&&!inputs[i].value)
{return false;}}}
return true;},validateSS:function()
{return $F($(this.domNode).down('td.QuestionBody input'))!='';},validateSlider:function()
{var barId='CS_'+this.questionId;var valid=true;if(window[barId])
{var csBar=window[barId];if(csBar.sliders)
{valid=true;for(var sliderId in csBar.sliders)
{var slider=csBar.sliders[sliderId];if(!slider.activated)
{var notApplicableInput=$(this.questionId+'~'+slider.choiceId+'~NA');if(notApplicableInput&&notApplicableInput.checked)
{continue;}
valid=false;break;}}}}
return valid;},evaluateInPageDisplayLogic:function()
{var result=this.evaluateLogic(this.data['InPageDisplayLogic']);var questionData=Qualtrics.SurveyEngine.QuestionData.getInstance(this.questionId);if(result)
{$(this.domNode).setAttribute('hiddenbyinpagedisplaylogic',false);if(questionData)
{questionData.hiddenByInPageDisplayLogic=false;}
$(this.domNode).removeClassName('IPDLHidden');$(this.domNode).setStyle({visibility:'visible'});$('QM~'+questionData.getPostTag()+'~Displayed').value='1';}
else
{$(this.domNode).setAttribute('hiddenbyinpagedisplaylogic',true);$(this.domNode).addClassName('IPDLHidden');$(this.domNode).setStyle({visibility:'hidden'});if(questionData)
{questionData.hiddenByInPageDisplayLogic=true;}
$('QM~'+questionData.getPostTag()+'~Displayed').value='0';}
try
{var iframe=window.parent.document.getElementById('formiframe');if(iframe)
{iframe.height=document.body.clientHeight||document.body.scrollHeight;}}
catch(err)
{}},evaluateLogic:function(logic)
{var exprStr='';var result=false;var predicateCount=0;for(var expressionSetIndex in logic)
{var exprSetStr='';if(!isNaN(expressionSetIndex))
{for(var expressionIndex in logic[expressionSetIndex])
{if(!isNaN(expressionIndex))
{var ex=logic[expressionSetIndex][expressionIndex];if(ex['LogicType']=='Question')
{var locData=Qualtrics.Logic.getDataFromLocator(ex['ChoiceLocator']);if(locData['questionId'])
{var questionData=Qualtrics.SurveyEngine.QuestionData.getInstance(locData['questionId'],false);if(questionData&&questionData.questionId)
{if(!questionData.hiddenByInPageDisplayLogic)
{if(ex['Operator']=='Selected'||ex['Operator']=='NotSelected')
{var condition=ex['Operator']=='Selected'?true:false;if(locData['choiceId'])
{if(locData['answerId'])
{result=(questionData.getChoiceAnswerValue(locData['choiceId'],locData['answerId'])==condition);exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}
else
{result=(questionData.getChoiceValue(locData['choiceId'])==condition)
exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}}
else if(locData['answerId'])
{var selectedAnswers=Object.keys(questionData.getSelectedAnswers());var result=false;for(var i=0,len=selectedAnswers.length;i<len;++i)
{if(selectedAnswers[i]==locData['answerId'])
{result=condition;break;}}
exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}}
else if(ex['Operator']=='Displayed'||ex['Operator']=='NotDisplayed')
{var condition=ex['Operator']=='Displayed'?true:false;if(locData['choiceId'])
{result=(questionData.getChoiceDisplayed(locData['choiceId'],locData['answerId'])==condition);exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}
else
{result=(questionData.getQuestionDisplayed()==condition);exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}}
else
{if(locData.type=='SelectedChoicesCount')
{var selectedChoices=questionData.getSelectedChoices();result=this.evaluateExpression(selectedChoices.length,ex['Operator'],ex['RightOperand']);exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}
else if(locData.type=='SelectedAnswerCount')
{var selectedAnswers=questionData.getSelectedAnswers();result=this.evaluateExpression(selectedAnswers[locData['answerId']],ex['Operator'],ex['RightOperand']);exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}
else if(locData.type=='ChoiceTextEntryValue')
{if(locData.choiceId&&!questionData.getChoiceValue(locData.choiceId))
{result=false;}
else
{var val=questionData.getTextValue(locData.choiceId);if(this.evaluateExpression(val,ex['Operator'],ex['RightOperand']))
{result=true;}}
var val=questionData.getTextValue(locData.choiceId);result=this.evaluateExpression(val,ex['Operator'],ex['RightOperand']);exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}
else if(locData.type=='ChoiceNumericEntryValue')
{var choiceVal=questionData.getChoiceValue(locData['choiceId']);if(!choiceVal){choiceVal=questionData.getSelectedAnswerValue(locData['choiceId']);}
result=this.evaluateExpression(choiceVal,ex['Operator'],ex['RightOperand']);exprSetStr=this.extendExpr(exprSetStr,result,ex['Conjuction']);}
else
{console.log('Unknown locData type',locData.type);}}}}
else
{var that=this;if($F('SessionID')=='DummySessionID')
{result=false;if(ex['Operator']=='NotDisplayed'||ex['Operator']=='NotSelected')
{result=true;}
else if(ex['Operator']=='Displayed'||ex['Operator']=='Selected')
{result=false;}
else
{result=this.evaluateExpression('',ex['Operator'],ex['RightOperand']);}
exprSetStr=that.extendExpr(exprSetStr,result,ex['Conjuction']);}
else
{new Ajax.CachedRequest('Ajax.php?action=EvalDisplayLogicExpression',{asynchronous:false,parameters:{SurveyID:$F('SurveyID'),SessionID:$F('SessionID'),Preview:$('Preview')?$F('Preview'):null,Expression:Object.toJSON(ex)},onComplete:function(transport)
{var json=Qualtrics.parseJSON(transport.responseText);result=(json['Error'])?false:!!json;exprSetStr=that.extendExpr(exprSetStr,result,ex['Conjuction']);}});}}}}
predicateCount++;}}}
if(exprSetStr.length)
{exprStr=this.extendExpr(exprStr,'('+exprSetStr+')',logic[expressionSetIndex]['Type']);}}
if(predicateCount>1)
{var compiledExpr=new Function('return '+exprStr);result=compiledExpr();}
return result;},evaluateExpression:function(left,op,right)
{switch(op)
{case'EqualTo':{return left==right;}
case'NotEqualTo':{return left!=right;}
case'GreaterThan':{return Number(left)>Number(right);}
case'GreaterThanOrEqual':{return Number(left)>=Number(right);}
case'LessThan':{return Number(left)<Number(right);}
case'LessThanOrEqual':{return Number(left)<=Number(right);}
case'Empty':{return left==''||left==null;}
case'NotEmpty':{return left!=''&&left!=null;}
case'Contains':{return String(left).indexOf(right)!=-1;}
case'DoesNotContain':{return String(left).indexOf(right)==-1;}
case'MatchesRegex':{var regex=right;var regexmatch=/^\/(.*)\/([gim]*)/;regex.match(regexmatch);var val='';if(RegExp.$1)
{return String(left).match(new RegExp(RegExp.$1,RegExp.$2));}
else
{return String(left).match(new RegExp(regex));}}}
return false;},extendExpr:function(exprStr,condition,op)
{if(exprStr.length)
{if(op=='And'||op=='AndIf')
exprStr+='&&';else if(op=='Or'||op=='OrIf'||op=='ElseIf')
exprStr+='||';}
if(typeof condition=='string')
{exprStr+=condition;}
else
{if(condition)
exprStr+='true';else
exprStr+='false';}
return exprStr;}};Qualtrics.Logic={getDataFromLocator:function(locator)
{var data={};var aggregate=false;if(locator)
{var parts=locator.split('/');data.type=parts[3];if(locator.startsWith('qo://'))
{data.quotaId=parts[2];var queryIndex=locator.indexOf('?');if(queryIndex!=-1)
{var queryParam=locator.substr(queryIndex+1)
var queryParts=queryParam.split('=');if(queryParts[0]=='SV')
data.surveyId=queryParts[1];}}
else
{data.questionId=parts[2];if(data.questionId&&data.questionId.indexOf('#')!=-1)
{var questionParts=data.questionId.split('#');data.questionId=questionParts[0];data.aggregateId=questionParts[1];aggregate=true;}
if(parts[4]=='Group')
{data.choiceId=parts[5];data.answerIndex=parts[6];data.subType='Group';}
else if(parts[4]=='Rank')
{data.choiceId=parts[5];data.subType='Rank';}
else
{if(data.type=='DisplayableQuestion')
{return data;}
else if(data.type=='SelectableAnswer'||data.type=='SelectedAnswerCount'||data.type=='SelectedChoicesCount')
{data.answerId=parts[4];}
else if(data.type=='Region')
{data.regionId=parts[4];}
else
{data.choiceId=parts[4];}
if(parts.length>5)
{data.answerId=parts[5];}}
if(aggregate)
{if(data.type=='SelectableAnswer'||data.type=='SelectedAnswerCount'||data.type=='SelectedChoicesCount')
{data.answerSeriesIndex=parts[4];}
else
{data.choiceId=parts[4];data.answerSeriesIndex=parts[5];data.answerId=data.aggregateId;}
if(data.answerSeriesIndex!==undefined)
{data.answerSeriesIndex--;}}}}
return data;}}
Event.observe(window,'load',function()
{new Qualtrics.SurveyPage().generate();});
