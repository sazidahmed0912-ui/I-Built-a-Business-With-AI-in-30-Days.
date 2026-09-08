# I Built a Business With AI in 30 Days — eBook sales site

A two-page static site: a sales/landing page (`index.html`) and a
thank-you/download page (`thank-you.html`). No build step, no
framework — open `index.html` in a browser or upload the folder to
any static host (Netlify, Vercel, Cloudflare Pages, S3, etc).

All sales-page copy and structure are based on the eBook PDF:
**"I Built a Business With AI in 30 Days" (2026 Edition)** — a
practical, step-by-step playbook for first-time founders.

## 1. Configure the site

Everything you're likely to change lives in **`config.js`**:

```js
PAYMENT_URL           // your payment gateway's checkout link
EBOOK_DOWNLOAD_URL     // direct download URL for the eBook file
AUTHOR_NAME            // only appears if you supply a real name
BOOK_TITLE / BOOK_SUBTITLE / BOOK_TAGLINE / BOOK_DESCRIPTOR
SUPPORT_EMAIL
PRICE / CURRENCY       // optional, hidden until PRICE is set
BOOK_COVER_IMAGE       // optional — leave blank to keep the CSS cover mockup
ANALYTICS_ID           // optional
REFUND_POLICY          // required before launch — no policy is invented for you
```

Every "Get This Book" button (header, hero, final CTA, sticky mobile
bar) reads `PAYMENT_URL` automatically — set it once.

## 2. Set up the redirect

In your payment gateway's dashboard, set the **success redirect URL**
to your deployed `thank-you.html` (e.g.
`https://yourdomain.com/thank-you.html` or `/thank-you` if your host
rewrites clean URLs). This site does not process payment or verify
it client-side — that's intentionally left to the gateway.

## 3. Fill in the placeholders before launch

The following are left as clearly marked placeholders on purpose —
none of it is fabricated content:

- **Author name** (`config.js` → `AUTHOR_NAME`) — the site makes no
  claims about the author. Nothing is shown unless you supply it.
- **Payment gateway URL** (`config.js` → `PAYMENT_URL`)
- **EBook download URL** (`config.js` → `EBOOK_DOWNLOAD_URL`)
- **Refund policy** (`config.js` → `REFUND_POLICY`)
- **Open Graph / Twitter image** (`og-image.jpg` reference in
  `index.html` `<head>`) — add a real image and update the path
- **Canonical URLs / `WEBSITE_URL`** — replace `yourdomain.example.com`
  throughout

No guaranteed-income claims, testimonials, review counts, sales
figures, awards, or scarcity messaging are included — the page sells
only what the PDF actually promises.

## 4. File structure

```
index.html        Sales / landing page
thank-you.html     Post-purchase download page
style.css          All styling (design tokens at the top)
config.js          Single source of truth for editable values
main.js            Config injection, FAQ/analytics events, sticky CTA, scroll reveal
```

## 5. Analytics

`main.js` fires `page_view`, `payment_button_click`,
`download_button_click`, `faq_opened`, and `scroll_depth` events. It
automatically uses `window.gtag` or `window.analytics` if present —
just add your analytics snippet's `<script>` tag and set
`ANALYTICS_ID` in `config.js`. Nothing is sent anywhere until you do.

## 6. Download security note

`EBOOK_DOWNLOAD_URL` is a plain link on the thank-you page. That's
fine to start with, but it is a public URL that can be shared/reused
if someone gets hold of it. If you need to prevent link-sharing,
put a lightweight backend or serverless function in front of it that
issues signed, expiring, or one-time-use download links — the
front-end only needs `EBOOK_DOWNLOAD_URL` to point at whatever that
function returns.