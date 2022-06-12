# Javascript Style Guide

We use this style guide for all javascript codes.

## General tips

- Use strict mode (reason: for better error checking)
- Readability > code efficiency (reason: code base maintainability)
- Don't use semicolons (reason: inconsistent, mostly typing waste)
- Use 2 spaces for indent, no tabs (reason: consistency)
- Use ES6 style, but ES5 for module export and import (reason: node repl does not support es6 import yet)

## Naming Variable and function name

-  Variable and function name: camelCase 
```bash
const myFirstName = 'John'
const getName = (name) => {
    return name
}
```
- Global constant variable: upper case
```bash
const PORT = 80
```
- File name: lower case with hyphens
```bash
tranction-filter-rules.js
```
- HTML, CSS: use hyphens
- SQL colum name: lower case with hyphens

## Module use

- ES5 compatible style

reason: import is not supported yet in node REPL yet. 

https://stackoverflow.com/questions/54784608/how-to-import-an-es-module-in-node-js-repl


```bash
module.exports = something
const something = require('module')

module.exports = { something, another }
const { something, another } = require('module')

```

## Promise Handling
- use async and await if possible
```bash
async function f() {
  try {
    let response = await fetch('http://no-such-url')
    return response
  } catch(err) {
    console.log(err); 
    return errorHandlingFunction(err)
  }
}
```

## const, let, var  
- const: for all variables that don't get reassigned later
- let: for all variable that may get reassigned later
- let: for temporary variables for test cases
- var: do not use

## other styles

- follow this guide: https://github.com/airbnb/javascript

