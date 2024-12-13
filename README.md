# Enso shortcuts UI monorepo

This is a monorepo project that includes multiple packages and applications. The project uses TypeScript, React, and several other libraries and tools.

## Project Structure

- `apps/feeling-lucky`: Contains example mini-app
- `packages/sdk`: Contains the SDK used by mini-apps

## Getting Started

### Prerequisites

- Node.js
- Yarn

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```sh
    yarn install
    ```

### Running the Application

1. Start the development server:
    ```sh
    yarn sdk:dev
    yarn fl:dev
    ```

### Building the SDK

1. Navigate to the SDK directory:
    ```sh
    cd packages/sdk
    ```

2. Build the SDK:
    ```sh
    yarn build
    ```

## License

This project is licensed under the MIT License.