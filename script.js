/* =========================================================
   MOOD EVENT · interactions
   ========================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. LANGUAGE TOGGLE  (Arabic default / English)
     --------------------------------------------------------- */
  var titles = {
    ar: html.getAttribute('data-title-ar') || document.title,
    en: html.getAttribute('data-title-en') || document.title
  };

  function setLanguage(lang) {
    var isAr = lang === 'ar';
    html.setAttribute('lang', isAr ? 'ar' : 'en');
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.title = isAr ? titles.ar : titles.en;

    // Toggle button state
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-btn') === lang));
    });

    // Retranslate <select> option labels
    document.querySelectorAll('select[data-i18n-select] option').forEach(function (opt) {
      var val = isAr ? opt.getAttribute('data-ar') : opt.getAttribute('data-en');
      if (val !== null) opt.textContent = val;
    });

    // Re-run any visible validation messages in the new language
    document.querySelectorAll('.field.invalid').forEach(function (f) {
      showError(f, f.getAttribute('data-err-key'));
    });
  }

  document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(btn.getAttribute('data-lang-btn'));
    });
  });

  /* ---------------------------------------------------------
     2. MOBILE NAV
     --------------------------------------------------------- */
  var hamburger = document.querySelector('.hamburger');
  var mobilePanel = document.getElementById('mobile-panel');

  if (hamburger && mobilePanel) {
    hamburger.addEventListener('click', function () {
      var open = mobilePanel.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
    });
    mobilePanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobilePanel.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     3. PORTFOLIO RAIL · prev / next
     --------------------------------------------------------- */
  var rail = document.getElementById('portfolio-rail');
  var prevBtn = document.querySelector('[data-rail="prev"]');
  var nextBtn = document.querySelector('[data-rail="next"]');

  function railStep() {
    var card = rail && rail.querySelector('.card');
    if (!card) return 320;
    var gap = parseInt(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || 22, 10) || 22;
    return card.getBoundingClientRect().width + gap;
  }

  function updateRailButtons() {
    if (!rail || !prevBtn || !nextBtn) return;
    // scrollLeft is negative in RTL on most engines; use absolute value
    var pos = Math.abs(rail.scrollLeft);
    var max = rail.scrollWidth - rail.clientWidth - 2;
    prevBtn.disabled = pos <= 2;
    nextBtn.disabled = pos >= max;
  }

  function scrollRail(dir) {
    if (!rail) return;
    var rtl = html.getAttribute('dir') === 'rtl';
    var amount = railStep() * dir * (rtl ? -1 : 1);
    rail.scrollBy({ left: amount, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  if (rail) {
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollRail(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollRail(1); });
    rail.addEventListener('scroll', updateRailButtons, { passive: true });
    window.addEventListener('resize', updateRailButtons);
    updateRailButtons();
  }

  /* ---------------------------------------------------------
     3b. ACTIVE-PROJECT SHOWCASE
     Real projects and figures only (2026 company profile).
     --------------------------------------------------------- */
  var scProjects = [
    {
      img: 'images/project-shorofat-park-entrance-2026.jpg',
      cat: { ar: 'فعالية عامة', en: 'Public Event' },
      client: { ar: 'منتزه شرفات', en: 'Shorofat Park' },
      name: { ar: 'منتزه شرفات · عيد الفطر 2026', en: 'Shorofat Park · Eid Al Fitr 2026' },
      tagline: { ar: 'تحويل مساحة عامة إلى وجهة عيد لعائلات المنطقة', en: 'A public space turned into an Eid destination for the region' },
      desc: {
        ar: 'تجهيز كامل وديكور وبرمجة ترفيهية وإدارة حشود على مدى يومين استقبلا 30 ألف زائر.',
        en: 'Full setup, decor, entertainment programming and crowd management across two days that drew 30,000 visitors.'
      },
      metrics: [
        { v: { ar: 'يومان', en: '2 Days' }, l: { ar: 'مدة التشغيل', en: 'Run time' } },
        { v: { ar: 'كامل', en: 'Turnkey' }, l: { ar: 'نطاق العمل', en: 'Scope' } }
      ],
      highlights: [
        { t: { ar: 'التجهيز والديكور', en: 'Setup & decor' }, d: { ar: 'تجهيز الموقع بالكامل مع ديكور ومناطق تفاعلية للعائلات.', en: 'Complete site build-out with decor and interactive family zones.' } },
        { t: { ar: 'إدارة الحشود', en: 'Crowd management' }, d: { ar: 'تخطيط مسارات الدخول والخروج وانسيابية الحركة طوال اليوم.', en: 'Entry and exit routing and flow control throughout the day.' } }
      ]
    },
    {
      img: 'images/event-pepsi-dammam.jpg',
      cat: { ar: 'فعالية علامة تجارية', en: 'Brand Event' },
      client: { ar: 'بيبسي', en: 'Pepsi' },
      name: { ar: 'بيبسي · فعالية رأس السنة', en: 'Pepsi · New Year Event' },
      tagline: { ar: 'فعالية ABC Sales Rally 2026 بتنفيذ متكامل من الألف إلى الياء', en: 'ABC Sales Rally 2026, delivered end to end' },
      desc: {
        ar: 'الموقع والمسرح وشاشات LED والإنتاج السمعي البصري والضيافة ومحطات طعام حية ضمن تنفيذ متكامل.',
        en: 'Venue, stage, LED, AV production, hospitality and live food stations under a single turnkey scope.'
      },
      metrics: [
        { v: { ar: 'متكامل', en: 'Turnkey' }, l: { ar: 'نموذج التنفيذ', en: 'Delivery' } },
        { v: { ar: 'LED', en: 'LED' }, l: { ar: 'شاشات ومسرح', en: 'Screens & stage' } },
        { v: { ar: 'حية', en: 'Live' }, l: { ar: 'محطات طعام', en: 'Food stations' } }
      ],
      highlights: [
        { t: { ar: 'المسرح والإنتاج البصري', en: 'Stage & AV' }, d: { ar: 'مسرح رئيسي وشاشات LED وإنتاج سمعي بصري متزامن.', en: 'Main stage, LED screens and synchronized audio-visual production.' } },
        { t: { ar: 'الضيافة والتموين', en: 'Hospitality & catering' }, d: { ar: 'ضيافة كاملة ومحطات طعام حية للحضور.', en: 'Full hospitality and live food stations for guests.' } }
      ]
    },
    {
      img: 'images/event-venue-aerial.jpg',
      cat: { ar: 'إطلاق منتجع', en: 'Resort Launch' },
      client: { ar: 'حفل الغدير', en: 'Al Ghadir Ceremony' },
      name: { ar: 'حفل إطلاق منتجع الغدير', en: 'Al Ghadir Resort Launch' },
      tagline: { ar: 'حفل إطلاق رسمي بحضور محافظ الأحساء', en: 'An official launch attended by the Governor of Al-Ahsa' },
      desc: {
        ar: 'إدارة المسرح والإنتاج السمعي البصري والديكور لحفل إطلاق منتجع الغدير.',
        en: 'Stage management, AV production and decor for the Al Ghadir Resort launch.'
      },
      metrics: [
        { v: { ar: 'محافظ الأحساء', en: 'Governor' }, l: { ar: 'راعي الحفل', en: 'In attendance' } },
        { v: { ar: 'مسرح', en: 'Stage' }, l: { ar: 'إدارة وإنتاج', en: 'Managed & produced' } },
        { v: { ar: 'ديكور', en: 'Decor' }, l: { ar: 'تصميم المكان', en: 'Venue design' } }
      ],
      highlights: [
        { t: { ar: 'إدارة المسرح', en: 'Stage management' }, d: { ar: 'تسلسل زمني دقيق للحفل وإدارة الظهور على المسرح.', en: 'A tight ceremony run-of-show and on-stage management.' } },
        { t: { ar: 'الإنتاج والديكور', en: 'Production & decor' }, d: { ar: 'إنتاج سمعي بصري وديكور يعكس هوية المنتجع.', en: 'AV production and decor reflecting the resort identity.' } }
      ]
    },
    {
      img: 'images/project-asian-u18-athletics.svg',
      cat: { ar: 'فعالية رياضية', en: 'Sporting Event' },
      client: { ar: 'بطولة آسيا لألعاب القوى تحت 18', en: '6th Asian U18 Athletics Championships' },
      name: { ar: 'بطولة آسيا السادسة لألعاب القوى تحت 18', en: '6th Asian U18 Athletics Championships' },
      tagline: { ar: 'ضيافة وحفل افتتاح لبطولة قارية بمشاركة 29 دولة', en: 'Catering and an opening ceremony for a 29-nation championship' },
      desc: {
        ar: '29 دولة، وسبعة أيام من خدمات الضيافة، وحفل افتتاح بمشاركة 70 مؤدياً.',
        en: '29 countries, 7 days of catering, and an opening ceremony with 70 performers.'
      },
      metrics: [
        { v: { ar: '29', en: '29' }, l: { ar: 'دولة مشاركة', en: 'Countries' } },
        { v: { ar: '7 أيام', en: '7 Days' }, l: { ar: 'خدمات ضيافة', en: 'Catering' } },
        { v: { ar: '70', en: '70' }, l: { ar: 'مؤدٍّ في الافتتاح', en: 'Opening performers' } }
      ],
      highlights: [
        { t: { ar: 'الضيافة والتموين', en: 'Catering operations' }, d: { ar: 'تموين متواصل للوفود والطواقم على مدى سبعة أيام.', en: 'Continuous catering for delegations and crews over seven days.' } },
        { t: { ar: 'حفل الافتتاح', en: 'Opening ceremony' }, d: { ar: 'إخراج وتنسيق عرض افتتاحي بمشاركة 70 مؤدياً.', en: 'Direction and staging of an opening show with 70 performers.' } }
      ]
    },
    {
      img: 'images/project-tahakkum-arch.jpg',
      cat: { ar: 'إشراك الموظفين', en: 'Employee Engagement' },
      client: { ar: 'تحكّم', en: 'Tahakkum' },
      name: { ar: 'تحكّم · برنامج إشراك الموظفين', en: 'Tahakkum · Employee Engagement' },
      tagline: { ar: 'برنامج متعدد المواقع على مدى خمسة أيام', en: 'A multi-site programme run across five days' },
      desc: {
        ar: 'تنفيذ برنامج إشراك الموظفين في موقعين على مدى خمسة أيام بمشاركة 1,840 شخصاً.',
        en: 'An employee engagement programme delivered at two sites over five days for 1,840 participants.'
      },
      metrics: [
        { v: { ar: '5 أيام', en: '5 Days' }, l: { ar: 'مدة البرنامج', en: 'Programme' } },
        { v: { ar: 'موقعان', en: '2 Sites' }, l: { ar: 'التشغيل', en: 'Operations' } },
        { v: { ar: '1,840', en: '1,840' }, l: { ar: 'مشارك', en: 'Participants' } }
      ],
      highlights: [
        { t: { ar: 'تشغيل متعدد المواقع', en: 'Multi-site operations' }, d: { ar: 'طواقم وجداول متزامنة عبر موقعين اثنين.', en: 'Synchronized crews and schedules across two sites.' } },
        { t: { ar: 'تجربة المشاركين', en: 'Participant experience' }, d: { ar: 'تصميم رحلة المشارك لإبقاء 1,840 شخصاً منخرطين.', en: 'A participant journey built to keep 1,840 people engaged.' } }
      ]
    },
    {
      img: 'images/project-sea-delta-marine.svg',
      cat: { ar: 'جناح معرض', en: 'Exhibition Booth' },
      client: { ar: 'سي دلتا مارين آند أوفشور', en: 'Sea Delta Marine &amp; Offshore' },
      name: { ar: 'سي دلتا مارين آند أوفشور · جناح معرض', en: 'Sea Delta Marine &amp; Offshore · Exhibition Booth' },
      tagline: { ar: 'جناح جزيرة بمظلة منحنية مضاءة وصالة اجتماعات', en: 'An island stand with an illuminated curved canopy and a meeting lounge' },
      desc: {
        ar: 'جناح جزيرة بمظلة منحنية مضاءة، وجدار عرض للمنتجات، وصالة اجتماعات مستضافة.',
        en: 'An island stand with an illuminated curved canopy, a product wall and a hosted meeting lounge.'
      },
      metrics: [
        { v: { ar: 'جزيرة', en: 'Island' }, l: { ar: 'نوع الجناح', en: 'Stand type' } },
        { v: { ar: 'مظلة', en: 'Canopy' }, l: { ar: 'عنصر مضاء منحنٍ', en: 'Illuminated curve' } },
        { v: { ar: 'صالة', en: 'Lounge' }, l: { ar: 'اجتماعات مستضافة', en: 'Hosted meetings' } }
      ],
      highlights: [
        { t: { ar: 'المظلة وجدار المنتجات', en: 'Canopy & product wall' }, d: { ar: 'مظلة منحنية مضاءة وجدار عرض يبرز محفظة المنتجات.', en: 'An illuminated curved canopy and a wall presenting the product range.' } },
        { t: { ar: 'صالة الاجتماعات', en: 'Meeting lounge' }, d: { ar: 'صالة مستضافة لاجتماعات العملاء داخل الجناح.', en: 'A hosted lounge for client meetings inside the stand.' } }
      ]
    }
  ];

  var scImg = document.getElementById('sc-img');
  var scTabsEl = document.getElementById('sc-tabs');
  var scActive = 0;

  var HL_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  function bi(pair) {
    return '<span data-ar>' + pair.ar + '</span><span data-en>' + pair.en + '</span>';
  }

  function scRender(i) {
    var p = scProjects[i];
    if (!p) return;
    scActive = i;

    scImg.src = p.img;
    scImg.alt = (p.name.ar + ' / ' + p.name.en).replace(/&amp;/g, '&');
    document.getElementById('sc-cat').innerHTML = bi(p.cat);
    document.getElementById('sc-client').innerHTML = bi(p.client);
    document.getElementById('sc-name').innerHTML = bi(p.name);
    document.getElementById('sc-tagline').innerHTML = bi(p.tagline);
    document.getElementById('sc-desc').innerHTML = bi(p.desc);

    document.getElementById('sc-metrics').innerHTML = p.metrics.map(function (m) {
      return '<div class="sc-metric"><b>' + bi(m.v) + '</b><span>' + bi(m.l) + '</span></div>';
    }).join('');

    var hlGrid = document.getElementById('sc-hl-grid');
    if (hlGrid) {
      hlGrid.innerHTML = p.highlights.map(function (h) {
        return '<article class="sc-hl"><div class="sc-hl-ico">' + HL_ICON + '</div>' +
               '<h4>' + bi(h.t) + '</h4><p>' + bi(h.d) + '</p></article>';
      }).join('');
    }

    Array.prototype.forEach.call(scTabsEl.children, function (btn, idx) {
      btn.setAttribute('aria-selected', String(idx === i));
      btn.tabIndex = idx === i ? 0 : -1;
    });
  }

  if (scImg && scTabsEl) {
    scProjects.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sc-tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.innerHTML = '<span class="n">' + ('0' + (i + 1)) + '</span>' +
                      '<span>' + bi(p.client) + '</span>';
      btn.addEventListener('click', function () { scRender(i); });
      btn.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var rtl = html.getAttribute('dir') === 'rtl';
        var next = (scActive + dir * (rtl ? -1 : 1) + scProjects.length) % scProjects.length;
        scRender(next);
        scTabsEl.children[next].focus();
      });
      scTabsEl.appendChild(btn);
    });
    scRender(0);
  }

  /* ---------------------------------------------------------
     3c. CLIENT LOGO MARQUEE · continuous scroll along each line
     --------------------------------------------------------- */
  var marquee = document.querySelector('.logo-marquee');
  if (marquee && !reduceMotion) {
    var rows = marquee.querySelectorAll('.lm-row');
    var setUp = function () {
      rows.forEach(function (row) {
        var set = row.querySelector('.lm-set');
        if (!set) return;
        // Duplicate the set so translateX(-50%) loops seamlessly.
        if (row.querySelectorAll('.lm-set').length < 2) {
          var clone = set.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.querySelectorAll('[role="listitem"]').forEach(function (n) {
            n.removeAttribute('role');
          });
          row.appendChild(clone);
        }
        // Constant speed (~60px/s) regardless of how wide the row is.
        var dist = set.getBoundingClientRect().width;
        var dur = Math.max(24, Math.round(dist / 60));
        row.style.setProperty('--lm-dur', dur + 's');
      });
      marquee.classList.add('lm-ready');
    };
    if (document.readyState === 'complete') setUp();
    else window.addEventListener('load', setUp);
    // Recompute durations if the viewport changes a lot.
    var lmT;
    window.addEventListener('resize', function () {
      clearTimeout(lmT);
      lmT = setTimeout(function () {
        marquee.classList.remove('lm-ready');
        rows.forEach(function (row) {
          var extra = row.querySelectorAll('.lm-set');
          for (var i = 1; i < extra.length; i++) extra[i].remove();
        });
        setUp();
      }, 200);
    });
  }

  /* ---------------------------------------------------------
     3d. NEWS
     Content is loaded from news.json (edit it with admin.html,
     no code needed). The array below is only the built-in
     fallback shown if news.json is missing.
     First item = featured (large). The rest show as side cards.
     --------------------------------------------------------- */
  var NEWS = [
    {
      img: 'images/event-shorofat-park.jpg',
      kicker: { ar: 'بيبسي × منتزه شرفات', en: 'Pepsi × Shorofat Park' },
      title: { ar: 'نجاح تنظيم فعاليات العيد وسط حضور جماهيري كبير', en: 'Eid events delivered to a large public turnout' },
      text: { ar: 'أكثر من 20,000 زائر خلال أيام العيد، مع تجهيز كامل وإدارة حشود وبرمجة ترفيهية متواصلة.', en: '20,000+ visitors across the Eid days, with full setup, crowd management and continuous entertainment programming.' }
    },
    {
      img: 'images/news-mood-camp.svg',
      id: 'moodcamp',
      link: 'mood-camp.html',
      kicker: { ar: 'مود كامب', en: 'Mood Camp' },
      title: { ar: 'من مخيّم واحد إلى شركة فعاليات متكاملة', en: 'From a single camp to a full event company' },
      text: { ar: 'البداية التي تشكّلت منها فلسفة مود إيفنت في التجربة والتنفيذ.', en: "The beginning that shaped Mood Event's philosophy of experience and execution." }
    },
    {
      img: 'images/news-asian-athletics.svg',
      kicker: { ar: 'تكريم', en: 'Recognition' },
      title: { ar: 'بطولة آسيا للناشئين السادسة لألعاب القوى', en: '6th Asian Junior Athletics Championships' },
      text: { ar: 'تقدير لدور مود إيفنت في خدمات الضيافة وحفل الافتتاح.', en: "Recognition for Mood Event's role in catering and the opening ceremony." }
    }
  ];

  var newsGrid = document.getElementById('news-grid');
  if (newsGrid) {
    var esc = function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    var pick = function (o, k) { return (o && o[k] != null) ? o[k] : ''; };
    var newsBi = function (pair) {
      pair = pair || {};
      return '<span data-ar>' + esc(pair.ar || pair.en) + '</span><span data-en>' + esc(pair.en || pair.ar) + '</span>';
    };
    var newsCard = function (n, featured) {
      var link = pick(n, 'link'), id = pick(n, 'id');
      var tag = link ? 'a' : 'article';
      var attrs = 'class="news-card' + (featured ? ' news-featured' : '') + '"' +
        (id ? ' id="' + esc(id) + '"' : '') +
        (link ? ' href="' + esc(link) + '"' : '');
      var t = n.title || {};
      var alt = ((t.ar || '') + ' / ' + (t.en || '')).replace(/"/g, '');
      return '<' + tag + ' ' + attrs + '>' +
        '<div class="news-img"><img src="' + esc(n.img) + '" alt="' + esc(alt) + '" loading="lazy" /></div>' +
        '<div class="news-body">' +
          '<span class="news-kicker">' + newsBi(n.kicker) + '</span>' +
          '<h3>' + newsBi(n.title) + '</h3>' +
          '<p>' + newsBi(n.text) + '</p>' +
        '</div>' +
      '</' + tag + '>';
    };
    var renderNews = function (list) {
      if (!Array.isArray(list) || !list.length) return;
      var featuredHtml = newsCard(list[0], true);
      var sideHtml = list.slice(1).map(function (n) { return newsCard(n, false); }).join('');
      newsGrid.innerHTML = featuredHtml + (sideHtml ? '<div class="news-side">' + sideHtml + '</div>' : '');
    };

    renderNews(NEWS); // instant fallback
    fetch('news.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (list) { if (Array.isArray(list) && list.length) renderNews(list); })
      .catch(function () {});
  }

  /* ---------------------------------------------------------
     3e. WORLD DAYS — "next up" live countdown row (days-calendar.html)
     Fixed-date days only (month/day repeats every year) — these
     are the real entries from the Mood Event Days Calendar app's
     own data/events.json. Floating / annual-variable dates need
     that app's full rule engine and are out of scope for a
     static countdown, so they're left out here rather than
     computed wrong.
     --------------------------------------------------------- */
  var nextupRow = document.getElementById('nextup-row');
  if (nextupRow) {
    var WORLD_DAYS_FIXED = [
      { ar: 'اليوم العالمي لحماية البيانات', en: 'Data Privacy Day', m: 1, d: 28, niches: ['tech'] },
      { ar: 'اليوم العالمي للسرطان', en: 'World Cancer Day', m: 2, d: 4, niches: ['healthcare'] },
      { ar: 'يوم التأسيس', en: 'Saudi Founding Day', m: 2, d: 22, niches: ['healthcare', 'oil-gas', 'real-estate', 'tech'] },
      { ar: 'اليوم الوطني للمشي', en: 'Saudi Walking Day', m: 3, d: 5, niches: ['healthcare'] },
      { ar: 'اليوم الدولي للمرأة', en: "International Women's Day", m: 3, d: 8, niches: ['healthcare', 'oil-gas', 'real-estate', 'tech'] },
      { ar: 'يوم العلم', en: 'Saudi Flag Day', m: 3, d: 11, niches: ['healthcare', 'oil-gas', 'real-estate', 'tech'] },
      { ar: 'اليوم العالمي لحقوق المستهلك', en: 'World Consumer Rights Day', m: 3, d: 15, niches: [] },
      { ar: 'اليوم العالمي لصحة الفم', en: 'World Oral Health Day', m: 3, d: 20, niches: ['healthcare'] },
      { ar: 'اليوم العالمي للمياه', en: 'World Water Day', m: 3, d: 22, niches: ['oil-gas', 'real-estate'] },
      { ar: 'يوم الصحة العالمي', en: 'World Health Day', m: 4, d: 7, niches: ['healthcare'] },
      { ar: 'اليوم الدولي لأمنا الأرض', en: 'Earth Day', m: 4, d: 22, niches: ['oil-gas', 'real-estate'] },
      { ar: 'أسبوع التمنيع العالمي', en: 'World Immunization Week', m: 4, d: 24, niches: ['healthcare'] },
      { ar: 'اليوم العالمي للصحة والسلامة في مكان العمل', en: 'World Day for Safety and Health at Work', m: 4, d: 28, niches: ['healthcare', 'oil-gas', 'real-estate'] },
      { ar: 'اليوم العالمي للممرضين', en: 'International Nurses Day', m: 5, d: 12, niches: ['healthcare'] },
      { ar: 'اليوم العالمي لارتفاع ضغط الدم', en: 'World Hypertension Day', m: 5, d: 17, niches: ['healthcare'] },
      { ar: 'اليوم العالمي للاتصالات ومجتمع المعلومات', en: 'World Telecommunication and Information Society Day', m: 5, d: 17, niches: ['tech'] },
      { ar: 'اليوم العالمي للامتناع عن تعاطي التبغ', en: 'World No Tobacco Day', m: 5, d: 31, niches: ['healthcare'] },
      { ar: 'اليوم العالمي للبيئة', en: 'World Environment Day', m: 6, d: 5, niches: ['oil-gas', 'real-estate'] },
      { ar: 'اليوم العالمي للمتبرعين بالدم', en: 'World Blood Donor Day', m: 6, d: 14, niches: ['healthcare'] },
      { ar: 'اليوم الدولي لحفظ طبقة الأوزون', en: 'International Day for the Preservation of the Ozone Layer', m: 9, d: 16, niches: ['oil-gas', 'real-estate'] },
      { ar: 'اليوم العالمي لسلامة المرضى', en: 'World Patient Safety Day', m: 9, d: 17, niches: ['healthcare'] },
      { ar: 'اليوم الوطني', en: 'Saudi National Day', m: 9, d: 23, niches: ['healthcare', 'oil-gas', 'real-estate', 'tech'] },
      { ar: 'يوم السياحة العالمي', en: 'World Tourism Day', m: 9, d: 27, niches: ['real-estate'] },
      { ar: 'اليوم العالمي للقلب', en: 'World Heart Day', m: 9, d: 29, niches: ['healthcare'] },
      { ar: 'الشهر العالمي للتوعية بسرطان الثدي', en: 'Breast Cancer Awareness Month', m: 10, d: 1, niches: ['healthcare'] },
      { ar: 'الشهر العالمي للتوعية بالأمن السيبراني', en: 'Cybersecurity Awareness Month', m: 10, d: 1, niches: ['tech'] },
      { ar: 'اليوم العالمي للصحة النفسية', en: 'World Mental Health Day', m: 10, d: 10, niches: ['healthcare', 'oil-gas', 'real-estate', 'tech'] },
      { ar: 'اليوم العالمي للطاقة', en: 'World Energy Day', m: 10, d: 22, niches: ['oil-gas', 'real-estate'] },
      { ar: 'اليوم العالمي للادخار', en: 'World Savings Day', m: 10, d: 31, niches: [] },
      { ar: 'اليوم العالمي لمرضى السكري', en: 'World Diabetes Day', m: 11, d: 14, niches: ['healthcare'] },
      { ar: 'الأسبوع العالمي للتوعية بمقاومة مضادات الميكروبات', en: 'World AMR Awareness Week', m: 11, d: 18, niches: ['healthcare'] },
      { ar: 'اليوم الدولي للمصارف', en: 'International Day of Banks', m: 12, d: 4, niches: [] },
      { ar: 'اليوم الدولي لمكافحة الفساد', en: 'International Anti-Corruption Day', m: 12, d: 9, niches: [] }
    ];
    var MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    var MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var NICHE_LABEL = {
      healthcare: { ar: 'الرعاية الصحية', en: 'Healthcare' },
      'oil-gas': { ar: 'النفط والغاز', en: 'Oil & Gas' },
      'real-estate': { ar: 'العقارات', en: 'Real Estate' },
      tech: { ar: 'التقنية', en: 'Tech' }
    };

    var now = new Date();
    var todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // local midnight, no UTC drift

    var withDates = WORLD_DAYS_FIXED.map(function (ev) {
      var y = todayLocal.getFullYear();
      var occ = new Date(y, ev.m - 1, ev.d);
      if (occ < todayLocal) occ = new Date(y + 1, ev.m - 1, ev.d);
      var diff = Math.round((occ - todayLocal) / 86400000);
      return { ev: ev, occ: occ, diff: diff };
    }).sort(function (a, b) { return a.diff - b.diff; }).slice(0, 5);

    nextupRow.innerHTML = withDates.map(function (row) {
      var ev = row.ev, diff = row.diff;
      var dayWord = diff === 0
        ? bi({ ar: 'اليوم!', en: 'Today!' })
        : diff === 1
          ? bi({ ar: 'يوم واحد متبقٍ', en: 'day left' })
          : bi({ ar: 'يوماً متبقياً', en: 'days left' });
      var tagsHtml = ev.niches.length === 4
        ? '<span class="nu-tag">' + bi({ ar: 'كل القطاعات', en: 'All sectors' }) + '</span>'
        : ev.niches.length === 0
          ? '<span class="nu-tag nu-tag--muted">' + bi({ ar: 'عام', en: 'General' }) + '</span>'
          : ev.niches.map(function (n) { return '<span class="nu-tag nu-tag--' + n + '">' + bi(NICHE_LABEL[n]) + '</span>'; }).join('');
      return '<article class="nu-card">' +
        '<div class="nu-count"><b>' + diff + '</b><span>' + dayWord + '</span></div>' +
        '<h3>' + bi({ ar: ev.ar, en: ev.en }) + '</h3>' +
        '<p>' + bi({
          ar: row.occ.getDate() + ' ' + MONTHS_AR[row.occ.getMonth()] + ' ' + row.occ.getFullYear(),
          en: MONTHS_EN[row.occ.getMonth()] + ' ' + row.occ.getDate() + ', ' + row.occ.getFullYear()
        }) + '</p>' +
        '<div class="nu-tags">' + tagsHtml + '</div>' +
      '</article>';
    }).join('');
  }

  /* ---------------------------------------------------------
     3f. WORLD DAYS — "2026 at a glance" month tabs (days-calendar.html)
     Real 46-event dataset (verified against the Days Calendar app's
     own data/events.json, with floating/annual-variable dates
     resolved for 2026), grouped by month. Click a month to reveal
     its events instead of dumping all 12 lists at once.
     --------------------------------------------------------- */
  var monthTabs = document.getElementById('month-tabs');
  var monthPanel = document.getElementById('month-panel');
  if (monthTabs && monthPanel) {
    var MONTH_EVENTS = [
      { ar: 'يناير', en: 'January', events: [
        { ar: 'اليوم العالمي لحماية البيانات', en: 'Data Privacy Day' }
      ] },
      { ar: 'فبراير', en: 'February', events: [
        { ar: 'اليوم العالمي للسرطان', en: 'World Cancer Day' },
        { ar: 'اليوم العالمي للإنترنت الآمن', en: 'Safer Internet Day' },
        { ar: 'معرض ريستاتكس الرياض العقاري', en: 'Restatex Riyadh Real Estate Exhibition' },
        { ar: 'يوم التأسيس', en: 'Saudi Founding Day' }
      ] },
      { ar: 'مارس', en: 'March', events: [
        { ar: 'اليوم الوطني للمشي', en: 'Saudi Walking Day' },
        { ar: 'اليوم الدولي للمرأة', en: "International Women's Day" },
        { ar: 'يوم العلم', en: 'Saudi Flag Day' },
        { ar: 'اليوم العالمي للكلى', en: 'World Kidney Day' },
        { ar: 'اليوم العالمي لحقوق المستهلك', en: 'World Consumer Rights Day' },
        { ar: 'الأسبوع العالمي للمال', en: 'Global Money Week' },
        { ar: 'اليوم العالمي لصحة الفم', en: 'World Oral Health Day' },
        { ar: 'اليوم العالمي للمياه', en: 'World Water Day' }
      ] },
      { ar: 'أبريل', en: 'April', events: [
        { ar: 'يوم الصحة العالمي', en: 'World Health Day' },
        { ar: 'اليوم الدولي لأمنا الأرض', en: 'Earth Day' },
        { ar: 'أسبوع التمنيع العالمي', en: 'World Immunization Week' },
        { ar: 'اليوم العالمي للصحة والسلامة في مكان العمل', en: 'World Day for Safety and Health at Work' }
      ] },
      { ar: 'مايو', en: 'May', events: [
        { ar: 'اليوم العالمي للربو', en: 'World Asthma Day' },
        { ar: 'اليوم العالمي لكلمة المرور', en: 'World Password Day' },
        { ar: 'اليوم العالمي للممرضين', en: 'International Nurses Day' },
        { ar: 'اليوم العالمي لارتفاع ضغط الدم', en: 'World Hypertension Day' },
        { ar: 'اليوم العالمي للاتصالات ومجتمع المعلومات', en: 'World Telecommunication and Information Society Day' },
        { ar: 'اليوم العالمي للامتناع عن تعاطي التبغ', en: 'World No Tobacco Day' }
      ] },
      { ar: 'يونيو', en: 'June', events: [
        { ar: 'اليوم العالمي للبيئة', en: 'World Environment Day' },
        { ar: 'اليوم العالمي للمتبرعين بالدم', en: 'World Blood Donor Day' }
      ] },
      { ar: 'يوليو', en: 'July', events: [] },
      { ar: 'أغسطس', en: 'August', events: [] },
      { ar: 'سبتمبر', en: 'September', events: [
        { ar: 'اليوم الدولي لحفظ طبقة الأوزون', en: 'International Day for the Preservation of the Ozone Layer' },
        { ar: 'اليوم العالمي لسلامة المرضى', en: 'World Patient Safety Day' },
        { ar: 'اليوم الوطني', en: 'Saudi National Day' },
        { ar: 'يوم السياحة العالمي', en: 'World Tourism Day' },
        { ar: 'اليوم العالمي للقلب', en: 'World Heart Day' }
      ] },
      { ar: 'أكتوبر', en: 'October', events: [
        { ar: 'الشهر العالمي للتوعية بسرطان الثدي', en: 'Breast Cancer Awareness Month' },
        { ar: 'الشهر العالمي للتوعية بالأمن السيبراني', en: 'Cybersecurity Awareness Month' },
        { ar: 'أسبوع خدمة العملاء', en: 'Customer Service Week' },
        { ar: 'اليوم العالمي للعمارة', en: 'World Architecture Day' },
        { ar: 'اليوم العالمي للموئل', en: 'World Habitat Day' },
        { ar: 'يوم تجربة العميل', en: 'CX Day' },
        { ar: 'اليوم العالمي للصحة النفسية', en: 'World Mental Health Day' },
        { ar: 'اليوم العالمي للطاقة', en: 'World Energy Day' },
        { ar: 'اليوم العالمي للادخار', en: 'World Savings Day' }
      ] },
      { ar: 'نوفمبر', en: 'November', events: [
        { ar: 'اليوم العالمي للجودة', en: 'World Quality Day' },
        { ar: 'اليوم العالمي لمرضى السكري', en: 'World Diabetes Day' },
        { ar: 'الأسبوع الدولي للتوعية بمكافحة الاحتيال', en: 'International Fraud Awareness Week' },
        { ar: 'سيتي سكيب جلوبال، الرياض', en: 'Cityscape Global, Riyadh' },
        { ar: 'الأسبوع العالمي للتوعية بمقاومة مضادات الميكروبات', en: 'World AMR Awareness Week' }
      ] },
      { ar: 'ديسمبر', en: 'December', events: [
        { ar: 'اليوم الدولي للمصارف', en: 'International Day of Banks' },
        { ar: 'اليوم الدولي لمكافحة الفساد', en: 'International Anti-Corruption Day' }
      ] }
    ];

    monthTabs.innerHTML = MONTH_EVENTS.map(function (m, i) {
      return '<button type="button" class="month-tab' + (i === 0 ? ' is-active' : '') + (m.events.length === 0 ? ' is-empty' : '') +
        '" data-month="' + i + '" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' +
        bi({ ar: m.ar, en: m.en }) + '<b>' + m.events.length + '</b></button>';
    }).join('');

    function renderMonthPanel(i) {
      var m = MONTH_EVENTS[i];
      var listHtml = m.events.length
        ? '<ul>' + m.events.map(function (ev) { return '<li>' + bi({ ar: ev.ar, en: ev.en }) + '</li>'; }).join('') + '</ul>'
        : '<p class="month-panel-empty">' + bi({ ar: 'لا توجد مناسبات في هذا الشهر ضمن روزنامتنا حالياً.', en: 'No occasions in our calendar for this month yet.' }) + '</p>';
      monthPanel.innerHTML =
        '<div class="month-panel-head"><span>' + bi({ ar: m.ar, en: m.en }) + '</span><b>' +
        bi({ ar: m.events.length + ' مناسبة', en: m.events.length + (m.events.length === 1 ? ' occasion' : ' occasions') }) +
        '</b></div>' + listHtml;
    }

    monthTabs.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.month-tab') : null;
      if (!btn) return;
      var idx = Number(btn.getAttribute('data-month'));
      Array.prototype.forEach.call(monthTabs.querySelectorAll('.month-tab'), function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      renderMonthPanel(idx);
    });

    renderMonthPanel(0);
  }

  /* ---------------------------------------------------------
     4. SCROLL-SPY ACTIVE NAV LINK
     --------------------------------------------------------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var spyTargets = spyLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if (spyTargets.length && 'IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          spyLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spyTargets.forEach(function (t) { spyObserver.observe(t); });
  }

  /* ---------------------------------------------------------
     5. REVEAL ON SCROLL + hero entrance
     --------------------------------------------------------- */
  function show(el) { el.classList.remove('pre'); el.classList.add('in'); }

  var animEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .hero .fade-up'));

  if (animEls.length && !reduceMotion) {
    // Arm the animation by hiding elements now (JS-only, so no-JS stays visible).
    animEls.forEach(function (el) { el.classList.add('pre'); });

    var sweep = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var remaining = false;
      animEls.forEach(function (el) {
        if (!el.classList.contains('pre')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh - vh * 0.06 && r.bottom > 0) show(el);
        else remaining = true;
      });
      return remaining;
    };

    // Primary: IntersectionObserver when it actually works.
    if ('IntersectionObserver' in window) {
      var revObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { show(entry.target); obs.unobserve(entry.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      animEls.forEach(function (el) { revObserver.observe(el); });
    }

    // Fallback + belt-and-braces: scroll/resize sweep and a couple of timed sweeps,
    // so content can never get stranded at opacity:0 if the observer is stubbed,
    // throttled, or never fires (background tab, restored scroll position, etc.).
    var onScroll = function () {
      if (!sweep()) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    setTimeout(sweep, 200);
    setTimeout(sweep, 1200);
    window.addEventListener('load', function () { setTimeout(sweep, 100); });
  }

  /* ---------------------------------------------------------
     6. FORMS · shared validation, no native tooltips
     --------------------------------------------------------- */
  var messages = {
    required: { ar: 'هذا الحقل مطلوب', en: 'This field is required' },
    email:    { ar: 'يرجى إدخال بريد إلكتروني صحيح', en: 'Please enter a valid email address' },
    phone:    { ar: 'يرجى إدخال رقم هاتف صحيح', en: 'Please enter a valid phone number' },
    select:   { ar: 'يرجى الاختيار من القائمة', en: 'Please make a selection' }
  };

  function currentLang() { return html.getAttribute('dir') === 'rtl' ? 'ar' : 'en'; }

  function showError(field, key) {
    field.classList.add('invalid');
    field.setAttribute('data-err-key', key);
    var box = field.querySelector('.field-error');
    if (box) box.textContent = messages[key][currentLang()];
    var input = field.querySelector('input,select,textarea');
    if (input) input.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    field.classList.remove('invalid');
    field.removeAttribute('data-err-key');
    var input = field.querySelector('input,select,textarea');
    if (input) input.removeAttribute('aria-invalid');
  }

  // expose for language switch re-render
  window.showError = showError;

  function validateField(field) {
    var input = field.querySelector('input,select,textarea');
    if (!input) return true;
    var val = (input.value || '').trim();
    var type = input.getAttribute('data-validate');

    if (input.hasAttribute('required') && !val) {
      showError(field, input.tagName === 'SELECT' ? 'select' : 'required');
      return false;
    }
    if (val && type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
      showError(field, 'email');
      return false;
    }
    if (val && type === 'phone' && !/^[+()\-\s0-9]{7,20}$/.test(val)) {
      showError(field, 'phone');
      return false;
    }
    clearError(field);
    return true;
  }

  function wireForm(form, onValid) {
    if (!form) return;
    // block native validation UI
    form.setAttribute('novalidate', 'novalidate');

    form.querySelectorAll('.field:not(.row)').forEach(function (field) {
      var input = field.querySelector('input,select,textarea');
      if (!input) return;
      input.addEventListener('blur', function () { validateField(field); });
      input.addEventListener('input', function () {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var firstBad = null;
      form.querySelectorAll('.field:not(.row)').forEach(function (field) {
        if (!validateField(field)) { ok = false; if (!firstBad) firstBad = field; }
      });

      var success = form.querySelector('.form-success');
      var error = form.querySelector('.form-error');
      if (error) error.classList.remove('show');
      if (!ok) {
        if (success) success.classList.remove('show');
        if (firstBad) {
          var fi = firstBad.querySelector('input,select,textarea');
          if (fi) fi.focus();
        }
        return;
      }
      onValid(form, success, error);
    });
  }

  function showFormSuccess(form, success) {
    form.reset();
    if (success) {
      success.classList.add('show');
      success.setAttribute('role', 'status');
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
  }

  wireForm(document.getElementById('contact-form'), function (form, success) {
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value) return; // honeypot tripped, drop silently
    showFormSuccess(form, success);
  });

  /* ---------------------------------------------------------
     6b. LEAD MAGNET FORM (days-calendar.html)
     Posts the pick to a Zapier "Catch Hook" webhook. Set up a
     Zap there that reads the "industry" field and emails back
     the matching file. Paste the Catch Hook URL below once
     that Zap exists — until then, submissions are only logged
     to the console so the form still demoes correctly.
     --------------------------------------------------------- */
  var LEAD_WEBHOOK_URL = ''; // e.g. https://hooks.zapier.com/hooks/catch/XXXXXXX/XXXXXXX/

  var leadIndustrySelect = document.getElementById('l-industry');
  var leadOtherField = document.getElementById('l-industry-other-field');
  var leadOtherInput = document.getElementById('l-industry-other');
  if (leadIndustrySelect && leadOtherField && leadOtherInput) {
    leadIndustrySelect.addEventListener('change', function () {
      var isOther = leadIndustrySelect.value === 'other';
      leadOtherField.hidden = !isOther;
      if (isOther) {
        leadOtherInput.setAttribute('required', 'required');
      } else {
        leadOtherInput.removeAttribute('required');
        leadOtherInput.value = '';
        clearError(leadOtherField);
      }
    });
  }

  wireForm(document.getElementById('lead-form'), function (form, success, error) {
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value) return; // honeypot tripped, drop silently

    var data = {
      industry: form.querySelector('[name="industry"]').value,
      industryOther: form.querySelector('[name="industryOther"]').value,
      title: form.querySelector('[name="title"]').value,
      email: form.querySelector('[name="email"]').value,
      page: location.href,
      submittedAt: new Date().toISOString()
    };

    if (!LEAD_WEBHOOK_URL) {
      console.warn('Lead form: set LEAD_WEBHOOK_URL in script.js to enable real submissions.', data);
      showFormSuccess(form, success);
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error('bad response');
      showFormSuccess(form, success);
    }).catch(function () {
      if (error) error.classList.add('show');
    }).finally(function () {
      if (btn) btn.disabled = false;
    });
  });

  /* ---------------------------------------------------------
     6c. BOOTH INQUIRY FORM (booths.html)
     No backend needed: opens a prefilled mailto: to sales@moodevent.net
     with the submitted details.
     --------------------------------------------------------- */
  wireForm(document.getElementById('booth-lead-form'), function (form, success) {
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value) return; // honeypot tripped, drop silently

    var name = form.querySelector('[name="name"]').value;
    var company = form.querySelector('[name="company"]').value;
    var email = form.querySelector('[name="email"]').value;
    var phone = form.querySelector('[name="phone"]').value;
    var message = form.querySelector('[name="message"]').value;

    var subject = encodeURIComponent('Booth inquiry from ' + (company || name));
    var body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Company: ' + company + '\n' +
      'Email: ' + email + '\n' +
      'Phone: ' + phone + '\n\n' +
      message
    );
    window.location.href = 'mailto:sales@moodevent.net?subject=' + subject + '&body=' + body;

    showFormSuccess(form, success);
  });

  /* ---------------------------------------------------------
     7. FOOTER YEAR
     --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     8. INIT · Arabic first
     --------------------------------------------------------- */
  setLanguage('ar');
})();
