function determine_triangle(a, b, c) {
    const MIN = 1;
    const MAX = 200;

    // error string helper
    function rangeError(side) {
        return `Value of ${side} is not in the range of permitted values.`;
    }

    // check sides value borders
    if (!(MIN <= a && a <= MAX)) {
        throw new Error(rangeError('a'));
    }
    if (!(MIN <= b && b <= MAX)) {
        throw new Error(rangeError('b'));
    }
    if (!(MIN <= c && c <= MAX)) {
        throw new Error(rangeError('c'));
    }

    // check if not a triangle
    if (!(a < b + c) || !(b < a + c) || !(c < a + b)) {
        return "NotATriangle"
    }

    // determine type of triangle
    if (a === b && b === c) {
        return "Equilateral"
    }
    if (a === b || b === c || a === c) {
        return "Isosceles"
    }
    return "Scalene"
}

// prevent run on module.export
/* istanbul ignore next */
if (require.main === module) {
  const a = Number(process.argv[2]);
  const b = Number(process.argv[3]);
  const c = Number(process.argv[4]);

  try {
    console.log(determine_triangle(a, b, c));
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = determine_triangle;
