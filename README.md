
# Shouter

The newest, loudest social media platform! 📢

## For developers

This is a single-page application written with Vite and React + Tailwind.

This project uses React Router for routing and React Query for data fetching.

Authentication information is stored in LocalStorage or SessionStorage based on
whether "Remember me" was checked.

### How to develop

Super simple, install dependencies and start the dev server:

```
$ npm install
$ npm run dev
```

This launches a Vite dev server with hot module replacement.

### How to build

Do a clean dependency install (just in case) and run the build script:

```
$ npm ci
$ npm run build
```

The application has now been built into the `dist/` directory.
