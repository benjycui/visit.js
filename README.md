# visit.js

*Note: visit.js is just an experiment, for [most of the environments do not support `Proxy`](http://kangax.github.io/compat-table/es6/#Proxy), except Firefox and latest IE.*

If you are tired of those:

```js
// To get `name`, but you do not know whether `employees` and `employees[0]` exist or not
const name = (company.employees && company.employees[0] && company.employees[0].name);

// To set `name`, but you do not know whether `employees` and `employees[0]` exist or not
if (company.employees && company.employees[0]) {
  company.employees[0].name = 'Benjy';
}

// To call a method of nested `Object`
if (company.employees && company.employees[0] && (typeof company.employees[0].getName === 'function')) {
  var name = company.employees[0].getName();
}
```

You can try **visit.js**, something powered by [meta-programming](https://en.wikipedia.org/wiki/Metaprogramming). With **visit.js**, you can access nested property easily:

```js
// To get `name`, but you do not know whether `employees` and `employees[0]` exist or not
const name = visit(company).employees[0].name.unwrap();

// To set `name`, but you do not know whether `employees` and `employees[0]` exist or not
visit(company).employees[0].name.set('Benjy');

// To call a method of nested `Object`
visit(company).employees[0].getName.invoke();
```


## API

### visit(value)

> (anything) -> Proxy

To wrap `value` into a `Proxy`, so that we can access any property, even if it does not exist.

```js
const company = {
  employees: [
    {
      name: 'Benjy'
    }
  ]
};

visit(company).employees[0].name // To access property which exists
visit(company).stockholders[0].name // To access property which does not exist
```


### .isExist()

> () -> boolean

To check whether the current value exists or not.

```js
const company = {
  employees: [
    {
      name: 'Benjy'
    }
  ]
};

visit(company).employees[0].name.isExist() // => true
visit(company).stockholders[0].name.isExist() // => false
```

### .unwrap([defaultValue])

> ([anything]) -> originalValue | defaultValue

To get original value from `Proxy`, or get `defaultValue` if the original value does not exist.

```js
const company = {
  employees: [
    {
      name: 'Benjy'
    }
  ]
};

visit(company).employees[0].name // It is a `Proxy`
visit(company).employees[0].name.unwrap() // => 'Benjy'
visit(company).employees[0].age.unwrap(18) // => 18
```

### .set(value)

> (anything) -> boolean

To set the current value with `value`. If success, return `true`. Otherwise, `false`.

```js
const company = {
  employees: [{}]
};

visit(company).employees[0].name.set('Benjy') // => true
visit(company).stockholders[0].name.set('Benjy') // => false, for `stockholders` does not exist
```

### .invoke(arg*)

> (anything*) -> *

To invoke the current value as a `Function`. If it does not exist or is not a `Function`, nothing will happen.

```js
const company = {
  employees: [
    {
      name: 'Benjy',
      sayHi: function(name) {
        console.log('Nice to meet you, ' + name + '!');
      }
    }
  ]
};

visit(company).employees[0].sayHi.invoke('Bob') // => 'Nice to meet you, Bob!'
visit(company).employees[0].sayHello.invoke('Bob') // => Nothing will happen
```

## License

MIT
