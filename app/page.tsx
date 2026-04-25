import { ChatWidget } from "./chat-widget";
import styles from "./page.module.css";

const navItems = [
  { label: "Background", href: "#story", active: true },
  { label: "Strengths", href: "#values" },
  { label: "Personality", href: "#personality" },
  { label: "Vision", href: "#vision" },
  { label: "Timeline", href: "#timeline" },
];

const summaryCards = [
  {
    icon: "architecture",
    title: "Backend and Systems",
    description:
      "Experienced with Node.js, Golang, and multiple database like PostgreSQL, Redis, Milvus, and distributed architecture design for products that need to scale cleanly.",
    tone: "primary",
  },
  {
    icon: "analytics",
    title: "Product-Focused Delivery",
    description:
      "Comfortable owning roadmap, planning, stakeholder alignment, and execution when engineering decisions need to connect directly to product outcomes.",
    tone: "tertiary",
  },
];

const promptSuggestions = [
  "What did Bao build at U2U Network?",
  "What roles is Bao targeting next?",
];

const personalityCards = [
  {
    title: "ENFJ-A energy",
    description:
      "Bao tends to show up as the person who gathers context quickly, gets people aligned, and pushes the room toward a clear next move.",
  },
  {
    title: "People-first operator",
    description:
      "He likes turning scattered ideas into shared momentum, especially when product, engineering, and business teams need one direction.",
  },
  {
    title: "Serious about outcomes",
    description:
      "There is a playful side in conversation, but the work mode is focused: clear ownership, clean execution, and no drama around delivery.",
  },
];

const personalityTags = [
  "ENFJ-A",
  "connector",
  "high-agency",
  "team catalyst",
  "builder mindset",
];

const visionPoints = [
  "Ultimate Life goal: Enhance the value of Vietnamese and their living standards.",
  "Vision: build products that create tangible value, especially where fintech and AI can solve real operational or commercial problems.",
  "Belief: Simplicity is prerequisite for reliability.",
  "Ideal environment: high-ownership teams, sharp people, direct communication, enthusiast with the product.",
];

const exhibits = [
  {
    title: "LayerG and L3Wiz",
    description:
      "Led product vision and engineering for a DePIN gaming ecosystem and a no-code Web3 loyalty platform with real-world business use cases.",
    tags: ["Fintech / Web3", "Product", "2023-2025"],
    image:
      "",
    alt: "Abstract digital rendering representing tokenized ecosystems and high-scale product systems.",
    layout: "wide",
  },
  {
    title: "Vylinh.ai",
    description:
      "Built a multi-model AI application that centralizes several AI workflows and shares context windows across them in one platform.",
    tags: ["AI Platform", "2024"],
    image:
      "",
    alt: "Technical visual suggesting a unified AI workspace and multi-model orchestration.",
    layout: "square",
  },
  {
    title: "Etee.ai",
    description:
      "Developed a print-on-demand commerce platform with AI image generation and automated delivery flow to printing partners.",
    tags: ["E-Commerce + AI", "2023"],
    image:
      "",
    alt: "Digital commerce illustration representing AI-generated products and fulfillment flow.",
    layout: "portrait",
  },
];

const timeline = [
  {
    step: "01",
    title: "Head of Engineering",
    company: "U2U Network x SSID",
    period: "Oct 2023 - Nov 2025",
    note: "Product and delivery ownership",
    details: [
      "Joined early as a lead engineer with strong product focus and translated CTO vision into concrete products.",
      "Managed the full product lifecycle across planning, roadmap, budget, stakeholder alignment, and delivery.",
      "Owned product vision and led the development of LayerG, a DePIN-based gaming ecosystem, and L3Wiz, a no-code Web3 loyalty platform.",
      "Helped convert Web2 business use cases into tokenized loyalty and reward systems for retail, F&B, and e-commerce businesses.",
      "Provided strategic consulting for AI integration across the SSI ecosystem while keeping alignment with Vietnam's Decree 13 and PDPL requirements.",
      "Worked with financial mechanisms, token economics, and ecosystem cash flow design.",
    ],
  },
  {
    step: "02",
    title: "Lead Backend",
    company: "VUCAR",
    period: "Mar 2023 - Sep 2023",
    note: "Architecture and AI integration",
    details: [
      "Led the setup and design of backend architecture to create a scalable and maintainable application foundation.",
      "Built and architected CI/CD on GCP for a highly scalable system and helped push reliability toward a 99% uptime SLA.",
      "Designed the integration of AI systems and third-party services into the product ecosystem to improve capability and performance.",
      "Worked closely with frontend and UI/UX teams so delivery stayed aligned with business objectives and user experience goals.",
      "Actively contributed to the team's software building process and cross-department delivery workflow.",
    ],
  },
  {
    step: "03",
    title: "Fullstack Developer / Team Leader",
    company: "Congtroi NFT, Kardiachain",
    period: "Feb 2022 - Mar 2023",
    note: "Blockchain product delivery",
    details: [
      "Received requirements directly from clients and consulted on blockchain-based product solutions.",
      "Implemented Subgraph solutions for indexing blockchain data and built backend services with Node.js and PostgreSQL.",
      "Built frontend flows with React and Next.js and integrated EVM-compatible smart contracts into the product stack.",
      "Led a team of 4 to deliver against roadmap commitments with limited resources.",
      "Worked with blockchain product patterns such as Multicall, ERC standards, NFT marketplace flows, auction, launchpad, and swap solutions.",
      "Used Docker and AWS services including EC2, RDS, S3, and Cloudflare to set up projects and supporting infrastructure.",
    ],
  },
  {
    step: "04",
    title: "DevOps / Fullstack Developer",
    company: "Netcompany",
    period: "Apr 2021 - Nov 2021",
    note: "Enterprise delivery foundation",
    details: [
      "Maintained multiple environments across the full production lifecycle and helped keep delivery stable.",
      "Bridged communication gaps between different teams involved in the project.",
      "Used Jenkins and HTTPD to support business logic delivery and runtime operations.",
      "Built frontend features and bug fixes with HTML, JavaScript, CSS, and Vue.js when needed.",
      "Implemented business logic mainly with Java, APIM on Azure, and predefined AEM architecture.",
    ],
  },
];

const footerLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/iambao/" },
  { label: "Email", href: "mailto:dangkimbao1999@gmail.com" },
  { label: "Download CV", href: "/Bao-Dang-Kim-CV.pdf" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/bao.dangkim1999/", icon: "facebook" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/iambao/", icon: "linkedin" },
];

const phonePlaceholder = "+84 9333 59290";

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
    case "north-east":
      return (
        <svg {...commonProps}>
          <path d="M8 16L16 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M9 8H16V15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <path
            d="M13.5 21V12.8H16.3L16.7 9.6H13.5V7.56C13.5 6.63 13.76 6 15.1 6H16.8V3.14C16.51 3.1 15.52 3 14.37 3C11.96 3 10.3 4.47 10.3 7.18V9.6H7.5V12.8H10.3V21H13.5Z"
            fill="currentColor"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <path
            d="M6.73 8.43A1.86 1.86 0 1 1 6.7 4.71a1.86 1.86 0 0 1 .03 3.72ZM8.2 20.5H5.17V10.07H8.2V20.5ZM20.5 20.5h-3.02v-5.07c0-1.21-.02-2.76-1.68-2.76-1.69 0-1.95 1.31-1.95 2.67v5.16h-3.01V10.07h2.89v1.42h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.97Z"
            fill="currentColor"
          />
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
            Bao Dang Kim
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
          <div className={styles.navActions}>
            <div className={styles.socialLinks}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={styles.socialLink}
                  aria-label={link.label}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon name={link.icon} className={styles.socialIcon} />
                </a>
              ))}
            </div>
            <a
              href={`tel:${phonePlaceholder.replace(/\s+/g, "")}`}
              className={styles.phoneChip}
              aria-label="Phone number"
            >
              {phonePlaceholder}
            </a>
            <a href="/Bao-Dang-Kim-CV.pdf" download className={styles.downloadButton}>
              Download CV
            </a>
          </div>
        </div>
      </nav>

      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Backend / Product / AI / Fintech</span>
            <h1>
              BUILDING <br />
              <span>PRODUCT-GRADE</span> SYSTEMS.
            </h1>
            <p>
              Backend engineer with 5+ years of hands-on R&amp;D experience, now moving toward
              product-focused leadership across fintech, AI, and scalable technical delivery.
            </p>
            <div className={styles.heroActions}>
              <a href="#work" className={styles.primaryButton}>
                Explore Work
              </a>
              <a href="#chat" className={styles.secondaryButton}>
                Chat with My AI
              </a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroPortraitFrame}>
              <video
                src="https://cdn.midjourney.com/video/9f37fc4d-57a4-4e05-a52d-0311575fa156/0.mp4"
                // alt="Portrait placeholder for Bao Dang Kim."
                className={styles.heroPortrait}
              />
              <div className={styles.heroOverlay} />
            </div>
            <div className={styles.heroStatCard}>
              <strong>5+</strong>
              <span>Years across engineering and product delivery</span>
            </div>
          </div>
        </div>
      </section>

      <section id="values" className={`${styles.section} ${styles.summarySection}`}>
        <div className={styles.summaryIntro}>
          <div className={styles.summaryLead}>
            <p className={styles.sectionLabelTertiary}>Core Strength</p>
            <h2>From backend architecture to product execution.</h2>
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

      <section id="chat" className={`${styles.section} ${styles.chatSection}`}>
        <div className={styles.chatFrame}>
          <div className={styles.chatGrid}>
            <ChatWidget promptSuggestions={promptSuggestions} />
          </div>
        </div>
      </section>

      <section id="story" className={`${styles.section} ${styles.storySection}`}>
        <div className={styles.storyGrid}>
          <div className={styles.storyVisual}>
            <video
              src="https://cdn.midjourney.com/video/255ff319-dc7f-4dde-989b-e2bd1b5f2a20/0.mp4"
              // alt="Abstract visual for Bao Dang Kim's portfolio story."
            />
            <div className={styles.storyBorder} />
          </div>
          <div className={styles.storyCopy}>
            <p className={styles.sectionLabelPrimary}>Profile Snapshot</p>
            <h2>Engineering with product accountability.</h2>
            <div className={styles.storyParagraphs}>
              <p>
                Bao Dang Kim is a backend engineer based in HCMC with more than five
                years of hands-on experience in R&amp;D, backend systems, and end-to-end product
                delivery.
              </p>
              <p>
                His recent work moved beyond implementation alone. At U2U Network x SSID, he
                joined early as a lead engineer with strong product focus, turning CTO direction
                into roadmap, budget, stakeholder alignment, and shipped products.
              </p>
              <p>
                Bao is especially interested in fintech and AI products where backend architecture,
                delivery discipline, and business thinking need to work together. He also holds a
                dual-degree Computer Science background from Vietnamese-German University and
                Frankfurt University of Applied Sciences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="personality" className={`${styles.section} ${styles.personalitySection}`}>
        <div className={styles.personalityHeader}>
          <div>
            <p className={styles.personalityLabel}>Personality</p>
            <h2>
              ENFJ-A, with a <span>builder brain</span>.
            </h2>
          </div>
          <div className={styles.personalityTags}>
            {personalityTags.map((tag) => (
              <span key={tag} className={styles.personalityTag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.personalityCards}>
          {personalityCards.map((card) => (
            <article key={card.title} className={styles.personalityCard}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="vision" className={`${styles.section} ${styles.visionSection}`}>
        <div className={styles.visionGrid}>
          <div className={styles.visionIntro}>
            <p className={styles.sectionLabelPrimary}>Vision</p>
            <h2>Build products that matter, with teams that move.</h2>
            <p className={styles.visionLead}>
              Bao is not aiming only for a bigger title. The long game is to become the kind of
              leader who can shape direction, align people, and still understand the system deeply
              enough to make good calls.
            </p>
          </div>
          <div className={styles.visionPoints}>
            {visionPoints.map((point) => (
              <article key={point} className={styles.visionPoint}>
                <p>{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* <section id="work" className={`${styles.section} ${styles.exhibitsSection}`}>
        <div className={styles.exhibitsHeader}>
          <div>
            <p className={styles.sectionLabelTertiary}>Highlighted Work</p>
            <h2>Selected Projects</h2>
          </div>
          <p className={styles.scrollHint}>Recent work</p>
        </div>
        <div className={styles.exhibitsGrid}>
          {exhibits.map((exhibit) => (
            <ExhibitCard key={exhibit.title} {...exhibit} />
          ))}
        </div>
      </section> */}

      <section id="timeline" className={`${styles.section} ${styles.exhibitsSection}`}>
        <p className={styles.sectionLabelPrimary}>Career Timeline</p>
        <div className={styles.timelineList}>
          {timeline.map((item) => (
            <details
              key={item.step}
              className={styles.timelineAccordion}
              open={item.step === "01"}
            >
              <summary className={styles.timelineItem}>
                <div className={styles.timelineLeft}>
                  <span className={styles.timelineStep}>{item.step}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.company}</p>
                  </div>
                </div>
                <div className={styles.timelineMeta}>
                  <div className={styles.timelineRight}>
                    <strong>{item.period}</strong>
                    <span>{item.note}</span>
                  </div>
                  <span className={styles.timelineChevron} aria-hidden="true" />
                </div>
              </summary>

              <div className={styles.timelineDetails}>
                <ul className={styles.timelineDetailsList}>
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <a href="#" className={styles.footerBrand}>
            Bao Dang Kim
          </a>
          <div className={styles.footerLinks}>
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <p className={styles.footerNote}>Backend, product, and AI systems built with clarity.</p>
        </div>
      </footer>
    </main>
  );
}
