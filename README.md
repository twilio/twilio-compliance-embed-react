# @twilio/twilio-compliance-embed-react

The official React SDK for Twilio Compliance Embed.

## Installation

```bash
npm install @twilio/twilio-compliance-embed-react
```

### Peer dependencies

This package requires React 19+ and `persona-react`:

```bash
npm install react react-dom persona-react
```

## Usage

```tsx
import { TwilioComplianceEmbed } from '@twilio/twilio-compliance-embed-react';

function VerificationPage() {
  return (
    <TwilioComplianceEmbed
      sessionId="your-session-id"
      sessionToken="your-session-token"

      // Layout / localisation (all optional)
      language="en-US"
      frameHeight={650}
      frameWidth={400}
      iframeTitle="Identity Verification"
      widgetPadding={{ top: 0, bottom: 0, left: 0, right: 0 }}

      onReady={() => console.log('verification UI ready')}
      onComplete={() => console.log('verification completed')}
      onSubmit={(event) => {
        // event.outcome - terminal screen outcome (e.g. 'approved', 'declined')
        console.log('submitted with outcome:', event.outcome);
      }}
      onCancel={() => console.log('cancelled')}
      onError={(error) => {
        // error.code    - Twilio error code (e.g. 21706)
        // error.message - Human-readable description
        // error.sessionId - Present for runtime errors; absent for config errors
        console.error(`Compliance error ${error.code}: ${error.message}`);
      }}
      onEvent={(event) => {
        // event.name - one of: 'start', 'page-change', 'document-upload',
        //              'one-time-link-sent', 'one-time-link-start', 'one-time-link-exit'
        // event.data - optional metadata object
        console.log('event', event.name, event.data);
      }}
    />
  );
}
```

### Conditional rendering

The component renders the verification UI when mounted and cleans up when unmounted. Use standard React patterns to control visibility:

```tsx
import { useState } from 'react';
import { TwilioComplianceEmbed } from '@twilio/twilio-compliance-embed-react';

function App() {
  const [showVerification, setShowVerification] = useState(false);

  return (
    <div>
      <button onClick={() => setShowVerification(true)}>Start Verification</button>

      {showVerification && (
        <TwilioComplianceEmbed
          sessionId="your-session-id"
          sessionToken="your-session-token"
          onComplete={() => setShowVerification(false)}
          onCancel={() => setShowVerification(false)}
        />
      )}
    </div>
  );
}
```

## API

### `<TwilioComplianceEmbed />`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sessionId` | `string` | Yes | Pre-created verification session ID |
| `sessionToken` | `string` | Yes | Authentication token for the session |
| `language` | `SupportedLanguage` | No | BCP 47 locale code (e.g. `'en-US'`, `'es-MX'`). See [supported languages](#supported-languages) below |
| `frameHeight` | `string \| number` | No | CSS height of the verification iframe (e.g. `650`, `'100%'`) |
| `frameWidth` | `string \| number` | No | CSS width of the verification iframe (e.g. `400`, `'100%'`, max `768`) |
| `iframeTitle` | `string` | No | Accessible title for the iframe element |
| `widgetPadding` | `WidgetPadding` | No | Padding around the widget (`{ top?, bottom?, left?, right? }` in px) |
| `onReady` | `() => void` | No | Fires when the verification UI is loaded and ready |
| `onComplete` | `() => void` | No | Fires on successful verification |
| `onSubmit` | `(event: TwilioSubmitEvent) => void` | No | Fires when the user reaches a terminal screen — see [`TwilioSubmitEvent`](#twiliosubmitevent) below |
| `onCancel` | `() => void` | No | Fires when the user exits without completing |
| `onError` | `(error: TwilioError) => void` | No | Fires on SDK-level failure — see error codes below |
| `onEvent` | `(event: TwilioEvent) => void` | No | Fires on notable verification flow events |

### `TwilioEvent`

The `onEvent` callback receives an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `TwilioEventName` | Event name (see allowed values below) |
| `data` | `Record<string, unknown> \| undefined` | Optional event metadata |

Allowed event names: `start`, `page-change`, `document-upload`, `one-time-link-sent`, `one-time-link-start`, `one-time-link-exit`.

### `TwilioSubmitEvent`

The `onSubmit` callback receives an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `outcome` | `string` | The terminal screen outcome (e.g. `'approved'`, `'declined'`) |

`onSubmit` fires when the verification flow reaches a terminal screen, indicating the user has completed their submission. Use this to detect the final outcome before `onComplete` fires.

### `TwilioError`

The `onError` callback receives an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `code` | `number` | Twilio numeric error code |
| `message` | `string` | Human-readable description |
| `sessionId` | `string \| undefined` | Present for runtime errors; absent for configuration errors |

### `TWILIO_ERROR_CODES`

A named constant object exported for comparing error codes without hardcoding numbers:

```tsx
import { TWILIO_ERROR_CODES } from '@twilio/twilio-compliance-embed-react';

onError={(error) => {
  if (error.code === TWILIO_ERROR_CODES.UNAUTHENTICATED) {
    // refresh the session token
  }
}}
```

| Constant | Code | Meaning |
|----------|------|---------|
| `UNAUTHENTICATED` | `21706` | Session token expired — fetch a new session token and reinitialise |
| `INTERNAL_PERSONA_ERROR` | `21710` | Internal provider error |
| `INVALID_CONFIG` | `21711` | Invalid SDK initialization — check `sessionId` and `sessionToken` |
| `INACTIVE_TEMPLATE` | `21712` | Template misconfiguration — contact Twilio support |
| `UNKNOWN` | `21719` | Unexpected error |

## Supported languages

The `language` prop accepts the following BCP 47 locale codes:

| Code | Language |
|------|----------|
| `ar-EG` | Arabic (Egypt) |
| `az` | Azerbaijani |
| `bg` | Bulgarian |
| `bn` | Bengali |
| `cs` | Czech |
| `cy` | Welsh |
| `da` | Danish |
| `de` | German |
| `el-GR` | Greek (Greece) |
| `en-US` | English (US) |
| `es-MX` | Spanish (Mexico) |
| `fi` | Finnish |
| `fr` | French |
| `he` | Hebrew |
| `hi` | Hindi |
| `hr` | Croatian |
| `hu` | Hungarian |
| `hy` | Armenian |
| `id-ID` | Indonesian |
| `it` | Italian |
| `ja` | Japanese |
| `ko-KR` | Korean |
| `lt` | Lithuanian |
| `ms` | Malay |
| `nl-NL` | Dutch (Netherlands) |
| `no` | Norwegian |
| `pl` | Polish |
| `pt-BR` | Portuguese (Brazil) |
| `ro` | Romanian |
| `ru` | Russian |
| `sk` | Slovak |
| `sr` | Serbian |
| `sv` | Swedish |
| `ta` | Tamil |
| `th` | Thai |
| `tl` | Filipino (Tagalog) |
| `tr-TR` | Turkish |
| `uk-UA` | Ukrainian |
| `ur` | Urdu |
| `vi` | Vietnamese |
| `zh-CN` | Chinese (Simplified) |
| `zh-TW` | Chinese (Traditional) |

## Styling

The component renders the verification UI inline. For layout control, wrap it in a container element and apply styles to the wrapper:

```tsx
<div style={{ maxWidth: 768, margin: '0 auto' }}>
  <TwilioComplianceEmbed sessionId="..." sessionToken="..." />
</div>
```

We recommend using a minimum height of 650px and a minimum width of 400px to ensure contents are properly displayed without excessive horizontal wrapping or scrolling.

## SSR

The underlying `persona-react` package references browser globals (`self`) at the module level. This component works in frameworks that polyfill these globals (e.g., Next.js), but importing it in bare Node.js without a polyfill will throw a `ReferenceError`. Use dynamic imports or conditional rendering to avoid loading the module on the server.

When `sessionId` or `sessionToken` is missing, the component renders nothing and fires `onError` with code `21711` after mounting in the browser. Callbacks are never invoked during server-side rendering.
