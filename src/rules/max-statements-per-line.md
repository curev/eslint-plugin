## Rule Details

This rule enforces a maximum number of statements allowed per line.

## Options

### max

The "max" object property is optional (default: 1).

Examples of **incorrect** code for this rule with the default `{ "max": 1 }` option:

::: incorrect

```js
/* eslint max-statements-per-line: ["error", { "max": 1 }] */

let bar; let baz
if (condition)
  bar = 1
for (let i = 0; i < length; ++i) bar = 1
switch (discriminant) { default: break }
function foo() { bar = 1 }
const qux = function qux() { bar = 1 };
(function foo() { bar = 1 })()
```

:::

Examples of **correct** code for this rule with the default `{ "max": 1 }` option:

::: correct

```js
/* eslint max-statements-per-line: ["error", { "max": 1 }] */

let bar, baz
if (condition)
  bar = 1
for (let i = 0; i < length; ++i);
switch (discriminant) { default: }
function foo() { }
const qux = function qux() { };
(function foo() { })()
```

:::

Examples of **incorrect** code for this rule with the `{ "max": 2 }` option:

::: incorrect

```js
/* eslint max-statements-per-line: ["error", { "max": 2 }] */

let bar; let baz; var qux
if (condition)
  bar = 1; else baz = 2
for (let i = 0; i < length; ++i) { bar = 1; baz = 2 }
switch (discriminant) { case 'test': break; default: break }
function foo() { bar = 1; baz = 2 }
var qux = function qux() { bar = 1; baz = 2 };
(function foo() { bar = 1; baz = 2 })()
```

:::

Examples of **correct** code for this rule with the `{ "max": 2 }` option:

::: correct

```js
/* eslint max-statements-per-line: ["error", { "max": 2 }] */

let bar; let baz
if (condition)
  bar = 1; if (condition)
  baz = 2
for (let i = 0; i < length; ++i) bar = 1
switch (discriminant) { default: break }
function foo() { bar = 1 }
const qux = function qux() { bar = 1 };
(function foo() { const bar = 1 })()
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the number of statements on each line.
