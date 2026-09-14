/* ===== عامل الخدمة — سبوت لايت =====
   غايته الوحيدة أن يصير المتجر واللوحة تطبيقين يُثبَّتان على الشاشة الرئيسية،
   وأن يفتحا عند انقطاع الإنترنت. ليس غايته تسريع التحميل.

   القاعدة الملزمة: الشبكة أولاً دائماً، والمخزَّن احتياطٌ عند الانقطاع فقط.
   لا cache-first لأي شيء — ولا استثناء لـ data.js ولا للصور. السبب عملي:
   صاحب المحل ينشر تعديلاً من اللوحة ثم يفتح متجره، فلو خدمناه من المخزون
   رأى نسخته القديمة بلا سبب مفهوم — وهذا أسوأ من بطء بسيط. */

const VERSION  = 'v1';                 /* ارفعه لتُمسح المخازن القديمة */
const CACHE    = 'spotlight-' + VERSION;
/* تخزين مسبق للصفحتين فقط — وهو ما يجعل التطبيقين يفتحان دون إنترنت.
   /admin لا /admin.html لأن cleanUrls في vercel.json يجعل الأولى هي
   العنوان المُقدَّم فعلاً، والثانية تُحوَّل إليها بـ 308. واستجابةٌ مُحوَّلة
   لا تصلح للملاحة من المخزون. */
const PRECACHE = ['/', '/admin'];

self.addEventListener('install', e => {
  self.skipWaiting();                  /* يحلّ التحديث فوراً — فلو نشرنا عاملاً فيه خلل استبدلناه بسرعة */
  e.waitUntil(
    caches.open(CACHE).then(c =>
      /* فشل التخزين المسبق لا يُفشل التثبيت: الموقع يعمل كاملاً بدون مخزون */
      Promise.all(PRECACHE.map(u => c.add(new Request(u, { cache:'reload' })).catch(() => {})))
    ).catch(() => {})
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .catch(() => {})
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;                                  /* لا نلمس غير GET */
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;                   /* Firebase وGitHub يمرّان كما هما */

  e.respondWith(
    fetch(req)
      .then(res => {
        /* نحتفظ بنسخة للطوارئ فقط — لا تُقدَّم ما دامت الشبكة تستجيب */
        if(res && res.ok && res.type === 'basic' && !res.redirected){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then(hit => {
          if(hit) return hit;
          if(req.mode === 'navigate')
            return caches.match(url.pathname.indexOf('/admin') === 0 ? '/admin' : '/');
          return Response.error();
        })
      )
  );
});
