/*******************************************************************************
********************************************************************************
**                                                                            **
**  Copyright (c) 2012 Catch.com, Inc.                                        **
**                                                                            **
**  Licensed under the Apache License, Version 2.0 (the "License");           **
**  you may not use this file except in compliance with the License.          **
**  You may obtain a copy of the License at                                   **
**                                                                            **
**      http://www.apache.org/licenses/LICENSE-2.0                            **
**                                                                            **
**  Unless required by applicable law or agreed to in writing, software       **
**  distributed under the License is distributed on an "AS IS" BASIS,         **
**  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  **
**  See the License for the specific language governing permissions and       **
**  limitations under the License.                                            **
**                                                                            **
********************************************************************************
*******************************************************************************/

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
    var newArgs = args.slice();
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
    return func.curry.apply(this,
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
    if (arguments.length >= 1)
      var temp = args[0];
      args[0] = args[1];
      args[1] = temp;
    return fn.apply(this, args);
  };
};


/**
 * @param {...Function|string} var_args functions to compose.
 * @return {Function} the composed function.
 */
func.compose = function(var_args) {
  var args = [].slice.call(arguments);
  return function(arg) {
    var ret = arg;
    for (var i = args.length; i; i--) {
      ret = func.isStrThenLambda(args[i - 1])(ret);
    }
    return ret;
  };
};


/**
 * check to see if string should change to a function
 *
 * @param {string|Function} str the string or function to check.
 * @return {Function} the lambda.
 */
func.isStrThenLambda = function(str) {
  return goog.isString(str) ? func.lambda(str) : str;
};


/**
 * check if the first argument could be a lambda
 *
 * @param  {Function} fn function to check.
 * @return {Function} function with check for lambda.
 */
func.checkFirstForLambda = function(fn) {
  return function() {
    var args = [].slice.call(arguments);
    args[0] = func.isStrThenLambda(args[0]);
    return fn.apply(null, args);
  }
};


/**
 */
func.filter = func.checkFirstForLambda(
    func.curry(func.flip(goog.array.filter), 2));


/**
 */
func.isIn = func.curry(goog.array.contains, 2);


/**
 */
func.contains = func.flip(func.isIn);


/**
 * @param {*} item to not.
 * @return {Function} not item.
 */
func.not = function(item) {
  return function() {
    return !item.apply(this, arguments)
  }
};


func.or = function() {
  var args = goog.array.clone(arguments);
  return function(item) {
    return goog.array.some(args, function(arg) {
      return arg(item);
    });
  };
};


/**
 * @param {*} x
 */
func.identity = function(x) {
  return x;
};


/**
 * returns the function based on the test
 * 
 * @param {boolean} test for which function to run
 * @param {Function} yes function
 * @param {Function} no function
 * @return {Function}
 */
func.ifElse = function(test, yes, no) {
  return test ? yes : no || func.identity;
};


/**
 * return value of object at property
 * 
 * @param {string} prop erty
 * @param {Object} obj ect
 * @return {*} value at propert on object
 */
func.getProp = function(prop, obj) {
  return obj[prop];
};


/**
 */
func.each = func.curry(goog.array.forEach, 2);


/**
 */
func.doTo = func.checkFirstForLambda(func.flip(func.each));


/**
 */
func.map = func.checkFirstForLambda(func.curry(func.flip(goog.array.map), 2));


/**
 *  @param {string} str to make in to function.
 *  @return {Function} the lambda.
 */
func.lambda = function(str) {
  return new Function('x', 'return ' + str + ';');
};


