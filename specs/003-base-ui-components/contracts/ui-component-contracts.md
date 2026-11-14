# UI Component Contracts

These are internal reusable React interfaces for Study-Mate screens, not
network-facing APIs. Public props use explicit TypeScript types and preserve
relevant native HTML attributes. Exact implementation may refine prop naming
without changing the documented behavior.

## Button

- **Content**: visible action label or caller-provided content.
- **Variants**: `primary | secondary | outline | ghost | destructive`.
- **Sizes**: `small | medium | large`.
- **State props**: native `disabled`, plus optional `isLoading`.
- **Native behavior**: button type, name, value, and activation handlers remain
  available to the consuming form.
- **Accessibility**: visible content names the action; icon-only usage requires
  an accessible name. Loading state is announced and not activatable.
- **Design**: semantic theme classes, visible focus, and consistent size and
  spacing.

## Card

- **Content**: caller-composed children for statistics, assignment information,
  or upcoming deadlines.
- **Composition**: optional header, title/description, content, and footer
  regions, grouped under the Card component API.
- **Accessibility**: use a semantic article/section only when the content
  warrants that meaning; do not make a card interactive by default.

## Input

- **Required**: visible `label`.
- **Optional**: `id`, `description`, `error`, placeholder, required flag, and
  native input attributes.
- **Accessibility**: label is associated with the input; description and error
  are associated with it; error text is visible and the invalid state is
  conveyed programmatically. Without an error, the control does not expose an
  invalid state. Use a caller-provided id or a stable generated id for label and
  message associations.
- **Use cases**: assignment title, course name, search.

## Select

- **Required**: visible `label` and option children.
- **Optional**: `id`, description, error, required flag, and native select
  attributes.
- **Options**: Pending, In Progress, and Completed for assignment status; the
  generic control can also accept other options when appropriate.
- **Accessibility**: retain native select keyboard behavior and associate label
  and error feedback with the control. Use a caller-provided id or a stable
  generated id for associations.

## Badge

- **Required**: readable status or neutral text.
- **Status values**: `pending | inProgress | completed | neutral`.
- **Accessibility**: do not rely on color alone to convey the status.

## List

- **Content**: semantic list children supplied by the consuming page.
- **Empty state**: optional `isEmpty` signal and caller-provided empty-state
  content, shown when there are no entries.
- **Accessibility**: use list and list-item semantics; keep loading distinct
  from empty state.

## Checkbox

- **Required**: visible label and native checkbox state.
- **Optional**: `id`, description, error, checked/defaultChecked, disabled, and
  native input attributes other than `type`.
- **Accessibility**: associate the label with the checkbox; preserve native
  keyboard and form behavior. Use a caller-provided id or a stable generated id.

## Textarea

- **Required**: visible `label`.
- **Optional**: `id`, `description`, `error`, placeholder, required flag, and
  native textarea attributes.
- **Accessibility**: associate label, description, and error with the textarea;
  expose invalid state when an error is present and do not expose an invalid
  state when no error is present. Use a caller-provided id or a stable generated
  id for associations.

## Cross-Component Styling Contract

- Use the existing semantic Tailwind utilities generated from `globals.css`;
  do not add hardcoded hex colors or new global tokens.
- Map Button variants to existing primary, secondary, outline/input, accent, and
  destructive roles. Map status badges to existing muted, accent, and secondary
  roles while keeping the status label visible; keep neutral badges on a neutral
  surface.
- Preserve visible focus, legible disabled states, and light/dark appearance.
- Verify actual foreground/background theme-token pairs in both modes against
  WCAG 2.2 AA: normal text at least 4.5:1, large text at least 3:1, and
  relevant non-text controls at least 3:1.
- Keep components data-agnostic and server-compatible unless local browser
  behavior is demonstrably necessary.
- Do not require `asChild`, Radix primitives, a class-variance package, or a
  new shadcn configuration.
