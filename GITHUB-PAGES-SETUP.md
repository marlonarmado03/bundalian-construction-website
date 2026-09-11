# GitHub Pages Setup

This project is prepared for GitHub Pages using GitHub Actions.

## 1. Create a GitHub repository

Create a new repository on GitHub. Example name:

`construction-website`

You can use another repository name.

## 2. Upload the project

Upload all files in this project to the repository root. Make sure these are visible at the top level:

- `package.json`
- `vite.config.js`
- `index.html`
- `src/`
- `.github/workflows/deploy.yml`

Do not upload `node_modules` or `dist`.

## 3. Use the main branch

Commit the files to the `main` branch.

## 4. Enable GitHub Pages

Open the repository:

`Settings` → `Pages`

Under **Build and deployment**, set **Source** to **GitHub Actions**.

## 5. Wait for deployment

Open the repository's **Actions** tab. The workflow named **Deploy to GitHub Pages** should run automatically after the push.

When it succeeds, open:

`Settings` → `Pages`

GitHub will show the published website URL.

For a normal repository, the URL is usually:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## Important

The admin panel is still a frontend/localStorage admin. Changes made in the admin panel are saved only in the browser being used; they are not shared to other visitors.

The username/password in the frontend are also not secure for a real production admin system. A real shared admin needs a backend/database and server-side authentication.
