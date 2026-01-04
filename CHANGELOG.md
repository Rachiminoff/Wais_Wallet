# Changelog

All notable changes to this project will be documented here.

## [1.0.1] - 2025-12-28 
**By:** Yambao

## Fixed
- Home balance now updates correctly after adding funds.
- Login and signup now function properly.
- Prevented stale balance display caused by cached user data.

## Changed
- Home screen reloads user data when returning from other screens.
- Add Funds updates the saved user balance properly.

## Added
- Success modal after adding funds, displaying transaction details.

## Removed
- Redundant local state copies that caused desynchronization.

## [1.0.2] - 2025-12-31
**By:** Yambao

> **Note:** Run `npm install` first before working on this again.

## Fixed

- Total Balance no longer decreases when adding money to savings.
- Eliminated incorrect balance calculations caused by combining Safe Balance with pocket balances.
- Resolved inconsistencies where savings transfers appeared as expenses.
- Prevented misleading Total Balance values after pocket or savings operations.

## Changed

- Total Balance is now derived from lifetime deposited funds instead of mutable balances.
- Home screen balance logic now clearly separates Safe Balance, Pockets, and Savings.
- Balance calculations were centralized to avoid double-counting.
- Converted the navigation bar into a reusable component for improved modularity.

## Added

- Clear distinction between Total Balance and current available funds in the Home screen logic.
- Improved internal safeguards against balance desynchronization.
- Added dark mode, transaction history page, and the main **Savings** functionality.
- Added statistics and a pie chart to the Home/Dashboard screen.

## Removed

- Faulty balance aggregation logic that caused phantom subtractions.
- Dependence on pocket and savings balances when computing Total Balance.

  

## [1.0.3] - 2026-01-04
**By:** Yambao

## Fixed

- Dark mode bug in edit pocket and edit savings pages.

## Added

- Allocation health pie chart on home

- subtract funds option in add funds page

## Changed

- Adjusted margins and spacing on home charts

## Removed

- Notes field in add funds page (unused)

- Font size settings in profile page
