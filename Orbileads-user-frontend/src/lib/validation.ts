export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MOBILE_REGEX = /^[0-9]{10,15}$/
export const OTP_REGEX = /^[0-9]{4,6}$/

export function isValidEmail(value: string) {
  return EMAIL_REGEX.test(value.trim())
}

export function isValidMobile(value: string) {
  return MOBILE_REGEX.test(value.trim())
}

export function isValidOtp(value: string) {
  return OTP_REGEX.test(value.trim())
}
