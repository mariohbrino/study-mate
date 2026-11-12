# Study Mate – Color Schema

## 1. Selected Theme

**Theme name:** Linear  
**Theme source:** [Shadcnblocks – Linear Theme](https://www.shadcnblocks.com/theme/linear)

The Linear theme was selected as the proposed color theme for Study Mate because it has a clean and simple design suitable for a student productivity application. It uses neutral backgrounds with violet accents, making the interface look organized and easy to use.

The theme supports both light and dark modes.

## 2. Typography

The selected font is **Inter**.

- Sans-serif: Inter
- Display font: Inter
- Text font: Inter
- Monospace: JetBrains Mono

Inter will be used for headings, paragraphs, navigation, buttons, and other interface elements. JetBrains Mono can be used for code or technical text.

## 3. Light Mode Colors

The light theme uses a near-white background, dark text, and violet accents.

| Variable | Purpose |
|---|---|
| `--background` | Main page background |
| `--foreground` | Main text color |
| `--card` | Cards and content sections |
| `--primary` | Main buttons and important actions |
| `--secondary` | Secondary interface elements |
| `--muted` | Subtle backgrounds |
| `--muted-foreground` | Supporting text |
| `--accent` | Highlighted elements |
| `--border` | Borders and separators |
| `--input` | Form input borders |
| `--ring` | Focus indicators |
| `--destructive` | Error or destructive actions |

## 4. Dark Mode Colors

The dark theme uses dark backgrounds with light text. It also uses violet accents to maintain consistency with light mode.

The `.dark` class will contain the dark theme variables so the application can switch between light and dark appearances.

## 5. Design Guidelines

- Use the primary color for important buttons and actions.
- Use neutral backgrounds to keep the interface clean.
- Use cards to organize assignments, courses, and study information.
- Keep text readable in both light and dark modes.
- Use borders to separate sections without making the interface crowded.
- Maintain consistent colors across all pages.
- Check text and background contrast when implementing the theme.

## 6. Theme Reference

The color values and design structure are based on the Linear theme from Shadcnblocks.

**Reference:** https://www.shadcnblocks.com/theme/linear

**Note:** This document records the proposed theme selection and design guidelines. The actual CSS variables will be implemented in the application's global stylesheet as part of the dark and light theme implementation.