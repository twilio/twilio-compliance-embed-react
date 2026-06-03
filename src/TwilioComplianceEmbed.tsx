import { useEffect, useRef } from 'react';
import { Inquiry } from 'persona-react';
import type { Event as PersonaEvent } from 'persona';
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

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

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
      eventsAllowlist={EVENTS_ALLOWLIST as unknown as PersonaEvent[]}
      {...(language !== undefined && { language })}
      {...(frameHeight !== undefined && { frameHeight: String(frameHeight) })}
      {...(frameWidth !== undefined && { frameWidth: String(frameWidth) })}
      {...(iframeTitle !== undefined && { iframeTitle })}
      {...(widgetPadding !== undefined && { widgetPadding })}
      onReady={() => { onReady?.(); }}
      onComplete={() => { onComplete?.(); }}
      onCancel={() => { onCancel?.(); }}
      onError={({ code }: { status?: number; code: string }) => {
        const mapped = mapError(code);
        onError?.({ code: mapped.code, message: mapped.message, sessionId });
      }}
      onEvent={(name: string, metadata?: Record<string, unknown>) => {
        onEvent?.({ name, data: metadata });
      }}
    />
  );
}
