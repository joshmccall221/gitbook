# GitBook Setup - Now Using HonKit

This repository has been updated to use **HonKit** instead of the deprecated `gitbook-cli`.

## What Changed?

- Replaced `gitbook-cli` with [HonKit](https://github.com/honkit/honkit) - a maintained fork of GitBook
- Updated to work with modern Node.js versions (tested with Node v22)
- Removed nvm dependency requirements
- All GitBook plugins and configurations remain compatible

## Quick Start

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Run Locally

```bash
# Start development server (with live reload)
npm start
# or
npm run serve

# The site will be available at http://localhost:4000
```

### Build Static Site

```bash
# Build to ./docs directory
npm run build
```

## Available Scripts

- `npm start` - Start development server with live reload
- `npm run serve` - Same as start (serves on http://localhost:4000)
- `npm run build` - Build static site to ./docs directory
- `npm run docs:build` - Same as build
- `npm run spellcheck` - Run markdown spellcheck
- `npm run new` - Create new content using plop

## Why HonKit?

The original GitBook CLI was deprecated and no longer works with Node.js versions above v12. HonKit is an actively maintained fork that:

- Works with modern Node.js versions (v14+)
- Is a drop-in replacement for GitBook
- Maintains compatibility with existing GitBook plugins
- Continues to receive updates and security patches

## Original GitBook Configuration

All original GitBook configurations in `book.json` remain unchanged and work with HonKit:

- Disqus plugin for comments
- ETOC plugin for table of contents
- All existing markdown content and structure

## Troubleshooting

If you encounter any issues:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install --legacy-peer-deps
   ```

2. Clear the build cache:
   ```bash
   rm -rf _book
   npm run build
   ```

For more information, visit the [HonKit documentation](https://github.com/honkit/honkit).
