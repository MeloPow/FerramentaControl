/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/better-sqlite3/lib/database.js":
/*!*****************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/database.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const util = __webpack_require__(/*! ./util */ "./node_modules/better-sqlite3/lib/util.js");
const SqliteError = __webpack_require__(/*! ./sqlite-error */ "./node_modules/better-sqlite3/lib/sqlite-error.js");

let DEFAULT_ADDON;

function Database(filenameGiven, options) {
	if (new.target == null) {
		return new Database(filenameGiven, options);
	}

	// Apply defaults
	let buffer;
	if (Buffer.isBuffer(filenameGiven)) {
		buffer = filenameGiven;
		filenameGiven = ':memory:';
	}
	if (filenameGiven == null) filenameGiven = '';
	if (options == null) options = {};

	// Validate arguments
	if (typeof filenameGiven !== 'string') throw new TypeError('Expected first argument to be a string');
	if (typeof options !== 'object') throw new TypeError('Expected second argument to be an options object');
	if ('readOnly' in options) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
	if ('memory' in options) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');

	// Interpret options
	const filename = filenameGiven.trim();
	const anonymous = filename === '' || filename === ':memory:';
	const readonly = util.getBooleanOption(options, 'readonly');
	const fileMustExist = util.getBooleanOption(options, 'fileMustExist');
	const timeout = 'timeout' in options ? options.timeout : 5000;
	const verbose = 'verbose' in options ? options.verbose : null;
	const nativeBinding = 'nativeBinding' in options ? options.nativeBinding : null;

	// Validate interpreted options
	if (readonly && anonymous && !buffer) throw new TypeError('In-memory/temporary databases cannot be readonly');
	if (!Number.isInteger(timeout) || timeout < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
	if (timeout > 0x7fffffff) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
	if (verbose != null && typeof verbose !== 'function') throw new TypeError('Expected the "verbose" option to be a function');
	if (nativeBinding != null && typeof nativeBinding !== 'string' && typeof nativeBinding !== 'object') throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');

	// Load the native addon
	let addon;
	if (nativeBinding == null) {
		addon = DEFAULT_ADDON || (DEFAULT_ADDON = require(__webpack_require__.ab + "build/Release/better_sqlite3.node"));
	} else if (typeof nativeBinding === 'string') {
		// See <https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific>
		const requireFunc = typeof require === 'function' ? eval("require") : require;
		addon = requireFunc(path.resolve(nativeBinding).replace(/(\.node)?$/, '.node'));
	} else {
		// See <https://github.com/WiseLibs/better-sqlite3/issues/972>
		addon = nativeBinding;
	}

	if (!addon.isInitialized) {
		addon.setErrorConstructor(SqliteError);
		addon.isInitialized = true;
	}

	// Make sure the specified directory exists
	if (!anonymous && !fs.existsSync(path.dirname(filename))) {
		throw new TypeError('Cannot open database because the directory does not exist');
	}

	Object.defineProperties(this, {
		[util.cppdb]: { value: new addon.Database(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null) },
		...wrappers.getters,
	});
}

const wrappers = __webpack_require__(/*! ./methods/wrappers */ "./node_modules/better-sqlite3/lib/methods/wrappers.js");
Database.prototype.prepare = wrappers.prepare;
Database.prototype.transaction = __webpack_require__(/*! ./methods/transaction */ "./node_modules/better-sqlite3/lib/methods/transaction.js");
Database.prototype.pragma = __webpack_require__(/*! ./methods/pragma */ "./node_modules/better-sqlite3/lib/methods/pragma.js");
Database.prototype.backup = __webpack_require__(/*! ./methods/backup */ "./node_modules/better-sqlite3/lib/methods/backup.js");
Database.prototype.serialize = __webpack_require__(/*! ./methods/serialize */ "./node_modules/better-sqlite3/lib/methods/serialize.js");
Database.prototype.function = __webpack_require__(/*! ./methods/function */ "./node_modules/better-sqlite3/lib/methods/function.js");
Database.prototype.aggregate = __webpack_require__(/*! ./methods/aggregate */ "./node_modules/better-sqlite3/lib/methods/aggregate.js");
Database.prototype.table = __webpack_require__(/*! ./methods/table */ "./node_modules/better-sqlite3/lib/methods/table.js");
Database.prototype.loadExtension = wrappers.loadExtension;
Database.prototype.exec = wrappers.exec;
Database.prototype.close = wrappers.close;
Database.prototype.defaultSafeIntegers = wrappers.defaultSafeIntegers;
Database.prototype.unsafeMode = wrappers.unsafeMode;
Database.prototype[util.inspect] = __webpack_require__(/*! ./methods/inspect */ "./node_modules/better-sqlite3/lib/methods/inspect.js");

module.exports = Database;


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


module.exports = __webpack_require__(/*! ./database */ "./node_modules/better-sqlite3/lib/database.js");
module.exports.SqliteError = __webpack_require__(/*! ./sqlite-error */ "./node_modules/better-sqlite3/lib/sqlite-error.js");


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/aggregate.js":
/*!**************************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/aggregate.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const { getBooleanOption, cppdb } = __webpack_require__(/*! ../util */ "./node_modules/better-sqlite3/lib/util.js");

module.exports = function defineAggregate(name, options) {
	// Validate arguments
	if (typeof name !== 'string') throw new TypeError('Expected first argument to be a string');
	if (typeof options !== 'object' || options === null) throw new TypeError('Expected second argument to be an options object');
	if (!name) throw new TypeError('User-defined function name cannot be an empty string');

	// Interpret options
	const start = 'start' in options ? options.start : null;
	const step = getFunctionOption(options, 'step', true);
	const inverse = getFunctionOption(options, 'inverse', false);
	const result = getFunctionOption(options, 'result', false);
	const safeIntegers = 'safeIntegers' in options ? +getBooleanOption(options, 'safeIntegers') : 2;
	const deterministic = getBooleanOption(options, 'deterministic');
	const directOnly = getBooleanOption(options, 'directOnly');
	const varargs = getBooleanOption(options, 'varargs');
	let argCount = -1;

	// Determine argument count
	if (!varargs) {
		argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
		if (argCount > 0) argCount -= 1;
		if (argCount > 100) throw new RangeError('User-defined functions cannot have more than 100 arguments');
	}

	this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic, directOnly);
	return this;
};

const getFunctionOption = (options, key, required) => {
	const value = key in options ? options[key] : null;
	if (typeof value === 'function') return value;
	if (value != null) throw new TypeError(`Expected the "${key}" option to be a function`);
	if (required) throw new TypeError(`Missing required option "${key}"`);
	return null;
};

const getLength = ({ length }) => {
	if (Number.isInteger(length) && length >= 0) return length;
	throw new TypeError('Expected function.length to be a positive integer');
};


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/backup.js":
/*!***********************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/backup.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const { promisify } = __webpack_require__(/*! util */ "util");
const { cppdb } = __webpack_require__(/*! ../util */ "./node_modules/better-sqlite3/lib/util.js");
const fsAccess = promisify(fs.access);

module.exports = async function backup(filename, options) {
	if (options == null) options = {};

	// Validate arguments
	if (typeof filename !== 'string') throw new TypeError('Expected first argument to be a string');
	if (typeof options !== 'object') throw new TypeError('Expected second argument to be an options object');

	// Interpret options
	filename = filename.trim();
	const attachedName = 'attached' in options ? options.attached : 'main';
	const handler = 'progress' in options ? options.progress : null;

	// Validate interpreted options
	if (!filename) throw new TypeError('Backup filename cannot be an empty string');
	if (filename === ':memory:') throw new TypeError('Invalid backup filename ":memory:"');
	if (typeof attachedName !== 'string') throw new TypeError('Expected the "attached" option to be a string');
	if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
	if (handler != null && typeof handler !== 'function') throw new TypeError('Expected the "progress" option to be a function');

	// Make sure the specified directory exists
	await fsAccess(path.dirname(filename)).catch(() => {
		throw new TypeError('Cannot save backup because the directory does not exist');
	});

	const isNewFile = await fsAccess(filename).then(() => false, () => true);
	return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
};

const runBackup = (backup, handler) => {
	let rate = 0;
	let useDefault = true;

	return new Promise((resolve, reject) => {
		setImmediate(function step() {
			try {
				const progress = backup.transfer(rate);
				if (!progress.remainingPages) {
					backup.close();
					resolve(progress);
					return;
				}
				if (useDefault) {
					useDefault = false;
					rate = 100;
				}
				if (handler) {
					const ret = handler(progress);
					if (ret !== undefined) {
						if (typeof ret === 'number' && ret === ret) rate = Math.max(0, Math.min(0x7fffffff, Math.round(ret)));
						else throw new TypeError('Expected progress callback to return a number or undefined');
					}
				}
				setImmediate(step);
			} catch (err) {
				backup.close();
				reject(err);
			}
		});
	});
};


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/function.js":
/*!*************************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/function.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const { getBooleanOption, cppdb } = __webpack_require__(/*! ../util */ "./node_modules/better-sqlite3/lib/util.js");

module.exports = function defineFunction(name, options, fn) {
	// Apply defaults
	if (options == null) options = {};
	if (typeof options === 'function') { fn = options; options = {}; }

	// Validate arguments
	if (typeof name !== 'string') throw new TypeError('Expected first argument to be a string');
	if (typeof fn !== 'function') throw new TypeError('Expected last argument to be a function');
	if (typeof options !== 'object') throw new TypeError('Expected second argument to be an options object');
	if (!name) throw new TypeError('User-defined function name cannot be an empty string');

	// Interpret options
	const safeIntegers = 'safeIntegers' in options ? +getBooleanOption(options, 'safeIntegers') : 2;
	const deterministic = getBooleanOption(options, 'deterministic');
	const directOnly = getBooleanOption(options, 'directOnly');
	const varargs = getBooleanOption(options, 'varargs');
	let argCount = -1;

	// Determine argument count
	if (!varargs) {
		argCount = fn.length;
		if (!Number.isInteger(argCount) || argCount < 0) throw new TypeError('Expected function.length to be a positive integer');
		if (argCount > 100) throw new RangeError('User-defined functions cannot have more than 100 arguments');
	}

	this[cppdb].function(fn, name, argCount, safeIntegers, deterministic, directOnly);
	return this;
};


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/inspect.js":
/*!************************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/inspect.js ***!
  \************************************************************/
/***/ ((module) => {


const DatabaseInspection = function Database() {};

module.exports = function inspect(depth, opts) {
	return Object.assign(new DatabaseInspection(), this);
};



/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/pragma.js":
/*!***********************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/pragma.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const { getBooleanOption, cppdb } = __webpack_require__(/*! ../util */ "./node_modules/better-sqlite3/lib/util.js");

module.exports = function pragma(source, options) {
	if (options == null) options = {};
	if (typeof source !== 'string') throw new TypeError('Expected first argument to be a string');
	if (typeof options !== 'object') throw new TypeError('Expected second argument to be an options object');
	const simple = getBooleanOption(options, 'simple');

	const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true);
	return simple ? stmt.pluck().get() : stmt.all();
};


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/serialize.js":
/*!**************************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/serialize.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const { cppdb } = __webpack_require__(/*! ../util */ "./node_modules/better-sqlite3/lib/util.js");

module.exports = function serialize(options) {
	if (options == null) options = {};

	// Validate arguments
	if (typeof options !== 'object') throw new TypeError('Expected first argument to be an options object');

	// Interpret and validate options
	const attachedName = 'attached' in options ? options.attached : 'main';
	if (typeof attachedName !== 'string') throw new TypeError('Expected the "attached" option to be a string');
	if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');

	return this[cppdb].serialize(attachedName);
};


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/table.js":
/*!**********************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/table.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const { cppdb } = __webpack_require__(/*! ../util */ "./node_modules/better-sqlite3/lib/util.js");

module.exports = function defineTable(name, factory) {
	// Validate arguments
	if (typeof name !== 'string') throw new TypeError('Expected first argument to be a string');
	if (!name) throw new TypeError('Virtual table module name cannot be an empty string');

	// Determine whether the module is eponymous-only or not
	let eponymous = false;
	if (typeof factory === 'object' && factory !== null) {
		eponymous = true;
		factory = defer(parseTableDefinition(factory, 'used', name));
	} else {
		if (typeof factory !== 'function') throw new TypeError('Expected second argument to be a function or a table definition object');
		factory = wrapFactory(factory);
	}

	this[cppdb].table(factory, name, eponymous);
	return this;
};

function wrapFactory(factory) {
	return function virtualTableFactory(moduleName, databaseName, tableName, ...args) {
		const thisObject = {
			module: moduleName,
			database: databaseName,
			table: tableName,
		};

		// Generate a new table definition by invoking the factory
		const def = apply.call(factory, thisObject, args);
		if (typeof def !== 'object' || def === null) {
			throw new TypeError(`Virtual table module "${moduleName}" did not return a table definition object`);
		}

		return parseTableDefinition(def, 'returned', moduleName);
	};
}

function parseTableDefinition(def, verb, moduleName) {
	// Validate required properties
	if (!hasOwnProperty.call(def, 'rows')) {
		throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "rows" property`);
	}
	if (!hasOwnProperty.call(def, 'columns')) {
		throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "columns" property`);
	}

	// Validate "rows" property
	const rows = def.rows;
	if (typeof rows !== 'function' || Object.getPrototypeOf(rows) !== GeneratorFunctionPrototype) {
		throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "rows" property (should be a generator function)`);
	}

	// Validate "columns" property
	let columns = def.columns;
	if (!Array.isArray(columns) || !(columns = [...columns]).every(x => typeof x === 'string')) {
		throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "columns" property (should be an array of strings)`);
	}
	if (columns.length !== new Set(columns).size) {
		throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate column names`);
	}
	if (!columns.length) {
		throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with zero columns`);
	}

	// Validate "parameters" property
	let parameters;
	if (hasOwnProperty.call(def, 'parameters')) {
		parameters = def.parameters;
		if (!Array.isArray(parameters) || !(parameters = [...parameters]).every(x => typeof x === 'string')) {
			throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "parameters" property (should be an array of strings)`);
		}
	} else {
		parameters = inferParameters(rows);
	}
	if (parameters.length !== new Set(parameters).size) {
		throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate parameter names`);
	}
	if (parameters.length > 32) {
		throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with more than the maximum number of 32 parameters`);
	}
	for (const parameter of parameters) {
		if (columns.includes(parameter)) {
			throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with column "${parameter}" which was ambiguously defined as both a column and parameter`);
		}
	}

	// Validate "safeIntegers" option
	let safeIntegers = 2;
	if (hasOwnProperty.call(def, 'safeIntegers')) {
		const bool = def.safeIntegers;
		if (typeof bool !== 'boolean') {
			throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
		}
		safeIntegers = +bool;
	}

	// Validate "directOnly" option
	let directOnly = false;
	if (hasOwnProperty.call(def, 'directOnly')) {
		directOnly = def.directOnly;
		if (typeof directOnly !== 'boolean') {
			throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "directOnly" property (should be a boolean)`);
		}
	}

	// Generate SQL for the virtual table definition
	const columnDefinitions = [
		...parameters.map(identifier).map(str => `${str} HIDDEN`),
		...columns.map(identifier),
	];
	return [
		`CREATE TABLE x(${columnDefinitions.join(', ')});`,
		wrapGenerator(rows, new Map(columns.map((x, i) => [x, parameters.length + i])), moduleName),
		parameters,
		safeIntegers,
		directOnly,
	];
}

function wrapGenerator(generator, columnMap, moduleName) {
	return function* virtualTable(...args) {
		/*
			We must defensively clone any buffers in the arguments, because
			otherwise the generator could mutate one of them, which would cause
			us to return incorrect values for hidden columns, potentially
			corrupting the database.
		 */
		const output = args.map(x => Buffer.isBuffer(x) ? Buffer.from(x) : x);
		for (let i = 0; i < columnMap.size; ++i) {
			output.push(null); // Fill with nulls to prevent gaps in array (v8 optimization)
		}
		for (const row of generator(...args)) {
			if (Array.isArray(row)) {
				extractRowArray(row, output, columnMap.size, moduleName);
				yield output;
			} else if (typeof row === 'object' && row !== null) {
				extractRowObject(row, output, columnMap, moduleName);
				yield output;
			} else {
				throw new TypeError(`Virtual table module "${moduleName}" yielded something that isn't a valid row object`);
			}
		}
	};
}

function extractRowArray(row, output, columnCount, moduleName) {
	if (row.length !== columnCount) {
		throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an incorrect number of columns`);
	}
	const offset = output.length - columnCount;
	for (let i = 0; i < columnCount; ++i) {
		output[i + offset] = row[i];
	}
}

function extractRowObject(row, output, columnMap, moduleName) {
	let count = 0;
	for (const key of Object.keys(row)) {
		const index = columnMap.get(key);
		if (index === undefined) {
			throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an undeclared column "${key}"`);
		}
		output[index] = row[key];
		count += 1;
	}
	if (count !== columnMap.size) {
		throw new TypeError(`Virtual table module "${moduleName}" yielded a row with missing columns`);
	}
}

function inferParameters({ length }) {
	if (!Number.isInteger(length) || length < 0) {
		throw new TypeError('Expected function.length to be a positive integer');
	}
	const params = [];
	for (let i = 0; i < length; ++i) {
		params.push(`$${i + 1}`);
	}
	return params;
}

const { hasOwnProperty } = Object.prototype;
const { apply } = Function.prototype;
const GeneratorFunctionPrototype = Object.getPrototypeOf(function*(){});
const identifier = str => `"${str.replace(/"/g, '""')}"`;
const defer = x => () => x;


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/transaction.js":
/*!****************************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/transaction.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const { cppdb } = __webpack_require__(/*! ../util */ "./node_modules/better-sqlite3/lib/util.js");
const controllers = new WeakMap();

module.exports = function transaction(fn) {
	if (typeof fn !== 'function') throw new TypeError('Expected first argument to be a function');

	const db = this[cppdb];
	const controller = getController(db, this);
	const { apply } = Function.prototype;

	// Each version of the transaction function has these same properties
	const properties = {
		default: { value: wrapTransaction(apply, fn, db, controller.default) },
		deferred: { value: wrapTransaction(apply, fn, db, controller.deferred) },
		immediate: { value: wrapTransaction(apply, fn, db, controller.immediate) },
		exclusive: { value: wrapTransaction(apply, fn, db, controller.exclusive) },
		database: { value: this, enumerable: true },
	};

	Object.defineProperties(properties.default.value, properties);
	Object.defineProperties(properties.deferred.value, properties);
	Object.defineProperties(properties.immediate.value, properties);
	Object.defineProperties(properties.exclusive.value, properties);

	// Return the default version of the transaction function
	return properties.default.value;
};

// Return the database's cached transaction controller, or create a new one
const getController = (db, self) => {
	let controller = controllers.get(db);
	if (!controller) {
		const shared = {
			commit: db.prepare('COMMIT', self, false),
			rollback: db.prepare('ROLLBACK', self, false),
			savepoint: db.prepare('SAVEPOINT `\t_bs3.\t`', self, false),
			release: db.prepare('RELEASE `\t_bs3.\t`', self, false),
			rollbackTo: db.prepare('ROLLBACK TO `\t_bs3.\t`', self, false),
		};
		controllers.set(db, controller = {
			default: Object.assign({ begin: db.prepare('BEGIN', self, false) }, shared),
			deferred: Object.assign({ begin: db.prepare('BEGIN DEFERRED', self, false) }, shared),
			immediate: Object.assign({ begin: db.prepare('BEGIN IMMEDIATE', self, false) }, shared),
			exclusive: Object.assign({ begin: db.prepare('BEGIN EXCLUSIVE', self, false) }, shared),
		});
	}
	return controller;
};

// Return a new transaction function by wrapping the given function
const wrapTransaction = (apply, fn, db, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction() {
	let before, after, undo;
	if (db.inTransaction) {
		before = savepoint;
		after = release;
		undo = rollbackTo;
	} else {
		before = begin;
		after = commit;
		undo = rollback;
	}
	before.run();
	try {
		const result = apply.call(fn, this, arguments);
		if (result && typeof result.then === 'function') {
			throw new TypeError('Transaction function cannot return a promise');
		}
		after.run();
		return result;
	} catch (ex) {
		if (db.inTransaction) {
			undo.run();
			if (undo !== rollback) after.run();
		}
		throw ex;
	}
};


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/methods/wrappers.js":
/*!*************************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/methods/wrappers.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


const { cppdb } = __webpack_require__(/*! ../util */ "./node_modules/better-sqlite3/lib/util.js");

exports.prepare = function prepare(sql) {
	return this[cppdb].prepare(sql, this, false);
};

exports.exec = function exec(sql) {
	this[cppdb].exec(sql);
	return this;
};

exports.close = function close() {
	this[cppdb].close();
	return this;
};

exports.loadExtension = function loadExtension(...args) {
	this[cppdb].loadExtension(...args);
	return this;
};

exports.defaultSafeIntegers = function defaultSafeIntegers(...args) {
	this[cppdb].defaultSafeIntegers(...args);
	return this;
};

exports.unsafeMode = function unsafeMode(...args) {
	this[cppdb].unsafeMode(...args);
	return this;
};

exports.getters = {
	name: {
		get: function name() { return this[cppdb].name; },
		enumerable: true,
	},
	open: {
		get: function open() { return this[cppdb].open; },
		enumerable: true,
	},
	inTransaction: {
		get: function inTransaction() { return this[cppdb].inTransaction; },
		enumerable: true,
	},
	readonly: {
		get: function readonly() { return this[cppdb].readonly; },
		enumerable: true,
	},
	memory: {
		get: function memory() { return this[cppdb].memory; },
		enumerable: true,
	},
};


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/sqlite-error.js":
/*!*********************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/sqlite-error.js ***!
  \*********************************************************/
/***/ ((module) => {


const descriptor = { value: 'SqliteError', writable: true, enumerable: false, configurable: true };

function SqliteError(message, code) {
	if (new.target !== SqliteError) {
		return new SqliteError(message, code);
	}
	if (typeof code !== 'string') {
		throw new TypeError('Expected second argument to be a string');
	}
	Error.call(this, message);
	descriptor.value = '' + message;
	Object.defineProperty(this, 'message', descriptor);
	Error.captureStackTrace(this, SqliteError);
	this.code = code;
}
Object.setPrototypeOf(SqliteError, Error);
Object.setPrototypeOf(SqliteError.prototype, Error.prototype);
Object.defineProperty(SqliteError.prototype, 'name', descriptor);
module.exports = SqliteError;


/***/ }),

/***/ "./node_modules/better-sqlite3/lib/util.js":
/*!*************************************************!*\
  !*** ./node_modules/better-sqlite3/lib/util.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {



exports.getBooleanOption = (options, key) => {
	let value = false;
	if (key in options && typeof (value = options[key]) !== 'boolean') {
		throw new TypeError(`Expected the "${key}" option to be a boolean`);
	}
	return value;
};

exports.cppdb = Symbol();
exports.inspect = Symbol.for('nodejs.util.inspect.custom');


/***/ }),

/***/ "./src/db/colaborador.ts":
/*!*******************************!*\
  !*** ./src/db/colaborador.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deletarColaborador = exports.atualizarColaborador = exports.listarColaboradores = exports.criarColaborador = void 0;
// src/db/colaborador.ts
const database_1 = __webpack_require__(/*! ./database */ "./src/db/database.ts");
function criarColaborador(c) {
    const db = (0, database_1.getDb)();
    const r = db
        .prepare(`
     INSERT INTO colaboradores (nome, matricula, funcao, telefone, ativo)
     VALUES (?, ?, ?, ?, ?)
   `)
        .run(c.nome, c.matricula ?? null, c.funcao ?? null, c.telefone ?? null, c.ativo ?? 1);
    return Number(r.lastInsertRowid);
}
exports.criarColaborador = criarColaborador;
function listarColaboradores() {
    const db = (0, database_1.getDb)();
    return db
        .prepare(`SELECT * FROM colaboradores ORDER BY nome ASC`)
        .all();
}
exports.listarColaboradores = listarColaboradores;
function atualizarColaborador(c) {
    if (!c.id)
        throw new Error('Colaborador sem id');
    const db = (0, database_1.getDb)();
    db.prepare(`
     UPDATE colaboradores
     SET nome = ?, matricula = ?, funcao = ?, telefone = ?, ativo = ?, updated_at = datetime('now')
     WHERE id = ?
   `).run(c.nome, c.matricula ?? null, c.funcao ?? null, c.telefone ?? null, c.ativo ?? 1, c.id);
}
exports.atualizarColaborador = atualizarColaborador;
function deletarColaborador(id) {
    const db = (0, database_1.getDb)();
    db.prepare(`DELETE FROM colaboradores WHERE id = ?`).run(id);
}
exports.deletarColaborador = deletarColaborador;


/***/ }),

/***/ "./src/db/database.ts":
/*!****************************!*\
  !*** ./src/db/database.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDb = exports.initializeDatabase = void 0;
// src/db/database.ts
const better_sqlite3_1 = __importDefault(__webpack_require__(/*! better-sqlite3 */ "./node_modules/better-sqlite3/lib/index.js"));
const fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
let dbInstance = null;
function initializeDatabase(dbPath) {
    // garante a pasta do arquivo
    const dir = path_1.default.dirname(dbPath);
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
    const db = new better_sqlite3_1.default(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    // =========================
    // TABELA: colaboradores
    // =========================
    db.prepare(`
    CREATE TABLE IF NOT EXISTS colaboradores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      matricula TEXT,
      funcao TEXT,
      telefone TEXT,
      ativo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );
  `).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_colaboradores_nome ON colaboradores(nome);`).run();
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_colaboradores_matricula ON colaboradores(matricula) WHERE matricula IS NOT NULL;`).run();
    // =========================
    // TABELA: obras
    // =========================
    db.prepare(`
    CREATE TABLE IF NOT EXISTS obras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      codigo TEXT,
      endereco TEXT,
      status TEXT NOT NULL DEFAULT 'ativa', -- ativa | pausada | finalizada
      observacoes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );
  `).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_obras_nome ON obras(nome);`).run();
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_obras_codigo ON obras(codigo) WHERE codigo IS NOT NULL;`).run();
    // =========================
    // TABELA: ferramentas
    // =========================
    db.prepare(`
    CREATE TABLE IF NOT EXISTS ferramentas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      codigo_patrimonio TEXT,     -- etiqueta / patrimônio
      categoria TEXT,
      marca TEXT,
      modelo TEXT,
      numero_serie TEXT,
      status TEXT NOT NULL DEFAULT 'disponivel',
      -- disponivel | em_uso | manutencao | perdida | baixada

      local_tipo TEXT NOT NULL DEFAULT 'deposito',
      -- deposito | obra
      local_obra_id INTEGER, -- se local_tipo = 'obra'

      observacoes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT,

      FOREIGN KEY (local_obra_id) REFERENCES obras(id) ON UPDATE CASCADE ON DELETE SET NULL
    );
  `).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_ferramentas_nome ON ferramentas(nome);`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_ferramentas_status ON ferramentas(status);`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_ferramentas_local ON ferramentas(local_tipo, local_obra_id);`).run();
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_ferramentas_patrimonio ON ferramentas(codigo_patrimonio) WHERE codigo_patrimonio IS NOT NULL;`).run();
    // =========================
    // TABELA: movimentacoes
    // =========================
    db.prepare(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ferramenta_id INTEGER NOT NULL,

      de_tipo TEXT NOT NULL,          -- deposito | obra
      de_obra_id INTEGER,             -- se de_tipo = obra

      para_tipo TEXT NOT NULL,        -- deposito | obra
      para_obra_id INTEGER,           -- se para_tipo = obra

      colaborador_id INTEGER,          -- quem executou/recebeu
      data_hora TEXT NOT NULL DEFAULT (datetime('now')),
      observacao TEXT,
 
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
 
      FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (de_obra_id) REFERENCES obras(id) ON UPDATE CASCADE ON DELETE SET NULL,
      FOREIGN KEY (para_obra_id) REFERENCES obras(id) ON UPDATE CASCADE ON DELETE SET NULL,
      FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON UPDATE CASCADE ON DELETE SET NULL
    );
   `).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_mov_ferramenta ON movimentacoes(ferramenta_id, data_hora DESC);`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_mov_para ON movimentacoes(para_tipo, para_obra_id, data_hora DESC);`).run();
    dbInstance = db;
    return db;
}
exports.initializeDatabase = initializeDatabase;
function getDb() {
    if (!dbInstance)
        throw new Error('Banco de dados não inicializado!');
    return dbInstance;
}
exports.getDb = getDb;


/***/ }),

/***/ "./src/db/ferramenta.ts":
/*!******************************!*\
  !*** ./src/db/ferramenta.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deletarFerramenta = exports.atualizarFerramenta = exports.buscarFerramentaPorId = exports.listarFerramentas = exports.criarFerramenta = void 0;
// src/db/ferramenta.ts
const database_1 = __webpack_require__(/*! ./database */ "./src/db/database.ts");
function criarFerramenta(f) {
    const db = (0, database_1.getDb)();
    const r = db
        .prepare(`
     INSERT INTO ferramentas (
       nome, codigo_patrimonio, categoria, marca, modelo, numero_serie,
       status, local_tipo, local_obra_id, observacoes
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   `)
        .run(f.nome, f.codigo_patrimonio ?? null, f.categoria ?? null, f.marca ?? null, f.modelo ?? null, f.numero_serie ?? null, f.status ?? 'disponivel', f.local_tipo ?? 'deposito', f.local_obra_id ?? null, f.observacoes ?? null);
    return Number(r.lastInsertRowid);
}
exports.criarFerramenta = criarFerramenta;
function listarFerramentas() {
    const db = (0, database_1.getDb)();
    return db
        .prepare(`SELECT * FROM ferramentas ORDER BY nome ASC`)
        .all();
}
exports.listarFerramentas = listarFerramentas;
function buscarFerramentaPorId(id) {
    const db = (0, database_1.getDb)();
    return db.prepare(`SELECT * FROM ferramentas WHERE id = ?`).get(id);
}
exports.buscarFerramentaPorId = buscarFerramentaPorId;
function atualizarFerramenta(f) {
    if (!f.id)
        throw new Error('Ferramenta sem id');
    const db = (0, database_1.getDb)();
    db.prepare(`
     UPDATE ferramentas SET
       nome = ?, codigo_patrimonio = ?, categoria = ?, marca = ?, modelo = ?, numero_serie = ?,
       status = ?, local_tipo = ?, local_obra_id = ?, observacoes = ?, updated_at = datetime('now')
     WHERE id = ?
   `).run(f.nome, f.codigo_patrimonio ?? null, f.categoria ?? null, f.marca ?? null, f.modelo ?? null, f.numero_serie ?? null, f.status ?? 'disponivel', f.local_tipo ?? 'deposito', f.local_obra_id ?? null, f.observacoes ?? null, f.id);
}
exports.atualizarFerramenta = atualizarFerramenta;
function deletarFerramenta(id) {
    const db = (0, database_1.getDb)();
    db.prepare(`DELETE FROM ferramentas WHERE id = ?`).run(id);
}
exports.deletarFerramenta = deletarFerramenta;


/***/ }),

/***/ "./src/db/movimentacao.ts":
/*!********************************!*\
  !*** ./src/db/movimentacao.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listarMovimentacoesPorFerramenta = exports.registrarMovimentacao = void 0;
// src/db/movimentacao.ts
const database_1 = __webpack_require__(/*! ./database */ "./src/db/database.ts");
// Registra movimentação + atualiza "local/status" da ferramenta numa transação
function registrarMovimentacao(m) {
    const db = (0, database_1.getDb)();
    const tx = db.transaction(() => {
        const r = db
            .prepare(`
       INSERT INTO movimentacoes (
         ferramenta_id, de_tipo, de_obra_id, para_tipo, para_obra_id, colaborador_id, data_hora, observacao
       ) VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), ?)
     `)
            .run(m.ferramenta_id, m.de_tipo, m.de_obra_id ?? null, m.para_tipo, m.para_obra_id ?? null, m.colaborador_id ?? null, m.data_hora ?? null, m.observacao ?? null);
        // Atualiza a ferramenta para refletir o destino
        db.prepare(`
       UPDATE ferramentas
       SET local_tipo = ?, local_obra_id = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?
     `).run(m.para_tipo, m.para_tipo === 'obra' ? m.para_obra_id ?? null : null, 
        // regra simples: se foi pra obra, fica "em_uso"; se voltou pro depósito, "disponivel"
        m.para_tipo === 'obra' ? 'em_uso' : 'disponivel', m.ferramenta_id);
        return Number(r.lastInsertRowid);
    });
    return tx();
}
exports.registrarMovimentacao = registrarMovimentacao;
function listarMovimentacoesPorFerramenta(ferramentaId) {
    const db = (0, database_1.getDb)();
    return db
        .prepare(`
     SELECT * FROM movimentacoes
     WHERE ferramenta_id = ?
     ORDER BY datetime(data_hora) DESC, id DESC
   `)
        .all(ferramentaId);
}
exports.listarMovimentacoesPorFerramenta = listarMovimentacoesPorFerramenta;


/***/ }),

/***/ "./src/db/obra.ts":
/*!************************!*\
  !*** ./src/db/obra.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deletarObra = exports.atualizarObra = exports.buscarObraPorId = exports.listarObras = exports.criarObra = void 0;
const database_1 = __webpack_require__(/*! ./database */ "./src/db/database.ts");
function criarObra(obra) {
    const db = (0, database_1.getDb)();
    const stmt = db.prepare(`
    INSERT INTO obras (nome, codigo, endereco, status, observacoes)
    VALUES (?, ?, ?, ?, ?)
  `);
    const r = stmt.run(obra.nome, obra.codigo ?? null, obra.endereco ?? null, obra.status ?? 'ativa', obra.observacoes ?? null);
    return Number(r.lastInsertRowid);
}
exports.criarObra = criarObra;
function listarObras() {
    const db = (0, database_1.getDb)();
    return db.prepare(`SELECT * FROM obras ORDER BY nome ASC`).all();
}
exports.listarObras = listarObras;
function buscarObraPorId(id) {
    const db = (0, database_1.getDb)();
    return db.prepare(`SELECT * FROM obras WHERE id = ?`).get(id);
}
exports.buscarObraPorId = buscarObraPorId;
function atualizarObra(obra) {
    if (!obra.id)
        throw new Error('Obra sem id');
    const db = (0, database_1.getDb)();
    db.prepare(`
    UPDATE obras
    SET nome = ?, codigo = ?, endereco = ?, status = ?, observacoes = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(obra.nome, obra.codigo ?? null, obra.endereco ?? null, obra.status ?? 'ativa', obra.observacoes ?? null, obra.id);
}
exports.atualizarObra = atualizarObra;
function deletarObra(id) {
    const db = (0, database_1.getDb)();
    db.prepare(`DELETE FROM obras WHERE id = ?`).run(id);
}
exports.deletarObra = deletarObra;


/***/ }),

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const database_1 = __webpack_require__(/*! ../db/database */ "./src/db/database.ts");
const obra_1 = __webpack_require__(/*! ../db/obra */ "./src/db/obra.ts");
const colaborador_1 = __webpack_require__(/*! ../db/colaborador */ "./src/db/colaborador.ts");
const ferramenta_1 = __webpack_require__(/*! ../db/ferramenta */ "./src/db/ferramenta.ts");
const movimentacao_1 = __webpack_require__(/*! ../db/movimentacao */ "./src/db/movimentacao.ts");
let dbPath;
const createWindow = () => {
    const mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        show: false,
        title: 'FerramentaControl',
        webPreferences: {
            preload: 'C:\\Users\\paulh\\Documents\\FerramentaControl\\.webpack\\renderer\\main_window\\preload.js',
            contextIsolation: true,
            nodeIntegration: false,
        },
        // Dica: deixe sem icon por enquanto pra não quebrar path em dev/build.
        // Quando você organizar assets, a gente aponta isso com segurança.
        // icon: path.join(__dirname, 'assets', 'images', 'logo.png'),
    });
    mainWindow.loadURL('http://localhost:3000/main_window/index.html');
    mainWindow.once('ready-to-show', () => mainWindow.show());
    if (!electron_1.app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }
};
electron_1.app.whenReady().then(() => {
    dbPath = path_1.default.join(electron_1.app.getPath('userData'), 'ferramentacontrol.db');
    (0, database_1.initializeDatabase)(dbPath);
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
// ==============================
// IPC HANDLERS - Obras
// ==============================
electron_1.ipcMain.handle('criarObra', async (_event, obra) => (0, obra_1.criarObra)(obra));
electron_1.ipcMain.handle('listarObras', async () => (0, obra_1.listarObras)());
electron_1.ipcMain.handle('buscarObraPorId', async (_event, id) => (0, obra_1.buscarObraPorId)(id));
electron_1.ipcMain.handle('atualizarObra', async (_event, obra) => (0, obra_1.atualizarObra)(obra));
electron_1.ipcMain.handle('deletarObra', async (_event, id) => (0, obra_1.deletarObra)(id));
// ==============================
// IPC HANDLERS - Colaboradores
// ==============================
electron_1.ipcMain.handle('criarColaborador', async (_event, colaborador) => (0, colaborador_1.criarColaborador)(colaborador));
electron_1.ipcMain.handle('listarColaboradores', async () => (0, colaborador_1.listarColaboradores)());
electron_1.ipcMain.handle('atualizarColaborador', async (_event, colaborador) => (0, colaborador_1.atualizarColaborador)(colaborador));
electron_1.ipcMain.handle('deletarColaborador', async (_event, id) => (0, colaborador_1.deletarColaborador)(id));
// ==============================
// IPC HANDLERS - Ferramentas
// ==============================
electron_1.ipcMain.handle('criarFerramenta', async (_event, ferramenta) => (0, ferramenta_1.criarFerramenta)(ferramenta));
electron_1.ipcMain.handle('listarFerramentas', async () => (0, ferramenta_1.listarFerramentas)());
electron_1.ipcMain.handle('buscarFerramentaPorId', async (_event, id) => (0, ferramenta_1.buscarFerramentaPorId)(id));
electron_1.ipcMain.handle('atualizarFerramenta', async (_event, ferramenta) => (0, ferramenta_1.atualizarFerramenta)(ferramenta));
electron_1.ipcMain.handle('deletarFerramenta', async (_event, id) => (0, ferramenta_1.deletarFerramenta)(id));
// ==============================
// IPC HANDLERS - Movimentações
// ==============================
electron_1.ipcMain.handle('registrarMovimentacao', async (_event, mov) => (0, movimentacao_1.registrarMovimentacao)(mov));
electron_1.ipcMain.handle('listarMovimentacoesPorFerramenta', async (_event, ferramentaId) => (0, movimentacao_1.listarMovimentacoesPorFerramenta)(ferramentaId));


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/index.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map