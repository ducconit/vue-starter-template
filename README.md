# Vue Starter Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple.svg)](https://vitejs.dev/)

A modern starter template for Vue 3 projects using TypeScript, Vite, and best practices for building scalable web applications.

## Features

- 🚀 [Vue 3](https://vuejs.org/) with Composition API and `<script setup>`
- 🔧 [TypeScript](https://www.typescriptlang.org/) for type safety
- ⚡️ [Vite](https://vitejs.dev/) for fast development and optimized builds
- 📦 [Pinia](https://pinia.vuejs.org/) for state management
- 🔄 [Vue Router](https://router.vuejs.org/) for client-side routing
- 🧪 Testing setup with [Vitest](https://vitest.dev/)
- 🎨 CSS preprocessing with SCSS
- 📱 Responsive design utilities
- 🔒 Authentication flow implementation
- 🧩 Component architecture best practices

## Getting Started

### Prerequisites

- Bun

### Installation

```bash
# Clone the repository
git clone https://github.com/ducconit/vue-starter-template.git
cd vue-starter-template

# Install dependencies
bun install

# Start development server
bun run dev
```

### Build for Production

```bash
bun run build
```

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── api/            # API service layer
│   ├── assets/         # Assets that will be processed by the build
│   ├── components/     # Reusable Vue components
│   ├── layouts/        # Layout components
│   ├── plugins/        # Vue plugins and extensions
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── pages/          # Page components
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
├── eslint.config.ts    # ESLint configuration
├── .gitignore          # Git ignore rules
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── bun.lockb           # Bun lock file
└── README.md           # Project documentation
```

## Documentation

For detailed documentation on Vue 3, check out the [Vue.js Documentation](https://vuejs.org/guide/introduction.html).

For TypeScript in Vue, refer to the [Vue TypeScript Guide](https://vuejs.org/guide/typescript/overview.html).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ducconit/vue-starter-template&type=Date)](https://www.star-history.com/#ducconit/vue-starter-template&Date)
