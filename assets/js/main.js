/* =====================================================
   KLENZO — Single combined JS file for the whole site.
   Loaded on every page; each page-specific block below is
   guarded so it only runs where its markup actually exists.
   ===================================================== */

/* ================= Shared cart / wishlist store (localStorage) ================= */
const KlenzoStore = (() => {
  const CART_KEY = "klenzo_cart";
  const WISH_KEY = "klenzo_wishlist";

  const read = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };
  const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const getCart = () => read(CART_KEY);

  const addToCart = (id, qty = 1) => {
    const cart = getCart();
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, qty });
    write(CART_KEY, cart);
    updateCartBadge();
  };

  const cartCount = () => getCart().reduce((sum, i) => sum + i.qty, 0);

  const removeFromCart = (id) => {
    write(CART_KEY, getCart().filter((i) => i.id !== id));
    updateCartBadge();
  };

  const setCartQty = (id, qty) => {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    if (qty <= 0) return removeFromCart(id);
    item.qty = qty;
    write(CART_KEY, cart);
    updateCartBadge();
  };

  const clearCart = () => {
    write(CART_KEY, []);
    updateCartBadge();
  };

  const getWishlist = () => read(WISH_KEY);

  const toggleWishlist = (id) => {
    let list = getWishlist();
    const has = list.includes(id);
    list = has ? list.filter((x) => x !== id) : [...list, id];
    write(WISH_KEY, list);
    updateWishBadge();
    return !has;
  };

  const isWishlisted = (id) => getWishlist().includes(id);

  const updateCartBadge = () => {
    const count = cartCount();
    document.querySelectorAll(".cart-badge").forEach((b) => {
      b.textContent = String(count);
    });
  };

  const updateWishBadge = () => {
    const count = getWishlist().length;
    document.querySelectorAll(".wish-badge").forEach((b) => {
      b.textContent = String(count);
    });
  };

  return {
    getCart,
    addToCart,
    cartCount,
    removeFromCart,
    setCartQty,
    clearCart,
    getWishlist,
    toggleWishlist,
    isWishlisted,
    updateCartBadge,
    updateWishBadge
  };
})();

/* ================= Shared product catalogue ================= */
const KLENZO_PRODUCTS = [
  {
    id: "toilet-cleaner",
    name: "Toilet Cleaner",
    category: "Toilet Care",
    image: "assets/img/toilet-cleaner.png",
    gallery: ["assets/img/toilet-cleaner.png", "assets/img/floor-cleaner.png", "assets/img/about.png"],
    regularPrice: 179,
    salePrice: 149,
    unit: "500ml",
    rating: 4.8,
    reviewCount: 214,
    bestseller: true,
    shortDescription: "A powerful, plant-based toilet cleaner that cuts through limescale and stains while leaving a fresh citrus scent — safe for septic tanks and daily use.",
    fullDescription: "Klenzo Toilet Cleaner is formulated with citrus-derived acids and 99.9% germ-killing power, tackling tough limescale, stains and odour without the harsh fumes of bleach-based cleaners. The thick, clingy gel formula coats the bowl for deep cleaning action, even under the rim, and rinses away completely leaving no chemical residue behind. Safe for septic systems and gentle on pipes, it's tough on grime and easy on your home.",
    variation: {
      label: "Size",
      options: [
        { label: "500ml", priceAdd: 0 },
        { label: "1L", priceAdd: 120 }
      ]
    },
    reviews: [
      { name: "Rahul Verma", rating: 5, text: "Works better than the big brands and doesn't burn your nose. Genuinely impressed." },
      { name: "Sana Sheikh", rating: 5, text: "One application and the stains are gone. Smells great too." },
      { name: "Deepak Rao", rating: 4, text: "Great cleaner, wish the bottle nozzle was a bit longer." }
    ]
  },
  {
    id: "floor-cleaner",
    name: "Floor Cleaner",
    category: "Floor Care",
    image: "assets/img/floor-cleaner.png",
    gallery: ["assets/img/floor-cleaner.png", "assets/img/about.png", "assets/img/toilet-cleaner.png"],
    regularPrice: 249,
    salePrice: 199,
    unit: "1L",
    rating: 4.9,
    reviewCount: 356,
    bestseller: true,
    shortDescription: "A concentrated, plant-powered floor cleaner that lifts dirt and grime while leaving every surface shining and naturally fragranced.",
    fullDescription: "Klenzo Floor Cleaner is a concentrated formula built for Indian homes — safe on marble, tile, granite and vitrified floors. A few capfuls in a mop bucket cuts through everyday grime, food spills and footprints, leaving behind a long-lasting fresh scent without any sticky residue. Our plant-based surfactants clean as effectively as chemical formulas, minus the harsh fumes, so you can mop with the windows closed.",
    variation: {
      label: "Size",
      options: [
        { label: "1L", priceAdd: 0 },
        { label: "2L", priceAdd: 180 }
      ]
    },
    reviews: [
      { name: "Priya Sharma", rating: 5, text: "The floor cleaner smells amazing and my marble actually shines now. Switched the whole house to Klenzo." },
      { name: "Arvind Nair", rating: 5, text: "Concentrated formula lasts forever, great value for money." },
      { name: "Fatima Ali", rating: 5, text: "Love the fragrance, lasts the whole day." }
    ]
  },
  {
    id: "dish-wash",
    name: "Dish Wash",
    category: "Dish Care",
    image: "assets/img/dish-wash.png",
    gallery: ["assets/img/dish-wash.png", "assets/img/hand-wash.png", "assets/img/hand-wash2.png"],
    regularPrice: 129,
    salePrice: 99,
    unit: "500ml",
    rating: 4.7,
    reviewCount: 189,
    bestseller: false,
    shortDescription: "A grease-cutting dish wash gel that's gentle on hands, powered by plant-based degreasers and a refreshing citrus scent.",
    fullDescription: "Klenzo Dish Wash tackles oily pots, pans and dishes with ease using naturally derived degreasing agents — no harsh sulphates that dry out your skin. A small squeeze creates a rich lather that lifts grease even in cold water, so you save on hot water and time. Dermatologically tested to be gentle on hands, even with everyday use.",
    variation: {
      label: "Size",
      options: [
        { label: "500ml", priceAdd: 0 },
        { label: "1L", priceAdd: 110 }
      ]
    },
    reviews: [
      { name: "Anjali Mehta", rating: 5, text: "Cuts grease like magic but my hands don't feel dry anymore. That's the win for me." },
      { name: "Suresh Patel", rating: 5, text: "Ordered for my restaurant kitchen. Staff loves it." },
      { name: "Meera Iyer", rating: 4, text: "Great lather, a little goes a long way." }
    ]
  },
  {
    id: "hand-wash-lemon",
    name: "Hand Wash — Lemon",
    category: "Hand Wash",
    image: "assets/img/hand-wash.png",
    gallery: ["assets/img/hand-wash.png", "assets/img/hand-wash2.png", "assets/img/dish-wash.png"],
    regularPrice: 149,
    salePrice: 119,
    unit: "500ml",
    rating: 4.8,
    reviewCount: 142,
    bestseller: false,
    shortDescription: "A foaming hand wash with zesty lemon and aloe vera that cleans hands without stripping natural moisture.",
    fullDescription: "Klenzo Hand Wash — Lemon combines a gentle foaming formula with aloe vera and vitamin E to clean hands thoroughly while keeping skin soft. The bright citrus scent is uplifting without being overpowering, making it a favourite for kitchens and bathrooms alike. Dermatologically tested and safe for daily, frequent use by the whole family.",
    variation: {
      label: "Scent",
      options: [
        { label: "Lemon", priceAdd: 0 },
        { label: "Lavender", priceAdd: 0 }
      ]
    },
    reviews: [
      { name: "Kavita Reddy", rating: 5, text: "The foam with aloe is so gentle. Whole family uses it, even my mom approves!" },
      { name: "Yusuf Khan", rating: 5, text: "Lovely lemon scent, not overpowering at all." },
      { name: "Pooja Nair", rating: 4, text: "Great pump dispenser, hardly ever clogs." }
    ]
  },
  {
    id: "hand-wash-lavender",
    name: "Hand Wash — Lavender",
    category: "Hand Wash",
    image: "assets/img/hand-wash2.png",
    gallery: ["assets/img/hand-wash2.png", "assets/img/hand-wash.png", "assets/img/dish-wash.png"],
    regularPrice: 149,
    salePrice: 119,
    unit: "500ml",
    rating: 4.8,
    reviewCount: 98,
    bestseller: false,
    shortDescription: "A calming lavender hand wash with aloe vera and vitamin E — gentle enough for little hands, effective enough for everyone.",
    fullDescription: "Klenzo Hand Wash — Lavender pairs a soothing floral scent with a moisturising, foaming formula. Aloe vera and vitamin E help keep skin soft through repeated hand-washing, while the plant-based cleansing agents remove everyday dirt and germs effectively. A relaxing choice for bedtime routines and sensitive skin.",
    variation: {
      label: "Scent",
      options: [
        { label: "Lavender", priceAdd: 0 },
        { label: "Lemon", priceAdd: 0 }
      ]
    },
    reviews: [
      { name: "Vikram Singh", rating: 5, text: "Safe around my toddler and my labrador. That alone makes Klenzo worth every rupee." },
      { name: "Neha Gupta", rating: 5, text: "The lavender scent is so calming before bed." },
      { name: "Rohit Malhotra", rating: 4, text: "Great moisturising feel, doesn't dry my hands." }
    ]
  },
  {
    id: "bath-soap-lemon",
    name: "Bath Soap — Lemon",
    category: "Bath Soap",
    image: "assets/img/bath-soap-lemon-tight.png",
    gallery: ["assets/img/bath-soap-lemon-tight.png", "assets/img/bath-soap-lavender-tight.png", "assets/img/bath-soap-ocean-tight.png"],
    regularPrice: 59,
    salePrice: 45,
    unit: "100g",
    rating: 4.9,
    reviewCount: 267,
    bestseller: true,
    shortDescription: "A refreshing lemon bath soap enriched with glycerin and citrus extracts for soft, glowing skin.",
    fullDescription: "Klenzo Bath Soap — Lemon is crafted with moisturising glycerin and real citrus extracts to cleanse without stripping your skin's natural oils. The zesty lemon fragrance leaves you feeling refreshed and energised, morning or night. Free from parabens and sulphates, it's a gentle everyday soap for the whole family.",
    variation: {
      label: "Pack",
      options: [
        { label: "Single Bar", priceAdd: 0 },
        { label: "3-Pack", priceAdd: 85 }
      ]
    },
    reviews: [
      { name: "Ritu Agarwal", rating: 5, text: "Bottles look premium on the shelf, and the citrus scent is lovely." },
      { name: "Amit Joshi", rating: 5, text: "Eco-friendly packaging and it actually cleans. Rare combo." },
      { name: "Sneha Kulkarni", rating: 5, text: "Lathers beautifully and doesn't leave skin feeling tight." }
    ]
  },
  {
    id: "bath-soap-lavender",
    name: "Bath Soap — Lavender",
    category: "Bath Soap",
    image: "assets/img/bath-soap-lavender-tight.png",
    gallery: ["assets/img/bath-soap-lavender-tight.png", "assets/img/bath-soap-lemon-tight.png", "assets/img/bath-soap-ocean-tight.png"],
    regularPrice: 59,
    salePrice: 45,
    unit: "100g",
    rating: 4.8,
    reviewCount: 174,
    bestseller: false,
    shortDescription: "A calming lavender bath soap with glycerin that soothes skin while you unwind after a long day.",
    fullDescription: "Klenzo Bath Soap — Lavender blends moisturising glycerin with soothing lavender oil for a spa-like bathing experience at home. It gently cleanses while helping skin retain moisture, and the calming floral scent lingers pleasantly on skin. A great pick for evening showers and sensitive skin types.",
    variation: {
      label: "Pack",
      options: [
        { label: "Single Bar", priceAdd: 0 },
        { label: "3-Pack", priceAdd: 85 }
      ]
    },
    reviews: [
      { name: "Manish Kumar", rating: 5, text: "Tried it after a friend's recommendation. Now I'm the friend doing the recommending." },
      { name: "Divya Menon", rating: 5, text: "So relaxing in the evening, smells incredible." },
      { name: "Karan Bedi", rating: 4, text: "Good lather, soap bar lasts a decent while." }
    ]
  },
  {
    id: "bath-soap-ocean",
    name: "Bath Soap — Ocean Fresh",
    category: "Bath Soap",
    image: "assets/img/bath-soap-ocean-tight.png",
    gallery: ["assets/img/bath-soap-ocean-tight.png", "assets/img/bath-soap-lemon-tight.png", "assets/img/bath-soap-lavender-tight.png"],
    regularPrice: 59,
    salePrice: 45,
    unit: "100g",
    rating: 4.7,
    reviewCount: 121,
    bestseller: false,
    shortDescription: "An invigorating ocean-fresh bath soap with glycerin for a clean, energising shower experience.",
    fullDescription: "Klenzo Bath Soap — Ocean Fresh delivers a crisp, marine-inspired scent alongside a moisturising glycerin base. It cleanses thoroughly without over-drying skin, making it ideal for daily use. The invigorating fragrance is a favourite for morning showers when you need to feel instantly refreshed.",
    variation: {
      label: "Pack",
      options: [
        { label: "Single Bar", priceAdd: 0 },
        { label: "3-Pack", priceAdd: 85 }
      ]
    },
    reviews: [
      { name: "Anjali Mehta", rating: 5, text: "Smells like an actual sea breeze, love it for mornings." },
      { name: "Devansh Rao", rating: 4, text: "Clean scent, doesn't linger too strong which I like." },
      { name: "Ishita Bose", rating: 5, text: "My favourite of the three scents by far." }
    ]
  }
];

/* Special bundle offer — sold from the homepage CTA, not listed in the shop grid */
const KLENZO_BUNDLE = {
  id: "bundle-5-pack",
  name: "Klenzo 5-Pack Bundle",
  category: "Bundle Offer",
  image: "assets/img/about.png",
  gallery: ["assets/img/about.png", "assets/img/dish-wash.png", "assets/img/hand-wash.png"],
  regularPrice: 795,
  salePrice: 636,
  unit: "5-pack",
  rating: 4.9,
  reviewCount: 2300,
  bestseller: true,
  shortDescription: "Dish wash, both hand wash scents, and the full bath soap trio — everything your home needs for the month, bundled at 20% off.",
  fullDescription: "The Klenzo 5-Pack Bundle brings together our most-loved essentials in one box: dish wash, hand wash (lemon and lavender) and the full bath soap trio (lemon, lavender, ocean fresh). A complete plant-based cleaning and hygiene routine for the whole family, at 20% off the individual prices.",
  variation: { label: "Pack", options: [{ label: "5-Pack", priceAdd: 0 }] },
  reviews: [
    { name: "Suresh Patel", rating: 5, text: "Best value combo — everything we need for a month in one box." }
  ]
};

function klenzoFormatPrice(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function klenzoGetProduct(id) {
  return KLENZO_PRODUCTS.find((p) => p.id === id) || (id === KLENZO_BUNDLE.id ? KLENZO_BUNDLE : undefined);
}

function klenzoGetRelated(id, count = 5) {
  const others = KLENZO_PRODUCTS.filter((p) => p.id !== id);
  return others.slice(0, count);
}

/* ================= Career openings data ================= */
/* To publish a new role, push an object into KLENZO_JOBS below.
   Leave the array empty to show the "no openings right now" state.
   { id, title, department, location, type, description } */
const KLENZO_JOBS = [];

/* ================= Shared toast helper ================= */
let klenzoToastEl = null;
let klenzoToastTimer;
function klenzoShowToast(msg, duration = 2200) {
  if (!klenzoToastEl) {
    klenzoToastEl = document.createElement("div");
    klenzoToastEl.className = "toast";
    klenzoToastEl.setAttribute("role", "status");
    document.body.appendChild(klenzoToastEl);
  }
  klenzoToastEl.textContent = msg;
  klenzoToastEl.classList.add("show");
  clearTimeout(klenzoToastTimer);
  klenzoToastTimer = setTimeout(() => klenzoToastEl.classList.remove("show"), duration);
}

/* ================= Shared scroll-reveal helper =================
   script.js's own reveal observer below only scans .reveal elements
   present at DOMContentLoaded, so any markup injected afterwards
   (shop grid, product related-list, career jobs, ...) needs this
   to get its own observer pass. */
const klenzoObserveReveals = (root) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  root.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
};

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById("navbar");
  /* Pages with data-solid="true" keep a permanently solid/dark navbar
     (no colorful hero right underneath it), so scroll shouldn't touch it. */
  const navbarIsSolid = navbar.dataset.solid === "true";
  const onScroll = () => {
    if (navbarIsSolid) return;
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Active link highlight based on section in view */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  /* Close mobile menu when a link is tapped */
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  klenzoObserveReveals(document);

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll(".stat-number");

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString("en-IN");
      return;
    }
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased).toLocaleString("en-IN");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- Hero rising bubbles ---------- */
  const bubbleWrap = document.getElementById("bubbles");
  if (bubbleWrap && !prefersReducedMotion) {
    const BUBBLE_COUNT = 16;
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const b = document.createElement("span");
      b.className = "bubble";
      const size = 8 + Math.random() * 34; // 8–42px
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${Math.random() * 100}%`;
      b.style.animationDuration = `${9 + Math.random() * 12}s`;
      b.style.animationDelay = `${Math.random() * 12}s`;
      b.style.setProperty("--sway", `${(Math.random() - 0.5) * 120}px`);
      bubbleWrap.appendChild(b);
    }
  }

  /* ---------- Review marquee ---------- */
  const reviews = [
    { name: "Priya Sharma", city: "Jaipur", text: "The floor cleaner smells amazing and my marble actually shines now. Switched the whole house to Klenzo.", color: "#0ba5ec" },
    { name: "Rahul Verma", city: "Delhi", text: "Toilet cleaner works better than the big brands and doesn't burn your nose. Genuinely impressed.", color: "#10c98f" },
    { name: "Anjali Mehta", city: "Mumbai", text: "Dish cleaner cuts grease like magic but my hands don't feel dry anymore. That's the win for me.", color: "#3b82f6" },
    { name: "Suresh Patel", city: "Ahmedabad", text: "Ordered the 5-pack for my restaurant kitchen. Staff loves it, customers notice the freshness.", color: "#14b8a6" },
    { name: "Neha Gupta", city: "Lucknow", text: "Mirror cleaner is a game changer — zero streaks, one wipe. My bathroom mirrors have never looked better.", color: "#8b5cf6" },
    { name: "Vikram Singh", city: "Chandigarh", text: "Safe around my toddler and my labrador. That alone makes Klenzo worth every rupee.", color: "#f59e0b" },
    { name: "Kavita Reddy", city: "Hyderabad", text: "The hand wash foam with aloe is so gentle. Whole family uses it, even my mom approves!", color: "#ec4899" },
    { name: "Amit Joshi", city: "Pune", text: "Eco-friendly packaging and it actually cleans. Rare combo. Been reordering for 8 months now.", color: "#06b6d4" },
    { name: "Ritu Agarwal", city: "Kota", text: "Free delivery was quick, bottles look premium on the shelf, and the eucalyptus scent is lovely.", color: "#10b981" },
    { name: "Manish Kumar", city: "Patna", text: "Tried it after a friend's recommendation. Now I'm the friend doing the recommending.", color: "#6366f1" },
  ];

  const makeReviewCard = ({ name, city, text, color }) => {
    const initials = name.split(" ").map((w) => w[0]).join("");
    const card = document.createElement("article");
    card.className = "review-card";
    card.innerHTML = `
      <div class="review-stars" aria-hidden="true"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
      <p class="review-text">"${text}"</p>
      <div class="review-author">
        <span class="review-avatar" style="background:${color}">${initials}</span>
        <span>
          <span class="review-name">${name}</span><br />
          <span class="review-city">${city}</span>
        </span>
      </div>
    `;
    return card;
  };

  const fillMarquee = (trackId, items) => {
    const track = document.getElementById(trackId);
    if (!track) return;
    /* Duplicate the set once so translateX(-50%) loops seamlessly */
    [...items, ...items].forEach((r, i) => {
      const card = makeReviewCard(r);
      if (i >= items.length) card.setAttribute("aria-hidden", "true");
      track.appendChild(card);
    });
  };

  fillMarquee("marqueeTop", reviews.slice(0, 5));
  fillMarquee("marqueeBottom", reviews.slice(5));

  /* ---------- Static product cards (e.g. homepage) ---------- */
  document.querySelectorAll(".product-card").forEach((card) => {
    const title = card.querySelector("h3").textContent.trim();
    const productId = card.dataset.id;

    const wishBtn = card.querySelector(".wish-btn");
    if (productId && KlenzoStore.isWishlisted(productId)) {
      wishBtn.classList.add("active");
      wishBtn.setAttribute("aria-pressed", "true");
    }
    wishBtn.addEventListener("click", () => {
      let active = wishBtn.classList.toggle("active");
      if (productId) {
        active = KlenzoStore.toggleWishlist(productId);
        wishBtn.classList.toggle("active", active);
      }
      wishBtn.setAttribute("aria-pressed", String(active));
      klenzoShowToast(active ? `❤️ ${title} added to wishlist` : `${title} removed from wishlist`);
    });

    const cartBtn = card.querySelector(".btn-cart");
    cartBtn.addEventListener("click", () => {
      cartBtn.classList.remove("added");
      void cartBtn.offsetWidth; // restart animation
      cartBtn.classList.add("added");
      if (productId) {
        KlenzoStore.addToCart(productId, 1);
        window.location.href = "cart.html";
      } else {
        klenzoShowToast(`🛒 ${title} added to cart`);
      }
    });

    const infoBtn = card.querySelector(".btn-info");
    if (infoBtn) {
      infoBtn.addEventListener("click", () => {
        if (productId) window.location.href = `product.html?id=${productId}`;
        else klenzoShowToast(`${title} — full details page coming soon`);
      });
    }
  });

  /* ---------- Header cart / account icons ---------- */
  const cartIconBtn = document.getElementById("cartIconBtn");
  if (cartIconBtn) {
    cartIconBtn.addEventListener("click", () => {
      const cartContainer = document.getElementById("cartContainer");
      if (cartContainer) {
        cartContainer.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      } else {
        window.location.href = "cart.html";
      }
    });
  }
  const accountIconBtn = document.getElementById("accountIconBtn");
  if (accountIconBtn) {
    accountIconBtn.addEventListener("click", () => {
      klenzoShowToast("👤 My Account — coming soon");
    });
  }

  /* ---------- Quick shop strip ---------- */
  document.querySelectorAll(".quick-item").forEach((item) => {
    item.addEventListener("click", () => {
      const target = document.getElementById(item.dataset.target);
      if (!target) return;
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
      target.classList.add("card-highlight");
      setTimeout(() => target.classList.remove("card-highlight"), 1200);
    });
  });

  /* ---------- View all products ---------- */
  const viewAllBtn = document.getElementById("viewAllBtn");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      klenzoShowToast("Full Klenzo range launching soon — stay tuned!");
    });
  }

  /* ---------- Best seller bundle ---------- */
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      KlenzoStore.addToCart("bundle-5-pack", 1);
      window.location.href = "cart.html";
    });
  }
  const bundleCartBtn = document.getElementById("bundleCartBtn");
  if (bundleCartBtn) {
    bundleCartBtn.addEventListener("click", () => {
      KlenzoStore.addToCart("bundle-5-pack", 1);
      window.location.href = "cart.html";
    });
  }

  /* ---------- Cart / wishlist badges ---------- */
  KlenzoStore.updateCartBadge();
  KlenzoStore.updateWishBadge();

  /* ================= Shop page ================= */
  if (document.getElementById("shopProductGrid")) {
    /* ---------- Sidebar: Recent + Best Selling ---------- */
    const renderMiniList = (containerId, products) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = products
        .map(
          (p) => `
        <a class="mini-product" href="product.html?id=${p.id}">
          <span class="mini-thumb"><img src="${p.image}" alt="${p.name}" loading="lazy" /></span>
          <span class="mini-info">
            <h5>${p.name}</h5>
            <span>${klenzoFormatPrice(p.salePrice)}</span>
          </span>
        </a>`
        )
        .join("");
    };

    renderMiniList("recentProducts", KLENZO_PRODUCTS.slice(-4));
    renderMiniList("bestSellingProducts", KLENZO_PRODUCTS.filter((p) => p.bestseller));

    /* ---------- Product grid ---------- */
    const grid = document.getElementById("shopProductGrid");
    const resultsCount = document.getElementById("resultsCount");

    const priceInRange = (price, range) => {
      const [min, max] = range.split("-").map(Number);
      return price >= min && price <= max;
    };

    const getActiveRanges = () =>
      [...document.querySelectorAll('input[name="price"]:checked')].map((el) => el.value);

    const renderGrid = () => {
      const ranges = getActiveRanges();
      const filtered = ranges.length
        ? KLENZO_PRODUCTS.filter((p) => ranges.some((r) => priceInRange(p.salePrice, r)))
        : KLENZO_PRODUCTS;

      resultsCount.textContent = `Showing ${filtered.length} of ${KLENZO_PRODUCTS.length} products`;

      if (!filtered.length) {
        grid.innerHTML = `<div class="shop-empty">No products match this filter.</div>`;
        return;
      }

      grid.innerHTML = filtered
        .map((p) => {
          const wished = KlenzoStore.isWishlisted(p.id) ? "active" : "";
          return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-media">
            <a href="product.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}" loading="lazy" />
            </a>
            <button class="wish-btn ${wished}" aria-label="Add ${p.name} to wishlist" aria-pressed="${!!wished}"><i class="fa-${wished ? "solid" : "regular"} fa-heart"></i></button>
            <button class="quick-view-btn" data-id="${p.id}"><i class="fa-solid fa-eye"></i> Quick View</button>
          </div>
          <div class="product-info">
            <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <div class="price-row">
              <span class="price-regular">${klenzoFormatPrice(p.regularPrice)}</span>
              <span class="price-sale">${klenzoFormatPrice(p.salePrice)} <small>/ ${p.unit}</small></span>
            </div>
            <div class="product-actions">
              <button class="btn-cart" aria-label="Add ${p.name} to cart"><i class="fa-solid fa-cart-shopping"></i></button>
              <button class="btn-info">Add to Cart</button>
            </div>
          </div>
        </article>`;
        })
        .join("");

      bindCardEvents();
    };

    const bindCardEvents = () => {
      grid.querySelectorAll(".product-card").forEach((card) => {
        const id = card.dataset.id;
        const product = klenzoGetProduct(id);
        const title = product.name;

        const wishBtn = card.querySelector(".wish-btn");
        wishBtn.addEventListener("click", () => {
          const active = KlenzoStore.toggleWishlist(id);
          wishBtn.classList.toggle("active", active);
          wishBtn.querySelector("i").className = active ? "fa-solid fa-heart" : "fa-regular fa-heart";
          klenzoShowToast(active ? `❤️ ${title} added to wishlist` : `${title} removed from wishlist`);
        });

        const addCart = () => {
          KlenzoStore.addToCart(id, 1);
          window.location.href = "cart.html";
        };
        card.querySelector(".btn-cart").addEventListener("click", addCart);
        card.querySelector(".btn-info").addEventListener("click", addCart);

        card.querySelector(".quick-view-btn").addEventListener("click", () => openQuickView(id));
      });
    };

    document.querySelectorAll('input[name="price"]').forEach((el) => el.addEventListener("change", renderGrid));
    document.getElementById("resetFilters")?.addEventListener("click", () => {
      document.querySelectorAll('input[name="price"]').forEach((el) => (el.checked = false));
      renderGrid();
    });

    renderGrid();

    /* ---------- Quick view modal ---------- */
    const modal = document.getElementById("quickViewModal");
    const openQuickView = (id) => {
      const p = klenzoGetProduct(id);
      if (!p) return;
      document.getElementById("modalImg").src = p.image;
      document.getElementById("modalImg").alt = p.name;
      document.getElementById("modalTitle").textContent = p.name;
      document.getElementById("modalRegular").textContent = klenzoFormatPrice(p.regularPrice);
      document.getElementById("modalSale").textContent = `${klenzoFormatPrice(p.salePrice)} / ${p.unit}`;
      document.getElementById("modalDesc").textContent = p.shortDescription;
      document.getElementById("modalViewFull").href = `product.html?id=${p.id}`;
      document.getElementById("modalAddCart").onclick = () => {
        KlenzoStore.addToCart(p.id, 1);
        window.location.href = "cart.html";
      };
      modal.classList.add("show");
    };
    const closeQuickView = () => modal.classList.remove("show");
    document.getElementById("modalClose")?.addEventListener("click", closeQuickView);
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeQuickView();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeQuickView();
    });
  }

  /* ================= Single product page ================= */
  if (document.getElementById("pdMainImg")) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const product = klenzoGetProduct(productId) || KLENZO_PRODUCTS[0];

    document.title = `${product.name} — Klenzo`;
    document.getElementById("breadcrumbName").textContent = product.name;
    document.getElementById("pdCategory").textContent = product.category;
    document.getElementById("pdTitle").textContent = product.name;
    document.getElementById("pdShortDesc").textContent = product.shortDescription;
    document.getElementById("pdFullDesc").textContent = product.fullDescription;
    document.getElementById("pdRatingText").textContent = `${product.rating} (${product.reviewCount} reviews)`;
    document.getElementById("pdReviewCountTab").textContent = product.reviewCount;

    const fullStars = Math.round(product.rating);
    document.getElementById("pdStars").innerHTML = Array.from({ length: 5 }, (_, i) =>
      `<i class="fa-${i < fullStars ? "solid" : "regular"} fa-star"></i>`
    ).join("");

    /* Gallery */
    const mainImg = document.getElementById("pdMainImg");
    mainImg.src = product.image;
    mainImg.alt = product.name;
    const thumbsWrap = document.getElementById("pdThumbs");
    thumbsWrap.innerHTML = product.gallery
      .map(
        (src, i) =>
          `<button type="button" class="pd-thumb ${i === 0 ? "active" : ""}" data-src="${src}"><img src="${src}" alt="${product.name} view ${i + 1}" /></button>`
      )
      .join("");
    thumbsWrap.querySelectorAll(".pd-thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        mainImg.src = btn.dataset.src;
        thumbsWrap.querySelectorAll(".pd-thumb").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    /* Variation + price */
    let priceAdd = 0;
    const priceSaleEl = document.getElementById("pdPriceSale");
    const priceRegEl = document.getElementById("pdPriceRegular");
    const priceOffEl = document.getElementById("pdPriceOff");

    const renderPrice = () => {
      const sale = product.salePrice + priceAdd;
      const regular = product.regularPrice + priceAdd;
      priceSaleEl.textContent = `${klenzoFormatPrice(sale)} / ${product.unit}`;
      priceRegEl.textContent = klenzoFormatPrice(regular);
      const off = Math.round(((regular - sale) / regular) * 100);
      priceOffEl.textContent = off > 0 ? `${off}% OFF` : "";
    };

    document.getElementById("pdVariationLabel").textContent = product.variation.label;
    const variationWrap = document.getElementById("pdVariationOptions");
    variationWrap.innerHTML = product.variation.options
      .map(
        (opt, i) =>
          `<button type="button" class="pd-variation-opt ${i === 0 ? "active" : ""}" data-add="${opt.priceAdd}">${opt.label}</button>`
      )
      .join("");
    variationWrap.querySelectorAll(".pd-variation-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        variationWrap.querySelectorAll(".pd-variation-opt").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        priceAdd = Number(btn.dataset.add);
        renderPrice();
      });
    });
    renderPrice();

    /* Quantity stepper */
    let qty = 1;
    const qtyValue = document.getElementById("qtyValue");
    document.getElementById("qtyMinus").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      qtyValue.textContent = qty;
    });
    document.getElementById("qtyPlus").addEventListener("click", () => {
      qty = Math.min(20, qty + 1);
      qtyValue.textContent = qty;
    });

    /* Add to cart */
    document.getElementById("pdAddCart").addEventListener("click", () => {
      KlenzoStore.addToCart(product.id, qty);
      window.location.href = "cart.html";
    });

    /* Wishlist */
    const pdWishBtn = document.getElementById("pdWishBtn");
    const setWishState = (active) => {
      pdWishBtn.classList.toggle("active", active);
      pdWishBtn.setAttribute("aria-pressed", String(active));
      pdWishBtn.querySelector("i").className = active ? "fa-solid fa-heart" : "fa-regular fa-heart";
    };
    setWishState(KlenzoStore.isWishlisted(product.id));
    pdWishBtn.addEventListener("click", () => {
      const active = KlenzoStore.toggleWishlist(product.id);
      setWishState(active);
      klenzoShowToast(active ? `❤️ ${product.name} added to wishlist` : `${product.name} removed from wishlist`);
    });

    /* Tabs */
    document.querySelectorAll(".pd-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".pd-tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".pd-tab-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
      });
    });

    /* Reviews (persisted per-product in localStorage) */
    const reviewsKey = `klenzo_reviews_${product.id}`;
    const getExtraReviews = () => {
      try {
        return JSON.parse(localStorage.getItem(reviewsKey)) || [];
      } catch {
        return [];
      }
    };
    const reviewList = document.getElementById("reviewList");
    const renderReviews = () => {
      const all = [...product.reviews, ...getExtraReviews()];
      reviewList.innerHTML = all
        .map(
          (r) => `
        <div class="review-item">
          <div class="stars" aria-hidden="true">${Array.from({ length: 5 }, (_, i) => `<i class="fa-${i < r.rating ? "solid" : "regular"} fa-star"></i>`).join("")}</div>
          <h5>${r.name}</h5>
          <p>${r.text}</p>
        </div>`
        )
        .join("");
    };
    renderReviews();

    document.getElementById("reviewForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("reviewName").value.trim();
      const rating = Number(document.getElementById("reviewRating").value);
      const text = document.getElementById("reviewText").value.trim();
      if (!name || !text) return;

      const extra = getExtraReviews();
      extra.push({ name, rating, text });
      localStorage.setItem(reviewsKey, JSON.stringify(extra));
      renderReviews();
      e.target.reset();
      klenzoShowToast("✅ Thanks for your review!");
    });

    /* Related / recent products */
    const relatedGrid = document.getElementById("relatedGrid");
    const related = klenzoGetRelated(product.id, 5);
    relatedGrid.innerHTML = related
      .map(
        (p) => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media">
          <a href="product.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
          </a>
          <button class="wish-btn ${KlenzoStore.isWishlisted(p.id) ? "active" : ""}" aria-label="Add ${p.name} to wishlist"><i class="fa-${KlenzoStore.isWishlisted(p.id) ? "solid" : "regular"} fa-heart"></i></button>
        </div>
        <div class="product-info">
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="price-row">
            <span class="price-regular">${klenzoFormatPrice(p.regularPrice)}</span>
            <span class="price-sale">${klenzoFormatPrice(p.salePrice)} <small>/ ${p.unit}</small></span>
          </div>
          <div class="product-actions">
            <button class="btn-cart" aria-label="Add ${p.name} to cart"><i class="fa-solid fa-cart-shopping"></i></button>
            <button class="btn-info">Add to Cart</button>
          </div>
        </div>
      </article>`
      )
      .join("");

    relatedGrid.querySelectorAll(".product-card").forEach((card) => {
      const id = card.dataset.id;
      const p = klenzoGetProduct(id);
      const wb = card.querySelector(".wish-btn");
      wb.addEventListener("click", () => {
        const active = KlenzoStore.toggleWishlist(id);
        wb.classList.toggle("active", active);
        wb.querySelector("i").className = active ? "fa-solid fa-heart" : "fa-regular fa-heart";
        klenzoShowToast(active ? `❤️ ${p.name} added to wishlist` : `${p.name} removed from wishlist`);
      });
      const addCart = () => {
        KlenzoStore.addToCart(id, 1);
        window.location.href = "cart.html";
      };
      card.querySelector(".btn-cart").addEventListener("click", addCart);
      card.querySelector(".btn-info").addEventListener("click", addCart);
    });
  }

  /* ================= Cart page ================= */
  const cartContainer = document.getElementById("cartContainer");
  if (cartContainer) {
    const FREE_SHIPPING_THRESHOLD = 399;
    const SHIPPING_FEE = 49;

    const subtitle = document.getElementById("cartSubtitle");

    const getLines = () =>
      KlenzoStore.getCart()
        .map((item) => ({ product: klenzoGetProduct(item.id), qty: item.qty }))
        .filter((line) => line.product);

    const renderEmpty = () => {
      subtitle.textContent = "Your cart is empty.";
      cartContainer.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Explore our plant-based cleaning essentials and find your favourites.</p>
          <a href="shop.html" class="btn btn-primary btn-lg"><i class="fa-solid fa-bag-shopping"></i> Continue Shopping</a>
        </div>`;
    };

    const render = () => {
      const lines = getLines();

      if (!lines.length) {
        renderEmpty();
        return;
      }

      const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
      subtitle.textContent = `${itemCount} item${itemCount > 1 ? "s" : ""} in your cart.`;

      const subtotal = lines.reduce((sum, l) => sum + l.product.salePrice * l.qty, 0);
      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      const total = subtotal + shipping;

      const itemsHtml = lines
        .map(
          (l) => `
        <div class="cart-item" data-id="${l.product.id}">
          <a class="cart-item-thumb" href="product.html?id=${l.product.id}">
            <img src="${l.product.image}" alt="${l.product.name}" />
          </a>
          <div class="cart-item-info">
            <h3><a href="product.html?id=${l.product.id}">${l.product.name}</a></h3>
            <span>${l.product.unit}</span>
          </div>
          <div class="cart-item-price">${klenzoFormatPrice(l.product.salePrice)}</div>
          <div class="cart-item-qty">
            <div class="qty-stepper">
              <button type="button" class="qty-minus" aria-label="Decrease quantity">−</button>
              <span>${l.qty}</span>
              <button type="button" class="qty-plus" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="cart-item-total">${klenzoFormatPrice(l.product.salePrice * l.qty)}</div>
          <button class="cart-item-remove" aria-label="Remove ${l.product.name} from cart"><i class="fa-solid fa-trash-can"></i></button>
        </div>`
        )
        .join("");

      cartContainer.innerHTML = `
        <div class="cart-layout">
          <div class="cart-items">
            <div class="cart-items-head">
              <h2>Cart Items</h2>
              <button class="clear-cart-btn" id="clearCartBtn">Clear cart</button>
            </div>
            ${itemsHtml}
          </div>

          <aside class="cart-summary">
            <div class="cart-summary-head"><h3>Order Summary</h3></div>
            <div class="cart-summary-body">
              <div class="summary-row"><span>Subtotal</span><span>${klenzoFormatPrice(subtotal)}</span></div>
              <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? `<span class="free-tag">FREE</span>` : klenzoFormatPrice(shipping)}</span></div>
              <div class="summary-row total"><span>Total</span><span>${klenzoFormatPrice(total)}</span></div>

              <div class="promo-row">
                <input type="text" placeholder="Promo code" id="promoInput" />
                <button type="button" id="promoApply">Apply</button>
              </div>

              <button class="btn btn-primary btn-lg" id="checkoutBtn"><i class="fa-solid fa-lock"></i> Proceed to Checkout</button>
              <a href="shop.html" class="continue-link">Continue Shopping</a>

              <div class="cart-trust">
                <span><i class="fa-solid fa-shield-halved"></i> 30-day money-back guarantee</span>
                <span><i class="fa-solid fa-truck-fast"></i> Free delivery on orders above ₹399</span>
                <span><i class="fa-solid fa-lock"></i> Secure checkout</span>
              </div>
            </div>
          </aside>
        </div>

        <div class="cart-recommend">
          <div class="section-head" style="text-align:left; margin-bottom: 24px;">
            <span class="eyebrow"><span class="eyebrow-dot"></span> You Might Also Like</span>
            <h2 class="section-title" style="font-size: clamp(1.3rem, 3vw, 1.7rem);">Complete Your Routine</h2>
          </div>
          <div class="pd-related-grid" id="cartRecommendGrid"></div>
        </div>
      `;

      bindItemEvents();
      renderRecommendations(lines.map((l) => l.product.id));

      document.getElementById("clearCartBtn").addEventListener("click", () => {
        KlenzoStore.clearCart();
        render();
        klenzoShowToast("Cart cleared");
      });

      document.getElementById("checkoutBtn").addEventListener("click", () => {
        klenzoShowToast("🛍️ Checkout is coming soon — thanks for shopping with Klenzo!");
      });

      document.getElementById("promoApply").addEventListener("click", () => {
        const code = document.getElementById("promoInput").value.trim();
        klenzoShowToast(code ? `Promo code "${code}" is not valid right now` : "Enter a promo code first");
      });
    };

    const bindItemEvents = () => {
      cartContainer.querySelectorAll(".cart-item").forEach((row) => {
        const id = row.dataset.id;
        const line = getLines().find((l) => l.product.id === id);
        if (!line) return;

        row.querySelector(".qty-minus").addEventListener("click", () => {
          KlenzoStore.setCartQty(id, line.qty - 1);
          render();
        });
        row.querySelector(".qty-plus").addEventListener("click", () => {
          KlenzoStore.setCartQty(id, Math.min(20, line.qty + 1));
          render();
        });
        row.querySelector(".cart-item-remove").addEventListener("click", () => {
          row.classList.add("removing");
          setTimeout(() => {
            KlenzoStore.removeFromCart(id);
            render();
            klenzoShowToast(`${line.product.name} removed from cart`);
          }, 300);
        });
      });
    };

    const renderRecommendations = (excludeIds) => {
      const grid = document.getElementById("cartRecommendGrid");
      if (!grid) return;
      const picks = KLENZO_PRODUCTS.filter((p) => !excludeIds.includes(p.id)).slice(0, 4);
      grid.innerHTML = picks
        .map(
          (p) => `
        <article class="product-card" data-id="${p.id}">
          <div class="product-media">
            <a href="product.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}" loading="lazy" />
            </a>
          </div>
          <div class="product-info">
            <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <div class="price-row">
              <span class="price-regular">${klenzoFormatPrice(p.regularPrice)}</span>
              <span class="price-sale">${klenzoFormatPrice(p.salePrice)}</span>
            </div>
            <div class="product-actions">
              <button class="btn-cart" aria-label="Add ${p.name} to cart"><i class="fa-solid fa-cart-shopping"></i></button>
              <button class="btn-info">Add to Cart</button>
            </div>
          </div>
        </article>`
        )
        .join("");

      grid.querySelectorAll(".product-card").forEach((card) => {
        const id = card.dataset.id;
        const addCart = () => {
          KlenzoStore.addToCart(id, 1);
          render();
          klenzoShowToast(`🛒 ${klenzoGetProduct(id).name} added to cart`);
        };
        card.querySelector(".btn-cart").addEventListener("click", addCart);
        card.querySelector(".btn-info").addEventListener("click", addCart);
      });
    };

    render();
  }

  /* ================= Contact page ================= */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const name = document.getElementById("ctName").value.trim();
      klenzoShowToast(`✅ Thanks ${name.split(" ")[0]}, we'll get back to you soon!`, 2600);
      contactForm.reset();
    });
  }

  /* ================= Newsletter form (blog page) ================= */
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      klenzoShowToast("✅ Subscribed! Watch your inbox for our next post.", 2400);
      newsletterForm.reset();
    });
  }

  /* ================= Career page: renders KLENZO_JOBS into #jobList ================= */
  const jobList = document.getElementById("jobList");
  if (jobList) {
    if (!KLENZO_JOBS.length) {
      jobList.innerHTML = `
        <div class="jobs-empty reveal">
          <div class="jobs-empty-icon"><i class="fa-solid fa-briefcase"></i></div>
          <h3>No open positions right now</h3>
          <p>We're a small, fast-growing team and don't have any roles open at the moment.
            New openings land here first — check back soon, or send us your resume and
            we'll keep you in mind for what's next.</p>
          <a class="btn btn-primary btn-lg" href="mailto:careers@klenzo.in?subject=Resume%20on%20file">
            <i class="fa-solid fa-paper-plane"></i> Email Your Resume
          </a>
        </div>`;
      klenzoObserveReveals(jobList);
    } else {
      jobList.innerHTML = KLENZO_JOBS.map(
        (job, i) => `
        <article class="job-card reveal delay-${(i % 4) + 1}">
          <div class="job-card-main">
            <h3>${job.title}</h3>
            <div class="job-meta">
              <span><i class="fa-solid fa-diagram-project"></i> ${job.department}</span>
              <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
              <span class="job-type">${job.type}</span>
            </div>
            <p>${job.description}</p>
          </div>
          <a class="btn btn-ghost btn-lg job-apply" href="mailto:careers@klenzo.in?subject=Application%20—%20${encodeURIComponent(job.title)}">
            Apply Now <i class="fa-solid fa-arrow-right"></i>
          </a>
        </article>`
      ).join("");
      klenzoObserveReveals(jobList);
    }
  }
});
