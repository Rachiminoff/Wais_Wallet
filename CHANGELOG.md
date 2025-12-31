# Changelog

All notable changes to this project will be documented here.

## [1.0.1] - 2025-12-28 
**By:** Yambao

### Fixed
- Home balance now updates correctly after adding funds.
- Login and signup now function properly.
- Prevented stale balance display caused by cached user data.

### Changed
- Home screen reloads user data when returning from other screens.
- Add Funds updates the saved user balance properly.

### Added
- Success modal after adding funds, displaying transaction details.

### Removed
- Redundant local state copies that caused desynchronization.
