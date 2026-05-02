# Webstarter — Marketing Site Starter Kit

A personal marketing-site starter built on 11ty, designed to be portable: the HTML output and CSS should be copy-pasteable into Rails, WordPress, Sanity-backed sites, or stay in 11ty. 11ty is used for convenience (layout includes, dev server, markdown), not as a load-bearing framework. Anything 11ty-specific stays at the layout-chrome level.

The kit's job is to **showcase a small, opinionated set of markup and CSS conventions**. It is not a content pipeline, a CMS, or a component library. Demo pages exist to demonstrate the conventions; real projects fill in real content.


## General approach and style

These principles are load-bearing. Future changes should reinforce them, not erode them.

- **Minimal, semantic HTML.** No unnecessary divs. Almost all classes are semantic component names on the component root (`.card`, `.hero`). Children are styled via nested element selectors, not classes.
- **Modern CSS only.** Native nesting, `:has()`, `:user-invalid`, `:focus-visible`, container queries, subgrid, `oklch()`, `clamp()`. Target evergreen browsers, last 2 versions. No autoprefixer, no transpilation, no fallbacks for things that are Baseline.
- **Grid + gap over margins.** Layout uses `display: grid` with `gap`. Vertical rhythm in prose uses a `.flow` utility (`> * + *`). Avoid per-element margins for spacing between siblings.
- **Tokens for everything variable.** Type, spacing, colour, breakpoints all live as custom properties. Components reference tokens, never raw values.
- **Portable output.** Treat the rendered HTML and bundled CSS as the deliverable. Do not lean on 11ty macros, shortcodes, WebC, or data-cascade tricks. A future port should be mechanical.
- **No utility-first creep.** Six utility classes total. If you reach for a seventh, write a component or use an inline `style=""` and feel a little dirty.
- **Accessibility is baseline, not an extra.** Skip link, landmarks, focus-visible rings, reduced-motion respect, WCAG AA contrast — all on by default.
- **No Tailwind, no jQuery, no PostCSS plugins beyond bundling.** Lightningcss handles bundling and minification; everything else is hand-written.


## CSS authoring convention

One semantic class on the component root. Children styled via nested element selectors with an explicit `&`. Prefer the child combinator (`& > tag`) for component internals to prevent leaking styles into nested components; fall back to descendant (`& tag`) only when depth genuinely doesn't matter.

Variants on the root via modifier class or `data-*` attribute.

```html
<article class="card">
  <img src="..." alt="...">
  <h2>Title</h2>
  <p>Lede</p>
  <a href="">Read more</a>
</article>
```

```css
.card {
  display: grid;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--color-surface);

  & > img {
    aspect-ratio: 16 / 9;
    width: 100%;
  }

  & > h2 {
    font-size: var(--text-lg);
  }

  & > p {
    color: var(--color-text-muted);
  }

  &[data-variant="feature"] {
    /* variant overrides */
  }
}
```

Child classes are added only when an element has variants that genuinely need a hook (e.g. multiple `<a>`s where one is a CTA). The form `.field` class is the one accepted concession because forms benefit from a clear modifier surface.


## Design tokens

T-shirt sized, fluid via `clamp()`, single-tier (except colour, which is two-tier).

**Type — 7 steps:** `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`. All fluid.

**Spacing — 9 steps:** `--space-3xs`, `--space-2xs`, `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`, `--space-3xl`. All fluid.

**Colour — two-tier:**

- **Primitives:** 9-step ramps for 5 hues — `brand`, `neutral`, `success`, `danger`, `warning`. All in `oklch`. Naming: `--color-brand-50` through `--color-brand-900`.
- **Semantics:** components reference these only. `--color-text`, `--color-text-muted`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-link`, `--color-link-hover`, `--color-focus`, plus state colours for forms (`--color-error`, `--color-success`).
- No dark mode v1. The semantic layer makes it easy to add later.
- Contrast verified WCAG AA (4.5:1 body text, 3:1 large text and UI). The colours page shows ratios.

**Breakpoints — mobile-first, two only:** `--bp-md` (e.g. 48rem), `--bp-lg` (e.g. 72rem). Used directly in `@media (min-width: ...)`. Avoid breakpoint-specific overrides when fluid tokens cover the case.

**Content width:** `--content-max: 65ch`.

Tokens live in `src/css/tokens.css`.


## Page layout

Three-column grid on `<main>`: gutter | main | gutter. Header and footer have their own internal layouts (do not share `<main>`'s grid).

```css
main {
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--space-md), 1fr)
    [main-start] minmax(0, var(--content-max))
    [main-end]   minmax(var(--space-md), 1fr) [full-end];
}

.section { grid-column: main; }

.section[data-bleed] {
  grid-column: full;
  display: grid;
  grid-template-columns: subgrid;
}
.section[data-bleed] > * { grid-column: main; }

.section[data-width="full"] > * { grid-column: full; }
```

**Two bleed flavors:**

- `data-bleed` — background extends edge-to-edge; content snaps back to main column via subgrid. The common case.
- `data-width="full"` — content itself spans edge to edge (e.g. an image gallery). Used inside a `data-bleed` section or directly on a section.

Page shell uses `auto 1fr auto` on `<body>` for header / main / footer.


## Typography

- **Font:** Inter, self-hosted via `@fontsource/inter`. Weights 400, 500, 700. `font-display: swap`. `<link rel="preload">` for the body weight (400).
- **Heading scale:** h1 → `--text-3xl`, h2 → `--text-2xl`, h3 → `--text-xl`, h4 → `--text-lg`, h5 → `--text-base` (semibold), h6 → `--text-sm` (uppercase tracked).
- **Vertical rhythm:** the `.flow` utility — `> * + * { margin-block-start: var(--flow-space, var(--space-md)) }`. Individual elements override via `--flow-space`.
- **Prose:** `.prose` class for article body. Sets sensible defaults for `h1-h6, p, ul, ol, blockquote, pre, img, figure`. Caps inline-size at `--content-max`.
- **`.prose` is a subgrid container** so figures inside articles can opt into wider tracks via `data-width="wide|full"`. (No separate "wide" track in the 3-col grid — wide figures use `data-width="full"` for now.)
- **Headings:** one `<h1>` per page, no level skips.


## Components

Framework-light. Components are HTML patterns with co-located CSS (and JS where needed), not template functions.

**File structure:** `src/components/<name>/{<name>.html, <name>.css, [<name>.js]}`. The `.html` file is a reference snippet rendered into the demo pages. Component data shape (required vs optional elements) is documented in a comment at the top of each `.html` file.

**Base component set (v1):**

- **`button`** — primary, secondary, ghost variants. `a.button` and `button.button` are visually identical.
- **`card`** — image + heading + body + link. Uses `:has(img)` for the image-optional case. Full-card click target via `<a>::after { inset: 0 }`.
- **`hero`** — eyebrow + h1 + lede + CTA cluster, optional image. Sits inside a `section[data-bleed]` typically.
- **`cta`** — section-level call-to-action block (heading + supporting text + button cluster). Distinct from `hero`.
- **`section`** — the layout primitive. `data-bleed`, `data-width` attributes.
- **`media`** — horizontal layout (image left, text right) that stacks on narrow containers via container query. The article-card pattern.
- **`form-field`** — `<form> > div.field > label + input + small.field-hint`. Demonstrates the form convention.
- **`nav`** — primary navigation with mobile hamburger toggle. `<button class="nav-toggle" aria-expanded>` + tiny vanilla JS. No checkbox trick.
- **`site-header`**, **`site-footer`** — page chrome.

Excluded from v1 (add when needed): nav menus beyond a flat list, modal/dialog, tabs, accordions, carousel, toast, breadcrumbs, pagination.


## JavaScript

- **ES modules**, no bundler, no transpile. Loaded via `<script type="module" src="/js/main.js">` in `<head>` (deferred by default — head placement is the modern best practice with modules).
- **Per-component JS files**, concatenated into a single `main.js` via the build step.
- **Dispatcher pattern via `data-controller`**:

  ```html
  <header data-controller="nav">…</header>
  ```

  ```js
  // main.js
  import { initNav } from './nav.js';
  document.querySelectorAll('[data-controller="nav"]').forEach(initNav);
  ```

- **v1 scope:** nav toggle only. Form validation uses native HTML + `:user-invalid`. Add JS only when a component genuinely requires it.
- **No jQuery, no framework runtime.**


## Forms

Markup pattern (the spec's example, formalised):

```html
<form class="contact-form" action="#">
  <div class="field">
    <label for="name">Name</label>
    <input id="name" name="name" type="text" required>
    <small class="field-hint" id="name-hint">As you'd like to be addressed.</small>
  </div>
  …
</form>
```

- `<label for>`/`id` linkage. Never wrap label around input — flat structure is part of the convention.
- `.field` class on each row div (the one accepted child class).
- Layout: `display: grid; gap` on form and on `.field`.
- **Validation:** native HTML attributes (`required`, `type="email"`, `pattern`). Visual error state via `:user-invalid`. No JS.
- **Errors:** `<small class="field-hint">` doubles as error display. `aria-describedby` links input to hint.
- `action="#"` placeholder. Real projects wire to their backend.

Contact page showcases: text, email, textarea, select, checkbox, submit.


## Utility classes (six total)

- `.flow` — `> * + * { margin-block-start: var(--flow-space, var(--space-md)) }`. Vertical rhythm.
- `.cluster` — `display: flex; flex-wrap: wrap; gap: var(--space-sm); align-items: center`. Inline groups.
- `.stack` — `display: grid; gap: var(--space-md)`. Vertical group.
- `.center` — `margin-inline: auto; max-inline-size: var(--content-max)`.
- `.visually-hidden` — standard a11y class.
- `.text-center` — alignment escape hatch.

No spacing utilities (`.mt-md` etc.), no display utilities, no colour utilities, no responsive variants. If you need something else, write a component or use inline `style=""`.


## Images

Plain `<img>` tags with full discipline. No 11ty image plugin (placeholders are remote; real projects use a CDN like Sanity that exposes the same on-demand URL pattern).

```html
<img
  src="https://picsum.photos/seed/card-1/800/600"
  srcset="https://picsum.photos/seed/card-1/400/300 400w,
          https://picsum.photos/seed/card-1/800/600 800w,
          https://picsum.photos/seed/card-1/1200/900 1200w"
  sizes="(min-width: 48rem) 33vw, 100vw"
  width="800" height="600"
  alt="Realistic alt text"
  loading="lazy">
```

- Always: `srcset`, `sizes`, `width`, `height`, meaningful `alt` (or `alt=""` for decorative).
- Picsum `seed/` URLs so images stay stable across reloads.
- Hero / LCP image: `loading="eager"` + `fetchpriority="high"`.
- Decorative `aspect-ratio` in CSS as backup against width/height being stripped on port.


## Accessibility baseline

- Skip link: `<a class="skip-link" href="#main">Skip to content</a>` at top of body, visible only on focus.
- Landmark structure: `<header>`, `<nav>`, `<main id="main">`, `<footer>`. `id="main"` is a fixed contract.
- Focus styles: global `:focus-visible` ring using `--color-focus`.
- `prefers-reduced-motion`: any animation/transition gated on `@media (prefers-reduced-motion: no-preference)`.
- `color-scheme: light` declared at root.
- WCAG AA contrast verified; ratios shown on the colours page.
- `<html lang="en">`.
- Form a11y: `<label for>`, `aria-describedby` for hints/errors, `required` (not `aria-required`).
- Heading hierarchy: one `<h1>`, no level skips.


## Pages

Eight pages, each demonstrating specific conventions:

1. **Home** (`/`) — hero + CTA, mix of regular and full-bleed sections, card grid.
2. **Contact** (`/contact/`) — form with all field types showcased.
3. **Colours** (`/colours/`) — full ramp display per hue, semantic token swatches with resolved values, contrast pairings with ratios.
4. **Typography** (`/typography/`) — type scale (every step with size + line-height), heading levels h1–h6, prose example, `.flow` in action.
5. **Utilities** (`/utilities/`) — each of the six utilities with a labeled example.
6. **Articles list** (`/articles/`) — hand-written list of `media` components.
7. **Article detail** (`/articles/example/`) — long-form using `.prose` subgrid, with a wide figure and a full-bleed pull-quote section.
8. **404** (`/404.html`) — minimal page, header/main/footer + hero.

Articles are hand-written (no frontmatter beyond per-page `title` and `description`, no collection sorting, no tags). The kit shows the markup; real projects wire up a CMS.


## Head and metadata

- Per-page `title` and `description` set via layout variable.
- Site-level defaults (site name, default OG image) in `_data/site.js`.
- OG and Twitter card meta tags in the base layout.
- Single SVG favicon. No favicon-generation pipeline.


## File structure

```
.
├── .eleventy.js
├── package.json
├── src/
│   ├── _includes/
│   │   ├── base.njk          # full HTML shell, head, header, main slot, footer
│   │   └── article.njk       # extends base, adds .prose wrapper
│   ├── _data/
│   │   └── site.js           # site name, nav links, defaults
│   ├── components/
│   │   ├── card/
│   │   │   ├── card.html
│   │   │   └── card.css
│   │   ├── hero/
│   │   ├── nav/
│   │   │   ├── nav.html
│   │   │   ├── nav.css
│   │   │   └── nav.js
│   │   └── …
│   ├── css/
│   │   ├── main.css          # @imports tokens, reset, base, layout, components, utilities
│   │   ├── tokens.css
│   │   ├── reset.css         # Andy Bell modern reset
│   │   ├── base.css          # element defaults
│   │   ├── layout.css        # page grid, sections, header/footer
│   │   └── utilities.css
│   ├── js/
│   │   └── main.js           # dispatcher; component JS concatenated in
│   ├── articles/
│   │   ├── articles.njk
│   │   └── example.njk
│   ├── index.njk
│   ├── contact.njk
│   ├── colours.njk
│   ├── typography.njk
│   ├── utilities.njk
│   └── 404.njk
└── dist/                     # build output, gitignored
```


## Build and tooling

- **Dev:** `npm run dev` → `eleventy --serve`.
- **Build:** `npm run build` → `eleventy`.
- **CSS:** lightningcss bundles `src/css/main.css` (resolves `@import`s, including component CSS), minifies, writes to `dist/css/main.css`. Wired via `.eleventy.js`.
- **JS:** small build step concatenates component JS into `src/js/main.js` (or the dispatcher imports component files at runtime — both acceptable; concat preferred for one-request loading).
- **Browser targets:** evergreen, last 2 versions. Declared in `package.json` browserslist. No autoprefixer.
- **Andy Bell modern reset** as `reset.css`.


## What this kit is not

- Not a CMS or content pipeline. Articles are hand-written demos.
- Not a component library for arbitrary apps — it's tuned for marketing sites.
- Not framework-coupled. Treat the HTML output and CSS as the artifact.
- Not feature-rich. Six utilities, ten components, eight pages. Add things only when a real project needs them.
