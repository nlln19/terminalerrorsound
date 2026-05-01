# Changelog

All notable changes to this project will be documented in this file.

## 1.2.0

This release focuses on project cleanup, documentation improvements and internal code structure.

### Changed

- Updated and improved the `README.md`.
- Renamed the GitHub repository from `terminalerrorsound` to `esft`.
- Refactored the internal code architecture for better maintainability.
- Split the extension logic into separate modules for configuration, sound handling, terminal monitoring, status bar handling and trigger mode commands.

### Notes

- No user-facing behavior was changed.
- Existing commands, settings, sounds and trigger modes continue to work as before.

## 1.1.0

### Added

- Added a status bar button to quickly enable or disable the extension.
- Added `Terminal Error Sound: Toggle Enabled`.
- Added trigger modes:
  - `Patterns`: Plays a sound when error text is detected.
  - `Exit Code`: Plays a sound when a command exits with a non-zero exit code.
  - `Both`: Uses both detection methods.
- Added `Terminal Error Sound: Choose Trigger Mode`.
- Added more default error patterns for Windows, macOS, Linux, and common programming errors.

### Changed

- Improved custom sound handling.
- Custom `.wav` files are now imported into VS Code extension storage instead of only saving the original file path.
- Renamed the custom sound command from `Select Custom Sound` to `Import Custom Sound`.

### Improved

- Improved missing sound file warnings with quick actions:
  - Reset to default sound
  - Import custom sound
  - Choose built-in sound

## 1.0.1

### Changed

- Added instructions for installing the extension locally from a `.vsix` file.
- Improved release documentation.

## 1.0.0

### Added

- Initial release of Terminal Error Sound.
- Plays a sound when a terminal command exits with an error.
- Detects common error keywords such as:
  - `error`
  - `failed`
  - `exception`
  - `traceback`
- Added multiple built-in sounds:
  - Fahh
  - Bruh
  - Fail
  - Oh My God
  - Vine Boom
- Added support for custom `.wav` sound files.
- Added commands:
  - `Terminal Error Sound: Test Sound`
  - `Terminal Error Sound: Choose Built-in Sound`
  - `Terminal Error Sound: Select Custom Sound`
  - `Terminal Error Sound: Reset Custom Sound`