/* ==========================================================================
   Bereket Juice & Salad — main script
   Menu (filter + search) · cart (localStorage) · EN/አማርኛ · order form
   ========================================================================== */

/* --------------------------------------------------------------------------
   FORM ENDPOINT
   Create a form at https://formspree.io for alazarsisay145@gmail.com and
   replace YOUR_FORM_ID with the real form ID (e.g. "https://formspree.io/f/abcdwxyz").
   -------------------------------------------------------------------------- */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

/* --------------------------------------------------------------------------
   MENU_ITEMS — the whole menu lives in this one array.

   HOW TO ADD A MENU ITEM
   1. Save the photo in  assets/img/menu/  (e.g. assets/img/menu/papaya-juice.jpg).
      A roughly 4:3 landscape photo, ~800px wide, works best.
   2. Append ONE object to the array below:

        {
          id: "papaya-juice",                    // unique, lowercase, no spaces
          name: "Papaya Juice",
          description: "Fresh papaya with a squeeze of lime.",
          price: 120,                            // in ETB, numbers only
          category: "juices",                    // juices | smoothies | salads | combos | specials
          image: "assets/img/menu/papaya-juice.jpg"
        },

   That's it — no other code changes needed. Leave `image: ""` if there is no
   photo yet; a branded Bereket placeholder tile is shown instead.
   -------------------------------------------------------------------------- */
const MENU_ITEMS = [
  {
    id: "avocado-juice",
    name: "Avocado Juice",
    description: "Thick, creamy avocado blended fresh to order.",
    price: 130,
    category: "juices",
    image: ""
  },
  {
    id: "mango-juice",
    name: "Mango Juice",
    description: "Ripe, sweet mango — nothing added, nothing removed.",
    price: 140,
    category: "juices",
    image: ""
  },
  {
    id: "layered-mixed-juice",
    name: "Layered Mixed Juice",
    description: "Our signature layers of mango, avocado and strawberry in one glass.",
    price: 185,
    category: "specials",
    image: ""
  },
  {
    id: "fresh-fruit-salad",
    name: "Fresh Fruit Salad",
    description: "Watermelon, mango, avocado and pineapple, cut fresh.",
    price: 200,
    category: "salads",
    image: ""
  }
  // ↑ Add new items above this line (remember the comma after the previous item).
];

(function () {
  "use strict";

  const CURRENCY = "ETB";
  const CART_KEY = "bereketCart";
  const LANG_KEY = "bereketLang";
  const LOGO_SRC = "assets/img/logo.png";

  /* ------------------------------------------------------------------
     Translations (EN / አማርኛ)
  ------------------------------------------------------------------ */
  const I18N = {
    en: {
      "skip": "Skip to main content",
      "brand.tagline": "Juice & Salad",
      "nav.menu": "Menu",
      "nav.space": "Our Space",
      "nav.why": "Why Bereket",
      "nav.contact": "Visit Us",
      "nav.open": "Open navigation",
      "nav.close": "Close navigation",
      "lang.switch": "Switch language to Amharic",
      "cta.order": "Order Now",
      "cta.viewMenu": "View Menu",
      "hero.eyebrow": "Fresh every day · Hawassa",
      "hero.tagline": "Juice & Salad",
      "hero.text": "Fresh juices, smoothies and fruit salads — pressed, blended and cut to order from real fruit.",
      "menu.label": "Our Menu",
      "menu.title": "Fresh from the fruit to your glass.",
      "menu.text": "Every drink and salad is made when you order it.",
      "menu.searchLabel": "Search the menu",
      "menu.searchPlaceholder": "Search the menu…",
      "menu.filterLabel": "Filter menu by category",
      "menu.add": "+ Add to order",
      "menu.emptyTitle": "Nothing here yet.",
      "menu.emptyText": "New items are coming soon — try another category or search.",
      "menu.count": "{n} menu items shown",
      "menu.photoSoon": "Photo coming soon",
      "cat.all": "All",
      "cat.juices": "Juices",
      "cat.smoothies": "Smoothies",
      "cat.salads": "Salads",
      "cat.combos": "Combos",
      "cat.specials": "Specials",
      "space.label": "Our Space",
      "space.title": "A bright, clean place to slow down.",
      "space.text1": "Warm wood benches, cool marble and a living green ivy wall — our shop is made for catching up with friends, a quick healthy break or a relaxed afternoon.",
      "space.text2": "Sit in and watch your juice being made, or grab it to go.",
      "space.cta": "Plan your visit",
      "why.label": "Why Bereket",
      "why.title": "Simple, honest and fresh.",
      "why.fresh.title": "Fresh fruit",
      "why.fresh.text": "Ripe, seasonal fruit bought fresh and prepared every day.",
      "why.sugar.title": "No added sugar",
      "why.sugar.text": "Just the natural sweetness of the fruit — nothing artificial.",
      "why.made.title": "Made to order",
      "why.made.text": "Your juice, smoothie or salad is made the moment you order it.",
      "why.clean.title": "Clean space",
      "why.clean.text": "A spotless kitchen and a comfortable, welcoming shop.",
      "contact.label": "Visit Us",
      "contact.title": "Come by or send us your order.",
      "contact.infoTitle": "Bereket Juice & Salad",
      "contact.address": "Address",
      "contact.phone": "Phone",
      "contact.email": "Email",
      "contact.hours": "Hours",
      "contact.hoursValue": "Every day, 7:00 AM – 10:00 PM",
      "contact.mapText": "Find us in Hawassa",
      "contact.mapLink": "Open in Google Maps",
      "form.title": "Contact / Order enquiry",
      "form.intro": "Send us a message or an order for dine-in, takeaway or delivery and we'll get back to you.",
      "form.name": "Full name",
      "form.email": "Email",
      "form.phone": "Phone",
      "form.orderType": "Order type",
      "form.choose": "Choose…",
      "form.dineIn": "Dine-in",
      "form.takeaway": "Takeaway",
      "form.delivery": "Delivery",
      "form.message": "Message / order details",
      "form.submit": "Send enquiry",
      "form.sending": "Sending…",
      "form.success": "Thank you! Your message has been sent — we'll get back to you soon.",
      "form.error": "Sorry, something went wrong. Please try again or call us.",
      "form.notConfigured": "Online enquiries are not connected yet — please call or email us directly.",
      "form.fixErrors": "Please fix the highlighted fields.",
      "err.name": "Please enter your name.",
      "err.email": "Please enter a valid email address.",
      "err.phone": "Please enter a valid phone number.",
      "err.orderType": "Please choose an order type.",
      "err.message": "Please add a message or your order details.",
      "footer.text": "Fresh juices, smoothies and fruit salads, made to order in Hawassa.",
      "footer.explore": "Explore",
      "footer.contact": "Contact",
      "footer.rights": "All rights reserved.",
      "cart.title": "Your Order",
      "cart.open": "Open your order ({n} items)",
      "cart.close": "Close your order",
      "cart.total": "Total",
      "cart.checkout": "Continue to order form",
      "cart.clear": "Clear order",
      "cart.empty": "Your order is empty.",
      "cart.emptyHint": "Add something fresh from the menu.",
      "cart.decrease": "Remove one {name}",
      "cart.increase": "Add one more {name}",
      "cart.orderIntro": "I'd like to order:",
      "cart.added": "{name} added to your order."
    },
    am: {
      "skip": "ወደ ዋናው ይዘት ይሂዱ",
      "brand.tagline": "ጁስ እና ሰላጣ",
      "nav.menu": "ምናሌ",
      "nav.space": "ቦታችን",
      "nav.why": "ለምን በረከት",
      "nav.contact": "ይጎብኙን",
      "nav.open": "ማውጫውን ክፈት",
      "nav.close": "ማውጫውን ዝጋ",
      "lang.switch": "ቋንቋውን ወደ እንግሊዝኛ ቀይር",
      "cta.order": "አሁን ይዘዙ",
      "cta.viewMenu": "ምናሌውን ይመልከቱ",
      "hero.eyebrow": "በየቀኑ ትኩስ · ሀዋሳ",
      "hero.tagline": "ጁስ እና ሰላጣ",
      "hero.text": "ትኩስ ጁሶች፣ ስሞዚዎች እና የፍራፍሬ ሰላጣዎች — ከእውነተኛ ፍራፍሬ በትዕዛዝዎ የሚዘጋጁ።",
      "menu.label": "ምናሌያችን",
      "menu.title": "ከፍራፍሬው በቀጥታ ወደ ብርጭቆዎ።",
      "menu.text": "እያንዳንዱ መጠጥና ሰላጣ በሚያዙበት ጊዜ ይዘጋጃል።",
      "menu.searchLabel": "ምናሌውን ይፈልጉ",
      "menu.searchPlaceholder": "ምናሌውን ይፈልጉ…",
      "menu.filterLabel": "ምናሌውን በምድብ አጣራ",
      "menu.add": "+ ወደ ትዕዛዝ ጨምር",
      "menu.emptyTitle": "እስካሁን ምንም የለም።",
      "menu.emptyText": "አዳዲስ ምግቦች በቅርቡ ይመጣሉ — ሌላ ምድብ ወይም ፍለጋ ይሞክሩ።",
      "menu.count": "{n} የምናሌ ዝርዝሮች ታይተዋል",
      "menu.photoSoon": "ፎቶ በቅርቡ",
      "cat.all": "ሁሉም",
      "cat.juices": "ጁሶች",
      "cat.smoothies": "ስሞዚዎች",
      "cat.salads": "ሰላጣዎች",
      "cat.combos": "ጥምሮች",
      "cat.specials": "ልዩ",
      "space.label": "ቦታችን",
      "space.title": "ንጹህና ብሩህ የእረፍት ቦታ።",
      "space.text1": "ሞቃታማ የእንጨት መቀመጫዎች፣ ቀዝቃዛ እብነበረድ እና ሕያው አረንጓዴ ግድግዳ — ከጓደኞች ጋር ለመገናኘት፣ ለጤናማ እረፍት ወይም ለተረጋጋ ከሰዓት የተዘጋጀ።",
      "space.text2": "ተቀምጠው ጁስዎ ሲዘጋጅ ይመልከቱ፣ ወይም ይዘው ይሂዱ።",
      "space.cta": "ጉብኝትዎን ያቅዱ",
      "why.label": "ለምን በረከት",
      "why.title": "ቀላል፣ ታማኝ እና ትኩስ።",
      "why.fresh.title": "ትኩስ ፍራፍሬ",
      "why.fresh.text": "የበሰለ ወቅታዊ ፍራፍሬ በየቀኑ ተገዝቶ ይዘጋጃል።",
      "why.sugar.title": "ስኳር አልተጨመረም",
      "why.sugar.text": "የፍራፍሬው ተፈጥሯዊ ጣፋጭነት ብቻ — ምንም ሰው ሰራሽ ነገር የለም።",
      "why.made.title": "በትዕዛዝ የሚዘጋጅ",
      "why.made.text": "ጁስዎ፣ ስሞዚዎ ወይም ሰላጣዎ ባዘዙበት ቅጽበት ይዘጋጃል።",
      "why.clean.title": "ንጹህ ቦታ",
      "why.clean.text": "ንጹህ ማዕድ ቤት እና ምቹ፣ እንግዳ ተቀባይ ሱቅ።",
      "contact.label": "ይጎብኙን",
      "contact.title": "ይምጡ ወይም ትዕዛዝዎን ይላኩልን።",
      "contact.infoTitle": "በረከት ጁስ እና ሰላጣ",
      "contact.address": "አድራሻ",
      "contact.phone": "ስልክ",
      "contact.email": "ኢሜይል",
      "contact.hours": "የሥራ ሰዓት",
      "contact.hoursValue": "በየቀኑ፣ ከጠዋቱ 1:00 – ምሽት 4:00",
      "contact.mapText": "በሀዋሳ ያገኙናል",
      "contact.mapLink": "በጎግል ካርታ ይክፈቱ",
      "form.title": "መልእክት / የትዕዛዝ ጥያቄ",
      "form.intro": "ለመመገቢያ፣ ይዞ ለመሄድ ወይም ለማድረስ መልእክት ወይም ትዕዛዝ ይላኩልን፣ በቅርቡ እንመልስልዎታለን።",
      "form.name": "ሙሉ ስም",
      "form.email": "ኢሜይል",
      "form.phone": "ስልክ",
      "form.orderType": "የትዕዛዝ አይነት",
      "form.choose": "ይምረጡ…",
      "form.dineIn": "እዚሁ መመገብ",
      "form.takeaway": "ይዞ መሄድ",
      "form.delivery": "ማድረስ",
      "form.message": "መልእክት / የትዕዛዝ ዝርዝር",
      "form.submit": "ላክ",
      "form.sending": "በመላክ ላይ…",
      "form.success": "እናመሰግናለን! መልእክትዎ ተልኳል — በቅርቡ እንመልስልዎታለን።",
      "form.error": "ይቅርታ፣ ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ ወይም ይደውሉልን።",
      "form.notConfigured": "የመስመር ላይ ቅጹ ገና አልተገናኘም — እባክዎ በቀጥታ ይደውሉ ወይም ኢሜይል ያድርጉ።",
      "form.fixErrors": "እባክዎ የተመለከቱትን መስኮች ያስተካክሉ።",
      "err.name": "እባክዎ ስምዎን ያስገቡ።",
      "err.email": "እባክዎ ትክክለኛ ኢሜይል ያስገቡ።",
      "err.phone": "እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ።",
      "err.orderType": "እባክዎ የትዕዛዝ አይነት ይምረጡ።",
      "err.message": "እባክዎ መልእክት ወይም የትዕዛዝ ዝርዝር ያስገቡ።",
      "footer.text": "ትኩስ ጁሶች፣ ስሞዚዎች እና የፍራፍሬ ሰላጣዎች — በሀዋሳ በትዕዛዝ የሚዘጋጁ።",
      "footer.explore": "ያስሱ",
      "footer.contact": "አድራሻ",
      "footer.rights": "መብቱ በሕግ የተጠበቀ ነው።",
      "cart.title": "ትዕዛዝዎ",
      "cart.open": "ትዕዛዝዎን ክፈት ({n} እቃዎች)",
      "cart.close": "ትዕዛዝዎን ዝጋ",
      "cart.total": "ድምር",
      "cart.checkout": "ወደ ትዕዛዝ ቅጹ ይቀጥሉ",
      "cart.clear": "ትዕዛዙን አጽዳ",
      "cart.empty": "ትዕዛዝዎ ባዶ ነው።",
      "cart.emptyHint": "ከምናሌው ትኩስ ነገር ይጨምሩ።",
      "cart.decrease": "አንድ {name} ቀንስ",
      "cart.increase": "አንድ ተጨማሪ {name} ጨምር",
      "cart.orderIntro": "ማዘዝ የምፈልገው:",
      "cart.added": "{name} ወደ ትዕዛዝዎ ተጨምሯል።"
    }
  };

  let lang = readStorage(LANG_KEY) === "am" ? "am" : "en";

  function t(key, vars) {
    let str = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach((k) => { str = str.split("{" + k + "}").join(String(vars[k])); });
    }
    return str;
  }

  /* ------------------------------------------------------------------
     Safe localStorage helpers (private mode / disabled storage)
  ------------------------------------------------------------------ */
  function readStorage(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStorage(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const formatPrice = (n) => CURRENCY + " " + Number(n).toLocaleString("en-US");
  const findItem = (id) => MENU_ITEMS.find((item) => item.id === id);

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "className") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach((c) => c && node.appendChild(c));
    return node;
  }

  /* Branded placeholder tile: Bereket logo on the black/gold gradient */
  function placeholderTile() {
    return el("div", { className: "menu-placeholder", role: "img", "aria-label": t("menu.photoSoon") }, [
      el("img", { src: LOGO_SRC, alt: "", width: "512", height: "512", loading: "lazy", decoding: "async" })
    ]);
  }

  /* Item photo, falling back to the placeholder if the file is missing */
  function itemImage(item, width, height) {
    if (!item.image) return placeholderTile();
    const img = el("img", {
      src: item.image,
      alt: item.name,
      width: String(width),
      height: String(height),
      loading: "lazy",
      decoding: "async"
    });
    img.addEventListener("error", () => img.replaceWith(placeholderTile()), { once: true });
    return img;
  }

  /* ------------------------------------------------------------------
     Menu: render, category filter, debounced search
  ------------------------------------------------------------------ */
  const menuGrid = $("#menuGrid");
  const menuSearch = $("#menuSearch");
  const menuStatus = $("#menuStatus");
  let activeCategory = "all";

  function renderMenu() {
    if (!menuGrid) return;
    const query = (menuSearch ? menuSearch.value : "").toLowerCase().trim();
    const filtered = MENU_ITEMS.filter((item) => {
      const inCategory = activeCategory === "all" || item.category === activeCategory;
      const text = (item.name + " " + item.description).toLowerCase();
      return inCategory && (!query || text.includes(query));
    });

    menuGrid.textContent = "";

    if (!filtered.length) {
      menuGrid.appendChild(el("div", { className: "menu-empty glass" }, [
        el("strong", { text: t("menu.emptyTitle") }),
        el("span", { text: t("menu.emptyText") })
      ]));
    } else {
      const frag = document.createDocumentFragment();
      filtered.forEach((item) => {
        frag.appendChild(el("article", { className: "menu-item glass" }, [
          el("div", { className: "menu-image" }, [itemImage(item, 800, 600)]),
          el("div", { className: "menu-body" }, [
            el("span", { className: "menu-tag", text: t("cat." + item.category) }),
            el("div", { className: "menu-top" }, [
              el("h3", { text: item.name }),
              el("span", { className: "menu-price", text: formatPrice(item.price) })
            ]),
            el("p", { text: item.description }),
            el("button", { type: "button", className: "add-btn", "data-id": item.id }, [
              document.createTextNode(t("menu.add")),
              el("span", { className: "visually-hidden", text: ": " + item.name })
            ])
          ])
        ]));
      });
      menuGrid.appendChild(frag);
    }

    if (menuStatus) menuStatus.textContent = t("menu.count", { n: filtered.length });
  }

  function debounce(fn, wait) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, wait);
    };
  }

  $$(".category-btn").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".category-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      activeCategory = button.dataset.category;
      renderMenu();
    });
  });

  if (menuSearch) menuSearch.addEventListener("input", debounce(renderMenu, 200));

  if (menuGrid) {
    menuGrid.addEventListener("click", (event) => {
      const btn = event.target.closest(".add-btn");
      if (btn) addToCart(btn.dataset.id);
    });
  }

  /* ------------------------------------------------------------------
     Cart (persisted in localStorage as [{ id, qty }])
  ------------------------------------------------------------------ */
  const cartPanel = $("#cartPanel");
  const cartBackdrop = $("#cartBackdrop");
  const cartItemsEl = $("#cartItems");
  const cartCount = $("#cartCount");
  const cartTotal = $("#cartTotal");
  const cartButton = $("#cartButton");
  let lastFocused = null;

  function loadCart() {
    try {
      const raw = JSON.parse(readStorage(CART_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw
        .filter((line) => line && findItem(line.id) && Number.isInteger(line.qty) && line.qty > 0)
        .map((line) => ({ id: line.id, qty: Math.min(line.qty, 99) }));
    } catch (e) {
      return [];
    }
  }

  let cart = loadCart();

  function saveCart() { writeStorage(CART_KEY, JSON.stringify(cart)); }

  function cartQuantity() { return cart.reduce((sum, line) => sum + line.qty, 0); }
  function cartSum() { return cart.reduce((sum, line) => sum + findItem(line.id).price * line.qty, 0); }

  function addToCart(id) {
    const item = findItem(id);
    if (!item) return;
    const line = cart.find((l) => l.id === id);
    if (line) line.qty = Math.min(line.qty + 1, 99);
    else cart.push({ id: id, qty: 1 });
    saveCart();
    renderCart();
    if (menuStatus) menuStatus.textContent = t("cart.added", { name: item.name });
  }

  function changeQuantity(id, delta) {
    const line = cart.find((l) => l.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter((l) => l.id !== id);
    if (line.qty > 99) line.qty = 99;
    saveCart();
    renderCart();
  }

  function renderCart() {
    const count = cartQuantity();
    if (cartCount) cartCount.textContent = String(count);
    if (cartButton) cartButton.setAttribute("aria-label", t("cart.open", { n: count }));
    if (!cartItemsEl) return;

    cartItemsEl.textContent = "";
    if (!cart.length) {
      cartItemsEl.appendChild(el("div", { className: "cart-empty" }, [
        el("p", { text: t("cart.empty") }),
        el("small", { text: t("cart.emptyHint") })
      ]));
    } else {
      cart.forEach((line) => {
        const item = findItem(line.id);
        cartItemsEl.appendChild(el("div", { className: "cart-item" }, [
          el("div", { className: "cart-thumb" }, [itemImage(item, 56, 56)]),
          el("div", { className: "cart-item-info" }, [
            el("strong", { text: item.name }),
            el("small", { text: formatPrice(item.price) })
          ]),
          el("div", { className: "quantity" }, [
            el("button", { type: "button", "data-id": item.id, "data-delta": "-1", "aria-label": t("cart.decrease", { name: item.name }), text: "−" }),
            el("span", { text: String(line.qty) }),
            el("button", { type: "button", "data-id": item.id, "data-delta": "1", "aria-label": t("cart.increase", { name: item.name }), text: "+" })
          ])
        ]));
      });
    }
    if (cartTotal) cartTotal.textContent = formatPrice(cartSum());
  }

  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-delta]");
      if (btn) changeQuantity(btn.dataset.id, Number(btn.dataset.delta));
    });
  }

  /* --- dialog open/close with focus trap --- */
  function focusableIn(root) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', root)
      .filter((node) => node.offsetParent !== null);
  }

  function openCart() {
    if (!cartPanel) return;
    lastFocused = document.activeElement;
    cartPanel.hidden = false;
    if (cartBackdrop) cartBackdrop.hidden = false;
    document.body.classList.add("no-scroll");
    const first = focusableIn(cartPanel)[0];
    if (first) first.focus();
  }

  function closeCart(restoreFocus) {
    if (!cartPanel || cartPanel.hidden) return;
    cartPanel.hidden = true;
    if (cartBackdrop) cartBackdrop.hidden = true;
    document.body.classList.remove("no-scroll");
    if (restoreFocus !== false && lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (cartButton) cartButton.addEventListener("click", openCart);
  const closeCartBtn = $("#closeCart");
  if (closeCartBtn) closeCartBtn.addEventListener("click", () => closeCart());
  if (cartBackdrop) cartBackdrop.addEventListener("click", () => closeCart());

  document.addEventListener("keydown", (event) => {
    if (!cartPanel || cartPanel.hidden) {
      if (event.key === "Escape") closeNav(true);
      return;
    }
    if (event.key === "Escape") {
      closeCart();
    } else if (event.key === "Tab") {
      const nodes = focusableIn(cartPanel);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!cartPanel.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const clearBtn = $("#clearCart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      cart = [];
      saveCart();
      renderCart();
    });
  }

  /* Checkout: copy the cart into the order form's message and jump to it */
  const checkoutBtn = $("#checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const message = $("#message");
      if (message && cart.length) {
        const lines = cart.map((line) => {
          const item = findItem(line.id);
          return line.qty + " × " + item.name + " — " + formatPrice(item.price * line.qty);
        });
        message.value = t("cart.orderIntro") + "\n" + lines.join("\n") + "\n" + t("cart.total") + ": " + formatPrice(cartSum());
      }
      closeCart(false);
      const order = $("#order");
      if (order) order.scrollIntoView({ block: "start" });
      const nameInput = $("#name");
      if (nameInput) nameInput.focus({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------------------
     Mobile navigation
  ------------------------------------------------------------------ */
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");

  function closeNav(restoreFocus) {
    if (!navLinks || !navLinks.classList.contains("open")) return;
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", t("nav.open"));
    if (restoreFocus) menuToggle.focus();
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
    });
    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav(false);
    });
  }

  /* ------------------------------------------------------------------
     Language toggle (EN / አማርኛ)
  ------------------------------------------------------------------ */
  const langBtn = $("#languageBtn");

  function applyLanguage() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $$("[data-i18n-placeholder]").forEach((node) => { node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder)); });
    $$("[data-i18n-aria-label]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel)); });
    if (langBtn) {
      langBtn.textContent = lang === "en" ? "አማ" : "EN";
      langBtn.setAttribute("aria-label", langBtn.textContent + " — " + t("lang.switch"));
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-label", t(menuToggle.getAttribute("aria-expanded") === "true" ? "nav.close" : "nav.open"));
    }
    renderMenu();
    renderCart();
  }

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      lang = lang === "en" ? "am" : "en";
      writeStorage(LANG_KEY, lang);
      applyLanguage();
    });
  }

  /* ------------------------------------------------------------------
     Email obfuscation — build the mailto: link at runtime
  ------------------------------------------------------------------ */
  $$(".js-email").forEach((link) => {
    const address = link.dataset.user + "@" + link.dataset.domain;
    link.href = "mailto:" + address;
    link.textContent = address;
  });

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     Contact / Order enquiry form → Formspree (fetch, stays on page)
  ------------------------------------------------------------------ */
  const form = $("#orderForm");
  const formStatus = $("#formStatus");
  const submitBtn = $("#submitBtn");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const RULES = {
    name: (v) => v.trim().length >= 2,
    email: (v) => EMAIL_RE.test(v.trim()),
    phone: (v) => /^[+0-9 ()-]{7,20}$/.test(v.trim()),
    orderType: (v) => v !== "",
    message: (v) => v.trim().length >= 2
  };

  function setFieldError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + "-error");
    if (!input) return;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    if (error) error.textContent = message || "";
  }

  function validateField(id) {
    const input = document.getElementById(id);
    const ok = RULES[id](input.value);
    setFieldError(id, ok ? "" : t("err." + id));
    return ok;
  }

  function setStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = "form-status" + (type ? " " + type : "");
  }

  if (form) {
    form.action = FORMSPREE_ENDPOINT;

    Object.keys(RULES).forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener("blur", () => { if (input.value) validateField(id); });
      input.addEventListener("input", () => { if (input.getAttribute("aria-invalid") === "true") validateField(id); });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const invalid = Object.keys(RULES).filter((id) => !validateField(id));
      if (invalid.length) {
        setStatus(t("form.fixErrors"), "error");
        document.getElementById(invalid[0]).focus();
        return;
      }

      if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
        setStatus(t("form.notConfigured"), "error");
        return;
      }

      $("#replyTo").value = $("#email").value.trim();
      submitBtn.disabled = true;
      submitBtn.textContent = t("form.sending");
      setStatus("", "");

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (response.ok) {
          form.reset();
          setStatus(t("form.success"), "success");
        } else {
          let message = t("form.error");
          try {
            const data = await response.json();
            if (data && Array.isArray(data.errors) && data.errors.length) {
              message = data.errors.map((e) => e.message).join(" ");
            }
          } catch (e) { /* keep generic message */ }
          setStatus(message, "error");
        }
      } catch (e) {
        setStatus(t("form.error"), "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t("form.submit");
      }
    });
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  applyLanguage();
})();
