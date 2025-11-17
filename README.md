---
disqus: false
---

[<img src="../images/avatar.png" width="150">](http://joshuamccall.com/articles/reading_list)
  [joshuamccall.com](joshuamccall.com)
| [<i class="fa fa-github"  aria-hidden="true"></i> joshmccall221](https://github.com/joshmccall221/gitbook)
| [<i class="fa fa-twitter" aria-hidden="true"></i> joshmccall](https://twitter.com/joshmccall)

## Writing Articles with Plop

This gitbook uses [Plop](https://plopjs.com/) to scaffold new articles. Here's how to create a new article:

### Quick Start

```bash
npm run new
```

### What You'll Be Asked

Plop will prompt you for three pieces of information:

1. **link?** - The URL or reference link for your article (can be left blank)
2. **Article name?** - The name of your article (required)
3. **Draft?** - Whether this is a draft (y/n)

### What Gets Created

When you run `npm run new`, plop will:

1. Create a new article file in `articles/{{snake_case_name}}.md`
2. Create a summary entry file in `plop/`:
   - `plop/article_{{snake_case_name}}.md` (if not a draft)
   - `plop/draft_{{snake_case_name}}.md` (if marked as draft)

### Building Your SUMMARY.md

After creating articles, run the build process to update your table of contents:

```bash
npm run go
```

This command will:
- Recreate SUMMARY.md
- Collect all article entries from `plop/article_*` files
- Collect all draft entries from `plop/draft_*` files
- Append them to SUMMARY.md
- Clean up the temporary plop files
- Build the gitbook
- Copy keybase.txt to docs
- Show git status

### Complete Workflow Example

```bash
# Create a new article
npm run new
# Answer the prompts:
# link? https://example.com/my-article
# Article name? My Awesome Article
# Draft? n

# Build and update everything
npm run go

# Serve locally to preview
npm run serve
```

### Development Commands

- `npm run serve` - Serve the gitbook locally
- `npm run build` - Build the gitbook to ./docs
- `npm run new` - Create a new article with plop
- `npm run go` - Full build process (summary + build + cleanup)

<br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
<br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
<br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
