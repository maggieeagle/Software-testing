const SHOOT_DAY_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const SHOOT_DAY_DISPLAY_DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

type TimestampLike = {
    toDate: () => Date;
};

function isTimestampLike(value: unknown): value is TimestampLike {
    return (
        Boolean(value) &&
        typeof value === "object" &&
        typeof (value as { toDate?: unknown }).toDate === "function"
    );
}

function toIsoDateFromParts(
    year: number,
    month: number,
    day: number,
): string | null {
    if (
        !Number.isFinite(year) ||
        !Number.isFinite(month) ||
        !Number.isFinite(day)
    ) {
        return null;
    }

    const parsed = new Date(year, month - 1, day);
    if (
        Number.isNaN(parsed.getTime()) ||
        parsed.getFullYear() !== year ||
        parsed.getMonth() + 1 !== month ||
        parsed.getDate() !== day
    ) {
        return null;
    }

    return `${String(year).padStart(4, "0")}-${String(month).padStart(
        2,
        "0",
    )}-${String(day).padStart(2, "0")}`;
}

function toIsoDateFromDate(value: Date): string {
    return `${String(value.getFullYear()).padStart(4, "0")}-${String(
        value.getMonth() + 1,
    ).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function parseNumericDateString(raw: string): string | null {
    const ymd = raw.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);
    if (ymd) {
        return toIsoDateFromParts(
            Number(ymd[1]),
                                  Number(ymd[2]),
                                  Number(ymd[3]),
        );
    }

    const dmyOrMdy = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (!dmyOrMdy) return null;

    const a = Number(dmyOrMdy[1]);
    const b = Number(dmyOrMdy[2]);
    const year = Number(dmyOrMdy[3]);

    const asDmy = toIsoDateFromParts(year, b, a);
    const asMdy = toIsoDateFromParts(year, a, b);

    if (a > 12 && b <= 12) return asDmy;
    if (b > 12 && a <= 12) return asMdy;

    return asDmy ?? asMdy;
}

export function toShootDayDateInputValue(value: unknown): string {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? "" : toIsoDateFromDate(value);
    }

    if (isTimestampLike(value)) {
        const asDate = value.toDate();
        return Number.isNaN(asDate.getTime()) ? "" : toIsoDateFromDate(asDate);
    }

    const raw = typeof value === "string" ? value.trim() : String(value || "").trim();
    if (!raw) return "";
    if (SHOOT_DAY_DATE_REGEX.test(raw)) return raw;

    const isoPrefix = raw.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s].*)?$/);
    if (isoPrefix?.[1]) return isoPrefix[1];

    const numericDate = parseNumericDateString(raw);
    if (numericDate) return numericDate;

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return "";
    return toIsoDateFromDate(parsed);
}

export function toDisplayShootDayDate(value: unknown): string {
    const isoDate = toShootDayDateInputValue(value);
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return "";
    return `${match[3]}/${match[2]}/${match[1]}`;
}

export function normalizeDisplayShootDayDateInput(value: string): string {
    const raw = (value || "").trim();
    if (!raw) return "";

    const isCompleteStructuredDate =
    SHOOT_DAY_DATE_REGEX.test(raw) ||
    /^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/.test(raw) ||
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.test(raw);

    if (isCompleteStructuredDate) {
        const canonical = toShootDayDateInputValue(raw);
        if (canonical) return toDisplayShootDayDate(canonical);
    }

    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function toCanonicalShootDayDate(value: string): string {
    const raw = (value || "").trim();
    if (!raw) return "";
    if (SHOOT_DAY_DATE_REGEX.test(raw)) return raw;

    const displayMatch = raw.match(SHOOT_DAY_DISPLAY_DATE_REGEX);
    if (displayMatch) {
        return (
            toIsoDateFromParts(
                Number(displayMatch[3]),
                               Number(displayMatch[2]),
                               Number(displayMatch[1]),
            ) || ""
        );
    }

    return toShootDayDateInputValue(raw);
}

export function toLocalShootDayDate(value: unknown): Date | null {
    const normalized = toShootDayDateInputValue(value);
    if (!normalized) return null;
    const parsed = new Date(`${normalized}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// prevent run on import
/* istanbul ignore next */
if (require.main === module) {
    const rawValue = process.argv[2] ?? "";

    try {
        console.log(toCanonicalShootDayDate(rawValue));
    } catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
    }
}
