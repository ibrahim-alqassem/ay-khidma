/* أي خدمة — منطق التطبيق */
"use strict";
const C = window.CONFIG;
const sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true } });

const SERVICES = [
  { id: "battery", name: "اشتراك بطارية", desc: "اشتراك أو تبديل بطارية", icon: "battery" },
  { id: "fuel",    name: "تزويد البنزين",  desc: "توصيل وقود ٩١ أو ٩٥ أو ديزل", icon: "fuel" },
  { id: "tire",    name: "تبديل الإطار",   desc: "تركيب الاحتياطي أو رقعة", icon: "tire" },
  { id: "tow",     name: "خدمة سحب",       desc: "سطحة لنقل السيارة", icon: "tow" },
  { id: "lock",    name: "فتح سيارة مقفلة", desc: "المفتاح داخل السيارة", icon: "key" },
  { id: "check",   name: "فحص وإصلاح سريع", desc: "فني متنقل يشخّص العطل", icon: "wrench" }
];
const svc = id => SERVICES.find(s => s.id === id) || { id, name: id, icon: "wrench", desc: "" };

const IC = {
  menu:'<path d="M4 7h16M8 12h12M11 17h9"/>', search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  gps:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  battery:'<rect x="3" y="7" width="16" height="11" rx="2"/><path d="M7 5v2M15 5v2M7 12.5h3M13 12.5h3M14.5 11v3"/>',
  fuel:'<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M3 21h12M6 9h6"/><path d="M14 11h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
  tire:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21"/>',
  tow:'<path d="M2 17h12V9h4l4 4v4h-2"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/><path d="M2 13 9 6"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14 9l2 2"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.3-6.3"/><path d="M14.7 6.3 9 1"/><path d="M3 21l6-6"/>',
  chev:'<path d="m15 6-6 6 6 6"/>', back:'<path d="m9 6 6 6-6 6"/>', x:'<path d="M6 6l12 12M18 6 6 18"/>',
  orders:'<path d="M4 7h16l-1.5 12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z"/><path d="M8 7a4 4 0 0 1 8 0"/>',
  store:'<path d="M3 9 5 4h14l2 5"/><path d="M4 9v11h16V9"/><path d="M3 9h18M9 20v-6h6v6"/>',
  chat:'<path d="M21 12a8 8 0 0 1-12 7l-5 1 1-4.5A8 8 0 1 1 21 12z"/>',
  heart:'<path d="M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9z"/>',
  lang:'<path d="M3 5h10M8 3v2M5 9c1 3 4 5 6 6M11 5c-1 5-4 8-7 9"/><path d="m13 21 4-9 4 9M14.5 18h5"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  plus:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
  share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8"/>',
  wa:'<path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 0 1-2.8-2.8l.8-1-1-2z"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  login:'<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H8"/>'
};
const ico = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ""}</svg>`;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ar = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
const toEn = s => String(s).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
const fmtDate = t => new Date(t).toLocaleString("ar-SA-u-ca-gregory-nu-arab", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const waLink = (num, msg) => `https://wa.me/${String(num).replace(/\D/g, "")}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;
const intl = p => "966" + String(p || "").replace(/\D/g, "").replace(/^0/, "");
const store = { get(k, d) { try { const v = localStorage.getItem("ak-" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
                set(k, v) { try { localStorage.setItem("ak-" + k, JSON.stringify(v)); } catch (e) {} } };

/* ===== الحالة ===== */
const app = document.getElementById("app");
let session = null, me = null, guest = store.get("guest", false);
let providers = [], myReqs = [], inReqs = [], notes = [];
let tab = "home", sheetOpen = false, filter = null, ordersTab = "mine";
let map = null, markers = null, meMarker = null, myPos = store.get("pos", null), channel = null;
let theme = store.get("theme", "system"), notifyOn = store.get("notify", true);
applyTheme();

function applyTheme() {
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
  const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0F1719" : "#0E5E63");
  if (map) setTiles();
}

/* ===== البداية ===== */
async function boot() {
  const { data } = await sb.auth.getSession();
  session = data.session;
  if (session) await afterLogin(); else if (guest) startShell(); else authScreen("login");
  sb.auth.onAuthStateChange(async (ev, s) => {
    if (ev === "PASSWORD_RECOVERY") { session = s; newPasswordBox(); return; }
    if (ev === "SIGNED_OUT") { session = null; me = null; cleanupRealtime(); return; }
    if (ev === "TOKEN_REFRESHED" || ev === "USER_UPDATED") session = s;
  });
}

async function afterLogin() {
  guest = false; store.set("guest", false);
  await loadMe();
  startShell();
  loadRequests(); loadNotes(); subscribe();
}

async function loadMe() {
  const { data } = await sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
  me = data;
  if (!me) { // احتياط لو لم ينشئه المشغّل
    const md = session.user.user_metadata || {};
    const ins = await sb.from("profiles").insert({ id: session.user.id, name: md.name || "", phone: md.phone || "" }).select().maybeSingle();
    me = ins.data || { id: session.user.id, name: md.name || "", phone: md.phone || "", is_provider: false, services: [] };
  }
}
async function loadProviders() {
  const { data, error } = await sb.from("profiles").select("id,name,phone,services,bio,district,lat,lng,active,is_provider").eq("is_provider", true).eq("active", true);
  if (!error) { providers = data || []; drawMarkers(); if (tab === "home") renderSheet(); }
}
async function loadRequests() {
  if (!session) return;
  const uid = session.user.id;
  const { data } = await sb.from("requests").select("*").or(`customer_id.eq.${uid},provider_id.eq.${uid}`).order("created_at", { ascending: false });
  myReqs = (data || []).filter(r => r.customer_id === uid);
  inReqs = (data || []).filter(r => r.provider_id === uid);
  if (tab === "orders" || tab === "account") renderPage();
}
async function loadNotes() {
  if (!session) return;
  const { data } = await sb.from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
  notes = data || []; renderNav(); if (tab === "notes" || tab === "account") renderPage();
}
function subscribe() {
  cleanupRealtime();
  channel = sb.channel("u-" + session.user.id)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${session.user.id}` }, p => {
      notes.unshift(p.new); renderNav(); if (tab === "notes") renderPage();
      toast(p.new.title); loadRequests();
      if (notifyOn && "Notification" in window && Notification.permission === "granted" && document.hidden) {
        try { new Notification(C.appName, { body: p.new.title + (p.new.body ? "\n" + p.new.body : ""), icon: "icon-192.png" }); } catch (e) {}
      }
    }).subscribe();
}
function cleanupRealtime() { if (channel) { sb.removeChannel(channel); channel = null; } }
const unread = () => notes.filter(n => !n.read).length;
const needLogin = (why) => { if (session) return false; confirmBox("سجّل دخولك أولاً", why || "تحتاج حساباً لهذه الخطوة. التسجيل بالبريد الإلكتروني ويأخذ دقيقة.", "تسجيل الدخول / حساب جديد", () => authScreen("login")); return true; };

/* ===== شاشة الدخول والتسجيل ===== */
function authScreen(mode) {
  cleanupRealtime(); map = null; meMarker = null; tiles = null;
  const signup = mode === "signup";
  app.innerHTML = `<div class="auth">
    <div class="brandmark"><div class="logo">${ico("tow")}</div><div><h1>${C.appName}</h1><p>${C.tagline}</p></div></div>
    <h2>${signup ? "حساب جديد" : "مرحباً بعودتك!"}</h2>
    <p class="sub">${signup ? "سجّل ببريدك الإلكتروني، ورقم جوالك للتواصل فقط" : "سجّل الدخول ببريدك الإلكتروني"}</p>
    <form class="form" id="aForm" novalidate>
      ${signup ? `<div class="in"><label for="aName">الاسم</label><input id="aName" autocomplete="name" placeholder="اسمك أو اسم نشاطك"></div>` : ""}
      <div class="in"><label for="aEmail">البريد الإلكتروني</label><input id="aEmail" type="email" class="ltr" autocomplete="email" placeholder="name@example.com"></div>
      ${signup ? `<div class="in"><label for="aPhone">رقم الجوال للتواصل</label><div class="phone"><span>+966</span><input id="aPhone" inputmode="numeric" maxlength="10" placeholder="5XXXXXXXX" autocomplete="tel-national"></div><div class="hint">يظهر لمن تتعامل معه للاتصال أو واتساب. لا نرسل رسائل نصية.</div></div>` : ""}
      <div class="in"><label for="aPass">كلمة المرور</label><input id="aPass" type="password" class="ltr" autocomplete="${signup ? "new-password" : "current-password"}" placeholder="٦ أحرف على الأقل"></div>
      <div class="err" id="aErr" role="alert"></div>
      ${signup ? `<p class="terms">بالمتابعة، أوافق على <button type="button" id="aTerms">الشروط والأحكام وسياسة الخصوصية</button></p>` : ""}
      <button class="btn" type="submit" id="aBtn">${signup ? "إنشاء الحساب" : "دخول"}</button>
      ${signup ? "" : `<button type="button" class="textlink center" id="aForgot">نسيت كلمة المرور؟</button>`}
      <p class="center" style="margin:0">${signup ? "لديك حساب؟" : "ليس لديك حساب؟"} <button type="button" class="textlink" id="aSwitch">${signup ? "سجّل الدخول" : "أنشئ حساباً"}</button></p>
      <button type="button" class="btn ghost" id="aGuest">تصفح الخدمات بدون حساب</button>
    </form></div>`;
  const $ = id => document.getElementById(id), err = $("aErr");
  $("aSwitch").onclick = () => authScreen(signup ? "login" : "signup");
  $("aGuest").onclick = () => { guest = true; store.set("guest", true); startShell(); };
  if ($("aTerms")) $("aTerms").onclick = termsBox;
  if ($("aPhone")) $("aPhone").oninput = e => e.target.value = toEn(e.target.value).replace(/\D/g, "").slice(0, 10);
  if ($("aForgot")) $("aForgot").onclick = async () => {
    const email = $("aEmail").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = "اكتب بريدك أولاً ثم اضغط «نسيت كلمة المرور»."; return; }
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
    err.style.color = error ? "" : "var(--ok)";
    err.textContent = error ? "تعذّر إرسال رابط الاستعادة الآن. تواصل معنا لنساعدك." : "أرسلنا رابط تغيير كلمة المرور إلى بريدك.";
  };
  $("aForm").onsubmit = async e => {
    e.preventDefault(); err.style.color = ""; err.textContent = "";
    const email = $("aEmail").value.trim(), pass = $("aPass").value;
    if (!/^\S+@\S+\.\S+$/.test(email)) return err.textContent = "اكتب بريداً إلكترونياً صحيحاً.";
    if (pass.length < 6) return err.textContent = "كلمة المرور ٦ أحرف على الأقل.";
    const btn = $("aBtn"); btn.disabled = true; btn.textContent = "لحظة…";
    let res;
    if (signup) {
      const name = $("aName").value.trim(), phone = $("aPhone").value.replace(/^0/, "");
      if (name.length < 2) { btn.disabled = false; btn.textContent = "إنشاء الحساب"; return err.textContent = "اكتب اسمك."; }
      if (!/^5\d{8}$/.test(phone)) { btn.disabled = false; btn.textContent = "إنشاء الحساب"; return err.textContent = "رقم الجوال يبدأ بـ 5 ويتكون من ٩ أرقام."; }
      res = await sb.auth.signUp({ email, password: pass, options: { data: { name, phone } } });
    } else res = await sb.auth.signInWithPassword({ email, password: pass });
    btn.disabled = false; btn.textContent = signup ? "إنشاء الحساب" : "دخول";
    if (res.error) {
      const m = res.error.message || "";
      err.textContent = /Invalid login/i.test(m) ? "البريد أو كلمة المرور غير صحيحة."
        : /registered|exists/i.test(m) ? "هذا البريد مسجّل من قبل. سجّل الدخول بدلاً من ذلك."
        : /rate|too many/i.test(m) ? "محاولات كثيرة. انتظر دقيقة ثم حاول."
        : /confirm/i.test(m) ? "فعّل حسابك من الرابط المرسل لبريدك أولاً."
        : "تعذّر الإكمال: " + m;
      return;
    }
    if (!res.data.session) { err.style.color = "var(--ok)"; err.textContent = "أرسلنا رابط التفعيل لبريدك. افتحه ثم سجّل الدخول."; return; }
    session = res.data.session; await afterLogin();
    if (signup) toast("أهلاً " + (me?.name || "") + "! حسابك جاهز");
  };
}

/* ===== الهيكل ===== */
function startShell() {
  map = null; meMarker = null; tiles = null;
  app.innerHTML = `
    <header class="top"><button class="iconbtn" id="menuBtn" aria-label="القائمة">${ico("menu")}</button><h1 id="title"></h1><span id="topEnd"></span></header>
    <main class="view map" id="mapView">
      <div id="map" aria-label="خريطة مقدمي الخدمات"></div>
      <div class="mapbar"><div class="chip grow" id="filterChip" hidden></div><span style="flex:1" id="spacer"></span><button class="fab" id="locBtn" aria-label="موقعي">${ico("gps")}</button></div>
      <section class="sheet closed" id="sheet" aria-label="الخدمات"></section>
    </main>
    <main class="view" id="pageView" hidden></main>
    <nav class="nav" id="nav" aria-label="التنقل"></nav>
    <div class="dscrim" id="dscrim"></div>
    <aside class="drawer" id="drawer" aria-label="القائمة الجانبية"></aside>`;
  document.getElementById("menuBtn").onclick = openDrawer;
  document.getElementById("dscrim").onclick = closeDrawer;
  document.getElementById("locBtn").onclick = () => locate(true);
  initMap(); loadProviders(); go(tab);
  if (myPos) placeMe(); else locate(false);
}

const TITLES = { home: "اطلب خدمة", notes: "الإشعارات", account: "حسابي", settings: "الإعدادات", orders: "الطلبات", contact: "تواصل معنا", about: "عن الموقع" };
function go(t) {
  if (["notes", "orders"].includes(t) && needLogin()) return;
  tab = t; closeDrawer();
  document.getElementById("title").textContent = TITLES[t];
  const isMap = t === "home";
  document.getElementById("mapView").hidden = !isMap;
  document.getElementById("pageView").hidden = isMap;
  if (isMap) { setTimeout(() => map && map.invalidateSize(), 50); renderSheet(); loadProviders(); }
  else renderPage();
  renderTop(); renderNav(); renderDrawer();
}
function renderTop() {
  const end = document.getElementById("topEnd");
  if (tab === "notes" && unread()) { end.innerHTML = `<button class="link" id="readAll">قراءة الكل</button>`; document.getElementById("readAll").onclick = markAllRead; }
  else if (tab === "home") { end.innerHTML = `<button class="iconbtn" id="searchBtn" aria-label="بحث">${ico("search")}</button>`; document.getElementById("searchBtn").onclick = searchBox; }
  else end.innerHTML = `<span style="display:inline-block;width:42px"></span>`;
}
function renderNav() {
  const nav = document.getElementById("nav"); if (!nav) return;
  const b = (t, i, l, n) => `<button data-tab="${t}" ${tab === t ? 'aria-current="page"' : ""}>${n ? `<span class="badge">${ar(n)}</span>` : ""}${ico(i)}<span>${l}</span></button>`;
  nav.innerHTML = b("home", "home", "الرئيسية") + b("notes", "bell", "الإشعارات", unread()) + b("account", "user", "حسابي") + b("settings", "gear", "الإعدادات");
  nav.querySelectorAll("[data-tab]").forEach(x => x.onclick = () => go(x.dataset.tab));
}
function renderDrawer() {
  const d = document.getElementById("drawer"); if (!d) return;
  const name = me?.name || "زائر", sub = session ? session.user.email : "تصفح بدون حساب";
  d.innerHTML = `<button class="iconbtn" id="closeDrawer" aria-label="إغلاق" style="color:inherit">${ico("x")}</button>
    <div class="who"><div class="avatar">${esc((name.trim()[0]) || "؟")}</div><b>${esc(name)}</b><span>${esc(sub)}</span></div>
    <nav>
      <button data-go="home">${ico("home")}<span>الرئيسية</span></button>
      <button data-go="orders">${ico("orders")}<span>الطلبات</span></button>
      <button data-go="mystore">${ico("store")}<span>${me?.is_provider ? "خدمتي" : "سجّل خدمتك"}</span></button>
      <button data-go="contact">${ico("chat")}<span>تواصل معنا</span></button>
      <button data-go="about">${ico("heart")}<span>عن الموقع</span></button>
    </nav>
    <div class="foot"><button data-go="install">أضف للشاشة الرئيسية</button>${session ? `<button id="logout">تسجيل الخروج</button>` : `<button id="loginD">تسجيل الدخول</button>`}</div>`;
  d.querySelector("#closeDrawer").onclick = closeDrawer;
  d.querySelectorAll("[data-go]").forEach(x => x.onclick = () => action(x.dataset.go));
  d.querySelector("#logout")?.addEventListener("click", () => { closeDrawer(); confirmBox("تسجيل الخروج", "يمكنك الدخول مرة أخرى ببريدك وكلمة المرور.", "تسجيل الخروج", logout); });
  d.querySelector("#loginD")?.addEventListener("click", () => authScreen("login"));
}
function openDrawer() { document.getElementById("drawer").classList.add("on"); document.getElementById("dscrim").classList.add("on"); }
function closeDrawer() { document.getElementById("drawer")?.classList.remove("on"); document.getElementById("dscrim")?.classList.remove("on"); }
function action(a) {
  closeDrawer();
  if (TITLES[a]) return go(a);
  if (a === "mystore") return providerSetup();
  if (a === "install") return installBox();
  if (a === "terms") return termsBox();
}
async function logout() { cleanupRealtime(); await sb.auth.signOut(); session = null; me = null; notes = []; myReqs = []; inReqs = []; guest = false; store.set("guest", false); tab = "home"; authScreen("login"); }

/* ===== الخريطة ===== */
let tiles = null;
function setTiles() {
  const dark = document.documentElement.getAttribute("data-theme") === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  if (tiles) map.removeLayer(tiles);
  tiles = L.tileLayer(`https://{s}.basemaps.cartocdn.com/${dark ? "dark_all" : "voyager"}/{z}/{x}/{y}{r}.png`, {
    maxZoom: 19, subdomains: "abcd", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
  }).addTo(map);
}
function initMap() {
  map = L.map("map", { zoomControl: false, attributionControl: true }).setView(myPos || C.defaultCenter, myPos ? 14 : C.defaultZoom);
  map.attributionControl.setPrefix(false);
  setTiles();
  markers = L.layerGroup().addTo(map);
}
function mkIcon(iconName) { return L.divIcon({ className: "", html: `<div class="mk">${ico(iconName)}</div>`, iconSize: [40, 40], iconAnchor: [4, 40] }); }
function drawMarkers() {
  if (!markers) return;
  markers.clearLayers();
  shownProviders().forEach(p => {
    if (p.lat == null || p.lng == null) return;
    const first = filter || p.services?.[0] || "wrench";
    L.marker([p.lat, p.lng], { icon: mkIcon(svc(first).icon), title: p.name }).on("click", () => providerBox(p.id)).addTo(markers);
  });
}
function shownProviders() {
  const list = providers.filter(p => p.lat != null && (!filter || (p.services || []).includes(filter)));
  const ref = myPos || (map ? [map.getCenter().lat, map.getCenter().lng] : C.defaultCenter);
  return list.map(p => ({ ...p, dist: dist(ref, [p.lat, p.lng]) })).sort((a, b) => a.dist - b.dist);
}
function dist(a, b) { const R = 6371, r = x => x * Math.PI / 180; const dLa = r(b[0] - a[0]), dLo = r(b[1] - a[1]);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); }
const km = d => d < 1 ? ar(Math.round(d * 1000)) + " م" : ar(d.toFixed(1)) + " كم";
function locate(user) {
  if (!navigator.geolocation) { if (user) toast("المتصفح لا يدعم تحديد الموقع"); return; }
  navigator.geolocation.getCurrentPosition(p => {
    myPos = [p.coords.latitude, p.coords.longitude]; store.set("pos", myPos); placeMe();
    if (map) map.setView(myPos, 14); drawMarkers(); if (tab === "home") renderSheet();
  }, () => { if (user) toast("اسمح للموقع بالوصول لموقعك من إعدادات المتصفح"); }, { enableHighAccuracy: true, timeout: 10000 });
}
function placeMe() {
  if (!map || !myPos) return;
  if (meMarker) meMarker.setLatLng(myPos);
  else meMarker = L.marker(myPos, { icon: L.divIcon({ className: "", html: '<div class="me"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }), interactive: false }).addTo(map);
}

/* ===== ورقة الخدمات ===== */
function renderSheet() {
  const s = document.getElementById("sheet"); if (!s) return;
  const chip = document.getElementById("filterChip"), spacer = document.getElementById("spacer");
  chip.hidden = !filter; spacer.hidden = !!filter;
  if (filter) { chip.innerHTML = `${ico(svc(filter).icon)}<span style="flex:1">${svc(filter).name}</span><button class="x" id="clearF" aria-label="إلغاء التصفية">${ico("x")}</button>`; chip.querySelector("#clearF").onclick = () => setFilter(null); }
  const count = id => providers.filter(p => p.lat != null && (p.services || []).includes(id)).length;
  let body;
  if (!filter) {
    body = SERVICES.map(x => `<button class="svc" data-svc="${x.id}"><span class="ic">${ico(x.icon)}</span><span class="t"><b>${x.name}</b><span>${x.desc}</span></span><span class="n">${ar(count(x.id))}</span>${ico("chev")}</button>`).join("")
      + `<button class="svc" data-act="mystore"><span class="ic">${ico("store")}</span><span class="t"><b>${me?.is_provider ? "إدارة خدمتي" : "تقدّم خدمة؟ سجّلها هنا"}</b><span>اظهر على الخريطة لمن يحتاجك</span></span>${ico("chev")}</button>`;
  } else {
    const list = shownProviders();
    body = `<button class="back" id="sBack">${ico("back")}كل الخدمات</button>` + (list.length
      ? list.map(p => `<button class="svc" data-p="${p.id}"><span class="ic">${ico(svc(filter).icon)}</span><span class="t"><b>${esc(p.name)}</b><span>${esc(p.district || "")}${p.district ? " · " : ""}${km(p.dist)}</span></span>${ico("chev")}</button>`).join("")
      : `<p class="none">لا يوجد مقدم لهذه الخدمة بعد. شارك الموقع مع من يقدّمها ليسجّل ويظهر هنا.</p>`);
  }
  s.innerHTML = `<div class="grip"></div><button class="head" id="sHead" aria-expanded="${sheetOpen}">الخدمات<small>${filter ? ar(shownProviders().length) + " مقدم خدمة قريب منك" : sheetOpen ? "اختر الخدمة التي تحتاجها" : "اضغط لعرض الخدمات"}</small></button><div class="body">${body}</div>`;
  s.classList.toggle("closed", !sheetOpen);
  s.querySelector("#sHead").onclick = () => { sheetOpen = !sheetOpen; renderSheet(); };
  s.querySelector("#sBack")?.addEventListener("click", () => setFilter(null));
  s.querySelectorAll("[data-svc]").forEach(b => b.onclick = () => { if (!sheetOpen) { sheetOpen = true; return renderSheet(); } setFilter(b.dataset.svc); });
  s.querySelectorAll("[data-p]").forEach(b => b.onclick = () => providerBox(b.dataset.p));
  s.querySelectorAll("[data-act]").forEach(b => b.onclick = () => providerSetup());
  let y0 = null;
  s.ontouchstart = e => y0 = e.touches[0].clientY;
  s.ontouchend = e => { if (y0 == null) return; const dy = e.changedTouches[0].clientY - y0; if (Math.abs(dy) > 50 && s.querySelector(".body").scrollTop <= 0) { sheetOpen = dy < 0; renderSheet(); } y0 = null; };
}
function setFilter(id) {
  filter = id; sheetOpen = true; drawMarkers(); renderSheet();
  const list = shownProviders();
  if (id && list.length && map) map.fitBounds(L.latLngBounds(list.slice(0, 10).map(p => [p.lat, p.lng]).concat(myPos ? [myPos] : [])), { padding: [60, 60], maxZoom: 15 });
}

/* ===== مقدم الخدمة ===== */
function providerBox(id) {
  const p = providers.find(x => x.id === id); if (!p) return;
  const d = myPos ? km(dist(myPos, [p.lat, p.lng])) : null;
  const self = session && session.user.id === p.id;
  modal(`<h3>${ico("store")}${esc(p.name)}</h3><p class="lead">${esc(p.district || "")}${d ? (p.district ? " · " : "") + "يبعد " + d : ""}</p>
    <div class="tags">${(p.services || []).map(s => `<span class="pill">${svc(s).name}</span>`).join("")}</div>
    ${p.bio ? `<p class="prose" style="margin:0 0 14px">${esc(p.bio)}</p>` : ""}
    <div class="form">
      ${self ? `<button class="btn ghost" id="pEdit">تعديل خدمتي</button>` : `<button class="btn" id="pReq">اطلب الخدمة</button>`}
      <div class="btns">
        <a class="btn wa sm" href="${waLink(intl(p.phone), "السلام عليكم، وصلت لك من موقع " + C.appName)}" target="_blank" rel="noopener">${ico("wa")}واتساب</a>
        <a class="btn ghost sm" href="tel:+${intl(p.phone)}">${ico("phone")}اتصال</a>
      </div>
      <p class="center" style="margin:0;color:var(--muted);font-size:13px" dir="ltr">+${intl(p.phone)}</p>
    </div>`, m => {
      m.querySelector("#pReq")?.addEventListener("click", () => { if (needLogin("سجّل دخولك لترسل الطلب ويصلك تحديثه في الإشعارات.")) return; m.remove(); requestForm(p); });
      m.querySelector("#pEdit")?.addEventListener("click", () => { m.remove(); providerSetup(); });
  });
}
function requestForm(p) {
  const opts = (p.services || []).map(s => `<option value="${s}" ${s === filter ? "selected" : ""}>${svc(s).name}</option>`).join("");
  modal(`<h3>${ico("orders")}طلب من ${esc(p.name)}</h3><p class="lead">يصل الطلب لمقدم الخدمة فوراً، وتتابع حالته في الإشعارات.</p>
    <form class="form" id="rForm" novalidate>
      <div class="in"><label for="rSvc">الخدمة</label><select id="rSvc">${opts}</select></div>
      <div class="in"><label for="rLoc">موقعك</label><input id="rLoc" value="${esc(store.get("addr", ""))}" placeholder="الحي، الشارع، علامة قريبة">
        <label style="display:flex;gap:8px;align-items:center;font-weight:400;margin-top:8px"><input type="checkbox" id="rPos" ${myPos ? "checked" : ""} style="width:auto"> أرفق موقعي على الخريطة</label></div>
      <div class="in"><label for="rCar">السيارة</label><input id="rCar" value="${esc(store.get("car", ""))}" placeholder="مثال: كامري ٢٠٢٠ بيضاء"></div>
      <div class="in"><label for="rNote">ملاحظات <span style="color:var(--muted);font-weight:400">(اختياري)</span></label><textarea id="rNote" rows="2" placeholder="مثال: بنزين ٩١ — ٢٠ لتر"></textarea></div>
      <div class="err" id="rErr" role="alert"></div>
      <button class="btn" type="submit" id="rBtn">أرسل الطلب</button>
    </form>`, m => {
    m.querySelector("#rForm").onsubmit = async e => {
      e.preventDefault();
      const $ = s => m.querySelector(s), err = $("#rErr");
      const loc = $("#rLoc").value.trim(), car = $("#rCar").value.trim();
      if (!loc) return err.textContent = "اكتب موقعك ليصلك مقدم الخدمة.";
      if (!car) return err.textContent = "اكتب نوع السيارة ولونها.";
      const usePos = $("#rPos").checked;
      if (usePos && !myPos) { locate(true); return err.textContent = "نحدد موقعك الآن… اضغط «أرسل» مرة أخرى بعد ثوانٍ."; }
      $("#rBtn").disabled = true;
      store.set("addr", loc); store.set("car", car);
      const row = { provider_id: p.id, service: $("#rSvc").value, customer_name: me?.name, customer_phone: me?.phone, location: loc, car, note: $("#rNote").value.trim() || null,
                    lat: usePos ? myPos[0] : null, lng: usePos ? myPos[1] : null };
      const { data, error } = await sb.from("requests").insert(row).select().single();
      if (error) { $("#rBtn").disabled = false; return err.textContent = "تعذّر إرسال الطلب. تحقق من الاتصال وحاول مرة أخرى."; }
      m.remove(); myReqs.unshift(data);
      modal(`<h3 style="color:var(--ok)">${ico("shield")}وصل طلبك رقم ${ar(data.id)}</h3>
        <p class="lead">أُبلغ ${esc(p.name)} بطلبك. سيصلك إشعار عند قبوله. للاستعجال راسله مباشرة:</p>
        <div class="form"><a class="btn wa" target="_blank" rel="noopener" href="${waLink(intl(p.phone), reqMsg(data))}">${ico("wa")}أرسل التفاصيل على واتساب</a>
        <button class="btn ghost" data-close>تم</button></div>`);
    };
  });
}
function reqMsg(r) {
  return [`طلب #${r.id} — ${C.appName}`, "الخدمة: " + svc(r.service).name, "الموقع: " + r.location, r.lat ? `https://maps.google.com/?q=${r.lat},${r.lng}` : "", "السيارة: " + r.car, r.note ? "ملاحظات: " + r.note : "", "الاسم: " + (r.customer_name || ""), r.customer_phone ? "الجوال: +" + intl(r.customer_phone) : ""].filter(Boolean).join("\n");
}

function providerSetup() {
  if (needLogin("سجّل دخولك لتضيف خدمتك وتظهر على الخريطة.")) return;
  const p = me || {};
  let pos = (p.lat != null) ? [p.lat, p.lng] : (myPos || (map ? [map.getCenter().lat, map.getCenter().lng] : C.defaultCenter));
  modal(`<h3>${ico("store")}${p.is_provider ? "خدمتي" : "سجّل خدمتك"}</h3><p class="lead">تظهر للناس على الخريطة ويتواصلون معك على جوالك +${intl(p.phone)}.</p>
    <form class="form" id="sForm" novalidate>
      <div class="in"><label>الخدمات التي تقدّمها</label><div class="checks">${SERVICES.map(s => `<label><input type="checkbox" name="sv" value="${s.id}" ${(p.services || []).includes(s.id) ? "checked" : ""}><span>${ico(s.icon)}${s.name}</span></label>`).join("")}</div></div>
      <div class="in"><label for="sDist">الحي أو المنطقة</label><input id="sDist" value="${esc(p.district || "")}" placeholder="مثال: الرياض — حي المنسية"></div>
      <div class="in"><label for="sBio">نبذة <span style="color:var(--muted);font-weight:400">(اختياري)</span></label><textarea id="sBio" rows="2" placeholder="مثال: متواجد ٢٤ ساعة، سطحة هيدروليك">${esc(p.bio || "")}</textarea></div>
      <div class="in"><label>موقعك على الخريطة</label><div class="minimap"><div id="mini" style="height:100%"></div><div class="center">${ico("pin")}</div></div>
        <div class="hint">حرّك الخريطة حتى يقع الدبوس على مكانك. <button type="button" class="textlink" id="sGps">استخدم موقعي الحالي</button></div></div>
      ${p.is_provider ? `<div class="row" style="border:1px solid var(--line);border-radius:14px"><span class="t"><b>ظاهر على الخريطة</b><span>أطفئه عند عدم التوفر</span></span><button type="button" class="sw" role="switch" id="sActive" aria-checked="${p.active !== false}" aria-label="ظاهر على الخريطة"></button></div>` : ""}
      <div class="err" id="sErr" role="alert"></div>
      <button class="btn" type="submit" id="sBtn">${p.is_provider ? "حفظ" : "اعرض خدمتي على الخريطة"}</button>
      ${p.is_provider ? `<button type="button" class="btn ghost" id="sStop" style="color:var(--danger);border-color:var(--danger)">إيقاف عرض خدمتي نهائياً</button>` : ""}
    </form>`, m => {
    const mini = L.map(m.querySelector("#mini"), { zoomControl: true, attributionControl: false }).setView(pos, 15);
    const dark = getComputedStyle(document.documentElement).colorScheme === "dark";
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/${dark ? "dark_all" : "voyager"}/{z}/{x}/{y}{r}.png`, { subdomains: "abcd", maxZoom: 19 }).addTo(mini);
    setTimeout(() => mini.invalidateSize(), 250);
    m.querySelector("#sGps").onclick = () => navigator.geolocation?.getCurrentPosition(g => { myPos = [g.coords.latitude, g.coords.longitude]; store.set("pos", myPos); mini.setView(myPos, 16); }, () => toast("اسمح بالوصول لموقعك من إعدادات المتصفح"));
    const act = m.querySelector("#sActive"); if (act) act.onclick = () => act.setAttribute("aria-checked", act.getAttribute("aria-checked") !== "true");
    m.querySelector("#sStop")?.addEventListener("click", async () => { await sb.from("profiles").update({ is_provider: false }).eq("id", me.id); me.is_provider = false; m.remove(); toast("أوقفنا عرض خدمتك"); loadProviders(); renderDrawer(); if (tab === "account") renderPage(); });
    m.querySelector("#sForm").onsubmit = async e => {
      e.preventDefault();
      const services = [...m.querySelectorAll("input[name=sv]:checked")].map(x => x.value), err = m.querySelector("#sErr");
      if (!services.length) return err.textContent = "اختر خدمة واحدة على الأقل.";
      const c = mini.getCenter();
      const upd = { is_provider: true, services, district: m.querySelector("#sDist").value.trim() || null, bio: m.querySelector("#sBio").value.trim() || null,
                    lat: +c.lat.toFixed(6), lng: +c.lng.toFixed(6), active: act ? act.getAttribute("aria-checked") === "true" : true, updated_at: new Date().toISOString() };
      m.querySelector("#sBtn").disabled = true;
      const { error } = await sb.from("profiles").update(upd).eq("id", me.id);
      if (error) { m.querySelector("#sBtn").disabled = false; return err.textContent = "تعذّر الحفظ. حاول مرة أخرى."; }
      Object.assign(me, upd); m.remove(); toast(upd.active ? "خدمتك ظاهرة الآن على الخريطة" : "تم الحفظ — خدمتك مخفية حالياً");
      await loadProviders(); renderDrawer(); if (tab === "account") renderPage();
    };
  });
}

/* ===== الصفحات ===== */
const ST = { new: ["جديد", "new"], accepted: ["مقبول", ""], done: ["مكتمل", "done"], declined: ["معتذر", "bad"], cancelled: ["ملغي", "bad"] };
function renderPage() {
  const v = document.getElementById("pageView"); if (!v || tab === "home") return;
  v.innerHTML = PAGES[tab]();
  v.querySelectorAll("[data-tab]").forEach(x => x.onclick = () => go(x.dataset.tab));
  v.querySelectorAll("[data-go]").forEach(x => x.onclick = () => action(x.dataset.go));
  v.querySelectorAll("[data-copy]").forEach(x => x.onclick = () => copy(x.dataset.copy));
  (BIND[tab] || (() => {}))(v);
}
const PAGES = {
  notes() {
    if (!notes.length) return `<div class="empty">${ico("bell")}<b>لا توجد إشعارات بعد</b><span>ستظهر هنا الطلبات الجديدة وتحديثاتها</span></div>`;
    return `<div class="list">${notes.map(n => `<button class="row ${n.read ? "" : "unread"}" data-req="${n.request_id || ""}"><span class="ic">${ico("bell")}</span><span class="t"><b>${esc(n.title)}</b>${n.body ? `<span>${esc(n.body)}</span>` : ""}</span><span class="end">${fmtDate(n.created_at)}</span></button>`).join("")}</div>`;
  },
  orders() {
    const isP = me?.is_provider || inReqs.length;
    const list = ordersTab === "in" ? inReqs : myReqs;
    const tabs = isP ? `<div class="tabs" role="tablist"><button role="tab" data-ot="mine" aria-selected="${ordersTab === "mine"}">طلباتي</button><button role="tab" data-ot="in" aria-selected="${ordersTab === "in"}">الواردة ${inReqs.filter(r => r.status === "new").length ? "(" + ar(inReqs.filter(r => r.status === "new").length) + ")" : ""}</button></div>` : "";
    if (!list.length) return tabs + `<div class="empty">${ico("orders")}<b>${ordersTab === "in" ? "لا توجد طلبات واردة بعد" : "لا توجد طلبات بعد"}</b><span>${ordersTab === "in" ? "تأكد أن خدمتك ظاهرة على الخريطة" : "اختر خدمة من الرئيسية واطلبها من أقرب مقدم"}</span>${ordersTab === "in" ? "" : `<div style="width:200px;margin-top:10px"><button class="btn" data-tab="home">اطلب خدمة</button></div>`}</div>`;
    return tabs + `<div class="list">${list.map(r => `<button class="row" data-req="${r.id}"><span class="ic">${ico(svc(r.service).icon)}</span><span class="t"><b>${svc(r.service).name} <span class="pill ${ST[r.status][1]}">${ST[r.status][0]}</span></b><span>#${ar(r.id)} · ${ordersTab === "in" ? esc(r.customer_name || "") + " · " : ""}${fmtDate(r.created_at)}</span></span>${ico("chev")}</button>`).join("")}</div>`;
  },
  account() {
    if (!session) return `<div class="empty">${ico("user")}<b>أنت تتصفح بدون حساب</b><span>سجّل بالبريد الإلكتروني لتطلب الخدمات أو تعرض خدمتك على الخريطة</span><div style="width:240px;margin-top:10px" class="form"><button class="btn" id="toSignup">إنشاء حساب</button><button class="btn ghost" id="toLogin">تسجيل الدخول</button></div></div>`;
    const u = me || {};
    return `<div class="hero"><div class="avatar">${esc((u.name || "؟").trim()[0])}</div><h2>${esc(u.name)}</h2><div class="ph">+${intl(u.phone)}</div></div>
      <div class="stats">
        <button class="stat" data-go="mystore">${ico("store")}<span>العضوية</span><b>${u.is_provider ? "مقدم خدمة" : "عميل"}</b></button>
        <button class="stat" data-tab="orders">${ico("orders")}<span>الطلبات</span><b>${ar(myReqs.length + inReqs.length)}</b></button>
        <button class="stat" data-tab="notes">${ico("bell")}<span>الإشعارات</span><b>${ar(unread())}</b></button>
      </div>
      <div class="field"><label>الاسم</label><div class="v">${ico("user")}<span>${esc(u.name)}</span></div></div>
      <div class="field"><label>الجوال</label><div class="v">${ico("phone")}<span dir="ltr">+${intl(u.phone)}</span></div></div>
      <div class="field"><label>البريد الإلكتروني</label><div class="v">${ico("mail")}<span>${esc(session.user.email)}</span></div></div>
      <div class="pad form">
        <div class="card brand"><b>${u.is_provider ? "خدمتك " + (u.active !== false ? "ظاهرة على الخريطة" : "مخفية حالياً") : "تقدّم خدمة طريق؟"}</b><span style="color:var(--muted);font-size:14px">${u.is_provider ? (u.services || []).map(s => svc(s).name).join("، ") : "سجّلها مجاناً وتظهر لمن يحتاجها قريباً منك."}</span><button class="btn sm" data-go="mystore">${u.is_provider ? "إدارة خدمتي" : "سجّل خدمتك"}</button></div>
        <button class="btn ghost" id="editProfile">تعديل بياناتي</button>
      </div>`;
  },
  settings() {
    const th = { system: "تلقائي", light: "فاتح", dark: "داكن" }[theme];
    return `<div class="list">
      <div class="row"><span class="ic">${ico("lang")}</span><span class="t"><b>اللغة</b></span><span class="end" style="color:var(--brand)">عربي</span></div>
      <div class="row"><span class="ic">${ico("bell")}</span><span class="t"><b>الإشعارات</b><span>تنبيه على الجهاز عند وصول طلب أو تحديث</span></span><button class="sw" role="switch" aria-checked="${notifyOn}" id="notifySw" aria-label="الإشعارات"></button></div>
      <button class="row" id="themeBtn"><span class="ic">${ico("moon")}</span><span class="t"><b>المظهر</b></span><span class="end">${th}</span></button>
      <button class="row" data-go="install"><span class="ic">${ico("plus")}</span><span class="t"><b>أضف للشاشة الرئيسية</b><span>افتح الموقع كتطبيق بضغطة</span></span>${ico("chev")}</button>
      <button class="row" id="shareBtn"><span class="ic">${ico("share")}</span><span class="t"><b>شارك الموقع</b><span>انسخ الرابط وأرسله لمن يقدّم خدمة</span></span>${ico("chev")}</button>
      <button class="row" data-go="terms"><span class="ic">${ico("shield")}</span><span class="t"><b>الشروط والأحكام</b></span>${ico("chev")}</button>
      ${session ? `<button class="row" id="delBtn"><span class="ic" style="color:var(--danger)">${ico("trash")}</span><span class="t"><b style="color:var(--danger)">حذف الحساب</b></span>${ico("chev")}</button>` : ""}
    </div>`;
  },
  contact() {
    const w = C.supportWhatsapp, e = C.supportEmail;
    if (!w && !e) return `<div class="pad"><div class="card"><b>قنوات التواصل قريباً</b><span style="color:var(--muted)">لطلب خدمة، تواصل مباشرة مع مقدم الخدمة من الخريطة.</span></div></div>`;
    return `<div class="pad form"><p style="margin:0;color:var(--muted)">نرد عليك بأسرع وقت. واتساب أسرع وسيلة.</p>
      ${w ? `<a class="btn wa" target="_blank" rel="noopener" href="${waLink(w, "السلام عليكم، لدي استفسار عن " + C.appName)}">${ico("wa")}راسلنا على واتساب</a>` : ""}
      ${e ? `<a class="btn ghost" href="mailto:${esc(e)}">${ico("mail")}${esc(e)}</a>` : ""}</div>`;
  },
  about() {
    return `<div class="pad prose"><div class="brandmark" style="margin-bottom:14px"><div class="logo">${ico("tow")}</div><div><h1>${C.appName}</h1><p>${C.tagline}</p></div></div>
      <p>«${C.appName}» يجمع مقدمي خدمات الطريق على خريطة واحدة: بطارية، وقود، إطار، سحب، فتح سيارة، وفحص سريع.</p>
      <h4>إذا كنت تحتاج خدمة</h4><p>اختر الخدمة، وسترى أقرب مقدميها. اطلب من داخل الموقع أو تواصل معه مباشرة بالاتصال أو واتساب.</p>
      <h4>إذا كنت تقدّم خدمة</h4><p>سجّل ببريدك، ثم «سجّل خدمتك» وحدد مكانك على الخريطة. تصلك الطلبات في الإشعارات.</p>
      <p style="color:var(--muted)">الإصدار ٢٫٠</p></div>`;
  }
};
const BIND = {
  notes(v) {
    v.querySelectorAll("[data-req]").forEach(b => b.onclick = () => { const id = +b.dataset.req; if (id) reqDetails(id); });
    if (unread()) setTimeout(markAllRead, 1500);
  },
  orders(v) {
    v.querySelectorAll("[data-ot]").forEach(b => b.onclick = () => { ordersTab = b.dataset.ot; renderPage(); });
    v.querySelectorAll("[data-req]").forEach(b => b.onclick = () => reqDetails(+b.dataset.req));
  },
  account(v) {
    v.querySelector("#toSignup")?.addEventListener("click", () => authScreen("signup"));
    v.querySelector("#toLogin")?.addEventListener("click", () => authScreen("login"));
    v.querySelector("#editProfile")?.addEventListener("click", editProfile);
  },
  settings(v) {
    v.querySelector("#notifySw").onclick = async e => {
      notifyOn = !notifyOn; store.set("notify", notifyOn); e.currentTarget.setAttribute("aria-checked", notifyOn);
      if (notifyOn && "Notification" in window && Notification.permission === "default") { try { await Notification.requestPermission(); } catch (x) {} }
      toast(notifyOn ? "الإشعارات مفعّلة" : "الإشعارات متوقفة");
    };
    v.querySelector("#themeBtn").onclick = () => { theme = { system: "light", light: "dark", dark: "system" }[theme]; store.set("theme", theme); applyTheme(); renderPage(); };
    v.querySelector("#shareBtn").onclick = async () => {
      const url = location.origin + location.pathname;
      if (navigator.share) { try { await navigator.share({ title: C.appName, text: C.appName + " — " + C.tagline, url }); return; } catch (e) { if (e.name === "AbortError") return; } }
      copy(url);
    };
    v.querySelector("#delBtn")?.addEventListener("click", () => confirmBox("حذف الحساب", "سيُحذف حسابك وخدمتك وطلباتك وإشعاراتك نهائياً، ولا يمكن التراجع.", "احذف حسابي نهائياً", async () => {
      const { error } = await sb.rpc("delete_my_account");
      if (error) return toast("تعذّر الحذف الآن، حاول لاحقاً");
      await logout(); toast("حُذف حسابك");
    }, true));
  }
};
async function markAllRead() {
  if (!session || !unread()) return;
  notes.forEach(n => n.read = true); renderNav(); renderTop(); if (tab === "notes") renderPage();
  await sb.from("notifications").update({ read: true }).eq("user_id", session.user.id).eq("read", false);
}

function reqDetails(id) {
  const r = myReqs.concat(inReqs).find(x => x.id === id); if (!r) { loadRequests(); return toast("لم نجد الطلب"); }
  const asP = session && r.provider_id === session.user.id;
  const prov = providers.find(p => p.id === r.provider_id);
  const otherPhone = asP ? r.customer_phone : prov?.phone;
  modal(`<h3>${ico(svc(r.service).icon)}${svc(r.service).name} <span class="pill ${ST[r.status][1]}">${ST[r.status][0]}</span></h3>
    <p class="lead">طلب #${ar(r.id)} · ${fmtDate(r.created_at)}</p>
    <div class="kv">
      ${asP ? `<div class="r"><span>العميل</span>${esc(r.customer_name)}</div>` : `<div class="r"><span>مقدم الخدمة</span>${esc(prov?.name || "—")}</div>`}
      <div class="r"><span>الموقع</span>${esc(r.location)}${r.lat ? ` · <a class="textlink" target="_blank" rel="noopener" href="https://maps.google.com/?q=${r.lat},${r.lng}">افتح في الخرائط</a>` : ""}</div>
      <div class="r"><span>السيارة</span>${esc(r.car)}</div>
      ${r.note ? `<div class="r"><span>ملاحظات</span>${esc(r.note)}</div>` : ""}
    </div>
    <div class="form">
      ${otherPhone ? `<div class="btns"><a class="btn wa sm" target="_blank" rel="noopener" href="${waLink(intl(otherPhone), asP ? "السلام عليكم، بخصوص طلبك #" + r.id + " في " + C.appName : reqMsg(r))}">${ico("wa")}واتساب</a><a class="btn ghost sm" href="tel:+${intl(otherPhone)}">${ico("phone")}اتصال</a></div>` : ""}
      ${asP && r.status === "new" ? `<div class="btns"><button class="btn" data-st="accepted">قبول الطلب</button><button class="btn ghost" data-st="declined" style="color:var(--danger);border-color:var(--danger)">اعتذار</button></div>` : ""}
      ${asP && r.status === "accepted" ? `<button class="btn" data-st="done">تم تنفيذ الخدمة</button>` : ""}
      ${!asP && ["new", "accepted"].includes(r.status) ? `<button class="btn ghost" data-st="cancelled" style="color:var(--danger);border-color:var(--danger)">إلغاء الطلب</button>` : ""}
      <button class="btn ghost" data-close>إغلاق</button>
    </div>`, m => {
    m.querySelectorAll("[data-st]").forEach(b => b.onclick = async () => {
      b.disabled = true;
      const { error } = await sb.from("requests").update({ status: b.dataset.st }).eq("id", r.id);
      if (error) { b.disabled = false; return toast("تعذّر التحديث، حاول مرة أخرى"); }
      r.status = b.dataset.st; m.remove(); toast("تم تحديث الطلب"); renderPage();
    });
  });
}
function editProfile() {
  const u = me;
  modal(`<h3>${ico("user")}تعديل بياناتي</h3><form class="form" id="eForm" novalidate>
    <div class="in"><label for="eName">الاسم</label><input id="eName" value="${esc(u.name)}"></div>
    <div class="in"><label for="ePhone">الجوال للتواصل</label><div class="phone"><span>+966</span><input id="ePhone" inputmode="numeric" maxlength="10" value="${esc(u.phone)}"></div></div>
    <div class="in"><label>البريد الإلكتروني</label><input value="${esc(session.user.email)}" class="ltr" disabled></div>
    <div class="err" id="eErr" role="alert"></div><button class="btn" type="submit">حفظ</button></form>`, m => {
    m.querySelector("#eForm").onsubmit = async e => {
      e.preventDefault();
      const name = m.querySelector("#eName").value.trim(), phone = toEn(m.querySelector("#ePhone").value).replace(/\D/g, "").replace(/^0/, ""), err = m.querySelector("#eErr");
      if (name.length < 2) return err.textContent = "اكتب اسمك.";
      if (!/^5\d{8}$/.test(phone)) return err.textContent = "رقم الجوال يبدأ بـ 5 ويتكون من ٩ أرقام.";
      const { error } = await sb.from("profiles").update({ name, phone }).eq("id", me.id);
      if (error) return err.textContent = "تعذّر الحفظ.";
      Object.assign(me, { name, phone }); m.remove(); renderPage(); renderDrawer(); toast("حُفظت بياناتك");
    };
  });
}

/* ===== نوافذ عامة ===== */
function modal(html, after) {
  const m = document.createElement("div"); m.className = "modal";
  m.innerHTML = `<div class="box" role="dialog" aria-modal="true"><div class="grip"></div>${html}</div>`;
  m.onclick = e => { if (e.target === m || e.target.closest("[data-close]")) m.remove(); };
  app.appendChild(m); after && after(m); return m;
}
function confirmBox(title, body, label, fn, danger) {
  modal(`<h3>${title}</h3><p class="lead">${body}</p><div class="form"><button class="btn ${danger ? "danger" : ""}" id="okBtn">${label}</button><button class="btn ghost" data-close>إلغاء</button></div>`,
    m => m.querySelector("#okBtn").onclick = () => { m.remove(); fn(); });
}
function termsBox() {
  modal(`<h3>${ico("shield")}الشروط والأحكام</h3><div class="prose">
    <h4>دور الموقع</h4><p>«${C.appName}» منصة تعرض مقدمي خدمات الطريق وتوصلك بهم. الاتفاق على السعر والوقت وتنفيذ الخدمة بينك وبين مقدم الخدمة مباشرة.</p>
    <h4>مقدمو الخدمة</h4><p>يلتزم مقدم الخدمة بصحة بياناته وموقعه، وبإخفاء خدمته عند عدم توفره.</p>
    <h4>الخصوصية</h4><p>نحفظ بريدك واسمك وجوالك. جوال مقدم الخدمة ظاهر للجميع للتواصل. جوالك كعميل يظهر فقط لمقدم الخدمة الذي تطلب منه.</p>
    <h4>حذف الحساب</h4><p>تستطيع حذف حسابك وكل بياناتك من الإعدادات في أي وقت.</p></div><br><button class="btn" data-close>فهمت</button>`);
}
function installBox() {
  modal(`<h3>${ico("plus")}أضف «${C.appName}» للشاشة الرئيسية</h3><p class="lead">يفتح بعدها مثل التطبيق بدون تحميل من المتجر.</p><div class="prose">
    <h4>آيفون (Safari)</h4><p>اضغط زر المشاركة في أسفل الشاشة، ثم «إضافة إلى الشاشة الرئيسية»، ثم «إضافة».</p>
    <h4>أندرويد (Chrome)</h4><p>اضغط النقاط الثلاث ⋮ أعلى الشاشة، ثم «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p></div><br>
    ${deferredInstall ? `<button class="btn" id="doInstall">ثبّت الآن</button><br>` : ""}<button class="btn ghost" data-close>تم</button>`, m => {
    m.querySelector("#doInstall")?.addEventListener("click", async () => { deferredInstall.prompt(); await deferredInstall.userChoice.catch(() => {}); deferredInstall = null; m.remove(); });
  });
}
function searchBox() {
  modal(`<h3>${ico("search")}ابحث</h3><div class="in" style="margin:6px 0 10px"><input id="q" placeholder="خدمة أو اسم مقدم خدمة أو حي"></div><div class="list" id="qr" style="border-radius:14px;overflow:hidden"></div>`, m => {
    const q = m.querySelector("#q"), out = m.querySelector("#qr");
    const syn = { "سطح": "tow", "ونش": "tow", "وقود": "fuel", "بنزين": "fuel", "ديزل": "fuel", "كفر": "tire", "بنشر": "tire", "بطار": "battery", "مفتاح": "lock", "ميكانيك": "check" };
    const draw = () => {
      const v = q.value.trim();
      const ss = SERVICES.filter(s => !v || (s.name + s.desc).includes(v) || Object.entries(syn).some(([k, id]) => v.includes(k) && id === s.id));
      const ps = v ? providers.filter(p => (p.name + " " + (p.district || "")).includes(v)) : [];
      out.innerHTML = ss.map(s => `<button class="row" data-s="${s.id}"><span class="ic">${ico(s.icon)}</span><span class="t"><b>${s.name}</b><span>${s.desc}</span></span></button>`).join("")
        + ps.map(p => `<button class="row" data-p="${p.id}"><span class="ic">${ico("store")}</span><span class="t"><b>${esc(p.name)}</b><span>${esc(p.district || "")}</span></span></button>`).join("")
        || `<p style="color:var(--muted);text-align:center">لا توجد نتائج.</p>`;
      out.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { m.remove(); setFilter(b.dataset.s); });
      out.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { m.remove(); const p = providers.find(x => x.id === b.dataset.p); if (p && map) map.setView([p.lat, p.lng], 16); providerBox(b.dataset.p); });
    };
    q.oninput = draw; draw(); setTimeout(() => q.focus(), 60);
  });
}
function newPasswordBox() {
  modal(`<h3>${ico("shield")}كلمة مرور جديدة</h3><form class="form" id="npForm" novalidate><div class="in"><label for="np">كلمة المرور الجديدة</label><input id="np" type="password" class="ltr" autocomplete="new-password"></div><div class="err" id="npErr"></div><button class="btn" type="submit">حفظ</button></form>`, m => {
    m.querySelector("#npForm").onsubmit = async e => {
      e.preventDefault(); const v = m.querySelector("#np").value;
      if (v.length < 6) return m.querySelector("#npErr").textContent = "٦ أحرف على الأقل.";
      const { error } = await sb.auth.updateUser({ password: v });
      if (error) return m.querySelector("#npErr").textContent = "تعذّر الحفظ، اطلب رابطاً جديداً.";
      m.remove(); toast("تم تغيير كلمة المرور"); await afterLogin();
    };
  });
}
function copy(t) {
  const ok = () => toast("تم النسخ");
  try { navigator.clipboard.writeText(t).then(ok, () => fallbackCopy(t)); } catch (e) { fallbackCopy(t); }
}
function fallbackCopy(t) { const a = document.createElement("textarea"); a.value = t; app.appendChild(a); a.select(); try { document.execCommand("copy"); toast("تم النسخ"); } catch (e) { toast(t); } a.remove(); }
function toast(t) { const d = document.createElement("div"); d.className = "toast"; d.textContent = t; app.appendChild(d); setTimeout(() => d.remove(), 2400); }

let deferredInstall = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstall = e; });
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => theme === "system" && applyTheme());

boot().catch(e => { console.error(e); app.innerHTML = `<div class="empty"><b>تعذّر التحميل</b><span>تحقق من الإنترنت ثم أعد فتح الصفحة.</span></div>`; });
