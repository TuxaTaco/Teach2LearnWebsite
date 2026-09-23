import { useEffect } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AdminPage from "./AdminPage.jsx";
import { SiteContentProvider, useSiteContent } from "./site-content.jsx";

const partners = [
  { name:"McCullough Junior High", logo:"/partner-mccullough.png" },
  { name:"Knox Junior High", logo:"/partner-knox.png" },
  { name:"Academy of Science & Technology", logo:"/partner-academy-science-tech.png" },
  { name:"College Park", logo:"/partner-college-park.png" },
  { name:"Conroe Independent School District", logo:"/partner-conroe-isd.png" },
];

const scienceFairSlides = [
  { title:"Intro to Science Fair", url:"https://docs.google.com/presentation/d/1ZgKrv35ZIqxO96T5gKeKcYM-y2eSLusMX0qgpgxdcDU/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
  { title:"Scientific Method", url:"https://docs.google.com/presentation/d/1H7Vwp1SZWl5LZ9L30O4xYs2UUr6ZTQzCHDzm8KCSyIE/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
  { title:"Purpose and Hypothesis", url:"https://docs.google.com/presentation/d/1UdGVoenJv2FWUnU3v5NrGR_Jd9ic45erdgngb8kIQhQ/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
  { title:"Procedures", url:"https://docs.google.com/presentation/d/17AMZ2yeC4YHaJGEQuSJ6IUeLtiMT2JfsYFBCxmH13Yo/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
  { title:"Peer Review", url:"https://docs.google.com/presentation/d/17EemE86TeUalDwDSkU_8nLxwHwmhJH7RYyErYZqK6og/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
  { title:"Materials and Procedures", url:"https://docs.google.com/presentation/d/1et5GEW8Qst1M_XN2pRqlB2RZWWQ1SrAP2ZODZlxtW8c/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
  { title:"Data and Graphs", url:"https://docs.google.com/presentation/d/11jL8yzQ4dlPcWHH0iCMVXDX5gholLLEE-sqwkQpAP8Y/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
  { title:"Tips for Boards", url:"https://docs.google.com/presentation/d/1z3JxGr_J_O_KiyfW_a8Y_eiEd5s4sEzDHelKORRexYg/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
  { title:"Presentation Tips", url:"https://docs.google.com/presentation/d/1VbJBdHH4eOH-kdf4Pd7Y1AbfU4zKnf0jodXuD5UuTJw/edit?slide=id.g145873d8f31_0_66#slide=id.g145873d8f31_0_66" },
];

const instagramPosts = [
  { title:"Science Fair Interest Meeting", date:"September 2026", image:"/instagram/post-01.jpg", url:"https://www.instagram.com/officialteach2learn/p/Dc2UXzIEbmuxw_pm_o7PJdWsMdXjuoSoSNqKso0/" },
  { title:"Meet the 2026–27 Officers", date:"August 2026", image:"/instagram/post-02.jpg", url:"https://www.instagram.com/officialteach2learn/p/DckLaawkbGVC8eAthxjhVTsn394jp1sm74aHlY0/" },
  { title:"Officer Applications", date:"March 2026", image:"/instagram/post-03.jpg", url:"https://www.instagram.com/officialteach2learn/p/DWYxGILkW_zXp-Jh3Gj_aWXttNK1h3SpicccUs0/" },
];


function Arrow({ diagonal = false, className = "" }) {
  return <svg className={`arrow-icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.33V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" /></svg>;
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Teach2Learn home">
        <span className="brand-logo"><img src="/teach2learn-logo-transparent.png" alt="" width="46" height="46" /></span>
        <span>Teach2Learn</span>
      </Link>
      <nav aria-label="Main navigation">
        <NavLink to="/about">About</NavLink>
        <NavLink to="/workshops">Workshops</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/team">Team</NavLink>
      </nav>
      <NavLink className="nav-cta" to="/contact">Get in touch <Arrow diagonal /></NavLink>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Link className="brand footer-brand" to="/"><span className="brand-logo"><img src="/teach2learn-logo-footer.png" alt="" width="52" height="52" /></span><span>Teach2Learn</span></Link>
          <p>Illuminate minds. <em>Inspire futures.</em></p>
        </div>
        <div className="footer-links"><Link to="/about">Our story</Link><Link to="/workshops">Workshops</Link><Link to="/resources">Resources</Link><Link to="/team">Our team</Link></div>
        <div className="footer-contact"><a href="mailto:officialteach2learn@gmail.com">Say hello <Arrow diagonal /></a><a href="https://www.instagram.com/officialteach2learn/" target="_blank" rel="noreferrer">Find us on Instagram <Arrow diagonal /></a></div>
      </div>
      <div className="footer-bottom"><span>Students teaching students.</span><span>Teach2Learn · Student-led nonprofit</span><address>3701 College Park Dr</address><Link to="/contact">Contact us <Arrow /></Link></div>
    </footer>
  );
}

function PageHero({ eyebrow, title, text, image, alt = "Students and mentors at a Teach2Learn workshop", position = "center", caption }) {
  return (
    <section className={`page-hero${image ? " has-photo" : ""}`}>
      <div className="page-hero-copy"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{text && <p>{text}</p>}</div>
      {image && <figure className="page-hero-photo"><img src={image} alt={alt} style={{ objectPosition: position }} fetchPriority="high" /><figcaption>{caption || "A glimpse inside Teach2Learn"}<span aria-hidden="true">↗</span></figcaption></figure>}
    </section>
  );
}

function ImaginationArt() {
  return (
    <div className="imagination-art" aria-hidden="true">
      <div className="art-note">THERE'S MORE THAN ONE WAY.</div>
      <div className="art-type">What<br /><em>if?</em></div>
      <svg className="art-orbit" viewBox="0 0 360 300" fill="none"><path d="M58 87C4 155 67 286 221 260c123-21 144-129 82-165M301 95l7 30m-7-30 29 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="m250 38 7 17 18-3-13 14 7 17-17-8-13 14 2-20-17-8 19-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
      <span className="art-tag">Think. Make. Try again.</span>
    </div>
  );
}

function WorkshopCards({ preview = false }) {
  const Heading = preview ? "h3" : "h2";
  return (
    <div className={`workshop-grid${preview ? " is-preview" : ""}`}>
      <article className="workshop-card science-card" id="science-fair">
        <div className="workshop-visual"><img src="/events/event-04.jpg" alt="A Teach2Learn mentor explaining graphs to a classroom of students" loading="lazy" /><span className="image-label">SCIENCE & DISCOVERY</span></div>
        <div className="workshop-content">
          <div className="workshop-meta"><span>Ask. Test. Discover.</span><span>Free workshop</span></div>
          <Heading>Science Fair<br /><em>Workshop</em></Heading>
          <p>Turn a question you care about into research you’re proud to share. Our mentors help you work through the science, one step at a time.</p>
          {!preview && <ul><li>Find a question & build a hypothesis</li><li>Plan experiments & make sense of data</li><li>Create a board & present with confidence</li></ul>}
          <Link className="workshop-link" to={preview ? "/workshops#science-fair" : "/resources"}>{preview ? "Explore Science Fair" : "Explore the workshop resources"}<Arrow diagonal /></Link>
        </div>
      </article>
      <article className="workshop-card imagination-card" id="destination-imagination">
        <div className="workshop-visual"><ImaginationArt /><span className="image-label">CREATIVITY & COLLABORATION</span></div>
        <div className="workshop-content">
          <div className="workshop-meta"><span>Imagine. Build. Collaborate.</span><span>Free workshop</span></div>
          <Heading>Destination Imagination<br /><em>Workshop</em></Heading>
          <p>A place for unexpected ideas. Practice creative problem-solving, explore possibilities with a team, and learn by making things together.</p>
          {!preview && <ul><li>Explore open-ended challenges</li><li>Develop ideas & try out solutions</li><li>Build teamwork & communication skills</li></ul>}
          <Link className="workshop-link" to={preview ? "/workshops#destination-imagination" : "/contact"}>{preview ? "Explore Destination Imagination" : "Ask about this workshop"}<Arrow diagonal /></Link>
        </div>
      </article>
    </div>
  );
}

function Impact() {
  return (
    <section className="numbers section-pad" aria-label="Teach2Learn mentor experience">
      <div className="impact-heading"><div className="section-kicker">Experience, passed on.</div><p>They’ve been there.<br />Now they’re here for you.</p></div>
      <div className="number-grid">
        <div><strong>3<span>+</span></strong><p>Years of science fair experience <br />per mentor, on average</p></div>
        <div><strong>18<span>×</span></strong><p>ISEF-qualifying mentors <br />sharing what they know</p></div>
        <div><strong>17</strong><p>ISEF categories represented <br />across our mentor community</p></div>
      </div>
      <blockquote className="testimonial">
        <div className="quote-person"><img src="/michelle-beineman.png" alt="Michelle Beineman" loading="lazy" width="200" height="200" /><div><strong>Michelle Beineman</strong><span>McCullough Science<br />Department Lead</span></div></div>
        <div className="quote-copy"><span className="quote-label">A WORD FROM OUR COMMUNITY</span><p>“I want to pass on to the entire Teach2Learn team how amazingly successful your resources were. Several teachers expressed their own excitement to have access to it and take it back to their campuses.”</p></div>
      </blockquote>
    </section>
  );
}

function HomePage() {
  const marqueePhrases = ["Incubating Excitement", "Fostering Growth", "Catalyzing Curiosity"];
  const marqueeLoop = [...marqueePhrases, ...marqueePhrases];
  return (
    <>
      <section className="hero">
        <div className="hero-photo" />
        <div className="hero-topline"><span>STUDENTS TEACHING STUDENTS</span><span>FREE WORKSHOPS. REAL POSSIBILITIES.</span></div>
        <div className="home-hero-center"><h1>Teach2Learn</h1><p>Illuminate minds. <em>Inspire futures.</em></p></div>
        <div className="hero-marquee" aria-label={marqueePhrases.join(", ")}>
          <div className="marquee-track" aria-hidden="true">
            {[0, 1].map((group) => <div className={`marquee-group${group ? " is-clone" : ""}`} key={group}>{marqueeLoop.map((phrase, index) => <span className={index >= marqueePhrases.length ? "is-repeat" : undefined} key={`${phrase}-${index}`}>{phrase}</span>)}</div>)}
          </div>
        </div>
        <div className="hero-bottomline"><p>A little curiosity can<br />take you a long way.</p><Link to="/workshops" className="hero-link">Find your workshop<Arrow diagonal /></Link><a className="hero-scroll" href="#our-story" aria-label="Discover our story"><span>MORE TO DISCOVER</span><span aria-hidden="true">↓</span></a></div>
      </section>
      <section className="home-intro section-pad" id="our-story">
        <div className="story-copy"><div className="section-kicker">Small beginnings. Big possibilities.</div><h2>Curiosity looks<br />good on <em>everyone.</em></h2><p>We’re high school students helping the next generation find their thing. Through free workshops and personal mentorship, we make room for junior high students to ask, experiment, and surprise themselves.</p><Link className="text-link" to="/about">Get to know Teach2Learn <Arrow diagonal /></Link></div>
        <figure className="story-photo"><img src="/events/event-02.jpg" alt="Students learning together during a Teach2Learn classroom workshop" loading="lazy" /><figcaption><span>Real classrooms. Shared discoveries.</span><span>Teach2Learn in action ↗</span></figcaption></figure>
      </section>
      <section className="workshops-section section-pad">
        <div className="section-heading"><div><div className="section-kicker">Our workshops</div><h2>Two ways to<br /><em>follow your curiosity.</em></h2></div><p>Bring your questions. We’ll bring the encouragement.<br />Our workshops are free and built for junior high students.</p></div>
        <WorkshopCards preview />
      </section>
      <Impact />
      <section className="next-links section-pad" aria-label="More from Teach2Learn">
        <Link className="next-link" to="/resources"><div className="next-link-image board-teaser"><img src="/boards/board-01.png" alt="" loading="lazy" /></div><div><span className="section-kicker">The resource library</span><h2>Keep the ideas<br /><em>coming.</em></h2><p>Workshop slides & real science fair boards.</p><span className="text-link">Explore resources <Arrow diagonal /></span></div></Link>
        <Link className="next-link" to="/team"><div className="next-link-image"><img src="/events/event-07.jpg" alt="" loading="lazy" /></div><div><span className="section-kicker">The people behind it</span><h2>Students.<br /><em>Just like you.</em></h2><p>Meet the mentors who make it happen.</p><span className="text-link">Meet our team <Arrow diagonal /></span></div></Link>
      </section>
      <Partners />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero image="/events/event-02.jpg" position="center 58%" eyebrow="Our story" title={<>A little guidance.<br /><em>A world of possibility.</em></>} text="We believe a student’s first big idea deserves someone who’ll listen." caption="Curiosity, in good company." />
      <section className="about-story section-pad">
        <div><div className="section-kicker">Students teaching students</div><h2>We remember<br />the first <em>“what if?”</em></h2></div>
        <div className="about-story-copy"><p className="lead">That’s why we’re here for yours.</p><p>Teach2Learn is a high school student-run nonprofit providing enriching educational workshops to junior high students. Our mission is to cultivate a love of learning and help the next generation see what they’re capable of.</p><p>In Science Fair and Destination Imagination, students get space to explore, guidance from approachable mentors, and the confidence to keep going.</p><Link className="text-link" to="/workshops">Discover our workshops <Arrow diagonal /></Link></div>
      </section>
      <section className="values section-pad" aria-label="What we believe"><div><span className="value-mark" aria-hidden="true">?</span><h3>Questions come first.</h3><p>Every strong project starts with something you want to understand.</p></div><div><span className="value-mark" aria-hidden="true">↔</span><h3>Learning goes both ways.</h3><p>Mentors and students work together, person to person.</p></div><div><span className="value-mark" aria-hidden="true">↗</span><h3>Small steps count.</h3><p>Big ideas become possible when there’s a clear next step.</p></div></section>
      <Impact /><InstagramFeed /><Partners />
    </>
  );
}

function InstagramFeed() {
  return (
    <section className="instagram-section section-pad">
      <div className="section-heading"><div><div className="section-kicker">From our community</div><h2>Life at <em>Teach2Learn.</em></h2></div><a className="text-link" href="https://www.instagram.com/officialteach2learn/" target="_blank" rel="noreferrer">@officialteach2learn <Arrow diagonal /></a></div>
      <div className="instagram-grid">{instagramPosts.map((post) => <a className="instagram-post" href={post.url} target="_blank" rel="noreferrer" key={post.url}><span className="instagram-post-image"><img src={post.image} alt={post.title} loading="lazy" /></span><span className="instagram-post-meta"><span><small>{post.date}</small><strong>{post.title}</strong></span><Arrow diagonal /></span></a>)}</div>
    </section>
  );
}

function WorkshopsPage() {
  return (
    <>
      <PageHero image="/events/event-04.jpg" position="center 52%" eyebrow="Our workshops" title={<>Come curious.<br /><em>See where it takes you.</em></>} text="Science, creativity, and the confidence to try. Two free workshops for junior high students, led by high school mentors." caption="Big ideas start with a question." />
      <section className="workshops-section section-pad"><div className="workshop-intro"><span className="section-kicker">Find your starting point</span><p>No prior experience needed. Just an open mind.</p></div><WorkshopCards /></section>
      <section className="workshop-process section-pad"><div><div className="section-kicker">What to expect</div><h2>Room to try.<br /><em>People to help.</em></h2></div><div className="process-list"><div><h3>Bring your curiosity</h3><p>A question, an early idea, or an interest in something new.</p></div><div><h3>Work it out together</h3><p>Explore possibilities with mentors and other students.</p></div><div><h3>Take the next step</h3><p>Leave with useful feedback and ideas to keep working on.</p></div></div></section>
    </>
  );
}

function ResourcesPage() {
  return (
    <>
      <PageHero image="/events/event-05.jpg" position="center 48%" eyebrow="The resource library" title={<>A starting point for<br /><em>your next big idea.</em></>} text="Workshop lessons and student research, ready to explore at your own pace." caption="From the classroom to your own project." />
      <section className="resources section-pad"><div className="resource-intro"><div className="section-kicker">Learn at your own pace</div><h2>The workshop,<br /><em>on your terms.</em></h2><p>Revisit a lesson or jump into something new. All nine Science Fair sessions are right here.</p><a className="text-link" href="#science-fair-boards">Jump to the board gallery <span aria-hidden="true">↓</span></a></div><ScienceFairDropdown /></section>
      <ScienceFairBoards />
    </>
  );
}

function ScienceFairDropdown() {
  return (
    <details className="slides-dropdown">
      <summary><span className="slides-cover" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M16 6h16m-12 0v14L9 38c-1 2 0 4 3 4h24c3 0 4-2 3-4L28 20V6M16 28h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="34" r="2" fill="currentColor"/></svg></span><span className="slides-summary-copy"><small>9 LESSONS · GOOGLE SLIDES</small><strong>Science Fair<br />Workshop Slides</strong><span>From first question to final presentation.</span></span><span className="slides-toggle"><span className="when-closed">View lessons</span><span className="when-open">Hide lessons</span><b aria-hidden="true">+</b></span></summary>
      <ol className="slides-list">{scienceFairSlides.map((slide, index) => <li key={slide.title}><a className="slide-link" href={slide.url} target="_blank" rel="noreferrer"><span className="lesson-number">{String(index + 1).padStart(2, "0")}</span><span>{slide.title}</span><Arrow diagonal /></a></li>)}</ol>
    </details>
  );
}

function ScienceFairBoards() {
  const { boards } = useSiteContent();
  return (
    <section className="board-gallery section-pad" id="science-fair-boards">
      <div className="section-heading"><div><div className="section-kicker">The student showcase</div><h2>Big questions.<br /><em>Brilliant work.</em></h2></div><div><h3>Example Science Fair Boards</h3><p>See how students bring their research together. <br />Choose a board to explore the full design in Canva.</p><span className="gallery-count">{boards.length} BOARDS TO EXPLORE · 48 × 36 IN.</span></div></div>
      {boards.length ? <div className="board-grid">{boards.map((board) => <a className="board-card" href={board.url} target="_blank" rel="noreferrer" key={board.id || board.url}><span className="board-preview"><img src={board.preview} alt={`First page of ${board.title}`} loading="lazy" /><span className="board-open" aria-hidden="true"><Arrow diagonal /></span></span><span className="board-meta"><strong>{board.title}</strong><span>Explore board <Arrow diagonal /></span></span></a>)}</div> : <p className="board-empty">Student boards will appear here soon. In the meantime, explore the workshop slides above.</p>}
    </section>
  );
}

function TeamPage() {
  const { team } = useSiteContent();
  return (
    <>
      <PageHero image="/events/event-07.jpg" position="center 42%" eyebrow="Our people" title={<>Students first.<br /><em>Mentors, too.</em></>} text="We remember what it’s like to start. Now we’re sharing what we’ve learned, and learning right alongside you." caption="The people who make it possible." />
      <section className="team section-pad"><div className="team-intro"><div className="section-kicker">Meet the Teach2Learn team</div><p>A shared belief in what students can do.</p></div><div className="team-grid">{team.map((member) => <article className="team-card" key={member.id || member.name}><div className="portrait-wrap"><img src={member.image} alt={member.name} loading="lazy" /></div><div className="team-caption"><h2>{member.name}</h2><p>{member.role}</p><div className="team-social-slot">{member.linkedin && <a className="team-social-link" href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`}><LinkedInIcon /><span>LinkedIn</span><Arrow diagonal /></a>}</div></div></article>)}</div></section>
    </>
  );
}

function Partners() {
  return <section className="partners section-pad"><div className="partners-heading"><span className="section-kicker">Learning, together.</span><p>Proud to support students from these schools and communities.</p></div><div className="partner-grid">{partners.map((partner) => <figure key={partner.name}><img src={partner.logo} alt={partner.name} loading="lazy" /></figure>)}</div></section>;
}

function ContactPage() {
  return (
    <>
      <section className="contact-page section-pad">
        <div className="contact-title"><div className="section-kicker">Get in touch</div><h1>Good things start<br />with <em>a conversation.</em></h1></div>
        <div className="contact-layout"><figure className="contact-photo"><img src="/events/event-06.jpg" alt="Teach2Learn mentors leading a workshop" /><figcaption>We’d love to hear what you have in mind.</figcaption></figure><div className="contact-copy"><h2>Say <em>hello.</em></h2><p>Have a question about Science Fair or Destination Imagination? Interested in volunteering or bringing a workshop to your school? We’d love to hear from you.</p><a className="contact-button" href="mailto:officialteach2learn@gmail.com"><span><small>EMAIL US</small>officialteach2learn@gmail.com</span><Arrow diagonal /></a><a className="contact-button" href="tel:+18329880322"><span><small>GIVE US A CALL</small>(832) 988-0322</span><Arrow diagonal /></a><a className="contact-button" href="https://www.instagram.com/officialteach2learn/" target="_blank" rel="noreferrer"><span><small>FOLLOW ALONG</small>@officialteach2learn</span><Arrow diagonal /></a></div></div>
      </section><Partners />
    </>
  );
}

function NotFound() {
  return <section className="not-found section-pad"><div className="section-kicker">Page not found</div><h1>A small <em>detour.</em></h1><p>Let’s get you back to the learning.</p><Link className="dark-button" to="/">Return home <Arrow /></Link></section>;
}

const pageMeta = {
  "/": {
    title:"Teach2Learn Texas | Free STEM Workshops for Students",
    description:"Teach2Learn is a student-led nonprofit in The Woodlands, Texas offering free Science Fair and Destination Imagination workshops for junior high students.",
  },
  "/about": {
    title:"About Teach2Learn | Student-Led Nonprofit in Texas",
    description:"Learn how Teach2Learn student mentors in The Woodlands help junior high students build curiosity, confidence, and practical STEM skills.",
  },
  "/workshops": {
    title:"Free Student Workshops | Teach2Learn Texas",
    description:"Explore Teach2Learn's free Science Fair and Destination Imagination workshops for junior high students in The Woodlands, Texas.",
  },
  "/resources": {
    title:"Science Fair Resources & Example Boards | Teach2Learn",
    description:"Use free science fair workshop slides, project guidance, and real example science fair boards created by Teach2Learn students and mentors.",
  },
  "/team": {
    title:"Teach2Learn Team | Student Mentors in The Woodlands",
    description:"Meet the high school student officers and mentors behind Teach2Learn's free workshops in The Woodlands, Texas.",
  },
  "/contact": {
    title:"Contact Teach2Learn | The Woodlands, Texas",
    description:"Contact Teach2Learn about free student workshops, mentorship, volunteering, or bringing a program to your school.",
  },
};

const organizationSchema = {
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"WebSite",
      "@id":"https://weteach2learn.com/#website",
      name:"Teach2Learn",
      alternateName:["Teach2Learn Texas", "weteach2learn.com"],
      url:"https://weteach2learn.com/",
    },
    {
      "@type":"NonprofitOrganization",
      "@id":"https://weteach2learn.com/#organization",
      name:"Teach2Learn",
      alternateName:"Teach2Learn Texas",
      url:"https://weteach2learn.com/",
      logo:"https://weteach2learn.com/teach2learn-logo.png",
      description:"A student-led nonprofit providing free Science Fair and Destination Imagination workshops for junior high students.",
      email:"officialteach2learn@gmail.com",
      telephone:"+1-832-988-0322",
      address:{
        "@type":"PostalAddress",
        streetAddress:"3701 College Park Dr",
        addressLocality:"The Woodlands",
        addressRegion:"TX",
        postalCode:"77384",
        addressCountry:"US",
      },
      sameAs:["https://www.instagram.com/officialteach2learn/"],
    },
  ],
};

function PageRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id="main-content"
        tabIndex="-1"
        className="page-transition"
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : .56, ease: [.16, 1, .3, 1] } }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -3, transition: { duration: .18, ease: [.7, 0, .84, 0] } }}
        onAnimationComplete={(definition) => {
          if (definition.opacity === 1 && location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant", block: "start" });
        }}
      >
        <RouteMeta location={location} />
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/programs" element={<Navigate to="/workshops" replace />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/t2l-content-studio" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

function RouteMeta({ location }) {
  useEffect(() => {
    const isContentStudio = location.pathname.startsWith("/t2l-content");
    let canonical = document.querySelector('link[rel="canonical"]');
    let description = document.querySelector('meta[name="description"]');
    let structuredData = document.getElementById("t2l-organization-schema");
    if (!isContentStudio) {
      const meta = pageMeta[location.pathname] || { title:"Page not found | Teach2Learn", description:"Return to Teach2Learn's free student workshops and educational resources." };
      document.title = meta.title;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `https://weteach2learn.com${location.pathname}`;
      if (!description) {
        description = document.createElement("meta");
        description.name = "description";
        document.head.appendChild(description);
      }
      description.content = meta.description;
      if (location.pathname === "/") {
        if (!structuredData) {
          structuredData = document.createElement("script");
          structuredData.id = "t2l-organization-schema";
          structuredData.type = "application/ld+json";
          document.head.appendChild(structuredData);
        }
        structuredData.textContent = JSON.stringify(organizationSchema);
      } else structuredData?.remove();
    } else {
      canonical?.remove();
      structuredData?.remove();
    }
    // This runs after the incoming page mounts, and also for same-page links.
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.key, location.pathname, location.hash]);
  return null;
}

function AppChrome() {
  const { pathname } = useLocation();
  return pathname === "/t2l-content-studio" ? <PageRoutes /> : <><a className="skip-link" href="#main-content">Skip to content</a><Header /><PageRoutes /><Footer /></>;
}

export default function App() {
  return <SiteContentProvider><AppChrome /></SiteContentProvider>;
}
