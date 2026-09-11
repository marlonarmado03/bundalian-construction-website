# Bundalian — Admin

Modern React + Vite construction company website with a redesigned white / brown / black / dark-maroon visual system.

## Public website
Open `/` (or the root URL). Visitors can:
- Browse the company website
- Switch between Light and Dark mode
- View About, Services, Projects, Why Us and Contact
- Filter projects
- Use the contact form UI


Admin can edit company/hero/contact content and project/media data. Data is saved to browser localStorage.

## Run locally

```bash
npm install
npm run dev
```

## Build for free static hosting

```bash
npm run build
```

Upload the generated `dist` folder to a static host such as Netlify or Vercel.

## Important security note
The fixed admin credentials are intentionally frontend-only for this static/no-database demo. They are NOT real production security. For a public production website where admin edits must be shared with every visitor, use server-side authentication plus a database/CMS and hosted media storage.
