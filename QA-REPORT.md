# CineVault — Portfolio QA

Review date: 2026-09-16. Scope: upgraded local production preview, not a public deployment.

## Scorecard

| Dimension | Score |
|---|---:|
| Product / conversion clarity | 9/10 |
| Visual distinctiveness | 8/10 |
| Typography & hierarchy | 9/10 |
| Trust & accuracy | 8/10 |
| Mobile quality | 9/10 |
| Cinema audience fit | 9/10 |
| **Composite** | **52/60 — PASS for local portfolio review** |

These are editorial diagnostic scores, not user-research results. The initial review scored 44/60.

## Issue report

### Critical issues addressed

- **Mobile access (Mobile Quality / Product Clarity):** restored collection navigation with an accessible disclosure menu. Saving remains visible near the film title in mobile details.
- **Keyboard access (Mobile Quality / Product Clarity):** cards use a real details button and a separate save button. Native modal dialogs contain focus; Escape dismisses them; closing restores the opening control. Closed drawers are unmounted. Opening a saved film closes the drawer before mounting its details.
- **Credentials and failures (Trust / Product Clarity):** browser requests use the server endpoint. The key is kept in a private environment file. Input validation, bounded caching, shared requests, timeouts, cancellation guards, partial-result warnings, and retry controls replace the original direct requests.
- **Misleading content (Trust):** removed the contact form that claimed to send messages, unsupported counters, overstated database claims, and unrelated film-history material. The project notes preserve course provenance and explicitly describe limitations.

### Medium issues addressed

- Search now exposes further pages, total matches, and page context; current-page sorting is stated explicitly.
- Featured films keep collection order and do not change when the grid is sorted.
- Slideshow playback starts paused, supports manual selection, pauses during interaction, and disables automatic playback for reduced-motion preferences.
- Mobile collections use two columns and reserve long summaries for details.
- Poster images reserve dimensions and load lazily below the featured section.
- Main controls have 44px or larger targets and visible focus states. Card details use a stretched click area across the card.
- Light-theme text uses a darker gold accent while filled actions retain the original gold with dark labels.
- Default React metadata, favicon references, scaffold test, and unused source entry files were replaced or removed. The old About stylesheet was removed.

### Generic design diagnosis

The cinema-specific serif titles, restrained gold, poster imagery, and editorial composition remain distinctive. The original About page's emoji cards and generic promotional material were replaced with numbered editorial sections, a product journey, and clear engineering decisions. No claim is made about whether the original design was AI-generated.

### Design system check

The original Playfair Display, Barlow, Barlow Condensed, dark cinema surfaces, and #c9a84c gold fill are retained. Responsive gutters, spacing, focus colours, and light-theme semantics use explicit tokens. No separate Art Director token specification existed for this refinement.

## Verification evidence

- Production build passes; approximately 83.2 kB gzipped JavaScript and 7.0 kB gzipped CSS.
- All eight automated server/data tests pass: input validation, missing credentials, allowed query forwarding and caching, credential sanitisation, concurrent request coalescing, upstream errors, partial batch retention, paginated search, and abort handling.
- In-app browser checks covered real film loading, mobile collection navigation, keyboard film opening, native dialog focus containment, Escape dismissal and restoration, saving, persistence after reload, drawer-to-details transitions, search, additional result pages, newest-first sorting, empty results, and retry recovery after a temporary upstream failure.
- Layouts checked at 375, 768, 1280, 1440, and 2560 pixels. No horizontal overflow was found. Final production styles were refreshed and verified; mobile save targets measure 44px.
- Dark/light themes checked. Final light-theme action fill is #c9a84c with #0b0b0f labels; selected carousel targets retain a transparent background.
- Reduced-motion handling was reviewed in source. The optional standalone browser suite includes emulated reduced-motion and superseded-search checks, but could not run because this sandbox aborts Chrome on launch. Do not report that suite as passed.
- No unhandled runtime errors were observed in the main interaction checks. A temporary upstream failure showed the intended retry state and recovered on retry.

## Before publishing

Replace the previously exposed OMDb credential, set OMDB_API_KEY on the host, and verify the deployed Node function and direct route loading. Hosting credentials and deployment have not been changed. For greater traffic, configure host-level request limits and quota monitoring; the current server cache is per process.

## Optional next research

Observe real users discovering, saving, and revisiting a title. Use those findings to decide whether genre filters in search, richer watchlist organisation, or cross-device sync warrant the added complexity. No fabricated validation or business outcome is included.
