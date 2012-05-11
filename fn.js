goog.provide('func');

goog.require('goog.array');



/**
 * @param {Function} fn to curry.
 * @param {number=} opt_minLength of parameters for function.
 * @param {...*} var_args initial values to apply.
 * @return {Function} curried function.
 */
func.curry = function(fn, opt_minLength, var_args) {
  var args = arguments.length > 2 ? [].slice.call(arguments, 2) : [];
  var curried = function() {
    var newArgs = goog.array.clone(args);
    if (!arguments.length)
      return fn.apply(this, args);
    var ind = 0;
    goog.array.forEach(arguments, function(arg) {
      if (!goog.isDef(arg)) {
        while (goog.isDef(newArgs[ind++])) {}
      } else {
        while (goog.isDef(newArgs[ind]))
          ind++;
        newArgs[ind] = arg;
      }
    });
    var newArgsLength = goog.array.filter(newArgs, function(arg) {
      return goog.isDef(arg);
    }).length;
    if (opt_minLength <= newArgsLength) {
      return fn.apply(this, newArgs);
    }
    return func.curry.apply(null,
          goog.array.concat(fn, goog.isDef(opt_minLength) ?
              opt_minLength - newArgsLength : undefined, newArgs));
  };
  return curried;
};


/**
 * @param {Function} fn to flip.
 * @return {Function} with initial params flipped.
 */
func.flip = function(fn) {
  return function() {
    var args = [].slice.call(arguments);
    if (arguments.length > 1)
      var temp = args[0];
      args[0] = args[1];
      args[1] = temp;
    return fn.apply(this, args);
  };
};


/**
 * @param {...Function} var_args functions to compose.
 * @return {*} the output of the composed function.
 */
func.compose = function(var_args) {
  var args = [].slice.call(arguments);
  return function(arg) {
    var ret = arg;
    for (var i = args.length; i; i--)
      ret = args[i - 1](ret);
    return ret;
  };
};


/**
 */
func.filter = func.curry(func.flip(goog.array.filter), 2);


/**
 */
func.in = func.curry(goog.array.contains, 2);


/**
 */
func.contains = func.flip(func.in);


/**
 * @param {*} item to not.
 * @return {Boolean} not item.
 */
func.not = function(item) {return !item;};


/**
 */
func.each = func.curry(goog.array.forEach, 2);


/**
 */
func.doTo = func.flip(func.each);


/**
 */
func.map = func.curry(func.flip(goog.array.map), 2);






