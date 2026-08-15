import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'motion/react';

// Interaction model adapted for Invite Link from 21st.dev shared-element
// gallery and morphing-dialog patterns, powered by Motion for React.

const html = htm.bind(React.createElement);
const order = [
  'wedding',
  'sangeet',
  'engagement',
  'cocktail',
  'housewarming',
  'pooja',
  'birthday',
  'babyshower',
  'naming',
  'anniversary',
  'graduation',
  'gala'
];
const filters = [
  { id: 'all', label: 'All occasions (12)', keys: order },
  { id: 'weddings', label: 'Weddings & Sangeet', keys: ['wedding', 'sangeet', 'engagement', 'anniversary'] },
  { id: 'home', label: 'Home & Blessings', keys: ['housewarming', 'pooja', 'babyshower', 'naming'] },
  { id: 'parties', label: 'Soirées & Celebrations', keys: ['cocktail', 'birthday', 'graduation', 'gala'] }
];
const journey = [
  ['01', 'Anticipation', 'A cinematic cover and one gentle tap make opening the invitation feel personal.'],
  ['02', 'Connection', 'Names, words and imagery are tuned to the emotion of the occasion—not copied from a generic card.'],
  ['03', 'Clarity', 'Date, time, venue and directions arrive exactly when the guest is ready for them.'],
  ['04', 'Response', 'A warm RSVP prompt opens WhatsApp with the right message already written.'],
  ['05', 'Afterglow', 'A final wish, blessing or burst of joy leaves the guest with something to feel.']
];

const ease = [0.16, 1, 0.3, 1];
const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } }
};

function Arrow({ direction = 'right' }) {
  const path = direction === 'down' ? 'M12 5v14m0 0 6-6m-6 6-6-6' : 'M5 12h14m0 0-6-6m6 6-6 6';
  return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${path} /></svg>`;
}

function Header() {
  return html`
    <${motion.header}
      className="site-header"
      initial=${{ opacity: 0, y: -18 }}
      animate=${{ opacity: 1, y: 0 }}
      transition=${{ duration: 0.8, delay: 0.15, ease }}
    >
      <a className="brand" href="/" aria-label="Invite Link Home">INVITE LINK</a>
      <nav aria-label="Primary navigation">
        <a href="#occasions">Collection</a>
        <a href="/pricing">Pricing</a>
        <a href="/faq">FAQ</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a className="nav-cta" href="/?template=wedding">Create Free Preview <${Arrow} /></a>
      </nav>
    <//>
  `;
}

function Hero() {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 110]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, reduceMotion ? 1.06 : 1.13]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.74], [1, reduceMotion ? 1 : 0]);
  const titleWords = ['An invitation', 'should feel like', 'the moment itself.'];

  return html`
    <section className="hero" ref=${heroRef} aria-labelledby="hero-title">
      <${motion.div} className="hero-image" aria-hidden="true" style=${{ y: imageY, scale: imageScale }} />
      <div className="hero-shade" aria-hidden="true"></div>
      <${motion.div} className="hero-copy" style=${{ opacity: copyOpacity }}>
        <${motion.p} className="hero-kicker" initial=${{ opacity: 0, y: 18 }} animate=${{ opacity: 1, y: 0 }} transition=${{ duration: 0.7, delay: 0.35, ease }}>
          Invitations for the moments people keep
        <//>
        <h1 id="hero-title">
          ${titleWords.map((line, index) => html`
            <span className="hero-line" key=${line}>
              <${motion.span}
                initial=${{ y: '112%', rotate: 2 }}
                animate=${{ y: 0, rotate: 0 }}
                transition=${{ duration: 0.9, delay: 0.42 + index * 0.11, ease }}
              >${line}<//>
            </span>
          `)}
        </h1>
        <${motion.p} className="hero-intro" initial=${{ opacity: 0, y: 18 }} animate=${{ opacity: 1, y: 0 }} transition=${{ duration: 0.8, delay: 0.9, ease }}>
          Open the door. Hear the music. Feel the story. Then say you’ll be there.
        <//>
        <${motion.div} className="hero-actions" initial=${{ opacity: 0, y: 18 }} animate=${{ opacity: 1, y: 0 }} transition=${{ duration: 0.8, delay: 1.05, ease }}>
          <${motion.a} className="button button--light" href="/invite.html?demo=wedding" whileHover=${{ y: -3 }} whileTap=${{ scale: 0.98 }}>
            Enter a live invitation <${Arrow} />
          <//>
          <a className="text-link" href="#occasions">Explore the collection <${Arrow} direction="down" /></a>
        <//>
      <//>
      <${motion.p} className="hero-caption" initial=${{ opacity: 0 }} animate=${{ opacity: 0.72 }} transition=${{ delay: 1.2, duration: 1 }}>
        Vows in Bloom · Wedding
      <//>
    </section>
  `;
}

function FilterBar({ activeFilter, onChange }) {
  return html`
    <div className="filter-bar" role="toolbar" aria-label="Filter invitation templates">
      ${filters.map((filter) => html`
        <button
          key=${filter.id}
          type="button"
          className=${activeFilter === filter.id ? 'filter-button is-active' : 'filter-button'}
          aria-pressed=${activeFilter === filter.id}
          onClick=${() => onChange(filter.id)}
        >
          ${filter.label}
          ${activeFilter === filter.id && html`<${motion.span} className="filter-indicator" layoutId="active-filter" />`}
        </button>
      `)}
    </div>
  `;
}

function TemplateCard({ templateKey, index, onPreview }) {
  const template = library.templates[templateKey];
  const meta = template.meta;

  return html`
    <${motion.article}
      className="template-entry"
      layout
      initial=${{ opacity: 0, y: 28 }}
      animate=${{ opacity: 1, y: 0 }}
      exit=${{ opacity: 0, scale: 0.97 }}
      transition=${{ layout: { type: 'spring', bounce: 0.08, duration: 0.55 }, opacity: { duration: 0.35 } }}
    >
      <${motion.button}
        className="template-entry__media"
        type="button"
        onClick=${() => onPreview(templateKey)}
        aria-label=${'Quick preview: ' + meta.name}
        whileHover="hover"
        whileTap=${{ scale: 0.995 }}
      >
        <${motion.div} className="template-entry__visual" layoutId=${'template-visual-' + templateKey}>
          <${motion.img}
            src=${meta.image}
            alt=${meta.name + ' interactive invitation design'}
            loading=${index < 2 ? 'eager' : 'lazy'}
            style=${{ objectPosition: meta.focal }}
            variants=${{ hover: { scale: 1.045 } }}
            transition=${{ duration: 0.8, ease }}
          />
          <span className="template-entry__shade"></span>
        <//>
        <span className="preview-cue">Quick look <${Arrow} /></span>
      <//>
      <div className="template-entry__content">
        <span className="template-entry__number">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3>${meta.collection}</h3>
          <div style=${{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span className="template-entry__occasion">${meta.name}</span>
            <span className="template-price-badge">FREE PREVIEW · ₹399 / $12</span>
          </div>
        </div>
        <p className="template-entry__note">${meta.note}</p>
        <div className="template-entry__actions">
          <button type="button" onClick=${() => onPreview(templateKey)}>Preview here</button>
          <a href=${'/invite.html?demo=' + templateKey}>Live demo <${Arrow} /></a>
          <a href=${'/?template=' + templateKey} style=${{ fontWeight: '700', color: 'var(--wine)' }}>Create your invite — free preview <${Arrow} /></a>
        </div>
      </div>
    <//>
  `;
}

function PreviewDialog({ templateKey, onClose }) {
  const template = library.templates[templateKey];
  const meta = template.meta;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  return html`
    <${motion.div}
      className="preview-overlay"
      role="presentation"
      initial=${{ opacity: 0 }}
      animate=${{ opacity: 1 }}
      exit=${{ opacity: 0 }}
      transition=${{ duration: 0.25 }}
      onMouseDown=${(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <${motion.section}
        className="preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        initial=${{ opacity: 0, y: 30, scale: 0.98 }}
        animate=${{ opacity: 1, y: 0, scale: 1 }}
        exit=${{ opacity: 0, y: 24, scale: 0.985 }}
        transition=${{ type: 'spring', bounce: 0.04, duration: 0.5 }}
      >
        <button className="preview-close" type="button" onClick=${onClose} autoFocus aria-label="Close template preview">Close <span>×</span></button>
        <${motion.div} className="preview-visual" layoutId=${'template-visual-' + templateKey}>
          <img src=${meta.image} alt=${meta.name + ' interactive preview banner'} style=${{ objectPosition: meta.focal }} />
          <div className="preview-visual__shade"></div>
          <div className="preview-visual__copy">
            <span style=${{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', marginBottom: '6px' }}>FREE PREVIEW · ₹399 / $12 PASS</span>
            <h2 id="preview-title">${meta.collection}</h2>
            <p>${meta.note}</p>
          </div>
        <//>
        <div className="preview-experience">
          <div className="preview-phone" aria-label=${meta.name + ' invitation live preview'}>
            <iframe src=${'/invite.html?demo=' + templateKey} title=${meta.name + ' live invitation'} loading="eager"></iframe>
          </div>
          <div className="preview-dialog__actions">
            <a className="button button--dark" href=${'/?template=' + templateKey}>Create your invite — free preview <${Arrow} /></a>
            <a href=${'/invite.html?demo=' + templateKey}>Open full-screen demo</a>
          </div>
        </div>
      <//>
    <//>
  `;
}

function Journey() {
  return html`
    <section className="journey" id="journey" aria-labelledby="journey-title">
      <${motion.div} className="journey-sticky" initial="hidden" whileInView="visible" viewport=${{ once: true, amount: 0.3 }} variants=${rise}>
        <p className="section-index">02 / The guest journey</p>
        <h2 id="journey-title">Designed as a feeling, not a form.</h2>
        <p>Every interaction moves the guest from curiosity to connection to action.</p>
      <//>
      <ol className="journey-steps">
        ${journey.map(([number, title, body]) => html`
          <${motion.li}
            key=${number}
            initial=${{ opacity: 0, x: 24 }}
            whileInView=${{ opacity: 1, x: 0 }}
            viewport=${{ once: true, amount: 0.45 }}
            transition=${{ duration: 0.65, ease }}
          >
            <span>${number}</span>
            <h3>${title}</h3>
            <p>${body}</p>
          <//>
        `)}
      </ol>
    </section>
  `;
}

const faqs = [
  {
    q: 'How do guests experience an Invite Link invitation?',
    a: 'When guests click your unique link on mobile or desktop, they are welcomed by an elegant, atmospheric cover. A single tap opens the entrance with smooth motion, soft background music, floating petal animations, event timings, venue directions with Google Maps integration, and an instant WhatsApp RSVP button.'
  },
  {
    q: 'Can I customize colors, photos, and music for any occasion?',
    a: 'Yes! You can choose from our curated presets or upload your own custom high-resolution photos for each screen (Entrance Door, Main Invitation Card, and Closing Blessing). You can also set custom primary and accent colors, and choose or upload background audio.'
  },
  {
    q: 'How much does Invite Link cost?',
    a: 'You can design and preview any invitation 100% free in our studio. When you are ready to publish and share your live link with guests, we offer a simple one-time Single Event Pass for ₹399 ($12 USD) and a Premium Pass for ₹999 ($29 USD) with zero recurring subscriptions.'
  },
  {
    q: 'How does the WhatsApp RSVP system work?',
    a: 'Guests tap their response ("Gladly attending", "Will try to come", or "Sending blessings"), which automatically prepares a personalized WhatsApp message with their RSVP status and sends it directly to your designated phone number with one touch.'
  },
  {
    q: 'Can I update venue details or timings after sharing the link?',
    a: 'Yes! Any updates saved in the studio update your live invitation immediately. Because the link remains constant, all guests automatically see the latest venue, date, and schedule without having to resend anything.'
  },
  {
    q: 'Is there a limit on how many guests can open the invitation?',
    a: 'No limit. Your invitation is deployed on high-speed global edge servers and supports unlimited guest views and smooth playback on all iPhone, Android, and desktop browsers.'
  },
  {
    q: 'What occasions and event types are supported?',
    a: 'Invite Link includes dedicated, beautifully designed templates for Housewarming, Weddings, Engagements, Birthdays, Baby Showers, Naming Ceremonies, Anniversaries, and Graduations.'
  }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return html`
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <${motion.div} className="faq-sticky" initial="hidden" whileInView="visible" viewport=${{ once: true, amount: 0.3 }} variants=${rise}>
        <p className="section-index">04 / Questions & answers</p>
        <h2 id="faq-title">Everything you need to know.</h2>
        <p>Details about pricing, guest experience, customization, WhatsApp RSVPs, and live link sharing.</p>
      <//>
      <div className="faq-list">
        ${faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return html`
            <div className=${isOpen ? 'faq-item is-open' : 'faq-item'} key=${faq.q}>
              <button
                type="button"
                className="faq-question"
                onClick=${() => setOpenIndex(isOpen ? null : index)}
                aria-expanded=${isOpen}
              >
                <h3>${faq.q}</h3>
                <span className="faq-icon-wrapper" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" /></svg>
                </span>
              </button>
              <${AnimatePresence} initial=${false}>
                ${isOpen && html`
                  <${motion.div}
                    className="faq-answer"
                    initial=${{ opacity: 0, height: 0 }}
                    animate=${{ opacity: 1, height: 'auto' }}
                    exit=${{ opacity: 0, height: 0 }}
                    transition=${{ duration: 0.35, ease }}
                  >
                    <p>${faq.a}</p>
                  <//>
                `}
              <//>
            </div>
          `;
        })}
      </div>
    </section>
  `;
}

function PortalApp() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 24, mass: 0.2 });
  const activeKeys = filters.find((filter) => filter.id === activeFilter).keys;

  return html`
    <${MotionConfig} reducedMotion="user">
      <${motion.div} className="page-progress" style=${{ scaleX: progress }} />
      <${Header} />
      <main>
        <${Hero} />
        <section className="collection-intro" id="occasions" aria-labelledby="occasions-title">
          <${motion.p} className="section-index" initial="hidden" whileInView="visible" viewport=${{ once: true }} variants=${rise}>01 / Live collection<//>
          <${motion.div} initial="hidden" whileInView="visible" viewport=${{ once: true, amount: 0.25 }} variants=${rise}>
            <h2 id="occasions-title">Every milestone has its own emotional temperature.</h2>
            <p>Choose a starting point, open the real guest experience, then make every word and detail yours.</p>
          <//>
        </section>
        <${LayoutGroup}>
          <${FilterBar} activeFilter=${activeFilter} onChange=${setActiveFilter} />
          <section className="template-grid" aria-live="polite">
            <${AnimatePresence} mode="popLayout">
              ${activeKeys.map((key) => html`<${TemplateCard} key=${key} templateKey=${key} index=${order.indexOf(key)} onPreview=${setSelectedTemplate} />`)}
            <//>
          </section>
        <//>
        <${Journey} />
        <section className="service-note" aria-labelledby="service-title">
          <div className="service-note__image" aria-hidden="true"></div>
          <${motion.div} className="service-note__copy" initial="hidden" whileInView="visible" viewport=${{ once: true, amount: 0.35 }} variants=${rise}>
            <p className="section-index">03 / Made with you</p>
            <h2 id="service-title">Your story. Our careful hands.</h2>
            <p>Start from a collection, add the people and details that matter, and preview the invitation as your guest will experience it.</p>
            <a className="button button--light" href="/?template=wedding">Create your invite — free preview <${Arrow} /></a>
          <//>
        </section>
        <${FAQ} />
        <section className="final-cta" aria-labelledby="final-title">
          <p className="section-index">05 / Make it yours</p>
          <${motion.h2} id="final-title" initial=${{ opacity: 0, y: 32 }} whileInView=${{ opacity: 1, y: 0 }} viewport=${{ once: true }} transition=${{ duration: 0.8, ease }}>
            Your people already matter. Make the invitation feel that way.
          <//>
          <${motion.a} className="button button--dark" href="/?template=wedding" whileHover=${{ y: -3 }} whileTap=${{ scale: 0.98 }}>Create your invite — free preview <${Arrow} /><//>
        </section>
      </main>
      <footer>
        <a className="brand brand--footer" href="/">INVITE LINK</a>
        <p>Made for the moments people keep.</p>
        <div style=${{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="/">Studio</a>
          <a href="/pricing">Pricing</a>
          <a href="/faq">FAQ</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/refund">Refund Policy</a>
        </div>
      </footer>
      <${AnimatePresence}>
        ${selectedTemplate && html`<${PreviewDialog} key=${selectedTemplate} templateKey=${selectedTemplate} onClose=${() => setSelectedTemplate(null)} />`}
      <//>
    <//>
  `;
}

const root = document.getElementById('portalRoot');
if (!root || !library) {
  throw new Error('Invite Link template library failed to load.');
}

createRoot(root).render(html`<${PortalApp} />`);
