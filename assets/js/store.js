/* إدارة الحالة: السلة، المفضلة، الطلبات، والتخزين المحلي */

const KEY = { cart:'wz_cart_v1', fav:'wz_fav_v1', orders:'wz_orders_v1', seq:'wz_seq_v1', draft:'wz_draft_v1' };

/* وضع المعاينة: يعرض مسودّة لوحة التحكم بدل البيانات المنشورة (لا يؤثر على الزوار) */
let PREVIEW = false;
(function applyDraft(){
  try{
    if(sessionStorage.getItem('wz_preview') !== '1') return;
    const d = JSON.parse(localStorage.getItem(KEY.draft) || 'null');
    if(!d) return;
    if(d.SITE)       SITE       = d.SITE;
    if(d.CATEGORIES) CATEGORIES = d.CATEGORIES;
    if(d.BRANDS)     BRANDS     = d.BRANDS;
    if(d.PRODUCTS)   PRODUCTS   = d.PRODUCTS;
    if(d.ICONS && typeof ART_SRC !== 'undefined') Object.assign(ART_SRC, d.ICONS);
    PREVIEW = true;
  }catch(e){}
})();

/* ================= خيارات المنتج =================
   options اختيارية تماماً: منتج بلا options يسلك كما كان حرفياً.
   أسماء الخيارات حرّة من إدخال صاحب المحل، و type طريقة عرض فقط. */
function optList(p){
  return (Array.isArray(p && p.options) ? p.options : [])
    .filter(o => o && o.id && Array.isArray(o.values) && o.values.length);
}
function optValue(o, label){
  return (o.values || []).find(v => v && v.label === label) || null;
}
/* أول قيمة من كل خيار — حتى لا يُمنع الزبون من الشراء */
function defaultOpts(p){
  const out = {};
  optList(p).forEach(o => { out[o.id] = o.values[0].label; });
  return Object.keys(out).length ? out : null;
}
/* السعر: تُفحص القيم بترتيب الخيارات، وآخر قيمة تحمل سعراً هي الحاكمة */
function optPrice(p, opts){
  let price = p.price;
  if(!opts) return price;
  optList(p).forEach(o => {
    const v = optValue(o, opts[o.id]);
    if(v && typeof v.price === 'number' && v.price > 0) price = v.price;
  });
  return price;
}
/* الصورة: آخر قيمة مختارة تحمل صورة */
function optImage(p, opts){
  let img = '';
  if(!opts) return img;
  optList(p).forEach(o => {
    const v = optValue(o, opts[o.id]);
    if(v && v.image) img = v.image;
  });
  return img;
}
/* بيانات مسودّة صورة خيار (قبل النشر من لوحة التحكم) */
function optDraft(p, path){
  let d = '';
  optList(p).forEach(o => o.values.forEach(v => { if(v && v.image === path && v.imgData) d = v.imgData; }));
  return d;
}
/* نص مقروء: «اللون: أزرق · القياس: 80 سم» */
function optsText(p, opts){
  if(!opts) return '';
  return optList(p).map(o => opts[o.id] ? `${o.name}: ${opts[o.id]}` : '').filter(Boolean).join(' · ');
}
/* مفتاح سطر السلة — نفس المادة بخيارات مختلفة = سطور منفصلة.
   السلال القديمة { id, q } بلا opts تعطي المفتاح = المعرّف نفسه فلا تنكسر. */
function lineKey(id, opts){
  if(!opts || typeof opts !== 'object') return id;
  const parts = Object.keys(opts).sort()
    .filter(k => opts[k] !== '' && opts[k] != null)
    .map(k => k + '=' + opts[k]);
  return parts.length ? id + '|' + parts.join('|') : id;
}

const store = {
  cart: [],   // [{id, q}]
  fav:  [],   // [id]
  orders: [],

  load(){
    this.cart   = read(KEY.cart, []).filter(l => l && byId(l.id));
    this.fav    = read(KEY.fav, []).filter(id => byId(id));
    this.orders = read(KEY.orders, []);
  },
  save(){
    write(KEY.cart, this.cart); write(KEY.fav, this.fav); write(KEY.orders, this.orders);
    emit();
  },

  /* --- السلة --- */
  keyOf(l){ return lineKey(l.id, l.opts); },
  add(id, q = 1, opts){
    const p = byId(id); if(!p) return;
    const key = lineKey(id, opts);
    const line = this.cart.find(l => this.keyOf(l) === key);
    if(line) line.q = Math.min(999, line.q + q);
    else this.cart.push(opts && Object.keys(opts).length ? { id, q, opts } : { id, q });
    this.save();
    const t = optsText(p, opts);
    toast(`تمت إضافة «${p.name}»${t ? ` (${t})` : ''} إلى السلة`, 'ok');
  },
  setQty(key, q){
    const line = this.cart.find(l => this.keyOf(l) === key); if(!line) return;
    line.q = Math.max(1, Math.min(999, q)); this.save();
  },
  remove(key){
    this.cart = this.cart.filter(l => this.keyOf(l) !== key); this.save();
  },
  clearCart(){ this.cart = []; this.save(); },
  qtyOf(key){ const l = this.cart.find(l => this.keyOf(l) === key); return l ? l.q : 0; },
  get count(){ return this.cart.reduce((n, l) => n + l.q, 0); },
  get lines(){
    return this.cart.map(l => {
      const p = byId(l.id); if(!p) return null;
      const opts  = l.opts && Object.keys(l.opts).length ? l.opts : null;
      const price = optPrice(p, opts);
      const oimg  = optImage(p, opts);
      return { ...p, q:l.q, opts, key:this.keyOf(l), price, total: price * l.q,
               optsText: optsText(p, opts),
               ...(oimg ? { image:oimg, imgData: optDraft(p, oimg) } : {}) };
    }).filter(Boolean);
  },
  get subtotal(){ return this.lines.reduce((s, l) => s + l.total, 0); },
  get savings(){
    return this.lines.reduce((s, l) => s + (l.old ? (l.old - l.price) * l.q : 0), 0);
  },
  deliveryFee(method, gov){
    const o = SITE.orders;
    if(method === 'pickup') return 0;
    if(o.freeDeliveryOver && this.subtotal >= o.freeDeliveryOver) return 0;
    return gov === SITE.city ? o.deliveryFeeInCity : o.deliveryFeeOutCity;
  },

  /* --- المفضلة --- */
  toggleFav(id){
    const i = this.fav.indexOf(id);
    if(i > -1){ this.fav.splice(i, 1); toast('أُزيل من المفضلة'); }
    else { this.fav.push(id); toast('أُضيف إلى المفضلة', 'ok'); }
    this.save();
    return this.fav.includes(id);
  },
  isFav(id){ return this.fav.includes(id); },

  /* --- الطلبات --- */
  nextOrderId(){
    const n = (read(KEY.seq, 0) | 0) + 1;
    write(KEY.seq, n);
    const d = new Date();
    const s = String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate());
    return `${SITE.orders.prefix}-${s}-${String(n).padStart(3, '0')}`;
  },
  buildOrder(customer, method, payment, branch){
    const lines = this.lines;
    if(!lines.length) return null;
    const sub = this.subtotal;
    const fee = this.deliveryFee(method, customer.gov);
    return {
      no: this.nextOrderId(),          // رقم معروض للزبون
      at: Date.now(),
      status: 'pending',
      customer, method, payment, branch: branch || '',
      items: lines.map(l => ({ id:l.id, name:l.name, brand:l.brand, price:l.price, q:l.q,
        unit:l.unit || 'حبة', opts:l.optsText || '', total:l.total })),
      subtotal: sub, fee, total: sub + fee,
      adminNote: ''
    };
  },
  /* يُحفظ الطلب في قاعدة البيانات إن كانت مضبوطة، وإلا محلياً فقط */
  async placeOrder(customer, method, payment, branch){
    const order = this.buildOrder(customer, method, payment, branch);
    if(!order) return null;
    let saved = { ...order, id: order.no, online: false };
    if(FB.ready()){
      const res = await FB.createOrder(order);   // يرمي عند الفشل ليعرف الزبون
      saved = { ...order, id: res.id, online: true };
    }
    this.orders.unshift(saved);
    if(this.orders.length > 60) this.orders.length = 60;
    this.cart = [];
    this.save();
    sendWebhook(saved);
    return saved;
  },
  orderById(id){ return this.orders.find(o => o.id === id || o.no === id); },
  /* يحدّث نسخة الزبون المحلية بحالة الطلب القادمة من قاعدة البيانات */
  syncOrder(id, live){
    const i = this.orders.findIndex(o => o.id === id);
    if(i < 0) return;
    this.orders[i] = { ...this.orders[i], status:live.status, adminNote:live.adminNote || '', updatedAt:live.updatedAt };
    this.save();
  }
};

/* --- أدوات مساعدة --- */
function read(k, fb){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }catch(e){ return fb; } }
function write(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function pad(n){ return String(n).padStart(2, '0'); }

const PMAP = new Map(PRODUCTS.map(p => [p.id, p]));
function byId(id){ return PMAP.get(id); }

function money(n){ return new Intl.NumberFormat('en-US').format(Math.round(n)); }
function priceHTML(n){ return `${money(n)} <small>${SITE.currency}</small>`; }

/* شجرة الأقسام: خرائط سريعة */
const CMAP = new Map(), SMAP = new Map();
CATEGORIES.forEach(c => {
  CMAP.set(c.id, c);
  c.subs.forEach(s => SMAP.set(c.id + '/' + s.id, { ...s, parent:c }));
});
function subInfo(key){ return SMAP.get(key); }
function productsIn(key){
  if(CMAP.has(key)) return PRODUCTS.filter(p => p.cats.some(c => c.split('/')[0] === key));
  return PRODUCTS.filter(p => p.cats.includes(key));
}
function countIn(key){ return productsIn(key).length; }

/* البحث */
function searchProducts(q){
  const t = norm(q); if(!t) return [];
  const words = t.split(/\s+/).filter(Boolean);
  return PRODUCTS.map(p => {
    const hay = norm([p.name, p.brand, p.id, (p.specs||[]).join(' '), p.desc,
      ...p.cats.map(c => { const s = subInfo(c); return s ? s.name + ' ' + s.parent.name : ''; })].join(' '));
    let score = 0;
    for(const w of words){
      if(!hay.includes(w)) return null;
      score += norm(p.name).includes(w) ? 3 : 1;
      if(norm(p.name).startsWith(w)) score += 2;
    }
    return { p, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).map(r => r.p);
}
/* تطبيع النص العربي: توحيد الألف والهاء والتاء المربوطة وإزالة التشكيل */
function norm(s){
  return String(s || '').toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

/* إرسال الطلب إلى نقطة نهاية خارجية (اختياري) */
function sendWebhook(order){
  const url = SITE.orders.webhook;
  if(!url) return;
  try{
    const body = JSON.stringify(order);
    if(navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body], { type:'application/json' }));
    else fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json' }, body, keepalive:true }).catch(()=>{});
  }catch(e){}
}

/* نص رسالة واتساب للطلب */
function orderText(o){
  const L = [];
  L.push(`*طلب جديد — ${SITE.shortName}*`);
  L.push(`رقم الطلب: ${o.no || o.id}`);
  L.push(`التاريخ: ${new Date(o.at).toLocaleString('ar-IQ')}`);
  L.push('');
  L.push('*الزبون*');
  L.push(`الاسم: ${o.customer.name}`);
  L.push(`الهاتف: ${o.customer.phone}`);
  L.push(`المحافظة: ${o.customer.gov}`);
  if(o.customer.address) L.push(`العنوان: ${o.customer.address}`);
  if(o.customer.note) L.push(`ملاحظات: ${o.customer.note}`);
  L.push(`الاستلام: ${o.method === 'pickup' ? 'استلام من المحل' + (o.branch ? ' — ' + o.branch : '') : 'توصيل إلى العنوان'}`);
  L.push('');
  L.push('*المواد*');
  o.items.forEach((it, i) => L.push(`${i + 1}. ${it.name}${it.opts ? ` (${it.opts})` : ''} — ${it.q} ${it.unit} × ${money(it.price)} = ${money(it.total)} ${SITE.currency}`));
  L.push('');
  L.push(`المجموع: ${money(o.subtotal)} ${SITE.currency}`);
  L.push(`التوصيل: ${o.fee ? money(o.fee) + ' ' + SITE.currency : 'مجاناً'}`);
  L.push(`*الإجمالي: ${money(o.total)} ${SITE.currency}*`);
  return L.join('\n');
}
function waLink(text){ return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`; }

/* بث تغيّر الحالة */
const listeners = [];
function onChange(fn){ listeners.push(fn); }
function emit(){ listeners.forEach(f => f()); }

/* التنبيهات */
function toast(msg, type){
  const box = document.getElementById('toasts'); if(!box) return;
  const el = document.createElement('div');
  el.className = 'toast ' + (type || '');
  el.innerHTML = icon(type === 'err' ? 'close' : type === 'ok' ? 'check' : 'bolt') + `<span>${msg}</span>`;
  box.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2600);
}
