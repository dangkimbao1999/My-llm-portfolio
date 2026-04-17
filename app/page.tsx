import { ChatWidget } from "./chat-widget";
import styles from "./page.module.css";

const navItems = [
  { label: "Work", href: "#work", active: true },
  { label: "Story", href: "#story" },
  { label: "Values", href: "#values" },
  { label: "Timeline", href: "#timeline" },
];

const summaryCards = [
  {
    icon: "architecture",
    title: "Systems Architect",
    description:
      "Designing scalable design systems that empower teams and protect brand integrity across complex product ecosystems.",
    tone: "primary",
  },
  {
    icon: "analytics",
    title: "Insight Driven",
    description:
      "Balancing taste and evidence so interface decisions stay expressive, measurable, and commercially useful.",
    tone: "tertiary",
  },
];

const promptSuggestions = [
  "How do you approach UX?",
  "View availability",
];

const exhibits = [
  {
    title: "Lumina Banking",
    description: "Reimagining the future of asset management through spatial UI.",
    tags: ["Fintech", "2024"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7xekSE2WGMEojo9kV4bqG06PnYOplZKG-DNJ7yJbaWTkj2LxHGsOgRgu3I8IbW_7rumGCMUA7zjmUVEOYIL1gzdSjcmc0OncaUZyW2AX09IhP2zKvi9qxC-ihyEPQZJHMCw0A_DhSqetNNkoe90HryPSj1i2IdEr_Ai6jnmxuUe7KOAnXMJDyu0iAW7cahFccgLh-tThQRRelN6gTWX91HFmGSKM_aAe-Ltsa502Wtuyfo-SJ-8KeTGmwyr_diGkUWFS4NHE0g1S1",
    alt: "Abstract digital rendering of flowing silk-like gradients with sharp futuristic edges.",
    layout: "wide",
  },
  {
    title: "Chronos Elite",
    description: "A minimal storefront for a limited-edition horology brand.",
    tags: ["E-Commerce", "2023"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBilUcDyj3c38NghK1lRGq15-vrI6-KLxTywjezIytDvU-09kOr3lbd5TXPfDpXzfkL1lx6-W3SgHZqbblNHq4KKeGXOeiRnCSApObHvAVZnR6E1wF4GH1z-cA7QhBH3bbwXiX_zxBG855iEmXk0JVK2p7BsinQzbBFjb2L_fZP4X1484l7Fai1I5twWQgR_lec4-K3TL9o1UJ86RXotCfVaM9QODBnZ6W8FGiN09y6N6x8qUTcFg8IZpLpQ1P3zs9UTwdsaBQqcc1b",
    alt: "Close up of a luxury watch movement with technical precision and warm accent lighting.",
    layout: "square",
  },
  {
    title: "Vector Cloud",
    description: "Streamlining enterprise dev-ops with a disciplined visual hierarchy.",
    tags: ["SaaS", "2024"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCer0UjgpyRJutiKeVLlYa8o3xj8LW-v4TXbQsXbOxz5qMoHByDumjN5b8BlGQtT4JA6PbxXBTNthNtXlh1a7yEtPmd1SPInl3qr_c-E5LCOhpa-kQS_2BFX1LVMDTh5lwYoZTA6ySwgB585Wbzom9dYtvpWTNGdW9plg4kLhH7hrTe7XTbEqsM6gvkfJllIrR492qxMlYO_LNTgMo70djR7n1iQOLFwCtAFPKqsiqZB80A2ZdMgOjHvOU3gCOgPtERWTRXVkXLkPgb",
    alt: "Digital earth at night with glowing network nodes and data lines.",
    layout: "portrait",
  },
];

const timeline = [
  {
    step: "01",
    title: "Principal Designer",
    company: "Nexus Labs - San Francisco",
    period: "2021 - Present",
    note: "Current Chapter",
  },
  {
    step: "02",
    title: "Senior UI/UX Designer",
    company: "Aether Digital - London",
    period: "2018 - 2021",
    note: "The Agency Years",
  },
  {
    step: "03",
    title: "Visual Designer",
    company: "Stark Media - New York",
    period: "2015 - 2018",
    note: "The Foundation",
  },
];

const footerLinks = ["LinkedIn", "GitHub", "Read.cv"];

function Icon({ name, className }: { name: string; className?: string }) {
  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  switch (name) {
    case "architecture":
      return (
        <svg {...commonProps}>
          <path d="M4 20H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M6 20V10L12 4L18 10V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M9 20V14H15V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...commonProps}>
          <path d="M5 18V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M12 18V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M19 18V13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M3 20H21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "arrow-forward":
      return (
        <svg {...commonProps}>
          <path d="M5 12H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "robot":
      return (
        <svg {...commonProps}>
          <rect x="5" y="7" width="14" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 4V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="9.5" cy="12.5" r="1" fill="currentColor" />
          <circle cx="14.5" cy="12.5" r="1" fill="currentColor" />
          <path d="M9 15.5H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "more":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
      );
    case "send":
      return (
        <svg {...commonProps}>
          <path d="M4 11.5L20 4L14 20L11 13L4 11.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "north-east":
      return (
        <svg {...commonProps}>
          <path d="M8 16L16 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M9 8H16V15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function ExhibitCard({
  title,
  description,
  tags,
  image,
  alt,
  layout,
}: {
  title: string;
  description: string;
  tags: string[];
  image: string;
  alt: string;
  layout: string;
}) {
  const layoutClassName =
    layout === "wide"
      ? styles.exhibitWide
      : layout === "square"
        ? styles.exhibitSquare
        : styles.exhibitPortrait;

  return (
    <article className={`${styles.exhibitCard} ${layoutClassName}`}>
      <div className={styles.exhibitMedia}>
        <img src={image} alt={alt} className={styles.exhibitImage} />
      </div>
      <div className={styles.exhibitCopy}>
        <div className={styles.exhibitTags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.exhibitTag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.exhibitHeader}>
          <div>
            <h4>{title}</h4>
            <p>{description}</p>
          </div>
          <Icon name="north-east" className={styles.exhibitArrow} />
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className={styles.pageShell}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <a href="#" className={styles.brand}>
            The Digital Curator
          </a>
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={item.active ? styles.navLinkActive : styles.navLink}
              >
                {item.label}
              </a>
            ))}
          </div>
          <button type="button" className={styles.downloadButton}>
            Download CV
          </button>
        </div>
      </nav>

      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Design / Strategy / Future</span>
            <h1>
              CURATING <br />
              <span>DIGITAL</span> DEPTH.
            </h1>
            <p>
              A Senior Design Strategist crafting high-fidelity experiences that bridge the gap
              between human intuition and machine precision.
            </p>
            <div className={styles.heroActions}>
              <a href="#work" className={styles.primaryButton}>
                Explore Work
              </a>
              <a href="#story" className={styles.secondaryButton}>
                The Story
              </a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroPortraitFrame}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ64jUN_1cFAVBQ8I2ZOAdV8MFDiQwwrCNJT3jJoIdJhbL1yh8mCVI1une0SvIIIkCknxzq5PAMbBabMas7nfoeUon2gkrMQ0V7foubH0RNeXYGyMu8yhhxV3I-Sy4WP5Q3KWIDT4o5SzMByctl0C5EWhv0E6frkGQ6XKP2DADEovp0zlQccaT8yFw9t3euKs0yaeJGozzQi9eFPsNCZKJ8fiBDjIblDCTmEf9mp8M9e27kkdsBrugaN1bQEyCd4buTP7Pr7vpj-2H"
                alt="Moody editorial portrait of a professional designer."
                className={styles.heroPortrait}
              />
              <div className={styles.heroOverlay} />
            </div>
            <div className={styles.heroStatCard}>
              <strong>5+</strong>
              <span>Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      <section id="values" className={`${styles.section} ${styles.summarySection}`}>
        <div className={styles.summaryIntro}>
          <div className={styles.summaryLead}>
            <p className={styles.sectionLabelTertiary}>Core Value</p>
            <h2>Precision in every pixel. Strategy in every stroke.</h2>
          </div>
          <div className={styles.summaryCards}>
            {summaryCards.map((card) => (
              <article key={card.title} className={styles.summaryCard}>
                <Icon
                  name={card.icon}
                  className={card.tone === "primary" ? styles.primaryIcon : styles.tertiaryIcon}
                />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.chatSection}`}>
        <div className={styles.chatFrame}>
          <div className={styles.chatGrid}>
            <ChatWidget promptSuggestions={promptSuggestions} />
          </div>
        </div>
      </section>

      <section id="story" className={`${styles.section} ${styles.storySection}`}>
        <div className={styles.storyGrid}>
          <div className={styles.storyVisual}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQLHhv7vcY9Jqxy6Y-gAwjC7LpLszW3T2404VBzHGKZAbRvRf0WtAfLyXPCV79CmLxMVv5xN6bMKjCTVKfnv4ZNG5iPyKxLY8TDJStchwctv6_BwQvi7FEVxpu4hx0b9y-Yec1kkJvgssodYreLkG1EPOuEpChvWo5h00hoS8_rcZdpadAe5vGV4Xqnjf2aCctJxpWEDq2Fx7sCVecA4ypz710ay8Ia2zIgdMiPO00Q_b-Cs91q1O_EFOreEl72RTMjdDWS732KZWH"
              alt="Abstract cinematic shot of vintage and modern screens."
            />
            <div className={styles.storyBorder} />
          </div>
          <div className={styles.storyCopy}>
            <p className={styles.sectionLabelPrimary}>The Narrative</p>
            <h2>Obsessed with the space between.</h2>
            <div className={styles.storyParagraphs}>
              <p>
                I don&apos;t just build websites; I curate digital experiences. My journey began at
                the intersection of print editorial and early-stage interaction design, where I
                learned that white space is a luxury and typography is a voice.
              </p>
              <p>
                My philosophy is rooted in &quot;The Void&quot;: the belief that what we leave out is
                just as important as what we put in. By stripping away noise, the core message gets
                room to resonate.
              </p>
              <p>
                Today, I help Fortune 500 companies and visionary startups navigate AI-driven
                design without losing the human soul in the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className={`${styles.section} ${styles.exhibitsSection}`}>
        <div className={styles.exhibitsHeader}>
          <div>
            <p className={styles.sectionLabelTertiary}>Selected Exhibits</p>
            <h2>Case Studies</h2>
          </div>
          <p className={styles.scrollHint}>Scroll for more [01 - 06]</p>
        </div>
        <div className={styles.exhibitsGrid}>
          {exhibits.map((exhibit) => (
            <ExhibitCard key={exhibit.title} {...exhibit} />
          ))}
        </div>
      </section>

      <section id="timeline" className={`${styles.section} ${styles.timelineSection}`}>
        <p className={styles.sectionLabelPrimary}>The Journey</p>
        <div className={styles.timelineList}>
          {timeline.map((item) => (
            <article key={item.step} className={styles.timelineItem}>
              <div className={styles.timelineLeft}>
                <span className={styles.timelineStep}>{item.step}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.company}</p>
                </div>
              </div>
              <div className={styles.timelineRight}>
                <strong>{item.period}</strong>
                <span>{item.note}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <a href="#" className={styles.footerBrand}>
            The Digital Curator
          </a>
          <div className={styles.footerLinks}>
            {footerLinks.map((label) => (
              <a key={label} href="#">
                {label}
              </a>
            ))}
          </div>
          <p className={styles.footerNote}>(c) 2024 Digital Curator. Built with precision.</p>
        </div>
      </footer>
    </main>
  );
}
