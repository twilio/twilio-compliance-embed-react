import type { Event as PersonaEvent } from 'persona';

// String values match Persona's Event enum members at runtime.
// Type assertion needed because persona only exports Event as a type.
export const EVENTS_ALLOWLIST = [
  'start' as PersonaEvent,
  'page-change' as PersonaEvent,
  'document-upload' as PersonaEvent,
  'one-time-link-sent' as PersonaEvent,
  'one-time-link-start' as PersonaEvent,
  'one-time-link-exit' as PersonaEvent,
];
