function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};var ownKeys=Object.keys(source);if(typeof Object.getOwnPropertySymbols==="function"){ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable}))}ownKeys.forEach(function(key){_defineProperty(target,key,source[key])})}return target}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}import lib from"./lib";import ContainerManager from"./container-manager";var slLib=lib.init(window),doc=slLib.win.document,M=slLib.win.Math,max=M.max,round=M.round,htmlSplCharSpace={" ":"&nbsp;"},documentSupport=slLib.getDocumentSupport(),SVG_BBOX_CORRECTION=documentSupport.isWebKit?0:4.5;function SmartLabelManager(container,useEllipses,options){var wrapper,prop,max,isBrowserLess=false,canvas=window.document.createElement("canvas");options=options||{};options.maxCacheLimit=isFinite(max=options.maxCacheLimit)?max:slLib.maxDefaultCacheLimit;if(typeof container==="string"){container=doc.getElementById(container)}wrapper=slLib.createContainer(container);wrapper.innerHTML=slLib.testStrAvg;if(documentSupport.isHeadLess||!documentSupport.isIE&&!wrapper.offsetHeight&&!wrapper.offsetWidth){isBrowserLess=true}wrapper.innerHTML="";for(prop in slLib.parentContainerStyle){wrapper.style[prop]=slLib.parentContainerStyle[prop]}this.parentContainer=wrapper;this.ctx=canvas&&canvas.getContext&&canvas.getContext("2d");this._containerManager=new ContainerManager(wrapper,isBrowserLess,10);this._showNoEllipses=!useEllipses;this._init=true;this.style={};this.oldStyle={};this.options=options;this.setStyle()}SmartLabelManager.textToLines=function(smartlabel){smartlabel=smartlabel||{};if(!smartlabel.text){smartlabel.text=""}else if(typeof smartlabel.text!=="string"){smartlabel.text=smartlabel.text.toString()}smartlabel.lines=smartlabel.text.split(/\n|<br\s*?\/?>/ig);return smartlabel};SmartLabelManager.prototype._calCharDimWithCache=function(){var text=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"";var calculateDifference=arguments.length>1?arguments[1]:undefined;var length=arguments.length>2?arguments[2]:undefined;if(!this._init){return false}var size,tw,twi,cachedStyle,asymmetricDifference,maxAdvancedCacheLimit=this.options.maxCacheLimit,style=this.style||{},cache,advancedCacheKey,cacheName,cacheInitName;cache=this._advancedCache=this._advancedCache||(this._advancedCache={});advancedCacheKey=this._advancedCacheKey||(this._advancedCacheKey=[]);cacheName=text+style.fontSize+style.fontFamily+style.fontWeight+style.fontStyle;cacheInitName=text+"init"+style.fontSize+style.fontFamily+style.fontWeight+style.fontStyle;if(!this.ctx&&htmlSplCharSpace[text]){text=htmlSplCharSpace[text]}if(!calculateDifference){asymmetricDifference=0}else{if((asymmetricDifference=cache[cacheInitName])===undefined){tw=this._getDimention(text.repeat?text.repeat(length):Array(length+1).join(text)).width;twi=this._getDimention(text).width;asymmetricDifference=cache[cacheInitName]=(tw-length*twi)/(length+1);advancedCacheKey.push(cacheInitName);if(advancedCacheKey.length>maxAdvancedCacheLimit){delete cache[advancedCacheKey.shift()]}}}if(cachedStyle=cache[cacheName]){return{width:cachedStyle.width,height:cachedStyle.height}}size=this._getDimention(text);size.width+=asymmetricDifference;cache[cacheName]={width:size.width,height:size.height};advancedCacheKey.push(cacheName);if(advancedCacheKey.length>maxAdvancedCacheLimit){delete cache[advancedCacheKey.shift()]}return size};SmartLabelManager.prototype._getDimention=function(text){if(this.requireDiv||!this.ctx){return slLib._getDimentionUsingDiv(text,this)}else{return slLib._getDimentionUsingCanvas(text,this)}};SmartLabelManager.prototype._getWidthFn=function(){var sl=this,contObj=sl._containerObj,svgText=contObj.svgText;if(svgText){return function(str){var bbox,width;svgText.textContent=str;bbox=svgText.getBBox();width=bbox.width-SVG_BBOX_CORRECTION;if(width<1){width=bbox.width}return width}}else{return function(str){if(sl.requireDiv||!sl.ctx){return slLib._getDimentionUsingDiv(str,sl).width}else{return slLib._getDimentionUsingCanvas(str,sl).width}}}};SmartLabelManager.prototype._isSameStyle=function(){var sl=this,oldStyle=sl.oldStyle||{},style=sl.style;if(style.fontSize!==oldStyle.fontSize||style.fontFamily!==oldStyle.fontFamily||style.fontStyle!==oldStyle.fontStyle||style.fontWeight!==oldStyle.fontWeight||style.fontVariant!==oldStyle.fontVariant){return false}return true};SmartLabelManager.prototype._setStyleOfCanvas=function(){if(this._isSameStyle()){return}var sl=this,style=sl.style,hashString,sCont,fontStyle=style.fontStyle,fontVariant=style.fontVariant,fontWeight=style.fontWeight,fontSize=style.fontSize,fontFamily=style.fontFamily;fontSize+=fontSize.indexOf("px")===-1?"px":"";hashString=fontStyle+" "+fontVariant+" "+fontWeight+" "+fontSize+" "+fontFamily;sl.ctx.font=hashString;sCont=this._containerObj=this._containerManager.get(style);if(this._containerObj){this._container=sCont.node;this._context=sCont.context;this._cache=sCont.charCache;this._lineHeight=sCont.lineHeight;this._styleNotSet=false}else{this._styleNotSet=true}sCont.ellipsesWidth=sl._calCharDimWithCache("...",false).width;sCont.dotWidth=sl._calCharDimWithCache(".",false).width;sCont.lineHeight=this._lineHeight=sCont.lineHeight||slLib._getCleanHeight(style.lineHeight);this.oldStyle=style};SmartLabelManager.prototype._setStyleOfDiv=function(){var sCont,style=this.style;this._containerObj=sCont=this._containerManager.get(style);if(!sCont.node){this._containerManager._makeDivNode(this._containerObj)}if(this._containerObj){this._container=sCont.node;this._context=sCont.context;this._cache=sCont.charCache;this._lineHeight=sCont.lineHeight;this._styleNotSet=false}else{this._styleNotSet=true}};SmartLabelManager.prototype._updateStyle=function(){return this.requireDiv||!this.ctx?this._setStyleOfDiv():this._setStyleOfCanvas()};SmartLabelManager.prototype.setStyle=function(style){this.style=slLib.parseStyle(style);slLib.setLineHeight(this.style);return this};SmartLabelManager.prototype.useEllipsesOnOverflow=function(useEllipses){if(!this._init){return this}this._showNoEllipses=!useEllipses;return this};SmartLabelManager.prototype.getSmartText=function(text,maxWidth,maxHeight,noWrap){if(!this._init){return false}if(text===undefined||text===null){text=""}else if(typeof text!=="string"){text=text.toString()}var len,trimStr,tempArr,tmpText,maxWidthWithEll,toolText,oriWidth,oriHeight,newCharIndex,nearestChar,tempChar,getWidth,initialLeft,initialTop,getOriSizeImproveObj,spanArr,x,y,minWidth,elem,chr,elemRightMostPoint,elemLowestPoint,lastBR,removeFromIndex,removeFromIndexForEllipses,hasHTMLTag=false,maxStrWidth=0,lastDash=-1,lastSpace=-1,lastIndexBroken=-1,strWidth=0,strHeight=0,oriTextArr=[],i=0,ellipsesStr=this._showNoEllipses?"":"...",lineHeight,context,container,sCont,ellipsesWidth,dotWidth,canvas=this.ctx,characterArr=[],dashIndex=-1,spaceIndex=-1,lastLineBreak=-1,hasOnlyBrTag,dimentionObj,fastTrim=function fastTrim(str){str=str.replace(/^\s\s*/,"");var ws=/\s/,i=str.length;while(ws.test(str.charAt(i-=1))){}return str.slice(0,i+1)},smartLabel={text:text,maxWidth:maxWidth,maxHeight:maxHeight,width:null,height:null,oriTextWidth:null,oriTextHeight:null,oriText:text,isTruncated:false};hasHTMLTag=slLib.xmlTagRegEx.test(text)||slLib.nbspRegex.test(text);hasOnlyBrTag=slLib._hasOnlyBRTag(text);this.requireDiv=hasHTMLTag&&!hasOnlyBrTag;this._updateStyle();lineHeight=this._lineHeight;context=this._context;container=this._container;sCont=this._containerObj;ellipsesWidth=sCont.ellipsesWidth;dotWidth=sCont.dotWidth;toolText=text.replace(slLib.spanAdditionRegx,"$2");getWidth=this._getWidthFn();if(lineHeight-maxHeight<=1&&lineHeight-maxHeight>=0){maxHeight*=1.2}if(canvas||container){if(!documentSupport.isBrowserLess){if(!hasHTMLTag){tmpText=text=text.replace(slLib.ltgtRegex,function(match){return match==="&lt;"?"<":">"});getOriSizeImproveObj=this.getSize(tmpText,true,{hasHTMLTag:hasHTMLTag,hasOnlyBrTag:hasOnlyBrTag,cleanText:true});smartLabel.oriTextWidth=oriWidth=getOriSizeImproveObj.width;smartLabel.oriTextHeight=oriHeight=getOriSizeImproveObj.height}else if(hasOnlyBrTag){text=text.replace(slLib.brRegex,"<br />");dimentionObj=slLib._getDimentionOfMultiLineText(text,this);smartLabel.oriTextWidth=oriWidth=dimentionObj.width;smartLabel.oriTextHeight=oriHeight=dimentionObj.height}else{container.innerHTML=text;smartLabel.oriTextWidth=oriWidth=container.offsetWidth;smartLabel.oriTextHeight=oriHeight=container.offsetHeight}if(oriHeight<=maxHeight&&oriWidth<=maxWidth){smartLabel.width=smartLabel.oriTextWidth=oriWidth;smartLabel.height=smartLabel.oriTextHeight=oriHeight;return smartLabel}if(lineHeight>maxHeight){smartLabel.text="";smartLabel.width=smartLabel.oriTextWidth=0;smartLabel.height=smartLabel.oriTextHeight=0;return smartLabel}}text=fastTrim(text).replace(/(\s+)/g," ");maxWidthWithEll=this._showNoEllipses?maxWidth:maxWidth-ellipsesWidth;if(!hasHTMLTag||hasOnlyBrTag){oriTextArr=slLib._getTextArray(text);len=oriTextArr.length;trimStr="";tempArr=[];tempChar=oriTextArr[0];if(this._cache[tempChar]){minWidth=this._cache[tempChar].width}else{minWidth=getWidth(tempChar);this._cache[tempChar]={width:minWidth}}if(maxWidthWithEll>minWidth&&!hasOnlyBrTag){tempArr=text.substr(0,slLib.getNearestBreakIndex(text,maxWidthWithEll,this)).split("")}else if(minWidth>maxWidth){smartLabel.text="";smartLabel.width=smartLabel.oriTextWidth=smartLabel.height=smartLabel.oriTextHeight=0;return smartLabel}else if(ellipsesStr){maxWidthWithEll=maxWidth-2*dotWidth;if(maxWidthWithEll>minWidth){ellipsesStr=".."}else{maxWidthWithEll=maxWidth-dotWidth;if(maxWidthWithEll>minWidth){ellipsesStr="."}else{maxWidthWithEll=0;ellipsesStr=""}}}i=tempArr.length;strWidth=getWidth(tempArr.join(""));strHeight=this._lineHeight;if(noWrap){for(;i<len;i+=1){tempChar=tempArr[i]=oriTextArr[i];if(tempArr[i]==="<br />"){strHeight+=this._lineHeight;lastIndexBroken=i;maxStrWidth=max(maxStrWidth,strWidth);strWidth=0;trimStr=null;continue}if(this._cache[tempChar]){minWidth=this._cache[tempChar].width}else{if(!getOriSizeImproveObj||!(minWidth=getOriSizeImproveObj.detailObj[tempChar])){minWidth=getWidth(tempChar)}this._cache[tempChar]={width:minWidth}}strWidth+=minWidth;if(strWidth>maxWidthWithEll){if(!trimStr){trimStr=tempArr.slice(0,-1).join("")}if(strWidth>maxWidth){smartLabel.text=fastTrim(trimStr)+ellipsesStr;smartLabel.tooltext=smartLabel.oriText;smartLabel.width=max(maxStrWidth,strWidth);smartLabel.height=strHeight;return smartLabel}}}smartLabel.text=tempArr.join("");smartLabel.width=max(maxStrWidth,strWidth);smartLabel.height=strHeight;return smartLabel}else{for(;i<len;i+=1){tempChar=tempArr[i]=oriTextArr[i];if(tempChar===" "&&!context){tempChar=this.ctx?" ":"&nbsp;"}if(tempArr[i]==="<br />"){maxStrWidth=max(maxStrWidth,strWidth);strHeight+=this._lineHeight;if(strHeight<=maxHeight){lastIndexBroken=i;strWidth=0;trimStr=null;continue}else if(strHeight>maxHeight){trimStr=tempArr.slice(0,-1).join("");smartLabel.text=fastTrim(trimStr)+ellipsesStr;smartLabel.tooltext=toolText;smartLabel.width=maxStrWidth;smartLabel.height=strHeight-this._lineHeight;return smartLabel}}if(this._cache[tempChar]){minWidth=this._cache[tempChar].width}else{if(!getOriSizeImproveObj||!(minWidth=getOriSizeImproveObj.detailObj[tempChar])){minWidth=getWidth(tempChar)}this._cache[tempChar]={width:minWidth}}strWidth+=minWidth;if(strWidth>maxWidthWithEll){if(!trimStr){trimStr=tempArr.slice(0,-1).join("")}if(strWidth>maxWidth){if(oriTextArr[i+1]==="<br />"){continue}lastSpace=slLib._findLastIndex(oriTextArr.slice(0,tempArr.length)," ");lastDash=slLib._findLastIndex(oriTextArr.slice(0,tempArr.length),"-");if(lastSpace>lastIndexBroken){strWidth=getWidth(tempArr.slice(lastIndexBroken+1,lastSpace).join(""));tempArr.splice(lastSpace,1,"<br />");lastIndexBroken=lastSpace;newCharIndex=lastSpace+1}else if(lastDash>lastIndexBroken){if(lastDash===tempArr.length-1){strWidth=getWidth(tempArr.slice(lastIndexBroken+1,lastSpace).join(""));tempArr.splice(lastDash,1,"<br />-")}else{strWidth=getWidth(tempArr.slice(lastIndexBroken+1,lastSpace).join(""));tempArr.splice(lastDash,1,"-<br />")}lastIndexBroken=lastDash;newCharIndex=lastDash+1}else{tempArr.splice(tempArr.length-1,1,"<br />"+oriTextArr[i]);lastLineBreak=tempArr.length-2;strWidth=getWidth(tempArr.slice(lastIndexBroken+1,lastLineBreak+1).join(""));lastIndexBroken=lastLineBreak;newCharIndex=i}strHeight+=this._lineHeight;if(strHeight>maxHeight){smartLabel.text=fastTrim(trimStr)+ellipsesStr;smartLabel.tooltext=smartLabel.oriText;smartLabel.width=maxWidth;smartLabel.height=strHeight-this._lineHeight;return smartLabel}else{maxStrWidth=max(maxStrWidth,strWidth);trimStr=null;if(!hasOnlyBrTag){nearestChar=slLib.getNearestBreakIndex(text.substr(newCharIndex),maxWidthWithEll,this);strWidth=getWidth(text.substr(newCharIndex,nearestChar||1));if(tempArr.length<newCharIndex+nearestChar){tempArr=tempArr.concat(text.substr(tempArr.length,newCharIndex+nearestChar-tempArr.length).split(""));i=tempArr.length-1}}else{strWidth=slLib._getDimentionOfMultiLineText(tempArr.slice(lastIndexBroken+1).join(""),this).width}}}}}maxStrWidth=max(maxStrWidth,strWidth);smartLabel.text=tempArr.join("");smartLabel.width=maxStrWidth;smartLabel.height=strHeight;return smartLabel}}else{toolText=text.replace(slLib.spanAdditionRegx,"$2");text=text.replace(slLib.spanAdditionRegx,slLib.spanAdditionReplacer);text=text.replace(/(<br\s*\/*\>)/g,"<span class=\""+[slLib.classNameWithTag," ",slLib.classNameWithTagBR].join("")+"\">$1</span>");container.innerHTML=text;spanArr=container[documentSupport.childRetriverFn](documentSupport.childRetriverString);for(x=0,y=spanArr.length;x<y;x+=1){elem=spanArr[x];if(documentSupport.noClassTesting||slLib.classNameReg.test(elem.className)){chr=elem.innerHTML;if(chr!==""){if(chr===" "){spaceIndex=characterArr.length}else if(chr==="-"){dashIndex=characterArr.length}characterArr.push({spaceIdx:spaceIndex,dashIdx:dashIndex,elem:elem});oriTextArr.push(chr)}}}i=0;len=characterArr.length;minWidth=len&&characterArr[0].elem.offsetWidth;if(minWidth>maxWidth||!len){smartLabel.text="";smartLabel.width=smartLabel.oriTextWidth=smartLabel.height=smartLabel.oriTextHeight=0;return smartLabel}else if(minWidth>maxWidthWithEll&&!this._showNoEllipses){maxWidthWithEll=maxWidth-2*dotWidth;if(maxWidthWithEll>minWidth){ellipsesStr=".."}else{maxWidthWithEll=maxWidth-dotWidth;if(maxWidthWithEll>minWidth){ellipsesStr="."}else{maxWidthWithEll=0;ellipsesStr=""}}}initialLeft=characterArr[0].elem.offsetLeft;initialTop=characterArr[0].elem.offsetTop;if(noWrap){for(;i<len;i+=1){elem=characterArr[i].elem;elemRightMostPoint=elem.offsetLeft-initialLeft+elem.offsetWidth;if(elemRightMostPoint>maxWidthWithEll){if(!removeFromIndexForEllipses){removeFromIndexForEllipses=i}if(container.offsetWidth>maxWidth){removeFromIndex=i;i=len}}}}else{for(;i<len;i+=1){elem=characterArr[i].elem;elemLowestPoint=elem.offsetHeight+(elem.offsetTop-initialTop);elemRightMostPoint=elem.offsetLeft-initialLeft+elem.offsetWidth;lastBR=null;if(elemRightMostPoint>maxWidthWithEll){if(!removeFromIndexForEllipses){removeFromIndexForEllipses=i}if(elemRightMostPoint>maxWidth){lastSpace=characterArr[i].spaceIdx;lastDash=characterArr[i].dashIdx;if(lastSpace>lastIndexBroken){characterArr[lastSpace].elem.innerHTML="<br/>";lastIndexBroken=lastSpace}else if(lastDash>lastIndexBroken){if(lastDash===i){characterArr[lastDash].elem.innerHTML="<br/>-"}else{characterArr[lastDash].elem.innerHTML="-<br/>"}lastIndexBroken=lastDash}else{elem.parentNode.insertBefore(lastBR=doc.createElement("br"),elem)}if(elem.offsetHeight+elem.offsetTop>maxHeight){if(lastBR){lastBR.parentNode.removeChild(lastBR)}else if(lastIndexBroken===lastDash){characterArr[lastDash].elem.innerHTML="-"}else{characterArr[lastSpace].elem.innerHTML=" "}removeFromIndex=i;i=len}else{removeFromIndexForEllipses=null}}}else{if(elemLowestPoint>maxHeight){removeFromIndex=i;i=len}}}}if(removeFromIndex<len){smartLabel.isTruncated=true;removeFromIndexForEllipses=removeFromIndexForEllipses?removeFromIndexForEllipses:removeFromIndex;for(i=len-1;i>=removeFromIndexForEllipses;i-=1){elem=characterArr[i].elem;elem.parentNode.removeChild(elem)}for(;i>=0;i-=1){elem=characterArr[i].elem;if(slLib.classNameBrReg.test(elem.className)){elem.parentNode.removeChild(elem)}else{i=0}}}smartLabel.text=container.innerHTML.replace(slLib.spanRemovalRegx,"$1").replace(/\&amp\;/g,"&");if(smartLabel.isTruncated){smartLabel.text+=ellipsesStr;smartLabel.tooltext=toolText}}smartLabel.height=container.offsetHeight;smartLabel.width=container.offsetWidth;return smartLabel}else{smartLabel.error=new Error("Body Tag Missing!");return smartLabel}};SmartLabelManager.prototype.getSize=function(){var text=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"";var detailedCalculationFlag=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var config=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};if(!this._init){return false}if(text===undefined||text===null){text=""}else if(typeof text!=="string"){text=text.toString()}var textArr,letter,lSize,i,l,cumulativeSize=0,height=0,container,indiSizeStore={},hasHTMLTag=config.hasHTMLTag,hasOnlyBrTag=config.hasOnlyBrTag;if(typeof hasHTMLTag==="undefined"){hasHTMLTag=slLib.xmlTagRegEx.test(text)||slLib.nbspRegex.test(text)}if(typeof hasOnlyBrTag==="undefined"){hasOnlyBrTag=slLib._hasOnlyBRTag(text)}this.requireDiv=hasHTMLTag&&!hasOnlyBrTag;if(!config.cleanText){text=text.replace(slLib.ltgtRegex,function(match){return match==="&lt;"?"<":">"})}this._updateStyle();container=this._container;if(!detailedCalculationFlag){return this._calCharDimWithCache(text)}else{textArr=text.split("");for(i=0,l=textArr.length;i<l;i++){letter=textArr[i];lSize=this._calCharDimWithCache(letter,false,textArr.length);height=max(height,lSize.height);cumulativeSize+=lSize.width;indiSizeStore[letter]=lSize.width}}if(hasOnlyBrTag){return _objectSpread({},slLib._getDimentionOfMultiLineText(text,this),{detailObj:indiSizeStore})}if(hasHTMLTag){container.innerHTML=text;return{width:container.offsetWidth,height:container.offsetHeight,detailObj:indiSizeStore}}return{width:round(cumulativeSize),height:height,detailObj:indiSizeStore}};SmartLabelManager.prototype.getOriSize=function(){var text=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"";var detailedCalculationFlag=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var config=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};return this.getSize(text,detailedCalculationFlag,config)};SmartLabelManager.prototype.dispose=function(){if(!this._init){return this}if(this._containerManager&&this._containerManager.dispose){this._containerManager.dispose()}delete this._container;delete this._context;delete this._cache;delete this._containerManager;delete this._containerObj;delete this.id;delete this.style;delete this.parentContainer;delete this._showNoEllipses;return this};export default SmartLabelManager;