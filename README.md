# Teach2Learn website

This is a standalone React website that runs locally. It does not require a ChatGPT account or any other sign-in.

## Open in VS Code

1. Open VS Code.
2. Choose **File → Open Folder**.
3. Select the `teach2learn-local` folder.

## Run the site

Open VS Code's terminal and run:

```bash
npm install
npm run dev
```

Then open the localhost address shown in the terminal, usually `http://localhost:5173`.

## Main files

- `src/App.jsx` — page content and sections
- `src/styles.css` — colors, layout, and responsive design
- `public/` — website images

## Build a production copy

```bash
npm run build
```

The finished static files will be created in `dist/`.
