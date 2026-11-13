# Research: Study Mate Dark and Light Theme

## 1. Theme and Color System

**Decision:** Use the approved Linear theme from Shadcnblocks as the design reference.

**Rationale:** The theme provides a neutral, product-focused interface with violet accents. It supports both light and dark appearances and suits a student productivity application.

**Alternatives considered:** A custom color palette or another Shadcn theme. These were not selected because the team has already approved Linear.

Reference: [Linear Theme - Shadcnblocks](https://www.shadcnblocks.com/theme/linear)

## 2. Light and Dark Mode Implementation

**Decision:** Use CSS variables in `src/app/globals.css` and a `.dark` class for dark-mode variables.

**Rationale:** This follows the approved theme documentation and works with Tailwind CSS 4.

**Alternatives considered:**

- The default `prefers-color-scheme` behavior.
- Installing `next-themes` to manage theme selection and persistence.

The `.dark` class approach is selected for the color schema. A user-facing theme switcher and preference persistence are outside the current feature scope.

## 3. Tailwind CSS 4 Integration

**Decision:** Define semantic color variables and expose them through Tailwind's `@theme inline` configuration.

**Rationale:** This allows components to use consistent semantic utilities instead of scattered hard-coded colors.

**Alternatives considered:** Adding individual hex values directly to component classes. This conflicts with the project constitution's utility-first design-token requirements.

## 4. Typography

**Decision:** Use Inter for the application interface and JetBrains Mono for technical text.

**Rationale:** Both fonts are specified in the approved Linear design reference.

**Implementation approach:** Use `next/font/google` in the root layout and expose the font variables globally.

**Documentation consulted:** `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`

The Next.js documentation confirms that Google fonts are self-hosted by Next.js.

**Validation:** The browser's computed font-family for the page heading returned `Inter, "Inter Fallback"`, confirming that Inter is applied.

## 5. Dark Theme Token Values

The supplied Linear reference provides these dark-mode values:

| Token | Reference value |
|---|---|
| Background | #101011 |
| Foreground | #e3e4e6 |
| Card | #17181a |
| Primary | #e6e6e6 |
| Secondary | #7987e1 |
| Muted | #141415 |
| Muted foreground | #a1a2a5 |
| Accent | #303549 |
| Border | #24252a |

The original reference does not provide explicit dark-mode values for every required semantic token, including input, ring, and destructive. It also does not specify all foreground pairing values.

**Decision:** Following Mario's approval of the proposal in Issue #7, the additional values documented in Section 9 are used to complete the dark-mode palette.

These additional values and implementation adjustments are proposed design choices, not original values published in the Linear reference.

## 6. Runtime Dependencies

**Decision:** Do not add a new runtime dependency for this feature.

**Rationale:** CSS variables, Tailwind CSS, and Next.js provide the required foundation. The project constitution requires justification for new runtime dependencies.

**Alternative considered:** `next-themes`. It offers theme selection and persistence but is not necessary for defining the color schema itself.

## 7. Testing and Validation

**Decision:** Validate the implementation using the existing project commands:

- `npm run lint`
- Targeted Prettier formatting and checking
- `npm run typecheck`
- `npm run build`

Also inspect the existing application pages in both light and dark appearances.

**Validation completed:**

- ESLint completed successfully.
- Targeted Prettier formatting and checking passed for the modified feature files.
- TypeScript type checking passed.
- Next.js production build passed.
- Browser inspection confirmed that the dark theme can be activated using the `.dark` class.
- Browser computed styles confirmed that Inter is applied to the page heading.
- Both light and dark appearances were visually inspected.

**Note:** The full repository Prettier check reported formatting issues in unrelated files. The targeted formatting checks for the feature files passed. The current package scripts do not include a dedicated test command.

## 8. Scope

This feature covers:

- Light and dark semantic color variables.
- Tailwind CSS 4 theme integration.
- Inter and JetBrains Mono typography.
- Consistent use of the approved design tokens.

This feature does not cover:

- A theme toggle interface.
- Saving a user's theme preference.
- Installing `next-themes`.
- Redesigning individual application pages beyond what is needed to adopt the shared theme.

## 9. Proposed Dark-Mode Values and Foreground Pairings

**Decision:** Following Mario's direction to proceed with the proposal, use the following additional values to complete the dark-mode palette.

These are proposed design values and implementation adjustments, not original values published in the Linear reference.

### Additional Dark-Mode Values

| Token | Final value | Purpose |
|---|---|---|
| border | #8f9096 | Element boundaries |
| input | #8f9096 | Input boundaries |
| ring | #7987e1 | Keyboard focus indicator |
| destructive | #c08a32 | Destructive actions |

The original Linear reference lists `#24252a` for the dark border. During implementation, the border and input values were adjusted to `#8f9096` to improve interface boundary visibility.

### Additional Foreground Tokens

| Token | Proposed dark value |
|---|---|
| card-foreground | #e3e4e6 |
| primary-foreground | #101011 |
| secondary-foreground | #101011 |
| accent-foreground | #e3e4e6 |
| destructive-foreground | #101011 |

### Light-Theme Adjustments

| Token | Final value |
|---|---|
| primary-foreground | #101011 |
| muted-foreground | #686a71 |
| border | #8f9096 |
| input | #8f9096 |

**Rationale:** These values complement the existing Linear palette and provide contrast between interface surfaces and their text.

**Implementation note:** The foreground roles are included in the semantic token system alongside the original roles. Both light and dark definitions use consistent token names.

## 10. Contrast Review and Final Adjustments

**Decision:** Review text foreground and background combinations against the WCAG AA contrast target of 4.5:1 for normal-sized text. Review applicable interface boundaries and focus indicators against the 3:1 non-text contrast target.

During implementation, the following light-theme values were adjusted:

- `primary-foreground` was changed to `#101011`.
- `muted-foreground` was changed to `#686a71`.
- `border` and `input` were changed to `#8f9096`.

The dark-theme `border` and `input` values were also set to `#8f9096` to improve interface boundary visibility.

### Text Contrast Results

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
|