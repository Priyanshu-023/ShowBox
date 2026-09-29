# Responsive Frontend Changes

The whole frontend was made responsive with mobile-first Tailwind breakpoints. Desktop layout at 1280px and wider (`xl`) is unchanged, except the seat layout page, which now uses the shared padding below 1536px.

## Breakpoints used

| Prefix | Min width | Typical use here |
| --- | --- | --- |
| (none) | 0 | Phone layout |
| `sm:` | 640px | Larger phones, admin cards |
| `md:` | 768px | Tablets, 3-column movie grid, admin sidebar expands |
| `lg:` | 1024px | Full navbar, 4-column grids, seat layout side by side |
| `xl:` | 1280px | Original desktop padding (`px-36`), two seat blocks per row |
| `2xl:` | 1536px | Original seat layout padding (`px-40`) |

Shared page padding: `px-6 md:px-16 xl:px-36`.

## Components

| File | Change |
| --- | --- |
| `components/Navbar.jsx` | Links collapse into a hamburger menu below `lg`, opening a full-screen overlay with a close button. Links are now driven by a `navLinks` array. Logo and Login button shrink on small screens. |
| `components/HeroSection.jsx` | `h-screen` became `min-h-screen py-24`. Title is `text-4xl md:text-6xl`. Metadata row wraps. |
| `components/Footer.jsx` | Columns stack on mobile (`flex-col md:flex-row`). Smaller top margin and column gap on small screens. |
| `components/FeatureSection.jsx` | Responsive padding and top margin. Grid is `grid-cols-2 lg:grid-cols-4`. |
| `components/MovieCard.jsx` | Poster height `h-56 sm:h-82`. Smaller button padding on phones. |
| `components/DateSelect.jsx` | Stacks vertically on mobile. Date buttons scroll sideways and no longer shrink. Smaller padding and margins. |
| `components/MyBookingCard.jsx` | Fixed `w-240` became `w-full max-w-240`. Stacks on mobile, with a full-width poster and the amount and seats on one row. |
| `components/TrailerSection.jsx` | Fixed 960x540 player replaced by a 16:9 container (`aspect-video`, `max-w-240`) with a 100% player. Smaller play icons on phones. |
| `components/admin/AdminSidebar.jsx` | Icon-only rail (`w-14`) below `md`, full sidebar (`w-60`) from `md`. Labels and name hidden on small screens, with tooltips. |

## Pages

| File | Change |
| --- | --- |
| `pages/Movies.jsx`, `pages/Favourite.jsx` | Responsive padding. Grid is `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`. |
| `pages/MyBookings.jsx` | Responsive padding. |
| `pages/MovieDetails.jsx` | Poster stacks above the text on mobile and is centred. Buttons wrap. Title is `text-3xl md:text-4xl`. Smaller section margins. Related grid is `grid-cols-2 lg:grid-cols-4`. |
| `pages/SeatLayout.jsx` | Side-by-side layout starts at `lg` (was `md`). Timings panel is full width below `lg`. Padding is `px-6 md:px-16 2xl:px-40`. Seat blocks are `grid-cols-1 xl:grid-cols-2`. Seat buttons are `h-6 w-6` on phones and `h-8 w-8` from `sm`. |
| `pages/admin/Layout.jsx` | Content area gets `min-w-0` and smaller padding on mobile. |
| `pages/admin/Dashboard.jsx` | Stat cards are full width on mobile. Active shows are a 2-column grid on mobile and a wrapping row from `sm`. |
| `pages/admin/AddShows.jsx` | Date and time row wraps. |
| `pages/admin/ListBookings.jsx`, `pages/admin/ListShows.jsx` | Tables have `min-w-150` so they scroll sideways on small screens. |

## Verification

- `npm run build` passes.
- `eslint src` reports no errors.
- Not yet checked visually in a browser at phone, tablet and desktop widths.
