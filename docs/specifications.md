# Specifications

## 1. Environment Setup

### 1.1 Install UV

Install the UV package manager if it is not already available.

```bash
pip install uv
```

Alternatively, follow the [official UV installation instructions](https://docs.astral.sh/uv/getting-started/installation/).

### 1.2 Configure the Python Environment

Synchronize the project dependencies and create the virtual environment:

```bash
uv sync
```

**Important — Apple Silicon (ARM64)**

When working on Apple Silicon, ensure that UV uses a native macOS ARM64 Python interpreter.

If necessary, specify the interpreter explicitly:

```bash
uv sync --python /opt/homebrew/bin/python3.13
```

The virtual environment is required for running Python-based project tooling, including Spec Kit CLI commands.

### 1.3 Activate the Virtual Environment

**Linux and macOS:**

```bash
source .venv/bin/activate
```

**Windows — PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

If PowerShell prevents script execution, you may need to adjust the execution policy for your current user:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Alternatively, use Windows Command Prompt:

```cmd
.venv\Scripts\activate.bat
```

---

## 2. Define Application Specifications

Use GitHub Spec Kit integrated with VS Code Copilot to establish the project specifications and development guidelines.

The following commands are available through the Copilot chat interface.

### 2.1 Project Constitution

Use `/speckit.constitution` to establish the fundamental principles, architectural guidelines, coding standards, and constraints that must be followed throughout the project.

```text
/speckit.constitution Define the project principles, architectural guidelines, and development standards.
```

### 2.2 Application Specifications

Use `/speckit.specify` to describe the application's purpose, expected functionality, user requirements, and business rules.

```text
/speckit.specify Describe the application requirements, features, expected behavior, and business rules.
```

**Important:** Provide clear and detailed requirements. The quality of the generated specifications depends on the completeness and clarity of the instructions.
