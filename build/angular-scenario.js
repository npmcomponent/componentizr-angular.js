/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {'use strict';

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );

/**
 * @license AngularJS v1.2.0-7b3549b
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, document){
  var _jQuery = window.jQuery.noConflict(true);

/**
 * @description
 *
 * This object provides a utility for producing rich Error messages within
 * Angular. It can be called as follows:
 *
 * var exampleMinErr = minErr('example');
 * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
 *
 * The above creates an instance of minErr in the example namespace. The
 * resulting error will have a namespaced error code of example.one.  The
 * resulting error will replace {0} with the value of foo, and {1} with the
 * value of bar. The object is not restricted in the number of arguments it can
 * take.
 *
 * If fewer arguments are specified than necessary for interpolation, the extra
 * interpolation markers will be preserved in the final string.
 *
 * Since data will be parsed statically during a build step, some restrictions
 * are applied with respect to how minErr instances are created and called.
 * Instances should have names of the form namespaceMinErr for a minErr created
 * using minErr('namespace') . Error codes, namespaces and template strings
 * should all be static strings, not variables or general expressions.
 *
 * @param {string} module The namespace to use for the new minErr instance.
 * @returns {function(string, string, ...): Error} instance
 */

function minErr(module) {
  return function () {
    var code = arguments[0],
      prefix = '[' + (module ? module + ':' : '') + code + '] ',
      template = arguments[1],
      templateArgs = arguments,
      stringify = function (obj) {
        if (isFunction(obj)) {
          return obj.toString().replace(/ \{[\s\S]*$/, '');
        } else if (isUndefined(obj)) {
          return 'undefined';
        } else if (!isString(obj)) {
          return JSON.stringify(obj);
        }
        return obj;
      },
      message, i;

    message = prefix + template.replace(/\{\d+\}/g, function (match) {
      var index = +match.slice(1, -1), arg;

      if (index + 2 < templateArgs.length) {
        arg = templateArgs[index + 2];
        if (isFunction(arg)) {
          return arg.toString().replace(/ ?\{[\s\S]*$/, '');
        } else if (isUndefined(arg)) {
          return 'undefined';
        } else if (!isString(arg)) {
          return toJson(arg);
        }
        return arg;
      }
      return match;
    });

    message = message + '\nhttp://errors.angularjs.org/' + version.full + '/' +
      (module ? module + '/' : '') + code;
    for (i = 2; i < arguments.length; i++) {
      message = message + (i == 2 ? '?' : '&') + 'p' + (i-2) + '=' +
        encodeURIComponent(stringify(arguments[i]));
    }

    return new Error(message);
  };
}

////////////////////////////////////

/**
 * hasOwnProperty may be overwritten by a property of the same name, or entirely
 * absent from an object that does not inherit Object.prototype; this copy is
 * used instead
 */
var hasOwnPropertyFn = Object.prototype.hasOwnProperty;
var hasOwnPropertyLocal = function(obj, key) {
  return hasOwnPropertyFn.call(obj, key);
};

/**
 * @ngdoc function
 * @name angular.lowercase
 * @function
 *
 * @description Converts the specified string to lowercase.
 * @param {string} string String to be converted to lowercase.
 * @returns {string} Lowercased string.
 */
var lowercase = function(string){return isString(string) ? string.toLowerCase() : string;};


/**
 * @ngdoc function
 * @name angular.uppercase
 * @function
 *
 * @description Converts the specified string to uppercase.
 * @param {string} string String to be converted to uppercase.
 * @returns {string} Uppercased string.
 */
var uppercase = function(string){return isString(string) ? string.toUpperCase() : string;};


var manualLowercase = function(s) {
  return isString(s)
      ? s.replace(/[A-Z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) | 32);})
      : s;
};
var manualUppercase = function(s) {
  return isString(s)
      ? s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);})
      : s;
};


// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
// with correct but slower alternatives.
if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}


var /** holds major version number for IE or NaN for real browsers */
    msie,
    jqLite,           // delay binding since jQuery could be loaded after us.
    jQuery,           // delay binding
    slice             = [].slice,
    push              = [].push,
    toString          = Object.prototype.toString,
    ngMinErr          = minErr('ng'),


    _angular          = window.angular,
    /** @name angular */
    angular           = window.angular || (window.angular = {}),
    angularModule,
    nodeName_,
    uid               = ['0', '0', '0'];

/**
 * IE 11 changed the format of the UserAgent string.
 * See http://msdn.microsoft.com/en-us/library/ms537503.aspx
 */
msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
if (isNaN(msie)) {
  msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
}


/**
 * @private
 * @param {*} obj
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments, ...)
 */
function isArrayLike(obj) {
  if (obj == null || isWindow(obj)) {
    return false;
  }
  
  var length = obj.length;

  if (obj.nodeType === 1 && length) {
    return true;
  }

  return isArray(obj) || !isFunction(obj) && (
    length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj
  );
}

/**
 * @ngdoc function
 * @name angular.forEach
 * @function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
 * object or an array. The `iterator` function is invoked with `iterator(value, key)`, where `value`
 * is the value of an object property or an array element and `key` is the object property key or
 * array element index. Specifying a `context` for the function is optional.
 *
 * Note: this function was previously known as `angular.foreach`.
 *
   <pre>
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key){
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender:male']);
   </pre>
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {Function} iterator Iterator function.
 * @param {Object=} context Object to become context (`this`) for the iterator function.
 * @returns {Object|Array} Reference to `obj`.
 */
function forEach(obj, iterator, context) {
  var key;
  if (obj) {
    if (isFunction(obj)){
      for (key in obj) {
        if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context);
    } else if (isArrayLike(obj)) {
      for (key = 0; key < obj.length; key++)
        iterator.call(context, obj[key], key);
    } else {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    }
  }
  return obj;
}

function sortedKeys(obj) {
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys.sort();
}

function forEachSorted(obj, iterator, context) {
  var keys = sortedKeys(obj);
  for ( var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}


/**
 * when using forEach the params are value, key, but it is often useful to have key, value.
 * @param {function(string, *)} iteratorFn
 * @returns {function(*, string)}
 */
function reverseParams(iteratorFn) {
  return function(value, key) { iteratorFn(key, value) };
}

/**
 * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
 * characters such as '012ABC'. The reason why we are not using simply a number counter is that
 * the number string gets longer over time, and it can also overflow, where as the nextId
 * will grow much slower, it is a string, and it will never overflow.
 *
 * @returns an unique alpha-numeric string
 */
function nextUid() {
  var index = uid.length;
  var digit;

  while(index) {
    index--;
    digit = uid[index].charCodeAt(0);
    if (digit == 57 /*'9'*/) {
      uid[index] = 'A';
      return uid.join('');
    }
    if (digit == 90  /*'Z'*/) {
      uid[index] = '0';
    } else {
      uid[index] = String.fromCharCode(digit + 1);
      return uid.join('');
    }
  }
  uid.unshift('0');
  return uid.join('');
}


/**
 * Set or clear the hashkey for an object.
 * @param obj object
 * @param h the hashkey (!truthy to delete the hashkey)
 */
function setHashKey(obj, h) {
  if (h) {
    obj.$$hashKey = h;
  }
  else {
    delete obj.$$hashKey;
  }
}

/**
 * @ngdoc function
 * @name angular.extend
 * @function
 *
 * @description
 * Extends the destination object `dst` by copying all of the properties from the `src` object(s)
 * to `dst`. You can specify multiple `src` objects.
 *
 * @param {Object} dst Destination object.
 * @param {...Object} src Source object(s).
 * @returns {Object} Reference to `dst`.
 */
function extend(dst) {
  var h = dst.$$hashKey;
  forEach(arguments, function(obj){
    if (obj !== dst) {
      forEach(obj, function(value, key){
        dst[key] = value;
      });
    }
  });

  setHashKey(dst,h);
  return dst;
}

function int(str) {
  return parseInt(str, 10);
}


function inherit(parent, extra) {
  return extend(new (extend(function() {}, {prototype:parent}))(), extra);
}

/**
 * @ngdoc function
 * @name angular.noop
 * @function
 *
 * @description
 * A function that performs no operations. This function can be useful when writing code in the
 * functional style.
   <pre>
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   </pre>
 */
function noop() {}
noop.$inject = [];


/**
 * @ngdoc function
 * @name angular.identity
 * @function
 *
 * @description
 * A function that returns its first argument. This function is useful when writing code in the
 * functional style.
 *
   <pre>
     function transformer(transformationFn, value) {
       return (transformationFn || angular.identity)(value);
     };
   </pre>
 */
function identity($) {return $;}
identity.$inject = [];


function valueFn(value) {return function() {return value;};}

/**
 * @ngdoc function
 * @name angular.isUndefined
 * @function
 *
 * @description
 * Determines if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
function isUndefined(value){return typeof value == 'undefined';}


/**
 * @ngdoc function
 * @name angular.isDefined
 * @function
 *
 * @description
 * Determines if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
function isDefined(value){return typeof value != 'undefined';}


/**
 * @ngdoc function
 * @name angular.isObject
 * @function
 *
 * @description
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
function isObject(value){return value != null && typeof value == 'object';}


/**
 * @ngdoc function
 * @name angular.isString
 * @function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
function isString(value){return typeof value == 'string';}


/**
 * @ngdoc function
 * @name angular.isNumber
 * @function
 *
 * @description
 * Determines if a reference is a `Number`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
function isNumber(value){return typeof value == 'number';}


/**
 * @ngdoc function
 * @name angular.isDate
 * @function
 *
 * @description
 * Determines if a value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
function isDate(value){
  return toString.apply(value) == '[object Date]';
}


/**
 * @ngdoc function
 * @name angular.isArray
 * @function
 *
 * @description
 * Determines if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Array`.
 */
function isArray(value) {
  return toString.apply(value) == '[object Array]';
}


/**
 * @ngdoc function
 * @name angular.isFunction
 * @function
 *
 * @description
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
function isFunction(value){return typeof value == 'function';}


/**
 * Determines if a value is a regular expression object.
 *
 * @private
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `RegExp`.
 */
function isRegExp(value) {
  return toString.apply(value) == '[object RegExp]';
}


/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 */
function isWindow(obj) {
  return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}


function isScope(obj) {
  return obj && obj.$evalAsync && obj.$watch;
}


function isFile(obj) {
  return toString.apply(obj) === '[object File]';
}


function isBoolean(value) {
  return typeof value == 'boolean';
}


var trim = (function() {
  // native trim is way faster: http://jsperf.com/angular-trim-test
  // but IE doesn't have it... :-(
  // TODO: we should move this into IE/ES5 polyfill
  if (!String.prototype.trim) {
    return function(value) {
      return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value;
    };
  }
  return function(value) {
    return isString(value) ? value.trim() : value;
  };
})();


/**
 * @ngdoc function
 * @name angular.isElement
 * @function
 *
 * @description
 * Determines if a reference is a DOM element (or wrapped jQuery element).
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
 */
function isElement(node) {
  return node &&
    (node.nodeName  // we are a direct element
    || (node.on && node.find));  // we have an on and find method part of jQuery API
}

/**
 * @param str 'key1,key2,...'
 * @returns {object} in the form of {key1:true, key2:true, ...}
 */
function makeMap(str){
  var obj = {}, items = str.split(","), i;
  for ( i = 0; i < items.length; i++ )
    obj[ items[i] ] = true;
  return obj;
}


if (msie < 9) {
  nodeName_ = function(element) {
    element = element.nodeName ? element : element[0];
    return (element.scopeName && element.scopeName != 'HTML')
      ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
  };
} else {
  nodeName_ = function(element) {
    return element.nodeName ? element.nodeName : element[0].nodeName;
  };
}


function map(obj, iterator, context) {
  var results = [];
  forEach(obj, function(value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}


/**
 * @description
 * Determines the number of elements in an array, the number of properties an object has, or
 * the length of a string.
 *
 * Note: This function is used to augment the Object type in Angular expressions. See
 * {@link angular.Object} for more information about Angular arrays.
 *
 * @param {Object|Array|string} obj Object, array, or string to inspect.
 * @param {boolean} [ownPropsOnly=false] Count only "own" properties in an object
 * @returns {number} The size of `obj` or `0` if `obj` is neither an object nor an array.
 */
function size(obj, ownPropsOnly) {
  var size = 0, key;

  if (isArray(obj) || isString(obj)) {
    return obj.length;
  } else if (isObject(obj)){
    for (key in obj)
      if (!ownPropsOnly || obj.hasOwnProperty(key))
        size++;
  }

  return size;
}


function includes(array, obj) {
  return indexOf(array, obj) != -1;
}

function indexOf(array, obj) {
  if (array.indexOf) return array.indexOf(obj);

  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return i;
  }
  return -1;
}

function arrayRemove(array, value) {
  var index = indexOf(array, value);
  if (index >=0)
    array.splice(index, 1);
  return value;
}

function isLeafNode (node) {
  if (node) {
    switch (node.nodeName) {
    case "OPTION":
    case "PRE":
    case "TITLE":
      return true;
    }
  }
  return false;
}

/**
 * @ngdoc function
 * @name angular.copy
 * @function
 *
 * @description
 * Creates a deep copy of `source`, which should be an object or an array.
 *
 * * If no destination is supplied, a copy of the object or array is created.
 * * If a destination is provided, all of its elements (for array) or properties (for objects)
 *   are deleted and then all elements/properties from the source are copied to it.
 * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
 * * If `source` is identical to 'destination' an exception will be thrown. 
 *
 * Note: this function is used to augment the Object type in Angular expressions. See
 * {@link ng.$filter} for more information about Angular arrays.
 *
 * @param {*} source The source that will be used to make a copy.
 *                   Can be any type, including primitives, `null`, and `undefined`.
 * @param {(Object|Array)=} destination Destination into which the source is copied. If
 *     provided, must be of the same type as `source`.
 * @returns {*} The copy or updated `destination`, if `destination` was specified.
 */
function copy(source, destination){
  if (isWindow(source) || isScope(source)) {
    throw ngMinErr('cpws', "Can't copy! Making copies of Window or Scope instances is not supported.");
  }

  if (!destination) {
    destination = source;
    if (source) {
      if (isArray(source)) {
        destination = copy(source, []);
      } else if (isDate(source)) {
        destination = new Date(source.getTime());
      } else if (isRegExp(source)) {
        destination = new RegExp(source.source);
      } else if (isObject(source)) {
        destination = copy(source, {});
      }
    }
  } else {
    if (source === destination) throw ngMinErr('cpi', "Can't copy! Source and destination are identical.");
    if (isArray(source)) {
      destination.length = 0;
      for ( var i = 0; i < source.length; i++) {
        destination.push(copy(source[i]));
      }
    } else {
      var h = destination.$$hashKey;
      forEach(destination, function(value, key){
        delete destination[key];
      });
      for ( var key in source) {
        destination[key] = copy(source[key]);
      }
      setHashKey(destination,h);
    }
  }
  return destination;
}

/**
 * Create a shallow copy of an object
 */
function shallowCopy(src, dst) {
  dst = dst || {};

  for(var key in src) {
    if (src.hasOwnProperty(key) && key.substr(0, 2) !== '$$') {
      dst[key] = src[key];
    }
  }

  return dst;
}


/**
 * @ngdoc function
 * @name angular.equals
 * @function
 *
 * @description
 * Determines if two objects or two values are equivalent. Supports value types, regular expressions, arrays and
 * objects.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties pass `===` comparison.
 * * Both values are NaN. (In JavasScript, NaN == NaN => false. But we consider two NaN as equal)
 * * Both values represent the same regular expression (In JavasScript,
 *   /abc/ == /abc/ => false. But we consider two regular expressions as equal when their textual
 *   representation matches).
 *
 * During a property comparison, properties of `function` type and properties with names
 * that begin with `$` are ignored.
 *
 * Scope and DOMWindow objects are being compared only by identify (`===`).
 *
 * @param {*} o1 Object or value to compare.
 * @param {*} o2 Object or value to compare.
 * @returns {boolean} True if arguments are equal.
 */
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2) {
    if (t1 == 'object') {
      if (isArray(o1)) {
        if (!isArray(o2)) return false;
        if ((length = o1.length) == o2.length) {
          for(key=0; key<length; key++) {
            if (!equals(o1[key], o2[key])) return false;
          }
          return true;
        }
      } else if (isDate(o1)) {
        return isDate(o2) && o1.getTime() == o2.getTime();
      } else if (isRegExp(o1) && isRegExp(o2)) {
        return o1.toString() == o2.toString();
      } else {
        if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return false;
        keySet = {};
        for(key in o1) {
          if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
          if (!equals(o1[key], o2[key])) return false;
          keySet[key] = true;
        }
        for(key in o2) {
          if (!keySet.hasOwnProperty(key) &&
              key.charAt(0) !== '$' &&
              o2[key] !== undefined &&
              !isFunction(o2[key])) return false;
        }
        return true;
      }
    }
  }
  return false;
}


function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index));
}

function sliceArgs(args, startIndex) {
  return slice.call(args, startIndex || 0);
}


/**
 * @ngdoc function
 * @name angular.bind
 * @function
 *
 * @description
 * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for
 * `fn`). You can supply optional `args` that are prebound to the function. This feature is also
 * known as [function currying](http://en.wikipedia.org/wiki/Currying).
 *
 * @param {Object} self Context which `fn` should be evaluated in.
 * @param {function()} fn Function to be bound.
 * @param {...*} args Optional arguments to be prebound to the `fn` function call.
 * @returns {function()} Function that wraps the `fn` with all the specified bindings.
 */
function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
  if (isFunction(fn) && !(fn instanceof RegExp)) {
    return curryArgs.length
      ? function() {
          return arguments.length
            ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0)))
            : fn.apply(self, curryArgs);
        }
      : function() {
          return arguments.length
            ? fn.apply(self, arguments)
            : fn.call(self);
        };
  } else {
    // in IE, native methods are not functions so they cannot be bound (note: they don't need to be)
    return fn;
  }
}


function toJsonReplacer(key, value) {
  var val = value;

  if (typeof key === 'string' && key.charAt(0) === '$') {
    val = undefined;
  } else if (isWindow(value)) {
    val = '$WINDOW';
  } else if (value &&  document === value) {
    val = '$DOCUMENT';
  } else if (isScope(value)) {
    val = '$SCOPE';
  }

  return val;
}


/**
 * @ngdoc function
 * @name angular.toJson
 * @function
 *
 * @description
 * Serializes input into a JSON-formatted string. Properties with leading $ characters will be
 * stripped since angular uses this notation internally.
 *
 * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.
 * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.
 * @returns {string|undefined} JSON-ified string representing `obj`.
 */
function toJson(obj, pretty) {
  if (typeof obj === 'undefined') return undefined;
  return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
}


/**
 * @ngdoc function
 * @name angular.fromJson
 * @function
 *
 * @description
 * Deserializes a JSON string.
 *
 * @param {string} json JSON string to deserialize.
 * @returns {Object|Array|Date|string|number} Deserialized thingy.
 */
function fromJson(json) {
  return isString(json)
      ? JSON.parse(json)
      : json;
}


function toBoolean(value) {
  if (value && value.length !== 0) {
    var v = lowercase("" + value);
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
  } else {
    value = false;
  }
  return value;
}

/**
 * @returns {string} Returns the string representation of the element.
 */
function startingTag(element) {
  element = jqLite(element).clone();
  try {
    // turns out IE does not let you set .html() on elements which
    // are not allowed to have children. So we just ignore it.
    element.html('');
  } catch(e) {}
  // As Per DOM Standards
  var TEXT_NODE = 3;
  var elemHtml = jqLite('<div>').append(element).html();
  try {
    return element[0].nodeType === TEXT_NODE ? lowercase(elemHtml) :
        elemHtml.
          match(/^(<[^>]+>)/)[1].
          replace(/^<([\w\-]+)/, function(match, nodeName) { return '<' + lowercase(nodeName); });
  } catch(e) {
    return lowercase(elemHtml);
  }

}


/////////////////////////////////////////////////

/**
 * Tries to decode the URI component without throwing an exception.
 *
 * @private
 * @param str value potential URI component to check.
 * @returns {boolean} True if `value` can be decoded
 * with the decodeURIComponent function.
 */
function tryDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch(e) {
    // Ignore any invalid uri component
  }
}


/**
 * Parses an escaped url query string into key-value pairs.
 * @returns Object.<(string|boolean)>
 */
function parseKeyValue(/**string*/keyValue) {
  var obj = {}, key_value, key;
  forEach((keyValue || "").split('&'), function(keyValue){
    if ( keyValue ) {
      key_value = keyValue.split('=');
      key = tryDecodeURIComponent(key_value[0]);
      if ( isDefined(key) ) {
        var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
        if (!obj[key]) {
          obj[key] = val;
        } else if(isArray(obj[key])) {
          obj[key].push(val);
        } else {
          obj[key] = [obj[key],val];
        }
      }
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  forEach(obj, function(value, key) {
    if (isArray(value)) {
      forEach(value, function(arrayValue) {
        parts.push(encodeUriQuery(key, true) + (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
      });
    } else {
    parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));
    }
  });
  return parts.length ? parts.join('&') : '';
}


/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
 * segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriSegment(val) {
  return encodeUriQuery(val, true).
             replace(/%26/gi, '&').
             replace(/%3D/gi, '=').
             replace(/%2B/gi, '+');
}


/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query       = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).
             replace(/%40/gi, '@').
             replace(/%3A/gi, ':').
             replace(/%24/g, '$').
             replace(/%2C/gi, ',').
             replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}


/**
 * @ngdoc directive
 * @name ng.directive:ngApp
 *
 * @element ANY
 * @param {angular.Module} ngApp an optional application
 *   {@link angular.module module} name to load.
 *
 * @description
 *
 * Use this directive to auto-bootstrap an application. Only
 * one ngApp directive can be used per HTML document. The directive
 * designates the root of the application and is typically placed
 * at the root of the page.
 *
 * The first ngApp found in the document will be auto-bootstrapped. To use multiple applications in an
 * HTML document you must manually bootstrap them using {@link angular.bootstrap}.
 * Applications cannot be nested.
 *
 * In the example below if the `ngApp` directive were not placed
 * on the `html` element then the document would not be compiled
 * and the `{{ 1+2 }}` would not be resolved to `3`.
 *
 * `ngApp` is the easiest way to bootstrap an application.
 *
 <doc:example>
   <doc:source>
    I can add: 1 + 2 =  {{ 1+2 }}
   </doc:source>
 </doc:example>
 *
 */
function angularInit(element, bootstrap) {
  var elements = [element],
      appElement,
      module,
      names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],
      NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;

  function append(element) {
    element && elements.push(element);
  }

  forEach(names, function(name) {
    names[name] = true;
    append(document.getElementById(name));
    name = name.replace(':', '\\:');
    if (element.querySelectorAll) {
      forEach(element.querySelectorAll('.' + name), append);
      forEach(element.querySelectorAll('.' + name + '\\:'), append);
      forEach(element.querySelectorAll('[' + name + ']'), append);
    }
  });

  forEach(elements, function(element) {
    if (!appElement) {
      var className = ' ' + element.className + ' ';
      var match = NG_APP_CLASS_REGEXP.exec(className);
      if (match) {
        appElement = element;
        module = (match[2] || '').replace(/\s+/g, ',');
      } else {
        forEach(element.attributes, function(attr) {
          if (!appElement && names[attr.name]) {
            appElement = element;
            module = attr.value;
          }
        });
      }
    }
  });
  if (appElement) {
    bootstrap(appElement, module ? [module] : []);
  }
}

/**
 * @ngdoc function
 * @name angular.bootstrap
 * @description
 * Use this function to manually start up angular application.
 *
 * See: {@link guide/bootstrap Bootstrap}
 *
 * Note that ngScenario-based end-to-end tests cannot use this function to bootstrap manually.
 * They must use {@link api/ng.directive:ngApp ngApp}.
 *
 * @param {Element} element DOM element which is the root of angular application.
 * @param {Array<String|Function|Array>=} modules an array of modules to load into the application.
 *     Each item in the array should be the name of a predefined module or a (DI annotated)
 *     function that will be invoked by the injector as a run block. See: {@link angular.module modules}
 * @returns {AUTO.$injector} Returns the newly created injector for this app.
 */
function bootstrap(element, modules) {
  var doBootstrap = function() {
    element = jqLite(element);

    if (element.injector()) {
      var tag = (element[0] === document) ? 'document' : startingTag(element);
      throw ngMinErr('btstrpd', "App Already Bootstrapped with this Element '{0}'", tag);
    }

    modules = modules || [];
    modules.unshift(['$provide', function($provide) {
      $provide.value('$rootElement', element);
    }]);
    modules.unshift('ng');
    var injector = createInjector(modules);
    injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector', '$animate',
       function(scope, element, compile, injector, animate) {
        scope.$apply(function() {
          element.data('$injector', injector);
          compile(element)(scope);
        });
        animate.enabled(true);
      }]
    );
    return injector;
  };

  var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;

  if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
    return doBootstrap();
  }

  window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
  angular.resumeBootstrap = function(extraModules) {
    forEach(extraModules, function(module) {
      modules.push(module);
    });
    doBootstrap();
  };
}

var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator){
  separator = separator || '_';
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}

function bindJQuery() {
  // bind to jQuery if present;
  jQuery = window.jQuery;
  // reset to jQuery or default to us.
  if (jQuery) {
    jqLite = jQuery;
    extend(jQuery.fn, {
      scope: JQLitePrototype.scope,
      controller: JQLitePrototype.controller,
      injector: JQLitePrototype.injector,
      inheritedData: JQLitePrototype.inheritedData
    });
    // Method signature: JQLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments)
    JQLitePatchJQueryRemove('remove', true, true, false);
    JQLitePatchJQueryRemove('empty', false, false, false);
    JQLitePatchJQueryRemove('html', false, false, true);
  } else {
    jqLite = JQLite;
  }
  angular.element = jqLite;
}

/**
 * throw error if the argument is falsy.
 */
function assertArg(arg, name, reason) {
  if (!arg) {
    throw ngMinErr('areq', "Argument '{0}' is {1}", (name || '?'), (reason || "required"));
  }
  return arg;
}

function assertArgFn(arg, name, acceptArrayAnnotation) {
  if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
  }

  assertArg(isFunction(arg), name, 'not a function, got ' +
      (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));
  return arg;
}

/**
 * Return the value accessible from the object by path. Any undefined traversals are ignored
 * @param {Object} obj starting object
 * @param {string} path path to traverse
 * @param {boolean=true} bindFnToScope
 * @returns value as accessible by path
 */
//TODO(misko): this function needs to be removed
function getter(obj, path, bindFnToScope) {
  if (!path) return obj;
  var keys = path.split('.');
  var key;
  var lastInstance = obj;
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    key = keys[i];
    if (obj) {
      obj = (lastInstance = obj)[key];
    }
  }
  if (!bindFnToScope && isFunction(obj)) {
    return bind(lastInstance, obj);
  }
  return obj;
}

/**
 * @ngdoc interface
 * @name angular.Module
 * @description
 *
 * Interface for configuring angular {@link angular.module modules}.
 */

function setupModuleLoader(window) {

  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  return ensure(ensure(window, 'angular', Object), 'module', function() {
    /** @type {Object.<string, angular.Module>} */
    var modules = {};

    /**
     * @ngdoc function
     * @name angular.module
     * @description
     *
     * The `angular.module` is a global place for creating, registering and retrieving Angular modules.
     * All modules (angular core or 3rd party) that should be available to an application must be
     * registered using this mechanism.
     *
     * When passed two or more arguments, a new module is created.  If passed only one argument, an
     * existing module (the name passed as the first argument to `module`) is retrieved.
     *
     *
     * # Module
     *
     * A module is a collection of services, directives, filters, and configuration information.
     * `angular.module` is used to configure the {@link AUTO.$injector $injector}.
     *
     * <pre>
     * // Create a new module
     * var myModule = angular.module('myModule', []);
     *
     * // register a new service
     * myModule.value('appName', 'MyCoolApp');
     *
     * // configure existing services inside initialization blocks.
     * myModule.config(function($locationProvider) {
     *   // Configure existing providers
     *   $locationProvider.hashPrefix('!');
     * });
     * </pre>
     *
     * Then you can create an injector and load your modules like this:
     *
     * <pre>
     * var injector = angular.injector(['ng', 'MyModule'])
     * </pre>
     *
     * However it's more likely that you'll just use
     * {@link ng.directive:ngApp ngApp} or
     * {@link angular.bootstrap} to simplify this process for you.
     *
     * @param {!string} name The name of the module to create or retrieve.
     * @param {Array.<string>=} requires If specified then new module is being created. If unspecified then the
     *        the module is being retrieved for further configuration.
     * @param {Function} configFn Optional configuration function for the module. Same as
     *        {@link angular.Module#config Module#config()}.
     * @returns {module} new module with the {@link angular.Module} api.
     */
    return function module(name, requires, configFn) {
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }
      return ensure(modules, name, function() {
        if (!requires) {
          throw minErr('$injector')('nomod', "Module '{0}' is not available! You either misspelled the module name " +
              "or forgot to load it. If registering a module ensure that you specify the dependencies as the second " +
              "argument.", name);
        }

        /** @type {!Array.<Array.<*>>} */
        var invokeQueue = [];

        /** @type {!Array.<Function>} */
        var runBlocks = [];

        var config = invokeLater('$injector', 'invoke');

        /** @type {angular.Module} */
        var moduleInstance = {
          // Private state
          _invokeQueue: invokeQueue,
          _runBlocks: runBlocks,

          /**
           * @ngdoc property
           * @name angular.Module#requires
           * @propertyOf angular.Module
           * @returns {Array.<string>} List of module names which must be loaded before this module.
           * @description
           * Holds the list of modules which the injector will load before the current module is loaded.
           */
          requires: requires,

          /**
           * @ngdoc property
           * @name angular.Module#name
           * @propertyOf angular.Module
           * @returns {string} Name of the module.
           * @description
           */
          name: name,


          /**
           * @ngdoc method
           * @name angular.Module#provider
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {Function} providerType Construction function for creating new instance of the service.
           * @description
           * See {@link AUTO.$provide#provider $provide.provider()}.
           */
          provider: invokeLater('$provide', 'provider'),

          /**
           * @ngdoc method
           * @name angular.Module#factory
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {Function} providerFunction Function for creating new instance of the service.
           * @description
           * See {@link AUTO.$provide#factory $provide.factory()}.
           */
          factory: invokeLater('$provide', 'factory'),

          /**
           * @ngdoc method
           * @name angular.Module#service
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {Function} constructor A constructor function that will be instantiated.
           * @description
           * See {@link AUTO.$provide#service $provide.service()}.
           */
          service: invokeLater('$provide', 'service'),

          /**
           * @ngdoc method
           * @name angular.Module#value
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {*} object Service instance object.
           * @description
           * See {@link AUTO.$provide#value $provide.value()}.
           */
          value: invokeLater('$provide', 'value'),

          /**
           * @ngdoc method
           * @name angular.Module#constant
           * @methodOf angular.Module
           * @param {string} name constant name
           * @param {*} object Constant value.
           * @description
           * Because the constant are fixed, they get applied before other provide methods.
           * See {@link AUTO.$provide#constant $provide.constant()}.
           */
          constant: invokeLater('$provide', 'constant', 'unshift'),

          /**
           * @ngdoc method
           * @name angular.Module#animation
           * @methodOf angular.Module
           * @param {string} name animation name
           * @param {Function} animationFactory Factory function for creating new instance of an animation.
           * @description
           *
           * **NOTE**: animations take effect only if the **ngAnimate** module is loaded.
           *
           *
           * Defines an animation hook that can be later used with {@link ngAnimate.$animate $animate} service and
           * directives that use this service.
           *
           * <pre>
           * module.animation('.animation-name', function($inject1, $inject2) {
           *   return {
           *     eventName : function(element, done) {
           *       //code to run the animation
           *       //once complete, then run done()
           *       return function cancellationFunction(element) {
           *         //code to cancel the animation
           *       }
           *     }
           *   }
           * })
           * </pre>
           *
           * See {@link ngAnimate.$animateProvider#register $animateProvider.register()} and
           * {@link ngAnimate ngAnimate module} for more information.
           */
          animation: invokeLater('$animateProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#filter
           * @methodOf angular.Module
           * @param {string} name Filter name.
           * @param {Function} filterFactory Factory function for creating new instance of filter.
           * @description
           * See {@link ng.$filterProvider#register $filterProvider.register()}.
           */
          filter: invokeLater('$filterProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#controller
           * @methodOf angular.Module
           * @param {string|Object} name Controller name, or an object map of controllers where the
           *    keys are the names and the values are the constructors.
           * @param {Function} constructor Controller constructor function.
           * @description
           * See {@link ng.$controllerProvider#register $controllerProvider.register()}.
           */
          controller: invokeLater('$controllerProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#directive
           * @methodOf angular.Module
           * @param {string|Object} name Directive name, or an object map of directives where the
           *    keys are the names and the values are the factories.
           * @param {Function} directiveFactory Factory function for creating new instance of
           * directives.
           * @description
           * See {@link ng.$compileProvider#directive $compileProvider.directive()}.
           */
          directive: invokeLater('$compileProvider', 'directive'),

          /**
           * @ngdoc method
           * @name angular.Module#config
           * @methodOf angular.Module
           * @param {Function} configFn Execute this function on module load. Useful for service
           *    configuration.
           * @description
           * Use this method to register work which needs to be performed on module loading.
           */
          config: config,

          /**
           * @ngdoc method
           * @name angular.Module#run
           * @methodOf angular.Module
           * @param {Function} initializationFn Execute this function after injector creation.
           *    Useful for application initialization.
           * @description
           * Use this method to register work which should be performed when the injector is done
           * loading all modules.
           */
          run: function(block) {
            runBlocks.push(block);
            return this;
          }
        };

        if (configFn) {
          config(configFn);
        }

        return  moduleInstance;

        /**
         * @param {string} provider
         * @param {string} method
         * @param {String=} insertMethod
         * @returns {angular.Module}
         */
        function invokeLater(provider, method, insertMethod) {
          return function() {
            invokeQueue[insertMethod || 'push']([provider, method, arguments]);
            return moduleInstance;
          }
        }
      });
    };
  });

}

/**
 * @ngdoc property
 * @name angular.version
 * @description
 * An object that contains information about the current AngularJS version. This object has the
 * following properties:
 *
 * - `full` – `{string}` – Full version string, such as "0.9.18".
 * - `major` – `{number}` – Major version number, such as "0".
 * - `minor` – `{number}` – Minor version number, such as "9".
 * - `dot` – `{number}` – Dot version number, such as "18".
 * - `codeName` – `{string}` – Code name of the release, such as "jiggling-armfat".
 */
var version = {
  full: '1.2.0-7b3549b',    // all of these placeholder strings will be replaced by grunt's
  major: 1,    // package task
  minor: 2,
  dot: 0,
  codeName: 'ferocious-twitch'
};


function publishExternalAPI(angular){
  extend(angular, {
    'bootstrap': bootstrap,
    'copy': copy,
    'extend': extend,
    'equals': equals,
    'element': jqLite,
    'forEach': forEach,
    'injector': createInjector,
    'noop':noop,
    'bind':bind,
    'toJson': toJson,
    'fromJson': fromJson,
    'identity':identity,
    'isUndefined': isUndefined,
    'isDefined': isDefined,
    'isString': isString,
    'isFunction': isFunction,
    'isObject': isObject,
    'isNumber': isNumber,
    'isElement': isElement,
    'isArray': isArray,
    '$$minErr': minErr,
    'version': version,
    'isDate': isDate,
    'lowercase': lowercase,
    'uppercase': uppercase,
    'callbacks': {counter: 0}
  });

  angularModule = setupModuleLoader(window);
  try {
    angularModule('ngLocale');
  } catch (e) {
    angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
  }

  angularModule('ng', ['ngLocale'], ['$provide',
    function ngModule($provide) {
      $provide.provider('$compile', $CompileProvider).
        directive({
            a: htmlAnchorDirective,
            input: inputDirective,
            textarea: inputDirective,
            form: formDirective,
            script: scriptDirective,
            select: selectDirective,
            style: styleDirective,
            option: optionDirective,
            ngBind: ngBindDirective,
            ngBindHtml: ngBindHtmlDirective,
            ngBindTemplate: ngBindTemplateDirective,
            ngClass: ngClassDirective,
            ngClassEven: ngClassEvenDirective,
            ngClassOdd: ngClassOddDirective,
            ngCsp: ngCspDirective,
            ngCloak: ngCloakDirective,
            ngController: ngControllerDirective,
            ngForm: ngFormDirective,
            ngHide: ngHideDirective,
            ngIf: ngIfDirective,
            ngInclude: ngIncludeDirective,
            ngInit: ngInitDirective,
            ngNonBindable: ngNonBindableDirective,
            ngPluralize: ngPluralizeDirective,
            ngRepeat: ngRepeatDirective,
            ngShow: ngShowDirective,
            ngStyle: ngStyleDirective,
            ngSwitch: ngSwitchDirective,
            ngSwitchWhen: ngSwitchWhenDirective,
            ngSwitchDefault: ngSwitchDefaultDirective,
            ngOptions: ngOptionsDirective,
            ngTransclude: ngTranscludeDirective,
            ngModel: ngModelDirective,
            ngList: ngListDirective,
            ngChange: ngChangeDirective,
            required: requiredDirective,
            ngRequired: requiredDirective,
            ngValue: ngValueDirective
        }).
        directive(ngAttributeAliasDirectives).
        directive(ngEventDirectives);
      $provide.provider({
        $anchorScroll: $AnchorScrollProvider,
        $animate: $AnimateProvider,
        $browser: $BrowserProvider,
        $cacheFactory: $CacheFactoryProvider,
        $controller: $ControllerProvider,
        $document: $DocumentProvider,
        $exceptionHandler: $ExceptionHandlerProvider,
        $filter: $FilterProvider,
        $interpolate: $InterpolateProvider,
        $http: $HttpProvider,
        $httpBackend: $HttpBackendProvider,
        $location: $LocationProvider,
        $log: $LogProvider,
        $parse: $ParseProvider,
        $rootScope: $RootScopeProvider,
        $q: $QProvider,
        $sce: $SceProvider,
        $sceDelegate: $SceDelegateProvider,
        $sniffer: $SnifferProvider,
        $templateCache: $TemplateCacheProvider,
        $timeout: $TimeoutProvider,
        $window: $WindowProvider,
        $$urlUtils: $$UrlUtilsProvider
      });
    }
  ]);
}

//////////////////////////////////
//JQLite
//////////////////////////////////

/**
 * @ngdoc function
 * @name angular.element
 * @function
 *
 * @description
 * Wraps a raw DOM element or HTML string as a [jQuery](http://jquery.com) element.
 * `angular.element` can be either an alias for [jQuery](http://api.jquery.com/jQuery/) function, if
 * jQuery is available, or a function that wraps the element or string in Angular's jQuery lite
 * implementation (commonly referred to as jqLite).
 *
 * Real jQuery always takes precedence over jqLite, provided it was loaded before `DOMContentLoaded`
 * event fired.
 *
 * jqLite is a tiny, API-compatible subset of jQuery that allows
 * Angular to manipulate the DOM. jqLite implements only the most commonly needed functionality
 * within a very small footprint, so only a subset of the jQuery API - methods, arguments and
 * invocation styles - are supported.
 *
 * Note: All element references in Angular are always wrapped with jQuery or jqLite; they are never
 * raw DOM references.
 *
 * ## Angular's jqLite
 * Angular's lite version of jQuery provides only the following jQuery methods:
 *
 * - [addClass()](http://api.jquery.com/addClass/)
 * - [after()](http://api.jquery.com/after/)
 * - [append()](http://api.jquery.com/append/)
 * - [attr()](http://api.jquery.com/attr/)
 * - [bind()](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
 * - [children()](http://api.jquery.com/children/) - Does not support selectors
 * - [clone()](http://api.jquery.com/clone/)
 * - [contents()](http://api.jquery.com/contents/)
 * - [css()](http://api.jquery.com/css/)
 * - [data()](http://api.jquery.com/data/)
 * - [eq()](http://api.jquery.com/eq/)
 * - [find()](http://api.jquery.com/find/) - Limited to lookups by tag name
 * - [hasClass()](http://api.jquery.com/hasClass/)
 * - [html()](http://api.jquery.com/html/)
 * - [next()](http://api.jquery.com/next/) - Does not support selectors
 * - [on()](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
 * - [off()](http://api.jquery.com/off/) - Does not support namespaces or selectors
 * - [parent()](http://api.jquery.com/parent/) - Does not support selectors
 * - [prepend()](http://api.jquery.com/prepend/)
 * - [prop()](http://api.jquery.com/prop/)
 * - [ready()](http://api.jquery.com/ready/)
 * - [remove()](http://api.jquery.com/remove/)
 * - [removeAttr()](http://api.jquery.com/removeAttr/)
 * - [removeClass()](http://api.jquery.com/removeClass/)
 * - [removeData()](http://api.jquery.com/removeData/)
 * - [replaceWith()](http://api.jquery.com/replaceWith/)
 * - [text()](http://api.jquery.com/text/)
 * - [toggleClass()](http://api.jquery.com/toggleClass/)
 * - [triggerHandler()](http://api.jquery.com/triggerHandler/) - Passes a dummy event object to handlers.
 * - [unbind()](http://api.jquery.com/off/) - Does not support namespaces
 * - [val()](http://api.jquery.com/val/)
 * - [wrap()](http://api.jquery.com/wrap/)
 *
 * ## jQuery/jqLite Extras
 * Angular also provides the following additional methods and events to both jQuery and jqLite:
 *
 * ### Events
 * - `$destroy` - AngularJS intercepts all jqLite/jQuery's DOM destruction apis and fires this event
 *    on all DOM nodes being removed.  This can be used to clean up any 3rd party bindings to the DOM
 *    element before it is removed.
 * ### Methods
 * - `controller(name)` - retrieves the controller of the current element or its parent. By default
 *   retrieves controller associated with the `ngController` directive. If `name` is provided as
 *   camelCase directive name, then the controller for this directive will be retrieved (e.g.
 *   `'ngModel'`).
 * - `injector()` - retrieves the injector of the current element or its parent.
 * - `scope()` - retrieves the {@link api/ng.$rootScope.Scope scope} of the current
 *   element or its parent.
 * - `inheritedData()` - same as `data()`, but walks up the DOM until a value is found or the top
 *   parent element is reached.
 *
 * @param {string|DOMElement} element HTML string or DOMElement to be wrapped into jQuery.
 * @returns {Object} jQuery object.
 */

var jqCache = JQLite.cache = {},
    jqName = JQLite.expando = 'ng-' + new Date().getTime(),
    jqId = 1,
    addEventListenerFn = (window.document.addEventListener
      ? function(element, type, fn) {element.addEventListener(type, fn, false);}
      : function(element, type, fn) {element.attachEvent('on' + type, fn);}),
    removeEventListenerFn = (window.document.removeEventListener
      ? function(element, type, fn) {element.removeEventListener(type, fn, false); }
      : function(element, type, fn) {element.detachEvent('on' + type, fn); });

function jqNextId() { return ++jqId; }


var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;
var jqLiteMinErr = minErr('jqLite');

/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function camelCase(name) {
  return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/////////////////////////////////////////////
// jQuery mutation patch
//
// In conjunction with bindJQuery intercepts all jQuery's DOM destruction apis and fires a
// $destroy event on all DOM nodes being removed.
//
/////////////////////////////////////////////

function JQLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments) {
  var originalJqFn = jQuery.fn[name];
  originalJqFn = originalJqFn.$original || originalJqFn;
  removePatch.$original = originalJqFn;
  jQuery.fn[name] = removePatch;

  function removePatch(param) {
    var list = filterElems && param ? [this.filter(param)] : [this],
        fireEvent = dispatchThis,
        set, setIndex, setLength,
        element, childIndex, childLength, children;

    if (!getterIfNoArguments || param != null) {
      while(list.length) {
        set = list.shift();
        for(setIndex = 0, setLength = set.length; setIndex < setLength; setIndex++) {
          element = jqLite(set[setIndex]);
          if (fireEvent) {
            element.triggerHandler('$destroy');
          } else {
            fireEvent = !fireEvent;
          }
          for(childIndex = 0, childLength = (children = element.children()).length;
              childIndex < childLength;
              childIndex++) {
            list.push(jQuery(children[childIndex]));
          }
        }
      }
    }
    return originalJqFn.apply(this, arguments);
  }
}

/////////////////////////////////////////////
function JQLite(element) {
  if (element instanceof JQLite) {
    return element;
  }
  if (!(this instanceof JQLite)) {
    if (isString(element) && element.charAt(0) != '<') {
      throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
    }
    return new JQLite(element);
  }

  if (isString(element)) {
    var div = document.createElement('div');
    // Read about the NoScope elements here:
    // http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
    div.innerHTML = '<div>&#160;</div>' + element; // IE insanity to make NoScope elements work!
    div.removeChild(div.firstChild); // remove the superfluous div
    JQLiteAddNodes(this, div.childNodes);
    var fragment = jqLite(document.createDocumentFragment());
    fragment.append(this); // detach the elements from the temporary DOM div.
  } else {
    JQLiteAddNodes(this, element);
  }
}

function JQLiteClone(element) {
  return element.cloneNode(true);
}

function JQLiteDealoc(element){
  JQLiteRemoveData(element);
  for ( var i = 0, children = element.childNodes || []; i < children.length; i++) {
    JQLiteDealoc(children[i]);
  }
}

function JQLiteOff(element, type, fn, unsupported) {
  if (isDefined(unsupported)) throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');

  var events = JQLiteExpandoStore(element, 'events'),
      handle = JQLiteExpandoStore(element, 'handle');

  if (!handle) return; //no listeners registered

  if (isUndefined(type)) {
    forEach(events, function(eventHandler, type) {
      removeEventListenerFn(element, type, eventHandler);
      delete events[type];
    });
  } else {
    forEach(type.split(' '), function(type) {
      if (isUndefined(fn)) {
        removeEventListenerFn(element, type, events[type]);
        delete events[type];
      } else {
        arrayRemove(events[type] || [], fn);
      }
    });
  }
}

function JQLiteRemoveData(element, name) {
  var expandoId = element[jqName],
      expandoStore = jqCache[expandoId];

  if (expandoStore) {
    if (name) {
      delete jqCache[expandoId].data[name];
      return;
    }

    if (expandoStore.handle) {
      expandoStore.events.$destroy && expandoStore.handle({}, '$destroy');
      JQLiteOff(element);
    }
    delete jqCache[expandoId];
    element[jqName] = undefined; // ie does not allow deletion of attributes on elements.
  }
}

function JQLiteExpandoStore(element, key, value) {
  var expandoId = element[jqName],
      expandoStore = jqCache[expandoId || -1];

  if (isDefined(value)) {
    if (!expandoStore) {
      element[jqName] = expandoId = jqNextId();
      expandoStore = jqCache[expandoId] = {};
    }
    expandoStore[key] = value;
  } else {
    return expandoStore && expandoStore[key];
  }
}

function JQLiteData(element, key, value) {
  var data = JQLiteExpandoStore(element, 'data'),
      isSetter = isDefined(value),
      keyDefined = !isSetter && isDefined(key),
      isSimpleGetter = keyDefined && !isObject(key);

  if (!data && !isSimpleGetter) {
    JQLiteExpandoStore(element, 'data', data = {});
  }

  if (isSetter) {
    data[key] = value;
  } else {
    if (keyDefined) {
      if (isSimpleGetter) {
        // don't create data in this case.
        return data && data[key];
      } else {
        extend(data, key);
      }
    } else {
      return data;
    }
  }
}

function JQLiteHasClass(element, selector) {
  return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
      indexOf( " " + selector + " " ) > -1);
}

function JQLiteRemoveClass(element, cssClasses) {
  if (cssClasses) {
    forEach(cssClasses.split(' '), function(cssClass) {
      element.setAttribute('class', trim(
          (" " + (element.getAttribute('class') || '') + " ")
          .replace(/[\n\t]/g, " ")
          .replace(" " + trim(cssClass) + " ", " "))
      );
    });
  }
}

function JQLiteAddClass(element, cssClasses) {
  if (cssClasses) {
    var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                            .replace(/[\n\t]/g, " ");

    forEach(cssClasses.split(' '), function(cssClass) {
      cssClass = trim(cssClass);
      if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
        existingClasses += cssClass + ' ';
      }
    });

    element.setAttribute('class', trim(existingClasses));
  }
}

function JQLiteAddNodes(root, elements) {
  if (elements) {
    elements = (!elements.nodeName && isDefined(elements.length) && !isWindow(elements))
      ? elements
      : [ elements ];
    for(var i=0; i < elements.length; i++) {
      root.push(elements[i]);
    }
  }
}

function JQLiteController(element, name) {
  return JQLiteInheritedData(element, '$' + (name || 'ngController' ) + 'Controller');
}

function JQLiteInheritedData(element, name, value) {
  element = jqLite(element);

  // if element is the document object work with the html element instead
  // this makes $(document).scope() possible
  if(element[0].nodeType == 9) {
    element = element.find('html');
  }

  while (element.length) {
    if ((value = element.data(name)) !== undefined) return value;
    element = element.parent();
  }
}

//////////////////////////////////////////
// Functions which are declared directly.
//////////////////////////////////////////
var JQLitePrototype = JQLite.prototype = {
  ready: function(fn) {
    var fired = false;

    function trigger() {
      if (fired) return;
      fired = true;
      fn();
    }

    // check if document already is loaded
    if (document.readyState === 'complete'){
      setTimeout(trigger);
    } else {
      this.on('DOMContentLoaded', trigger); // works for modern browsers and IE9
      // we can not use jqLite since we are not done loading and jQuery could be loaded later.
      JQLite(window).on('load', trigger); // fallback to window.onload for others
    }
  },
  toString: function() {
    var value = [];
    forEach(this, function(e){ value.push('' + e);});
    return '[' + value.join(', ') + ']';
  },

  eq: function(index) {
      return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
  },

  length: 0,
  push: push,
  sort: [].sort,
  splice: [].splice
};

//////////////////////////////////////////
// Functions iterating getter/setters.
// these functions return self on setter and
// value on get.
//////////////////////////////////////////
var BOOLEAN_ATTR = {};
forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
  BOOLEAN_ATTR[lowercase(value)] = value;
});
var BOOLEAN_ELEMENTS = {};
forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
  BOOLEAN_ELEMENTS[uppercase(value)] = true;
});

function getBooleanAttrName(element, name) {
  // check dom last since we will most likely fail on name
  var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];

  // booleanAttr is here twice to minimize DOM access
  return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
}

forEach({
  data: JQLiteData,
  inheritedData: JQLiteInheritedData,

  scope: function(element) {
    return JQLiteInheritedData(element, '$scope');
  },

  controller: JQLiteController ,

  injector: function(element) {
    return JQLiteInheritedData(element, '$injector');
  },

  removeAttr: function(element,name) {
    element.removeAttribute(name);
  },

  hasClass: JQLiteHasClass,

  css: function(element, name, value) {
    name = camelCase(name);

    if (isDefined(value)) {
      element.style[name] = value;
    } else {
      var val;

      if (msie <= 8) {
        // this is some IE specific weirdness that jQuery 1.6.4 does not sure why
        val = element.currentStyle && element.currentStyle[name];
        if (val === '') val = 'auto';
      }

      val = val || element.style[name];

      if (msie <= 8) {
        // jquery weirdness :-/
        val = (val === '') ? undefined : val;
      }

      return  val;
    }
  },

  attr: function(element, name, value){
    var lowercasedName = lowercase(name);
    if (BOOLEAN_ATTR[lowercasedName]) {
      if (isDefined(value)) {
        if (!!value) {
          element[name] = true;
          element.setAttribute(name, lowercasedName);
        } else {
          element[name] = false;
          element.removeAttribute(lowercasedName);
        }
      } else {
        return (element[name] ||
                 (element.attributes.getNamedItem(name)|| noop).specified)
               ? lowercasedName
               : undefined;
      }
    } else if (isDefined(value)) {
      element.setAttribute(name, value);
    } else if (element.getAttribute) {
      // the extra argument "2" is to get the right thing for a.href in IE, see jQuery code
      // some elements (e.g. Document) don't have get attribute, so return undefined
      var ret = element.getAttribute(name, 2);
      // normalize non-existing attributes to undefined (as jQuery)
      return ret === null ? undefined : ret;
    }
  },

  prop: function(element, name, value) {
    if (isDefined(value)) {
      element[name] = value;
    } else {
      return element[name];
    }
  },

  text: (function() {
    var NODE_TYPE_TEXT_PROPERTY = [];
    if (msie < 9) {
      NODE_TYPE_TEXT_PROPERTY[1] = 'innerText';    /** Element **/
      NODE_TYPE_TEXT_PROPERTY[3] = 'nodeValue';    /** Text **/
    } else {
      NODE_TYPE_TEXT_PROPERTY[1] =                 /** Element **/
      NODE_TYPE_TEXT_PROPERTY[3] = 'textContent';  /** Text **/
    }
    getText.$dv = '';
    return getText;

    function getText(element, value) {
      var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType]
      if (isUndefined(value)) {
        return textProp ? element[textProp] : '';
      }
      element[textProp] = value;
    }
  })(),

  val: function(element, value) {
    if (isUndefined(value)) {
      if (nodeName_(element) === 'SELECT' && element.multiple) {
        var result = [];
        forEach(element.options, function (option) {
          if (option.selected) {
            result.push(option.value || option.text);
          }
        });
        return result.length === 0 ? null : result;
      }
      return element.value;
    }
    element.value = value;
  },

  html: function(element, value) {
    if (isUndefined(value)) {
      return element.innerHTML;
    }
    for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
      JQLiteDealoc(childNodes[i]);
    }
    element.innerHTML = value;
  }
}, function(fn, name){
  /**
   * Properties: writes return selection, reads return first value
   */
  JQLite.prototype[name] = function(arg1, arg2) {
    var i, key;

    // JQLiteHasClass has only two arguments, but is a getter-only fn, so we need to special-case it
    // in a way that survives minification.
    if (((fn.length == 2 && (fn !== JQLiteHasClass && fn !== JQLiteController)) ? arg1 : arg2) === undefined) {
      if (isObject(arg1)) {

        // we are a write, but the object properties are the key/values
        for(i=0; i < this.length; i++) {
          if (fn === JQLiteData) {
            // data() takes the whole object in jQuery
            fn(this[i], arg1);
          } else {
            for (key in arg1) {
              fn(this[i], key, arg1[key]);
            }
          }
        }
        // return self for chaining
        return this;
      } else {
        // we are a read, so read the first child.
        var value = fn.$dv;
        // Only if we have $dv do we iterate over all, otherwise it is just the first element.
        var jj = value == undefined ? Math.min(this.length, 1) : this.length;
        for (var j = 0; j < jj; j++) {
          var nodeValue = fn(this[j], arg1, arg2);
          value = value ? value + nodeValue : nodeValue;
        }
        return value;
      }
    } else {
      // we are a write, so apply to all children
      for(i=0; i < this.length; i++) {
        fn(this[i], arg1, arg2);
      }
      // return self for chaining
      return this;
    }
  };
});

function createEventHandler(element, events) {
  var eventHandler = function (event, type) {
    if (!event.preventDefault) {
      event.preventDefault = function() {
        event.returnValue = false; //ie
      };
    }

    if (!event.stopPropagation) {
      event.stopPropagation = function() {
        event.cancelBubble = true; //ie
      };
    }

    if (!event.target) {
      event.target = event.srcElement || document;
    }

    if (isUndefined(event.defaultPrevented)) {
      var prevent = event.preventDefault;
      event.preventDefault = function() {
        event.defaultPrevented = true;
        prevent.call(event);
      };
      event.defaultPrevented = false;
    }

    event.isDefaultPrevented = function() {
      return event.defaultPrevented || event.returnValue == false;
    };

    forEach(events[type || event.type], function(fn) {
      fn.call(element, event);
    });

    // Remove monkey-patched methods (IE),
    // as they would cause memory leaks in IE8.
    if (msie <= 8) {
      // IE7/8 does not allow to delete property on native object
      event.preventDefault = null;
      event.stopPropagation = null;
      event.isDefaultPrevented = null;
    } else {
      // It shouldn't affect normal browsers (native methods are defined on prototype).
      delete event.preventDefault;
      delete event.stopPropagation;
      delete event.isDefaultPrevented;
    }
  };
  eventHandler.elem = element;
  return eventHandler;
}

//////////////////////////////////////////
// Functions iterating traversal.
// These functions chain results into a single
// selector.
//////////////////////////////////////////
forEach({
  removeData: JQLiteRemoveData,

  dealoc: JQLiteDealoc,

  on: function onFn(element, type, fn, unsupported){
    if (isDefined(unsupported)) throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');

    var events = JQLiteExpandoStore(element, 'events'),
        handle = JQLiteExpandoStore(element, 'handle');

    if (!events) JQLiteExpandoStore(element, 'events', events = {});
    if (!handle) JQLiteExpandoStore(element, 'handle', handle = createEventHandler(element, events));

    forEach(type.split(' '), function(type){
      var eventFns = events[type];

      if (!eventFns) {
        if (type == 'mouseenter' || type == 'mouseleave') {
          var contains = document.body.contains || document.body.compareDocumentPosition ?
          function( a, b ) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
            return a === bup || !!( bup && bup.nodeType === 1 && (
              adown.contains ?
              adown.contains( bup ) :
              a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
              ));
            } :
            function( a, b ) {
              if ( b ) {
                while ( (b = b.parentNode) ) {
                  if ( b === a ) {
                    return true;
                  }
                }
              }
              return false;
            };

          events[type] = [];

          // Refer to jQuery's implementation of mouseenter & mouseleave
          // Read about mouseenter and mouseleave:
          // http://www.quirksmode.org/js/events_mouse.html#link8
          var eventmap = { mouseleave : "mouseout", mouseenter : "mouseover"};

          onFn(element, eventmap[type], function(event) {
            var target = this, related = event.relatedTarget;
            // For mousenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if ( !related || (related !== target && !contains(target, related)) ){
              handle(event, type);
            }
          });

        } else {
          addEventListenerFn(element, type, handle);
          events[type] = [];
        }
        eventFns = events[type]
      }
      eventFns.push(fn);
    });
  },

  off: JQLiteOff,

  replaceWith: function(element, replaceNode) {
    var index, parent = element.parentNode;
    JQLiteDealoc(element);
    forEach(new JQLite(replaceNode), function(node){
      if (index) {
        parent.insertBefore(node, index.nextSibling);
      } else {
        parent.replaceChild(node, element);
      }
      index = node;
    });
  },

  children: function(element) {
    var children = [];
    forEach(element.childNodes, function(element){
      if (element.nodeType === 1)
        children.push(element);
    });
    return children;
  },

  contents: function(element) {
    return element.childNodes || [];
  },

  append: function(element, node) {
    forEach(new JQLite(node), function(child){
      if (element.nodeType === 1 || element.nodeType === 11) {
        element.appendChild(child);
      }
    });
  },

  prepend: function(element, node) {
    if (element.nodeType === 1) {
      var index = element.firstChild;
      forEach(new JQLite(node), function(child){
        element.insertBefore(child, index);
      });
    }
  },

  wrap: function(element, wrapNode) {
    wrapNode = jqLite(wrapNode)[0];
    var parent = element.parentNode;
    if (parent) {
      parent.replaceChild(wrapNode, element);
    }
    wrapNode.appendChild(element);
  },

  remove: function(element) {
    JQLiteDealoc(element);
    var parent = element.parentNode;
    if (parent) parent.removeChild(element);
  },

  after: function(element, newElement) {
    var index = element, parent = element.parentNode;
    forEach(new JQLite(newElement), function(node){
      parent.insertBefore(node, index.nextSibling);
      index = node;
    });
  },

  addClass: JQLiteAddClass,
  removeClass: JQLiteRemoveClass,

  toggleClass: function(element, selector, condition) {
    if (isUndefined(condition)) {
      condition = !JQLiteHasClass(element, selector);
    }
    (condition ? JQLiteAddClass : JQLiteRemoveClass)(element, selector);
  },

  parent: function(element) {
    var parent = element.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },

  next: function(element) {
    if (element.nextElementSibling) {
      return element.nextElementSibling;
    }

    // IE8 doesn't have nextElementSibling
    var elm = element.nextSibling;
    while (elm != null && elm.nodeType !== 1) {
      elm = elm.nextSibling;
    }
    return elm;
  },

  find: function(element, selector) {
    return element.getElementsByTagName(selector);
  },

  clone: JQLiteClone,

  triggerHandler: function(element, eventName, eventData) {
    var eventFns = (JQLiteExpandoStore(element, 'events') || {})[eventName];
    eventData = eventData || {
      preventDefault: noop,
      stopPropagation: noop
    };

    forEach(eventFns, function(fn) {
      fn.call(element, eventData);
    });
  }
}, function(fn, name){
  /**
   * chaining functions
   */
  JQLite.prototype[name] = function(arg1, arg2, arg3) {
    var value;
    for(var i=0; i < this.length; i++) {
      if (value == undefined) {
        value = fn(this[i], arg1, arg2, arg3);
        if (value !== undefined) {
          // any function which returns a value needs to be wrapped
          value = jqLite(value);
        }
      } else {
        JQLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
      }
    }
    return value == undefined ? this : value;
  };

  // bind legacy bind/unbind to on/off
  JQLite.prototype.bind = JQLite.prototype.on;
  JQLite.prototype.unbind = JQLite.prototype.off;
});

/**
 * Computes a hash of an 'obj'.
 * Hash of a:
 *  string is string
 *  number is number as string
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,
 *         that is also assigned to the $$hashKey property of the object.
 *
 * @param obj
 * @returns {string} hash string such that the same input will have the same hash string.
 *         The resulting string key is in 'type:hashKey' format.
 */
function hashKey(obj) {
  var objType = typeof obj,
      key;

  if (objType == 'object' && obj !== null) {
    if (typeof (key = obj.$$hashKey) == 'function') {
      // must invoke on object to keep the right this
      key = obj.$$hashKey();
    } else if (key === undefined) {
      key = obj.$$hashKey = nextUid();
    }
  } else {
    key = obj;
  }

  return objType + ':' + key;
}

/**
 * HashMap which can use objects as keys
 */
function HashMap(array){
  forEach(array, this.put, this);
}
HashMap.prototype = {
  /**
   * Store key value pair
   * @param key key to store can be any type
   * @param value value to store can be any type
   */
  put: function(key, value) {
    this[hashKey(key)] = value;
  },

  /**
   * @param key
   * @returns the value for the key
   */
  get: function(key) {
    return this[hashKey(key)];
  },

  /**
   * Remove the key/value pair
   * @param key
   */
  remove: function(key) {
    var value = this[key = hashKey(key)];
    delete this[key];
    return value;
  }
};

/**
 * @ngdoc function
 * @name angular.injector
 * @function
 *
 * @description
 * Creates an injector function that can be used for retrieving services as well as for
 * dependency injection (see {@link guide/di dependency injection}).
 *

 * @param {Array.<string|Function>} modules A list of module functions or their aliases. See
 *        {@link angular.module}. The `ng` module must be explicitly added.
 * @returns {function()} Injector function. See {@link AUTO.$injector $injector}.
 *
 * @example
 * Typical usage
 * <pre>
 *   // create an injector
 *   var $injector = angular.injector(['ng']);
 *
 *   // use the injector to kick off your application
 *   // use the type inference to auto inject arguments, or use implicit injection
 *   $injector.invoke(function($rootScope, $compile, $document){
 *     $compile($document)($rootScope);
 *     $rootScope.$digest();
 *   });
 * </pre>
 */


/**
 * @ngdoc overview
 * @name AUTO
 * @description
 *
 * Implicit module which gets automatically added to each {@link AUTO.$injector $injector}.
 */

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var $injectorMinErr = minErr('$injector');
function annotate(fn) {
  var $inject,
      fnText,
      argDecl,
      last;

  if (typeof fn == 'function') {
    if (!($inject = fn.$inject)) {
      $inject = [];
      if (fn.length) {
        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS);
        forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
          arg.replace(FN_ARG, function(all, underscore, name){
            $inject.push(name);
          });
        });
      }
      fn.$inject = $inject;
    }
  } else if (isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn');
    $inject = fn.slice(0, last);
  } else {
    assertArgFn(fn, 'fn', true);
  }
  return $inject;
}

///////////////////////////////////////

/**
 * @ngdoc object
 * @name AUTO.$injector
 * @function
 *
 * @description
 *
 * `$injector` is used to retrieve object instances as defined by
 * {@link AUTO.$provide provider}, instantiate types, invoke methods,
 * and load modules.
 *
 * The following always holds true:
 *
 * <pre>
 *   var $injector = angular.injector();
 *   expect($injector.get('$injector')).toBe($injector);
 *   expect($injector.invoke(function($injector){
 *     return $injector;
 *   }).toBe($injector);
 * </pre>
 *
 * # Injection Function Annotation
 *
 * JavaScript does not have annotations, and annotations are needed for dependency injection. The
 * following are all valid ways of annotating function with injection arguments and are equivalent.
 *
 * <pre>
 *   // inferred (only works if code not minified/obfuscated)
 *   $injector.invoke(function(serviceA){});
 *
 *   // annotated
 *   function explicit(serviceA) {};
 *   explicit.$inject = ['serviceA'];
 *   $injector.invoke(explicit);
 *
 *   // inline
 *   $injector.invoke(['serviceA', function(serviceA){}]);
 * </pre>
 *
 * ## Inference
 *
 * In JavaScript calling `toString()` on a function returns the function definition. The definition can then be
 * parsed and the function arguments can be extracted. *NOTE:* This does not work with minification, and obfuscation
 * tools since these tools change the argument names.
 *
 * ## `$inject` Annotation
 * By adding a `$inject` property onto a function the injection parameters can be specified.
 *
 * ## Inline
 * As an array of injection names, where the last item in the array is the function to call.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#get
 * @methodOf AUTO.$injector
 *
 * @description
 * Return an instance of the service.
 *
 * @param {string} name The name of the instance to retrieve.
 * @return {*} The instance.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#invoke
 * @methodOf AUTO.$injector
 *
 * @description
 * Invoke the method and supply the method arguments from the `$injector`.
 *
 * @param {!function} fn The function to invoke. The function arguments come form the function annotation.
 * @param {Object=} self The `this` for the invoked method.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before
 *   the `$injector` is consulted.
 * @returns {*} the value returned by the invoked `fn` function.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#has
 * @methodOf AUTO.$injector
 *
 * @description
 * Allows the user to query if the particular service exist.
 *
 * @param {string} Name of the service to query.
 * @returns {boolean} returns true if injector has given service.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#instantiate
 * @methodOf AUTO.$injector
 * @description
 * Create a new instance of JS type. The method takes a constructor function invokes the new operator and supplies
 * all of the arguments to the constructor function as specified by the constructor annotation.
 *
 * @param {function} Type Annotated constructor function.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before
 *   the `$injector` is consulted.
 * @returns {Object} new instance of `Type`.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#annotate
 * @methodOf AUTO.$injector
 *
 * @description
 * Returns an array of service names which the function is requesting for injection. This API is used by the injector
 * to determine which services need to be injected into the function when the function is invoked. There are three
 * ways in which the function can be annotated with the needed dependencies.
 *
 * # Argument names
 *
 * The simplest form is to extract the dependencies from the arguments of the function. This is done by converting
 * the function into a string using `toString()` method and extracting the argument names.
 * <pre>
 *   // Given
 *   function MyController($scope, $route) {
 *     // ...
 *   }
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * </pre>
 *
 * This method does not work with code minification / obfuscation. For this reason the following annotation strategies
 * are supported.
 *
 * # The `$inject` property
 *
 * If a function has an `$inject` property and its value is an array of strings, then the strings represent names of
 * services to be injected into the function.
 * <pre>
 *   // Given
 *   var MyController = function(obfuscatedScope, obfuscatedRoute) {
 *     // ...
 *   }
 *   // Define function dependencies
 *   MyController.$inject = ['$scope', '$route'];
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * </pre>
 *
 * # The array notation
 *
 * It is often desirable to inline Injected functions and that's when setting the `$inject` property is very
 * inconvenient. In these situations using the array notation to specify the dependencies in a way that survives
 * minification is a better choice:
 *
 * <pre>
 *   // We wish to write this (not minification / obfuscation safe)
 *   injector.invoke(function($compile, $rootScope) {
 *     // ...
 *   });
 *
 *   // We are forced to write break inlining
 *   var tmpFn = function(obfuscatedCompile, obfuscatedRootScope) {
 *     // ...
 *   };
 *   tmpFn.$inject = ['$compile', '$rootScope'];
 *   injector.invoke(tmpFn);
 *
 *   // To better support inline function the inline annotation is supported
 *   injector.invoke(['$compile', '$rootScope', function(obfCompile, obfRootScope) {
 *     // ...
 *   }]);
 *
 *   // Therefore
 *   expect(injector.annotate(
 *      ['$compile', '$rootScope', function(obfus_$compile, obfus_$rootScope) {}])
 *    ).toEqual(['$compile', '$rootScope']);
 * </pre>
 *
 * @param {function|Array.<string|Function>} fn Function for which dependent service names need to be retrieved as described
 *   above.
 *
 * @returns {Array.<string>} The names of the services which the function requires.
 */




/**
 * @ngdoc object
 * @name AUTO.$provide
 *
 * @description
 *
 * Use `$provide` to register new providers with the `$injector`. The providers are the factories for the instance.
 * The providers share the same name as the instance they create with `Provider` suffixed to them.
 *
 * A provider is an object with a `$get()` method. The injector calls the `$get` method to create a new instance of
 * a service. The Provider can have additional methods which would allow for configuration of the provider.
 *
 * <pre>
 *   function GreetProvider() {
 *     var salutation = 'Hello';
 *
 *     this.salutation = function(text) {
 *       salutation = text;
 *     };
 *
 *     this.$get = function() {
 *       return function (name) {
 *         return salutation + ' ' + name + '!';
 *       };
 *     };
 *   }
 *
 *   describe('Greeter', function(){
 *
 *     beforeEach(module(function($provide) {
 *       $provide.provider('greet', GreetProvider);
 *     }));
 *
 *     it('should greet', inject(function(greet) {
 *       expect(greet('angular')).toEqual('Hello angular!');
 *     }));
 *
 *     it('should allow configuration of salutation', function() {
 *       module(function(greetProvider) {
 *         greetProvider.salutation('Ahoj');
 *       });
 *       inject(function(greet) {
 *         expect(greet('angular')).toEqual('Ahoj angular!');
 *       });
 *     });
 * </pre>
 */

/**
 * @ngdoc method
 * @name AUTO.$provide#provider
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a provider for a service. The providers can be retrieved and can have additional configuration methods.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name + 'Provider'` key.
 * @param {(Object|function())} provider If the provider is:
 *
 *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using
 *               {@link AUTO.$injector#invoke $injector.invoke()} when an instance needs to be created.
 *   - `Constructor`: a new instance of the provider will be created using
 *               {@link AUTO.$injector#instantiate $injector.instantiate()}, then treated as `object`.
 *
 * @returns {Object} registered provider instance
 */

/**
 * @ngdoc method
 * @name AUTO.$provide#factory
 * @methodOf AUTO.$provide
 * @description
 *
 * A short hand for configuring services if only `$get` method is required.
 *
 * @param {string} name The name of the instance.
 * @param {function()} $getFn The $getFn for the instance creation. Internally this is a short hand for
 * `$provide.provider(name, {$get: $getFn})`.
 * @returns {Object} registered provider instance
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#service
 * @methodOf AUTO.$provide
 * @description
 *
 * A short hand for registering service of given class.
 *
 * @param {string} name The name of the instance.
 * @param {Function} constructor A class (constructor function) that will be instantiated.
 * @returns {Object} registered provider instance
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#value
 * @methodOf AUTO.$provide
 * @description
 *
 * A short hand for configuring services if the `$get` method is a constant.
 *
 * @param {string} name The name of the instance.
 * @param {*} value The value.
 * @returns {Object} registered provider instance
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#constant
 * @methodOf AUTO.$provide
 * @description
 *
 * A constant value, but unlike {@link AUTO.$provide#value value} it can be injected
 * into configuration function (other modules) and it is not interceptable by
 * {@link AUTO.$provide#decorator decorator}.
 *
 * @param {string} name The name of the constant.
 * @param {*} value The constant value.
 * @returns {Object} registered instance
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#decorator
 * @methodOf AUTO.$provide
 * @description
 *
 * Decoration of service, allows the decorator to intercept the service instance creation. The
 * returned instance may be the original instance, or a new instance which delegates to the
 * original instance.
 *
 * @param {string} name The name of the service to decorate.
 * @param {function()} decorator This function will be invoked when the service needs to be
 *    instantiated. The function is called using the {@link AUTO.$injector#invoke
 *    injector.invoke} method and is therefore fully injectable. Local injection arguments:
 *
 *    * `$delegate` - The original service instance, which can be monkey patched, configured,
 *      decorated or delegated to.
 */


function createInjector(modulesToLoad) {
  var INSTANTIATING = {},
      providerSuffix = 'Provider',
      path = [],
      loadedModules = new HashMap(),
      providerCache = {
        $provide: {
            provider: supportObject(provider),
            factory: supportObject(factory),
            service: supportObject(service),
            value: supportObject(value),
            constant: supportObject(constant),
            decorator: decorator
          }
      },
      providerInjector = (providerCache.$injector =
          createInternalInjector(providerCache, function() {
            throw $injectorMinErr('unpr', "Unknown provider: {0}", path.join(' <- '));
          })),
      instanceCache = {},
      instanceInjector = (instanceCache.$injector =
          createInternalInjector(instanceCache, function(servicename) {
            var provider = providerInjector.get(servicename + providerSuffix);
            return instanceInjector.invoke(provider.$get, provider);
          }));


  forEach(loadModules(modulesToLoad), function(fn) { instanceInjector.invoke(fn || noop); });

  return instanceInjector;

  ////////////////////////////////////
  // $provider
  ////////////////////////////////////

  function supportObject(delegate) {
    return function(key, value) {
      if (isObject(key)) {
        forEach(key, reverseParams(delegate));
      } else {
        return delegate(key, value);
      }
    }
  }

  function provider(name, provider_) {
    if (isFunction(provider_) || isArray(provider_)) {
      provider_ = providerInjector.instantiate(provider_);
    }
    if (!provider_.$get) {
      throw $injectorMinErr('pget', "Provider '{0}' must define $get factory method.", name);
    }
    return providerCache[name + providerSuffix] = provider_;
  }

  function factory(name, factoryFn) { return provider(name, { $get: factoryFn }); }

  function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
  }

  function value(name, value) { return factory(name, valueFn(value)); }

  function constant(name, value) {
    providerCache[name] = value;
    instanceCache[name] = value;
  }

  function decorator(serviceName, decorFn) {
    var origProvider = providerInjector.get(serviceName + providerSuffix),
        orig$get = origProvider.$get;

    origProvider.$get = function() {
      var origInstance = instanceInjector.invoke(orig$get, origProvider);
      return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
    };
  }

  ////////////////////////////////////
  // Module Loading
  ////////////////////////////////////
  function loadModules(modulesToLoad){
    var runBlocks = [];
    forEach(modulesToLoad, function(module) {
      if (loadedModules.get(module)) return;
      loadedModules.put(module, true);

      try {
        if (isString(module)) {
          var moduleFn = angularModule(module);
          runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);

          for(var invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
            var invokeArgs = invokeQueue[i],
                provider = providerInjector.get(invokeArgs[0]);

            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
          }
        } else if (isFunction(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else if (isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else {
          assertArgFn(module, 'module');
        }
      } catch (e) {
        if (isArray(module)) {
          module = module[module.length - 1];
        }
        if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
          // Safari & FF's stack traces don't contain error.message content unlike those of Chrome and IE
          // So if stack doesn't contain message, we create a new string that contains both.
          // Since error.stack is read-only in Safari, I'm overriding e and not e.stack here.
          e = e.message + '\n' + e.stack;
        }
        throw $injectorMinErr('modulerr', "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e);
      }
    });
    return runBlocks;
  }

  ////////////////////////////////////
  // internal Injector
  ////////////////////////////////////

  function createInternalInjector(cache, factory) {

    function getService(serviceName) {
      if (cache.hasOwnProperty(serviceName)) {
        if (cache[serviceName] === INSTANTIATING) {
          throw $injectorMinErr('cdep', 'Circular dependency found: {0}', path.join(' <- '));
        }
        return cache[serviceName];
      } else {
        try {
          path.unshift(serviceName);
          cache[serviceName] = INSTANTIATING;
          return cache[serviceName] = factory(serviceName);
        } finally {
          path.shift();
        }
      }
    }

    function invoke(fn, self, locals){
      var args = [],
          $inject = annotate(fn),
          length, i,
          key;

      for(i = 0, length = $inject.length; i < length; i++) {
        key = $inject[i];
        if (typeof key !== 'string') {
          throw $injectorMinErr('itkn', 'Incorrect injection token! Expected service name as string, got {0}', key);
        }
        args.push(
          locals && locals.hasOwnProperty(key)
          ? locals[key]
          : getService(key)
        );
      }
      if (!fn.$inject) {
        // this means that we must be an array.
        fn = fn[length];
      }


      // Performance optimization: http://jsperf.com/apply-vs-call-vs-invoke
      switch (self ? -1 : args.length) {
        case  0: return fn();
        case  1: return fn(args[0]);
        case  2: return fn(args[0], args[1]);
        case  3: return fn(args[0], args[1], args[2]);
        case  4: return fn(args[0], args[1], args[2], args[3]);
        case  5: return fn(args[0], args[1], args[2], args[3], args[4]);
        case  6: return fn(args[0], args[1], args[2], args[3], args[4], args[5]);
        case  7: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        case  8: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        case  9: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        case 10: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
        default: return fn.apply(self, args);
      }
    }

    function instantiate(Type, locals) {
      var Constructor = function() {},
          instance, returnedValue;

      // Check if Type is annotated and use just the given function at n-1 as parameter
      // e.g. someModule.factory('greeter', ['$window', function(renamed$window) {}]);
      Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype;
      instance = new Constructor();
      returnedValue = invoke(Type, instance, locals);

      return isObject(returnedValue) ? returnedValue : instance;
    }

    return {
      invoke: invoke,
      instantiate: instantiate,
      get: getService,
      annotate: annotate,
      has: function(name) {
        return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
      }
    };
  }
}

/**
 * @ngdoc function
 * @name ng.$anchorScroll
 * @requires $window
 * @requires $location
 * @requires $rootScope
 *
 * @description
 * When called, it checks current value of `$location.hash()` and scroll to related element,
 * according to rules specified in
 * {@link http://dev.w3.org/html5/spec/Overview.html#the-indicated-part-of-the-document Html5 spec}.
 *
 * It also watches the `$location.hash()` and scrolls whenever it changes to match any anchor.
 * This can be disabled by calling `$anchorScrollProvider.disableAutoScrolling()`.
 * 
 * @example
   <example>
     <file name="index.html">
       <div ng-controller="MainCtrl">
         <a ng-click="gotoBottom()">Go to bottom</a>
         <a id="bottom"></a> You're at the bottom!
       </div>
     </file>
     <file name="script.js">
       function ScrollCtrl($scope, $location, $anchorScroll) {
         $scope.gotoBottom = function (){
           // set the location.hash to the id of
           // the element you wish to scroll to.
           $location.hash('bottom');
           
           // call $anchorScroll()
           $anchorScroll();
         }
       }
     </file>
     <file name="style.css">
       #bottom {
         display: block;
         margin-top: 2000px;
       }
     </file>
   </example>
 */
function $AnchorScrollProvider() {

  var autoScrollingEnabled = true;

  this.disableAutoScrolling = function() {
    autoScrollingEnabled = false;
  };

  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    var document = $window.document;

    // helper function to get first anchor from a NodeList
    // can't use filter.filter, as it accepts only instances of Array
    // and IE can't convert NodeList to an array using [].slice
    // TODO(vojta): use filter if we change it to accept lists as well
    function getFirstAnchor(list) {
      var result = null;
      forEach(list, function(element) {
        if (!result && lowercase(element.nodeName) === 'a') result = element;
      });
      return result;
    }

    function scroll() {
      var hash = $location.hash(), elm;

      // empty hash, scroll to the top of the page
      if (!hash) $window.scrollTo(0, 0);

      // element with given id
      else if ((elm = document.getElementById(hash))) elm.scrollIntoView();

      // first anchor with given name :-D
      else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) elm.scrollIntoView();

      // no element and hash == 'top', scroll to the top of the page
      else if (hash === 'top') $window.scrollTo(0, 0);
    }

    // does not scroll when user clicks on anchor link that is currently on
    // (no url change, no $location.hash() change), browser native does scroll
    if (autoScrollingEnabled) {
      $rootScope.$watch(function autoScrollWatch() {return $location.hash();},
        function autoScrollWatchAction() {
          $rootScope.$evalAsync(scroll);
        });
    }

    return scroll;
  }];
}

var $animateMinErr = minErr('$animate');

/**
 * @ngdoc object
 * @name ng.$animateProvider
 *
 * @description
 * Default implementation of $animate that doesn't perform any animations, instead just synchronously performs DOM
 * updates and calls done() callbacks.
 *
 * In order to enable animations the ngAnimate module has to be loaded.
 *
 * To see the functional implementation check out src/ngAnimate/animate.js
 */
var $AnimateProvider = ['$provide', function($provide) {

  this.$$selectors = {};


  /**
   * @ngdoc function
   * @name ng.$animateProvider#register
   * @methodOf ng.$animateProvider
   *
   * @description
   * Registers a new injectable animation factory function. The factory function produces the animation object which
   * contains callback functions for each event that is expected to be animated.
   *
   *   * `eventFn`: `function(Element, doneFunction)` The element to animate, the `doneFunction` must be called once the
   *   element animation is complete. If a function is returned then the animation service will use this function to
   *   cancel the animation whenever a cancel event is triggered.
   *
   *
   *<pre>
   *   return {
     *     eventFn : function(element, done) {
     *       //code to run the animation
     *       //once complete, then run done()
     *       return function cancellationFunction() {
     *         //code to cancel the animation
     *       }
     *     }
     *   }
   *</pre>
   *
   * @param {string} name The name of the animation.
   * @param {function} factory The factory function that will be executed to return the animation object.
   */
  this.register = function(name, factory) {
    var key = name + '-animation';
    if (name && name.charAt(0) != '.') throw $animateMinErr('notcsel',
        "Expecting class selector starting with '.' got '{0}'.", name);
    this.$$selectors[name.substr(1)] = key;
    $provide.factory(key, factory);
  };

  this.$get = ['$timeout', function($timeout) {

    /**
     * @ngdoc object
     * @name ng.$animate
     *
     * @description
     * The $animate service provides rudimentary DOM manipulation functions to insert, remove, move elements within
     * the DOM as well as adding and removing classes. This service is the core service used by the ngAnimate $animator
     * service which provides high-level animation hooks for CSS and JavaScript. 
     *
     * $animate is available in the AngularJS core, however, the ngAnimate module must be included to enable full out
     * animation support. Otherwise, $animate will only perform simple DOM manipulation operations.
     *
     * To learn more about enabling animation support, click here to visit the {@link ngAnimate ngAnimate module page}
     * as well as the {@link ngAnimate.$animate ngAnimate $animate service page}.
     */
    return {

      /**
       * @ngdoc function
       * @name ng.$animate#enter
       * @methodOf ng.$animate
       * @function
       *
       * @description
       * Inserts the element into the DOM either after the `after` element or within the `parent` element. Once complete,
       * the done() callback will be fired (if provided).
       *
       * @param {jQuery/jqLite element} element the element which will be inserted into the DOM
       * @param {jQuery/jqLite element} parent the parent element which will append the element as a child (if the after element is not present)
       * @param {jQuery/jqLite element} after the sibling element which will append the element after itself
       * @param {function=} done callback function that will be called after the element has been inserted into the DOM
       */
      enter : function(element, parent, after, done) {
        var afterNode = after && after[after.length - 1];
        var parentNode = parent && parent[0] || afterNode && afterNode.parentNode;
        // IE does not like undefined so we have to pass null.
        var afterNextSibling = (afterNode && afterNode.nextSibling) || null;
        forEach(element, function(node) {
          parentNode.insertBefore(node, afterNextSibling);
        });
        done && $timeout(done, 0, false);
      },

      /**
       * @ngdoc function
       * @name ng.$animate#leave
       * @methodOf ng.$animate
       * @function
       *
       * @description
       * Removes the element from the DOM. Once complete, the done() callback will be fired (if provided).
       *
       * @param {jQuery/jqLite element} element the element which will be removed from the DOM
       * @param {function=} done callback function that will be called after the element has been removed from the DOM
       */
      leave : function(element, done) {
        element.remove();
        done && $timeout(done, 0, false);
      },

      /**
       * @ngdoc function
       * @name ng.$animate#move
       * @methodOf ng.$animate
       * @function
       *
       * @description
       * Moves the position of the provided element within the DOM to be placed either after the `after` element or inside of the `parent` element.
       * Once complete, the done() callback will be fired (if provided).
       *
       * @param {jQuery/jqLite element} element the element which will be moved around within the DOM
       * @param {jQuery/jqLite element} parent the parent element where the element will be inserted into (if the after element is not present)
       * @param {jQuery/jqLite element} after the sibling element where the element will be positioned next to
       * @param {function=} done the callback function (if provided) that will be fired after the element has been moved to it's new position
       */
      move : function(element, parent, after, done) {
        // Do not remove element before insert. Removing will cause data associated with the
        // element to be dropped. Insert will implicitly do the remove.
        this.enter(element, parent, after, done);
      },

      /**
       * @ngdoc function
       * @name ng.$animate#addClass
       * @methodOf ng.$animate
       * @function
       *
       * @description
       * Adds the provided className CSS class value to the provided element. Once complete, the done() callback will be fired (if provided).
       *
       * @param {jQuery/jqLite element} element the element which will have the className value added to it
       * @param {string} className the CSS class which will be added to the element
       * @param {function=} done the callback function (if provided) that will be fired after the className value has been added to the element
       */
      addClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        forEach(element, function (element) {
          JQLiteAddClass(element, className);
        });
        done && $timeout(done, 0, false);
      },

      /**
       * @ngdoc function
       * @name ng.$animate#removeClass
       * @methodOf ng.$animate
       * @function
       *
       * @description
       * Removes the provided className CSS class value from the provided element. Once complete, the done() callback will be fired (if provided).
       *
       * @param {jQuery/jqLite element} element the element which will have the className value removed from it
       * @param {string} className the CSS class which will be removed from the element
       * @param {function=} done the callback function (if provided) that will be fired after the className value has been removed from the element
       */
      removeClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        forEach(element, function (element) {
          JQLiteRemoveClass(element, className);
        });
        done && $timeout(done, 0, false);
      },

      enabled : noop
    };
  }];
}];

/**
 * ! This is a private undocumented service !
 *
 * @name ng.$browser
 * @requires $log
 * @description
 * This object has two goals:
 *
 * - hide all the global state in the browser caused by the window object
 * - abstract away all the browser specific features and inconsistencies
 *
 * For tests we provide {@link ngMock.$browser mock implementation} of the `$browser`
 * service, which can be used for convenient testing of the application without the interaction with
 * the real browser apis.
 */
/**
 * @param {object} window The global window object.
 * @param {object} document jQuery wrapped document.
 * @param {function()} XHR XMLHttpRequest constructor.
 * @param {object} $log console.log or an object with the same interface.
 * @param {object} $sniffer $sniffer service
 */
function Browser(window, document, $log, $sniffer) {
  var self = this,
      rawDocument = document[0],
      location = window.location,
      history = window.history,
      setTimeout = window.setTimeout,
      clearTimeout = window.clearTimeout,
      pendingDeferIds = {};

  self.isMock = false;

  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];

  // TODO(vojta): remove this temporary api
  self.$$completeOutstandingRequest = completeOutstandingRequest;
  self.$$incOutstandingRequestCount = function() { outstandingRequestCount++; };

  /**
   * Executes the `fn` function(supports currying) and decrements the `outstandingRequestCallbacks`
   * counter. If the counter reaches 0, all the `outstandingRequestCallbacks` are executed.
   */
  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, sliceArgs(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while(outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  /**
   * @private
   * Note: this method is used only by scenario runner
   * TODO(vojta): prefix this method with $$ ?
   * @param {function()} callback Function that will be called when no outstanding request
   */
  self.notifyWhenNoOutstandingRequests = function(callback) {
    // force browser to execute all pollFns - this is needed so that cookies and other pollers fire
    // at some deterministic time in respect to the test runner's actions. Leaving things up to the
    // regular poller would result in flaky tests.
    forEach(pollFns, function(pollFn){ pollFn(); });

    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

  //////////////////////////////////////////////////////////////
  // Poll Watcher API
  //////////////////////////////////////////////////////////////
  var pollFns = [],
      pollTimeout;

  /**
   * @name ng.$browser#addPollFn
   * @methodOf ng.$browser
   *
   * @param {function()} fn Poll function to add
   *
   * @description
   * Adds a function to the list of functions that poller periodically executes,
   * and starts polling if not started yet.
   *
   * @returns {function()} the added function
   */
  self.addPollFn = function(fn) {
    if (isUndefined(pollTimeout)) startPoller(100, setTimeout);
    pollFns.push(fn);
    return fn;
  };

  /**
   * @param {number} interval How often should browser call poll functions (ms)
   * @param {function()} setTimeout Reference to a real or fake `setTimeout` function.
   *
   * @description
   * Configures the poller to run in the specified intervals, using the specified
   * setTimeout fn and kicks it off.
   */
  function startPoller(interval, setTimeout) {
    (function check() {
      forEach(pollFns, function(pollFn){ pollFn(); });
      pollTimeout = setTimeout(check, interval);
    })();
  }

  //////////////////////////////////////////////////////////////
  // URL API
  //////////////////////////////////////////////////////////////

  var lastBrowserUrl = location.href,
      baseElement = document.find('base'),
      replacedUrl = null;

  /**
   * @name ng.$browser#url
   * @methodOf ng.$browser
   *
   * @description
   * GETTER:
   * Without any argument, this method just returns current value of location.href.
   *
   * SETTER:
   * With at least one argument, this method sets url to new value.
   * If html5 history api supported, pushState/replaceState is used, otherwise
   * location.href/location.replace is used.
   * Returns its own instance to allow chaining
   *
   * NOTE: this api is intended for use only by the $location service. Please use the
   * {@link ng.$location $location service} to change url.
   *
   * @param {string} url New url (when used as setter)
   * @param {boolean=} replace Should new url replace current history record ?
   */
  self.url = function(url, replace) {
    // setter
    if (url) {
      if (lastBrowserUrl == url) return;
      lastBrowserUrl = url;
      if ($sniffer.history) {
        if (replace) history.replaceState(null, '', url);
        else {
          history.pushState(null, '', url);
          // Crazy Opera Bug: http://my.opera.com/community/forums/topic.dml?id=1185462
          baseElement.attr('href', baseElement.attr('href'));
        }
      } else {
        if (replace) {
          location.replace(url);
          replacedUrl = url;
        } else {
          location.href = url;
          replacedUrl = null;
        }
      }
      return self;
    // getter
    } else {
      // - the replacedUrl is a workaround for an IE8-9 issue with location.replace method that doesn't update
      //   location.href synchronously
      // - the replacement is a workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=407172
      return replacedUrl || location.href.replace(/%27/g,"'");
    }
  };

  var urlChangeListeners = [],
      urlChangeInit = false;

  function fireUrlChange() {
    if (lastBrowserUrl == self.url()) return;

    lastBrowserUrl = self.url();
    forEach(urlChangeListeners, function(listener) {
      listener(self.url());
    });
  }

  /**
   * @name ng.$browser#onUrlChange
   * @methodOf ng.$browser
   * @TODO(vojta): refactor to use node's syntax for events
   *
   * @description
   * Register callback function that will be called, when url changes.
   *
   * It's only called when the url is changed by outside of angular:
   * - user types different url into address bar
   * - user clicks on history (forward/back) button
   * - user clicks on a link
   *
   * It's not called when url is changed by $browser.url() method
   *
   * The listener gets called with new url as parameter.
   *
   * NOTE: this api is intended for use only by the $location service. Please use the
   * {@link ng.$location $location service} to monitor url changes in angular apps.
   *
   * @param {function(string)} listener Listener function to be called when url changes.
   * @return {function(string)} Returns the registered listener fn - handy if the fn is anonymous.
   */
  self.onUrlChange = function(callback) {
    if (!urlChangeInit) {
      // We listen on both (hashchange/popstate) when available, as some browsers (e.g. Opera)
      // don't fire popstate when user change the address bar and don't fire hashchange when url
      // changed by push/replaceState

      // html5 history api - popstate event
      if ($sniffer.history) jqLite(window).on('popstate', fireUrlChange);
      // hashchange event
      if ($sniffer.hashchange) jqLite(window).on('hashchange', fireUrlChange);
      // polling
      else self.addPollFn(fireUrlChange);

      urlChangeInit = true;
    }

    urlChangeListeners.push(callback);
    return callback;
  };

  //////////////////////////////////////////////////////////////
  // Misc API
  //////////////////////////////////////////////////////////////

  /**
   * @name ng.$browser#baseHref
   * @methodOf ng.$browser
   * 
   * @description
   * Returns current <base href>
   * (always relative - without domain)
   *
   * @returns {string=} current <base href>
   */
  self.baseHref = function() {
    var href = baseElement.attr('href');
    return href ? href.replace(/^https?\:\/\/[^\/]*/, '') : '';
  };

  //////////////////////////////////////////////////////////////
  // Cookies API
  //////////////////////////////////////////////////////////////
  var lastCookies = {};
  var lastCookieString = '';
  var cookiePath = self.baseHref();

  /**
   * @name ng.$browser#cookies
   * @methodOf ng.$browser
   *
   * @param {string=} name Cookie name
   * @param {string=} value Cookie value
   *
   * @description
   * The cookies method provides a 'private' low level access to browser cookies.
   * It is not meant to be used directly, use the $cookie service instead.
   *
   * The return values vary depending on the arguments that the method was called with as follows:
   * <ul>
   *   <li>cookies() -> hash of all cookies, this is NOT a copy of the internal state, so do not modify it</li>
   *   <li>cookies(name, value) -> set name to value, if value is undefined delete the cookie</li>
   *   <li>cookies(name) -> the same as (name, undefined) == DELETES (no one calls it right now that way)</li>
   * </ul>
   *
   * @returns {Object} Hash of all cookies (if called without any parameter)
   */
  self.cookies = function(name, value) {
    var cookieLength, cookieArray, cookie, i, index;

    if (name) {
      if (value === undefined) {
        rawDocument.cookie = escape(name) + "=;path=" + cookiePath + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        if (isString(value)) {
          cookieLength = (rawDocument.cookie = escape(name) + '=' + escape(value) + ';path=' + cookiePath).length + 1;

          // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
          // - 300 cookies
          // - 20 cookies per unique domain
          // - 4096 bytes per cookie
          if (cookieLength > 4096) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because it was too large ("+
              cookieLength + " > 4096 bytes)!");
          }
        }
      }
    } else {
      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf('=');
          if (index > 0) { //ignore nameless cookies
            var name = unescape(cookie.substring(0, index));
            // the first value that is seen for a cookie is the most
            // specific one.  values for the same cookie name that
            // follow are for less specific paths.
            if (lastCookies[name] === undefined) {
              lastCookies[name] = unescape(cookie.substring(index + 1));
            }
          }
        }
      }
      return lastCookies;
    }
  };


  /**
   * @name ng.$browser#defer
   * @methodOf ng.$browser
   * @param {function()} fn A function, who's execution should be deferred.
   * @param {number=} [delay=0] of milliseconds to defer the function execution.
   * @returns {*} DeferId that can be used to cancel the task via `$browser.defer.cancel()`.
   *
   * @description
   * Executes a fn asynchronously via `setTimeout(fn, delay)`.
   *
   * Unlike when calling `setTimeout` directly, in test this function is mocked and instead of using
   * `setTimeout` in tests, the fns are queued in an array, which can be programmatically flushed
   * via `$browser.defer.flush()`.
   *
   */
  self.defer = function(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function() {
      delete pendingDeferIds[timeoutId];
      completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
  };


  /**
   * @name ng.$browser#defer.cancel
   * @methodOf ng.$browser.defer
   *
   * @description
   * Cancels a deferred task identified with `deferId`.
   *
   * @param {*} deferId Token returned by the `$browser.defer` function.
   * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully canceled.
   */
  self.defer.cancel = function(deferId) {
    if (pendingDeferIds[deferId]) {
      delete pendingDeferIds[deferId];
      clearTimeout(deferId);
      completeOutstandingRequest(noop);
      return true;
    }
    return false;
  };

}

function $BrowserProvider(){
  this.$get = ['$window', '$log', '$sniffer', '$document',
      function( $window,   $log,   $sniffer,   $document){
        return new Browser($window, $document, $log, $sniffer);
      }];
}

/**
 * @ngdoc object
 * @name ng.$cacheFactory
 *
 * @description
 * Factory that constructs cache objects and gives access to them.
 * 
 * <pre>
 * 
 *  var cache = $cacheFactory('cacheId');
 *  expect($cacheFactory.get('cacheId')).toBe(cache);
 *  expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();
 *
 *  cache.put("key", "value");
 *  cache.put("another key", "another value");
 * 
 *  expect(cache.info()).toEqual({id: 'cacheId', size: 2}); // Since we've specified no options on creation
 * 
 * </pre>
 *
 *
 * @param {string} cacheId Name or id of the newly created cache.
 * @param {object=} options Options object that specifies the cache behavior. Properties:
 *
 *   - `{number=}` `capacity` — turns the cache into LRU cache.
 *
 * @returns {object} Newly created cache object with the following set of methods:
 *
 * - `{object}` `info()` — Returns id, size, and options of cache.
 * - `{{*}}` `put({string} key, {*} value)` — Puts a new key-value pair into the cache and returns it.
 * - `{{*}}` `get({string} key)` — Returns cached value for `key` or undefined for cache miss.
 * - `{void}` `remove({string} key)` — Removes a key-value pair from the cache.
 * - `{void}` `removeAll()` — Removes all cached values.
 * - `{void}` `destroy()` — Removes references to this cache from $cacheFactory.
 *
 */
function $CacheFactoryProvider() {

  this.$get = function() {
    var caches = {};

    function cacheFactory(cacheId, options) {
      if (cacheId in caches) {
        throw minErr('$cacheFactory')('iid', "CacheId '{0}' is already taken!", cacheId);
      }

      var size = 0,
          stats = extend({}, options, {id: cacheId}),
          data = {},
          capacity = (options && options.capacity) || Number.MAX_VALUE,
          lruHash = {},
          freshEnd = null,
          staleEnd = null;

      return caches[cacheId] = {

        put: function(key, value) {
          var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

          refresh(lruEntry);

          if (isUndefined(value)) return;
          if (!(key in data)) size++;
          data[key] = value;

          if (size > capacity) {
            this.remove(staleEnd.key);
          }

          return value;
        },


        get: function(key) {
          var lruEntry = lruHash[key];

          if (!lruEntry) return;

          refresh(lruEntry);

          return data[key];
        },


        remove: function(key) {
          var lruEntry = lruHash[key];

          if (!lruEntry) return;

          if (lruEntry == freshEnd) freshEnd = lruEntry.p;
          if (lruEntry == staleEnd) staleEnd = lruEntry.n;
          link(lruEntry.n,lruEntry.p);

          delete lruHash[key];
          delete data[key];
          size--;
        },


        removeAll: function() {
          data = {};
          size = 0;
          lruHash = {};
          freshEnd = staleEnd = null;
        },


        destroy: function() {
          data = null;
          stats = null;
          lruHash = null;
          delete caches[cacheId];
        },


        info: function() {
          return extend({}, stats, {size: size});
        }
      };


      /**
       * makes the `entry` the freshEnd of the LRU linked list
       */
      function refresh(entry) {
        if (entry != freshEnd) {
          if (!staleEnd) {
            staleEnd = entry;
          } else if (staleEnd == entry) {
            staleEnd = entry.n;
          }

          link(entry.n, entry.p);
          link(entry, freshEnd);
          freshEnd = entry;
          freshEnd.n = null;
        }
      }


      /**
       * bidirectionally links two entries of the LRU linked list
       */
      function link(nextEntry, prevEntry) {
        if (nextEntry != prevEntry) {
          if (nextEntry) nextEntry.p = prevEntry; //p stands for previous, 'prev' didn't minify
          if (prevEntry) prevEntry.n = nextEntry; //n stands for next, 'next' didn't minify
        }
      }
    }


  /**
   * @ngdoc method
   * @name ng.$cacheFactory#info
   * @methodOf ng.$cacheFactory
   *
   * @description
   * Get information about all the of the caches that have been created
   *
   * @returns {Object} - key-value map of `cacheId` to the result of calling `cache#info`
   */
    cacheFactory.info = function() {
      var info = {};
      forEach(caches, function(cache, cacheId) {
        info[cacheId] = cache.info();
      });
      return info;
    };


  /**
   * @ngdoc method
   * @name ng.$cacheFactory#get
   * @methodOf ng.$cacheFactory
   *
   * @description
   * Get access to a cache object by the `cacheId` used when it was created.
   *
   * @param {string} cacheId Name or id of a cache to access.
   * @returns {object} Cache object identified by the cacheId or undefined if no such cache.
   */
    cacheFactory.get = function(cacheId) {
      return caches[cacheId];
    };


    return cacheFactory;
  };
}

/**
 * @ngdoc object
 * @name ng.$templateCache
 *
 * @description
 * The first time a template is used, it is loaded in the template cache for quick retrieval. You can
 * load templates directly into the cache in a `script` tag, or by consuming the `$templateCache`
 * service directly.
 * 
 * Adding via the `script` tag:
 * <pre>
 * <html ng-app>
 * <head>
 * <script type="text/ng-template" id="templateId.html">
 *   This is the content of the template
 * </script>
 * </head>
 *   ...
 * </html>
 * </pre>
 * 
 * **Note:** the `script` tag containing the template does not need to be included in the `head` of the document, but 
 * it must be below the `ng-app` definition.
 * 
 * Adding via the $templateCache service:
 * 
 * <pre>
 * var myApp = angular.module('myApp', []);
 * myApp.run(function($templateCache) {
 *   $templateCache.put('templateId.html', 'This is the content of the template');
 * });
 * </pre>
 * 
 * To retrieve the template later, simply use it in your HTML:
 * <pre>
 * <div ng-include=" 'templateId.html' "></div>
 * </pre>
 * 
 * or get it via Javascript:
 * <pre>
 * $templateCache.get('templateId.html')
 * </pre>
 * 
 * See {@link ng.$cacheFactory $cacheFactory}.
 *
 */
function $TemplateCacheProvider() {
  this.$get = ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('templates');
  }];
}

/* ! VARIABLE/FUNCTION NAMING CONVENTIONS THAT APPLY TO THIS FILE!
 *
 * DOM-related variables:
 *
 * - "node" - DOM Node
 * - "element" - DOM Element or Node
 * - "$node" or "$element" - jqLite-wrapped node or element
 *
 *
 * Compiler related stuff:
 *
 * - "linkFn" - linking fn of a single directive
 * - "nodeLinkFn" - function that aggregates all linking fns for a particular node
 * - "childLinkFn" -  function that aggregates all linking fns for child nodes of a particular node
 * - "compositeLinkFn" - function that aggregates all linking fns for a compilation root (nodeList)
 */


/**
 * @ngdoc function
 * @name ng.$compile
 * @function
 *
 * @description
 * Compiles a piece of HTML string or DOM into a template and produces a template function, which
 * can then be used to link {@link ng.$rootScope.Scope scope} and the template together.
 *
 * The compilation is a process of walking the DOM tree and trying to match DOM elements to
 * {@link ng.$compileProvider#directive directives}. For each match it
 * executes corresponding template function and collects the
 * instance functions into a single template function which is then returned.
 *
 * The template function can then be used once to produce the view or as it is the case with
 * {@link ng.directive:ngRepeat repeater} many-times, in which
 * case each call results in a view that is a DOM clone of the original template.
 *
 <doc:example module="compile">
   <doc:source>
    <script>
      // declare a new module, and inject the $compileProvider
      angular.module('compile', [], function($compileProvider) {
        // configure new 'compile' directive by passing a directive
        // factory function. The factory function injects the '$compile'
        $compileProvider.directive('compile', function($compile) {
          // directive factory creates a link function
          return function(scope, element, attrs) {
            scope.$watch(
              function(scope) {
                 // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
              },
              function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
              }
            );
          };
        })
      });

      function Ctrl($scope) {
        $scope.name = 'Angular';
        $scope.html = 'Hello {{name}}';
      }
    </script>
    <div ng-controller="Ctrl">
      <input ng-model="name"> <br>
      <textarea ng-model="html"></textarea> <br>
      <div compile="html"></div>
    </div>
   </doc:source>
   <doc:scenario>
     it('should auto compile', function() {
       expect(element('div[compile]').text()).toBe('Hello Angular');
       input('html').enter('{{name}}!');
       expect(element('div[compile]').text()).toBe('Angular!');
     });
   </doc:scenario>
 </doc:example>

 *
 *
 * @param {string|DOMElement} element Element or HTML string to compile into a template function.
 * @param {function(angular.Scope[, cloneAttachFn]} transclude function available to directives.
 * @param {number} maxPriority only apply directives lower then given priority (Only effects the
 *                 root element(s), not their children)
 * @returns {function(scope[, cloneAttachFn])} a link function which is used to bind template
 * (a DOM element/tree) to a scope. Where:
 *
 *  * `scope` - A {@link ng.$rootScope.Scope Scope} to bind to.
 *  * `cloneAttachFn` - If `cloneAttachFn` is provided, then the link function will clone the
 *               `template` and call the `cloneAttachFn` function allowing the caller to attach the
 *               cloned elements to the DOM document at the appropriate place. The `cloneAttachFn` is
 *               called as: <br> `cloneAttachFn(clonedElement, scope)` where:
 *
 *      * `clonedElement` - is a clone of the original `element` passed into the compiler.
 *      * `scope` - is the current scope with which the linking function is working with.
 *
 * Calling the linking function returns the element of the template. It is either the original element
 * passed in, or the clone of the element if the `cloneAttachFn` is provided.
 *
 * After linking the view is not updated until after a call to $digest which typically is done by
 * Angular automatically.
 *
 * If you need access to the bound view, there are two ways to do it:
 *
 * - If you are not asking the linking function to clone the template, create the DOM element(s)
 *   before you send them to the compiler and keep this reference around.
 *   <pre>
 *     var element = $compile('<p>{{total}}</p>')(scope);
 *   </pre>
 *
 * - if on the other hand, you need the element to be cloned, the view reference from the original
 *   example would not point to the clone, but rather to the original template that was cloned. In
 *   this case, you can access the clone via the cloneAttachFn:
 *   <pre>
 *     var templateHTML = angular.element('<p>{{total}}</p>'),
 *         scope = ....;
 *
 *     var clonedElement = $compile(templateHTML)(scope, function(clonedElement, scope) {
 *       //attach the clone to DOM document at the right place
 *     });
 *
 *     //now we have reference to the cloned DOM via `clone`
 *   </pre>
 *
 *
 * For information on how the compiler works, see the
 * {@link guide/compiler Angular HTML Compiler} section of the Developer Guide.
 */

var $compileMinErr = minErr('$compile');

/**
 * @ngdoc service
 * @name ng.$compileProvider
 * @function
 *
 * @description
 */
$CompileProvider.$inject = ['$provide'];
function $CompileProvider($provide) {
  var hasDirectives = {},
      Suffix = 'Directive',
      COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,
      CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/,
      aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|file):/,
      imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;

  // Ref: http://developers.whatwg.org/webappapis.html#event-handler-idl-attributes
  // The assumption is that future DOM event attribute names will begin with
  // 'on' and be composed of only English letters.
  var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]*|formaction)$/;

  /**
   * @ngdoc function
   * @name ng.$compileProvider#directive
   * @methodOf ng.$compileProvider
   * @function
   *
   * @description
   * Register a new directive with the compiler.
   *
   * @param {string|Object} name Name of the directive in camel-case (i.e. <code>ngBind</code> which
   *    will match as <code>ng-bind</code>), or an object map of directives where the keys are the
   *    names and the values are the factories.
   * @param {function|Array} directiveFactory An injectable directive factory function. See
   *    {@link guide/directive} for more info.
   * @returns {ng.$compileProvider} Self for chaining.
   */
   this.directive = function registerDirective(name, directiveFactory) {
    if (isString(name)) {
      assertArg(directiveFactory, 'directiveFactory');
      if (!hasDirectives.hasOwnProperty(name)) {
        hasDirectives[name] = [];
        $provide.factory(name + Suffix, ['$injector', '$exceptionHandler',
          function($injector, $exceptionHandler) {
            var directives = [];
            forEach(hasDirectives[name], function(directiveFactory) {
              try {
                var directive = $injector.invoke(directiveFactory);
                if (isFunction(directive)) {
                  directive = { compile: valueFn(directive) };
                } else if (!directive.compile && directive.link) {
                  directive.compile = valueFn(directive.link);
                }
                directive.priority = directive.priority || 0;
                directive.name = directive.name || name;
                directive.require = directive.require || (directive.controller && directive.name);
                directive.restrict = directive.restrict || 'A';
                directives.push(directive);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
            return directives;
          }]);
      }
      hasDirectives[name].push(directiveFactory);
    } else {
      forEach(name, reverseParams(registerDirective));
    }
    return this;
  };


  /**
   * @ngdoc function
   * @name ng.$compileProvider#aHrefSanitizationWhitelist
   * @methodOf ng.$compileProvider
   * @function
   *
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during a[href] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   *
   * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.aHrefSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      aHrefSanitizationWhitelist = regexp;
      return this;
    }
    return aHrefSanitizationWhitelist;
  };


  /**
   * @ngdoc function
   * @name ng.$compileProvider#imgSrcSanitizationWhitelist
   * @methodOf ng.$compileProvider
   * @function
   *
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during img[src] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   *
   * Any url about to be assigned to img[src] via data-binding is first normalized and turned into an
   * absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist` regular
   * expression. If a match is found, the original url is written into the dom. Otherwise, the
   * absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.imgSrcSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      imgSrcSanitizationWhitelist = regexp;
      return this;
    }
    return imgSrcSanitizationWhitelist;
  };


  this.$get = [
            '$injector', '$interpolate', '$exceptionHandler', '$http', '$templateCache', '$parse',
            '$controller', '$rootScope', '$document', '$sce', '$$urlUtils', '$animate',
    function($injector,   $interpolate,   $exceptionHandler,   $http,   $templateCache,   $parse,
             $controller,   $rootScope,   $document,   $sce,   $$urlUtils, $animate) {

    var Attributes = function(element, attr) {
      this.$$element = element;
      this.$attr = attr || {};
    };

    Attributes.prototype = {
      $normalize: directiveNormalize,


      /**
       * @ngdoc function
       * @name ng.$compile.directive.Attributes#$addClass
       * @methodOf ng.$compile.directive.Attributes
       * @function
       *
       * @description
       * Adds the CSS class value specified by the classVal parameter to the element. If animations
       * are enabled then an animation will be triggered for the class addition.
       *
       * @param {string} classVal The className value that will be added to the element
       */
      $addClass : function(classVal) {
        if(classVal && classVal.length > 0) {
          $animate.addClass(this.$$element, classVal);
        }
      },

      /**
       * @ngdoc function
       * @name ng.$compile.directive.Attributes#$removeClass
       * @methodOf ng.$compile.directive.Attributes
       * @function
       *
       * @description
       * Removes the CSS class value specified by the classVal parameter from the element. If animations
       * are enabled then an animation will be triggered for the class removal.
       *
       * @param {string} classVal The className value that will be removed from the element
       */
      $removeClass : function(classVal) {
        if(classVal && classVal.length > 0) {
          $animate.removeClass(this.$$element, classVal);
        }
      },

      /**
       * Set a normalized attribute on the element in a way such that all directives
       * can share the attribute. This function properly handles boolean attributes.
       * @param {string} key Normalized key. (ie ngAttribute)
       * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
       * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.
       *     Defaults to true.
       * @param {string=} attrName Optional none normalized name. Defaults to key.
       */
      $set: function(key, value, writeAttr, attrName) {
        //special case for class attribute addition + removal
        //so that class changes can tap into the animation
        //hooks provided by the $animate service
        if(key == 'class') {
          value = value || '';
          var current = this.$$element.attr('class') || '';
          this.$removeClass(tokenDifference(current, value).join(' '));
          this.$addClass(tokenDifference(value, current).join(' '));
        } else {
          var booleanKey = getBooleanAttrName(this.$$element[0], key),
              normalizedVal,
              nodeName;

          if (booleanKey) {
            this.$$element.prop(key, value);
            attrName = booleanKey;
          }

          this[key] = value;

          // translate normalized key to actual key
          if (attrName) {
            this.$attr[key] = attrName;
          } else {
            attrName = this.$attr[key];
            if (!attrName) {
              this.$attr[key] = attrName = snake_case(key, '-');
            }
          }

          nodeName = nodeName_(this.$$element);

          // sanitize a[href] and img[src] values
          if ((nodeName === 'A' && key === 'href') ||
              (nodeName === 'IMG' && key === 'src')) {
            // NOTE: $$urlUtils.resolve() doesn't support IE < 8 so we don't sanitize for that case.
            if (!msie || msie >= 8 ) {
              normalizedVal = $$urlUtils.resolve(value);
              if (normalizedVal !== '') {
                if ((key === 'href' && !normalizedVal.match(aHrefSanitizationWhitelist)) ||
                    (key === 'src' && !normalizedVal.match(imgSrcSanitizationWhitelist))) {
                  this[key] = value = 'unsafe:' + normalizedVal;
                }
              }
            }
          }

          if (writeAttr !== false) {
            if (value === null || value === undefined) {
              this.$$element.removeAttr(attrName);
            } else {
              this.$$element.attr(attrName, value);
            }
          }
        }

        // fire observers
        var $$observers = this.$$observers;
        $$observers && forEach($$observers[key], function(fn) {
          try {
            fn(value);
          } catch (e) {
            $exceptionHandler(e);
          }
        });

        function tokenDifference(str1, str2) {
          var values = [],
              tokens1 = str1.split(/\s+/),
              tokens2 = str2.split(/\s+/);

          outer:
          for(var i=0;i<tokens1.length;i++) {
            var token = tokens1[i];
            for(var j=0;j<tokens2.length;j++) {
              if(token == tokens2[j]) continue outer;
            }
            values.push(token);
          }
          return values;
        };
      },


      /**
       * @ngdoc function
       * @name ng.$compile.directive.Attributes#$observe
       * @methodOf ng.$compile.directive.Attributes
       * @function
       *
       * @description
       * Observe an interpolated attribute.
       * The observer will never be called, if given attribute is not interpolated.
       * The interpolated value of the attribute is passed to the observer function.
       *
       * @param {string} key Normalized key. (ie ngAttribute) .
       * @param {function(interpolatedValue)} fn Function that will be called whenever
                the interpolated value of the attribute changes.
       *        See the {@link guide/directive#Attributes Directives} guide for more info.
       * @returns {function()} the `fn` parameter.
       */
      $observe: function(key, fn) {
        var attrs = this,
            $$observers = (attrs.$$observers || (attrs.$$observers = {})),
            listeners = ($$observers[key] || ($$observers[key] = []));

        listeners.push(fn);
        $rootScope.$evalAsync(function() {
          if (!listeners.$$inter) {
            // no one registered attribute interpolation function, so lets call it manually
            fn(attrs[key]);
          }
        });
        return fn;
      }
    };

    var urlSanitizationNode = $document[0].createElement('a'),
        startSymbol = $interpolate.startSymbol(),
        endSymbol = $interpolate.endSymbol(),
        denormalizeTemplate = (startSymbol == '{{' || endSymbol  == '}}')
            ? identity
            : function denormalizeTemplate(template) {
              return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
        },
        NG_ATTR_BINDING = /^ngAttr[A-Z]/;


    return compile;

    //================================

    function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective) {
      if (!($compileNodes instanceof jqLite)) {
        // jquery always rewraps, whereas we need to preserve the original selector so that we can modify it.
        $compileNodes = jqLite($compileNodes);
      }
      // We can not compile top level text elements since text nodes can be merged and we will
      // not be able to attach scope data to them, so we will wrap them in <span>
      forEach($compileNodes, function(node, index){
        if (node.nodeType == 3 /* text node */ && node.nodeValue.match(/\S+/) /* non-empty */ ) {
          $compileNodes[index] = node = jqLite(node).wrap('<span></span>').parent()[0];
        }
      });
      var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective);
      return function publicLinkFn(scope, cloneConnectFn){
        assertArg(scope, 'scope');
        // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart
        // and sometimes changes the structure of the DOM.
        var $linkNode = cloneConnectFn
          ? JQLitePrototype.clone.call($compileNodes) // IMPORTANT!!!
          : $compileNodes;

        // Attach scope only to non-text nodes.
        for(var i = 0, ii = $linkNode.length; i<ii; i++) {
          var node = $linkNode[i];
          if (node.nodeType == 1 /* element */ || node.nodeType == 9 /* document */) {
            $linkNode.eq(i).data('$scope', scope);
          }
        }
        safeAddClass($linkNode, 'ng-scope');
        if (cloneConnectFn) cloneConnectFn($linkNode, scope);
        if (compositeLinkFn) compositeLinkFn(scope, $linkNode, $linkNode);
        return $linkNode;
      };
    }

    function safeAddClass($element, className) {
      try {
        $element.addClass(className);
      } catch(e) {
        // ignore, since it means that we are trying to set class on
        // SVG element, where class name is read-only.
      }
    }

    /**
     * Compile function matches each node in nodeList against the directives. Once all directives
     * for a particular node are collected their compile functions are executed. The compile
     * functions return values - the linking functions - are combined into a composite linking
     * function, which is the a linking function for the node.
     *
     * @param {NodeList} nodeList an array of nodes or NodeList to compile
     * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the
     *        scope argument is auto-generated to the new child of the transcluded parent scope.
     * @param {DOMElement=} $rootElement If the nodeList is the root of the compilation tree then the
     *        rootElement must be set the jqLite collection of the compile root. This is
     *        needed so that the jqLite collection items can be replaced with widgets.
     * @param {number=} max directive priority
     * @returns {?function} A composite linking function of all of the matched directives or null.
     */
    function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective) {
      var linkFns = [],
          nodeLinkFn, childLinkFn, directives, attrs, linkFnFound;

      for(var i = 0; i < nodeList.length; i++) {
        attrs = new Attributes();

        // we must always refer to nodeList[i] since the nodes can be replaced underneath us.
        directives = collectDirectives(nodeList[i], [], attrs, i == 0 ? maxPriority : undefined, ignoreDirective);

        nodeLinkFn = (directives.length)
            ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement)
            : null;

        childLinkFn = (nodeLinkFn && nodeLinkFn.terminal || !nodeList[i].childNodes || !nodeList[i].childNodes.length)
            ? null
            : compileNodes(nodeList[i].childNodes,
                 nodeLinkFn ? nodeLinkFn.transclude : transcludeFn);

        linkFns.push(nodeLinkFn);
        linkFns.push(childLinkFn);
        linkFnFound = (linkFnFound || nodeLinkFn || childLinkFn);
      }

      // return a linking function if we have found anything, null otherwise
      return linkFnFound ? compositeLinkFn : null;

      function compositeLinkFn(scope, nodeList, $rootElement, boundTranscludeFn) {
        var nodeLinkFn, childLinkFn, node, childScope, childTranscludeFn, i, ii, n;

        // copy nodeList so that linking doesn't break due to live list updates.
        var stableNodeList = [];
        for (i = 0, ii = nodeList.length; i < ii; i++) {
          stableNodeList.push(nodeList[i]);
        }

        for(i = 0, n = 0, ii = linkFns.length; i < ii; n++) {
          node = stableNodeList[n];
          nodeLinkFn = linkFns[i++];
          childLinkFn = linkFns[i++];

          if (nodeLinkFn) {
            if (nodeLinkFn.scope) {
              childScope = scope.$new(isObject(nodeLinkFn.scope));
              jqLite(node).data('$scope', childScope);
            } else {
              childScope = scope;
            }
            childTranscludeFn = nodeLinkFn.transclude;
            if (childTranscludeFn || (!boundTranscludeFn && transcludeFn)) {
              nodeLinkFn(childLinkFn, childScope, node, $rootElement,
                  (function(transcludeFn) {
                    return function(cloneFn) {
                      var transcludeScope = scope.$new();
                      transcludeScope.$$transcluded = true;

                      return transcludeFn(transcludeScope, cloneFn).
                          on('$destroy', bind(transcludeScope, transcludeScope.$destroy));
                    };
                  })(childTranscludeFn || transcludeFn)
              );
            } else {
              nodeLinkFn(childLinkFn, childScope, node, undefined, boundTranscludeFn);
            }
          } else if (childLinkFn) {
            childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);
          }
        }
      }
    }


    /**
     * Looks for directives on the given node and adds them to the directive collection which is
     * sorted.
     *
     * @param node Node to search.
     * @param directives An array to which the directives are added to. This array is sorted before
     *        the function returns.
     * @param attrs The shared attrs object which is used to populate the normalized attributes.
     * @param {number=} maxPriority Max directive priority.
     */
    function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
      var nodeType = node.nodeType,
          attrsMap = attrs.$attr,
          match,
          className;

      switch(nodeType) {
        case 1: /* Element */
          // use the node name: <directive>
          addDirective(directives,
              directiveNormalize(nodeName_(node).toLowerCase()), 'E', maxPriority, ignoreDirective);

          // iterate over the attributes
          for (var attr, name, nName, ngAttrName, value, nAttrs = node.attributes,
                   j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
            var attrStartName = false;
            var attrEndName = false;

            attr = nAttrs[j];
            if (!msie || msie >= 8 || attr.specified) {
              name = attr.name;
              // support ngAttr attribute binding
              ngAttrName = directiveNormalize(name);
              if (NG_ATTR_BINDING.test(ngAttrName)) {
                name = ngAttrName.substr(6).toLowerCase();
              }

              var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
              if (ngAttrName === directiveNName + 'Start') {
                attrStartName = name;
                attrEndName = name.substr(0, name.length - 5) + 'end';
                name = name.substr(0, name.length - 6);
              }

              nName = directiveNormalize(name.toLowerCase());
              attrsMap[nName] = name;
              attrs[nName] = value = trim((msie && name == 'href')
                ? decodeURIComponent(node.getAttribute(name, 2))
                : attr.value);
              if (getBooleanAttrName(node, nName)) {
                attrs[nName] = true; // presence means true
              }
              addAttrInterpolateDirective(node, directives, value, nName);
              addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName, attrEndName);
            }
          }

          // use class as directive
          className = node.className;
          if (isString(className) && className !== '') {
            while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
              nName = directiveNormalize(match[2]);
              if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                attrs[nName] = trim(match[3]);
              }
              className = className.substr(match.index + match[0].length);
            }
          }
          break;
        case 3: /* Text Node */
          addTextInterpolateDirective(directives, node.nodeValue);
          break;
        case 8: /* Comment */
          try {
            match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
            if (match) {
              nName = directiveNormalize(match[1]);
              if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                attrs[nName] = trim(match[2]);
              }
            }
          } catch (e) {
            // turns out that under some circumstances IE9 throws errors when one attempts to read comment's node value.
            // Just ignore it and continue. (Can't seem to reproduce in test case.)
          }
          break;
      }

      directives.sort(byPriority);
      return directives;
    }

    /**
     * Given a node with an directive-start it collects all of the siblings until it find directive-end.
     * @param node
     * @param attrStart
     * @param attrEnd
     * @returns {*}
     */
    function groupScan(node, attrStart, attrEnd) {
      var nodes = [];
      var depth = 0;
      if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
        var startNode = node;
        do {
          if (!node) {
            throw $compileMinErr('uterdir', "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
          }
          if (node.nodeType == 1 /** Element **/) {
            if (node.hasAttribute(attrStart)) depth++;
            if (node.hasAttribute(attrEnd)) depth--;
          }
          nodes.push(node);
          node = node.nextSibling;
        } while (depth > 0);
      } else {
        nodes.push(node);
      }

      return jqLite(nodes);
    }

    /**
     * Wrapper for linking function which converts normal linking function into a grouped
     * linking function.
     * @param linkFn
     * @param attrStart
     * @param attrEnd
     * @returns {Function}
     */
    function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
      return function(scope, element, attrs, controllers) {
        element = groupScan(element[0], attrStart, attrEnd);
        return linkFn(scope, element, attrs, controllers);
      }
    }

    /**
     * Once the directives have been collected, their compile functions are executed. This method
     * is responsible for inlining directive templates as well as terminating the application
     * of the directives if the terminal directive has been reached.
     *
     * @param {Array} directives Array of collected directives to execute their compile function.
     *        this needs to be pre-sorted by priority order.
     * @param {Node} compileNode The raw DOM node to apply the compile functions to
     * @param {Object} templateAttrs The shared attribute function
     * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the
     *        scope argument is auto-generated to the new child of the transcluded parent scope.
     * @param {JQLite} jqCollection If we are working on the root of the compile tree then this
     *        argument has the root jqLite array so that we can replace nodes on it.
     * @returns linkFn
     */
    function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective) {
      var terminalPriority = -Number.MAX_VALUE,
          preLinkFns = [],
          postLinkFns = [],
          newScopeDirective = null,
          newIsolateScopeDirective = null,
          templateDirective = null,
          $compileNode = templateAttrs.$$element = jqLite(compileNode),
          directive,
          directiveName,
          $template,
          transcludeDirective,
          replaceDirective = originalReplaceDirective,
          childTranscludeFn = transcludeFn,
          controllerDirectives,
          linkFn,
          directiveValue;

      // executes all directives on the current element
      for(var i = 0, ii = directives.length; i < ii; i++) {
        directive = directives[i];
        var attrStart = directive.$$start;
        var attrEnd = directive.$$end;

        // collect multiblock sections
        if (attrStart) {
          $compileNode = groupScan(compileNode, attrStart, attrEnd)
        }
        $template = undefined;

        if (terminalPriority > directive.priority) {
          break; // prevent further processing of directives
        }

        if (directiveValue = directive.scope) {
          assertNoDuplicate('isolated scope', newIsolateScopeDirective, directive, $compileNode);
          if (isObject(directiveValue)) {
            safeAddClass($compileNode, 'ng-isolate-scope');
            newIsolateScopeDirective = directive;
          }
          safeAddClass($compileNode, 'ng-scope');
          newScopeDirective = newScopeDirective || directive;
        }

        directiveName = directive.name;

        if (directiveValue = directive.controller) {
          controllerDirectives = controllerDirectives || {};
          assertNoDuplicate("'" + directiveName + "' controller",
              controllerDirectives[directiveName], directive, $compileNode);
          controllerDirectives[directiveName] = directive;
        }

        if (directiveValue = directive.transclude) {
          assertNoDuplicate('transclusion', transcludeDirective, directive, $compileNode);
          transcludeDirective = directive;
          terminalPriority = directive.priority;
          if (directiveValue == 'element') {
            $template = groupScan(compileNode, attrStart, attrEnd)
            $compileNode = templateAttrs.$$element =
                jqLite(document.createComment(' ' + directiveName + ': ' + templateAttrs[directiveName] + ' '));
            compileNode = $compileNode[0];
            replaceWith(jqCollection, jqLite(sliceArgs($template)), compileNode);

            childTranscludeFn = compile($template, transcludeFn, terminalPriority,
                                        replaceDirective && replaceDirective.name);
          } else {
            $template = jqLite(JQLiteClone(compileNode)).contents();
            $compileNode.html(''); // clear contents
            childTranscludeFn = compile($template, transcludeFn);
          }
        }

        if (directive.template) {
          assertNoDuplicate('template', templateDirective, directive, $compileNode);
          templateDirective = directive;

          directiveValue = (isFunction(directive.template))
              ? directive.template($compileNode, templateAttrs)
              : directive.template;

          directiveValue = denormalizeTemplate(directiveValue);

          if (directive.replace) {
            replaceDirective = directive;
            $template = jqLite('<div>' +
                                 trim(directiveValue) +
                               '</div>').contents();
            compileNode = $template[0];

            if ($template.length != 1 || compileNode.nodeType !== 1) {
              throw $compileMinErr('tplrt', "Template for directive '{0}' must have exactly one root element. {1}", directiveName, '');
            }

            replaceWith(jqCollection, $compileNode, compileNode);

            var newTemplateAttrs = {$attr: {}};

            // combine directives from the original node and from the template:
            // - take the array of directives for this element
            // - split it into two parts, those that were already applied and those that weren't
            // - collect directives from the template, add them to the second group and sort them
            // - append the second group with new directives to the first group
            directives = directives.concat(
                collectDirectives(
                    compileNode,
                    directives.splice(i + 1, directives.length - (i + 1)),
                    newTemplateAttrs
                )
            );
            mergeTemplateAttributes(templateAttrs, newTemplateAttrs);

            ii = directives.length;
          } else {
            $compileNode.html(directiveValue);
          }
        }

        if (directive.templateUrl) {
          assertNoDuplicate('template', templateDirective, directive, $compileNode);
          templateDirective = directive;

          if (directive.replace) {
            replaceDirective = directive;
          }
          nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i),
              nodeLinkFn, $compileNode, templateAttrs, jqCollection, childTranscludeFn);
          ii = directives.length;
        } else if (directive.compile) {
          try {
            linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
            if (isFunction(linkFn)) {
              addLinkFns(null, linkFn, attrStart, attrEnd);
            } else if (linkFn) {
              addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
            }
          } catch (e) {
            $exceptionHandler(e, startingTag($compileNode));
          }
        }

        if (directive.terminal) {
          nodeLinkFn.terminal = true;
          terminalPriority = Math.max(terminalPriority, directive.priority);
        }

      }

      nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope;
      nodeLinkFn.transclude = transcludeDirective && childTranscludeFn;

      // might be normal or delayed nodeLinkFn depending on if templateUrl is present
      return nodeLinkFn;

      ////////////////////

      function addLinkFns(pre, post, attrStart, attrEnd) {
        if (pre) {
          if (attrStart) pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
          pre.require = directive.require;
          preLinkFns.push(pre);
        }
        if (post) {
          if (attrStart) post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
          post.require = directive.require;
          postLinkFns.push(post);
        }
      }


      function getControllers(require, $element) {
        var value, retrievalMethod = 'data', optional = false;
        if (isString(require)) {
          while((value = require.charAt(0)) == '^' || value == '?') {
            require = require.substr(1);
            if (value == '^') {
              retrievalMethod = 'inheritedData';
            }
            optional = optional || value == '?';
          }

          value = $element[retrievalMethod]('$' + require + 'Controller');

          if ($element[0].nodeType == 8 && $element[0].$$controller) { // Transclusion comment node
            value = value || $element[0].$$controller;
            $element[0].$$controller = null;
          }

          if (!value && !optional) {
            throw $compileMinErr('ctreq', "Controller '{0}', required by directive '{1}', can't be found!", require, directiveName);
          }
          return value;
        } else if (isArray(require)) {
          value = [];
          forEach(require, function(require) {
            value.push(getControllers(require, $element));
          });
        }
        return value;
      }


      function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
        var attrs, $element, i, ii, linkFn, controller;

        if (compileNode === linkNode) {
          attrs = templateAttrs;
        } else {
          attrs = shallowCopy(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr));
        }
        $element = attrs.$$element;

        if (newIsolateScopeDirective) {
          var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;

          var parentScope = scope.$parent || scope;

          forEach(newIsolateScopeDirective.scope, function(definition, scopeName) {
            var match = definition.match(LOCAL_REGEXP) || [],
                attrName = match[3] || scopeName,
                optional = (match[2] == '?'),
                mode = match[1], // @, =, or &
                lastValue,
                parentGet, parentSet;

            scope.$$isolateBindings[scopeName] = mode + attrName;

            switch (mode) {

              case '@': {
                attrs.$observe(attrName, function(value) {
                  scope[scopeName] = value;
                });
                attrs.$$observers[attrName].$$scope = parentScope;
                if( attrs[attrName] ) {
                  // If the attribute has been provided then we trigger an interpolation to ensure the value is there for use in the link fn
                  scope[scopeName] = $interpolate(attrs[attrName])(parentScope);
                }
                break;
              }

              case '=': {
                if (optional && !attrs[attrName]) {
                  return;
                }
                parentGet = $parse(attrs[attrName]);
                parentSet = parentGet.assign || function() {
                  // reset the change, or we will throw this exception on every $digest
                  lastValue = scope[scopeName] = parentGet(parentScope);
                  throw $compileMinErr('nonassign', "Expression '{0}' used with directive '{1}' is non-assignable!",
                      attrs[attrName], newIsolateScopeDirective.name);
                };
                lastValue = scope[scopeName] = parentGet(parentScope);
                scope.$watch(function parentValueWatch() {
                  var parentValue = parentGet(parentScope);

                  if (parentValue !== scope[scopeName]) {
                    // we are out of sync and need to copy
                    if (parentValue !== lastValue) {
                      // parent changed and it has precedence
                      lastValue = scope[scopeName] = parentValue;
                    } else {
                      // if the parent can be assigned then do so
                      parentSet(parentScope, parentValue = lastValue = scope[scopeName]);
                    }
                  }
                  return parentValue;
                });
                break;
              }

              case '&': {
                parentGet = $parse(attrs[attrName]);
                scope[scopeName] = function(locals) {
                  return parentGet(parentScope, locals);
                };
                break;
              }

              default: {
                throw $compileMinErr('iscp', "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}",
                    newIsolateScopeDirective.name, scopeName, definition);
              }
            }
          });
        }

        if (controllerDirectives) {
          forEach(controllerDirectives, function(directive) {
            var locals = {
              $scope: scope,
              $element: $element,
              $attrs: attrs,
              $transclude: boundTranscludeFn
            }, controllerInstance;

            controller = directive.controller;
            if (controller == '@') {
              controller = attrs[directive.name];
            }

            controllerInstance = $controller(controller, locals);

            // Directives with element transclusion and a controller need to attach controller
            // to the comment node created by the compiler, but jQuery .data doesn't support
            // attaching data to comment nodes so instead we set it directly on the element and
            // remove it after we read it later.
            if ($element[0].nodeType == 8) { // Transclusion comment node
              $element[0].$$controller = controllerInstance;
            } else {
              $element.data('$' + directive.name + 'Controller', controllerInstance);
            }
            if (directive.controllerAs) {
              locals.$scope[directive.controllerAs] = controllerInstance;
            }
          });
        }

        // PRELINKING
        for(i = 0, ii = preLinkFns.length; i < ii; i++) {
          try {
            linkFn = preLinkFns[i];
            linkFn(scope, $element, attrs,
                linkFn.require && getControllers(linkFn.require, $element));
          } catch (e) {
            $exceptionHandler(e, startingTag($element));
          }
        }

        // RECURSION
        childLinkFn && childLinkFn(scope, linkNode.childNodes, undefined, boundTranscludeFn);

        // POSTLINKING
        for(i = 0, ii = postLinkFns.length; i < ii; i++) {
          try {
            linkFn = postLinkFns[i];
            linkFn(scope, $element, attrs,
                linkFn.require && getControllers(linkFn.require, $element));
          } catch (e) {
            $exceptionHandler(e, startingTag($element));
          }
        }
      }
    }


    /**
     * looks up the directive and decorates it with exception handling and proper parameters. We
     * call this the boundDirective.
     *
     * @param {string} name name of the directive to look up.
     * @param {string} location The directive must be found in specific format.
     *   String containing any of theses characters:
     *
     *   * `E`: element name
     *   * `A': attribute
     *   * `C`: class
     *   * `M`: comment
     * @returns true if directive was added.
     */
    function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
      if (name === ignoreDirective) return null;
      var match = null;
      if (hasDirectives.hasOwnProperty(name)) {
        for(var directive, directives = $injector.get(name + Suffix),
            i = 0, ii = directives.length; i<ii; i++) {
          try {
            directive = directives[i];
            if ( (maxPriority === undefined || maxPriority > directive.priority) &&
                 directive.restrict.indexOf(location) != -1) {
              if (startAttrName) {
                directive = inherit(directive, {$$start: startAttrName, $$end: endAttrName});
              }
              tDirectives.push(directive);
              match = directive;
            }
          } catch(e) { $exceptionHandler(e); }
        }
      }
      return match;
    }


    /**
     * When the element is replaced with HTML template then the new attributes
     * on the template need to be merged with the existing attributes in the DOM.
     * The desired effect is to have both of the attributes present.
     *
     * @param {object} dst destination attributes (original DOM)
     * @param {object} src source attributes (from the directive template)
     */
    function mergeTemplateAttributes(dst, src) {
      var srcAttr = src.$attr,
          dstAttr = dst.$attr,
          $element = dst.$$element;

      // reapply the old attributes to the new element
      forEach(dst, function(value, key) {
        if (key.charAt(0) != '$') {
          if (src[key]) {
            value += (key === 'style' ? ';' : ' ') + src[key];
          }
          dst.$set(key, value, true, srcAttr[key]);
        }
      });

      // copy the new attributes on the old attrs object
      forEach(src, function(value, key) {
        if (key == 'class') {
          safeAddClass($element, value);
          dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
        } else if (key == 'style') {
          $element.attr('style', $element.attr('style') + ';' + value);
        } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
          dst[key] = value;
          dstAttr[key] = srcAttr[key];
        }
      });
    }


    function compileTemplateUrl(directives, beforeTemplateNodeLinkFn, $compileNode, tAttrs,
        $rootElement, childTranscludeFn) {
      var linkQueue = [],
          afterTemplateNodeLinkFn,
          afterTemplateChildLinkFn,
          beforeTemplateCompileNode = $compileNode[0],
          origAsyncDirective = directives.shift(),
          // The fact that we have to copy and patch the directive seems wrong!
          derivedSyncDirective = extend({}, origAsyncDirective, {
            controller: null, templateUrl: null, transclude: null, scope: null, replace: null
          }),
          templateUrl = (isFunction(origAsyncDirective.templateUrl))
              ? origAsyncDirective.templateUrl($compileNode, tAttrs)
              : origAsyncDirective.templateUrl;

      $compileNode.html('');

      $http.get($sce.getTrustedResourceUrl(templateUrl), {cache: $templateCache}).
        success(function(content) {
          var compileNode, tempTemplateAttrs, $template;

          content = denormalizeTemplate(content);

          if (origAsyncDirective.replace) {
            $template = jqLite('<div>' + trim(content) + '</div>').contents();
            compileNode = $template[0];

            if ($template.length != 1 || compileNode.nodeType !== 1) {
              throw $compileMinErr('tplrt', "Template for directive '{0}' must have exactly one root element. {1}",
                  origAsyncDirective.name, templateUrl);
            }

            tempTemplateAttrs = {$attr: {}};
            replaceWith($rootElement, $compileNode, compileNode);
            collectDirectives(compileNode, directives, tempTemplateAttrs);
            mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
          } else {
            compileNode = beforeTemplateCompileNode;
            $compileNode.html(content);
          }

          directives.unshift(derivedSyncDirective);

          afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective);
          forEach($rootElement, function(node, i) {
            if (node == compileNode) {
              $rootElement[i] = $compileNode[0];
            }
          });
          afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);


          while(linkQueue.length) {
            var scope = linkQueue.shift(),
                beforeTemplateLinkNode = linkQueue.shift(),
                linkRootElement = linkQueue.shift(),
                controller = linkQueue.shift(),
                linkNode = $compileNode[0];

            if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
              // it was cloned therefore we have to clone as well.
              linkNode = JQLiteClone(compileNode);
              replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
            }

            afterTemplateNodeLinkFn(
              beforeTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, controller),
              scope, linkNode, $rootElement, controller
            );
          }
          linkQueue = null;
        }).
        error(function(response, code, headers, config) {
          throw $compileMinErr('tpload', 'Failed to load template: {0}', config.url);
        });

      return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, controller) {
        if (linkQueue) {
          linkQueue.push(scope);
          linkQueue.push(node);
          linkQueue.push(rootElement);
          linkQueue.push(controller);
        } else {
          afterTemplateNodeLinkFn(function() {
            beforeTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, controller);
          }, scope, node, rootElement, controller);
        }
      };
    }


    /**
     * Sorting function for bound directives.
     */
    function byPriority(a, b) {
      return b.priority - a.priority;
    }


    function assertNoDuplicate(what, previousDirective, directive, element) {
      if (previousDirective) {
        throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}',
            previousDirective.name, directive.name, what, startingTag(element));
      }
    }


    function addTextInterpolateDirective(directives, text) {
      var interpolateFn = $interpolate(text, true);
      if (interpolateFn) {
        directives.push({
          priority: 0,
          compile: valueFn(function textInterpolateLinkFn(scope, node) {
            var parent = node.parent(),
                bindings = parent.data('$binding') || [];
            bindings.push(interpolateFn);
            safeAddClass(parent.data('$binding', bindings), 'ng-binding');
            scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
              node[0].nodeValue = value;
            });
          })
        });
      }
    }


    function getTrustedContext(node, attrNormalizedName) {
      // maction[xlink:href] can source SVG.  It's not limited to <maction>.
      if (attrNormalizedName == "xlinkHref" ||
          (nodeName_(node) != "IMG" && (attrNormalizedName == "src" ||
                                        attrNormalizedName == "ngSrc"))) {
        return $sce.RESOURCE_URL;
      }
    }


    function addAttrInterpolateDirective(node, directives, value, name) {
      var interpolateFn = $interpolate(value, true);

      // no interpolation found -> ignore
      if (!interpolateFn) return;


      if (name === "multiple" && nodeName_(node) === "SELECT") {
        throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}",
            startingTag(node));
      }

      directives.push({
        priority: 100,
        compile: valueFn(function attrInterpolateLinkFn(scope, element, attr) {
          var $$observers = (attr.$$observers || (attr.$$observers = {}));

          if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
            throw $compileMinErr('nodomevents',
                "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- " +
                "versions (such as ng-click instead of onclick) instead.");
          }

          // we need to interpolate again, in case the attribute value has been updated
          // (e.g. by another directive's compile function)
          interpolateFn = $interpolate(attr[name], true, getTrustedContext(node, name));

          // if attribute was updated so that there is no interpolation going on we don't want to
          // register any observers
          if (!interpolateFn) return;

          attr[name] = interpolateFn(scope);
          ($$observers[name] || ($$observers[name] = [])).$$inter = true;
          (attr.$$observers && attr.$$observers[name].$$scope || scope).
            $watch(interpolateFn, function interpolateFnWatchAction(value) {
              attr.$set(name, value);
            });
        })
      });
    }


    /**
     * This is a special jqLite.replaceWith, which can replace items which
     * have no parents, provided that the containing jqLite collection is provided.
     *
     * @param {JqLite=} $rootElement The root of the compile tree. Used so that we can replace nodes
     *    in the root of the tree.
     * @param {JqLite} elementsToRemove The jqLite element which we are going to replace. We keep the shell,
     *    but replace its DOM node reference.
     * @param {Node} newNode The new DOM node.
     */
    function replaceWith($rootElement, elementsToRemove, newNode) {
      var firstElementToRemove = elementsToRemove[0],
          removeCount = elementsToRemove.length,
          parent = firstElementToRemove.parentNode,
          i, ii;

      if ($rootElement) {
        for(i = 0, ii = $rootElement.length; i < ii; i++) {
          if ($rootElement[i] == firstElementToRemove) {
            $rootElement[i++] = newNode;
            for (var j = i, j2 = j + removeCount - 1,
                     jj = $rootElement.length;
                 j < jj; j++, j2++) {
              if (j2 < jj) {
                $rootElement[j] = $rootElement[j2];
              } else {
                delete $rootElement[j];
              }
            }
            $rootElement.length -= removeCount - 1;
            break;
          }
        }
      }

      if (parent) {
        parent.replaceChild(newNode, firstElementToRemove);
      }
      var fragment = document.createDocumentFragment();
      fragment.appendChild(firstElementToRemove);
      newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
      for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
        var element = elementsToRemove[k];
        jqLite(element).remove(); // must do this way to clean up expando
        fragment.appendChild(element);
        delete elementsToRemove[k];
      }

      elementsToRemove[0] = newNode;
      elementsToRemove.length = 1
    }
  }];
}

var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
/**
 * Converts all accepted directives format into proper directive name.
 * All of these will become 'myDirective':
 *   my:Directive
 *   my-directive
 *   x-my-directive
 *   data-my:directive
 *
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function directiveNormalize(name) {
  return camelCase(name.replace(PREFIX_REGEXP, ''));
}

/**
 * @ngdoc object
 * @name ng.$compile.directive.Attributes
 * @description
 *
 * A shared object between directive compile / linking functions which contains normalized DOM element
 * attributes. The the values reflect current binding state `{{ }}`. The normalization is needed
 * since all of these are treated as equivalent in Angular:
 *
 *          <span ng:bind="a" ng-bind="a" data-ng-bind="a" x-ng-bind="a">
 */

/**
 * @ngdoc property
 * @name ng.$compile.directive.Attributes#$attr
 * @propertyOf ng.$compile.directive.Attributes
 * @returns {object} A map of DOM element attribute names to the normalized name. This is
 *          needed to do reverse lookup from normalized name back to actual name.
 */


/**
 * @ngdoc function
 * @name ng.$compile.directive.Attributes#$set
 * @methodOf ng.$compile.directive.Attributes
 * @function
 *
 * @description
 * Set DOM element attribute value.
 *
 *
 * @param {string} name Normalized element attribute name of the property to modify. The name is
 *          revers translated using the {@link ng.$compile.directive.Attributes#$attr $attr}
 *          property to the original name.
 * @param {string} value Value to set the attribute to. The value can be an interpolated string.
 */



/**
 * Closure compiler type information
 */

function nodesetLinkingFn(
  /* angular.Scope */ scope,
  /* NodeList */ nodeList,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
){}

function directiveLinkingFn(
  /* nodesetLinkingFn */ nodesetLinkingFn,
  /* angular.Scope */ scope,
  /* Node */ node,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
){}

/**
 * @ngdoc object
 * @name ng.$controllerProvider
 * @description
 * The {@link ng.$controller $controller service} is used by Angular to create new
 * controllers.
 *
 * This provider allows controller registration via the
 * {@link ng.$controllerProvider#register register} method.
 */
function $ControllerProvider() {
  var controllers = {},
      CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;


  /**
   * @ngdoc function
   * @name ng.$controllerProvider#register
   * @methodOf ng.$controllerProvider
   * @param {string|Object} name Controller name, or an object map of controllers where the keys are
   *    the names and the values are the constructors.
   * @param {Function|Array} constructor Controller constructor fn (optionally decorated with DI
   *    annotations in the array notation).
   */
  this.register = function(name, constructor) {
    if (isObject(name)) {
      extend(controllers, name)
    } else {
      controllers[name] = constructor;
    }
  };


  this.$get = ['$injector', '$window', function($injector, $window) {

    /**
     * @ngdoc function
     * @name ng.$controller
     * @requires $injector
     *
     * @param {Function|string} constructor If called with a function then it's considered to be the
     *    controller constructor function. Otherwise it's considered to be a string which is used
     *    to retrieve the controller constructor using the following steps:
     *
     *    * check if a controller with given name is registered via `$controllerProvider`
     *    * check if evaluating the string on the current scope returns a constructor
     *    * check `window[constructor]` on the global `window` object
     *
     * @param {Object} locals Injection locals for Controller.
     * @return {Object} Instance of given controller.
     *
     * @description
     * `$controller` service is responsible for instantiating controllers.
     *
     * It's just a simple call to {@link AUTO.$injector $injector}, but extracted into
     * a service, so that one can override this service with {@link https://gist.github.com/1649788
     * BC version}.
     */
    return function(expression, locals) {
      var instance, match, constructor, identifier;

      if(isString(expression)) {
        match = expression.match(CNTRL_REG),
        constructor = match[1],
        identifier = match[3];
        expression = controllers.hasOwnProperty(constructor)
            ? controllers[constructor]
            : getter(locals.$scope, constructor, true) || getter($window, constructor, true);

        assertArgFn(expression, constructor, true);
      }

      instance = $injector.instantiate(expression, locals);

      if (identifier) {
        if (!(locals && typeof locals.$scope == 'object')) {
          throw minErr('$controller')('noscp', "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", constructor || expression.name, identifier);
        }

        locals.$scope[identifier] = instance;
      }

      return instance;
    };
  }];
}

/**
 * @ngdoc object
 * @name ng.$document
 * @requires $window
 *
 * @description
 * A {@link angular.element jQuery (lite)}-wrapped reference to the browser's `window.document`
 * element.
 */
function $DocumentProvider(){
  this.$get = ['$window', function(window){
    return jqLite(window.document);
  }];
}

/**
 * @ngdoc function
 * @name ng.$exceptionHandler
 * @requires $log
 *
 * @description
 * Any uncaught exception in angular expressions is delegated to this service.
 * The default implementation simply delegates to `$log.error` which logs it into
 * the browser console.
 * 
 * In unit tests, if `angular-mocks.js` is loaded, this service is overridden by
 * {@link ngMock.$exceptionHandler mock $exceptionHandler} which aids in testing.
 *
 * ## Example:
 * 
 * <pre>
 *   angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
 *     return function (exception, cause) {
 *       exception.message += ' (caused by "' + cause + '")';
 *       throw exception;
 *     };
 *   });
 * </pre>
 * 
 * This example will override the normal action of `$exceptionHandler`, to make angular
 * exceptions fail hard when they happen, instead of just logging to the console.
 *
 * @param {Error} exception Exception associated with the error.
 * @param {string=} cause optional information about the context in which
 *       the error was thrown.
 *
 */
function $ExceptionHandlerProvider() {
  this.$get = ['$log', function($log) {
    return function(exception, cause) {
      $log.error.apply($log, arguments);
    };
  }];
}

/**
 * Parse headers into key value object
 *
 * @param {string} headers Raw headers as a string
 * @returns {Object} Parsed headers as key value object
 */
function parseHeaders(headers) {
  var parsed = {}, key, val, i;

  if (!headers) return parsed;

  forEach(headers.split('\n'), function(line) {
    i = line.indexOf(':');
    key = lowercase(trim(line.substr(0, i)));
    val = trim(line.substr(i + 1));

    if (key) {
      if (parsed[key]) {
        parsed[key] += ', ' + val;
      } else {
        parsed[key] = val;
      }
    }
  });

  return parsed;
}


/**
 * Returns a function that provides access to parsed headers.
 *
 * Headers are lazy parsed when first requested.
 * @see parseHeaders
 *
 * @param {(string|Object)} headers Headers to provide access to.
 * @returns {function(string=)} Returns a getter function which if called with:
 *
 *   - if called with single an argument returns a single header value or null
 *   - if called with no arguments returns an object containing all headers.
 */
function headersGetter(headers) {
  var headersObj = isObject(headers) ? headers : undefined;

  return function(name) {
    if (!headersObj) headersObj =  parseHeaders(headers);

    if (name) {
      return headersObj[lowercase(name)] || null;
    }

    return headersObj;
  };
}


/**
 * Chain all given functions
 *
 * This function is used for both request and response transforming
 *
 * @param {*} data Data to transform.
 * @param {function(string=)} headers Http headers getter fn.
 * @param {(function|Array.<function>)} fns Function or an array of functions.
 * @returns {*} Transformed data.
 */
function transformData(data, headers, fns) {
  if (isFunction(fns))
    return fns(data, headers);

  forEach(fns, function(fn) {
    data = fn(data, headers);
  });

  return data;
}


function isSuccess(status) {
  return 200 <= status && status < 300;
}


function $HttpProvider() {
  var JSON_START = /^\s*(\[|\{[^\{])/,
      JSON_END = /[\}\]]\s*$/,
      PROTECTION_PREFIX = /^\)\]\}',?\n/,
      CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': 'application/json;charset=utf-8'};

  var defaults = this.defaults = {
    // transform incoming response data
    transformResponse: [function(data) {
      if (isString(data)) {
        // strip json vulnerability protection prefix
        data = data.replace(PROTECTION_PREFIX, '');
        if (JSON_START.test(data) && JSON_END.test(data))
          data = fromJson(data);
      }
      return data;
    }],

    // transform outgoing request data
    transformRequest: [function(d) {
      return isObject(d) && !isFile(d) ? toJson(d) : d;
    }],

    // default headers
    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*'
      },
      post:   CONTENT_TYPE_APPLICATION_JSON,
      put:    CONTENT_TYPE_APPLICATION_JSON,
      patch:  CONTENT_TYPE_APPLICATION_JSON
    },

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
  };

  /**
   * Are order by request. I.E. they are applied in the same order as
   * array on request, but revers order on response.
   */
  var interceptorFactories = this.interceptors = [];
  /**
   * For historical reasons, response interceptors ordered by the order in which
   * they are applied to response. (This is in revers to interceptorFactories)
   */
  var responseInterceptorFactories = this.responseInterceptors = [];

  this.$get = ['$httpBackend', '$browser', '$cacheFactory', '$rootScope', '$q', '$injector', '$$urlUtils',
      function($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector, $$urlUtils) {

    var defaultCache = $cacheFactory('$http');

    /**
     * Interceptors stored in reverse order. Inner interceptors before outer interceptors.
     * The reversal is needed so that we can build up the interception chain around the
     * server request.
     */
    var reversedInterceptors = [];

    forEach(interceptorFactories, function(interceptorFactory) {
      reversedInterceptors.unshift(isString(interceptorFactory)
          ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
    });

    forEach(responseInterceptorFactories, function(interceptorFactory, index) {
      var responseFn = isString(interceptorFactory)
          ? $injector.get(interceptorFactory)
          : $injector.invoke(interceptorFactory);

      /**
       * Response interceptors go before "around" interceptors (no real reason, just
       * had to pick one.) But they are already reversed, so we can't use unshift, hence
       * the splice.
       */
      reversedInterceptors.splice(index, 0, {
        response: function(response) {
          return responseFn($q.when(response));
        },
        responseError: function(response) {
          return responseFn($q.reject(response));
        }
      });
    });


    /**
     * @ngdoc function
     * @name ng.$http
     * @requires $httpBackend
     * @requires $browser
     * @requires $cacheFactory
     * @requires $rootScope
     * @requires $q
     * @requires $injector
     *
     * @description
     * The `$http` service is a core Angular service that facilitates communication with the remote
     * HTTP servers via the browser's {@link https://developer.mozilla.org/en/xmlhttprequest
     * XMLHttpRequest} object or via {@link http://en.wikipedia.org/wiki/JSONP JSONP}.
     *
     * For unit testing applications that use `$http` service, see
     * {@link ngMock.$httpBackend $httpBackend mock}.
     *
     * For a higher level of abstraction, please check out the {@link ngResource.$resource
     * $resource} service.
     *
     * The $http API is based on the {@link ng.$q deferred/promise APIs} exposed by
     * the $q service. While for simple usage patterns this doesn't matter much, for advanced usage
     * it is important to familiarize yourself with these APIs and the guarantees they provide.
     *
     *
     * # General usage
     * The `$http` service is a function which takes a single argument — a configuration object —
     * that is used to generate an HTTP request and returns  a {@link ng.$q promise}
     * with two $http specific methods: `success` and `error`.
     *
     * <pre>
     *   $http({method: 'GET', url: '/someUrl'}).
     *     success(function(data, status, headers, config) {
     *       // this callback will be called asynchronously
     *       // when the response is available
     *     }).
     *     error(function(data, status, headers, config) {
     *       // called asynchronously if an error occurs
     *       // or server returns response with an error status.
     *     });
     * </pre>
     *
     * Since the returned value of calling the $http function is a `promise`, you can also use
     * the `then` method to register callbacks, and these callbacks will receive a single argument –
     * an object representing the response. See the API signature and type info below for more
     * details.
     *
     * A response status code between 200 and 299 is considered a success status and
     * will result in the success callback being called. Note that if the response is a redirect,
     * XMLHttpRequest will transparently follow it, meaning that the error callback will not be
     * called for such responses.
     * 
     * # Calling $http from outside AngularJS
     * The `$http` service will not actually send the request until the next `$digest()` is executed.
     * Normally this is not an issue, since almost all the time your call to `$http` will be from within
     * a `$apply()` block.
     * If you are calling `$http` from outside Angular, then you should wrap it in a call to `$apply`
     * to cause a $digest to occur and also to handle errors in the block correctly.
     *
     * ```
     * $scope.$apply(function() {
     *   $http(...);
     * });
     * ```
     *
     * # Writing Unit Tests that use $http
     * When unit testing you are mostly responsible for scheduling the `$digest` cycle. If you do not
     * trigger a `$digest` before calling `$httpBackend.flush()` then the request will not have been
     * made and `$httpBackend.expect(...)` expectations will fail.  The solution is to run the code
     * that calls the `$http()` method inside a $apply block as explained in the previous section.
     *
     * ```
     * $httpBackend.expectGET(...);
     * $scope.$apply(function() {
     *   $http.get(...);
     * });
     * $httpBackend.flush();
     * ```
     *
     * # Shortcut methods
     *
     * Since all invocations of the $http service require passing in an HTTP method and URL, and
     * POST/PUT requests require request data to be provided as well, shortcut methods
     * were created:
     *
     * <pre>
     *   $http.get('/someUrl').success(successCallback);
     *   $http.post('/someUrl', data).success(successCallback);
     * </pre>
     *
     * Complete list of shortcut methods:
     *
     * - {@link ng.$http#get $http.get}
     * - {@link ng.$http#head $http.head}
     * - {@link ng.$http#post $http.post}
     * - {@link ng.$http#put $http.put}
     * - {@link ng.$http#delete $http.delete}
     * - {@link ng.$http#jsonp $http.jsonp}
     *
     *
     * # Setting HTTP Headers
     *
     * The $http service will automatically add certain HTTP headers to all requests. These defaults
     * can be fully configured by accessing the `$httpProvider.defaults.headers` configuration
     * object, which currently contains this default configuration:
     *
     * - `$httpProvider.defaults.headers.common` (headers that are common for all requests):
     *   - `Accept: application/json, text/plain, * / *`
     * - `$httpProvider.defaults.headers.post`: (header defaults for POST requests)
     *   - `Content-Type: application/json`
     * - `$httpProvider.defaults.headers.put` (header defaults for PUT requests)
     *   - `Content-Type: application/json`
     *
     * To add or overwrite these defaults, simply add or remove a property from these configuration
     * objects. To add headers for an HTTP method other than POST or PUT, simply add a new object
     * with the lowercased HTTP method name as the key, e.g.
     * `$httpProvider.defaults.headers.get = { 'My-Header' : 'value' }.
     *
     * Additionally, the defaults can be set at runtime via the `$http.defaults` object in the same
     * fashion.
     *
     *
     * # Transforming Requests and Responses
     *
     * Both requests and responses can be transformed using transform functions. By default, Angular
     * applies these transformations:
     *
     * Request transformations:
     *
     * - If the `data` property of the request configuration object contains an object, serialize it into
     *   JSON format.
     *
     * Response transformations:
     *
     *  - If XSRF prefix is detected, strip it (see Security Considerations section below).
     *  - If JSON response is detected, deserialize it using a JSON parser.
     *
     * To globally augment or override the default transforms, modify the `$httpProvider.defaults.transformRequest` and
     * `$httpProvider.defaults.transformResponse` properties. These properties are by default an
     * array of transform functions, which allows you to `push` or `unshift` a new transformation function into the
     * transformation chain. You can also decide to completely override any default transformations by assigning your
     * transformation functions to these properties directly without the array wrapper.
     *
     * Similarly, to locally override the request/response transforms, augment the `transformRequest` and/or
     * `transformResponse` properties of the configuration object passed into `$http`.
     *
     *
     * # Caching
     *
     * To enable caching, set the configuration property `cache` to `true`. When the cache is
     * enabled, `$http` stores the response from the server in local cache. Next time the
     * response is served from the cache without sending a request to the server.
     *
     * Note that even if the response is served from cache, delivery of the data is asynchronous in
     * the same way that real requests are.
     *
     * If there are multiple GET requests for the same URL that should be cached using the same
     * cache, but the cache is not populated yet, only one request to the server will be made and
     * the remaining requests will be fulfilled using the response from the first request.
     *
     * A custom default cache built with $cacheFactory can be provided in $http.defaults.cache.
     * To skip it, set configuration property `cache` to `false`.
     *
     *
     * # Interceptors
     *
     * Before you start creating interceptors, be sure to understand the
     * {@link ng.$q $q and deferred/promise APIs}.
     *
     * For purposes of global error handling, authentication, or any kind of synchronous or
     * asynchronous pre-processing of request or postprocessing of responses, it is desirable to be
     * able to intercept requests before they are handed to the server and
     * responses before they are handed over to the application code that
     * initiated these requests. The interceptors leverage the {@link ng.$q
     * promise APIs} to fulfill this need for both synchronous and asynchronous pre-processing.
     *
     * The interceptors are service factories that are registered with the `$httpProvider` by
     * adding them to the `$httpProvider.interceptors` array. The factory is called and
     * injected with dependencies (if specified) and returns the interceptor.
     *
     * There are two kinds of interceptors (and two kinds of rejection interceptors):
     *
     *   * `request`: interceptors get called with http `config` object. The function is free to modify
     *     the `config` or create a new one. The function needs to return the `config` directly or as a
     *     promise.
     *   * `requestError`: interceptor gets called when a previous interceptor threw an error or resolved
     *      with a rejection.
     *   * `response`: interceptors get called with http `response` object. The function is free to modify
     *     the `response` or create a new one. The function needs to return the `response` directly or as a
     *     promise.
     *   * `responseError`: interceptor gets called when a previous interceptor threw an error or resolved
     *      with a rejection.
     *
     *
     * <pre>
     *   // register the interceptor as a service
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
     *     return {
     *       // optional method
     *       'request': function(config) {
     *         // do something on success
     *         return config || $q.when(config);
     *       },
     *
     *       // optional method
     *      'requestError': function(rejection) {
     *         // do something on error
     *         if (canRecover(rejection)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(rejection);
     *       },
     *
     *
     *
     *       // optional method
     *       'response': function(response) {
     *         // do something on success
     *         return response || $q.when(response);
     *       },
     *
     *       // optional method
     *      'responseError': function(rejection) {
     *         // do something on error
     *         if (canRecover(rejection)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(rejection);
     *       };
     *     }
     *   });
     *
     *   $httpProvider.interceptors.push('myHttpInterceptor');
     *
     *
     *   // register the interceptor via an anonymous factory
     *   $httpProvider.interceptors.push(function($q, dependency1, dependency2) {
     *     return {
     *      'request': function(config) {
     *          // same as above
     *       },
     *       'response': function(response) {
     *          // same as above
     *       }
     *   });
     * </pre>
     *
     * # Response interceptors (DEPRECATED)
     *
     * Before you start creating interceptors, be sure to understand the
     * {@link ng.$q $q and deferred/promise APIs}.
     *
     * For purposes of global error handling, authentication or any kind of synchronous or
     * asynchronous preprocessing of received responses, it is desirable to be able to intercept
     * responses for http requests before they are handed over to the application code that
     * initiated these requests. The response interceptors leverage the {@link ng.$q
     * promise apis} to fulfil this need for both synchronous and asynchronous preprocessing.
     *
     * The interceptors are service factories that are registered with the $httpProvider by
     * adding them to the `$httpProvider.responseInterceptors` array. The factory is called and
     * injected with dependencies (if specified) and returns the interceptor  — a function that
     * takes a {@link ng.$q promise} and returns the original or a new promise.
     *
     * <pre>
     *   // register the interceptor as a service
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
     *     return function(promise) {
     *       return promise.then(function(response) {
     *         // do something on success
     *         return response;
     *       }, function(response) {
     *         // do something on error
     *         if (canRecover(response)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(response);
     *       });
     *     }
     *   });
     *
     *   $httpProvider.responseInterceptors.push('myHttpInterceptor');
     *
     *
     *   // register the interceptor via an anonymous factory
     *   $httpProvider.responseInterceptors.push(function($q, dependency1, dependency2) {
     *     return function(promise) {
     *       // same as above
     *     }
     *   });
     * </pre>
     *
     *
     * # Security Considerations
     *
     * When designing web applications, consider security threats from:
     *
     * - {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
     *   JSON vulnerability}
     * - {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF}
     *
     * Both server and the client must cooperate in order to eliminate these threats. Angular comes
     * pre-configured with strategies that address these issues, but for this to work backend server
     * cooperation is required.
     *
     * ## JSON Vulnerability Protection
     *
     * A {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
     * JSON vulnerability} allows third party website to turn your JSON resource URL into
     * {@link http://en.wikipedia.org/wiki/JSONP JSONP} request under some conditions. To
     * counter this your server can prefix all JSON requests with following string `")]}',\n"`.
     * Angular will automatically strip the prefix before processing it as JSON.
     *
     * For example if your server needs to return:
     * <pre>
     * ['one','two']
     * </pre>
     *
     * which is vulnerable to attack, your server can return:
     * <pre>
     * )]}',
     * ['one','two']
     * </pre>
     *
     * Angular will strip the prefix, before processing the JSON.
     *
     *
     * ## Cross Site Request Forgery (XSRF) Protection
     *
     * {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF} is a technique by which
     * an unauthorized site can gain your user's private data. Angular provides a mechanism
     * to counter XSRF. When performing XHR requests, the $http service reads a token from a cookie
     * (by default, `XSRF-TOKEN`) and sets it as an HTTP header (`X-XSRF-TOKEN`). Since only
     * JavaScript that runs on your domain could read the cookie, your server can be assured that
     * the XHR came from JavaScript running on your domain. The header will not be set for
     * cross-domain requests.
     *
     * To take advantage of this, your server needs to set a token in a JavaScript readable session
     * cookie called `XSRF-TOKEN` on the first HTTP GET request. On subsequent XHR requests the
     * server can verify that the cookie matches `X-XSRF-TOKEN` HTTP header, and therefore be sure
     * that only JavaScript running on your domain could have sent the request. The token must be
     * unique for each user and must be verifiable by the server (to prevent the JavaScript from making
     * up its own tokens). We recommend that the token is a digest of your site's authentication
     * cookie with a {@link https://en.wikipedia.org/wiki/Salt_(cryptography) salt} for added security.
     *
     * The name of the headers can be specified using the xsrfHeaderName and xsrfCookieName
     * properties of either $httpProvider.defaults, or the per-request config object.
     *
     *
     * @param {object} config Object describing the request to be made and how it should be
     *    processed. The object has following properties:
     *
     *    - **method** – `{string}` – HTTP method (e.g. 'GET', 'POST', etc)
     *    - **url** – `{string}` – Absolute or relative URL of the resource that is being requested.
     *    - **params** – `{Object.<string|Object>}` – Map of strings or objects which will be turned to
     *      `?key1=value1&key2=value2` after the url. If the value is not a string, it will be JSONified.
     *    - **data** – `{string|Object}` – Data to be sent as the request message data.
     *    - **headers** – `{Object}` – Map of strings or functions which return strings representing
     *      HTTP headers to send to the server. If the return value of a function is null, the header will
     *      not be sent.
     *    - **xsrfHeaderName** – `{string}` – Name of HTTP header to populate with the XSRF token.
     *    - **xsrfCookieName** – `{string}` – Name of cookie containing the XSRF token.
     *    - **transformRequest** – `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
     *      transform function or an array of such functions. The transform function takes the http
     *      request body and headers and returns its transformed (typically serialized) version.
     *    - **transformResponse** – `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
     *      transform function or an array of such functions. The transform function takes the http
     *      response body and headers and returns its transformed (typically deserialized) version.
     *    - **cache** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
     *      GET request, otherwise if a cache instance built with
     *      {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
     *      caching.
     *    - **timeout** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise}
     *      that should abort the request when resolved.
     *    - **withCredentials** - `{boolean}` - whether to to set the `withCredentials` flag on the
     *      XHR object. See {@link https://developer.mozilla.org/en/http_access_control#section_5
     *      requests with credentials} for more information.
     *    - **responseType** - `{string}` - see {@link
     *      https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType requestType}.
     *
     * @returns {HttpPromise} Returns a {@link ng.$q promise} object with the
     *   standard `then` method and two http specific methods: `success` and `error`. The `then`
     *   method takes two arguments a success and an error callback which will be called with a
     *   response object. The `success` and `error` methods take a single argument - a function that
     *   will be called when the request succeeds or fails respectively. The arguments passed into
     *   these functions are destructured representation of the response object passed into the
     *   `then` method. The response object has these properties:
     *
     *   - **data** – `{string|Object}` – The response body transformed with the transform functions.
     *   - **status** – `{number}` – HTTP status code of the response.
     *   - **headers** – `{function([headerName])}` – Header getter function.
     *   - **config** – `{Object}` – The configuration object that was used to generate the request.
     *
     * @property {Array.<Object>} pendingRequests Array of config objects for currently pending
     *   requests. This is primarily meant to be used for debugging purposes.
     *
     *
     * @example
      <example>
        <file name="index.html">
          <div ng-controller="FetchCtrl">
            <select ng-model="method">
              <option>GET</option>
              <option>JSONP</option>
            </select>
            <input type="text" ng-model="url" size="80"/>
            <button ng-click="fetch()">fetch</button><br>
            <button ng-click="updateModel('GET', 'http-hello.html')">Sample GET</button>
            <button ng-click="updateModel('JSONP', 'http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero')">Sample JSONP</button>
            <button ng-click="updateModel('JSONP', 'http://angularjs.org/doesntexist&callback=JSON_CALLBACK')">Invalid JSONP</button>
            <pre>http status code: {{status}}</pre>
            <pre>http response data: {{data}}</pre>
          </div>
        </file>
        <file name="script.js">
          function FetchCtrl($scope, $http, $templateCache) {
            $scope.method = 'GET';
            $scope.url = 'http-hello.html';

            $scope.fetch = function() {
              $scope.code = null;
              $scope.response = null;

              $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
                success(function(data, status) {
                  $scope.status = status;
                  $scope.data = data;
                }).
                error(function(data, status) {
                  $scope.data = data || "Request failed";
                  $scope.status = status;
              });
            };

            $scope.updateModel = function(method, url) {
              $scope.method = method;
              $scope.url = url;
            };
          }
        </file>
        <file name="http-hello.html">
          Hello, $http!
        </file>
        <file name="scenario.js">
          it('should make an xhr GET request', function() {
            element(':button:contains("Sample GET")').click();
            element(':button:contains("fetch")').click();
            expect(binding('status')).toBe('200');
            expect(binding('data')).toMatch(/Hello, \$http!/);
          });

          it('should make a JSONP request to angularjs.org', function() {
            element(':button:contains("Sample JSONP")').click();
            element(':button:contains("fetch")').click();
            expect(binding('status')).toBe('200');
            expect(binding('data')).toMatch(/Super Hero!/);
          });

          it('should make JSONP request to invalid URL and invoke the error handler',
              function() {
            element(':button:contains("Invalid JSONP")').click();
            element(':button:contains("fetch")').click();
            expect(binding('status')).toBe('0');
            expect(binding('data')).toBe('Request failed');
          });
        </file>
      </example>
     */
    function $http(requestConfig) {
      var config = {
        transformRequest: defaults.transformRequest,
        transformResponse: defaults.transformResponse
      };
      var headers = mergeHeaders(requestConfig);

      extend(config, requestConfig);
      config.headers = headers;
      config.method = uppercase(config.method);

      var xsrfValue = $$urlUtils.isSameOrigin(config.url)
          ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName]
          : undefined;
      if (xsrfValue) {
        headers[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
      }


      var serverRequest = function(config) {
        headers = config.headers;
        var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);

        // strip content-type if data is undefined
        if (isUndefined(config.data)) {
          forEach(headers, function(value, header) {
            if (lowercase(header) === 'content-type') {
                delete headers[header];
            }
          });
        }

        if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
          config.withCredentials = defaults.withCredentials;
        }

        // send request
        return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
      };

      var chain = [serverRequest, undefined];
      var promise = $q.when(config);

      // apply interceptors
      forEach(reversedInterceptors, function(interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift(interceptor.request, interceptor.requestError);
        }
        if (interceptor.response || interceptor.responseError) {
          chain.push(interceptor.response, interceptor.responseError);
        }
      });

      while(chain.length) {
        var thenFn = chain.shift();
        var rejectFn = chain.shift();

        promise = promise.then(thenFn, rejectFn);
      }

      promise.success = function(fn) {
        promise.then(function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };

      promise.error = function(fn) {
        promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };

      return promise;

      function transformResponse(response) {
        // make a copy since the response must be cacheable
        var resp = extend({}, response, {
          data: transformData(response.data, response.headers, config.transformResponse)
        });
        return (isSuccess(response.status))
          ? resp
          : $q.reject(resp);
      }

      function mergeHeaders(config) {
        var defHeaders = defaults.headers,
            reqHeaders = extend({}, config.headers),
            defHeaderName, lowercaseDefHeaderName, reqHeaderName;

        defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);

        // execute if header value is function
        execHeaders(defHeaders);
        execHeaders(reqHeaders);

        // using for-in instead of forEach to avoid unecessary iteration after header has been found
        defaultHeadersIteration:
        for (defHeaderName in defHeaders) {
          lowercaseDefHeaderName = lowercase(defHeaderName);

          for (reqHeaderName in reqHeaders) {
            if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
              continue defaultHeadersIteration;
            }
          }

          reqHeaders[defHeaderName] = defHeaders[defHeaderName];
        }

        return reqHeaders;

        function execHeaders(headers) {
          var headerContent;

          forEach(headers, function(headerFn, header) {
            if (isFunction(headerFn)) {
              headerContent = headerFn();
              if (headerContent != null) {
                headers[header] = headerContent;
              } else {
                delete headers[header];
              }
            }
          });
        }
      }
    }

    $http.pendingRequests = [];

    /**
     * @ngdoc method
     * @name ng.$http#get
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `GET` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name ng.$http#delete
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `DELETE` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name ng.$http#head
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `HEAD` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name ng.$http#jsonp
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `JSONP` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request.
     *                     Should contain `JSON_CALLBACK` string.
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */
    createShortMethods('get', 'delete', 'head', 'jsonp');

    /**
     * @ngdoc method
     * @name ng.$http#post
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `POST` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {*} data Request content
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name ng.$http#put
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `PUT` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {*} data Request content
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */
    createShortMethodsWithData('post', 'put');

        /**
         * @ngdoc property
         * @name ng.$http#defaults
         * @propertyOf ng.$http
         *
         * @description
         * Runtime equivalent of the `$httpProvider.defaults` property. Allows configuration of
         * default headers, withCredentials as well as request and response transformations.
         *
         * See "Setting HTTP Headers" and "Transforming Requests and Responses" sections above.
         */
    $http.defaults = defaults;


    return $http;


    function createShortMethods(names) {
      forEach(arguments, function(name) {
        $http[name] = function(url, config) {
          return $http(extend(config || {}, {
            method: name,
            url: url
          }));
        };
      });
    }


    function createShortMethodsWithData(name) {
      forEach(arguments, function(name) {
        $http[name] = function(url, data, config) {
          return $http(extend(config || {}, {
            method: name,
            url: url,
            data: data
          }));
        };
      });
    }


    /**
     * Makes the request.
     *
     * !!! ACCESSES CLOSURE VARS:
     * $httpBackend, defaults, $log, $rootScope, defaultCache, $http.pendingRequests
     */
    function sendReq(config, reqData, reqHeaders) {
      var deferred = $q.defer(),
          promise = deferred.promise,
          cache,
          cachedResp,
          url = buildUrl(config.url, config.params);

      $http.pendingRequests.push(config);
      promise.then(removePendingReq, removePendingReq);


      if ((config.cache || defaults.cache) && config.cache !== false && config.method == 'GET') {
        cache = isObject(config.cache) ? config.cache
              : isObject(defaults.cache) ? defaults.cache
              : defaultCache;
      }

      if (cache) {
        cachedResp = cache.get(url);
        if (isDefined(cachedResp)) {
          if (cachedResp.then) {
            // cached request has already been sent, but there is no response yet
            cachedResp.then(removePendingReq, removePendingReq);
            return cachedResp;
          } else {
            // serving from cache
            if (isArray(cachedResp)) {
              resolvePromise(cachedResp[1], cachedResp[0], copy(cachedResp[2]));
            } else {
              resolvePromise(cachedResp, 200, {});
            }
          }
        } else {
          // put the promise for the non-transformed response into cache as a placeholder
          cache.put(url, promise);
        }
      }

      // if we won't have the response in cache, send the request to the backend
      if (isUndefined(cachedResp)) {
        $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout,
            config.withCredentials, config.responseType);
      }

      return promise;


      /**
       * Callback registered to $httpBackend():
       *  - caches the response if desired
       *  - resolves the raw $http promise
       *  - calls $apply
       */
      function done(status, response, headersString) {
        if (cache) {
          if (isSuccess(status)) {
            cache.put(url, [status, response, parseHeaders(headersString)]);
          } else {
            // remove promise from the cache
            cache.remove(url);
          }
        }

        resolvePromise(response, status, headersString);
        if (!$rootScope.$$phase) $rootScope.$apply();
      }


      /**
       * Resolves the raw $http promise.
       */
      function resolvePromise(response, status, headers) {
        // normalize internal statuses to 0
        status = Math.max(status, 0);

        (isSuccess(status) ? deferred.resolve : deferred.reject)({
          data: response,
          status: status,
          headers: headersGetter(headers),
          config: config
        });
      }


      function removePendingReq() {
        var idx = indexOf($http.pendingRequests, config);
        if (idx !== -1) $http.pendingRequests.splice(idx, 1);
      }
    }


    function buildUrl(url, params) {
          if (!params) return url;
          var parts = [];
          forEachSorted(params, function(value, key) {
            if (value == null || value == undefined) return;
            if (!isArray(value)) value = [value];

            forEach(value, function(v) {
              if (isObject(v)) {
                v = toJson(v);
              }
              parts.push(encodeUriQuery(key) + '=' +
                         encodeUriQuery(v));
            });
          });
          return url + ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
        }


  }];
}

var XHR = window.XMLHttpRequest || function() {
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw minErr('$httpBackend')('noxhr', "This browser does not support XMLHttpRequest.");
};


/**
 * @ngdoc object
 * @name ng.$httpBackend
 * @requires $browser
 * @requires $window
 * @requires $document
 *
 * @description
 * HTTP backend used by the {@link ng.$http service} that delegates to
 * XMLHttpRequest object or JSONP and deals with browser incompatibilities.
 *
 * You should never need to use this service directly, instead use the higher-level abstractions:
 * {@link ng.$http $http} or {@link ngResource.$resource $resource}.
 *
 * During testing this implementation is swapped with {@link ngMock.$httpBackend mock
 * $httpBackend} which can be trained with responses.
 */
function $HttpBackendProvider() {
  this.$get = ['$browser', '$window', '$document', function($browser, $window, $document) {
    return createHttpBackend($browser, XHR, $browser.defer, $window.angular.callbacks,
        $document[0], $window.location.protocol.replace(':', ''));
  }];
}

function createHttpBackend($browser, XHR, $browserDefer, callbacks, rawDocument, locationProtocol) {
  // TODO(vojta): fix the signature
  return function(method, url, post, callback, headers, timeout, withCredentials, responseType) {
    var status;
    $browser.$$incOutstandingRequestCount();
    url = url || $browser.url();

    if (lowercase(method) == 'jsonp') {
      var callbackId = '_' + (callbacks.counter++).toString(36);
      callbacks[callbackId] = function(data) {
        callbacks[callbackId].data = data;
      };

      var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
          function() {
        if (callbacks[callbackId].data) {
          completeRequest(callback, 200, callbacks[callbackId].data);
        } else {
          completeRequest(callback, status || -2);
        }
        delete callbacks[callbackId];
      });
    } else {
      var xhr = new XHR();
      xhr.open(method, url, true);
      forEach(headers, function(value, key) {
        if (value) xhr.setRequestHeader(key, value);
      });

      // In IE6 and 7, this might be called synchronously when xhr.send below is called and the
      // response is in the cache. the promise api will ensure that to the app code the api is
      // always async
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var responseHeaders = xhr.getAllResponseHeaders();

          // TODO(vojta): remove once Firefox 21 gets released.
          // begin: workaround to overcome Firefox CORS http response headers bug
          // https://bugzilla.mozilla.org/show_bug.cgi?id=608735
          // Firefox already patched in nightly. Should land in Firefox 21.

          // CORS "simple response headers" http://www.w3.org/TR/cors/
          var value,
              simpleHeaders = ["Cache-Control", "Content-Language", "Content-Type",
                                  "Expires", "Last-Modified", "Pragma"];
          if (!responseHeaders) {
            responseHeaders = "";
            forEach(simpleHeaders, function (header) {
              var value = xhr.getResponseHeader(header);
              if (value) {
                  responseHeaders += header + ": " + value + "\n";
              }
            });
          }
          // end of the workaround.

          // responseText is the old-school way of retrieving response (supported by IE8 & 9)
          // response and responseType properties were introduced in XHR Level2 spec (supported by IE10)
          completeRequest(callback,
              status || xhr.status,
              (xhr.responseType ? xhr.response : xhr.responseText),
              responseHeaders);
        }
      };

      if (withCredentials) {
        xhr.withCredentials = true;
      }

      if (responseType) {
        xhr.responseType = responseType;
      }

      xhr.send(post || '');
    }

    if (timeout > 0) {
      var timeoutId = $browserDefer(timeoutRequest, timeout);
    } else if (timeout && timeout.then) {
      timeout.then(timeoutRequest);
    }


    function timeoutRequest() {
      status = -1;
      jsonpDone && jsonpDone();
      xhr && xhr.abort();
    }

    function completeRequest(callback, status, response, headersString) {
      // URL_MATCH is defined in src/service/location.js
      var protocol = (url.match(SERVER_MATCH) || ['', locationProtocol])[1];

      // cancel timeout and subsequent timeout promise resolution
      timeoutId && $browserDefer.cancel(timeoutId);
      jsonpDone = xhr = null;

      // fix status code for file protocol (it's always 0)
      status = (protocol == 'file') ? (response ? 200 : 404) : status;

      // normalize IE bug (http://bugs.jquery.com/ticket/1450)
      status = status == 1223 ? 204 : status;

      callback(status, response, headersString);
      $browser.$$completeOutstandingRequest(noop);
    }
  };

  function jsonpReq(url, done) {
    // we can't use jQuery/jqLite here because jQuery does crazy shit with script elements, e.g.:
    // - fetches local scripts via XHR and evals them
    // - adds and immediately removes script elements from the document
    var script = rawDocument.createElement('script'),
        doneWrapper = function() {
          rawDocument.body.removeChild(script);
          if (done) done();
        };

    script.type = 'text/javascript';
    script.src = url;

    if (msie) {
      script.onreadystatechange = function() {
        if (/loaded|complete/.test(script.readyState)) doneWrapper();
      };
    } else {
      script.onload = script.onerror = doneWrapper;
    }

    rawDocument.body.appendChild(script);
    return doneWrapper;
  }
}

var $interpolateMinErr = minErr('$interpolate');

/**
 * @ngdoc object
 * @name ng.$interpolateProvider
 * @function
 *
 * @description
 *
 * Used for configuring the interpolation markup. Defaults to `{{` and `}}`.
 *
 * @example
   <doc:example module="customInterpolationApp">
     <doc:source>
      <script>
        var customInterpolationApp = angular.module('customInterpolationApp', []);

        customInterpolationApp.config(function($interpolateProvider) {
          $interpolateProvider.startSymbol('//');
          $interpolateProvider.endSymbol('//');
        });


        customInterpolationApp.controller('DemoController', function DemoController() {
            this.label = "This bindings is brought you you by // interpolation symbols.";
        });
      </script>
      <div ng-app="App" ng-controller="DemoController as demo">
          //demo.label//
      </div>
     </doc:source>
     <doc:scenario>
       it('should interpolate binding with custom symbols', function() {
         expect(binding('demo.label')).toBe('This bindings is brought you you by // interpolation symbols.');
       });
 </doc:scenario>
   </doc:example>
 */
function $InterpolateProvider() {
  var startSymbol = '{{';
  var endSymbol = '}}';

  /**
   * @ngdoc method
   * @name ng.$interpolateProvider#startSymbol
   * @methodOf ng.$interpolateProvider
   * @description
   * Symbol to denote start of expression in the interpolated string. Defaults to `{{`.
   *
   * @param {string=} value new value to set the starting symbol to.
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
   */
  this.startSymbol = function(value){
    if (value) {
      startSymbol = value;
      return this;
    } else {
      return startSymbol;
    }
  };

  /**
   * @ngdoc method
   * @name ng.$interpolateProvider#endSymbol
   * @methodOf ng.$interpolateProvider
   * @description
   * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
   *
   * @param {string=} value new value to set the ending symbol to.
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
   */
  this.endSymbol = function(value){
    if (value) {
      endSymbol = value;
      return this;
    } else {
      return endSymbol;
    }
  };


  this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
    var startSymbolLength = startSymbol.length,
        endSymbolLength = endSymbol.length;

    /**
     * @ngdoc function
     * @name ng.$interpolate
     * @function
     *
     * @requires $parse
     * @requires $sce
     *
     * @description
     *
     * Compiles a string with markup into an interpolation function. This service is used by the
     * HTML {@link ng.$compile $compile} service for data binding. See
     * {@link ng.$interpolateProvider $interpolateProvider} for configuring the
     * interpolation markup.
     *
     *
       <pre>
         var $interpolate = ...; // injected
         var exp = $interpolate('Hello {{name}}!');
         expect(exp({name:'Angular'}).toEqual('Hello Angular!');
       </pre>
     *
     *
     * @param {string} text The text with markup to interpolate.
     * @param {boolean=} mustHaveExpression if set to true then the interpolation string must have
     *    embedded expression in order to return an interpolation function. Strings with no
     *    embedded expression will return null for the interpolation function.
     * @param {string=} trustedContext when provided, the returned function passes the interpolated
     *    result through {@link ng.$sce#getTrusted $sce.getTrusted(interpolatedResult,
     *    trustedContext)} before returning it.  Refer to the {@link ng.$sce $sce} service that
     *    provides Strict Contextual Escaping for details.
     * @returns {function(context)} an interpolation function which is used to compute the interpolated
     *    string. The function has these parameters:
     *
     *    * `context`: an object against which any expressions embedded in the strings are evaluated
     *      against.
     *
     */
    function $interpolate(text, mustHaveExpression, trustedContext) {
      var startIndex,
          endIndex,
          index = 0,
          parts = [],
          length = text.length,
          hasInterpolation = false,
          fn,
          exp,
          concat = [];

      while(index < length) {
        if ( ((startIndex = text.indexOf(startSymbol, index)) != -1) &&
             ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) ) {
          (index != startIndex) && parts.push(text.substring(index, startIndex));
          parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex)));
          fn.exp = exp;
          index = endIndex + endSymbolLength;
          hasInterpolation = true;
        } else {
          // we did not find anything, so we have to add the remainder to the parts array
          (index != length) && parts.push(text.substring(index));
          index = length;
        }
      }

      if (!(length = parts.length)) {
        // we added, nothing, must have been an empty string.
        parts.push('');
        length = 1;
      }

      // Concatenating expressions makes it hard to reason about whether some combination of concatenated
      // values are unsafe to use and could easily lead to XSS.  By requiring that a single
      // expression be used for iframe[src], object[src], etc., we ensure that the value that's used
      // is assigned or constructed by some JS code somewhere that is more testable or make it
      // obvious that you bound the value to some user controlled value.  This helps reduce the load
      // when auditing for XSS issues.
      if (trustedContext && parts.length > 1) {
          throw $interpolateMinErr('noconcat',
              "Error while interpolating: {0}\nStrict Contextual Escaping disallows " +
              "interpolations that concatenate multiple expressions when a trusted value is " +
              "required.  See http://docs.angularjs.org/api/ng.$sce", text);
      }

      if (!mustHaveExpression  || hasInterpolation) {
        concat.length = length;
        fn = function(context) {
          try {
            for(var i = 0, ii = length, part; i<ii; i++) {
              if (typeof (part = parts[i]) == 'function') {
                part = part(context);
                if (trustedContext) {
                  part = $sce.getTrusted(trustedContext, part);
                } else {
                  part = $sce.valueOf(part);
                }
                if (part == null || part == undefined) {
                  part = '';
                } else if (typeof part != 'string') {
                  part = toJson(part);
                }
              }
              concat[i] = part;
            }
            return concat.join('');
          }
          catch(err) {
            var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text, err.toString());
            $exceptionHandler(newErr);
          }
        };
        fn.exp = text;
        fn.parts = parts;
        return fn;
      }
    }


    /**
     * @ngdoc method
     * @name ng.$interpolate#startSymbol
     * @methodOf ng.$interpolate
     * @description
     * Symbol to denote the start of expression in the interpolated string. Defaults to `{{`.
     *
     * Use {@link ng.$interpolateProvider#startSymbol $interpolateProvider#startSymbol} to change
     * the symbol.
     *
     * @returns {string} start symbol.
     */
    $interpolate.startSymbol = function() {
      return startSymbol;
    }


    /**
     * @ngdoc method
     * @name ng.$interpolate#endSymbol
     * @methodOf ng.$interpolate
     * @description
     * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
     *
     * Use {@link ng.$interpolateProvider#endSymbol $interpolateProvider#endSymbol} to change
     * the symbol.
     *
     * @returns {string} start symbol.
     */
    $interpolate.endSymbol = function() {
      return endSymbol;
    }

    return $interpolate;
  }];
}

/**
 * @ngdoc object
 * @name ng.$locale
 *
 * @description
 * $locale service provides localization rules for various Angular components. As of right now the
 * only public api is:
 *
 * * `id` – `{string}` – locale id formatted as `languageId-countryId` (e.g. `en-us`)
 */
function $LocaleProvider(){
  this.$get = function() {
    return {
      id: 'en-us',

      NUMBER_FORMATS: {
        DECIMAL_SEP: '.',
        GROUP_SEP: ',',
        PATTERNS: [
          { // Decimal Pattern
            minInt: 1,
            minFrac: 0,
            maxFrac: 3,
            posPre: '',
            posSuf: '',
            negPre: '-',
            negSuf: '',
            gSize: 3,
            lgSize: 3
          },{ //Currency Pattern
            minInt: 1,
            minFrac: 2,
            maxFrac: 2,
            posPre: '\u00A4',
            posSuf: '',
            negPre: '(\u00A4',
            negSuf: ')',
            gSize: 3,
            lgSize: 3
          }
        ],
        CURRENCY_SYM: '$'
      },

      DATETIME_FORMATS: {
        MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'
                .split(','),
        SHORTMONTH:  'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
        DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
        SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
        AMPMS: ['AM','PM'],
        medium: 'MMM d, y h:mm:ss a',
        short: 'M/d/yy h:mm a',
        fullDate: 'EEEE, MMMM d, y',
        longDate: 'MMMM d, y',
        mediumDate: 'MMM d, y',
        shortDate: 'M/d/yy',
        mediumTime: 'h:mm:ss a',
        shortTime: 'h:mm a'
      },

      pluralCat: function(num) {
        if (num === 1) {
          return 'one';
        }
        return 'other';
      }
    };
  };
}

var SERVER_MATCH = /^([^:]+):\/\/(\w+:{0,1}\w*@)?(\{?[\w\.-]*\}?)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,
    PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp': 21};
var $locationMinErr = minErr('$location');


/**
 * Encode path using encodeUriSegment, ignoring forward slashes
 *
 * @param {string} path Path to encode
 * @returns {string}
 */
function encodePath(path) {
  var segments = path.split('/'),
      i = segments.length;

  while (i--) {
    segments[i] = encodeUriSegment(segments[i]);
  }

  return segments.join('/');
}

function matchUrl(url, obj) {
  var match = SERVER_MATCH.exec(url);

  obj.$$protocol = match[1];
  obj.$$host = match[3];
  obj.$$port = int(match[5]) || DEFAULT_PORTS[match[1]] || null;
}

function matchAppUrl(url, obj) {
  var match = PATH_MATCH.exec(url);

  obj.$$path = decodeURIComponent(match[1]);
  obj.$$search = parseKeyValue(match[3]);
  obj.$$hash = decodeURIComponent(match[5] || '');

  // make sure path starts with '/';
  if (obj.$$path && obj.$$path.charAt(0) != '/') obj.$$path = '/' + obj.$$path;
}


function composeProtocolHostPort(protocol, host, port) {
  return protocol + '://' + host + (port == DEFAULT_PORTS[protocol] ? '' : ':' + port);
}

/**
 *
 * @param {string} begin
 * @param {string} whole
 * @param {string} otherwise
 * @returns {string} returns text from whole after begin or otherwise if it does not begin with expected string.
 */
function beginsWith(begin, whole, otherwise) {
  return whole.indexOf(begin) == 0 ? whole.substr(begin.length) : otherwise;
}


function stripHash(url) {
  var index = url.indexOf('#');
  return index == -1 ? url : url.substr(0, index);
}


function stripFile(url) {
  return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
}

/* return the server only (scheme://host:port) */
function serverBase(url) {
  return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
}


/**
 * LocationHtml5Url represents an url
 * This object is exposed as $location service when HTML5 mode is enabled and supported
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} basePrefix url path prefix
 */
function LocationHtml5Url(appBase, basePrefix) {
  this.$$html5 = true;
  basePrefix = basePrefix || '';
  var appBaseNoFile = stripFile(appBase);
  /**
   * Parse given html5 (regular) url string into properties
   * @param {string} newAbsoluteUrl HTML5 url
   * @private
   */
  this.$$parse = function(url) {
    var parsed = {}
    matchUrl(url, parsed);
    var pathUrl = beginsWith(appBaseNoFile, url);
    if (!isString(pathUrl)) {
      throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
    }
    matchAppUrl(pathUrl, parsed);
    extend(this, parsed);
    if (!this.$$path) {
      this.$$path = '/';
    }

    this.$$compose();
  };

  /**
   * Compose url and update `absUrl` property
   * @private
   */
  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    this.$$absUrl = appBaseNoFile + this.$$url.substr(1); // first char is always '/'
  };

  this.$$rewrite = function(url) {
    var appUrl, prevAppUrl;

    if ( (appUrl = beginsWith(appBase, url)) !== undefined ) {
      prevAppUrl = appUrl;
      if ( (appUrl = beginsWith(basePrefix, appUrl)) !== undefined ) {
        return appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
      } else {
        return appBase + prevAppUrl;
      }
    } else if ( (appUrl = beginsWith(appBaseNoFile, url)) !== undefined ) {
      return appBaseNoFile + appUrl;
    } else if (appBaseNoFile == url + '/') {
      return appBaseNoFile;
    }
  }
}


/**
 * LocationHashbangUrl represents url
 * This object is exposed as $location service when developer doesn't opt into html5 mode.
 * It also serves as the base class for html5 mode fallback on legacy browsers.
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} hashPrefix hashbang prefix
 */
function LocationHashbangUrl(appBase, hashPrefix) {
  var appBaseNoFile = stripFile(appBase);

  matchUrl(appBase, this);


  /**
   * Parse given hashbang url into properties
   * @param {string} url Hashbang url
   * @private
   */
  this.$$parse = function(url) {
    var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
    var withoutHashUrl = withoutBaseUrl.charAt(0) == '#'
        ? beginsWith(hashPrefix, withoutBaseUrl)
        : (this.$$html5)
          ? withoutBaseUrl
          : '';

    if (!isString(withoutHashUrl)) {
      throw $locationMinErr('ihshprfx', 'Invalid url "{0}", missing hash prefix "{1}".', url, hashPrefix);
    }
    matchAppUrl(withoutHashUrl, this);
    this.$$compose();
  };

  /**
   * Compose hashbang url and update `absUrl` property
   * @private
   */
  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
  };

  this.$$rewrite = function(url) {
    if(stripHash(appBase) == stripHash(url)) {
      return url;
    }
  }
}


/**
 * LocationHashbangUrl represents url
 * This object is exposed as $location service when html5 history api is enabled but the browser
 * does not support it.
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} hashPrefix hashbang prefix
 */
function LocationHashbangInHtml5Url(appBase, hashPrefix) {
  this.$$html5 = true;
  LocationHashbangUrl.apply(this, arguments);

  var appBaseNoFile = stripFile(appBase);

  this.$$rewrite = function(url) {
    var appUrl;

    if ( appBase == stripHash(url) ) {
      return url;
    } else if ( (appUrl = beginsWith(appBaseNoFile, url)) ) {
      return appBase + hashPrefix + appUrl;
    } else if ( appBaseNoFile === url + '/') {
      return appBaseNoFile;
    }
  }
}


LocationHashbangInHtml5Url.prototype =
  LocationHashbangUrl.prototype =
  LocationHtml5Url.prototype = {

  /**
   * Are we in html5 mode?
   * @private
   */
  $$html5: false,

  /**
   * Has any change been replacing ?
   * @private
   */
  $$replace: false,

  /**
   * @ngdoc method
   * @name ng.$location#absUrl
   * @methodOf ng.$location
   *
   * @description
   * This method is getter only.
   *
   * Return full url representation with all segments encoded according to rules specified in
   * {@link http://www.ietf.org/rfc/rfc3986.txt RFC 3986}.
   *
   * @return {string} full url
   */
  absUrl: locationGetter('$$absUrl'),

  /**
   * @ngdoc method
   * @name ng.$location#url
   * @methodOf ng.$location
   *
   * @description
   * This method is getter / setter.
   *
   * Return url (e.g. `/path?a=b#hash`) when called without any parameter.
   *
   * Change path, search and hash, when called with parameter and return `$location`.
   *
   * @param {string=} url New url without base prefix (e.g. `/path?a=b#hash`)
   * @param {string=} replace The path that will be changed
   * @return {string} url
   */
  url: function(url, replace) {
    if (isUndefined(url))
      return this.$$url;

    var match = PATH_MATCH.exec(url);
    if (match[1]) this.path(decodeURIComponent(match[1]));
    if (match[2] || match[1]) this.search(match[3] || '');
    this.hash(match[5] || '', replace);

    return this;
  },

  /**
   * @ngdoc method
   * @name ng.$location#protocol
   * @methodOf ng.$location
   *
   * @description
   * This method is getter only.
   *
   * Return protocol of current url.
   *
   * @return {string} protocol of current url
   */
  protocol: locationGetter('$$protocol'),

  /**
   * @ngdoc method
   * @name ng.$location#host
   * @methodOf ng.$location
   *
   * @description
   * This method is getter only.
   *
   * Return host of current url.
   *
   * @return {string} host of current url.
   */
  host: locationGetter('$$host'),

  /**
   * @ngdoc method
   * @name ng.$location#port
   * @methodOf ng.$location
   *
   * @description
   * This method is getter only.
   *
   * Return port of current url.
   *
   * @return {Number} port
   */
  port: locationGetter('$$port'),

  /**
   * @ngdoc method
   * @name ng.$location#path
   * @methodOf ng.$location
   *
   * @description
   * This method is getter / setter.
   *
   * Return path of current url when called without any parameter.
   *
   * Change path when called with parameter and return `$location`.
   *
   * Note: Path should always begin with forward slash (/), this method will add the forward slash
   * if it is missing.
   *
   * @param {string=} path New path
   * @return {string} path
   */
  path: locationGetterSetter('$$path', function(path) {
    return path.charAt(0) == '/' ? path : '/' + path;
  }),

  /**
   * @ngdoc method
   * @name ng.$location#search
   * @methodOf ng.$location
   *
   * @description
   * This method is getter / setter.
   *
   * Return search part (as object) of current url when called without any parameter.
   *
   * Change search part when called with parameter and return `$location`.
   *
   * @param {string|Object.<string>|Object.<Array.<string>>} search New search params - string or hash object. Hash object
   *    may contain an array of values, which will be decoded as duplicates in the url.
   * @param {string=} paramValue If `search` is a string, then `paramValue` will override only a
   *    single search parameter. If the value is `null`, the parameter will be deleted.
   *
   * @return {string} search
   */
  search: function(search, paramValue) {
    switch (arguments.length) {
      case 0:
        return this.$$search;
      case 1:
        if (isString(search)) {
          this.$$search = parseKeyValue(search);
        } else if (isObject(search)) {
          this.$$search = search;
        } else {
          throw $locationMinErr('isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
        }
        break;
      default:
        if (paramValue == undefined || paramValue == null) {
          delete this.$$search[search];
        } else {
          this.$$search[search] = paramValue;
        }
    }

    this.$$compose();
    return this;
  },

  /**
   * @ngdoc method
   * @name ng.$location#hash
   * @methodOf ng.$location
   *
   * @description
   * This method is getter / setter.
   *
   * Return hash fragment when called without any parameter.
   *
   * Change hash fragment when called with parameter and return `$location`.
   *
   * @param {string=} hash New hash fragment
   * @return {string} hash
   */
  hash: locationGetterSetter('$$hash', identity),

  /**
   * @ngdoc method
   * @name ng.$location#replace
   * @methodOf ng.$location
   *
   * @description
   * If called, all changes to $location during current `$digest` will be replacing current history
   * record, instead of adding new one.
   */
  replace: function() {
    this.$$replace = true;
    return this;
  }
};

function locationGetter(property) {
  return function() {
    return this[property];
  };
}


function locationGetterSetter(property, preprocess) {
  return function(value) {
    if (isUndefined(value))
      return this[property];

    this[property] = preprocess(value);
    this.$$compose();

    return this;
  };
}


/**
 * @ngdoc object
 * @name ng.$location
 *
 * @requires $browser
 * @requires $sniffer
 * @requires $rootElement
 *
 * @description
 * The $location service parses the URL in the browser address bar (based on the
 * {@link https://developer.mozilla.org/en/window.location window.location}) and makes the URL
 * available to your application. Changes to the URL in the address bar are reflected into
 * $location service and changes to $location are reflected into the browser address bar.
 *
 * **The $location service:**
 *
 * - Exposes the current URL in the browser address bar, so you can
 *   - Watch and observe the URL.
 *   - Change the URL.
 * - Synchronizes the URL with the browser when the user
 *   - Changes the address bar.
 *   - Clicks the back or forward button (or clicks a History link).
 *   - Clicks on a link.
 * - Represents the URL object as a set of methods (protocol, host, port, path, search, hash).
 *
 * For more information see {@link guide/dev_guide.services.$location Developer Guide: Angular
 * Services: Using $location}
 */

/**
 * @ngdoc object
 * @name ng.$locationProvider
 * @description
 * Use the `$locationProvider` to configure how the application deep linking paths are stored.
 */
function $LocationProvider(){
  var hashPrefix = '',
      html5Mode = false;

  /**
   * @ngdoc property
   * @name ng.$locationProvider#hashPrefix
   * @methodOf ng.$locationProvider
   * @description
   * @param {string=} prefix Prefix for hash part (containing path and search)
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.hashPrefix = function(prefix) {
    if (isDefined(prefix)) {
      hashPrefix = prefix;
      return this;
    } else {
      return hashPrefix;
    }
  };

  /**
   * @ngdoc property
   * @name ng.$locationProvider#html5Mode
   * @methodOf ng.$locationProvider
   * @description
   * @param {boolean=} mode Use HTML5 strategy if available.
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.html5Mode = function(mode) {
    if (isDefined(mode)) {
      html5Mode = mode;
      return this;
    } else {
      return html5Mode;
    }
  };

  this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement',
      function( $rootScope,   $browser,   $sniffer,   $rootElement) {
    var $location,
        LocationMode,
        baseHref = $browser.baseHref(), // if base[href] is undefined, it defaults to ''
        initialUrl = $browser.url(),
        appBase;

    if (html5Mode) {
      appBase = serverBase(initialUrl) + (baseHref || '/');
      LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
    } else {
      appBase = stripHash(initialUrl);
      LocationMode = LocationHashbangUrl;
    }
    $location = new LocationMode(appBase, '#' + hashPrefix);
    $location.$$parse($location.$$rewrite(initialUrl));

    $rootElement.on('click', function(event) {
      // TODO(vojta): rewrite link when opening in new tab/window (in legacy browser)
      // currently we open nice url link and redirect then

      if (event.ctrlKey || event.metaKey || event.which == 2) return;

      var elm = jqLite(event.target);

      // traverse the DOM up to find first A tag
      while (lowercase(elm[0].nodeName) !== 'a') {
        // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
      }

      var absHref = elm.prop('href');
      var rewrittenUrl = $location.$$rewrite(absHref);

      if (absHref && !elm.attr('target') && rewrittenUrl && !event.isDefaultPrevented()) {
        event.preventDefault();
        if (rewrittenUrl != $browser.url()) {
          // update location manually
          $location.$$parse(rewrittenUrl);
          $rootScope.$apply();
          // hack to work around FF6 bug 684208 when scenario runner clicks on links
          window.angular['ff-684208-preventDefault'] = true;
        }
      }
    });


    // rewrite hashbang url <> html5 url
    if ($location.absUrl() != initialUrl) {
      $browser.url($location.absUrl(), true);
    }

    // update $location when $browser url changes
    $browser.onUrlChange(function(newUrl) {
      if ($location.absUrl() != newUrl) {
        if ($rootScope.$broadcast('$locationChangeStart', newUrl, $location.absUrl()).defaultPrevented) {
          $browser.url($location.absUrl());
          return;
        }
        $rootScope.$evalAsync(function() {
          var oldUrl = $location.absUrl();

          $location.$$parse(newUrl);
          afterLocationChange(oldUrl);
        });
        if (!$rootScope.$$phase) $rootScope.$digest();
      }
    });

    // update browser
    var changeCounter = 0;
    $rootScope.$watch(function $locationWatch() {
      var oldUrl = $browser.url();
      var currentReplace = $location.$$replace;

      if (!changeCounter || oldUrl != $location.absUrl()) {
        changeCounter++;
        $rootScope.$evalAsync(function() {
          if ($rootScope.$broadcast('$locationChangeStart', $location.absUrl(), oldUrl).
              defaultPrevented) {
            $location.$$parse(oldUrl);
          } else {
            $browser.url($location.absUrl(), currentReplace);
            afterLocationChange(oldUrl);
          }
        });
      }
      $location.$$replace = false;

      return changeCounter;
    });

    return $location;

    function afterLocationChange(oldUrl) {
      $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl);
    }
}];
}

/**
 * @ngdoc object
 * @name ng.$log
 * @requires $window
 *
 * @description
 * Simple service for logging. Default implementation writes the message
 * into the browser's console (if present).
 *
 * The main purpose of this service is to simplify debugging and troubleshooting.
 *
 * @example
   <example>
     <file name="script.js">
       function LogCtrl($scope, $log) {
         $scope.$log = $log;
         $scope.message = 'Hello World!';
       }
     </file>
     <file name="index.html">
       <div ng-controller="LogCtrl">
         <p>Reload this page with open console, enter text and hit the log button...</p>
         Message:
         <input type="text" ng-model="message"/>
         <button ng-click="$log.log(message)">log</button>
         <button ng-click="$log.warn(message)">warn</button>
         <button ng-click="$log.info(message)">info</button>
         <button ng-click="$log.error(message)">error</button>
       </div>
     </file>
   </example>
 */

/**
 * @ngdoc object
 * @name ng.$logProvider
 * @description
 * Use the `$logProvider` to configure how the application logs messages
 */
function $LogProvider(){
  var debug = true,
      self = this;
  
  /**
   * @ngdoc property
   * @name ng.$logProvider#debugEnabled
   * @methodOf ng.$logProvider
   * @description
   * @param {string=} flag enable or disable debug level messages
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.debugEnabled = function(flag) {
	  if (isDefined(flag)) {
		  debug = flag;
		  return this;
	  } else {
		  return debug;
	  }
  };
  
  this.$get = ['$window', function($window){
    return {
      /**
       * @ngdoc method
       * @name ng.$log#log
       * @methodOf ng.$log
       *
       * @description
       * Write a log message
       */
      log: consoleLog('log'),

      /**
       * @ngdoc method
       * @name ng.$log#info
       * @methodOf ng.$log
       *
       * @description
       * Write an information message
       */
      info: consoleLog('info'),

      /**
       * @ngdoc method
       * @name ng.$log#warn
       * @methodOf ng.$log
       *
       * @description
       * Write a warning message
       */
      warn: consoleLog('warn'),

      /**
       * @ngdoc method
       * @name ng.$log#error
       * @methodOf ng.$log
       *
       * @description
       * Write an error message
       */
      error: consoleLog('error'),
      
      /**
       * @ngdoc method
       * @name ng.$log#debug
       * @methodOf ng.$log
       * 
       * @description
       * Write a debug message
       */
      debug: (function () {
    	var fn = consoleLog('debug');
    	
    	return function() {
    		if (debug) {
    			fn.apply(self, arguments);
    		}
    	}
      }())
    };

    function formatError(arg) {
      if (arg instanceof Error) {
        if (arg.stack) {
          arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
              ? 'Error: ' + arg.message + '\n' + arg.stack
              : arg.stack;
        } else if (arg.sourceURL) {
          arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
        }
      }
      return arg;
    }

    function consoleLog(type) {
      var console = $window.console || {},
          logFn = console[type] || console.log || noop;

      if (logFn.apply) {
        return function() {
          var args = [];
          forEach(arguments, function(arg) {
            args.push(formatError(arg));
          });
          return logFn.apply(console, args);
        };
      }

      // we are IE which either doesn't have window.console => this is noop and we do nothing,
      // or we are IE where console.log doesn't have apply so we log at least first 2 args
      return function(arg1, arg2) {
        logFn(arg1, arg2 == null ? '' : arg2);
      }
    }
  }];
}

var $parseMinErr = minErr('$parse');

// Sandboxing Angular Expressions
// ------------------------------
// Angular expressions are generally considered safe because these expressions only have direct access to $scope and
// locals. However, one can obtain the ability to execute arbitrary JS code by obtaining a reference to native JS
// functions such as the Function constructor.
//
// As an example, consider the following Angular expression:
//
//   {}.toString.constructor(alert("evil JS code"))
//
// We want to prevent this type of access. For the sake of performance, during the lexing phase we disallow any "dotted"
// access to any member named "constructor".
//
// For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor while evaluating
// the expression, which is a stronger but more expensive test. Since reflective calls are expensive anyway, this is not
// such a big deal compared to static dereferencing.
//
// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits against the
// expression language, but not to prevent exploits that were enabled by exposing sensitive JavaScript or browser apis
// on Scope. Exposing such objects on a Scope is never a good practice and therefore we are not even trying to protect
// against interaction with an object explicitly exposed in this way.
//
// A developer could foil the name check by aliasing the Function constructor under a different name on the scope.
//
// In general, it is not possible to access a Window object from an angular expression unless a window or some DOM
// object that has a reference to window is published onto a Scope.

function ensureSafeMemberName(name, fullExpression) {
  if (name === "constructor") {
    throw $parseMinErr('isecfld',
        'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
  }
  return name;
};

function ensureSafeObject(obj, fullExpression) {
  // nifty check if obj is Function that is fast and works across iframes and other contexts
  if (obj && obj.constructor === obj) {
    throw $parseMinErr('isecfn',
        'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
  // 
  } else if (// isWindow(obj)
      obj && obj.document && obj.location && obj.alert && obj.setInterval) {
    throw $parseMinErr('isecwindow',
        'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
  } else if (// isElement(obj)
      obj && (obj.nodeName || (obj.on && obj.find))) {
    throw $parseMinErr('isecdom',
        'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
  } else {
    return obj;
  }
}

var OPERATORS = {
    'null':function(){return null;},
    'true':function(){return true;},
    'false':function(){return false;},
    undefined:noop,
    '+':function(self, locals, a,b){
      a=a(self, locals); b=b(self, locals);
      if (isDefined(a)) {
        if (isDefined(b)) {
          return a + b;
        }
        return a;
      }
      return isDefined(b)?b:undefined;},
    '-':function(self, locals, a,b){a=a(self, locals); b=b(self, locals); return (isDefined(a)?a:0)-(isDefined(b)?b:0);},
    '*':function(self, locals, a,b){return a(self, locals)*b(self, locals);},
    '/':function(self, locals, a,b){return a(self, locals)/b(self, locals);},
    '%':function(self, locals, a,b){return a(self, locals)%b(self, locals);},
    '^':function(self, locals, a,b){return a(self, locals)^b(self, locals);},
    '=':noop,
    '===':function(self, locals, a, b){return a(self, locals)===b(self, locals);},
    '!==':function(self, locals, a, b){return a(self, locals)!==b(self, locals);},
    '==':function(self, locals, a,b){return a(self, locals)==b(self, locals);},
    '!=':function(self, locals, a,b){return a(self, locals)!=b(self, locals);},
    '<':function(self, locals, a,b){return a(self, locals)<b(self, locals);},
    '>':function(self, locals, a,b){return a(self, locals)>b(self, locals);},
    '<=':function(self, locals, a,b){return a(self, locals)<=b(self, locals);},
    '>=':function(self, locals, a,b){return a(self, locals)>=b(self, locals);},
    '&&':function(self, locals, a,b){return a(self, locals)&&b(self, locals);},
    '||':function(self, locals, a,b){return a(self, locals)||b(self, locals);},
    '&':function(self, locals, a,b){return a(self, locals)&b(self, locals);},
//    '|':function(self, locals, a,b){return a|b;},
    '|':function(self, locals, a,b){return b(self, locals)(self, locals, a(self, locals));},
    '!':function(self, locals, a){return !a(self, locals);}
};
var ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};

function lex(text, csp){
  var tokens = [],
      token,
      index = 0,
      json = [],
      ch,
      lastCh = ':'; // can start regexp

  while (index < text.length) {
    ch = text.charAt(index);
    if (is('"\'')) {
      readString(ch);
    } else if (isNumber(ch) || is('.') && isNumber(peek())) {
      readNumber();
    } else if (isIdent(ch)) {
      readIdent();
      // identifiers can only be if the preceding char was a { or ,
      if (was('{,') && json[0]=='{' &&
         (token=tokens[tokens.length-1])) {
        token.json = token.text.indexOf('.') == -1;
      }
    } else if (is('(){}[].,;:?')) {
      tokens.push({
        index:index,
        text:ch,
        json:(was(':[,') && is('{[')) || is('}]:,')
      });
      if (is('{[')) json.unshift(ch);
      if (is('}]')) json.shift();
      index++;
    } else if (isWhitespace(ch)) {
      index++;
      continue;
    } else {
      var ch2 = ch + peek(),
          ch3 = ch2 + peek(2),
          fn = OPERATORS[ch],
          fn2 = OPERATORS[ch2],
          fn3 = OPERATORS[ch3];
      if (fn3) {
        tokens.push({index:index, text:ch3, fn:fn3});
        index += 3;
      } else if (fn2) {
        tokens.push({index:index, text:ch2, fn:fn2});
        index += 2;
      } else if (fn) {
        tokens.push({index:index, text:ch, fn:fn, json: was('[,:') && is('+-')});
        index += 1;
      } else {
        throwError("Unexpected next character ", index, index+1);
      }
    }
    lastCh = ch;
  }
  return tokens;

  function is(chars) {
    return chars.indexOf(ch) != -1;
  }

  function was(chars) {
    return chars.indexOf(lastCh) != -1;
  }

  function peek(i) {
    var num = i || 1;
    return index + num < text.length ? text.charAt(index + num) : false;
  }
  function isNumber(ch) {
    return '0' <= ch && ch <= '9';
  }
  function isWhitespace(ch) {
    return ch == ' ' || ch == '\r' || ch == '\t' ||
           ch == '\n' || ch == '\v' || ch == '\u00A0'; // IE treats non-breaking space as \u00A0
  }
  function isIdent(ch) {
    return 'a' <= ch && ch <= 'z' ||
           'A' <= ch && ch <= 'Z' ||
           '_' == ch || ch == '$';
  }
  function isExpOperator(ch) {
    return ch == '-' || ch == '+' || isNumber(ch);
  }

  function throwError(error, start, end) {
    end = end || index;
    var colStr = (isDefined(start) ?
        "s " + start +  "-" + index + " [" + text.substring(start, end) + "]"
        : " " + end);
    throw $parseMinErr('lexerr', "Lexer Error: {0} at column{1} in expression [{2}].",
        error, colStr, text);
  }

  function readNumber() {
    var number = "";
    var start = index;
    while (index < text.length) {
      var ch = lowercase(text.charAt(index));
      if (ch == '.' || isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = peek();
        if (ch == 'e' && isExpOperator(peekCh)) {
          number += ch;
        } else if (isExpOperator(ch) &&
            peekCh && isNumber(peekCh) &&
            number.charAt(number.length - 1) == 'e') {
          number += ch;
        } else if (isExpOperator(ch) &&
            (!peekCh || !isNumber(peekCh)) &&
            number.charAt(number.length - 1) == 'e') {
          throwError('Invalid exponent');
        } else {
          break;
        }
      }
      index++;
    }
    number = 1 * number;
    tokens.push({index:start, text:number, json:true,
      fn:function() {return number;}});
  }
  function readIdent() {
    var ident = "",
        start = index,
        lastDot, peekIndex, methodName, ch;

    while (index < text.length) {
      ch = text.charAt(index);
      if (ch == '.' || isIdent(ch) || isNumber(ch)) {
        if (ch == '.') lastDot = index;
        ident += ch;
      } else {
        break;
      }
      index++;
    }

    //check if this is not a method invocation and if it is back out to last dot
    if (lastDot) {
      peekIndex = index;
      while(peekIndex < text.length) {
        ch = text.charAt(peekIndex);
        if (ch == '(') {
          methodName = ident.substr(lastDot - start + 1);
          ident = ident.substr(0, lastDot - start);
          index = peekIndex;
          break;
        }
        if(isWhitespace(ch)) {
          peekIndex++;
        } else {
          break;
        }
      }
    }


    var token = {
      index:start,
      text:ident
    };

    if (OPERATORS.hasOwnProperty(ident)) {
      token.fn = token.json = OPERATORS[ident];
    } else {
      var getter = getterFn(ident, csp, text);
      token.fn = extend(function(self, locals) {
        return (getter(self, locals));
      }, {
        assign: function(self, value) {
          return setter(self, ident, value, text);
        }
      });
    }

    tokens.push(token);

    if (methodName) {
      tokens.push({
        index:lastDot,
        text: '.',
        json: false
      });
      tokens.push({
        index: lastDot + 1,
        text: methodName,
        json: false
      });
    }
  }

  function readString(quote) {
    var start = index;
    index++;
    var string = "";
    var rawString = quote;
    var escape = false;
    while (index < text.length) {
      var ch = text.charAt(index);
      rawString += ch;
      if (escape) {
        if (ch == 'u') {
          var hex = text.substring(index + 1, index + 5);
          if (!hex.match(/[\da-f]{4}/i))
            throwError( "Invalid unicode escape [\\u" + hex + "]");
          index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          if (rep) {
            string += rep;
          } else {
            string += ch;
          }
        }
        escape = false;
      } else if (ch == '\\') {
        escape = true;
      } else if (ch == quote) {
        index++;
        tokens.push({
          index:start,
          text:rawString,
          string:string,
          json:true,
          fn:function() { return string; }
        });
        return;
      } else {
        string += ch;
      }
      index++;
    }
    throwError("Unterminated quote", start);
  }
}

/////////////////////////////////////////

function parser(text, json, $filter, csp){
  var ZERO = valueFn(0),
      value,
      tokens = lex(text, csp),
      assignment = _assignment,
      functionCall = _functionCall,
      fieldAccess = _fieldAccess,
      objectIndex = _objectIndex,
      filterChain = _filterChain;

  if(json){
    // The extra level of aliasing is here, just in case the lexer misses something, so that
    // we prevent any accidental execution in JSON.
    assignment = logicalOR;
    functionCall =
      fieldAccess =
      objectIndex =
      filterChain =
        function() { throwError("is not valid json", {text:text, index:0}); };
    value = primary();
  } else {
    value = statements();
  }
  if (tokens.length !== 0) {
    throwError("is an unexpected token", tokens[0]);
  }
  value.literal = !!value.literal;
  value.constant = !!value.constant;
  return value;

  ///////////////////////////////////
  function throwError(msg, token) {
    throw $parseMinErr('syntax',
        "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].",
        token.text, msg, (token.index + 1), text, text.substring(token.index));
  }

  function peekToken() {
    if (tokens.length === 0)
      throw $parseMinErr('ueoe', "Unexpected end of expression: {0}", text);
    return tokens[0];
  }

  function peek(e1, e2, e3, e4) {
    if (tokens.length > 0) {
      var token = tokens[0];
      var t = token.text;
      if (t==e1 || t==e2 || t==e3 || t==e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  }

  function expect(e1, e2, e3, e4){
    var token = peek(e1, e2, e3, e4);
    if (token) {
      if (json && !token.json) {
        throwError("is not valid json", token);
      }
      tokens.shift();
      return token;
    }
    return false;
  }

  function consume(e1){
    if (!expect(e1)) {
      throwError("is unexpected, expecting [" + e1 + "]", peek());
    }
  }

  function unaryFn(fn, right) {
    return extend(function(self, locals) {
      return fn(self, locals, right);
    }, {
      constant:right.constant
    });
  }

  function ternaryFn(left, middle, right){
    return extend(function(self, locals){
      return left(self, locals) ? middle(self, locals) : right(self, locals);
    }, {
      constant: left.constant && middle.constant && right.constant
    });
  }

  function binaryFn(left, fn, right) {
    return extend(function(self, locals) {
      return fn(self, locals, left, right);
    }, {
      constant:left.constant && right.constant
    });
  }

  function statements() {
    var statements = [];
    while(true) {
      if (tokens.length > 0 && !peek('}', ')', ';', ']'))
        statements.push(filterChain());
      if (!expect(';')) {
        // optimize for the common case where there is only one statement.
        // TODO(size): maybe we should not support multiple statements?
        return statements.length == 1
          ? statements[0]
          : function(self, locals){
            var value;
            for ( var i = 0; i < statements.length; i++) {
              var statement = statements[i];
              if (statement)
                value = statement(self, locals);
            }
            return value;
          };
      }
    }
  }

  function _filterChain() {
    var left = expression();
    var token;
    while(true) {
      if ((token = expect('|'))) {
        left = binaryFn(left, token.fn, filter());
      } else {
        return left;
      }
    }
  }

  function filter() {
    var token = expect();
    var fn = $filter(token.text);
    var argsFn = [];
    while(true) {
      if ((token = expect(':'))) {
        argsFn.push(expression());
      } else {
        var fnInvoke = function(self, locals, input){
          var args = [input];
          for ( var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](self, locals));
          }
          return fn.apply(self, args);
        };
        return function() {
          return fnInvoke;
        };
      }
    }
  }

  function expression() {
    return assignment();
  }

  function _assignment() {
    var left = ternary();
    var right;
    var token;
    if ((token = expect('='))) {
      if (!left.assign) {
        throwError("implies assignment but [" +
          text.substring(0, token.index) + "] can not be assigned to", token);
      }
      right = ternary();
      return function(scope, locals){
        return left.assign(scope, right(scope, locals), locals);
      };
    } else {
      return left;
    }
  }

  function ternary() {
    var left = logicalOR();
    var middle;
    var token;
    if((token = expect('?'))){
      middle = ternary();
      if((token = expect(':'))){
        return ternaryFn(left, middle, ternary());
      }
      else {
        throwError('expected :', token);
      }
    }
    else {
      return left;
    }
  }

  function logicalOR() {
    var left = logicalAND();
    var token;
    while(true) {
      if ((token = expect('||'))) {
        left = binaryFn(left, token.fn, logicalAND());
      } else {
        return left;
      }
    }
  }

  function logicalAND() {
    var left = equality();
    var token;
    if ((token = expect('&&'))) {
      left = binaryFn(left, token.fn, logicalAND());
    }
    return left;
  }

  function equality() {
    var left = relational();
    var token;
    if ((token = expect('==','!=','===','!=='))) {
      left = binaryFn(left, token.fn, equality());
    }
    return left;
  }

  function relational() {
    var left = additive();
    var token;
    if ((token = expect('<', '>', '<=', '>='))) {
      left = binaryFn(left, token.fn, relational());
    }
    return left;
  }

  function additive() {
    var left = multiplicative();
    var token;
    while ((token = expect('+','-'))) {
      left = binaryFn(left, token.fn, multiplicative());
    }
    return left;
  }

  function multiplicative() {
    var left = unary();
    var token;
    while ((token = expect('*','/','%'))) {
      left = binaryFn(left, token.fn, unary());
    }
    return left;
  }

  function unary() {
    var token;
    if (expect('+')) {
      return primary();
    } else if ((token = expect('-'))) {
      return binaryFn(ZERO, token.fn, unary());
    } else if ((token = expect('!'))) {
      return unaryFn(token.fn, unary());
    } else {
      return primary();
    }
  }


  function primary() {
    var primary;
    if (expect('(')) {
      primary = filterChain();
      consume(')');
    } else if (expect('[')) {
      primary = arrayDeclaration();
    } else if (expect('{')) {
      primary = object();
    } else {
      var token = expect();
      primary = token.fn;
      if (!primary) {
        throwError("not a primary expression", token);
      }
      if (token.json) {
        primary.constant = primary.literal = true;
      }
    }

    var next, context;
    while ((next = expect('(', '[', '.'))) {
      if (next.text === '(') {
        primary = functionCall(primary, context);
        context = null;
      } else if (next.text === '[') {
        context = primary;
        primary = objectIndex(primary);
      } else if (next.text === '.') {
        context = primary;
        primary = fieldAccess(primary);
      } else {
        throwError("IMPOSSIBLE");
      }
    }
    return primary;
  }

  function _fieldAccess(object) {
    var field = expect().text;
    var getter = getterFn(field, csp, text);
    return extend(
        function(scope, locals, self) {
          return getter(self || object(scope, locals), locals);
        },
        {
          assign:function(scope, value, locals) {
            return setter(object(scope, locals), field, value, text);
          }
        }
    );
  }

  function _objectIndex(obj) {
    var indexFn = expression();
    consume(']');
    return extend(
      function(self, locals){
        var o = obj(self, locals),
            i = indexFn(self, locals),
            v, p;

        if (!o) return undefined;
        v = ensureSafeObject(o[i], text);
        if (v && v.then) {
          p = v;
          if (!('$$v' in v)) {
            p.$$v = undefined;
            p.then(function(val) { p.$$v = val; });
          }
          v = v.$$v;
        }
        return v;
      }, {
        assign:function(self, value, locals){
          var key = indexFn(self, locals);
          // prevent overwriting of Function.constructor which would break ensureSafeObject check
          return ensureSafeObject(obj(self, locals), text)[key] = value;
        }
      });
  }

  function _functionCall(fn, contextGetter) {
    var argsFn = [];
    if (peekToken().text != ')') {
      do {
        argsFn.push(expression());
      } while (expect(','));
    }
    consume(')');
    return function(scope, locals){
      var args = [],
          context = contextGetter ? contextGetter(scope, locals) : scope;

      for ( var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](scope, locals));
      }
      var fnPtr = fn(scope, locals, context) || noop;

      ensureSafeObject(fnPtr, text);

      // IE stupidity!
      var v = fnPtr.apply
          ? fnPtr.apply(context, args)
          : fnPtr(args[0], args[1], args[2], args[3], args[4]);

      // Check for promise
      if (v && v.then) {
        var p = v;
        if (!('$$v' in v)) {
          p.$$v = undefined;
          p.then(function(val) { p.$$v = val; });
        }
        v = v.$$v;
      }

      return ensureSafeObject(v, text);
    };
  }

  // This is used with json array declaration
  function arrayDeclaration () {
    var elementFns = [];
    var allConstant = true;
    if (peekToken().text != ']') {
      do {
        var elementFn = expression();
        elementFns.push(elementFn);
        if (!elementFn.constant) {
          allConstant = false;
        }
      } while (expect(','));
    }
    consume(']');
    return extend(function(self, locals){
      var array = [];
      for ( var i = 0; i < elementFns.length; i++) {
        array.push(elementFns[i](self, locals));
      }
      return array;
    }, {
      literal:true,
      constant:allConstant
    });
  }

  function object () {
    var keyValues = [];
    var allConstant = true;
    if (peekToken().text != '}') {
      do {
        var token = expect(),
        key = token.string || token.text;
        consume(":");
        var value = expression();
        keyValues.push({key:key, value:value});
        if (!value.constant) {
          allConstant = false;
        }
      } while (expect(','));
    }
    consume('}');
    return extend(function(self, locals){
      var object = {};
      for ( var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i];
        object[keyValue.key] = keyValue.value(self, locals);
      }
      return object;
    }, {
      literal:true,
      constant:allConstant
    });
  }
}

//////////////////////////////////////////////////
// Parser helper functions
//////////////////////////////////////////////////

function setter(obj, path, setValue, fullExp) {
  var element = path.split('.'), key;
  for (var i = 0; element.length > 1; i++) {
    key = ensureSafeMemberName(element.shift(), fullExp);
    var propertyObj = obj[key];
    if (!propertyObj) {
      propertyObj = {};
      obj[key] = propertyObj;
    }
    obj = propertyObj;
    if (obj.then) {
      if (!("$$v" in obj)) {
        (function(promise) {
          promise.then(function(val) { promise.$$v = val; }); }
        )(obj);
      }
      if (obj.$$v === undefined) {
        obj.$$v = {};
      }
      obj = obj.$$v;
    }
  }
  key = ensureSafeMemberName(element.shift(), fullExp);
  obj[key] = setValue;
  return setValue;
}

var getterFnCache = {};

/**
 * Implementation of the "Black Hole" variant from:
 * - http://jsperf.com/angularjs-parse-getter/4
 * - http://jsperf.com/path-evaluation-simplified/7
 */
function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp) {
  ensureSafeMemberName(key0, fullExp);
  ensureSafeMemberName(key1, fullExp);
  ensureSafeMemberName(key2, fullExp);
  ensureSafeMemberName(key3, fullExp);
  ensureSafeMemberName(key4, fullExp);
  return function(scope, locals) {
    var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope,
        promise;

    if (pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key0];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    if (!key1 || pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key1];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    if (!key2 || pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key2];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    if (!key3 || pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key3];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    if (!key4 || pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key4];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    return pathVal;
  };
}

function getterFn(path, csp, fullExp) {
  if (getterFnCache.hasOwnProperty(path)) {
    return getterFnCache[path];
  }

  var pathKeys = path.split('.'),
      pathKeysLength = pathKeys.length,
      fn;

  if (csp) {
    fn = (pathKeysLength < 6)
        ? cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp)
        : function(scope, locals) {
          var i = 0, val;
          do {
            val = cspSafeGetterFn(
                    pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp
                  )(scope, locals);

            locals = undefined; // clear after first iteration
            scope = val;
          } while (i < pathKeysLength);
          return val;
        }
  } else {
    var code = 'var l, fn, p;\n';
    forEach(pathKeys, function(key, index) {
      ensureSafeMemberName(key, fullExp);
      code += 'if(s === null || s === undefined) return s;\n' +
              'l=s;\n' +
              's='+ (index
                      // we simply dereference 's' on any .dot notation
                      ? 's'
                      // but if we are first then we check locals first, and if so read it first
                      : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n' +
              'if (s && s.then) {\n' +
                ' if (!("$$v" in s)) {\n' +
                  ' p=s;\n' +
                  ' p.$$v = undefined;\n' +
                  ' p.then(function(v) {p.$$v=v;});\n' +
                  '}\n' +
                ' s=s.$$v\n' +
              '}\n';
    });
    code += 'return s;';
    fn = Function('s', 'k', code); // s=scope, k=locals
    fn.toString = function() { return code; };
  }

  return getterFnCache[path] = fn;
}

///////////////////////////////////

/**
 * @ngdoc function
 * @name ng.$parse
 * @function
 *
 * @description
 *
 * Converts Angular {@link guide/expression expression} into a function.
 *
 * <pre>
 *   var getter = $parse('user.name');
 *   var setter = getter.assign;
 *   var context = {user:{name:'angular'}};
 *   var locals = {user:{name:'local'}};
 *
 *   expect(getter(context)).toEqual('angular');
 *   setter(context, 'newValue');
 *   expect(context.user.name).toEqual('newValue');
 *   expect(getter(context, locals)).toEqual('local');
 * </pre>
 *
 *
 * @param {string} expression String expression to compile.
 * @returns {function(context, locals)} a function which represents the compiled expression:
 *
 *    * `context` – `{object}` – an object against which any expressions embedded in the strings
 *      are evaluated against (typically a scope object).
 *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
 *      `context`.
 *
 *    The returned function also has the following properties:
 *      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
 *        literal.
 *      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
 *        constant literals.
 *      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
 *        set to a function to change its value on the given context.
 *
 */
function $ParseProvider() {
  var cache = {};
  this.$get = ['$filter', '$sniffer', function($filter, $sniffer) {
    return function(exp) {
      switch(typeof exp) {
        case 'string':
          return cache.hasOwnProperty(exp)
            ? cache[exp]
            : cache[exp] =  parser(exp, false, $filter, $sniffer.csp);
        case 'function':
          return exp;
        default:
          return noop;
      }
    };
  }];
}

/**
 * @ngdoc service
 * @name ng.$q
 * @requires $rootScope
 *
 * @description
 * A promise/deferred implementation inspired by [Kris Kowal's Q](https://github.com/kriskowal/q).
 *
 * [The CommonJS Promise proposal](http://wiki.commonjs.org/wiki/Promises) describes a promise as an
 * interface for interacting with an object that represents the result of an action that is
 * performed asynchronously, and may or may not be finished at any given point in time.
 *
 * From the perspective of dealing with error handling, deferred and promise APIs are to
 * asynchronous programming what `try`, `catch` and `throw` keywords are to synchronous programming.
 *
 * <pre>
 *   // for the purpose of this example let's assume that variables `$q` and `scope` are
 *   // available in the current lexical scope (they could have been injected or passed in).
 *
 *   function asyncGreet(name) {
 *     var deferred = $q.defer();
 *
 *     setTimeout(function() {
 *       // since this fn executes async in a future turn of the event loop, we need to wrap
 *       // our code into an $apply call so that the model changes are properly observed.
 *       scope.$apply(function() {
 *         deferred.notify('About to greet ' + name + '.');
 *
 *         if (okToGreet(name)) {
 *           deferred.resolve('Hello, ' + name + '!');
 *         } else {
 *           deferred.reject('Greeting ' + name + ' is not allowed.');
 *         }
 *       });
 *     }, 1000);
 *
 *     return deferred.promise;
 *   }
 *
 *   var promise = asyncGreet('Robin Hood');
 *   promise.then(function(greeting) {
 *     alert('Success: ' + greeting);
 *   }, function(reason) {
 *     alert('Failed: ' + reason);
 *   }, function(update) {
 *     alert('Got notification: ' + update);
 *   });
 * </pre>
 *
 * At first it might not be obvious why this extra complexity is worth the trouble. The payoff
 * comes in the way of
 * [guarantees that promise and deferred APIs make](https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md).
 *
 * Additionally the promise api allows for composition that is very hard to do with the
 * traditional callback ([CPS](http://en.wikipedia.org/wiki/Continuation-passing_style)) approach.
 * For more on this please see the [Q documentation](https://github.com/kriskowal/q) especially the
 * section on serial or parallel joining of promises.
 *
 *
 * # The Deferred API
 *
 * A new instance of deferred is constructed by calling `$q.defer()`.
 *
 * The purpose of the deferred object is to expose the associated Promise instance as well as APIs
 * that can be used for signaling the successful or unsuccessful completion, as well as the status
 * of the task.
 *
 * **Methods**
 *
 * - `resolve(value)` – resolves the derived promise with the `value`. If the value is a rejection
 *   constructed via `$q.reject`, the promise will be rejected instead.
 * - `reject(reason)` – rejects the derived promise with the `reason`. This is equivalent to
 *   resolving it with a rejection constructed via `$q.reject`.
 * - `notify(value)` - provides updates on the status of the promises execution. This may be called
 *   multiple times before the promise is either resolved or rejected.
 *
 * **Properties**
 *
 * - promise – `{Promise}` – promise object associated with this deferred.
 *
 *
 * # The Promise API
 *
 * A new promise instance is created when a deferred instance is created and can be retrieved by
 * calling `deferred.promise`.
 *
 * The purpose of the promise object is to allow for interested parties to get access to the result
 * of the deferred task when it completes.
 *
 * **Methods**
 *
 * - `then(successCallback, errorCallback, notifyCallback)` – regardless of when the promise was or
 *   will be resolved or rejected, `then` calls one of the success or error callbacks asynchronously
 *   as soon as the result is available. The callbacks are called with a single argument: the result
 *   or rejection reason. Additionally, the notify callback may be called zero or more times to
 *   provide a progress indication, before the promise is resolved or rejected.
 *
 *   This method *returns a new promise* which is resolved or rejected via the return value of the
 *   `successCallback`, `errorCallback`. It also notifies via the return value of the `notifyCallback`
 *   method. The promise can not be resolved or rejected from the notifyCallback method.
 *
 * - `catch(errorCallback)` – shorthand for `promise.then(null, errorCallback)`
 *
 * - `finally(callback)` – allows you to observe either the fulfillment or rejection of a promise,
 *   but to do so without modifying the final value. This is useful to release resources or do some
 *   clean-up that needs to be done whether the promise was rejected or resolved. See the [full
 *   specification](https://github.com/kriskowal/q/wiki/API-Reference#promisefinallycallback) for
 *   more information.
 *
 *   Because `finally` is a reserved word in JavaScript and reserved keywords are not supported as
 *   property names by ES3, you'll need to invoke the method like `promise['finally'](callback)` to
 *   make your code IE8 compatible.
 *
 * # Chaining promises
 *
 * Because calling the `then` method of a promise returns a new derived promise, it is easily possible
 * to create a chain of promises:
 *
 * <pre>
 *   promiseB = promiseA.then(function(result) {
 *     return result + 1;
 *   });
 *
 *   // promiseB will be resolved immediately after promiseA is resolved and its value
 *   // will be the result of promiseA incremented by 1
 * </pre>
 *
 * It is possible to create chains of any length and since a promise can be resolved with another
 * promise (which will defer its resolution further), it is possible to pause/defer resolution of
 * the promises at any point in the chain. This makes it possible to implement powerful APIs like
 * $http's response interceptors.
 *
 *
 * # Differences between Kris Kowal's Q and $q
 *
 *  There are three main differences:
 *
 * - $q is integrated with the {@link ng.$rootScope.Scope} Scope model observation
 *   mechanism in angular, which means faster propagation of resolution or rejection into your
 *   models and avoiding unnecessary browser repaints, which would result in flickering UI.
 * - $q promises are recognized by the templating engine in angular, which means that in templates
 *   you can treat promises attached to a scope as if they were the resulting values.
 * - Q has many more features than $q, but that comes at a cost of bytes. $q is tiny, but contains
 *   all the important functionality needed for common async tasks.
 *
 *  # Testing
 *
 *  <pre>
 *    it('should simulate promise', inject(function($q, $rootScope) {
 *      var deferred = $q.defer();
 *      var promise = deferred.promise;
 *      var resolvedValue;
 *
 *      promise.then(function(value) { resolvedValue = value; });
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Simulate resolving of promise
 *      deferred.resolve(123);
 *      // Note that the 'then' function does not get called synchronously.
 *      // This is because we want the promise API to always be async, whether or not
 *      // it got called synchronously or asynchronously.
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Propagate promise resolution to 'then' functions using $apply().
 *      $rootScope.$apply();
 *      expect(resolvedValue).toEqual(123);
 *    });
 *  </pre>
 */
function $QProvider() {

  this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {
    return qFactory(function(callback) {
      $rootScope.$evalAsync(callback);
    }, $exceptionHandler);
  }];
}


/**
 * Constructs a promise manager.
 *
 * @param {function(function)} nextTick Function for executing functions in the next turn.
 * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for
 *     debugging purposes.
 * @returns {object} Promise manager.
 */
function qFactory(nextTick, exceptionHandler) {

  /**
   * @ngdoc
   * @name ng.$q#defer
   * @methodOf ng.$q
   * @description
   * Creates a `Deferred` object which represents a task which will finish in the future.
   *
   * @returns {Deferred} Returns a new instance of deferred.
   */
  var defer = function() {
    var pending = [],
        value, deferred;

    deferred = {

      resolve: function(val) {
        if (pending) {
          var callbacks = pending;
          pending = undefined;
          value = ref(val);

          if (callbacks.length) {
            nextTick(function() {
              var callback;
              for (var i = 0, ii = callbacks.length; i < ii; i++) {
                callback = callbacks[i];
                value.then(callback[0], callback[1], callback[2]);
              }
            });
          }
        }
      },


      reject: function(reason) {
        deferred.resolve(reject(reason));
      },


      notify: function(progress) {
        if (pending) {
          var callbacks = pending;

          if (pending.length) {
            nextTick(function() {
              var callback;
              for (var i = 0, ii = callbacks.length; i < ii; i++) {
                callback = callbacks[i];
                callback[2](progress);
              }
            });
          }
        }
      },


      promise: {
        then: function(callback, errback, progressback) {
          var result = defer();

          var wrappedCallback = function(value) {
            try {
              result.resolve((isFunction(callback) ? callback : defaultCallback)(value));
            } catch(e) {
              result.reject(e);
              exceptionHandler(e);
            }
          };

          var wrappedErrback = function(reason) {
            try {
              result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
            } catch(e) {
              result.reject(e);
              exceptionHandler(e);
            }
          };

          var wrappedProgressback = function(progress) {
            try {
              result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress));
            } catch(e) {
              exceptionHandler(e);
            }
          };

          if (pending) {
            pending.push([wrappedCallback, wrappedErrback, wrappedProgressback]);
          } else {
            value.then(wrappedCallback, wrappedErrback, wrappedProgressback);
          }

          return result.promise;
        },

        "catch": function(callback) {
          return this.then(null, callback);
        },

        "finally": function(callback) {

          function makePromise(value, resolved) {
            var result = defer();
            if (resolved) {
              result.resolve(value);
            } else {
              result.reject(value);
            }
            return result.promise;
          }

          function handleCallback(value, isResolved) {
            var callbackOutput = null;
            try {
              callbackOutput = (callback ||defaultCallback)();
            } catch(e) {
              return makePromise(e, false);
            }
            if (callbackOutput && isFunction(callbackOutput.then)) {
              return callbackOutput.then(function() {
                return makePromise(value, isResolved);
              }, function(error) {
                return makePromise(error, false);
              });
            } else {
              return makePromise(value, isResolved);
            }
          }

          return this.then(function(value) {
            return handleCallback(value, true);
          }, function(error) {
            return handleCallback(error, false);
          });
        }
      }
    };

    return deferred;
  };


  var ref = function(value) {
    if (value && isFunction(value.then)) return value;
    return {
      then: function(callback) {
        var result = defer();
        nextTick(function() {
          result.resolve(callback(value));
        });
        return result.promise;
      }
    };
  };


  /**
   * @ngdoc
   * @name ng.$q#reject
   * @methodOf ng.$q
   * @description
   * Creates a promise that is resolved as rejected with the specified `reason`. This api should be
   * used to forward rejection in a chain of promises. If you are dealing with the last promise in
   * a promise chain, you don't need to worry about it.
   *
   * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of
   * `reject` as the `throw` keyword in JavaScript. This also means that if you "catch" an error via
   * a promise error callback and you want to forward the error to the promise derived from the
   * current promise, you have to "rethrow" the error by returning a rejection constructed via
   * `reject`.
   *
   * <pre>
   *   promiseB = promiseA.then(function(result) {
   *     // success: do something and resolve promiseB
   *     //          with the old or a new result
   *     return result;
   *   }, function(reason) {
   *     // error: handle the error if possible and
   *     //        resolve promiseB with newPromiseOrValue,
   *     //        otherwise forward the rejection to promiseB
   *     if (canHandle(reason)) {
   *      // handle the error and recover
   *      return newPromiseOrValue;
   *     }
   *     return $q.reject(reason);
   *   });
   * </pre>
   *
   * @param {*} reason Constant, message, exception or an object representing the rejection reason.
   * @returns {Promise} Returns a promise that was already resolved as rejected with the `reason`.
   */
  var reject = function(reason) {
    return {
      then: function(callback, errback) {
        var result = defer();
        nextTick(function() {
          try {
            result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
          } catch(e) {
            result.reject(e);
            exceptionHandler(e);
          }
        });
        return result.promise;
      }
    };
  };


  /**
   * @ngdoc
   * @name ng.$q#when
   * @methodOf ng.$q
   * @description
   * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.
   * This is useful when you are dealing with an object that might or might not be a promise, or if
   * the promise comes from a source that can't be trusted.
   *
   * @param {*} value Value or a promise
   * @returns {Promise} Returns a promise of the passed value or promise
   */
  var when = function(value, callback, errback, progressback) {
    var result = defer(),
        done;

    var wrappedCallback = function(value) {
      try {
        return (isFunction(callback) ? callback : defaultCallback)(value);
      } catch (e) {
        exceptionHandler(e);
        return reject(e);
      }
    };

    var wrappedErrback = function(reason) {
      try {
        return (isFunction(errback) ? errback : defaultErrback)(reason);
      } catch (e) {
        exceptionHandler(e);
        return reject(e);
      }
    };

    var wrappedProgressback = function(progress) {
      try {
        return (isFunction(progressback) ? progressback : defaultCallback)(progress);
      } catch (e) {
        exceptionHandler(e);
      }
    };

    nextTick(function() {
      ref(value).then(function(value) {
        if (done) return;
        done = true;
        result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback));
      }, function(reason) {
        if (done) return;
        done = true;
        result.resolve(wrappedErrback(reason));
      }, function(progress) {
        if (done) return;
        result.notify(wrappedProgressback(progress));
      });
    });

    return result.promise;
  };


  function defaultCallback(value) {
    return value;
  }


  function defaultErrback(reason) {
    return reject(reason);
  }


  /**
   * @ngdoc
   * @name ng.$q#all
   * @methodOf ng.$q
   * @description
   * Combines multiple promises into a single promise that is resolved when all of the input
   * promises are resolved.
   *
   * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
   * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,
   *   each value corresponding to the promise at the same index/key in the `promises` array/hash. If any of
   *   the promises is resolved with a rejection, this resulting promise will be rejected with the
   *   same rejection value.
   */
  function all(promises) {
    var deferred = defer(),
        counter = 0,
        results = isArray(promises) ? [] : {};

    forEach(promises, function(promise, key) {
      counter++;
      ref(promise).then(function(value) {
        if (results.hasOwnProperty(key)) return;
        results[key] = value;
        if (!(--counter)) deferred.resolve(results);
      }, function(reason) {
        if (results.hasOwnProperty(key)) return;
        deferred.reject(reason);
      });
    });

    if (counter === 0) {
      deferred.resolve(results);
    }

    return deferred.promise;
  }

  return {
    defer: defer,
    reject: reject,
    when: when,
    all: all
  };
}

/**
 * DESIGN NOTES
 *
 * The design decisions behind the scope are heavily favored for speed and memory consumption.
 *
 * The typical use of scope is to watch the expressions, which most of the time return the same
 * value as last time so we optimize the operation.
 *
 * Closures construction is expensive in terms of speed as well as memory:
 *   - No closures, instead use prototypical inheritance for API
 *   - Internal state needs to be stored on scope directly, which means that private state is
 *     exposed as $$____ properties
 *
 * Loop operations are optimized by using while(count--) { ... }
 *   - this means that in order to keep the same order of execution as addition we have to add
 *     items to the array at the beginning (shift) instead of at the end (push)
 *
 * Child scopes are created and removed often
 *   - Using an array would be slow since inserts in middle are expensive so we use linked list
 *
 * There are few watches then a lot of observers. This is why you don't want the observer to be
 * implemented in the same way as watch. Watch requires return of initialization function which
 * are expensive to construct.
 */


/**
 * @ngdoc object
 * @name ng.$rootScopeProvider
 * @description
 *
 * Provider for the $rootScope service.
 */

/**
 * @ngdoc function
 * @name ng.$rootScopeProvider#digestTtl
 * @methodOf ng.$rootScopeProvider
 * @description
 *
 * Sets the number of digest iterations the scope should attempt to execute before giving up and
 * assuming that the model is unstable.
 *
 * The current default is 10 iterations.
 *
 * @param {number} limit The number of digest iterations.
 */


/**
 * @ngdoc object
 * @name ng.$rootScope
 * @description
 *
 * Every application has a single root {@link ng.$rootScope.Scope scope}.
 * All other scopes are child scopes of the root scope. Scopes provide mechanism for watching the model and provide
 * event processing life cycle. See {@link guide/scope developer guide on scopes}.
 */
function $RootScopeProvider(){
  var TTL = 10;
  var $rootScopeMinErr = minErr('$rootScope');

  this.digestTtl = function(value) {
    if (arguments.length) {
      TTL = value;
    }
    return TTL;
  };

  this.$get = ['$injector', '$exceptionHandler', '$parse', '$browser',
      function( $injector,   $exceptionHandler,   $parse,   $browser) {

    /**
     * @ngdoc function
     * @name ng.$rootScope.Scope
     *
     * @description
     * A root scope can be retrieved using the {@link ng.$rootScope $rootScope} key from the
     * {@link AUTO.$injector $injector}. Child scopes are created using the
     * {@link ng.$rootScope.Scope#$new $new()} method. (Most scopes are created automatically when
     * compiled HTML template is executed.)
     *
     * Here is a simple scope snippet to show how you can interact with the scope.
     * <pre>
     * <file src="./test/ng/rootScopeSpec.js" tag="docs1" />
     * </pre>
     *
     * # Inheritance
     * A scope can inherit from a parent scope, as in this example:
     * <pre>
         var parent = $rootScope;
         var child = parent.$new();

         parent.salutation = "Hello";
         child.name = "World";
         expect(child.salutation).toEqual('Hello');

         child.salutation = "Welcome";
         expect(child.salutation).toEqual('Welcome');
         expect(parent.salutation).toEqual('Hello');
     * </pre>
     *
     *
     * @param {Object.<string, function()>=} providers Map of service factory which need to be provided
     *     for the current scope. Defaults to {@link ng}.
     * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should
     *     append/override services provided by `providers`. This is handy when unit-testing and having
     *     the need to override a default service.
     * @returns {Object} Newly created scope.
     *
     */
    function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this['this'] = this.$root =  this;
      this.$$destroyed = false;
      this.$$asyncQueue = [];
      this.$$postDigestQueue = [];
      this.$$listeners = {};
      this.$$isolateBindings = {};
    }

    /**
     * @ngdoc property
     * @name ng.$rootScope.Scope#$id
     * @propertyOf ng.$rootScope.Scope
     * @returns {number} Unique scope ID (monotonically increasing alphanumeric sequence) useful for
     *   debugging.
     */


    Scope.prototype = {
      constructor: Scope,
      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$new
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Creates a new child {@link ng.$rootScope.Scope scope}.
       *
       * The parent scope will propagate the {@link ng.$rootScope.Scope#$digest $digest()} and
       * {@link ng.$rootScope.Scope#$digest $digest()} events. The scope can be removed from the scope
       * hierarchy using {@link ng.$rootScope.Scope#$destroy $destroy()}.
       *
       * {@link ng.$rootScope.Scope#$destroy $destroy()} must be called on a scope when it is desired for
       * the scope and its child scopes to be permanently detached from the parent and thus stop
       * participating in model change detection and listener notification by invoking.
       *
       * @param {boolean} isolate If true, then the scope does not prototypically inherit from the
       *         parent scope. The scope is isolated, as it can not see parent scope properties.
       *         When creating widgets, it is useful for the widget to not accidentally read parent
       *         state.
       *
       * @returns {Object} The newly created child scope.
       *
       */
      $new: function(isolate) {
        var Child,
            child;

        if (isolate) {
          child = new Scope();
          child.$root = this.$root;
          // ensure that there is just one async queue per $rootScope and its children
          child.$$asyncQueue = this.$$asyncQueue;
          child.$$postDigestQueue = this.$$postDigestQueue;
        } else {
          Child = function() {}; // should be anonymous; This is so that when the minifier munges
            // the name it does not become random set of chars. This will then show up as class
            // name in the debugger.
          Child.prototype = this;
          child = new Child();
          child.$id = nextUid();
        }
        child['this'] = child;
        child.$$listeners = {};
        child.$parent = this;
        child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null;
        child.$$prevSibling = this.$$childTail;
        if (this.$$childHead) {
          this.$$childTail.$$nextSibling = child;
          this.$$childTail = child;
        } else {
          this.$$childHead = this.$$childTail = child;
        }
        return child;
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$watch
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
       *
       * - The `watchExpression` is called on every call to {@link ng.$rootScope.Scope#$digest $digest()} and
       *   should return the value that will be watched. (Since {@link ng.$rootScope.Scope#$digest $digest()}
       *   reruns when it detects changes the `watchExpression` can execute multiple times per
       *   {@link ng.$rootScope.Scope#$digest $digest()} and should be idempotent.)
       * - The `listener` is called only when the value from the current `watchExpression` and the
       *   previous call to `watchExpression` are not equal (with the exception of the initial run,
       *   see below). The inequality is determined according to
       *   {@link angular.equals} function. To save the value of the object for later comparison, the
       *   {@link angular.copy} function is used. It also means that watching complex options will
       *   have adverse memory and performance implications.
       * - The watch `listener` may change the model, which may trigger other `listener`s to fire. This
       *   is achieved by rerunning the watchers until no changes are detected. The rerun iteration
       *   limit is 10 to prevent an infinite loop deadlock.
       *
       *
       * If you want to be notified whenever {@link ng.$rootScope.Scope#$digest $digest} is called,
       * you can register a `watchExpression` function with no `listener`. (Since `watchExpression`
       * can execute multiple times per {@link ng.$rootScope.Scope#$digest $digest} cycle when a change is
       * detected, be prepared for multiple calls to your listener.)
       *
       * After a watcher is registered with the scope, the `listener` fn is called asynchronously
       * (via {@link ng.$rootScope.Scope#$evalAsync $evalAsync}) to initialize the
       * watcher. In rare cases, this is undesirable because the listener is called when the result
       * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you
       * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the
       * listener was called due to initialization.
       *
       *
       * # Example
       * <pre>
           // let's assume that scope was dependency injected as the $rootScope
           var scope = $rootScope;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) { scope.counter = scope.counter + 1; });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // no variable change
           expect(scope.counter).toEqual(0);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(1);
       * </pre>
       *
       *
       *
       * @param {(function()|string)} watchExpression Expression that is evaluated on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. A change in the return value triggers a
       *    call to the `listener`.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(scope)`: called with current `scope` as a parameter.
       * @param {(function()|string)=} listener Callback called whenever the return value of
       *   the `watchExpression` changes.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(newValue, oldValue, scope)`: called with current and previous values as parameters.
       *
       * @param {boolean=} objectEquality Compare object for equality rather than for reference.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $watch: function(watchExp, listener, objectEquality) {
        var scope = this,
            get = compileToFn(watchExp, 'watch'),
            array = scope.$$watchers,
            watcher = {
              fn: listener,
              last: initWatchVal,
              get: get,
              exp: watchExp,
              eq: !!objectEquality
            };

        // in the case user pass string, we need to compile it, do we really need this ?
        if (!isFunction(listener)) {
          var listenFn = compileToFn(listener || noop, 'listener');
          watcher.fn = function(newVal, oldVal, scope) {listenFn(scope);};
        }

        if (typeof watchExp == 'string' && get.constant) {
          var originalFn = watcher.fn;
          watcher.fn = function(newVal, oldVal, scope) {
            originalFn.call(this, newVal, oldVal, scope);
            arrayRemove(array, watcher);
          };
        }

        if (!array) {
          array = scope.$$watchers = [];
        }
        // we use unshift since we use a while loop in $digest for speed.
        // the while loop reads in reverse order.
        array.unshift(watcher);

        return function() {
          arrayRemove(array, watcher);
        };
      },


      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$watchCollection
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Shallow watches the properties of an object and fires whenever any of the properties change
       * (for arrays, this implies watching the array items; for object maps, this implies watching the properties).
       * If a change is detected, the `listener` callback is fired.
       *
       * - The `obj` collection is observed via standard $watch operation and is examined on every call to $digest() to
       *   see if any items have been added, removed, or moved.
       * - The `listener` is called whenever anything within the `obj` has changed. Examples include adding, removing,
       *   and moving items belonging to an object or array.
       *
       *
       * # Example
       * <pre>
          $scope.names = ['igor', 'matias', 'misko', 'james'];
          $scope.dataCount = 4;

          $scope.$watchCollection('names', function(newNames, oldNames) {
            $scope.dataCount = newNames.length;
          });

          expect($scope.dataCount).toEqual(4);
          $scope.$digest();

          //still at 4 ... no changes
          expect($scope.dataCount).toEqual(4);

          $scope.names.pop();
          $scope.$digest();

          //now there's been a change
          expect($scope.dataCount).toEqual(3);
       * </pre>
       *
       *
       * @param {string|Function(scope)} obj Evaluated as {@link guide/expression expression}. The expression value
       *    should evaluate to an object or an array which is observed on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. Any shallow change within the collection will trigger
       *    a call to the `listener`.
       *
       * @param {function(newCollection, oldCollection, scope)} listener a callback function that is fired with both
       *    the `newCollection` and `oldCollection` as parameters.
       *    The `newCollection` object is the newly modified data obtained from the `obj` expression and the
       *    `oldCollection` object is a copy of the former collection data.
       *    The `scope` refers to the current scope.
       *
       * @returns {function()} Returns a de-registration function for this listener. When the de-registration function
       * is executed, the internal watch operation is terminated.
       */
      $watchCollection: function(obj, listener) {
        var self = this;
        var oldValue;
        var newValue;
        var changeDetected = 0;
        var objGetter = $parse(obj);
        var internalArray = [];
        var internalObject = {};
        var oldLength = 0;

        function $watchCollectionWatch() {
          newValue = objGetter(self);
          var newLength, key;

          if (!isObject(newValue)) {
            if (oldValue !== newValue) {
              oldValue = newValue;
              changeDetected++;
            }
          } else if (isArrayLike(newValue)) {
            if (oldValue !== internalArray) {
              // we are transitioning from something which was not an array into array.
              oldValue = internalArray;
              oldLength = oldValue.length = 0;
              changeDetected++;
            }

            newLength = newValue.length;

            if (oldLength !== newLength) {
              // if lengths do not match we need to trigger change notification
              changeDetected++;
              oldValue.length = oldLength = newLength;
            }
            // copy the items to oldValue and look for changes.
            for (var i = 0; i < newLength; i++) {
              if (oldValue[i] !== newValue[i]) {
                changeDetected++;
                oldValue[i] = newValue[i];
              }
            }
          } else {
            if (oldValue !== internalObject) {
              // we are transitioning from something which was not an object into object.
              oldValue = internalObject = {};
              oldLength = 0;
              changeDetected++;
            }
            // copy the items to oldValue and look for changes.
            newLength = 0;
            for (key in newValue) {
              if (newValue.hasOwnProperty(key)) {
                newLength++;
                if (oldValue.hasOwnProperty(key)) {
                  if (oldValue[key] !== newValue[key]) {
                    changeDetected++;
                    oldValue[key] = newValue[key];
                  }
                } else {
                  oldLength++;
                  oldValue[key] = newValue[key];
                  changeDetected++;
                }
              }
            }
            if (oldLength > newLength) {
              // we used to have more keys, need to find them and destroy them.
              changeDetected++;
              for(key in oldValue) {
                if (oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key)) {
                  oldLength--;
                  delete oldValue[key];
                }
              }
            }
          }
          return changeDetected;
        }

        function $watchCollectionAction() {
          listener(newValue, oldValue, self);
        }

        return this.$watch($watchCollectionWatch, $watchCollectionAction);
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$digest
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Processes all of the {@link ng.$rootScope.Scope#$watch watchers} of the current scope and its children.
       * Because a {@link ng.$rootScope.Scope#$watch watcher}'s listener can change the model, the
       * `$digest()` keeps calling the {@link ng.$rootScope.Scope#$watch watchers} until no more listeners are
       * firing. This means that it is possible to get into an infinite loop. This function will throw
       * `'Maximum iteration limit exceeded.'` if the number of iterations exceeds 10.
       *
       * Usually, you don't call `$digest()` directly in
       * {@link ng.directive:ngController controllers} or in
       * {@link ng.$compileProvider#directive directives}.
       * Instead, you should call {@link ng.$rootScope.Scope#$apply $apply()} (typically from within a
       * {@link ng.$compileProvider#directive directives}), which will force a `$digest()`.
       *
       * If you want to be notified whenever `$digest()` is called,
       * you can register a `watchExpression` function with {@link ng.$rootScope.Scope#$watch $watch()}
       * with no `listener`.
       *
       * In unit tests, you may need to call `$digest()` to simulate the scope life cycle.
       *
       * # Example
       * <pre>
           var scope = ...;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // no variable change
           expect(scope.counter).toEqual(0);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(1);
       * </pre>
       *
       */
      $digest: function() {
        var watch, value, last,
            watchers,
            asyncQueue = this.$$asyncQueue,
            postDigestQueue = this.$$postDigestQueue,
            length,
            dirty, ttl = TTL,
            next, current, target = this,
            watchLog = [],
            logIdx, logMsg;

        beginPhase('$digest');

        do { // "while dirty" loop
          dirty = false;
          current = target;

          while(asyncQueue.length) {
            try {
              current.$eval(asyncQueue.shift());
            } catch (e) {
              $exceptionHandler(e);
            }
          }

          do { // "traverse the scopes" loop
            if ((watchers = current.$$watchers)) {
              // process our watches
              length = watchers.length;
              while (length--) {
                try {
                  watch = watchers[length];
                  // Most common watches are on primitives, in which case we can short
                  // circuit it with === operator, only when === fails do we use .equals
                  if (watch && (value = watch.get(current)) !== (last = watch.last) &&
                      !(watch.eq
                          ? equals(value, last)
                          : (typeof value == 'number' && typeof last == 'number'
                             && isNaN(value) && isNaN(last)))) {
                    dirty = true;
                    watch.last = watch.eq ? copy(value) : value;
                    watch.fn(value, ((last === initWatchVal) ? value : last), current);
                    if (ttl < 5) {
                      logIdx = 4 - ttl;
                      if (!watchLog[logIdx]) watchLog[logIdx] = [];
                      logMsg = (isFunction(watch.exp))
                          ? 'fn: ' + (watch.exp.name || watch.exp.toString())
                          : watch.exp;
                      logMsg += '; newVal: ' + toJson(value) + '; oldVal: ' + toJson(last);
                      watchLog[logIdx].push(logMsg);
                    }
                  }
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
            }

            // Insanity Warning: scope depth-first traversal
            // yes, this code is a bit crazy, but it works and we have tests to prove it!
            // this piece should be kept in sync with the traversal in $broadcast
            if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
              while(current !== target && !(next = current.$$nextSibling)) {
                current = current.$parent;
              }
            }
          } while ((current = next));

          if(dirty && !(ttl--)) {
            clearPhase();
            throw $rootScopeMinErr('infdig',
                '{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}',
                TTL, toJson(watchLog));
          }
        } while (dirty || asyncQueue.length);

        clearPhase();

        while(postDigestQueue.length) {
          try {
            postDigestQueue.shift()();
          } catch (e) {
            $exceptionHandler(e);
          }
        }
      },


      /**
       * @ngdoc event
       * @name ng.$rootScope.Scope#$destroy
       * @eventOf ng.$rootScope.Scope
       * @eventType broadcast on scope being destroyed
       *
       * @description
       * Broadcasted when a scope and its children are being destroyed.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$destroy
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Removes the current scope (and all of its children) from the parent scope. Removal implies
       * that calls to {@link ng.$rootScope.Scope#$digest $digest()} will no longer
       * propagate to the current scope and its children. Removal also implies that the current
       * scope is eligible for garbage collection.
       *
       * The `$destroy()` is usually used by directives such as
       * {@link ng.directive:ngRepeat ngRepeat} for managing the
       * unrolling of the loop.
       *
       * Just before a scope is destroyed, a `$destroy` event is broadcasted on this scope.
       * Application code can register a `$destroy` event handler that will give it a chance to
       * perform any necessary cleanup.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */
      $destroy: function() {
        // we can't destroy the root scope or a scope that has been already destroyed
        if ($rootScope == this || this.$$destroyed) return;
        var parent = this.$parent;

        this.$broadcast('$destroy');
        this.$$destroyed = true;

        if (parent.$$childHead == this) parent.$$childHead = this.$$nextSibling;
        if (parent.$$childTail == this) parent.$$childTail = this.$$prevSibling;
        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;

        // This is bogus code that works around Chrome's GC leak
        // see: https://github.com/angular/angular.js/issues/1313#issuecomment-10378451
        this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
            this.$$childTail = null;
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$eval
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Executes the `expression` on the current scope and returns the result. Any exceptions in the
       * expression are propagated (uncaught). This is useful when evaluating Angular expressions.
       *
       * # Example
       * <pre>
           var scope = ng.$rootScope.Scope();
           scope.a = 1;
           scope.b = 2;

           expect(scope.$eval('a+b')).toEqual(3);
           expect(scope.$eval(function(scope){ return scope.a + scope.b; })).toEqual(3);
       * </pre>
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in  {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */
      $eval: function(expr, locals) {
        return $parse(expr)(this, locals);
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$evalAsync
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Executes the expression on the current scope at a later point in time.
       *
       * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only that:
       *
       *   - it will execute after the function that scheduled the evaluation (preferably before DOM rendering).
       *   - at least one {@link ng.$rootScope.Scope#$digest $digest cycle} will be performed after `expression` execution.
       *
       * Any exceptions from the execution of the expression are forwarded to the
       * {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * __Note:__ if this function is called outside of a `$digest` cycle, a new `$digest` cycle will be scheduled.
       * However, it is encouraged to always call code that changes the model from within an `$apply` call.
       * That includes code evaluated via `$evalAsync`.
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       */
      $evalAsync: function(expr) {
        // if we are outside of an $digest loop and this is the first time we are scheduling async task also schedule
        // async auto-flush
        if (!$rootScope.$$phase && !$rootScope.$$asyncQueue.length) {
          $browser.defer(function() {
            if ($rootScope.$$asyncQueue.length) {
              $rootScope.$digest();
            }
          });
        }

        this.$$asyncQueue.push(expr);
      },

      $$postDigest : function(fn) {
        this.$$postDigestQueue.push(fn);
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$apply
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * `$apply()` is used to execute an expression in angular from outside of the angular framework.
       * (For example from browser DOM events, setTimeout, XHR or third party libraries).
       * Because we are calling into the angular framework we need to perform proper scope life cycle
       * of {@link ng.$exceptionHandler exception handling},
       * {@link ng.$rootScope.Scope#$digest executing watches}.
       *
       * ## Life cycle
       *
       * # Pseudo-Code of `$apply()`
       * <pre>
           function $apply(expr) {
             try {
               return $eval(expr);
             } catch (e) {
               $exceptionHandler(e);
             } finally {
               $root.$digest();
             }
           }
       * </pre>
       *
       *
       * Scope's `$apply()` method transitions through the following stages:
       *
       * 1. The {@link guide/expression expression} is executed using the
       *    {@link ng.$rootScope.Scope#$eval $eval()} method.
       * 2. Any exceptions from the execution of the expression are forwarded to the
       *    {@link ng.$exceptionHandler $exceptionHandler} service.
       * 3. The {@link ng.$rootScope.Scope#$watch watch} listeners are fired immediately after the expression
       *    was executed using the {@link ng.$rootScope.Scope#$digest $digest()} method.
       *
       *
       * @param {(string|function())=} exp An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */
      $apply: function(expr) {
        try {
          beginPhase('$apply');
          return this.$eval(expr);
        } catch (e) {
          $exceptionHandler(e);
        } finally {
          clearPhase();
          try {
            $rootScope.$digest();
          } catch (e) {
            $exceptionHandler(e);
            throw e;
          }
        }
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$on
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Listens on events of a given type. See {@link ng.$rootScope.Scope#$emit $emit} for discussion of
       * event life cycle.
       *
       * The event listener function format is: `function(event, args...)`. The `event` object
       * passed into the listener has the following attributes:
       *
       *   - `targetScope` - `{Scope}`: the scope on which the event was `$emit`-ed or `$broadcast`-ed.
       *   - `currentScope` - `{Scope}`: the current scope which is handling the event.
       *   - `name` - `{string}`: name of the event.
       *   - `stopPropagation` - `{function=}`: calling `stopPropagation` function will cancel further event
       *     propagation (available only for events that were `$emit`-ed).
       *   - `preventDefault` - `{function}`: calling `preventDefault` sets `defaultPrevented` flag to true.
       *   - `defaultPrevented` - `{boolean}`: true if `preventDefault` was called.
       *
       * @param {string} name Event name to listen on.
       * @param {function(event, args...)} listener Function to call when the event is emitted.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $on: function(name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(listener);

        return function() {
          namedListeners[indexOf(namedListeners, listener)] = null;
        };
      },


      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$emit
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Dispatches an event `name` upwards through the scope hierarchy notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$emit` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get notified.
       * Afterwards, the event traverses upwards toward the root scope and calls all registered
       * listeners along the way. The event will stop propagating if one of the listeners cancels it.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to emit.
       * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
       * @return {Object} Event object (see {@link ng.$rootScope.Scope#$on}).
       */
      $emit: function(name, args) {
        var empty = [],
            namedListeners,
            scope = this,
            stopPropagation = false,
            event = {
              name: name,
              targetScope: scope,
              stopPropagation: function() {stopPropagation = true;},
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            i, length;

        do {
          namedListeners = scope.$$listeners[name] || empty;
          event.currentScope = scope;
          for (i=0, length=namedListeners.length; i<length; i++) {

            // if listeners were deregistered, defragment the array
            if (!namedListeners[i]) {
              namedListeners.splice(i, 1);
              i--;
              length--;
              continue;
            }
            try {
              namedListeners[i].apply(null, listenerArgs);
              if (stopPropagation) return event;
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          //traverse upwards
          scope = scope.$parent;
        } while (scope);

        return event;
      },


      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$broadcast
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Dispatches an event `name` downwards to all child scopes (and their children) notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$broadcast` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get notified.
       * Afterwards, the event propagates to all direct and indirect scopes of the current scope and
       * calls all registered listeners along the way. The event cannot be canceled.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to broadcast.
       * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
       * @return {Object} Event object, see {@link ng.$rootScope.Scope#$on}
       */
      $broadcast: function(name, args) {
        var target = this,
            current = target,
            next = target,
            event = {
              name: name,
              targetScope: target,
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            listeners, i, length;

        //down while you can, then up and next sibling or up and next sibling until back at root
        do {
          current = next;
          event.currentScope = current;
          listeners = current.$$listeners[name] || [];
          for (i=0, length = listeners.length; i<length; i++) {
            // if listeners were deregistered, defragment the array
            if (!listeners[i]) {
              listeners.splice(i, 1);
              i--;
              length--;
              continue;
            }

            try {
              listeners[i].apply(null, listenerArgs);
            } catch(e) {
              $exceptionHandler(e);
            }
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $digest
          if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
            while(current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        } while ((current = next));

        return event;
      }
    };

    var $rootScope = new Scope();

    return $rootScope;


    function beginPhase(phase) {
      if ($rootScope.$$phase) {
        throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
      }

      $rootScope.$$phase = phase;
    }

    function clearPhase() {
      $rootScope.$$phase = null;
    }

    function compileToFn(exp, name) {
      var fn = $parse(exp);
      assertArgFn(fn, name);
      return fn;
    }

    /**
     * function used as an initial value for watchers.
     * because it's unique we can easily tell it apart from other values
     */
    function initWatchVal() {}
  }];
}

var $sceMinErr = minErr('$sce');

var SCE_CONTEXTS = {
  HTML: 'html',
  CSS: 'css',
  URL: 'url',
  // RESOURCE_URL is a subtype of URL used in contexts where a privileged resource is sourced from a
  // url.  (e.g. ng-include, script src, templateUrl)
  RESOURCE_URL: 'resourceUrl',
  JS: 'js'
};


/**
 * @ngdoc service
 * @name ng.$sceDelegate
 * @function
 *
 * @description
 *
 * `$sceDelegate` is a service that is used by the `$sce` service to provide {@link ng.$sce Strict
 * Contextual Escaping (SCE)} services to AngularJS.
 *
 * Typically, you would configure or override the {@link ng.$sceDelegate $sceDelegate} instead of
 * the `$sce` service to customize the way Strict Contextual Escaping works in AngularJS.  This is
 * because, while the `$sce` provides numerous shorthand methods, etc., you really only need to
 * override 3 core functions (`trustAs`, `getTrusted` and `valueOf`) to replace the way things
 * work because `$sce` delegates to `$sceDelegate` for these operations.
 *
 * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} to configure this service.
 *
 * The default instance of `$sceDelegate` should work out of the box with little pain.  While you
 * can override it completely to change the behavior of `$sce`, the common case would
 * involve configuring the {@link ng.$sceDelegateProvider $sceDelegateProvider} instead by setting
 * your own whitelists and blacklists for trusting URLs used for loading AngularJS resources such as
 * templates.  Refer {@link ng.$sceDelegateProvider#resourceUrlWhitelist
 * $sceDelegateProvider.resourceUrlWhitelist} and {@link
 * ng.$sceDelegateProvider#resourceUrlBlacklist $sceDelegateProvider.resourceUrlBlacklist}
 */

/**
 * @ngdoc object
 * @name ng.$sceDelegateProvider
 * @description
 *
 * The $sceDelegateProvider provider allows developers to configure the {@link ng.$sceDelegate
 * $sceDelegate} service.  This allows one to get/set the whitelists and blacklists used to ensure
 * that URLs used for sourcing Angular templates are safe.  Refer {@link
 * ng.$sceDelegateProvider#resourceUrlWhitelist $sceDelegateProvider.resourceUrlWhitelist} and
 * {@link ng.$sceDelegateProvider#resourceUrlBlacklist $sceDelegateProvider.resourceUrlBlacklist}
 *
 * Read more about {@link ng.$sce Strict Contextual Escaping (SCE)}.
 */

function $SceDelegateProvider() {
  this.SCE_CONTEXTS = SCE_CONTEXTS;

  // Resource URLs can also be trusted by policy.
  var resourceUrlWhitelist = ['self'],
      resourceUrlBlacklist = [];

  /**
   * @ngdoc function
   * @name ng.sceDelegateProvider#resourceUrlWhitelist
   * @methodOf ng.$sceDelegateProvider
   * @function
   *
   * @param {Array=} whitelist When provided, replaces the resourceUrlWhitelist with the value
   *     provided.  This must be an array.
   *
   *     Each element of this array must either be a regex or the special string `'self'`.
   *
   *     When a regex is used, it is matched against the normalized / absolute URL of the resource
   *     being tested.
   *
   *     The **special string** `'self'` can be used to match against all URLs of the same domain as the
   *     application document with the same protocol (allows sourcing https resources from http documents.)
   *
   *     Please note that **an empty whitelist array will block all URLs**!
   *
   * @return {Array} the currently set whitelist array.
   *
   * The **default value** when no whitelist has been explicitly set is `['self']`.
   *
   * @description
   * Sets/Gets the whitelist of trusted resource URLs.
   */
  this.resourceUrlWhitelist = function (value) {
    if (arguments.length) {
      resourceUrlWhitelist = value;
    }
    return resourceUrlWhitelist;
  };

  /**
   * @ngdoc function
   * @name ng.sceDelegateProvider#resourceUrlBlacklist
   * @methodOf ng.$sceDelegateProvider
   * @function
   *
   * @param {Array=} blacklist When provided, replaces the resourceUrlBlacklist with the value
   *     provided.  This must be an array.
   *
   *     Each element of this array must either be a regex or the special string `'self'` (see
   *     `resourceUrlWhitelist` for meaning - it's only really useful there.)
   *
   *     When a regex is used, it is matched against the normalized / absolute URL of the resource
   *     being tested.
   *
   *     The typical usage for the blacklist is to **block [open redirects](http://cwe.mitre.org/data/definitions/601.html)**
   *     served by your domain as these would otherwise be trusted but actually return content from the redirected
   *     domain.
   *
   *     Finally, **the blacklist overrides the whitelist** and has the final say.
   *
   * @return {Array} the currently set blacklist array.
   *
   * The **default value** when no whitelist has been explicitly set is the empty array (i.e. there is
   * no blacklist.)
   *
   * @description
   * Sets/Gets the blacklist of trusted resource URLs.
   */

  this.resourceUrlBlacklist = function (value) {
    if (arguments.length) {
      resourceUrlBlacklist = value;
    }
    return resourceUrlBlacklist;
  };

  this.$get = ['$log', '$document', '$injector', '$$urlUtils', function(
                $log,   $document,   $injector,   $$urlUtils) {

    var htmlSanitizer = function htmlSanitizer(html) {
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    };

    if ($injector.has('$sanitize')) {
      htmlSanitizer = $injector.get('$sanitize');
    }


    function matchUrl(matcher, parsedUrl) {
      if (matcher === 'self') {
        return $$urlUtils.isSameOrigin(parsedUrl);
      } else {
        return !!parsedUrl.href.match(matcher);
      }
    }

    function isResourceUrlAllowedByPolicy(url) {
      var parsedUrl = $$urlUtils.resolve(url.toString(), true);
      var i, n, allowed = false;
      // Ensure that at least one item from the whitelist allows this url.
      for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
        if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
          allowed = true;
          break;
        }
      }
      if (allowed) {
        // Ensure that no item from the blacklist blocked this url.
        for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
          if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
            allowed = false;
            break;
          }
        }
      }
      return allowed;
    }

    function generateHolderType(base) {
      var holderType = function TrustedValueHolderType(trustedValue) {
        this.$$unwrapTrustedValue = function() {
          return trustedValue;
        };
      };
      if (base) {
        holderType.prototype = new base();
      }
      holderType.prototype.valueOf = function sceValueOf() {
        return this.$$unwrapTrustedValue();
      }
      holderType.prototype.toString = function sceToString() {
        return this.$$unwrapTrustedValue().toString();
      }
      return holderType;
    }

    var trustedValueHolderBase = generateHolderType(),
        byType = {};

    byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);

    /**
     * @ngdoc method
     * @name ng.$sceDelegate#trustAs
     * @methodOf ng.$sceDelegate
     *
     * @description
     * Returns an object that is trusted by angular for use in specified strict
     * contextual escaping contexts (such as ng-html-bind-unsafe, ng-include, any src
     * attribute interpolation, any dom event binding attribute interpolation
     * such as for onclick,  etc.) that uses the provided value.
     * See {@link ng.$sce $sce} for enabling strict contextual escaping.
     *
     * @param {string} type The kind of context in which this value is safe for use.  e.g. url,
     *   resourceUrl, html, js and css.
     * @param {*} value The value that that should be considered trusted/safe.
     * @returns {*} A value that can be used to stand in for the provided `value` in places
     * where Angular expects a $sce.trustAs() return value.
     */
    function trustAs(type, trustedValue) {
      var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      if (!constructor) {
        throw $sceMinErr('icontext', 'Attempted to trust a value in invalid context. Context: {0}; Value: {1}',
            type, trustedValue);
      }
      if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
        return trustedValue;
      }
      // All the current contexts in SCE_CONTEXTS happen to be strings.  In order to avoid trusting
      // mutable objects, we ensure here that the value passed in is actually a string.
      if (typeof trustedValue !== 'string') {
        throw $sceMinErr('itype',
            'Attempted to trust a non-string value in a content requiring a string: Context: {0}',
            type);
      }
      return new constructor(trustedValue);
    }

    /**
     * @ngdoc method
     * @name ng.$sceDelegate#valueOf
     * @methodOf ng.$sceDelegate
     *
     * @description
     * If the passed parameter had been returned by a prior call to {@link ng.$sceDelegate#trustAs
     * `$sceDelegate.trustAs`}, returns the value that had been passed to {@link
     * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}.
     *
     * If the passed parameter is not a value that had been returned by {@link
     * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}, returns it as-is.
     *
     * @param {*} value The result of a prior {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}
     *      call or anything else.
     * @returns {*} The value the was originally provided to {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} if `value` is the result of such a call.  Otherwise, returns `value`
     *     unchanged.
     */
    function valueOf(maybeTrusted) {
      if (maybeTrusted instanceof trustedValueHolderBase) {
        return maybeTrusted.$$unwrapTrustedValue();
      } else {
        return maybeTrusted;
      }
    }

    /**
     * @ngdoc method
     * @name ng.$sceDelegate#getTrusted
     * @methodOf ng.$sceDelegate
     *
     * @description
     * Takes the result of a {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`} call and returns the
     * originally supplied value if the queried context type is a supertype of the created type.  If
     * this condition isn't satisfied, throws an exception.
     *
     * @param {string} type The kind of context in which this value is to be used.
     * @param {*} maybeTrusted The result of a prior {@link ng.$sceDelegate#trustAs
     * `$sceDelegate.trustAs`} call.
     * @returns {*} The value the was originally provided to {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} if valid in this context.  Otherwise, throws an exception.
     */
    function getTrusted(type, maybeTrusted) {
      if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
        return maybeTrusted;
      }
      var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      if (constructor && maybeTrusted instanceof constructor) {
        return maybeTrusted.$$unwrapTrustedValue();
      }
      // If we get here, then we may only take one of two actions.
      // 1. sanitize the value for the requested type, or
      // 2. throw an exception.
      if (type === SCE_CONTEXTS.RESOURCE_URL) {
        if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
          return maybeTrusted;
        } else {
          throw $sceMinErr('insecurl',
              'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}', maybeTrusted.toString());
        }
      } else if (type === SCE_CONTEXTS.HTML) {
        return htmlSanitizer(maybeTrusted);
      }
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    }

    return { trustAs: trustAs,
             getTrusted: getTrusted,
             valueOf: valueOf };
  }];
}


/**
 * @ngdoc object
 * @name ng.$sceProvider
 * @description
 *
 * The $sceProvider provider allows developers to configure the {@link ng.$sce $sce} service.
 * -   enable/disable Strict Contextual Escaping (SCE) in a module
 * -   override the default implementation with a custom delegate
 *
 * Read more about {@link ng.$sce Strict Contextual Escaping (SCE)}.
 */

/**
 * @ngdoc service
 * @name ng.$sce
 * @function
 *
 * @description
 *
 * `$sce` is a service that provides Strict Contextual Escaping services to AngularJS.
 *
 * # Strict Contextual Escaping
 *
 * Strict Contextual Escaping (SCE) is a mode in which AngularJS requires bindings in certain
 * contexts to result in a value that is marked as safe to use for that context One example of such
 * a context is binding arbitrary html controlled by the user via `ng-bind-html`.  We refer to these
 * contexts as privileged or SCE contexts.
 *
 * As of version 1.2, Angular ships with SCE enabled by default.
 *
 * Note:  When enabled (the default), IE8 in quirks mode is not supported.  In this mode, IE8 allows
 * one to execute arbitrary javascript by the use of the expression() syntax.  Refer
 * <http://blogs.msdn.com/b/ie/archive/2008/10/16/ending-expressions.aspx> to learn more about them.
 * You can ensure your document is in standards mode and not quirks mode by adding `<!doctype html>`
 * to the top of your HTML document.
 *
 * SCE assists in writing code in way that (a) is secure by default and (b) makes auditing for
 * security vulnerabilities such as XSS, clickjacking, etc. a lot easier.
 *
 * Here's an example of a binding in a privileged context:
 *
 * <pre class="prettyprint">
 *     <input ng-model="userHtml">
 *     <div ng-bind-html="{{userHtml}}">
 * </pre>
 *
 * Notice that `ng-bind-html` is bound to `{{userHtml}}` controlled by the user.  With SCE
 * disabled, this application allows the user to render arbitrary HTML into the DIV.
 * In a more realistic example, one may be rendering user comments, blog articles, etc. via
 * bindings.  (HTML is just one example of a context where rendering user controlled input creates
 * security vulnerabilities.)
 *
 * For the case of HTML, you might use a library, either on the client side, or on the server side,
 * to sanitize unsafe HTML before binding to the value and rendering it in the document.
 *
 * How would you ensure that every place that used these types of bindings was bound to a value that
 * was sanitized by your library (or returned as safe for rendering by your server?)  How can you
 * ensure that you didn't accidentally delete the line that sanitized the value, or renamed some
 * properties/fields and forgot to update the binding to the sanitized value?
 *
 * To be secure by default, you want to ensure that any such bindings are disallowed unless you can
 * determine that something explicitly says it's safe to use a value for binding in that
 * context.  You can then audit your code (a simple grep would do) to ensure that this is only done
 * for those values that you can easily tell are safe - because they were received from your server,
 * sanitized by your library, etc.  You can organize your codebase to help with this - perhaps
 * allowing only the files in a specific directory to do this.  Ensuring that the internal API
 * exposed by that code doesn't markup arbitrary values as safe then becomes a more manageable task.
 *
 * In the case of AngularJS' SCE service, one uses {@link ng.$sce#trustAs $sce.trustAs} (and shorthand
 * methods such as {@link ng.$sce#trustAsHtml $sce.trustAsHtml}, etc.) to obtain values that will be
 * accepted by SCE / privileged contexts.
 *
 *
 * ## How does it work?
 *
 * In privileged contexts, directives and code will bind to the result of {@link ng.$sce#getTrusted
 * $sce.getTrusted(context, value)} rather than to the value directly.  Directives use {@link
 * ng.$sce#parse $sce.parseAs} rather than `$parse` to watch attribute bindings, which performs the
 * {@link ng.$sce#getTrusted $sce.getTrusted} behind the scenes on non-constant literals.
 *
 * As an example, {@link ng.directive:ngBindHtml ngBindHtml} uses {@link
 * ng.$sce#parseAsHtml $sce.parseAsHtml(binding expression)}.  Here's the actual code (slightly
 * simplified):
 *
 * <pre class="prettyprint">
 *   var ngBindHtmlDirective = ['$sce', function($sce) {
 *     return function(scope, element, attr) {
 *       scope.$watch($sce.parseAsHtml(attr.ngBindHtml), function(value) {
 *         element.html(value || '');
 *       });
 *     };
 *   }];
 * </pre>
 *
 * ## Impact on loading templates
 *
 * This applies both to the {@link ng.directive:ngInclude `ng-include`} directive as well as
 * `templateUrl`'s specified by {@link guide/directive directives}.
 *
 * By default, Angular only loads templates from the same domain and protocol as the application
 * document.  This is done by calling {@link ng.$sce#getTrustedResourceUrl
 * $sce.getTrustedResourceUrl} on the template URL.  To load templates from other domains and/or
 * protocols, you may either either {@link ng.$sceDelegateProvider#resourceUrlWhitelist whitelist
 * them} or {@link ng.$sce#trustAsResourceUrl wrap it} into a trusted value.
 *
 * *Please note*:
 * The browser's
 * {@link https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest
 * Same Origin Policy} and {@link http://www.w3.org/TR/cors/ Cross-Origin Resource Sharing (CORS)}
 * policy apply in addition to this and may further restrict whether the template is successfully
 * loaded.  This means that without the right CORS policy, loading templates from a different domain
 * won't work on all browsers.  Also, loading templates from `file://` URL does not work on some
 * browsers.
 *
 * ## This feels like too much overhead for the developer?
 *
 * It's important to remember that SCE only applies to interpolation expressions.
 *
 * If your expressions are constant literals, they're automatically trusted and you don't need to
 * call `$sce.trustAs` on them.  (e.g.
 * `<div ng-html-bind-unsafe="'<b>implicitly trusted</b>'"></div>`) just works.
 *
 * Additionally, `a[href]` and `img[src]` automatically sanitize their URLs and do not pass them
 * through {@link ng.$sce#getTrusted $sce.getTrusted}.  SCE doesn't play a role here.
 *
 * The included {@link ng.$sceDelegate $sceDelegate} comes with sane defaults to allow you to load
 * templates in `ng-include` from your application's domain without having to even know about SCE.
 * It blocks loading templates from other domains or loading templates over http from an https
 * served document.  You can change these by setting your own custom {@link
 * ng.$sceDelegateProvider#resourceUrlWhitelist whitelists} and {@link
 * ng.$sceDelegateProvider#resourceUrlBlacklist blacklists} for matching such URLs.
 *
 * This significantly reduces the overhead.  It is far easier to pay the small overhead and have an
 * application that's secure and can be audited to verify that with much more ease than bolting
 * security onto an application later.
 *
 * ## What trusted context types are supported?<a name="contexts"></a>
 *
 * | Context             | Notes          |
 * |---------------------|----------------|
 * | `$sce.HTML`         | For HTML that's safe to source into the application.  The {@link ng.directive:ngBindHtml ngBindHtml} directive uses this context for bindings. |
 * | `$sce.CSS`          | For CSS that's safe to source into the application.  Currently unused.  Feel free to use it in your own directives. |
 * | `$sce.URL`          | For URLs that are safe to follow as links.  Currently unused (`<a href=` and `<img src=` sanitize their urls and don't consititute an SCE context. |
 * | `$sce.RESOURCE_URL` | For URLs that are not only safe to follow as links, but whose contens are also safe to include in your application.  Examples include `ng-include`, `src` / `ngSrc` bindings for tags other than `IMG` (e.g. `IFRAME`, `OBJECT`, etc.)  <br><br>Note that `$sce.RESOURCE_URL` makes a stronger statement about the URL than `$sce.URL` does and therefore contexts requiring values trusted for `$sce.RESOURCE_URL` can be used anywhere that values trusted for `$sce.URL` are required. |
 * | `$sce.JS`           | For JavaScript that is safe to execute in your application's context.  Currently unused.  Feel free to use it in your own directives. |
 *
 * ## Show me an example.
 *
 *
 *
 * @example
 <example module="mySceApp">
  <file name="index.html">
    <div ng-controller="myAppController as myCtrl">
      <i ng-bind-html="myCtrl.explicitlyTrustedHtml" id="explicitlyTrustedHtml"></i><br><br>
      <b>User comments</b><br>
      By default, HTML that isn't explicitly trusted (e.g. Alice's comment) is sanitized when $sanitize is available.  If $sanitize isn't available, this results in an error instead of an exploit.
      <div class="well">
        <div ng-repeat="userComment in myCtrl.userComments">
          <b>{{userComment.name}}</b>:
          <span ng-bind-html="userComment.htmlComment" class="htmlComment"></span>
          <br>
        </div>
      </div>
    </div>
  </file>

  <file name="script.js">
    var mySceApp = angular.module('mySceApp', ['ngSanitize']);

    mySceApp.controller("myAppController", function myAppController($http, $templateCache, $sce) {
      var self = this;
      $http.get("test_data.json", {cache: $templateCache}).success(function(userComments) {
        self.userComments = userComments;
      });
      self.explicitlyTrustedHtml = $sce.trustAsHtml(
          '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
          'sanitization.&quot;">Hover over this text.</span>');
    });
  </file>

  <file name="test_data.json">
    [
      { "name": "Alice",
        "htmlComment": "<span onmouseover='this.textContent=\"PWN3D!\"'>Is <i>anyone</i> reading this?</span>"
      },
      { "name": "Bob",
        "htmlComment": "<i>Yes!</i>  Am I the only other one?"
      }
    ]
  </file>

  <file name="scenario.js">
    describe('SCE doc demo', function() {
      it('should sanitize untrusted values', function() {
        expect(element('.htmlComment').html()).toBe('<span>Is <i>anyone</i> reading this?</span>');
      });
      it('should NOT sanitize explicitly trusted values', function() {
        expect(element('#explicitlyTrustedHtml').html()).toBe(
            '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
            'sanitization.&quot;">Hover over this text.</span>');
      });
    });
  </file>
 </example>
 *
 *
 *
 * ## Can I disable SCE completely?
 *
 * Yes, you can.  However, this is strongly discouraged.  SCE gives you a lot of security benefits
 * for little coding overhead.  It will be much harder to take an SCE disabled application and
 * either secure it on your own or enable SCE at a later stage.  It might make sense to disable SCE
 * for cases where you have a lot of existing code that was written before SCE was introduced and
 * you're migrating them a module at a time.
 *
 * That said, here's how you can completely disable SCE:
 *
 * <pre class="prettyprint">
 *   angular.module('myAppWithSceDisabledmyApp', []).config(function($sceProvider) {
 *     // Completely disable SCE.  For demonstration purposes only!
 *     // Do not use in new projects.
 *     $sceProvider.enabled(false);
 *   });
 * </pre>
 *
 */

function $SceProvider() {
  var enabled = true;

  /**
   * @ngdoc function
   * @name ng.sceProvider#enabled
   * @methodOf ng.$sceProvider
   * @function
   *
   * @param {boolean=} value If provided, then enables/disables SCE.
   * @return {boolean} true if SCE is enabled, false otherwise.
   *
   * @description
   * Enables/disables SCE and returns the current value.
   */
  this.enabled = function (value) {
    if (arguments.length) {
      enabled = !!value;
    }
    return enabled;
  };


  /* Design notes on the default implementation for SCE.
   *
   * The API contract for the SCE delegate
   * -------------------------------------
   * The SCE delegate object must provide the following 3 methods:
   *
   * - trustAs(contextEnum, value)
   *     This method is used to tell the SCE service that the provided value is OK to use in the
   *     contexts specified by contextEnum.  It must return an object that will be accepted by
   *     getTrusted() for a compatible contextEnum and return this value.
   *
   * - valueOf(value)
   *     For values that were not produced by trustAs(), return them as is.  For values that were
   *     produced by trustAs(), return the corresponding input value to trustAs.  Basically, if
   *     trustAs is wrapping the given values into some type, this operation unwraps it when given
   *     such a value.
   *
   * - getTrusted(contextEnum, value)
   *     This function should return the a value that is safe to use in the context specified by
   *     contextEnum or throw and exception otherwise.
   *
   * NOTE: This contract deliberately does NOT state that values returned by trustAs() must be opaque
   * or wrapped in some holder object.  That happens to be an implementation detail.  For instance,
   * an implementation could maintain a registry of all trusted objects by context.  In such a case,
   * trustAs() would return the same object that was passed in.  getTrusted() would return the same
   * object passed in if it was found in the registry under a compatible context or throw an
   * exception otherwise.  An implementation might only wrap values some of the time based on
   * some criteria.  getTrusted() might return a value and not throw an exception for special
   * constants or objects even if not wrapped.  All such implementations fulfill this contract.
   *
   *
   * A note on the inheritance model for SCE contexts
   * ------------------------------------------------
   * I've used inheritance and made RESOURCE_URL wrapped types a subtype of URL wrapped types.  This
   * is purely an implementation details.
   *
   * The contract is simply this:
   *
   *     getTrusted($sce.RESOURCE_URL, value) succeeding implies that getTrusted($sce.URL, value)
   *     will also succeed.
   *
   * Inheritance happens to capture this in a natural way.  In some future, we
   * may not use inheritance anymore.  That is OK because no code outside of
   * sce.js and sceSpecs.js would need to be aware of this detail.
   */

  this.$get = ['$parse', '$document', '$sceDelegate', function(
                $parse,   $document,   $sceDelegate) {
    // Prereq: Ensure that we're not running in IE8 quirks mode.  In that mode, IE allows
    // the "expression(javascript expression)" syntax which is insecure.
    if (enabled && msie) {
      var documentMode = $document[0].documentMode;
      if (documentMode !== undefined && documentMode < 8) {
        throw $sceMinErr('iequirks',
          'Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks ' +
          'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' +
          'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
      }
    }

    var sce = copy(SCE_CONTEXTS);

    /**
     * @ngdoc function
     * @name ng.sce#isEnabled
     * @methodOf ng.$sce
     * @function
     *
     * @return {Boolean} true if SCE is enabled, false otherwise.  If you want to set the value, you
     * have to do it at module config time on {@link ng.$sceProvider $sceProvider}.
     *
     * @description
     * Returns a boolean indicating if SCE is enabled.
     */
    sce.isEnabled = function () {
      return enabled;
    };
    sce.trustAs = $sceDelegate.trustAs;
    sce.getTrusted = $sceDelegate.getTrusted;
    sce.valueOf = $sceDelegate.valueOf;

    if (!enabled) {
      sce.trustAs = sce.getTrusted = function(type, value) { return value; },
      sce.valueOf = identity
    }

    /**
     * @ngdoc method
     * @name ng.$sce#parse
     * @methodOf ng.$sce
     *
     * @description
     * Converts Angular {@link guide/expression expression} into a function.  This is like {@link
     * ng.$parse $parse} and is identical when the expression is a literal constant.  Otherwise, it
     * wraps the expression in a call to {@link ng.$sce#getTrusted $sce.getTrusted(*type*,
     * *result*)}
     *
     * @param {string} type The kind of SCE context in which this result will be used.
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */
    sce.parseAs = function sceParseAs(type, expr) {
      var parsed = $parse(expr);
      if (parsed.literal && parsed.constant) {
        return parsed;
      } else {
        return function sceParseAsTrusted(self, locals) {
          return sce.getTrusted(type, parsed(self, locals));
        }
      }
    };

    /**
     * @ngdoc method
     * @name ng.$sce#trustAs
     * @methodOf ng.$sce
     *
     * @description
     * Delegates to {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}.  As such, returns an object
     * that is trusted by angular for use in specified strict contextual escaping contexts (such as
     * ng-html-bind-unsafe, ng-include, any src attribute interpolation, any dom event binding
     * attribute interpolation such as for onclick,  etc.) that uses the provided value.  See *
     * {@link ng.$sce $sce} for enabling strict contextual escaping.
     *
     * @param {string} type The kind of context in which this value is safe for use.  e.g. url,
     *   resource_url, html, js and css.
     * @param {*} value The value that that should be considered trusted/safe.
     * @returns {*} A value that can be used to stand in for the provided `value` in places
     * where Angular expects a $sce.trustAs() return value.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#trustAsHtml
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.trustAsHtml(value)` → {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.HTML, value)`}
     *
     * @param {*} value The value to trustAs.
     * @returns {*} An object that can be passed to {@link ng.$sce#getTrustedHtml
     *     $sce.getTrustedHtml(value)} to obtain the original value.  (privileged directives
     *     only accept expressions that are either literal constants or are the
     *     return value of {@link ng.$sce#trustAs $sce.trustAs}.)
     */

    /**
     * @ngdoc method
     * @name ng.$sce#trustAsUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.trustAsUrl(value)` → {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.URL, value)`}
     *
     * @param {*} value The value to trustAs.
     * @returns {*} An object that can be passed to {@link ng.$sce#getTrustedUrl
     *     $sce.getTrustedUrl(value)} to obtain the original value.  (privileged directives
     *     only accept expressions that are either literal constants or are the
     *     return value of {@link ng.$sce#trustAs $sce.trustAs}.)
     */

    /**
     * @ngdoc method
     * @name ng.$sce#trustAsResourceUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.trustAsResourceUrl(value)` → {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.RESOURCE_URL, value)`}
     *
     * @param {*} value The value to trustAs.
     * @returns {*} An object that can be passed to {@link ng.$sce#getTrustedResourceUrl
     *     $sce.getTrustedResourceUrl(value)} to obtain the original value.  (privileged directives
     *     only accept expressions that are either literal constants or are the return
     *     value of {@link ng.$sce#trustAs $sce.trustAs}.)
     */

    /**
     * @ngdoc method
     * @name ng.$sce#trustAsJs
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.trustAsJs(value)` → {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.JS, value)`}
     *
     * @param {*} value The value to trustAs.
     * @returns {*} An object that can be passed to {@link ng.$sce#getTrustedJs
     *     $sce.getTrustedJs(value)} to obtain the original value.  (privileged directives
     *     only accept expressions that are either literal constants or are the
     *     return value of {@link ng.$sce#trustAs $sce.trustAs}.)
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrusted
     * @methodOf ng.$sce
     *
     * @description
     * Delegates to {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted`}.  As such, takes
     * the result of a {@link ng.$sce#trustAs `$sce.trustAs`}() call and returns the originally supplied
     * value if the queried context type is a supertype of the created type.  If this condition
     * isn't satisfied, throws an exception.
     *
     * @param {string} type The kind of context in which this value is to be used.
     * @param {*} maybeTrusted The result of a prior {@link ng.$sce#trustAs `$sce.trustAs`} call.
     * @returns {*} The value the was originally provided to {@link ng.$sce#trustAs `$sce.trustAs`} if
     *     valid in this context.  Otherwise, throws an exception.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedHtml
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedHtml(value)` → {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.HTML, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.HTML, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedCss
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedCss(value)` → {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.CSS, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.CSS, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedUrl(value)` → {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.URL, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.URL, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedResourceUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedResourceUrl(value)` → {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.RESOURCE_URL, value)`}
     *
     * @param {*} value The value to pass to `$sceDelegate.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.RESOURCE_URL, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedJs
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedJs(value)` → {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.JS, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.JS, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsHtml
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsHtml(expression string)` → {@link ng.$sce#parse `$sce.parseAs($sce.HTML, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsCss
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsCss(value)` → {@link ng.$sce#parse `$sce.parseAs($sce.CSS, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsUrl(value)` → {@link ng.$sce#parse `$sce.parseAs($sce.URL, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsResourceUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsResourceUrl(value)` → {@link ng.$sce#parse `$sce.parseAs($sce.RESOURCE_URL, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsJs
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsJs(value)` → {@link ng.$sce#parse `$sce.parseAs($sce.JS, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    // Shorthand delegations.
    var parse = sce.parseAs,
        getTrusted = sce.getTrusted,
        trustAs = sce.trustAs;

    angular.forEach(SCE_CONTEXTS, function (enumValue, name) {
      var lName = lowercase(name);
      sce[camelCase("parse_as_" + lName)] = function (expr) {
        return parse(enumValue, expr);
      }
      sce[camelCase("get_trusted_" + lName)] = function (value) {
        return getTrusted(enumValue, value);
      }
      sce[camelCase("trust_as_" + lName)] = function (value) {
        return trustAs(enumValue, value);
      }
    });

    return sce;
  }];
}

/**
 * !!! This is an undocumented "private" service !!!
 *
 * @name ng.$sniffer
 * @requires $window
 * @requires $document
 *
 * @property {boolean} history Does the browser support html5 history api ?
 * @property {boolean} hashchange Does the browser support hashchange event ?
 * @property {boolean} transitions Does the browser support CSS transition events ?
 * @property {boolean} animations Does the browser support CSS animation events ?
 *
 * @description
 * This is very simple implementation of testing browser's features.
 */
function $SnifferProvider() {
  this.$get = ['$window', '$document', function($window, $document) {
    var eventSupport = {},
        android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
        boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
        document = $document[0] || {},
        vendorPrefix,
        vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/,
        bodyStyle = document.body && document.body.style,
        transitions = false,
        animations = false,
        match;

    if (bodyStyle) {
      for(var prop in bodyStyle) {
        if(match = vendorRegex.exec(prop)) {
          vendorPrefix = match[0];
          vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
          break;
        }
      }

      if(!vendorPrefix) {
        vendorPrefix = ('WebkitOpacity' in bodyStyle) && 'webkit';
      }

      transitions = !!(('transition' in bodyStyle) || (vendorPrefix + 'Transition' in bodyStyle));
      animations  = !!(('animation' in bodyStyle) || (vendorPrefix + 'Animation' in bodyStyle));

      if (android && (!transitions||!animations)) {
        transitions = isString(document.body.style.webkitTransition);
        animations = isString(document.body.style.webkitAnimation);
      }
    }


    return {
      // Android has history.pushState, but it does not update location correctly
      // so let's not use the history API at all.
      // http://code.google.com/p/android/issues/detail?id=17471
      // https://github.com/angular/angular.js/issues/904

      // older webit browser (533.9) on Boxee box has exactly the same problem as Android has
      // so let's not use the history API also
      history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
      hashchange: 'onhashchange' in $window &&
                  // IE8 compatible mode lies
                  (!document.documentMode || document.documentMode > 7),
      hasEvent: function(event) {
        // IE9 implements 'input' event it's so fubared that we rather pretend that it doesn't have
        // it. In particular the event is not fired when backspace or delete key are pressed or
        // when cut operation is performed.
        if (event == 'input' && msie == 9) return false;

        if (isUndefined(eventSupport[event])) {
          var divElm = document.createElement('div');
          eventSupport[event] = 'on' + event in divElm;
        }

        return eventSupport[event];
      },
      csp: document.securityPolicy ? document.securityPolicy.isActive : false,
      vendorPrefix: vendorPrefix,
      transitions : transitions,
      animations : animations
    };
  }];
}

function $TimeoutProvider() {
  this.$get = ['$rootScope', '$browser', '$q', '$exceptionHandler',
       function($rootScope,   $browser,   $q,   $exceptionHandler) {
    var deferreds = {};


     /**
      * @ngdoc function
      * @name ng.$timeout
      * @requires $browser
      *
      * @description
      * Angular's wrapper for `window.setTimeout`. The `fn` function is wrapped into a try/catch
      * block and delegates any exceptions to
      * {@link ng.$exceptionHandler $exceptionHandler} service.
      *
      * The return value of registering a timeout function is a promise, which will be resolved when
      * the timeout is reached and the timeout function is executed.
      *
      * To cancel a timeout request, call `$timeout.cancel(promise)`.
      *
      * In tests you can use {@link ngMock.$timeout `$timeout.flush()`} to
      * synchronously flush the queue of deferred functions.
      *
      * @param {function()} fn A function, whose execution should be delayed.
      * @param {number=} [delay=0] Delay in milliseconds.
      * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
      *   will invoke `fn` within the {@link ng.$rootScope.Scope#$apply $apply} block.
      * @returns {Promise} Promise that will be resolved when the timeout is reached. The value this
      *   promise will be resolved with is the return value of the `fn` function.
      * 
      * @example
      <doc:example module="time">
        <doc:source>
          <script>
            function Ctrl2($scope,$timeout) {
              $scope.format = 'M/d/yy h:mm:ss a';
              $scope.blood_1 = 100;
              $scope.blood_2 = 120;

              var stop;
              $scope.fight = function() {
                stop = $timeout(function() {
                  if ($scope.blood_1 > 0 && $scope.blood_2 > 0) {
                      $scope.blood_1 = $scope.blood_1 - 3;
                      $scope.blood_2 = $scope.blood_2 - 4;
                      $scope.fight();
                  } else {
                      $timeout.cancel(stop);
                  }
                }, 100);
              };

              $scope.stopFight = function() {
                $timeout.cancel(stop);
              };

              $scope.resetFight = function() {
                $scope.blood_1 = 100;
                $scope.blood_2 = 120;
              }
            }

            angular.module('time', [])
              // Register the 'myCurrentTime' directive factory method.
              // We inject $timeout and dateFilter service since the factory method is DI.
              .directive('myCurrentTime', function($timeout, dateFilter) {
                // return the directive link function. (compile function not needed)
                return function(scope, element, attrs) {
                  var format,  // date format
                  timeoutId; // timeoutId, so that we can cancel the time updates

                  // used to update the UI
                  function updateTime() {
                    element.text(dateFilter(new Date(), format));
                  }

                  // watch the expression, and update the UI on change.
                  scope.$watch(attrs.myCurrentTime, function(value) {
                    format = value;
                    updateTime();
                  });

                  // schedule update in one second
                  function updateLater() {
                    // save the timeoutId for canceling
                    timeoutId = $timeout(function() {
                      updateTime(); // update DOM
                      updateLater(); // schedule another update
                    }, 1000);
                  }

                  // listen on DOM destroy (removal) event, and cancel the next UI update
                  // to prevent updating time ofter the DOM element was removed.
                  element.bind('$destroy', function() {
                    $timeout.cancel(timeoutId);
                  });

                  updateLater(); // kick off the UI update process.
                }
              });
          </script>

          <div>
            <div ng-controller="Ctrl2">
              Date format: <input ng-model="format"> <hr/>
              Current time is: <span my-current-time="format"></span>
              <hr/>
              Blood 1 : <font color='red'>{{blood_1}}</font>
              Blood 2 : <font color='red'>{{blood_2}}</font>
              <button type="button" data-ng-click="fight()">Fight</button>
              <button type="button" data-ng-click="stopFight()">StopFight</button>
              <button type="button" data-ng-click="resetFight()">resetFight</button>
            </div>
          </div>

        </doc:source>
      </doc:example>
      */
    function timeout(fn, delay, invokeApply) {
      var deferred = $q.defer(),
          promise = deferred.promise,
          skipApply = (isDefined(invokeApply) && !invokeApply),
          timeoutId;

      timeoutId = $browser.defer(function() {
        try {
          deferred.resolve(fn());
        } catch(e) {
          deferred.reject(e);
          $exceptionHandler(e);
        }
        finally {
          delete deferreds[promise.$$timeoutId];
        }

        if (!skipApply) $rootScope.$apply();
      }, delay);

      promise.$$timeoutId = timeoutId;
      deferreds[timeoutId] = deferred;

      return promise;
    }


     /**
      * @ngdoc function
      * @name ng.$timeout#cancel
      * @methodOf ng.$timeout
      *
      * @description
      * Cancels a task associated with the `promise`. As a result of this, the promise will be
      * resolved with a rejection.
      *
      * @param {Promise=} promise Promise returned by the `$timeout` function.
      * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
      *   canceled.
      */
    timeout.cancel = function(promise) {
      if (promise && promise.$$timeoutId in deferreds) {
        deferreds[promise.$$timeoutId].reject('canceled');
        delete deferreds[promise.$$timeoutId];
        return $browser.defer.cancel(promise.$$timeoutId);
      }
      return false;
    };

    return timeout;
  }];
}

function $$UrlUtilsProvider() {
  this.$get = [function() {
    var urlParsingNode = document.createElement("a"),
        // NOTE:  The usage of window and document instead of $window and $document here is
        // deliberate.  This service depends on the specific behavior of anchor nodes created by the
        // browser (resolving and parsing URLs) that is unlikely to be provided by mock objects and
        // cause us to break tests.  In addition, when the browser resolves a URL for XHR, it
        // doesn't know about mocked locations and resolves URLs to the real document - which is
        // exactly the behavior needed here.  There is little value is mocking these our for this
        // service.
        originUrl = resolve(window.location.href, true);

    /**
     * @description
     * Normalizes and optionally parses a URL.
     *
     * NOTE:  This is a private service.  The API is subject to change unpredictably in any commit.
     *
     * Implementation Notes for non-IE browsers
     * ----------------------------------------
     * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
     * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
     * URL will be resolved into an absolute URL in the context of the application document.
     * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
     * properties are all populated to reflect the normalized URL.  This approach has wide
     * compatibility - Safari 1+, Mozilla 1+, Opera 7+,e etc.  See
     * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *
     * Implementation Notes for IE
     * ---------------------------
     * IE >= 8 and <= 10 normalizes the URL when assigned to the anchor node similar to the other
     * browsers.  However, the parsed components will not be set if the URL assigned did not specify
     * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
     * work around that by performing the parsing in a 2nd step by taking a previously normalized
     * URL (e.g. by assining to a.href) and assigning it a.href again.  This correctly populates the
     * properties such as protocol, hostname, port, etc.
     *
     * IE7 does not normalize the URL when assigned to an anchor node.  (Apparently, it does, if one
     * uses the inner HTML approach to assign the URL as part of an HTML snippet -
     * http://stackoverflow.com/a/472729)  However, setting img[src] does normalize the URL.
     * Unfortunately, setting img[src] to something like "javascript:foo" on IE throws an exception.
     * Since the primary usage for normalizing URLs is to sanitize such URLs, we can't use that
     * method and IE < 8 is unsupported.
     *
     * References:
     *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
     *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *   http://url.spec.whatwg.org/#urlutils
     *   https://github.com/angular/angular.js/pull/2902
     *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
     *
     * @param {string} url The URL to be parsed.
     * @param {boolean=} parse When true, returns an object for the parsed URL.  Otherwise, returns
     *   a single string that is the normalized URL.
     * @returns {object|string} When parse is true, returns the normalized URL as a string.
     * Otherwise, returns an object with the following members.
     *
     *   | member name   | Description    |
     *   |---------------|----------------|
     *   | href          | A normalized version of the provided URL if it was not an absolute URL |
     *   | protocol      | The protocol including the trailing colon                              |
     *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
     *
     * These fields from the UrlUtils interface are currently not needed and hence not returned.
     *
     *   | member name   | Description    |
     *   |---------------|----------------|
     *   | hostname      | The host without the port of the normalizedUrl                         |
     *   | pathname      | The path following the host in the normalizedUrl                       |
     *   | hash          | The URL hash if present                                                |
     *   | search        | The query string                                                       |
     *
     */
    function resolve(url, parse) {
      var href = url;
      if (msie <= 11) {
        // Normalize before parse.  Refer Implementation Notes on why this is
        // done in two steps on IE.
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute('href', href);

      if (!parse) {
        return urlParsingNode.href;
      }
      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol,
        host: urlParsingNode.host
        // Currently unused and hence commented out.
        // hostname: urlParsingNode.hostname,
        // port: urlParsingNode.port,
        // pathname: urlParsingNode.pathname,
        // hash: urlParsingNode.hash,
        // search: urlParsingNode.search
      };
    }

    return {
      resolve: resolve,
      /**
       * Parse a request URL and determine whether this is a same-origin request as the application document.
       *
       * @param {string|object} requestUrl The url of the request as a string that will be resolved
       * or a parsed URL object.
       * @returns {boolean} Whether the request is for the same origin as the application document.
       */
      isSameOrigin: function isSameOrigin(requestUrl) {
        var parsed = (typeof requestUrl === 'string') ? resolve(requestUrl, true) : requestUrl;
        return (parsed.protocol === originUrl.protocol &&
                parsed.host === originUrl.host);
      }
    };
  }];
}

/**
 * @ngdoc object
 * @name ng.$window
 *
 * @description
 * A reference to the browser's `window` object. While `window`
 * is globally available in JavaScript, it causes testability problems, because
 * it is a global variable. In angular we always refer to it through the
 * `$window` service, so it may be overridden, removed or mocked for testing.
 *
 * Expressions, like the one defined for the `ngClick` directive in the example
 * below, are evaluated with respect to the current scope.  Therefore, there is
 * no risk of inadvertently coding in a dependency on a global value in such an
 * expression.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope, $window) {
           $scope.$window = $window;
           $scope.greeting = 'Hello, World!';
         }
       </script>
       <div ng-controller="Ctrl">
         <input type="text" ng-model="greeting" />
         <button ng-click="$window.alert(greeting)">ALERT</button>
       </div>
     </doc:source>
     <doc:scenario>
      it('should display the greeting in the input box', function() {
       input('greeting').enter('Hello, E2E Tests');
       // If we click the button it will block the test runner
       // element(':button').click();
      });
     </doc:scenario>
   </doc:example>
 */
function $WindowProvider(){
  this.$get = valueFn(window);
}

/**
 * @ngdoc object
 * @name ng.$filterProvider
 * @description
 *
 * Filters are just functions which transform input to an output. However filters need to be Dependency Injected. To
 * achieve this a filter definition consists of a factory function which is annotated with dependencies and is
 * responsible for creating a filter function.
 *
 * <pre>
 *   // Filter registration
 *   function MyModule($provide, $filterProvider) {
 *     // create a service to demonstrate injection (not always needed)
 *     $provide.value('greet', function(name){
 *       return 'Hello ' + name + '!';
 *     });
 *
 *     // register a filter factory which uses the
 *     // greet service to demonstrate DI.
 *     $filterProvider.register('greet', function(greet){
 *       // return the filter function which uses the greet service
 *       // to generate salutation
 *       return function(text) {
 *         // filters need to be forgiving so check input validity
 *         return text && greet(text) || text;
 *       };
 *     });
 *   }
 * </pre>
 *
 * The filter function is registered with the `$injector` under the filter name suffix with `Filter`.
 * <pre>
 *   it('should be the same instance', inject(
 *     function($filterProvider) {
 *       $filterProvider.register('reverse', function(){
 *         return ...;
 *       });
 *     },
 *     function($filter, reverseFilter) {
 *       expect($filter('reverse')).toBe(reverseFilter);
 *     });
 * </pre>
 *
 *
 * For more information about how angular filters work, and how to create your own filters, see
 * {@link guide/dev_guide.templates.filters Understanding Angular Filters} in the angular Developer
 * Guide.
 */
/**
 * @ngdoc method
 * @name ng.$filterProvider#register
 * @methodOf ng.$filterProvider
 * @description
 * Register filter factory function.
 *
 * @param {String} name Name of the filter.
 * @param {function} fn The filter factory function which is injectable.
 */


/**
 * @ngdoc function
 * @name ng.$filter
 * @function
 * @description
 * Filters are used for formatting data displayed to the user.
 *
 * The general syntax in templates is as follows:
 *
 *         {{ expression [| filter_name[:parameter_value] ... ] }}
 *
 * @param {String} name Name of the filter function to retrieve
 * @return {Function} the filter function
 */
$FilterProvider.$inject = ['$provide'];
function $FilterProvider($provide) {
  var suffix = 'Filter';

  function register(name, factory) {
    return $provide.factory(name + suffix, factory);
  }
  this.register = register;

  this.$get = ['$injector', function($injector) {
    return function(name) {
      return $injector.get(name + suffix);
    }
  }];

  ////////////////////////////////////////

  register('currency', currencyFilter);
  register('date', dateFilter);
  register('filter', filterFilter);
  register('json', jsonFilter);
  register('limitTo', limitToFilter);
  register('lowercase', lowercaseFilter);
  register('number', numberFilter);
  register('orderBy', orderByFilter);
  register('uppercase', uppercaseFilter);
}

/**
 * @ngdoc filter
 * @name ng.filter:filter
 * @function
 *
 * @description
 * Selects a subset of items from `array` and returns it as a new array.
 *
 * Note: This function is used to augment the `Array` type in Angular expressions. See
 * {@link ng.$filter} for more information about Angular arrays.
 *
 * @param {Array} array The source array.
 * @param {string|Object|function()} expression The predicate to be used for selecting items from
 *   `array`.
 *
 *   Can be one of:
 *
 *   - `string`: Predicate that results in a substring match using the value of `expression`
 *     string. All strings or objects with string properties in `array` that contain this string
 *     will be returned. The predicate can be negated by prefixing the string with `!`.
 *
 *   - `Object`: A pattern object can be used to filter specific properties on objects contained
 *     by `array`. For example `{name:"M", phone:"1"}` predicate will return an array of items
 *     which have property `name` containing "M" and property `phone` containing "1". A special
 *     property name `$` can be used (as in `{$:"text"}`) to accept a match against any
 *     property of the object. That's equivalent to the simple substring match with a `string`
 *     as described above.
 *
 *   - `function`: A predicate function can be used to write arbitrary filters. The function is
 *     called for each element of `array`. The final result is an array of those elements that
 *     the predicate returned true for.
 *
 * @param {function(expected, actual)|true|undefined} comparator Comparator which is used in
 *     determining if the expected value (from the filter expression) and actual value (from
 *     the object in the array) should be considered a match.
 *
 *   Can be one of:
 *
 *     - `function(expected, actual)`:
 *       The function will be given the object value and the predicate value to compare and
 *       should return true if the item should be included in filtered result.
 *
 *     - `true`: A shorthand for `function(expected, actual) { return angular.equals(expected, actual)}`.
 *       this is essentially strict comparison of expected and actual.
 *
 *     - `false|undefined`: A short hand for a function which will look for a substring match in case
 *       insensitive way.
 *
 * @example
   <doc:example>
     <doc:source>
       <div ng-init="friends = [{name:'John', phone:'555-1276'},
                                {name:'Mary', phone:'800-BIG-MARY'},
                                {name:'Mike', phone:'555-4321'},
                                {name:'Adam', phone:'555-5678'},
                                {name:'Julie', phone:'555-8765'},
                                {name:'Juliette', phone:'555-5678'}]"></div>

       Search: <input ng-model="searchText">
       <table id="searchTextResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friend in friends | filter:searchText">
           <td>{{friend.name}}</td>
           <td>{{friend.phone}}</td>
         </tr>
       </table>
       <hr>
       Any: <input ng-model="search.$"> <br>
       Name only <input ng-model="search.name"><br>
       Phone only <input ng-model="search.phone"><br>
       Equality <input type="checkbox" ng-model="strict"><br>
       <table id="searchObjResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friend in friends | filter:search:strict">
           <td>{{friend.name}}</td>
           <td>{{friend.phone}}</td>
         </tr>
       </table>
     </doc:source>
     <doc:scenario>
       it('should search across all fields when filtering with a string', function() {
         input('searchText').enter('m');
         expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Mike', 'Adam']);

         input('searchText').enter('76');
         expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
           toEqual(['John', 'Julie']);
       });

       it('should search in specific fields when filtering with a predicate object', function() {
         input('search.$').enter('i');
         expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Mike', 'Julie', 'Juliette']);
       });
       it('should use a equal comparison when comparator is true', function() {
         input('search.name').enter('Julie');
         input('strict').check();
         expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Julie']);
       });
     </doc:scenario>
   </doc:example>
 */
function filterFilter() {
  return function(array, expression, comperator) {
    if (!isArray(array)) return array;
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
    switch(typeof comperator) {
      case "function":
        break;
      case "boolean":
        if(comperator == true) {
          comperator = function(obj, text) {
            return angular.equals(obj, text);
          }
          break;
        }
      default:
        comperator = function(obj, text) {
          text = (''+text).toLowerCase();
          return (''+obj).toLowerCase().indexOf(text) > -1
        };
    }
    var search = function(obj, text){
      if (typeof text == 'string' && text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
        case "boolean":
        case "number":
        case "string":
          return comperator(obj, text);
        case "object":
          switch (typeof text) {
            case "object":
              return comperator(obj, text);
              break;
            default:
              for ( var objKey in obj) {
                if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                  return true;
                }
              }
              break;
          }
          return false;
        case "array":
          for ( var i = 0; i < obj.length; i++) {
            if (search(obj[i], text)) {
              return true;
            }
          }
          return false;
        default:
          return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        expression = {$:expression};
      case "object":
        for (var key in expression) {
          if (key == '$') {
            (function() {
              if (!expression[key]) return;
              var path = key
              predicates.push(function(value) {
                return search(value, expression[path]);
              });
            })();
          } else {
            (function() {
              if (typeof(expression[key]) == 'undefined') { return; }
              var path = key;
              predicates.push(function(value) {
                return search(getter(value,path), expression[path]);
              });
            })();
          }
        }
        break;
      case 'function':
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  }
}

/**
 * @ngdoc filter
 * @name ng.filter:currency
 * @function
 *
 * @description
 * Formats a number as a currency (ie $1,234.56). When no currency symbol is provided, default
 * symbol for current locale is used.
 *
 * @param {number} amount Input to filter.
 * @param {string=} symbol Currency symbol or identifier to be displayed.
 * @returns {string} Formatted number.
 *
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.amount = 1234.56;
         }
       </script>
       <div ng-controller="Ctrl">
         <input type="number" ng-model="amount"> <br>
         default currency symbol ($): {{amount | currency}}<br>
         custom currency identifier (USD$): {{amount | currency:"USD$"}}
       </div>
     </doc:source>
     <doc:scenario>
       it('should init with 1234.56', function() {
         expect(binding('amount | currency')).toBe('$1,234.56');
         expect(binding('amount | currency:"USD$"')).toBe('USD$1,234.56');
       });
       it('should update', function() {
         input('amount').enter('-1234');
         expect(binding('amount | currency')).toBe('($1,234.00)');
         expect(binding('amount | currency:"USD$"')).toBe('(USD$1,234.00)');
       });
     </doc:scenario>
   </doc:example>
 */
currencyFilter.$inject = ['$locale'];
function currencyFilter($locale) {
  var formats = $locale.NUMBER_FORMATS;
  return function(amount, currencySymbol){
    if (isUndefined(currencySymbol)) currencySymbol = formats.CURRENCY_SYM;
    return formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).
                replace(/\u00A4/g, currencySymbol);
  };
}

/**
 * @ngdoc filter
 * @name ng.filter:number
 * @function
 *
 * @description
 * Formats a number as text.
 *
 * If the input is not a number an empty string is returned.
 *
 * @param {number|string} number Number to format.
 * @param {(number|string)=} fractionSize Number of decimal places to round the number to.
 * If this is not provided then the fraction size is computed from the current locale's number
 * formatting pattern. In the case of the default locale, it will be 3.
 * @returns {string} Number rounded to decimalPlaces and places a “,” after each third digit.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.val = 1234.56789;
         }
       </script>
       <div ng-controller="Ctrl">
         Enter number: <input ng-model='val'><br>
         Default formatting: {{val | number}}<br>
         No fractions: {{val | number:0}}<br>
         Negative number: {{-val | number:4}}
       </div>
     </doc:source>
     <doc:scenario>
       it('should format numbers', function() {
         expect(binding('val | number')).toBe('1,234.568');
         expect(binding('val | number:0')).toBe('1,235');
         expect(binding('-val | number:4')).toBe('-1,234.5679');
       });

       it('should update', function() {
         input('val').enter('3374.333');
         expect(binding('val | number')).toBe('3,374.333');
         expect(binding('val | number:0')).toBe('3,374');
         expect(binding('-val | number:4')).toBe('-3,374.3330');
       });
     </doc:scenario>
   </doc:example>
 */


numberFilter.$inject = ['$locale'];
function numberFilter($locale) {
  var formats = $locale.NUMBER_FORMATS;
  return function(number, fractionSize) {
    return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP,
      fractionSize);
  };
}

var DECIMAL_SEP = '.';
function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
  if (isNaN(number) || !isFinite(number)) return '';

  var isNegative = number < 0;
  number = Math.abs(number);
  var numStr = number + '',
      formatedText = '',
      parts = [];

  var hasExponent = false;
  if (numStr.indexOf('e') !== -1) {
    var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
    if (match && match[2] == '-' && match[3] > fractionSize + 1) {
      numStr = '0';
    } else {
      formatedText = numStr;
      hasExponent = true;
    }
  }

  if (!hasExponent) {
    var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;

    // determine fractionSize if it is not specified
    if (isUndefined(fractionSize)) {
      fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
    }

    var pow = Math.pow(10, fractionSize);
    number = Math.round(number * pow) / pow;
    var fraction = ('' + number).split(DECIMAL_SEP);
    var whole = fraction[0];
    fraction = fraction[1] || '';

    var pos = 0,
        lgroup = pattern.lgSize,
        group = pattern.gSize;

    if (whole.length >= (lgroup + group)) {
      pos = whole.length - lgroup;
      for (var i = 0; i < pos; i++) {
        if ((pos - i)%group === 0 && i !== 0) {
          formatedText += groupSep;
        }
        formatedText += whole.charAt(i);
      }
    }

    for (i = pos; i < whole.length; i++) {
      if ((whole.length - i)%lgroup === 0 && i !== 0) {
        formatedText += groupSep;
      }
      formatedText += whole.charAt(i);
    }

    // format fraction part.
    while(fraction.length < fractionSize) {
      fraction += '0';
    }

    if (fractionSize && fractionSize !== "0") formatedText += decimalSep + fraction.substr(0, fractionSize);
  } else {

    if (fractionSize > 0 && number > -1 && number < 1) {
      formatedText = number.toFixed(fractionSize);
    }
  }

  parts.push(isNegative ? pattern.negPre : pattern.posPre);
  parts.push(formatedText);
  parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
  return parts.join('');
}

function padNumber(num, digits, trim) {
  var neg = '';
  if (num < 0) {
    neg =  '-';
    num = -num;
  }
  num = '' + num;
  while(num.length < digits) num = '0' + num;
  if (trim)
    num = num.substr(num.length - digits);
  return neg + num;
}


function dateGetter(name, size, offset, trim) {
  offset = offset || 0;
  return function(date) {
    var value = date['get' + name]();
    if (offset > 0 || value > -offset)
      value += offset;
    if (value === 0 && offset == -12 ) value = 12;
    return padNumber(value, size, trim);
  };
}

function dateStrGetter(name, shortForm) {
  return function(date, formats) {
    var value = date['get' + name]();
    var get = uppercase(shortForm ? ('SHORT' + name) : name);

    return formats[get][value];
  };
}

function timeZoneGetter(date) {
  var zone = -1 * date.getTimezoneOffset();
  var paddedZone = (zone >= 0) ? "+" : "";

  paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
                padNumber(Math.abs(zone % 60), 2);

  return paddedZone;
}

function ampmGetter(date, formats) {
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}

var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4),
    yy: dateGetter('FullYear', 2, 0, true),
     y: dateGetter('FullYear', 1),
  MMMM: dateStrGetter('Month'),
   MMM: dateStrGetter('Month', true),
    MM: dateGetter('Month', 2, 1),
     M: dateGetter('Month', 1, 1),
    dd: dateGetter('Date', 2),
     d: dateGetter('Date', 1),
    HH: dateGetter('Hours', 2),
     H: dateGetter('Hours', 1),
    hh: dateGetter('Hours', 2, -12),
     h: dateGetter('Hours', 1, -12),
    mm: dateGetter('Minutes', 2),
     m: dateGetter('Minutes', 1),
    ss: dateGetter('Seconds', 2),
     s: dateGetter('Seconds', 1),
     // while ISO 8601 requires fractions to be prefixed with `.` or `,`
     // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
   sss: dateGetter('Milliseconds', 3),
  EEEE: dateStrGetter('Day'),
   EEE: dateStrGetter('Day', true),
     a: ampmGetter,
     Z: timeZoneGetter
};

var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
    NUMBER_STRING = /^\d+$/;

/**
 * @ngdoc filter
 * @name ng.filter:date
 * @function
 *
 * @description
 *   Formats `date` to a string based on the requested `format`.
 *
 *   `format` string can be composed of the following elements:
 *
 *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
 *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
 *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
 *   * `'MMMM'`: Month in year (January-December)
 *   * `'MMM'`: Month in year (Jan-Dec)
 *   * `'MM'`: Month in year, padded (01-12)
 *   * `'M'`: Month in year (1-12)
 *   * `'dd'`: Day in month, padded (01-31)
 *   * `'d'`: Day in month (1-31)
 *   * `'EEEE'`: Day in Week,(Sunday-Saturday)
 *   * `'EEE'`: Day in Week, (Sun-Sat)
 *   * `'HH'`: Hour in day, padded (00-23)
 *   * `'H'`: Hour in day (0-23)
 *   * `'hh'`: Hour in am/pm, padded (01-12)
 *   * `'h'`: Hour in am/pm, (1-12)
 *   * `'mm'`: Minute in hour, padded (00-59)
 *   * `'m'`: Minute in hour (0-59)
 *   * `'ss'`: Second in minute, padded (00-59)
 *   * `'s'`: Second in minute (0-59)
 *   * `'.sss' or ',sss'`: Millisecond in second, padded (000-999)
 *   * `'a'`: am/pm marker
 *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)
 *
 *   `format` string can also be one of the following predefined
 *   {@link guide/i18n localizable formats}:
 *
 *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale
 *     (e.g. Sep 3, 2010 12:05:08 pm)
 *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 pm)
 *   * `'fullDate'`: equivalent to `'EEEE, MMMM d,y'` for en_US  locale
 *     (e.g. Friday, September 3, 2010)
 *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010)
 *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)
 *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)
 *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 pm)
 *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 pm)
 *
 *   `format` string can contain literal values. These need to be quoted with single quotes (e.g.
 *   `"h 'in the morning'"`). In order to output single quote, use two single quotes in a sequence
 *   (e.g. `"h 'o''clock'"`).
 *
 * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
 *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.SSSZ and its
 *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is
 *    specified in the string input, the time is considered to be in the local timezone.
 * @param {string=} format Formatting rules (see Description). If not specified,
 *    `mediumDate` is used.
 * @returns {string} Formatted string or the input if input is not recognized as date/millis.
 *
 * @example
   <doc:example>
     <doc:source>
       <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:
           {{1288323623006 | date:'medium'}}<br>
       <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
          {{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}<br>
       <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
          {{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}<br>
     </doc:source>
     <doc:scenario>
       it('should format date', function() {
         expect(binding("1288323623006 | date:'medium'")).
            toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
         expect(binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).
            toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} (\-|\+)?\d{4}/);
         expect(binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).
            toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
       });
     </doc:scenario>
   </doc:example>
 */
dateFilter.$inject = ['$locale'];
function dateFilter($locale) {


  var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
                     // 1        2       3         4          5          6          7          8  9     10      11
  function jsonStringToDate(string) {
    var match;
    if (match = string.match(R_ISO8601_STR)) {
      var date = new Date(0),
          tzHour = 0,
          tzMin  = 0,
          dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
          timeSetter = match[8] ? date.setUTCHours : date.setHours;

      if (match[9]) {
        tzHour = int(match[9] + match[10]);
        tzMin = int(match[9] + match[11]);
      }
      dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
      var h = int(match[4]||0) - tzHour;
      var m = int(match[5]||0) - tzMin
      var s = int(match[6]||0);
      var ms = Math.round(parseFloat('0.' + (match[7]||0)) * 1000);
      timeSetter.call(date, h, m, s, ms);
      return date;
    }
    return string;
  }


  return function(date, format) {
    var text = '',
        parts = [],
        fn, match;

    format = format || 'mediumDate';
    format = $locale.DATETIME_FORMATS[format] || format;
    if (isString(date)) {
      if (NUMBER_STRING.test(date)) {
        date = int(date);
      } else {
        date = jsonStringToDate(date);
      }
    }

    if (isNumber(date)) {
      date = new Date(date);
    }

    if (!isDate(date)) {
      return date;
    }

    while(format) {
      match = DATE_FORMATS_SPLIT.exec(format);
      if (match) {
        parts = concat(parts, match, 1);
        format = parts.pop();
      } else {
        parts.push(format);
        format = null;
      }
    }

    forEach(parts, function(value){
      fn = DATE_FORMATS[value];
      text += fn ? fn(date, $locale.DATETIME_FORMATS)
                 : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
    });

    return text;
  };
}


/**
 * @ngdoc filter
 * @name ng.filter:json
 * @function
 *
 * @description
 *   Allows you to convert a JavaScript object into JSON string.
 *
 *   This filter is mostly useful for debugging. When using the double curly {{value}} notation
 *   the binding is automatically converted to JSON.
 *
 * @param {*} object Any JavaScript object (including arrays and primitive types) to filter.
 * @returns {string} JSON string.
 *
 *
 * @example:
   <doc:example>
     <doc:source>
       <pre>{{ {'name':'value'} | json }}</pre>
     </doc:source>
     <doc:scenario>
       it('should jsonify filtered objects', function() {
         expect(binding("{'name':'value'}")).toMatch(/\{\n  "name": ?"value"\n}/);
       });
     </doc:scenario>
   </doc:example>
 *
 */
function jsonFilter() {
  return function(object) {
    return toJson(object, true);
  };
}


/**
 * @ngdoc filter
 * @name ng.filter:lowercase
 * @function
 * @description
 * Converts string to lowercase.
 * @see angular.lowercase
 */
var lowercaseFilter = valueFn(lowercase);


/**
 * @ngdoc filter
 * @name ng.filter:uppercase
 * @function
 * @description
 * Converts string to uppercase.
 * @see angular.uppercase
 */
var uppercaseFilter = valueFn(uppercase);

/**
 * @ngdoc function
 * @name ng.filter:limitTo
 * @function
 *
 * @description
 * Creates a new array or string containing only a specified number of elements. The elements
 * are taken from either the beginning or the end of the source array or string, as specified by
 * the value and sign (positive or negative) of `limit`.
 *
 * Note: This function is used to augment the `Array` type in Angular expressions. See
 * {@link ng.$filter} for more information about Angular arrays.
 *
 * @param {Array|string} input Source array or string to be limited.
 * @param {string|number} limit The length of the returned array or string. If the `limit` number 
 *     is positive, `limit` number of items from the beginning of the source array/string are copied.
 *     If the number is negative, `limit` number  of items from the end of the source array/string 
 *     are copied. The `limit` will be trimmed if it exceeds `array.length`
 * @returns {Array|string} A new sub-array or substring of length `limit` or less if input array
 *     had less than `limit` elements.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.numbers = [1,2,3,4,5,6,7,8,9];
           $scope.letters = "abcdefghi";
           $scope.numLimit = 3;
           $scope.letterLimit = 3;
         }
       </script>
       <div ng-controller="Ctrl">
         Limit {{numbers}} to: <input type="integer" ng-model="numLimit">
         <p>Output numbers: {{ numbers | limitTo:numLimit }}</p>
         Limit {{letters}} to: <input type="integer" ng-model="letterLimit">
         <p>Output letters: {{ letters | limitTo:letterLimit }}</p>
       </div>
     </doc:source>
     <doc:scenario>
       it('should limit the number array to first three items', function() {
         expect(element('.doc-example-live input[ng-model=numLimit]').val()).toBe('3');
         expect(element('.doc-example-live input[ng-model=letterLimit]').val()).toBe('3');
         expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('abc');
       });

       it('should update the output when -3 is entered', function() {
         input('numLimit').enter(-3);
         input('letterLimit').enter(-3);
         expect(binding('numbers | limitTo:numLimit')).toEqual('[7,8,9]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('ghi');
       });

       it('should not exceed the maximum size of input array', function() {
         input('numLimit').enter(100);
         input('letterLimit').enter(100);
         expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3,4,5,6,7,8,9]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('abcdefghi');
       });
     </doc:scenario>
   </doc:example>
 */
function limitToFilter(){
  return function(input, limit) {
    if (!isArray(input) && !isString(input)) return input;
    
    limit = int(limit);

    if (isString(input)) {
      //NaN check on limit
      if (limit) {
        return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);
      } else {
        return "";
      }
    }

    var out = [],
      i, n;

    // if abs(limit) exceeds maximum length, trim it
    if (limit > input.length)
      limit = input.length;
    else if (limit < -input.length)
      limit = -input.length;

    if (limit > 0) {
      i = 0;
      n = limit;
    } else {
      i = input.length + limit;
      n = input.length;
    }

    for (; i<n; i++) {
      out.push(input[i]);
    }

    return out;
  }
}

/**
 * @ngdoc function
 * @name ng.filter:orderBy
 * @function
 *
 * @description
 * Orders a specified `array` by the `expression` predicate.
 *
 * Note: this function is used to augment the `Array` type in Angular expressions. See
 * {@link ng.$filter} for more information about Angular arrays.
 *
 * @param {Array} array The array to sort.
 * @param {function(*)|string|Array.<(function(*)|string)>} expression A predicate to be
 *    used by the comparator to determine the order of elements.
 *
 *    Can be one of:
 *
 *    - `function`: Getter function. The result of this function will be sorted using the
 *      `<`, `=`, `>` operator.
 *    - `string`: An Angular expression which evaluates to an object to order by, such as 'name'
 *      to sort by a property called 'name'. Optionally prefixed with `+` or `-` to control
 *      ascending or descending sort order (for example, +name or -name).
 *    - `Array`: An array of function or string predicates. The first predicate in the array
 *      is used for sorting, but when two items are equivalent, the next predicate is used.
 *
 * @param {boolean=} reverse Reverse the order the array.
 * @returns {Array} Sorted copy of the source array.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.friends =
               [{name:'John', phone:'555-1212', age:10},
                {name:'Mary', phone:'555-9876', age:19},
                {name:'Mike', phone:'555-4321', age:21},
                {name:'Adam', phone:'555-5678', age:35},
                {name:'Julie', phone:'555-8765', age:29}]
           $scope.predicate = '-age';
         }
       </script>
       <div ng-controller="Ctrl">
         <pre>Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>
         <hr/>
         [ <a href="" ng-click="predicate=''">unsorted</a> ]
         <table class="friend">
           <tr>
             <th><a href="" ng-click="predicate = 'name'; reverse=false">Name</a>
                 (<a href="" ng-click="predicate = '-name'; reverse=false">^</a>)</th>
             <th><a href="" ng-click="predicate = 'phone'; reverse=!reverse">Phone Number</a></th>
             <th><a href="" ng-click="predicate = 'age'; reverse=!reverse">Age</a></th>
           </tr>
           <tr ng-repeat="friend in friends | orderBy:predicate:reverse">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           </tr>
         </table>
       </div>
     </doc:source>
     <doc:scenario>
       it('should be reverse ordered by aged', function() {
         expect(binding('predicate')).toBe('-age');
         expect(repeater('table.friend', 'friend in friends').column('friend.age')).
           toEqual(['35', '29', '21', '19', '10']);
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);
       });

       it('should reorder the table when user selects different predicate', function() {
         element('.doc-example-live a:contains("Name")').click();
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);
         expect(repeater('table.friend', 'friend in friends').column('friend.age')).
           toEqual(['35', '10', '29', '19', '21']);

         element('.doc-example-live a:contains("Phone")').click();
         expect(repeater('table.friend', 'friend in friends').column('friend.phone')).
           toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);
       });
     </doc:scenario>
   </doc:example>
 */
orderByFilter.$inject = ['$parse'];
function orderByFilter($parse){
  return function(array, sortPredicate, reverseOrder) {
    if (!isArray(array)) return array;
    if (!sortPredicate) return array;
    sortPredicate = isArray(sortPredicate) ? sortPredicate: [sortPredicate];
    sortPredicate = map(sortPredicate, function(predicate){
      var descending = false, get = predicate || identity;
      if (isString(predicate)) {
        if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
          descending = predicate.charAt(0) == '-';
          predicate = predicate.substring(1);
        }
        get = $parse(predicate);
      }
      return reverseComparator(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var arrayCopy = [];
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    return arrayCopy.sort(reverseComparator(comparator, reverseOrder));

    function comparator(o1, o2){
      for ( var i = 0; i < sortPredicate.length; i++) {
        var comp = sortPredicate[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    }
    function reverseComparator(comp, descending) {
      return toBoolean(descending)
          ? function(a,b){return comp(b,a);}
          : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") {
           v1 = v1.toLowerCase();
           v2 = v2.toLowerCase();
        }
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
  }
}

function ngDirective(directive) {
  if (isFunction(directive)) {
    directive = {
      link: directive
    }
  }
  directive.restrict = directive.restrict || 'AC';
  return valueFn(directive);
}

/**
 * @ngdoc directive
 * @name ng.directive:a
 * @restrict E
 *
 * @description
 * Modifies the default behavior of the html A tag so that the default action is prevented when
 * the href attribute is empty.
 *
 * This change permits the easy creation of action links with the `ngClick` directive
 * without changing the location or causing page reloads, e.g.:
 * `<a href="" ng-click="model.$save()">Save</a>`
 */
var htmlAnchorDirective = valueFn({
  restrict: 'E',
  compile: function(element, attr) {

    if (msie <= 8) {

      // turn <a href ng-click="..">link</a> into a stylable link in IE
      // but only if it doesn't have name attribute, in which case it's an anchor
      if (!attr.href && !attr.name) {
        attr.$set('href', '');
      }

      // add a comment node to anchors to workaround IE bug that causes element content to be reset
      // to new attribute content if attribute is updated with value containing @ and element also
      // contains value with @
      // see issue #1949
      element.append(document.createComment('IE fix'));
    }

    return function(scope, element) {
      element.on('click', function(event){
        // if we have no href url, then don't navigate anywhere.
        if (!element.attr('href')) {
          event.preventDefault();
        }
      });
    }
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:ngHref
 * @restrict A
 *
 * @description
 * Using Angular markup like `{{hash}}` in an href attribute will
 * make the link go to the wrong URL if the user clicks it before
 * Angular has a chance to replace the `{{hash}}` markup with its
 * value. Until Angular replaces the markup the link will be broken
 * and will most likely return a 404 error.
 *
 * The `ngHref` directive solves this problem.
 *
 * The wrong way to write it:
 * <pre>
 * <a href="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * The correct way to write it:
 * <pre>
 * <a ng-href="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * @element A
 * @param {template} ngHref any string which can contain `{{}}` markup.
 *
 * @example
 * This example shows various combinations of `href`, `ng-href` and `ng-click` attributes
 * in links and their different behaviors:
    <doc:example>
      <doc:source>
        <input ng-model="value" /><br />
        <a id="link-1" href ng-click="value = 1">link 1</a> (link, don't reload)<br />
        <a id="link-2" href="" ng-click="value = 2">link 2</a> (link, don't reload)<br />
        <a id="link-3" ng-href="/{{'123'}}">link 3</a> (link, reload!)<br />
        <a id="link-4" href="" name="xx" ng-click="value = 4">anchor</a> (link, don't reload)<br />
        <a id="link-5" name="xxx" ng-click="value = 5">anchor</a> (no link)<br />
        <a id="link-6" ng-href="{{value}}">link</a> (link, change location)
      </doc:source>
      <doc:scenario>
        it('should execute ng-click but not reload when href without value', function() {
          element('#link-1').click();
          expect(input('value').val()).toEqual('1');
          expect(element('#link-1').attr('href')).toBe("");
        });

        it('should execute ng-click but not reload when href empty string', function() {
          element('#link-2').click();
          expect(input('value').val()).toEqual('2');
          expect(element('#link-2').attr('href')).toBe("");
        });

        it('should execute ng-click and change url when ng-href specified', function() {
          expect(element('#link-3').attr('href')).toBe("/123");

          element('#link-3').click();
          expect(browser().window().path()).toEqual('/123');
        });

        it('should execute ng-click but not reload when href empty string and name specified', function() {
          element('#link-4').click();
          expect(input('value').val()).toEqual('4');
          expect(element('#link-4').attr('href')).toBe('');
        });

        it('should execute ng-click but not reload when no href but name specified', function() {
          element('#link-5').click();
          expect(input('value').val()).toEqual('5');
          expect(element('#link-5').attr('href')).toBe(undefined);
        });

        it('should only change url when only ng-href', function() {
          input('value').enter('6');
          expect(element('#link-6').attr('href')).toBe('6');

          element('#link-6').click();
          expect(browser().location().url()).toEqual('/6');
        });
      </doc:scenario>
    </doc:example>
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngSrc
 * @restrict A
 *
 * @description
 * Using Angular markup like `{{hash}}` in a `src` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until Angular replaces the expression inside
 * `{{hash}}`. The `ngSrc` directive solves this problem.
 *
 * The buggy way to write it:
 * <pre>
 * <img src="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * The correct way to write it:
 * <pre>
 * <img ng-src="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * @element IMG
 * @param {template} ngSrc any string which can contain `{{}}` markup.
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngSrcset
 * @restrict A
 *
 * @description
 * Using Angular markup like `{{hash}}` in a `srcset` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until Angular replaces the expression inside
 * `{{hash}}`. The `ngSrcset` directive solves this problem.
 *
 * The buggy way to write it:
 * <pre>
 * <img srcset="http://www.gravatar.com/avatar/{{hash}} 2x"/>
 * </pre>
 *
 * The correct way to write it:
 * <pre>
 * <img ng-srcset="http://www.gravatar.com/avatar/{{hash}} 2x"/>
 * </pre>
 *
 * @element IMG
 * @param {template} ngSrcset any string which can contain `{{}}` markup.
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngDisabled
 * @restrict A
 *
 * @description
 *
 * The following markup will make the button enabled on Chrome/Firefox but not on IE8 and older IEs:
 * <pre>
 * <div ng-init="scope = { isDisabled: false }">
 *  <button disabled="{{scope.isDisabled}}">Disabled</button>
 * </div>
 * </pre>
 *
 * The HTML specs do not require browsers to preserve the values of special attributes
 * such as disabled. (The presence of them means true and absence means false)
 * This prevents the Angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduce the `ngDisabled` directive.
 *
 * @example
    <doc:example>
      <doc:source>
        Click me to toggle: <input type="checkbox" ng-model="checked"><br/>
        <button ng-model="button" ng-disabled="checked">Button</button>
      </doc:source>
      <doc:scenario>
        it('should toggle button', function() {
          expect(element('.doc-example-live :button').prop('disabled')).toBeFalsy();
          input('checked').check();
          expect(element('.doc-example-live :button').prop('disabled')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element INPUT
 * @param {expression} ngDisabled If the {@link guide/expression expression} is truthy, 
 *     then special attribute "disabled" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngChecked
 * @restrict A
 *
 * @description
 * The HTML specs do not require browsers to preserve the special attributes such as checked.
 * (The presence of them means true and absence means false)
 * This prevents the angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduce the `ngChecked` directive.
 * @example
    <doc:example>
      <doc:source>
        Check me to check both: <input type="checkbox" ng-model="master"><br/>
        <input id="checkSlave" type="checkbox" ng-checked="master">
      </doc:source>
      <doc:scenario>
        it('should check both checkBoxes', function() {
          expect(element('.doc-example-live #checkSlave').prop('checked')).toBeFalsy();
          input('master').check();
          expect(element('.doc-example-live #checkSlave').prop('checked')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element INPUT
 * @param {expression} ngChecked If the {@link guide/expression expression} is truthy, 
 *     then special attribute "checked" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngReadonly
 * @restrict A
 *
 * @description
 * The HTML specs do not require browsers to preserve the special attributes such as readonly.
 * (The presence of them means true and absence means false)
 * This prevents the angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduce the `ngReadonly` directive.
 * @example
    <doc:example>
      <doc:source>
        Check me to make text readonly: <input type="checkbox" ng-model="checked"><br/>
        <input type="text" ng-readonly="checked" value="I'm Angular"/>
      </doc:source>
      <doc:scenario>
        it('should toggle readonly attr', function() {
          expect(element('.doc-example-live :text').prop('readonly')).toBeFalsy();
          input('checked').check();
          expect(element('.doc-example-live :text').prop('readonly')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element INPUT
 * @param {expression} ngReadonly If the {@link guide/expression expression} is truthy, 
 *     then special attribute "readonly" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngSelected
 * @restrict A
 *
 * @description
 * The HTML specs do not require browsers to preserve the special attributes such as selected.
 * (The presence of them means true and absence means false)
 * This prevents the angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduced the `ngSelected` directive.
 * @example
    <doc:example>
      <doc:source>
        Check me to select: <input type="checkbox" ng-model="selected"><br/>
        <select>
          <option>Hello!</option>
          <option id="greet" ng-selected="selected">Greetings!</option>
        </select>
      </doc:source>
      <doc:scenario>
        it('should select Greetings!', function() {
          expect(element('.doc-example-live #greet').prop('selected')).toBeFalsy();
          input('selected').check();
          expect(element('.doc-example-live #greet').prop('selected')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element OPTION
 * @param {expression} ngSelected If the {@link guide/expression expression} is truthy, 
 *     then special attribute "selected" will be set on the element
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngOpen
 * @restrict A
 *
 * @description
 * The HTML specs do not require browsers to preserve the special attributes such as open.
 * (The presence of them means true and absence means false)
 * This prevents the angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduce the `ngOpen` directive.
 *
 * @example
     <doc:example>
       <doc:source>
         Check me check multiple: <input type="checkbox" ng-model="open"><br/>
         <details id="details" ng-open="open">
            <summary>Show/Hide me</summary>
         </details>
       </doc:source>
       <doc:scenario>
         it('should toggle open', function() {
           expect(element('#details').prop('open')).toBeFalsy();
           input('open').check();
           expect(element('#details').prop('open')).toBeTruthy();
         });
       </doc:scenario>
     </doc:example>
 *
 * @element DETAILS
 * @param {expression} ngOpen If the {@link guide/expression expression} is truthy, 
 *     then special attribute "open" will be set on the element
 */

var ngAttributeAliasDirectives = {};


// boolean attrs are evaluated
forEach(BOOLEAN_ATTR, function(propName, attrName) {
  // binding to multiple is not supported
  if (propName == "multiple") return;

  var normalized = directiveNormalize('ng-' + attrName);
  ngAttributeAliasDirectives[normalized] = function() {
    return {
      priority: 100,
      compile: function() {
        return function(scope, element, attr) {
          scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
            attr.$set(attrName, !!value);
          });
        };
      }
    };
  };
});


// ng-src, ng-srcset, ng-href are interpolated
forEach(['src', 'srcset', 'href'], function(attrName) {
  var normalized = directiveNormalize('ng-' + attrName);
  ngAttributeAliasDirectives[normalized] = function() {
    return {
      priority: 99, // it needs to run after the attributes are interpolated
      link: function(scope, element, attr) {
        attr.$observe(normalized, function(value) {
          if (!value)
             return;

          attr.$set(attrName, value);

          // on IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
          // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
          // to set the property as well to achieve the desired effect.
          // we use attr[attrName] value since $set can sanitize the url.
          if (msie) element.prop(attrName, attr[attrName]);
        });
      }
    };
  };
});

var nullFormCtrl = {
  $addControl: noop,
  $removeControl: noop,
  $setValidity: noop,
  $setDirty: noop,
  $setPristine: noop
};

/**
 * @ngdoc object
 * @name ng.directive:form.FormController
 *
 * @property {boolean} $pristine True if user has not interacted with the form yet.
 * @property {boolean} $dirty True if user has already interacted with the form.
 * @property {boolean} $valid True if all of the containing forms and controls are valid.
 * @property {boolean} $invalid True if at least one containing control or form is invalid.
 *
 * @property {Object} $error Is an object hash, containing references to all invalid controls or
 *  forms, where:
 *
 *  - keys are validation tokens (error names) — such as `required`, `url` or `email`),
 *  - values are arrays of controls or forms that are invalid with given error.
 *
 * @description
 * `FormController` keeps track of all its controls and nested forms as well as state of them,
 * such as being valid/invalid or dirty/pristine.
 *
 * Each {@link ng.directive:form form} directive creates an instance
 * of `FormController`.
 *
 */
//asks for $scope to fool the BC controller module
FormController.$inject = ['$element', '$attrs', '$scope'];
function FormController(element, attrs) {
  var form = this,
      parentForm = element.parent().controller('form') || nullFormCtrl,
      invalidCount = 0, // used to easily determine if we are valid
      errors = form.$error = {},
      controls = [];

  // init state
  form.$name = attrs.name || attrs.ngForm;
  form.$dirty = false;
  form.$pristine = true;
  form.$valid = true;
  form.$invalid = false;

  parentForm.$addControl(form);

  // Setup initial state of the control
  element.addClass(PRISTINE_CLASS);
  toggleValidCss(true);

  // convenience method for easy toggling of classes
  function toggleValidCss(isValid, validationErrorKey) {
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
    element.
      removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).
      addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
  }

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$addControl
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Register a control with the form.
   *
   * Input elements using ngModelController do this automatically when they are linked.
   */
  form.$addControl = function(control) {
    controls.push(control);

    if (control.$name && !form.hasOwnProperty(control.$name)) {
      form[control.$name] = control;
    }
  };

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$removeControl
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Deregister a control from the form.
   *
   * Input elements using ngModelController do this automatically when they are destroyed.
   */
  form.$removeControl = function(control) {
    if (control.$name && form[control.$name] === control) {
      delete form[control.$name];
    }
    forEach(errors, function(queue, validationToken) {
      form.$setValidity(validationToken, true, control);
    });

    arrayRemove(controls, control);
  };

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$setValidity
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Sets the validity of a form control.
   *
   * This method will also propagate to parent forms.
   */
  form.$setValidity = function(validationToken, isValid, control) {
    var queue = errors[validationToken];

    if (isValid) {
      if (queue) {
        arrayRemove(queue, control);
        if (!queue.length) {
          invalidCount--;
          if (!invalidCount) {
            toggleValidCss(isValid);
            form.$valid = true;
            form.$invalid = false;
          }
          errors[validationToken] = false;
          toggleValidCss(true, validationToken);
          parentForm.$setValidity(validationToken, true, form);
        }
      }

    } else {
      if (!invalidCount) {
        toggleValidCss(isValid);
      }
      if (queue) {
        if (includes(queue, control)) return;
      } else {
        errors[validationToken] = queue = [];
        invalidCount++;
        toggleValidCss(false, validationToken);
        parentForm.$setValidity(validationToken, false, form);
      }
      queue.push(control);

      form.$valid = false;
      form.$invalid = true;
    }
  };

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$setDirty
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Sets the form to a dirty state.
   *
   * This method can be called to add the 'ng-dirty' class and set the form to a dirty
   * state (ng-dirty class). This method will also propagate to parent forms.
   */
  form.$setDirty = function() {
    element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
    form.$dirty = true;
    form.$pristine = false;
    parentForm.$setDirty();
  };

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$setPristine
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Sets the form to its pristine state.
   *
   * This method can be called to remove the 'ng-dirty' class and set the form to its pristine
   * state (ng-pristine class). This method will also propagate to all the controls contained
   * in this form.
   *
   * Setting a form back to a pristine state is often useful when we want to 'reuse' a form after
   * saving or resetting it.
   */
  form.$setPristine = function () {
    element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
    form.$dirty = false;
    form.$pristine = true;
    forEach(controls, function(control) {
      control.$setPristine();
    });
  };
}


/**
 * @ngdoc directive
 * @name ng.directive:ngForm
 * @restrict EAC
 *
 * @description
 * Nestable alias of {@link ng.directive:form `form`} directive. HTML
 * does not allow nesting of form elements. It is useful to nest forms, for example if the validity of a
 * sub-group of controls needs to be determined.
 *
 * @param {string=} name|ngForm Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 *
 */

 /**
 * @ngdoc directive
 * @name ng.directive:form
 * @restrict E
 *
 * @description
 * Directive that instantiates
 * {@link ng.directive:form.FormController FormController}.
 *
 * If the `name` attribute is specified, the form controller is published onto the current scope under
 * this name.
 *
 * # Alias: {@link ng.directive:ngForm `ngForm`}
 *
 * In Angular forms can be nested. This means that the outer form is valid when all of the child
 * forms are valid as well. However, browsers do not allow nesting of `<form>` elements, so
 * Angular provides the {@link ng.directive:ngForm `ngForm`} directive which behaves identically to
 * `<form>` but can be nested.  This allows you to have nested forms, which is very useful when
 * using Angular validation directives in forms that are dynamically generated using the
 * {@link ng.directive:ngRepeat `ngRepeat`} directive. Since you cannot dynamically generate the `name`
 * attribute of input elements using interpolation, you have to wrap each set of repeated inputs in an
 * `ngForm` directive and nest these in an outer `form` element.
 *
 *
 * # CSS classes
 *  - `ng-valid` Is set if the form is valid.
 *  - `ng-invalid` Is set if the form is invalid.
 *  - `ng-pristine` Is set if the form is pristine.
 *  - `ng-dirty` Is set if the form is dirty.
 *
 *
 * # Submitting a form and preventing the default action
 *
 * Since the role of forms in client-side Angular applications is different than in classical
 * roundtrip apps, it is desirable for the browser not to translate the form submission into a full
 * page reload that sends the data to the server. Instead some javascript logic should be triggered
 * to handle the form submission in an application-specific way.
 *
 * For this reason, Angular prevents the default action (form submission to the server) unless the
 * `<form>` element has an `action` attribute specified.
 *
 * You can use one of the following two ways to specify what javascript method should be called when
 * a form is submitted:
 *
 * - {@link ng.directive:ngSubmit ngSubmit} directive on the form element
 * - {@link ng.directive:ngClick ngClick} directive on the first
  *  button or input field of type submit (input[type=submit])
 *
 * To prevent double execution of the handler, use only one of the {@link ng.directive:ngSubmit ngSubmit}
 * or {@link ng.directive:ngClick ngClick} directives.
 * This is because of the following form submission rules in the HTML specification:
 *
 * - If a form has only one input field then hitting enter in this field triggers form submit
 * (`ngSubmit`)
 * - if a form has has 2+ input fields and no buttons or input[type=submit] then hitting enter
 * doesn't trigger submit
 * - if a form has one or more input fields and one or more buttons or input[type=submit] then
 * hitting enter in any of the input fields will trigger the click handler on the *first* button or
 * input[type=submit] (`ngClick`) *and* a submit handler on the enclosing form (`ngSubmit`)
 *
 * @param {string=} name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.userType = 'guest';
         }
       </script>
       <form name="myForm" ng-controller="Ctrl">
         userType: <input name="input" ng-model="userType" required>
         <span class="error" ng-show="myForm.input.$error.required">Required!</span><br>
         <tt>userType = {{userType}}</tt><br>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
         expect(binding('userType')).toEqual('guest');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
         input('userType').enter('');
         expect(binding('userType')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var formDirectiveFactory = function(isNgForm) {
  return ['$timeout', function($timeout) {
    var formDirective = {
      name: 'form',
      restrict: isNgForm ? 'EAC' : 'E',
      controller: FormController,
      compile: function() {
        return {
          pre: function(scope, formElement, attr, controller) {
            if (!attr.action) {
              // we can't use jq events because if a form is destroyed during submission the default
              // action is not prevented. see #1238
              //
              // IE 9 is not affected because it doesn't fire a submit event and try to do a full
              // page reload if the form was destroyed by submission of the form via a click handler
              // on a button in the form. Looks like an IE9 specific bug.
              var preventDefaultListener = function(event) {
                event.preventDefault
                  ? event.preventDefault()
                  : event.returnValue = false; // IE
              };

              addEventListenerFn(formElement[0], 'submit', preventDefaultListener);

              // unregister the preventDefault listener so that we don't not leak memory but in a
              // way that will achieve the prevention of the default action.
              formElement.on('$destroy', function() {
                $timeout(function() {
                  removeEventListenerFn(formElement[0], 'submit', preventDefaultListener);
                }, 0, false);
              });
            }

            var parentFormCtrl = formElement.parent().controller('form'),
                alias = attr.name || attr.ngForm;

            if (alias) {
              setter(scope, alias, controller, alias);
            }
            if (parentFormCtrl) {
              formElement.on('$destroy', function() {
                parentFormCtrl.$removeControl(controller);
                if (alias) {
                  setter(scope, alias, undefined, alias);
                }
                extend(controller, nullFormCtrl); //stop propagating child destruction handlers upwards
              });
            }
          }
        };
      }
    };

    return formDirective;
  }];
};

var formDirective = formDirectiveFactory();
var ngFormDirective = formDirectiveFactory(true);

var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

var inputType = {

  /**
   * @ngdoc inputType
   * @name ng.directive:input.text
   *
   * @description
   * Standard HTML text input with angular data binding.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Adds `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   * @param {boolean=} [ngTrim=true] If set to false Angular will not automatically trimming the
   *    input.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'guest';
             $scope.word = /^\s*\w*\s*$/;
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Single word: <input type="text" name="input" ng-model="text"
                               ng-pattern="word" required ng-trim="false">
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.pattern">
             Single word only!</span>

           <tt>text = {{text}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('guest');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if multi word', function() {
            input('text').enter('hello world');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should not be trimmed', function() {
            input('text').enter('untrimmed ');
            expect(binding('text')).toEqual('untrimmed ');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });
        </doc:scenario>
      </doc:example>
   */
  'text': textInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.number
   *
   * @description
   * Text input with number validation and transformation. Sets the `number` validation
   * error if not a valid number.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.value = 12;
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Number: <input type="number" name="input" ng-model="value"
                          min="0" max="99" required>
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.number">
             Not valid number!</span>
           <tt>value = {{value}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
           expect(binding('value')).toEqual('12');
           expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
           input('value').enter('');
           expect(binding('value')).toEqual('');
           expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if over max', function() {
           input('value').enter('123');
           expect(binding('value')).toEqual('');
           expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */
  'number': numberInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.url
   *
   * @description
   * Text input with URL validation. Sets the `url` validation error key if the content is not a
   * valid URL.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'http://google.com';
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           URL: <input type="url" name="input" ng-model="text" required>
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.url">
             Not valid url!</span>
           <tt>text = {{text}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
           <tt>myForm.$error.url = {{!!myForm.$error.url}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('http://google.com');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if not url', function() {
            input('text').enter('xxx');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */
  'url': urlInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.email
   *
   * @description
   * Text input with email validation. Sets the `email` validation error key if not a valid email
   * address.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'me@example.com';
           }
         </script>
           <form name="myForm" ng-controller="Ctrl">
             Email: <input type="email" name="input" ng-model="text" required>
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.email">
               Not valid email!</span>
             <tt>text = {{text}}</tt><br/>
             <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
             <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
             <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
             <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
             <tt>myForm.$error.email = {{!!myForm.$error.email}}</tt><br/>
           </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('me@example.com');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if not email', function() {
            input('text').enter('xxx');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */
  'email': emailInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.radio
   *
   * @description
   * HTML radio button.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string} value The value to which the expression should be set when selected.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.color = 'blue';
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           <input type="radio" ng-model="color" value="red">  Red <br/>
           <input type="radio" ng-model="color" value="green"> Green <br/>
           <input type="radio" ng-model="color" value="blue"> Blue <br/>
           <tt>color = {{color}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should change state', function() {
            expect(binding('color')).toEqual('blue');

            input('color').select('red');
            expect(binding('color')).toEqual('red');
          });
        </doc:scenario>
      </doc:example>
   */
  'radio': radioInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.checkbox
   *
   * @description
   * HTML checkbox.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} ngTrueValue The value to which the expression should be set when selected.
   * @param {string=} ngFalseValue The value to which the expression should be set when not selected.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.value1 = true;
             $scope.value2 = 'YES'
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Value1: <input type="checkbox" ng-model="value1"> <br/>
           Value2: <input type="checkbox" ng-model="value2"
                          ng-true-value="YES" ng-false-value="NO"> <br/>
           <tt>value1 = {{value1}}</tt><br/>
           <tt>value2 = {{value2}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should change state', function() {
            expect(binding('value1')).toEqual('true');
            expect(binding('value2')).toEqual('YES');

            input('value1').check();
            input('value2').check();
            expect(binding('value1')).toEqual('false');
            expect(binding('value2')).toEqual('NO');
          });
        </doc:scenario>
      </doc:example>
   */
  'checkbox': checkboxInputType,

  'hidden': noop,
  'button': noop,
  'submit': noop,
  'reset': noop
};


function isEmpty(value) {
  return isUndefined(value) || value === '' || value === null || value !== value;
}


function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {

  var listener = function() {
    var value = element.val();

    // By default we will trim the value
    // If the attribute ng-trim exists we will avoid trimming
    // e.g. <input ng-model="foo" ng-trim="false">
    if (toBoolean(attr.ngTrim || 'T')) {
      value = trim(value);
    }

    if (ctrl.$viewValue !== value) {
      scope.$apply(function() {
        ctrl.$setViewValue(value);
      });
    }
  };

  // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
  // input event on backspace, delete or cut
  if ($sniffer.hasEvent('input')) {
    element.on('input', listener);
  } else {
    var timeout;

    var deferListener = function() {
      if (!timeout) {
        timeout = $browser.defer(function() {
          listener();
          timeout = null;
        });
      }
    };

    element.on('keydown', function(event) {
      var key = event.keyCode;

      // ignore
      //    command            modifiers                   arrows
      if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

      deferListener();
    });

    // if user paste into input using mouse, we need "change" event to catch it
    element.on('change', listener);

    // if user modifies input value using context menu in IE, we need "paste" and "cut" events to catch it
    if ($sniffer.hasEvent('paste')) {
      element.on('paste cut', deferListener);
    }
  }


  ctrl.$render = function() {
    element.val(isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
  };

  // pattern validator
  var pattern = attr.ngPattern,
      patternValidator,
      match;

  var validate = function(regexp, value) {
    if (isEmpty(value) || regexp.test(value)) {
      ctrl.$setValidity('pattern', true);
      return value;
    } else {
      ctrl.$setValidity('pattern', false);
      return undefined;
    }
  };

  if (pattern) {
    match = pattern.match(/^\/(.*)\/([gim]*)$/);
    if (match) {
      pattern = new RegExp(match[1], match[2]);
      patternValidator = function(value) {
        return validate(pattern, value)
      };
    } else {
      patternValidator = function(value) {
        var patternObj = scope.$eval(pattern);

        if (!patternObj || !patternObj.test) {
          throw minErr('ngPattern')('noregexp',
            'Expected {0} to be a RegExp but was {1}. Element: {2}', pattern,
            patternObj, startingTag(element));
        }
        return validate(patternObj, value);
      };
    }

    ctrl.$formatters.push(patternValidator);
    ctrl.$parsers.push(patternValidator);
  }

  // min length validator
  if (attr.ngMinlength) {
    var minlength = int(attr.ngMinlength);
    var minLengthValidator = function(value) {
      if (!isEmpty(value) && value.length < minlength) {
        ctrl.$setValidity('minlength', false);
        return undefined;
      } else {
        ctrl.$setValidity('minlength', true);
        return value;
      }
    };

    ctrl.$parsers.push(minLengthValidator);
    ctrl.$formatters.push(minLengthValidator);
  }

  // max length validator
  if (attr.ngMaxlength) {
    var maxlength = int(attr.ngMaxlength);
    var maxLengthValidator = function(value) {
      if (!isEmpty(value) && value.length > maxlength) {
        ctrl.$setValidity('maxlength', false);
        return undefined;
      } else {
        ctrl.$setValidity('maxlength', true);
        return value;
      }
    };

    ctrl.$parsers.push(maxLengthValidator);
    ctrl.$formatters.push(maxLengthValidator);
  }
}

function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);

  ctrl.$parsers.push(function(value) {
    var empty = isEmpty(value);
    if (empty || NUMBER_REGEXP.test(value)) {
      ctrl.$setValidity('number', true);
      return value === '' ? null : (empty ? value : parseFloat(value));
    } else {
      ctrl.$setValidity('number', false);
      return undefined;
    }
  });

  ctrl.$formatters.push(function(value) {
    return isEmpty(value) ? '' : '' + value;
  });

  if (attr.min) {
    var min = parseFloat(attr.min);
    var minValidator = function(value) {
      if (!isEmpty(value) && value < min) {
        ctrl.$setValidity('min', false);
        return undefined;
      } else {
        ctrl.$setValidity('min', true);
        return value;
      }
    };

    ctrl.$parsers.push(minValidator);
    ctrl.$formatters.push(minValidator);
  }

  if (attr.max) {
    var max = parseFloat(attr.max);
    var maxValidator = function(value) {
      if (!isEmpty(value) && value > max) {
        ctrl.$setValidity('max', false);
        return undefined;
      } else {
        ctrl.$setValidity('max', true);
        return value;
      }
    };

    ctrl.$parsers.push(maxValidator);
    ctrl.$formatters.push(maxValidator);
  }

  ctrl.$formatters.push(function(value) {

    if (isEmpty(value) || isNumber(value)) {
      ctrl.$setValidity('number', true);
      return value;
    } else {
      ctrl.$setValidity('number', false);
      return undefined;
    }
  });
}

function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var urlValidator = function(value) {
    if (isEmpty(value) || URL_REGEXP.test(value)) {
      ctrl.$setValidity('url', true);
      return value;
    } else {
      ctrl.$setValidity('url', false);
      return undefined;
    }
  };

  ctrl.$formatters.push(urlValidator);
  ctrl.$parsers.push(urlValidator);
}

function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var emailValidator = function(value) {
    if (isEmpty(value) || EMAIL_REGEXP.test(value)) {
      ctrl.$setValidity('email', true);
      return value;
    } else {
      ctrl.$setValidity('email', false);
      return undefined;
    }
  };

  ctrl.$formatters.push(emailValidator);
  ctrl.$parsers.push(emailValidator);
}

function radioInputType(scope, element, attr, ctrl) {
  // make the name unique, if not defined
  if (isUndefined(attr.name)) {
    element.attr('name', nextUid());
  }

  element.on('click', function() {
    if (element[0].checked) {
      scope.$apply(function() {
        ctrl.$setViewValue(attr.value);
      });
    }
  });

  ctrl.$render = function() {
    var value = attr.value;
    element[0].checked = (value == ctrl.$viewValue);
  };

  attr.$observe('value', ctrl.$render);
}

function checkboxInputType(scope, element, attr, ctrl) {
  var trueValue = attr.ngTrueValue,
      falseValue = attr.ngFalseValue;

  if (!isString(trueValue)) trueValue = true;
  if (!isString(falseValue)) falseValue = false;

  element.on('click', function() {
    scope.$apply(function() {
      ctrl.$setViewValue(element[0].checked);
    });
  });

  ctrl.$render = function() {
    element[0].checked = ctrl.$viewValue;
  };

  ctrl.$formatters.push(function(value) {
    return value === trueValue;
  });

  ctrl.$parsers.push(function(value) {
    return value ? trueValue : falseValue;
  });
}


/**
 * @ngdoc directive
 * @name ng.directive:textarea
 * @restrict E
 *
 * @description
 * HTML textarea element control with angular data-binding. The data-binding and validation
 * properties of this element are exactly the same as those of the
 * {@link ng.directive:input input element}.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 */


/**
 * @ngdoc directive
 * @name ng.directive:input
 * @restrict E
 *
 * @description
 * HTML input element control with angular data-binding. Input control follows HTML5 input types
 * and polyfills the HTML5 validation behavior for older browsers.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {boolean=} ngRequired Sets `required` attribute if set to true
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.user = {name: 'guest', last: 'visitor'};
         }
       </script>
       <div ng-controller="Ctrl">
         <form name="myForm">
           User name: <input type="text" name="userName" ng-model="user.name" required>
           <span class="error" ng-show="myForm.userName.$error.required">
             Required!</span><br>
           Last name: <input type="text" name="lastName" ng-model="user.last"
             ng-minlength="3" ng-maxlength="10">
           <span class="error" ng-show="myForm.lastName.$error.minlength">
             Too short!</span>
           <span class="error" ng-show="myForm.lastName.$error.maxlength">
             Too long!</span><br>
         </form>
         <hr>
         <tt>user = {{user}}</tt><br/>
         <tt>myForm.userName.$valid = {{myForm.userName.$valid}}</tt><br>
         <tt>myForm.userName.$error = {{myForm.userName.$error}}</tt><br>
         <tt>myForm.lastName.$valid = {{myForm.lastName.$valid}}</tt><br>
         <tt>myForm.lastName.$error = {{myForm.lastName.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>
         <tt>myForm.$error.minlength = {{!!myForm.$error.minlength}}</tt><br>
         <tt>myForm.$error.maxlength = {{!!myForm.$error.maxlength}}</tt><br>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('user')).toEqual('{"name":"guest","last":"visitor"}');
          expect(binding('myForm.userName.$valid')).toEqual('true');
          expect(binding('myForm.$valid')).toEqual('true');
        });

        it('should be invalid if empty when required', function() {
          input('user.name').enter('');
          expect(binding('user')).toEqual('{"last":"visitor"}');
          expect(binding('myForm.userName.$valid')).toEqual('false');
          expect(binding('myForm.$valid')).toEqual('false');
        });

        it('should be valid if empty when min length is set', function() {
          input('user.last').enter('');
          expect(binding('user')).toEqual('{"name":"guest","last":""}');
          expect(binding('myForm.lastName.$valid')).toEqual('true');
          expect(binding('myForm.$valid')).toEqual('true');
        });

        it('should be invalid if less than required min length', function() {
          input('user.last').enter('xx');
          expect(binding('user')).toEqual('{"name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('false');
          expect(binding('myForm.lastName.$error')).toMatch(/minlength/);
          expect(binding('myForm.$valid')).toEqual('false');
        });

        it('should be invalid if longer than max length', function() {
          input('user.last').enter('some ridiculously long name');
          expect(binding('user'))
            .toEqual('{"name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('false');
          expect(binding('myForm.lastName.$error')).toMatch(/maxlength/);
          expect(binding('myForm.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var inputDirective = ['$browser', '$sniffer', function($browser, $sniffer) {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, element, attr, ctrl) {
      if (ctrl) {
        (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer,
                                                            $browser);
      }
    }
  };
}];

var VALID_CLASS = 'ng-valid',
    INVALID_CLASS = 'ng-invalid',
    PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty';

/**
 * @ngdoc object
 * @name ng.directive:ngModel.NgModelController
 *
 * @property {string} $viewValue Actual string value in the view.
 * @property {*} $modelValue The value in the model, that the control is bound to.
 * @property {Array.<Function>} $parsers Array of functions to execute, as a pipeline, whenever
       the control reads value from the DOM.  Each function is called, in turn, passing the value
       through to the next. Used to sanitize / convert the value as well as validation.
       For validation, the parsers should update the validity state using
       {@link ng.directive:ngModel.NgModelController#$setValidity $setValidity()},
       and return `undefined` for invalid values.

 *
 * @property {Array.<Function>} $formatters Array of functions to execute, as a pipeline, whenever
       the model value changes. Each function is called, in turn, passing the value through to the
       next. Used to format / convert values for display in the control and validation.
 *      <pre>
 *      function formatter(value) {
 *        if (value) {
 *          return value.toUpperCase();
 *        }
 *      }
 *      ngModel.$formatters.push(formatter);
 *      </pre>
 * @property {Object} $error An object hash with all errors as keys.
 *
 * @property {boolean} $pristine True if user has not interacted with the control yet.
 * @property {boolean} $dirty True if user has already interacted with the control.
 * @property {boolean} $valid True if there is no error.
 * @property {boolean} $invalid True if at least one error on the control.
 *
 * @description
 *
 * `NgModelController` provides API for the `ng-model` directive. The controller contains
 * services for data-binding, validation, CSS updates, and value formatting and parsing. It
 * purposefully does not contain any logic which deals with DOM rendering or listening to
 * DOM events. Such DOM related logic should be provided by other directives which make use of
 * `NgModelController` for data-binding.
 *
 * ## Custom Control Example
 * This example shows how to use `NgModelController` with a custom control to achieve
 * data-binding. Notice how different directives (`contenteditable`, `ng-model`, and `required`)
 * collaborate together to achieve the desired result.
 *
 * Note that `contenteditable` is an HTML5 attribute, which tells the browser to let the element
 * contents be edited in place by the user.  This will not work on older browsers.
 *
 * <example module="customControl">
    <file name="style.css">
      [contenteditable] {
        border: 1px solid black;
        background-color: white;
        min-height: 20px;
      }

      .ng-invalid {
        border: 1px solid red;
      }

    </file>
    <file name="script.js">
      angular.module('customControl', []).
        directive('contenteditable', function() {
          return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function(scope, element, attrs, ngModel) {
              if(!ngModel) return; // do nothing if no ng-model

              // Specify how UI should be updated
              ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
              };

              // Listen for change events to enable binding
              element.on('blur keyup change', function() {
                scope.$apply(read);
              });
              read(); // initialize

              // Write data to the model
              function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if( attrs.stripBr && html == '<br>' ) {
                  html = '';
                }
                ngModel.$setViewValue(html);
              }
            }
          };
        });
    </file>
    <file name="index.html">
      <form name="myForm">
       <div contenteditable
            name="myWidget" ng-model="userContent"
            strip-br="true"
            required>Change me!</div>
        <span ng-show="myForm.myWidget.$error.required">Required!</span>
       <hr>
       <textarea ng-model="userContent"></textarea>
      </form>
    </file>
    <file name="scenario.js">
      it('should data-bind and become invalid', function() {
        var contentEditable = element('[contenteditable]');

        expect(contentEditable.text()).toEqual('Change me!');
        input('userContent').enter('');
        expect(contentEditable.text()).toEqual('');
        expect(contentEditable.prop('className')).toMatch(/ng-invalid-required/);
      });
    </file>
 * </example>
 *
 * ## Isolated Scope Pitfall
 *
 * Note that if you have a directive with an isolated scope, you cannot require `ngModel`
 * since the model value will be looked up on the isolated scope rather than the outer scope.
 * When the directive updates the model value, calling `ngModel.$setViewValue()` the property
 * on the outer scope will not be updated.
 *
 * Here is an example of this situation.  You'll notice that even though both 'input' and 'div'
 * seem to be attached to the same model, they are not kept in synch.
 *
 * <example module="badIsolatedDirective">
    <file name="script.js">
		angular.module('badIsolatedDirective', []).directive('bad', function() {
		  return {
		    require: 'ngModel',
		    scope: { },
		    template: '<input ng-model="innerModel">',
		    link: function(scope, element, attrs, ngModel) {
		      scope.$watch('innerModel', function(value) {
		        console.log(value);
		        ngModel.$setViewValue(value);
		      });
		    }
		  };
		});
    </file>
    <file name="index.html">
	    <input ng-model="someModel">
	    <div bad ng-model="someModel"></div>
    </file>
 * </example>
 *
 * 
 */
var NgModelController = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse',
    function($scope, $exceptionHandler, $attr, $element, $parse) {
  this.$viewValue = Number.NaN;
  this.$modelValue = Number.NaN;
  this.$parsers = [];
  this.$formatters = [];
  this.$viewChangeListeners = [];
  this.$pristine = true;
  this.$dirty = false;
  this.$valid = true;
  this.$invalid = false;
  this.$name = $attr.name;

  var ngModelGet = $parse($attr.ngModel),
      ngModelSet = ngModelGet.assign;

  if (!ngModelSet) {
    throw minErr('ngModel')('nonassign', "Expression '{0}' is non-assignable. Element: {1}",
        $attr.ngModel, startingTag($element));
  }

  /**
   * @ngdoc function
   * @name ng.directive:ngModel.NgModelController#$render
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * Called when the view needs to be updated. It is expected that the user of the ng-model
   * directive will implement this method.
   */
  this.$render = noop;

  var parentForm = $element.inheritedData('$formController') || nullFormCtrl,
      invalidCount = 0, // used to easily determine if we are valid
      $error = this.$error = {}; // keep invalid keys here


  // Setup initial state of the control
  $element.addClass(PRISTINE_CLASS);
  toggleValidCss(true);

  // convenience method for easy toggling of classes
  function toggleValidCss(isValid, validationErrorKey) {
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
    $element.
      removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).
      addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
  }

  /**
   * @ngdoc function
   * @name ng.directive:ngModel.NgModelController#$setValidity
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * Change the validity state, and notifies the form when the control changes validity. (i.e. it
   * does not notify form if given validator is already marked as invalid).
   *
   * This method should be called by validators - i.e. the parser or formatter functions.
   *
   * @param {string} validationErrorKey Name of the validator. the `validationErrorKey` will assign
   *        to `$error[validationErrorKey]=isValid` so that it is available for data-binding.
   *        The `validationErrorKey` should be in camelCase and will get converted into dash-case
   *        for class name. Example: `myError` will result in `ng-valid-my-error` and `ng-invalid-my-error`
   *        class and can be bound to as  `{{someForm.someControl.$error.myError}}` .
   * @param {boolean} isValid Whether the current state is valid (true) or invalid (false).
   */
  this.$setValidity = function(validationErrorKey, isValid) {
    if ($error[validationErrorKey] === !isValid) return;

    if (isValid) {
      if ($error[validationErrorKey]) invalidCount--;
      if (!invalidCount) {
        toggleValidCss(true);
        this.$valid = true;
        this.$invalid = false;
      }
    } else {
      toggleValidCss(false);
      this.$invalid = true;
      this.$valid = false;
      invalidCount++;
    }

    $error[validationErrorKey] = !isValid;
    toggleValidCss(isValid, validationErrorKey);

    parentForm.$setValidity(validationErrorKey, isValid, this);
  };

  /**
   * @ngdoc function
   * @name ng.directive:ngModel.NgModelController#$setPristine
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * Sets the control to its pristine state.
   *
   * This method can be called to remove the 'ng-dirty' class and set the control to its pristine
   * state (ng-pristine class).
   */
  this.$setPristine = function () {
    this.$dirty = false;
    this.$pristine = true;
    $element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
  };

  /**
   * @ngdoc function
   * @name ng.directive:ngModel.NgModelController#$setViewValue
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * Read a value from view.
   *
   * This method should be called from within a DOM event handler.
   * For example {@link ng.directive:input input} or
   * {@link ng.directive:select select} directives call it.
   *
   * It internally calls all `$parsers` (including validators) and updates the `$modelValue` and the actual model path.
   * Lastly it calls all registered change listeners.
   *
   * @param {string} value Value from the view.
   */
  this.$setViewValue = function(value) {
    this.$viewValue = value;

    // change to dirty
    if (this.$pristine) {
      this.$dirty = true;
      this.$pristine = false;
      $element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
      parentForm.$setDirty();
    }

    forEach(this.$parsers, function(fn) {
      value = fn(value);
    });

    if (this.$modelValue !== value) {
      this.$modelValue = value;
      ngModelSet($scope, value);
      forEach(this.$viewChangeListeners, function(listener) {
        try {
          listener();
        } catch(e) {
          $exceptionHandler(e);
        }
      })
    }
  };

  // model -> value
  var ctrl = this;

  $scope.$watch(function ngModelWatch() {
    var value = ngModelGet($scope);

    // if scope model value and ngModel value are out of sync
    if (ctrl.$modelValue !== value) {

      var formatters = ctrl.$formatters,
          idx = formatters.length;

      ctrl.$modelValue = value;
      while(idx--) {
        value = formatters[idx](value);
      }

      if (ctrl.$viewValue !== value) {
        ctrl.$viewValue = value;
        ctrl.$render();
      }
    }
  });
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngModel
 *
 * @element input
 *
 * @description
 * Is a directive that tells Angular to do two-way data binding. It works together with `input`,
 * `select`, `textarea` and even custom form controls that use {@link ng.directive:ngModel.NgModelController
 * NgModelController} exposed by this directive.
 *
 * `ngModel` is responsible for:
 *
 * - binding the view into the model, which other directives such as `input`, `textarea` or `select`
 *   require,
 * - providing validation behavior (i.e. required, number, email, url),
 * - keeping state of the control (valid/invalid, dirty/pristine, validation errors),
 * - setting related css class onto the element (`ng-valid`, `ng-invalid`, `ng-dirty`, `ng-pristine`),
 * - register the control with parent {@link ng.directive:form form}.
 *
 * Note: `ngModel` will try to bind to the property given by evaluating the expression on the
 * current scope. If the property doesn't already exist on this scope, it will be created
 * implicitly and added to the scope.
 *
 * For best practices on using `ngModel`, see:
 *
 *  - {@link https://github.com/angular/angular.js/wiki/Understanding-Scopes}
 *
 * For basic examples, how to use `ngModel`, see:
 *
 *  - {@link ng.directive:input input}
 *    - {@link ng.directive:input.text text}
 *    - {@link ng.directive:input.checkbox checkbox}
 *    - {@link ng.directive:input.radio radio}
 *    - {@link ng.directive:input.number number}
 *    - {@link ng.directive:input.email email}
 *    - {@link ng.directive:input.url url}
 *  - {@link ng.directive:select select}
 *  - {@link ng.directive:textarea textarea}
 *
 */
var ngModelDirective = function() {
  return {
    require: ['ngModel', '^?form'],
    controller: NgModelController,
    link: function(scope, element, attr, ctrls) {
      // notify others, especially parent forms

      var modelCtrl = ctrls[0],
          formCtrl = ctrls[1] || nullFormCtrl;

      formCtrl.$addControl(modelCtrl);

      element.on('$destroy', function() {
        formCtrl.$removeControl(modelCtrl);
      });
    }
  };
};


/**
 * @ngdoc directive
 * @name ng.directive:ngChange
 *
 * @description
 * Evaluate given expression when user changes the input.
 * The expression is not evaluated when the value change is coming from the model.
 *
 * Note, this directive requires `ngModel` to be present.
 *
 * @element input
 * @param {expression} ngChange {@link guide/expression Expression} to evaluate upon change
 * in input value.
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *     <script>
 *       function Controller($scope) {
 *         $scope.counter = 0;
 *         $scope.change = function() {
 *           $scope.counter++;
 *         };
 *       }
 *     </script>
 *     <div ng-controller="Controller">
 *       <input type="checkbox" ng-model="confirmed" ng-change="change()" id="ng-change-example1" />
 *       <input type="checkbox" ng-model="confirmed" id="ng-change-example2" />
 *       <label for="ng-change-example2">Confirmed</label><br />
 *       debug = {{confirmed}}<br />
 *       counter = {{counter}}
 *     </div>
 *   </doc:source>
 *   <doc:scenario>
 *     it('should evaluate the expression if changing from view', function() {
 *       expect(binding('counter')).toEqual('0');
 *       element('#ng-change-example1').click();
 *       expect(binding('counter')).toEqual('1');
 *       expect(binding('confirmed')).toEqual('true');
 *     });
 *
 *     it('should not evaluate the expression if changing from model', function() {
 *       element('#ng-change-example2').click();
 *       expect(binding('counter')).toEqual('0');
 *       expect(binding('confirmed')).toEqual('true');
 *     });
 *   </doc:scenario>
 * </doc:example>
 */
var ngChangeDirective = valueFn({
  require: 'ngModel',
  link: function(scope, element, attr, ctrl) {
    ctrl.$viewChangeListeners.push(function() {
      scope.$eval(attr.ngChange);
    });
  }
});


var requiredDirective = function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;
      attr.required = true; // force truthy in case we are on non input element

      var validator = function(value) {
        if (attr.required && (isEmpty(value) || value === false)) {
          ctrl.$setValidity('required', false);
          return;
        } else {
          ctrl.$setValidity('required', true);
          return value;
        }
      };

      ctrl.$formatters.push(validator);
      ctrl.$parsers.unshift(validator);

      attr.$observe('required', function() {
        validator(ctrl.$viewValue);
      });
    }
  };
};


/**
 * @ngdoc directive
 * @name ng.directive:ngList
 *
 * @description
 * Text input that converts between comma-separated string into an array of strings.
 *
 * @element input
 * @param {string=} ngList optional delimiter that should be used to split the value. If
 *   specified in form `/something/` then the value will be converted into a regular expression.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.names = ['igor', 'misko', 'vojta'];
         }
       </script>
       <form name="myForm" ng-controller="Ctrl">
         List: <input name="namesInput" ng-model="names" ng-list required>
         <span class="error" ng-show="myForm.namesInput.$error.required">
           Required!</span>
         <br>
         <tt>names = {{names}}</tt><br/>
         <tt>myForm.namesInput.$valid = {{myForm.namesInput.$valid}}</tt><br/>
         <tt>myForm.namesInput.$error = {{myForm.namesInput.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('names')).toEqual('["igor","misko","vojta"]');
          expect(binding('myForm.namesInput.$valid')).toEqual('true');
          expect(element('span.error').css('display')).toBe('none');
        });

        it('should be invalid if empty', function() {
          input('names').enter('');
          expect(binding('names')).toEqual('[]');
          expect(binding('myForm.namesInput.$valid')).toEqual('false');
          expect(element('span.error').css('display')).not().toBe('none');
        });
      </doc:scenario>
    </doc:example>
 */
var ngListDirective = function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      var match = /\/(.*)\//.exec(attr.ngList),
          separator = match && new RegExp(match[1]) || attr.ngList || ',';

      var parse = function(viewValue) {
        var list = [];

        if (viewValue) {
          forEach(viewValue.split(separator), function(value) {
            if (value) list.push(trim(value));
          });
        }

        return list;
      };

      ctrl.$parsers.push(parse);
      ctrl.$formatters.push(function(value) {
        if (isArray(value)) {
          return value.join(', ');
        }

        return undefined;
      });
    }
  };
};


var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;

var ngValueDirective = function() {
  return {
    priority: 100,
    compile: function(tpl, tplAttr) {
      if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
        return function(scope, elm, attr) {
          attr.$set('value', scope.$eval(attr.ngValue));
        };
      } else {
        return function(scope, elm, attr) {
          scope.$watch(attr.ngValue, function valueWatchAction(value) {
            attr.$set('value', value);
          });
        };
      }
    }
  };
};

/**
 * @ngdoc directive
 * @name ng.directive:ngBind
 * @restrict AC
 *
 * @description
 * The `ngBind` attribute tells Angular to replace the text content of the specified HTML element
 * with the value of a given expression, and to update the text content when the value of that
 * expression changes.
 *
 * Typically, you don't use `ngBind` directly, but instead you use the double curly markup like
 * `{{ expression }}` which is similar but less verbose.
 *
 * It is preferrable to use `ngBind` instead of `{{ expression }}` when a template is momentarily 
 * displayed by the browser in its raw state before Angular compiles it. Since `ngBind` is an 
 * element attribute, it makes the bindings invisible to the user while the page is loading.
 *
 * An alternative solution to this problem would be using the
 * {@link ng.directive:ngCloak ngCloak} directive.
 *
 *
 * @element ANY
 * @param {expression} ngBind {@link guide/expression Expression} to evaluate.
 *
 * @example
 * Enter a name in the Live Preview text box; the greeting below the text box changes instantly.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.name = 'Whirled';
         }
       </script>
       <div ng-controller="Ctrl">
         Enter name: <input type="text" ng-model="name"><br>
         Hello <span ng-bind="name"></span>!
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng-bind', function() {
         expect(using('.doc-example-live').binding('name')).toBe('Whirled');
         using('.doc-example-live').input('name').enter('world');
         expect(using('.doc-example-live').binding('name')).toBe('world');
       });
     </doc:scenario>
   </doc:example>
 */
var ngBindDirective = ngDirective(function(scope, element, attr) {
  element.addClass('ng-binding').data('$binding', attr.ngBind);
  scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
    element.text(value == undefined ? '' : value);
  });
});


/**
 * @ngdoc directive
 * @name ng.directive:ngBindTemplate
 *
 * @description
 * The `ngBindTemplate` directive specifies that the element
 * text content should be replaced with the interpolation of the template
 * in the `ngBindTemplate` attribute.
 * Unlike `ngBind`, the `ngBindTemplate` can contain multiple `{{` `}}`
 * expressions. This directive is needed since some HTML elements
 * (such as TITLE and OPTION) cannot contain SPAN elements.
 *
 * @element ANY
 * @param {string} ngBindTemplate template of form
 *   <tt>{{</tt> <tt>expression</tt> <tt>}}</tt> to eval.
 *
 * @example
 * Try it here: enter text in text box and watch the greeting change.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.salutation = 'Hello';
           $scope.name = 'World';
         }
       </script>
       <div ng-controller="Ctrl">
        Salutation: <input type="text" ng-model="salutation"><br>
        Name: <input type="text" ng-model="name"><br>
        <pre ng-bind-template="{{salutation}} {{name}}!"></pre>
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng-bind', function() {
         expect(using('.doc-example-live').binding('salutation')).
           toBe('Hello');
         expect(using('.doc-example-live').binding('name')).
           toBe('World');
         using('.doc-example-live').input('salutation').enter('Greetings');
         using('.doc-example-live').input('name').enter('user');
         expect(using('.doc-example-live').binding('salutation')).
           toBe('Greetings');
         expect(using('.doc-example-live').binding('name')).
           toBe('user');
       });
     </doc:scenario>
   </doc:example>
 */
var ngBindTemplateDirective = ['$interpolate', function($interpolate) {
  return function(scope, element, attr) {
    // TODO: move this to scenario runner
    var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
    element.addClass('ng-binding').data('$binding', interpolateFn);
    attr.$observe('ngBindTemplate', function(value) {
      element.text(value);
    });
  }
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngBindHtml
 *
 * @description
 * Creates a binding that will innerHTML the result of evaluating the `expression` into the current
 * element in a secure way.  By default, the innerHTML-ed content will be sanitized using the {@link
 * ngSanitize.$sanitize $sanitize} service.  To utilize this functionality, ensure that `$sanitize`
 * is available, for example, by including {@link ngSanitize} in your module's dependencies (not in
 * core Angular.)  You may also bypass sanitization for values you know are safe. To do so, bind to
 * an explicitly trusted value via {@link ng.$sce#trustAsHtml $sce.trustAsHtml}.  See the example
 * under {@link ng.$sce#Example Strict Contextual Escaping (SCE)}.
 *
 * Note: If a `$sanitize` service is unavailable and the bound value isn't explicitly trusted, you
 * will have an exception (instead of an exploit.)
 *
 * @element ANY
 * @param {expression} ngBindHtml {@link guide/expression Expression} to evaluate.
 */
var ngBindHtmlDirective = ['$sce', '$parse', function($sce, $parse) {
  return function(scope, element, attr) {
    element.addClass('ng-binding').data('$binding', attr.ngBindHtml);

    var parsed = $parse(attr.ngBindHtml);
    function getStringValue() { return (parsed(scope) || '').toString(); }

    scope.$watch(getStringValue, function ngBindHtmlWatchAction(value) {
      element.html($sce.getTrustedHtml(parsed(scope)) || '');
    });
  };
}];

function classDirective(name, selector) {
  name = 'ngClass' + name;
  return function() {
    return {
      restrict: 'AC',
      link: function(scope, element, attr) {
        var oldVal = undefined;

        scope.$watch(attr[name], ngClassWatchAction, true);

        attr.$observe('class', function(value) {
          ngClassWatchAction(scope.$eval(attr[name]));
        });


        if (name !== 'ngClass') {
          scope.$watch('$index', function($index, old$index) {
            var mod = $index & 1;
            if (mod !== old$index & 1) {
              if (mod === selector) {
                addClass(scope.$eval(attr[name]));
              } else {
                removeClass(scope.$eval(attr[name]));
              }
            }
          });
        }


        function ngClassWatchAction(newVal) {
          if (selector === true || scope.$index % 2 === selector) {
            if (oldVal && !equals(newVal,oldVal)) {
              removeClass(oldVal);
            }
            addClass(newVal);
          }
          oldVal = copy(newVal);
        }


        function removeClass(classVal) {
          attr.$removeClass(flattenClasses(classVal));
        }


        function addClass(classVal) {
          attr.$addClass(flattenClasses(classVal));
        }

        function flattenClasses(classVal) {
          if(isArray(classVal)) {
            return classVal.join(' ');
          } else if (isObject(classVal)) {
            var classes = [], i = 0;
            forEach(classVal, function(v, k) {
              if (v) {
                classes.push(k);
              }
            });
            return classes.join(' ');
          }

          return classVal;
        };
      }
    };
  };
}

/**
 * @ngdoc directive
 * @name ng.directive:ngClass
 * @restrict AC
 *
 * @description
 * The `ngClass` allows you to set CSS classes on HTML an element, dynamically, by databinding
 * an expression that represents all classes to be added.
 *
 * The directive won't add duplicate classes if a particular class was already set.
 *
 * When the expression changes, the previously added classes are removed and only then the
 * new classes are added.
 *
 * @animations
 * add - happens just before the class is applied to the element
 * remove - happens just before the class is removed from the element
 *
 * @element ANY
 * @param {expression} ngClass {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class
 *   names, an array, or a map of class names to boolean values. In the case of a map, the
 *   names of the properties whose values are truthy will be added as css classes to the
 *   element.
 *
 * @example Example that demostrates basic bindings via ngClass directive.
   <example>
     <file name="index.html">
       <p ng-class="{strike: strike, bold: bold, red: red}">Map Syntax Example</p>
       <input type="checkbox" ng-model="bold"> bold
       <input type="checkbox" ng-model="strike"> strike
       <input type="checkbox" ng-model="red"> red
       <hr>
       <p ng-class="style">Using String Syntax</p>
       <input type="text" ng-model="style" placeholder="Type: bold strike red">
       <hr>
       <p ng-class="[style1, style2, style3]">Using Array Syntax</p>
       <input ng-model="style1" placeholder="Type: bold"><br>
       <input ng-model="style2" placeholder="Type: strike"><br>
       <input ng-model="style3" placeholder="Type: red"><br>
     </file>
     <file name="style.css">
       .strike {
         text-decoration: line-through;
       }
       .bold {
           font-weight: bold;
       }
       .red {
           color: red;
       }
     </file>
     <file name="scenario.js">
       it('should let you toggle the class', function() {

         expect(element('.doc-example-live p:first').prop('className')).not().toMatch(/bold/);
         expect(element('.doc-example-live p:first').prop('className')).not().toMatch(/red/);

         input('bold').check();
         expect(element('.doc-example-live p:first').prop('className')).toMatch(/bold/);

         input('red').check();
         expect(element('.doc-example-live p:first').prop('className')).toMatch(/red/);
       });

       it('should let you toggle string example', function() {
         expect(element('.doc-example-live p:nth-of-type(2)').prop('className')).toBe('');
         input('style').enter('red');
         expect(element('.doc-example-live p:nth-of-type(2)').prop('className')).toBe('red');
       });

       it('array example should have 3 classes', function() {
         expect(element('.doc-example-live p:last').prop('className')).toBe('');
         input('style1').enter('bold');
         input('style2').enter('strike');
         input('style3').enter('red');
         expect(element('.doc-example-live p:last').prop('className')).toBe('bold strike red');
       });
     </file>
   </example>

   ## Animations

   The example below demonstrates how to perform animations using ngClass.

   <example animations="true">
     <file name="index.html">
      <input type="button" value="set" ng-click="myVar='my-class'">
      <input type="button" value="clear" ng-click="myVar=''">
      <br>
      <span ng-class="myVar">Sample Text</span>
     </file>
     <file name="style.css">
       .my-class-add, .my-class-remove {
         -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
         -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
         -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
         transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
       }

       .my-class,
       .my-class-add.my-class-add-active {
         color: red;
         font-size:3em;
       }

       .my-class-remove.my-class-remove-active {
         font-size:1.0em;
         color:black;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class', function() {
         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/my-class/);

         using('.doc-example-live').element(':button:first').click();

         expect(element('.doc-example-live span').prop('className')).
           toMatch(/my-class/);

         using('.doc-example-live').element(':button:last').click();

         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/my-class/);
       });
     </file>
   </example>


   ## ngClass and pre-existing CSS3 Transitions/Animations
   The ngClass directive still supports CSS3 Transitions/Animations even if they do not follow the ngAnimate CSS naming structure.
   Therefore, if any CSS3 Transition/Animation styles (outside of ngAnimate) are set on the element, then, if a ngClass animation
   is triggered, the ngClass animation will be skipped so that ngAnimate can allow for the pre-existing transition or animation to
   take over. This restriction allows for ngClass to still work with standard CSS3 Transitions/Animations that are defined
   outside of ngAnimate.
 */
var ngClassDirective = classDirective('', true);

/**
 * @ngdoc directive
 * @name ng.directive:ngClassOdd
 * @restrict AC
 *
 * @description
 * The `ngClassOdd` and `ngClassEven` directives work exactly as
 * {@link ng.directive:ngClass ngClass}, except they work in
 * conjunction with `ngRepeat` and take effect only on odd (even) rows.
 *
 * This directive can be applied only within the scope of an
 * {@link ng.directive:ngRepeat ngRepeat}.
 *
 * @element ANY
 * @param {expression} ngClassOdd {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <example>
     <file name="index.html">
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}}
           </span>
          </li>
        </ol>
     </file>
     <file name="style.css">
       .odd {
         color: red;
       }
       .even {
         color: blue;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/odd/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/even/);
       });
     </file>
   </example>
 */
var ngClassOddDirective = classDirective('Odd', 0);

/**
 * @ngdoc directive
 * @name ng.directive:ngClassEven
 * @restrict AC
 *
 * @description
 * The `ngClassOdd` and `ngClassEven` directives work exactly as
 * {@link ng.directive:ngClass ngClass}, except they work in
 * conjunction with `ngRepeat` and take effect only on odd (even) rows.
 *
 * This directive can be applied only within the scope of an
 * {@link ng.directive:ngRepeat ngRepeat}.
 *
 * @element ANY
 * @param {expression} ngClassEven {@link guide/expression Expression} to eval. The
 *   result of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <example>
     <file name="index.html">
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}} &nbsp; &nbsp; &nbsp;
           </span>
          </li>
        </ol>
     </file>
     <file name="style.css">
       .odd {
         color: red;
       }
       .even {
         color: blue;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/odd/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/even/);
       });
     </file>
   </example>
 */
var ngClassEvenDirective = classDirective('Even', 1);

/**
 * @ngdoc directive
 * @name ng.directive:ngCloak
 * @restrict AC
 *
 * @description
 * The `ngCloak` directive is used to prevent the Angular html template from being briefly
 * displayed by the browser in its raw (uncompiled) form while your application is loading. Use this
 * directive to avoid the undesirable flicker effect caused by the html template display.
 *
 * The directive can be applied to the `<body>` element, but the preferred usage is to apply
 * multiple `ngCloak` directives to small portions of the page to permit progressive rendering
 * of the browser view.
 *
 * `ngCloak` works in cooperation with the following css rule embedded within `angular.js` and
 *  `angular.min.js`:
 *
 * <pre>
 * [ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
 *   display: none !important;
 * }
 * </pre>
 *
 * When this css rule is loaded by the browser, all html elements (including their children) that
 * are tagged with the `ngCloak` directive are hidden. When Angular encounters this directive
 * during the compilation of the template it deletes the `ngCloak` element attribute, making
 * the compiled element visible.
 *
 * For the best result, the `angular.js` script must be loaded in the head section of the html
 * document; alternatively, the css rule above must be included in the external stylesheet of the
 * application.
 *
 * Legacy browsers, like IE7, do not provide attribute selector support (added in CSS 2.1) so they
 * cannot match the `[ng\:cloak]` selector. To work around this limitation, you must add the css
 * class `ngCloak` in addition to the `ngCloak` directive as shown in the example below.
 *
 * @element ANY
 *
 * @example
   <doc:example>
     <doc:source>
        <div id="template1" ng-cloak>{{ 'hello' }}</div>
        <div id="template2" ng-cloak class="ng-cloak">{{ 'hello IE7' }}</div>
     </doc:source>
     <doc:scenario>
       it('should remove the template directive and css class', function() {
         expect(element('.doc-example-live #template1').attr('ng-cloak')).
           not().toBeDefined();
         expect(element('.doc-example-live #template2').attr('ng-cloak')).
           not().toBeDefined();
       });
     </doc:scenario>
   </doc:example>
 *
 */
var ngCloakDirective = ngDirective({
  compile: function(element, attr) {
    attr.$set('ngCloak', undefined);
    element.removeClass('ng-cloak');
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:ngController
 *
 * @description
 * The `ngController` directive attaches a controller class to the view. This is a key aspect of how angular
 * supports the principles behind the Model-View-Controller design pattern.
 *
 * MVC components in angular:
 *
 * * Model — The Model is scope properties; scopes are attached to the DOM where scope properties
 *   are accessed through bindings.
 * * View — The template (HTML with data bindings) that is rendered into the View.
 * * Controller — The `ngController` directive specifies a Controller class; the class contains business
 *   logic behind the application to decorate the scope with functions and values
 *
 * Note that an alternative way to define controllers is via the {@link ngRoute.$route $route} service.
 *
 * @element ANY
 * @scope
 * @param {expression} ngController Name of a globally accessible constructor function or an
 *     {@link guide/expression expression} that on the current scope evaluates to a
 *     constructor function. The controller instance can be published into a scope property
 *     by specifying `as propertyName`.
 *
 * @example
 * Here is a simple form for editing user contact information. Adding, removing, clearing, and
 * greeting are methods declared on the controller (see source tab). These methods can
 * easily be called from the angular markup. Notice that the scope becomes the `this` for the
 * controller's instance. This allows for easy access to the view data from the controller. Also
 * notice that any changes to the data are automatically reflected in the View without the need
 * for a manual update. The example is shown in two different declaration styles you may use
 * according to preference.
   <doc:example>
     <doc:source>
      <script>
        function SettingsController1() {
          this.name = "John Smith";
          this.contacts = [
            {type: 'phone', value: '408 555 1212'},
            {type: 'email', value: 'john.smith@example.org'} ];
          };

        SettingsController1.prototype.greet = function() {
          alert(this.name);
        };

        SettingsController1.prototype.addContact = function() {
          this.contacts.push({type: 'email', value: 'yourname@example.org'});
        };

        SettingsController1.prototype.removeContact = function(contactToRemove) {
         var index = this.contacts.indexOf(contactToRemove);
          this.contacts.splice(index, 1);
        };

        SettingsController1.prototype.clearContact = function(contact) {
          contact.type = 'phone';
          contact.value = '';
        };
      </script>
      <div id="ctrl-as-exmpl" ng-controller="SettingsController1 as settings">
        Name: <input type="text" ng-model="settings.name"/>
        [ <a href="" ng-click="settings.greet()">greet</a> ]<br/>
        Contact:
        <ul>
          <li ng-repeat="contact in settings.contacts">
            <select ng-model="contact.type">
               <option>phone</option>
               <option>email</option>
            </select>
            <input type="text" ng-model="contact.value"/>
            [ <a href="" ng-click="settings.clearContact(contact)">clear</a>
            | <a href="" ng-click="settings.removeContact(contact)">X</a> ]
          </li>
          <li>[ <a href="" ng-click="settings.addContact()">add</a> ]</li>
       </ul>
      </div>
     </doc:source>
     <doc:scenario>
       it('should check controller as', function() {
         expect(element('#ctrl-as-exmpl>:input').val()).toBe('John Smith');
         expect(element('#ctrl-as-exmpl li:nth-child(1) input').val())
           .toBe('408 555 1212');
         expect(element('#ctrl-as-exmpl li:nth-child(2) input').val())
           .toBe('john.smith@example.org');

         element('#ctrl-as-exmpl li:first a:contains("clear")').click();
         expect(element('#ctrl-as-exmpl li:first input').val()).toBe('');

         element('#ctrl-as-exmpl li:last a:contains("add")').click();
         expect(element('#ctrl-as-exmpl li:nth-child(3) input').val())
           .toBe('yourname@example.org');
       });
     </doc:scenario>
   </doc:example>
    <doc:example>
     <doc:source>
      <script>
        function SettingsController2($scope) {
          $scope.name = "John Smith";
          $scope.contacts = [
            {type:'phone', value:'408 555 1212'},
            {type:'email', value:'john.smith@example.org'} ];

          $scope.greet = function() {
           alert(this.name);
          };

          $scope.addContact = function() {
           this.contacts.push({type:'email', value:'yourname@example.org'});
          };

          $scope.removeContact = function(contactToRemove) {
           var index = this.contacts.indexOf(contactToRemove);
           this.contacts.splice(index, 1);
          };

          $scope.clearContact = function(contact) {
           contact.type = 'phone';
           contact.value = '';
          };
        }
      </script>
      <div id="ctrl-exmpl" ng-controller="SettingsController2">
        Name: <input type="text" ng-model="name"/>
        [ <a href="" ng-click="greet()">greet</a> ]<br/>
        Contact:
        <ul>
          <li ng-repeat="contact in contacts">
            <select ng-model="contact.type">
               <option>phone</option>
               <option>email</option>
            </select>
            <input type="text" ng-model="contact.value"/>
            [ <a href="" ng-click="clearContact(contact)">clear</a>
            | <a href="" ng-click="removeContact(contact)">X</a> ]
          </li>
          <li>[ <a href="" ng-click="addContact()">add</a> ]</li>
       </ul>
      </div>
     </doc:source>
     <doc:scenario>
       it('should check controller', function() {
         expect(element('#ctrl-exmpl>:input').val()).toBe('John Smith');
         expect(element('#ctrl-exmpl li:nth-child(1) input').val())
           .toBe('408 555 1212');
         expect(element('#ctrl-exmpl li:nth-child(2) input').val())
           .toBe('john.smith@example.org');

         element('#ctrl-exmpl li:first a:contains("clear")').click();
         expect(element('#ctrl-exmpl li:first input').val()).toBe('');

         element('#ctrl-exmpl li:last a:contains("add")').click();
         expect(element('#ctrl-exmpl li:nth-child(3) input').val())
           .toBe('yourname@example.org');
       });
     </doc:scenario>
   </doc:example>

 */
var ngControllerDirective = [function() {
  return {
    scope: true,
    controller: '@'
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngCsp
 * @priority 1000
 *
 * @element html
 * @description
 * Enables [CSP (Content Security Policy)](https://developer.mozilla.org/en/Security/CSP) support.
 * 
 * This is necessary when developing things like Google Chrome Extensions.
 * 
 * CSP forbids apps to use `eval` or `Function(string)` generated functions (among other things).
 * For us to be compatible, we just need to implement the "getterFn" in $parse without violating
 * any of these restrictions.
 * 
 * AngularJS uses `Function(string)` generated functions as a speed optimization. Applying the `ngCsp`
 * directive will cause Angular to use CSP compatibility mode. When this mode is on AngularJS will
 * evaluate all expressions up to 30% slower than in non-CSP mode, but no security violations will
 * be raised.
 * 
 * In order to use this feature put the `ngCsp` directive on the root element of the application.
 * 
 * @example
 * This example shows how to apply the `ngCsp` directive to the `html` tag.
   <pre>
     <!doctype html>
     <html ng-app ng-csp>
     ...
     ...
     </html>
   </pre>
 */

var ngCspDirective = ['$sniffer', function($sniffer) {
  return {
    priority: 1000,
    compile: function() {
      $sniffer.csp = true;
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngClick
 *
 * @description
 * The ngClick directive allows you to specify custom behavior when
 * an element is clicked.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate upon
 * click. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-click="count = count + 1" ng-init="count=0">
        Increment
      </button>
      count: {{count}}
     </doc:source>
     <doc:scenario>
       it('should check ng-click', function() {
         expect(binding('count')).toBe('0');
         element('.doc-example-live :button').click();
         expect(binding('count')).toBe('1');
       });
     </doc:scenario>
   </doc:example>
 */
/*
 * A directive that allows creation of custom onclick handlers that are defined as angular
 * expressions and are compiled and executed within the current scope.
 *
 * Events that are handled via these handler are always configured not to propagate further.
 */
var ngEventDirectives = {};
forEach(
  'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
  function(name) {
    var directiveName = directiveNormalize('ng-' + name);
    ngEventDirectives[directiveName] = ['$parse', function($parse) {
      return function(scope, element, attr) {
        var fn = $parse(attr[directiveName]);
        element.on(lowercase(name), function(event) {
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      };
    }];
  }
);

/**
 * @ngdoc directive
 * @name ng.directive:ngDblclick
 *
 * @description
 * The `ngDblclick` directive allows you to specify custom behavior on a dblclick event.
 *
 * @element ANY
 * @param {expression} ngDblclick {@link guide/expression Expression} to evaluate upon
 * a dblclick. (The Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMousedown
 *
 * @description
 * The ngMousedown directive allows you to specify custom behavior on mousedown event.
 *
 * @element ANY
 * @param {expression} ngMousedown {@link guide/expression Expression} to evaluate upon
 * mousedown. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseup
 *
 * @description
 * Specify custom behavior on mouseup event.
 *
 * @element ANY
 * @param {expression} ngMouseup {@link guide/expression Expression} to evaluate upon
 * mouseup. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngMouseover
 *
 * @description
 * Specify custom behavior on mouseover event.
 *
 * @element ANY
 * @param {expression} ngMouseover {@link guide/expression Expression} to evaluate upon
 * mouseover. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseenter
 *
 * @description
 * Specify custom behavior on mouseenter event.
 *
 * @element ANY
 * @param {expression} ngMouseenter {@link guide/expression Expression} to evaluate upon
 * mouseenter. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseleave
 *
 * @description
 * Specify custom behavior on mouseleave event.
 *
 * @element ANY
 * @param {expression} ngMouseleave {@link guide/expression Expression} to evaluate upon
 * mouseleave. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMousemove
 *
 * @description
 * Specify custom behavior on mousemove event.
 *
 * @element ANY
 * @param {expression} ngMousemove {@link guide/expression Expression} to evaluate upon
 * mousemove. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeydown
 *
 * @description
 * Specify custom behavior on keydown event.
 *
 * @element ANY
 * @param {expression} ngKeydown {@link guide/expression Expression} to evaluate upon
 * keydown. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeyup
 *
 * @description
 * Specify custom behavior on keyup event.
 *
 * @element ANY
 * @param {expression} ngKeyup {@link guide/expression Expression} to evaluate upon
 * keyup. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeypress
 *
 * @description
 * Specify custom behavior on keypress event.
 *
 * @element ANY
 * @param {expression} ngKeypress {@link guide/expression Expression} to evaluate upon
 * keypress. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngSubmit
 *
 * @description
 * Enables binding angular expressions to onsubmit events.
 *
 * Additionally it prevents the default action (which for form means sending the request to the
 * server and reloading the current page) **but only if the form does not contain an `action`
 * attribute**.
 *
 * @element form
 * @param {expression} ngSubmit {@link guide/expression Expression} to eval. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <script>
        function Ctrl($scope) {
          $scope.list = [];
          $scope.text = 'hello';
          $scope.submit = function() {
            if (this.text) {
              this.list.push(this.text);
              this.text = '';
            }
          };
        }
      </script>
      <form ng-submit="submit()" ng-controller="Ctrl">
        Enter text and hit enter:
        <input type="text" ng-model="text" name="text" />
        <input type="submit" id="submit" value="Submit" />
        <pre>list={{list}}</pre>
      </form>
     </doc:source>
     <doc:scenario>
       it('should check ng-submit', function() {
         expect(binding('list')).toBe('[]');
         element('.doc-example-live #submit').click();
         expect(binding('list')).toBe('["hello"]');
         expect(input('text').val()).toBe('');
       });
       it('should ignore empty strings', function() {
         expect(binding('list')).toBe('[]');
         element('.doc-example-live #submit').click();
         element('.doc-example-live #submit').click();
         expect(binding('list')).toBe('["hello"]');
       });
     </doc:scenario>
   </doc:example>
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngFocus
 *
 * @description
 * Specify custom behavior on focus event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngFocus {@link guide/expression Expression} to evaluate upon
 * focus. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngBlur
 *
 * @description
 * Specify custom behavior on blur event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngBlur {@link guide/expression Expression} to evaluate upon
 * blur. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngCopy
 *
 * @description
 * Specify custom behavior on copy event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngCopy {@link guide/expression Expression} to evaluate upon
 * copy. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngCut
 *
 * @description
 * Specify custom behavior on cut event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngCut {@link guide/expression Expression} to evaluate upon
 * cut. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngPaste
 *
 * @description
 * Specify custom behavior on paste event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngPaste {@link guide/expression Expression} to evaluate upon
 * paste. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngIf
 * @restrict A
 *
 * @description
 * The `ngIf` directive removes or recreates a portion of the DOM tree based on an
 * {expression}. If the expression assigned to `ngIf` evaluates to a false
 * value then the element is removed from the DOM, otherwise a clone of the
 * element is reinserted into the DOM.
 *
 * `ngIf` differs from `ngShow` and `ngHide` in that `ngIf` completely removes and recreates the
 * element in the DOM rather than changing its visibility via the `display` css property.  A common
 * case when this difference is significant is when using css selectors that rely on an element's
 * position within the DOM, such as the `:first-child` or `:last-child` pseudo-classes.
 *
 * Note that when an element is removed using `ngIf` its scope is destroyed and a new scope
 * is created when the element is restored.  The scope created within `ngIf` inherits from 
 * its parent scope using
 * {@link https://github.com/angular/angular.js/wiki/The-Nuances-of-Scope-Prototypal-Inheritance prototypal inheritance}.
 * An important implication of this is if `ngModel` is used within `ngIf` to bind to
 * a javascript primitive defined in the parent scope. In this case any modifications made to the
 * variable within the child scope will override (hide) the value in the parent scope.
 *
 * Also, `ngIf` recreates elements using their compiled state. An example of this behavior
 * is if an element's class attribute is directly modified after it's compiled, using something like 
 * jQuery's `.addClass()` method, and the element is later removed. When `ngIf` recreates the element
 * the added class will be lost because the original compiled state is used to regenerate the element.
 *
 * Additionally, you can provide animations via the `ngAnimate` module to animate the `enter`
 * and `leave` effects.
 *
 * @animations
 * enter - happens just after the ngIf contents change and a new DOM element is created and injected into the ngIf container
 * leave - happens just before the ngIf contents are removed from the DOM
 *
 * @element ANY
 * @scope
 * @param {expression} ngIf If the {@link guide/expression expression} is falsy then
 *     the element is removed from the DOM tree. If it is truthy a copy of the compiled
 *     eleent is added to the DOM tree.
 *
 * @example
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked" ng-init="checked=true" /><br/>
      Show when checked:
      <span ng-if="checked" class="animate-if">
        I'm removed when the checkbox is unchecked.
      </span>
    </file>
    <file name="animations.css">
      .animate-if {
        background:white;
        border:1px solid black;
        padding:10px;
      }

      .animate-if.ng-enter, .animate-if.ng-leave {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
      }

      .animate-if.ng-enter,
      .animate-if.ng-leave.ng-leave-active {
        opacity:0;
      }

      .animate-if.ng-enter.ng-enter-active,
      .animate-if.ng-leave {
        opacity:1;
      }
    </file>
  </example>
 */
var ngIfDirective = ['$animate', function($animate) {
  return {
    transclude: 'element',
    priority: 1000,
    terminal: true,
    restrict: 'A',
    compile: function (element, attr, transclude) {
      return function ($scope, $element, $attr) {
        var childElement, childScope;
        $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
          if (childElement) {
            $animate.leave(childElement);
            childElement = undefined;
          }
          if (childScope) {
            childScope.$destroy();
            childScope = undefined;
          }
          if (toBoolean(value)) {
            childScope = $scope.$new();
            transclude(childScope, function (clone) {
              childElement = clone;
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        });
      }
    }
  }
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngInclude
 * @restrict ECA
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * Keep in mind that:
 *
 * -    by default, the template URL is restricted to the same domain and protocol as the
 *      application document.  This is done by calling {@link ng.$sce#getTrustedResourceUrl
 *      $sce.getTrustedResourceUrl} on it.  To load templates from other domains and/or protocols,
 *      you may either either {@link ng.$sceDelegateProvider#resourceUrlWhitelist whitelist them} or
 *      {@link ng.$sce#trustAsResourceUrl wrap it} into a trusted value.  Refer Angular's {@link
 *      ng.$sce Strict Contextual Escaping}.
 * -    in addition, the browser's
 *      {@link https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest
 *      Same Origin Policy} and {@link http://www.w3.org/TR/cors/ Cross-Origin Resource Sharing
 *      (CORS)} policy apply that may further restrict whether the template is successfully loaded.
 *      (e.g.  ngInclude won't work for cross-domain requests on all browsers and for `file://`
 *      access on some browsers)
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 *
 * @param {string} ngInclude|src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @param {string=} autoscroll Whether `ngInclude` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the content is loaded.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the expression evaluates to truthy value.
 *
 * @example
  <example animations="true">
    <file name="index.html">
     <div ng-controller="Ctrl">
       <select ng-model="template" ng-options="t.name for t in templates">
        <option value="">(blank)</option>
       </select>
       url of the template: <tt>{{template.url}}</tt>
       <hr/>
       <div class="example-animate-container">
         <div class="include-example" ng-include="template.url"></div>
       </div>
     </div>
    </file>
    <file name="script.js">
      function Ctrl($scope) {
        $scope.templates =
          [ { name: 'template1.html', url: 'template1.html'}
          , { name: 'template2.html', url: 'template2.html'} ];
        $scope.template = $scope.templates[0];
      }
     </file>
    <file name="template1.html">
      Content of template1.html
    </file>
    <file name="template2.html">
      Content of template2.html
    </file>
    <file name="animations.css">
      .example-animate-container {
        position:relative;
        background:white;
        border:1px solid black;
        height:40px;
        overflow:hidden;
      }

      .example-animate-container > div {
        padding:10px;
      }

      .include-example.ng-enter, .include-example.ng-leave {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        display:block;
        padding:10px;
      }

      .include-example.ng-enter {
        top:-50px;
      }
      .include-example.ng-enter.ng-enter-active {
        top:0;
      }

      .include-example.ng-leave {
        top:0;
      }
      .include-example.ng-leave.ng-leave-active {
        top:50px;
      }
    </file>
    <file name="scenario.js">
      it('should load template1.html', function() {
       expect(element('.doc-example-live [ng-include]').text()).
         toMatch(/Content of template1.html/);
      });
      it('should load template2.html', function() {
       select('template').option('1');
       expect(element('.doc-example-live [ng-include]').text()).
         toMatch(/Content of template2.html/);
      });
      it('should change to blank', function() {
       select('template').option('');
       expect(element('.doc-example-live [ng-include]')).toBe(undefined);
      });
    </file>
  </example>
 */


/**
 * @ngdoc event
 * @name ng.directive:ngInclude#$includeContentRequested
 * @eventOf ng.directive:ngInclude
 * @eventType emit on the scope ngInclude was declared in
 * @description
 * Emitted every time the ngInclude content is requested.
 */


/**
 * @ngdoc event
 * @name ng.directive:ngInclude#$includeContentLoaded
 * @eventOf ng.directive:ngInclude
 * @eventType emit on the current ngInclude scope
 * @description
 * Emitted every time the ngInclude content is reloaded.
 */
var ngIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$compile', '$animate', '$sce',
                  function($http,   $templateCache,   $anchorScroll,   $compile,   $animate,   $sce) {
  return {
    restrict: 'ECA',
    priority: 1000,
    terminal: true,
    transclude: 'element',
    compile: function(element, attr, transclusion) {
      var srcExp = attr.ngInclude || attr.src,
          onloadExp = attr.onload || '',
          autoScrollExp = attr.autoscroll;

      return function(scope, $element) {
        var changeCounter = 0,
            currentScope,
            currentElement;

        var cleanupLastIncludeContent = function() {
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement);
            currentElement = null;
          }
        };

        scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
          var thisChangeId = ++changeCounter;

          if (src) {
            $http.get(src, {cache: $templateCache}).success(function(response) {
              if (thisChangeId !== changeCounter) return;
              var newScope = scope.$new();

              transclusion(newScope, function(clone) {
                cleanupLastIncludeContent();

                currentScope = newScope;
                currentElement = clone;

                currentElement.html(response);
                $animate.enter(currentElement, null, $element);
                $compile(currentElement.contents())(currentScope);

                if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }

                currentScope.$emit('$includeContentLoaded');
                scope.$eval(onloadExp);
              });
            }).error(function() {
              if (thisChangeId === changeCounter) cleanupLastIncludeContent();
            });
            scope.$emit('$includeContentRequested');
          } else {
            cleanupLastIncludeContent();
          }
        });
      };
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngInit
 * @restrict AC
 *
 * @description
 * The `ngInit` directive specifies initialization tasks to be executed
 *  before the template enters execution mode during bootstrap.
 *
 * @element ANY
 * @param {expression} ngInit {@link guide/expression Expression} to eval.
 *
 * @example
   <doc:example>
     <doc:source>
    <div ng-init="greeting='Hello'; person='World'">
      {{greeting}} {{person}}!
    </div>
     </doc:source>
     <doc:scenario>
       it('should check greeting', function() {
         expect(binding('greeting')).toBe('Hello');
         expect(binding('person')).toBe('World');
       });
     </doc:scenario>
   </doc:example>
 */
var ngInitDirective = ngDirective({
  compile: function() {
    return {
      pre: function(scope, element, attrs) {
        scope.$eval(attrs.ngInit);
      }
    }
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:ngNonBindable
 * @restrict AC
 * @priority 1000
 *
 * @description
 * Sometimes it is necessary to write code which looks like bindings but which should be left alone
 * by angular. Use `ngNonBindable` to make angular ignore a chunk of HTML.
 *
 * @element ANY
 *
 * @example
 * In this example there are two location where a simple binding (`{{}}`) is present, but the one
 * wrapped in `ngNonBindable` is left alone.
 *
 * @example
    <doc:example>
      <doc:source>
        <div>Normal: {{1 + 2}}</div>
        <div ng-non-bindable>Ignored: {{1 + 2}}</div>
      </doc:source>
      <doc:scenario>
       it('should check ng-non-bindable', function() {
         expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
         expect(using('.doc-example-live').element('div:last').text()).
           toMatch(/1 \+ 2/);
       });
      </doc:scenario>
    </doc:example>
 */
var ngNonBindableDirective = ngDirective({ terminal: true, priority: 1000 });

/**
 * @ngdoc directive
 * @name ng.directive:ngPluralize
 * @restrict EA
 *
 * @description
 * # Overview
 * `ngPluralize` is a directive that displays messages according to en-US localization rules.
 * These rules are bundled with angular.js, but can be overridden
 * (see {@link guide/i18n Angular i18n} dev guide). You configure ngPluralize directive
 * by specifying the mappings between
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 * plural categories} and the strings to be displayed.
 *
 * # Plural categories and explicit number rules
 * There are two
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 * plural categories} in Angular's default en-US locale: "one" and "other".
 *
 * While a plural category may match many numbers (for example, in en-US locale, "other" can match
 * any number that is not 1), an explicit number rule can only match one number. For example, the
 * explicit number rule for "3" matches the number 3. There are examples of plural categories
 * and explicit number rules throughout the rest of this documentation.
 *
 * # Configuring ngPluralize
 * You configure ngPluralize by providing 2 attributes: `count` and `when`.
 * You can also provide an optional attribute, `offset`.
 *
 * The value of the `count` attribute can be either a string or an {@link guide/expression
 * Angular expression}; these are evaluated on the current scope for its bound value.
 *
 * The `when` attribute specifies the mappings between plural categories and the actual
 * string to be displayed. The value of the attribute should be a JSON object.
 *
 * The following example shows how to configure ngPluralize:
 *
 * <pre>
 * <ng-pluralize count="personCount"
                 when="{'0': 'Nobody is viewing.',
 *                      'one': '1 person is viewing.',
 *                      'other': '{} people are viewing.'}">
 * </ng-pluralize>
 *</pre>
 *
 * In the example, `"0: Nobody is viewing."` is an explicit number rule. If you did not
 * specify this rule, 0 would be matched to the "other" category and "0 people are viewing"
 * would be shown instead of "Nobody is viewing". You can specify an explicit number rule for
 * other numbers, for example 12, so that instead of showing "12 people are viewing", you can
 * show "a dozen people are viewing".
 *
 * You can use a set of closed braces(`{}`) as a placeholder for the number that you want substituted
 * into pluralized strings. In the previous example, Angular will replace `{}` with
 * <span ng-non-bindable>`{{personCount}}`</span>. The closed braces `{}` is a placeholder
 * for <span ng-non-bindable>{{numberExpression}}</span>.
 *
 * # Configuring ngPluralize with offset
 * The `offset` attribute allows further customization of pluralized text, which can result in
 * a better user experience. For example, instead of the message "4 people are viewing this document",
 * you might display "John, Kate and 2 others are viewing this document".
 * The offset attribute allows you to offset a number by any desired value.
 * Let's take a look at an example:
 *
 * <pre>
 * <ng-pluralize count="personCount" offset=2
 *               when="{'0': 'Nobody is viewing.',
 *                      '1': '{{person1}} is viewing.',
 *                      '2': '{{person1}} and {{person2}} are viewing.',
 *                      'one': '{{person1}}, {{person2}} and one other person are viewing.',
 *                      'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
 * </ng-pluralize>
 * </pre>
 *
 * Notice that we are still using two plural categories(one, other), but we added
 * three explicit number rules 0, 1 and 2.
 * When one person, perhaps John, views the document, "John is viewing" will be shown.
 * When three people view the document, no explicit number rule is found, so
 * an offset of 2 is taken off 3, and Angular uses 1 to decide the plural category.
 * In this case, plural category 'one' is matched and "John, Marry and one other person are viewing"
 * is shown.
 *
 * Note that when you specify offsets, you must provide explicit number rules for
 * numbers from 0 up to and including the offset. If you use an offset of 3, for example,
 * you must provide explicit number rules for 0, 1, 2 and 3. You must also provide plural strings for
 * plural categories "one" and "other".
 *
 * @param {string|expression} count The variable to be bounded to.
 * @param {string} when The mapping between plural category to its corresponding strings.
 * @param {number=} offset Offset to deduct from the total number.
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
          function Ctrl($scope) {
            $scope.person1 = 'Igor';
            $scope.person2 = 'Misko';
            $scope.personCount = 1;
          }
        </script>
        <div ng-controller="Ctrl">
          Person 1:<input type="text" ng-model="person1" value="Igor" /><br/>
          Person 2:<input type="text" ng-model="person2" value="Misko" /><br/>
          Number of People:<input type="text" ng-model="personCount" value="1" /><br/>

          <!--- Example with simple pluralization rules for en locale --->
          Without Offset:
          <ng-pluralize count="personCount"
                        when="{'0': 'Nobody is viewing.',
                               'one': '1 person is viewing.',
                               'other': '{} people are viewing.'}">
          </ng-pluralize><br>

          <!--- Example with offset --->
          With Offset(2):
          <ng-pluralize count="personCount" offset=2
                        when="{'0': 'Nobody is viewing.',
                               '1': '{{person1}} is viewing.',
                               '2': '{{person1}} and {{person2}} are viewing.',
                               'one': '{{person1}}, {{person2}} and one other person are viewing.',
                               'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
          </ng-pluralize>
        </div>
      </doc:source>
      <doc:scenario>
        it('should show correct pluralized string', function() {
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                             toBe('1 person is viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                                                toBe('Igor is viewing.');

          using('.doc-example-live').input('personCount').enter('0');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                               toBe('Nobody is viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                                              toBe('Nobody is viewing.');

          using('.doc-example-live').input('personCount').enter('2');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('2 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor and Misko are viewing.');

          using('.doc-example-live').input('personCount').enter('3');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('3 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor, Misko and one other person are viewing.');

          using('.doc-example-live').input('personCount').enter('4');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('4 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor, Misko and 2 other people are viewing.');
        });

        it('should show data-binded names', function() {
          using('.doc-example-live').input('personCount').enter('4');
          expect(element('.doc-example-live ng-pluralize:last').text()).
              toBe('Igor, Misko and 2 other people are viewing.');

          using('.doc-example-live').input('person1').enter('Di');
          using('.doc-example-live').input('person2').enter('Vojta');
          expect(element('.doc-example-live ng-pluralize:last').text()).
              toBe('Di, Vojta and 2 other people are viewing.');
        });
      </doc:scenario>
    </doc:example>
 */
var ngPluralizeDirective = ['$locale', '$interpolate', function($locale, $interpolate) {
  var BRACE = /{}/g;
  return {
    restrict: 'EA',
    link: function(scope, element, attr) {
      var numberExp = attr.count,
          whenExp = attr.$attr.when && element.attr(attr.$attr.when), // we have {{}} in attrs
          offset = attr.offset || 0,
          whens = scope.$eval(whenExp) || {},
          whensExpFns = {},
          startSymbol = $interpolate.startSymbol(),
          endSymbol = $interpolate.endSymbol(),
          isWhen = /^when(Minus)?(.+)$/;

      forEach(attr, function(expression, attributeName) {
        if (isWhen.test(attributeName)) {
          whens[lowercase(attributeName.replace('when', '').replace('Minus', '-'))] =
            element.attr(attr.$attr[attributeName]);
        }
      });
      forEach(whens, function(expression, key) {
        whensExpFns[key] =
          $interpolate(expression.replace(BRACE, startSymbol + numberExp + '-' +
            offset + endSymbol));
      });

      scope.$watch(function ngPluralizeWatch() {
        var value = parseFloat(scope.$eval(numberExp));

        if (!isNaN(value)) {
          //if explicit number rule such as 1, 2, 3... is defined, just use it. Otherwise,
          //check it against pluralization rules in $locale service
          if (!(value in whens)) value = $locale.pluralCat(value - offset);
           return whensExpFns[value](scope, element, true);
        } else {
          return '';
        }
      }, function ngPluralizeWatchAction(newVal) {
        element.text(newVal);
      });
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngRepeat
 *
 * @description
 * The `ngRepeat` directive instantiates a template once per item from a collection. Each template
 * instance gets its own scope, where the given loop variable is set to the current collection item,
 * and `$index` is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 * | Variable  | Type            | Details                                                                     |
 * |-----------|-----------------|-----------------------------------------------------------------------------|
 * | `$index`  | {@type number}  | iterator offset of the repeated element (0..length-1)                       |
 * | `$first`  | {@type boolean} | true if the repeated element is first in the iterator.                      |
 * | `$middle` | {@type boolean} | true if the repeated element is between the first and last in the iterator. |
 * | `$last`   | {@type boolean} | true if the repeated element is last in the iterator.                       |
 * | `$even`   | {@type boolean} | true if the iterator position `$index` is even (otherwise false).           |
 * | `$odd`    | {@type boolean} | true if the iterator position `$index` is odd (otherwise false).            |
 *
 *
 * # Special repeat start and end points
 * To repeat a series of elements instead of just one parent element, ngRepeat (as well as other ng directives) supports extending
 * the range of the repeater by defining explicit start and end points by using **ng-repeat-start** and **ng-repeat-end** respectively.
 * The **ng-repeat-start** directive works the same as **ng-repeat**, but will repeat all the HTML code (including the tag it's defined on)
 * up to and including the ending HTML tag where **ng-repeat-end** is placed.
 *
 * The example below makes use of this feature:
 * <pre>
 *   <header ng-repeat-start="item in items">
 *     Header {{ item }}
 *   </header>
 *   <div class="body">
 *     Body {{ item }}
 *   </div>
 *   <footer ng-repeat-end>
 *     Footer {{ item }}
 *   </footer>
 * </pre>
 *
 * And with an input of {@type ['A','B']} for the items variable in the example above, the output will evaluate to:
 * <pre>
 *   <header>
 *     Header A
 *   </header>
 *   <div class="body">
 *     Body A
 *   </div>
 *   <footer>
 *     Footer A
 *   </footer>
 *   <header>
 *     Header B
 *   </header>
 *   <div class="body">
 *     Body B
 *   </div>
 *   <footer>
 *     Footer B
 *   </footer>
 * </pre>
 *
 * The custom start and end points for ngRepeat also support all other HTML directive syntax flavors provided in AngularJS (such
 * as **data-ng-repeat-start**, **x-ng-repeat-start** and **ng:repeat-start**).
 *
 * @animations
 * enter - when a new item is added to the list or when an item is revealed after a filter
 * leave - when an item is removed from the list or when an item is filtered out
 * move - when an adjacent item is filtered out causing a reorder or when the item contents are reordered
 *
 * @element ANY
 * @scope
 * @priority 1000
 * @param {repeat_expression} ngRepeat The expression indicating how to enumerate a collection. These
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `album in artist.albums`.
 *
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 *   * `variable in expression track by tracking_expression` – You can also provide an optional tracking function
 *     which can be used to associate the objects in the collection with the DOM elements. If no tracking function
 *     is specified the ng-repeat associates elements by identity in the collection. It is an error to have
 *     more than one tracking function to resolve to the same key. (This would mean that two distinct objects are
 *     mapped to the same DOM element, which is not possible.)  Filters should be applied to the expression,
 *     before specifying a tracking expression.
 *
 *     For example: `item in items` is equivalent to `item in items track by $id(item)'. This implies that the DOM elements
 *     will be associated by item identity in the array.
 *
 *     For example: `item in items track by $id(item)`. A built in `$id()` function can be used to assign a unique
 *     `$$hashKey` property to each item in the array. This property is then used as a key to associated DOM elements
 *     with the corresponding item in the array by identity. Moving the same object in array would move the DOM
 *     element in the same way ian the DOM.
 *
 *     For example: `item in items track by item.id` is a typical pattern when the items come from the database. In this
 *     case the object identity does not matter. Two objects are considered equivalent as long as their `id`
 *     property is same.
 *
 *     For example: `item in items | filter:searchText track by item.id` is a pattern that might be used to apply a filter
 *     to items in conjunction with a tracking expression.
 *
 * @example
 * This example initializes the scope to a list of names and
 * then uses `ngRepeat` to display every person:
  <example animations="true">
    <file name="index.html">
      <div ng-init="friends = [
        {name:'John', age:25, gender:'boy'},
        {name:'Jessie', age:30, gender:'girl'},
        {name:'Johanna', age:28, gender:'girl'},
        {name:'Joy', age:15, gender:'girl'},
        {name:'Mary', age:28, gender:'girl'},
        {name:'Peter', age:95, gender:'boy'},
        {name:'Sebastian', age:50, gender:'boy'},
        {name:'Erika', age:27, gender:'girl'},
        {name:'Patrick', age:40, gender:'boy'},
        {name:'Samantha', age:60, gender:'girl'}
      ]">
        I have {{friends.length}} friends. They are:
        <input type="search" ng-model="q" placeholder="filter friends..." />
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends | filter:q">
            [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
          </li>
        </ul>
      </div>
    </file>
    <file name="animations.css">
      .example-animate-container {
        background:white;
        border:1px solid black;
        list-style:none;
        margin:0;
        padding:0;
      }

      .example-animate-container > li {
        padding:10px;
        list-style:none;
      }

      .animate-repeat.ng-enter,
      .animate-repeat.ng-leave,
      .animate-repeat.ng-move {
        -webkit-transition:all linear 0.5s;
        -moz-transition:all linear 0.5s;
        -o-transition:all linear 0.5s;
        transition:all linear 0.5s;
      }

      .animate-repeat.ng-enter {
        line-height:0;
        opacity:0;
        padding-top:0;
        padding-bottom:0;
      }
      .animate-repeat.ng-enter.ng-enter-active {
        line-height:20px;
        opacity:1;
        padding:10px;
      }

      .animate-repeat.ng-leave {
        opacity:1;
        line-height:20px;
        padding:10px;
      }
      .animate-repeat.ng-leave.ng-leave-active {
        opacity:0;
        line-height:0;
        padding-top:0;
        padding-bottom:0;
      }

      .animate-repeat.ng-move { }
      .animate-repeat.ng-move.ng-move-active { }
    </file>
    <file name="scenario.js">
       it('should render initial data set', function() {
         var r = using('.doc-example-live').repeater('ul li');
         expect(r.count()).toBe(10);
         expect(r.row(0)).toEqual(["1","John","25"]);
         expect(r.row(1)).toEqual(["2","Jessie","30"]);
         expect(r.row(9)).toEqual(["10","Samantha","60"]);
         expect(binding('friends.length')).toBe("10");
       });

       it('should update repeater when filter predicate changes', function() {
         var r = using('.doc-example-live').repeater('ul li');
         expect(r.count()).toBe(10);

         input('q').enter('ma');

         expect(r.count()).toBe(2);
         expect(r.row(0)).toEqual(["1","Mary","28"]);
         expect(r.row(1)).toEqual(["2","Samantha","60"]);
       });
      </file>
    </example>
 */
var ngRepeatDirective = ['$parse', '$animate', function($parse, $animate) {
  var NG_REMOVED = '$$NG_REMOVED';
  var ngRepeatMinErr = minErr('ngRepeat');
  return {
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function(element, attr, linker) {
      return function($scope, $element, $attr){
        var expression = $attr.ngRepeat;
        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),
          trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn,
          lhs, rhs, valueIdentifier, keyIdentifier,
          hashFnLocals = {$id: hashKey};

        if (!match) {
          throw ngRepeatMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
            expression);
        }

        lhs = match[1];
        rhs = match[2];
        trackByExp = match[4];

        if (trackByExp) {
          trackByExpGetter = $parse(trackByExp);
          trackByIdExpFn = function(key, value, index) {
            // assign key, value, and $index to the locals so that they can be used in hash functions
            if (keyIdentifier) hashFnLocals[keyIdentifier] = key;
            hashFnLocals[valueIdentifier] = value;
            hashFnLocals.$index = index;
            return trackByExpGetter($scope, hashFnLocals);
          };
        } else {
          trackByIdArrayFn = function(key, value) {
            return hashKey(value);
          }
          trackByIdObjFn = function(key) {
            return key;
          }
        }

        match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
        if (!match) {
          throw ngRepeatMinErr('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.",
                                                                    lhs);
        }
        valueIdentifier = match[3] || match[1];
        keyIdentifier = match[2];

        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is objects with following properties.
        //   - scope: bound scope
        //   - element: previous element.
        //   - index: position
        var lastBlockMap = {};

        //watch props
        $scope.$watchCollection(rhs, function ngRepeatAction(collection){
          var index, length,
              previousNode = $element[0],     // current position of the node
              nextNode,
              // Same as lastBlockMap but it has the current state. It will become the
              // lastBlockMap on the next iteration.
              nextBlockMap = {},
              arrayLength,
              childScope,
              key, value, // key/value of iteration
              trackById,
              trackByIdFn,
              collectionKeys,
              block,       // last object information {scope, element, id}
              nextBlockOrder = [];


          if (isArrayLike(collection)) {
            collectionKeys = collection;
            trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
          } else {
            trackByIdFn = trackByIdExpFn || trackByIdObjFn;
            // if object, extract keys, sort them and use to determine order of iteration over obj props
            collectionKeys = [];
            for (key in collection) {
              if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                collectionKeys.push(key);
              }
            }
            collectionKeys.sort();
          }

          arrayLength = collectionKeys.length;

          // locate existing items
          length = nextBlockOrder.length = collectionKeys.length;
          for(index = 0; index < length; index++) {
           key = (collection === collectionKeys) ? index : collectionKeys[index];
           value = collection[key];
           trackById = trackByIdFn(key, value, index);
           if(lastBlockMap.hasOwnProperty(trackById)) {
             block = lastBlockMap[trackById]
             delete lastBlockMap[trackById];
             nextBlockMap[trackById] = block;
             nextBlockOrder[index] = block;
           } else if (nextBlockMap.hasOwnProperty(trackById)) {
             // restore lastBlockMap
             forEach(nextBlockOrder, function(block) {
               if (block && block.startNode) lastBlockMap[block.id] = block;
             });
             // This is a duplicate and we need to throw an error
             throw ngRepeatMinErr('dupes', "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}",
                                                                                                                                                    expression,       trackById);
           } else {
             // new never before seen block
             nextBlockOrder[index] = { id: trackById };
             nextBlockMap[trackById] = false;
           }
         }

          // remove existing items
          for (key in lastBlockMap) {
            if (lastBlockMap.hasOwnProperty(key)) {
              block = lastBlockMap[key];
              $animate.leave(block.elements);
              forEach(block.elements, function(element) { element[NG_REMOVED] = true});
              block.scope.$destroy();
            }
          }

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0, length = collectionKeys.length; index < length; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            block = nextBlockOrder[index];

            if (block.startNode) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element
              childScope = block.scope;

              nextNode = previousNode;
              do {
                nextNode = nextNode.nextSibling;
              } while(nextNode && nextNode[NG_REMOVED]);

              if (block.startNode == nextNode) {
                // do nothing
              } else {
                // existing item which got moved
                $animate.move(block.elements, null, jqLite(previousNode));
              }
              previousNode = block.endNode;
            } else {
              // new item which we don't know about
              childScope = $scope.$new();
            }

            childScope[valueIdentifier] = value;
            if (keyIdentifier) childScope[keyIdentifier] = key;
            childScope.$index = index;
            childScope.$first = (index === 0);
            childScope.$last = (index === (arrayLength - 1));
            childScope.$middle = !(childScope.$first || childScope.$last);
            childScope.$odd = !(childScope.$even = index%2==0);

            if (!block.startNode) {
              linker(childScope, function(clone) {
                $animate.enter(clone, null, jqLite(previousNode));
                previousNode = clone;
                block.scope = childScope;
                block.startNode = clone[0];
                block.elements = clone;
                block.endNode = clone[clone.length - 1];
                nextBlockMap[block.id] = block;
              });
            }
          }
          lastBlockMap = nextBlockMap;
        });
      };
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngShow
 *
 * @description
 * The `ngShow` directive shows or hides the given HTML element based on the expression
 * provided to the ngShow attribute. The element is shown or hidden by removing or adding
 * the `ng-hide` CSS class onto the element. The `.ng-hide` CSS class is predefined
 * in AngularJS and sets the display style to none (using an !important flag).
 *
 * <pre>
 * <!-- when $scope.myValue is truthy (element is visible) -->
 * <div ng-show="myValue"></div>
 *
 * <!-- when $scope.myValue is falsy (element is hidden) -->
 * <div ng-show="myValue" class="ng-hide"></div>
 * </pre>
 *
 * When the ngShow expression evaluates to false then the ng-hide CSS class is added to the class attribute
 * on the element causing it to become hidden. When true, the ng-hide CSS class is removed
 * from the element causing the element not to appear hidden.
 *
 * ## Why is !important used?
 *
 * You may be wondering why !important is used for the .ng-hide CSS class. This is because the `.ng-hide` selector
 * can be easily overridden by heavier selectors. For example, something as simple
 * as changing the display style on a HTML list item would make hidden elements appear visible.
 * This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using !important, the show and hide behavior will work as expected despite any clash between CSS selector
 * specificity (when !important isn't used with any conflicting styles). If a developer chooses to override the
 * styling to change how to hide an element then it is just a matter of using !important in their own CSS code.
 *
 * ### Overriding .ng-hide
 *
 * If you wish to change the hide behavior with ngShow/ngHide then this can be achieved by
 * restating the styles for the .ng-hide class in CSS:
 * <pre>
 * .ng-hide {
 *   //!annotate CSS Specificity|Not to worry, this will override the AngularJS default...
 *   display:block!important;
 *
 *   //this is just another form of hiding an element
 *   position:absolute;
 *   top:-9999px;
 *   left:-9999px;
 * }
 * </pre>
 *
 * Just remember to include the important flag so the CSS override will function.
 *
 * ## A note about animations with ngShow
 *
 * Animations in ngShow/ngHide work with the show and hide events that are triggered when the directive expression
 * is true and false. This system works like the animation system present with ngClass except that
 * you must also include the !important flag to override the display property
 * so that you can perform an animation when the element is hidden during the time of the animation.
 *
 * <pre>
 * //
 * //a working example can be found at the bottom of this page
 * //
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition:0.5s linear all;
 *   display:block!important;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * </pre>
 *
 * @animations
 * addClass: .ng-hide - happens after the ngShow expression evaluates to a truthy value and the just before contents are set to visible
 * removeClass: .ng-hide - happens after the ngShow expression evaluates to a non truthy value and just before the contents are set to hidden
 *
 * @element ANY
 * @param {expression} ngShow If the {@link guide/expression expression} is truthy
 *     then the element is shown or hidden respectively.
 *
 * @example
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked"><br/>
      <div>
        Show:
        <div class="check-element animate-show" ng-show="checked">
          <span class="icon-thumbs-up"></span> I show up when your checkbox is checked.
        </div>
      </div>
      <div>
        Hide:
        <div class="check-element animate-show" ng-hide="checked">
          <span class="icon-thumbs-down"></span> I hide when your checkbox is checked.
        </div>
      </div>
    </file>
    <file name="animations.css">
      .animate-show.ng-hide-add, 
      .animate-show.ng-hide-remove {
        -webkit-transition:all linear 0.5s;
        -moz-transition:all linear 0.5s;
        -o-transition:all linear 0.5s;
        transition:all linear 0.5s;
        display:block!important;
      }

      .animate-show.ng-hide-add.ng-hide-add-active,
      .animate-show.ng-hide-remove {
        line-height:0;
        opacity:0;
        padding:0 10px;
      }

      .animate-show.ng-hide-add,
      .animate-show.ng-hide-remove.ng-hide-remove-active {
        line-height:20px;
        opacity:1;
        padding:10px;
        border:1px solid black;
        background:white;
      }

      .check-element {
        padding:10px;
        border:1px solid black;
        background:white;
      }
    </file>
    <file name="scenario.js">
       it('should check ng-show / ng-hide', function() {
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
    </file>
  </example>
 */
var ngShowDirective = ['$animate', function($animate) {
  return function(scope, element, attr) {
    scope.$watch(attr.ngShow, function ngShowWatchAction(value){
      $animate[toBoolean(value) ? 'removeClass' : 'addClass'](element, 'ng-hide');
    });
  };
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngHide
 *
 * @description
 * The `ngHide` directive shows or hides the given HTML element based on the expression
 * provided to the ngHide attribute. The element is shown or hidden by removing or adding
 * the `ng-hide` CSS class onto the element. The `.ng-hide` CSS class is predefined
 * in AngularJS and sets the display style to none (using an !important flag).
 *
 * <pre>
 * <!-- when $scope.myValue is truthy (element is hidden) -->
 * <div ng-hide="myValue"></div>
 *
 * <!-- when $scope.myValue is falsy (element is visible) -->
 * <div ng-hide="myValue" class="ng-hide"></div>
 * </pre>
 *
 * When the ngHide expression evaluates to true then the .ng-hide CSS class is added to the class attribute
 * on the element causing it to become hidden. When false, the ng-hide CSS class is removed
 * from the element causing the element not to appear hidden.
 *
 * ## Why is !important used?
 *
 * You may be wondering why !important is used for the .ng-hide CSS class. This is because the `.ng-hide` selector
 * can be easily overridden by heavier selectors. For example, something as simple
 * as changing the display style on a HTML list item would make hidden elements appear visible.
 * This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using !important, the show and hide behavior will work as expected despite any clash between CSS selector
 * specificity (when !important isn't used with any conflicting styles). If a developer chooses to override the
 * styling to change how to hide an element then it is just a matter of using !important in their own CSS code.
 *
 * ### Overriding .ng-hide
 *
 * If you wish to change the hide behavior with ngShow/ngHide then this can be achieved by
 * restating the styles for the .ng-hide class in CSS:
 * <pre>
 * .ng-hide {
 *   //!annotate CSS Specificity|Not to worry, this will override the AngularJS default...
 *   display:block!important;
 *
 *   //this is just another form of hiding an element
 *   position:absolute;
 *   top:-9999px;
 *   left:-9999px;
 * }
 * </pre>
 *
 * Just remember to include the important flag so the CSS override will function.
 *
 * ## A note about animations with ngHide
 *
 * Animations in ngShow/ngHide work with the show and hide events that are triggered when the directive expression
 * is true and false. This system works like the animation system present with ngClass, except that
 * you must also include the !important flag to override the display property so
 * that you can perform an animation when the element is hidden during the time of the animation.
 *
 * <pre>
 * //
 * //a working example can be found at the bottom of this page
 * //
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition:0.5s linear all;
 *   display:block!important;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * </pre>
 *
 * @animations
 * removeClass: .ng-hide - happens after the ngHide expression evaluates to a truthy value and just before the contents are set to hidden
 * addClass: .ng-hide - happens after the ngHide expression evaluates to a non truthy value and just before the contents are set to visible
 *
 * @element ANY
 * @param {expression} ngHide If the {@link guide/expression expression} is truthy then
 *     the element is shown or hidden respectively.
 *
 * @example
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked"><br/>
      <div>
        Show:
        <div class="check-element animate-hide" ng-show="checked">
          <span class="icon-thumbs-up"></span> I show up when your checkbox is checked.
        </div>
      </div>
      <div>
        Hide:
        <div class="check-element animate-hide" ng-hide="checked">
          <span class="icon-thumbs-down"></span> I hide when your checkbox is checked.
        </div>
      </div>
    </file>
    <file name="animations.css">
      .animate-hide.ng-hide-add, 
      .animate-hide.ng-hide-remove {
        -webkit-transition:all linear 0.5s;
        -moz-transition:all linear 0.5s;
        -o-transition:all linear 0.5s;
        transition:all linear 0.5s;
        display:block!important;
      }

      .animate-hide.ng-hide-add.ng-hide-add-active,
      .animate-hide.ng-hide-remove {
        line-height:0;
        opacity:0;
        padding:0 10px;
      }

      .animate-hide.ng-hide-add,
      .animate-hide.ng-hide-remove.ng-hide-remove-active {
        line-height:20px;
        opacity:1;
        padding:10px;
        border:1px solid black;
        background:white;
      }

      .check-element {
        padding:10px;
        border:1px solid black;
        background:white;
      }
    </file>
    <file name="scenario.js">
       it('should check ng-show / ng-hide', function() {
         expect(element('.doc-example-live .check-element:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live .check-element:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live .check-element:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live .check-element:last:hidden').count()).toEqual(1);
       });
    </file>
  </example>
 */
var ngHideDirective = ['$animate', function($animate) {
  return function(scope, element, attr) {
    scope.$watch(attr.ngHide, function ngHideWatchAction(value){
      $animate[toBoolean(value) ? 'addClass' : 'removeClass'](element, 'ng-hide');
    });
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngStyle
 * @restrict AC
 *
 * @description
 * The `ngStyle` directive allows you to set CSS style on an HTML element conditionally.
 *
 * @element ANY
 * @param {expression} ngStyle {@link guide/expression Expression} which evals to an
 *      object whose keys are CSS style names and values are corresponding values for those CSS
 *      keys.
 *
 * @example
   <example>
     <file name="index.html">
        <input type="button" value="set" ng-click="myStyle={color:'red'}">
        <input type="button" value="clear" ng-click="myStyle={}">
        <br/>
        <span ng-style="myStyle">Sample Text</span>
        <pre>myStyle={{myStyle}}</pre>
     </file>
     <file name="style.css">
       span {
         color: black;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-style', function() {
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
         element('.doc-example-live :button[value=set]').click();
         expect(element('.doc-example-live span').css('color')).toBe('rgb(255, 0, 0)');
         element('.doc-example-live :button[value=clear]').click();
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
       });
     </file>
   </example>
 */
var ngStyleDirective = ngDirective(function(scope, element, attr) {
  scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
    if (oldStyles && (newStyles !== oldStyles)) {
      forEach(oldStyles, function(val, style) { element.css(style, '');});
    }
    if (newStyles) element.css(newStyles);
  }, true);
});

/**
 * @ngdoc directive
 * @name ng.directive:ngSwitch
 * @restrict EA
 *
 * @description
 * The ngSwitch directive is used to conditionally swap DOM structure on your template based on a scope expression.
 * Elements within ngSwitch but without ngSwitchWhen or ngSwitchDefault directives will be preserved at the location
 * as specified in the template.
 *
 * The directive itself works similar to ngInclude, however, instead of downloading template code (or loading it
 * from the template cache), ngSwitch simply choses one of the nested elements and makes it visible based on which element
 * matches the value obtained from the evaluated expression. In other words, you define a container element
 * (where you place the directive), place an expression on the **on="..." attribute**
 * (or the **ng-switch="..." attribute**), define any inner elements inside of the directive and place
 * a when attribute per element. The when attribute is used to inform ngSwitch which element to display when the on
 * expression is evaluated. If a matching expression is not found via a when attribute then an element with the default
 * attribute is displayed.
 *
 * @animations
 * enter - happens after the ngSwitch contents change and the matched child element is placed inside the container
 * leave - happens just after the ngSwitch contents change and just before the former contents are removed from the DOM
 *
 * @usage
 * <ANY ng-switch="expression">
 *   <ANY ng-switch-when="matchValue1">...</ANY>
 *   <ANY ng-switch-when="matchValue2">...</ANY>
 *   <ANY ng-switch-default>...</ANY>
 * </ANY>
 *
 * @scope
 * @param {*} ngSwitch|on expression to match against <tt>ng-switch-when</tt>.
 * @paramDescription
 * On child elements add:
 *
 * * `ngSwitchWhen`: the case statement to match against. If match then this
 *   case will be displayed. If the same match appears multiple times, all the
 *   elements will be displayed.
 * * `ngSwitchDefault`: the default case when no other case match. If there
 *   are multiple default cases, all of them will be displayed when no other
 *   case match.
 *
 *
 * @example
  <example animations="true">
    <file name="index.html">
      <div ng-controller="Ctrl">
        <select ng-model="selection" ng-options="item for item in items">
        </select>
        <tt>selection={{selection}}</tt>
        <hr/>
        <div class="animate-switch-container"
          ng-switch on="selection">
            <div ng-switch-when="settings">Settings Div</div>
            <div ng-switch-when="home">Home Span</div>
            <div ng-switch-default>default</div>
        </div>
      </div>
    </file>
    <file name="script.js">
      function Ctrl($scope) {
        $scope.items = ['settings', 'home', 'other'];
        $scope.selection = $scope.items[0];
      }
    </file>
    <file name="animations.css">
      .animate-switch-container {
        position:relative;
        background:white;
        border:1px solid black;
        height:40px;
        overflow:hidden;
      }

      .animate-switch-container > div {
        padding:10px;
      }

      .animate-switch-container > .ng-enter,
      .animate-switch-container > .ng-leave {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
      }

      .animate-switch-container > .ng-enter {
        top:-50px;
      }
      .animate-switch-container > .ng-enter.ng-enter-active {
        top:0;
      }

      .animate-switch-container > .ng-leave {
        top:0;
      }
      .animate-switch-container > .ng-leave.ng-leave-active {
        top:50px;
      }
    </file>
    <file name="scenario.js">
      it('should start in settings', function() {
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Settings Div/);
      });
      it('should change to home', function() {
        select('selection').option('home');
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Home Span/);
      });
      it('should select default', function() {
        select('selection').option('other');
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/default/);
      });
    </file>
  </example>
 */
var ngSwitchDirective = ['$animate', function($animate) {
  return {
    restrict: 'EA',
    require: 'ngSwitch',

    // asks for $scope to fool the BC controller module
    controller: ['$scope', function ngSwitchController() {
     this.cases = {};
    }],
    link: function(scope, element, attr, ngSwitchController) {
      var watchExpr = attr.ngSwitch || attr.on,
          selectedTranscludes,
          selectedElements,
          selectedScopes = [];

      scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
        for (var i= 0, ii=selectedScopes.length; i<ii; i++) {
          selectedScopes[i].$destroy();
          $animate.leave(selectedElements[i]);
        }

        selectedElements = [];
        selectedScopes = [];

        if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {
          scope.$eval(attr.change);
          forEach(selectedTranscludes, function(selectedTransclude) {
            var selectedScope = scope.$new();
            selectedScopes.push(selectedScope);
            selectedTransclude.transclude(selectedScope, function(caseElement) {
              var anchor = selectedTransclude.element;

              selectedElements.push(caseElement);
              $animate.enter(caseElement, anchor.parent(), anchor);
            });
          });
        }
      });
    }
  }
}];

var ngSwitchWhenDirective = ngDirective({
  transclude: 'element',
  priority: 500,
  require: '^ngSwitch',
  compile: function(element, attrs, transclude) {
    return function(scope, element, attr, ctrl) {
      ctrl.cases['!' + attrs.ngSwitchWhen] = (ctrl.cases['!' + attrs.ngSwitchWhen] || []);
      ctrl.cases['!' + attrs.ngSwitchWhen].push({ transclude: transclude, element: element });
    };
  }
});

var ngSwitchDefaultDirective = ngDirective({
  transclude: 'element',
  priority: 500,
  require: '^ngSwitch',
  compile: function(element, attrs, transclude) {
    return function(scope, element, attr, ctrl) {
      ctrl.cases['?'] = (ctrl.cases['?'] || []);
      ctrl.cases['?'].push({ transclude: transclude, element: element });
    };
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:ngTransclude
 * @restrict AC
 *
 * @description
 * Directive that marks the insertion point for the transcluded DOM of the nearest parent directive that uses transclusion.
 *
 * Any existing content of the element that this directive is placed on will be removed before the transcluded content is inserted.
 *
 * @element ANY
 *
 * @example
   <doc:example module="transclude">
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.title = 'Lorem Ipsum';
           $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
         }

         angular.module('transclude', [])
          .directive('pane', function(){
             return {
               restrict: 'E',
               transclude: true,
               scope: { title:'@' },
               template: '<div style="border: 1px solid black;">' +
                           '<div style="background-color: gray">{{title}}</div>' +
                           '<div ng-transclude></div>' +
                         '</div>'
             };
         });
       </script>
       <div ng-controller="Ctrl">
         <input ng-model="title"><br>
         <textarea ng-model="text"></textarea> <br/>
         <pane title="{{title}}">{{text}}</pane>
       </div>
     </doc:source>
     <doc:scenario>
        it('should have transcluded', function() {
          input('title').enter('TITLE');
          input('text').enter('TEXT');
          expect(binding('title')).toEqual('TITLE');
          expect(binding('text')).toEqual('TEXT');
        });
     </doc:scenario>
   </doc:example>
 *
 */
var ngTranscludeDirective = ngDirective({
  controller: ['$transclude', function($transclude) {
    // remember the transclusion fn but call it during linking so that we don't process transclusion before directives on
    // the parent element even when the transclusion replaces the current element. (we can't use priority here because
    // that applies only to compile fns and not controllers
    this.$transclude = $transclude;
  }],

  link: function($scope, $element, $attrs, controller) {
    controller.$transclude(function(clone) {
      $element.html('');
      $element.append(clone);
    });
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:script
 * @restrict E
 *
 * @description
 * Load content of a script tag, with type `text/ng-template`, into `$templateCache`, so that the
 * template can be used by `ngInclude`, `ngView` or directive templates.
 *
 * @param {'text/ng-template'} type must be set to `'text/ng-template'`
 *
 * @example
  <doc:example>
    <doc:source>
      <script type="text/ng-template" id="/tpl.html">
        Content of the template.
      </script>

      <a ng-click="currentTpl='/tpl.html'" id="tpl-link">Load inlined template</a>
      <div id="tpl-content" ng-include src="currentTpl"></div>
    </doc:source>
    <doc:scenario>
      it('should load template defined inside script tag', function() {
        element('#tpl-link').click();
        expect(element('#tpl-content').text()).toMatch(/Content of the template/);
      });
    </doc:scenario>
  </doc:example>
 */
var scriptDirective = ['$templateCache', function($templateCache) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element, attr) {
      if (attr.type == 'text/ng-template') {
        var templateUrl = attr.id,
            // IE is not consistent, in scripts we have to read .text but in other nodes we have to read .textContent
            text = element[0].text;

        $templateCache.put(templateUrl, text);
      }
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:select
 * @restrict E
 *
 * @description
 * HTML `SELECT` element with angular data-binding.
 *
 * # `ngOptions`
 *
 * Optionally `ngOptions` attribute can be used to dynamically generate a list of `<option>`
 * elements for a `<select>` element using an array or an object obtained by evaluating the
 * `ngOptions` expression.
 *
 * When an item in the `<select>` menu is selected, the value of array element or object property
 * represented by the selected option will be bound to the model identified by the `ngModel`
 * directive of the parent select element.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent `null` or "not selected"
 * option. See example below for demonstration.
 *
 * Note: `ngOptions` provides iterator facility for `<option>` element which should be used instead
 * of {@link ng.directive:ngRepeat ngRepeat} when you want the
 * `select` model to be bound to a non-string value. This is because an option element can currently
 * be bound to string values only.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required The control is considered valid only if value is entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {comprehension_expression=} ngOptions in one of the following forms:
 *
 *   * for array data sources:
 *     * `label` **`for`** `value` **`in`** `array`
 *     * `select` **`as`** `label` **`for`** `value` **`in`** `array`
 *     * `label`  **`group by`** `group` **`for`** `value` **`in`** `array`
 *     * `select` **`as`** `label` **`group by`** `group` **`for`** `value` **`in`** `array` **`track by`** `trackexpr`
 *   * for object data sources:
 *     * `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `label` **`group by`** `group` **`for (`**`key`**`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`group by`** `group`
 *         **`for` `(`**`key`**`,`** `value`**`) in`** `object`
 *
 * Where:
 *
 *   * `array` / `object`: an expression which evaluates to an array / object to iterate over.
 *   * `value`: local variable which will refer to each item in the `array` or each property value
 *      of `object` during iteration.
 *   * `key`: local variable which will refer to a property name in `object` during iteration.
 *   * `label`: The result of this expression will be the label for `<option>` element. The
 *     `expression` will most likely refer to the `value` variable (e.g. `value.propertyName`).
 *   * `select`: The result of this expression will be bound to the model of the parent `<select>`
 *      element. If not specified, `select` expression will default to `value`.
 *   * `group`: The result of this expression will be used to group options using the `<optgroup>`
 *      DOM element.
 *   * `trackexpr`: Used when working with an array of objects. The result of this expression will be
 *      used to identify the objects in the array. The `trackexpr` will most likely refer to the
 *     `value` variable (e.g. `value.propertyName`).
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
        function MyCntrl($scope) {
          $scope.colors = [
            {name:'black', shade:'dark'},
            {name:'white', shade:'light'},
            {name:'red', shade:'dark'},
            {name:'blue', shade:'dark'},
            {name:'yellow', shade:'light'}
          ];
          $scope.color = $scope.colors[2]; // red
        }
        </script>
        <div ng-controller="MyCntrl">
          <ul>
            <li ng-repeat="color in colors">
              Name: <input ng-model="color.name">
              [<a href ng-click="colors.splice($index, 1)">X</a>]
            </li>
            <li>
              [<a href ng-click="colors.push({})">add</a>]
            </li>
          </ul>
          <hr/>
          Color (null not allowed):
          <select ng-model="color" ng-options="c.name for c in colors"></select><br>

          Color (null allowed):
          <span  class="nullable">
            <select ng-model="color" ng-options="c.name for c in colors">
              <option value="">-- chose color --</option>
            </select>
          </span><br/>

          Color grouped by shade:
          <select ng-model="color" ng-options="c.name group by c.shade for c in colors">
          </select><br/>


          Select <a href ng-click="color={name:'not in list'}">bogus</a>.<br>
          <hr/>
          Currently selected: {{ {selected_color:color}  }}
          <div style="border:solid 1px black; height:20px"
               ng-style="{'background-color':color.name}">
          </div>
        </div>
      </doc:source>
      <doc:scenario>
         it('should check ng-options', function() {
           expect(binding('{selected_color:color}')).toMatch('red');
           select('color').option('0');
           expect(binding('{selected_color:color}')).toMatch('black');
           using('.nullable').select('color').option('');
           expect(binding('{selected_color:color}')).toMatch('null');
         });
      </doc:scenario>
    </doc:example>
 */

var ngOptionsDirective = valueFn({ terminal: true });
var selectDirective = ['$compile', '$parse', function($compile,   $parse) {
                         //0000111110000000000022220000000000000000000000333300000000000000444444444444444440000000005555555555555555500000006666666666666666600000000000000007777000000000000000000088888
  var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/,
      nullModelCtrl = {$setViewValue: noop};

  return {
    restrict: 'E',
    require: ['select', '?ngModel'],
    controller: ['$element', '$scope', '$attrs', function($element, $scope, $attrs) {
      var self = this,
          optionsMap = {},
          ngModelCtrl = nullModelCtrl,
          nullOption,
          unknownOption;


      self.databound = $attrs.ngModel;


      self.init = function(ngModelCtrl_, nullOption_, unknownOption_) {
        ngModelCtrl = ngModelCtrl_;
        nullOption = nullOption_;
        unknownOption = unknownOption_;
      }


      self.addOption = function(value) {
        optionsMap[value] = true;

        if (ngModelCtrl.$viewValue == value) {
          $element.val(value);
          if (unknownOption.parent()) unknownOption.remove();
        }
      };


      self.removeOption = function(value) {
        if (this.hasOption(value)) {
          delete optionsMap[value];
          if (ngModelCtrl.$viewValue == value) {
            this.renderUnknownOption(value);
          }
        }
      };


      self.renderUnknownOption = function(val) {
        var unknownVal = '? ' + hashKey(val) + ' ?';
        unknownOption.val(unknownVal);
        $element.prepend(unknownOption);
        $element.val(unknownVal);
        unknownOption.prop('selected', true); // needed for IE
      }


      self.hasOption = function(value) {
        return optionsMap.hasOwnProperty(value);
      }

      $scope.$on('$destroy', function() {
        // disable unknown option so that we don't do work when the whole select is being destroyed
        self.renderUnknownOption = noop;
      });
    }],

    link: function(scope, element, attr, ctrls) {
      // if ngModel is not defined, we don't need to do anything
      if (!ctrls[1]) return;

      var selectCtrl = ctrls[0],
          ngModelCtrl = ctrls[1],
          multiple = attr.multiple,
          optionsExp = attr.ngOptions,
          nullOption = false, // if false, user will not be able to select it (used by ngOptions)
          emptyOption,
          // we can't just jqLite('<option>') since jqLite is not smart enough
          // to create it in <select> and IE barfs otherwise.
          optionTemplate = jqLite(document.createElement('option')),
          optGroupTemplate =jqLite(document.createElement('optgroup')),
          unknownOption = optionTemplate.clone();

      // find "null" option
      for(var i = 0, children = element.children(), ii = children.length; i < ii; i++) {
        if (children[i].value == '') {
          emptyOption = nullOption = children.eq(i);
          break;
        }
      }

      selectCtrl.init(ngModelCtrl, nullOption, unknownOption);

      // required validator
      if (multiple && (attr.required || attr.ngRequired)) {
        var requiredValidator = function(value) {
          ngModelCtrl.$setValidity('required', !attr.required || (value && value.length));
          return value;
        };

        ngModelCtrl.$parsers.push(requiredValidator);
        ngModelCtrl.$formatters.unshift(requiredValidator);

        attr.$observe('required', function() {
          requiredValidator(ngModelCtrl.$viewValue);
        });
      }

      if (optionsExp) Options(scope, element, ngModelCtrl);
      else if (multiple) Multiple(scope, element, ngModelCtrl);
      else Single(scope, element, ngModelCtrl, selectCtrl);


      ////////////////////////////



      function Single(scope, selectElement, ngModelCtrl, selectCtrl) {
        ngModelCtrl.$render = function() {
          var viewValue = ngModelCtrl.$viewValue;

          if (selectCtrl.hasOption(viewValue)) {
            if (unknownOption.parent()) unknownOption.remove();
            selectElement.val(viewValue);
            if (viewValue === '') emptyOption.prop('selected', true); // to make IE9 happy
          } else {
            if (isUndefined(viewValue) && emptyOption) {
              selectElement.val('');
            } else {
              selectCtrl.renderUnknownOption(viewValue);
            }
          }
        };

        selectElement.on('change', function() {
          scope.$apply(function() {
            if (unknownOption.parent()) unknownOption.remove();
            ngModelCtrl.$setViewValue(selectElement.val());
          });
        });
      }

      function Multiple(scope, selectElement, ctrl) {
        var lastView;
        ctrl.$render = function() {
          var items = new HashMap(ctrl.$viewValue);
          forEach(selectElement.find('option'), function(option) {
            option.selected = isDefined(items.get(option.value));
          });
        };

        // we have to do it on each watch since ngModel watches reference, but
        // we need to work of an array, so we need to see if anything was inserted/removed
        scope.$watch(function selectMultipleWatch() {
          if (!equals(lastView, ctrl.$viewValue)) {
            lastView = copy(ctrl.$viewValue);
            ctrl.$render();
          }
        });

        selectElement.on('change', function() {
          scope.$apply(function() {
            var array = [];
            forEach(selectElement.find('option'), function(option) {
              if (option.selected) {
                array.push(option.value);
              }
            });
            ctrl.$setViewValue(array);
          });
        });
      }

      function Options(scope, selectElement, ctrl) {
        var match;

        if (! (match = optionsExp.match(NG_OPTIONS_REGEXP))) {
          throw minErr('ngOptions')('iexp',
            "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}",
            optionsExp, startingTag(selectElement));
        }

        var displayFn = $parse(match[2] || match[1]),
            valueName = match[4] || match[6],
            keyName = match[5],
            groupByFn = $parse(match[3] || ''),
            valueFn = $parse(match[2] ? match[1] : valueName),
            valuesFn = $parse(match[7]),
            track = match[8],
            trackFn = track ? $parse(match[8]) : null,
            // This is an array of array of existing option groups in DOM. We try to reuse these if possible
            // optionGroupsCache[0] is the options with no option group
            // optionGroupsCache[?][0] is the parent: either the SELECT or OPTGROUP element
            optionGroupsCache = [[{element: selectElement, label:''}]];

        if (nullOption) {
          // compile the element since there might be bindings in it
          $compile(nullOption)(scope);

          // remove the class, which is added automatically because we recompile the element and it
          // becomes the compilation root
          nullOption.removeClass('ng-scope');

          // we need to remove it before calling selectElement.html('') because otherwise IE will
          // remove the label from the element. wtf?
          nullOption.remove();
        }

        // clear contents, we'll add what's needed based on the model
        selectElement.html('');

        selectElement.on('change', function() {
          scope.$apply(function() {
            var optionGroup,
                collection = valuesFn(scope) || [],
                locals = {},
                key, value, optionElement, index, groupIndex, length, groupLength;

            if (multiple) {
              value = [];
              for (groupIndex = 0, groupLength = optionGroupsCache.length;
                   groupIndex < groupLength;
                   groupIndex++) {
                // list of options for that group. (first item has the parent)
                optionGroup = optionGroupsCache[groupIndex];

                for(index = 1, length = optionGroup.length; index < length; index++) {
                  if ((optionElement = optionGroup[index].element)[0].selected) {
                    key = optionElement.val();
                    if (keyName) locals[keyName] = key;
                    if (trackFn) {
                      for (var trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                        locals[valueName] = collection[trackIndex];
                        if (trackFn(scope, locals) == key) break;
                      }
                    } else {
                      locals[valueName] = collection[key];
                    }
                    value.push(valueFn(scope, locals));
                  }
                }
              }
            } else {
              key = selectElement.val();
              if (key == '?') {
                value = undefined;
              } else if (key == ''){
                value = null;
              } else {
                if (trackFn) {
                  for (var trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                    locals[valueName] = collection[trackIndex];
                    if (trackFn(scope, locals) == key) {
                      value = valueFn(scope, locals);
                      break;
                    }
                  }
                } else {
                  locals[valueName] = collection[key];
                  if (keyName) locals[keyName] = key;
                  value = valueFn(scope, locals);
                }
              }
            }
            ctrl.$setViewValue(value);
          });
        });

        ctrl.$render = render;

        // TODO(vojta): can't we optimize this ?
        scope.$watch(render);

        function render() {
          var optionGroups = {'':[]}, // Temporary location for the option groups before we render them
              optionGroupNames = [''],
              optionGroupName,
              optionGroup,
              option,
              existingParent, existingOptions, existingOption,
              modelValue = ctrl.$modelValue,
              values = valuesFn(scope) || [],
              keys = keyName ? sortedKeys(values) : values,
              key,
              groupLength, length,
              groupIndex, index,
              locals = {},
              selected,
              selectedSet = false, // nothing is selected yet
              lastElement,
              element,
              label;

          if (multiple) {
            if (trackFn && isArray(modelValue)) {
              selectedSet = new HashMap([]);
              for (var trackIndex = 0; trackIndex < modelValue.length; trackIndex++) {
                locals[valueName] = modelValue[trackIndex];
                selectedSet.put(trackFn(scope, locals), modelValue[trackIndex]);
              }
            } else {
              selectedSet = new HashMap(modelValue);
            }
          }

          // We now build up the list of options we need (we merge later)
          for (index = 0; length = keys.length, index < length; index++) {
            
            key = index;
            if (keyName) {
              key = keys[index];
              if ( key.charAt(0) === '$' ) continue;
              locals[keyName] = key;
            }

            locals[valueName] = values[key];

            optionGroupName = groupByFn(scope, locals) || '';
            if (!(optionGroup = optionGroups[optionGroupName])) {
              optionGroup = optionGroups[optionGroupName] = [];
              optionGroupNames.push(optionGroupName);
            }
            if (multiple) {
              selected = selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals)) != undefined;
            } else {
              if (trackFn) {
                var modelCast = {};
                modelCast[valueName] = modelValue;
                selected = trackFn(scope, modelCast) === trackFn(scope, locals);
              } else {
                selected = modelValue === valueFn(scope, locals);
              }
              selectedSet = selectedSet || selected; // see if at least one item is selected
            }
            label = displayFn(scope, locals); // what will be seen by the user
            label = label === undefined ? '' : label; // doing displayFn(scope, locals) || '' overwrites zero values
            optionGroup.push({
              id: trackFn ? trackFn(scope, locals) : (keyName ? keys[index] : index),   // either the index into array or key from object
              label: label,
              selected: selected                   // determine if we should be selected
            });
          }
          if (!multiple) {
            if (nullOption || modelValue === null) {
              // insert null option if we have a placeholder, or the model is null
              optionGroups[''].unshift({id:'', label:'', selected:!selectedSet});
            } else if (!selectedSet) {
              // option could not be found, we have to insert the undefined item
              optionGroups[''].unshift({id:'?', label:'', selected:true});
            }
          }

          // Now we need to update the list of DOM nodes to match the optionGroups we computed above
          for (groupIndex = 0, groupLength = optionGroupNames.length;
               groupIndex < groupLength;
               groupIndex++) {
            // current option group name or '' if no group
            optionGroupName = optionGroupNames[groupIndex];

            // list of options for that group. (first item has the parent)
            optionGroup = optionGroups[optionGroupName];

            if (optionGroupsCache.length <= groupIndex) {
              // we need to grow the optionGroups
              existingParent = {
                element: optGroupTemplate.clone().attr('label', optionGroupName),
                label: optionGroup.label
              };
              existingOptions = [existingParent];
              optionGroupsCache.push(existingOptions);
              selectElement.append(existingParent.element);
            } else {
              existingOptions = optionGroupsCache[groupIndex];
              existingParent = existingOptions[0];  // either SELECT (no group) or OPTGROUP element

              // update the OPTGROUP label if not the same.
              if (existingParent.label != optionGroupName) {
                existingParent.element.attr('label', existingParent.label = optionGroupName);
              }
            }

            lastElement = null;  // start at the beginning
            for(index = 0, length = optionGroup.length; index < length; index++) {
              option = optionGroup[index];
              if ((existingOption = existingOptions[index+1])) {
                // reuse elements
                lastElement = existingOption.element;
                if (existingOption.label !== option.label) {
                  lastElement.text(existingOption.label = option.label);
                }
                if (existingOption.id !== option.id) {
                  lastElement.val(existingOption.id = option.id);
                }
                // lastElement.prop('selected') provided by jQuery has side-effects
                if (lastElement[0].selected !== option.selected) {
                  lastElement.prop('selected', (existingOption.selected = option.selected));
                }
              } else {
                // grow elements

                // if it's a null option
                if (option.id === '' && nullOption) {
                  // put back the pre-compiled element
                  element = nullOption;
                } else {
                  // jQuery(v1.4.2) Bug: We should be able to chain the method calls, but
                  // in this version of jQuery on some browser the .text() returns a string
                  // rather then the element.
                  (element = optionTemplate.clone())
                      .val(option.id)
                      .attr('selected', option.selected)
                      .text(option.label);
                }

                existingOptions.push(existingOption = {
                    element: element,
                    label: option.label,
                    id: option.id,
                    selected: option.selected
                });
                if (lastElement) {
                  lastElement.after(element);
                } else {
                  existingParent.element.append(element);
                }
                lastElement = element;
              }
            }
            // remove any excessive OPTIONs in a group
            index++; // increment since the existingOptions[0] is parent element not OPTION
            while(existingOptions.length > index) {
              existingOptions.pop().element.remove();
            }
          }
          // remove any excessive OPTGROUPs from select
          while(optionGroupsCache.length > groupIndex) {
            optionGroupsCache.pop()[0].element.remove();
          }
        }
      }
    }
  }
}];

var optionDirective = ['$interpolate', function($interpolate) {
  var nullSelectCtrl = {
    addOption: noop,
    removeOption: noop
  };

  return {
    restrict: 'E',
    priority: 100,
    compile: function(element, attr) {
      if (isUndefined(attr.value)) {
        var interpolateFn = $interpolate(element.text(), true);
        if (!interpolateFn) {
          attr.$set('value', element.text());
        }
      }

      return function (scope, element, attr) {
        var selectCtrlName = '$selectController',
            parent = element.parent(),
            selectCtrl = parent.data(selectCtrlName) ||
              parent.parent().data(selectCtrlName); // in case we are in optgroup

        if (selectCtrl && selectCtrl.databound) {
          // For some reason Opera defaults to true and if not overridden this messes up the repeater.
          // We don't want the view to drive the initialization of the model anyway.
          element.prop('selected', false);
        } else {
          selectCtrl = nullSelectCtrl;
        }

        if (interpolateFn) {
          scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
            attr.$set('value', newVal);
            if (newVal !== oldVal) selectCtrl.removeOption(oldVal);
            selectCtrl.addOption(newVal);
          });
        } else {
          selectCtrl.addOption(attr.value);
        }

        element.on('$destroy', function() {
          selectCtrl.removeOption(attr.value);
        });
      };
    }
  }
}];

var styleDirective = valueFn({
  restrict: 'E',
  terminal: true
});

/**
 * Setup file for the Scenario.
 * Must be first in the compilation/bootstrap list.
 */

// Public namespace
angular.scenario = angular.scenario || {};

/**
 * Expose jQuery (e.g. for custom dsl extensions).
 */
angular.scenario.jQuery = _jQuery;

/**
 * Defines a new output format.
 *
 * @param {string} name the name of the new output format
 * @param {function()} fn function(context, runner) that generates the output
 */
angular.scenario.output = angular.scenario.output || function(name, fn) {
  angular.scenario.output[name] = fn;
};

/**
 * Defines a new DSL statement. If your factory function returns a Future
 * it's returned, otherwise the result is assumed to be a map of functions
 * for chaining. Chained functions are subject to the same rules.
 *
 * Note: All functions on the chain are bound to the chain scope so values
 *   set on "this" in your statement function are available in the chained
 *   functions.
 *
 * @param {string} name The name of the statement
 * @param {function()} fn Factory function(), return a function for
 *  the statement.
 */
angular.scenario.dsl = angular.scenario.dsl || function(name, fn) {
  angular.scenario.dsl[name] = function() {
    function executeStatement(statement, args) {
      var result = statement.apply(this, args);
      if (angular.isFunction(result) || result instanceof angular.scenario.Future)
        return result;
      var self = this;
      var chain = angular.extend({}, result);
      angular.forEach(chain, function(value, name) {
        if (angular.isFunction(value)) {
          chain[name] = function() {
            return executeStatement.call(self, value, arguments);
          };
        } else {
          chain[name] = value;
        }
      });
      return chain;
    }
    var statement = fn.apply(this, arguments);
    return function() {
      return executeStatement.call(this, statement, arguments);
    };
  };
};

/**
 * Defines a new matcher for use with the expects() statement. The value
 * this.actual (like in Jasmine) is available in your matcher to compare
 * against. Your function should return a boolean. The future is automatically
 * created for you.
 *
 * @param {string} name The name of the matcher
 * @param {function()} fn The matching function(expected).
 */
angular.scenario.matcher = angular.scenario.matcher || function(name, fn) {
  angular.scenario.matcher[name] = function(expected) {
    var description = this.future.name +
                      (this.inverse ? ' not ' : ' ') + name +
                      ' ' + angular.toJson(expected);
    var self = this;
    this.addFuture('expect ' + description,
      function(done) {
        var error;
        self.actual = self.future.value;
        if ((self.inverse && fn.call(self, expected)) ||
            (!self.inverse && !fn.call(self, expected))) {
          error = 'expected ' + description +
            ' but was ' + angular.toJson(self.actual);
        }
        done(error);
    });
  };
};

/**
 * Initialize the scenario runner and run !
 *
 * Access global window and document object
 * Access $runner through closure
 *
 * @param {Object=} config Config options
 */
angular.scenario.setUpAndRun = function(config) {
  var href = window.location.href;
  var body = _jQuery(document.body);
  var output = [];
  var objModel = new angular.scenario.ObjectModel($runner);

  if (config && config.scenario_output) {
    output = config.scenario_output.split(',');
  }

  angular.forEach(angular.scenario.output, function(fn, name) {
    if (!output.length || indexOf(output,name) != -1) {
      var context = body.append('<div></div>').find('div:last');
      context.attr('id', name);
      fn.call({}, context, $runner, objModel);
    }
  });

  if (!/^http/.test(href) && !/^https/.test(href)) {
    body.append('<p id="system-error"></p>');
    body.find('#system-error').text(
      'Scenario runner must be run using http or https. The protocol ' +
      href.split(':')[0] + ':// is not supported.'
    );
    return;
  }

  var appFrame = body.append('<div id="application"></div>').find('#application');
  var application = new angular.scenario.Application(appFrame);

  $runner.on('RunnerEnd', function() {
    appFrame.css('display', 'none');
    appFrame.find('iframe').attr('src', 'about:blank');
  });

  $runner.on('RunnerError', function(error) {
    if (window.console) {
      console.log(formatException(error));
    } else {
      // Do something for IE
      alert(error);
    }
  });

  $runner.run(application);
};

/**
 * Iterates through list with iterator function that must call the
 * continueFunction to continue iterating.
 *
 * @param {Array} list list to iterate over
 * @param {function()} iterator Callback function(value, continueFunction)
 * @param {function()} done Callback function(error, result) called when
 *   iteration finishes or an error occurs.
 */
function asyncForEach(list, iterator, done) {
  var i = 0;
  function loop(error, index) {
    if (index && index > i) {
      i = index;
    }
    if (error || i >= list.length) {
      done(error);
    } else {
      try {
        iterator(list[i++], loop);
      } catch (e) {
        done(e);
      }
    }
  }
  loop();
}

/**
 * Formats an exception into a string with the stack trace, but limits
 * to a specific line length.
 *
 * @param {Object} error The exception to format, can be anything throwable
 * @param {Number=} [maxStackLines=5] max lines of the stack trace to include
 *  default is 5.
 */
function formatException(error, maxStackLines) {
  maxStackLines = maxStackLines || 5;
  var message = error.toString();
  if (error.stack) {
    var stack = error.stack.split('\n');
    if (stack[0].indexOf(message) === -1) {
      maxStackLines++;
      stack.unshift(error.message);
    }
    message = stack.slice(0, maxStackLines).join('\n');
  }
  return message;
}

/**
 * Returns a function that gets the file name and line number from a
 * location in the stack if available based on the call site.
 *
 * Note: this returns another function because accessing .stack is very
 * expensive in Chrome.
 *
 * @param {Number} offset Number of stack lines to skip
 */
function callerFile(offset) {
  var error = new Error();

  return function() {
    var line = (error.stack || '').split('\n')[offset];

    // Clean up the stack trace line
    if (line) {
      if (line.indexOf('@') !== -1) {
        // Firefox
        line = line.substring(line.indexOf('@')+1);
      } else {
        // Chrome
        line = line.substring(line.indexOf('(')+1).replace(')', '');
      }
    }

    return line || '';
  };
}


/**
 * Don't use the jQuery trigger method since it works incorrectly.
 *
 * jQuery notifies listeners and then changes the state of a checkbox and
 * does not create a real browser event. A real click changes the state of
 * the checkbox and then notifies listeners.
 *
 * To work around this we instead use our own handler that fires a real event.
 */
(function(fn){
  var parentTrigger = fn.trigger;
  fn.trigger = function(type) {
    if (/(click|change|keydown|blur|input|mousedown|mouseup)/.test(type)) {
      var processDefaults = [];
      this.each(function(index, node) {
        processDefaults.push(browserTrigger(node, type));
      });

      // this is not compatible with jQuery - we return an array of returned values,
      // so that scenario runner know whether JS code has preventDefault() of the event or not...
      return processDefaults;
    }
    return parentTrigger.apply(this, arguments);
  };
})(_jQuery.fn);

/**
 * Finds all bindings with the substring match of name and returns an
 * array of their values.
 *
 * @param {string} bindExp The name to match
 * @return {Array.<string>} String of binding values
 */
_jQuery.fn.bindings = function(windowJquery, bindExp) {
  var result = [], match,
      bindSelector = '.ng-binding:visible';
  if (angular.isString(bindExp)) {
    bindExp = bindExp.replace(/\s/g, '');
    match = function (actualExp) {
      if (actualExp) {
        actualExp = actualExp.replace(/\s/g, '');
        if (actualExp == bindExp) return true;
        if (actualExp.indexOf(bindExp) == 0) {
          return actualExp.charAt(bindExp.length) == '|';
        }
      }
    }
  } else if (bindExp) {
    match = function(actualExp) {
      return actualExp && bindExp.exec(actualExp);
    }
  } else {
    match = function(actualExp) {
      return !!actualExp;
    };
  }
  var selection = this.find(bindSelector);
  if (this.is(bindSelector)) {
    selection = selection.add(this);
  }

  function push(value) {
    if (value == undefined) {
      value = '';
    } else if (typeof value != 'string') {
      value = angular.toJson(value);
    }
    result.push('' + value);
  }

  selection.each(function() {
    var element = windowJquery(this),
        binding;
    if (binding = element.data('$binding')) {
      if (typeof binding == 'string') {
        if (match(binding)) {
          push(element.scope().$eval(binding));
        }
      } else {
        if (!angular.isArray(binding)) {
          binding = [binding];
        }
        for(var fns, j=0, jj=binding.length;  j<jj; j++) {
          fns = binding[j];
          if (fns.parts) {
            fns = fns.parts;
          } else {
            fns = [fns];
          }
          for (var scope, fn, i = 0, ii = fns.length; i < ii; i++) {
            if(match((fn = fns[i]).exp)) {
              push(fn(scope = scope || element.scope()));
            }
          }
        }
      }
    }
  });
  return result;
};

(function() {
  var msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1], 10);

  function indexOf(array, obj) {
    if (array.indexOf) return array.indexOf(obj);

    for ( var i = 0; i < array.length; i++) {
      if (obj === array[i]) return i;
    }
    return -1;
  }



  /**
   * Triggers a browser event. Attempts to choose the right event if one is
   * not specified.
   *
   * @param {Object} element Either a wrapped jQuery/jqLite node or a DOMElement
   * @param {string} eventType Optional event type
   * @param {Object=} eventData An optional object which contains additional event data (such as x,y coordinates, keys, etc...) that
   * are passed into the event when triggered
   */
  window.browserTrigger = function browserTrigger(element, eventType, eventData) {
    if (element && !element.nodeName) element = element[0];
    if (!element) return;

    eventData = eventData || {};
    var keys = eventData.keys;
    var x = eventData.x;
    var y = eventData.y;

    var inputType = (element.type) ? element.type.toLowerCase() : null,
        nodeName = element.nodeName.toLowerCase();

    if (!eventType) {
      eventType = {
        'text':            'change',
        'textarea':        'change',
        'hidden':          'change',
        'password':        'change',
        'button':          'click',
        'submit':          'click',
        'reset':           'click',
        'image':           'click',
        'checkbox':        'click',
        'radio':           'click',
        'select-one':      'change',
        'select-multiple': 'change',
        '_default_':       'click'
      }[inputType || '_default_'];
    }

    if (nodeName == 'option') {
      element.parentNode.value = element.value;
      element = element.parentNode;
      eventType = 'change';
    }

    keys = keys || [];
    function pressed(key) {
      return indexOf(keys, key) !== -1;
    }

    if (msie < 9) {
      if (inputType == 'radio' || inputType == 'checkbox') {
          element.checked = !element.checked;
      }

      // WTF!!! Error: Unspecified error.
      // Don't know why, but some elements when detached seem to be in inconsistent state and
      // calling .fireEvent() on them will result in very unhelpful error (Error: Unspecified error)
      // forcing the browser to compute the element position (by reading its CSS)
      // puts the element in consistent state.
      element.style.posLeft;

      // TODO(vojta): create event objects with pressed keys to get it working on IE<9
      var ret = element.fireEvent('on' + eventType);
      if (inputType == 'submit') {
        while(element) {
          if (element.nodeName.toLowerCase() == 'form') {
            element.fireEvent('onsubmit');
            break;
          }
          element = element.parentNode;
        }
      }
      return ret;
    } else {
      var evnt;
      if(/transitionend/.test(eventType)) {
        if(window.WebKitTransitionEvent) {
          evnt = new WebKitTransitionEvent(eventType, eventData);
          evnt.initEvent(eventType, false, true);
        }
        else {
          try {
            evnt = new TransitionEvent(eventType, eventData);
          }
          catch(e) {
            evnt = document.createEvent('TransitionEvent');
            evnt.initTransitionEvent(eventType, null, null, null, eventData.elapsedTime || 0);
          }
        }
      }
      else if(/animationend/.test(eventType)) {
        if(window.WebKitAnimationEvent) {
          evnt = new WebKitAnimationEvent(eventType, eventData);
          evnt.initEvent(eventType, false, true);
        }
        else {
          try {
            evnt = new AnimationEvent(eventType, eventData);
          }
          catch(e) {
            evnt = document.createEvent('AnimationEvent');
            evnt.initAnimationEvent(eventType, null, null, null, eventData.elapsedTime || 0);
          }
        }
      }
      else {
        evnt = document.createEvent('MouseEvents');
        x = x || 0;
        y = y || 0;
        evnt.initMouseEvent(eventType, true, true, window, 0, x, y, x, y, pressed('ctrl'), pressed('alt'),
            pressed('shift'), pressed('meta'), 0, element);
      }

      /* we're unable to change the timeStamp value directly so this
       * is only here to allow for testing where the timeStamp value is
       * read */
      evnt.$manualTimeStamp = eventData.timeStamp;

      if(!evnt) return;

      var originalPreventDefault = evnt.preventDefault,
          appWindow = element.ownerDocument.defaultView,
          fakeProcessDefault = true,
          finalProcessDefault,
          angular = appWindow.angular || {};

      // igor: temporary fix for https://bugzilla.mozilla.org/show_bug.cgi?id=684208
      angular['ff-684208-preventDefault'] = false;
      evnt.preventDefault = function() {
        fakeProcessDefault = false;
        return originalPreventDefault.apply(evnt, arguments);
      };

      element.dispatchEvent(evnt);
      finalProcessDefault = !(angular['ff-684208-preventDefault'] || !fakeProcessDefault);

      delete angular['ff-684208-preventDefault'];

      return finalProcessDefault;
    }
  }
}());

/**
 * Represents the application currently being tested and abstracts usage
 * of iframes or separate windows.
 *
 * @param {Object} context jQuery wrapper around HTML context.
 */
angular.scenario.Application = function(context) {
  this.context = context;
  context.append(
    '<h2>Current URL: <a href="about:blank">None</a></h2>' +
    '<div id="test-frames"></div>'
  );
};

/**
 * Gets the jQuery collection of frames. Don't use this directly because
 * frames may go stale.
 *
 * @private
 * @return {Object} jQuery collection
 */
angular.scenario.Application.prototype.getFrame_ = function() {
  return this.context.find('#test-frames iframe:last');
};

/**
 * Gets the window of the test runner frame. Always favor executeAction()
 * instead of this method since it prevents you from getting a stale window.
 *
 * @private
 * @return {Object} the window of the frame
 */
angular.scenario.Application.prototype.getWindow_ = function() {
  var contentWindow = this.getFrame_().prop('contentWindow');
  if (!contentWindow)
    throw 'Frame window is not accessible.';
  return contentWindow;
};

/**
 * Changes the location of the frame.
 *
 * @param {string} url The URL. If it begins with a # then only the
 *   hash of the page is changed.
 * @param {function()} loadFn function($window, $document) Called when frame loads.
 * @param {function()} errorFn function(error) Called if any error when loading.
 */
angular.scenario.Application.prototype.navigateTo = function(url, loadFn, errorFn) {
  var self = this;
  var frame = self.getFrame_();
  //TODO(esprehn): Refactor to use rethrow()
  errorFn = errorFn || function(e) { throw e; };
  if (url === 'about:blank') {
    errorFn('Sandbox Error: Navigating to about:blank is not allowed.');
  } else if (url.charAt(0) === '#') {
    url = frame.attr('src').split('#')[0] + url;
    frame.attr('src', url);
    self.executeAction(loadFn);
  } else {
    frame.remove();
    self.context.find('#test-frames').append('<iframe>');
    frame = self.getFrame_();

    frame.load(function() {
      frame.off();
      try {
        var $window = self.getWindow_();

        if ($window.angular) {
          // Disable animations

          // TODO(i): this doesn't disable javascript animations
          //          we don't need that for our tests, but it should be done
          $window.angular.resumeBootstrap([['$provide', function($provide) {
            $provide.decorator('$sniffer', function($delegate) {
              $delegate.transitions = false;
              $delegate.animations = false;
              return $delegate;
            });
          }]]);
        }

        self.executeAction(loadFn);
      } catch (e) {
        errorFn(e);
      }
    }).attr('src', url);

    // for IE compatibility set the name *after* setting the frame url
    frame[0].contentWindow.name = "NG_DEFER_BOOTSTRAP!";
  }
  self.context.find('> h2 a').attr('href', url).text(url);
};

/**
 * Executes a function in the context of the tested application. Will wait
 * for all pending angular xhr requests before executing.
 *
 * @param {function()} action The callback to execute. function($window, $document)
 *  $document is a jQuery wrapped document.
 */
angular.scenario.Application.prototype.executeAction = function(action) {
  var self = this;
  var $window = this.getWindow_();
  if (!$window.document) {
    throw 'Sandbox Error: Application document not accessible.';
  }
  if (!$window.angular) {
    return action.call(this, $window, _jQuery($window.document));
  }
  angularInit($window.document, function(element) {
    var $injector = $window.angular.element(element).injector();
    var $element = _jQuery(element);

    $element.injector = function() {
      return $injector;
    };

    $injector.invoke(function($browser){
      $browser.notifyWhenNoOutstandingRequests(function() {
        action.call(self, $window, $element);
      });
    });
  });
};

/**
 * The representation of define blocks. Don't used directly, instead use
 * define() in your tests.
 *
 * @param {string} descName Name of the block
 * @param {Object} parent describe or undefined if the root.
 */
angular.scenario.Describe = function(descName, parent) {
  this.only = parent && parent.only;
  this.beforeEachFns = [];
  this.afterEachFns = [];
  this.its = [];
  this.children = [];
  this.name = descName;
  this.parent = parent;
  this.id = angular.scenario.Describe.id++;

  /**
   * Calls all before functions.
   */
  var beforeEachFns = this.beforeEachFns;
  this.setupBefore = function() {
    if (parent) parent.setupBefore.call(this);
    angular.forEach(beforeEachFns, function(fn) { fn.call(this); }, this);
  };

  /**
   * Calls all after functions.
   */
  var afterEachFns = this.afterEachFns;
  this.setupAfter  = function() {
    angular.forEach(afterEachFns, function(fn) { fn.call(this); }, this);
    if (parent) parent.setupAfter.call(this);
  };
};

// Shared Unique ID generator for every describe block
angular.scenario.Describe.id = 0;

// Shared Unique ID generator for every it (spec)
angular.scenario.Describe.specId = 0;

/**
 * Defines a block to execute before each it or nested describe.
 *
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.beforeEach = function(body) {
  this.beforeEachFns.push(body);
};

/**
 * Defines a block to execute after each it or nested describe.
 *
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.afterEach = function(body) {
  this.afterEachFns.push(body);
};

/**
 * Creates a new describe block that's a child of this one.
 *
 * @param {string} name Name of the block. Appended to the parent block's name.
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.describe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  this.children.push(child);
  body.call(child);
};

/**
 * Same as describe() but makes ddescribe blocks the only to run.
 *
 * @param {string} name Name of the test.
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.ddescribe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  child.only = true;
  this.children.push(child);
  body.call(child);
};

/**
 * Use to disable a describe block.
 */
angular.scenario.Describe.prototype.xdescribe = angular.noop;

/**
 * Defines a test.
 *
 * @param {string} name Name of the test.
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.it = function(name, body) {
  this.its.push({
    id: angular.scenario.Describe.specId++,
    definition: this,
    only: this.only,
    name: name,
    before: this.setupBefore,
    body: body,
    after: this.setupAfter
  });
};

/**
 * Same as it() but makes iit tests the only test to run.
 *
 * @param {string} name Name of the test.
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.iit = function(name, body) {
  this.it.apply(this, arguments);
  this.its[this.its.length-1].only = true;
};

/**
 * Use to disable a test block.
 */
angular.scenario.Describe.prototype.xit = angular.noop;

/**
 * Gets an array of functions representing all the tests (recursively).
 * that can be executed with SpecRunner's.
 *
 * @return {Array<Object>} Array of it blocks {
 *   definition : Object // parent Describe
 *   only: boolean
 *   name: string
 *   before: Function
 *   body: Function
 *   after: Function
 *  }
 */
angular.scenario.Describe.prototype.getSpecs = function() {
  var specs = arguments[0] || [];
  angular.forEach(this.children, function(child) {
    child.getSpecs(specs);
  });
  angular.forEach(this.its, function(it) {
    specs.push(it);
  });
  var only = [];
  angular.forEach(specs, function(it) {
    if (it.only) {
      only.push(it);
    }
  });
  return (only.length && only) || specs;
};

/**
 * A future action in a spec.
 *
 * @param {string} name name of the future action
 * @param {function()} behavior future callback(error, result)
 * @param {function()} line Optional. function that returns the file/line number.
 */
angular.scenario.Future = function(name, behavior, line) {
  this.name = name;
  this.behavior = behavior;
  this.fulfilled = false;
  this.value = undefined;
  this.parser = angular.identity;
  this.line = line || function() { return ''; };
};

/**
 * Executes the behavior of the closure.
 *
 * @param {function()} doneFn Callback function(error, result)
 */
angular.scenario.Future.prototype.execute = function(doneFn) {
  var self = this;
  this.behavior(function(error, result) {
    self.fulfilled = true;
    if (result) {
      try {
        result = self.parser(result);
      } catch(e) {
        error = e;
      }
    }
    self.value = error || result;
    doneFn(error, result);
  });
};

/**
 * Configures the future to convert it's final with a function fn(value)
 *
 * @param {function()} fn function(value) that returns the parsed value
 */
angular.scenario.Future.prototype.parsedWith = function(fn) {
  this.parser = fn;
  return this;
};

/**
 * Configures the future to parse it's final value from JSON
 * into objects.
 */
angular.scenario.Future.prototype.fromJson = function() {
  return this.parsedWith(angular.fromJson);
};

/**
 * Configures the future to convert it's final value from objects
 * into JSON.
 */
angular.scenario.Future.prototype.toJson = function() {
  return this.parsedWith(angular.toJson);
};

/**
 * Maintains an object tree from the runner events.
 *
 * @param {Object} runner The scenario Runner instance to connect to.
 *
 * TODO(esprehn): Every output type creates one of these, but we probably
 *  want one global shared instance. Need to handle events better too
 *  so the HTML output doesn't need to do spec model.getSpec(spec.id)
 *  silliness.
 *
 * TODO(vojta) refactor on, emit methods (from all objects) - use inheritance
 */
angular.scenario.ObjectModel = function(runner) {
  var self = this;

  this.specMap = {};
  this.listeners = [];
  this.value = {
    name: '',
    children: {}
  };

  runner.on('SpecBegin', function(spec) {
    var block = self.value,
        definitions = [];

    angular.forEach(self.getDefinitionPath(spec), function(def) {
      if (!block.children[def.name]) {
        block.children[def.name] = {
          id: def.id,
          name: def.name,
          children: {},
          specs: {}
        };
      }
      block = block.children[def.name];
      definitions.push(def.name);
    });

    var it = self.specMap[spec.id] =
             block.specs[spec.name] =
             new angular.scenario.ObjectModel.Spec(spec.id, spec.name, definitions);

    // forward the event
    self.emit('SpecBegin', it);
  });

  runner.on('SpecError', function(spec, error) {
    var it = self.getSpec(spec.id);
    it.status = 'error';
    it.error = error;

    // forward the event
    self.emit('SpecError', it, error);
  });

  runner.on('SpecEnd', function(spec) {
    var it = self.getSpec(spec.id);
    complete(it);

    // forward the event
    self.emit('SpecEnd', it);
  });

  runner.on('StepBegin', function(spec, step) {
    var it = self.getSpec(spec.id);
    var step = new angular.scenario.ObjectModel.Step(step.name);
    it.steps.push(step);

    // forward the event
    self.emit('StepBegin', it, step);
  });

  runner.on('StepEnd', function(spec) {
    var it = self.getSpec(spec.id);
    var step = it.getLastStep();
    if (step.name !== step.name)
      throw 'Events fired in the wrong order. Step names don\'t match.';
    complete(step);

    // forward the event
    self.emit('StepEnd', it, step);
  });

  runner.on('StepFailure', function(spec, step, error) {
    var it = self.getSpec(spec.id),
        modelStep = it.getLastStep();

    modelStep.setErrorStatus('failure', error, step.line());
    it.setStatusFromStep(modelStep);

    // forward the event
    self.emit('StepFailure', it, modelStep, error);
  });

  runner.on('StepError', function(spec, step, error) {
    var it = self.getSpec(spec.id),
        modelStep = it.getLastStep();

    modelStep.setErrorStatus('error', error, step.line());
    it.setStatusFromStep(modelStep);

    // forward the event
    self.emit('StepError', it, modelStep, error);
  });

  runner.on('RunnerBegin', function() {
    self.emit('RunnerBegin');
  });
  runner.on('RunnerEnd', function() {
    self.emit('RunnerEnd');
  });

  function complete(item) {
    item.endTime = new Date().getTime();
    item.duration = item.endTime - item.startTime;
    item.status = item.status || 'success';
  }
};

/**
 * Adds a listener for an event.
 *
 * @param {string} eventName Name of the event to add a handler for
 * @param {function()} listener Function that will be called when event is fired
 */
angular.scenario.ObjectModel.prototype.on = function(eventName, listener) {
  eventName = eventName.toLowerCase();
  this.listeners[eventName] = this.listeners[eventName] || [];
  this.listeners[eventName].push(listener);
};

/**
 * Emits an event which notifies listeners and passes extra
 * arguments.
 *
 * @param {string} eventName Name of the event to fire.
 */
angular.scenario.ObjectModel.prototype.emit = function(eventName) {
  var self = this,
      args = Array.prototype.slice.call(arguments, 1),
      eventName = eventName.toLowerCase();

  if (this.listeners[eventName]) {
    angular.forEach(this.listeners[eventName], function(listener) {
      listener.apply(self, args);
    });
  }
};

/**
 * Computes the path of definition describe blocks that wrap around
 * this spec.
 *
 * @param spec Spec to compute the path for.
 * @return {Array<Describe>} The describe block path
 */
angular.scenario.ObjectModel.prototype.getDefinitionPath = function(spec) {
  var path = [];
  var currentDefinition = spec.definition;
  while (currentDefinition && currentDefinition.name) {
    path.unshift(currentDefinition);
    currentDefinition = currentDefinition.parent;
  }
  return path;
};

/**
 * Gets a spec by id.
 *
 * @param {string} id The id of the spec to get the object for.
 * @return {Object} the Spec instance
 */
angular.scenario.ObjectModel.prototype.getSpec = function(id) {
  return this.specMap[id];
};

/**
 * A single it block.
 *
 * @param {string} id Id of the spec
 * @param {string} name Name of the spec
 * @param {Array<string>=} definitionNames List of all describe block names that wrap this spec
 */
angular.scenario.ObjectModel.Spec = function(id, name, definitionNames) {
  this.id = id;
  this.name = name;
  this.startTime = new Date().getTime();
  this.steps = [];
  this.fullDefinitionName = (definitionNames || []).join(' ');
};

/**
 * Adds a new step to the Spec.
 *
 * @param {string} name Name of the step (really name of the future)
 * @return {Object} the added step
 */
angular.scenario.ObjectModel.Spec.prototype.addStep = function(name) {
  var step = new angular.scenario.ObjectModel.Step(name);
  this.steps.push(step);
  return step;
};

/**
 * Gets the most recent step.
 *
 * @return {Object} the step
 */
angular.scenario.ObjectModel.Spec.prototype.getLastStep = function() {
  return this.steps[this.steps.length-1];
};

/**
 * Set status of the Spec from given Step
 *
 * @param {angular.scenario.ObjectModel.Step} step
 */
angular.scenario.ObjectModel.Spec.prototype.setStatusFromStep = function(step) {
  if (!this.status || step.status == 'error') {
    this.status = step.status;
    this.error = step.error;
    this.line = step.line;
  }
};

/**
 * A single step inside a Spec.
 *
 * @param {string} name Name of the step
 */
angular.scenario.ObjectModel.Step = function(name) {
  this.name = name;
  this.startTime = new Date().getTime();
};

/**
 * Helper method for setting all error status related properties
 *
 * @param {string} status
 * @param {string} error
 * @param {string} line
 */
angular.scenario.ObjectModel.Step.prototype.setErrorStatus = function(status, error, line) {
  this.status = status;
  this.error = error;
  this.line = line;
};

/**
 * Runner for scenarios
 *
 * Has to be initialized before any test is loaded,
 * because it publishes the API into window (global space).
 */
angular.scenario.Runner = function($window) {
  this.listeners = [];
  this.$window = $window;
  this.rootDescribe = new angular.scenario.Describe();
  this.currentDescribe = this.rootDescribe;
  this.api = {
    it: this.it,
    iit: this.iit,
    xit: angular.noop,
    describe: this.describe,
    ddescribe: this.ddescribe,
    xdescribe: angular.noop,
    beforeEach: this.beforeEach,
    afterEach: this.afterEach
  };
  angular.forEach(this.api, angular.bind(this, function(fn, key) {
    this.$window[key] = angular.bind(this, fn);
  }));
};

/**
 * Emits an event which notifies listeners and passes extra
 * arguments.
 *
 * @param {string} eventName Name of the event to fire.
 */
angular.scenario.Runner.prototype.emit = function(eventName) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  eventName = eventName.toLowerCase();
  if (!this.listeners[eventName])
    return;
  angular.forEach(this.listeners[eventName], function(listener) {
    listener.apply(self, args);
  });
};

/**
 * Adds a listener for an event.
 *
 * @param {string} eventName The name of the event to add a handler for
 * @param {string} listener The fn(...) that takes the extra arguments from emit()
 */
angular.scenario.Runner.prototype.on = function(eventName, listener) {
  eventName = eventName.toLowerCase();
  this.listeners[eventName] = this.listeners[eventName] || [];
  this.listeners[eventName].push(listener);
};

/**
 * Defines a describe block of a spec.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {function()} body Body of the block
 */
angular.scenario.Runner.prototype.describe = function(name, body) {
  var self = this;
  this.currentDescribe.describe(name, function() {
    var parentDescribe = self.currentDescribe;
    self.currentDescribe = this;
    try {
      body.call(this);
    } finally {
      self.currentDescribe = parentDescribe;
    }
  });
};

/**
 * Same as describe, but makes ddescribe the only blocks to run.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {function()} body Body of the block
 */
angular.scenario.Runner.prototype.ddescribe = function(name, body) {
  var self = this;
  this.currentDescribe.ddescribe(name, function() {
    var parentDescribe = self.currentDescribe;
    self.currentDescribe = this;
    try {
      body.call(this);
    } finally {
      self.currentDescribe = parentDescribe;
    }
  });
};

/**
 * Defines a test in a describe block of a spec.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {function()} body Body of the block
 */
angular.scenario.Runner.prototype.it = function(name, body) {
  this.currentDescribe.it(name, body);
};

/**
 * Same as it, but makes iit tests the only tests to run.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {function()} body Body of the block
 */
angular.scenario.Runner.prototype.iit = function(name, body) {
  this.currentDescribe.iit(name, body);
};

/**
 * Defines a function to be called before each it block in the describe
 * (and before all nested describes).
 *
 * @see Describe.js
 *
 * @param {function()} Callback to execute
 */
angular.scenario.Runner.prototype.beforeEach = function(body) {
  this.currentDescribe.beforeEach(body);
};

/**
 * Defines a function to be called after each it block in the describe
 * (and before all nested describes).
 *
 * @see Describe.js
 *
 * @param {function()} Callback to execute
 */
angular.scenario.Runner.prototype.afterEach = function(body) {
  this.currentDescribe.afterEach(body);
};

/**
 * Creates a new spec runner.
 *
 * @private
 * @param {Object} scope parent scope
 */
angular.scenario.Runner.prototype.createSpecRunner_ = function(scope) {
  var child = scope.$new();
  var Cls = angular.scenario.SpecRunner;

  // Export all the methods to child scope manually as now we don't mess controllers with scopes
  // TODO(vojta): refactor scenario runner so that these objects are not tightly coupled as current
  for (var name in Cls.prototype)
    child[name] = angular.bind(child, Cls.prototype[name]);

  Cls.call(child);
  return child;
};

/**
 * Runs all the loaded tests with the specified runner class on the
 * provided application.
 *
 * @param {angular.scenario.Application} application App to remote control.
 */
angular.scenario.Runner.prototype.run = function(application) {
  var self = this;
  var $root = angular.injector(['ng']).get('$rootScope');
  angular.extend($root, this);
  angular.forEach(angular.scenario.Runner.prototype, function(fn, name) {
    $root[name] = angular.bind(self, fn);
  });
  $root.application = application;
  $root.emit('RunnerBegin');
  asyncForEach(this.rootDescribe.getSpecs(), function(spec, specDone) {
    var dslCache = {};
    var runner = self.createSpecRunner_($root);
    angular.forEach(angular.scenario.dsl, function(fn, key) {
      dslCache[key] = fn.call($root);
    });
    angular.forEach(angular.scenario.dsl, function(fn, key) {
      self.$window[key] = function() {
        var line = callerFile(3);
        var scope = runner.$new();

        // Make the dsl accessible on the current chain
        scope.dsl = {};
        angular.forEach(dslCache, function(fn, key) {
          scope.dsl[key] = function() {
            return dslCache[key].apply(scope, arguments);
          };
        });

        // Make these methods work on the current chain
        scope.addFuture = function() {
          Array.prototype.push.call(arguments, line);
          return angular.scenario.SpecRunner.
            prototype.addFuture.apply(scope, arguments);
        };
        scope.addFutureAction = function() {
          Array.prototype.push.call(arguments, line);
          return angular.scenario.SpecRunner.
            prototype.addFutureAction.apply(scope, arguments);
        };

        return scope.dsl[key].apply(scope, arguments);
      };
    });
    runner.run(spec, function() {
      runner.$destroy();
      specDone.apply(this, arguments);
    });
  },
  function(error) {
    if (error) {
      self.emit('RunnerError', error);
    }
    self.emit('RunnerEnd');
  });
};

/**
 * This class is the "this" of the it/beforeEach/afterEach method.
 * Responsibilities:
 *   - "this" for it/beforeEach/afterEach
 *   - keep state for single it/beforeEach/afterEach execution
 *   - keep track of all of the futures to execute
 *   - run single spec (execute each future)
 */
angular.scenario.SpecRunner = function() {
  this.futures = [];
  this.afterIndex = 0;
};

/**
 * Executes a spec which is an it block with associated before/after functions
 * based on the describe nesting.
 *
 * @param {Object} spec A spec object
 * @param {function()} specDone function that is called when the spec finishes. Function(error, index)
 */
angular.scenario.SpecRunner.prototype.run = function(spec, specDone) {
  var self = this;
  this.spec = spec;

  this.emit('SpecBegin', spec);

  try {
    spec.before.call(this);
    spec.body.call(this);
    this.afterIndex = this.futures.length;
    spec.after.call(this);
  } catch (e) {
    this.emit('SpecError', spec, e);
    this.emit('SpecEnd', spec);
    specDone();
    return;
  }

  var handleError = function(error, done) {
    if (self.error) {
      return done();
    }
    self.error = true;
    done(null, self.afterIndex);
  };

  asyncForEach(
    this.futures,
    function(future, futureDone) {
      self.step = future;
      self.emit('StepBegin', spec, future);
      try {
        future.execute(function(error) {
          if (error) {
            self.emit('StepFailure', spec, future, error);
            self.emit('StepEnd', spec, future);
            return handleError(error, futureDone);
          }
          self.emit('StepEnd', spec, future);
          self.$window.setTimeout(function() { futureDone(); }, 0);
        });
      } catch (e) {
        self.emit('StepError', spec, future, e);
        self.emit('StepEnd', spec, future);
        handleError(e, futureDone);
      }
    },
    function(e) {
      if (e) {
        self.emit('SpecError', spec, e);
      }
      self.emit('SpecEnd', spec);
      // Call done in a timeout so exceptions don't recursively
      // call this function
      self.$window.setTimeout(function() { specDone(); }, 0);
    }
  );
};

/**
 * Adds a new future action.
 *
 * Note: Do not pass line manually. It happens automatically.
 *
 * @param {string} name Name of the future
 * @param {function()} behavior Behavior of the future
 * @param {function()} line fn() that returns file/line number
 */
angular.scenario.SpecRunner.prototype.addFuture = function(name, behavior, line) {
  var future = new angular.scenario.Future(name, angular.bind(this, behavior), line);
  this.futures.push(future);
  return future;
};

/**
 * Adds a new future action to be executed on the application window.
 *
 * Note: Do not pass line manually. It happens automatically.
 *
 * @param {string} name Name of the future
 * @param {function()} behavior Behavior of the future
 * @param {function()} line fn() that returns file/line number
 */
angular.scenario.SpecRunner.prototype.addFutureAction = function(name, behavior, line) {
  var self = this;
  var NG = /\[ng\\\:/;
  return this.addFuture(name, function(done) {
    this.application.executeAction(function($window, $document) {

      //TODO(esprehn): Refactor this so it doesn't need to be in here.
      $document.elements = function(selector) {
        var args = Array.prototype.slice.call(arguments, 1);
        selector = (self.selector || '') + ' ' + (selector || '');
        selector = _jQuery.trim(selector) || '*';
        angular.forEach(args, function(value, index) {
          selector = selector.replace('$' + (index + 1), value);
        });
        var result = $document.find(selector);
        if (selector.match(NG)) {
          angular.forEach(['[ng-','[data-ng-','[x-ng-'], function(value, index){
            result = result.add(selector.replace(NG, value), $document);
          });
        }
        if (!result.length) {
          throw {
            type: 'selector',
            message: 'Selector ' + selector + ' did not match any elements.'
          };
        }

        return result;
      };

      try {
        behavior.call(self, $window, $document, done);
      } catch(e) {
        if (e.type && e.type === 'selector') {
          done(e.message);
        } else {
          throw e;
        }
      }
    });
  }, line);
};

/**
 * Shared DSL statements that are useful to all scenarios.
 */

 /**
 * Usage:
 *    pause() pauses until you call resume() in the console
 */
angular.scenario.dsl('pause', function() {
  return function() {
    return this.addFuture('pausing for you to resume', function(done) {
      this.emit('InteractivePause', this.spec, this.step);
      this.$window.resume = function() { done(); };
    });
  };
});

/**
 * Usage:
 *    sleep(seconds) pauses the test for specified number of seconds
 */
angular.scenario.dsl('sleep', function() {
  return function(time) {
    return this.addFuture('sleep for ' + time + ' seconds', function(done) {
      this.$window.setTimeout(function() { done(null, time * 1000); }, time * 1000);
    });
  };
});

/**
 * Usage:
 *    browser().navigateTo(url) Loads the url into the frame
 *    browser().navigateTo(url, fn) where fn(url) is called and returns the URL to navigate to
 *    browser().reload() refresh the page (reload the same URL)
 *    browser().window.href() window.location.href
 *    browser().window.path() window.location.pathname
 *    browser().window.search() window.location.search
 *    browser().window.hash() window.location.hash without # prefix
 *    browser().location().url() see ng.$location#url
 *    browser().location().path() see ng.$location#path
 *    browser().location().search() see ng.$location#search
 *    browser().location().hash() see ng.$location#hash
 */
angular.scenario.dsl('browser', function() {
  var chain = {};

  chain.navigateTo = function(url, delegate) {
    var application = this.application;
    return this.addFuture("browser navigate to '" + url + "'", function(done) {
      if (delegate) {
        url = delegate.call(this, url);
      }
      application.navigateTo(url, function() {
        done(null, url);
      }, done);
    });
  };

  chain.reload = function() {
    var application = this.application;
    return this.addFutureAction('browser reload', function($window, $document, done) {
      var href = $window.location.href;
      application.navigateTo(href, function() {
        done(null, href);
      }, done);
    });
  };

  chain.window = function() {
    var api = {};

    api.href = function() {
      return this.addFutureAction('window.location.href', function($window, $document, done) {
        done(null, $window.location.href);
      });
    };

    api.path = function() {
      return this.addFutureAction('window.location.path', function($window, $document, done) {
        done(null, $window.location.pathname);
      });
    };

    api.search = function() {
      return this.addFutureAction('window.location.search', function($window, $document, done) {
        done(null, $window.location.search);
      });
    };

    api.hash = function() {
      return this.addFutureAction('window.location.hash', function($window, $document, done) {
        done(null, $window.location.hash.replace('#', ''));
      });
    };

    return api;
  };

  chain.location = function() {
    var api = {};

    api.url = function() {
      return this.addFutureAction('$location.url()', function($window, $document, done) {
        done(null, $document.injector().get('$location').url());
      });
    };

    api.path = function() {
      return this.addFutureAction('$location.path()', function($window, $document, done) {
        done(null, $document.injector().get('$location').path());
      });
    };

    api.search = function() {
      return this.addFutureAction('$location.search()', function($window, $document, done) {
        done(null, $document.injector().get('$location').search());
      });
    };

    api.hash = function() {
      return this.addFutureAction('$location.hash()', function($window, $document, done) {
        done(null, $document.injector().get('$location').hash());
      });
    };

    return api;
  };

  return function() {
    return chain;
  };
});

/**
 * Usage:
 *    expect(future).{matcher} where matcher is one of the matchers defined
 *    with angular.scenario.matcher
 *
 * ex. expect(binding("name")).toEqual("Elliott")
 */
angular.scenario.dsl('expect', function() {
  var chain = angular.extend({}, angular.scenario.matcher);

  chain.not = function() {
    this.inverse = true;
    return chain;
  };

  return function(future) {
    this.future = future;
    return chain;
  };
});

/**
 * Usage:
 *    using(selector, label) scopes the next DSL element selection
 *
 * ex.
 *   using('#foo', "'Foo' text field").input('bar')
 */
angular.scenario.dsl('using', function() {
  return function(selector, label) {
    this.selector = _jQuery.trim((this.selector||'') + ' ' + selector);
    if (angular.isString(label) && label.length) {
      this.label = label + ' ( ' + this.selector + ' )';
    } else {
      this.label = this.selector;
    }
    return this.dsl;
  };
});

/**
 * Usage:
 *    binding(name) returns the value of the first matching binding
 */
angular.scenario.dsl('binding', function() {
  return function(name) {
    return this.addFutureAction("select binding '" + name + "'", function($window, $document, done) {
      var values = $document.elements().bindings($window.angular.element, name);
      if (!values.length) {
        return done("Binding selector '" + name + "' did not match.");
      }
      done(null, values[0]);
    });
  };
});

/**
 * Usage:
 *    input(name).enter(value) enters value in input with specified name
 *    input(name).check() checks checkbox
 *    input(name).select(value) selects the radio button with specified name/value
 *    input(name).val() returns the value of the input.
 */
angular.scenario.dsl('input', function() {
  var chain = {};
  var supportInputEvent =  'oninput' in document.createElement('div') && msie != 9;

  chain.enter = function(value, event) {
    return this.addFutureAction("input '" + this.name + "' enter '" + value + "'", function($window, $document, done) {
      var input = $document.elements('[ng\\:model="$1"]', this.name).filter(':input');
      input.val(value);
      input.trigger(event || (supportInputEvent ? 'input' : 'change'));
      done();
    });
  };

  chain.check = function() {
    return this.addFutureAction("checkbox '" + this.name + "' toggle", function($window, $document, done) {
      var input = $document.elements('[ng\\:model="$1"]', this.name).filter(':checkbox');
      input.trigger('click');
      done();
    });
  };

  chain.select = function(value) {
    return this.addFutureAction("radio button '" + this.name + "' toggle '" + value + "'", function($window, $document, done) {
      var input = $document.
        elements('[ng\\:model="$1"][value="$2"]', this.name, value).filter(':radio');
      input.trigger('click');
      done();
    });
  };

  chain.val = function() {
    return this.addFutureAction("return input val", function($window, $document, done) {
      var input = $document.elements('[ng\\:model="$1"]', this.name).filter(':input');
      done(null,input.val());
    });
  };

  return function(name) {
    this.name = name;
    return chain;
  };
});


/**
 * Usage:
 *    repeater('#products table', 'Product List').count() number of rows
 *    repeater('#products table', 'Product List').row(1) all bindings in row as an array
 *    repeater('#products table', 'Product List').column('product.name') all values across all rows in an array
 */
angular.scenario.dsl('repeater', function() {
  var chain = {};

  chain.count = function() {
    return this.addFutureAction("repeater '" + this.label + "' count", function($window, $document, done) {
      try {
        done(null, $document.elements().length);
      } catch (e) {
        done(null, 0);
      }
    });
  };

  chain.column = function(binding) {
    return this.addFutureAction("repeater '" + this.label + "' column '" + binding + "'", function($window, $document, done) {
      done(null, $document.elements().bindings($window.angular.element, binding));
    });
  };

  chain.row = function(index) {
    return this.addFutureAction("repeater '" + this.label + "' row '" + index + "'", function($window, $document, done) {
      var matches = $document.elements().slice(index, index + 1);
      if (!matches.length)
        return done('row ' + index + ' out of bounds');
      done(null, matches.bindings($window.angular.element));
    });
  };

  return function(selector, label) {
    this.dsl.using(selector, label);
    return chain;
  };
});

/**
 * Usage:
 *    select(name).option('value') select one option
 *    select(name).options('value1', 'value2', ...) select options from a multi select
 */
angular.scenario.dsl('select', function() {
  var chain = {};

  chain.option = function(value) {
    return this.addFutureAction("select '" + this.name + "' option '" + value + "'", function($window, $document, done) {
      var select = $document.elements('select[ng\\:model="$1"]', this.name);
      var option = select.find('option[value="' + value + '"]');
      if (option.length) {
        select.val(value);
      } else {
        option = select.find('option').filter(function(){
          return _jQuery(this).text() === value;
        });
        if (!option.length) {
          option = select.find('option:contains("' + value + '")');
        }
        if (option.length) {
          select.val(option.val());
        } else {
            return done("option '" + value + "' not found");
        }
      }
      select.trigger('change');
      done();
    });
  };

  chain.options = function() {
    var values = arguments;
    return this.addFutureAction("select '" + this.name + "' options '" + values + "'", function($window, $document, done) {
      var select = $document.elements('select[multiple][ng\\:model="$1"]', this.name);
      select.val(values);
      select.trigger('change');
      done();
    });
  };

  return function(name) {
    this.name = name;
    return chain;
  };
});

/**
 * Usage:
 *    element(selector, label).count() get the number of elements that match selector
 *    element(selector, label).click() clicks an element
 *    element(selector, label).mouseover() mouseover an element
 *    element(selector, label).mousedown() mousedown an element
 *    element(selector, label).mouseup() mouseup an element
 *    element(selector, label).query(fn) executes fn(selectedElements, done)
 *    element(selector, label).{method}() gets the value (as defined by jQuery, ex. val)
 *    element(selector, label).{method}(value) sets the value (as defined by jQuery, ex. val)
 *    element(selector, label).{method}(key) gets the value (as defined by jQuery, ex. attr)
 *    element(selector, label).{method}(key, value) sets the value (as defined by jQuery, ex. attr)
 */
angular.scenario.dsl('element', function() {
  var KEY_VALUE_METHODS = ['attr', 'css', 'prop'];
  var VALUE_METHODS = [
    'val', 'text', 'html', 'height', 'innerHeight', 'outerHeight', 'width',
    'innerWidth', 'outerWidth', 'position', 'scrollLeft', 'scrollTop', 'offset'
  ];
  var chain = {};

  chain.count = function() {
    return this.addFutureAction("element '" + this.label + "' count", function($window, $document, done) {
      try {
        done(null, $document.elements().length);
      } catch (e) {
        done(null, 0);
      }
    });
  };

  chain.click = function() {
    return this.addFutureAction("element '" + this.label + "' click", function($window, $document, done) {
      var elements = $document.elements();
      var href = elements.attr('href');
      var eventProcessDefault = elements.trigger('click')[0];

      if (href && elements[0].nodeName.toUpperCase() === 'A' && eventProcessDefault) {
        this.application.navigateTo(href, function() {
          done();
        }, done);
      } else {
        done();
      }
    });
  };

  chain.dblclick = function() {
    return this.addFutureAction("element '" + this.label + "' dblclick", function($window, $document, done) {
      var elements = $document.elements();
      var href = elements.attr('href');
      var eventProcessDefault = elements.trigger('dblclick')[0];

      if (href && elements[0].nodeName.toUpperCase() === 'A' && eventProcessDefault) {
        this.application.navigateTo(href, function() {
          done();
        }, done);
      } else {
        done();
      }
    });
  };

  chain.mouseover = function() {
    return this.addFutureAction("element '" + this.label + "' mouseover", function($window, $document, done) {
      var elements = $document.elements();
      elements.trigger('mouseover');
      done();
    });
  };

  chain.mousedown = function() {
      return this.addFutureAction("element '" + this.label + "' mousedown", function($window, $document, done) {
        var elements = $document.elements();
        elements.trigger('mousedown');
        done();
      });
    };

  chain.mouseup = function() {
      return this.addFutureAction("element '" + this.label + "' mouseup", function($window, $document, done) {
        var elements = $document.elements();
        elements.trigger('mouseup');
        done();
      });
    };

  chain.query = function(fn) {
    return this.addFutureAction('element ' + this.label + ' custom query', function($window, $document, done) {
      fn.call(this, $document.elements(), done);
    });
  };

  angular.forEach(KEY_VALUE_METHODS, function(methodName) {
    chain[methodName] = function(name, value) {
      var args = arguments,
          futureName = (args.length == 1)
              ? "element '" + this.label + "' get " + methodName + " '" + name + "'"
              : "element '" + this.label + "' set " + methodName + " '" + name + "' to " + "'" + value + "'";

      return this.addFutureAction(futureName, function($window, $document, done) {
        var element = $document.elements();
        done(null, element[methodName].apply(element, args));
      });
    };
  });

  angular.forEach(VALUE_METHODS, function(methodName) {
    chain[methodName] = function(value) {
      var args = arguments,
          futureName = (args.length == 0)
              ? "element '" + this.label + "' " + methodName
              : futureName = "element '" + this.label + "' set " + methodName + " to '" + value + "'";

      return this.addFutureAction(futureName, function($window, $document, done) {
        var element = $document.elements();
        done(null, element[methodName].apply(element, args));
      });
    };
  });

  return function(selector, label) {
    this.dsl.using(selector, label);
    return chain;
  };
});

/**
 * Matchers for implementing specs. Follows the Jasmine spec conventions.
 */

angular.scenario.matcher('toEqual', function(expected) {
  return angular.equals(this.actual, expected);
});

angular.scenario.matcher('toBe', function(expected) {
  return this.actual === expected;
});

angular.scenario.matcher('toBeDefined', function() {
  return angular.isDefined(this.actual);
});

angular.scenario.matcher('toBeTruthy', function() {
  return this.actual;
});

angular.scenario.matcher('toBeFalsy', function() {
  return !this.actual;
});

angular.scenario.matcher('toMatch', function(expected) {
  return new RegExp(expected).test(this.actual);
});

angular.scenario.matcher('toBeNull', function() {
  return this.actual === null;
});

angular.scenario.matcher('toContain', function(expected) {
  return includes(this.actual, expected);
});

angular.scenario.matcher('toBeLessThan', function(expected) {
  return this.actual < expected;
});

angular.scenario.matcher('toBeGreaterThan', function(expected) {
  return this.actual > expected;
});

/**
 * User Interface for the Scenario Runner.
 *
 * TODO(esprehn): This should be refactored now that ObjectModel exists
 *  to use angular bindings for the UI.
 */
angular.scenario.output('html', function(context, runner, model) {
  var specUiMap = {},
      lastStepUiMap = {};

  context.append(
    '<div id="header">' +
    '  <h1><span class="angular">AngularJS</span>: Scenario Test Runner</h1>' +
    '  <ul id="status-legend" class="status-display">' +
    '    <li class="status-error">0 Errors</li>' +
    '    <li class="status-failure">0 Failures</li>' +
    '    <li class="status-success">0 Passed</li>' +
    '  </ul>' +
    '</div>' +
    '<div id="specs">' +
    '  <div class="test-children"></div>' +
    '</div>'
  );

  runner.on('InteractivePause', function(spec) {
    var ui = lastStepUiMap[spec.id];
    ui.find('.test-title').
      html('paused... <a href="javascript:resume()">resume</a> when ready.');
  });

  runner.on('SpecBegin', function(spec) {
    var ui = findContext(spec);
    ui.find('> .tests').append(
      '<li class="status-pending test-it"></li>'
    );
    ui = ui.find('> .tests li:last');
    ui.append(
      '<div class="test-info">' +
      '  <p class="test-title">' +
      '    <span class="timer-result"></span>' +
      '    <span class="test-name"></span>' +
      '  </p>' +
      '</div>' +
      '<div class="scrollpane">' +
      '  <ol class="test-actions"></ol>' +
      '</div>'
    );
    ui.find('> .test-info .test-name').text(spec.name);
    ui.find('> .test-info').click(function() {
      var scrollpane = ui.find('> .scrollpane');
      var actions = scrollpane.find('> .test-actions');
      var name = context.find('> .test-info .test-name');
      if (actions.find(':visible').length) {
        actions.hide();
        name.removeClass('open').addClass('closed');
      } else {
        actions.show();
        scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
        name.removeClass('closed').addClass('open');
      }
    });

    specUiMap[spec.id] = ui;
  });

  runner.on('SpecError', function(spec, error) {
    var ui = specUiMap[spec.id];
    ui.append('<pre></pre>');
    ui.find('> pre').text(formatException(error));
  });

  runner.on('SpecEnd', function(spec) {
    var ui = specUiMap[spec.id];
    spec = model.getSpec(spec.id);
    ui.removeClass('status-pending');
    ui.addClass('status-' + spec.status);
    ui.find("> .test-info .timer-result").text(spec.duration + "ms");
    if (spec.status === 'success') {
      ui.find('> .test-info .test-name').addClass('closed');
      ui.find('> .scrollpane .test-actions').hide();
    }
    updateTotals(spec.status);
  });

  runner.on('StepBegin', function(spec, step) {
    var ui = specUiMap[spec.id];
    spec = model.getSpec(spec.id);
    step = spec.getLastStep();
    ui.find('> .scrollpane .test-actions').append('<li class="status-pending"></li>');
    var stepUi = lastStepUiMap[spec.id] = ui.find('> .scrollpane .test-actions li:last');
    stepUi.append(
      '<div class="timer-result"></div>' +
      '<div class="test-title"></div>'
    );
    stepUi.find('> .test-title').text(step.name);
    var scrollpane = stepUi.parents('.scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });

  runner.on('StepFailure', function(spec, step, error) {
    var ui = lastStepUiMap[spec.id];
    addError(ui, step.line, error);
  });

  runner.on('StepError', function(spec, step, error) {
    var ui = lastStepUiMap[spec.id];
    addError(ui, step.line, error);
  });

  runner.on('StepEnd', function(spec, step) {
    var stepUi = lastStepUiMap[spec.id];
    spec = model.getSpec(spec.id);
    step = spec.getLastStep();
    stepUi.find('.timer-result').text(step.duration + 'ms');
    stepUi.removeClass('status-pending');
    stepUi.addClass('status-' + step.status);
    var scrollpane = specUiMap[spec.id].find('> .scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });

  /**
   * Finds the context of a spec block defined by the passed definition.
   *
   * @param {Object} The definition created by the Describe object.
   */
  function findContext(spec) {
    var currentContext = context.find('#specs');
    angular.forEach(model.getDefinitionPath(spec), function(defn) {
      var id = 'describe-' + defn.id;
      if (!context.find('#' + id).length) {
        currentContext.find('> .test-children').append(
          '<div class="test-describe" id="' + id + '">' +
          '  <h2></h2>' +
          '  <div class="test-children"></div>' +
          '  <ul class="tests"></ul>' +
          '</div>'
        );
        context.find('#' + id).find('> h2').text('describe: ' + defn.name);
      }
      currentContext = context.find('#' + id);
    });
    return context.find('#describe-' + spec.definition.id);
  }

  /**
   * Updates the test counter for the status.
   *
   * @param {string} the status.
   */
  function updateTotals(status) {
    var legend = context.find('#status-legend .status-' + status);
    var parts = legend.text().split(' ');
    var value = (parts[0] * 1) + 1;
    legend.text(value + ' ' + parts[1]);
  }

  /**
   * Add an error to a step.
   *
   * @param {Object} The JQuery wrapped context
   * @param {function()} fn() that should return the file/line number of the error
   * @param {Object} the error.
   */
  function addError(context, line, error) {
    context.find('.test-title').append('<pre></pre>');
    var message = _jQuery.trim(line() + '\n\n' + formatException(error));
    context.find('.test-title pre:last').text(message);
  }
});

/**
 * Generates JSON output into a context.
 */
angular.scenario.output('json', function(context, runner, model) {
  model.on('RunnerEnd', function() {
    context.text(angular.toJson(model.value));
  });
});

/**
 * Generates XML output into a context.
 */
angular.scenario.output('xml', function(context, runner, model) {
  var $ = function(args) {return new context.init(args);};
  model.on('RunnerEnd', function() {
    var scenario = $('<scenario></scenario>');
    context.append(scenario);
    serializeXml(scenario, model.value);
  });

  /**
   * Convert the tree into XML.
   *
   * @param {Object} context jQuery context to add the XML to.
   * @param {Object} tree node to serialize
   */
  function serializeXml(context, tree) {
     angular.forEach(tree.children, function(child) {
       var describeContext = $('<describe></describe>');
       describeContext.attr('id', child.id);
       describeContext.attr('name', child.name);
       context.append(describeContext);
       serializeXml(describeContext, child);
     });
     var its = $('<its></its>');
     context.append(its);
     angular.forEach(tree.specs, function(spec) {
       var it = $('<it></it>');
       it.attr('id', spec.id);
       it.attr('name', spec.name);
       it.attr('duration', spec.duration);
       it.attr('status', spec.status);
       its.append(it);
       angular.forEach(spec.steps, function(step) {
         var stepContext = $('<step></step>');
         stepContext.attr('name', step.name);
         stepContext.attr('duration', step.duration);
         stepContext.attr('status', step.status);
         it.append(stepContext);
         if (step.error) {
           var error = $('<error></error>');
           stepContext.append(error);
           error.text(formatException(step.error));
         }
       });
     });
   }
});

/**
 * Creates a global value $result with the result of the runner.
 */
angular.scenario.output('object', function(context, runner, model) {
  runner.$window.$result = model.value;
});

bindJQuery();
publishExternalAPI(angular);

var $runner = new angular.scenario.Runner(window),
    scripts = document.getElementsByTagName('script'),
    script = scripts[scripts.length - 1],
    config = {};

angular.forEach(script.attributes, function(attr) {
  var match = attr.name.match(/ng[:\-](.*)/);
  if (match) {
    config[match[1]] = attr.value || true;
  }
});

if (config.autotest) {
  JQLite(document).ready(function() {
    angular.scenario.setUpAndRun(config);
  });
}
})(window, document);

angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";\n\n[ng\\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak],\n.ng-cloak, .x-ng-cloak,\n.ng-hide {\n  display: none !important;\n}\n\nng\\:form {\n  display: block;\n}\n</style>');
angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";\n/* CSS Document */\n\n/** Structure */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  font-size: 14px;\n}\n\n#system-error {\n  font-size: 1.5em;\n  text-align: center;\n}\n\n#json, #xml {\n  display: none;\n}\n\n#header {\n  position: fixed;\n  width: 100%;\n}\n\n#specs {\n  padding-top: 50px;\n}\n\n#header .angular {\n  font-family: Courier New, monospace;\n  font-weight: bold;\n}\n\n#header h1 {\n  font-weight: normal;\n  float: left;\n  font-size: 30px;\n  line-height: 30px;\n  margin: 0;\n  padding: 10px 10px;\n  height: 30px;\n}\n\n#application h2,\n#specs h2 {\n  margin: 0;\n  padding: 0.5em;\n  font-size: 1.1em;\n}\n\n#status-legend {\n  margin-top: 10px;\n  margin-right: 10px;\n}\n\n#header,\n#application,\n.test-info,\n.test-actions li {\n  overflow: hidden;\n}\n\n#application {\n  margin: 10px;\n}\n\n#application iframe {\n  width: 100%;\n  height: 758px;\n}\n\n#application .popout {\n  float: right;\n}\n\n#application iframe {\n  border: none;\n}\n\n.tests li,\n.test-actions li,\n.test-it li,\n.test-it ol,\n.status-display {\n  list-style-type: none;\n}\n\n.tests,\n.test-it ol,\n.status-display {\n  margin: 0;\n  padding: 0;\n}\n\n.test-info {\n  margin-left: 1em;\n  margin-top: 0.5em;\n  border-radius: 8px 0 0 8px;\n  -webkit-border-radius: 8px 0 0 8px;\n  -moz-border-radius: 8px 0 0 8px;\n  cursor: pointer;\n}\n\n.test-info:hover .test-name {\n  text-decoration: underline;\n}\n\n.test-info .closed:before {\n  content: \'\\25b8\\00A0\';\n}\n\n.test-info .open:before {\n  content: \'\\25be\\00A0\';\n  font-weight: bold;\n}\n\n.test-it ol {\n  margin-left: 2.5em;\n}\n\n.status-display,\n.status-display li {\n  float: right;\n}\n\n.status-display li {\n  padding: 5px 10px;\n}\n\n.timer-result,\n.test-title {\n  display: inline-block;\n  margin: 0;\n  padding: 4px;\n}\n\n.test-actions .test-title,\n.test-actions .test-result {\n  display: table-cell;\n  padding-left: 0.5em;\n  padding-right: 0.5em;\n}\n\n.test-actions {\n  display: table;\n}\n\n.test-actions li {\n  display: table-row;\n}\n\n.timer-result {\n  width: 4em;\n  padding: 0 10px;\n  text-align: right;\n  font-family: monospace;\n}\n\n.test-it pre,\n.test-actions pre {\n  clear: left;\n  color: black;\n  margin-left: 6em;\n}\n\n.test-describe {\n  padding-bottom: 0.5em;\n}\n\n.test-describe .test-describe {\n  margin: 5px 5px 10px 2em;\n}\n\n.test-actions .status-pending .test-title:before {\n  content: \'\\00bb\\00A0\';\n}\n\n.scrollpane {\n   max-height: 20em;\n   overflow: auto;\n}\n\n/** Colors */\n\n#header {\n  background-color: #F2C200;\n}\n\n#specs h2 {\n  border-top: 2px solid #BABAD1;\n}\n\n#specs h2,\n#application h2 {\n  background-color: #efefef;\n}\n\n#application {\n  border: 1px solid #BABAD1;\n}\n\n.test-describe .test-describe {\n  border-left: 1px solid #BABAD1;\n  border-right: 1px solid #BABAD1;\n  border-bottom: 1px solid #BABAD1;\n}\n\n.status-display {\n  border: 1px solid #777;\n}\n\n.status-display .status-pending,\n.status-pending .test-info {\n  background-color: #F9EEBC;\n}\n\n.status-display .status-success,\n.status-success .test-info {\n  background-color: #B1D7A1;\n}\n\n.status-display .status-failure,\n.status-failure .test-info {\n  background-color: #FF8286;\n}\n\n.status-display .status-error,\n.status-error .test-info {\n  background-color: black;\n  color: white;\n}\n\n.test-actions .status-success .test-title {\n  color: #30B30A;\n}\n\n.test-actions .status-failure .test-title {\n  color: #DF0000;\n}\n\n.test-actions .status-error .test-title {\n  color: black;\n}\n\n.test-actions .timer-result {\n  color: #888;\n}\n</style>');