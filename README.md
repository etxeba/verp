# VERP (Venture Capital ERP System)

An open-source ERP system for venture capital fund management, integrating financial tracking, portfolio management, reporting, and AI-powered analytics.

## Project Structure

```
verp/
├── packages/              # Monorepo structure
│   ├── backend/          # Node.js/Express API
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   ├── frontend/         # React application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── shared/           # Shared types and utilities
│       ├── src/
│       └── package.json
├── docker/               # Docker configuration
├── docs/                 # Documentation
├── package.json          # Root package.json
└── README.md            # Project documentation
```

## Development Setup

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Git
- Docker and Docker Compose (for local development)

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` in each package that requires it
   - Update the variables as needed

### Branch Structure

- `main`: Production branch
- `develop`: Development branch
- Feature branches should be created from `develop` using the format: `feature/feature-name`

### Development Workflow

1. Create a new feature branch from `develop`
2. Make your changes
3. Submit a pull request to `develop`
4. After review and testing, changes will be merged to `develop`
5. Periodic releases will be merged to `main`

## Available Scripts

TBD - Scripts will be added as development progresses.

## License

Apache License 2.0. See [LICENSE](LICENSE) for more information.