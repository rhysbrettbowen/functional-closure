functional-closure
==================

allows point-free style with the closure library

## fn.curry(function, opt_minLength, opt_args) ##

takes a function to return the curry function of

the minLength says how many defined variables at least are passed before a value instead of a function is returned

the opt_args are the starting arguments.

the return function can then be called with any amount of arguments (use undefined to skip that particular argument) and will continue to return a curried function until the minimum length is satisfied or you invoke it with no arguments.

e.g.

```javascript
// notice that as soon as there is a second argument we get a value back

var max = func.curry(Math.max, 2);

biggerThan10 = max(10);

biggerThan10(20); // 20

max(4)(2); // 4

max(4,6,3) // 6

max(8)(10, 4) // 10

// no minLength so need to execute with no arguments

var anyNumberMax = func.curry(Math.max);

anyNumberMax(1)(2)(3)(4, 5)() //5

var curryFilter = func.curry(goog.array.filter, 2);

var filterOdd = curryFilter(undefined, function(num) {
  return num % 2 == 1;
});

filterOdd([3,4,5,6,7]); // [3,5,7]
```

## fn.flip(function) ##

notice how we needed to use the undefined to skip the array? well we can also use flip

```javascript
var flipFilter = func.curry(func.flip(goog.array.filter), 2);

var filterEven = flipFilter(function(num) {
  return num % 2 == 0;
});

filterEven([3,4,5,6,7]); // [4,6]
```
