const canvas = document.getElementById("cellCanvas");
const ctx = canvas.getContext("2d");
const cycleLabel = document.getElementById("cycle-count");
let width = 0;
let height = 0;
let tick = 0;

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw() {
  tick++;
  ctx.clearRect(0, 0, width, height);

  const grid = 42;
  ctx.strokeStyle = "rgba(223,247,223,.035)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += grid) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += grid) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  const centerX = width * .5;
  const centerY = height * .53;
  const phase = tick * .018;
  const helixHeight = Math.min(height * .72, 430);
  const helixWidth = Math.min(width * .34, 170);

  ctx.save();
  ctx.translate(centerX, centerY);

  for (let i = 0; i <= 54; i++) {
    const progress = i / 54;
    const y = (progress - .5) * helixHeight;
    const angle = progress * Math.PI * 7.2 + phase;
    const x1 = Math.cos(angle) * helixWidth;
    const x2 = Math.cos(angle + Math.PI) * helixWidth;
    const depth1 = (Math.sin(angle) + 1) * .5;

    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = `rgba(223, 247, 223, ${.22 + Math.abs(depth1 - .5) * .3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  for (let strand = 0; strand < 2; strand++) {
    ctx.beginPath();
    for (let i = 0; i <= 54; i++) {
      const progress = i / 54;
      const y = (progress - .5) * helixHeight;
      const angle = progress * Math.PI * 7.2 + phase + strand * Math.PI;
      const x = Math.cos(angle) * helixWidth;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = strand === 0 ? "rgba(190, 235, 181, .86)" : "rgba(140, 203, 209, .78)";
    ctx.shadowColor = strand === 0 ? "#a8c9a1" : "#8ccbd1";
    ctx.shadowBlur = 12;
    ctx.stroke();
  }
  ctx.restore();

  if (tick % 600 === 0) {
    cycleLabel.textContent = `Cycle ${String((tick / 600) % 99 + 1).padStart(2, "0")}`;
  }
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: .12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  observer.observe(element);
});

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

const views = {
  research: {
    kicker: "Research",
    title: "Research areas",
    items: [
      ["01", "Marine & coastal fungi", "Documenting fungal diversity and ecology in saltmarsh, intertidal, seagrass, forest, and other coastal habitats."],
      ["02", "Molecular biology", "Using molecular tools to investigate fungal identity, gene expression, evolution, and interactions."],
      ["03", "Genomics & metagenomics", "Applying genome sequencing and environmental DNA approaches to explore fungal diversity and community function."],
      ["04", "Coastal plant-fungal interactions", "Investigating fungi associated with coastal and marine plants and their ecological roles and host interactions."],
      ["05", "Fungal biodiversity", "Documenting and comparing fungal diversity across habitats to reveal patterns, distribution, and overlooked species."],
      ["06", "Fungi in agroecosystems", "Studying fungal communities and their roles across agricultural landscapes, soils, crops, and managed ecosystems."],
      ["07", "Arbuscular mycorrhizal fungi", "Investigating AMF diversity, root associations, nutrient exchange, and contributions to plant health and soil function."],
      ["08", "Lichens", "Exploring lichen diversity, ecology, symbiosis, and responses to environmental change across coastal and forest habitats."],
      ["09", "Endophytes", "Characterizing fungal endophytes in plants and investigating their ecology, diversity, and biological roles."],
      ["10", "Fungi in biocontrol", "Assessing fungal organisms and interactions for sustainable biological control in agriculture and natural systems."],
      ["11", "Bioremediation", "Investigating fungal capabilities to transform, break down, and reduce environmental contaminants."]
    ]
  },
  people: {
    kicker: "Lab Members",
    title: "Lab Members",
    items: [
      ["01", "Principal investigator", "Leadership across fungal biology, chemistry, and ecological systems."],
      ["02", "Researchers", "Graduate and postdoctoral scientists advancing independent projects."],
      ["03", "Collaborators", "A network of partners in medicine, ecology, engineering, and design."]
    ]
  },
  publications: {
    kicker: "Publications",
    title: "Selected discoveries.",
    items: [
      ["2026", "Emergent dynamics in fungal communities", "↗"],
      ["2025", "Computational maps of fungal secondary metabolism", "↗"],
      ["2025", "Fungal resilience and ecological restoration", "↗"]
    ],
    rows: true
  },
  news: {
    kicker: "News",
    title: "Notes from the lab.",
    items: [
      ["2026", "Seasonal fungal surveys begin in the northern forest", "↗"],
      ["2026", "Walker Mycology Lab welcomes its newest graduate researchers", "↗"],
      ["2025", "New field collaboration focuses on fungal restoration", "↗"]
    ],
    rows: true
  },
  resources: {
    kicker: "Resources",
    title: "Tools for careful work.",
    items: [
      ["01", "Laboratory protocols", "↗"],
      ["02", "Culture resources", "↗"],
      ["03", "Data & repositories", "↗"]
    ],
    rows: true
  },
  contact: {
    kicker: "Contact",
    title: "Let curiosity take root.",
    items: [
      ["Collaboration", "Research partnerships and project inquiries", "→"],
      ["Prospective members", "Graduate, undergraduate, and visiting opportunities", "→"],
      ["General inquiries", "walkermycologylab@example.edu", "→"]
    ],
    rows: true
  }
};

const hero = document.querySelector(".hero");
const homeDirectory = document.querySelector(".home-directory");
const sectionView = document.getElementById("section-view");
const sectionContent = document.getElementById("section-view-content");
const sectionClose = document.querySelector(".section-close");
const footer = document.querySelector("footer");
const editorToggle = document.querySelector(".site-editor-toggle");
const editorToolbar = document.querySelector(".site-editor-toolbar");
const editableStorageKey = "walker-site-text";
let editorActive = false;

const cleanedTextKey = "walker-site-text-cleaned-v3";
try {
  if (localStorage.getItem(cleanedTextKey) !== "1") {
    localStorage.removeItem(editableStorageKey);
    localStorage.setItem(cleanedTextKey, "1");
  }
} catch {
  // Storage can be unavailable in privacy-restricted contexts.
}

const editingParam = new URLSearchParams(location.search).get("editing");
try {
  if (editingParam === "1") sessionStorage.setItem("walker-editor-enabled", "1");
  if (editingParam === "0") sessionStorage.removeItem("walker-editor-enabled");
  if (sessionStorage.getItem("walker-editor-enabled") === "1") {
    document.body.classList.add("editing-enabled");
  }
} catch {
  if (editingParam === "1") document.body.classList.add("editing-enabled");
}

function editableElements(root = document) {
  const candidates = root.querySelectorAll("h1, h2, h3, h4, p, strong, small, em, a, .section-index, .view-kicker, .view-row span, .members-roster-heading, .member-role, .affiliation-upload");
  return [...candidates].filter(element =>
    !element.querySelector("h1, h2, h3, p, strong, small") &&
    !element.closest(".pi-card, .profile-detail-section")
  );
}

function editableKey(element) {
  const all = [...document.querySelectorAll(element.tagName.toLowerCase())];
  const index = all.indexOf(element);
  return `editor:v2:${location.hash || "#home"}:${element.tagName.toLowerCase()}:${index}`;
}

function prepareEditableText(root = document) {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(editableStorageKey) || "{}");
  } catch {
    saved = {};
  }
  let cleaned = false;
  Object.keys(saved).forEach(key => {
    if (/^editor:v2:.*:(label):/.test(key)) {
      delete saved[key];
      cleaned = true;
    }
  });
  if (cleaned) localStorage.setItem(editableStorageKey, JSON.stringify(saved));
  editableElements(root).forEach(element => {
    if (!element.dataset.editKey) element.dataset.editKey = editableKey(element);
    if (saved[element.dataset.editKey] !== undefined) element.textContent = saved[element.dataset.editKey];
  });
}


function saveEditableText() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(editableStorageKey) || "{}");
  } catch {
    saved = {};
  }
  editableElements().forEach(element => {
    if (element.dataset.editKey) saved[element.dataset.editKey] = element.innerText.trim();
  });
  try {
    localStorage.setItem(editableStorageKey, JSON.stringify(saved));
  } catch {
    return false;
  }
  return true;
}

function setEditorMode(active) {
  editorActive = active;
  document.body.classList.toggle("editor-mode", active);
  editorToggle.hidden = active;
  editorToggle.setAttribute("aria-expanded", String(active));
  editorToolbar.hidden = !active;
  editableElements().forEach(element => {
    element.contentEditable = active ? "true" : "false";
    element.spellcheck = active;
    element.dataset.editable = active ? "" : undefined;
  });
}

editorToggle.addEventListener("click", () => setEditorMode(true));
document.querySelector(".editor-close").addEventListener("click", () => {
  saveEditableText();
  setEditorMode(false);
});
document.addEventListener("input", event => {
  if (event.target.matches("[data-editable]")) saveEditableText();
});
document.querySelector(".editor-save").addEventListener("click", () => {
  const status = document.querySelector(".editor-save-status");
  if (status) {
    status.textContent = saveEditableText() ? "Saved in this browser" : "Could not save in this browser";
    status.classList.add("visible");
    window.setTimeout(() => status.classList.remove("visible"), 2500);
  }
});
document.querySelector(".editor-reset").addEventListener("click", () => {
  if (!window.confirm("Reset all website text to the original content?")) return;
  localStorage.removeItem(editableStorageKey);
  location.reload();
});

const memberCategories = [
  "PI",
  "Management",
  "PhD",
  "MSc",
  "Honors",
  "Undergraduate trainees",
  "Alumni",
  "Research associates"
];
const memberCategoryDisplay = category => category === "PI" ? "Principal investigator" : category;

const memberProfiles = {
  PI: [
    {
      name: "Allison K. Walker, PhD",
      role: "Principal investigator · Professor, Biology, Acadia University",
      details: `
        <div class="profile-detail-section">
          <h3>Leadership &amp; Service</h3>
          <ul class="profile-role-list">
            <li><span>Director</span><a href="https://herbarium.acadiau.ca/home.html" target="_blank" rel="noopener">E.C. Smith Herbarium</a></li>
            <li><span>Co-Editor in Chief</span><a href="https://www.journals.elsevier.com/fungal-ecology" target="_blank" rel="noopener">Fungal Ecology</a></li>
            <li><span>Vice-President</span><a href="https://www.nsmycologicalsociety.org/" target="_blank" rel="noopener">Nova Scotia Mycological Society</a></li>
            <li><span>Member</span><a href="https://iucn.org/our-union/commissions/group/iucn-ssc-aquatic-fungi-specialist-group" target="_blank" rel="noopener">IUCN Species Survival Commission – Aquatic Fungi Specialist Group</a></li>
            <li><span>Editorial Board member</span>Canadian Journal of Microbiology (2019–2024)</li>
          </ul>
        </div>
        <div class="profile-detail-section">
          <h3>Education</h3>
          <ul class="profile-timeline">
            <li><strong>PhD Coastal Sciences, Mycology</strong><span>University of Southern Mississippi · 2012</span></li>
            <li><strong>MS Coastal Sciences, Mycology</strong><span>University of Southern Mississippi · 2007</span></li>
            <li><strong>BSc Honours Botany</strong><span>University of Toronto · 2003</span></li>
          </ul>
        </div>
        <div class="profile-detail-section">
          <h3>Research Experience</h3>
          <ul class="profile-experience-list">
            <li>
              <strong>Postdoctoral Scientist</strong><time>October 2012–July 2014</time>
              <p>Department of Chemistry, Carleton University / Biodiversity (Mycology &amp; Microbiology), Agriculture &amp; Agri-Food Canada, Ottawa.</p>
              <p>Co-supervisors: Prof. J. David Miller (Carleton University) and Dr. Keith A. Seifert (AAFC Research Scientist).</p>
            </li>
            <li>
              <strong>Graduate Research Assistant</strong><time>August 2005–September 2012</time>
              <p>Department of Coastal Sciences, University of Southern Mississippi Gulf Coast Research Laboratory, Ocean Springs, Mississippi, USA.</p>
              <p>Supervisors: Dr. J. Campbell and Dr. DJ Grimes.</p>
            </li>
            <li>
              <strong>Visiting Scientist</strong><time>September 2004–July 2005</time>
              <p>USDA-ARS Systematic Mycology &amp; Botany Laboratory, Beltsville, Maryland, USA.</p>
              <p>Supervisor: Dr. M. Catherine Aime.</p>
            </li>
          </ul>
        </div>`,
      image: "uploads/allison-walker-portrait.webp",
      secondaryImage: "https://bayoffungi.wordpress.com/wp-content/uploads/2023/03/zocsewfi_400x400.jpeg?w=400",
      secondaryImageAlt: "Allison K. Walker using a microscope",
      labLogo: "uploads/walker-lab-logo.png",
      labLogoAlt: "Walker Lab Fungal Dream Team logo"
    }
  ],
  Management: [
    {
      name: "Ximena Roman",
      role: "Research Associate | Lab Technician | Lab Daily Operations",
      bio: "She completed her BSc in biology at Acadia University, where she was most interested in microbiology and cell biology. She is currently working in the Walker Lab as a Research Associate/Lab Technician where she collaborates with current students to instruct molecular techniques, support experimental workflows, and maintain daily lab operations.",
      image: "uploads/ximena-roman.jpeg"
    }
  ],
  PhD: [
    {
      name: "Kendra Sampson",
      role: "PhD Candidate",
      bio: "From Louisdale, Nova Scotia, Kendra investigated arbuscular mycorrhizal fungi in a critically imperilled plant <em>Crocanthemum canadense</em> (Rockrose) for her Honours. Kendra continued her MSc (’23) in our lab, also examining AMF and sediment carbon densities in dominant salt marsh <em>Sporobolus</em> (<em>Spartina</em>) species in Bay of Fundy salt marshes as part of the NSERC ResNet project under the co-supervision of Dr. Danika van Proosdij (Saint Mary’s University). Currently a PhD Candidate and Instructor in the Biology Department.",
      image: "https://bayoffungi.wordpress.com/wp-content/uploads/2023/03/kendra-1.jpeg?w=694"
    }
  ],
  MSc: [
    {
      name: "Clara Ryan",
      role: "MSc student · Corner Brook, Newfoundland",
      bio: "Co-supervised with Dr. V. Lévesque, AAFC Kentville. Investigating a novel method for improving apple orchard soil health and carbon storage using fungi.",
      image: "https://bayoffungi.wordpress.com/wp-content/uploads/2024/11/clara-for-website.jpg?w=768"
    },
    {
      name: "Katie King",
      role: "MSc student · Fredericton, New Brunswick",
      bio: "Examining Ram’s Head Lady’s Slipper (Cypripedium arietinum), a critically imperilled Nova Scotia orchid, and its relationship with symbiotic fungi.",
      image: "https://bayoffungi.wordpress.com/wp-content/uploads/2023/03/katie1.jpg?w=427"
    },
    {
      name: "Hope Mailman",
      role: "MSc student · Berwick, Nova Scotia",
      bio: "Characterizing a new endophytic fungus in a native orchid.",
      image: "https://bayoffungi.wordpress.com/wp-content/uploads/2024/11/image-1.png?w=282"
    }
  ],
  Honors: [
    {
      name: "Emma Cook",
      role: "Honours student · Truro, Nova Scotia · 2026–27",
      bio: "Honours student with interests in hiking, painting, history, and the outdoors.",
      image: "https://bayoffungi.wordpress.com/wp-content/uploads/2025/12/emmacook-for-lab-website-hons.jpeg"
    },
    {
      name: "Sydnee Brown",
      role: "Honours student · Bridgewater, Nova Scotia · 2026–27",
      bio: "Honours student who enjoys baking, kayaking, and spending time outdoors.",
      image: "https://bayoffungi.wordpress.com/wp-content/uploads/2026/01/sydnee-photo-1.jpeg?w=720"
    },
    {
      name: "Mason Crouse",
      role: "Honours student",
      bio: "Honours student in the Walker Mycology Lab."
    }
  ],
  "Undergraduate trainees": [
    {
      name: "Hannah Phillips",
      role: "Research Skills student",
      bio: "Undergraduate research trainee.",
    },
    {
      name: "Olivia Dixon",
      role: "Research Topics student",
      bio: "Undergraduate research trainee.",
    }
  ],
  Alumni: [
    ["Tedi Pollak", "Honours, 2025–26", "Investigated the role of fungi in the germination and survival of culturally important Arctic lousewort species.", "https://bayoffungi.wordpress.com/wp-content/uploads/2025/06/falls-photo.jpg?w=1010"],
    ["Sarah Doyle", "Honours, 2025–26", "Investigated the isolation and propagation of arbuscular mycorrhizal fungi from Bay of Fundy salt marsh sediment for restoration projects, co-supervised by Kendra Sampson.", "https://bayoffungi.wordpress.com/wp-content/uploads/2025/06/sarah-d-for-labwebsite-2025.jpeg?w=1024"],
    ["Annelies Yates", "Honours, 2024–25", "Investigated fungal endophytes associated with eelgrass from field sites in British Columbia, Prince Edward Island, New Brunswick, and Nova Scotia.", ""],
    ["Charlotte Peng", "Honours, 2024", "Investigated non-mycorrhizal root endophytes of saltmarsh Spartina grass species; now studying law.", "https://bayoffungi.wordpress.com/wp-content/uploads/2014/07/chanterelles.jpg?w=604"],
    ["Arwen Estrada Pérez", "Honours, 2024", "Conducted co-op thesis research on plastic biodegradation capabilities of coastal fungi.", "https://bayoffungi.wordpress.com/wp-content/uploads/2023/03/20220916_135440.jpg?w=766"],
    ["Olivia Crooks", "Honours, 2023", "Investigated changes in fungal diversity in an Eastern Hemlock plot at Kejimkujik National Park and compared current collections with historical E.C. Smith Herbarium records.", "https://bayoffungi.wordpress.com/wp-content/uploads/2023/03/olivia-1.jpg?w=1024"],
    ["Rebecca Mader", "Honours, 2022 · MSc, 2024", "Completed co-supervised Honours research on essential-oil antifungal effects and MSc research on fungi associated with Eastern Hemlock. Now Biodiversity Coordinator with the Kennebecasis Watershed Restoration Committee.", "https://bayoffungi.wordpress.com/wp-content/uploads/2023/03/img_0060.jpeg?w=720"],
    ["Maria Roy", "MSc", "Explored apple-root fungal endophytes as a biocontrol treatment for apple replant disease at AAFC Kentville, co-supervised by Dr. Shawkat Ali.", "https://bayoffungi.wordpress.com/wp-content/uploads/2023/03/maria-1.jpg?w=796"],
    ["Véronique Plante", "MSc", "Former MSc student.", ""],
    ["Sarah Adams", "Honours · MSc · Research technician", "Completed MSc research on marine wood-associated fungi of the Bay of Fundy and previously investigated Geum plant endophytes.", "https://bayoffungi.wordpress.com/wp-content/uploads/2015/03/img_7247.jpg?w=750"],
    ["Tyler D’Entremont", "Honours · MSc", "Investigated Spartina mycorrhizae for salt-marsh restoration; now a PhD student at the University of Tennessee, Knoxville.", "https://bayoffungi.wordpress.com/wp-content/uploads/2015/03/img_1127.jpg?w=750"],
    ["Adele Bunbury-Blanchette", "MSc, 2016–18", "Studied Fusarium basal rot of onion; completed a PhD at Saint Mary’s University studying yeasts in Nova Scotia vineyards.", "https://bayoffungi.wordpress.com/wp-content/uploads/2015/03/adele-1.jpg?w=750"],
    ["Jacqueline Bradbury", "Honours, 2018", "Studied biochar and mycorrhizal fungi in propagation of the rare plant Geum peckii.", ""],
    ["Philicity Byers", "Honours, 2018–19", "Studied fungal associates of the rare plant Crocanthemum canadense.", "https://bayoffungi.wordpress.com/wp-content/uploads/2018/06/philicity.jpg?w=720"],
    ["John Tweedie", "Honours, 2018", "Studied fungi from a pulp mill site.", ""],
    ["Medina Velic", "Honours, 2018", "Studied antimicrobial growth promoters in swine.", ""],
    ["Rhys Winder", "Honours, 2018", "Studied antifungal resistance in Aspergillus fumigatus.", "https://bayoffungi.wordpress.com/wp-content/uploads/2018/06/rhys_medina-e1529426477444.jpg?w=563"],
    ["Victoria Taylor", "Honours, 2018–19", "Described a new obligate marine fungus from the Bay of Fundy.", "https://bayoffungi.wordpress.com/wp-content/uploads/2018/06/victoria-taylor.jpg?w=750"],
    ["Rebecca Dodge", "Honours, 2018–19", "Studied fungi associated with the rare plant Geum peckii.", "https://bayoffungi.wordpress.com/wp-content/uploads/2018/06/becky.jpg?w=720"],
    ["Jake Reicker", "Honours, 2018–19", "Studied intertidal mudflat fungi from the Minas Basin.", "https://bayoffungi.wordpress.com/wp-content/uploads/2018/06/jake-r.jpg?w=750"],
    ["Cardy Saunders", "Honours, 2016", "Investigated mercury content of lichens across Nova Scotia.", "https://bayoffungi.wordpress.com/wp-content/uploads/2015/03/img_1121.jpg?w=750"],
    ["Brandon Landry", "Honours", "Studied marine fungi and hydrocarbon degradation; later completed an MSc in mycology with Dr. Mary Berbee at UBC.", "https://bayoffungi.wordpress.com/wp-content/uploads/2015/03/brandon-pic2.jpg?w=461"],
    ["Alex Young", "Honours / Co-op, 2015", "Developed a DNA barcoding protocol for E.C. Smith Herbarium fungal collections; later completed an MSc at STFX and began PhD studies at Dalhousie.", "https://bayoffungi.wordpress.com/wp-content/uploads/2015/03/alexlab.jpg?w=720"],
    ["Sadie Moland", "Honours, 2015", "Investigated biochar–mycorrhiza interactions for native plant propagation and wetland restoration.", "https://bayoffungi.wordpress.com/wp-content/uploads/2015/03/sadie-pic2.jpg?w=750"]
  ].map(([name, role, bio, image]) => ({ name, role, bio, image }))
};

const researchAssociateProfiles = [
  {
    name: "Ximena Roman",
    role: "Research Associate | Lab Technician | Lab Daily Operations",
    bio: "She completed her BSc in biology at Acadia University, where she was most interested in microbiology and cell biology. She is currently working in the Walker Lab as a Research Associate/Lab Technician where she collaborates with current students to instruct molecular techniques, support experimental workflows, and maintain daily lab operations.",
    image: "uploads/ximena-roman.jpeg"
  },
  {
    name: "Brent Robicheau",
    role: "Former MSc research associate · Weymouth, Nova Scotia",
    bio: "Former research associate in the lab. Brent is now a postdoctoral researcher at Clark University in the USA and will soon begin a faculty position at UPEI.",
    image: "https://bayoffungi.wordpress.com/wp-content/uploads/2020/09/brent_website.jpg?w=671"
  }
];

const formerStaffProfiles = [
  {
    name: "Sarah Adams",
    role: "Former research technician",
    bio: "Completed MSc research on marine wood-associated fungi of the Bay of Fundy and previously investigated Geum plant endophytes.",
    image: "https://bayoffungi.wordpress.com/wp-content/uploads/2015/03/img_7247.jpg?w=750"
  }
];

function renderView(key) {
  const view = views[key];
  if (!view) return;
  document.querySelectorAll("main > section:not(.hero):not(.section-view)").forEach(section => {
    section.hidden = true;
  });
  hero.hidden = true;
  sectionView.hidden = false;
  footer.hidden = true;
  sectionContent.className = key === "people" ? "people-view" : "";
  if (key === "people") {
    sectionContent.innerHTML = `<h1 class="view-title">${view.title}</h1>
      <div class="members-directory">
        <div class="members-index" role="tablist" aria-label="Lab member categories">
          ${memberCategories.map((category, index) => `<button type="button" role="tab" data-member-category="${index}" aria-selected="${index === 0}">${memberCategoryDisplay(category)}<span>↗</span></button>`).join("")}
        </div>
        <div class="members-roster" aria-live="polite"></div>
      </div>`;
    renderMembers("0");
    sectionContent.querySelectorAll("[data-member-category]").forEach(button => {
      button.addEventListener("click", () => renderMembers(button.dataset.memberCategory));
    });
  } else if (view.rows) {
    sectionContent.innerHTML = `<p class="view-kicker">${view.kicker}</p><h1 class="view-title">${view.title}</h1>` +
      view.items.map(item => `<article class="view-row"><span>${item[0]}</span><h3>${item[1]}</h3><strong>${item[2]}</strong></article>`).join("");
  } else {
    sectionContent.innerHTML = `<p class="view-kicker">${view.kicker}</p><h1 class="view-title">${view.title}</h1><div class="view-grid">` +
      view.items.map(item => `<article><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join("") + `</div>`;
  }
  prepareEditableText();
  if (editorActive) setEditorMode(true);
  window.scrollTo(0, 0);
}

function renderMembers(categoryIndex) {
  const category = memberCategories[Number(categoryIndex)];
  const buttons = sectionContent.querySelectorAll("[data-member-category]");
  buttons.forEach(button => {
    const active = button.dataset.memberCategory === String(categoryIndex);
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active);
  });
  const roster = sectionContent.querySelector(".members-roster");
  const profiles = memberProfiles[category] || [];
  const cards = profiles.map(profile => category === "Management" ? `
    <article class="member-card management-card" data-profile-index="${profiles.indexOf(profile)}">
      <div class="management-profile-main">
        <label class="member-photo-slot management-photo-slot${profile.image ? " has-photo" : ""}"${profile.image ? ` style="--member-photo: url('${profile.image}')"` : ""}>
          <input type="file" accept="image/*" aria-label="Replace photo for ${profile.name}">
        </label>
        <div class="management-profile-copy">
          <h3>${profile.name}</h3>
          <p class="member-role">${profile.role}</p>
          <div class="management-profile-bio">${profile.bio}</div>
        </div>
      </div>
      <div class="management-profile-side">
        <label class="member-photo-slot management-media-slot">
          <input type="file" accept="image/*" aria-label="Add a rectangular image for ${profile.name}">
          <span>Add image</span>
        </label>
        <div class="management-profile-caption"><strong>Investigating:</strong> Marine endophytic fungi associated with South Australian seagrass tissues</div>
      </div>
    </article>
  ` : `
    <article class="member-card${category === "PI" ? " pi-card" : ""}" data-profile-index="${profiles.indexOf(profile)}">
      <label class="member-photo-slot${category === "PI" ? " pi-photo-slot" : ""}${profile.image ? " has-photo" : ""}"${profile.image ? ` style="--member-photo: url('${profile.image}')"` : ""}>
        <input type="file" accept="image/*" aria-label="Replace photo for ${profile.name}">
        ${category === "PI" ? "<span>Add a larger photo</span>" : ""}
      </label>
      <div class="pi-introduction">
        <h3>${profile.name}</h3>
        ${profile.credential ? `<p class="member-credential">${profile.credential}</p>` : ""}
        <p class="member-role">${profile.role}</p>
        ${profile.bio ? `<p class="pi-bio">${profile.bio}</p>` : ""}
        ${category === "PI" && profile.labLogo ? `<figure class="pi-lab-logo"><img src="${profile.labLogo}" alt="${profile.labLogoAlt || ""}"></figure>` : ""}
      </div>
      ${category === "PI" && profile.secondaryImage ? `<figure class="pi-secondary-photo"><img src="${profile.secondaryImage}" alt="${profile.secondaryImageAlt || profile.name}"></figure>` : ""}
      ${category === "PI" && profile.details ? `<div class="pi-profile-details">${profile.details}</div>` : ""}
    </article>
  `).join("");
  roster.innerHTML = `<div class="members-roster-heading">${memberCategoryDisplay(category)}</div>` +
    (cards ? `<div class="members-roster-grid${category === "PI" ? " pi-roster-grid" : ""}" style="margin-top: 28px;">${cards}</div>` : `<div class="members-empty">${memberCategoryDisplay(category)} profiles coming soon.</div>`);
  if (category === "Management") {
    const formerStaffCards = formerStaffProfiles.map(profile => `
      <article class="member-card" data-former-staff-profile="true">
        <label class="member-photo-slot has-photo" style="--member-photo: url('${profile.image}')">
          <input type="file" accept="image/*" aria-label="Replace photo for ${profile.name}">
        </label>
        <h3>${profile.name}</h3>
        ${profile.credential ? `<p class="member-credential">${profile.credential}</p>` : ""}
        <p class="member-role">${profile.role}</p>
        <p>${profile.bio}</p>
      </article>
    `).join("");
    roster.insertAdjacentHTML("beforeend", `
      <section class="former-staff-section" aria-labelledby="former-staff-title">
        <div class="members-roster-heading">
          <h2 id="former-staff-title">Former staff</h2>
        </div>
        <div class="members-roster-grid">${formerStaffCards}</div>
      </section>
    `);
  }
  if (category === "Research associates") {
    const associateCards = researchAssociateProfiles.map(profile => `
      <article class="member-card" data-profile-index="${researchAssociateProfiles.indexOf(profile)}" data-associate-profile="true">
        <label class="member-photo-slot has-photo" style="--member-photo: url('${profile.image}')">
          <input type="file" accept="image/*" aria-label="Replace photo for ${profile.name}">
        </label>
        <h3>${profile.name}</h3>
        <p class="member-role">${profile.role}</p>
        <p>${profile.bio}</p>
      </article>
    `).join("");
    roster.innerHTML = `<div class="members-roster-heading">${memberCategoryDisplay(category)}</div>
      <div class="members-roster-grid" style="margin-top: 28px;">${associateCards}</div>`;
  }
  if (category === "PI") {
    roster.insertAdjacentHTML("beforeend", `
      <section class="pi-gallery" aria-labelledby="pi-gallery-title">
        <div class="pi-gallery-heading">
          <div>
            <p class="section-index">Principal investigator gallery</p>
            <h2 id="pi-gallery-title">Lab moments</h2>
          </div>
          <p>Scroll through the gallery and add up to ten images.</p>
        </div>
        <div class="pi-gallery-track" role="list">
          ${Array.from({ length: 10 }, (_, index) => `
            <label class="pi-gallery-slot" role="listitem">
              <input type="file" accept="image/*" aria-label="Add principal investigator gallery image ${index + 1}">
              <span>${String(index + 1).padStart(2, "0")}<small>Add image</small></span>
            </label>
          `).join("")}
        </div>
      </section>
    `);
    roster.querySelectorAll(".pi-gallery-slot input").forEach(input => {
      input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file || !file.type.startsWith("image/")) return;
        const slot = input.closest(".pi-gallery-slot");
        slot.style.setProperty("--gallery-photo", `url('${URL.createObjectURL(file)}')`);
        slot.classList.add("has-photo");
      });
    });
  }
  roster.querySelectorAll(".member-photo-slot input").forEach(input => {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      const slot = input.closest(".member-photo-slot");
      slot.style.setProperty("--member-photo", `url('${URL.createObjectURL(file)}')`);
      slot.classList.add("has-photo");
    });
  });
  roster.querySelectorAll(".member-photo-slot").forEach(slot => {
    slot.removeAttribute("role");
    slot.removeAttribute("tabindex");
  });
  prepareEditableText();
  if (editorActive) setEditorMode(true);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.querySelector(".member-profile-panel")) {
    document.querySelector(".member-profile-panel").remove();
    document.body.classList.remove("profile-open");
  }
});

function returnHome() {
  sectionView.hidden = true;
  hero.hidden = false;
  homeDirectory.hidden = false;
  document.querySelectorAll("main > section:not(.hero):not(.section-view):not(.home-directory)").forEach(section => {
    section.hidden = false;
  });
  footer.hidden = false;
  history.replaceState(null, "", location.pathname);
  prepareEditableText();
  if (editorActive) setEditorMode(true);
}

function openMemberProfile(profile, category) {
  const existing = document.querySelector(".member-profile-panel");
  if (existing) existing.remove();
  const panel = document.createElement("section");
  panel.className = "member-profile-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", `${profile.name} profile`);
  panel.innerHTML = `
    <div class="member-profile-backdrop"></div>
    <div class="member-profile-content">
      <button class="member-profile-close" type="button" aria-label="Close profile">← <span>Back to members</span></button>
      <div class="member-profile-layout">
        <div class="member-profile-photo${profile.image ? " has-photo" : ""}"${profile.image ? ` style="--member-photo: url('${profile.image}')"` : ""}></div>
        <div class="member-profile-copy">
          <p class="view-kicker" data-edit-key="profile:${profile.name}:category">${memberCategoryDisplay(category)}</p>
          <h2 data-edit-key="profile:${profile.name}:name">${profile.name}</h2>
          <p class="member-profile-role" data-edit-key="profile:${profile.name}:role">${profile.role}</p>
          ${profile.details || ""}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  document.body.classList.add("profile-open");
  prepareEditableText(panel);
  if (editorActive) setEditorMode(true);
  const close = () => {
    panel.remove();
    document.body.classList.remove("profile-open");
  };
  panel.querySelector(".member-profile-close").addEventListener("click", close);
  panel.querySelector(".member-profile-backdrop").addEventListener("click", close);
}

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", event => {
    const key = link.getAttribute("href").slice(1);
    if (key === "home") {
      event.preventDefault();
      if (!sectionView.hidden) returnHome();
      window.scrollTo(0, 0);
      history.replaceState(null, "", location.pathname);
    } else if (views[key]) {
      event.preventDefault();
      renderView(key);
      history.replaceState(null, "", `#${key}`);
    }
  });
});

document.querySelectorAll(".home-directory .directory-links a, .hero .text-link").forEach(link => {
  link.addEventListener("click", event => {
    const key = link.getAttribute("href").slice(1);
    if (views[key]) {
      event.preventDefault();
      renderView(key);
      history.replaceState(null, "", `#${key}`);
    }
  });
});

document.querySelectorAll('a[href="#people"]').forEach(link => {
  if (!link.closest(".main-nav") && link.closest(".people-section")) {
    link.addEventListener("click", event => {
      event.preventDefault();
      renderView("people");
      history.replaceState(null, "", "#people");
    });
  }
});
sectionClose.addEventListener("click", returnHome);
document.querySelector(".brand").addEventListener("click", event => {
  if (!sectionView.hidden) {
    event.preventDefault();
    returnHome();
  }
});

function previewAffiliation(slot, file) {
  if (!file || !file.type.startsWith("image/")) return;
  const image = slot.querySelector("img");
  image.src = URL.createObjectURL(file);
  image.hidden = false;
  slot.classList.add("has-image");
}

document.querySelectorAll(".affiliation-slot").forEach(slot => {
  const input = slot.querySelector("input");
  input.addEventListener("change", () => previewAffiliation(slot, input.files[0]));
  slot.addEventListener("dragover", event => event.preventDefault());
  slot.addEventListener("dragenter", () => slot.classList.add("dragging"));
  slot.addEventListener("dragleave", () => slot.classList.remove("dragging"));
  slot.addEventListener("drop", event => {
    event.preventDefault();
    slot.classList.remove("dragging");
    previewAffiliation(slot, event.dataTransfer.files[0]);
  });
});

prepareEditableText();
const initialSection = location.hash.slice(1);
if (initialSection === "home" || !initialSection) {
  returnHome();
} else if (views[initialSection]) {
  renderView(initialSection);
}
