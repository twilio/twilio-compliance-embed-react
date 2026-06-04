import { useEffect, useRef } from 'react';
import { Inquiry } from 'persona-react';
import { EVENTS_ALLOWLIST } from './constants';
import { mapError } from './utils/errorMapper';
import { TWILIO_ERROR_CODES } from './types';
import type { TwilioComplianceEmbedProps } from './types';

export function TwilioComplianceEmbed(props: TwilioComplianceEmbedProps) {
  const {
    sessionId,
    sessionToken,
    language,
    frameHeight,
    frameWidth,
    iframeTitle,
    widgetPadding,
    onReady,
    onComplete,
    onCancel,
    onError,
    onEvent,
  } = props;

  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const invalid = !sessionId || !sessionToken;

  useEffect(() => {
    if (invalid) {
      onErrorRef.current?.({
        code: TWILIO_ERROR_CODES.INVALID_CONFIG,
        message: 'sessionId and sessionToken are required',
      });
    }
  }, [invalid]);

  if (invalid) return null;

  return (
    <Inquiry
      inquiryId={sessionId}
      sessionToken={sessionToken}
      eventsAllowlist={EVENTS_ALLOWLIST}
      {...(language !== undefined && { language })}
      {...(frameHeight !== undefined && { frameHeight })}
      {...(frameWidth !== undefined && { frameWidth })}
      {...(iframeTitle !== undefined && { iframeTitle })}
      {...(widgetPadding !== undefined && { widgetPadding })}
      onReady={() => { onReadyRef.current?.(); }}
      onComplete={() => { onCompleteRef.current?.(); }}
      onCancel={() => { onCancelRef.current?.(); }}
      onError={({ code }: { status?: number; code: string }) => {
        const mapped = mapError(code);
        onErrorRef.current?.({ code: mapped.code, message: mapped.message, sessionId: sessionIdRef.current });
      }}
      onEvent={(name: string, metadata?: Record<string, unknown>) => {
        onEventRef.current?.({ name, data: metadata });
      }}
    />
  );
}
