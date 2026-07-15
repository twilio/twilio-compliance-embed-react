# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2026-07-15

### Added

- `onSubmit` callback that fires when the end user reaches a terminal screen in
  the compliance flow. Provides an `outcome` string (e.g. `"success"`,
  `"failed"`) parsed from the reserved terminal-screen naming convention
  (`twilio:compliance:terminal:<outcome>`). This is independent of `onComplete`
  and does not require a completion button click.
- Exported `TwilioSubmitEvent` type (`{ outcome: string }`).

## [0.0.2] - 2026-07-06

### Changed

- First release published through the automated GitHub Actions pipeline via npm
  OIDC trusted publishing. No functional changes since `0.0.1`.

## [0.0.1] - 2026-07-06

### Added

- Initial release of `@twilio/twilio-compliance-embed-react`, the official React
  SDK for Twilio Compliance Embed.
