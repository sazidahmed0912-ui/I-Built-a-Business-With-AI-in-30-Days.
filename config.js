/**
 * =========================================================
 *  SITE CONFIGURATION
 *  Edit the values below. Nothing else in the codebase
 *  needs to change — every page reads from this file.
 *
 *  Single source of truth for the sales page and the
 *  thank-you page. All copy is based on the eBook PDF:
 *  "I Built a Business With AI in 30 Days" (2026 Edition).
 * =========================================================
 */
const SITE_CONFIG = {
  // --- Book details -----------------------------------------------------
  BOOK_TITLE: "I Built a Business With AI in 30 Days",
  BOOK_SUBTITLE:
    "A practical, step-by-step playbook for first-time founders.",
  BOOK_TAGLINE:
    "Pick an idea. Build it with AI tools. Launch it. Get your first paying customer.",
  BOOK_DESCRIPTOR: "2026 Edition · A Playbook for First-Time Founders",

  // --- Author -------------------------------------------------------------
  // Replace with the real author name. Do not add credentials, companies,
  // or awards here unless they are true. No credential is presented unless
  // you supply it here.
  AUTHOR_NAME: "Author Name",

  // --- Payment --------------------------------------------------------
  // Page buyers land on after clicking any "Buy Now" / "Get This Book"
  // button. Default: pay.html — the UPI payment instructions page.
  // All purchase buttons read this single value.
  PAYMENT_URL: "pay.html",

  // Screenshot form endpoint. The on-site upload form on /pay posts here,
  // and the service emails you the screenshot + buyer details.
  // FormSubmit (free) is used by default — replace with your real email:
  //   https://formsubmit.co/YOUR_EMAIL@EXAMPLE.COM
  // First submission triggers an activation email from FormSubmit; click
  // "activate" once and everything after that flows automatically.
  // File limit on FormSubmit's free tier: ~2MB per file.
  PAYMENT_FORM_URL: "https://formsubmit.co/support@yourdomain.example.com",

  // Where buyers land after submitting the screenshot. Shows a
  // "we received your payment details" confirmation.
  PAYMENT_FORM_NEXT_URL: "thank-you.html",

  // --- Delivery -------------------------------------------------------
  // Replace with the real, direct download URL for the eBook file.
  // This is only ever surfaced on the /thank-you page, never on the
  // sales page. See section 23–24 of the brief re: link security — a
  // static public URL can be shared, so treat this as a first version.
  EBOOK_DOWNLOAD_URL: "I Built a Business With AI in 30 Days.pdf",

  // --- Site -------------------------------------------------------------
  WEBSITE_URL: "https://yourdomain.example.com",
  SUPPORT_EMAIL: "support@yourdomain.example.com",

  // --- Pricing ----------------------------------------------------------
  // Leave PRICE as an empty string to hide price display entirely until
  // you've set a real number.
  PRICE: "₹49",
  CURRENCY: "",

  // --- Cover art ----------------------------------------------------------
  // If set to a real image path, the CSS-built cover mockup is replaced
  // by this image wherever the cover appears (hero, final CTA, thank-you).
  // Set to the deployed path of your eBook cover (e.g. "book-cover.png").
  BOOK_COVER_IMAGE: "book-cover.png",

  // --- Analytics --------------------------------------------------------
  // Optional. Leave empty to disable. No analytics are fabricated or
  // sent anywhere until a real ID is provided here.
  ANALYTICS_ID: "",

  // --- Policy placeholders (must be filled in before launch) -----------
  REFUND_POLICY:
    "[Add your refund policy here — e.g. window length, how to request one, and any conditions.]",
};