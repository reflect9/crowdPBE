function numberComparator(a, b) {
    return a - b;
}
function sortGeneral(a) {
    if (isNumberList(a)) {
        return a.slice(0).sort(numberComparator);
    }
    else {
        return a.slice(0).sort();
    }
}
function sum(list) {
    return list.reduce(function (pv, cv) { return pv + cv; }, 0);
}
function isSameArray(a1, a2) {
    // CASE 1. a1 and a2 are single values
    if (!_.isArray(a1) && !_.isArray(a2))
        return a1 == a2;
    // CASE 2. a1 and a2 are arrays
    if (a1.length != a2.length)
        return false;
    for (var i = 0; i < a1.length; i++) {
        if (isSameArray(a1[i], a2[i]) == false)
            return false;
    }
    return true;
}
;
function str2arrayNumber(str) {
    if (str.match(/^\s+$/))
        return []; // IF GIVEN STRING IS EMPTY, RETURN EMPTY LIST
    return _.map(str.split(","), function (s) {
        var regexFloatNumber = new RegExp("^[+-]?[0-9]+[.]?[0-9]*$");
        if (regexFloatNumber.test(s.trim()) == false) {
            throw new Error("Make sure that no cell is empty or containing non-number values.");
        }
        else {
            return parseFloat(s.trim());
        }
    });
}
function str2arrayBoolean(str) {
    if (str.match(/^\s+$/))
        return []; // IF GIVEN STRING IS EMPTY, RETURN EMPTY LIST
    return _.map(str.split(","), function (s) {
        if (s.trim().toLowerCase() == "t" || s.trim().toLowerCase() == "f") {
            return (s.trim().toLowerCase() === "t");
        }
        else {
            throw "Some examples are empty or containing values other than boolean values ('T' or 'F').";
        }
    });
}
function str2array(str) {
    if (str.match(/^\s+$/))
        return []; // IF GIVEN STRING IS EMPTY, RETURN EMPTY LIST
    return _.map(str.split(","), function (s) { return s.trim(); });
}
function evaluateTypeConsistencyOfStep(step) {
    var flattenValues = _.flatten(_.map(step, function (s) {
        return str2array(s);
    }));
    var evalResult = evaluateTypeConsistencyOfArray(flattenValues);
    return evalResult;
}
function evaluateTypeConsistencyOfArray(arr) {
    var types = _.map(arr, function (str) { return getDataType(str); });
    if (_.uniq(types).length == 1) {
        return { consistency: true, type: _.uniq(types) };
    }
    else {
        return { consistency: false, type: _.uniq(types) };
    }
}
function getDataType(str) {
    var regexFloatNumber = new RegExp("^[+-]?[0-9]+[.]?[0-9]*$");
    var regexBoolean = new RegExp("^[tf]$");
    if (regexFloatNumber.test(str.trim()))
        return "Number";
    else if (regexBoolean.test(str.trim().toLowerCase()))
        return "Boolean";
    else {
        return "String";
    }
}
function isFiltered2D(originalArr, filteredArr) {
    return _.every(_.range(originalArr.length), function (i) {
        return isFiltered(originalArr[i], filteredArr[i]) == true;
    });
}
function isFiltered(original, filtered) {
    var IV = _.clone(original);
    for (var i in filtered) {
        var idx = IV.indexOf(filtered[i]);
        if (idx == -1)
            return false;
        else
            IV.splice(0, idx);
    }
    return true;
}
function isFilteredAndExtracted2D(originalArr, filteredArr) {
    return _.every(_.range(originalArr.length), function (i) {
        return isFilteredAndExtracted(originalArr[i], filteredArr[i]) == true;
    });
}
function isFilteredAndExtracted(original, filtered) {
    var IV = _.clone(original);
    for (var i in filtered) {
        var idx = -1;
        for (var j in IV) {
            if (IV[j].indexOf(filtered[i]) != -1) {
                idx = parseInt(j);
                break;
            }
        }
        if (idx == -1)
            return false;
        else
            IV.splice(0, idx);
    }
    return true;
}
function isSameProgram(p1, p2) {
    if (p1.type != p2.type)
        return false;
    for (var pkey in p1.param) {
        if (pkey in p2.param == false)
            return false;
        if (p2.param[pkey] != p1.param[pkey])
            return false;
    }
    return true;
}
function isSameShape(arr1, arr2) {
    if (arr1.length != arr2.length)
        return false;
    for (var i in arr1) {
        if (_.isArray(arr1[i]) && _.isArray(arr2[i])) {
            // BOTH ARE ARRAY
            if (!isSameShape(arr1[i], arr2[i]))
                return false;
        }
        else if (!_.isArray(arr1[i]) && !_.isArray(arr2[i])) {
            // NEITHER ARE ARRAY
            continue;
        }
        else {
            // EITHER IS ARRAY
            return false;
        }
    }
    return true;
}
function isPredicateArray(arrayOfArray) {
    return _.every(arrayOfArray, function (arr) {
        return _.every(arr, function (v) { return _.isBoolean(v); });
    });
}
function isStringList(list) {
    // all the non-null elements in the list must be string 
    var toCheck = (_.isArray(list)) ? list : [list];
    // toCheck = $(toCheck).trimArray();
    return _.filter(toCheck, function (e) {
        return e !== null && _.isString(e) === false;
    }).length === 0;
}
;
function isNumberList(list) {
    var toCheck = (_.isArray(list)) ? list : [list];
    return _.filter(toCheck, function (e) {
        return e !== null && _.isNumber(e) === false && !isNumberString(e);
    }).length === 0;
}
;
function isNumberString(str) {
    return _.isString(str) && (!isNaN(parseInt(str)));
}
;
function isBooleanList(list) {
    var toCheck = (_.isArray(list)) ? list : [list];
    if (typeof list === 'undefined')
        return false;
    if (list.length == 0)
        return false;
    var legidBool = [];
    for (var i = 0; i < list.length; i++) {
        if (_.isBoolean(list[i]))
            legidBool.push(list[i]);
        else if (list[i] === 1 || list[i] === 0)
            legidBool.push(list[i]);
        else if (list[i] === "true" || list[i] === "false")
            legidBool.push(list[i]);
    }
    if (legidBool.length !== list.length)
        return false;
    else
        return true;
}
;
///////////////////////////////////////////////////////////////////////////
// HELPER METHODS ///
///////////////////////////////////////////////////////////////////////////
// jQuery.fn.findPropertyQuery = function(elements) {
// 	// Instead of DOM paths, this function tries to use class and id of elements
// 	// Input: this,   Output: elements
// 	list_of_queries = [];
// 	_.each(elements, function(el,i){
// 		queries = [];
// 		// add combination of classes
// 		var tagName = $(el).prop("tagName");
// 		queries.push(tagName);
// 		var classes = (typeof $(el).attr("class")=="undefined") ? [] : $(el).attr("class").split(" ");
// 		for (var i=1;i<=classes.length;i++) {
// 			var class_comb = pickCombination(classes, i);
// 			_.each(class_comb,function(cc) {
// 				queries.push(tagName+"."+cc.join("."));
// 			});
// 		}
// 		// console.log(queries);
// 		list_of_queries.push(queries);
// 	});
// 	common_queries = _.intersection.apply(this,list_of_queries);
// 	return common_queries;
// };
// jQuery.fn.findPathQuery = function(elements) {
// 	if(elements.length==1) {
// 		var exact_path = $(elements).pathWithNth(this);	// finding path from this(enclosing el) to the single element
// 		return exact_path;
// 	} else {
// 		var commonAncester = getCommonAncestorMultiple(elements);	// check whether all the output elements are within the input dom
// 		if(commonAncester!==$(this).get(0) && $(commonAncester).parents().hasElement(this.get(0))===false) return null; // if Input does not contain
// 		var pathToAncester = $(commonAncester).pathWithEverything(this); // find two step paths 1. Input->CommonAncester,  2. CommonAncester->O
// 		var pathFromRepToLeaf = _.map(elements, function(o,i) { // collect paths from anscester's children to output nodes
// 			return $(o).leafNodePath(commonAncester);	});
// 		if(_.uniq(pathFromRepToLeaf).length==1) return path = pathToAncester+" > "+pathFromRepToLeaf[0];	
// 		else {
// 			// if multiple paths found, then use the shortest one (which is not "")
// 			var shortedPath = pathToAncester+" > "+_.first(pathFromRepToLeaf.sort());
// 			return shortedPath;
// 		}
// 	}
// };
// jQuery.fn.pathWithEverything = function(root) {
// 	// if this(commonAncester) and root(I[0]) are same, then return ""
// 	if($(this)[0]===$(root)[0]) return "";
// 	return "> " + _.reduce($(this).parentsUntil(root), function(memo,p) {
// 			return $(p).tagIdClassNth()+" > "+memo;
// 	},$(this).tagIdClassNth());
// };
// jQuery.fn.pathWithNth = function(root) {
// 	// if this(commonAncester) and root(I[0]) are same, then return ""
// 	if($(this)[0]===$(root)[0]) return "";
// 	return "> " + _.reduce($(this).parentsUntil(root), function(memo,p) {
// 			return $(p).tagNth()+" > "+memo;
// 	},$(this).tagNth());
// };
// jQuery.fn.tagNth = function() {
// 	var nth;
// 	var tag = $(this).prop("tagName");
// 	var siblings = $(this).parent().children(tag);
// 	if(siblings.length>1) {
// 		nth = ":nth-of-type("+(siblings.index(this)+1)+")";
// 	} else nth = "";
// 	return tag+nth;
// };
// jQuery.fn.tagClassNth = function() {
// 	var cls, nth;
// 	var tag = $(this).prop("tagName");
// 	if ($(this).attr("class")) cls = "."+$(this).attr("class").trim().replace(/\s+/g,".");
// 	else cls="";
// 	var siblings = $(this).parent().children(tag+cls);
// 	if(siblings.length>1) {
// 		nth = ":nth-of-type("+(siblings.index(this)+1)+")";
// 	} else nth = "";
// 	return tag+cls+nth;
// };
// jQuery.fn.tagIdClassNth = function() {
// 	var Id, cls, nth;
// 	var tag = $(this).prop("tagName");
// 	if ($(this).attr("class")) cls = "."+$(this).attr("class").trim().replace(/\s+/g,".");
// 	else cls="";
// 	Id = ($(this).attr("id"))? "#"+$(this).attr("id"): "";
// 	var siblings = $(this).parent().children(tag+Id+cls+nth);
// 	if(siblings.length>1) {
// 		nth = ":nth-of-type("+(siblings.index(this)+1)+")";
// 	} else nth = "";
// 	return tag+Id+cls+nth;
// };
// jQuery.fn.leafNodePath = function(commonAncester) {
// 	if($(this)[0]===$(commonAncester)[0]) return "";
// 	var listOfParents = $(this).parentsUntil($(commonAncester));
// 	return _.reduce(listOfParents, function(memo, p) {
// 		return $(p).tagAndClass()+" > "+memo;
// 	},(listOfParents.length>0)? $(this).tagClassNth(): $(this).tagAndClass());
// };
// jQuery.fn.path = function() {
// 	return _.reduce($(this).parents(), function(memo,p) {
// 			return $(p).tag()+" "+memo;
// 	},"");
// };
// jQuery.fn.ohtml = function() {
// 	return $(this).clone().wrap('<p>').parent().html();
// };
// jQuery.fn.tagAndClass = function() {
// 	var q = $(this).prop("tagName");
// 	if ($(this).attr("class")) q = q+"."+$(this).attr("class").trim().replace(/\s+/g,".");
// 	return q;
// };
// jQuery.fn.tagAndId = function() {
// 	var q = $(this).prop("tagName");
// 	if ($(this).attr("id")) q = q+"#"+$(this).attr("id");
// 	return q;
// };
// jQuery.fn.tag = function() {
// 	var q = $(this).prop("tagName");
// 	return q;
// };
// findRepElements = function(elements) {
// 	var commonAncester = getCommonAncestorMultiple(elements);
// 	var representativeElements = _.map(elements, function(el) {
// 		if ($(commonAncester).children().toArray().indexOf(el)!=-1) return el;  // in case el is just below the commonAncester, rep is el itself.
// 		else return $(commonAncester).children().has(el).get(0);
// 	});
// 	return representativeElements;
// };
// jQuery.fn.fingerprint = function() {
// 	var  childrenPrint = "";
// 	if($(this).children().length>0)
// 		childrenPrint = "["+ _.reduce($(this).children(), function(memo,child) {
// 			return memo + "," + $(child).fingerprint();
// 		},"") +"]";
// 	return $(this).prop("tagName")+childrenPrint;
// };
// jQuery.fn.myIndex = function(selector) {
// 	var i = $(this).parent().children(selector).index(this);
// 	return (i && i>-1)? i:0;
// };
// jQuery.fn.text_delimited = function(delimiter) {
// 	return $(this).justtext()+" "+$(this).children_text_delimited(delimiter);
// };
// jQuery.fn.justtext = function() {
// 	if($(this).length==0) return "";
// 	var text = "";
//     try {	text = $(this).clone()
//             .children()
//             .remove()
//             .end()
//             .text();
//     } catch(e) { 
//     	console.log(e.stack); 
//     }
//     return text;
// };
// jQuery.fn.children_text_delimited = function(delimiter) {
// 	var children = $(this).clone().children();
// 	var t_list = [];
// 	var c_text_list = $.each(children, function(i, c) {
// 		t_list.push($(c).text_delimited(" "));
// 	});
// 	return (t_list.length>0)? t_list.join(" "): "";
// };
// jQuery.fn.html_no_children = function() {
//     var el_no_children = $(this).clone()
//             .children()
//             .remove()
//             .end();
//     return $(el_no_children).ohtml();
// };
// jQuery.fn.containsString = function(str) {
// 	if($(this).text.indexOf(str)!=-1) return true;
// 	if($(this).attr('href') && $(this).attr('href').indexOf(str)!=-1) return true;
// 	if($(this).attr('src') && $(this).attr('src').indexOf(str)!=-1) return true;
// 	return false;
// };
// var containsText = function(outerText,innerText) {
// 	for (i in innerText) {
// 		if(outerText.indexOf(innerText[i])==-1) return false;
// 	}
// 	return true;
// };
// var containsAll = function(outer,inner) {
// 	var flag = true;
// 	_.each(inner, function(el) {
// 		if($.contains(outer,el)===false) flag = false;
// 	});
// 	return flag;
// };
// var getSeparator = function(str_list) {
// 	var separators = ['//', '-', '_', '\\+', ';', ':', ',', '\\.', '\\|', '\\|\\|', '@', '#', '$', '%', '\\^' ,'&' , '\\*'];
// 	var targetIndex = 0;
// 	var most = 0;
// 	_.each(separators, function(sep, index) {
// 		var reg = new RegExp(sep,"g");
// 		var current = (str_list[0].match(reg)||[]).length;
// 		if (most < current) {
// 			most = current;
// 			targetIndex = index;
// 		}
// 	});
// 	return separators[targetIndex];
// }
// jQuery.fn.trimArray = function() {
// 	var result = [];   var validity = true;
// 	_.each(this, function(v) {
// 		if(v===undefined || v===null || v==="") validity=false;
// 		if(validity) result.push(v);
// 	});
// 	return result;
// };
// jQuery.fn.hasElement = function(el) {
// 	return _.filter(this, function(p) { return p==el;}).length>0;
// };
// var html2dom = function(htmlStr) {
// 	var el = $('<div></div>');
// 	el.html(htmlStr);
// 	return el;
// };
// function HTMLParser(aHTMLString){
//   var html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null),
//     body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
//   html.documentElement.appendChild(body);
//   body.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
//     .getService(Components.interfaces.nsIScriptableUnescapeHTML)
//     .parseFragment(aHTMLString, false, null, body));
//   return body;
// };
// var getContentAtTop = function(list) {
// 	var result = [];
// 	for(var i=0;i<list.length;i++) {
// 		if(list[i]!==null && list[i]!==undefined ) result.push(list[i]);
// 		else break;
// 	}
// 	return result;
// };
// var getCommonAncestorMultiple=  function(list) {
// 	var result = _.reduce(list, function(memo,el) {
// 		return getCommonAncestor(el,memo);
// 	},_.first(list));
// 	return result;
// };
// var getCommonAncestor = function(a,b) {
//     $parentsa = $(a).add($(a).parents());
//     $parentsb = $(b).add($(b).parents());
//     var found = null;
//     $($parentsa.get().reverse()).each(function() {
//         var thisa = this;
//         $($parentsb.get().reverse()).each(function() {
//             if (thisa == this)
//             {
//                 found = this;
//                 return false;
//             }
//         });
//         if (found) return false;
//     });
//     return found;
// };
// var hasAttribute = function(list, attrKey) {
// 	return _.filter($(list).trimArray(), function(el) {
// 		return $(el).attr(attrKey)!==undefined || $(el).attr(attrKey)!==null;
// 	}).length===0;
// };
// var RegexProduct = function(rlist) {
// 	var resultReg=[];  var rL = _.union(rlist,/^/);  var rR = _.union(rlist,/$/);
// 	for(var i in rL) {
// 		for(var j in rR) {
// 			if(rL[i]==rR[j]) continue;
// 			resultReg.push(new RegExp(rL[i].source+"(.*)"+rR[j].source,"g"));
// 		}
// 	}
// 	return _.uniq(resultReg);
// };
// var insertArrayAt = function(array, index, arrayToInsert) {
//     Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
// };
// var mergeList = function(list1, list2) {
// 	var merged = [];
// 	for(var i=0;i<Math.max(list1.length,list2.length);i++) {
// 		if(list1[i]!==null && list1[i]!==undefined) merged.push(list1[i]);
// 		else merged.push(list2[i]);
// 	}
// 	return merged;
// };
// var isCorrectResult = function(inputList, outputList) {
// 	// checks each outputList is found in corresponding inputList
// 	if($(inputList).trimArray().length===0) return false;	// if input creates nothing, incorrect.
// 	else if($(outputList).trimArray().length===0) return true; // if input has something and output is empty, then all the inputs are accepted. 
// 	// if input and outputlist are both nonempty, then we check each 
// 	var nonMatched = _.filter(_.zip($(inputList).trimArray(),$(outputList).trimArray()), function(e) {
// 		// if input empty or, output cannot be found in input, then it's nonmatched object 
// 		return !e[0] || (e[0] && e[1] && e[0].indexOf(e[1])==-1);
// 	});
// 	return nonMatched.length===0;
// };
// var isOutputContainInput = function(inputList, outputList) {
// 	// used in GenerateAttach.  checks whether every output.html contains input.outerHTML
// 	var iT = $(inputList).trimArray(); var oT = $(outputList).trimArray();
// 	if(!isDomList(iT) || !isDomList(oT)) return false;
// 	if(iT.length<2 || oT.length<2 || iT.length<oT.length) return false;	// if input creates nothing, incorrect.
// 	var zipped = _.zip(iT.slice(0,oT.length),oT);	// match the oT.length
// 	var nonMatched = _.filter(zipped, function(e) {
// 		// if input empty or, output cannot be found in input, then it's nonmatched object 
// 		if(e[0]!==null || e[0].outerHTML.match(/^\s*$/) || e[1].outerHTML.match(/^\s*$/)) return true;
// 		if(e[1].innerHTML.indexOf(e[0].outerHTML)!==-1) return false;
// 		else return true;
// 	});
// 	return nonMatched.length===0;
// };
// var isSameTypeList = function(a,b) {
// 	return (isStringList(a.V) && isStringList(b.V)) ||
// 					(isNumberList(a.V) && isNumberList(b.V)) ||
// 					(isBooleanList(a.V) && isBooleanList(b.V));
// };
// var isStringList = function(list) {
// 	// all the non-null elements in the list must be string 
// 	var toCheck = (_.isArray(list))? list: [list];
// 	// toCheck = $(toCheck).trimArray();
// 	return _.filter(toCheck, function(e) {
// 		return e!==null && _.isString(e)===false;
// 	}).length===0;
// };
// var isNumberList = function(list) {
// 	var toCheck = (_.isArray(list))? list: [list];
// 	return _.filter(toCheck, function(e) {
// 		return e!==null && _.isNumber(e)===false && !isNumberString(e);
// 	}).length===0;
// };
// var isNumberString = function(str) {
// 	return _.isString(str) && (!isNaN(parseInt(str)));	
// };
// var isBooleanList = function(list) {
// 	var toCheck = (_.isArray(list))? list: [list];
// 	if(typeof list==='undefined') return false;
// 	if( list.length==0) return false;
// 	var legidBool = [];
// 	for(var i=0;i<list.length;i++) {
// 		if(_.isBoolean(list[i])) legidBool.push(list[i]);
// 		else if(list[i]===1 || list[i]===0) legidBool.push(list[i]);
// 		else if(list[i]==="true" || list[i]==="false") legidBool.push(list[i]);
// 	}
// 	if(legidBool.length !== list.length) return false;
// 	else return true;
// };
// var isURLList = function(list) {
// 	var toCheck = (_.isArray(list))? list: [list];
// 	toCheck = $(toCheck).trimArray();
// 	return _.filter(toCheck, function(e) {
// 		return _.isString(e)===false || isURL(e)===false;
// 	}).length===0;
// };
// function isURL(s) {    
//       var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
//       return regexp.test(s);    
//  }
// var isSrc = function(list) {
// 	var toCheck = (_.isArray(list))? list: [list];
// 	toCheck = $(toCheck).trimArray();
// 	return _.filter(toCheck, function(e) {
// 		return _.isString(e)===false || !e.match(/(png)|(jpg)|(gif)|(bmp)/ig) || !e.match(/html/ig);
// 	}).length===0;
// };
// var isDomList = function(list) {
// 	if(!_.isArray(list)) return false;
// 	var trimmedList = $(list).trimArray();
// 	return trimmedList.length>0 && _.filter(trimmedList, function(e) {  return !isDom(e); }).length ===0;
// };
// var isDom = function(el) {
// 	return (el!==undefined && el!==null && el.nodeType!==null && el.nodeType!==undefined);
// };
// var isValueList = function(list) {
// 	if(!list || list.length==0) return false;
// 	for(var i in list) 		if(isDom(list[i]) || list[i]==undefined) return false;
// 	return true;
// };
// var isSameArray = function(a1, a2) {
// 	// CASE 1. a1 and a2 are single values
// 	if(!_.isArray(a1) && !_.isArray(a2)) return a1 == a2;
// 	// CASE 2. a1 and a2 are arrays
// 	if(a1.length != a2.length) return false;
// 	for(var i=0;i<a1.length;i++) {
// 		if(isSameArray(a1[i],a2[i])==false) return false;
// 	}
// 	return true;
// };
// var same_values = function(list) {
// 	for(var i=1 ;i<list.length;i++){
// 		if (list[i]!=list[i-1]) return false;
// 	}
// 	return true;
// }
// var isPermutation = function(a1, a2) {
// 	if(a1.length != a2.length) return false;
// 	var a2c = a2.slice(0);
// 	for(var i=0;i<a1.length;i++) {
// 		if(a2c.indexOf(a1[i])==-1) return false;
// 		a2c = remove(a2c,a1[i]);
// 	}
// 	if (a2c.length>0) return false;
// 	return true;
// };
// var remove = function(list, removeItem) {
// 	return jQuery.grep(list, function(value) {
// 		return value != removeItem;
// 	});
// };
// var obj2text = function(obj) {
// 	if(obj && obj.nodeType!==null && obj.nodeType!==undefined) {
// 		// DOM
// 		return ""+$(obj).prop('tagName')+": "+$(obj).text();
// 	} else {
// 		return JSON.stringify(obj);
// 	}
// };
// var getArithmeticFunc = function(oper) {
// 	if(oper=="+") return function(a1,a2) { return a1+a2; };
// 	if(oper=="-") return function(a1,a2) { return a1-a2; };
// 	if(oper=="/") return function(a1,a2) { return a1/a2; };
// 	if(oper=="*") return function(a1,a2) { return a1*a2; };
// 	if(oper=="%") return function(a1,a2) { return a1%a2; };
// };
// // convert ill-structured test to list or single string/integer
// var txt2var = function(txt) {
// 	try{
// 		if(isDom(txt)) return txt;
// 		if(!isNaN(parseFloat(txt))) return parseFloat(txt);
// 		if(_.isString(txt) && txt.toLowerCase()=="true") return true;
// 		if(_.isString(txt) && txt.toLowerCase()=="false") return false;
// 		return txt;
// 	}catch(er) {
// 		console.log(er.stack);
// 	}
// };
// // convert list or single string/integer to string without quotation
// var var2txt = function(v) {
// 	if (v===null || v===undefined) return "";
// 	if(isDom(v)) {
// 		return "[D:"+$(v).prop('tagName')+"]"+$(v).text();
// 	} else {
// 		return JSON.stringify(v).replace(/^\"/ig,"").replace(/\"$/ig,"");
// 	}
// };
// var str2value = function(str) {
// 	var list = str.replace(/[\"|\[\]]/g,"").split(",");
// 	parsedList = _.map(list, function(e) {
// 		e = $.trim(e);
// 		if(_.isNaN(parseFloat(e))) return e;
// 		else return parseFloat(e);
// 	});
// 	return parsedList;
// };
// var str2Url = function(str) {
// 	var domain = $.url().attr("protocol")+"://"+$.url().attr("host")+"/";
// 	if(str && !str.match(/http(s)?:\/\//i)) {
// 		return domain+str;
// 	} else {
// 		return str;
// 	}
// };
// // var product = function() {
// //     return Array.prototype.reduce.call(arguments, function(as, bs) {
// //         return [a.concat(b) for each (a in as) for each (b in bs)];
// //     }, [[]]);
// // };
// var productThreeArraysUnion = function(a,b,c) {
// 	var result = [];
// 	_.each(a,function(ael) {
// 		_.each(b,function(bel) {
// 			_.each(c,function(cel) {
// 				result.push(_.union(ael,bel,cel));
// 			});
// 		});
// 	});
// 	return result;
// };
// var productThreeArrays = function(a,b,c, cons) {
// 	var result = [];
// 	_.each(a, function(ael) {
// 		_.each(b, function(bel) {
// 			_.each(c, function(cel) {
// 				if(cons(ael,bel,cel)===true)
// 					result.push([ael,bel,cel]);
// 			});
// 		});
// 	});
// 	return result;
// };
// var chooseInputArgNodes = function(nodes) {
// 	var emptyNode = new wg.Node();
// 	emptyNode.id=emptyNode.id+"_empty";
// 	var result = [];
// 	_.each(nodes,function(nI) {
// 		_.each(_.union(nodes,emptyNode),function(nA) {
// 			if(nI!==nA) {
// 				result.push([nI,nA]);
// 			}
// 		});
// 	});
// 	return result;
// };
// var isSameObject = function(x, y)
// {
// 	if(x===null || y===null) { return false;}
//   var p;
//   for(p in y) {
//       if(typeof(x[p])=='undefined') {return false;}
//   }
//   for(p in y) {
//       if (y[p]) {
//           switch(typeof(y[p])) {
//               case 'object':
//                   if (!y[p].equals(x[p])) { return false; } break;
//               case 'function':
//                   if (typeof(x[p])=='undefined' ||
//                       (p != 'equals' && y[p].toString() != x[p].toString()))
//                       return false;
//                   break;
//               default:
//                   if (y[p] != x[p]) { return false; }
//           }
//       } else {
//           if (x[p])
//               return false;
//       }
//   }
//   for(p in x) {
//       if(typeof(y[p])=='undefined') {return false;}
//   }
//   return true;
// };
// if(typeof(String.prototype.trim) === "undefined") {
//     String.prototype.trim = function()
//     {
//         return String(this).replace(/^\s+|\s+$/g, '');
//     };
// }
// var uniqueObject = function(list,keys) {
// 	var dict = {};
// 	_.each(list, function(item) {
// 		if(item===null)return;
// 		var fingerPrint = _.map(keys, function(k) {return (item[k])?item[k]:"";}).join("_");
// 		dict[fingerPrint] = item;
// 	});
// 	return _.map(dict, function(item,index) { return item; });
// };
// var makeid = function() {
// 	var text = "";
// 	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// 	for (var i = 0; i < 5; i++)
// 		text += possible.charAt(Math.floor(Math.random() * possible.length));
// 	return text;
// };
// function eventFire(el, etype){
//   if (el.fireEvent) {
//     (el.fireEvent('on' + etype));
//   } else {
//     var evObj = document.createEvent('Events');
//     evObj.initEvent(etype, true, false);
//     el.dispatchEvent(evObj);
//   }
// }
// function clone(obj) {
//     // Handle the 3 simple types, and null or undefined
//     if (null == obj || "object" != typeof obj) return obj;
//     // Handle Date
//     if (obj instanceof Date) {
//         var copy = new Date();
//         copy.setTime(obj.getTime());
//         return copy;
//     }
//     // Handle Array
//     if (obj instanceof Array) {
//         var copy = [];
//         for (var i = 0, len = obj.length; i < len; i++) {
//             copy[i] = clone(obj[i]);
//         }
//         return copy;
//     }
//     // Handle Object
//     if (obj instanceof Object) {
//         var copy = {};
//         for (var attr in obj) {
//             if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
//         }
//         return copy;
//     }
//     throw new Error("Unable to copy obj! Its type isn't supported.");
// }
// function numberComparator(a,b) {
//     return a-b;
// }
// function sortGeneral(a) {
// 	if(isNumberList(a)) {
// 		return a.slice(0).sort(numberComparator);
// 	} else {
// 		return a.slice(0).sort();
// 	}
// }
// function scrollToElement(container,element,options) {
// 	var c = (container instanceof jQuery)? container.get(0): container;
// 	var e = (element instanceof jQuery)? element.get(0): element;
// 	// var offset = getOffset(e);
// 	// var offset = e.offsetTop;
// 	var offset = $(e).offset();
// 	if(offset.top===0) return;
// 	// c.scrollTop=offset.top;
// 	var animDuration = (options.duration)?options.duration:500;
// 	var marginTop = (options.marginTop)?options.marginTop:50;
// 	$(c).animate({scrollTop: offset.top-marginTop}, animDuration);
// }
// function scrollToCoord(container, coord, options) {
// 	var animDuration = (options.duration)?options.duration:500;
// 	var margin = [	(options.marginTop)?options.marginTop:50, 
// 					(options.marginLeft)?options.marginLeft:50];
// 	$(c).animate({	scrollTop: coord.top-marginTop, 
// 					scrollLeft: coord.left-marginLeft
// 					}, animDuration);	
// }
// function getOffset( el ) {
//     var _x = 0;
//     var _y = 0;
//     while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
//         _x += el.offsetLeft - el.scrollLeft;
//         _y += el.offsetTop - el.scrollTop;
//         el = el.parentNode;
//     }
//     return { top: _y, left: _x };
// }
// function readSingleFile(evt) {
// 	//Retrieve the first (and only!) File from the FileList object
// 	var f = evt.target.files[0]; 
// 	if (f) {
//   	var r = new FileReader();
//   	r.onload = function(e) { 
// 	    var contents = e.target.result;
// 	    alert( "Got the file.n" 
// 	          +"name: " + f.name + "n"
// 	          +"type: " + f.type + "n"
// 	          +"size: " + f.size + " bytesn"
// 	          + "starts with: " + contents.substr(1, contents.indexOf("n"))
// 	    );  
// 	  }
// 	  r.readAsText(f);
// 	} else { 
// 	  alert("Failed to load file");
// 	}
// }
// function UserException(message) {
//    this.message = message;
//    this.name = "UserException";
// }
// function strNode(nodes) {
// 	var str = "";
// 	for (var i in nodes) {
// 		var n= nodes[i];
// 		var input_desc = "";
// 		// generate I 
// 		if(_.isArray(n.I)) {
// 			_.each(n.I, function(n) {
// 				var node_num = nodes.indexOf(n);
// 				input_desc += "NODE("+node_num +"),";
// 			},this);
// 		} else if(n.I){
// 			input_desc = "NODE("+nodes.indexOf(n.I)+")";
// 		} else {
// 			input_desc = "__";
// 		}
// 		// generate V 
// 		var value_desc = "[";
// 		_.each(n.V, function(v) {
// 			if(isDom(v)) {
// 				value_desc += "(D)"+ $(v).clone().wrap('<p>').parent().html().substring(0,100)+",";
// 			} else value_desc += v+",";
// 		},this);
// 		value_desc +="]";
// 		// generate P
// 		var p_desc = (n.P && n.P.type)?n.P.type+", param:"+n.P.param:'__'; 
// 		// compose all
// 		var line = "NODE("+i+")\n\tINPUT:"+input_desc+"\n\tP:"+p_desc+"\n\tV:"+value_desc+"\n";
// 		str+=line;
// 	}
// 	return str;
// }
// function html_differ_without_children(el1, el2) {
// 	return $(el1).html_no_children() != $(el2).html_no_children();
// }
// function toArray(obj) {
// 	return (_.isArray(obj))?obj:[obj];
// }
// function getElementFeatures(eL) {
// 	// from an element list, find common features and return them 
// 	var ft = {};
// 	var left = _.uniq(_.map(eL, function(e) {  return $(e).offset().left; }));
// 	var top = _.uniq(_.map(eL, function(e) {  return $(e).offset().top; }));
// 	var width = _.uniq(_.map(eL, function(e) {  return $(e).width(); }));
// 	var height = _.uniq(_.map(eL, function(e) {  return $(e).height(); }));
// 	var cl = _.uniq(_.map(eL, function(e) {  return $(e).attr('class'); }));
// 	var fingerPrint = _.uniq(_.map(eL, function(e) {  return $(e).fingerprint(); }));	
// 	ft.left = (left.length==1)? left[0] : undefined;
// 	ft.top = (top.length==1)? top[0] : undefined;
// 	ft.width = (width.length==1)? width[0] : undefined;
// 	ft.height = (height.length==1)? height[0] : undefined;
// 	ft.cl = (cl.length==1)? cl[0] : undefined;
// 	ft.fingerPrint = (fingerPrint.length==1)? fingerPrint[0] : undefined;
// 	return ft;
// }
// jQuery.fn.extend({ 
//         disableSelection : function() { 
//                 return this.each(function() { 
//                         this.onselectstart = function() { return false; }; 
//                         this.unselectable = "on"; 
//                         jQuery(this).css('user-select', 'none'); 
//                         jQuery(this).css('-o-user-select', 'none'); 
//                         jQuery(this).css('-moz-user-select', 'none'); 
//                         jQuery(this).css('-khtml-user-select', 'none'); 
//                         jQuery(this).css('-webkit-user-select', 'none'); 
//                 }); 
//         } 
// }); 
// // function testCommand(id) {
// // 	var n = pg.panel.get_node_by_id(id);
// // 	var commands = pg.planner.find_applicable_commands([n]);
// // 	console.log(commands);
// // 	return commands;
// // }
// // simple draggable object script
// (function($) {
//     $.fn.drags = function(opt) {
//         opt = $.extend({handle:"",cursor:"move"}, opt);
//         if(opt.handle === "") {
//             var $el = this;
//         } else {
//             var $el = this.find(opt.handle);
//         }
//         return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
//             if(opt.handle === "") {
//                 var $drag = $(this).addClass('draggable');
//             } else {
//                 var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
//             }
//             var z_idx = $drag.css('z-index'),
//                 drg_h = $drag.outerHeight(),
//                 drg_w = $drag.outerWidth(),
//                 pos_y = $drag.offset().top + drg_h - e.pageY,
//                 pos_x = $drag.offset().left + drg_w - e.pageX;
//             $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
//                 $('.draggable').offset({
//                     top:e.pageY + pos_y - drg_h,
//                     left:e.pageX + pos_x - drg_w
//                 }).on("mouseup", function() {
//                     $(this).removeClass('draggable').css('z-index', z_idx);
//                 });
//             });
//             e.preventDefault(); // disable selection
//         }).on("mouseup", function() {
//             if(opt.handle === "") {
//                 $(this).removeClass('draggable');
//             } else {
//                 $(this).removeClass('active-handle').parent().removeClass('draggable');
//             }
//         });
//     }
// })(jQuery);
// function jsonClone(obj) {
// 	return JSON.parse(JSON.stringify(obj));
// }
// function isFiltered2D(originalArr, filteredArr) {
// 	return _.every(_.range(originalArr.length), function(i){ 
// 		return isFiltered(originalArr[i], filteredArr[i])==true;
// 	});
// }
// function isFiltered(original,filtered) {
// 	var IV = _.clone(original);
// 	for(var i in filtered) {
// 		var idx = IV.indexOf(filtered[i]);
// 		if(idx==-1) return false;
// 		else IV.splice(0,idx);
// 	}
// 	return true;
// }
// function isFilteredAndExtracted2D(originalArr, filteredArr) {
// 	return _.every(_.range(originalArr.length), function(i){ 
// 		return isFilteredAndExtracted(originalArr[i], filteredArr[i])==true;
// 	});
// }
// function isFilteredAndExtracted(original,filtered) {
// 	var IV = _.clone(original);
// 	for(var i in filtered) {
// 		var idx = -1;
// 		for(var j in IV) {
// 			if(IV[j].indexOf(filtered[i])!=-1) {
// 				idx = j;
// 				break;
// 			}
// 		}
// 		if(idx==-1) return false;
// 		else IV.splice(0,idx);
// 	}
// 	return true;
// }
// function get_attr_table(elements) {
// 	var list_of_dict = _.map($.makeArray(elements), function(el) {
// 		return get_attr_dict(el);
// 	});
// 	var keys = _.uniq(_.flatten(_.map(list_of_dict, function(d) { return _.keys(d); })));
// 	var table = {};
// 	_.each(keys, function(k) {
// 		table[k]= _.map(list_of_dict, function(d) { 
// 			return d[k]; 
// 		});
// 	});
// 	return table;
// }
// function get_attr_dict(elements) {
// 	var dict = {};
// 	if (!isDom(elements) && !isDomList(elements)) return false;
// 	_.each($.makeArray(elements), function(el) {
// 		_.each(Vespy.planner.attr_func_list, function(attr, key) {
// 			var value = attr.getter(el);
// 			if(typeof value !== 'undefined'  || (el.tagName=='A' && attr.attr_key=='download')) {
// 				if((attr.attr_key in dict) && dict[attr.attr_key]!=value)
// 					dict[attr.attr_key] = "(multiple values)";
// 				else 
// 					dict[attr.attr_key] = value;
// 			}	 
// 		});
// 	});
// 	return dict;
// }
// // function matchPairs(array1, array2, mode) {
// // 	var shorterI = Math.min(array1.length, array2.length);
// // 	var longerI = Math.max(array1.length, array2.length);
// // 	var newArr1=[]; var newArr2=[];
// // 	if(array1.length<array2.length)
// // 	if(mode=='extend') { 	// extend the last element of the shorter list to the end
// // 		while(true) {
// // 			if(array1.length>=i1) newArr
// // 		}
// // 	}
// // }
// function getValueType(V) {
// 	if(isDomList(V)) return "&lt;" + V[0].tagName + "&gt; elements";
// 	if(isStringList(V)) return "string values";
// 	if(isNumberList(V)) return "numbers";
// 	if(isBooleanList(V)) return "boolean values";
// 	return "mixed";
// }
// function dom2jsonML(el) {
//   	return JsonML.fromHTML(el);
// }
// function jsonML2dom(json) {
//   	return JsonML.toHTML(json);
// }
// function serialize_nodes(_nodes, _include_values) {
// 	var nodes = $.makeArray(_nodes);
// 	return _.map(nodes, function(n){
// 		return Vespy.Node.serialize(n, _include_values);
// 	});
// }
// function serialize_node(n, _include_values) {
// 	return Vespy.Node.serialize(n,_include_values);
// }
// function serialize_values(V) {
// 	return _.map(V, function(v) {
// 		if(isDom(v)) return $(v).prop('tagName')+":"+$(v).text();
// 		else return v;
// 	});
// }
// function matchLists(l1, l2, func, option) {	// option:= (min_len|repeat|extend)
// 	var real1, real2;
// 	var result = [];
// 	if(l1 && !_.isArray(l1)) real1 = [l1];
// 	if(l2 && !_.isArray(l2)) real2 = [l2];
// 	if(real1.length==0 || real2.length==0) return false;
// 	if (real1.length==1) {
// 		if (real2.length==1) {
// 			result.push(func(l1[0],l2[0]));
// 		} else {	
// 			for(var i in l2) result.push(func(l1[0], l2[i]));
// 		}
// 	} else {
// 		if (real2.length==1) {
// 			for(var i in l1) result.push(func(l1[0], l2[i]));	
// 		} else { // both are longer than 1
// 			if (l1.length==l2.length) {
// 				for(var i in l1) result.push(func(l1[i], l2[i]));	
// 			} else {
// 				if(option == "extend") {
// 					var min_length = Math.min(l1.length, l2.length);
// 					var max_length = Math.max(l1.length, l2.length);
// 					for (var i=0; i<min_length; i++) result.push(func(l1[i],l2[i]));
// 					if(l1.length<l2.length) 
// 						for (var i=min_length; i<max_length; i++) result.push(func(l1[min_length-1],l2[i]));
// 					else 
// 						for (var i=min_length; i<max_length; i++) result.push(func(l1[i],l2[min_length-1]));
// 				} else if(option=="repeat") {
// 					var i1=0; var i2=0;
// 					for(var i=0; i<Math.max(l1.length, l2.length);i++) {
// 						result.push(func(l1[i1],l2[i2]));
// 						i1 = (i1<l1.length-1)? i1+1: 0;
// 						i2 = (i2<l2.length-1)? i2+1: 0; 
// 					}
// 				} else{  // option=="min_len" or undefined
// 					var min_length = Math.min(l1.length, l2.length);
// 					for (var i=0; i<min_length; i++) result.push(func(l1[i],l2[i]));
// 				} 
// 			}
// 		}
// 	}
// 	return result;
// }
// function applyFunctionTwoLists(l1, l2, func) {
// 	// func has two parameters,  one of l1 and l2 can be single element. 
// 	if(l1.length==l2.length) {
// 		return _.map(_.zip(l1, l2), function(e) {
// 			return func(e[0],e[1]);
// 		});
// 	} else {
// 		if(l1.length===1) {
// 			return _.map(l2, function(e) {
// 				return func(l1[0],e);
// 			});
// 		} else if(l2.length===1) {
// 			return _.map(l1, function(e) {
// 				return func(e,l2[0]);
// 			});
// 		} else {
// 			var shorter_len = Math.min(l1.length, l2.length);
// 			return _.map(_.range(shorter_len), function(i) {
// 				return func(l1[i],l2[i]);
// 			});
// 		}
// 	}
// }
// function get_parameter_value(parameter, node) {
// 	if(parameter.match(/input[0-9]/)==null) {
// 		// parameter is string or number value
// 		return parameter;
// 	} else {
// 		// parameter is node id
// 		var param_number = parseInt(parameter.match(/input([0-9])/)[1]);
// 		var param_node_id = node.I[param_number];
// 		if(!param_node_id) return false;
// 		var param_node = Vespy.page.get_node_by_id(param_node_id, node);
// 		if(param_node==false) return false;
// 		else return param_node.V;
// 	}
// }
// function get_nodes_range(nodes) { 
// 	if(!_.every(nodes, function(node) {  return typeof node.position !== 'undefined'; })) {
// 		var min_x = _.min(_.map(nodes, function(n){ return (n.position)? n.position[1]:Vespy.MAX_INT; }));
// 		var min_y = _.min(_.map(nodes, function(n){ return (n.position)? n.position[0]:Vespy.MAX_INT; }));
// 		return {'min_x': min_x, 'min_y':min_y, 'rows':1, 'columns':nodes.length};
// 	} else {
// 		// find appropriate target_position
// 		var position_range = [Vespy.MAX_INT, Vespy.MIN_INT, Vespy.MAX_INT, Vespy.MIN_INT];	// min-y, max-y, min-x, max-x
// 		for(var i in nodes) {
// 			position_range = [Math.min(position_range[0],nodes[i].position[0]),
// 								Math.max(position_range[1],nodes[i].position[0]),
// 								Math.min(position_range[2],nodes[i].position[1]),
// 								Math.max(position_range[3],nodes[i].position[1])];
// 		}
// 		return {'min_x':position_range[2], 'min_y':position_range[0],
// 				'rows':position_range[3]-position_range[2], 'columns':position_range[1]-position_range[0] };
// 	}	
// }
// function get_true_booleans(org_list, filtered_list){
// 	var idx_filtered = 0;
// 	var correct_boolean_list = [];
// 	for(var i=0; i<org_list.length; i++) {
// 		if(typeof filtered_list[idx_filtered]==='undefined') correct_boolean_list.push(false);
// 		else if(org_list[i] == filtered_list[idx_filtered]) {
// 			correct_boolean_list.push(true);
// 			idx_filtered += 1;
// 		} else correct_boolean_list.push(false);
// 	}
// 	return correct_boolean_list;
// }
// jQuery.fn.makeEditable = function(onChange_callback) {	
// 	$(this).attr("contenteditable","true");
// 	$(this).focus(function() {
// 		$(this).attr("old-background-color",$(this).css("background-color"));
// 		$(this).css("background-color","rgba(255,255,0,0.3)");
// 		$(this).attr("previousValue",$(this).text());
// 	}).blur(function() {
// 		if($(this).attr("previousValue") != $(this).text()) {
// 			onChange_callback($(this).text());
// 		}
// 		$(this).css("background-color",$(this).attr("old-background-color"));
// 		$(this).removeAttr("previousValue");
// 	});
// }
// jQuery.fn.makeNonEditable = function() {
// 	$(this).unbind("click");
// 	$(this).unbind("focus");
// 	$(this).unbind("blur");
// };
// function toTitleCase(str)
// {
//     return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
// }
// function trimText(desc, max) {
// 	try{
// 		if(desc.length>max) return desc.substring(0,max)+"...";
// 		else return desc;	
// 	} catch(e) { 
// 		console.log(e.stack); 
// 	}
// }
// function pickCombination(items, n_to_pick, combination) {
// 	var new_combination=[];
// 	if(!combination || !_.isArray(combination) || combination.length==0) 
// 		new_combination = _.map(items, function(e){ return [e]; });
// 	else {
// 		for(var n in combination) {
// 			for(var i in items) {
// 				new_combination.push(combination[n].concat(items[i]));
// 			}
// 		}
// 	}	
// 	if(n_to_pick==1) return _.filter(new_combination, function(c) {
// 		return _.uniq(c).length== c.length;
// 	});
// 	else return pickCombination(items, n_to_pick-1, new_combination);
// }
// function sum(list) {
// 	return list.reduce(function(pv, cv) { return pv + cv; }, 0);
// }
// function str2array(str, convertToType) {
// 	if(str.match(/^\s+$/)) return []; // IF GIVEN STRING IS EMPTY, RETURN EMPTY LIST
// 	if (convertToType == "number") {
// 		return _.map(str.split(","), function(s){ 
// 			var regexFloatNumber = new RegExp("^[+-]?[0-9]+[.]?[0-9]*$");
// 			if(regexFloatNumber.test(s.trim())==false) {
// 				throw new Error("Make sure that no cell is empty or containing non-number values.");
// 			} else {
// 				return parseFloat(s.trim()); 
// 			}
// 		});
// 	} else if(convertToType == "boolean") {
// 		return _.map(str.split(","), function(s){ 
// 			if(s.trim().toLowerCase()=="t" || s.trim().toLowerCase()=="f") {
// 				return (s.trim().toLowerCase()==="t"); 	
// 			} else {
// 				throw "Some examples are empty or containing values other than boolean values ('T' or 'F').";
// 			}
// 		});
// 	} else {
// 		return _.map(str.split(","), function(s){ return s.trim(); });	
// 	}
// }
// function isSameProgram(p1, p2) {
// 	if (p1.type != p2.type) return false;
// 	for (var pkey in p1.param) {
// 		if (pkey in p2.param == false) return false;
// 		if (p2.param[pkey] != p1.param[pkey]) return false;
// 	}
// 	return true;
// }
// function isSameShape(arr1, arr2) {
// 	if(arr1.length != arr2.length) return false;
// 	for(var i in arr1) {
// 		if(_.isArray(arr1[i]) && _.isArray(arr2[i])) {
// 			// BOTH ARE ARRAY
// 			if(!isSameShape(arr1[i],arr2[i])) return false;
// 		} else if (!_.isArray(arr1[i]) && !_.isArray(arr2[i])) {  
// 			// NEITHER ARE ARRAY
// 			continue;
// 		} else {
// 			// EITHER IS ARRAY
// 			return false;
// 		}
// 	}
// 	return true;
// }
// function isPredicateArray(arrayOfArray) {
// 	return _.every(arrayOfArray, function(arr){
// 		return _.every(arr, function(v) { return _.isBoolean(v); });
// 	});
// }
// function reload(id) {
//     var $el =  $('#' + id);
//     $('#' + id).replaceWith('<script id="' + id + '" src="' + $el.prop('src') + '"><\/script>');
// }
// function evaluateTypeConsistencyOfStep(step) {
// 	var flattenValues = _.flatten(_.map(step, function(s){ 
// 		return str2array(s); }));
// 	var evalResult = evaluateTypeConsistencyOfArray(flattenValues);
// 	return evalResult;
// }
// function evaluateTypeConsistencyOfArray(arr) {
// 	var types = _.map(arr, function(str){ return getDataType(str); });
// 	if(_.uniq(types).length == 1) {
// 		return { consistency: true,  type: _.uniq(types)};		
// 	} else {
// 		return { consistency: false, type: _.uniq(types)};
// 	}
// }
// function getDataType(str) {
// 	var regexFloatNumber = new RegExp("^[+-]?[0-9]+[.]?[0-9]*$");
// 	var regexBoolean = new RegExp("^[tf]$");
// 	if(regexFloatNumber.test(str.trim())) return "Number";
// 	else if(regexBoolean.test(str.trim().toLowerCase())) return "Boolean";
// 	else {
// 		return "String";	
// 	}
// }
// MixedVespy.num2code = function(i) {
// 	return MixedVespy.num2code_worker(i+1);
// };
// MixedVespy.num2code_worker = function(i) {
// 	if(i<=26) {
// 		return String.fromCharCode(64 + i);
// 	} else {
// 		return MixedVespy.num2code(i/26) + String.fromCharCode(64 + (i%26));
// 	}
// };
// MixedVespy.code2num = function(c) {
// 	var num;
// 	var base = 1;
// 	for(var i=c.length-1;i>=0;i--) {
// 		if(i==c.length-1) {
// 			num = c.charCodeAt(i) - 64;	
// 		} else {
// 			num += (c.charCodeAt(i) - 64) * base;	
// 		}
// 		base = base*26;
// 	}
// 	return num-1;
// };
var LogItem = (function () {
    function LogItem(event, tid, detail) {
        this.time = Date.now();
        this.event = event;
        this.tid = tid;
        this.detail = detail;
    }
    return LogItem;
}());
/// <reference path="references.ts" />
var Analyzer_MixedTrial = (function () {
    function Analyzer_MixedTrial() {
    }
    Analyzer_MixedTrial.analyzeFailure = function (trial, i) {
        // Returns actionable feedback for i-th row that failed to find any program
        var failMessages = [];
        var failCode = [];
        var dataFlatArr = trial.getFlatArray();
        var prevStepData = dataFlatArr.slice(0, i + 1);
        var curStepData = (i < trial.getStepNum()) ? trial.steps[i] : trial.output;
        var curValues = _.map(curStepData, function (v) { return str2array(v); });
        var prevValues;
        // CASE: EMPTY CELL --> IS IT INTENTIONAL?
        if (_.some(curStepData, function (v) { return v.length == 0; })) {
            failMessages.push("There is an empty case. Did you miss filling it?");
            failCode.push("EMPTY_CELL");
        }
        // CASE: PARSEFLOAT EXCEPTION --> HIGHLIGHT THE CELL IN YELLOW
        var typeConsistency = evaluateTypeConsistencyOfStep(curStepData);
        if (typeConsistency.consistency == false) {
            var strTypes = typeConsistency.type.toString();
            failMessages.push("There are " + strTypes + " examples in this case. This might have failed the computer finding a program.");
            failCode.push("INCONSISTENT_TYPE_[" + typeConsistency.type.toString() + "]");
        }
        // CASE: CURRENT STEP IS A FILTERED LIST OF ANY STEPS ABOVE -->   
        // 		 CONFIRM & TELL THEM TO GIVE T, F  	
        for (var _i = 0, prevStepData_1 = prevStepData; _i < prevStepData_1.length; _i++) {
            var prevStep = prevStepData_1[_i];
            prevValues = _.map(prevStep, function (v) { return str2array(v); });
            if (isFiltered2D(prevValues, curValues)) {
                failMessages.push("If you are trying to filter values from steps above, you need an additional step containing T or F.");
                failCode.push("FILTER_WITHOUT_TF");
                break;
            }
            else { }
        }
        // CASE: CURRENT STEP IS A SUBSTRING OF FILTERED VERSION LIST -->
        // 		 CONFIRM & TELL THEM TO DO TWO TASKS AT THE SAME TIME
        for (var _a = 0, prevStepData_2 = prevStepData; _a < prevStepData_2.length; _a++) {
            var prevStep = prevStepData_2[_a];
            prevValues = _.map(prevStep, function (v) { return str2array(v); });
            if (isFilteredAndExtracted(prevValues, curValues)) {
                failMessages.push("Are you trying to filter and extract part of string at the same time? If that's the case, you have to do them in two steps.");
                failCode.push("FILTER_AND_EXTRACT");
                break;
            }
            else { }
        }
        // CASE: CURRENT STEP IS ALL T and F, 
        // 		but previous rows do not have numbers --> 
        // 		T and F can only be calculated from numbers only
        if (_.every(_.flatten(curValues), function (v) {
            return v.toLowerCase() == "t" || v.toLowerCase() == "f";
        })) {
            var isThereAnyNumberCaseWithSameShape = false;
            for (var _b = 0, prevStepData_3 = prevStepData; _b < prevStepData_3.length; _b++) {
                var prevStep = prevStepData_3[_b];
                try {
                    prevValues = _.map(prevStep, function (v) { return str2arrayNumber(v); });
                }
                catch (e) {
                    continue;
                }
                if (!isSameShape(curValues, prevValues))
                    continue;
                else {
                    // AND CAN BE CONVERETED TO NUMBERS
                    isThereAnyNumberCaseWithSameShape = true;
                    break;
                }
            }
            if (!isThereAnyNumberCaseWithSameShape) {
                failMessages.push("T, F can be calculated from numbers only. Insert a step above, and find suitable numbers that can be calculated to this step.");
                failCode.push("TF_WITHOUT_NUMBER");
            }
        }
        if (failMessages.length == 0) {
            failMessages.push("No program is found for this step. Consider adding a step above.");
            failCode.push("NO_PROGRAM_FOUND");
        }
        var htmlFailMessages = "<ul class='feedback_list'>";
        for (var ifm in failMessages) {
            htmlFailMessages += "<li><i class='fa fa-exclamation-triangle' aria-hidden='true'></i> " + failMessages[ifm] + "</li>";
        }
        htmlFailMessages += "</ul>";
        var analysis = {
            html: htmlFailMessages,
            failCode: failCode
        };
        return analysis;
    };
    return Analyzer_MixedTrial;
}());
var MixedPBE = (function () {
    function MixedPBE() {
        this.log = new Log("TBD");
        this.last_task_tid = undefined;
        this.mode = "{{mode}}";
        this.workerID = "{{workerID}}";
        this.taskModels = [];
        this.taskViews = [];
        this.taskControllers = [];
        this.crowdPlanner = new CrowdPlanner();
        for (var _i = 0, _a = TaskDefinition.getAllIDs(); _i < _a.length; _i++) {
            var tid = _a[_i];
            // PREPARE ELEMENT THAT WILL CONTAIN TASK 
            var $section = $("<div class='section hidden' tid='" + tid + "'></div>");
            if (tid.indexOf("tutorial") != -1) {
                $section.insertBefore($("div.tutorial_container div.endOfTutorial"));
            }
            else {
                $section.insertBefore($("div.task_container div.endOfTask"));
            }
            // CREATING TASKMODEL and VIEW
            var model = new TaskModel(TaskDefinition.getTaskDefinition(tid), this);
            var view = new TaskView($section);
            var controller = new TaskController(tid, this);
            controller.connectAll(model, view);
            // ADD MVC TO THE LIST
            this.taskModels.push(model);
            this.taskViews.push(view);
            this.taskControllers.push(controller);
            // RENDER TASK
            view.renderTask();
        }
        // ATTACH ALL KEYBOARD EVENTS
        this.attachKeyboardEventHandler();
    }
    ///// DEBUGGING FUNCTIONS
    MixedPBE.prototype.skipToTutorial = function () {
        $(".introduction").addClass("hidden");
        $(".tutorial_container").removeClass("hidden");
        $(".tutorial_container").find("div.section").removeClass("hidden");
    };
    MixedPBE.prototype.skipToTask = function () {
        $(".introduction").addClass("hidden");
        $(".task_container").removeClass("hidden");
        $(".task_container").find("div.section").removeClass("hidden");
    };
    MixedPBE.prototype.skipToScreening = function () {
        $(".introduction").addClass("hidden");
        $(".task_container").addClass("hidden");
        $(".tutorial_container").addClass("hidden");
        $(".screening_container").removeClass("hidden");
    };
    /////// SUBMITTING DATA TO THE SERVER
    MixedPBE.prototype.submit = function () {
        var data = {};
        // DEMOGRAPHIC QUESTIONS
        data['demography'] = {};
        data['demography']['q_age'] = $(".screening_container").find("input[name='age']:checked").val();
        data['demography']['q_gender'] = $(".screening_container").find("input[name='gender']:checked").val();
        data['demography']['q_gender_other'] = $(".screening_container").find("input#q_gender_other").val();
        data['demography']['q_education'] = $(".screening_container").find("input[name='education']:checked").val();
        data['demography']['q_major'] = $(".screening_container").find("input#q_major").val();
        data['demography']['q_occupation'] = $(".screening_container").find("input#q_occupation").val();
        data['demography']['q_prog_exp'] = $(".screening_container").find("input[name='prog_exp']:checked").val();
        data['demography']['q_computer_exp'] = [];
        for (var i = 1; i <= 5; i++) {
            data['demography']['q_computer_exp'].push($(".screening_container")
                .find("input[name='computer_exp_" + i + "']").prop('checked'));
        }
        data['tasks'] = _.map(this.taskModels, function (m) { return m.getReport(); });
        data['mode'] = this.mode;
        console.log(data);
        this.submit_worker(data);
    };
    MixedPBE.prototype.submit_worker = function (data) {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            }
        };
        xmlhttp.open("POST", "submit", true);
        xmlhttp.send({
            data: JSON.stringify(data),
            workerID: this.workerID
        });
    };
    MixedPBE.prototype.attachKeyboardEventHandler = function () {
        // KEYBOARD EVENT
        $("table.inAndOut").on("keydown", "td:not(.lastColumn)", function (e, ui) {
            if (e.keyCode == 9) {
                var colNum = $(e.target).parents("tr").find("td").index(e.target);
                var nextRow = $(e.target).parents("tr").next("tr");
                if (nextRow.length == 0) {
                    nextRow = $(e.target).parents("table").find("tr").first();
                    if ($(nextRow).find("td").length > colNum)
                        colNum++;
                }
                $(nextRow).find("td").get(colNum).focus();
                // e.preventDefault();
                return false;
            }
        });
    };
    return MixedPBE;
}());
function setCaseNum(tr, caseNum) {
    var existingCases = $.makeArray($(tr).find("td"));
    $(tr).find("td").remove(); // CLEAR
    for (var i = 0; i < caseNum; i++) {
        if (i < existingCases.length)
            $(tr).append(existingCases[i]);
        else {
            $(tr).append("<td><input></td>");
        }
    }
    return tr;
}
$(document).ready(function () {
    var mixedPBE = new MixedPBE();
});
window.onbeforeunload = function () { return "Watch out! The entire work on this survey will be lost."; };
var MESSAGE_STEP_FAIL = "<i class='fa fa-ban' aria-hidden='true'></i>\n                    Found no program that calculates this step for one of the above steps.";
var MESSAGE_STEP_WARNING = "<i class='fa fa-exclamation-circle' aria-hidden='true'></i>\n                    Found [minimum_num_prog] programs that calculate this step.";
var MESSAGE_STEP_SUCCESS = "<i class='fa fa-check-circle' aria-hidden='true'></i>\n                    Found a single program that calcuates the step.";
var MESSAGE_AMBIGUOUS_STEPS = "<i class='fa fa-ban' aria-hidden='true'></i> For at least one step, the computer found no program or multiple programs. Try to teach a single program for each step.";
var MESSAGE_PASS = "<i class='fa fa-check-circle' aria-hidden='true'></i>The computer learned the correct program.";
var MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM = "<i class='fa fa-ban' aria-hidden='true'></i> An inconsistent set of programs was returned for the different examples provided.";
var REQUIRED_MINUTES = 3;
var REQUIRED_TRIALS = 8;
;
var MODE_FIXED = "fixed";
var MODE_MIXED_TRIAL = "mixed_trial";
var MODE_MIXED_TASK = "mixed_task";
var MODE_MIXED_ALL = "mixed_all";
var CrowdPlanner = (function () {
    function CrowdPlanner() {
        this.operations = {
            substring: {
                generate: function (Is, O) {
                    var Ps = [];
                    // VALIDATING OUTPUT
                    if (O.length == 0 || !isStringList(O))
                        return [];
                    var oValues = _.map(O, function (v) { return str2array(v); });
                    var flat_O_values = _.flatten(oValues);
                    if (flat_O_values.length == 0)
                        return [];
                    _.each(Is, function (I, I_index) {
                        // VALIDATE INPUT
                        if (!isStringList(I) || I.length == 0)
                            return false;
                        var I_values = _.map(I, function (v) { return str2array(v); });
                        var flat_I_values = _.flatten(I_values);
                        var all_list = flat_I_values.concat(flat_O_values);
                        if (flat_I_values.length != flat_O_values.length)
                            return false;
                        // CHECKING SUBSTRINg IS SAME AS ORIGINAL LIST
                        var isAllSame = true;
                        for (var i = 0; i < Math.min(flat_O_values.length, flat_I_values.length); i++) {
                            if (flat_I_values[i].indexOf(flat_O_values[i]) == -1)
                                return false;
                            if (flat_I_values[i] != flat_O_values[i])
                                isAllSame = false;
                        }
                        if (isAllSame)
                            return false; // don't need to substring 
                        // INFER
                        var validCombination = [];
                        var sharedTokens = this.get_common_tokens(flat_I_values);
                        for (var s_tok_i in sharedTokens) {
                            for (var e_tok_i in sharedTokens) {
                                var s_t = sharedTokens[s_tok_i];
                                var e_t = sharedTokens[e_tok_i];
                                // 1. inclusive(S)-exclusive(E) case. 
                                var trial_output = [];
                                for (var i = 0; i < flat_I_values.length; i++) {
                                    var s_i = flat_I_values[i].indexOf(s_t);
                                    var e_i = flat_I_values[i].indexOf(e_t, s_i + 1);
                                    if (s_i == -1)
                                        s_i = flat_I_values[i].length;
                                    if (e_i == -1)
                                        e_i = flat_I_values[i].length;
                                    if (s_i < e_i)
                                        trial_output.push(flat_I_values[i].substring(s_i, e_i));
                                    else
                                        trial_output.push("");
                                }
                                if (isSameArray(trial_output, flat_O_values))
                                    validCombination.push({ 'from': s_t, 'to': e_t, 'include_from': true, 'include_to': false });
                                // 2. inclusive(S)-inclusive(E) case. 
                                var trial_output = [];
                                for (var i = 0; i < flat_I_values.length; i++) {
                                    var s_i = flat_I_values[i].indexOf(s_t);
                                    var e_i = flat_I_values[i].indexOf(e_t, s_i + 1);
                                    if (s_i == -1)
                                        s_i = flat_I_values[i].length;
                                    if (e_i == -1)
                                        e_i = flat_I_values[i].length;
                                    if (s_i < e_i)
                                        trial_output.push(flat_I_values[i].substring(s_i, e_i + e_t.length));
                                    else
                                        trial_output.push("");
                                }
                                if (isSameArray(trial_output, flat_O_values))
                                    validCombination.push({ 'from': s_t, 'to': e_t, 'include_from': true, 'include_to': true });
                                // 3. exclusive(S)-exclusive(E) case. 
                                var trial_output = [];
                                for (var i = 0; i < flat_I_values.length; i++) {
                                    var s_i = flat_I_values[i].indexOf(s_t);
                                    var e_i = flat_I_values[i].indexOf(e_t, s_i + 1);
                                    if (s_i == -1)
                                        s_i = flat_I_values[i].length;
                                    if (e_i == -1)
                                        e_i = flat_I_values[i].length;
                                    if (s_i < e_i)
                                        trial_output.push(flat_I_values[i].substring(s_i + s_t.length, e_i));
                                    else
                                        trial_output.push("");
                                }
                                if (isSameArray(trial_output, flat_O_values))
                                    validCombination.push({ 'from': s_t, 'to': e_t, 'include_from': false, 'include_to': false });
                                // 4. exclusive(S)-inclusive(E) case. 
                                var trial_output = [];
                                for (var i = 0; i < flat_I_values.length; i++) {
                                    var s_i = flat_I_values[i].indexOf(s_t);
                                    var e_i = flat_I_values[i].indexOf(e_t, s_i + 1);
                                    if (s_i == -1)
                                        s_i = flat_I_values[i].length;
                                    if (e_i == -1)
                                        e_i = flat_I_values[i].length;
                                    if (s_i < e_i)
                                        trial_output.push(flat_I_values[i].substring(s_i + s_t.length, e_i + e_t.length));
                                    else
                                        trial_output.push("");
                                }
                                if (isSameArray(trial_output, flat_O_values))
                                    validCombination.push({ 'from': s_t, 'to': e_t, 'include_from': false, 'include_to': true });
                            } // END OF e_tok_i
                        } // END OF s_tok_i
                        // CREATING P
                        _.each(validCombination, function (vc) {
                            Ps.push(new Program('substring', {
                                inputIndex: "" + I_index,
                                source: I_index,
                                from: vc["from"],
                                to: vc["to"],
                                include_from: vc["include_from"],
                                include_to: vc["include_to"]
                            }));
                        });
                    });
                    if (Ps.length > 0)
                        return [Ps[0]];
                    else
                        return Ps;
                },
                execute: function (previousSteps, P) {
                    var inputValues = previousSteps[P.param['source']];
                    var resultData = _.map(inputValues, function (iv) {
                        var start_pos, end_pos;
                        start_pos = (P.param['include_from']) ? iv.indexOf(P.param['from']) : iv.indexOf(P.param['from']) + P.param['from'].length;
                        if (iv.indexOf(P.param['to'], start_pos + 1) == -1)
                            end_pos = iv.length;
                        else {
                            end_pos = (P.param['include_to']) ? iv.indexOf(P.param['to'], start_pos + 1) + P.param['to'].length : iv.indexOf(P.param['to'], start_pos + 1);
                        }
                        start_pos = Math.max(0, start_pos);
                        end_pos = Math.max(0, end_pos);
                        return iv.substring(start_pos, end_pos);
                    });
                    // RETURNS DATA ONLY
                    return resultData;
                },
                unitTests: [
                    { inputs: [
                            ["a-b", "b-c"],
                            ["abe", "cde"]
                        ],
                        output: ["b", "c"],
                        program: {
                            type: "substring",
                            param: {
                                inputIndex: "0",
                                source: 0,
                                from: "-",
                                to: "____end_of_line___",
                                include_from: false,
                                include_to: false
                            }
                        }
                    },
                    { inputs: [
                            ["a-b", "b-c"],
                            ["a-b,b-c", "b-c,d-e"],
                            ["abe", "cde"]
                        ],
                        output: ["b,c", "c,e"],
                        program: {
                            type: "substring",
                            param: {
                                inputIndex: "1",
                                source: 1,
                                from: "-",
                                to: "____end_of_line___",
                                include_from: false,
                                include_to: false
                            }
                        }
                    }
                ]
            },
            // compose_text: {
            // 	// 두 개의 string셋을 합침
            // 	generate: function(Is, O) {
            // 		if(Is.length<2) return false;
            // 		var Ps = [];
            // 		var find_P = function(O, I1, I2, nth_A, nth_B) {
            // 			// FINDING CONNECTOR STRING COMMONLY APPLICABLE FOR ALL CASES
            // 			var connector_for_all_cases = _.map(O, function(ov, idx){
            // 				var cand_con;
            // 				var input_values1 = _.map(I1[idx], function(iv){ return str2array(iv); });
            // 				var input_values2 = _.map(I2[idx], function(iv){ return str2array(iv); });
            // 				var regex_for_connector = new RegExp(input_values1[idx] + "(.*)" + I2[idx],"g");
            // 				var matched_for_connector = ov.match(regex_for_connector); 
            // 				if(matched_for_connector) {
            // 					cand_con = matched_for_connector[1];
            // 				}
            // 				if (I1[idx]+cand_con+I2[idx] == ov) {
            // 					return cand_con;
            // 				} else {
            // 					return false;
            // 				}
            // 			}); 
            // 			var common_connectors = _.intersect.apply(this, connector_for_all_cases);
            // 			var connector;
            // 			if(common_connectors.length==0) throw "Fail to find a connector."; 
            // 			else connector = common_connectors[0];
            // 			// APPLYING CONNECTOR TO GET TRUE RESULT OF COMPOSITION
            // 			var composed_string = _.map(I1, function(iv1, idx){
            // 				return I1[idx] + common_connector + I2[idx];
            // 			}); 
            // 			if(isSameList(composed_string, O)){
            // 				return {
            // 					type:"compose_text",
            // 					param:{	connector:connector,
            // 							text_A:nth_A,
            // 							text_B:nth_B	}
            // 				};	
            // 			} else {
            // 				throw "Fail to find a connector."; 
            // 			}
            // 		};
            // 		// Try all combinations of two Is
            // 		var comb_two_Is = pickCombination(_.range(Is.length), 2, true);
            // 		_.each(comb_two_Is, function(i1,i2){
            // 			try {
            // 				Ps.push(find_P(O, Is[i1], Is[i2], i1, i2));	
            // 			} catch(e){
            // 				// FOUND NO CONNECTOR FOR THE PAIR OF INPUT
            // 				if(e=="Fail to find a connector.") console.log(e);
            // 			}
            // 		});
            // 		// Ps = _.without(Ps,false);
            // 		return Ps;	
            // 	},
            // 	execute: function(previousSteps, P) {
            // 		var I1 = previousSteps[P.param['text_A'];
            // 		var I2 = previousSteps[P.param['text_B'];
            // 		return _.map(I1, function(st1, idx) {
            // 			return st1 + P.param['connector'] + I2[idx];
            // 		});
            // 	},
            // 	unitTests: [
            // 		{	inputs:["abc, def"," ghi  , jkl"],
            // 			output: [ "abc-ghi", "def-jkl"],
            // 			program: {
            // 				type:"compose_text",
            // 				param: {
            // 					connector:"-",
            // 					text_A:0,
            // 					text_B:1,
            // 				}
            // 			}
            // 		}
            // 	]
            // },
            text_length: {
                // text길이 구하기 
                generate: function (Is, O) {
                    var Ps = [];
                    var oValues = _.map(O, function (ov) { return str2arrayNumber(ov); });
                    _.each(Is, function (I, I_index) {
                        var input_values_as_text = _.map(I, function (iv) { return str2array(iv); });
                        var input_values_length = _.map(input_values_as_text, function (iv) {
                            return _.map(iv, function (v) { return v.length; });
                        });
                        if (isSameArray(input_values_length, oValues)) {
                            Ps.push(new Program("text_length", {
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    return _.map(I, function (v) { return v.length; });
                },
                unitTests: [
                    { inputs: [
                            ["abc, def", " ghi  , jkl"],
                            ["a, b", ""]
                        ],
                        output: ["3,3", "3,3"],
                        program: {
                            type: "text_length",
                            param: {
                                source: 0,
                                inputIndex: "0"
                            }
                        }
                    },
                    { inputs: [
                            ["abc, def"],
                            ["aaa, b   b"]
                        ],
                        output: ["3,5"],
                        program: {
                            type: "text_length",
                            param: {
                                source: 1,
                                inputIndex: "1"
                            }
                        }
                    }
                ]
            },
            count: {
                // 리스트에서 element갯수 
                generate: function (Is, O) {
                    var Ps = [];
                    var oValues = _.map(O, function (v) { return parseInt(v); }); //  O: ["2", "2"]
                    _.each(Is, function (I, I_index) {
                        var length_of_input = _.map(I, function (iv) { return str2array(iv).length; });
                        if (isSameArray(length_of_input, oValues)) {
                            Ps.push(new Program("count", {
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    return _.map(I, function (v) { return str2array(v).length; });
                },
                unitTests: [
                    { inputs: [
                            ["abc, def", " ghi  , jkl"],
                            ["a, b", ""]
                        ],
                        output: ["2", "2"],
                        program: {
                            type: "count",
                            param: {
                                source: 0,
                                inputIndex: "" + 0
                            }
                        }
                    }
                ]
            },
            sum: {
                generate: function (Is, O) {
                    var Ps = [];
                    // oValue
                    var oValues = _.map(O, function (v) { return parseFloat(v); });
                    _.each(Is, function (I, I_index) {
                        try {
                            var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                        }
                        catch (e) {
                            return;
                        }
                        var true_sum = _.map(inputValues, function (iv) { return sum(iv); });
                        if (isSameArray(true_sum, oValues)) {
                            Ps.push(new Program("sum", {
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                    return _.map(inputValues, function (v) { return sum(v); });
                },
                unitTests: [
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["8", "3"],
                        program: {
                            type: "sum",
                            param: {
                                source: 0,
                                inputIndex: "" + 0
                            }
                        }
                    },
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["3", "36"],
                        program: {
                            type: "sum",
                            param: {
                                source: 1,
                                inputIndex: "" + 1
                            }
                        }
                    }
                ]
            },
            min: {
                generate: function (Is, O) {
                    var Ps = [];
                    // oValue :
                    var oValues = _.map(O, function (v) { return str2arrayNumber(v); });
                    _.each(Is, function (I, I_index) {
                        try {
                            var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                        }
                        catch (e) {
                            return;
                        }
                        var true_min = _.map(inputValues, function (iv) {
                            return [Math.min.apply(this, iv)];
                        });
                        if (isSameArray(true_min, oValues)) {
                            Ps.push(new Program("min", {
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                    return _.map(inputValues, function (v) {
                        return Math.min.apply(this, v);
                    });
                },
                unitTests: [
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["3", "1"],
                        program: {
                            type: "min",
                            param: {
                                source: 0,
                                inputIndex: "" + 0
                            }
                        }
                    },
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["1", "2"],
                        program: {
                            type: "min",
                            param: {
                                source: 1,
                                inputIndex: "" + 1
                            }
                        }
                    }
                ]
            },
            max: {
                generate: function (Is, O) {
                    var Ps = [];
                    // oValue :
                    var oValues = _.map(O, function (v) { return str2arrayNumber(v); });
                    _.each(Is, function (I, I_index) {
                        try {
                            var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                        }
                        catch (e) {
                            return;
                        }
                        var true_max = _.map(inputValues, function (iv) {
                            return [Math.max.apply(this, iv)];
                        });
                        if (isSameArray(true_max, oValues)) {
                            Ps.push(new Program("max", {
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                    return _.map(inputValues, function (v) {
                        return Math.max.apply(this, v);
                    });
                },
                unitTests: [
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["5", "2"],
                        program: {
                            type: "max",
                            param: {
                                source: 0,
                                inputIndex: "" + 0
                            }
                        }
                    },
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["1", "29"],
                        program: {
                            type: "max",
                            param: {
                                source: 1,
                                inputIndex: "" + 1
                            }
                        }
                    }
                ]
            },
            reverse_array: {
                generate: function (Is, O) {
                    var Ps = [];
                    var oValues = _.map(O, function (v) { return str2array(v); });
                    var isAllOutputValuesEmptyString = _.every(oValues, function (o) {
                        return o.length == 1 && o[0] == "";
                    });
                    if (isAllOutputValuesEmptyString)
                        return [];
                    for (var I_idx in Is) {
                        var I = Is[I_idx];
                        try {
                            var I_vals_reversed = _.map(I, function (v) {
                                var list = str2array(v);
                                list.reverse();
                                return list;
                            });
                        }
                        catch (e) {
                            return;
                        }
                        if (isSameArray(oValues, I_vals_reversed)) {
                            Ps.push(new Program("reverse_array", {
                                source: I_idx,
                                inputIndex: "" + I_idx
                            }));
                        }
                    }
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    var result = _.map(I, function (iv) {
                        var arr = str2array(iv);
                        arr.reverse();
                        return arr;
                    });
                    return result;
                },
                unitTests: [
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["1,1,1", "29,2,5"],
                        program: {
                            type: "reverse_array",
                            param: {
                                source: 1,
                                inputIndex: "" + 1
                            }
                        }
                    },
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["5,3", "1,2"],
                        program: {
                            type: "reverse_array",
                            param: {
                                source: 0,
                                inputIndex: "" + 0
                            }
                        }
                    },
                ]
            },
            sort_number: {
                generate: function (Is, O) {
                    var Ps = [];
                    var oValues = _.map(O, function (v) { return str2arrayNumber(v); });
                    _.each(Is, function (I, I_index) {
                        try {
                            var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                        }
                        catch (e) {
                            return;
                        }
                        var sorted_ascending = _.map(inputValues, function (iv) {
                            return sortGeneral(iv);
                        });
                        var sorted_descending = _.map(inputValues, function (iv) {
                            return sortGeneral(iv).reverse();
                        });
                        if (isSameArray(sorted_ascending, oValues)) {
                            Ps.push(new Program("sort_number", {
                                ascending: true,
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                        if (isSameArray(sorted_descending, oValues)) {
                            Ps.push(new Program("sort_number", {
                                ascending: false,
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    if (P.param['ascending']) {
                        return _.map(I, function (iv) { return sortGeneral(str2arrayNumber(iv)); });
                    }
                    else {
                        return _.map(I, function (iv) { return sortGeneral(str2arrayNumber(iv)).reverse(); });
                    }
                },
                unitTests: [
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["3,5", "1,2"],
                        program: {
                            type: "sort_number",
                            param: {
                                ascending: true,
                                source: 0,
                                inputIndex: "" + 0
                            }
                        }
                    },
                    { inputs: [
                            ["3,5", "2,1"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["1,1,1", "29,5,2"],
                        program: {
                            type: "sort_number",
                            param: {
                                ascending: false,
                                source: 1,
                                inputIndex: "" + 1
                            }
                        }
                    }
                ]
            },
            sort_text: {
                generate: function (Is, O) {
                    var Ps = [];
                    // EXCLUDE THE CASE WHERE INPUT IS ALL NUMBERS
                    var isOutputNumber;
                    try {
                        var dummy = _.map(O, function (v) { return str2arrayNumber(v); });
                        isOutputNumber = true;
                    }
                    catch (o) {
                        if (o == "Not Number")
                            isOutputNumber = false;
                    }
                    if (isOutputNumber)
                        return [];
                    //
                    var oValues = _.map(O, function (v) { return str2array(v); });
                    var isAllOutputValuesEmptyString = _.every(oValues, function (o) {
                        return o.length == 1 && o[0] == "";
                    });
                    if (isAllOutputValuesEmptyString)
                        return [];
                    _.each(Is, function (I, I_index) {
                        try {
                            var inputValues = _.map(I, function (iv) { return str2array(iv); });
                        }
                        catch (e) {
                            return;
                        }
                        var sorted_ascending = _.map(inputValues, function (iv) {
                            return sortGeneral(iv);
                        });
                        var sorted_descending = _.map(inputValues, function (iv) {
                            return sortGeneral(iv).reverse();
                        });
                        if (isSameArray(sorted_ascending, oValues)) {
                            Ps.push(new Program("sort_text", {
                                ascending: true,
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                        if (isSameArray(sorted_descending, oValues)) {
                            Ps.push(new Program("sort_text", {
                                ascending: false,
                                source: I_index,
                                inputIndex: "" + I_index
                            }));
                        }
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    if (P.param['ascending']) {
                        return _.map(I, function (iv) { return sortGeneral(str2arrayNumber(iv)); });
                    }
                    else {
                        return _.map(I, function (iv) { return sortGeneral(str2arrayNumber(iv)).reverse(); });
                    }
                },
                unitTests: [
                    { inputs: [
                            ["a,b", "d,c"],
                            ["a,a,a", "f,b,   z"]
                        ],
                        output: ["a,b", "c,d"],
                        program: {
                            type: "sort_text",
                            param: {
                                ascending: true,
                                source: 0,
                                inputIndex: "" + 0
                            }
                        }
                    },
                    { inputs: [
                            ["a,b", "d,c"],
                            ["a,a,a", "f,b,   z"]
                        ],
                        output: ["a,a,a", "z,f,b"],
                        program: {
                            type: "sort_text",
                            param: {
                                ascending: false,
                                source: 1,
                                inputIndex: "" + 1
                            }
                        }
                    }
                ]
            },
            sort_by_key: {
                // 키값이 따로 주어짐. 그걸 이용해서 소팅.  
                generate: function (Is, O) {
                    var Ps = [];
                    var oValues = _.map(O, function (v) { return str2array(v); });
                    if (Is.length < 2)
                        return [];
                    for (var idxI = 0; idxI < Is.length - 1; idxI++) {
                        for (var idxK = idxI + 1; idxK < Is.length; idxK++) {
                            var I = Is[idxI];
                            var K = Is[idxK];
                            var I_values = _.map(I, function (iv) { return str2array(iv); });
                            var K_values = _.map(K, function (kv) { return str2array(kv); });
                            if (!isSameShape(I_values, K_values))
                                continue;
                            // GET TRUE SORTED I_values
                            var true_sorted_ascending = _.map(I_values, function (values, value_i) {
                                return _.sortBy(values, function (v, sort_i) { return K_values[value_i][sort_i]; });
                            });
                            var true_sorted_descending = _.map(I_values, function (values, value_i) {
                                return _.sortBy(values, function (v, sort_i) { return K_values[value_i][sort_i]; }).reverse();
                            });
                            if (isSameArray(true_sorted_ascending, oValues)) {
                                Ps.push(new Program("sort_by_key", {
                                    ascending: true,
                                    source: idxI,
                                    key: idxK,
                                    inputIndex: "" + idxI + "," + idxK
                                }));
                            }
                            if (isSameArray(true_sorted_descending, oValues)) {
                                Ps.push(new Program("sort_by_key", {
                                    ascending: false,
                                    source: idxI,
                                    key: idxK,
                                    inputIndex: "" + idxI + "," + idxK
                                }));
                            }
                        }
                    }
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    if (P.param['ascending']) {
                        return _.map(I, function (iv) { return sortGeneral(str2arrayNumber(iv)); });
                    }
                    else {
                        return _.map(I, function (iv) { return sortGeneral(str2arrayNumber(iv)).reverse(); });
                    }
                },
                unitTests: [
                    { inputs: [
                            ["ab, kde, defg", "defg, ac"],
                            ["abc", "de"],
                            ["2,3,4", "4,2"]
                        ],
                        output: ["defg, kde, ab", "defg, ac"],
                        program: {
                            type: "sort_by_key",
                            param: {
                                ascending: false,
                                source: 0,
                                key: 2,
                                inputIndex: "" + 0 + "," + 2
                            }
                        }
                    },
                    { inputs: [
                            ["abc", "de"],
                            ["ab, kde, defg", "defg, ac"],
                            ["2,3,4", "4,2"]
                        ],
                        output: ["ab, kde, defg", "ac, defg"],
                        program: {
                            type: "sort_by_key",
                            param: {
                                ascending: true,
                                source: 1,
                                key: 2,
                                inputIndex: "" + 1 + "," + 2
                            }
                        }
                    }
                ]
            },
            arithmetic_single_param: {
                generate: function (Is, O) {
                    var Ps = [];
                    var oValues = _.map(O, function (v) { return str2arrayNumber(v); });
                    _.each(Is, function (I, I_index) {
                        try {
                            var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                        }
                        catch (e) {
                            return;
                        }
                        // CHECK MINIMAL CONDITIONS (WHETHER ITEM NUMBERS ARE MATCHING)
                        if (!isSameShape(oValues, inputValues))
                            return;
                        // TRYING DIFFERENT ARITHMETIC OPERATORS 
                        var validOperators = this.findFormulaSingleParam(inputValues, oValues);
                        _.each(validOperators, function (op) {
                            Ps.push(new Program("arithmetic_single_param", {
                                source: I_index,
                                inputIndex: "" + I_index,
                                operator: op[0],
                                operand: op[1]
                            }));
                        });
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I = previousSteps[P.param['source']];
                    var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                    return _.map(inputValues, function (v) { return sum(v); });
                },
                unitTests: [
                    { inputs: [
                            [],
                            ["0", "9", "3"],
                            [],
                            [],
                        ],
                        output: ["0", "3", "1"],
                        program: {
                            type: "arithmetic_single_param",
                            param: {
                                source: 1,
                                inputIndex: "" + 1,
                                operator: "/",
                                operand: 3
                            }
                        }
                    },
                    { inputs: [
                            ["3", "9"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["4", "10"],
                        program: {
                            type: "arithmetic_single_param",
                            param: {
                                source: 0,
                                inputIndex: "" + 0,
                                operator: "+",
                                operand: 1
                            }
                        }
                    },
                    { inputs: [
                            ["3", "9"],
                            ["1,1,1", "5,2,   29"]
                        ],
                        output: ["3,3,3", "15,6,87"],
                        program: {
                            type: "arithmetic_single_param",
                            param: {
                                source: 1,
                                inputIndex: "" + 1,
                                operator: "*",
                                operand: 3
                            }
                        }
                    },
                ]
            },
            arithmetic_two_params: {
                generate: function (Is, O) {
                    var Ps = [];
                    var oValues = _.map(O, function (v) { return str2arrayNumber(v); });
                    for (var I1_index in Is) {
                        for (var I2_index in Is) {
                            if (I1_index == I2_index)
                                continue;
                            var I1 = Is[I1_index];
                            var I2 = Is[I2_index];
                            try {
                                var I1_values = _.map(I1, function (iv) { return str2arrayNumber(iv); });
                                var I2_values = _.map(I2, function (iv) { return str2arrayNumber(iv); });
                            }
                            catch (e) {
                                continue;
                            }
                            if (!isSameShape(I1_values, I2_values) || !isSameShape(I2_values, oValues))
                                continue;
                            // TRY OPERATIONS
                            var flat_I1_values = _.flatten(I1_values);
                            var flat_I2_values = _.flatten(I2_values);
                            var flat_output_values = _.flatten(oValues);
                            for (var iArith in this.helper_arithmetic) {
                                // SKIP FOR I1 + I2 where I2 < I1:  TO REDUCE REDUNDANT PROGRAMS
                                if (I1_index > I2_index && (iArith == "+" || iArith == "*"))
                                    continue;
                                var arith_func = this.helper_arithmetic[iArith].execute;
                                var simulated_output = _.map(flat_I1_values, function (vvv, i) {
                                    return arith_func(flat_I1_values[i], flat_I2_values[i]);
                                });
                                if (isSameArray(flat_output_values, simulated_output)) {
                                    Ps.push(new Program("arithmetic_two_params", {
                                        operator: iArith,
                                        operand_A: I1_index,
                                        operand_B: I2_index,
                                        inputIndex: "" + I1_index + "," + I2_index
                                    }));
                                }
                            }
                        }
                    }
                    return Ps;
                },
                execute: function (previousSteps, P) {
                    var I1 = previousSteps[P.param['operand_A']];
                    var I2 = previousSteps[P.param['operand_B']];
                    var I1_val = _.map(I1, function (iv) { return str2arrayNumber(iv); });
                    var I2_val = _.map(I2, function (iv) { return str2arrayNumber(iv); });
                    var arith_func = this.helper_arithmetic[P.param['operator']].execute;
                    return _.map(I1_val, function (v, i) { return arith_func(I1_val[i], I2_val[i]); });
                },
                unitTests: [
                    { inputs: [
                            [],
                            ["0,3,-3", "5,9"],
                            ["3,-3", "5,9"],
                            ["1,2,1", "3,5"]
                        ],
                        output: ["-1,1,-4", "2,4"],
                        program: {
                            type: "arithmetic_two_params",
                            param: {
                                operator: "-",
                                operand_A: 1,
                                operand_B: 3,
                                inputIndex: "" + 1 + "," + 3
                            }
                        }
                    },
                    { inputs: [
                            [],
                            ["0", "9", "3"],
                            ["5", "1", "2"],
                            [],
                        ],
                        output: ["5", "10", "5"],
                        program: {
                            type: "arithmetic_two_params",
                            param: {
                                operator: "+",
                                operand_A: 1,
                                operand_B: 2,
                                inputIndex: "" + 1 + "," + 2
                            }
                        }
                    },
                    { inputs: [
                            ["3", "9"],
                            ["1", "3"]
                        ],
                        output: ["3", "3"],
                        program: {
                            type: "arithmetic_two_params",
                            param: {
                                operator: "/",
                                operand_A: 0,
                                operand_B: 1,
                                inputIndex: "" + 0 + "," + 1
                            }
                        }
                    },
                    { inputs: [
                            ["3", "9"],
                            ["1", "3"]
                        ],
                        output: ["3", "27"],
                        program: {
                            type: "arithmetic_two_params",
                            param: {
                                operator: "*",
                                operand_A: 0,
                                operand_B: 1,
                                inputIndex: "" + 0 + "," + 1
                            }
                        }
                    },
                ]
            },
            filter: {
                generate: function (Is, O) {
                    var Ps = [];
                    var oValues = _.map(O, function (v) { return str2array(v); });
                    if (Is.length < 2)
                        return [];
                    for (var idxI = 0; idxI < Is.length; idxI++) {
                        for (var idxPred = 0; idxPred < Is.length; idxPred++) {
                            if (idxI == idxPred)
                                continue;
                            var I = Is[idxI];
                            var Pred = Is[idxPred];
                            var I_values = _.map(I, function (iv) { return str2array(iv); });
                            try {
                                var Pred_values = _.map(Pred, function (kv) { return str2arrayBoolean(kv); });
                            }
                            catch (e) {
                                continue;
                            }
                            if (!isPredicateArray(Pred_values))
                                continue;
                            if (!isSameShape(I_values, Pred_values))
                                continue;
                            // GET TRUE FILTERED I_values
                            var true_filtered = _.map(I_values, function (values, value_i) {
                                return _.filter(values, function (val, value_j) {
                                    return Pred_values[value_i][value_j];
                                });
                            });
                            var true_filtered_inverse = _.map(I_values, function (values, value_i) {
                                return _.filter(values, function (val, value_j) {
                                    return !Pred_values[value_i][value_j];
                                });
                            });
                            // CHECK IF TRUE FILTERED LIST MATCHES OUTPUT
                            if (isSameArray(true_filtered, oValues)) {
                                Ps.push(new Program("filter", {
                                    source: idxI,
                                    pred: idxPred,
                                    inputIndex: "" + idxI + "," + idxPred,
                                    inverse: false
                                }));
                            }
                            if (isSameArray(true_filtered_inverse, oValues)) {
                                Ps.push(new Program("filter", {
                                    source: idxI,
                                    pred: idxPred,
                                    inputIndex: "" + idxI + "," + idxPred,
                                    inverse: true
                                }));
                            }
                        }
                    }
                    return Ps;
                },
                execute: function (previousSteps, P) {
                },
                unitTests: [
                    { inputs: [
                            ["ab, kde, defg", "defg, ac"],
                            ["T,F,T", "F,T"]
                        ],
                        output: ["ab, defg", "ac"],
                        program: {
                            type: "filter",
                            param: {
                                source: 0,
                                pred: 1,
                                inputIndex: "" + 0 + "," + 1,
                                inverse: false
                            }
                        }
                    },
                    { inputs: [
                            ["abc", "de"],
                            ["ab, kde, defg", "defg, ac"],
                            ["2,3,4", "4,2"],
                            ["T,F,T", "T,T"],
                        ],
                        output: ["ab, defg", "defg, ac"],
                        program: {
                            type: "filter",
                            param: {
                                source: 1,
                                pred: 3,
                                inputIndex: "" + 1 + "," + 3,
                                inverse: false
                            }
                        }
                    }
                ]
            },
            boolean_operation: {
                generate: function (Is, O) {
                    var Ps = [];
                    try {
                        var oValues = _.map(O, function (v) { return str2arrayBoolean(v); });
                    }
                    catch (e) {
                        return Ps;
                    }
                    if (Is.length < 2)
                        return Ps;
                    for (var I1_index in Is) {
                        for (var I2_index in Is) {
                            if (I1_index >= I2_index)
                                continue;
                            var I1 = Is[I1_index];
                            var I2 = Is[I2_index];
                            try {
                                var I1_values = _.map(I1, function (iv) { return str2arrayBoolean(iv); });
                                var I2_values = _.map(I2, function (iv) { return str2arrayBoolean(iv); });
                            }
                            catch (e) {
                                continue;
                            }
                            if (!isSameShape(I1_values, I2_values) || !isSameShape(I2_values, oValues))
                                continue;
                            var flat_I1_values = _.flatten(I1_values);
                            var flat_I2_values = _.flatten(I2_values);
                            var flat_output_values = _.flatten(oValues);
                            for (var iCond in this.helper_boolean_operators) {
                                var cond_operator = this.helper_boolean_operators[iCond];
                                var simulated_output = _.map(flat_I1_values, function (vvv, i) {
                                    return cond_operator(flat_I1_values[i], flat_I2_values[i]);
                                });
                                if (isSameArray(flat_output_values, simulated_output)) {
                                    Ps.push(new Program("boolean_operation", {
                                        operator: iCond,
                                        booleanA: I1_index,
                                        booleanB: I2_index,
                                        inputIndex: "" + I1_index + "," + I2_index
                                    }));
                                }
                            }
                        }
                    }
                    return Ps;
                },
                execute: function (previousSteps, P) { },
                unitTests: [
                    { inputs: [
                            ["T,F,T", "T"],
                            ["F,T,T", "F"],
                        ],
                        output: ["F,F,T", "F"],
                        program: {
                            type: "boolean_operation",
                            param: {
                                booleanA: 0,
                                booleanB: 1,
                                inputIndex: "" + 0 + "," + 1,
                                operator: "AND"
                            }
                        }
                    },
                    { inputs: [
                            [],
                            ["1,2,3"],
                            ["T,F,T", "T"],
                            ["F,T,T", "F"],
                        ],
                        output: ["T,T,T", "T"],
                        program: {
                            type: "boolean_operation",
                            param: {
                                booleanA: 2,
                                booleanB: 3,
                                inputIndex: "" + 2 + "," + 3,
                                operator: "OR"
                            }
                        }
                    }
                ]
            },
            number_test: {
                generate: function (Is, O) {
                    var Ps = [];
                    try {
                        var oValues = _.map(O, function (v) { return str2arrayBoolean(v); });
                    }
                    catch (e) {
                        return Ps;
                    }
                    _.each(Is, function (I, I_index) {
                        try {
                            var inputValues = _.map(I, function (iv) { return str2arrayNumber(iv); });
                        }
                        catch (e) {
                            return;
                        }
                        if (!isSameShape(inputValues, oValues))
                            return;
                        // TRYING DIFFERENT CONDITIONAL OPERATORS 
                        var validConditionals = this.findConditionals(inputValues, oValues);
                        _.each(validConditionals, function (op) {
                            Ps.push(new Program("number_test", {
                                source: I_index,
                                inputIndex: "" + I_index,
                                operator: op[0],
                                operand: op[1]
                            }));
                        });
                    });
                    return Ps;
                },
                execute: function (previousSteps, P) {
                },
                unitTests: [
                    { inputs: [
                            ["ab, kde, defg", "defg, ac"],
                            ["2,3,4,5,6,7", "4,2"],
                        ],
                        output: ["T,T,F,F,F,F", "F,T"],
                        program: {
                            type: "number_test",
                            param: {
                                source: 1,
                                inputIndex: "" + 1,
                                operator: "<",
                                operand: 4
                            }
                        }
                    },
                    { inputs: [
                            ["abc", "de"],
                            ["ab, kde, defg", "defg, ac"],
                            ["2,3,4,5,6,7", "4,2"],
                            ["T,F,T", "T,T"],
                        ],
                        output: ["F,T,F,F,T,F", "F,F"],
                        program: {
                            type: "number_test",
                            param: {
                                source: 2,
                                inputIndex: "" + 2,
                                operator: "%",
                                operand: 3
                            }
                        }
                    },
                    { inputs: [
                            ["ab, kde, defg", "defg, ac"],
                            ["2,3,4,5,6,7", "4,2"]
                        ],
                        output: ["F,T,F,T,F,T", "F,F"],
                        program: {
                            type: "number_test",
                            param: {
                                source: 1,
                                inputIndex: "" + 1,
                                operator: "!%",
                                operand: 2
                            }
                        }
                    }
                ]
            },
            string_test: {
                // contains.  
                generate: function (Is, O) {
                    return [];
                },
                execute: function (previousSteps, P) {
                    return;
                },
                unitTests: []
            }
        };
        this.helper_boolean_operators = {
            "AND": function (b1, b2) { return b1 && b2; },
            "OR": function (b1, b2) { return b1 || b2; }
        };
        this.helper_arithmetic = {
            "+": {
                execute: function (op1, op2) { return parseFloat(op1) + parseFloat(op2); }
            },
            "-": {
                execute: function (op1, op2) { return parseFloat(op1) - parseFloat(op2); }
            },
            "*": {
                execute: function (op1, op2) { return parseFloat(op1) * parseFloat(op2); }
            },
            "/": {
                execute: function (op1, op2) { return parseFloat(op1) / parseFloat(op2); }
            },
            "%": {
                execute: function (op1, op2) { return parseFloat(op1) % parseFloat(op2); }
            }
        };
    }
    CrowdPlanner.prototype.inferSingleStep = function (previousSteps, currentStep) {
        var matchingPrograms = [];
        for (var opKey in this.operations) {
            var opObj = this.operations[opKey];
            try {
                var pList = opObj.generate(previousSteps, currentStep);
                if (_.isArray(pList))
                    matchingPrograms = matchingPrograms.concat(pList);
            }
            catch (e) {
                console.log(e);
            }
        }
        ;
        return matchingPrograms;
    };
    CrowdPlanner.prototype.runUnitTest = function () {
        _.each(this.operations, function (opObj, opKey) {
            try {
                console.log("========================" + opKey);
                if (opObj.unitTests) {
                    _.each(opObj.unitTests, function (test, testI) {
                        var generatedP = opObj.generate(test.inputs, test.output);
                        if (generatedP.length > 1) {
                            console.log(generatedP);
                            throw "Multiple P generated";
                        }
                        else if (generatedP.length == 0) {
                            throw "No P generated";
                        }
                        else {
                            if (isSameProgram(generatedP[0], test.program)) {
                                console.log("pass");
                            }
                            else {
                                console.log(JSON.stringify(generatedP[0]));
                                throw opKey + " test " + testI + " failed";
                            }
                        }
                    });
                }
            }
            catch (e) {
                console.error(e);
                console.error(e.stack);
            }
        });
    };
    CrowdPlanner.prototype.get_common_tokens = function (strList) {
        var list_of_tokens = _.map(strList, function (v) { return this.get_tokens(v); });
        return _.intersection.apply(this, list_of_tokens);
    };
    CrowdPlanner.prototype.get_tokens = function (str) {
        var basic = ['', '____end_of_line___'];
        var regex_split = /[,\.-:;=\s]/;
        var bag_of_words_raw = str.split(regex_split); // , false, undefined, "");
        var bag_of_words = [];
        for (var _i = 0, bag_of_words_raw_1 = bag_of_words_raw; _i < bag_of_words_raw_1.length; _i++) {
            var word = bag_of_words_raw_1[_i];
            if (word != false && word != undefined && word != "")
                bag_of_words.push(word);
        }
        var bag_of_letters = _.unique(_.map(str, function (v) { return v; }));
        var split_tokens = _.filter([',', '\.', '-', ':', ';', ' '], function (t) { return str.indexOf(t) != -1; });
        return _.union(basic, bag_of_words, bag_of_letters, split_tokens);
    };
    CrowdPlanner.prototype.helper_conditional = function (op1, op2, operator) {
        if (operator == "<")
            return op1 < op2;
        if (operator == ">")
            return op1 > op2;
        if (operator == "==")
            return op1 == op2;
        if (operator == "%")
            return op1 % op2 == 0;
        if (operator == "!%")
            return op1 % op2 != 0;
    };
    CrowdPlanner.prototype.findConditionals = function (inList, outList) {
        // inList:  [  [1,2], [3,4,5] , ...]
        // outList: [  [true,false], [true,false,...], ...]
        // return.  ["<=", 5] or ["%!"]
        var formulas = [];
        var flatInputValues = _.flatten(inList);
        var flatOutputValues = _.flatten(outList);
        var max_val = _.max(_.flatten([inList, outList]));
        var min_val = _.min(_.flatten([inList, outList]));
        var cand_operands = _.range(min_val * 2, max_val * 2);
        var cand_operands_for_remainder = _.range(2, 11);
        var cand_operators = ["<", ">", "==", "%", "!%"];
        //
        for (var iCond in cand_operators) {
            var operator = cand_operators[iCond];
            var operands = (operator == "!%" || operator == "%") ? cand_operands_for_remainder : cand_operands;
            for (var iOperand in operands) {
                var operand = operands[iOperand];
                if (_.every(flatOutputValues, function (out, i) {
                    return this.helper_conditional(flatInputValues[i], operand, operator) == out;
                })) {
                    formulas.push([operator, operand]);
                }
            }
        }
        return formulas;
    };
    ;
    CrowdPlanner.prototype.findFormulaSingleParam = function (inList, outList) {
        // GENERATE CANDIDATE RANGE OF OPERANDS
        // inLIst and outList:  [ [1,2,3], ...   ]
        var formulas = [];
        var flatInputValues = _.flatten(inList);
        var flatOutputValues = _.flatten(outList);
        var max_val = _.max(_.flatten([inList, outList]));
        var cand_operands = _.range(max_val * -2, max_val * 2);
        // TRY COMBINATIONS OF OPEARTION AND OPERANDS
        for (var iAr in this.helper_arithmetic) {
            var arithmeticFunc = this.helper_arithmetic[iAr].execute;
            for (var iOperand in cand_operands) {
                var operand = cand_operands[iOperand];
                if (_.every(flatOutputValues, function (out, i) {
                    return arithmeticFunc(flatInputValues[i], operand) == out;
                })) {
                    formulas.push([iAr, operand]);
                }
            }
        }
        // EXCLUDE SOME REDUNDANT CASES
        formulas = _.filter(formulas, function (fr) {
            if (fr[0] == "+" && fr[1] < 0)
                return false;
            if (fr[0] == "-" && fr[1] < 0)
                return false;
            return true;
        });
        return formulas;
    };
    ;
    return CrowdPlanner;
}());
var TaskDefinition = (function () {
    function TaskDefinition(tid) {
        var data = TaskDefinition.pbeTasks[tid];
        this.taskID = data["taskID"];
        this.instruction = data["instruction"];
        this.description = data["description"];
        this.example = new Trial();
        this.example.input = data["example"]["input"];
        this.example.output = data["example"]["output"];
        this.addStep = data["features"]["addStep"];
        this.addCase = data["features"]["addCase"];
        this.solution = data["solution"];
        this.testOutput = data["testOutput"];
    }
    TaskDefinition.getTaskDefinition = function (tid) {
        return new TaskDefinition(tid);
    };
    TaskDefinition.getAllTaskIDs = function () {
        return _.filter(_.keys(TaskDefinition.pbeTasks), function (k) { return k.indexOf("task") != -1; });
    };
    TaskDefinition.getAllTutorialIDs = function () {
        return _.filter(_.keys(TaskDefinition.pbeTasks), function (k) { return k.indexOf("tutorial") != -1; });
    };
    TaskDefinition.getAllIDs = function () {
        return _.keys(TaskDefinition.pbeTasks);
    };
    TaskDefinition.getIndexFromTID = function (tid) {
        return _.indexOf(this.getAllIDs(), tid);
    };
    TaskDefinition.pbeTasks = {
        'tutorial_1': {
            'taskID': 'tutorial_1',
            'instruction': "Assume that you are teaching the computer a program that always calculates the output to be one more than the input. <em>Please type 1 in the input and the corresponding output number.  Click \"Teach Computer\" button.</em>",
            'description': "Input + 1",
            'example': {
                'input': [""],
                'output': [""]
            },
            'features': {
                "addStep": false,
                "addCase": false
            },
            'solution': [
                ["Input", 1],
                ["Output", 2]
            ],
            'testOutput': function (data) {
                try {
                    var inputValues = _.flatten(_.map(data['input'], function (v) { return str2arrayNumber(v); }));
                    var outputValues = _.flatten(_.map(data['output'], function (v) { return str2arrayNumber(v); }));
                    if (inputValues[0] == 1 && outputValues[0] == 2) {
                        return { isValid: true, message: MESSAGE_PASS };
                    }
                    else {
                        return { isValid: false, message: "Type 1 in Input, and 2 in Output." };
                    }
                }
                catch (e) {
                    return { isValid: false, message: "Type 1 in Input, and 2 in Output." };
                }
            }
        },
        'tutorial_arith_1': {
            'taskID': 'tutorial_arith_1',
            'instruction': "Nice work! However, other programs such as <code>Input*2</code> also calculate 2 for 1. You need to clarify which program is correct by giving additional cases. <em>Click [Add Case] button, and provide another input and a corresponding output number.</em>",
            'description': "Input + 1",
            'example': {
                'input': ["1"],
                'output': ["2"]
            },
            'features': {
                "addStep": false,
                "addCase": true
            },
            'solution': [
                ["Input", 1, 2],
                ["Output", 2, 3]
            ],
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2arrayNumber(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return _.map(v, function (vv) { return vv + 1; });
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        'tutorial_arith_2': {
            'taskID': 'tutorial_arith_2',
            'instruction': "Keep in mind that every step must have one program only.<br><br>Let&#39;s learn about <em>steps</em>. The computer may not be smart enough to learn programs for complex tasks in a single step, so we ask you to break the calculation down into simple steps for the computer. For instance, the computer cannot learn multi-step calculations such as <code>(Input+1)*2</code>, no matter how many cases of input and output you give. Instead, you should <em>break the task into subtasks, and insert additonal steps</em> containing the results of each subtask. In the example below, you need to click <img width='27px' src='css/image/addStep.png'> to insert a step, and type results of the subtask (<code>Input+1</code>).",
            'description': "(Input + 1) * 2",
            'partialDescription': ["Input + 1"],
            'example': {
                'input': ["1"],
                'output': ["4"]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'solution': [
                ["Input", 1, 2],
                ["Step: Input + 1", 2, 3],
                ["Output", 4, 6]
            ],
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2arrayNumber(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return _.map(v, function (vv) { return (vv + 1) * 2; });
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        'tutorial_sum': {
            'taskID': 'tutorial_sum',
            'instruction': "In the previous tasks, each case contains single values. However, some tasks should deal with lists of items (separated by \",\"). Teach the computer to get sum of all numbers in Input.",
            'description': "Get the sum of all numbers.",
            'example': {
                'input': ["1,1"],
                'output': ["2"]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'solution': [
                ["Input", "1,1", "5,3"],
                ["Output", "2", "8"]
            ],
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2arrayNumber(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return [sum(v)];
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        'tutorial_text_extraction': {
            'taskID': 'tutorial_text_extraction',
            'instruction': "You can teach programs that handle single-line text.",
            'description': "Get length of a text value (including spaces).",
            'example': {
                'input': ["yes"],
                'output': [""]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'solution': [
                ["Input", "yes", "feeling tired"],
                ["Output", "3", "13"]
            ],
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2array(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return _.map(v, function (vv) { return vv.length; });
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        'tutorial_filter_1': {
            'taskID': 'tutorial_filter_1',
            'instruction': "You can teach the computer how to <em>filter items in list</em>. To do so, you need an additional step with a description of which item should be kept by providing a list of True and False indicators (<code>T</code> or <code>F</code>). The <code>T</code> value means that the filered list will <em>include</em> the corresponding item. The <code>F</code> means the corresponding item will be excluded. For instance, <code>F, T</code> will filter out the first item. Teach the following task by providing an additional step and more cases.",
            'description': "Find numbers that are greater than 9",
            'example': {
                'input': ["11,8,9,10"],
                'output': ["11,10"]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'solution': [
                ["Input", "11,8,9,10"],
                ["Step: 'T' for values greater than 9, 'F' for the rest", "T,F,F,T"],
                ["Output", "11,10"]
            ],
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2arrayNumber(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return _.filter(v, function (vv) { return vv >= 10; });
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        // 'tutorial_boolean_1': {
        // 	'taskID':'tutorial_boolean_1',
        // 	'instruction': `Complex filtering often require multiple conditions (e.g. finding numbers that are greater than 5 and less than 8). You can teach the computer to combine two boolean lists using AND and OR operators. First, <em>AND</em> operator calculates <code>true</code> only if <em>both booleans are <code>true</code></em>. Second, <em>OR</em> operator calculates <code>true</code> if <em>either boolean is <code>true</code></em>.`,
        // 	'description':"Find numbers that are greater than 5 and less than 8.",
        // 	'example':{
        // 		'input':["2,5,6,7,8,9"],
        // 		'steps':[
        // 			["false,false,true,true,true,true"],
        // 			["true,true,true,true,false,false"]
        // 		],
        // 		'output':["false,false,true,true,false,false"],
        // 	},
        // 	'features':{
        // 		"addStep":true,
        // 		"addCase":true,
        // 	},
        // 	'testOutput':function(data){
        // 		var inputValues = _.map(data['input'], function(v){ return str2arrayNumber(v); });
        // 		var outputValues = _.map(data['output'], function(v){ return str2arrayNumber(v); });
        // 		var trueOutputValues = _.map(inputValues, function(v){ 
        // 			return _.filter(v, function(vv){ return vv>=10; });
        // 		});
        // 		if(isSameArray(trueOutputValues, outputValues)){
        // 			return { isValid:true, message:MESSAGE_PASS };
        // 		} else {
        // 			return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
        // 		}
        // 	}
        // },
        // 'tutorial_8': {
        // 	'taskID':'tutorial_8',
        // 	'instruction': `Some programs handle <b>list of lists</b>. For example, <span class='value'>[1,2,3],[4,5],[6]</span> represents a list of three lists. Note that inner lists must be surrounded by "[" and "]".
        //    <br><br>
        //    <span class='stress'>Provide another example for the following program.</span>`,
        // 	'description':"Find the largest values from each list of Input",
        // 	'example':{
        // 		'input':["[1,2,3], [4,5], [6]"],
        // 		'output':["3,5,6"],
        // 	},
        // 	'features':{
        // 		"addStep":true,
        // 		"addCase":true,
        // 	},
        // 	'testFunction': function(data){
        // 		var requiredSteps = 0;
        // 		var requiredCases = 2;
        // 		// 0. PREPARE DATA TYPES 
        // 		var input = _.filter(_.map(data['input'], function(oneCase){ return JSON.parse("[" + oneCase + "]"); }),function(arr){return arr.length>0; });
        // 		var output = _.map(data['output'], function(oneCase){ return JSON.parse("["+oneCase+"]");});
        // 		var steps = _.map(data['steps'], function(oneStep){	return oneStep; });
        // 		// 0. CHECK # STEPS ANd # CASES
        // 		if(data['steps'].length < requiredSteps) return { isValid:false, message:MESSAGE_INSUFFICIENT_STEPS};
        // 		if(data['input'].length < requiredCases) return { isValid:false, message:MESSAGE_INSUFFICIENT_EXAMPLES};
        // 		// 1. CHECK OUTPUT IS VALID
        // 		var trueOutput = _.map(input, function(caseVal){ return _.map(caseVal, function(v){return _.max(v); }); }); 
        // 		if (isSameArray(output, trueOutput)==false) return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
        // 		// E. IF IT PASSED EVEYR TEST, RETURN TRUE
        // 		return { isValid:true, message:MESSAGE_PASS };
        // 	},
        // },
        //////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        'task_three_step_arith': {
            'taskID': 'task_three_step_arith',
            'instruction': "To teach <code>(Input+1)*(Input-1)</code>, you need to add multiple steps. Note that the ordering of steps does not matter within a case since the computer automatically figures out the dependency between steps, but a consistent ordering is required across cases.",
            'description': "(Input + 1) * (Input - 1)",
            'example': {
                'input': ["1"],
                'output': ["0"]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2arrayNumber(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return _.map(v, function (vv) { return (vv + 1) * (vv - 1); });
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        'task_number_sort': {
            'taskID': 'task_number_sort',
            'instruction': "In the following task, you teach the computer to sort a list of numbers in ascending order. Note that the default example (1,-1&rarr;-1,1) is <em>not sufficient</em>, because the computer will find many other programs ((e.g. <code>Input * -1</code>, <code>Reverse Input</code>) that all calculate the same result.",
            'description': "Sort numbers in ascending order",
            'example': {
                'input': ["1,-1"],
                'output': ["-1,1"]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2arrayNumber(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return v.sort();
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        // 'task_text_sort': {
        // 	'taskID':'task_text_sort',
        // 	'instruction': `The computer can <em>sort text</em>. Lets sort it in descending order this time.`, 
        // 	'description':"Sort text in descending order",
        // 	'example':{
        // 		'input':["a,b"],
        // 		'output':["b,a"],
        // 	},
        // 	'features':{
        // 		"addStep":true,
        // 		"addCase":true,
        // 	},
        // 	'testOutput':function(data){
        // 		var inputValues = _.map(data['input'], function(v){ return str2array(v); });
        // 		var outputValues = _.map(data['output'], function(v){ return str2array(v); });
        // 		var trueOutputValues = _.map(inputValues, function(v){ 
        // 			return v.sort().reverse();
        // 		});
        // 		if(isSameArray(trueOutputValues, outputValues)){
        // 			return { isValid:true, message:MESSAGE_PASS };
        // 		} else {
        // 			return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
        // 		}
        // 	}
        // },
        // 난이도 하
        // 사용한다. 
        // 이유는... 앞에서 배운 두가지 text_length와 filter를 합친 것이니까 테스트하기 좋음. 
        'task_filter_words_by_length': {
            'taskID': 'task_filter_words_by_length',
            'active': true,
            'instruction': "Teach the computer to perform the following task.",
            'description': "Find words that are longer than two letters",
            'example': {
                'input': ["be, are, I, some"],
                'output': ["are, some"]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2array(v); });
                var outputValues = _.map(data['output'], function (v) { return str2array(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return _.filter(v, function (vv) { return vv.length > 2; });
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        // 난이도 하
        // 사용한다. 다른 필터와 비슷.
        'task_filter_numbers': {
            'taskID': 'task_filter_numbers',
            'active': true,
            'instruction': "Teach the computer to perform the following task.",
            'description': "Find numbers that are not divisible by 4 without remainder",
            'example': {
                'input': ["1,4,5"],
                'output': ["1,5"]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2arrayNumber(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    return _.filter(v, function (vv) { return vv % 4 != 0; });
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        },
        // DONT USE IT
        // THERE ARE TOO MANY WAYS TO SOLVE IT
        // ART AND MATH ARE NOT CLEAR --> MAKING TASK HARD
        // 'task_group_score': {
        // 	'taskID':'task_group_score',
        // 	'instruction': `The input holds the scores of two exams (Art and Math). Scores follow <span class='value'>NAME:EXAM:SCORE</span> format (e.g. <span class='value'>Lee:Art:87</span> means that Lee got 87 points in the Art exam). The program must get minimum and maximum scores of two exams separately. For example, <span class='value'>[Art, 87, 64]</span> represents that 87 and 64 are max. and min. scores of the Art exam.`,
        // 	'description':"Find minimum and maximum scores of the Art exam.",
        // 	'partialDescription':["Extract course names", "Find scores that contain Art","Get first names"],
        // 	'requiredSteps':2,
        // 	'example':{
        // 		'input':["Jane:Art:87, Jane:Math:47, Tom:Math:59, Tim:Art:64, Lin:Math:99, Lin:Art:72"],
        // 		'output':["87, 64"],
        // 	},
        // 	'features':{
        // 		"addStep":true,
        // 		"addCase":true,
        // 	},
        // 	'testFunction': function(data){
        // 		return { isValid:true, message:MESSAGE_PASS };
        // 	},
        // },
        // NOT WORTH TO TEST
        // TASK INSTRUCTION IS TOO EASY TO CONVERT TO 2-STEP EXAMPLES
        // 'task_name_conversion': {
        // 	'taskID':'task_name_conversion',
        // 	'instruction': `Input is a list of full names. The program flips the first and last name, and then abbreviates first name. For example, <span class='value'>Jon Anderson &rarr; Anderson J.</span>`,
        // 	'description':"Flip the first and last name, and abbreviate the first name.",
        // 	'partialDescription':["Get last names", "Abbreviate last names", "Get first names"],
        // 	'requiredSteps':3,
        // 	'example':{
        // 		'input':["Jon Anderson, Tim Cook"],
        // 		'output':["Anderson J., Cook T."],
        // 	},
        // 	'features':{
        // 		"addStep":true,
        // 		"addCase":true,
        // 	},
        // 	'testFunction': function(data){
        // 		return { isValid:true, message:MESSAGE_PASS };
        // 	},
        // },
        // TOO EASY 
        'task_extract_and_filter': {
            'taskID': 'task_extract_and_filter',
            'instruction': "The input represents cars that follow the <span class='value'>MODEL(YEAR)-PRICE</span> format. For instance, <span class='value'>Civic(2014)-$12000</span> represents a Civic manufactured in 2014, and its price is $12000.",
            'description': "Extract prices of cars that are manufactured in 2014 or later.",
            'partialDescription': ["Extract year", "Extract last two digits"],
            'requiredSteps': 1,
            'example': {
                'input': ["Civic(2014)-$12000, Elantra(2012)-$9500, Corolla(2015)-$14000, Corolla(2013)-$10000"],
                'output': ["12000, 14000"]
            },
            'features': {
                "addStep": true,
                "addCase": true
            },
            'testOutput': function (data) {
                var inputValues = _.map(data['input'], function (v) { return str2array(v); });
                var outputValues = _.map(data['output'], function (v) { return str2arrayNumber(v); });
                var trueOutputValues = _.map(inputValues, function (v) {
                    var newCars = _.filter(v, function (t) {
                        var year = parseInt(t.match(/\((.+)\)/)[1]);
                        return 2016 - year < 3;
                    });
                    return _.map(newCars, function (t) {
                        var price = parseFloat(t.match(/\$(.*)/)[1]);
                        return price;
                    });
                });
                if (isSameArray(trueOutputValues, outputValues)) {
                    return { isValid: true, message: MESSAGE_PASS };
                }
                else {
                    return { isValid: false, message: MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM };
                }
            }
        }
    };
    return TaskDefinition;
}());
var Trial = (function () {
    function Trial() {
        this.input = [];
        this.steps = [];
        this.output = [];
        this.timeStamp = -1;
    }
    Trial.prototype.getFlatArray = function () {
        return [this.input].concat(this.steps).concat(this.output);
    };
    Trial.prototype.getStepNum = function () {
        return this.steps.length;
    };
    Trial.prototype.getCaseNum = function () {
        return this.input.length;
    };
    return Trial;
}());
var Program = (function () {
    function Program(type, param) {
        this.type = type;
        this.param = param;
    }
    return Program;
}());
/// <reference path="LogItem.ts" />
/// <reference path="Log.ts" />
/// <reference path="Analyzer.ts" />
/// <reference path="MixedPBE.ts" />
/// <reference path="crowdPlanner.ts" />
/// <reference path="taskData.ts" />
/// <reference path="Trial.ts" />
/// <reference path="Program.ts" />
/// <reference path="references.ts" />
var Log = (function () {
    function Log(workerID) {
        this.workerID = workerID;
    }
    Log.prototype.add = function (event) {
        this.events.push(event);
    };
    Log.prototype.submit = function () {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            }
        };
        xmlhttp.open("POST", "submit", true);
        xmlhttp.send({
            data: JSON.stringify(this.events),
            workerID: this.workerID
        });
    };
    Log.prototype.toString = function () {
        return "tostring";
    };
    return Log;
}());
var TaskView = (function () {
    function TaskView($target) {
        this.$target = $target;
    }
    // EXTRACTING TRIAL FROM THE VIEW
    TaskView.prototype.extractTrial = function () {
        var trial = new Trial();
        trial.input = $.map(this.$target.find("tr.input td:not(.lastColumn)"), function (td) { return $(td).text(); });
        trial.steps = $.map(this.$target.find("tr.step"), function (tr) {
            return [$.map($(tr).find("td:not(.lastColumn)"), function (td) { return $(td).text(); })];
        });
        ;
        trial.output = $.map(this.$target.find("tr.output td:not(.lastColumn)"), function (td) { return $(td).text(); });
        return trial;
    };
    // RENDER FEEDBACK FOR EVERY STEP
    TaskView.prototype.renderFeedback = function (feedbackList) {
        this.$target.find("tr.step td.lastColumn").each(function (i, column) {
            $(column).html(feedbackList[i]);
        });
        this.$target.find("tr.output td.lastColumn").html(_.last(feedbackList));
    };
    // RENDERS HTML OF THE TASK MODEL
    TaskView.prototype.renderTask = function () {
        var _this = this;
        // RENDER SINGLE TASK MODEL IN THE $target
        var tDef = this.model.attr;
        var instructionEl = $("<div class='instruction'></div>").html(tDef.instruction);
        $(instructionEl).appendTo(this.$target);
        // CREATING INNER CONTENT OF DIV.TASK
        var $taskEl = $("<div class='task' tid='" + tDef.taskID + "'>\
						<div class='program'>\
							<div class='header'>TASK <span class='t_desc'>" + tDef.taskID + "</span></div>\
							<div class='description'>" + tDef.description + "</div>\
						</div>\
						<div class='examples'>\
							<div class='header'>EXAMPLES</div>\
							<table class='inAndOut'>\
								<tr class='input'>\
									<th>Input</th>\
								</tr>\
								<tr class='output'>\
									<th>Output</th>\
								</tr>\
								<tr class='lastRow'><th></th></tr>\
							</table>\
						</div>\
						<div class='test'>\
							<div class='header'>RESULT</div>\
							<div class='inference'>\
								<button class='teachButton'>Teach Computer</button>\
								<div class='testResult'></div>\
								<div style='clear:both;'></div>\
							</div>\
							<button class='openNextSection hidden'>Next Task</button>\
						</div>\
						<div class='giveup hidden'>\
							It seems that you are having trouble with this task.\
							You can <button class='giveup_button'>give up, and proceed to the next task</button></div>\
						</div>\
					</div>").appendTo(this.$target);
        // CREATE INITIAL INPUT AND OUTPUT DATA
        for (var i = 0; i < tDef.example.input.length; i++) {
            $taskEl.find("tr.input").append("<td contenteditable='true'>" + tDef.example.input[i] + "</td>");
        }
        for (var i = 0; i < tDef.example.output.length; i++) {
            $taskEl.find("tr.output").append("<td contenteditable='true'>" + tDef.example.output[i] + "</td>");
            $taskEl.find("tr.lastRow").append("<td><div class='removeCase hidden'>&#10005;</div></td>");
        }
        if (tDef.example.steps) {
            for (var i = 0; i < tDef.example.steps.length; i++) {
                var stepData = tDef.example.steps[i];
                var stepEl = $("<tr class='step'><th><div class='removeStep'>&#9988;</div>Step<div class='addStep'>+</div></th></tr>");
                for (var j = 0; j < stepData.length; j++) {
                    $(stepEl).append("<td contenteditable='True'>" + stepData[j] + "</td>");
                }
                $(stepEl).append("<td class='lastColumn'></td>");
                $(stepEl).insertBefore($taskEl.find("tr.output"));
            }
        }
        // BUTTON FOR ADDING CASE
        if (tDef.addCase)
            $taskEl.find("tr.input").append("<td class='lastColumn' rowspan=0><button class='addCase'>Add Case</button></td>");
        // PLACES TO SHOW INFERENCE FEEDBACK FOR FOR THE OUTpUT
        $taskEl.find("tr.output").append("<td class='lastColumn' rowspan=0></td>");
        // EVENTHANDER FOR OPENNEXTSECTION
        $taskEl.find("button.openNextSection").click(function () {
            var currentSection = $(this).parents(".section");
            var tid = $(currentSection).attr("tid");
            if (tid == _.last(TaskDefinition.getAllTaskIDs())) {
                // TBD: THIS SHOULD BE MOVED TO CONTROLLER
                $("div.endOfTask").removeClass("hidden");
            }
            else {
                var nextSectionTID = $(currentSection).next(".section").attr("tid");
                // TBD: THIS SHOULD BE MOVED TO CONTROLLER
                this.openSection(nextSectionTID);
                // IF IT IS ACTUAL TASKS, HIDE CURRENT TASKEL
                $(currentSection).addClass("hidden");
            }
        });
        // EVENTHANDLER FOR SHOWING SOLUTION
        $taskEl.on("click", "button.butShowSolution", function (event) {
            $(event.target).parents("div.testResult").find("table.simple").removeClass("hidden");
            $(event.target).parents("div.testResult").find("span.failResult").text("Here is one possible solution.");
            $(event.target).addClass("hidden");
            // TBD: HOW DO WE REMEMBER THAT THE USER SAW THE SOLUTION
        });
        // EVENTHANDLER OF STARTING TASK: IF USER CLICKS ANYTHING IN THE TABLE, THE TIMER STARTS
        $taskEl.on("click.dd", "", function () {
            var tid = $(this).attr("tid");
            $(this).off("click.dd");
            this.controller.startTask(tid);
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // STEP ADD / REMOVE
        if (tDef['features']['addStep'])
            $taskEl.find("tr.input th").append("<div class='addStep'>+</div>");
        $taskEl.on("click", ".addStep", function (event) {
            var buttonEl = event.target;
            var prevTr = $(buttonEl).parents("tr");
            var tableEl = $(buttonEl).parents("table.inAndOut");
            var currentNumCases = $(tableEl).find("tr.output td:not(.lastColumn)").length;
            var stepEl = $("<tr class='step'><th><div class='removeStep'>&#9988;</div>Step<div class='addStep'>+</div></th></tr>");
            for (var i = 0; i < currentNumCases; i++) {
                $(stepEl).append("<td contenteditable='True'></td>");
            }
            $(stepEl).append("<td class='lastColumn'></td>");
            $(prevTr).after(stepEl);
        });
        $taskEl.on("click", ".removeStep", function (event) {
            $(event.target).parents("tr.step").remove();
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // CASE ADD/REMOVE
        $taskEl.on("click", ".addCase", function (event) {
            var buttonEl = event.target;
            var tableEl = $(buttonEl).parents("table.inAndOut");
            $(tableEl).find("tr.input > td.lastColumn").before("<td contenteditable='True'></td>");
            $(tableEl).find("tr.step > td.lastColumn").before("<td contenteditable='True'></td>");
            $(tableEl).find("tr.output > td.lastColumn").before("<td contenteditable='True'></td>");
            $("<td><div class='removeCase hidden'>&#10005;</div></td>").insertBefore($(tableEl).find("tr.lastRow td:last"));
        });
        $taskEl.on("click", ".removeCase", function (event) {
            var currentNumCases = $(event.target).parents("tr").find("td:not(.lastColumn)").length;
            if (currentNumCases > 1) {
                var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index($(event.target).parents("td"));
                $(event.target).parents("table.inAndOut").find("tr").find("td:nth(" + id + ")").remove();
            }
        });
        ///// MOUSE HOVERING
        $taskEl.on('mouseenter', "td:not(.lastColumn)", function (event) {
            var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index(event.target);
            $(event.target).parents("table.inAndOut").find("tr.lastRow td div.removeCase").addClass("hidden");
            $(event.target).parents("table.inAndOut").find("tr.lastRow td:nth(" + id + ") div.removeCase").removeClass("hidden");
        });
        $taskEl.on('mouseleave', "td:not(.lastColumn)", function (event) {
            var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index(event.target);
            $(event.target).parents("table.inAndOut").find("tr.lastRow td div.removeCase").addClass("hidden");
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // TEACH COMPUTER BUTTON
        $taskEl.find("button.teachButton").click(function (event, ui) {
            var taskEl = $(event.target).parents("div.task");
            var tid = $taskEl.attr("tid");
        });
        // GIVEUP
        $taskEl.find("button.giveup_button").click(function () {
            $(_this).off("click");
            _this.controller.giveUp();
        });
    };
    ;
    // RENDERS PROGRAM TEST RESULT
    TaskView.prototype.renderProgramTestResult = function (message) {
        this.$target.find(".testResult").html(message);
    };
    // SHOW THE HIDDEN BUTTON FOR OPENING NEXT SECTION
    TaskView.prototype.showButtonForNextSection = function () {
        this.$target.parents("div.section").find(".openNextSection").removeClass("hidden");
    };
    // RENDERS SOLUTION  
    TaskView.prototype.renderSolution = function () {
        var solution = this.model.attr.solution;
        var table = $("<table class='simple hidden'></table>");
        for (var _i = 0, solution_1 = solution; _i < solution_1.length; _i++) {
            var row = solution_1[_i];
            var tr = $("<tr></tr>");
            for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
                var v = row_1[_a];
                $(tr).append("<td>" + v + "</td>");
            }
            $(table).append(tr);
        }
        this.$target.find("div.testResult").empty()
            .append("<span class='failResult' style='color:red;'>It seems that you are having trouble. <button class='butShowSolution'>Show solution</button></span>")
            .append(table);
        this.mpbe.log.add(new LogItem("SHOW_SOLUTION", this.controller.taskID, {}));
    };
    // RENDERS GIVEUP MESSAGE  
    TaskView.prototype.renderGiveUp = function () {
        this.$target.find(".giveup").removeClass("hidden");
    };
    return TaskView;
}());
var TaskModel = (function () {
    function TaskModel(taskAttributes, mixedPBE) {
        // _.extend(this, pbeTasks[taskID]);
        this.attr = taskAttributes;
        this.mpbe = mixedPBE;
    }
    TaskModel.prototype.isTutorial = function () {
        return this.attr.taskID.indexOf("tutorial") != -1;
    };
    TaskModel.prototype.getReport = function () {
        return {
            "trials": this.previousTrials,
            "programs": this.programs
        };
    };
    return TaskModel;
}());
var TaskController = (function () {
    function TaskController(taskID, mixedPBE) {
        this.taskID = taskID;
        this.mpbe = mixedPBE;
    }
    /* asdfasdf
    */
    TaskController.prototype.connectAll = function (model, view) {
        this.model = model;
        this.view = view;
        // CONNECT OTHERS
        this.model.controller = this;
        this.model.view = view;
        this.view.controller = this;
        this.view.model = model;
        this.model.mpbe = this.mpbe;
        this.view.mpbe = this.mpbe;
    };
    // DRIVER WHEN TEACH COMPUTER BUTTON IS CLICKED
    // IT RETRIEVES CURRENT EXAMPLE IN THE VIEW, AND GENERATE PROGRAMS
    // THEN IT TESTS WHETHER THE PROGRAM IS CORRECT, GENERATE FEEDBACK, 
    // AND LET THE TASKVIEW TO RENDER FEEDBACK  
    TaskController.prototype.teachComputer = function () {
        // EXTRACT TRIAL FROM THE VIEW
        var trial = this.view.extractTrial();
        var programs = this.generatePrograms(trial);
        var validationResult = this.generateFeedback(programs, trial);
        var isEveryStepRight = validationResult['isEveryStepRight'];
        var numProgList = validationResult['numProgList'];
        // LOG
        this.mpbe.log.add(new LogItem("INFER_PROGRAM", this.taskID, {
            data: trial,
            programs: programs,
            numProgList: numProgList
        }));
        // SHOWING FEEDBACK 
        if (this.taskID == "tutorial_1") {
            var isEveryStepRight = true;
        }
        // SHOW TEST PROGRAM PANEL IF EVERYSTEP IS RIGHT
        if (isEveryStepRight) {
            // TESTING PROGRAM (INPUT AND OTUPUT ONLY)
            try {
                var tDef = TaskDefinition.getTaskDefinition(this.taskID);
                var programTestResult_1 = tDef.testOutput(trial);
            }
            catch (e) {
                var programTestResult = {
                    isValid: false,
                    message: e
                };
            }
            this.mpbe.log.add(new LogItem("TEST_PROGRAM", this.taskID, {
                programs: programs,
                testResult: programTestResult
            }));
            if (programTestResult.isValid == true) {
                this.view.renderProgramTestResult("<span style='color:green;'>" + programTestResult.message + "</span>");
                this.mpbe.log.add(new LogItem("TASK_PASSED", this.taskID, {}));
                if (this.taskID.indexOf("task") != -1) {
                    this.view.showButtonForNextSection();
                }
                else {
                    if (this.taskID == "tutorial_filter_1") {
                        $("div.endOfTutorial").removeClass("hidden");
                    }
                    else {
                        // IF IT IS TUTORIAL, AUTOMATICALLY MOVE ON
                        this.openSection($("div.section[tid='" + this.taskID + "']").next(".section").attr("tid"));
                    }
                }
            }
            else {
                // PROVIDE MORE DETAILED FEEDBACK
                this.view.renderProgramTestResult("<span style='color:red;'>" + MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM + "</span>");
            }
        }
        else {
            this.view.renderProgramTestResult("<span style='color:red;'>" + MESSAGE_AMBIGUOUS_STEPS + "</span>");
        }
        // IF PARTICIPANTS SPENT TOO MUCH TIME AND INFERENCE TRIALS, LET HIM GIVE UP 
        if (isEveryStepRight == false) {
            // UNSUCCESSFUL TRIAL
            var minutesSpent = (Date.now() - this.model.startTimeStamp) / 60000;
            if (this.model.numberOfTrials > REQUIRED_TRIALS && minutesSpent > REQUIRED_MINUTES) {
                if (this.model.isTutorial()) {
                    this.view.renderSolution();
                }
                else {
                    this.view.renderGiveUp();
                }
            }
            this.model.numberOfTrials += 1;
        }
        else {
        }
    };
    // GENERATING PROGRAMS FOR THE CURRENT TRIAL OF THE MODEL 
    TaskController.prototype.generatePrograms = function (trial) {
        var dataFlatArray = trial.getFlatArray();
        var programs_for_steps = [];
        for (var stepIndex = 1; stepIndex < dataFlatArray.length; stepIndex++) {
            var previousSteps = dataFlatArray.slice(0, stepIndex);
            var currentStep = dataFlatArray[stepIndex];
            var generatedP_list = this.mpbe.crowdPlanner.inferSingleStep(previousSteps, currentStep);
            console.log("STEP " + stepIndex + " ===========");
            _.each(generatedP_list, function (p) { console.log(JSON.stringify(p)); });
            if (generatedP_list && generatedP_list.length > 0) {
                programs_for_steps.push(generatedP_list);
            }
            else {
                programs_for_steps.push([]);
            }
        }
        return programs_for_steps;
    };
    ;
    // START TASK TRIGGERED WHEN PARTICIPANTS CLICK EXAMPLE TABLE
    TaskController.prototype.startTask = function () {
        this.model.startTimeStamp = Date.now();
        this.model.numberOfTrials = 0;
        this.mpbe.log.add(new LogItem("START_TASK", this.taskID, {}));
    };
    // GENERATING FEEDBACK
    TaskController.prototype.generateFeedback = function (programs, data) {
        ///// STEP 1. GET NUMBER OF PROGRAMS PER STEP
        var num_prog_list = [];
        for (var _i = 0, programs_1 = programs; _i < programs_1.length; _i++) {
            var programs_for_a_step = programs_1[_i];
            // EVALUATING PROGRAMS: 1. GROUP PROGRAMS BY THEIR INPUTS
            var programs_by_inputs = {};
            for (var _a = 0, programs_for_a_step_1 = programs_for_a_step; _a < programs_for_a_step_1.length; _a++) {
                var single_program = programs_for_a_step_1[_a];
                if (single_program.param['inputIndex'] in programs_by_inputs == false) {
                    programs_by_inputs[single_program.param['inputIndex']] = [];
                }
                programs_by_inputs[single_program.param['inputIndex']].push(single_program);
            }
            // 2. FIND MINIMUM # PROGRAMS FROM A INPUT THAT CAN REACH THE CURRENT ROW
            var minimum_number_of_programs_from_one_input;
            if (_.keys(programs_by_inputs).length > 0) {
                minimum_number_of_programs_from_one_input = _.min(_.map(programs_by_inputs, function (ps, inp) {
                    // return ps.length;
                    return 0;
                }));
            }
            else {
                minimum_number_of_programs_from_one_input = 0;
            }
            num_prog_list.push(minimum_number_of_programs_from_one_input);
        }
        /////// STEP 2. GENERATE FEEDBACK BASED ON THE CURRENT MODE
        var isEveryStepRight = true;
        var feedbackList = [];
        if (this.mpbe.mode == MODE_FIXED) {
            for (var i in num_prog_list) {
                var num_prog = num_prog_list[i];
                if (num_prog == 0) {
                    feedbackList.push(MESSAGE_STEP_FAIL);
                    isEveryStepRight = false;
                }
                else if (num_prog == 1) {
                    feedbackList.push(MESSAGE_STEP_SUCCESS);
                }
                else if (num_prog > 1) {
                    feedbackList.push(MESSAGE_STEP_WARNING.replace("[minimum_num_prog]", num_prog.toString()));
                    isEveryStepRight = false;
                }
            }
        }
        else if (this.mpbe.mode == MODE_MIXED_TRIAL) {
            for (var i = 0; i < num_prog_list.length; i++) {
                var num_prog = num_prog_list[i];
                if (num_prog == 0) {
                    var failAnalysis = Analyzer_MixedTrial.analyzeFailure(data, i);
                    feedbackList.push(failAnalysis.html);
                    this.mpbe.log.add(new LogItem("FAIL_MESSAGE", this.taskID, {
                        data: data,
                        code: failAnalysis.failCode
                    }));
                    isEveryStepRight = false;
                }
                else if (num_prog == 1) {
                    feedbackList.push(MESSAGE_STEP_SUCCESS);
                }
                else if (num_prog > 1) {
                    feedbackList.push(MESSAGE_STEP_WARNING.replace("[minimum_num_prog]", num_prog.toString()) + " Provide more examples.");
                    isEveryStepRight = false;
                }
            }
        }
        else if (this.mpbe.mode == MODE_MIXED_TASK) {
        }
        else if (this.mpbe.mode == MODE_MIXED_ALL) {
        }
        /////// STEP 3. LET THE TASK VIEWER TO RENDER FEEDBACK
        this.view.renderFeedback(feedbackList);
        /////// 
        return {
            isEveryStepRight: isEveryStepRight,
            numProgList: num_prog_list
        };
    };
    // GIVE UP A SINGLE TASK
    TaskController.prototype.giveUp = function () {
        this.mpbe.log.add(new LogItem("GIVE_UP_TASK", this.taskID, {}));
        // WHAT TO SHOW NEXT
        var currentSection = $(".section[tid='" + this.taskID + "']");
        if (this.taskID == _.last(TaskDefinition.getAllIDs())) {
            $("div.endOfTask").removeClass("hidden");
        }
        else if ($(currentSection).hasClass("lastTutorial")) {
            $("div.endOfTutorial").removeClass("hidden");
        }
        else {
            var taskEl = $("div.section[tid='" + this.taskID + "']");
            this.openSection($(taskEl).next(".section").attr("tid"));
            // IF IT IS ACTUAL TASKS, HIDE CURRENT TASKEL
            if (this.taskID.indexOf("task") != -1) {
                $(taskEl).addClass("hidden");
            }
        }
    };
    TaskController.prototype.openSection = function (tid) {
        var sectionEl = $("div.section[tid='" + tid + "']");
        if ($(sectionEl).hasClass("hidden")) {
            $(sectionEl).removeClass("hidden").css("opacity", "0").animate({ opacity: 1.0 }, 1000);
            this.mpbe.log.add(new LogItem("OPEN_SECTION", this.taskID, {}));
        }
    };
    return TaskController;
}());
//# sourceMappingURL=script.js.map