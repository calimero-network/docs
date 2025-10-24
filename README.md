# Calimero Documentation

New Calimero documentation site built with MkDocs Material.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- pip

### Local Development

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Start development server:**
```bash
mkdocs serve
```

3. **Open in browser:**
```
http://127.0.0.1:8000
```

The site will auto-reload when you make changes.

## 📁 Structure

```
docs/
├── docs/                  # Documentation content
│   ├── intro/            # Introduction
│   ├── builder-directory/ # Developer guide
│   ├── app-directory/    # App examples
│   ├── privacy-verifiability-security/
│   ├── assets/           # Images, logos, etc.
│   └── stylesheets/      # Custom CSS
├── mkdocs.yml            # MkDocs configuration
├── requirements.txt      # Python dependencies
└── vercel.json          # Vercel deployment config
```

## 🎨 Customization

### Branding
- Logo files: `docs/assets/img/logo-black.svg` and `logo-white.svg`
- Favicon: `docs/assets/img/favicon.svg`
- Custom styles: `docs/stylesheets/extra.css`

### Theme
Configure in `mkdocs.yml`:
- Colors (primary/accent)
- Fonts
- Features
- Navigation

## 🚢 Deployment

### Automatic Deployment (Vercel)

**Production:** Push to `master` → https://docs.calimero.network  
**Preview:** Open PR → Unique preview URL (posted by Vercel bot)

**No manual deployment needed!** Everything is automated.

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide.

**Configuration files:**
- `vercel.json` - Build and output settings
- `requirements.txt` - Python dependencies
- `runtime.txt` - Python version
- `.github/workflows/build-check.yml` - CI validation

### Local Build

```bash
mkdocs build
```

Output will be in the `site/` directory.

## 📝 Adding Content

1. Create or edit Markdown files in `docs/`
2. Update navigation in `mkdocs.yml` under `nav:`
3. Test locally with `mkdocs serve`
4. Commit and push to deploy

## 🔗 Links

- **Live Site:** https://docs.calimero.network
- **MkDocs:** https://www.mkdocs.org
- **Material Theme:** https://squidfunk.github.io/mkdocs-material
- **GitHub:** https://github.com/calimero-network/docs
