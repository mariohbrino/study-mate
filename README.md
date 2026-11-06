# Study Mate

A study companion application to help you manage and organize your study sessions effectively.

## Set up

```bash
npm install
```

## Development

To start the development server, run:

```bash
npm run dev
```

Code style, formatting, and type checking:

```bash
npm run lint
npm run format
npm run typecheck
```

## Specifications

### Set up

Install UV package manager if you havent't already:

```bash
pip install uv
```

Create and activate a virtual environment with Python 3.13:

```bash
uv sync
source .venv/bin/activate
```

> [!IMPORTANT]
>
> uv sync --python /opt/homebrew/bin/python3.13
>
> When working with Apple Silicon (ARM64), it requires to install python 3.13 using homebrew and define flag --python /opt/homebrew/bin/python3.13 due to architecture-specific dependencies.

## Specs

On the chat interface, use the following commands to define the application specifications.

```bash
/speckit.constitution your desired conditions
/speckit.specify your desired specifications
```
