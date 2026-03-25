## Run

**Run the program** to determine type of a triangle with the following command:

`node triangle.js a b c`

Pass actual lengths of sides instead of parameters `a, b, c`

Examples of input and output:

```bash
[... assignment2]$ node triangle.js 3 3 3
Equilateral
```

```bash
[... assignment2]$ node triangle.js 2 5 5
Isosceles
```

```bash
[... assignment2]$ node triangle.js 2 4 5
Scalene
```

```bash
[... assignment2]$ node triangle.js 1 2 3
NotATriangle
```

```bash
[... assignment2]$ node triangle.js 1 2 210
...assignment2/triangle.js:10
        throw new Error("Value of c is not in the range of permitted values.");
        ^

Error: Value of c is not in the range of permitted values.
...
```

**Run tests** only for `triangle.js` with a command:

```bash
npm test -- assignment2
```

## Implementation details

Types of testing that have been implemented:
- Black box:
    + Boundary Value Analysis
    + Equivalence Partitioning
    + Error Guessing
- White box:
    + Branch Coverage

## Coverage

Get coverage report with

```bash
npm test -- --coverage assignment2
```

```bash
-------------|---------|----------|---------|---------|-------------------
File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------|---------|----------|---------|---------|-------------------
All files    |     100 |      100 |     100 |     100 |                   
 triangle.js |     100 |      100 |     100 |     100 |                   
-------------|---------|----------|---------|---------|-------------------
```

