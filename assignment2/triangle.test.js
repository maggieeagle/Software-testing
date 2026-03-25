const determine_triangle = require('./triangle.js');

describe('Boundary Value Analysis', () => {
  test('a below minimum', () => {
    expect(() => determine_triangle(0, 100, 100))
      .toThrow('Value of a is not in the range of permitted values.');
  });

  test('a at minimum', () => {
    expect(determine_triangle(1, 100, 100)).toBe('Isosceles');
  });

  test('a just above minimum', () => {
    expect(determine_triangle(2, 100, 100)).toBe('Isosceles');
  });

  test('a just below maximum', () => {
    expect(determine_triangle(199, 100, 100)).toBe('Isosceles');
  });

  test('a at maximum', () => {
    expect(determine_triangle(200, 100, 100)).toBe('NotATriangle');
  });

  test('a above maximum', () => {
    expect(() => determine_triangle(201, 100, 100))
      .toThrow('Value of a is not in the range of permitted values.');
  });

  test('b below minimum', () => {
    expect(() => determine_triangle(100, 0, 100))
      .toThrow('Value of b is not in the range of permitted values.');
  });

  test('b at minimum', () => {
    expect(determine_triangle(100, 1, 100)).toBe('Isosceles');
  });

  test('b just above minimum', () => {
    expect(determine_triangle(100, 2, 100)).toBe('Isosceles');
  });

  test('b just below maximum', () => {
    expect(determine_triangle(100, 199, 100)).toBe('Isosceles');
  });

  test('b at maximum', () => {
    expect(determine_triangle(100, 200, 100)).toBe('NotATriangle');
  });

  test('b above maximum', () => {
    expect(() => determine_triangle(100, 201, 100))
      .toThrow('Value of b is not in the range of permitted values.');
  });

  test('c below minimum', () => {
    expect(() => determine_triangle(100, 100, 0))
      .toThrow('Value of c is not in the range of permitted values.');
  });

  test('c at minimum', () => {
    expect(determine_triangle(100, 100, 1)).toBe('Isosceles');
  });

  test('c just above minimum', () => {
    expect(determine_triangle(100, 100, 2)).toBe('Isosceles');
  });

  test('c just below maximum', () => {
    expect(determine_triangle(100, 100, 199)).toBe('Isosceles');
  });

  test('c at maximum', () => {
    expect(determine_triangle(100, 100, 200)).toBe('NotATriangle');
  });

  test('c above maximum', () => {
    expect(() => determine_triangle(100, 100, 201))
      .toThrow('Value of c is not in the range of permitted values.');
  });
});

describe('Triangle Types (Equivalence Partitioning)', () => {
  test('equilateral', () => {
    expect(determine_triangle(5, 5, 5)).toBe('Equilateral');
  });

  test('isosceles (a=b)', () => {
    expect(determine_triangle(5, 5, 3)).toBe('Isosceles');
  });

  test('isosceles (a=c)', () => {
    expect(determine_triangle(5, 3, 5)).toBe('Isosceles');
  });

  test('isosceles (b=c)', () => {
    expect(determine_triangle(3, 5, 5)).toBe('Isosceles');
  });

  test('scalene', () => {
    expect(determine_triangle(4, 5, 6)).toBe('Scalene');
  });
});

describe('Error Guessing', () => {
  test('smallest triangle', () => {
    expect(determine_triangle(1, 1, 1)).toBe('Equilateral');
  });

  test('near boundary scalene', () => {
    expect(determine_triangle(198, 199, 200)).toBe('Scalene');
  });

  test('negative side length (a)', () => {
    expect(() => determine_triangle(-1, 2, 3)).toThrow('Value of a is not in the range of permitted values.');
  });

  test('negative side length (b)', () => {
    expect(() => determine_triangle(1, -2, 3)).toThrow('Value of b is not in the range of permitted values.');
  });

  test('negative side length (c)', () => {
    expect(() => determine_triangle(1, 2, -3)).toThrow('Value of c is not in the range of permitted values.');
  });
});

describe('NotATriangle cases (Branch Coverage)', () => {
  test('a + b = c', () => {
    expect(determine_triangle(1, 2, 3)).toBe('NotATriangle');
  });

  test('b + c = a', () => {
    expect(determine_triangle(3, 1, 2)).toBe('NotATriangle');
  });

  test('a + c = b', () => {
    expect(determine_triangle(2, 3, 1)).toBe('NotATriangle');
  });
});