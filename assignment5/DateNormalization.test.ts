const {
    normalizeDisplayShootDayDateInput,
    toCanonicalShootDayDate,
    toDisplayShootDayDate,
    toLocalShootDayDate,
    toShootDayDateInputValue,
} = require("./DateNormalization.ts");

describe("toShootDayDateInputValue", () => {
    test("returns ISO dates unchanged", () => {
        expect(toShootDayDateInputValue("2026-02-09")).toBe("2026-02-09");
    });

    test("extracts the date part from ISO datetime strings", () => {
        expect(toShootDayDateInputValue("2026-02-09T15:30:00Z")).toBe("2026-02-09");
    });

    test("normalizes Date instances", () => {
        expect(toShootDayDateInputValue(new Date(2026, 1, 9))).toBe("2026-02-09");
    });

    test("normalizes timestamp-like objects", () => {
        const timestampLike = {
            toDate: () => new Date(2026, 5, 3),
        };

        expect(toShootDayDateInputValue(timestampLike)).toBe("2026-06-03");
    });

    test("normalizes DMY numeric dates", () => {
        expect(toShootDayDateInputValue("31/01/2026")).toBe("2026-01-31");
    });

    test("normalizes MDY numeric dates when month is unambiguous", () => {
        expect(toShootDayDateInputValue("12/31/2026")).toBe("2026-12-31");
    });

    test("defaults ambiguous numeric dates to DMY", () => {
        expect(toShootDayDateInputValue("03/04/2026")).toBe("2026-04-03");
    });

    test("returns an empty string for invalid dates", () => {
        expect(toShootDayDateInputValue("31/02/2026")).toBe("");
    });
});

describe("toDisplayShootDayDate", () => {
    test("converts ISO dates to display format", () => {
        expect(toDisplayShootDayDate("2026-02-09")).toBe("09/02/2026");
    });

    test("returns an empty string for invalid input", () => {
        expect(toDisplayShootDayDate("not-a-date")).toBe("");
    });
});

describe("normalizeDisplayShootDayDateInput", () => {
    test("formats partial numeric input as the user types", () => {
        expect(normalizeDisplayShootDayDateInput("1203")).toBe("12/03");
    });

    test("normalizes complete structured dates to display format", () => {
        expect(normalizeDisplayShootDayDateInput("2026-2-9")).toBe("09/02/2026");
    });

    test("trims non-digit characters from partial input", () => {
        expect(normalizeDisplayShootDayDateInput("1a2b3")).toBe("12/3");
    });
});

describe("toCanonicalShootDayDate", () => {
    test("returns ISO dates unchanged", () => {
        expect(toCanonicalShootDayDate("2026-02-09")).toBe("2026-02-09");
    });

    test("converts display dates to ISO format", () => {
        expect(toCanonicalShootDayDate("09/02/2026")).toBe("2026-02-09");
    });

    test("delegates other accepted formats to the main normalizer", () => {
        expect(toCanonicalShootDayDate("2026.2.9")).toBe("2026-02-09");
    });

    test("returns an empty string for invalid values", () => {
        expect(toCanonicalShootDayDate("99/99/2026")).toBe("");
    });
});

describe("toLocalShootDayDate", () => {
    test("returns a local Date at midnight for valid input", () => {
        const result = toLocalShootDayDate("2026-02-09");

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(1);
        expect(result.getDate()).toBe(9);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
    });

    test("returns null for invalid input", () => {
        expect(toLocalShootDayDate("31/02/2026")).toBeNull();
    });
});

describe("empty input handling", () => {
    test("returns an empty string for date input normalization", () => {
        expect(toShootDayDateInputValue("")).toBe("");
    });

    test("returns an empty string for display formatting", () => {
        expect(toDisplayShootDayDate("")).toBe("");
    });

    test("returns an empty string while normalizing display input", () => {
        expect(normalizeDisplayShootDayDateInput("")).toBe("");
    });

    test("returns an empty string for canonical date conversion", () => {
        expect(toCanonicalShootDayDate("")).toBe("");
    });

    test("returns null for local Date conversion", () => {
        expect(toLocalShootDayDate("")).toBeNull();
    });
});
