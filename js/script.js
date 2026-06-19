/* =========================================================
   Douja · Boutique Jupe Satin — Logique de la page
   ========================================================= */
(function () {
  "use strict";

  // ---- Configuration ----
  const PRICE = 3500;                 // Prix de la jupe (DA)
  const WHATSAPP = "213664319169";    // Numéro WhatsApp (format international sans +)
  const IG = "douja.19";              // Compte Instagram (pour les DM)

  // ⚙️ CAPTURE AUTOMATIQUE DES COMMANDES (email instantané, gratuit)
  // 1) Va sur https://web3forms.com → entre ton email → copie ta "Access Key"
  // 2) Colle-la ci-dessous entre les guillemets.
  // Tant que c'est vide, le site garde le mode WhatsApp/Instagram classique.
  const WEB3FORMS_KEY = "fa421a8a-3d5d-4038-bc05-737d66b4150d";

  // 📊 GOOGLE SHEETS (tableau de toutes les commandes) — optionnel
  // Colle ici l'URL de ton script Google Apps (voir LISEZ-MOI). Vide = désactivé.
  const GSHEET_URL = "https://script.google.com/macros/s/AKfycbyR8x8QAvX688LHqCj5le3AOW4fItWdXGT0R8b0zUopOnnuCxa29YXysxrUp7nOyFyH/exec";

  // ---- 58 wilayas avec frais de livraison (DA) [domicile, bureau/stopdesk] ----
  // Ajustez librement ces tarifs selon votre transporteur.
  const WILAYAS = [
    ["01 - Adrar", 800, 400], ["02 - Chlef", 600, 300], ["03 - Laghouat", 700, 400],
    ["04 - Oum El Bouaghi", 600, 350], ["05 - Batna", 600, 350], ["06 - Béjaïa", 550, 300],
    ["07 - Biskra", 650, 350], ["08 - Béchar", 800, 450], ["09 - Blida", 500, 300],
    ["10 - Bouira", 550, 300], ["11 - Tamanrasset", 1000, 600], ["12 - Tébessa", 650, 400],
    ["13 - Tlemcen", 650, 350], ["14 - Tiaret", 600, 350], ["15 - Tizi Ouzou", 550, 300],
    ["16 - Alger", 450, 250], ["17 - Djelfa", 700, 400], ["18 - Jijel", 600, 350],
    ["19 - Sétif", 550, 300], ["20 - Saïda", 650, 400], ["21 - Skikda", 600, 350],
    ["22 - Sidi Bel Abbès", 650, 350], ["23 - Annaba", 600, 350], ["24 - Guelma", 600, 350],
    ["25 - Constantine", 550, 300], ["26 - Médéa", 550, 300], ["27 - Mostaganem", 600, 350],
    ["28 - M'Sila", 650, 350], ["29 - Mascara", 650, 350], ["30 - Ouargla", 800, 450],
    ["31 - Oran", 550, 300], ["32 - El Bayadh", 800, 450], ["33 - Illizi", 1000, 600],
    ["34 - Bordj Bou Arréridj", 550, 300], ["35 - Boumerdès", 500, 300], ["36 - El Tarf", 650, 400],
    ["37 - Tindouf", 1000, 600], ["38 - Tissemsilt", 650, 400], ["39 - El Oued", 750, 450],
    ["40 - Khenchela", 650, 400], ["41 - Souk Ahras", 650, 400], ["42 - Tipaza", 500, 300],
    ["43 - Mila", 600, 350], ["44 - Aïn Defla", 600, 350], ["45 - Naâma", 800, 450],
    ["46 - Aïn Témouchent", 650, 350], ["47 - Ghardaïa", 750, 450], ["48 - Relizane", 600, 350],
    ["49 - El M'Ghair", 800, 450], ["50 - El Meniaa", 900, 500], ["51 - Ouled Djellal", 750, 400],
    ["52 - Bordj Badji Mokhtar", 1100, 650], ["53 - Béni Abbès", 900, 500], ["54 - Timimoun", 950, 550],
    ["55 - Touggourt", 800, 450], ["56 - Djanet", 1100, 650], ["57 - In Salah", 1000, 600],
    ["58 - In Guezzam", 1100, 650]
  ];

  // ---- État de la commande ----
  const state = {
    color: "Bordeaux",
    colorHex: "#6e2a40",
    size: "M",
    qty: 1,
    delivery: "domicile",
    fees: null // [domicile, stopdesk] de la wilaya choisie
  };

  // ---- Raccourcis ----
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const fmt = (n) => n.toLocaleString("fr-FR") + " DA";

  // ---- Année footer ----
  $("#year").textContent = new Date().getFullYear();

  // =========================================================
  // i18n — Français / العربية (RTL)
  // =========================================================
  let lang = (function () { try { return localStorage.getItem("douja_lang") || "fr"; } catch (e) { return "fr"; } })();
  const langBtn = $("#langBtn");

  // Dictionnaire arabe (le français est le texte d'origine du HTML)
  const AR = {
    "ann.cod": "✦ الدفع عند الاستلام", "ann.deliver": "✦ التوصيل إلى 58 ولاية",
    "ann.satin": "✦ ساتان فاخر · انسدال ناعم", "ann.exchange": "✦ تبديل سهل",
    "nav.product": "المنتج", "nav.reviews": "الآراء", "nav.sizes": "دليل المقاسات", "nav.faq": "الأسئلة",
    "cta.order": "اطلبي الآن",
    "promo.txt": "🎉 عرض الإطلاق <b>−22٪</b> · 3500 دج بدل 4500 دج — ينتهي خلال",
    "cd.hours": "ساعة", "cd.min": "دقيقة", "cd.sec": "ثانية",
    "hero.eyebrow": "تشكيلة جديدة · إصدار الساتان",
    "hero.title": "تنورة الساتان التي<br><em>تُبرز جمال كل قوام</em>",
    "hero.lede": "ساتان ناعم بانسدال حريري، بخصر عالٍ يُنحّف القوام ويناسب كل إطلالاتك — من اليومي إلى أرقى المناسبات.",
    "price.note": "الدفع عند الاستلام",
    "hero.cta1": "اطلبي الآن", "hero.cta2": "اكتشفي المنتج",
    "hero.trust1": "توصيل 58 ولاية", "hero.trust2": "الدفع عند الاستلام", "hero.trust3": "تبديل سهل",
    "hero.badge": "★ 4,9 / 5 · +240 زبونة", "hero.chip": "ساتان فاخر",
    "trust.fast.t": "توصيل سريع", "trust.fast.s": "في كل الجزائر · 2 إلى 4 أيام",
    "trust.cod.t": "الدفع عند الاستلام", "trust.cod.s": "تدفعين عند الاستلام",
    "trust.qual.t": "جودة مضمونة", "trust.qual.s": "ساتان فاخر مُراقَب",
    "trust.exch.t": "تبديل سهل", "trust.exch.s": "المقاس أو اللون عند الحاجة",
    "prod.eyebrow": "دوجة · القطعة المميزة", "prod.title": "تنورة ساتان فاخرة",
    "prod.rating": "4,9 · 240 رأي موثّق",
    "stock.pre": "🔥 الكمية محدودة — تبقّى فقط", "stock.mid": "قطعة باللون",
    "prod.desc": "تنورة بخصر عالٍ من الساتان، انسيابية ومنسّقة في آن واحد. القماش ينساب بجمال، يعكس الضوء ويُبرز القوام دون أن يَشِفّ. قصّة كلاسيكية تُلبَس مع توب أو قميص أو بلوزة حسب الموسم.",
    "opt.color": "اللون:", "opt.size": "المقاس:", "opt.guide": "دليل المقاسات",
    "cta.orderThis": "اطلبي هذه التنورة — 3500 دج",
    "prod.p1": "ساتان ناعم، انسيابي ومريح",
    "prod.p2": "خصر عالٍ مطّاطي، راحة طوال اليوم",
    "prod.p3": "بطانة داخلية غير شفّافة",
    "prod.p4": "قابلة للغسل في الغسالة، برنامج لطيف",
    "feat.eyebrow": "لماذا ستحبّينها", "feat.head": "التفاصيل التي تصنع الفرق",
    "feat1.t": "ساتان فاخر", "feat1.p": "قماش مختار لِلمعانه الراقي وملمسه الحريري الذي لا يخيّب على أرض الواقع.",
    "feat2.t": "قصّة تُجمّل القوام", "feat2.p": "خصر عالٍ يُنحّف، وطول ميدي يُطيل الساق. إطلالة أنيقة دون أي جهد.",
    "feat3.t": "لا تخرج عن الموضة", "feat3.p": "من العمل إلى السهرة، تتأقلم مع كل المناسبات. قطعة أساسية أنيقة لمواسم عديدة.",
    "feat4.t": "6 ألوان", "feat4.p": "خمري، أسود، كحلي، زمردي، شامبانيا، وردي فاتح. اختاري لونكِ.",
    "looks.eyebrow": "إلهام", "looks.head": "كيف تنسّقينها",
    "look1.tag": "في العمل", "look1.t": "أناقة ومهنية", "look1.p": "مع قميص أبيض وحذاء كعب. إطلالة مرتّبة وأنيقة للعمل.",
    "look2.tag": "في السهرة", "look2.t": "بريق المساء", "look2.p": "توب ساتان، كعب عالٍ ومجوهرات ذهبية. الساتان يعكس الضوء لإطلالة ساحرة.",
    "look3.tag": "كاجوال", "look3.t": "كاجوال ومريح", "look3.p": "مع بلوزة واسعة وحذاء رياضي أبيض. راحة وأناقة لليومي.",
    "guide.eyebrow": "اعرفي مقاسكِ", "guide.head": "دليل المقاسات",
    "guide.p": "القياسات بالسنتيمتر. إذا ترددتِ بين مقاسين، اختاري الأكبر لمزيد من الراحة. عندكِ سؤال؟ راسلينا وننصحكِ.",
    "guide.btn": "اطلبي نصيحة عبر واتساب",
    "th.size": "المقاس", "th.waist": "محيط الخصر", "th.hip": "محيط الورك", "th.len": "الطول",
    "rev.eyebrow": "اعتمدنها", "rev.head": "آراء زبوناتنا",
    "rev1.p": "«القماش رائع، أجمل من الصورة. الانسدال مثالي، أشعر بالأناقة.»", "rev1.who": "أميرة · الجزائر",
    "rev2.p": "«وصلت في 3 أيام إلى وهران، دفعت عند الاستلام. مقاس M مناسب تماماً لجسمي. أنصح بها 100٪.»", "rev2.who": "لينا · وهران",
    "rev3.p": "«أخذت الخمري والأسود. جودة ممتازة مقابل السعر، تبدو فاخرة. شكراً دوجة!»", "rev3.who": "نسرين · قسنطينة",
    "order.eyebrow": "اطلبي في دقيقة", "order.head": "أكملي طلبكِ",
    "order.sub": "املئي الاستمارة وسنتصل بكِ للتأكيد. <strong>الدفع عند الاستلام.</strong>",
    "f.name": "الاسم واللقب", "f.phone": "رقم الهاتف", "f.wilaya": "الولاية", "f.commune": "البلدية / المدينة",
    "f.delivery": "طريقة التوصيل", "f.color": "اللون", "f.size": "المقاس", "f.qty": "الكمية",
    "f.note": "ملاحظة (اختياري)", "f.submit": "تأكيد الطلب",
    "f.reassure": "بدون تسبيق. تدفعين فقط عند استلام الطرد.",
    "del.home.t": "إلى المنزل", "del.home.d": "يصلكِ إلى بيتكِ",
    "del.desk.t": "إلى المكتب (Stop Desk)", "del.desk.d": "الاستلام من نقطة التوصيل",
    "ph.name": "مثال: أميرة بن علي", "ph.phone": "0X XX XX XX XX", "ph.commune": "مثال: باب الزوار",
    "ph.note": "نقطة دلالة، تفضيل…", "ph.wilaya": "اختاري ولايتكِ",
    "col.bordeaux": "خمري", "col.noir": "أسود", "col.bleu": "كحلي", "col.emeraude": "زمردي", "col.champagne": "شامبانيا", "col.rose": "وردي فاتح",
    "sum.title": "ملخّص الطلب", "sum.prodName": "تنورة ساتان فاخرة",
    "sum.unit": "سعر الوحدة", "sum.qty": "الكمية", "sum.sub": "المجموع الفرعي",
    "sum.ship": "التوصيل", "sum.total": "المبلغ الإجمالي", "sum.cod": "💵 الدفع عند الاستلام",
    "sum.a1": "✓ الطرد مفحوص قبل الإرسال", "sum.a2": "✓ تبديل عند مشكلة في المقاس", "sum.a3": "✓ خدمة زبائن سريعة",
    "faq.eyebrow": "أسئلة شائعة", "faq.head": "نجيب عن كل شيء",
    "q1": "كيف تتم عملية الدفع؟", "a1": "تدفعين نقداً عند استلام الطرد. لا تسبيق ولا بطاقة بنكية.",
    "q2": "ما هي مدة التوصيل؟", "a2": "من 2 إلى 4 أيام عمل حسب ولايتكِ. نتصل بكِ للتأكيد قبل الإرسال.",
    "q3": "وإذا لم يناسب المقاس؟", "a3": "لا تقلقي: ننظّم تبديل المقاس أو اللون. تواصلي معنا عبر واتساب أو إنستغرام.",
    "q4": "هل القماش شفّاف؟", "a4": "لا. التنورة مبطّنة من الداخل لمظهر معتم ومريح.",
    "q5": "هل توصّلون لكل الجزائر؟", "a5": "نعم، نوصّل إلى 58 ولاية، إلى المنزل أو المكتب (stop desk).",
    "cta.head": "امنحي نفسكِ أناقة الساتان", "cta.p": "3500 دج · الدفع عند الاستلام · 58 ولاية", "cta.btn": "أطلب تنورتي",
    "insta.head": "تابعينا على إنستغرام", "insta.p": "جديدنا، إطلالات وكواليس — انضمّي إلى مجتمع دوجة.", "insta.btn": "زيارة حساب إنستغرام",
    "foot.brandP": "موضة نسائية · قطع ساتان مختارة بعناية. توصيل لكل الجزائر.",
    "foot.shop": "المتجر", "foot.contact": "اتصال",
    "foot.l1": "تنورة ساتان فاخرة", "foot.l2": "دليل المقاسات", "foot.l3": "آراء الزبونات", "foot.l4": "الأسئلة",
    "foot.rights": "كل الحقوق محفوظة.", "foot.cod": "الدفع عند الاستلام · 58 ولاية",
    "mb.name": "تنورة ساتان", "mb.order": "اطلبي",
    "modal.title": "تم استلام الطلب! 🎉",
    "modal.hint": "أرسلي طلبكِ للتأكيد — اختاري واتساب أو إنستغرام:",
    "modal.wa": "إرسال عبر واتساب", "modal.ig": "اطلبي عبر إنستغرام",
    "modal.copied": "✓ تم نسخ الطلب! الصقيه (ضغط مطوّل) في رسالة إنستغرام ثم أرسليه.",
    "modal.close": "إغلاق"
  };

  // Textes dynamiques (générés par JS) — fr/ar
  const STR = {
    calc: { fr: "À calculer", ar: "يُحتسب لاحقاً" },
    free: { fr: "OFFERTE", ar: "مجاني" },
    home: { fr: "domicile", ar: "منزل" },
    desk: { fr: "bureau", ar: "مكتب" },
    taille: { fr: "Taille", ar: "مقاس" },
    bundleDef: { fr: 'Ajoutez une 2<sup>e</sup> jupe et la <strong>livraison est offerte</strong> !', ar: 'أضيفي تنورة ثانية و<strong>التوصيل مجاني</strong>!' },
    bundleHit: { fr: '🎉 <strong>Livraison offerte</strong> appliquée à votre commande !', ar: '🎉 تم تطبيق <strong>التوصيل المجاني</strong> على طلبكِ!' },
    errName: { fr: "Indiquez votre nom complet.", ar: "أدخلي اسمكِ الكامل." },
    errPhone: { fr: "Numéro invalide (ex. 0X XX XX XX XX).", ar: "رقم غير صحيح (مثال: 06 XX XX XX XX)." },
    errWilaya: { fr: "Choisissez votre wilaya.", ar: "اختاري ولايتكِ." },
    errCommune: { fr: "Indiquez votre commune/ville.", ar: "أدخلي بلديتكِ/مدينتكِ." },
    spFrom: { fr: "de", ar: "من" },
    spJust: { fr: "vient de commander", ar: "طلبت للتو" },
    spAgo: { fr: "il y a", ar: "قبل" },
    spMin: { fr: "min · ✔ vérifié", ar: "دقيقة · ✔ موثّق" },
    mThanks: { fr: "Merci", ar: "شكراً" },
    mBody: { fr: ". Votre commande est bien enregistrée. Nous vous appelons très vite au", ar: "! تم تسجيل طلبكِ بنجاح. سنتصل بكِ قريباً على الرقم" },
    mBodyEnd: { fr: "pour la confirmer.", ar: "للتأكيد." },
    mProduct: { fr: "Produit", ar: "المنتج" },
    mItemName: { fr: "Jupe Satin", ar: "تنورة ساتان" },
    mQty: { fr: "Quantité", ar: "الكمية" },
    mShip: { fr: "Livraison", ar: "التوصيل" },
    mTotal: { fr: "Total", ar: "الإجمالي" },
    sending: { fr: "Envoi…", ar: "جارٍ الإرسال…" },
    titleAuto: { fr: "Commande envoyée ! ✅", ar: "تم إرسال الطلب! ✅" },
    titleManual: { fr: "Commande reçue ! 🎉", ar: "تم استلام الطلب! 🎉" },
    hintAuto: { fr: "✅ Nous avons bien reçu votre commande, on vous appelle très vite pour confirmer. Vous pouvez aussi nous écrire directement :", ar: "✅ لقد استلمنا طلبكِ، سنتصل بكِ قريباً للتأكيد. يمكنكِ أيضاً مراسلتنا مباشرة:" },
    hintManual: { fr: "Envoyez votre commande pour la valider — choisissez WhatsApp ou Instagram :", ar: "أرسلي طلبكِ للتأكيد — اختاري واتساب أو إنستغرام:" }
  };
  const L = (o) => (o[lang] != null ? o[lang] : o.fr);

  const COLOR_AR = { "Bordeaux": "خمري", "Noir": "أسود", "Bleu nuit": "كحلي", "Émeraude": "زمردي", "Champagne": "شامبانيا", "Rose poudré": "وردي فاتح" };
  const colorLabel = (name) => (lang === "ar" ? (COLOR_AR[name] || name) : name);

  // Capture du texte français d'origine
  const i18nEls = $$("[data-i18n]");
  i18nEls.forEach((el) => { el.__fr = el.innerHTML; });
  const phEls = $$("[data-i18n-ph]");
  phEls.forEach((el) => { el.__frph = el.getAttribute("placeholder") || ""; });

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("douja_lang", l); } catch (e) {}
    const rtl = (l === "ar");
    document.documentElement.lang = rtl ? "ar" : "fr";
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    i18nEls.forEach((el) => {
      const k = el.getAttribute("data-i18n");
      el.innerHTML = rtl ? (AR[k] != null ? AR[k] : el.__fr) : el.__fr;
    });
    phEls.forEach((el) => {
      const k = el.getAttribute("data-i18n-ph");
      el.setAttribute("placeholder", rtl ? (AR[k] != null ? AR[k] : el.__frph) : el.__frph);
    });
    if (langBtn) langBtn.textContent = rtl ? "FR" : "العربية";
    if (typeof updateStock === "function") updateStock(state.color);
    if (typeof updateSummary === "function") updateSummary();
  }

  // =========================================================
  // Illustration SVG de la jupe satin (s'adapte à la couleur --c)
  // =========================================================
  // Contour d'une jupe satin midi, taille haute, ligne A avec ourlet drapé
  const SKIRT_PATH =
    "M168 176 C152 254 134 334 120 416 C117 432 122 450 134 452 " +
    "Q152 458 170 446 Q186 436 200 448 Q214 460 230 446 Q248 458 266 452 " +
    "C278 450 283 432 280 416 C266 334 248 254 232 176 Z";
  const WAIST_PATH = "M163 152 Q200 141 237 152 L232 178 Q200 188 168 178 Z";

  const SKIRT_DEFS =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="satLight" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#fff" stop-opacity="0.55"/>' +
    '<stop offset="0.38" stop-color="#fff" stop-opacity="0.05"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity="0.32"/></linearGradient>' +
    '<linearGradient id="satSide" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#000" stop-opacity="0.34"/>' +
    '<stop offset="0.22" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="0.78" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity="0.34"/></linearGradient>' +
    '<linearGradient id="satSheen" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0.30" stop-color="#fff" stop-opacity="0"/>' +
    '<stop offset="0.49" stop-color="#fff" stop-opacity="0.5"/>' +
    '<stop offset="0.63" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    "</defs></svg>";

  const SKIRT =
    '<svg class="skirt" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
    // ombre portée au sol
    '<ellipse cx="200" cy="470" rx="92" ry="13" fill="#000" opacity="0.09"/>' +
    // corps de la jupe
    '<path d="' + SKIRT_PATH + '" fill="var(--c,#6e2a40)"/>' +
    '<path d="' + SKIRT_PATH + '" fill="url(#satLight)"/>' +
    '<path d="' + SKIRT_PATH + '" fill="url(#satSide)"/>' +
    // plis (ombres)
    '<g fill="#000" opacity="0.13">' +
    '<path d="M186 180 C180 262 170 344 160 442 L168 444 C178 348 188 264 194 181 Z"/>' +
    '<path d="M214 181 C220 264 230 348 240 444 L232 442 C222 344 212 262 206 180 Z"/>' +
    '<path d="M151 232 C141 302 133 362 127 432 L133 434 C140 364 148 304 158 234 Z"/>' +
    '<path d="M249 234 C259 304 267 364 273 434 L267 432 C260 362 252 302 242 232 Z"/></g>' +
    // plis (lumières)
    '<g fill="#fff" opacity="0.2">' +
    '<path d="M200 180 L200 448 L206 446 C205 344 205 262 206 181 Z"/>' +
    '<path d="M173 212 C165 294 157 362 151 434 L156 434 C163 362 171 294 179 213 Z"/>' +
    '<path d="M227 213 C235 294 243 362 249 434 L244 434 C237 362 229 294 221 212 Z"/></g>' +
    // reflet satiné diagonal
    '<path d="' + SKIRT_PATH + '" fill="url(#satSheen)"/>' +
    // ceinture taille haute
    '<path d="' + WAIST_PATH + '" fill="var(--c,#6e2a40)"/>' +
    '<path d="' + WAIST_PATH + '" fill="#000" opacity="0.22"/>' +
    '<path d="M163 152 Q200 146 237 152 L236 157 Q200 151 164 157 Z" fill="#fff" opacity="0.28"/>' +
    '<path d="M198 154 L202 154 L201 186 L199 186 Z" fill="#000" opacity="0.18"/>' +
    "</svg>";

  // Injecter les dégradés partagés une seule fois
  document.body.insertAdjacentHTML("afterbegin", SKIRT_DEFS);

  // Placer l'illustration dans chaque bloc photo (sauf si une vraie image est définie)
  $$(".product-photo").forEach((el) => {
    if (el.getAttribute("style") && el.getAttribute("style").includes("--img")) return;
    if (el.dataset.color) el.style.setProperty("--c", el.dataset.color);
    el.insertAdjacentHTML("beforeend", SKIRT);
  });

  // =========================================================
  // Apparition au défilement (IntersectionObserver)
  // =========================================================
  const revealEls = [
    ".hero__copy", ".hero__visual", ".trust", ".product__gallery", ".product__info",
    ".feature", ".guide__intro", ".guide__table-wrap", ".review",
    ".order__form-wrap", ".order__summary", ".accordion details", ".cta-final__inner"
  ].flatMap((s) => $$(s));
  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    if (i % 3 === 1) el.classList.add("d1");
    if (i % 3 === 2) el.classList.add("d2");
  });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // =========================================================
  // Remplir la liste des wilayas
  // =========================================================
  const wilayaSelect = $("#wilaya");
  WILAYAS.forEach((w, i) => {
    const opt = document.createElement("option");
    opt.value = w[0];
    opt.textContent = w[0];
    opt.dataset.dom = w[1];
    opt.dataset.desk = w[2];
    opt.dataset.index = i;
    wilayaSelect.appendChild(opt);
  });

  // =========================================================
  // Sélecteur de couleurs (produit) + miroir vers le formulaire
  // =========================================================
  const colorName = $("#colorName");
  const mainPhoto = $("#mainPhoto");
  const heroPhoto = $("#heroPhoto");
  const summaryPhoto = $("#summaryPhoto");
  const orderColor = $("#orderColor");

  // Stock limité par couleur (pour l'effet de rareté)
  const STOCK = { "Bordeaux": 7, "Noir": 5, "Bleu nuit": 9, "Émeraude": 4, "Champagne": 6, "Rose poudré": 8 };
  function updateStock(name) {
    const left = STOCK[name] != null ? STOCK[name] : 6;
    const cEl = $("#stockColor"), lEl = $("#stockLeft"), fEl = $("#stockFill"), nEl = $("#colorName");
    if (cEl) cEl.textContent = colorLabel(name);
    if (nEl) nEl.textContent = colorLabel(name);
    if (lEl) lEl.textContent = left;
    if (fEl) fEl.style.width = Math.max(12, Math.min(100, Math.round(left / 15 * 100))) + "%";
  }

  function applyColor(hex, name) {
    state.color = name;
    state.colorHex = hex;
    [mainPhoto, heroPhoto, summaryPhoto].forEach((el) => el && el.style.setProperty("--c", hex));
    if (orderColor.value !== name) orderColor.value = name;
    updateStock(name);
    updateSummary();
  }

  $$("#swatches .swatch").forEach((sw) => {
    sw.addEventListener("click", () => {
      $$("#swatches .swatch").forEach((s) => {
        s.classList.remove("is-active");
        s.setAttribute("aria-checked", "false");
      });
      sw.classList.add("is-active");
      sw.setAttribute("aria-checked", "true");
      applyColor(getComputedStyle(sw).getPropertyValue("--c").trim() || sw.style.getPropertyValue("--c"), sw.dataset.name);
    });
  });

  // Synchroniser le select couleur du formulaire -> swatches
  orderColor.addEventListener("change", () => {
    const sw = $$("#swatches .swatch").find((s) => s.dataset.name === orderColor.value);
    if (sw) sw.click();
  });

  // =========================================================
  // Vignettes (changent la couleur de la photo principale)
  // =========================================================
  $$("#thumbs .thumb").forEach((th) => {
    th.addEventListener("click", () => {
      $$("#thumbs .thumb").forEach((t) => t.classList.remove("is-active"));
      th.classList.add("is-active");
      const c = th.dataset.color;
      if (c) mainPhoto.style.setProperty("--c", c);
    });
  });

  // =========================================================
  // Sélecteur de taille + miroir
  // =========================================================
  const sizeName = $("#sizeName");
  const orderSize = $("#orderSize");

  function applySize(size) {
    state.size = size;
    sizeName.textContent = size;
    if (orderSize.value !== size) orderSize.value = size;
    updateSummary();
  }

  $$("#sizes .size").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#sizes .size").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-checked", "true");
      applySize(btn.dataset.size);
    });
  });
  orderSize.addEventListener("change", () => {
    const b = $$("#sizes .size").find((x) => x.dataset.size === orderSize.value);
    if (b) b.click();
  });

  // =========================================================
  // Quantité (stepper)
  // =========================================================
  const qtyInput = $("#qty");
  $$(".stepper__btn").forEach((b) => {
    b.addEventListener("click", () => {
      const step = parseInt(b.dataset.step, 10);
      let v = parseInt(qtyInput.value, 10) + step;
      v = Math.max(1, Math.min(10, v));
      qtyInput.value = v;
      state.qty = v;
      updateSummary();
    });
  });

  // =========================================================
  // Livraison (domicile / stopdesk)
  // =========================================================
  const deliveryCards = $$("#delivery .radio-card");
  deliveryCards.forEach((card) => {
    const input = card.querySelector("input");
    input.addEventListener("change", () => {
      deliveryCards.forEach((c) => c.classList.remove("is-active"));
      card.classList.add("is-active");
      state.delivery = input.value;
      updateSummary();
    });
  });

  // Mettre à jour les frais quand la wilaya change
  wilayaSelect.addEventListener("change", () => {
    const opt = wilayaSelect.selectedOptions[0];
    if (opt && opt.dataset.dom) {
      state.fees = [parseInt(opt.dataset.dom, 10), parseInt(opt.dataset.desk, 10)];
      $('[data-fee="domicile"]').textContent = fmt(state.fees[0]);
      $('[data-fee="stopdesk"]').textContent = fmt(state.fees[1]);
      clearError("wilaya");
    }
    updateSummary();
  });

  // =========================================================
  // Récapitulatif + total en direct
  // =========================================================
  const FREE_SHIP_QTY = 2; // livraison offerte à partir de 2 jupes

  function shippingFee() {
    if (state.qty >= FREE_SHIP_QTY) return 0;     // offerte
    if (!state.fees) return null;                  // wilaya pas encore choisie
    return state.delivery === "domicile" ? state.fees[0] : state.fees[1];
  }

  function updateSummary() {
    const sub = PRICE * state.qty;
    const ship = shippingFee();
    const shipEl = $("#sumShip");

    $("#summaryVariant").textContent = `${colorLabel(state.color)} · ${L(STR.taille)} ${state.size}`;
    $("#sumQty").textContent = state.qty;
    $("#sumSub").textContent = fmt(sub);

    shipEl.classList.remove("ship-free");
    if (ship === 0) {
      shipEl.textContent = L(STR.free);
      shipEl.classList.add("ship-free");
      $("#sumWilaya").textContent = "";
      $("#sumTotal").textContent = fmt(sub);
    } else if (ship === null) {
      shipEl.textContent = L(STR.calc);
      $("#sumWilaya").textContent = "";
      $("#sumTotal").textContent = fmt(sub) + " +";
    } else {
      shipEl.textContent = fmt(ship);
      $("#sumWilaya").textContent = "(" + (state.delivery === "domicile" ? L(STR.home) : L(STR.desk)) + ")";
      $("#sumTotal").textContent = fmt(sub + ship);
    }

    // Nudge offre groupée
    const nudge = $("#bundleNudge");
    const nText = $("#bundleText");
    if (nudge && nText) {
      if (state.qty >= FREE_SHIP_QTY) {
        nudge.classList.add("is-hit");
        nText.innerHTML = L(STR.bundleHit);
      } else {
        nudge.classList.remove("is-hit");
        nText.innerHTML = L(STR.bundleDef);
      }
    }
  }

  // =========================================================
  // Validation du formulaire
  // =========================================================
  const form = $("#orderForm");

  function setError(name, msg) {
    const field = form.querySelector(`[name="${name}"]`).closest(".field");
    field.classList.add("invalid");
    const el = form.querySelector(`.error[data-for="${name}"]`);
    if (el) el.textContent = msg;
  }
  function clearError(name) {
    const ctrl = form.querySelector(`[name="${name}"]`);
    if (!ctrl) return;
    const field = ctrl.closest(".field");
    field.classList.remove("invalid");
    const el = form.querySelector(`.error[data-for="${name}"]`);
    if (el) el.textContent = "";
  }

  // Téléphone algérien : 10 chiffres commençant par 0 (05/06/07…) — souple
  function validPhone(v) {
    const digits = v.replace(/\s|-/g, "");
    return /^0[5-9][0-9]{8}$/.test(digits) || /^0[0-9]{8,9}$/.test(digits);
  }

  ["fullname", "phone", "commune"].forEach((n) => {
    form.querySelector(`[name="${n}"]`).addEventListener("input", () => clearError(n));
  });

  // Envoi automatique de la commande par email (Web3Forms)
  function sendOrderAuto(order) {
    if (!WEB3FORMS_KEY) return Promise.resolve(false); // non configuré
    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `🌸 Nouvelle commande Douja — ${order.name} (${order.total} DA)`,
      from_name: "Boutique Douja",
      "Nom": order.name,
      "Téléphone": order.phone,
      "Wilaya": order.wilaya,
      "Commune": order.commune,
      "Livraison": order.delivery,
      "Produit": "Jupe Satin Premium",
      "Couleur": order.color,
      "Taille": order.size,
      "Quantité": order.qty,
      "Sous-total": fmt(order.sub),
      "Frais livraison": order.ship === 0 ? "OFFERTE" : fmt(order.ship),
      "TOTAL": fmt(order.total),
      "Note": order.note || "—"
    };
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then((r) => r.json()).then((d) => !!d.success).catch(() => false);
  }

  // Envoi parallèle vers Google Sheets (tableau de suivi)
  function sendToSheet(order) {
    if (!GSHEET_URL) return Promise.resolve(false);
    const body = JSON.stringify({
      date: new Date().toLocaleString("fr-FR"),
      name: order.name, phone: order.phone, wilaya: order.wilaya, commune: order.commune,
      delivery: order.delivery, product: "Jupe Satin Premium",
      color: order.color, size: order.size, qty: order.qty,
      ship: order.ship === 0 ? "OFFERTE" : order.ship, total: order.total, note: order.note || ""
    });
    return fetch(GSHEET_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: body
    }).then(() => true).catch(() => false);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    const name = form.fullname.value.trim();
    const phone = form.phone.value.trim();
    const wilaya = form.wilaya.value;
    const commune = form.commune.value.trim();

    if (name.length < 3) { setError("fullname", L(STR.errName)); ok = false; }
    if (!validPhone(phone)) { setError("phone", L(STR.errPhone)); ok = false; }
    if (!wilaya) { setError("wilaya", L(STR.errWilaya)); ok = false; }
    if (commune.length < 2) { setError("commune", L(STR.errCommune)); ok = false; }

    if (!ok) {
      const firstInvalid = form.querySelector(".field.invalid input, .field.invalid select");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const ship = shippingFee() || 0;
    const sub = PRICE * state.qty;
    const total = sub + ship;

    const order = {
      name, phone, wilaya, commune,
      color: state.color, size: state.size, qty: state.qty,
      delivery: state.delivery === "domicile" ? "À domicile" : "Au bureau (Stop Desk)",
      note: form.note.value.trim(),
      sub, ship, total
    };

    // Sauvegarde locale (toujours)
    try {
      const all = JSON.parse(localStorage.getItem("douja_orders") || "[]");
      all.push({ ...order, date: new Date().toISOString() });
      localStorage.setItem("douja_orders", JSON.stringify(all));
    } catch (_) {}

    // Envoi auto puis confirmation
    const btn = $("#submitBtn");
    const btnTxt = btn.textContent;
    btn.disabled = true;
    btn.textContent = L(STR.sending);
    Promise.all([sendOrderAuto(order), sendToSheet(order)]).then((res) => {
      btn.disabled = false;
      btn.textContent = btnTxt;
      const captured = res[0] || res[1]; // email OU sheet réussi
      showConfirmation(order, captured);
    });
  });

  // =========================================================
  // Modal de confirmation + message WhatsApp
  // =========================================================
  const modal = $("#confirmModal");

  function buildOrderLines(o) {
    return [
      "🌸 Nouvelle commande — Douja",
      "",
      "👗 Jupe Satin Premium",
      `• Couleur : ${o.color}`,
      `• Taille : ${o.size}`,
      `• Quantité : ${o.qty}`,
      "",
      `👤 Nom : ${o.name}`,
      `📞 Tél : ${o.phone}`,
      `📍 Wilaya : ${o.wilaya}`,
      `🏠 Commune : ${o.commune}`,
      `🚚 Livraison : ${o.delivery}`,
      o.note ? `📝 Note : ${o.note}` : "",
      "",
      `Sous-total : ${fmt(o.sub)}`,
      `Livraison : ${o.ship === 0 ? "OFFERTE ✅" : fmt(o.ship)}`,
      `Total : ${fmt(o.total)}`,
      "💵 Paiement à la livraison"
    ].filter(Boolean).join("\n");
  }

  // Copie de texte (avec repli si le presse-papiers est bloqué, ex. fichier local)
  function copyText(t) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).catch(() => fallbackCopy(t));
        return;
      }
    } catch (e) {}
    fallbackCopy(t);
  }
  function fallbackCopy(t) {
    const ta = document.createElement("textarea");
    ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function showConfirmation(o, captured) {
    const first = o.name.split(" ")[0];
    const delLabel = lang === "ar"
      ? (state.delivery === "domicile" ? "إلى المنزل" : "إلى المكتب")
      : o.delivery;
    $("#modalBody").innerHTML =
      `${L(STR.mThanks)} <strong>${first}</strong>${L(STR.mBody)} <strong>${o.phone}</strong> ${L(STR.mBodyEnd)}`;

    // Le sous-titre s'adapte : commande déjà reçue (auto) ou à envoyer (manuel)
    const hintEl = $(".modal__hint");
    if (hintEl) hintEl.innerHTML = captured ? L(STR.hintAuto) : L(STR.hintManual);
    const modalTitle = $("#modalTitle");
    if (modalTitle) modalTitle.innerHTML = captured ? L(STR.titleAuto) : L(STR.titleManual);

    $("#modalRecap").innerHTML = `
      <div><span class="k">${L(STR.mProduct)}</span><span class="v">${L(STR.mItemName)} · ${colorLabel(o.color)} · ${o.size}</span></div>
      <div><span class="k">${L(STR.mQty)}</span><span class="v">${o.qty}</span></div>
      <div><span class="k">${L(STR.mShip)}</span><span class="v">${delLabel}</span></div>
      <div><span class="k">${L(STR.mTotal)}</span><span class="v">${fmt(o.total)}</span></div>
    `;
    const plain = buildOrderLines(o);
    $("#waConfirm").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(plain)}`;

    // Instagram : copie la commande puis ouvre les DM @douja.19
    const fb = $("#copyFeedback");
    if (fb) fb.hidden = true;
    const ig = $("#igConfirm");
    if (ig) {
      ig.href = "https://ig.me/m/" + IG;
      ig.onclick = function () {
        copyText(plain);
        if (fb) fb.hidden = false;
        // on laisse le lien s'ouvrir normalement (target=_blank)
      };
    }
    openModal();
  }

  let lastFocused = null;
  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // focus sur le 1er bouton d'action de la modale
    const first = modal.querySelector("#waConfirm");
    if (first) setTimeout(() => first.focus(), 30);
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) { closeModal(); return; }
    // piège de focus : Tab reste dans la modale
    if (e.key === "Tab" && modal.classList.contains("is-open")) {
      const f = $$('a[href], button:not([disabled])', modal).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // =========================================================
  // « Commander cette jupe » -> recopie couleur/taille puis scroll
  // =========================================================
  $("#toOrderBtn").addEventListener("click", () => {
    orderColor.value = state.color;
    orderSize.value = state.size;
    updateSummary();
  });

  // =========================================================
  // Compte à rebours promo (fenêtre glissante de 24 h)
  // =========================================================
  (function countdown() {
    const H = $("#cdH"), M = $("#cdM"), S = $("#cdS");
    if (!H) return;
    const KEY = "douja_promo_end";
    const setEnd = () => { const e = Date.now() + 24 * 3600 * 1000; localStorage.setItem(KEY, e); return e; };
    let end = parseInt(localStorage.getItem(KEY), 10);
    if (!end || isNaN(end) || end < Date.now()) end = setEnd();
    const pad = (n) => String(n).padStart(2, "0");
    function tick() {
      let d = end - Date.now();
      if (d <= 0) { end = setEnd(); d = end - Date.now(); }
      H.textContent = pad(Math.floor(d / 3600000));
      M.textContent = pad(Math.floor((d % 3600000) / 60000));
      S.textContent = pad(Math.floor((d % 60000) / 1000));
    }
    tick();
    setInterval(tick, 1000);
  })();

  // =========================================================
  // Notifications de preuve sociale
  // =========================================================
  (function socialProof() {
    const people = [
      { fr: ["Amira", "Alger"], ar: ["أميرة", "الجزائر"], i: "A" },
      { fr: ["Lina", "Oran"], ar: ["لينا", "وهران"], i: "L" },
      { fr: ["Nesrine", "Constantine"], ar: ["نسرين", "قسنطينة"], i: "N" },
      { fr: ["Sara", "Sétif"], ar: ["سارة", "سطيف"], i: "S" },
      { fr: ["Yasmine", "Annaba"], ar: ["ياسمين", "عنابة"], i: "Y" },
      { fr: ["Khadija", "Blida"], ar: ["خديجة", "البليدة"], i: "K" },
      { fr: ["Imene", "Tizi Ouzou"], ar: ["إيمان", "تيزي وزو"], i: "I" },
      { fr: ["Meriem", "Béjaïa"], ar: ["مريم", "بجاية"], i: "M" },
      { fr: ["Hana", "Tlemcen"], ar: ["هناء", "تلمسان"], i: "H" },
      { fr: ["Soumia", "Batna"], ar: ["سمية", "باتنة"], i: "S" },
      { fr: ["Rania", "Sidi Bel Abbès"], ar: ["رانيا", "سيدي بلعباس"], i: "R" },
      { fr: ["Wissam", "Mostaganem"], ar: ["وسام", "مستغانم"], i: "W" }
    ];
    let idx = Math.floor(Math.random() * people.length);
    let timer, hideTimer, stopped = false;

    const toast = document.createElement("div");
    toast.className = "sp-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);

    function render() {
      const p = people[idx % people.length];
      idx++;
      const [name, city] = lang === "ar" ? p.ar : p.fr;
      const mins = Math.floor(Math.random() * 28) + 2;
      toast.innerHTML =
        '<button class="sp-toast__x" aria-label="Fermer">×</button>' +
        '<span class="sp-toast__av">' + p.i + '</span>' +
        '<span class="sp-toast__txt"><b>' + name + '</b> <span>' + L(STR.spFrom) + ' ' + city + ' ' + L(STR.spJust) + '</span>' +
        '<span class="sp-toast__time">' + L(STR.spAgo) + ' ' + mins + ' ' + L(STR.spMin) + '</span></span>';
      toast.querySelector(".sp-toast__x").addEventListener("click", () => { stopped = true; hide(); });
      requestAnimationFrame(() => toast.classList.add("show"));
      hideTimer = setTimeout(hide, 5200);
    }
    function hide() { toast.classList.remove("show"); }
    function loop() { if (stopped) return; render(); timer = setTimeout(loop, 16000); }

    setTimeout(loop, 6000);
  })();

  // =========================================================
  // Bouton « retour en haut »
  // =========================================================
  (function backToTop() {
    const btn = $("#toTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 650);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  })();

  // =========================================================
  // Lien de navigation actif selon la section visible
  // =========================================================
  (function activeNav() {
    const links = $$(".nav a");
    if (!("IntersectionObserver" in window) || !links.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
        }
      });
    }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });
    ["produit", "avis", "guide", "faq"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  })();

  // =========================================================
  // Bascule de langue FR / العربية
  // =========================================================
  if (langBtn) {
    langBtn.addEventListener("click", () => setLang(lang === "ar" ? "fr" : "ar"));
  }

  // Initialisation
  updateStock(state.color);
  updateSummary();
  setLang(lang); // applique la langue mémorisée (FR par défaut)
})();
