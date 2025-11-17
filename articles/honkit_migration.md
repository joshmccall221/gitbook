# Migrating from GitBook CLI to HonKit

## The Problem

After years of using GitBook CLI for this documentation site, the inevitable happened: GitBook CLI became deprecated and stopped working with modern Node.js versions. The tool hadn't been maintained for years, and trying to run it with Node.js versions above v12 would fail with various errors.

This left me with a choice: abandon the setup entirely and migrate to a different documentation platform, or find a way to keep the existing content and configuration working.

## The Solution: HonKit

Enter [HonKit](https://github.com/honkit/honkit) - an actively maintained fork of GitBook that promises to be a drop-in replacement while supporting modern Node.js versions.

The key advantages of HonKit:
- **Actively maintained** - Regular updates and security patches
- **Modern Node.js support** - Works with Node.js v14+ (tested with v22)
- **Full compatibility** - Maintains compatibility with existing GitBook plugins and configurations
- **Drop-in replacement** - Minimal changes required to migrate

## What Changed

The migration was surprisingly straightforward. Here's what was updated:

### 1. Package Dependencies

Replaced the deprecated `gitbook-cli` with `honkit`:

```json
{
  "devDependencies": {
    "honkit": "^5.0.0",
    // gitbook-cli removed
  }
}
```

### 2. NPM Scripts

Updated all scripts to use `honkit` instead of `gitbook`:

```json
{
  "scripts": {
    "start": "honkit serve",
    "build": "honkit build . docs",
    "serve": "honkit serve"
  }
}
```

### 3. Removed nvm Dependencies

The previous setup had preinstall/postinstall scripts to manage Node.js versions via nvm. Since HonKit works with modern Node.js versions, these workarounds were no longer necessary.

### 4. Updated rimraf

Updated `rimraf` to the latest version (v5.0.0) to ensure compatibility with modern Node.js.

### 5. Added Documentation

Created `GITBOOK_SETUP.md` with clear instructions for:
- Installing dependencies
- Running the development server
- Building the static site
- Troubleshooting common issues

## What Stayed the Same

The beauty of HonKit being a true drop-in replacement means:

- **All content stayed the same** - Every markdown file, article, and draft remains unchanged
- **book.json configuration** - All plugins (Disqus, ETOC, etc.) continue to work
- **SUMMARY.md structure** - The table of contents and menu structure is identical
- **Build output** - The generated static site looks and functions the same

## The Migration Process

The actual migration took just a few simple steps:

1. Remove old dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Update package.json with HonKit

3. Install fresh dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Test the build:
   ```bash
   npm run build
   npm start
   ```

And that's it! The site was running locally on `http://localhost:4000` with zero issues.

## Testing

The migration was tested with:
- **Node.js v22.21.1** - The latest LTS version at the time
- **All existing plugins** - Verified that Disqus, ETOC, and other plugins still functioned
- **Build process** - Confirmed the static site builds correctly to `./docs`
- **Live reload** - Tested the development server's auto-reload functionality

## Lessons Learned

1. **Open source sustainability matters** - Projects that appear dead can suddenly become blockers
2. **Forks can save the day** - The community stepped up with HonKit when the original project stalled
3. **Simple is better** - The minimal configuration and straightforward setup of GitBook/HonKit continues to serve well
4. **Document your tooling** - Having clear setup instructions makes migrations easier

## Why This Matters

This migration ensures:
- **Continued maintenance** - Can keep updating and publishing content
- **Modern development environment** - Works with current Node.js versions
- **Future proofing** - Active development means security patches and bug fixes
- **Developer experience** - No more workarounds or version managers required

## Resources

- [HonKit GitHub Repository](https://github.com/honkit/honkit)
- [HonKit Documentation](https://honkit.netlify.app/)
- [Original GitBook Legacy](https://github.com/GitbookIO/gitbook)
- [This repo's GITBOOK_SETUP.md](../GITBOOK_SETUP.md)

## Conclusion

Sometimes the best solution is the one that requires the least change. HonKit proved to be exactly that - a seamless upgrade path that kept everything working while modernizing the tooling underneath.

If you're still using the old GitBook CLI, I highly recommend making the switch to HonKit. The migration is simple, and your future self will thank you when you're not fighting with deprecated dependencies.
