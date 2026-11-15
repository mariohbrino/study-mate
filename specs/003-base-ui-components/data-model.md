# Component Model: Study-Mate Base UI Library

## Overview

This feature introduces no persisted entities or database changes. Its model is
the set of reusable component contracts and their presentation states. Consuming
pages continue to own assignment data, authentication, and workflow transitions.

## Shared Conventions

- Each component accepts typed content and applicable native HTML attributes.
- Form controls expose labels and optional descriptions or error feedback.
- Native controls remain controlled or uncontrolled according to the consuming
  form; callers do not provide both `value` and `defaultValue` (or both
  `checked` and `defaultChecked`) for one instance.
- Colors are selected from existing semantic theme roles. Status names remain
  visible as text, so status does not depend on color alone.
- Actual foreground/background theme-token pairs are checked in both color
  modes against WCAG 2.2 AA: normal text at least 4.5:1, large text at least
  3:1, and relevant non-text controls at least 3:1.
- No component persists values or fetches data.

## Component Contracts and States

| Component | Contract data | Presentation states and validation |
|---|---|---|
| Button | Children/action label; `variant` (`primary`, `secondary`, `outline`, `ghost`, `destructive`); `size` (`small`, `medium`, `large`); native button props; optional `isLoading`. | Default, hover, focus-visible, disabled, loading. Loading is non-activatable until the consumer clears it. |
| Card | Caller-provided content and optional header, description, body, and footer regions. | Statistics, assignment, or deadline content; theme-aware surface, border, spacing, and typography. |
| Input | Visible label; native input value/name/type props; optional placeholder, description, and error. | Default, focus-visible, disabled, valid, invalid. Error text is associated with the control. |
| Select | Visible label; native select props and option children; assignment status options Pending, In Progress, Completed; optional description/error. | Default, focus-visible, disabled, selected, invalid as applicable. |
| Badge | Status or neutral label. | Pending, In Progress, Completed, neutral; each status has readable text in both themes. |
| List | Semantic list children; an `isEmpty` signal and optional empty-state content when there are no entries. | Populated or empty; empty content is separate from loading state. |
| Checkbox | Visible label; native checkbox props; checked/defaultChecked and disabled states. | Unchecked, checked, focus-visible, disabled. |
| Textarea | Visible label; native textarea value/name props; optional placeholder, description, and error. | Default, focus-visible, disabled, valid, invalid. Error text is associated with the control. |

## State and Validation Rules

- Assignment status values are `Pending`, `In Progress`, or `Completed`.
- A field error is shown as text, marks the field invalid, and is programmatically
  associated with the field. A field without an error does not expose an invalid
  state.
- A disabled native control is not operable and remains visibly disabled.
- A loading Button reports its pending state accessibly and prevents activation
  while loading.
- List entries use semantic list structure; an empty list renders the caller's
  empty-state content instead of an empty or misleading populated presentation.
- Card, Badge, and List do not imply interactive behavior unless a consuming
  feature supplies an appropriately semantic interactive element.

## Ownership

The consuming form or page owns assignment values, status changes, validation
rules, submission, and loading lifecycle. The shared components own only
consistent markup, styling, and propagation of supplied state.
