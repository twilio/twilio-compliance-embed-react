import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { TwilioComplianceEmbed } from '../../src/TwilioComplianceEmbed';
import { TWILIO_ERROR_CODES } from '../../src/types';

vi.mock('persona-react', () => ({
  Inquiry: (props: Record<string, unknown>) => {
    (globalThis as Record<string, unknown>).__inquiryProps = props;
    return null;
  },
}));

function getInquiryProps(): Record<string, unknown> {
  return (globalThis as Record<string, unknown>).__inquiryProps as Record<string, unknown>;
}

beforeEach(() => {
  (globalThis as Record<string, unknown>).__inquiryProps = undefined;
});

describe('TwilioComplianceEmbed', () => {
  it('passes sessionId as inquiryId to Inquiry', () => {
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" />,
    );
    expect(getInquiryProps().inquiryId).toBe('inq_123');
  });

  it('passes sessionToken to Inquiry', () => {
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" />,
    );
    expect(getInquiryProps().sessionToken).toBe('tok_abc');
  });

  it('passes eventsAllowlist to Inquiry', () => {
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" />,
    );
    expect(getInquiryProps().eventsAllowlist).toEqual([
      'start',
      'page-change',
      'document-upload',
      'one-time-link-sent',
      'one-time-link-start',
      'one-time-link-exit',
    ]);
  });

  it('passes optional layout props when provided as strings', () => {
    render(
      <TwilioComplianceEmbed
        sessionId="inq_123"
        sessionToken="tok_abc"
        language="de"
        frameHeight="100%"
        frameWidth="50%"
        iframeTitle="Verify"
        widgetPadding={{ top: 10 }}
      />,
    );
    const props = getInquiryProps();
    expect(props.language).toBe('de');
    expect(props.frameHeight).toBe('100%');
    expect(props.frameWidth).toBe('50%');
    expect(props.iframeTitle).toBe('Verify');
    expect(props.widgetPadding).toEqual({ top: 10 });
  });

  it('coerces numeric frameHeight/frameWidth to pixel strings', () => {
    render(
      <TwilioComplianceEmbed
        sessionId="inq_123"
        sessionToken="tok_abc"
        frameHeight={650}
        frameWidth={400}
      />,
    );
    const props = getInquiryProps();
    expect(props.frameHeight).toBe('650px');
    expect(props.frameWidth).toBe('400px');
  });

  it('does not pass undefined optional props', () => {
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" />,
    );
    const props = getInquiryProps();
    expect('language' in props).toBe(false);
    expect('frameHeight' in props).toBe(false);
    expect('frameWidth' in props).toBe(false);
    expect('iframeTitle' in props).toBe(false);
    expect('widgetPadding' in props).toBe(false);
  });

  it('fires onReady without vendor args', () => {
    const onReady = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onReady={onReady} />,
    );
    const props = getInquiryProps();
    (props.onReady as () => void)();
    expect(onReady).toHaveBeenCalledWith();
  });

  it('fires onComplete without vendor args', () => {
    const onComplete = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onComplete={onComplete} />,
    );
    const props = getInquiryProps();
    (props.onComplete as () => void)();
    expect(onComplete).toHaveBeenCalledWith();
  });

  it('fires onCancel without vendor args', () => {
    const onCancel = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onCancel={onCancel} />,
    );
    const props = getInquiryProps();
    (props.onCancel as () => void)();
    expect(onCancel).toHaveBeenCalledWith();
  });

  it('maps onError through errorMapper', () => {
    const onError = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onError={onError} />,
    );
    const props = getInquiryProps();
    (props.onError as (e: { code: string }) => void)({ code: 'unauthenticated' });
    expect(onError).toHaveBeenCalledWith({
      code: TWILIO_ERROR_CODES.UNAUTHENTICATED,
      message: 'Session token expired',
      sessionId: 'inq_123',
    });
  });

  it('wraps onEvent into TwilioEvent shape', () => {
    const onEvent = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onEvent={onEvent} />,
    );
    const props = getInquiryProps();
    (props.onEvent as (name: string, meta?: Record<string, unknown>) => void)(
      'page-change',
      { pageHeight: 800 },
    );
    expect(onEvent).toHaveBeenCalledWith({
      name: 'page-change',
      data: { pageHeight: 800 },
    });
  });

  it('fires onError with INVALID_CONFIG when sessionId is missing', async () => {
    const onError = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="" sessionToken="tok_abc" onError={onError} />,
    );
    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith({
        code: TWILIO_ERROR_CODES.INVALID_CONFIG,
        message: 'sessionId and sessionToken are required',
      });
    });
  });

  it('fires onError with INVALID_CONFIG when sessionToken is missing', async () => {
    const onError = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="" onError={onError} />,
    );
    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith({
        code: TWILIO_ERROR_CODES.INVALID_CONFIG,
        message: 'sessionId and sessionToken are required',
      });
    });
  });

  it('renders nothing when validation fails', () => {
    const { container } = render(
      <TwilioComplianceEmbed sessionId="" sessionToken="" />,
    );
    expect(container.innerHTML).toBe('');
    expect(getInquiryProps()).toBeUndefined();
  });

  it('does not re-fire INVALID_CONFIG on rerender while still invalid', async () => {
    const onError = vi.fn();
    const { rerender } = render(
      <TwilioComplianceEmbed sessionId="" sessionToken="tok_abc" onError={onError} />,
    );
    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
    });
    rerender(
      <TwilioComplianceEmbed sessionId="" sessionToken="tok_abc" onError={onError} />,
    );
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('uses latest callback after prop update (stale closure protection)', () => {
    const onErrorV1 = vi.fn();
    const onErrorV2 = vi.fn();
    const { rerender } = render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onError={onErrorV1} />,
    );
    rerender(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onError={onErrorV2} />,
    );
    const props = getInquiryProps();
    (props.onError as (e: { code: string }) => void)({ code: 'unauthenticated' });
    expect(onErrorV1).not.toHaveBeenCalled();
    expect(onErrorV2).toHaveBeenCalledWith({
      code: TWILIO_ERROR_CODES.UNAUTHENTICATED,
      message: 'Session token expired',
      sessionId: 'inq_123',
    });
  });

  it('uses latest sessionId in onError after prop update', () => {
    const onError = vi.fn();
    const { rerender } = render(
      <TwilioComplianceEmbed sessionId="inq_old" sessionToken="tok_abc" onError={onError} />,
    );
    rerender(
      <TwilioComplianceEmbed sessionId="inq_new" sessionToken="tok_abc" onError={onError} />,
    );
    const props = getInquiryProps();
    (props.onError as (e: { code: string }) => void)({ code: 'unauthenticated' });
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'inq_new' }),
    );
  });

  it('uses latest onReady after prop update', () => {
    const onReadyV1 = vi.fn();
    const onReadyV2 = vi.fn();
    const { rerender } = render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onReady={onReadyV1} />,
    );
    rerender(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onReady={onReadyV2} />,
    );
    const props = getInquiryProps();
    (props.onReady as () => void)();
    expect(onReadyV1).not.toHaveBeenCalled();
    expect(onReadyV2).toHaveBeenCalled();
  });

  it('handles onEvent with undefined metadata', () => {
    const onEvent = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onEvent={onEvent} />,
    );
    const props = getInquiryProps();
    (props.onEvent as (name: string, meta?: Record<string, unknown>) => void)(
      'start',
      undefined,
    );
    expect(onEvent).toHaveBeenCalledWith({ name: 'start', data: undefined });
  });

  it('includes sessionId in Persona-originated onError', () => {
    const onError = vi.fn();
    render(
      <TwilioComplianceEmbed sessionId="inq_123" sessionToken="tok_abc" onError={onError} />,
    );
    const props = getInquiryProps();
    (props.onError as (e: { code: string }) => void)({ code: 'some_unknown_code' });
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'inq_123' }),
    );
  });
});
