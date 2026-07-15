export interface WidgetPadding {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export type TwilioEventName =
  | 'start'
  | 'page-change'
  | 'document-upload'
  | 'one-time-link-sent'
  | 'one-time-link-start'
  | 'one-time-link-exit';

export interface TwilioEvent {
  name: TwilioEventName;
  data?: Record<string, unknown>;
}

export type SupportedLanguage =
  | 'ar-EG'
  | 'az'
  | 'bg'
  | 'bn'
  | 'cs'
  | 'cy'
  | 'da'
  | 'de'
  | 'el-GR'
  | 'en-US'
  | 'es-MX'
  | 'fi'
  | 'fr'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'hy'
  | 'id-ID'
  | 'it'
  | 'ja'
  | 'ko-KR'
  | 'lt'
  | 'ms'
  | 'nl-NL'
  | 'no'
  | 'pl'
  | 'pt-BR'
  | 'ro'
  | 'ru'
  | 'sk'
  | 'sr'
  | 'sv'
  | 'ta'
  | 'th'
  | 'tl'
  | 'tr-TR'
  | 'uk-UA'
  | 'ur'
  | 'vi'
  | 'zh-CN'
  | 'zh-TW';


export interface TwilioError {
  code: number;
  message: string;
  sessionId?: string;
}

export const TWILIO_ERROR_CODES = {
  INTERNAL_PERSONA_ERROR: 21710,
  INVALID_CONFIG: 21711,
  UNAUTHENTICATED: 21706,
  INACTIVE_TEMPLATE: 21712,
  UNKNOWN: 21719,
} as const;

export interface TwilioSubmitEvent {
  outcome: string;
}

export interface TwilioComplianceEmbedProps {
  sessionId: string;
  sessionToken: string;
  language?: SupportedLanguage;
  frameHeight?: string | number;
  frameWidth?: string | number;
  iframeTitle?: string;
  widgetPadding?: WidgetPadding;
  onReady?: () => void;
  onComplete?: () => void;
  onSubmit?: (event: TwilioSubmitEvent) => void;
  onCancel?: () => void;
  onError?: (error: TwilioError) => void;
  onEvent?: (event: TwilioEvent) => void;
}
