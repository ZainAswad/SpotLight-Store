/* ================= مشترك بين المتجر ولوحة التحكم =================
   يُحمَّل في index.html و admin.html معاً. أي دالة هنا يجب أن تعمل في
   الصفحتين — لا تنقل شيئاً منها إلى ملف تحمّله صفحة واحدة فقط.     */

/* ---------- تطبيع النص العربي ----------
   يوحّد الهمزات والتاء المربوطة والألف المقصورة، ويحذف التشكيل
   والتطويل، ويضغط المسافات — ليطابق «أبيض» و«ابيض» و«أبْيَض». */
function normAr(s){
  return String(s == null ? '' : s)
    .replace(/[ً-ْٰـ]/g, '')   // تشكيل وتطويل
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىئ]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/* ---------- تخمين اللون من اسمه ----------
   صاحب المحل يكتب «أبيض» ولا يفتح منتقي الألوان، فلولا التخمين
   ظهرت القيم كلها بلون واحد. المفاتيح مطبَّعة مسبقاً. */
const COLOR_WORDS = {
  'ابيض':'#FFFFFF', 'white':'#FFFFFF', 'ثلجي':'#FAFAFA', 'عاجي':'#FFFFF0',
  'اسود':'#111111', 'black':'#111111', 'فحمي':'#2B2B2B',
  'رمادي':'#9AA0AA', 'سكني':'#9AA0AA', 'grey':'#9AA0AA', 'gray':'#9AA0AA',
  'فضي':'#C0C4C9', 'silver':'#C0C4C9', 'كروم':'#CFD4D9', 'ستيل':'#B9C0C7',
  'ذهبي':'#C9A24A', 'gold':'#C9A24A', 'نحاسي':'#B87333', 'برونزي':'#8C7853',
  'ازرق':'#2F6FD0', 'blue':'#2F6FD0', 'كحلي':'#233265', 'نيلي':'#2B3A8F',
  'سماوي':'#5BC0EB', 'تركوازي':'#2EC4B6', 'فيروزي':'#2EC4B6', 'لبني':'#A8D5F2',
  'اخضر':'#2E9E4F', 'green':'#2E9E4F', 'زيتوني':'#7A8B35', 'فستقي':'#A7C957',
  'احمر':'#E03131', 'red':'#E03131', 'خمري':'#7B1E2B', 'عنابي':'#8C2337', 'قرميدي':'#B5432F',
  'وردي':'#E58FB0', 'زهري':'#E58FB0', 'pink':'#E58FB0', 'فوشي':'#D6336C',
  'بنفسجي':'#7A4FBF', 'موف':'#9B72CF', 'purple':'#7A4FBF', 'ارجواني':'#7A2E6B',
  'برتقالي':'#F08C2E', 'orange':'#F08C2E', 'مشمشي':'#F3B27A',
  'اصفر':'#F2C230', 'yellow':'#F2C230', 'ليموني':'#E8E23F',
  'بيج':'#D8C6A8', 'بيجي':'#D8C6A8', 'beige':'#D8C6A8', 'كريمي':'#EFE3CF', 'شمباني':'#E6D5B8',
  'بني':'#7A5230', 'brown':'#7A5230', 'جوزي':'#6B4423', 'خشبي':'#A9793F',
  'شفاف':'#EDF1F7', 'زجاجي':'#EDF1F7', 'كرستال':'#EAF0F6'
};
/* كلمات تعدّل درجة اللون بدل أن تكون لوناً */
const COLOR_MODS = { 'فاتح':0.22, 'لايت':0.22, 'غامق':-0.22, 'غامج':-0.22, 'داكن':-0.22, 'دارك':-0.22 };
const DEFAULT_SWATCH = '#cccccc';

function shadeHex(hex, amt){
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if(!m) return hex;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c =>
    Math.max(0, Math.min(255, Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt)))));
  return '#' + ch.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/* يرجع لوناً سداسياً، أو '' إن لم يُعرف الاسم */
function guessColor(label){
  const t = normAr(label);
  if(!t) return '';
  if(COLOR_WORDS[t]) return COLOR_WORDS[t];
  /* اسم مركّب: نأخذ أول كلمة معروفة، ونطبّق «فاتح/غامق» إن وُجدت */
  const words = t.split(/[\s\-/،,]+/).filter(Boolean);
  let base = '', mod = 0;
  words.forEach(w => {
    if(!base && COLOR_WORDS[w]) base = COLOR_WORDS[w];
    if(COLOR_MODS[w] !== undefined) mod = COLOR_MODS[w];
  });
  if(!base) return '';
  return mod ? shadeHex(base, mod) : base;
}

/* اللون المعتمد لقيمة خيار.
   اللون الافتراضي القديم يُعامَل كغير مضبوط فيُخمَّن، وبهذا تُصلح
   البيانات المنشورة سابقاً نفسها بلا إعادة إدخال. أما اللون الذي
   اختاره صاحب المحل يدوياً فلا يدهسه التخمين. */
function swatchOf(v){
  const set = String((v && v.swatch) || '').trim().toLowerCase();
  const unset = !set || set === DEFAULT_SWATCH;
  if(!unset) return set;
  return guessColor(v && v.label) || set || DEFAULT_SWATCH;
}

/* ---------- الأسعار ----------
   السعر بالدينار اختياري. قد يكون التسعير بالدولار مع مدى صرف، أو
   لا سعر إطلاقاً فيصير «السعر عند الطلب». */
function usdRate(){
  /* في اللوحة نقرأ من المسودّة D.SITE كي يظهر أثر التعديل قبل النشر */
  const S = (typeof D !== 'undefined' && D && D.SITE) || (typeof SITE !== 'undefined' ? SITE : null);
  const r = (S && S.usdRate) || {};
  const min = +r.min || 0, max = +r.max || 0;
  if(!min && !max) return null;
  return { min: min || max, max: max || min };
}
function num(v){ const n = +v; return Number.isFinite(n) && n > 0 ? n : 0; }

/* سعر كيان (مادة أو قيمة خيار): الدينار يسبق الدولار */
function priceOf(o){
  const iqd = num(o && o.price);
  if(iqd) return { kind:'iqd', iqd };
  const usd = num(o && o.usd);
  if(usd){
    const r = usdRate();
    if(r) return { kind:'usd', usd, min: Math.round(usd * r.min), max: Math.round(usd * r.max) };
    /* دولار بلا سعر صرف مضبوط: لا يمكن اشتقاق مبلغ بالدينار،
       فيُعرض الدولار ويُعامَل شراؤه معاملة «عند الطلب» كي لا يُباع بصفر. */
    return { kind:'usd', usd, min:0, max:0, norate:true };
  }
  return { kind:'ask' };
}
/* المبلغ المحتسب في السلة والطلب — أعلى المدى فلا يقلّ المحصَّل عن الواقع */
function chargeOf(pr){ return pr.kind === 'iqd' ? pr.iqd : (pr.kind === 'usd' ? pr.max : 0); }
