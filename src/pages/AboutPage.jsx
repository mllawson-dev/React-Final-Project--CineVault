import { useEffect, useRef } from 'react';
import Footer from '../components/Footer';

// ── Animated counter hook ──
function useCounter(target, duration = 1800) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const isLarge = target >= 1000;
      const start   = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = isLarge
          ? (v >= 1000 ? Math.floor(v / 1000) + 'K+' : v)
          : v + (p >= 1 && target === 130 ? '+' : '');
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = isLarge
          ? Math.round(target / 1000) + 'K+'
          : target + (target === 130 ? '+' : '');
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return ref;
}

// ── Scroll reveal hook ──
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const QUOTES = [
  { text: "I'm going to make him an offer he can't refuse.", film: 'The Godfather', credit: 'Francis Ford Coppola, 1972' },
  { text: 'Get busy living, or get busy dying.', film: 'The Shawshank Redemption', credit: 'Frank Darabont, 1994' },
  { text: 'Why so serious?', film: 'The Dark Knight', credit: 'Christopher Nolan, 2008' },
  { text: "You can't handle the truth!", film: 'A Few Good Men', credit: 'Rob Reiner, 1992' },
  { text: 'We accept the love we think we deserve.', film: 'The Perks of Being a Wallflower', credit: 'Stephen Chbosky, 2012' },
  { text: 'After all, tomorrow is another day.', film: 'Gone with the Wind', credit: 'Victor Fleming, 1939' },
  { text: 'To infinity and beyond.', film: 'Toy Story', credit: 'John Lasseter, 1995' },
  { text: 'You is kind, you is smart, you is important.', film: 'The Help', credit: 'Tate Taylor, 2011' },
  { text: 'Every passing minute is another chance to turn it all around.', film: 'Vanilla Sky', credit: 'Cameron Crowe, 2001' },
];

const TIMELINE = [
  {
    era: '1895 – 1927', title: 'The Silent Era', years: '1895 — 1927',
    desc: 'Cinema was born without a voice, yet somehow it screamed louder than anything before it. The Lumière brothers projected their first film in Paris in 1895 — a 50-second clip that stunned audiences who had never seen moving images. From this seed grew the earliest grammar of film: the cut, the close-up, the iris fade.',
    films: ['Metropolis (1927)', 'The General (1926)', 'Nosferatu (1922)'],
  },
  {
    era: '1927 – 1960', title: 'The Golden Age of Hollywood', years: '1927 — 1960',
    desc: 'Sound arrived in 1927 and remade cinema overnight. The studio system reached its peak — MGM, Paramount, and Warner Bros. manufactured dreams on an industrial scale. Stars like Bogart, Bergman, and Stewart became cultural icons. Casablanca and Citizen Kane defined what a "great movie" means.',
    films: ['Casablanca (1942)', 'Citizen Kane (1941)', 'Rear Window (1954)'],
  },
  {
    era: '1960 – 1980', title: 'The New Hollywood Revolution', years: '1960 — 1980',
    desc: 'The old studio system crumbled and a generation of renegades took over. Coppola, Scorsese, and Kubrick broke every rule they\'d inherited. Films became personal, political, and morally ambiguous. The Godfather redefined the crime epic. 2001 expanded what cinema could ask of its audience.',
    films: ['The Godfather (1972)', '2001: A Space Odyssey (1968)', 'Goodfellas (1990)'],
  },
  {
    era: '1980 – 2000', title: 'The Blockbuster Era', years: '1980 — 2000',
    desc: 'Spielberg and Lucas invented the modern blockbuster and Hollywood was never the same. Films became events. Budgets exploded. Yet auteurs persisted — Tarantino reinvented crime fiction and Schindler\'s List reminded us that cinema could bear witness to history\'s darkest chapters.',
    films: ['Pulp Fiction (1994)', "Schindler's List (1993)", 'The Matrix (1999)'],
  },
  {
    era: '2000 – Now', title: 'The Digital & Global Age', years: '2000 — Present', current: true,
    desc: 'Digital filmmaking democratised the art form. Nolan pushed IMAX to its limits. Streaming dissolved the theatrical monopoly. Parasite became the first non-English film to win the Oscar for Best Picture — a long-overdue acknowledgment that great storytelling has no passport.',
    films: ['Inception (2010)', 'Parasite (2019)', 'Oppenheimer (2023)'],
  },
];

function submitForm(e) {
  e.preventDefault();
  const form    = e.target;
  const success = document.getElementById('formSuccess');
  const fname   = form.fname.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();
  if (!fname || !email || !message) { alert('Please fill in name, email, and message.'); return; }
  success.style.display = 'block';
  form.reset();
  setTimeout(() => { success.style.display = 'none'; }, 5000);
}

export default function AboutPage() {
  useReveal();

  const c1 = useCounter(500000);
  const c2 = useCounter(130);
  const c3 = useCounter(20);
  const c4 = useCounter(4);

  return (
    <>
      {/* ── HERO ── */}
      <header className="about-hero">
        <div className="about-hero-bg" />
        <div className="film-strip" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="film-frame" />)}
        </div>
        <div className="about-hero-content">
          <p className="about-eyebrow">▶ About CineVault</p>
          <h1 className="about-hero-title">Where Every Frame<br /><em>Tells a Story</em></h1>
          <p className="about-hero-lead">
            CineVault is a curated digital archive born from a deep love of cinema. It's not just a database —
            it's a living tribute to the directors, writers, and actors who dared to dream on a grand scale
            and changed the way we see the world.
          </p>
        </div>
      </header>

      {/* ── OUR STORY ── */}
      <section className="section" id="story">
        <div className="story-grid">
          <div className="story-visual reveal">
            <div>
              <span className="story-visual-icon">🎬</span>
              <p className="story-visual-text">Cinema began as a carnival trick<br />and became the art of the century.</p>
            </div>
            <div className="story-visual-accent" />
            <div className="story-visual-year">Est. 1895</div>
          </div>
          <div className="reveal">
            <p className="section-eyebrow">Our Story</p>
            <h2 className="section-title">A Passion Project<br />Built in the <em>Dark</em></h2>
            <div className="section-body">
              <p>CineVault started the way all great things do — quietly, in the dark, with a screen glowing and a story unfolding. What began as a personal list of films scribbled in a notebook evolved into this: a fully interactive cinematic archive powered by live data, built with curiosity, code, and an unreasonable love for movies.</p>
              <p>Every film catalogued here earned its place. These aren't just popular titles — they are works of art that shifted culture, challenged conventions, and proved that storytelling is the most powerful technology humanity has ever invented.</p>
              <p>This project was built as part of a Front-End Web Development course, combining HTML, CSS, and JavaScript — and now React — with real-world API integration to create something that feels less like a school assignment and more like a destination.</p>
            </div>
            <div className="story-pillars">
              {[
                ['Curation',  'Every title hand-selected for cultural weight, critical acclaim, and lasting impact on cinema.'],
                ['Live Data', 'Powered by the OMDb API, pulling real ratings, plots, and posters directly from IMDb\'s database.'],
                ['Discovery', 'Search any movie ever made. Our OMDb integration gives you access to thousands of titles instantly.'],
                ['Craft',     'Built from scratch — no templates. Pure React, CSS, and vanilla JS working together.'],
              ].map(([h, p]) => (
                <div className="story-pillar reveal" key={h}>
                  <h4>{h}</h4>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-section">
        <div className="stats-grid">
          {[
            { ref: c1, label: 'Films on OMDb' },
            { ref: c2, label: 'Years of Cinema' },
            { ref: c3, label: 'Curated Masterpieces' },
            { ref: c4, label: 'Genres Explored' },
          ].map(({ ref, label }) => (
            <div className="stat-item" key={label}>
              <div className="stat-number" ref={ref}>0</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section section-alt" id="how">
        <div className="reveal">
          <p className="section-eyebrow">How It Works</p>
          <h2 className="section-title">Built on Real Data,<br /><em>Driven by Code</em></h2>
          <p className="section-body">CineVault doesn't store movie data locally — it reaches out to the world's largest film database in real time. Here's what's happening under the hood every time you browse, search, or click.</p>
        </div>
        <div className="how-grid">
          {[
            { n:'01', icon:'🌐', title:'OMDb API Integration',  tag:'REST API',      body:"Every poster, rating, plot, cast list, and award citation is fetched live from the Open Movie Database (OMDb) — a community-built mirror of IMDb data. The same source Hollywood uses." },
            { n:'02', icon:'⚡', title:'Smart Caching',         tag:'React + JS',    body:'Once a film is fetched, its data is cached in memory for the session. Switching genres, re-sorting, and re-opening modals all happen instantly — no redundant network calls.' },
            { n:'03', icon:'🔍', title:'Universal Search',      tag:'Fetch API',     body:"The search bar connects directly to OMDb's search endpoint, returning up to 12 results. Each is then enriched with a second API call to fetch its full detail record." },
            { n:'04', icon:'🎭', title:'Genre Curation',        tag:'Curated Data',  body:'Each genre tab loads a hand-curated list of IMDb IDs representing the Top 10 films in that category, resolved to full detail objects via OMDb — always-current data.' },
            { n:'05', icon:'⭐', title:'Watchlist Persistence',  tag:'localStorage',  body:"Your watchlist is saved to the browser's localStorage via React Context, surviving page refreshes and browser restarts. No login or server required." },
            { n:'06', icon:'⚛️', title:'React Architecture',    tag:'React · Hooks', body:'Built with React functional components, custom hooks, and the Context API. No Redux needed — a clean, maintainable state tree that scales naturally.' },
          ].map(c => (
            <div className="how-card reveal" key={c.n}>
              <div className="how-number">{c.n}</div>
              <span className="how-icon">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <span className="how-tag">{c.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="section" id="timeline">
        <div className="reveal">
          <p className="section-eyebrow">Cinema History</p>
          <h2 className="section-title">A Century of<br /><em>Moving Images</em></h2>
          <p className="section-body">From the flicker of a kinetoscope to the glow of a 4K OLED screen, cinema has always been humanity's most immersive form of storytelling. Here are the eras that shaped everything we watch today.</p>
        </div>
        <div className="timeline-wrap">
          {TIMELINE.map(t => (
            <div className="tl-item reveal" key={t.era}>
              <div className="tl-era">{t.era.replace(' – ', '\n– ')}</div>
              <div className="tl-dot" style={t.current ? { borderColor: 'var(--gold)', background: 'var(--gold)' } : {}} />
              <div className="tl-content">
                <h3 className="tl-title">{t.title}</h3>
                <div className="tl-years">{t.years}</div>
                <p className="tl-desc">{t.desc}</p>
                <div className="tl-films">
                  {t.films.map(f => <span className="tl-film-tag" key={f}>{f}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTES ── */}
      <section className="section section-alt" id="quotes">
        <div className="quotes-intro reveal">
          <p className="section-eyebrow">Iconic Lines</p>
          <h2 className="section-title">Words That<br /><em>Outlived the Screen</em></h2>
          <p className="section-body">Some lines escape the cinema and become part of the language itself. These are the words quoted at dinner tables, written on walls, and whispered in the dark long after the credits rolled.</p>
        </div>
        <div className="quotes-grid">
          {QUOTES.map((q, i) => (
            <div className="quote-card reveal" key={i}>
              <div className="quote-mark">&ldquo;</div>
              <p className="quote-text">{q.text}</p>
              <div className="quote-film">{q.film}</div>
              <div className="quote-year">{q.credit}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="section" id="contact">
        <div className="contact-grid">
          <div>
            <p className="section-eyebrow reveal">Get in Touch</p>
            <h2 className="section-title reveal">Let's Talk<br /><em>About Film</em></h2>
            <div className="section-body reveal">
              <p>Have a film you think belongs in the vault? A quote we missed? A suggestion, a correction, or just want to geek out about cinema? Send a message — every one gets read.</p>
            </div>
            <div style={{ marginTop: '2.5rem' }}>
              {[
                { icon:'🎬', label:'Project',     value:'Frontend Simplified — React Final Project\nReact · CSS · JavaScript · OMDb API' },
                { icon:'📡', label:'Data Source', value:'Open Movie Database (OMDb)\nomdbapi.com' },
                { icon:'⚛️', label:'Built With',  value:'React · Context API · React Router\nCSS Custom Properties · Fetch API · localStorage' },
              ].map(d => (
                <div className="contact-detail reveal" key={d.label}>
                  <span className="contact-detail-icon">{d.icon}</span>
                  <div>
                    <div className="contact-detail-label">{d.label}</div>
                    <div className="contact-detail-value" style={{ whiteSpace: 'pre-line' }}>{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal">
            <form className="contact-form" onSubmit={submitForm}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="fname">First Name</label>
                  <input className="form-input" type="text" id="fname" name="fname" placeholder="Jane" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lname">Last Name</label>
                  <input className="form-input" type="text" id="lname" name="lname" placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input className="form-input" type="email" id="email" name="email" placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject</label>
                <input className="form-input" type="text" id="subject" name="subject" placeholder="Film suggestion, feedback, etc." />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea className="form-textarea" id="message" name="message" placeholder="Tell us about a film that changed your life…" />
              </div>
              <div id="formSuccess" className="form-success" style={{ display: 'none' }}>
                ✓ &nbsp;Message sent! Thanks for reaching out.
              </div>
              <p className="form-note">This is a demo form — submissions are handled client-side only.</p>
              <button type="submit" className="form-submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
