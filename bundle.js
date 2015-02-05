/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8090/assets";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var App = __webpack_require__(3)

	React.render(
	  React.createElement(App, null), 
	  document.getElementById('app')
	);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	__webpack_require__(11);

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(10);
	var Store = __webpack_require__(4);
	var RouteStore = __webpack_require__(5);
	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	var List = __webpack_require__(6);
	var ListForm = __webpack_require__(7);
	var ListEdit = __webpack_require__(8);
	var Shufflr = __webpack_require__(9);

	// var { RouteHandler } = require('react-router'); // ecma6 decontruction

	module.exports = React.createClass({displayName: "exports",

	  // this will cause setState({ nameList: updatedlist }) whenever the store trigger(updatedlist)
	  mixins: [
	    Reflux.connect(Store, "list"),
	    Reflux.connect(RouteStore, "request")
	  ],  

	  render: function() {
	    switch(this.state.request.currView) {
	    case 'list':
	      return React.createElement(List, {lists: this.state.list.listNames})
	      break;
	    case 'newList':
	      return React.createElement(ListForm, {listName: this.state.request.params.listName})
	      break;
	    case 'listEdit':
	      return React.createElement(ListEdit, {lists: this.state.list.listNames})
	      break; 
	    case 'listForm':
	      return React.createElement(ListForm, {listName: this.state.list.currListName, 
	                       items: this.state.list.currListItems})
	      break;   
	    case 'shufflr':
	      return React.createElement(Shufflr, {items: this.state.list.currListItems})
	      break;
	    }
	  }
	})





/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Reflux = __webpack_require__(10);
	var Actions = __webpack_require__(13);
	var Utils = __webpack_require__(14);

	module.exports = Reflux.createStore({
	  // this will set up listeners to all publishers Actions 
	  // using onKeyname (or keyname) as callbacks
	  listenables: [Actions],

	  getInitialState: function() {
	    this.listNames = Object.keys(localStorage);
	    return { listNames: this.listNames, currListItems: [], currListName: '' };
	  },

	  onNewList: function(data) {
	    this.currListName = data.listName;
	    this.triggerUpdate();
	  },  

	  destroyList: function(listName) {
	    localStorage.removeItem(listName);
	    this.listNames = Object.keys(localStorage);    
	    this.triggerUpdate();
	  },

	  saveList: function(data) {
	    var items = JSON.stringify(data.params.names);
	    this.currListName = data.params.listName;
	    localStorage.setItem(this.currListName, items);
	    this.listNames = Object.keys(localStorage);
	    this.currListItems = buildObjectArray(data.params.names);
	    this.triggerUpdate();
	  },

	  showList: function(listName) {
	    this.currListName = listName;
	    var items = JSON.parse(localStorage.getItem(listName));
	    this.currListItems = buildObjectArray(items);
	    this.triggerUpdate();
	  },

	  showListForEdit: function(listName) {
	    this.currListName = listName;
	    var items = JSON.parse(localStorage.getItem(listName));
	    this.currListItems = buildObjectArray(items);
	    this.triggerUpdate();
	  },

	  shuffle: function() {
	    Utils.shuffleArray(this.currListItems);
	    this.triggerUpdate();
	  },  

	  reset: function() {
	    this.currListItems = buildObjectArray(this.currListItems);
	    this.triggerUpdate();
	  },

	  toggleActive: function(item) {
	    var index = this.currListItems.indexOf(item);
	    this.currListItems[index].active = !this.currListItems[index].active;
	    this.triggerUpdate();
	  },  

	  triggerUpdate: function() {
	    this.trigger({
	      currListItems: this.currListItems, 
	      listNames: this.listNames,
	      currListName: this.currListName        
	    });
	  }

	})

	// transform array of name strings to array of objects 
	function buildObjectArray(items) {
	  return items.map(function(item) { 
	    return {name: item, active: true} 
	  });
	} 

	function getItemByKey(list,itemKey){
	  return _.find(list, function(item) {
	    return item.number === itemKey;
	  });
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Reflux = __webpack_require__(10);
	var Actions = __webpack_require__(13);

	module.exports = Reflux.createStore({
	  listenables: [Actions],

	  routes: {
	    '/': 'list',
	    '/lists/new': 'listForm',
	    '/lists/edit': 'listEdit',
	    '/show': 'shufflr',
	    '/show_edit': 'listForm'
	  },

	  navigate: function(route) {
	    this.currView = this.routes[route]
	    this.trigger({ currView: this.currView });
	  },

	  getInitialState: function() {
	    this.currView = 'list';
	    return { currView: this.currView, params: {} };
	  }  

	});

	function getItemByKey(list,itemKey){
	  return _.find(list, function(item) {
	    return item.number === itemKey;
	  });
	}
	 


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(10);
	var Store = __webpack_require__(4);
	var RouteStore = __webpack_require__(5);
	var Actions = __webpack_require__(13);
	var ListNameItem = __webpack_require__(15);
	var NewListForm = __webpack_require__(16);

	module.exports = React.createClass({displayName: "exports",
	  render: function() {
	    return (
	      React.createElement("div", {id: "app"}, 
	        React.createElement("header", null, 
	          React.createElement(NewListForm, null), 
	          React.createElement("div", {className: "list-edit-mode"}, 
	            React.createElement("button", {onClick: this.onEditMode, id: "btn-next", className: "green-sea-flat-button"}, "Edit")
	          )
	        ), 

	        React.createElement("div", {className: "instructions"}, 
	          React.createElement("p", null, "or select an existing list below")
	        ), 
	        
	        React.createElement("main", null, 
	          React.createElement("ul", {className: "lists-container"}, 
	            
	              this.props.lists.map(function(item, index) {
	                return React.createElement(ListNameItem, {key: index, item: item})
	              }, this)
	            
	          )
	        )
	      )      
	    )
	  },

	  onEditMode: function() {
	    Actions.navigate('/lists/edit');
	  }

	});



/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(10);
	var Store = __webpack_require__(4);
	var RouteStore = __webpack_require__(5);
	var Actions = __webpack_require__(13);

	module.exports = React.createClass({displayName: "exports",

	  render: function() {

	    return (
	      React.createElement("div", {id: "app"}, 
	        React.createElement("header", null, 
	          React.createElement("div", {className: "new-list-name"}, this.props.listName), 
	          React.createElement("div", {className: "destroy"}, 
	            React.createElement("button", {id: "btn-destroy", className: "pomegranate-flat-button", onClick: this.onDestroyList}, "Delete")
	          ), 

	          React.createElement("div", {className: "next"}, 
	            React.createElement("button", {id: "btn-next", className: "emerald-flat-button", onClick: this.onSaveList}, "Save")
	          ), 
	          React.createElement("div", {className: "cancel"}, 
	            React.createElement("button", {id: "btn-cancel", className: "concrete-flat-button", onClick: this.onCancel}, "Cancel")
	          )
	        ), 

	        React.createElement("div", {className: "instructions"}, 
	          React.createElement("p", null, "Enter each name in a new line below")
	        ), 

	        React.createElement("main", null, 
	          React.createElement("textarea", {id: "names-list", ref: "listInput", defaultValue: this.itemsForEdit()})
	        ), 

	        React.createElement("footer", null
	        )
	      )
	    )
	  },

	  componentDidMount: function() {
	    this.refs.listInput.getDOMNode().focus();
	  },

	  onCancel: function() {
	    this.props.items ? Actions.navigate('/lists/edit') : Actions.navigate('/');
	  },

	  itemsForEdit: function() {
	    if (!this.props.items || this.props.items.length === 0) return '';

	    var items = this.props.items.map(function(item) {
	      return item.name;
	    }).join('\n');

	    return items;
	  },

	  onDestroyList: function() {
	    console.log(this.props.listName)
	    Actions.destroyList(this.props.listName);
	    Actions.navigate('/');
	  },

	  onSaveList: function() {
	    var names = this.refs.listInput.getDOMNode().value.split(/\r?\n/).filter(Boolean);

	    Actions.saveList({
	      params: {
	        names: names,
	        listName: this.props.listName
	      }
	    });

	    Actions.navigate('/');
	  },

	  getInitialState: function() {
	    return { loading: true }
	  }
	});



/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(10);
	var Store = __webpack_require__(4);
	var Actions = __webpack_require__(13);
	var NewListForm = __webpack_require__(16);
	var ListNameItem = __webpack_require__(15);


	module.exports = React.createClass({displayName: "exports",

	  render: function() {
	    return (
	      React.createElement("div", {id: "app"}, 
	        React.createElement("header", {className: "new-list-form"}, 
	          React.createElement(NewListForm, null), 
	          React.createElement("div", {className: "list-edit-mode"}, 
	            React.createElement("button", {onClick: Actions.navigate.bind(this, '/'), id: "btn-next", className: "green-sea-flat-button"}, "cancel")
	          )
	        ), 
	        React.createElement("div", {className: "instructions"}, 
	          React.createElement("p", {className: "animated flipInX editMode"}, "Select a list to edit")
	        ), 
	        React.createElement("main", null, 
	          React.createElement("ul", {className: "lists-container"}, 
	            
	              this.props.lists.map(function(item, index) {
	                return React.createElement(ListNameItem, {key: index, item: item, editMode: true})
	              }, this)
	            
	          )
	        )
	      )
	    )
	  }

	});



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(10);
	var Store = __webpack_require__(4);
	var RouteStore = __webpack_require__(5);
	var Actions = __webpack_require__(13);
	var $ = __webpack_require__(20).$
	var grid = __webpack_require__(17);
	var BodyItem = __webpack_require__(18);
	var utils = __webpack_require__(14);

	module.exports = React.createClass({displayName: "exports",

	  render: function() {
	    return (

	      React.createElement("div", {id: "app"}, 
	        React.createElement("header", null, 
	          React.createElement("div", null, 
	            React.createElement("button", {onClick: this.onHomeClick, id: "home", className: "wisteria-flat-button"}, "Home")
	          ), 
	          React.createElement("div", null, 
	            React.createElement("button", {onClick: this.onSample, id: "sample", className: "peter-river-flat-button"}, "Sample")
	          ), 
	          React.createElement("div", null, 
	            React.createElement("button", {onClick: this.onShuffle, className: "belize-hole-flat-button"}, "Shuffle")
	          ), 
	          React.createElement("div", null, 
	            React.createElement("button", {onClick: this.onGroup, id: "group", className: "wet-asphalt-flat-button"}, "Group")
	          ), 
	          React.createElement("div", null, 
	            React.createElement("button", {onClick: this.onReset, id: "reset", className: "pomegranate-flat-button"}, "Reset")
	          )
	        ), 

	        React.createElement("main", null, 
	          React.createElement("ul", {className: "boxes-container"}, 
	            
	              this.props.items.map(function(item, index) {
	                return React.createElement(BodyItem, {key: index, item: item, onClick: this.toggleActive})
	              }, this)
	            
	          )
	        )
	      )
	    )
	  },

	  componentDidMount: function() {
	    this.reloadGrid();    
	  },  

	  componentDidUnmount: function() {
	    window.removeEventListener('orientationchange');
	  },

	  reloadGrid: function() {
	    var screenSize = window.getComputedStyle(document.body,':after').getPropertyValue('content');

	    if (screenSize==='wide-screen'){
	      grid.init(3);
	    } else {
	      grid.init(2);
	    }   
	  },

	  onHomeClick: function() {
	    Actions.navigate('/');
	  },

	  onGroup: function() {
	    console.log('dfsdf')
	  },

	  onSample: function() {
	    var delayCurve = function(index, max) {
	      var threshold = index - (max - 7);
	      var indexLeft = max - index;

	      if (indexLeft <= 5) {
	        var n = index * 75 + ( threshold * threshold * threshold * threshold);
	        return n;
	      } else {
	        return index * 75;
	      }
	    };

	    $('li').not('.inactive').removeClass('highlight'); 
	    var $li = utils.shuffleArray($('li').not('.inactive'));

	    $li.each(function(index, elem) {
	      if(index === ($li.length-1)) {

	        setTimeout(function() {
	          var $elem = $(elem);
	          $elem.addClass('pushdown highlight')
	            .one('webkitTransitionEnd transitionend', function() {
	              $elem.removeClass('pushdown');
	            });;
	        }, delayCurve(index, $li.length));

	      } else {

	        setTimeout(function() {
	          var $elem = $(elem);
	          $elem.addClass('pushdown highlight')
	            .one('webkitTransitionEnd transitionend', function() {
	              $elem.removeClass('pushdown highlight');
	            });;
	        }, delayCurve(index, $li.length));

	      }
	    });
	  },

	  onShuffle: function() {
	    Actions.shuffle();
	  },

	  onReset: function() {
	    $('li').not('.inactive').removeClass('highlight'); 
	    Actions.reset();
	  },

	  getInitialState: function() {
	    return { loading: true, screenSize: '' }
	  }
	});



/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(21);


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(12);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/home/daniel/work/personal/js/shufflr/node_modules/css-loader/index.js!/home/daniel/work/personal/js/shufflr/node_modules/autoprefixer-loader/index.js!/home/daniel/work/personal/js/shufflr/node_modules/sass-loader/index.js!/home/daniel/work/personal/js/shufflr/src/css/style.scss", function() {
			var newContent = require("!!/home/daniel/work/personal/js/shufflr/node_modules/css-loader/index.js!/home/daniel/work/personal/js/shufflr/node_modules/autoprefixer-loader/index.js!/home/daniel/work/personal/js/shufflr/node_modules/sass-loader/index.js!/home/daniel/work/personal/js/shufflr/src/css/style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(22)();
	exports.push([module.id, "html{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}body{margin:0;font-size:16px;}h1,h2,h3,h4,p,blockquote,figure,ol,ul{margin:0;padding:0;}li{display:block;}h1,h2,h3,h4{font-size:inherit;}a{text-decoration:none;color:inherit;-webkit-transition:0.3s;transition:0.3s;}img{max-width:100%;height:auto;border:0;}/*!\nAnimate.css - http://daneden.me/animate\nLicensed under the MIT license - http://opensource.org/licenses/MIT\n\nCopyright (c) 2014 Daniel Eden\n*/.animated{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both;}.animated.infinite{-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;}.animated.hinge{-webkit-animation-duration:2s;animation-duration:2s;}@-webkit-keyframes bounce{0%,20%,53%,80%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}40%,43%{-webkit-transition-timing-function:cubic-bezier(0.755, 0.05, 0.855, 0.06);transition-timing-function:cubic-bezier(0.755, 0.05, 0.855, 0.06);-webkit-transform:translate3d(0, -30px, 0);transform:translate3d(0, -30px, 0);}70%{-webkit-transition-timing-function:cubic-bezier(0.755, 0.05, 0.855, 0.06);transition-timing-function:cubic-bezier(0.755, 0.05, 0.855, 0.06);-webkit-transform:translate3d(0, -15px, 0);transform:translate3d(0, -15px, 0);}90%{-webkit-transform:translate3d(0, -4px, 0);transform:translate3d(0, -4px, 0);}}@keyframes bounce{0%,20%,53%,80%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}40%,43%{-webkit-transition-timing-function:cubic-bezier(0.755, 0.05, 0.855, 0.06);transition-timing-function:cubic-bezier(0.755, 0.05, 0.855, 0.06);-webkit-transform:translate3d(0, -30px, 0);transform:translate3d(0, -30px, 0);}70%{-webkit-transition-timing-function:cubic-bezier(0.755, 0.05, 0.855, 0.06);transition-timing-function:cubic-bezier(0.755, 0.05, 0.855, 0.06);-webkit-transform:translate3d(0, -15px, 0);transform:translate3d(0, -15px, 0);}90%{-webkit-transform:translate3d(0, -4px, 0);transform:translate3d(0, -4px, 0);}}.bounce{-webkit-animation-name:bounce;animation-name:bounce;-webkit-transform-origin:center bottom;-ms-transform-origin:center bottom;transform-origin:center bottom;}@-webkit-keyframes flash{0%,50%,100%{opacity:1;}25%,75%{opacity:0;}}@keyframes flash{0%,50%,100%{opacity:1;}25%,75%{opacity:0;}}.flash{-webkit-animation-name:flash;animation-name:flash;}@-webkit-keyframes pulse{0%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}50%{-webkit-transform:scale3d(1.05, 1.05, 1.05);transform:scale3d(1.05, 1.05, 1.05);}100%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}}@keyframes pulse{0%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}50%{-webkit-transform:scale3d(1.05, 1.05, 1.05);transform:scale3d(1.05, 1.05, 1.05);}100%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}}.pulse{-webkit-animation-name:pulse;animation-name:pulse;}@-webkit-keyframes rubberBand{0%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}30%{-webkit-transform:scale3d(1.25, 0.75, 1);transform:scale3d(1.25, 0.75, 1);}40%{-webkit-transform:scale3d(0.75, 1.25, 1);transform:scale3d(0.75, 1.25, 1);}50%{-webkit-transform:scale3d(1.15, 0.85, 1);transform:scale3d(1.15, 0.85, 1);}65%{-webkit-transform:scale3d(0.95, 1.05, 1);transform:scale3d(0.95, 1.05, 1);}75%{-webkit-transform:scale3d(1.05, 0.95, 1);transform:scale3d(1.05, 0.95, 1);}100%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}}@keyframes rubberBand{0%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}30%{-webkit-transform:scale3d(1.25, 0.75, 1);transform:scale3d(1.25, 0.75, 1);}40%{-webkit-transform:scale3d(0.75, 1.25, 1);transform:scale3d(0.75, 1.25, 1);}50%{-webkit-transform:scale3d(1.15, 0.85, 1);transform:scale3d(1.15, 0.85, 1);}65%{-webkit-transform:scale3d(0.95, 1.05, 1);transform:scale3d(0.95, 1.05, 1);}75%{-webkit-transform:scale3d(1.05, 0.95, 1);transform:scale3d(1.05, 0.95, 1);}100%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}}.rubberBand{-webkit-animation-name:rubberBand;animation-name:rubberBand;}@-webkit-keyframes shake{0%,100%{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px, 0, 0);transform:translate3d(-10px, 0, 0);}20%,40%,60%,80%{-webkit-transform:translate3d(10px, 0, 0);transform:translate3d(10px, 0, 0);}}@keyframes shake{0%,100%{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px, 0, 0);transform:translate3d(-10px, 0, 0);}20%,40%,60%,80%{-webkit-transform:translate3d(10px, 0, 0);transform:translate3d(10px, 0, 0);}}.shake{-webkit-animation-name:shake;animation-name:shake;}@-webkit-keyframes swing{20%{-webkit-transform:rotate3d(0, 0, 1, 15deg);transform:rotate3d(0, 0, 1, 15deg);}40%{-webkit-transform:rotate3d(0, 0, 1, -10deg);transform:rotate3d(0, 0, 1, -10deg);}60%{-webkit-transform:rotate3d(0, 0, 1, 5deg);transform:rotate3d(0, 0, 1, 5deg);}80%{-webkit-transform:rotate3d(0, 0, 1, -5deg);transform:rotate3d(0, 0, 1, -5deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 0deg);transform:rotate3d(0, 0, 1, 0deg);}}@keyframes swing{20%{-webkit-transform:rotate3d(0, 0, 1, 15deg);transform:rotate3d(0, 0, 1, 15deg);}40%{-webkit-transform:rotate3d(0, 0, 1, -10deg);transform:rotate3d(0, 0, 1, -10deg);}60%{-webkit-transform:rotate3d(0, 0, 1, 5deg);transform:rotate3d(0, 0, 1, 5deg);}80%{-webkit-transform:rotate3d(0, 0, 1, -5deg);transform:rotate3d(0, 0, 1, -5deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 0deg);transform:rotate3d(0, 0, 1, 0deg);}}.swing{-webkit-transform-origin:top center;-ms-transform-origin:top center;transform-origin:top center;-webkit-animation-name:swing;animation-name:swing;}@-webkit-keyframes tada{0%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}10%,20%{-webkit-transform:scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);transform:scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);}30%,50%,70%,90%{-webkit-transform:scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);transform:scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);}40%,60%,80%{-webkit-transform:scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);transform:scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);}100%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}}@keyframes tada{0%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}10%,20%{-webkit-transform:scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);transform:scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);}30%,50%,70%,90%{-webkit-transform:scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);transform:scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);}40%,60%,80%{-webkit-transform:scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);transform:scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);}100%{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}}.tada{-webkit-animation-name:tada;animation-name:tada;}@-webkit-keyframes wobble{0%{-webkit-transform:none;transform:none;}15%{-webkit-transform:translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);transform:translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);}30%{-webkit-transform:translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);transform:translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);}45%{-webkit-transform:translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);transform:translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);}60%{-webkit-transform:translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);transform:translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);}75%{-webkit-transform:translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);transform:translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);}100%{-webkit-transform:none;transform:none;}}@keyframes wobble{0%{-webkit-transform:none;transform:none;}15%{-webkit-transform:translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);transform:translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);}30%{-webkit-transform:translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);transform:translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);}45%{-webkit-transform:translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);transform:translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);}60%{-webkit-transform:translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);transform:translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);}75%{-webkit-transform:translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);transform:translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);}100%{-webkit-transform:none;transform:none;}}.wobble{-webkit-animation-name:wobble;animation-name:wobble;}@-webkit-keyframes bounceIn{0%,20%,40%,60%,80%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:scale3d(0.3, 0.3, 0.3);transform:scale3d(0.3, 0.3, 0.3);}20%{-webkit-transform:scale3d(1.1, 1.1, 1.1);transform:scale3d(1.1, 1.1, 1.1);}40%{-webkit-transform:scale3d(0.9, 0.9, 0.9);transform:scale3d(0.9, 0.9, 0.9);}60%{opacity:1;-webkit-transform:scale3d(1.03, 1.03, 1.03);transform:scale3d(1.03, 1.03, 1.03);}80%{-webkit-transform:scale3d(0.97, 0.97, 0.97);transform:scale3d(0.97, 0.97, 0.97);}100%{opacity:1;-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}}@keyframes bounceIn{0%,20%,40%,60%,80%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:scale3d(0.3, 0.3, 0.3);transform:scale3d(0.3, 0.3, 0.3);}20%{-webkit-transform:scale3d(1.1, 1.1, 1.1);transform:scale3d(1.1, 1.1, 1.1);}40%{-webkit-transform:scale3d(0.9, 0.9, 0.9);transform:scale3d(0.9, 0.9, 0.9);}60%{opacity:1;-webkit-transform:scale3d(1.03, 1.03, 1.03);transform:scale3d(1.03, 1.03, 1.03);}80%{-webkit-transform:scale3d(0.97, 0.97, 0.97);transform:scale3d(0.97, 0.97, 0.97);}100%{opacity:1;-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1);}}.bounceIn{-webkit-animation-name:bounceIn;animation-name:bounceIn;-webkit-animation-duration:0.75s;animation-duration:0.75s;}@-webkit-keyframes bounceInDown{0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:translate3d(0, -3000px, 0);transform:translate3d(0, -3000px, 0);}60%{opacity:1;-webkit-transform:translate3d(0, 25px, 0);transform:translate3d(0, 25px, 0);}75%{-webkit-transform:translate3d(0, -10px, 0);transform:translate3d(0, -10px, 0);}90%{-webkit-transform:translate3d(0, 5px, 0);transform:translate3d(0, 5px, 0);}100%{-webkit-transform:none;transform:none;}}@keyframes bounceInDown{0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:translate3d(0, -3000px, 0);transform:translate3d(0, -3000px, 0);}60%{opacity:1;-webkit-transform:translate3d(0, 25px, 0);transform:translate3d(0, 25px, 0);}75%{-webkit-transform:translate3d(0, -10px, 0);transform:translate3d(0, -10px, 0);}90%{-webkit-transform:translate3d(0, 5px, 0);transform:translate3d(0, 5px, 0);}100%{-webkit-transform:none;transform:none;}}.bounceInDown{-webkit-animation-name:bounceInDown;animation-name:bounceInDown;}@-webkit-keyframes bounceInLeft{0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:translate3d(-3000px, 0, 0);transform:translate3d(-3000px, 0, 0);}60%{opacity:1;-webkit-transform:translate3d(25px, 0, 0);transform:translate3d(25px, 0, 0);}75%{-webkit-transform:translate3d(-10px, 0, 0);transform:translate3d(-10px, 0, 0);}90%{-webkit-transform:translate3d(5px, 0, 0);transform:translate3d(5px, 0, 0);}100%{-webkit-transform:none;transform:none;}}@keyframes bounceInLeft{0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:translate3d(-3000px, 0, 0);transform:translate3d(-3000px, 0, 0);}60%{opacity:1;-webkit-transform:translate3d(25px, 0, 0);transform:translate3d(25px, 0, 0);}75%{-webkit-transform:translate3d(-10px, 0, 0);transform:translate3d(-10px, 0, 0);}90%{-webkit-transform:translate3d(5px, 0, 0);transform:translate3d(5px, 0, 0);}100%{-webkit-transform:none;transform:none;}}.bounceInLeft{-webkit-animation-name:bounceInLeft;animation-name:bounceInLeft;}@-webkit-keyframes bounceInRight{0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:translate3d(3000px, 0, 0);transform:translate3d(3000px, 0, 0);}60%{opacity:1;-webkit-transform:translate3d(-25px, 0, 0);transform:translate3d(-25px, 0, 0);}75%{-webkit-transform:translate3d(10px, 0, 0);transform:translate3d(10px, 0, 0);}90%{-webkit-transform:translate3d(-5px, 0, 0);transform:translate3d(-5px, 0, 0);}100%{-webkit-transform:none;transform:none;}}@keyframes bounceInRight{0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:translate3d(3000px, 0, 0);transform:translate3d(3000px, 0, 0);}60%{opacity:1;-webkit-transform:translate3d(-25px, 0, 0);transform:translate3d(-25px, 0, 0);}75%{-webkit-transform:translate3d(10px, 0, 0);transform:translate3d(10px, 0, 0);}90%{-webkit-transform:translate3d(-5px, 0, 0);transform:translate3d(-5px, 0, 0);}100%{-webkit-transform:none;transform:none;}}.bounceInRight{-webkit-animation-name:bounceInRight;animation-name:bounceInRight;}@-webkit-keyframes bounceInUp{0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:translate3d(0, 3000px, 0);transform:translate3d(0, 3000px, 0);}60%{opacity:1;-webkit-transform:translate3d(0, -20px, 0);transform:translate3d(0, -20px, 0);}75%{-webkit-transform:translate3d(0, 10px, 0);transform:translate3d(0, 10px, 0);}90%{-webkit-transform:translate3d(0, -5px, 0);transform:translate3d(0, -5px, 0);}100%{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}}@keyframes bounceInUp{0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1);}0%{opacity:0;-webkit-transform:translate3d(0, 3000px, 0);transform:translate3d(0, 3000px, 0);}60%{opacity:1;-webkit-transform:translate3d(0, -20px, 0);transform:translate3d(0, -20px, 0);}75%{-webkit-transform:translate3d(0, 10px, 0);transform:translate3d(0, 10px, 0);}90%{-webkit-transform:translate3d(0, -5px, 0);transform:translate3d(0, -5px, 0);}100%{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}}.bounceInUp{-webkit-animation-name:bounceInUp;animation-name:bounceInUp;}@-webkit-keyframes bounceOut{20%{-webkit-transform:scale3d(0.9, 0.9, 0.9);transform:scale3d(0.9, 0.9, 0.9);}50%,55%{opacity:1;-webkit-transform:scale3d(1.1, 1.1, 1.1);transform:scale3d(1.1, 1.1, 1.1);}100%{opacity:0;-webkit-transform:scale3d(0.3, 0.3, 0.3);transform:scale3d(0.3, 0.3, 0.3);}}@keyframes bounceOut{20%{-webkit-transform:scale3d(0.9, 0.9, 0.9);transform:scale3d(0.9, 0.9, 0.9);}50%,55%{opacity:1;-webkit-transform:scale3d(1.1, 1.1, 1.1);transform:scale3d(1.1, 1.1, 1.1);}100%{opacity:0;-webkit-transform:scale3d(0.3, 0.3, 0.3);transform:scale3d(0.3, 0.3, 0.3);}}.bounceOut{-webkit-animation-name:bounceOut;animation-name:bounceOut;-webkit-animation-duration:0.75s;animation-duration:0.75s;}@-webkit-keyframes bounceOutDown{20%{-webkit-transform:translate3d(0, 10px, 0);transform:translate3d(0, 10px, 0);}40%,45%{opacity:1;-webkit-transform:translate3d(0, -20px, 0);transform:translate3d(0, -20px, 0);}100%{opacity:0;-webkit-transform:translate3d(0, 2000px, 0);transform:translate3d(0, 2000px, 0);}}@keyframes bounceOutDown{20%{-webkit-transform:translate3d(0, 10px, 0);transform:translate3d(0, 10px, 0);}40%,45%{opacity:1;-webkit-transform:translate3d(0, -20px, 0);transform:translate3d(0, -20px, 0);}100%{opacity:0;-webkit-transform:translate3d(0, 2000px, 0);transform:translate3d(0, 2000px, 0);}}.bounceOutDown{-webkit-animation-name:bounceOutDown;animation-name:bounceOutDown;}@-webkit-keyframes bounceOutLeft{20%{opacity:1;-webkit-transform:translate3d(20px, 0, 0);transform:translate3d(20px, 0, 0);}100%{opacity:0;-webkit-transform:translate3d(-2000px, 0, 0);transform:translate3d(-2000px, 0, 0);}}@keyframes bounceOutLeft{20%{opacity:1;-webkit-transform:translate3d(20px, 0, 0);transform:translate3d(20px, 0, 0);}100%{opacity:0;-webkit-transform:translate3d(-2000px, 0, 0);transform:translate3d(-2000px, 0, 0);}}.bounceOutLeft{-webkit-animation-name:bounceOutLeft;animation-name:bounceOutLeft;}@-webkit-keyframes bounceOutRight{20%{opacity:1;-webkit-transform:translate3d(-20px, 0, 0);transform:translate3d(-20px, 0, 0);}100%{opacity:0;-webkit-transform:translate3d(2000px, 0, 0);transform:translate3d(2000px, 0, 0);}}@keyframes bounceOutRight{20%{opacity:1;-webkit-transform:translate3d(-20px, 0, 0);transform:translate3d(-20px, 0, 0);}100%{opacity:0;-webkit-transform:translate3d(2000px, 0, 0);transform:translate3d(2000px, 0, 0);}}.bounceOutRight{-webkit-animation-name:bounceOutRight;animation-name:bounceOutRight;}@-webkit-keyframes bounceOutUp{20%{-webkit-transform:translate3d(0, -10px, 0);transform:translate3d(0, -10px, 0);}40%,45%{opacity:1;-webkit-transform:translate3d(0, 20px, 0);transform:translate3d(0, 20px, 0);}100%{opacity:0;-webkit-transform:translate3d(0, -2000px, 0);transform:translate3d(0, -2000px, 0);}}@keyframes bounceOutUp{20%{-webkit-transform:translate3d(0, -10px, 0);transform:translate3d(0, -10px, 0);}40%,45%{opacity:1;-webkit-transform:translate3d(0, 20px, 0);transform:translate3d(0, 20px, 0);}100%{opacity:0;-webkit-transform:translate3d(0, -2000px, 0);transform:translate3d(0, -2000px, 0);}}.bounceOutUp{-webkit-animation-name:bounceOutUp;animation-name:bounceOutUp;}@-webkit-keyframes fadeIn{0%{opacity:0;}100%{opacity:1;}}@keyframes fadeIn{0%{opacity:0;}100%{opacity:1;}}.fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn;}@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0, -100%, 0);transform:translate3d(0, -100%, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0, -100%, 0);transform:translate3d(0, -100%, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}.fadeInDown{-webkit-animation-name:fadeInDown;animation-name:fadeInDown;}@-webkit-keyframes fadeInDownBig{0%{opacity:0;-webkit-transform:translate3d(0, -2000px, 0);transform:translate3d(0, -2000px, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes fadeInDownBig{0%{opacity:0;-webkit-transform:translate3d(0, -2000px, 0);transform:translate3d(0, -2000px, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}.fadeInDownBig{-webkit-animation-name:fadeInDownBig;animation-name:fadeInDownBig;}@-webkit-keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translate3d(-100%, 0, 0);transform:translate3d(-100%, 0, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translate3d(-100%, 0, 0);transform:translate3d(-100%, 0, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}.fadeInLeft{-webkit-animation-name:fadeInLeft;animation-name:fadeInLeft;}@-webkit-keyframes fadeInLeftBig{0%{opacity:0;-webkit-transform:translate3d(-2000px, 0, 0);transform:translate3d(-2000px, 0, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes fadeInLeftBig{0%{opacity:0;-webkit-transform:translate3d(-2000px, 0, 0);transform:translate3d(-2000px, 0, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}.fadeInLeftBig{-webkit-animation-name:fadeInLeftBig;animation-name:fadeInLeftBig;}@-webkit-keyframes fadeInRight{0%{opacity:0;-webkit-transform:translate3d(100%, 0, 0);transform:translate3d(100%, 0, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes fadeInRight{0%{opacity:0;-webkit-transform:translate3d(100%, 0, 0);transform:translate3d(100%, 0, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}.fadeInRight{-webkit-animation-name:fadeInRight;animation-name:fadeInRight;}@-webkit-keyframes fadeInRightBig{0%{opacity:0;-webkit-transform:translate3d(2000px, 0, 0);transform:translate3d(2000px, 0, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes fadeInRightBig{0%{opacity:0;-webkit-transform:translate3d(2000px, 0, 0);transform:translate3d(2000px, 0, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}.fadeInRightBig{-webkit-animation-name:fadeInRightBig;animation-name:fadeInRightBig;}@-webkit-keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}.fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp;}@-webkit-keyframes fadeInUpBig{0%{opacity:0;-webkit-transform:translate3d(0, 2000px, 0);transform:translate3d(0, 2000px, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes fadeInUpBig{0%{opacity:0;-webkit-transform:translate3d(0, 2000px, 0);transform:translate3d(0, 2000px, 0);}100%{opacity:1;-webkit-transform:none;transform:none;}}.fadeInUpBig{-webkit-animation-name:fadeInUpBig;animation-name:fadeInUpBig;}@-webkit-keyframes fadeOut{0%{opacity:1;}100%{opacity:0;}}@keyframes fadeOut{0%{opacity:1;}100%{opacity:0;}}.fadeOut{-webkit-animation-name:fadeOut;animation-name:fadeOut;}@-webkit-keyframes fadeOutDown{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0);}}@keyframes fadeOutDown{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0);}}.fadeOutDown{-webkit-animation-name:fadeOutDown;animation-name:fadeOutDown;}@-webkit-keyframes fadeOutDownBig{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(0, 2000px, 0);transform:translate3d(0, 2000px, 0);}}@keyframes fadeOutDownBig{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(0, 2000px, 0);transform:translate3d(0, 2000px, 0);}}.fadeOutDownBig{-webkit-animation-name:fadeOutDownBig;animation-name:fadeOutDownBig;}@-webkit-keyframes fadeOutLeft{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(-100%, 0, 0);transform:translate3d(-100%, 0, 0);}}@keyframes fadeOutLeft{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(-100%, 0, 0);transform:translate3d(-100%, 0, 0);}}.fadeOutLeft{-webkit-animation-name:fadeOutLeft;animation-name:fadeOutLeft;}@-webkit-keyframes fadeOutLeftBig{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(-2000px, 0, 0);transform:translate3d(-2000px, 0, 0);}}@keyframes fadeOutLeftBig{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(-2000px, 0, 0);transform:translate3d(-2000px, 0, 0);}}.fadeOutLeftBig{-webkit-animation-name:fadeOutLeftBig;animation-name:fadeOutLeftBig;}@-webkit-keyframes fadeOutRight{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(100%, 0, 0);transform:translate3d(100%, 0, 0);}}@keyframes fadeOutRight{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(100%, 0, 0);transform:translate3d(100%, 0, 0);}}.fadeOutRight{-webkit-animation-name:fadeOutRight;animation-name:fadeOutRight;}@-webkit-keyframes fadeOutRightBig{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(2000px, 0, 0);transform:translate3d(2000px, 0, 0);}}@keyframes fadeOutRightBig{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(2000px, 0, 0);transform:translate3d(2000px, 0, 0);}}.fadeOutRightBig{-webkit-animation-name:fadeOutRightBig;animation-name:fadeOutRightBig;}@-webkit-keyframes fadeOutUp{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(0, -100%, 0);transform:translate3d(0, -100%, 0);}}@keyframes fadeOutUp{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(0, -100%, 0);transform:translate3d(0, -100%, 0);}}.fadeOutUp{-webkit-animation-name:fadeOutUp;animation-name:fadeOutUp;}@-webkit-keyframes fadeOutUpBig{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(0, -2000px, 0);transform:translate3d(0, -2000px, 0);}}@keyframes fadeOutUpBig{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(0, -2000px, 0);transform:translate3d(0, -2000px, 0);}}.fadeOutUpBig{-webkit-animation-name:fadeOutUpBig;animation-name:fadeOutUpBig;}@-webkit-keyframes flip{0%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, -360deg);transform:perspective(400px) rotate3d(0, 1, 0, -360deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;}40%{-webkit-transform:perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);transform:perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;}50%{-webkit-transform:perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);transform:perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;}80%{-webkit-transform:perspective(400px) scale3d(0.95, 0.95, 0.95);transform:perspective(400px) scale3d(0.95, 0.95, 0.95);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;}100%{-webkit-transform:perspective(400px);transform:perspective(400px);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;}}@keyframes flip{0%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, -360deg);transform:perspective(400px) rotate3d(0, 1, 0, -360deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;}40%{-webkit-transform:perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);transform:perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;}50%{-webkit-transform:perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);transform:perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;}80%{-webkit-transform:perspective(400px) scale3d(0.95, 0.95, 0.95);transform:perspective(400px) scale3d(0.95, 0.95, 0.95);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;}100%{-webkit-transform:perspective(400px);transform:perspective(400px);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;}}.animated.flip{-webkit-backface-visibility:visible;backface-visibility:visible;-webkit-animation-name:flip;animation-name:flip;}@-webkit-keyframes flipInX{0%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, 90deg);transform:perspective(400px) rotate3d(1, 0, 0, 90deg);-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;opacity:0;}40%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, -20deg);transform:perspective(400px) rotate3d(1, 0, 0, -20deg);-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;}60%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, 10deg);transform:perspective(400px) rotate3d(1, 0, 0, 10deg);opacity:1;}80%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, -5deg);transform:perspective(400px) rotate3d(1, 0, 0, -5deg);}100%{-webkit-transform:perspective(400px);transform:perspective(400px);}}@keyframes flipInX{0%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, 90deg);transform:perspective(400px) rotate3d(1, 0, 0, 90deg);-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;opacity:0;}40%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, -20deg);transform:perspective(400px) rotate3d(1, 0, 0, -20deg);-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;}60%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, 10deg);transform:perspective(400px) rotate3d(1, 0, 0, 10deg);opacity:1;}80%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, -5deg);transform:perspective(400px) rotate3d(1, 0, 0, -5deg);}100%{-webkit-transform:perspective(400px);transform:perspective(400px);}}.flipInX{-webkit-backface-visibility:visible !important;backface-visibility:visible !important;-webkit-animation-name:flipInX;animation-name:flipInX;}@-webkit-keyframes flipInY{0%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, 90deg);transform:perspective(400px) rotate3d(0, 1, 0, 90deg);-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;opacity:0;}40%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, -20deg);transform:perspective(400px) rotate3d(0, 1, 0, -20deg);-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;}60%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, 10deg);transform:perspective(400px) rotate3d(0, 1, 0, 10deg);opacity:1;}80%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, -5deg);transform:perspective(400px) rotate3d(0, 1, 0, -5deg);}100%{-webkit-transform:perspective(400px);transform:perspective(400px);}}@keyframes flipInY{0%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, 90deg);transform:perspective(400px) rotate3d(0, 1, 0, 90deg);-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;opacity:0;}40%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, -20deg);transform:perspective(400px) rotate3d(0, 1, 0, -20deg);-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;}60%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, 10deg);transform:perspective(400px) rotate3d(0, 1, 0, 10deg);opacity:1;}80%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, -5deg);transform:perspective(400px) rotate3d(0, 1, 0, -5deg);}100%{-webkit-transform:perspective(400px);transform:perspective(400px);}}.flipInY{-webkit-backface-visibility:visible !important;backface-visibility:visible !important;-webkit-animation-name:flipInY;animation-name:flipInY;}@-webkit-keyframes flipOutX{0%{-webkit-transform:perspective(400px);transform:perspective(400px);}30%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, -20deg);transform:perspective(400px) rotate3d(1, 0, 0, -20deg);opacity:1;}100%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, 90deg);transform:perspective(400px) rotate3d(1, 0, 0, 90deg);opacity:0;}}@keyframes flipOutX{0%{-webkit-transform:perspective(400px);transform:perspective(400px);}30%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, -20deg);transform:perspective(400px) rotate3d(1, 0, 0, -20deg);opacity:1;}100%{-webkit-transform:perspective(400px) rotate3d(1, 0, 0, 90deg);transform:perspective(400px) rotate3d(1, 0, 0, 90deg);opacity:0;}}.flipOutX{-webkit-animation-name:flipOutX;animation-name:flipOutX;-webkit-animation-duration:0.75s;animation-duration:0.75s;-webkit-backface-visibility:visible !important;backface-visibility:visible !important;}@-webkit-keyframes flipOutY{0%{-webkit-transform:perspective(400px);transform:perspective(400px);}30%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, -15deg);transform:perspective(400px) rotate3d(0, 1, 0, -15deg);opacity:1;}100%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, 90deg);transform:perspective(400px) rotate3d(0, 1, 0, 90deg);opacity:0;}}@keyframes flipOutY{0%{-webkit-transform:perspective(400px);transform:perspective(400px);}30%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, -15deg);transform:perspective(400px) rotate3d(0, 1, 0, -15deg);opacity:1;}100%{-webkit-transform:perspective(400px) rotate3d(0, 1, 0, 90deg);transform:perspective(400px) rotate3d(0, 1, 0, 90deg);opacity:0;}}.flipOutY{-webkit-backface-visibility:visible !important;backface-visibility:visible !important;-webkit-animation-name:flipOutY;animation-name:flipOutY;-webkit-animation-duration:0.75s;animation-duration:0.75s;}@-webkit-keyframes lightSpeedIn{0%{-webkit-transform:translate3d(100%, 0, 0) skewX(-30deg);transform:translate3d(100%, 0, 0) skewX(-30deg);opacity:0;}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1;}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg);opacity:1;}100%{-webkit-transform:none;transform:none;opacity:1;}}@keyframes lightSpeedIn{0%{-webkit-transform:translate3d(100%, 0, 0) skewX(-30deg);transform:translate3d(100%, 0, 0) skewX(-30deg);opacity:0;}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1;}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg);opacity:1;}100%{-webkit-transform:none;transform:none;opacity:1;}}.lightSpeedIn{-webkit-animation-name:lightSpeedIn;animation-name:lightSpeedIn;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;}@-webkit-keyframes lightSpeedOut{0%{opacity:1;}100%{-webkit-transform:translate3d(100%, 0, 0) skewX(30deg);transform:translate3d(100%, 0, 0) skewX(30deg);opacity:0;}}@keyframes lightSpeedOut{0%{opacity:1;}100%{-webkit-transform:translate3d(100%, 0, 0) skewX(30deg);transform:translate3d(100%, 0, 0) skewX(30deg);opacity:0;}}.lightSpeedOut{-webkit-animation-name:lightSpeedOut;animation-name:lightSpeedOut;-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;}@-webkit-keyframes rotateIn{0%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0, 0, 1, -200deg);transform:rotate3d(0, 0, 1, -200deg);opacity:0;}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:none;transform:none;opacity:1;}}@keyframes rotateIn{0%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0, 0, 1, -200deg);transform:rotate3d(0, 0, 1, -200deg);opacity:0;}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:none;transform:none;opacity:1;}}.rotateIn{-webkit-animation-name:rotateIn;animation-name:rotateIn;}@-webkit-keyframes rotateInDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0, 0, 1, -45deg);transform:rotate3d(0, 0, 1, -45deg);opacity:0;}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1;}}@keyframes rotateInDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0, 0, 1, -45deg);transform:rotate3d(0, 0, 1, -45deg);opacity:0;}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1;}}.rotateInDownLeft{-webkit-animation-name:rotateInDownLeft;animation-name:rotateInDownLeft;}@-webkit-keyframes rotateInDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0, 0, 1, 45deg);transform:rotate3d(0, 0, 1, 45deg);opacity:0;}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1;}}@keyframes rotateInDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0, 0, 1, 45deg);transform:rotate3d(0, 0, 1, 45deg);opacity:0;}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1;}}.rotateInDownRight{-webkit-animation-name:rotateInDownRight;animation-name:rotateInDownRight;}@-webkit-keyframes rotateInUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0, 0, 1, 45deg);transform:rotate3d(0, 0, 1, 45deg);opacity:0;}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1;}}@keyframes rotateInUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0, 0, 1, 45deg);transform:rotate3d(0, 0, 1, 45deg);opacity:0;}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1;}}.rotateInUpLeft{-webkit-animation-name:rotateInUpLeft;animation-name:rotateInUpLeft;}@-webkit-keyframes rotateInUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0, 0, 1, -90deg);transform:rotate3d(0, 0, 1, -90deg);opacity:0;}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1;}}@keyframes rotateInUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0, 0, 1, -90deg);transform:rotate3d(0, 0, 1, -90deg);opacity:0;}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1;}}.rotateInUpRight{-webkit-animation-name:rotateInUpRight;animation-name:rotateInUpRight;}@-webkit-keyframes rotateOut{0%{-webkit-transform-origin:center;transform-origin:center;opacity:1;}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0, 0, 1, 200deg);transform:rotate3d(0, 0, 1, 200deg);opacity:0;}}@keyframes rotateOut{0%{-webkit-transform-origin:center;transform-origin:center;opacity:1;}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0, 0, 1, 200deg);transform:rotate3d(0, 0, 1, 200deg);opacity:0;}}.rotateOut{-webkit-animation-name:rotateOut;animation-name:rotateOut;}@-webkit-keyframes rotateOutDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1;}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0, 0, 1, 45deg);transform:rotate3d(0, 0, 1, 45deg);opacity:0;}}@keyframes rotateOutDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1;}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0, 0, 1, 45deg);transform:rotate3d(0, 0, 1, 45deg);opacity:0;}}.rotateOutDownLeft{-webkit-animation-name:rotateOutDownLeft;animation-name:rotateOutDownLeft;}@-webkit-keyframes rotateOutDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1;}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0, 0, 1, -45deg);transform:rotate3d(0, 0, 1, -45deg);opacity:0;}}@keyframes rotateOutDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1;}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0, 0, 1, -45deg);transform:rotate3d(0, 0, 1, -45deg);opacity:0;}}.rotateOutDownRight{-webkit-animation-name:rotateOutDownRight;animation-name:rotateOutDownRight;}@-webkit-keyframes rotateOutUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1;}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0, 0, 1, -45deg);transform:rotate3d(0, 0, 1, -45deg);opacity:0;}}@keyframes rotateOutUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1;}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0, 0, 1, -45deg);transform:rotate3d(0, 0, 1, -45deg);opacity:0;}}.rotateOutUpLeft{-webkit-animation-name:rotateOutUpLeft;animation-name:rotateOutUpLeft;}@-webkit-keyframes rotateOutUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1;}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0, 0, 1, 90deg);transform:rotate3d(0, 0, 1, 90deg);opacity:0;}}@keyframes rotateOutUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1;}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0, 0, 1, 90deg);transform:rotate3d(0, 0, 1, 90deg);opacity:0;}}.rotateOutUpRight{-webkit-animation-name:rotateOutUpRight;animation-name:rotateOutUpRight;}@-webkit-keyframes hinge{0%{-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;}20%,60%{-webkit-transform:rotate3d(0, 0, 1, 80deg);transform:rotate3d(0, 0, 1, 80deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;}40%,80%{-webkit-transform:rotate3d(0, 0, 1, 60deg);transform:rotate3d(0, 0, 1, 60deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;opacity:1;}100%{-webkit-transform:translate3d(0, 700px, 0);transform:translate3d(0, 700px, 0);opacity:0;}}@keyframes hinge{0%{-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;}20%,60%{-webkit-transform:rotate3d(0, 0, 1, 80deg);transform:rotate3d(0, 0, 1, 80deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;}40%,80%{-webkit-transform:rotate3d(0, 0, 1, 60deg);transform:rotate3d(0, 0, 1, 60deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;opacity:1;}100%{-webkit-transform:translate3d(0, 700px, 0);transform:translate3d(0, 700px, 0);opacity:0;}}.hinge{-webkit-animation-name:hinge;animation-name:hinge;}@-webkit-keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);transform:translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);}100%{opacity:1;-webkit-transform:none;transform:none;}}@keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);transform:translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);}100%{opacity:1;-webkit-transform:none;transform:none;}}.rollIn{-webkit-animation-name:rollIn;animation-name:rollIn;}@-webkit-keyframes rollOut{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);transform:translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);}}@keyframes rollOut{0%{opacity:1;}100%{opacity:0;-webkit-transform:translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);transform:translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);}}.rollOut{-webkit-animation-name:rollOut;animation-name:rollOut;}@-webkit-keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(0.3, 0.3, 0.3);transform:scale3d(0.3, 0.3, 0.3);}50%{opacity:1;}}@keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(0.3, 0.3, 0.3);transform:scale3d(0.3, 0.3, 0.3);}50%{opacity:1;}}.zoomIn{-webkit-animation-name:zoomIn;animation-name:zoomIn;}@-webkit-keyframes zoomInDown{0%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}60%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}@keyframes zoomInDown{0%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}60%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}.zoomInDown{-webkit-animation-name:zoomInDown;animation-name:zoomInDown;}@-webkit-keyframes zoomInLeft{0%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}60%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}@keyframes zoomInLeft{0%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}60%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}.zoomInLeft{-webkit-animation-name:zoomInLeft;animation-name:zoomInLeft;}@-webkit-keyframes zoomInRight{0%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}60%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}@keyframes zoomInRight{0%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}60%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}.zoomInRight{-webkit-animation-name:zoomInRight;animation-name:zoomInRight;}@-webkit-keyframes zoomInUp{0%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}60%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}@keyframes zoomInUp{0%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}60%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}.zoomInUp{-webkit-animation-name:zoomInUp;animation-name:zoomInUp;}@-webkit-keyframes zoomOut{0%{opacity:1;}50%{opacity:0;-webkit-transform:scale3d(0.3, 0.3, 0.3);transform:scale3d(0.3, 0.3, 0.3);}100%{opacity:0;}}@keyframes zoomOut{0%{opacity:1;}50%{opacity:0;-webkit-transform:scale3d(0.3, 0.3, 0.3);transform:scale3d(0.3, 0.3, 0.3);}100%{opacity:0;}}.zoomOut{-webkit-animation-name:zoomOut;animation-name:zoomOut;}@-webkit-keyframes zoomOutDown{40%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}100%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}@keyframes zoomOutDown{40%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}100%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}.zoomOutDown{-webkit-animation-name:zoomOutDown;animation-name:zoomOutDown;}@-webkit-keyframes zoomOutLeft{40%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);}100%{opacity:0;-webkit-transform:scale(0.1) translate3d(-2000px, 0, 0);transform:scale(0.1) translate3d(-2000px, 0, 0);-webkit-transform-origin:left center;transform-origin:left center;}}@keyframes zoomOutLeft{40%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);}100%{opacity:0;-webkit-transform:scale(0.1) translate3d(-2000px, 0, 0);transform:scale(0.1) translate3d(-2000px, 0, 0);-webkit-transform-origin:left center;transform-origin:left center;}}.zoomOutLeft{-webkit-animation-name:zoomOutLeft;animation-name:zoomOutLeft;}@-webkit-keyframes zoomOutRight{40%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);}100%{opacity:0;-webkit-transform:scale(0.1) translate3d(2000px, 0, 0);transform:scale(0.1) translate3d(2000px, 0, 0);-webkit-transform-origin:right center;transform-origin:right center;}}@keyframes zoomOutRight{40%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);}100%{opacity:0;-webkit-transform:scale(0.1) translate3d(2000px, 0, 0);transform:scale(0.1) translate3d(2000px, 0, 0);-webkit-transform-origin:right center;transform-origin:right center;}}.zoomOutRight{-webkit-animation-name:zoomOutRight;animation-name:zoomOutRight;}@-webkit-keyframes zoomOutUp{40%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}100%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}@keyframes zoomOutUp{40%{opacity:1;-webkit-transform:scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);transform:scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);-webkit-animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19);}100%{opacity:0;-webkit-transform:scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);transform:scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);animation-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1);}}.zoomOutUp{-webkit-animation-name:zoomOutUp;animation-name:zoomOutUp;}@-webkit-keyframes slideInDown{0%{-webkit-transform:translateY(-100%);transform:translateY(-100%);visibility:visible;}100%{-webkit-transform:translateY(0);transform:translateY(0);}}@keyframes slideInDown{0%{-webkit-transform:translateY(-100%);transform:translateY(-100%);visibility:visible;}100%{-webkit-transform:translateY(0);transform:translateY(0);}}.slideInDown{-webkit-animation-name:slideInDown;animation-name:slideInDown;}@-webkit-keyframes slideInLeft{0%{-webkit-transform:translateX(-100%);transform:translateX(-100%);visibility:visible;}100%{-webkit-transform:translateX(0);transform:translateX(0);}}@keyframes slideInLeft{0%{-webkit-transform:translateX(-100%);transform:translateX(-100%);visibility:visible;}100%{-webkit-transform:translateX(0);transform:translateX(0);}}.slideInLeft{-webkit-animation-name:slideInLeft;animation-name:slideInLeft;}@-webkit-keyframes slideInRight{0%{-webkit-transform:translateX(100%);transform:translateX(100%);visibility:visible;}100%{-webkit-transform:translateX(0);transform:translateX(0);}}@keyframes slideInRight{0%{-webkit-transform:translateX(100%);transform:translateX(100%);visibility:visible;}100%{-webkit-transform:translateX(0);transform:translateX(0);}}.slideInRight{-webkit-animation-name:slideInRight;animation-name:slideInRight;}@-webkit-keyframes slideInUp{0%{-webkit-transform:translateY(100%);transform:translateY(100%);visibility:visible;}100%{-webkit-transform:translateY(0);transform:translateY(0);}}@keyframes slideInUp{0%{-webkit-transform:translateY(100%);transform:translateY(100%);visibility:visible;}100%{-webkit-transform:translateY(0);transform:translateY(0);}}.slideInUp{-webkit-animation-name:slideInUp;animation-name:slideInUp;}@-webkit-keyframes slideOutDown{0%{-webkit-transform:translateY(0);transform:translateY(0);}100%{visibility:hidden;-webkit-transform:translateY(100%);transform:translateY(100%);}}@keyframes slideOutDown{0%{-webkit-transform:translateY(0);transform:translateY(0);}100%{visibility:hidden;-webkit-transform:translateY(100%);transform:translateY(100%);}}.slideOutDown{-webkit-animation-name:slideOutDown;animation-name:slideOutDown;}@-webkit-keyframes slideOutLeft{0%{-webkit-transform:translateX(0);transform:translateX(0);}100%{visibility:hidden;-webkit-transform:translateX(-100%);transform:translateX(-100%);}}@keyframes slideOutLeft{0%{-webkit-transform:translateX(0);transform:translateX(0);}100%{visibility:hidden;-webkit-transform:translateX(-100%);transform:translateX(-100%);}}.slideOutLeft{-webkit-animation-name:slideOutLeft;animation-name:slideOutLeft;}@-webkit-keyframes slideOutRight{0%{-webkit-transform:translateX(0);transform:translateX(0);}100%{visibility:hidden;-webkit-transform:translateX(100%);transform:translateX(100%);}}@keyframes slideOutRight{0%{-webkit-transform:translateX(0);transform:translateX(0);}100%{visibility:hidden;-webkit-transform:translateX(100%);transform:translateX(100%);}}.slideOutRight{-webkit-animation-name:slideOutRight;animation-name:slideOutRight;}@-webkit-keyframes slideOutUp{0%{-webkit-transform:translateY(0);transform:translateY(0);}100%{visibility:hidden;-webkit-transform:translateY(-100%);transform:translateY(-100%);}}@keyframes slideOutUp{0%{-webkit-transform:translateY(0);transform:translateY(0);}100%{visibility:hidden;-webkit-transform:translateY(-100%);transform:translateY(-100%);}}.slideOutUp{-webkit-animation-name:slideOutUp;animation-name:slideOutUp;}@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}@-webkit-keyframes viewShowFromLeftEnter{from{-webkit-transform:translate3d(-100%, 0, 0);transform:translate3d(-100%, 0, 0);}to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}}@keyframes viewShowFromLeftEnter{from{-webkit-transform:translate3d(-100%, 0, 0);transform:translate3d(-100%, 0, 0);}to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}}@-webkit-keyframes viewShowFromLeftLeave{to{opacity:0.75;-webkit-transform:translate3d(25%, 0, 0);transform:translate3d(25%, 0, 0);}}@keyframes viewShowFromLeftLeave{to{opacity:0.75;-webkit-transform:translate3d(25%, 0, 0);transform:translate3d(25%, 0, 0);}}@-webkit-keyframes viewShowFromRightEnter{from{-webkit-transform:translate3d(100%, 0, 0);transform:translate3d(100%, 0, 0);}to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}}@keyframes viewShowFromRightEnter{from{-webkit-transform:translate3d(100%, 0, 0);transform:translate3d(100%, 0, 0);}to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);}}.sun-flower-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#f1c40f;border:0;border-bottom:2px solid #e2b607;cursor:pointer;box-shadow:inset 0 -2px #e2b607;}.sun-flower-button:active{top:1px;outline:none;box-shadow:none;}.orange-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#f39c12;border:0;border-bottom:2px solid #e8930c;cursor:pointer;box-shadow:inset 0 -2px #e8930c;}.orange-flat-button:active{top:1px;outline:none;box-shadow:none;}.carrot-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#e67e22;border:0;border-bottom:2px solid #da751c;cursor:pointer;box-shadow:inset 0 -2px #da751c;}.carrot-flat-button:active{top:1px;outline:none;box-shadow:none;}.pumpkin-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#d35400;border:0;border-bottom:2px solid #c54e00;cursor:pointer;box-shadow:inset 0 -2px #c54e00;}.pumpkin-flat-button:active{top:1px;outline:none;box-shadow:none;}.alizarin-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#e74c3c;border:0;border-bottom:2px solid #db4334;cursor:pointer;box-shadow:inset 0 -2px #db4334;}.alizarin-flat-button:active{top:1px;outline:none;box-shadow:none;}.pomegranate-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#c0392b;border:0;border-bottom:2px solid #b53224;cursor:pointer;box-shadow:inset 0 -2px #b53224;}.pomegranate-flat-button:active{top:1px;outline:none;box-shadow:none;}.turquoise-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#1abc9c;border:0;border-bottom:2px solid #12ab8d;cursor:pointer;box-shadow:inset 0 -2px #12ab8d;}.turquoise-flat-button:active{top:1px;outline:none;box-shadow:none;}.green-sea-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#16a085;border:0;border-bottom:2px solid #14947b;cursor:pointer;box-shadow:inset 0 -2px #14947b;}.green-sea-flat-button:active{top:1px;outline:none;box-shadow:none;}.emerald-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#2ecc71;border:0;border-bottom:2px solid #28be68;cursor:pointer;box-shadow:inset 0 -2px #28be68;}.emerald-flat-button:active{top:1px;outline:none;box-shadow:none;}.nephritis-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#27ae60;border:0;border-bottom:2px solid #219d55;cursor:pointer;box-shadow:inset 0 -2px #219d55;}.nephritis-flat-button:active{top:1px;outline:none;box-shadow:none;}.peter-river-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#3498db;border:0;border-bottom:2px solid #2a8bcc;cursor:pointer;box-shadow:inset 0 -2px #2a8bcc;}.peter-river-flat-button:active{top:1px;outline:none;box-shadow:none;}.belize-hole-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#2980b9;border:0;border-bottom:2px solid #2475ab;cursor:pointer;box-shadow:inset 0 -2px #2475ab;}.belize-hole-flat-button:active{top:1px;outline:none;box-shadow:none;}.amethyst-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#9b59b6;border:0;border-bottom:2px solid #8d4ca7;cursor:pointer;box-shadow:inset 0 -2px #8d4ca7;}.amethyst-flat-button:active{top:1px;outline:none;box-shadow:none;}.wisteria-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#8e44ad;border:0;border-bottom:2px solid #80399d;cursor:pointer;box-shadow:inset 0 -2px #80399d;}.wisteria-flat-button:active{top:1px;outline:none;box-shadow:none;}.wet-asphalt-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#34495e;border:0;border-bottom:2px solid #263849;cursor:pointer;box-shadow:inset 0 -2px #263849;}.wet-asphalt-flat-button:active{top:1px;outline:none;box-shadow:none;}.wet-asphalt-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#34495e;border:0;border-bottom:2px solid #263849;cursor:pointer;box-shadow:inset 0 -2px #263849;}.wet-asphalt-flat-button:active{top:1px;outline:none;box-shadow:none;}.midnight-blue-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#2c3e50;border:0;border-bottom:2px solid #22303f;cursor:pointer;box-shadow:inset 0 -2px #22303f;}.midnight-blue-flat-button:active{top:1px;outline:none;box-shadow:none;}.clouds-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:#454545;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#ecf0f1;border:0;border-bottom:2px solid #dadedf;cursor:pointer;box-shadow:inset 0 -2px #dadedf;}.clouds-flat-button:active{top:1px;outline:none;box-shadow:none;}.silver-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#bdc3c7;border:0;border-bottom:2px solid #acb2b7;cursor:pointer;box-shadow:inset 0 -2px #acb2b7;}.silver-flat-button:active{top:1px;outline:none;box-shadow:none;}.concrete-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#859596;border:0;border-bottom:2px solid #95a5a6;cursor:pointer;box-shadow:inset 0 -2px #95a5a6;}.concrete-flat-button:active{top:1px;outline:none;box-shadow:none;}.asbestos-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#7f8c8d;border:0;border-bottom:2px solid #6d7b7c;cursor:pointer;box-shadow:inset 0 -2px #6d7b7c;}.asbestos-flat-button:active{top:1px;outline:none;box-shadow:none;}.asbestos-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#7f8c8d;border:0;border-bottom:2px solid #6d7b7c;cursor:pointer;box-shadow:inset 0 -2px #6d7b7c;}.asbestos-flat-button:active{top:1px;outline:none;box-shadow:none;}.graphite-flat-button{position:relative;vertical-align:top;width:100%;height:52px;padding:0;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background:#454545;border:0;border-bottom:2px solid #2f2e2e;cursor:pointer;box-shadow:inset 0 -2px #2f2e2e;}.graphite-flat-button:active{top:1px;outline:none;box-shadow:none;}.grid-container *{box-sizing:border-box;}.grid-container{max-width:100%;}.row:before,.row:after{content:\"\";display:table;clear:both;}[class*='col-']{float:left;min-height:1px;width:100%;padding:8px 10px;}@media all and (min-width: 20em){.col-1{width:33.3333%;}.col-2{width:33.3333%;}.col-3{width:50%;}.col-4{width:66.6666%;}.col-5{width:83.3333%;}.col-6{width:100%;}}@media all and (min-width: 42em){.col-1{width:16.66%;}}*{box-sizing:border-box;margin:0;padding:0;outline:none;}html,body,main,#container,#app{height:100%;width:100%;}body{margin:0 auto;background-color:#dcc6e0;font-family:'Lato',sans-serif;}div#app{display:table;-webkit-transition-timing-function:ease-in;transition-timing-function:ease-in;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-name:fadeIn;animation-name:fadeIn;-webkit-animation-duration:0.25s;animation-duration:0.25s;-webkit-animation-fill-mode:both;animation-fill-mode:both;}header{width:100%;}header{background:#674172;display:table-row;}header div{float:left;width:20%;}.next{width:25%;}.cancel{width:25%;}header:before,header:after{content:\"\";display:table;clear:both;}header input{width:100%;}main{display:table-row;}textarea{width:100%;height:100%;resize:none;border:none;outline:none;vertical-align:top;background-color:#ffecdb;padding:0.5em;font-size:1.2em;}.boxes-container{height:100%;overflow:hidden;position:relative;}.boxes-container li{padding:0.4em 0 0 0.4em;float:left;text-align:left;box-shadow:inset 0 0 0 1px rgba(0, 0, 0, 0.05);width:50%;lists-tyle:none;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-transition:all 0.2s ease-in;transition:all 0.2s ease-in;}.lists-container li{padding:0.4em 0 0 0.4em;text-align:center;box-shadow:inset 0 0 0 1px rgba(0, 0, 0, 0.05);list-style:none;height:3.6em;line-height:3em;font-size:1.2em;cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-transition:all 0.2s ease-in;transition:all 0.2s ease-in;}.lists-container li.editMode{background-color:#e4f1fe;}.color1{background:#f0f0e8;}#input-list-name{width:66.66667%;height:52px;outline:none;vertical-align:top;font-size:1.1em;padding:0.2em 0.4em;background-color:#f5f5f5;box-shadow:inset 0 2px 3px rgba(0, 0, 0, 0.1);border-radius:3px;border:none;}#btn-new{width:33.33334%;}.new-list-form{width:75%;}.list-edit-mode{width:25%;}.new-list-name{font-size:1.3em;vertical-align:top;width:32%;line-height:58px;height:52px;padding:0 0.4em;color:white;border-bottom:2px solid #674172;box-shadow:inset 0 -2px #674172;}.destroy{width:18%;}div.instructions{clear:both;background-color:#913d88;color:white;font-size:1.1em;}div.instructions p{padding:0.5em;line-height:1.5em;-webkit-transition:all 0.2s ease-in;transition:all 0.2s ease-in;}div.instructions p.editMode{background-color:#263849;}.pushdown{-webkit-transform:translateX(0.3em) translateY(0.3em);-ms-transform:translateX(0.3em) translateY(0.3em);transform:translateX(0.3em) translateY(0.3em);}.highlight{background-color:#ffff00;}li.inactive{background-color:#e5e3d7;color:rgba(0, 0, 0, 0.3);}.emerald-flat-button[disabled]{opacity:0.8;cursor:help;}button{outline:none;font-size:1em;}body:after{content:'mobile';display:none;}@media all and (min-width: 32em){#input-list-name{font-size:1.3em;}.boxes-container li{font-size:1.4em;}textarea{font-size:2em;}button{width:auto;font-size:1.2em;}}@media all and (max-device-height: 28em) and (orientation: landscape){.boxes-container li{font-size:0.6em;}}@media all and (min-width: 66em){body:after{content:'wide-screen';display:none;}.lists-container li{font-size:1.5em;}}@media all and (min-width: 39em) and (orientation: landscape){body:after{content:'wide-screen';display:none;}}", ""]);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Reflux = __webpack_require__(10);

	var Actions = Reflux.createActions(
	  [
	    'listIndexEditMode',
	    'newList',
	    'home',
	    'saveList',
	    'showList',
	    'showListForEdit',
	    'cancelNewList',
	    'destroyList',
	    'toggleActive',
	    'shuffle',
	    'reset',
	    'navigate'
	  ]
	);

	module.exports = Actions;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Randomize array element order in-place.
	 * Using Fisher-Yates shuffle algorithm.
	 */

	module.exports = {

	  shuffleArray: function(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	  },

	  randomNum: function(max) {
	    return Math.floor(Math.random() * (max - 0));    
	  }  
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(10);
	var Store = __webpack_require__(4);
	var Actions = __webpack_require__(13);

	module.exports = React.createClass({displayName: "exports",

	  render: function() {
	    var style = this.props.editMode ? 'animated flipInX editMode' : ''
	    return (
	      React.createElement("li", {key: this.props.key, 
	          item: this.props.item, 
	          onClick: this.onSelectList, 
	          className: style + ' color1'}, this.props.item)
	    )
	  },

	  onSelectList: function() {
	    var listName = this.props.item;
	    if (this.props.editMode) {
	      Actions.showListForEdit(listName);
	      Actions.navigate('/show_edit');
	    } else { 
	      Actions.showList(listName);
	      Actions.navigate('/show');
	    }    
	  }
	});



/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(10);
	var Store = __webpack_require__(4);
	var RouteStore = __webpack_require__(5);
	var Actions = __webpack_require__(13);

	module.exports = React.createClass({displayName: "exports",

	  render: function() {
	    var style = this.props.editMode ? 'animated flipInX editMode' : ''
	    return (
	      React.createElement("div", {className: "new-list-form"}, 
	        React.createElement("input", {onChange: this.onNewListInputChange, 
	               onKeyUp: this.onNewListInputKeyUp, 
	               placeholder: "Enter new list name", 
	               autoFocus: true, 
	               ref: "listName", id: "input-list-name"}), 
	        React.createElement("button", {title: this.state.disabled ? 'name required':'', 
	                onClick: this.onNewListClick, 
	                disabled: this.state.disabled, 
	                ref: "btn", id: "btn-new", className: "emerald-flat-button"}, "New list")
	      )
	    )
	  },

	  onNewListClick: function() {
	    Actions.newList({ listName: this.refs.listName.getDOMNode().value });
	    Actions.navigate('/lists/new');
	  },

	  onNewListInputKeyUp: function(e) {
	    if (this.refs.listName.getDOMNode().value === '') return;
	    
	    var KEY_ENTER = 13
	    if (e.which === KEY_ENTER) {
	      this.onNewListClick();
	    }
	  },

	  onNewListInputChange: function(e) {
	    if (e.target.value.length === 0) {
	      this.setState({disabled: true });
	    } else {
	      this.setState({disabled: false});
	    }
	  },

	  getInitialState: function() {
	    return { disabled: true }
	  }  
	});



/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(20).$

	module.exports = (function() { 
	  var init = function(maxcolumns) {

	    var items = Array.prototype.slice.call( document.querySelectorAll( '.boxes-container > li' ) )
	    var rows = Math.ceil( items.length / maxcolumns );
	    var columns = maxcolumns;
	    
	    items.forEach( function( el, i ) {
	      el.style.position = 'absolute';

	      var elpos = items.indexOf( el ),
	        current_row = Math.floor( elpos / maxcolumns ),
	        current_column = elpos - current_row * maxcolumns,
	        width =  100 / columns,
	        height = 100 / rows;

	      if( current_row < rows && current_column < columns ) {
	        el.style.width = width + .1 + '%';
	        el.style.height = height + .1 + '%';
	        el.style.left = width * ( current_column ) + '%';
	        el.style.top = height * ( current_row ) + '%';

	        $(el).removeClass('gt-hidden');
	        $(el).addClass('gt-visible')
	      }
	      else {
	        $(el).removeClass('gt-visible');
	        $(el).addClass('gt-hidden')
	      }
	    } );

	  }

	  return { init: init }
	})();

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(10);
	var Store = __webpack_require__(4);
	var RouteStore = __webpack_require__(5);
	var Actions = __webpack_require__(13);


	module.exports = React.createClass({displayName: "exports",
	  render: function() {
	    var activeClass = this.props.item.active ? '' : 'inactive';
	    return (
	      React.createElement("li", {key: this.props.key, 
	          item: this.props.item, 
	          onClick: this.toggleActive, 
	          className: 'color1 ' + activeClass}, this.props.item.name)
	    )
	  },

	  toggleActive: function() {
	    Actions.toggleActive(this.props.item);
	  }   

	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* Zepto v1.1.3 - zepto event ajax form ie - zeptojs.com/license */


	var Zepto = (function() {
	  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
	    document = window.document,
	    elementDisplay = {}, classCache = {},
	    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
	    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	    rootNodeRE = /^(?:body|html)$/i,
	    capitalRE = /([A-Z])/g,

	    // special attributes that should be get/set via method calls
	    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

	    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
	    table = document.createElement('table'),
	    tableRow = document.createElement('tr'),
	    containers = {
	      'tr': document.createElement('tbody'),
	      'tbody': table, 'thead': table, 'tfoot': table,
	      'td': tableRow, 'th': tableRow,
	      '*': document.createElement('div')
	    },
	    readyRE = /complete|loaded|interactive/,
	    simpleSelectorRE = /^[\w-]*$/,
	    class2type = {},
	    toString = class2type.toString,
	    zepto = {},
	    camelize, uniq,
	    tempParent = document.createElement('div'),
	    propMap = {
	      'tabindex': 'tabIndex',
	      'readonly': 'readOnly',
	      'for': 'htmlFor',
	      'class': 'className',
	      'maxlength': 'maxLength',
	      'cellspacing': 'cellSpacing',
	      'cellpadding': 'cellPadding',
	      'rowspan': 'rowSpan',
	      'colspan': 'colSpan',
	      'usemap': 'useMap',
	      'frameborder': 'frameBorder',
	      'contenteditable': 'contentEditable'
	    },
	    isArray = Array.isArray ||
	      function(object){ return object instanceof Array }

	  zepto.matches = function(element, selector) {
	    if (!selector || !element || element.nodeType !== 1) return false
	    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
	                          element.oMatchesSelector || element.matchesSelector
	    if (matchesSelector) return matchesSelector.call(element, selector)
	    // fall back to performing a selector:
	    var match, parent = element.parentNode, temp = !parent
	    if (temp) (parent = tempParent).appendChild(element)
	    match = ~zepto.qsa(parent, selector).indexOf(element)
	    temp && tempParent.removeChild(element)
	    return match
	  }

	  function type(obj) {
	    return obj == null ? String(obj) :
	      class2type[toString.call(obj)] || "object"
	  }

	  function isFunction(value) { return type(value) == "function" }
	  function isWindow(obj)     { return obj != null && obj == obj.window }
	  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	  function isObject(obj)     { return type(obj) == "object" }
	  function isPlainObject(obj) {
	    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	  }
	  function likeArray(obj) { return typeof obj.length == 'number' }

	  function compact(array) { return filter.call(array, function(item){ return item != null }) }
	  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
	  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
	  function dasherize(str) {
	    return str.replace(/::/g, '/')
	           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	           .replace(/_/g, '-')
	           .toLowerCase()
	  }
	  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

	  function classRE(name) {
	    return name in classCache ?
	      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
	  }

	  function maybeAddPx(name, value) {
	    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	  }

	  function defaultDisplay(nodeName) {
	    var element, display
	    if (!elementDisplay[nodeName]) {
	      element = document.createElement(nodeName)
	      document.body.appendChild(element)
	      display = getComputedStyle(element, '').getPropertyValue("display")
	      element.parentNode.removeChild(element)
	      display == "none" && (display = "block")
	      elementDisplay[nodeName] = display
	    }
	    return elementDisplay[nodeName]
	  }

	  function children(element) {
	    return 'children' in element ?
	      slice.call(element.children) :
	      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
	  }

	  // `$.zepto.fragment` takes a html string and an optional tag name
	  // to generate DOM nodes nodes from the given html string.
	  // The generated DOM nodes are returned as an array.
	  // This function can be overriden in plugins for example to make
	  // it compatible with browsers that don't support the DOM fully.
	  zepto.fragment = function(html, name, properties) {
	    var dom, nodes, container

	    // A special case optimization for a single tag
	    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

	    if (!dom) {
	      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
	      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
	      if (!(name in containers)) name = '*'

	      container = containers[name]
	      container.innerHTML = '' + html
	      dom = $.each(slice.call(container.childNodes), function(){
	        container.removeChild(this)
	      })
	    }

	    if (isPlainObject(properties)) {
	      nodes = $(dom)
	      $.each(properties, function(key, value) {
	        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
	        else nodes.attr(key, value)
	      })
	    }

	    return dom
	  }

	  // `$.zepto.Z` swaps out the prototype of the given `dom` array
	  // of nodes with `$.fn` and thus supplying all the Zepto functions
	  // to the array. Note that `__proto__` is not supported on Internet
	  // Explorer. This method can be overriden in plugins.
	  zepto.Z = function(dom, selector) {
	    dom = dom || []
	    dom.__proto__ = $.fn
	    dom.selector = selector || ''
	    return dom
	  }

	  // `$.zepto.isZ` should return `true` if the given object is a Zepto
	  // collection. This method can be overriden in plugins.
	  zepto.isZ = function(object) {
	    return object instanceof zepto.Z
	  }

	  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	  // takes a CSS selector and an optional context (and handles various
	  // special cases).
	  // This method can be overriden in plugins.
	  zepto.init = function(selector, context) {
	    var dom
	    // If nothing given, return an empty Zepto collection
	    if (!selector) return zepto.Z()
	    // Optimize for string selectors
	    else if (typeof selector == 'string') {
	      selector = selector.trim()
	      // If it's a html fragment, create nodes from it
	      // Note: In both Chrome 21 and Firefox 15, DOM error 12
	      // is thrown if the fragment doesn't begin with <
	      if (selector[0] == '<' && fragmentRE.test(selector))
	        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // If it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	    }
	    // If a function is given, call it when the DOM is ready
	    else if (isFunction(selector)) return $(document).ready(selector)
	    // If a Zepto collection is given, just return it
	    else if (zepto.isZ(selector)) return selector
	    else {
	      // normalize array if an array of nodes is given
	      if (isArray(selector)) dom = compact(selector)
	      // Wrap DOM nodes.
	      else if (isObject(selector))
	        dom = [selector], selector = null
	      // If it's a html fragment, create nodes from it
	      else if (fragmentRE.test(selector))
	        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // And last but no least, if it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	    }
	    // create a new Zepto collection from the nodes found
	    return zepto.Z(dom, selector)
	  }

	  // `$` will be the base `Zepto` object. When calling this
	  // function just call `$.zepto.init, which makes the implementation
	  // details of selecting nodes and creating Zepto collections
	  // patchable in plugins.
	  $ = function(selector, context){
	    return zepto.init(selector, context)
	  }

	  function extend(target, source, deep) {
	    for (key in source)
	      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
	          target[key] = {}
	        if (isArray(source[key]) && !isArray(target[key]))
	          target[key] = []
	        extend(target[key], source[key], deep)
	      }
	      else if (source[key] !== undefined) target[key] = source[key]
	  }

	  // Copy all but undefined properties from one or more
	  // objects to the `target` object.
	  $.extend = function(target){
	    var deep, args = slice.call(arguments, 1)
	    if (typeof target == 'boolean') {
	      deep = target
	      target = args.shift()
	    }
	    args.forEach(function(arg){ extend(target, arg, deep) })
	    return target
	  }

	  // `$.zepto.qsa` is Zepto's CSS selector implementation which
	  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	  // This method can be overriden in plugins.
	  zepto.qsa = function(element, selector){
	    var found,
	        maybeID = selector[0] == '#',
	        maybeClass = !maybeID && selector[0] == '.',
	        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
	        isSimple = simpleSelectorRE.test(nameOnly)
	    return (isDocument(element) && isSimple && maybeID) ?
	      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
	      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
	      slice.call(
	        isSimple && !maybeID ?
	          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	          element.getElementsByTagName(selector) : // Or a tag
	          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	      )
	  }

	  function filtered(nodes, selector) {
	    return selector == null ? $(nodes) : $(nodes).filter(selector)
	  }

	  $.contains = function(parent, node) {
	    return parent !== node && parent.contains(node)
	  }

	  function funcArg(context, arg, idx, payload) {
	    return isFunction(arg) ? arg.call(context, idx, payload) : arg
	  }

	  function setAttribute(node, name, value) {
	    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
	  }

	  // access className property while respecting SVGAnimatedString
	  function className(node, value){
	    var klass = node.className,
	        svg   = klass && klass.baseVal !== undefined

	    if (value === undefined) return svg ? klass.baseVal : klass
	    svg ? (klass.baseVal = value) : (node.className = value)
	  }

	  // "true"  => true
	  // "false" => false
	  // "null"  => null
	  // "42"    => 42
	  // "42.5"  => 42.5
	  // "08"    => "08"
	  // JSON    => parse if valid
	  // String  => self
	  function deserializeValue(value) {
	    var num
	    try {
	      return value ?
	        value == "true" ||
	        ( value == "false" ? false :
	          value == "null" ? null :
	          !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
	          /^[\[\{]/.test(value) ? $.parseJSON(value) :
	          value )
	        : value
	    } catch(e) {
	      return value
	    }
	  }

	  $.type = type
	  $.isFunction = isFunction
	  $.isWindow = isWindow
	  $.isArray = isArray
	  $.isPlainObject = isPlainObject

	  $.isEmptyObject = function(obj) {
	    var name
	    for (name in obj) return false
	    return true
	  }

	  $.inArray = function(elem, array, i){
	    return emptyArray.indexOf.call(array, elem, i)
	  }

	  $.camelCase = camelize
	  $.trim = function(str) {
	    return str == null ? "" : String.prototype.trim.call(str)
	  }

	  // plugin compatibility
	  $.uuid = 0
	  $.support = { }
	  $.expr = { }

	  $.map = function(elements, callback){
	    var value, values = [], i, key
	    if (likeArray(elements))
	      for (i = 0; i < elements.length; i++) {
	        value = callback(elements[i], i)
	        if (value != null) values.push(value)
	      }
	    else
	      for (key in elements) {
	        value = callback(elements[key], key)
	        if (value != null) values.push(value)
	      }
	    return flatten(values)
	  }

	  $.each = function(elements, callback){
	    var i, key
	    if (likeArray(elements)) {
	      for (i = 0; i < elements.length; i++)
	        if (callback.call(elements[i], i, elements[i]) === false) return elements
	    } else {
	      for (key in elements)
	        if (callback.call(elements[key], key, elements[key]) === false) return elements
	    }

	    return elements
	  }

	  $.grep = function(elements, callback){
	    return filter.call(elements, callback)
	  }

	  if (window.JSON) $.parseJSON = JSON.parse

	  // Populate the class2type map
	  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	    class2type[ "[object " + name + "]" ] = name.toLowerCase()
	  })

	  // Define methods that will be available on all
	  // Zepto collections
	  $.fn = {
	    // Because a collection acts like an array
	    // copy over these useful array functions.
	    forEach: emptyArray.forEach,
	    reduce: emptyArray.reduce,
	    push: emptyArray.push,
	    sort: emptyArray.sort,
	    indexOf: emptyArray.indexOf,
	    concat: emptyArray.concat,

	    // `map` and `slice` in the jQuery API work differently
	    // from their array counterparts
	    map: function(fn){
	      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
	    },
	    slice: function(){
	      return $(slice.apply(this, arguments))
	    },

	    ready: function(callback){
	      // need to check if document.body exists for IE as that browser reports
	      // document ready when it hasn't yet created the body element
	      if (readyRE.test(document.readyState) && document.body) callback($)
	      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
	      return this
	    },
	    get: function(idx){
	      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
	    },
	    toArray: function(){ return this.get() },
	    size: function(){
	      return this.length
	    },
	    remove: function(){
	      return this.each(function(){
	        if (this.parentNode != null)
	          this.parentNode.removeChild(this)
	      })
	    },
	    each: function(callback){
	      emptyArray.every.call(this, function(el, idx){
	        return callback.call(el, idx, el) !== false
	      })
	      return this
	    },
	    filter: function(selector){
	      if (isFunction(selector)) return this.not(this.not(selector))
	      return $(filter.call(this, function(element){
	        return zepto.matches(element, selector)
	      }))
	    },
	    add: function(selector,context){
	      return $(uniq(this.concat($(selector,context))))
	    },
	    is: function(selector){
	      return this.length > 0 && zepto.matches(this[0], selector)
	    },
	    not: function(selector){
	      var nodes=[]
	      if (isFunction(selector) && selector.call !== undefined)
	        this.each(function(idx){
	          if (!selector.call(this,idx)) nodes.push(this)
	        })
	      else {
	        var excludes = typeof selector == 'string' ? this.filter(selector) :
	          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
	        this.forEach(function(el){
	          if (excludes.indexOf(el) < 0) nodes.push(el)
	        })
	      }
	      return $(nodes)
	    },
	    has: function(selector){
	      return this.filter(function(){
	        return isObject(selector) ?
	          $.contains(this, selector) :
	          $(this).find(selector).size()
	      })
	    },
	    eq: function(idx){
	      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
	    },
	    first: function(){
	      var el = this[0]
	      return el && !isObject(el) ? el : $(el)
	    },
	    last: function(){
	      var el = this[this.length - 1]
	      return el && !isObject(el) ? el : $(el)
	    },
	    find: function(selector){
	      var result, $this = this
	      if (typeof selector == 'object')
	        result = $(selector).filter(function(){
	          var node = this
	          return emptyArray.some.call($this, function(parent){
	            return $.contains(parent, node)
	          })
	        })
	      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
	      else result = this.map(function(){ return zepto.qsa(this, selector) })
	      return result
	    },
	    closest: function(selector, context){
	      var node = this[0], collection = false
	      if (typeof selector == 'object') collection = $(selector)
	      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
	        node = node !== context && !isDocument(node) && node.parentNode
	      return $(node)
	    },
	    parents: function(selector){
	      var ancestors = [], nodes = this
	      while (nodes.length > 0)
	        nodes = $.map(nodes, function(node){
	          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
	            ancestors.push(node)
	            return node
	          }
	        })
	      return filtered(ancestors, selector)
	    },
	    parent: function(selector){
	      return filtered(uniq(this.pluck('parentNode')), selector)
	    },
	    children: function(selector){
	      return filtered(this.map(function(){ return children(this) }), selector)
	    },
	    contents: function() {
	      return this.map(function() { return slice.call(this.childNodes) })
	    },
	    siblings: function(selector){
	      return filtered(this.map(function(i, el){
	        return filter.call(children(el.parentNode), function(child){ return child!==el })
	      }), selector)
	    },
	    empty: function(){
	      return this.each(function(){ this.innerHTML = '' })
	    },
	    // `pluck` is borrowed from Prototype.js
	    pluck: function(property){
	      return $.map(this, function(el){ return el[property] })
	    },
	    show: function(){
	      return this.each(function(){
	        this.style.display == "none" && (this.style.display = '')
	        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
	          this.style.display = defaultDisplay(this.nodeName)
	      })
	    },
	    replaceWith: function(newContent){
	      return this.before(newContent).remove()
	    },
	    wrap: function(structure){
	      var func = isFunction(structure)
	      if (this[0] && !func)
	        var dom   = $(structure).get(0),
	            clone = dom.parentNode || this.length > 1

	      return this.each(function(index){
	        $(this).wrapAll(
	          func ? structure.call(this, index) :
	            clone ? dom.cloneNode(true) : dom
	        )
	      })
	    },
	    wrapAll: function(structure){
	      if (this[0]) {
	        $(this[0]).before(structure = $(structure))
	        var children
	        // drill down to the inmost element
	        while ((children = structure.children()).length) structure = children.first()
	        $(structure).append(this)
	      }
	      return this
	    },
	    wrapInner: function(structure){
	      var func = isFunction(structure)
	      return this.each(function(index){
	        var self = $(this), contents = self.contents(),
	            dom  = func ? structure.call(this, index) : structure
	        contents.length ? contents.wrapAll(dom) : self.append(dom)
	      })
	    },
	    unwrap: function(){
	      this.parent().each(function(){
	        $(this).replaceWith($(this).children())
	      })
	      return this
	    },
	    clone: function(){
	      return this.map(function(){ return this.cloneNode(true) })
	    },
	    hide: function(){
	      return this.css("display", "none")
	    },
	    toggle: function(setting){
	      return this.each(function(){
	        var el = $(this)
	        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
	      })
	    },
	    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
	    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
	    html: function(html){
	      return arguments.length === 0 ?
	        (this.length > 0 ? this[0].innerHTML : null) :
	        this.each(function(idx){
	          var originHtml = this.innerHTML
	          $(this).empty().append( funcArg(this, html, idx, originHtml) )
	        })
	    },
	    text: function(text){
	      return arguments.length === 0 ?
	        (this.length > 0 ? this[0].textContent : null) :
	        this.each(function(){ this.textContent = (text === undefined) ? '' : ''+text })
	    },
	    attr: function(name, value){
	      var result
	      return (typeof name == 'string' && value === undefined) ?
	        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
	          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
	          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	        ) :
	        this.each(function(idx){
	          if (this.nodeType !== 1) return
	          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
	          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
	        })
	    },
	    removeAttr: function(name){
	      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
	    },
	    prop: function(name, value){
	      name = propMap[name] || name
	      return (value === undefined) ?
	        (this[0] && this[0][name]) :
	        this.each(function(idx){
	          this[name] = funcArg(this, value, idx, this[name])
	        })
	    },
	    data: function(name, value){
	      var data = this.attr('data-' + name.replace(capitalRE, '-$1').toLowerCase(), value)
	      return data !== null ? deserializeValue(data) : undefined
	    },
	    val: function(value){
	      return arguments.length === 0 ?
	        (this[0] && (this[0].multiple ?
	           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
	           this[0].value)
	        ) :
	        this.each(function(idx){
	          this.value = funcArg(this, value, idx, this.value)
	        })
	    },
	    offset: function(coordinates){
	      if (coordinates) return this.each(function(index){
	        var $this = $(this),
	            coords = funcArg(this, coordinates, index, $this.offset()),
	            parentOffset = $this.offsetParent().offset(),
	            props = {
	              top:  coords.top  - parentOffset.top,
	              left: coords.left - parentOffset.left
	            }

	        if ($this.css('position') == 'static') props['position'] = 'relative'
	        $this.css(props)
	      })
	      if (this.length==0) return null
	      var obj = this[0].getBoundingClientRect()
	      return {
	        left: obj.left + window.pageXOffset,
	        top: obj.top + window.pageYOffset,
	        width: Math.round(obj.width),
	        height: Math.round(obj.height)
	      }
	    },
	    css: function(property, value){
	      if (arguments.length < 2) {
	        var element = this[0], computedStyle = getComputedStyle(element, '')
	        if(!element) return
	        if (typeof property == 'string')
	          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
	        else if (isArray(property)) {
	          var props = {}
	          $.each(isArray(property) ? property: [property], function(_, prop){
	            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
	          })
	          return props
	        }
	      }

	      var css = ''
	      if (type(property) == 'string') {
	        if (!value && value !== 0)
	          this.each(function(){ this.style.removeProperty(dasherize(property)) })
	        else
	          css = dasherize(property) + ":" + maybeAddPx(property, value)
	      } else {
	        for (key in property)
	          if (!property[key] && property[key] !== 0)
	            this.each(function(){ this.style.removeProperty(dasherize(key)) })
	          else
	            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
	      }

	      return this.each(function(){ this.style.cssText += ';' + css })
	    },
	    index: function(element){
	      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
	    },
	    hasClass: function(name){
	      if (!name) return false
	      return emptyArray.some.call(this, function(el){
	        return this.test(className(el))
	      }, classRE(name))
	    },
	    addClass: function(name){
	      if (!name) return this
	      return this.each(function(idx){
	        classList = []
	        var cls = className(this), newName = funcArg(this, name, idx, cls)
	        newName.split(/\s+/g).forEach(function(klass){
	          if (!$(this).hasClass(klass)) classList.push(klass)
	        }, this)
	        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
	      })
	    },
	    removeClass: function(name){
	      return this.each(function(idx){
	        if (name === undefined) return className(this, '')
	        classList = className(this)
	        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
	          classList = classList.replace(classRE(klass), " ")
	        })
	        className(this, classList.trim())
	      })
	    },
	    toggleClass: function(name, when){
	      if (!name) return this
	      return this.each(function(idx){
	        var $this = $(this), names = funcArg(this, name, idx, className(this))
	        names.split(/\s+/g).forEach(function(klass){
	          (when === undefined ? !$this.hasClass(klass) : when) ?
	            $this.addClass(klass) : $this.removeClass(klass)
	        })
	      })
	    },
	    scrollTop: function(value){
	      if (!this.length) return
	      var hasScrollTop = 'scrollTop' in this[0]
	      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
	      return this.each(hasScrollTop ?
	        function(){ this.scrollTop = value } :
	        function(){ this.scrollTo(this.scrollX, value) })
	    },
	    scrollLeft: function(value){
	      if (!this.length) return
	      var hasScrollLeft = 'scrollLeft' in this[0]
	      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
	      return this.each(hasScrollLeft ?
	        function(){ this.scrollLeft = value } :
	        function(){ this.scrollTo(value, this.scrollY) })
	    },
	    position: function() {
	      if (!this.length) return

	      var elem = this[0],
	        // Get *real* offsetParent
	        offsetParent = this.offsetParent(),
	        // Get correct offsets
	        offset       = this.offset(),
	        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

	      // Subtract element margins
	      // note: when an element has margin: auto the offsetLeft and marginLeft
	      // are the same in Safari causing offset.left to incorrectly be 0
	      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
	      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

	      // Add offsetParent borders
	      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
	      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

	      // Subtract the two offsets
	      return {
	        top:  offset.top  - parentOffset.top,
	        left: offset.left - parentOffset.left
	      }
	    },
	    offsetParent: function() {
	      return this.map(function(){
	        var parent = this.offsetParent || document.body
	        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
	          parent = parent.offsetParent
	        return parent
	      })
	    }
	  }

	  // for now
	  $.fn.detach = $.fn.remove

	  // Generate the `width` and `height` functions
	  ;['width', 'height'].forEach(function(dimension){
	    var dimensionProperty =
	      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

	    $.fn[dimension] = function(value){
	      var offset, el = this[0]
	      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
	        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
	        (offset = this.offset()) && offset[dimension]
	      else return this.each(function(idx){
	        el = $(this)
	        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
	      })
	    }
	  })

	  function traverseNode(node, fun) {
	    fun(node)
	    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
	  }

	  // Generate the `after`, `prepend`, `before`, `append`,
	  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	  adjacencyOperators.forEach(function(operator, operatorIndex) {
	    var inside = operatorIndex % 2 //=> prepend, append

	    $.fn[operator] = function(){
	      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	      var argType, nodes = $.map(arguments, function(arg) {
	            argType = type(arg)
	            return argType == "object" || argType == "array" || arg == null ?
	              arg : zepto.fragment(arg)
	          }),
	          parent, copyByClone = this.length > 1
	      if (nodes.length < 1) return this

	      return this.each(function(_, target){
	        parent = inside ? target : target.parentNode

	        // convert all methods to a "before" operation
	        target = operatorIndex == 0 ? target.nextSibling :
	                 operatorIndex == 1 ? target.firstChild :
	                 operatorIndex == 2 ? target :
	                 null

	        nodes.forEach(function(node){
	          if (copyByClone) node = node.cloneNode(true)
	          else if (!parent) return $(node).remove()

	          traverseNode(parent.insertBefore(node, target), function(el){
	            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
	               (!el.type || el.type === 'text/javascript') && !el.src)
	              window['eval'].call(window, el.innerHTML)
	          })
	        })
	      })
	    }

	    // after    => insertAfter
	    // prepend  => prependTo
	    // before   => insertBefore
	    // append   => appendTo
	    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
	      $(html)[operator](this)
	      return this
	    }
	  })

	  zepto.Z.prototype = $.fn

	  // Export internal API functions in the `$.zepto` namespace
	  zepto.uniq = uniq
	  zepto.deserializeValue = deserializeValue
	  $.zepto = zepto

	  return $
	})()

	exports.$ = exports.Zepto = Zepto;

	;(function($){
	  var _zid = 1, undefined,
	      slice = Array.prototype.slice,
	      isFunction = $.isFunction,
	      isString = function(obj){ return typeof obj == 'string' },
	      handlers = {},
	      specialEvents={},
	      focusinSupported = 'onfocusin' in window,
	      focus = { focus: 'focusin', blur: 'focusout' },
	      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

	  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

	  function zid(element) {
	    return element._zid || (element._zid = _zid++)
	  }
	  function findHandlers(element, event, fn, selector) {
	    event = parse(event)
	    if (event.ns) var matcher = matcherFor(event.ns)
	    return (handlers[zid(element)] || []).filter(function(handler) {
	      return handler
	        && (!event.e  || handler.e == event.e)
	        && (!event.ns || matcher.test(handler.ns))
	        && (!fn       || zid(handler.fn) === zid(fn))
	        && (!selector || handler.sel == selector)
	    })
	  }
	  function parse(event) {
	    var parts = ('' + event).split('.')
	    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
	  }
	  function matcherFor(ns) {
	    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
	  }

	  function eventCapture(handler, captureSetting) {
	    return handler.del &&
	      (!focusinSupported && (handler.e in focus)) ||
	      !!captureSetting
	  }

	  function realEvent(type) {
	    return hover[type] || (focusinSupported && focus[type]) || type
	  }

	  function add(element, events, fn, data, selector, delegator, capture){
	    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
	    events.split(/\s/).forEach(function(event){
	      if (event == 'ready') return $(document).ready(fn)
	      var handler   = parse(event)
	      handler.fn    = fn
	      handler.sel   = selector
	      // emulate mouseenter, mouseleave
	      if (handler.e in hover) fn = function(e){
	        var related = e.relatedTarget
	        if (!related || (related !== this && !$.contains(this, related)))
	          return handler.fn.apply(this, arguments)
	      }
	      handler.del   = delegator
	      var callback  = delegator || fn
	      handler.proxy = function(e){
	        e = compatible(e)
	        if (e.isImmediatePropagationStopped()) return
	        e.data = data
	        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
	        if (result === false) e.preventDefault(), e.stopPropagation()
	        return result
	      }
	      handler.i = set.length
	      set.push(handler)
	      if ('addEventListener' in element)
	        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	    })
	  }
	  function remove(element, events, fn, selector, capture){
	    var id = zid(element)
	    ;(events || '').split(/\s/).forEach(function(event){
	      findHandlers(element, event, fn, selector).forEach(function(handler){
	        delete handlers[id][handler.i]
	      if ('removeEventListener' in element)
	        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	      })
	    })
	  }

	  $.event = { add: add, remove: remove }

	  $.proxy = function(fn, context) {
	    if (isFunction(fn)) {
	      var proxyFn = function(){ return fn.apply(context, arguments) }
	      proxyFn._zid = zid(fn)
	      return proxyFn
	    } else if (isString(context)) {
	      return $.proxy(fn[context], fn)
	    } else {
	      throw new TypeError("expected function")
	    }
	  }

	  $.fn.bind = function(event, data, callback){
	    return this.on(event, data, callback)
	  }
	  $.fn.unbind = function(event, callback){
	    return this.off(event, callback)
	  }
	  $.fn.one = function(event, selector, data, callback){
	    return this.on(event, selector, data, callback, 1)
	  }

	  var returnTrue = function(){return true},
	      returnFalse = function(){return false},
	      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
	      eventMethods = {
	        preventDefault: 'isDefaultPrevented',
	        stopImmediatePropagation: 'isImmediatePropagationStopped',
	        stopPropagation: 'isPropagationStopped'
	      }

	  function compatible(event, source) {
	    if (source || !event.isDefaultPrevented) {
	      source || (source = event)

	      $.each(eventMethods, function(name, predicate) {
	        var sourceMethod = source[name]
	        event[name] = function(){
	          this[predicate] = returnTrue
	          return sourceMethod && sourceMethod.apply(source, arguments)
	        }
	        event[predicate] = returnFalse
	      })

	      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
	          'returnValue' in source ? source.returnValue === false :
	          source.getPreventDefault && source.getPreventDefault())
	        event.isDefaultPrevented = returnTrue
	    }
	    return event
	  }

	  function createProxy(event) {
	    var key, proxy = { originalEvent: event }
	    for (key in event)
	      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

	    return compatible(proxy, event)
	  }

	  $.fn.delegate = function(selector, event, callback){
	    return this.on(event, selector, callback)
	  }
	  $.fn.undelegate = function(selector, event, callback){
	    return this.off(event, selector, callback)
	  }

	  $.fn.live = function(event, callback){
	    $(document.body).delegate(this.selector, event, callback)
	    return this
	  }
	  $.fn.die = function(event, callback){
	    $(document.body).undelegate(this.selector, event, callback)
	    return this
	  }

	  $.fn.on = function(event, selector, data, callback, one){
	    var autoRemove, delegator, $this = this
	    if (event && !isString(event)) {
	      $.each(event, function(type, fn){
	        $this.on(type, selector, data, fn, one)
	      })
	      return $this
	    }

	    if (!isString(selector) && !isFunction(callback) && callback !== false)
	      callback = data, data = selector, selector = undefined
	    if (isFunction(data) || data === false)
	      callback = data, data = undefined

	    if (callback === false) callback = returnFalse

	    return $this.each(function(_, element){
	      if (one) autoRemove = function(e){
	        remove(element, e.type, callback)
	        return callback.apply(this, arguments)
	      }

	      if (selector) delegator = function(e){
	        var evt, match = $(e.target).closest(selector, element).get(0)
	        if (match && match !== element) {
	          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
	          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
	        }
	      }

	      add(element, event, callback, data, selector, delegator || autoRemove)
	    })
	  }
	  $.fn.off = function(event, selector, callback){
	    var $this = this
	    if (event && !isString(event)) {
	      $.each(event, function(type, fn){
	        $this.off(type, selector, fn)
	      })
	      return $this
	    }

	    if (!isString(selector) && !isFunction(callback) && callback !== false)
	      callback = selector, selector = undefined

	    if (callback === false) callback = returnFalse

	    return $this.each(function(){
	      remove(this, event, callback, selector)
	    })
	  }

	  $.fn.trigger = function(event, args){
	    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
	    event._args = args
	    return this.each(function(){
	      // items in the collection might not be DOM elements
	      if('dispatchEvent' in this) this.dispatchEvent(event)
	      else $(this).triggerHandler(event, args)
	    })
	  }

	  // triggers event handlers on current element just as if an event occurred,
	  // doesn't trigger an actual event, doesn't bubble
	  $.fn.triggerHandler = function(event, args){
	    var e, result
	    this.each(function(i, element){
	      e = createProxy(isString(event) ? $.Event(event) : event)
	      e._args = args
	      e.target = element
	      $.each(findHandlers(element, event.type || event), function(i, handler){
	        result = handler.proxy(e)
	        if (e.isImmediatePropagationStopped()) return false
	      })
	    })
	    return result
	  }

	  // shortcut methods for `.bind(event, fn)` for each event type
	  ;('focusin focusout load resize scroll unload click dblclick '+
	  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
	  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
	    $.fn[event] = function(callback) {
	      return callback ?
	        this.bind(event, callback) :
	        this.trigger(event)
	    }
	  })

	  ;['focus', 'blur'].forEach(function(name) {
	    $.fn[name] = function(callback) {
	      if (callback) this.bind(name, callback)
	      else this.each(function(){
	        try { this[name]() }
	        catch(e) {}
	      })
	      return this
	    }
	  })

	  $.Event = function(type, props) {
	    if (!isString(type)) props = type, type = props.type
	    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
	    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
	    event.initEvent(type, bubbles, true)
	    return compatible(event)
	  }

	})(Zepto)

	;(function($){
	  var jsonpID = 0,
	      document = window.document,
	      key,
	      name,
	      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	      scriptTypeRE = /^(?:text|application)\/javascript/i,
	      xmlTypeRE = /^(?:text|application)\/xml/i,
	      jsonType = 'application/json',
	      htmlType = 'text/html',
	      blankRE = /^\s*$/

	  // trigger a custom event and return false if it was cancelled
	  function triggerAndReturn(context, eventName, data) {
	    var event = $.Event(eventName)
	    $(context).trigger(event, data)
	    return !event.isDefaultPrevented()
	  }

	  // trigger an Ajax "global" event
	  function triggerGlobal(settings, context, eventName, data) {
	    if (settings.global) return triggerAndReturn(context || document, eventName, data)
	  }

	  // Number of active Ajax requests
	  $.active = 0

	  function ajaxStart(settings) {
	    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
	  }
	  function ajaxStop(settings) {
	    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
	  }

	  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	  function ajaxBeforeSend(xhr, settings) {
	    var context = settings.context
	    if (settings.beforeSend.call(context, xhr, settings) === false ||
	        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
	      return false

	    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
	  }
	  function ajaxSuccess(data, xhr, settings, deferred) {
	    var context = settings.context, status = 'success'
	    settings.success.call(context, data, status, xhr)
	    if (deferred) deferred.resolveWith(context, [data, status, xhr])
	    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
	    ajaxComplete(status, xhr, settings)
	  }
	  // type: "timeout", "error", "abort", "parsererror"
	  function ajaxError(error, type, xhr, settings, deferred) {
	    var context = settings.context
	    settings.error.call(context, xhr, type, error)
	    if (deferred) deferred.rejectWith(context, [xhr, type, error])
	    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
	    ajaxComplete(type, xhr, settings)
	  }
	  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	  function ajaxComplete(status, xhr, settings) {
	    var context = settings.context
	    settings.complete.call(context, xhr, status)
	    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
	    ajaxStop(settings)
	  }

	  // Empty function, used as default callback
	  function empty() {}

	  $.ajaxJSONP = function(options, deferred){
	    if (!('type' in options)) return $.ajax(options)

	    var _callbackName = options.jsonpCallback,
	      callbackName = ($.isFunction(_callbackName) ?
	        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
	      script = document.createElement('script'),
	      originalCallback = window[callbackName],
	      responseData,
	      abort = function(errorType) {
	        $(script).triggerHandler('error', errorType || 'abort')
	      },
	      xhr = { abort: abort }, abortTimeout

	    if (deferred) deferred.promise(xhr)

	    $(script).on('load error', function(e, errorType){
	      clearTimeout(abortTimeout)
	      $(script).off().remove()

	      if (e.type == 'error' || !responseData) {
	        ajaxError(null, errorType || 'error', xhr, options, deferred)
	      } else {
	        ajaxSuccess(responseData[0], xhr, options, deferred)
	      }

	      window[callbackName] = originalCallback
	      if (responseData && $.isFunction(originalCallback))
	        originalCallback(responseData[0])

	      originalCallback = responseData = undefined
	    })

	    if (ajaxBeforeSend(xhr, options) === false) {
	      abort('abort')
	      return xhr
	    }

	    window[callbackName] = function(){
	      responseData = arguments
	    }

	    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
	    document.head.appendChild(script)

	    if (options.timeout > 0) abortTimeout = setTimeout(function(){
	      abort('timeout')
	    }, options.timeout)

	    return xhr
	  }

	  $.ajaxSettings = {
	    // Default type of request
	    type: 'GET',
	    // Callback that is executed before request
	    beforeSend: empty,
	    // Callback that is executed if the request succeeds
	    success: empty,
	    // Callback that is executed the the server drops error
	    error: empty,
	    // Callback that is executed on request complete (both: error and success)
	    complete: empty,
	    // The context for the callbacks
	    context: null,
	    // Whether to trigger "global" Ajax events
	    global: true,
	    // Transport
	    xhr: function () {
	      return new window.XMLHttpRequest()
	    },
	    // MIME types mapping
	    // IIS returns Javascript as "application/x-javascript"
	    accepts: {
	      script: 'text/javascript, application/javascript, application/x-javascript',
	      json:   jsonType,
	      xml:    'application/xml, text/xml',
	      html:   htmlType,
	      text:   'text/plain'
	    },
	    // Whether the request is to another domain
	    crossDomain: false,
	    // Default timeout
	    timeout: 0,
	    // Whether data should be serialized to string
	    processData: true,
	    // Whether the browser should be allowed to cache GET responses
	    cache: true
	  }

	  function mimeToDataType(mime) {
	    if (mime) mime = mime.split(';', 2)[0]
	    return mime && ( mime == htmlType ? 'html' :
	      mime == jsonType ? 'json' :
	      scriptTypeRE.test(mime) ? 'script' :
	      xmlTypeRE.test(mime) && 'xml' ) || 'text'
	  }

	  function appendQuery(url, query) {
	    if (query == '') return url
	    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
	  }

	  // serialize payload and append it to the URL for GET requests
	  function serializeData(options) {
	    if (options.processData && options.data && $.type(options.data) != "string")
	      options.data = $.param(options.data, options.traditional)
	    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
	      options.url = appendQuery(options.url, options.data), options.data = undefined
	  }

	  $.ajax = function(options){
	    var settings = $.extend({}, options || {}),
	        deferred = $.Deferred && $.Deferred()
	    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

	    ajaxStart(settings)

	    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
	      RegExp.$2 != window.location.host

	    if (!settings.url) settings.url = window.location.toString()
	    serializeData(settings)
	    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

	    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
	    if (dataType == 'jsonp' || hasPlaceholder) {
	      if (!hasPlaceholder)
	        settings.url = appendQuery(settings.url,
	          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
	      return $.ajaxJSONP(settings, deferred)
	    }

	    var mime = settings.accepts[dataType],
	        headers = { },
	        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
	        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	        xhr = settings.xhr(),
	        nativeSetHeader = xhr.setRequestHeader,
	        abortTimeout

	    if (deferred) deferred.promise(xhr)

	    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
	    setHeader('Accept', mime || '*/*')
	    if (mime = settings.mimeType || mime) {
	      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
	      xhr.overrideMimeType && xhr.overrideMimeType(mime)
	    }
	    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
	      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

	    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
	    xhr.setRequestHeader = setHeader

	    xhr.onreadystatechange = function(){
	      if (xhr.readyState == 4) {
	        xhr.onreadystatechange = empty
	        clearTimeout(abortTimeout)
	        var result, error = false
	        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
	          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
	          result = xhr.responseText

	          try {
	            // http://perfectionkills.com/global-eval-what-are-the-options/
	            if (dataType == 'script')    (1,eval)(result)
	            else if (dataType == 'xml')  result = xhr.responseXML
	            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
	          } catch (e) { error = e }

	          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
	          else ajaxSuccess(result, xhr, settings, deferred)
	        } else {
	          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
	        }
	      }
	    }

	    if (ajaxBeforeSend(xhr, settings) === false) {
	      xhr.abort()
	      ajaxError(null, 'abort', xhr, settings, deferred)
	      return xhr
	    }

	    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

	    var async = 'async' in settings ? settings.async : true
	    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

	    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

	    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
	        xhr.onreadystatechange = empty
	        xhr.abort()
	        ajaxError(null, 'timeout', xhr, settings, deferred)
	      }, settings.timeout)

	    // avoid sending empty string (#319)
	    xhr.send(settings.data ? settings.data : null)
	    return xhr
	  }

	  // handle optional data/success arguments
	  function parseArguments(url, data, success, dataType) {
	    if ($.isFunction(data)) dataType = success, success = data, data = undefined
	    if (!$.isFunction(success)) dataType = success, success = undefined
	    return {
	      url: url
	    , data: data
	    , success: success
	    , dataType: dataType
	    }
	  }

	  $.get = function(/* url, data, success, dataType */){
	    return $.ajax(parseArguments.apply(null, arguments))
	  }

	  $.post = function(/* url, data, success, dataType */){
	    var options = parseArguments.apply(null, arguments)
	    options.type = 'POST'
	    return $.ajax(options)
	  }

	  $.getJSON = function(/* url, data, success */){
	    var options = parseArguments.apply(null, arguments)
	    options.dataType = 'json'
	    return $.ajax(options)
	  }

	  $.fn.load = function(url, data, success){
	    if (!this.length) return this
	    var self = this, parts = url.split(/\s/), selector,
	        options = parseArguments(url, data, success),
	        callback = options.success
	    if (parts.length > 1) options.url = parts[0], selector = parts[1]
	    options.success = function(response){
	      self.html(selector ?
	        $('<div>').html(response.replace(rscript, "")).find(selector)
	        : response)
	      callback && callback.apply(self, arguments)
	    }
	    $.ajax(options)
	    return this
	  }

	  var escape = encodeURIComponent

	  function serialize(params, obj, traditional, scope){
	    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
	    $.each(obj, function(key, value) {
	      type = $.type(value)
	      if (scope) key = traditional ? scope :
	        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
	      // handle data in serializeArray() format
	      if (!scope && array) params.add(value.name, value.value)
	      // recurse into nested objects
	      else if (type == "array" || (!traditional && type == "object"))
	        serialize(params, value, traditional, key)
	      else params.add(key, value)
	    })
	  }

	  $.param = function(obj, traditional){
	    var params = []
	    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
	    serialize(params, obj, traditional)
	    return params.join('&').replace(/%20/g, '+')
	  }
	})(Zepto)

	;(function($){
	  $.fn.serializeArray = function() {
	    var result = [], el
	    $([].slice.call(this.get(0).elements)).each(function(){
	      el = $(this)
	      var type = el.attr('type')
	      if (this.nodeName.toLowerCase() != 'fieldset' &&
	        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
	        ((type != 'radio' && type != 'checkbox') || this.checked))
	        result.push({
	          name: el.attr('name'),
	          value: el.val()
	        })
	    })
	    return result
	  }

	  $.fn.serialize = function(){
	    var result = []
	    this.serializeArray().forEach(function(elm){
	      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
	    })
	    return result.join('&')
	  }

	  $.fn.submit = function(callback) {
	    if (callback) this.bind('submit', callback)
	    else if (this.length) {
	      var event = $.Event('submit')
	      this.eq(0).trigger(event)
	      if (!event.isDefaultPrevented()) this.get(0).submit()
	    }
	    return this
	  }

	})(Zepto)

	;(function($){
	  // __proto__ doesn't exist on IE<11, so redefine
	  // the Z function to use object extension instead
	  if (!('__proto__' in {})) {
	    $.extend($.zepto, {
	      Z: function(dom, selector){
	        dom = dom || []
	        $.extend(dom, $.fn)
	        dom.selector = selector || ''
	        dom.__Z = true
	        return dom
	      },
	      // this is a kludge but works
	      isZ: function(object){
	        return $.type(object) === 'array' && '__Z' in object
	      }
	    })
	  }

	  // getComputedStyle shouldn't freak out when called
	  // without a valid element as argument
	  try {
	    getComputedStyle(undefined)
	  } catch(e) {
	    var nativeGetComputedStyle = getComputedStyle;
	    window.getComputedStyle = function(element){
	      try {
	        return nativeGetComputedStyle(element)
	      } catch(e) {
	        return null
	      }
	    }
	  }
	})(Zepto)

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	exports.ActionMethods = __webpack_require__(23);

	exports.ListenerMethods = __webpack_require__(24);

	exports.PublisherMethods = __webpack_require__(25);

	exports.StoreMethods = __webpack_require__(26);

	exports.createAction = __webpack_require__(27);

	exports.createStore = __webpack_require__(28);

	exports.connect = __webpack_require__(29);

	exports.ListenerMixin = __webpack_require__(30);

	exports.listenTo = __webpack_require__(31);

	exports.listenToMany = __webpack_require__(32);


	var maker = __webpack_require__(33).staticJoinCreator;

	exports.joinTrailing = exports.all = maker("last"); // Reflux.all alias for backward compatibility

	exports.joinLeading = maker("first");

	exports.joinStrict = maker("strict");

	exports.joinConcat = maker("all");

	var _ = __webpack_require__(34);

	/**
	 * Convenience function for creating a set of actions
	 *
	 * @param definitions the definitions for the actions to be created
	 * @returns an object with actions of corresponding action names
	 */
	exports.createActions = function(definitions) {
	    var actions = {};
	    for (var k in definitions){
	        var val = definitions[k],
	            actionName = _.isObject(val) ? k : val;

	        actions[actionName] = exports.createAction(val);
	    }
	    return actions;
	};

	/**
	 * Sets the eventmitter that Reflux uses
	 */
	exports.setEventEmitter = function(ctx) {
	    var _ = __webpack_require__(34);
	    _.EventEmitter = ctx;
	};


	/**
	 * Sets the Promise library that Reflux uses
	 */
	exports.setPromise = function(ctx) {
	    var _ = __webpack_require__(34);
	    _.Promise = ctx;
	};

	/**
	 * Sets the Promise factory that creates new promises
	 * @param {Function} factory has the signature `function(resolver) { return [new Promise]; }`
	 */
	exports.setPromiseFactory = function(factory) {
	    var _ = __webpack_require__(34);
	    _.createPromise = factory;
	};


	/**
	 * Sets the method used for deferring actions and stores
	 */
	exports.nextTick = function(nextTick) {
	    var _ = __webpack_require__(34);
	    _.nextTick = nextTick;
	};

	/**
	 * Provides the set of created actions and stores for introspection
	 */
	exports.__keep = __webpack_require__(35);

	/**
	 * Warn if Function.prototype.bind not available
	 */
	if (!Function.prototype.bind) {
	  console.error(
	    'Function.prototype.bind not available. ' +
	    'ES5 shim required. ' +
	    'https://github.com/spoike/refluxjs#es5'
	  );
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A module of methods that you want to include in all actions.
	 * This module is consumed by `createAction`.
	 */
	module.exports = {
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(34),
	    maker = __webpack_require__(33).instanceJoinCreator;

	/**
	 * Extract child listenables from a parent from their
	 * children property and return them in a keyed Object
	 *
	 * @param {Object} listenable The parent listenable
	 */
	var mapChildListenables = function(listenable) {
	    var i = 0, children = {}, childName;
	    for (;i < (listenable.children||[]).length; ++i) {
	        childName = listenable.children[i];
	        if(listenable[childName]){
	            children[childName] = listenable[childName];
	        }
	    }
	    return children;
	};

	/**
	 * Make a flat dictionary of all listenables including their
	 * possible children (recursively), concatenating names in camelCase.
	 *
	 * @param {Object} listenables The top-level listenables
	 */
	var flattenListenables = function(listenables) {
	    var flattened = {};
	    for(var key in listenables){
	        var listenable = listenables[key];
	        var childMap = mapChildListenables(listenable);

	        // recursively flatten children
	        var children = flattenListenables(childMap);

	        // add the primary listenable and chilren
	        flattened[key] = listenable;
	        for(var childKey in children){
	            var childListenable = children[childKey];
	            flattened[key + _.capitalize(childKey)] = childListenable;
	        }
	    }

	    return flattened;
	};

	/**
	 * A module of methods related to listening.
	 */
	module.exports = {

	    /**
	     * An internal utility function used by `validateListening`
	     *
	     * @param {Action|Store} listenable The listenable we want to search for
	     * @returns {Boolean} The result of a recursive search among `this.subscriptions`
	     */
	    hasListener: function(listenable) {
	        var i = 0, j, listener, listenables;
	        for (;i < (this.subscriptions||[]).length; ++i) {
	            listenables = [].concat(this.subscriptions[i].listenable);
	            for (j = 0; j < listenables.length; j++){
	                listener = listenables[j];
	                if (listener === listenable || listener.hasListener && listener.hasListener(listenable)) {
	                    return true;
	                }
	            }
	        }
	        return false;
	    },

	    /**
	     * A convenience method that listens to all listenables in the given object.
	     *
	     * @param {Object} listenables An object of listenables. Keys will be used as callback method names.
	     */
	    listenToMany: function(listenables){
	        var allListenables = flattenListenables(listenables);
	        for(var key in allListenables){
	            var cbname = _.callbackName(key),
	                localname = this[cbname] ? cbname : this[key] ? key : undefined;
	            if (localname){
	                this.listenTo(allListenables[key],localname,this[cbname+"Default"]||this[localname+"Default"]||localname);
	            }
	        }
	    },

	    /**
	     * Checks if the current context can listen to the supplied listenable
	     *
	     * @param {Action|Store} listenable An Action or Store that should be
	     *  listened to.
	     * @returns {String|Undefined} An error message, or undefined if there was no problem.
	     */
	    validateListening: function(listenable){
	        if (listenable === this) {
	            return "Listener is not able to listen to itself";
	        }
	        if (!_.isFunction(listenable.listen)) {
	            return listenable + " is missing a listen method";
	        }
	        if (listenable.hasListener && listenable.hasListener(this)) {
	            return "Listener cannot listen to this listenable because of circular loop";
	        }
	    },

	    /**
	     * Sets up a subscription to the given listenable for the context object
	     *
	     * @param {Action|Store} listenable An Action or Store that should be
	     *  listened to.
	     * @param {Function|String} callback The callback to register as event handler
	     * @param {Function|String} defaultCallback The callback to register as default handler
	     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is the object being listened to
	     */
	    listenTo: function(listenable, callback, defaultCallback) {
	        var desub, unsubscriber, subscriptionobj, subs = this.subscriptions = this.subscriptions || [];
	        _.throwIf(this.validateListening(listenable));
	        this.fetchInitialState(listenable, defaultCallback);
	        desub = listenable.listen(this[callback]||callback, this);
	        unsubscriber = function() {
	            var index = subs.indexOf(subscriptionobj);
	            _.throwIf(index === -1,'Tried to remove listen already gone from subscriptions list!');
	            subs.splice(index, 1);
	            desub();
	        };
	        subscriptionobj = {
	            stop: unsubscriber,
	            listenable: listenable
	        };
	        subs.push(subscriptionobj);
	        return subscriptionobj;
	    },

	    /**
	     * Stops listening to a single listenable
	     *
	     * @param {Action|Store} listenable The action or store we no longer want to listen to
	     * @returns {Boolean} True if a subscription was found and removed, otherwise false.
	     */
	    stopListeningTo: function(listenable){
	        var sub, i = 0, subs = this.subscriptions || [];
	        for(;i < subs.length; i++){
	            sub = subs[i];
	            if (sub.listenable === listenable){
	                sub.stop();
	                _.throwIf(subs.indexOf(sub)!==-1,'Failed to remove listen from subscriptions list!');
	                return true;
	            }
	        }
	        return false;
	    },

	    /**
	     * Stops all subscriptions and empties subscriptions array
	     */
	    stopListeningToAll: function(){
	        var remaining, subs = this.subscriptions || [];
	        while((remaining=subs.length)){
	            subs[0].stop();
	            _.throwIf(subs.length!==remaining-1,'Failed to remove listen from subscriptions list!');
	        }
	    },

	    /**
	     * Used in `listenTo`. Fetches initial data from a publisher if it has a `getInitialState` method.
	     * @param {Action|Store} listenable The publisher we want to get initial state from
	     * @param {Function|String} defaultCallback The method to receive the data
	     */
	    fetchInitialState: function (listenable, defaultCallback) {
	        defaultCallback = (defaultCallback && this[defaultCallback]) || defaultCallback;
	        var me = this;
	        if (_.isFunction(defaultCallback) && _.isFunction(listenable.getInitialState)) {
	            var data = listenable.getInitialState();
	            if (data && _.isFunction(data.then)) {
	                data.then(function() {
	                    defaultCallback.apply(me, arguments);
	                });
	            } else {
	                defaultCallback.call(this, data);
	            }
	        }
	    },

	    /**
	     * The callback will be called once all listenables have triggered at least once.
	     * It will be invoked with the last emission from each listenable.
	     * @param {...Publishers} publishers Publishers that should be tracked.
	     * @param {Function|String} callback The method to call when all publishers have emitted
	     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
	     */
	    joinTrailing: maker("last"),

	    /**
	     * The callback will be called once all listenables have triggered at least once.
	     * It will be invoked with the first emission from each listenable.
	     * @param {...Publishers} publishers Publishers that should be tracked.
	     * @param {Function|String} callback The method to call when all publishers have emitted
	     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
	     */
	    joinLeading: maker("first"),

	    /**
	     * The callback will be called once all listenables have triggered at least once.
	     * It will be invoked with all emission from each listenable.
	     * @param {...Publishers} publishers Publishers that should be tracked.
	     * @param {Function|String} callback The method to call when all publishers have emitted
	     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
	     */
	    joinConcat: maker("all"),

	    /**
	     * The callback will be called once all listenables have triggered.
	     * If a callback triggers twice before that happens, an error is thrown.
	     * @param {...Publishers} publishers Publishers that should be tracked.
	     * @param {Function|String} callback The method to call when all publishers have emitted
	     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
	     */
	    joinStrict: maker("strict")
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(34);

	/**
	 * A module of methods for object that you want to be able to listen to.
	 * This module is consumed by `createStore` and `createAction`
	 */
	module.exports = {

	    /**
	     * Hook used by the publisher that is invoked before emitting
	     * and before `shouldEmit`. The arguments are the ones that the action
	     * is invoked with. If this function returns something other than
	     * undefined, that will be passed on as arguments for shouldEmit and
	     * emission.
	     */
	    preEmit: function() {},

	    /**
	     * Hook used by the publisher after `preEmit` to determine if the
	     * event should be emitted with given arguments. This may be overridden
	     * in your application, default implementation always returns true.
	     *
	     * @returns {Boolean} true if event should be emitted
	     */
	    shouldEmit: function() { return true; },

	    /**
	     * Subscribes the given callback for action triggered
	     *
	     * @param {Function} callback The callback to register as event handler
	     * @param {Mixed} [optional] bindContext The context to bind the callback with
	     * @returns {Function} Callback that unsubscribes the registered event handler
	     */
	    listen: function(callback, bindContext) {
	        bindContext = bindContext || this;
	        var eventHandler = function(args) {
	            callback.apply(bindContext, args);
	        }, me = this;
	        this.emitter.addListener(this.eventLabel, eventHandler);
	        return function() {
	            me.emitter.removeListener(me.eventLabel, eventHandler);
	        };
	    },

	    /**
	     * Attach handlers to promise that trigger the completed and failed
	     * child publishers, if available.
	     *
	     * @param {Object} The promise to attach to
	     */
	    promise: function(promise) {
	        var me = this;

	        var canHandlePromise =
	            this.children.indexOf('completed') >= 0 &&
	            this.children.indexOf('failed') >= 0;

	        if (!canHandlePromise){
	            throw new Error('Publisher must have "completed" and "failed" child publishers');
	        }

	        promise.then(function(response) {
	            return me.completed(response);
	        });
	        // IE compatibility - catch is a reserved word - without bracket notation source compilation will fail under IE
	        promise["catch"](function(error) {
	            return me.failed(error);
	        });
	    },

	    /**
	     * Subscribes the given callback for action triggered, which should
	     * return a promise that in turn is passed to `this.promise`
	     *
	     * @param {Function} callback The callback to register as event handler
	     */
	    listenAndPromise: function(callback, bindContext) {
	        var me = this;
	        bindContext = bindContext || this;

	        return this.listen(function() {

	            if (!callback) {
	                throw new Error('Expected a function returning a promise but got ' + callback);
	            }

	            var args = arguments,
	                promise = callback.apply(bindContext, args);
	            return me.promise.call(me, promise);
	        }, bindContext);
	    },

	    /**
	     * Publishes an event using `this.emitter` (if `shouldEmit` agrees)
	     */
	    trigger: function() {
	        var args = arguments,
	            pre = this.preEmit.apply(this, args);
	        args = pre === undefined ? args : _.isArguments(pre) ? pre : [].concat(pre);
	        if (this.shouldEmit.apply(this, args)) {
	            this.emitter.emit(this.eventLabel, args);
	        }
	    },

	    /**
	     * Tries to publish the event on the next tick
	     */
	    triggerAsync: function(){
	        var args = arguments,me = this;
	        _.nextTick(function() {
	            me.trigger.apply(me, args);
	        });
	    },

	    /**
	     * Returns a Promise for the triggered action
	     */
	    triggerPromise: function(){
	        var me = this;
	        var args = arguments;

	        var canHandlePromise =
	            this.children.indexOf('completed') >= 0 &&
	            this.children.indexOf('failed') >= 0;

	        if (!canHandlePromise){
	            throw new Error('Publisher must have "completed" and "failed" child publishers');
	        }

	        var promise = _.createPromise(function(resolve, reject) {
	            var removeSuccess = me.completed.listen(function(args) {
	                removeSuccess();
	                removeFailed();
	                resolve(args);
	            });

	            var removeFailed = me.failed.listen(function(args) {
	                removeSuccess();
	                removeFailed();
	                reject(args);
	            });

	            me.triggerAsync.apply(me, args);
	        });

	        return promise;
	    },
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A module of methods that you want to include in all stores.
	 * This module is consumed by `createStore`.
	 */
	module.exports = {
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(34),
	    Reflux = __webpack_require__(21),
	    Keep = __webpack_require__(35),
	    allowed = {preEmit:1,shouldEmit:1};

	/**
	 * Creates an action functor object. It is mixed in with functions
	 * from the `PublisherMethods` mixin. `preEmit` and `shouldEmit` may
	 * be overridden in the definition object.
	 *
	 * @param {Object} definition The action object definition
	 */
	var createAction = function(definition) {

	    definition = definition || {};
	    if (!_.isObject(definition)){
	        definition = {actionName: definition};
	    }

	    for(var a in Reflux.ActionMethods){
	        if (!allowed[a] && Reflux.PublisherMethods[a]) {
	            throw new Error("Cannot override API method " + a +
	                " in Reflux.ActionMethods. Use another method name or override it on Reflux.PublisherMethods instead."
	            );
	        }
	    }

	    for(var d in definition){
	        if (!allowed[d] && Reflux.PublisherMethods[d]) {
	            throw new Error("Cannot override API method " + d +
	                " in action creation. Use another method name or override it on Reflux.PublisherMethods instead."
	            );
	        }
	    }

	    definition.children = definition.children || [];
	    if (definition.asyncResult){
	        definition.children = definition.children.concat(["completed","failed"]);
	    }

	    var i = 0, childActions = {};
	    for (; i < definition.children.length; i++) {
	        var name = definition.children[i];
	        childActions[name] = createAction(name);
	    }

	    var context = _.extend({
	        eventLabel: "action",
	        emitter: new _.EventEmitter(),
	        _isAction: true
	    }, Reflux.PublisherMethods, Reflux.ActionMethods, definition);

	    var functor = function() {
	        functor[functor.sync?"trigger":"triggerAsync"].apply(functor, arguments);
	    };

	    _.extend(functor,childActions,context);

	    Keep.createdActions.push(functor);

	    return functor;

	};

	module.exports = createAction;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(34),
	    Reflux = __webpack_require__(21),
	    Keep = __webpack_require__(35),
	    mixer = __webpack_require__(36),
	    allowed = {preEmit:1,shouldEmit:1},
	    bindMethods = __webpack_require__(37);

	/**
	 * Creates an event emitting Data Store. It is mixed in with functions
	 * from the `ListenerMethods` and `PublisherMethods` mixins. `preEmit`
	 * and `shouldEmit` may be overridden in the definition object.
	 *
	 * @param {Object} definition The data store object definition
	 * @returns {Store} A data store instance
	 */
	module.exports = function(definition) {

	    definition = definition || {};

	    for(var a in Reflux.StoreMethods){
	        if (!allowed[a] && (Reflux.PublisherMethods[a] || Reflux.ListenerMethods[a])){
	            throw new Error("Cannot override API method " + a +
	                " in Reflux.StoreMethods. Use another method name or override it on Reflux.PublisherMethods / Reflux.ListenerMethods instead."
	            );
	        }
	    }

	    for(var d in definition){
	        if (!allowed[d] && (Reflux.PublisherMethods[d] || Reflux.ListenerMethods[d])){
	            throw new Error("Cannot override API method " + d +
	                " in store creation. Use another method name or override it on Reflux.PublisherMethods / Reflux.ListenerMethods instead."
	            );
	        }
	    }

	    definition = mixer(definition);

	    function Store() {
	        var i=0, arr;
	        this.subscriptions = [];
	        this.emitter = new _.EventEmitter();
	        this.eventLabel = "change";
	        bindMethods(this, definition);
	        if (this.init && _.isFunction(this.init)) {
	            this.init();
	        }
	        if (this.listenables){
	            arr = [].concat(this.listenables);
	            for(;i < arr.length;i++){
	                this.listenToMany(arr[i]);
	            }
	        }
	    }

	    _.extend(Store.prototype, Reflux.ListenerMethods, Reflux.PublisherMethods, Reflux.StoreMethods, definition);

	    var store = new Store();
	    Keep.createdStores.push(store);

	    return store;
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var Reflux = __webpack_require__(21),
	    _ = __webpack_require__(34);

	module.exports = function(listenable,key){
	    return {
	        getInitialState: function(){
	            if (!_.isFunction(listenable.getInitialState)) {
	                return {};
	            } else if (key === undefined) {
	                return listenable.getInitialState();
	            } else {
	                return _.object([key],[listenable.getInitialState()]);
	            }
	        },
	        componentDidMount: function(){
	            _.extend(this,Reflux.ListenerMethods);
	            var me = this, cb = (key === undefined ? this.setState : function(v){me.setState(_.object([key],[v]));});
	            this.listenTo(listenable,cb);
	        },
	        componentWillUnmount: Reflux.ListenerMixin.componentWillUnmount
	    };
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(34),
	    ListenerMethods = __webpack_require__(24);

	/**
	 * A module meant to be consumed as a mixin by a React component. Supplies the methods from
	 * `ListenerMethods` mixin and takes care of teardown of subscriptions.
	 * Note that if you're using the `connect` mixin you don't need this mixin, as connect will
	 * import everything this mixin contains!
	 */
	module.exports = _.extend({

	    /**
	     * Cleans up all listener previously registered.
	     */
	    componentWillUnmount: ListenerMethods.stopListeningToAll

	}, ListenerMethods);


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Reflux = __webpack_require__(21);


	/**
	 * A mixin factory for a React component. Meant as a more convenient way of using the `ListenerMixin`,
	 * without having to manually set listeners in the `componentDidMount` method.
	 *
	 * @param {Action|Store} listenable An Action or Store that should be
	 *  listened to.
	 * @param {Function|String} callback The callback to register as event handler
	 * @param {Function|String} defaultCallback The callback to register as default handler
	 * @returns {Object} An object to be used as a mixin, which sets up the listener for the given listenable.
	 */
	module.exports = function(listenable,callback,initial){
	    return {
	        /**
	         * Set up the mixin before the initial rendering occurs. Import methods from `ListenerMethods`
	         * and then make the call to `listenTo` with the arguments provided to the factory function
	         */
	        componentDidMount: function() {
	            for(var m in Reflux.ListenerMethods){
	                if (this[m] !== Reflux.ListenerMethods[m]){
	                    if (this[m]){
	                        throw "Can't have other property '"+m+"' when using Reflux.listenTo!";
	                    }
	                    this[m] = Reflux.ListenerMethods[m];
	                }
	            }
	            this.listenTo(listenable,callback,initial);
	        },
	        /**
	         * Cleans up all listener previously registered.
	         */
	        componentWillUnmount: Reflux.ListenerMethods.stopListeningToAll
	    };
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var Reflux = __webpack_require__(21);

	/**
	 * A mixin factory for a React component. Meant as a more convenient way of using the `listenerMixin`,
	 * without having to manually set listeners in the `componentDidMount` method. This version is used
	 * to automatically set up a `listenToMany` call.
	 *
	 * @param {Object} listenables An object of listenables
	 * @returns {Object} An object to be used as a mixin, which sets up the listeners for the given listenables.
	 */
	module.exports = function(listenables){
	    return {
	        /**
	         * Set up the mixin before the initial rendering occurs. Import methods from `ListenerMethods`
	         * and then make the call to `listenTo` with the arguments provided to the factory function
	         */
	        componentDidMount: function() {
	            for(var m in Reflux.ListenerMethods){
	                if (this[m] !== Reflux.ListenerMethods[m]){
	                    if (this[m]){
	                        throw "Can't have other property '"+m+"' when using Reflux.listenToMany!";
	                    }
	                    this[m] = Reflux.ListenerMethods[m];
	                }
	            }
	            this.listenToMany(listenables);
	        },
	        /**
	         * Cleans up all listener previously registered.
	         */
	        componentWillUnmount: Reflux.ListenerMethods.stopListeningToAll
	    };
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Internal module used to create static and instance join methods
	 */

	var slice = Array.prototype.slice,
	    _ = __webpack_require__(34),
	    createStore = __webpack_require__(28),
	    strategyMethodNames = {
	        strict: "joinStrict",
	        first: "joinLeading",
	        last: "joinTrailing",
	        all: "joinConcat"
	    };

	/**
	 * Used in `index.js` to create the static join methods
	 * @param {String} strategy Which strategy to use when tracking listenable trigger arguments
	 * @returns {Function} A static function which returns a store with a join listen on the given listenables using the given strategy
	 */
	exports.staticJoinCreator = function(strategy){
	    return function(/* listenables... */) {
	        var listenables = slice.call(arguments);
	        return createStore({
	            init: function(){
	                this[strategyMethodNames[strategy]].apply(this,listenables.concat("triggerAsync"));
	            }
	        });
	    };
	};

	/**
	 * Used in `ListenerMethods.js` to create the instance join methods
	 * @param {String} strategy Which strategy to use when tracking listenable trigger arguments
	 * @returns {Function} An instance method which sets up a join listen on the given listenables using the given strategy
	 */
	exports.instanceJoinCreator = function(strategy){
	    return function(/* listenables..., callback*/){
	        _.throwIf(arguments.length < 3,'Cannot create a join with less than 2 listenables!');
	        var listenables = slice.call(arguments),
	            callback = listenables.pop(),
	            numberOfListenables = listenables.length,
	            join = {
	                numberOfListenables: numberOfListenables,
	                callback: this[callback]||callback,
	                listener: this,
	                strategy: strategy
	            }, i, cancels = [], subobj;
	        for (i = 0; i < numberOfListenables; i++) {
	            _.throwIf(this.validateListening(listenables[i]));
	        }
	        for (i = 0; i < numberOfListenables; i++) {
	            cancels.push(listenables[i].listen(newListener(i,join),this));
	        }
	        reset(join);
	        subobj = {listenable: listenables};
	        subobj.stop = makeStopper(subobj,cancels,this);
	        this.subscriptions = (this.subscriptions || []).concat(subobj);
	        return subobj;
	    };
	};

	// ---- internal join functions ----

	function makeStopper(subobj,cancels,context){
	    return function() {
	        var i, subs = context.subscriptions,
	            index = (subs ? subs.indexOf(subobj) : -1);
	        _.throwIf(index === -1,'Tried to remove join already gone from subscriptions list!');
	        for(i=0;i < cancels.length; i++){
	            cancels[i]();
	        }
	        subs.splice(index, 1);
	    };
	}

	function reset(join) {
	    join.listenablesEmitted = new Array(join.numberOfListenables);
	    join.args = new Array(join.numberOfListenables);
	}

	function newListener(i,join) {
	    return function() {
	        var callargs = slice.call(arguments);
	        if (join.listenablesEmitted[i]){
	            switch(join.strategy){
	                case "strict": throw new Error("Strict join failed because listener triggered twice.");
	                case "last": join.args[i] = callargs; break;
	                case "all": join.args[i].push(callargs);
	            }
	        } else {
	            join.listenablesEmitted[i] = true;
	            join.args[i] = (join.strategy==="all"?[callargs]:callargs);
	        }
	        emitIfAllListenablesEmitted(join);
	    };
	}

	function emitIfAllListenablesEmitted(join) {
	    for (var i = 0; i < join.numberOfListenables; i++) {
	        if (!join.listenablesEmitted[i]) {
	            return;
	        }
	    }
	    join.callback.apply(join.listener,join.args);
	    reset(join);
	}


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * isObject, extend, isFunction, isArguments are taken from undescore/lodash in
	 * order to remove the dependency
	 */
	var isObject = exports.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	};

	exports.extend = function(obj) {
	    if (!isObject(obj)) {
	        return obj;
	    }
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	        source = arguments[i];
	        for (prop in source) {
	            obj[prop] = source[prop];
	        }
	    }
	    return obj;
	};

	exports.isFunction = function(value) {
	    return typeof value === 'function';
	};

	exports.EventEmitter = __webpack_require__(38);

	exports.nextTick = function(callback) {
	    setTimeout(callback, 0);
	};

	exports.capitalize = function(string){
	    return string.charAt(0).toUpperCase()+string.slice(1);
	};

	exports.callbackName = function(string){
	    return "on"+exports.capitalize(string);
	};

	exports.object = function(keys,vals){
	    var o={}, i=0;
	    for(;i<keys.length;i++){
	        o[keys[i]] = vals[i];
	    }
	    return o;
	};

	exports.Promise = __webpack_require__(39);

	exports.createPromise = function(resolver) {
	    return new exports.Promise(resolver);
	};

	exports.isArguments = function(value) {
	    return typeof value === 'object' && ('callee' in value) && typeof value.length === 'number';
	};

	exports.throwIf = function(val,msg){
	    if (val){
	        throw Error(msg||val);
	    }
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	exports.createdStores = [];

	exports.createdActions = [];

	exports.reset = function() {
	    while(exports.createdStores.length) {
	        exports.createdStores.pop();
	    }
	    while(exports.createdActions.length) {
	        exports.createdActions.pop();
	    }
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(34);

	module.exports = function mix(def) {
	    var composed = {
	        init: [],
	        preEmit: [],
	        shouldEmit: []
	    };

	    var updated = (function mixDef(mixin) {
	        var mixed = {};
	        if (mixin.mixins) {
	            mixin.mixins.forEach(function (subMixin) {
	                _.extend(mixed, mixDef(subMixin));
	            });
	        }
	        _.extend(mixed, mixin);
	        Object.keys(composed).forEach(function (composable) {
	            if (mixin.hasOwnProperty(composable)) {
	                composed[composable].push(mixin[composable]);
	            }
	        });
	        return mixed;
	    }(def));

	    if (composed.init.length > 1) {
	        updated.init = function () {
	            var args = arguments;
	            composed.init.forEach(function (init) {
	                init.apply(this, args);
	            }, this);
	        };
	    }
	    if (composed.preEmit.length > 1) {
	        updated.preEmit = function () {
	            return composed.preEmit.reduce(function (args, preEmit) {
	                var newValue = preEmit.apply(this, args);
	                return newValue === undefined ? args : [newValue];
	            }.bind(this), arguments);
	        };
	    }
	    if (composed.shouldEmit.length > 1) {
	        updated.shouldEmit = function () {
	            var args = arguments;
	            return !composed.shouldEmit.some(function (shouldEmit) {
	                return !shouldEmit.apply(this, args);
	            }, this);
	        };
	    }
	    Object.keys(composed).forEach(function (composable) {
	        if (composed[composable].length === 1) {
	            updated[composable] = composed[composable][0];
	        }
	    });

	    return updated;
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(store, definition) {
	  for (var name in definition) {
	    var property = definition[name];

	    if (typeof property !== 'function' || !definition.hasOwnProperty(name)) {
	      continue;
	    }

	    store[name] = property.bind(store);
	  }

	  return store;
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} once Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }

	/**
	 * Holds the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;

	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event) {
	  if (!this._events || !this._events[event]) return [];
	  if (this._events[event].fn) return [this._events[event].fn];

	  for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
	    ee[i] = this._events[event][i].fn;
	  }

	  return ee;
	};

	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  if (!this._events || !this._events[event]) return false;

	  var listeners = this._events[event]
	    , len = arguments.length
	    , args
	    , i;

	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Functon} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this);

	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }

	  return this;
	};

	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true);

	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }

	  return this;
	};

	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, once) {
	  if (!this._events || !this._events[event]) return this;

	  var listeners = this._events[event]
	    , events = [];

	  if (fn) {
	    if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
	      events.push(listeners);
	    }
	    if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
	      if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
	        events.push(listeners[i]);
	      }
	    }
	  }

	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[event] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[event];
	  }

	  return this;
	};

	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;

	  if (event) delete this._events[event];
	  else this._events = {};

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};

	//
	// Expose the module.
	//
	EventEmitter.EventEmitter = EventEmitter;
	EventEmitter.EventEmitter2 = EventEmitter;
	EventEmitter.EventEmitter3 = EventEmitter;

	//
	// Expose the module.
	//
	module.exports = EventEmitter;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*! Native Promise Only
	    v0.7.6-a (c) Kyle Simpson
	    MIT License: http://getify.mit-license.org
	*/
	!function(t,n,e){n[t]=n[t]||e(),"undefined"!=typeof module&&module.exports?module.exports=n[t]:"function"=="function"&&__webpack_require__(40)&&!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return n[t]}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}("Promise","undefined"!=typeof global?global:this,function(){"use strict";function t(t,n){l.add(t,n),h||(h=y(l.drain))}function n(t){var n,e=typeof t;return null==t||"object"!=e&&"function"!=e||(n=t.then),"function"==typeof n?n:!1}function e(){for(var t=0;t<this.chain.length;t++)o(this,1===this.state?this.chain[t].success:this.chain[t].failure,this.chain[t]);this.chain.length=0}function o(t,e,o){var r,i;try{e===!1?o.reject(t.msg):(r=e===!0?t.msg:e.call(void 0,t.msg),r===o.promise?o.reject(TypeError("Promise-chain cycle")):(i=n(r))?i.call(r,o.resolve,o.reject):o.resolve(r))}catch(c){o.reject(c)}}function r(o){var c,u,a=this;if(!a.triggered){a.triggered=!0,a.def&&(a=a.def);try{(c=n(o))?(u=new f(a),c.call(o,function(){r.apply(u,arguments)},function(){i.apply(u,arguments)})):(a.msg=o,a.state=1,a.chain.length>0&&t(e,a))}catch(s){i.call(u||new f(a),s)}}}function i(n){var o=this;o.triggered||(o.triggered=!0,o.def&&(o=o.def),o.msg=n,o.state=2,o.chain.length>0&&t(e,o))}function c(t,n,e,o){for(var r=0;r<n.length;r++)!function(r){t.resolve(n[r]).then(function(t){e(r,t)},o)}(r)}function f(t){this.def=t,this.triggered=!1}function u(t){this.promise=t,this.state=0,this.triggered=!1,this.chain=[],this.msg=void 0}function a(n){if("function"!=typeof n)throw TypeError("Not a function");if(0!==this.__NPO__)throw TypeError("Not a promise");this.__NPO__=1;var o=new u(this);this.then=function(n,r){var i={success:"function"==typeof n?n:!0,failure:"function"==typeof r?r:!1};return i.promise=new this.constructor(function(t,n){if("function"!=typeof t||"function"!=typeof n)throw TypeError("Not a function");i.resolve=t,i.reject=n}),o.chain.push(i),0!==o.state&&t(e,o),i.promise},this["catch"]=function(t){return this.then(void 0,t)};try{n.call(void 0,function(t){r.call(o,t)},function(t){i.call(o,t)})}catch(c){i.call(o,c)}}var s,h,l,p=Object.prototype.toString,y="undefined"!=typeof setImmediate?function(t){return setImmediate(t)}:setTimeout;try{Object.defineProperty({},"x",{}),s=function(t,n,e,o){return Object.defineProperty(t,n,{value:e,writable:!0,configurable:o!==!1})}}catch(d){s=function(t,n,e){return t[n]=e,t}}l=function(){function t(t,n){this.fn=t,this.self=n,this.next=void 0}var n,e,o;return{add:function(r,i){o=new t(r,i),e?e.next=o:n=o,e=o,o=void 0},drain:function(){var t=n;for(n=e=h=void 0;t;)t.fn.call(t.self),t=t.next}}}();var g=s({},"constructor",a,!1);return s(a,"prototype",g,!1),s(g,"__NPO__",0,!1),s(a,"resolve",function(t){var n=this;return t&&"object"==typeof t&&1===t.__NPO__?t:new n(function(n,e){if("function"!=typeof n||"function"!=typeof e)throw TypeError("Not a function");n(t)})}),s(a,"reject",function(t){return new this(function(n,e){if("function"!=typeof n||"function"!=typeof e)throw TypeError("Not a function");e(t)})}),s(a,"all",function(t){var n=this;return"[object Array]"!=p.call(t)?n.reject(TypeError("Not an array")):0===t.length?n.resolve([]):new n(function(e,o){if("function"!=typeof e||"function"!=typeof o)throw TypeError("Not a function");var r=t.length,i=Array(r),f=0;c(n,t,function(t,n){i[t]=n,++f===r&&e(i)},o)})}),s(a,"race",function(t){var n=this;return"[object Array]"!=p.call(t)?n.reject(TypeError("Not an array")):new n(function(e,o){if("function"!=typeof e||"function"!=typeof o)throw TypeError("Not a function");c(n,t,function(t,n){e(n)},o)})}),a});
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(41).setImmediate))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var nextTick = __webpack_require__(42).nextTick;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	if (typeof setTimeout !== 'undefined') exports.setTimeout = function() { return setTimeout.apply(window, arguments); };
	if (typeof clearTimeout !== 'undefined') exports.clearTimeout = function() { clearTimeout.apply(window, arguments); };
	if (typeof setInterval !== 'undefined') exports.setInterval = function() { return setInterval.apply(window, arguments); };
	if (typeof clearInterval !== 'undefined') exports.clearInterval = function() { clearInterval.apply(window, arguments); };

	// TODO: Change to more efficient list approach used in Node.js
	// For now, we just implement the APIs using the primitives above.

	exports.enroll = function(item, delay) {
	  item._timeoutID = setTimeout(item._onTimeout, delay);
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._timeoutID);
	};

	exports.active = function(item) {
	  // our naive impl doesn't care (correctness is still preserved)
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = function(id) {
	  delete immediateIds[id];
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ])