# Assignment 5

The Test Plan is for the part of the project I work on. It is a set of utility functions to convert messy data input into a specific format.

# Scope

In scope: 
- exported functions
- valid ISO dates
- valid display dates (e.g. DD/MM/YYYY)
- separators: `.`, `-`, `/`
- empty input
- invalid dates (e.g. 31/02/2026)
- ambiguous dates (fallback to DMY interpretation)

Out of scope:
- small helper functions
- leap year cases

## Run

Run with a command

    ```
    [... assignment5]$ npm test -- assignment5
    ```
