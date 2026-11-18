# 📊 Marp Multi-Presentation Repository

A production-ready system for hosting multiple [Marp](https://marp.app/) (Markdown Presentation Ecosystem) slide decks with automated GitHub Pages deployment and an [mdbook](https://rust-lang.github.io/mdBook/)-powered landing page.

## Reproducible local tooling

With Nix and Devenv installed, run these commands from the repository root.
`devenv.lock` pins the toolchain; no global npm or Cargo install is needed.

```bash
devenv tasks list
devenv tasks run slides:build
devenv tasks run slides:preview
```

Open <http://127.0.0.1:8000/> for the complete site. Deck wrappers are at
`/presentations/<deck>/index.html`; standalone HTML is at
`/decks/<deck>/index.html`. Stop preview with Ctrl-C. Rebuild after editing.
The generated `book/` and `site/` directories are disposable and ignored by Git.

For live editing, use one of these explicit tasks:

```bash
devenv tasks run slides:marp-preview  # http://localhost:8081/<deck>/slides.md
devenv tasks run slides:book-preview  # http://127.0.0.1:3005/
```

Marp's development server listens on all interfaces; use it on a trusted network.
The book preview requires an initial full build to generate `book/src` and
rebuilds only the book. It can replace the standalone deck output in `site/`;
rerun `slides:build` before using the full-site preview or sharing output.

The pinned packages provide Marp CLI 4.5.1 (Marp Core 4.4.0), mdBook 0.4.40 (matching Pages CI),
Bash, standard shell tools, and Python for static HTTP serving. mdBook comes
from a separate content-addressed Nixpkgs revision pinned in `devenv.nix`; the
remaining packages use `devenv.lock`. HTML generation
does not require a browser. PDF/PPTX/image export and the optional deck-mutating
`scripts/fit-overview-deck-height.mjs` image-fitting utility are outside this
environment; that utility additionally requires Node on PATH and a browser.
Existing remote scripts, fonts, or images in decks may still need network access.
The older manual installation instructions below remain an alternative, but only
the locked Devenv commands define the reproducible local environment.

## 🌐 Live Site

Once deployed, your presentations will be available at:

- **Documentation Site:** `https://<username>.github.io/<repo-name>/`
- **Individual Presentations:** `https://<username>.github.io/<repo-name>/presentations/<deck-name>/`

## ✨ Features

- 📝 **Markdown-based presentations** - Write slides in simple Markdown
- 📚 **mdbook documentation site** - Professional, searchable landing page
- 🎨 **Rich content support** - Code highlighting, Mermaid diagrams, images, custom CSS
- 🚀 **Automated deployment** - Push to main, get live presentations automatically
- 📁 **Multiple decks** - Host unlimited presentations in a single repository
- 🔍 **Full-text search** - Search across all presentations and documentation
- 🎯 **Auto-discovery** - Build script automatically finds and builds all presentations

## 📂 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── pages.yml           # GitHub Actions deployment workflow
├── book/
│   └── src/
│       ├── SUMMARY.md          # mdbook table of contents
│       ├── README.md           # Documentation homepage
│       └── presentations.md    # Auto-generated list of presentations
├── presentations/               # All presentations live here
│   └── demo/
│       ├── slides.md           # Slide content in Markdown
│       └── assets/             # Images and other media
│           ├── .gitkeep
│           └── placeholder.svg
├── scripts/
│   └── build.sh                # Build orchestration script
├── site/                       # Generated output (gitignored)
├── book.toml                   # mdbook configuration
├── .gitignore
├── .marprc.yml                 # Marp configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS version) - [Download](https://nodejs.org/)
- **mdbook** - Install via cargo: `cargo install mdbook`
- **Git** - [Download](https://git-scm.com/)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   ```

2. **Build all presentations and documentation:**
   ```bash
   ./scripts/build.sh
   ```

3. **Preview locally:**
   ```bash
   npx serve site
   # Or use mdbook's built-in server:
   # mdbook serve
   ```
   Open http://localhost:3005 (or the port shown) in your browser.

### Adding a New Presentation

1. **Create directory structure:**
   ```bash
   mkdir -p presentations/my-talk/assets
   ```

2. **Create your slides:**
   Create `presentations/my-talk/slides.md`:
   ```markdown
   ---
   marp: true
   theme: default
   paginate: true
   ---

   # My Presentation Title

   Your first slide content here.

   ---

   ## Second Slide

   More content...
   ```

3. **Add assets (optional):**
   Place images in `presentations/my-talk/assets/` and reference them:
   ```markdown
   ![My Image](assets/image.png)
   ```

4. **Build and test:**
   ```bash
   ./scripts/build.sh
   npx serve site
   ```

   Your new presentation will automatically appear in the "Available Presentations" page!

5. **Commit and push:**
   ```bash
   git add presentations/my-talk
   git commit -m "Add my-talk presentation"
   git push origin main
   ```

Your presentation will be automatically deployed to GitHub Pages!

## 🎨 Advanced Features

### Mermaid Diagrams

Include diagrams using Mermaid.js (client-side rendering):

```markdown
<!-- Load Mermaid.js once at the top of your slides -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true, theme: 'default' });
</script>

<!-- Then use diagrams anywhere -->
<div class="mermaid">
graph LR
    A[Start] --> B[Process]
    B --> C[End]
</div>
```

**Available themes:** `default`, `neutral`, `dark`, `forest`, `base`

### Code Syntax Highlighting

Marp supports syntax highlighting for many languages:

````markdown
```python
def hello_world():
    print("Hello, Marp!")
```
````

Supported languages include: JavaScript, Python, Rust, Go, Java, C++, Ruby, and many more.

### Custom Styling

Add custom CSS within your slides:

```markdown
<style>
h1 {
    color: #667eea;
}
</style>
```

Or use directives for slide-specific styling:

```markdown
<!-- _class: lead -->
# This slide uses the "lead" class
```

### Customizing the mdbook Site

Edit files in `book/src/` to customize the documentation:

- **`SUMMARY.md`** - Table of contents and navigation structure
- **`README.md`** - Homepage content
- **`presentations.md`** - Auto-generated, but you can add content before/after the list
- **`book.toml`** - mdbook configuration (themes, search, etc.)

The build script automatically updates the presentations list in `presentations.md`.

## ⚙️ Configuration

### `book.toml`

mdbook configuration:

```toml
[book]
title = "Presentations"
language = "en"

[output.html]
default-theme = "light"
preferred-dark-theme = "navy"
git-repository-url = "https://github.com/YOUR_USERNAME/YOUR_REPO"
```

Update the `git-repository-url` with your repository URL.

### `.marprc.yml`

Global Marp configuration:

```yaml
html: true  # Required for Mermaid diagrams

options:
  markdown:
    breaks: true  # Convert line breaks to <br>
```

### Build Script (`scripts/build.sh`)

The build script:
1. Scans `presentations/` for directories with `slides.md`
2. Builds each presentation with Marp CLI
3. Generates `presentations.md` with links to all decks
4. Builds the mdbook documentation site
5. Copies presentations into the mdbook output

**Customization:** Modify the script to add PDF export, custom themes, or additional processing.

## 🔧 GitHub Pages Setup

### First-Time Setup

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Update `book.toml`:**
   - Edit `book.toml` and replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name

3. **Push to main:**
   ```bash
   git push origin main
   ```

4. **Monitor deployment:**
   - Go to the **Actions** tab
   - Watch the "Deploy Marp Presentations to GitHub Pages" workflow
   - Once complete, your site will be live!

### Manual Deployment

Trigger a deployment manually from the Actions tab:
1. Go to **Actions**
2. Select "Deploy Marp Presentations to GitHub Pages"
3. Click **Run workflow**

## 🐛 Troubleshooting

### Build fails with "mdbook not found"

Install mdbook:
```bash
cargo install mdbook
```

### Build fails with "slides.md not found"

Ensure your presentation directory contains a `slides.md` file:
```bash
ls presentations/my-talk/slides.md
```

### Images not loading in presentations

1. Verify images are in the `assets/` directory
2. Use relative paths: `![](assets/image.png)`
3. Check file extensions match exactly (case-sensitive on Linux)

### Mermaid diagrams not rendering

1. Ensure `html: true` is set in `.marprc.yml`
2. Verify the Mermaid script tag is at the top of your slides
3. Check browser console for JavaScript errors

### Presentation not displaying correctly

The presentations are standalone HTML files generated by Marp. If you're seeing issues:
1. Make sure you're accessing the presentation at `presentations/<deck>/index.html`
2. Check that assets were copied correctly to `site/presentations/<deck>/assets/`
3. Verify the Marp CLI generated valid HTML (check file size > 0)

### GitHub Pages not updating

1. Ensure GitHub Pages source is set to **GitHub Actions** (not a branch)
2. Check that the workflow completed successfully in the Actions tab
3. Verify mdbook is properly installed in CI (check workflow logs)
4. Wait a few minutes - deployments can take time to propagate
5. Clear your browser cache or try incognito mode

## 📚 Resources

### Marp Documentation
- [Marp Official Website](https://marp.app/)
- [Marpit Markdown Framework](https://marpit.marp.app/)
- [Marp CLI Documentation](https://github.com/marp-team/marp-cli)
- [Built-in Themes](https://github.com/marp-team/marp-core/tree/main/themes)

### mdbook Documentation
- [mdbook User Guide](https://rust-lang.github.io/mdBook/)
- [mdbook Configuration](https://rust-lang.github.io/mdBook/format/configuration/index.html)
- [mdbook Themes](https://rust-lang.github.io/mdBook/format/theme/index.html)

### Mermaid Documentation
- [Mermaid.js Official Docs](https://mermaid.js.org/)
- [Diagram Syntax Reference](https://mermaid.js.org/intro/syntax-reference.html)
- [Live Editor](https://mermaid.live/)

### GitHub Actions
- [GitHub Pages Action](https://github.com/actions/deploy-pages)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

## 🤝 Contributing

Contributions are welcome! To add features or fix bugs:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test locally: `./scripts/build.sh && npx serve site`
5. Commit: `git commit -m "Add my feature"`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

## 📄 License

This repository structure and build system are provided as-is. Feel free to use and modify for your own presentations.

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Build all presentations | `./scripts/build.sh` |
| Preview locally | `npx serve site` or `mdbook serve` |
| Create new deck | `mkdir -p presentations/<name>/assets && touch presentations/<name>/slides.md` |
| Deploy to GitHub Pages | `git push origin main` |
| Manual deployment | GitHub Actions tab → Run workflow |
| Edit documentation | Edit files in `book/src/` |

---

**Built with ❤️ using [Marp](https://marp.app/), [mdbook](https://rust-lang.github.io/mdBook/), and [GitHub Actions](https://github.com/features/actions)**
