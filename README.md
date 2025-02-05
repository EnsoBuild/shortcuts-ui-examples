# Enso templates monorepo

This project is home of Enso mini-apps. It is structured as a monorepo that includes multiple packages and applications. The project uses TypeScript, React, and several other libraries and tools.

## Project Structure

- `apps/feeling-lucky`: Contains simple swap app that allows users to ape into random token from selected sector for amount and token of their choice
- `packages/*`: Contains helper functions used by mini-apps

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Set up environment variables before running specific apps:
   ```sh
   cd apps/feeling-lucky
   cp .env.example .env
   ```

### Running an Application

1. Start the development server:
   ```sh
   cd apps/feeling-lucky
   pnpm dev
   ```

## License

This project is licensed under the MIT License.
