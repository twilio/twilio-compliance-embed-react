# @twilio/twilio-compliance-embed-react

The official React SDK for Twilio Compliance Embed.

## Installation

```bash
npm install @twilio/twilio-compliance-embed-react
```

### Peer dependencies

This package requires React 19+ and `persona-react`:

```bash
npm install react persona-react
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
      language="en"
      frameHeight="650px"
      frameWidth="400px"
      iframeTitle="Identity Verification"
      widgetPadding={{ top: 0, bottom: 0, left: 0, right: 0 }}

      onReady={() => console.log('verification UI ready')}
      onComplete={(result) => {
        // result.inquiryId - ID of the completed inquiry
        // result.status    - e.g. 'approved', 'needs_review'
        console.log('verification completed', result.status);
      }}
      onCancel={(result) => {
        // result.sessionToken - token to resume the inquiry later (may be undefined)
        console.log('cancelled', result.sessionToken);
      }}
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
| `language` | `string` | No | Locale code for the verification UI (e.g. `'en'`, `'es'`) |
| `frameHeight` | `string` | No | CSS height of the verification iframe (e.g. `'650px'`, `'100%'`) |
| `frameWidth` | `string` | No | CSS width of the verification iframe (max `'768px'`) |
| `iframeTitle` | `string` | No | Accessible title for the iframe element |
| `widgetPadding` | `WidgetPadding` | No | Padding around the widget (`{ top?, bottom?, left?, right? }` in px) |
| `onReady` | `() => void` | No | Fires when the verification UI is loaded and ready |
| `onComplete` | `(result: TwilioCompleteResult) => void` | No | Fires on verification completion — includes inquiry status |
| `onCancel` | `(result: TwilioCancelResult) => void` | No | Fires when the user exits — includes session token for resumption |
| `onError` | `(error: TwilioError) => void` | No | Fires on SDK-level failure — see error codes below |
| `onEvent` | `(event: TwilioEvent) => void` | No | Fires on notable verification flow events |

### `TwilioEvent`

The `onEvent` callback receives an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Event name (see allowed values below) |
| `data` | `Record<string, unknown> \| undefined` | Optional event metadata |

Allowed event names: `start`, `page-change`, `document-upload`, `one-time-link-sent`, `one-time-link-start`, `one-time-link-exit`.

### `TwilioCompleteResult`

The `onComplete` callback receives an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `inquiryId` | `string` | ID of the completed inquiry |
| `status` | `string` | Verification outcome (e.g. `'approved'`, `'needs_review'`, `'declined'`) |

### `TwilioCancelResult`

The `onCancel` callback receives an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `sessionToken` | `string \| undefined` | Token to resume the inquiry later. Pass this as the `sessionToken` prop to continue where the user left off. |

### `TwilioError`

The `onError` callback receives an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `code` | `number` | Twilio numeric error code |
| `message` | `string` | Human-readable description |
| `sessionId` | `string \| undefined` | Present for runtime errors; absent for configuration errors |

### Error codes

| Code | Meaning |
|------|---------|
| `21706` | Session token expired — fetch a new session token and reinitialise |
| `21710` | Internal provider error |
| `21711` | Invalid SDK initialization — check `sessionId` and `sessionToken` |
| `21712` | Template misconfiguration — contact Twilio support |
| `21719` | Unexpected error |

## Styling

The component renders the verification UI inline. For layout control, wrap it in a container element and apply styles to the wrapper:

```tsx
<div style={{ maxWidth: 768, margin: '0 auto' }}>
  <TwilioComplianceEmbed sessionId="..." sessionToken="..." />
</div>
```

We recommend using a minimum height of 650px and a minimum width of 400px to ensure contents are properly displayed without excessive horizontal wrapping or scrolling.

## SSR

The component is safe to import in server-side environments. When `sessionId` or `sessionToken` is missing, the component renders nothing and fires `onError` with code `21711` after mounting in the browser. Callbacks are never invoked during server-side rendering.
