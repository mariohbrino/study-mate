# Quickstart: Study Mate Theme

## Prerequisites

- Node.js version specified by the project.
- npm installed.
- Study Mate repository cloned locally.
- Project dependencies installed.

## 1. Start the Application

From the project root, run:

    npm install
    npm run dev

Open the local address shown in the terminal, normally http://localhost:3000.

## 2. Inspect the Light Theme

- Open the application.
- Confirm the light background and foreground colors.
- Inspect cards, buttons, borders, and form controls.
- Confirm that text is readable.
- Verify that all 17 semantic color tokens have their expected light-theme values.

## 3. Inspect the Dark Theme

After implementation, use browser developer tools to add the `dark` class to the root HTML element:

    <html class="dark">

Inspect the same application elements again.

- Confirm the dark background and foreground colors.
- Inspect cards, buttons, borders, and form controls.
- Confirm that text is readable.
- Verify that all 17 semantic color tokens have their expected dark-theme values.

Remove the class to return to the light theme.

Note: This is a development validation method, not a user-facing theme switcher.

## 4. Validate Typography

Confirm that:

- Inter is used for normal application content.
- JetBrains Mono is available for technical text.
- Typography remains readable in both appearances.

## 5. Run Quality Checks

Run these commands from the project root:

    npm run lint
    npm run format
    npm run typecheck
    npm run build

Expected results:

- ESLint reports no new errors.
- Prettier reports correctly formatted files.
- TypeScript reports no type errors.
- Next.js completes the production build successfully.

## 6. Final Review

Before submitting the pull request:

- Confirm all 17 semantic color tokens have light and dark values.
- Confirm the five foreground pairing roles are reviewed for sufficient contrast.
- Confirm proposed palette values are documented in `research.md` and `data-model.md`.
- Confirm existing application functionality still works.
- Review the changes with `git diff`.
- Ensure no unrelated files or changes are included.