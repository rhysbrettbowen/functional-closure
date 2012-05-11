functional-closure
==================

allows point-free style with the closure library

## func.curry(function, opt_minLength, opt_args) ##

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

## func.flip(function) ##

notice how we needed to use the undefined to skip the array? well we can also use flip

```javascript
var flipFilter = func.curry(func.flip(goog.array.filter), 2);

var filterEven = flipFilter(function(num) {
  return num % 2 == 0;
});

filterEven([3,4,5,6,7]); // [4,6]
```

## func.compose(function*) ##

pass in several functions and they will be applied to the list
backwards.

```javascript
var addOne = function(x) {return x + 1};
var addOneToAll = func.map(addOne);
var isOdd = function(x) {return x % 2};
var filterOdd = func.filter(isOdd);
var addThenGetOdd = func.compose(filterOdd, addOneToAll);
addThenGetOdd([1,2,3,4,5,6]); // [3,5,7]
```

## func.filter ##

a curried filter function where first parameter is the function and
second array (will return value).

## func.in ##

a curried function where first parameter is array and second is element to
search the array for

## func.contains ##

a curried function where first parameter is the element we're trying to
match and the second is the array of elements to check

## func.not ##

returns !argument

## func.each ##

a curried function where first element is a list and second is the function to run on the list

## func.doTo ##

a curried function where first element is a function and second is a list to run the function on

## func.map ##

a curried function where first element is the mapping function and second is the list to map.

