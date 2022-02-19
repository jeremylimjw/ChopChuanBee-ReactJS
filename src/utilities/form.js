export const REQUIRED = { required: true, message: 'This field is required.' };
export const EMAIL = { type: 'email', message: 'This email is invalid.' };
export const NUMBER = { pattern: /^[0-9]+$/, message: "This field can only contain numbers." }

export function exactLength(x) {
    return { min: x, max: x, message: `This field must be ${x} characters.` }
}
export function minLength(x) {
    return { min: x, message: `This field must be at least ${x} characters.` }
}
export function maxLength(x) {
    return { max: x, message: `This field must be at most ${x} characters.` }
}