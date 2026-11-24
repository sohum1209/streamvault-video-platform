# StreamVault

StreamVault is a Netflix-inspired movie discovery web application. It lets visitors browse movie catalogs, search titles, inspect movie details and trailers, and—after creating an account—save titles to a personal list. The interface is built with Next.js and React; TMDB supplies catalog metadata and Firebase supplies authentication and user-list storage.

This repository is a learning/demo application, not a production streaming service. In particular, the watch page currently plays a shared public HLS demo stream rather than the movie selected by the user.

## What the application does

- Presents a featured movie and horizontal collections for popular, trending, top-rated, and upcoming titles.
- Provides paginated category and search results, movie details, related titles, and TMDB-hosted YouTube trailers when available.
- Supports Firebase email/password sign-up, email verification, sign-in, and sign-out.
- Stores each user's saved titles in Firestore and keeps the list synchronized with a real-time document listener.
- Provides a responsive dark interface with animated transitions and loading, error, and empty states.
- Includes a demo HLS video player with play/pause, seeking, mute, fullscreen, and playback-progress controls.

## Technology and design

| Area | Implementation | Why it is used |
| --- | --- | --- |
| Web application | Next.js 16 App Router, React 19, JavaScript/JSX | File-based routes and React component composition |
| Movie metadata | The Movie Database (TMDB) API | Catalog, search, movie details, genres, similar titles, and video metadata |
| Server-side API boundary | Next.js route handler at `/api/tmdb/*` | Keeps the TMDB API key off browser requests and restricts which upstream paths can be called |
| Remote data state | Redux Toolkit Query (RTK Query) | Centralizes request definitions, loading/error state, and query caching |
| Accounts and saved list | Firebase Authentication and Cloud Firestore | Managed identity and persistent, real-time user data |
| Styling | Tailwind CSS 4, PostCSS, `app/globals.css` | Responsive utility-based layout and shared design tokens |
| Motion and UI | Framer Motion, Radix UI primitives, Lucide and React Icons | Transitions, accessible interaction primitives, and icons |
| Playback | HTML video, `hls.js` | HLS playback in browsers that do not provide native HLS support |

The app separates concerns by placing routes under `app/`, reusable presentation and interaction components under `components/`, TMDB request definitions under `services/`, Redux configuration under `store/`, and Firebase authentication state under `context/`. `firebase.js` initializes the Firebase web SDK; `lib/utils.js` provides the shared Tailwind class-merging helper.

## Architecture and data flow

### Movie data

1. A route or component calls an endpoint hook from `services/movieApi.js`.
2. RTK Query sends a browser request to the same-origin `/api/tmdb/` route.
3. `app/api/tmdb/[...path]/route.js` validates the requested path against an allow-list, adds the server-only `TMDB_API_KEY`, forwards selected query parameters, and returns TMDB's response.
4. The component renders the response using reusable cards, rows, grids, or detail views.

The proxy allows the catalog, search, discovery, genre, detail, similar-title, and video endpoints used by the app. It accepts page values from 1 through 500 and does not cache upstream responses. Keeping the TMDB key server-side prevents the key itself from being included in client JavaScript; configure appropriate usage limits with TMDB as well.

The Redux store currently registers the movie API reducer and middleware. RTK Query owns the catalog request/cache state; the Redux store is not used as a general application state store.

### Authentication and saved titles

1. `AuthContextProvider` subscribes to Firebase's auth-state changes and exposes the current user, loading state, sign-up, login, and logout functions through `UserAuth()`.
2. Sign-up creates a Firebase email/password account, sends a verification email, then creates a Firestore document at `users/{email}` with `name`, `phone`, and an empty `savedShows` array.
3. Login reloads the Firebase user and rejects sign-in if the email has not been verified.
4. `useSaveMovie` listens to that user's Firestore document, exposes the saved titles and display name, and adds or removes titles from `savedShows`.
5. `/my-list` also listens to the profile document and redirects signed-out visitors to login.

Saved entries are compact movie records containing the movie ID, title, and backdrop path. The current Firestore document key is the account email. Firestore security rules are not included in this repository; configure rules in Firebase so each authenticated user can only read and update their own data. Client-side route redirects are a user-experience measure, not a substitute for database authorization.

### Playback and trailers

Movie details use TMDB metadata and select an available YouTube trailer from the video's results. The watch route loads movie details for its title and description, but `components/VideoPlayer.jsx` currently plays the same public HLS sample URL for every movie. It does not retrieve or authorize movie streams. Replace that demo source only with a stream that you own or are licensed to distribute.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Featured movie and home catalog rows |
| `/category/[category]` | Paginated popular, top-rated, trending, upcoming, or now-playing catalog |
| `/search?q=<query>` | Search results driven by the query string |
| `/movie/[movieid]` | Movie information, trailer, save action, and related titles |
| `/movie/[movieid]/similar?q=<title>` | Paginated similar titles |
| `/movie/watch/[movieid]` | Demo HLS player and selected movie's metadata |
| `/my-list` | Signed-in user's saved titles |
| `/login` | Email/password sign-in; supports a `callbackUrl` query parameter |
| `/signup` | Account creation and email verification flow |
| `/api/tmdb/[...path]` | Server-side TMDB proxy used by the browser |

## Project layout

```text
app/
  api/tmdb/[...path]/route.js   TMDB proxy and upstream path validation
  category/[category]/         Paginated category page
  login/                        Login page and client form
  movie/[movieid]/              Movie details and similar-title pages
  movie/watch/[movieid]/        Watch page
  my-list/                      Saved-title page
  search/                       Search route
  signup/                       Registration page
  globals.css                   Global styles and Tailwind theme
  layout.js                     Root layout and global providers
  page.js                       Home page
components/
  hook/useSavedMovie.jsx        Firestore saved-title hook
  ui/                           Shared UI primitives and navigation search
  Main.jsx                      Home-page featured title
  Movie.jsx                     Home-row movie tile
  MovieCard.jsx                 Reusable grid card
  Navbar.jsx                    Global navigation and account menu
  Row.jsx                       Horizontal catalog row
  SearchPage.jsx                Search interface and pagination
  VideoPlayer.jsx               Demo HLS player
context/AuthContext.js          Firebase authentication context
lib/utils.js                    Shared class-name utility
services/movieApi.js            RTK Query endpoints and hooks
store/store.js                  Redux store configuration
firebase.js                     Firebase client initialization
public/                         Static images and framework assets
```

`app/request.jsx` contains legacy endpoint constants; active page data requests are defined in `services/movieApi.js`.

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version.
- npm.
- A TMDB API key.
- A Firebase project with Email/Password Authentication and Cloud Firestore enabled.

### Configure environment

Create `.env.local` in the repository root. Do not commit this file.

```dotenv
TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

The `NEXT_PUBLIC_FIREBASE_*` values are the Firebase web-app configuration and are read by the browser SDK. The TMDB key must remain server-side without a `NEXT_PUBLIC_` prefix. Also configure Firestore security rules and the authorized domains for Firebase Authentication in the Firebase console. The current verification-email action returns to `http://localhost:3000/login`; update that URL in `context/AuthContext.js` for a deployed environment.

### Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. For a production build and local production server:

```bash
npm run build
npm run start
```

Available package scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

No automated test script is currently defined in `package.json`.

## Configuration notes

- `next.config.mjs` allows Next.js image optimization for `image.tmdb.org`, the host used by movie artwork.
- `jsconfig.json` maps `@/` imports to the repository root.
- `.gitignore` excludes environment files, dependencies, and generated Next.js output.
- TMDB artwork is loaded from TMDB's image CDN. Its availability and usage are subject to TMDB's service and terms.

## Current limitations

- Playback uses a single public demonstration HLS stream and is not connected to licensed movie media.
- A client-side sign-in redirect does not secure Firestore data; security depends on Firebase rules, which are configured outside this repository.
- Email verification redirects to localhost until the configured action URL is changed for deployment.
- There is no automated test command configured yet.
