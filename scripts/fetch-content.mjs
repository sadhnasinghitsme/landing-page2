/**
 * Build-time content pipeline for the SKS World School admissions landing page.
 *
 * Fetches the live pages on https://sksworldschoolnoida.ac.in, parses them with
 * cheerio, and writes:
 *   - content/school.json         (all copy used by the page)
 *   - public/images/**            (re-hosted logo / banners / icons for next/image)
 *
 * Runs automatically before `next dev` and `next build` (see package.json).
 * If the site is unreachable it keeps the committed content/school.json so the
 * build never breaks. Pass --force to re-download images that already exist.
 *
 * Content the live site does NOT publish (stat counters, grade-wise intake) is
 * written as clearly marked placeholders — never invented facts.
 */
import { writeFile, mkdir, readFile, access } from "node:fs/promises";
import { constants as FS } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FORCE = process.argv.includes("--force");
const UA =
  "Mozilla/5.0 (compatible; SKS-LandingPage-ContentBot/1.0; build-time scrape of own site)";

const BASE = "https://sksworldschoolnoida.ac.in";
const PAGES = {
  home: `${BASE}/`,
  about: `${BASE}/about-sksws-noida/`,
  admissions: `${BASE}/admission-guidelines/`,
  contact: `${BASE}/contact-us/`,
  curriculum: `${BASE}/curriculum/`,
  infrastructure: `${BASE}/infrastructure/`,
  vision: `${BASE}/our-vision-philosophy/`,
  values: `${BASE}/core-value/`,
};

const IMAGES = [
  [`${BASE}/wp-content/uploads/2024/09/Logo.png`, "images/logo.png"],
  [`${BASE}/wp-content/uploads/2024/09/cropped-Logo-270x270.png`, "images/logo-mark.png"],
  [`${BASE}/wp-content/uploads/2024/09/about-sksws.jpg`, "images/campus.jpg"],
  [`${BASE}/wp-content/uploads/2025/10/2nd-banner.jpg`, "images/banner-1.jpg"],
  [`${BASE}/wp-content/uploads/2025/10/3rd-banner-1.jpg`, "images/banner-2.jpg"],
  [`${BASE}/wp-content/uploads/2025/10/4th-Bannersed-Edit-copy.jpg`, "images/banner-3.jpg"],
  [`${BASE}/wp-content/uploads/2025/10/5th-banner-copy.jpg`, "images/banner-4.jpg"],
  [`${BASE}/wp-content/uploads/2025/10/6th-banner.jpg`, "images/banner-5.jpg"],
  // (The homepage "Key Factors" section uses third-party brand marks — LEGO,
  //  British Council, CBSE, etc. — so those originals are NOT re-hosted here.
  //  The "Why SKS" grid instead uses site-owner-supplied illustrations checked
  //  into public/images/*.png directly (see the `image` fields below and
  //  app/components/WhySks.tsx) rather than pulling them from the live site.)
  // "About", "Why SKS", all 3 "Our Programmes" photos, and all 4 "Beyond
  // Curriculum" photos are site-owner-supplied assets checked into public/
  // directly, not fetched from the live site — see `aboutPhoto` / `whyPhoto` /
  // `programmes.items[].image` / `beyondCurriculum.items[].image`.
  // Note: the About/Why ones are 359x269 Canva exports, lower-res than the rest of
  // this page's photography, so they will look softer when enlarged.
];

/* ------------------------------------------------------------------ helpers */

const clean = (s) =>
  (s || "")
    .replace(/ /g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();

async function getText(url) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  $("script, style, noscript, svg").remove();
  // WordPress/Elementor markup often has adjacent block elements with no
  // whitespace between them ("Sector 137" + "3 Km" -> "1373"). Pad block
  // boundaries so text extraction keeps word gaps.
  $("p,li,div,section,article,br,td,th,tr,h1,h2,h3,h4,h5,h6").each((_, el) => {
    $(el).before(" ").after(" ");
  });
  return { $, text: clean($("body").text()) };
}

/** first regex capture group against `text`, else `fallback` */
function pick(text, re, fallback) {
  const m = text.match(re);
  return m ? clean(m[1]) : fallback;
}

async function exists(p) {
  try {
    await access(p, FS.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function download([url, rel]) {
  const dest = join(ROOT, "public", rel);
  if (!FORCE && (await exists(dest))) return { rel, skipped: true };
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return { rel, bytes: res.headers.get("content-length") || "?" };
}

/* ----------------------------------------------------------------- defaults */
/* Verified against the live pages on 2026-09-02. Used as fallbacks so the     */
/* build is deterministic even if the source markup shifts.                    */

const FALLBACK = {
  generatedAt: null,
  source: PAGES,
  school: {
    name: "SKS World School",
    location: "Sector 137, Noida Expressway",
    trust: "SKS Educational & Social Trust",
    chairman: "Shri S.K Sharma",
    board: "CBSE",
    affiliationNo: "2134003",
    type: "English-medium co-educational school",
    tagline:
      "Top Ranking International School in Noida Expressway — Sector 137, Noida",
  },
  hero: {
    eyebrow: "Admissions Open",
    headline: "Welcome to SKS World School, Noida",
    headlineLines: ["Welcome to", "SKS World", "School, Noida"],
    subhead: "Excellent International School in Noida Expressway (Sec-137)",
    intro:
      "SKS World School, being one of the Best International School in Noida Expressway (Sec-137), is an English medium co-educational institution that runs under the aegis of the SKS Educational & Social Trust, led by its dynamic and visionary Chairman Shri S.K Sharma. The School follows CBSE based curriculum and is widely regarded as one of the best school in Noida Expressway, South Delhi and East Delhi.",
  },
  welcome: {
    heading: "Welcome to SKS World School, Noida",
    subheading: "Excellent International School in Noida Expressway (Sec-137)",
    paragraphs: [
      "SKS World School, being one of the Best International School in Noida Expressway (Sec-137), is an English medium co-educational institution that runs under the aegis of the SKS Educational & Social Trust, led by its dynamic and visionary Chairman Shri S.K Sharma. The School follows CBSE based curriculum and is widely regarded as one of the best school in Noida Expressway, South Delhi and East Delhi.",
      "In addition to the pursuit of academic excellence SKS World School always strives to provide a holistic and meaningful education with a focus on providing education beyond books, nurturing talents and imbibing good values. The curriculum is enriched by all round extracurricular activities to bring forth the inherent potentials of each and every child.",
    ],
  },
  about: {
    coreMotive:
      "The core motive behind the efforts made by the schools run under the SKS Group of Institutions has always been to provide a holistic and meaningful education in addition to the pursuit of academic excellence.",
    locationCopy:
      "The location of SKS World School, Sec-137 is prominent and just opposite of the Metro Station of Sector-137, Noida. The school is one of the Best International School in Noida Expressway, South Delhi, East Delhi — a premier school in Noida with state-of-the-art infrastructure along with exclusive sports facilities and other world-class academic amenities according to international standards.",
    proximity: [
      { distance: "0 km", place: "Metro Station, Noida Sector 137" },
      { distance: "3 km", place: "Sector 93 / 82 / 108" },
      { distance: "10 km", place: "Sector 75 / 76 / 78 & 50 / 49, Noida" },
      { distance: "14 km", place: "Pari Chowk, Greater Noida" },
      { distance: "14 km", place: "DND Flyway" },
      { distance: "20 km", place: "South Delhi" },
      { distance: "20 km", place: "Indirapuram, Ghaziabad" },
    ],
  },
  // From /our-vision-philosophy/ and /core-value/
  philosophy: {
    heading: "Our Philosophy",
    statement:
      "Understanding the significance of values and learning, we endeavour to encourage holistic development in children. Academic excellence takes the front seat for the foundation of learning. To unleash the unique caliber in every child, we strive towards enriching students with value-based education and individual care so that they can grow up as leaders.",
    values: [
      {
        name: "Harmony and Respect",
        body: "We nurture children to value and respect diversity and to build harmonious relations with others.",
      },
      {
        name: "Honesty and Truthfulness",
        body: "We prepare students for life, honing the skills that imbibe honesty and truthfulness in their work and their life.",
      },
      {
        name: "Thirst for Excellence",
        body: "Through seamless knowledge and steady learning, we help children grow a positive attitude and a thirst to keep achieving.",
      },
    ],
  },
  // `key` maps to a Lucide icon in app/components/WhySks.tsx.
  keyFactors: [
    { key: "robotics", title: "Robotics Lab in association with LEGO", image: "/images/robotics-lab.png" },
    { key: "smartboard", title: "Interactive Classrooms with Smart Boards", image: "/images/smart-board.png" },
    { key: "transport", title: "Safe & Secure Transport", image: "/images/school-bus.png" },
    { key: "sms", title: "SMS Updates for Parents", image: "/images/sms-updates.png" },
    { key: "documentary", title: "Movie / Documentary-based Education", image: "/images/documentary.png" },
    { key: "award", title: "International School Award (British Council)", image: "/images/school-award.png" },
    { key: "cbse", title: "Affiliated to CBSE, New Delhi", image: "/images/cbse-logo.png" },
    { key: "drama", title: "Dramm Jamm (Drama & JAM) Education", image: "/images/drama-jam.png" },
  ],
  admissions: {
    heading: "Admission Process",
    intro:
      "The admission procedure at SKS World School, Noida is friendly and transparent.",
    ageCriterion:
      "The applicant should have attained the required age on or before 31st March of the calendar year in which the admission is sought.",
    steps: [
      {
        title: "Registration",
        body:
          "Registration is the first step for seeking admission in SKS World School, Noida. Registration forms are available at the Administration Office on all working days from 9:00 AM to 2:00 PM. Incomplete registration forms will not be processed.",
      },
      {
        title: "Interaction",
        body:
          "Date and timings for interaction will be intimated telephonically and will be displayed on the school website. Parents are advised not to fill more than one form for an applicant.",
      },
      {
        title: "Selection",
        body:
          "The management of the School reserves all rights of admission or rejection and is not bound to give any reasons for admission or rejection of any particular candidate.",
      },
      {
        title: "Fee Deposit",
        body:
          "On confirmation of grant of admission, parents will be required to deposit the fee within the stipulated time. Failing which the offer of admission shall stand cancelled and the seat will be offered to another applicant.",
      },
    ],
    rejectionPolicy:
      "Incomplete registration forms and forms providing incorrect information will automatically stand rejected.",
    antiDonation:
      "The school does not accept any donation for admission. Parents should be aware of third parties collecting money on behalf of the School and making false claims of procuring admission. If the parents enter into any transaction with such parties, they will be doing so at their own risk and the school shall not be responsible for it.",
  },
  testimonials: [
    {
      quote:
        "Thanks to a superior preparatory test and exceptional personality and oratory skills development for students are the smartest in the country with arguably the best communications skills possible.",
      name: "Radika Singh",
      role: "Parent",
    },
    {
      quote:
        "We are happy & lucky that our child study in SKS World School. Thanks to almighty & all faculties for their cooperation towards me. It is Best School in Noida.",
      name: "Arun Kumar",
      role: "Parent",
    },
  ],
  growingGroup: {
    heading: "Our Growing Group",
    intro:
      "The SKS Group of Institutions is expanding across the region. New campuses are on the way:",
    campuses: [
      { name: "SKS World School, Pari Chowk", status: "Upcoming" },
      { name: "SKS World School, Ghaziabad", status: "Upcoming" },
      { name: "SKS World School, Vrindavan", status: "Upcoming" },
    ],
  },
  // "Our Programmes" — SKS's own curriculum domains (/curriculum/), not
  // grade-stage labels (the curriculum page is organised by domain, not stage).
  programmes: {
    heading: "Our Programmes",
    subheading:
      "The curriculum is designed to make learning more motivating, enthralling and stimulating.",
    items: [
      {
        title: "Academics",
        image: "/images/programmes/academics.webp",
        body:
          "The Academic Programme is tailored to evolve the intellectual stimulation and curiosity, rational thought and maturity of mind of the student, who is encouraged to pursue the subjects of their choice.",
      },
      {
        title: "Co-curricular",
        image: "/images/programmes/co-curricular.webp",
        body:
          "Co-curricular activities develop the temperament of the child and bring out creativity, talent, leadership and character — built on the idea that every child has a personality.",
      },
      {
        title: "Physical Education",
        image: "/images/programmes/physical-education.webp",
        body:
          "Physical Culture at SKS World School fosters sportsmanship, cooperation, team spirit and courage, with the emphasis on Sports for All — do your best, winning is not everything.",
      },
    ],
  },
  // "Beyond Curriculum" — real co-curricular activities from the homepage Key
  // Factors and the Infrastructure page; photos are the closest real match.
  beyondCurriculum: {
    heading: "Beyond Curriculum",
    eyebrow: "Beyond the classroom",
    items: [
      { title: "Robotics Lab — in association with LEGO", image: "/images/beyond/robotics.webp" },
      { title: "Dramm Jamm — Drama, Vocal & Instrumental Music", image: "/images/beyond/dramm-jamm.webp" },
      { title: "Self-Defense Classes", image: "/images/beyond/self-defense.webp" },
      { title: "Yoga Room & Classes", image: "/images/beyond/yoga.webp" },
    ],
  },
  contact: {
    phones: ["9319910888", "9540530100"],
    email: "contact@sksworldschoolnoida.ac.in",
    addressLines: [
      "SKS World School",
      "Plot No. SS, Sector 137",
      "Noida, Uttar Pradesh 201305",
    ],
    officeHours: "Administration Office: 9:00 AM – 2:00 PM (working days)",
    mapsEmbed:
      "https://maps.google.com/maps?q=SKS%20World%20School%2C%20Sector%20137%20Noida%2C%20Uttar%20Pradesh%20201305&t=m&z=14&output=embed&iwloc=near",
    mapsLink:
      "https://www.google.com/maps/search/?api=1&query=SKS+World+School+Sector+137+Noida",
  },
  social: {
    facebook: "https://www.facebook.com/SKSWorldSchoolNoidaSector137",
    instagram: "https://www.instagram.com/sks137noida",
    youtube: "https://youtube.com/@sksnoida137",
    linkedin:
      "https://www.linkedin.com/company/sks-world-school-noida-sector-137/",
  },
  images: {
    logo: "/images/logo.png",
    logoMark: "/images/logo-mark.png",
    campus: "/images/campus.jpg",
    // Hero backdrop — the school's own homepage banner (aerial campus shot with
    // the "SKS WORLD SCHOOL" signage). Source: /wp-content/uploads/2025/10/2nd-banner.jpg
    heroPhoto: "/images/banner-1.jpg",
    aboutPhoto: "/images/about/campus-grounds.webp",
    whyPhoto: "/images/why/classroom.webp",
    banners: [
      "/images/banner-1.jpg",
      "/images/banner-2.jpg",
      "/images/banner-3.jpg",
      "/images/banner-4.jpg",
      "/images/banner-5.jpg",
    ],
  },
  gradeOptions: [
    "Pre-Nursery",
    "Nursery",
    "KG",
    "Class I",
    "Class II",
    "Class III",
    "Class IV",
    "Class V",
    "Class VI",
    "Class VII",
    "Class VIII",
    "Class IX",
    "Class X",
    "Class XI",
    "Class XII",
  ],
  // ---- DEMO FIGURES: not published on the live site, not yet verified. --------
  // The "confirm with school" badge stays visible until these are replaced with
  // official numbers. To publish a verified figure, just update `value`.
  stats: {
    editable: true,
    note: "DEMO figures — not published on sksworldschoolnoida.ac.in and not yet confirmed by the school. Keep `editable: true` (shows the 'confirm with school' badge) until every number here is verified.",
    items: [
      { value: 15, suffix: "+", label: "Years shaping learners in Sector 137", displayValue: null },
      { value: 1200, suffix: "+", label: "Students on campus", displayValue: null },
      { value: 20, suffix: "+", label: "Buses on safe, GPS-tracked routes", displayValue: null },
      { value: 95, suffix: "%", label: "CBSE Class X & XII pass record", displayValue: null },
    ],
  },
  trustStrip: [
    { label: "Board", value: "CBSE — Affiliation No. 2134003" },
    { label: "Location", value: "Opposite Sector 137 Metro Station" },
    { label: "Managed by", value: "SKS Educational & Social Trust" },
    { label: "Recognition", value: "International School Award — British Council" },
  ],
};

/* -------------------------------------------------------------------- build */

async function scrape() {
  const data = structuredClone(FALLBACK);
  data.generatedAt = new Date().toISOString();

  let livePages = 0;

  // --- home ---------------------------------------------------------------
  try {
    const { $, text } = await getText(PAGES.home);
    livePages++;

    data.school.affiliationNo = pick(
      text,
      /AFFILIATION\s*NO\.?\s*:?\s*(\d{6,})/i,
      data.school.affiliationNo,
    );
    data.hero.intro = pick(
      text,
      /(SKS World School\s*,?\s*being one of the Best International School.*?East Delhi\.)/i,
      data.hero.intro,
    );
    data.welcome.paragraphs[0] = data.hero.intro;

    // Headline (from the homepage <h1>), split into the 3 stacked hero lines.
    const h1 = clean($("h1").first().text());
    data.hero.headline = /welcome to sks world school/i.test(h1)
      ? h1
      : data.hero.headline;
    const w = data.hero.headline.split(/\s+/);
    data.hero.headlineLines =
      w.length >= 5
        ? [
            w.slice(0, 2).join(" "), // Welcome to
            w.slice(2, 4).join(" "), // SKS World
            w.slice(4).join(" "), // School, Noida
          ]
        : data.hero.headlineLines;
    data.welcome.paragraphs[1] = pick(
      text,
      /(In addition to the pursuit of academic excellence SKS World School.*?(?:child\.|standards\.|Delhi\.))/i,
      data.welcome.paragraphs[1],
    );

    // Key Factors — carousel alt text, keep our curated titles + local icons
    const alts = $("img[alt]")
      .map((_, el) => clean($(el).attr("alt")))
      .get()
      .filter(Boolean);
    const wanted = [
      [/robotic/i, 0],
      [/smart ?board/i, 1],
      [/transport/i, 2],
      [/sms updates/i, 3],
      [/documentry|documentary|movie/i, 4],
      [/international school award/i, 5],
      [/affiliated to cbse/i, 6],
      [/dramm ?jamm|drama/i, 7],
    ];
    const seen = new Set();
    for (const a of alts) {
      for (const [re, idx] of wanted) if (re.test(a)) seen.add(idx);
    }
    // (titles are curated for readability; presence check only)
    data._keyFactorsMatched = [...seen].sort((x, y) => x - y).length;

    // Testimonials
    const t0 = pick(
      text,
      /(Thanks to a superior preparatory test.*?skills possible\.)/i,
      data.testimonials[0].quote,
    );
    const t1 = pick(
      text,
      /(We are happy & lucky that our child study in SKS World School\..*?Best School in Noida)/i,
      data.testimonials[1].quote,
    );
    const tidy = (q) =>
      clean(q)
        .replace(/([a-z])\.([A-Za-z])/g, "$1. $2")
        .replace(/([.!?]\s+)([a-z])/g, (_m, a, b) => a + b.toUpperCase())
        .replace(/[.\s]*$/, ".");
    data.testimonials[0].quote = tidy(t0);
    data.testimonials[1].quote = tidy(t1);

    // Upcoming schools (footer)
    const campuses = [];
    for (const m of text.matchAll(
      /SKS World School\s+(Pari Chowk|Ghaziabad|Vrindavan)/gi,
    )) {
      const name = `SKS World School, ${clean(m[1])}`;
      if (!campuses.find((c) => c.name === name))
        campuses.push({ name, status: "Upcoming" });
    }
    if (campuses.length) data.growingGroup.campuses = campuses;

    // Social links
    const hrefs = $("a[href]")
      .map((_, el) => $(el).attr("href"))
      .get();
    for (const h of hrefs) {
      if (/facebook\.com/i.test(h)) data.social.facebook = h.split("?")[0];
      else if (/instagram\.com/i.test(h)) data.social.instagram = h.split("?")[0];
      else if (/youtube\.com|youtu\.be/i.test(h)) data.social.youtube = h.split("?")[0];
      else if (/linkedin\.com/i.test(h)) data.social.linkedin = h.split("?")[0];
    }
  } catch (err) {
    warn("home", err);
  }

  // --- about ------------------------------------------------------------
  try {
    const { text } = await getText(PAGES.about);
    livePages++;
    data.about.coreMotive = pick(
      text,
      /(The core motive behind the efforts made by the schools run under the SKS Group of Institutions.*?academic excellence\.)/i,
      data.about.coreMotive,
    );
    data.about.locationCopy = pick(
      text,
      /(The location of SKS World School\s*,?\s*Sec-?137 is prominent.*?(?:standards\.|amenities\.))/i,
      data.about.locationCopy,
    );
    const proxRegion =
      (text.match(/proximity of:?\s*(.*?)(?:SKS World School|$)/i) || [, text])[1];
    const prox = [];
    for (const m of proxRegion.matchAll(
      /(\d+)\s*Km\s+from\s+(.+?)(?=\s+\d+\s*Km\s+from|$)/gi,
    )) {
      const km = parseInt(m[1], 10);
      const place = clean(m[2])
        .replace(/\s*\/\s*/g, "/")
        .replace(/[\s,]+$/, "");
      if (km >= 0 && km <= 60 && place.length >= 2 && place.length <= 55)
        prox.push({ distance: `${km} km`, place });
    }
    if (prox.length >= 6) data.about.proximity = prox;
  } catch (err) {
    warn("about", err);
  }

  // --- admissions -----------------------------------------------------
  try {
    const { text } = await getText(PAGES.admissions);
    livePages++;
    data.admissions.antiDonation = pick(
      text,
      /(The school does not accept any donation for admission\..*?responsible for it\.)/i,
      data.admissions.antiDonation,
    );
    data.admissions.steps[2].body = pick(
      text,
      /(The management of the School reserves all rights of admission or rejection.*?particular candidate\.)/i,
      data.admissions.steps[2].body,
    );
    data.admissions.rejectionPolicy = pick(
      text,
      /(Incomplete registration forms and forms providing incorrect information will automatically stand rejected\.)/i,
      data.admissions.rejectionPolicy,
    );
    data.admissions.steps[3].body = pick(
      text,
      /(On confirmation of grant of admission, parents will be required to deposit the fee.*?another applicant\.)/i,
      data.admissions.steps[3].body,
    );
  } catch (err) {
    warn("admissions", err);
  }

  // --- contact --------------------------------------------------------
  try {
    const { $, text } = await getText(PAGES.contact);
    livePages++;
    // tel: links are more trustworthy than loose page text (template widgets
    // sometimes carry demo numbers). Union with the committed fallback.
    const telDigits = $('a[href^="tel:"]')
      .map((_, el) => ($(el).attr("href") || "").replace(/\D/g, ""))
      .get()
      .map((d) => d.replace(/^91(?=\d{10}$)/, ""))
      .filter((d) => d.length === 10);
    data.contact.phones = [
      ...new Set([...data.contact.phones, ...telDigits]),
    ].slice(0, 3);

    const email =
      $('a[href^="mailto:"]').first().attr("href")?.replace("mailto:", "").trim() ||
      (text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i) || [])[0];
    if (email) data.contact.email = clean(email);

    const mapSrc = $('iframe[src*="google.com/maps"], iframe[src*="maps.google"]')
      .first()
      .attr("src");
    if (mapSrc) {
      const abs = mapSrc.startsWith("http") ? mapSrc : `https:${mapSrc}`;
      data.contact.mapsEmbed = abs.replace(/&#0?38;/g, "&");
    }
  } catch (err) {
    warn("contact", err);
  }

  // --- curriculum (Our Programmes) ------------------------------------
  // The /curriculum/ page is organised by domain (Academics, Co-curricular,
  // Physical Education, The Arts, …), not by grade stage. We ship a lightly
  // cleaned version of that copy from FALLBACK (the live text carries typos and
  // "… Read More" truncation); here we just confirm the domains still exist.
  try {
    const { text } = await getText(PAGES.curriculum);
    const found = ["Academics", "Co curricular", "Physical Education"].filter((h) =>
      new RegExp(h.replace(" ", "\\s?"), "i").test(text),
    );
    if (found.length >= 2) {
      livePages++;
    } else {
      warn("curriculum", new Error("expected domains not found"));
    }
  } catch (err) {
    warn("curriculum", err);
  }

  // --- infrastructure (site reachability check; no photos are pulled from
  // this page anymore — Programmes/Beyond Curriculum use site-owner assets) ---
  try {
    const { text } = await getText(PAGES.infrastructure);
    if (/infrastructure/i.test(text)) livePages++;
  } catch (err) {
    warn("infrastructure", err);
  }

  // --- vision / philosophy -------------------------------------------
  try {
    const { text } = await getText(PAGES.vision);
    livePages++;
    data.philosophy.statement = pick(
      text,
      /(Understanding the significance of values and learning.*?grow up as leaders\.)/i,
      data.philosophy.statement,
    );
  } catch (err) {
    warn("vision", err);
  }

  // --- core values --------------------------------------------------
  try {
    const { text } = await getText(PAGES.values);
    livePages++;
    const val = (name, next) => {
      const m = text.match(
        new RegExp(`${name}\\s+(.*?)\\s+(?:${next}|Scroll to Top|Important Links)`, "i"),
      );
      if (!m) return null;
      let s = clean(m[1]).replace(/\.\.\.\s*Read More.*/i, "").trim();
      // keep the actionable sentence(s), drop a leading generic preamble
      s = s.replace(/^.*?(We (?:nurture|prepare|believe)|Through)/, "$1");
      return /[.!?]$/.test(s) ? s : `${s}.`;
    };
    const a = val("Harmony and Respect", "Honesty and Truthfulness");
    const b = val("Honesty and Truthfulness", "Thirst for Excellence");
    if (a) data.philosophy.values[0].body = a;
    if (b) data.philosophy.values[1].body = b;
  } catch (err) {
    warn("values", err);
  }

  data._livePages = livePages;
  return { data, livePages };
}

function warn(page, err) {
  console.warn(`  ! ${page}: ${err.message} — using committed fallback for this page`);
}

/* --------------------------------------------------------------------- run */

async function main() {
  console.log("• Fetching SKS World School content …");
  let data;
  try {
    const out = await scrape();
    data = out.data;
    if (out.livePages === 0) {
      const existing = join(ROOT, "content", "school.json");
      if (await exists(existing)) {
        console.warn(
          "! No pages reachable — keeping the existing content/school.json.",
        );
        data = null;
      }
    }
  } catch (err) {
    console.warn(`! Scrape failed entirely: ${err.message}`);
    data = null;
  }

  if (data) {
    await mkdir(join(ROOT, "content"), { recursive: true });
    await writeFile(
      join(ROOT, "content", "school.json"),
      JSON.stringify(data, null, 2) + "\n",
    );
    console.log(
      `✓ content/school.json written (${data._livePages}/${Object.keys(PAGES).length} pages live).`,
    );
  }

  console.log("• Re-hosting images into public/images …");
  const results = await Promise.allSettled(IMAGES.map(download));
  let ok = 0;
  let skip = 0;
  for (const r of results) {
    if (r.status === "fulfilled") {
      if (r.value.skipped) skip++;
      else ok++;
    } else {
      console.warn(`  ! image: ${r.reason.message}`);
    }
  }
  console.log(`✓ images: ${ok} downloaded, ${skip} already present.`);

  // Guarantee the app can import something even on a first cold run offline.
  if (!(await exists(join(ROOT, "content", "school.json")))) {
    await mkdir(join(ROOT, "content"), { recursive: true });
    const seed = structuredClone(FALLBACK);
    seed.generatedAt = new Date().toISOString();
    seed._livePages = 0;
    await writeFile(
      join(ROOT, "content", "school.json"),
      JSON.stringify(seed, null, 2) + "\n",
    );
    console.log("✓ content/school.json seeded from committed fallback.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
