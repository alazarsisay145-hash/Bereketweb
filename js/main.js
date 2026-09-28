/* ==========================================================================
   Bereket Juice & Salad — main script
   Menu rendering · category filters · cart · WhatsApp ordering
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     CONFIG — update the WhatsApp number when the business number is ready.
     Format: country code + number, digits only (Ethiopia: 251...).
  ------------------------------------------------------------------ */
  const CONFIG = {
    whatsappNumber: '251900000000', // TODO: replace with the real Bereket WhatsApp number
    currency: 'ETB'
  };

  /* ------------------------------------------------------------------
     Menu data — every product has its own image.
  ------------------------------------------------------------------ */
  const PRODUCTS = [
    // Fresh juices
    { id: 'mango-juice', name: 'Mango Juice', category: 'juices', price: 140,
      desc: 'Thick, sweet 100% mango pressed to order — the taste of Sidama sunshine.',
      img: 'assets/menu/mango-juice.svg', badge: 'Popular' },
    { id: 'avocado-juice', name: 'Avocado Juice', category: 'juices', price: 130,
      desc: 'Silky-smooth avocado blended fresh — creamy, rich and filling.',
      img: 'assets/menu/avocado-juice.svg' },
    { id: 'papaya-juice', name: 'Papaya Juice', category: 'juices', price: 120,
      desc: 'Gentle and refreshing papaya with a squeeze of lime.',
      img: 'assets/menu/papaya-juice.svg' },
    { id: 'spris', name: 'Signature Spris', category: 'juices', price: 185,
      desc: 'The house classic — layered avocado, mango and papaya in one glass.',
      img: 'assets/menu/spris.svg', badge: 'Signature', badgeGreen: true },
    { id: 'watermelon-juice', name: 'Watermelon Juice', category: 'juices', price: 110,
      desc: 'Ice-cold watermelon, pressed fresh — pure refreshment.',
      img: 'assets/menu/watermelon-juice.svg' },
    { id: 'pineapple-juice', name: 'Pineapple Juice', category: 'juices', price: 150,
      desc: 'Tangy-sweet pineapple with a tropical bite.',
      img: 'assets/menu/pineapple-juice.svg' },
    { id: 'orange-juice', name: 'Orange Juice', category: 'juices', price: 150,
      desc: 'Freshly squeezed oranges — nothing added, nothing removed.',
      img: 'assets/menu/orange-juice.svg' },

    // Smoothies
    { id: 'strawberry-smoothie', name: 'Strawberry Smoothie', category: 'smoothies', price: 180,
      desc: 'Strawberries blended with yogurt and a touch of honey.',
      img: 'assets/menu/strawberry-smoothie.svg', badge: 'Popular' },
    { id: 'mango-smoothie', name: 'Mango Smoothie', category: 'smoothies', price: 170,
      desc: 'Ripe mango and banana blended thick and cold.',
      img: 'assets/menu/mango-smoothie.svg' },
    { id: 'green-detox-smoothie', name: 'Green Detox Smoothie', category: 'smoothies', price: 190,
      desc: 'Avocado, banana and mint — fresh energy in a jar.',
      img: 'assets/menu/green-detox-smoothie.svg' },

    // Shakes
    { id: 'banana-shake', name: 'Banana Shake', category: 'shakes', price: 160,
      desc: 'Classic banana shake, creamy and topped with fresh slices.',
      img: 'assets/menu/banana-shake.svg' },
    { id: 'oreo-shake', name: 'Oreo Shake', category: 'shakes', price: 200,
      desc: 'Cookies-and-cream shake crowned with crushed Oreo.',
      img: 'assets/menu/oreo-shake.svg', badge: 'Popular' },
    { id: 'chocolate-shake', name: 'Chocolate Shake', category: 'shakes', price: 190,
      desc: 'Rich chocolate shake with a cherry on top.',
      img: 'assets/menu/chocolate-shake.svg' },

    // Burgers
    { id: 'chicken-burger', name: 'Chicken Burger', category: 'burgers', price: 260,
      desc: 'Crispy chicken, fresh lettuce, tomato and house sauce.',
      img: 'assets/menu/chicken-burger.svg', badge: 'Popular' },
    { id: 'beef-burger', name: 'Beef Burger', category: 'burgers', price: 280,
      desc: 'Juicy grilled beef patty with cheese and crunchy vegetables.',
      img: 'assets/menu/beef-burger.svg' },
    { id: 'bereket-special-burger', name: 'Bereket Special Burger', category: 'burgers', price: 350,
      desc: 'Double patty, double cheese — our biggest, boldest burger.',
      img: 'assets/menu/bereket-special-burger.svg', badge: 'Signature', badgeGreen: true },

    // Salads
    { id: 'fruit-salad', name: 'Fruit Salad', category: 'salads', price: 200,
      desc: 'A generous bowl of mango, papaya, banana, watermelon and more.',
      img: 'assets/menu/fruit-salad.svg', badge: 'Popular' },
    { id: 'avocado-salad', name: 'Avocado Salad', category: 'salads', price: 220,
      desc: 'Creamy avocado with fresh greens and a light dressing.',
      img: 'assets/menu/avocado-salad.svg' },

    // Combos
    { id: 'combo-burger-spris', name: 'Burger + Spris Combo', category: 'combos', price: 420,
      desc: 'Beef burger with a full glass of our signature spris.',
      img: 'assets/menu/combo-burger-spris.svg', badge: 'Deal' },
    { id: 'combo-fresh-day', name: 'Fresh Day Combo', category: 'combos', price: 320,
      desc: 'Fruit salad and a fresh mango juice — the healthy favourite.',
      img: 'assets/menu/combo-fresh-day.svg', badge: 'Deal' }
  ];

  const SIGNATURE_IDS = ['spris', 'mango-juice', 'chicken-burger'];
  const CART_KEY = 'bereket-cart-v1';

  /* ------------------------------------------------------------------ */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const money = (n) => `${CONFIG.currency} ${n}`;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  const waLink = (text) =>
    `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;

  /* ------------------------------------------------------------------
     Cart state (persisted in localStorage)
  ------------------------------------------------------------------ */
  let cart = [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      cart = JSON.parse(raw).filter((it) => byId(it.id) && Number.isFinite(it.qty) && it.qty > 0);
    }
  } catch (_) { cart = []; }

  const saveCart = () => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) { /* ignore */ }
  };

  const cartCount = () => cart.reduce((s, it) => s + it.qty, 0);
  const cartTotal = () => cart.reduce((s, it) => s + it.qty * byId(it.id).price, 0);

  function addToCart(id, qty) {
    const item = cart.find((it) => it.id === id);
    if (item) item.qty += qty || 1;
    else cart.push({ id, qty: qty || 1 });
    saveCart();
    renderCart();
    showToast(`${byId(id).name} added to your order 🧺`);
  }

  function setQty(id, qty) {
    const item = cart.find((it) => it.id === id);
    if (!item) return;
    item.qty = qty;
    if (item.qty <= 0) cart = cart.filter((it) => it.id !== id);
    saveCart();
    renderCart();
  }

  /* ------------------------------------------------------------------
     Rendering — cards
  ------------------------------------------------------------------ */
  function badgeHtml(p) {
    if (!p.badge) return '';
    return `<span class="badge${p.badgeGreen ? ' badge-green' : ''}">${p.badge}</span>`;
  }

  function menuCard(p) {
    return `
      <article class="menu-card reveal" data-category="${p.category}">
        ${badgeHtml(p)}
        <button class="card-img" data-open="${p.id}" aria-label="View ${p.name} details">
          <img src="${p.img}" alt="${p.name}" loading="lazy" width="800" height="600">
        </button>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="desc">${p.desc}</p>
          <div class="card-foot">
            <span class="price">${money(p.price)}</span>
            <button class="add-btn" data-add="${p.id}">+ Add</button>
          </div>
        </div>
      </article>`;
  }

  function signatureCard(p) {
    return `
      <article class="signature-card reveal">
        ${badgeHtml(p)}
        <div class="card-img">
          <img src="${p.img}" alt="${p.name}" loading="lazy" width="800" height="600">
        </div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="card-foot">
            <span class="price">${money(p.price)}</span>
            <button class="add-btn" data-add="${p.id}">+ Add to order</button>
          </div>
        </div>
      </article>`;
  }

  function renderMenu(filter) {
    const grid = $('#menuGrid');
    const items = filter && filter !== 'all'
      ? PRODUCTS.filter((p) => p.category === filter)
      : PRODUCTS;
    grid.innerHTML = items.map(menuCard).join('');
    observeReveals(grid);
  }

  function renderSignature() {
    $('#signatureGrid').innerHTML = SIGNATURE_IDS.map((id) => signatureCard(byId(id))).join('');
  }

  /* ------------------------------------------------------------------
     Cart drawer
  ------------------------------------------------------------------ */
  const drawer = $('#cartDrawer');
  const drawerBackdrop = $('#drawerBackdrop');

  function renderCart() {
    $('#cartCount').textContent = cartCount();
    const list = $('#cartItems');
    const empty = $('#cartEmpty');
    const form = $('#cartForm');
    const foot = $('#drawerFoot');

    if (!cart.length) {
      list.innerHTML = '';
      empty.style.display = '';
      form.style.display = 'none';
      foot.style.display = 'none';
      return;
    }
    empty.style.display = 'none';
    form.style.display = '';
    foot.style.display = '';

    list.innerHTML = cart.map((it) => {
      const p = byId(it.id);
      return `
        <li class="cart-item">
          <img src="${p.img}" alt="" width="64" height="52">
          <div>
            <h4>${p.name}</h4>
            <span class="item-price">${money(p.price)} × ${it.qty} = ${money(p.price * it.qty)}</span>
          </div>
          <div class="qty-controls">
            <button data-dec="${p.id}" aria-label="Remove one ${p.name}">−</button>
            <span class="qty">${it.qty}</span>
            <button data-inc="${p.id}" aria-label="Add one ${p.name}">+</button>
          </div>
        </li>`;
    }).join('');

    $('#cartTotal').textContent = money(cartTotal());
  }

  function openDrawer() {
    drawer.hidden = false;
    drawerBackdrop.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('show');
      drawerBackdrop.classList.add('show');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('show');
    drawerBackdrop.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { drawer.hidden = true; drawerBackdrop.hidden = true; }, 380);
  }

  /* ------------------------------------------------------------------
     WhatsApp checkout — builds a real order message
  ------------------------------------------------------------------ */
  function buildOrderMessage() {
    const name = $('#custName').value.trim();
    const pickup = $('#pickupTime').value.trim();
    const lines = cart.map((it) => {
      const p = byId(it.id);
      return `${it.qty} × ${p.name} — ${money(p.price * it.qty)}`;
    });
    return [
      'Hello Bereket Juice & Salad! 👋',
      "I'd like to order:",
      '',
      ...lines,
      '',
      `Total: ${money(cartTotal())}`,
      '',
      `Name: ${name || '___'}`,
      `Pickup time: ${pickup || '___'}`
    ].join('\n');
  }

  function checkout() {
    if (!cart.length) return;
    const name = $('#custName').value.trim();
    if (!name) {
      $('#custName').focus();
      showToast('Please add your name so we know who the order is for 🙂');
      return;
    }
    window.open(waLink(buildOrderMessage()), '_blank', 'noopener');
    showToast('Opening WhatsApp with your order…');
  }

  /* ------------------------------------------------------------------
     Product modal
  ------------------------------------------------------------------ */
  const modal = $('#productModal');
  const modalBackdrop = $('#modalBackdrop');
  let modalProductId = null;

  function openModal(id) {
    const p = byId(id);
    if (!p) return;
    modalProductId = id;
    $('#modalImg').src = p.img;
    $('#modalImg').alt = p.name;
    $('#modalTitle').textContent = p.name;
    $('#modalDesc').textContent = p.desc;
    $('#modalPrice').textContent = money(p.price);
    const badge = $('#modalBadge');
    if (p.badge) { badge.textContent = p.badge; badge.hidden = false; }
    else badge.hidden = true;

    modal.hidden = false;
    modalBackdrop.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add('show');
      modalBackdrop.classList.add('show');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('show');
    modalBackdrop.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; modalBackdrop.hidden = true; }, 300);
  }

  /* ------------------------------------------------------------------
     Toast
  ------------------------------------------------------------------ */
  let toastTimer = null;
  function showToast(msg) {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 320);
    }, 2400);
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
  ------------------------------------------------------------------ */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver = null;
  if ('IntersectionObserver' in window && !prefersReduced) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }

  function observeReveals(root) {
    $$('.reveal', root || document).forEach((el) => {
      if (revealObserver && !el.classList.contains('in')) revealObserver.observe(el);
      else el.classList.add('in');
    });
  }

  /* ------------------------------------------------------------------
     Navigation
  ------------------------------------------------------------------ */
  function initNav() {
    const toggle = $('#navToggle');
    const links = $('#navLinks');

    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // highlight the section currently in view
    const sections = ['top', 'signature', 'menu', 'place', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const navLinks = $$('.nav-link');

    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.classList.toggle(
            'is-active', a.getAttribute('href') === `#${entry.target.id}`
          ));
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ------------------------------------------------------------------
     Wire-up
  ------------------------------------------------------------------ */
  function init() {
    renderSignature();
    renderMenu('all');
    renderCart();
    observeReveals();
    initNav();

    // category filters
    $('#menuFilters').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      $$('.filter').forEach((f) => {
        f.classList.toggle('is-active', f === btn);
        f.setAttribute('aria-selected', String(f === btn));
      });
      renderMenu(btn.dataset.filter);
    });

    // delegated clicks: add-to-cart, open modal, qty controls
    document.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      if (add) { addToCart(add.dataset.add, 1); return; }

      const open = e.target.closest('[data-open]');
      if (open) { openModal(open.dataset.open); return; }

      const inc = e.target.closest('[data-inc]');
      if (inc) {
        const it = cart.find((x) => x.id === inc.dataset.inc);
        if (it) setQty(it.id, it.qty + 1);
        return;
      }
      const dec = e.target.closest('[data-dec]');
      if (dec) {
        const it = cart.find((x) => x.id === dec.dataset.dec);
        if (it) setQty(it.id, it.qty - 1);
      }
    });

    // drawer
    $('#cartBtn').addEventListener('click', openDrawer);
    $('#drawerClose').addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', closeDrawer);
    $('#emptyBrowse').addEventListener('click', closeDrawer);
    $('#checkoutBtn').addEventListener('click', checkout);

    // modal
    $('#modalClose').addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    $('#modalAdd').addEventListener('click', () => {
      if (modalProductId) addToCart(modalProductId, 1);
      closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!modal.hidden) closeModal();
      else if (!drawer.hidden) closeDrawer();
    });

    // generic WhatsApp links (hero, guest house, contact, footer)
    const hello = 'Hello Bereket Juice & Salad! 👋 I would like to place an order.';
    ['#heroWhatsapp', '.gh-whatsapp', '.contact-whatsapp', '.footer-whatsapp'].forEach((sel) => {
      $$(sel).forEach((a) => { a.href = waLink(hello); });
    });

    $('#year').textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
