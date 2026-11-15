# Data Model: Study Mate Theme

## Overview

The theme system uses CSS custom properties to provide consistent colors and typography throughout Study Mate.

There are no database entities, API changes, or database migrations required. The theme is defined in the global stylesheet.

## 1. Theme Definitions

The application supports two theme definitions:

- **Light theme:** Defined under `:root`.
- **Dark theme:** Defined under `.dark`.

Each theme contains the same 17 semantic color tokens: 12 core color roles and 5 foreground pairing roles.

### Light Theme

| Token | Value | Purpose |
|---|---|---|
| background | #fbfbfb | Main page background |
| foreground | #1b1b1b | Main text |
| card | #ffffff | Card backgrounds |
| card-foreground | #1b1b1b | Card text |
| primary | #6e78d5 | Primary actions and emphasis |
| primary-foreground | #101011 | Text on primary elements |
| secondary | #1b1b1b | Secondary elements |
| secondary-foreground | #fbfbfb | Text on secondary elements |
| muted | #ececef | Muted backgrounds |
| muted-foreground | #686a71 | Secondary text |
| accent | #d9dcea | Accent backgrounds |
| accent-foreground | #000000 | Text on accent elements |
| border | #8f9096 | Element boundaries |
| input | #8f9096 | Input boundaries |
| ring | #6f6d6d | Focus indicators |
| destructive | #92681b | Destructive actions |
| destructive-foreground | #ffffff | Text on destructive elements |

### Dark Theme

| Token | Value | Purpose |
|---|---|---|
| background | #101011 | Main page background |
| foreground | #e3e4e6 | Main text |
| card | #17181a | Card backgrounds |
| card-foreground | #e3e4e6 | Card text |
| primary | #e6e6e6 | Primary actions and emphasis |
| primary-foreground | #101011 | Text on primary elements |
| secondary | #7987e1 | Secondary elements |
| secondary-foreground | #101011 | Text on secondary elements |
| muted | #141415 | Muted backgrounds |
| muted-foreground | #a1a2a5 | Secondary text |
| accent | #303549 | Accent backgrounds |
| accent-foreground | #e3e4e6 | Text on accent elements |
| border | #8f9096 | Element boundaries |
| input | #8f9096 | Input boundaries |
| ring | #7987e1 | Focus indicators |
| destructive | #c08a32 | Destructive actions |
| destructive-foreground | #101011 | Text on destructive elements |

**Note:** The original Linear-inspired reference does not provide every value. Additional values for missing dark-mode tokens and foreground pairings are proposed design choices. The light-theme primary, muted foreground, border, and input values were adjusted during implementation and contrast review. The dark-theme border and input values were also adjusted to #8f9096 to improve interface boundary visibility.

## 2. Theme Token Rules

- Every semantic token must have both light and dark values.
- Token names must remain consistent between themes.
- Application components should use semantic Tailwind color utilities instead of hardcoded color values.
- Foreground tokens should be used with their corresponding background roles.
- Color contrast and readability must be reviewed in both themes.

## 3. Typography

| Font Role | Font Family | Usage |
|---|---|---|
| Sans | Inter | General application text |
| Monospace | JetBrains Mono | Code and technical text |

Both font families are loaded through Next.js font support and exposed through CSS variables.

Browser inspection confirmed that Inter is applied to the page heading.

## 4. Relationships

- Each theme contains the same 17 semantic color tokens.
- Application components consume the shared semantic tokens.
- Typography remains consistent across both themes.
- Theme definitions are managed centrally in the global stylesheet.
- A theme switcher and preference persistence are outside this feature's scope.

## 5. Persistence

No database persistence is required.

Theme values are defined in `src/app/globals.css`. The dark theme is activated through the `.dark` class.

## 6. Contrast Review

Text color combinations were reviewed against the WCAG AA target of 4.5:1 for normal-sized text.

| Theme | Text and background pairing | Contrast ratio |
|---|---|---:|
| Light | foreground / background | 16.65:1 |
| Light | card-foreground / card | 17.22:1 |
| Light | primary-foreground / primary | 4.81:1 |
| Light | secondary-foreground / secondary | 16.65:1 |
| Light | muted-foreground / muted | 4.58:1 |
| Light | accent-foreground / accent | 15.38:1 |
| Light | destructive-foreground / destructive | 4.98:1 |
| Dark | foreground / background | 14.95:1 |
| Dark | card-foreground / card | 13.96:1 |
| Dark | primary-foreground / primary | 15.24:1 |
| Dark | secondary-foreground / secondary | 5.76:1 |
| Dark | muted-foreground / muted | 7.21:1 |
| Dark | accent-foreground / accent | 9.53:1 |
| Dark | destructive-foreground / destructive | 6.27:1 |

All reviewed text combinations meet the 4.5:1 target.

Interface boundaries and focus indicators were also reviewed against the 3:1 non-text contrast target.

| Theme | Interface combination | Contrast ratio |
|---|---|---:|
| Light | border / background | 3.08:1 |
| Light | border / card | 3.18:1 |
| Light | input / background | 3.08:1 |
| Light | ring / background | 4.97:1 |
| Light | ring / card | 5.14:1 |
| Dark | border / background | 5.97:1 |
| Dark | border / card | 5.58:1 |
| Dark | input / background | 5.97:1 |
| Dark | ring / background | 5.76:1 |
| Dark | ring / card | 5.39:1 |

All reviewed interface combinations meet the 3:1 target.

These results are based on the final color values in `src/app/globals.css`. Actual component usage should still be considered when checking the complete interface.