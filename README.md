# Khwaab Events Website

Static website for Khwaab Events, a GTA-based event decor and styling business.

## Project structure

- `public/index.html` - homepage
- `public/about.html` - about page
- `public/gallery.html` - gallery page
- `public/packages.html` - package PDF links
- `public/faq.html` - FAQs
- `public/contact.html` - booking and contact form
- `public/css/style.css` - main styling
- `public/images/` - website images
- `public/pdfs/` - package PDFs

## Current integrations

- Google Analytics: `G-XW8XJ13QMF`
- Elfsight Google Reviews widget on the homepage
- Google Calendar booking link on the contact page
- Make.com webhook for contact form submissions

## Maintenance notes

### Logo

Several pages reference `/images/logo/khwaab-logo-dark.png`. If the image is renamed or deleted, either restore the file in `public/images/logo/` or update the header on each page.

### Contact form spam protection

The contact form uses a Make.com webhook. Because this is a static website, the webhook URL is visible in the frontend. Keep spam filters active in Make.com.

Recommended Make.com filter rules:

- Reject submissions where `website` is not empty. This is a honeypot spam field.
- Reject submissions with missing `name`, `email`, or `message`.
- Optional: reject submissions where message length is below 10 characters.

### SEO basics

Each page should include:

- Page-specific `<title>`
- Meta description
- Open Graph title and description
- Open Graph image once a final share image is available

### Future cleanup

The header, mobile drawer, footer, and drawer JavaScript are repeated across pages. When the site grows, move those into shared includes or a simple static site generator so updates only need to be made once.
