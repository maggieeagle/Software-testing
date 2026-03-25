# Software Testing

This repository contains solutions for assignments from the Software Testing course.

JEST testing framework is used.

## Prerequisites
- Node.js + npm
- Jest

## Run

+ **Specific js file**:
    ```bash
    node scriptname.js
    ```

+ **All tests**:
    ```bash
    npm test
    ```

+ **Tests for specific assignment**:
    ```bash
    npm test -- foldername
    ```

    Example:
    ```bash
    [... assignment2]$ npm test -- assignment2
    ```
## Reporting

+ **Get coverage report**

    ```
    npm test -- --coverage
    ```

+ **Get coverage report for specific directory**

    ```bash
    npm test -- --coverage foldername
    ```

    Example:

    ```bash
    [... assignment2]$ npm test -- --coverage assignment2
    ```

Read README files in assignments folders for more specific information.
