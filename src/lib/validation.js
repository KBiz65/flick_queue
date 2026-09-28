// Account and list rules shared by the API routes and the forms, so both always agree.
// Each check returns an error message, or an empty string when the value is fine.

export const LIMITS = {
    usernameMin: 6,
    usernameMax: 30,
    nameMax: 50,
    emailMax: 254,
    passwordMin: 8,
    passwordMax: 72,
    listNameMax: 100,
    listDescriptionMax: 500,
};

const USERNAME_PATTERN = /^[A-Za-z0-9_.]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isText = (value) => typeof value === 'string';

export function usernameError(value) {
    const username = isText(value) ? value.trim() : '';
    if (username.length < LIMITS.usernameMin || username.length > LIMITS.usernameMax) {
        return `Username must be ${LIMITS.usernameMin} to ${LIMITS.usernameMax} characters.`;
    }
    if (!USERNAME_PATTERN.test(username)) {
        return 'Username can only use letters, numbers, underscores, and periods.';
    }
    return '';
}

export function nameError(value, label) {
    const name = isText(value) ? value.trim() : '';
    if (!name) return `${label} is required.`;
    if (name.length > LIMITS.nameMax) return `${label} can be up to ${LIMITS.nameMax} characters.`;
    return '';
}

export function emailError(value) {
    const email = isText(value) ? value.trim() : '';
    if (!email || email.length > LIMITS.emailMax || !EMAIL_PATTERN.test(email)) {
        return 'Enter a valid email address.';
    }
    return '';
}

// bcrypt only uses the first 72 bytes of a password, so anything longer is rejected rather than silently cut off
export function passwordError(value) {
    if (!isText(value) || value.length < LIMITS.passwordMin) {
        return `Password must be at least ${LIMITS.passwordMin} characters.`;
    }
    if (new TextEncoder().encode(value).length > LIMITS.passwordMax) {
        return `Password can be up to ${LIMITS.passwordMax} characters.`;
    }
    return '';
}

export function firstError(...messages) {
    return messages.find(Boolean) || '';
}