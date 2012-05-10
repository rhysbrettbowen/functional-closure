goog.provide('func');


/**
 * @param {Function} fn to curry.
 * @param {Number=} opt_minLength of parameters for function.
 * @return {Function} curried function.
 */
func.curry = function(fn, opt_minLength) {
  console.log(arguments);
  var args = arguments.length > 2 ? [].slice.call(arguments, 2) : [];
  var curried = function() {
    var newArgs = goog.array.clone(args);
    if (!arguments.length)
      return fn.apply(this, args);
    var ind = 0;
    goog.array.forEach(arguments, function(arg) {
      if (!goog.isDef(arg)) {
        while (goog.isDef(newArgs[ind++]));
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
