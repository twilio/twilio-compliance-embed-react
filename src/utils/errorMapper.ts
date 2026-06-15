import { TWILIO_ERROR_CODES } from '../types';

export function mapError(code: string): { code: number; message: string } {
  switch (code) {
    case 'application_error':
      return { code: TWILIO_ERROR_CODES.INTERNAL_PERSONA_ERROR, message: 'Internal provider error' };
    case 'invalid_config':
      return { code: TWILIO_ERROR_CODES.INVALID_CONFIG, message: 'Invalid SDK initialization' };
    case 'unauthenticated':
      return { code: TWILIO_ERROR_CODES.UNAUTHENTICATED, message: 'Session token expired' };
    case 'inactive_template':
      return { code: TWILIO_ERROR_CODES.INACTIVE_TEMPLATE, message: 'Template misconfiguration' };
    default:
      return { code: TWILIO_ERROR_CODES.UNKNOWN, message: 'Unknown error' };
  }
}
