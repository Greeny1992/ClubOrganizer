export const required = (value: any) => (value || typeof value === 'number' || typeof value ==='boolean' ? undefined : 'Required');
export const maxLength = (max: number) => (value: string) =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const minLength = (min: number) => (value: string) =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const number = (value: any) =>
    value && isNaN(Number(value)) ? 'Must be a number' : undefined;
export const minValue = (min: number) => (value: number) =>
    value && value < min ? `Must be at least ${min}` : undefined;

export const email = (value: string) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email address'
        : undefined;
export const alphaNumeric = (value: string) =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? 'Only alphanumeric characters'
        : undefined;
export const phoneNumber = (value: string) =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value)
        ? 'Invalid phone number, must be 10 digits'
        : undefined;