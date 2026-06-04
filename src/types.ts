export interface WidgetPadding {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface TwilioEvent {
  name: string;
  data?: Record<string, unknown>;
}

export interface TwilioError {
  code: number;
  message: string;
  sessionId?: string;
}

export interface TwilioCompleteResult {
  inquiryId: string;
  status: string;
}

export interface TwilioCancelResult {
  sessionToken?: string;
}

export const TWILIO_ERROR_CODES = {
  INTERNAL_PERSONA_ERROR: 21710,
  INVALID_CONFIG: 21711,
  UNAUTHENTICATED: 21706,
  INACTIVE_TEMPLATE: 21712,
  UNKNOWN: 21719,
} as const;

export interface TwilioComplianceEmbedProps {
  sessionId: string;
  sessionToken: string;
  language?: string;
  frameHeight?: string;
  frameWidth?: string;
  iframeTitle?: string;
  widgetPadding?: WidgetPadding;
  onReady?: () => void;
  onComplete?: (result: TwilioCompleteResult) => void;
  onCancel?: (result: TwilioCancelResult) => void;
  onError?: (error: TwilioError) => void;
  onEvent?: (event: TwilioEvent) => void;
}
