import { describe, it, expect } from 'vitest';
import { mapError } from '../../src/utils/errorMapper';
import { TWILIO_ERROR_CODES } from '../../src/types';

describe('mapError', () => {
  it('maps application_error to INTERNAL_PERSONA_ERROR', () => {
    const result = mapError('application_error');
    expect(result.code).toBe(TWILIO_ERROR_CODES.INTERNAL_PERSONA_ERROR);
    expect(result.message).toBe('Internal provider error');
  });

  it('maps invalid_config to INVALID_CONFIG', () => {
    const result = mapError('invalid_config');
    expect(result.code).toBe(TWILIO_ERROR_CODES.INVALID_CONFIG);
    expect(result.message).toBe('Invalid SDK initialization');
  });

  it('maps unauthenticated to UNAUTHENTICATED', () => {
    const result = mapError('unauthenticated');
    expect(result.code).toBe(TWILIO_ERROR_CODES.UNAUTHENTICATED);
    expect(result.message).toBe('Session token expired');
  });

  it('maps inactive_template to INACTIVE_TEMPLATE', () => {
    const result = mapError('inactive_template');
    expect(result.code).toBe(TWILIO_ERROR_CODES.INACTIVE_TEMPLATE);
    expect(result.message).toBe('Template misconfiguration');
  });

  it('maps unknown codes to UNKNOWN', () => {
    const result = mapError('something_else');
    expect(result.code).toBe(TWILIO_ERROR_CODES.UNKNOWN);
    expect(result.message).toBe('Unknown error');
  });
});
