define("arale/select/0.9.9/select-debug",["arale/overlay/1.1.4/overlay-debug","$-debug","arale/position/1.0.1/position-debug","arale/iframe-shim/1.0.2/iframe-shim-debug","arale/widget/1.1.1/widget-debug","arale/base/1.1.1/base-debug","arale/class/1.1.0/class-debug","arale/events/1.1.0/events-debug","arale/templatable/0.9.2/templatable-debug","gallery/handlebars/1.0.2/handlebars-debug","./select-debug.handlebars"],function(a,b,c){function d(a,b){var c,d=[],e=a.options,f=e.length,g=!1;for(c=0;f>c;c++){var h,i={},j=e[c],k=["text","value","defaultSelected","selected","disabled"];for(h in k){var l=k[h];i[l]=j[l]}j.selected&&(g=!0),d.push(i)}return!g&&d.length&&(d[0].selected="true"),{select:d,classPrefix:b}}function e(a,b){var c,d,e,f,g=[],h=[];for(c=0,e=a.length;e>c;c++){var i=k.extend({},a[c]);i.selected&&h.push(c),i.selected=i.defaultSelected=!!i.selected,i.disabled=!!i.disabled,g.push(i)}if(h.length>0)for(h.pop(),d=0,f=h.length;f>d;d++)g[d].selected=!1;else g[0].selected=!0;return{select:g,classPrefix:b}}function f(a,b){var c;return c=k.isNumeric(a)?a:b.index("string"==typeof a?b.parent().find(a):a)}function g(a,b){if(a&&a[0]&&(a=a[0],"select"===a.tagName.toLowerCase())){k(a).find("option").remove();for(var c in b){var d=b[c],e=document.createElement("option");e.text=d.text,e.value=d.value,a.add(e)}}}function h(a,b){return a?a+"-"+b:""}function i(a){var b=0;return a.find("li").each(function(a,c){b+=k(c).outerHeight()}),b}var j=a("arale/overlay/1.1.4/overlay-debug"),k=a("$-debug"),l=a("arale/templatable/0.9.2/templatable-debug"),m=a("./select-debug.handlebars"),n=j.extend({Implements:l,attrs:{trigger:{value:null,getter:function(a){return k(a).eq(0)}},classPrefix:"ui-select",template:m,align:{baseXY:[0,"100%-1px"]},triggerTpl:'<a href="#"></a>',name:"",value:"",length:0,selectedIndex:-1,multiple:!1,disabled:!1,maxHeight:null,selectSource:null},events:{click:function(a){a.stopPropagation()},"click [data-role=item]":function(a){var b=k(a.currentTarget);b.data("disabled")||this.select(b)},"mouseenter [data-role=item]":function(a){var b=k(a.currentTarget);b.data("disabled")||b.addClass(h(this.get("classPrefix"),"hover"))},"mouseleave [data-role=item]":function(a){var b=k(a.currentTarget);b.data("disabled")||b.removeClass(h(this.get("classPrefix"),"hover"))}},templateHelpers:{output:function(a){return a+""}},initAttrs:function(a,b){n.superclass.initAttrs.call(this,a,b);var c,f=this.get("trigger");if(f.addClass(h(this.get("classPrefix"),"trigger")),"select"===f[0].tagName.toLowerCase()){c=f.attr("name"),c&&this.set("name",c),this.set("selectSource",f);var g=k(this.get("triggerTpl")).addClass(h(this.get("classPrefix"),"trigger"));this.set("trigger",g),this._initFromSelect=!0,f.after(g).css({position:"absolute",left:"-99999px",zIndex:-100}),this.set("model",d(f[0],this.get("classPrefix")))}else{if(c=this.get("name")){var i=k('input[name="'+c+'"]').eq(0);i[0]||(i=k('<input type="text" id="select-'+c.replace(/\./g,"-")+'" name="'+c+'" />').css({position:"absolute",left:"-99999px",zIndex:-100}).insertAfter(f)),this.set("selectSource",i)}this.set("model",e(this.get("model"),this.get("classPrefix")))}},setup:function(){this._bindEvents(),this._initOptions(),this._initHeight(),this._tweakAlignDefaultValue(),this._blurHide(this.get("trigger")),n.superclass.setup.call(this)},render:function(){return n.superclass.render.call(this),this._setTriggerWidth(),this},destroy:function(){this._initFromSelect&&this.get("trigger").remove(),this.get("selectSource")&&this.get("selectSource").remove(),this.element.remove(),n.superclass.destroy.call(this)},select:function(a){var b=f(a,this.options),c=this.get("selectedIndex");this.set("selectedIndex",b);var d=this.get("model");if(c>=0&&(d.select[c].selected=!1),b>=0&&(d.select[b].selected=!0),this.set("model",d),c!==b){var e=this.options.eq(b),g=this.options.eq(c);this.trigger("change",e,g)}return this.hide(),this},syncModel:function(a){this.set("model",e(a,this.get("classPrefix"))),this.renderPartial("[data-role=content]"),g(this.get("selectSource"),a),this.options=this.$("[data-role=content]").children(),this.set("length",this.options.length),this.set("selectedIndex",-1),this.set("value","");{var b=f("[data-selected=true]",this.options);this.get("selectedIndex")}return this.set("selectedIndex",b),this._setTriggerWidth(),this},getOption:function(a){var b=f(a,this.options);return this.options.eq(b)},addOption:function(a){var b=this.get("model").select;return b.push(a),this.syncModel(b),this},removeOption:function(a){var b=f(a,this.options),c=this.get("selectedIndex"),d=this.options.eq(b);return d.remove(),this.options=this.$("[data-role=content]").children(),this.set("length",this.options.length),b===c?this.set("selectedIndex",0):c>b&&this.set("selectedIndex",c-1),this},enableOption:function(a){var b=f(a,this.options),c=this.get("model").select;return c[b].disabled=!1,this.syncModel(c),this},disableOption:function(a){var b=f(a,this.options),c=this.get("model").select;return c[b].disabled=!0,this.syncModel(c),this},_onRenderSelectedIndex:function(a){if(-1!==a){var b=this.options.eq(a),c=this.currentItem,d=b.attr("data-value");if(!c||b[0]!==c[0]){var e=this.get("selectSource");e&&("select"===e[0].tagName.toLowerCase()?e[0].selectedIndex=a:e[0].value=d),c&&c.attr("data-selected","false").removeClass(h(this.get("classPrefix"),"selected")),b.attr("data-selected","true").addClass(h(this.get("classPrefix"),"selected")),this.set("value",d);var f=this.get("trigger"),g=f.find("[data-role=trigger-content]");g.length?g.html(b.html()):f.html(b.html()),this.currentItem=b}}},_onRenderDisabled:function(a){var b=h(this.get("classPrefix"),"disabled"),c=this.get("trigger");c[a?"addClass":"removeClass"](b);var d=this.options.eq(this.get("selectedIndex"));this.trigger("disabledChange",d,a)},_bindEvents:function(){var a=this.get("trigger");this.delegateEvents(a,"mousedown",this._triggerHandle),this.delegateEvents(a,"click",function(a){a.preventDefault()}),this.delegateEvents(a,"mouseenter",function(){a.addClass(h(this.get("classPrefix"),"trigger-hover"))}),this.delegateEvents(a,"mouseleave",function(){a.removeClass(h(this.get("classPrefix"),"trigger-hover"))})},_initOptions:function(){this.options=this.$("[data-role=content]").children(),this.select("[data-selected=true]"),this.set("length",this.options.length)},_setTriggerWidth:function(){var a=this.get("trigger"),b=this.element.outerWidth(),c=parseInt(a.css("padding-left"),10),d=parseInt(a.css("padding-right"),10),e=parseInt(a.css("border-left-width"),10)||0,f=parseInt(a.css("border-right-width"),10)||0;a.css("width",b-c-d-e-f)},_tweakAlignDefaultValue:function(){var a=this.get("align");"VIEWPORT"===a.baseElement._id&&(a.baseElement=this.get("trigger")),this.set("align",a)},_triggerHandle:function(a){a.preventDefault(),this.get("disabled")||(this.get("visible")?this.hide():this.show())},_initHeight:function(){this.after("show",function(){var a=this.get("maxHeight");if(a){var b=this.$("[data-role=content]"),c=i(b);this.set("height",c>a?a:""),b.scrollTop(0)}})}});c.exports=n}),define("arale/select/0.9.9/select-debug.handlebars",["gallery/handlebars/1.0.2/runtime-debug"],function(a,b,c){var d=a("gallery/handlebars/1.0.2/runtime-debug"),e=d.template;c.exports=e(function(a,b,c,d,e){function f(a,b,d){var e,f,h,i="";return i+='\n        <li data-role="item"\n          class="'+l((e=d.classPrefix,typeof e===k?e.apply(a):e))+"-item ",f=c["if"].call(a,a.disabled,{hash:{},inverse:m.noop,fn:m.programWithDepth(2,g,b,d),data:b}),(f||0===f)&&(i+=f),i+='"\n          data-value="',(f=c.value)?f=f.call(a,{hash:{},data:b}):(f=a.value,f=typeof f===k?f.apply(a):f),i+=l(f)+'"\n          data-defaultSelected="',h={hash:{},data:b},i+=l((e=c.output,e?e.call(a,a.defaultSelected,h):n.call(a,"output",a.defaultSelected,h)))+'"\n          data-selected="',h={hash:{},data:b},i+=l((e=c.output,e?e.call(a,a.selected,h):n.call(a,"output",a.selected,h)))+'"\n          data-disabled="',h={hash:{},data:b},i+=l((e=c.output,e?e.call(a,a.disabled,h):n.call(a,"output",a.disabled,h)))+'">',(f=c.text)?f=f.call(a,{hash:{},data:b}):(f=a.text,f=typeof f===k?f.apply(a):f),(f||0===f)&&(i+=f),i+="</li>\n        "}function g(a,b,c){var d,e="";return e+=l((d=c.classPrefix,typeof d===k?d.apply(a):d))+"-item-disabled"}this.compilerInfo=[3,">= 1.0.0-rc.4"],c=c||{};for(var h in a.helpers)c[h]=c[h]||a.helpers[h];e=e||{};var i,j="",k="function",l=this.escapeExpression,m=this,n=c.helperMissing;return j+='<div class="',(i=c.classPrefix)?i=i.call(b,{hash:{},data:e}):(i=b.classPrefix,i=typeof i===k?i.apply(b):i),j+=l(i)+'">\n    <ul class="',(i=c.classPrefix)?i=i.call(b,{hash:{},data:e}):(i=b.classPrefix,i=typeof i===k?i.apply(b):i),j+=l(i)+'-content" data-role="content">\n        ',i=c.each.call(b,b.select,{hash:{},inverse:m.noop,fn:m.programWithDepth(1,f,e,b),data:e}),(i||0===i)&&(j+=i),j+="\n    </ul>\n</div>\n"})});