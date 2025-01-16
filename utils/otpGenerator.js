import crypto from 'crypto';

export function secureOtpGenerator() {
  const otp = crypto.randomInt(10000, 100000); // Generates a number between 10000 and 99999
  return otp;
}


