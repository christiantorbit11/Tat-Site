# Tatz By Fatz — Portfolio Site

Custom tattoo artist portfolio & booking site for **Tatz By Fatz** (Baltimore, MD).
Static site — no build step. Open `index.html` directly or serve the folder with any static file server.

```
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Structure

- `index.html` — all page content/sections
- `css/styles.css` — theme, layout, animations
- `js/main.js` — nav, scroll reveal, lightbox, lazy video, booking-embed fallback
- `assets/portfolio/` — cropped tattoo photos used in the gallery
- `assets/process/` — behind-the-scenes / studio setup photos
- `assets/brand/` — AI-illustrated artist portrait + source logo badge
- `assets/video/process-tattooing.mp4` — real self-hosted tattooing footage (hero of the Process section)

## AI motion clips (Higgsfield)

The hero background and several portfolio pieces use short looping motion clips generated with
Higgsfield (`kling3_0_turbo`, image-to-video) from the cropped portfolio stills. Because this build
environment's network egress is restricted to a small allow-list, those generated `.mp4` files could
**not** be downloaded into this repo — they're currently linked directly from Higgsfield's hosted CDN
URLs in `index.html` (search for `cloudfront.net`).

**For long-term durability**, download those 6 clips and commit them under `assets/video/motion/`,
then swap the CloudFront URLs in `index.html` for local paths — this removes the dependency on the
Higgsfield account/CDN staying available indefinitely. All 6 source images used to generate them are
already in `assets/brand/` and `assets/portfolio/` if you ever want to regenerate.

## Booking

The Booking section embeds `venue.ink`'s calendar in an iframe. Venue.ink blocks being framed
(no `X-Frame-Options`/CSP allowance), so `js/main.js` detects that automatically and falls back to a
prominent "Book Directly" card (call/text/email) plus an "Open Booking Calendar ↗" button that opens
venue.ink in a new tab. Direct contact: **443-469-0151** · **cjacobs0115@gmail.com**.
