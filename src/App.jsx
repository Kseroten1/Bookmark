import { useCallback, useEffect, useRef, useState } from "react";

const imagePath = (fileName) => `${import.meta.env.BASE_URL}images/${fileName}`;

const FEATURES = [
  {
    id: "bookmarking",
    label: "Simple Bookmarking",
    title: "Bookmark in one click",
    description:
        "Organize your bookmarks however you like. Our simple drag-and-drop interface gives you complete control over how you manage your favourite sites.",
    image: imagePath("illustration-features-tab-1.svg"),
  },
  {
    id: "searching",
    label: "Speedy Searching",
    title: "Intelligent search",
    description:
        "Our powerful search feature will help you find saved sites in no time at all. No need to trawl through all of your bookmarks.",
    image: imagePath("illustration-features-tab-2.svg"),
  },
  {
    id: "sharing",
    label: "Easy Sharing",
    title: "Share your bookmarks",
    description:
        "Easily share your bookmarks and collections with others. Create a shareable link that you can send at the click of a button.",
    image: imagePath("illustration-features-tab-3.svg"),
  },
];

const BROWSERS = [
  {
    id: "chrome",
    name: "Chrome",
    version: "62",
    image: imagePath("logo-chrome.svg"),
  },
  {
    id: "firefox",
    name: "Firefox",
    version: "55",
    image: imagePath("logo-firefox.svg"),
  },
  {
    id: "opera",
    name: "Opera",
    version: "46",
    image: imagePath("logo-opera.svg"),
  },
];

const QUESTIONS = [
  {
    id: "what-is-bookmark",
    question: "What is Bookmark?",
    answer:
        "Bookmark is a simple tool for saving and organizing your favourite websites, so you can find them easily when you need them.",
  },
  {
    id: "request-browser",
    question: "How can I request a new browser?",
    answer:
        "Let us know which browser you use. We're working on support for additional browsers.",
  },
  {
    id: "mobile-app",
    question: "Is there a mobile app?",
    answer:
        "Your bookmarks are designed to be accessible across your devices. Keep an eye out for updates about mobile availability.",
  },
  {
    id: "chromium-browsers",
    question: "What about other Chromium browsers?",
    answer:
        "Support for more browsers is on our roadmap. Tell us which browser you'd like to see next.",
  },
];

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function useCountdown(startValue, durationMs) {
  const [value, setValue] = useState(startValue);

  useEffect(() => {
    const startTime = performance.now();
    let frameId;

    function tick(now) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      setValue(Math.round(startValue * (1 - progress)));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [startValue, durationMs]);

  return value;
}

function useDialogFocus(isOpen, dialogRef, onClose, returnFocusRef) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const firstFocusable = dialog.querySelector(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)];
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      const focusTarget = returnFocusRef?.current || previousFocus;
      if (focusTarget?.isConnected) {
        focusTarget.focus();
      }
    };
  }, [isOpen, dialogRef, onClose, returnFocusRef]);
}

function Header({ isMenuOpen, onOpenMenu, onCloseMenu }) {
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useDialogFocus(isMenuOpen, menuRef, onCloseMenu, menuButtonRef);

  return (
      <header className="site-header container">
        <a className="site-logo" href="#" aria-label="Bookmark — home">
          <img src={imagePath("logo-bookmark.svg")} alt="" />
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#download">Pricing</a>
          <a href="#faq">Contact</a>
          <a className="login-link" href="#newsletter">
            Login
          </a>
        </nav>

        <button
            ref={menuButtonRef}
            className="menu-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={onOpenMenu}
        >
          <img src={imagePath("icon-hamburger.svg")} alt="" />
        </button>

        {isMenuOpen && (
            <div
                ref={menuRef}
                className="mobile-nav"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                tabIndex={-1}
            >
              <div className="mobile-nav__top container">
                <a
                    className="site-logo"
                    href="#"
                    aria-label="Bookmark — home"
                    onClick={onCloseMenu}
                >
                  <img src={imagePath("logo-bookmark.svg")} alt="" />
                </a>
                <button
                    className="mobile-nav__close"
                    type="button"
                    aria-label="Close menu"
                    onClick={onCloseMenu}
                >
                  <img src={imagePath("icon-close.svg")} alt="" />
                </button>
              </div>

              <nav className="mobile-nav__links" aria-label="Mobile navigation links">
                <a href="#features" onClick={onCloseMenu}>
                  Features
                </a>
                <a href="#download" onClick={onCloseMenu}>
                  Pricing
                </a>
                <a href="#faq" onClick={onCloseMenu}>
                  Contact
                </a>
                <a
                    className="mobile-nav__login"
                    href="#newsletter"
                    onClick={onCloseMenu}
                >
                  Login
                </a>
              </nav>

              <div className="mobile-nav__socials">
                <a href="#" aria-label="Facebook">
                  <img src={imagePath("icon-facebook.svg")} alt="" />
                </a>
                <a href="#" aria-label="Twitter">
                  <img src={imagePath("icon-twitter.svg")} alt="" />
                </a>
              </div>
            </div>
        )}
      </header>
  );
}

function Hero() {
  return (
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero__content">
          <h1 id="hero-title">A Simple Bookmark Manager</h1>
          <p>
            A clean and simple interface to organize your favourite websites.
            Open a new browser tab and see your sites load instantly. Try it for
            free.
          </p>
          <div className="hero__actions">
            <a className="button button--blue" href="#download">
              Get it on Chrome
            </a>
            <a className="button button--light" href="#download">
              Get it on Firefox
            </a>
          </div>
        </div>

        <div className="hero__art">
          <img
              src={imagePath("illustration-hero.svg")}
              alt="Preview of the Bookmark manager interface"
          />
        </div>
      </section>
  );
}

function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef([]);
  const feature = FEATURES[activeIndex];

  function handleTabKeyDown(event, index) {
    let nextIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % FEATURES.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + FEATURES.length) % FEATURES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = FEATURES.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    tabsRef.current[nextIndex]?.focus();
  }

  return (
      <section className="features" id="features" aria-labelledby="features-title">
        <div className="section-intro container">
          <h2 id="features-title">Features</h2>
          <p>
            Our aim is to make it quick and easy for you to access your
            favourite websites. Your bookmarks sync between your devices so
            you can access them on the go.
          </p>
        </div>

        <div className="feature-tabs" role="tablist" aria-label="Bookmark features">
          {FEATURES.map((item, index) => (
              <button
                  key={item.id}
                  ref={(element) => {
                    tabsRef.current[index] = element;
                  }}
                  id={`feature-tab-${item.id}`}
                  className={`feature-tabs__tab ${
                      activeIndex === index ? "is-active" : ""
                  }`}
                  type="button"
                  role="tab"
                  tabIndex={activeIndex === index ? 0 : -1}
                  aria-selected={activeIndex === index}
                  aria-controls="feature-panel"
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {item.label}
              </button>
          ))}
        </div>

        <div
            className="feature-panel container"
            id="feature-panel"
            role="tabpanel"
            aria-labelledby={`feature-tab-${feature.id}`}
            tabIndex={0}
        >
          <div className="feature-panel__art">
            <img src={feature.image} alt="" />
          </div>
          <div className="feature-panel__content">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <a className="button button--blue feature-panel__more" href="#faq">
              More Info
            </a>
          </div>
        </div>
      </section>
  );
}

function Download() {
  return (
      <section
          className="download container"
          id="download"
          aria-labelledby="download-title"
      >
        <div className="section-intro">
          <h2 id="download-title">Download the extension</h2>
          <p>
            We've got more browsers in the pipeline. Please do let us know if
            you've got a favourite you'd like us to prioritize.
          </p>
        </div>

        <div className="browser-cards">
          {BROWSERS.map((browser) => (
              <article className="browser-card" key={browser.id}>
                <img className="browser-card__logo" src={browser.image} alt="" />
                <h3>Add to {browser.name}</h3>
                <p>Minimum version {browser.version}</p>
                <img
                    className="browser-card__dots"
                    src={imagePath("bg-dots.svg")}
                    alt=""
                />
                <a className="button button--blue" href="#newsletter">
                  Add &amp; Install Extension
                </a>
              </article>
          ))}
        </div>
      </section>
  );
}

function FAQ() {
  const [openId, setOpenId] = useState(null);

  return (
      <section className="faq container" id="faq" aria-labelledby="faq-title">
        <div className="section-intro">
          <h2 id="faq-title">Frequently Asked Questions</h2>
          <p>
            Here are some of our FAQs. If you have any other questions you'd
            like answered, please feel free to email us.
          </p>
        </div>

        <div className="faq__list">
          {QUESTIONS.map(({ id, question, answer }) => {
            const isOpen = openId === id;

            return (
                <div className="faq__item" key={id}>
                  <h3>
                    <button
                        className="faq__question"
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${id}`}
                        onClick={() => setOpenId(isOpen ? null : id)}
                    >
                      <span>{question}</span>
                      <img
                          className={`faq__arrow ${isOpen ? "is-open" : ""}`}
                          src={imagePath("icon-arrow.svg")}
                          alt=""
                      />
                    </button>
                  </h3>
                  <div
                      className="faq__answer"
                      id={`faq-answer-${id}`}
                      hidden={!isOpen}
                  >
                    <p>{answer}</p>
                  </div>
                </div>
            );
          })}
        </div>

        <a className="button button--blue faq__more" href="#newsletter">
          More Info
        </a>
      </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const joinedCount = useCountdown(35000, 20000);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError("Whoops, it looks like an email is empty");
      return;
    }

    if (!trimmed.includes("@")) {
      setError("Whoops, make sure it's an email");
      return;
    }

    setError(null);
    setEmail("");
  }

  return (
      <section
          className="newsletter"
          id="newsletter"
          aria-labelledby="newsletter-title"
      >
        <div className="container newsletter__inner">
          <p className="newsletter__eyebrow">
            {joinedCount.toLocaleString("en-US")}
            {joinedCount > 0 ? "+" : ""} ALREADY JOINED
          </p>
          <h2 id="newsletter-title">Stay up-to-date with what we're doing</h2>

          <form
              className={`newsletter__form ${error ? "has-error" : ""}`}
              onSubmit={handleSubmit}
              noValidate
          >
            <div className="newsletter__field">
              <input
                  type="email"
                  name="email"
                  aria-label="Email address"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "newsletter-error" : undefined}
              />
              {error && (
                  <img
                      className="newsletter__error-icon"
                      src={imagePath("icon-error.svg")}
                      alt=""
                  />
              )}
              {error && (
                  <p className="newsletter__error" id="newsletter-error" role="alert">
                    {error}
                  </p>
              )}
            </div>
            <button className="button button--red" type="submit">
              Contact Us
            </button>
          </form>
        </div>
      </section>
  );
}

function Footer() {
  return (
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <a className="site-logo" href="#" aria-label="Bookmark — home">
            <img src={imagePath("logo-bookmark.svg")} alt="" />
          </a>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            <a href="#features">Features</a>
            <a href="#download">Pricing</a>
            <a href="#faq">Contact</a>
          </nav>

          <div className="site-footer__socials">
            <a href="#" aria-label="Facebook">
              <img src={imagePath("icon-facebook.svg")} alt="" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={imagePath("icon-twitter.svg")} alt="" />
            </a>
          </div>
        </div>
      </footer>
  );
}

function FeatureModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  useDialogFocus(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  const feature = FEATURES[1];

  return (
      <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
      >
        <div
            ref={dialogRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
        >
          <button
              className="modal__close"
              type="button"
              aria-label="Close"
              onClick={onClose}
          >
            <img src={imagePath("icon-close.svg")} alt="" />
          </button>

          <div className="feature-panel feature-panel--modal">
            <div className="feature-panel__art">
              <img src={feature.image} alt="" />
            </div>
            <div className="feature-panel__content">
              <h3 id="modal-title">{feature.title}</h3>
              <p>{feature.description}</p>
              <a className="button button--blue" href="#download" onClick={onClose}>
                More Info
              </a>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalShownRef = useRef(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const openModalOnce = useCallback(() => {
    if (modalShownRef.current) return;
    modalShownRef.current = true;
    setModalOpen(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(openModalOnce, 30000);
    return () => clearTimeout(timer);
  }, [openModalOnce]);

  useEffect(() => {
    function handleMouseMove(event) {
      if (event.clientY <= 120 && !isMenuOpen) {
        openModalOnce();
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMenuOpen, openModalOnce]);

  return (
      <>
        <Header
            isMenuOpen={isMenuOpen}
            onOpenMenu={() => setMenuOpen(true)}
            onCloseMenu={closeMenu}
        />
        <main>
          <Hero />
          <Features />
          <Download />
          <FAQ />
          <Newsletter />
        </main>
        <Footer />
        <FeatureModal isOpen={isModalOpen} onClose={closeModal} />
      </>
  );
}