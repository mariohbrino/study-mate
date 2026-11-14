# Quickstart: Base UI Components

## Prerequisites

- Node.js 20.9 or later and npm, as documented in the repository README.
- Dependencies installed with `npm ci`.
- The component test script and test-only dependencies from the implementation
  are present.

## Automated Validation

From the repository root, run:

```powershell
npm run test:components
npm run lint
npm run format
npm run typecheck
```

Expected result: all component behavior tests pass, ESLint reports no errors,
Prettier finds no formatting changes, and TypeScript reports no type errors.

### Validation Record

- `npm run test:components`: passed (9 files, 39 tests).
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Targeted Prettier check for the component library, tests, and feature files:
  passed.
- `npm run format`: reports 22 pre-existing repository files needing formatting;
  no component-library or test files are among them.

The component tests should exercise each control through accessible labels and
roles, including:

- Button variants and sizes, Add/Save/Edit/Cancel/Delete labels, disabled and
  loading behavior, and no repeated activation. Verify pointer hover and
  keyboard focus interaction states.
- Input and Textarea labels, descriptions, disabled behavior, valid and invalid
  feedback (valid values do not expose an invalid marker), and associated error
  messages for invalid values.
- Select status choices and disabled/focus states.
- Checked, unchecked, and disabled Checkbox behavior.
- Badge status text and neutral presentation.
- Card content and populated/empty List rendering.
- Semantic theme utility usage and accessible interaction states for the
  component library.
- Keyboard interaction for every applicable interactive control.

## Visual and Accessibility Review

Temporarily render representative component examples in the existing
`src/app/page.tsx`, then start the application with `npm run dev` and inspect
them in a browser. Preserve unrelated page content and remove only the temporary
examples after review; do not add a preview route to the delivered feature.

1. Review every component against the semantic theme in light and dark modes.
2. Manually inspect hover and visible focus states, disabled states, readable
   labels, and error associations using keyboard navigation.
3. Check narrow and wide viewport layouts for clipping, obscured content, or
   component-caused horizontal scrolling.
4. Measure actual foreground/background theme-token pairs in both modes; token
   names alone are not proof of contrast. Verify WCAG 2.2 AA minimums of 4.5:1
   for normal text, 3:1 for large text, and 3:1 for relevant non-text controls.
   Record the token pairings, measured ratios, and any failing pairings here.

Expected result: all eight components remain legible and usable across both
themes and viewport ranges, all reviewed token pairs meet the stated contrast
thresholds, and no assignment workflow or global theme configuration changes.

### Review Record

- Browser review: light and dark modes were inspected at wide and narrow
  widths. At the narrow effective viewport of 400 CSS pixels, controls wrapped
  without horizontal overflow or clipping; labels, error messages, and card
  content remained legible. The wide layouts also showed no clipping.
- Interaction appearance: button hover opacity and the visible keyboard focus
  ring were observed. Disabled and loading button states were also reviewed.
- Contrast ratios below were calculated from the actual semantic token values
  in `src/app/globals.css` using WCAG relative luminance. Every listed text pair
  meets the 4.5:1 normal-text minimum; the border and focus-ring pairs meet the
  3:1 non-text minimum.

| Foreground / background token pair | Light | Dark |
| --- | ---: | ---: |
| `foreground` / `background` | 16.65:1 | 14.95:1 |
| `card-foreground` / `card` | 17.22:1 | 13.96:1 |
| `primary-foreground` / `primary` | 4.81:1 | 15.24:1 |
| `secondary-foreground` / `secondary` | 16.65:1 | 5.76:1 |
| `accent-foreground` / `accent` | 15.38:1 | 9.53:1 |
| `muted-foreground` / `muted` | 4.58:1 | 7.21:1 |
| `foreground` / `muted` (neutral badge) | 14.61:1 | 14.47:1 |
| `destructive-foreground` / `destructive` | 4.98:1 | 6.27:1 |
| `border` / `background` (control boundary) | 3.08:1 | 5.97:1 |
| `ring` / `background` (focus indicator) | 4.97:1 | 5.76:1 |
| `destructive` / `background` (error text) | 4.81:1 | 6.27:1 |

## Usability Review

This is a post-implementation usability goal, not a release gate. After the
representative component examples are ready, conduct an unassisted review with
10 target-student participants. Present the primary action,
assignment status, and field error in the example contexts without explaining
which elements to identify. Count a participant as successful only if they
identify all three correctly without assistance. Record the aggregate result
and anonymized observations here; do not record participant names or other
identifying information. The acceptance threshold is at least 9 successful
participants out of 10.
