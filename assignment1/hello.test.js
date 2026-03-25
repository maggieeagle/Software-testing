const hello = require('./hello.js');

test('hello function with \'Margarita\' passed returns \'Hello, Margarita\'', () => {
    expect(hello('Margarita')).toBe('Hello, Margarita')
})