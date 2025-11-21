/**
 * Validation utility functions for form inputs
 */

export const validateEmail = (email: string): boolean => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
    if (!phone) return true;

    return /^[\d\s\-\+\(\)]+$/.test(phone);
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) < new Date(endDate);
};

export const validateRequired = (value: string, minLength: number = 1): boolean => {
    return value.trim().length >= minLength;
};

export const validatePositiveNumber = (value: number): boolean => {
    return value > 0;
};

export const getEmailError = (email: string): string | null => {
    if (!email) return null;
    if (!validateEmail(email)) return "Please enter a valid email address";
    return null;
};

export const getPhoneError = (phone: string): string | null => {
    if (!phone) return null;
    if (!validatePhone(phone)) return "Please enter a valid phone number";
    return null;
};

export const getDateRangeError = (startDate: string, endDate: string): string | null => {
    if (!startDate || !endDate) return null;
    if (!validateDateRange(startDate, endDate)) {
        return "End date must be after start date";
    }
    return null;
};

export const getRequiredError = (value: string, fieldName: string, minLength: number = 1): string | null => {
    if (!validateRequired(value, minLength)) {
        return `${fieldName} is required${minLength > 1 ? ` (minimum ${minLength} characters)` : ''}`;
    }
    return null;
};
