/* =============================================================
   سبوت لايت للكهربائيات والانارة الحديثة
   ملف البيانات — وُلّد من لوحة التحكم بتاريخ ٣١‏/٨‏/٢٠٢٦، ١٠:٠٥:٢٧ ص
   يمكن تعديله يدوياً أيضاً، أو من admin.html
   ============================================================= */

/* ---------- 1) إعدادات المتجر ---------- */
let SITE = {
  name: 'سبوت لايت للكهربائيات والانارة الحديثة',
  shortName: 'SpotLight',
  nameEn: 'SpotLight Electrics',
  tagline: 'كل ما يضيء',
  about: 'وجهتكم الأولى لكل ما يخص الكهرباء 💡 أساسيات التأسيس | كماليات الإنارة | بوردات عملية | قواطع | سويجات | ثريات | كل احتياجاتكم. الدقة في اختيارنا، والضمان في جودتنا. التفاصيل تصنع الفرق.. و«سبوت لايت» يبرزها.',
  currency: 'د.ع',
  siteUrl: 'https://spot-light-store.vercel.app',
  phones: [
    { label: 'الفرع الأول', number: '07719222273', intl: '9647719222273' },
    { label: 'الفرع الأول', number: '07819222273', intl: '9647819222273' },
    { label: 'الفرع الثاني', number: '07760199193', intl: '9647760199193' }
  ],
  whatsapp: '9647719222273',
  address: 'الفرع الأول: كربلاء — حي العباس — مقابل عمود 7',
  city: 'كربلاء',
  hours: [
    { d: 'كل أيام الأسبوع', t: '8:00 صباحاً — 11:00 مساءً' }
  ],
  geo: { lat: 32.6350764, lng: 44.0455457, zoom: 15 },
  // الفروع — الموقع يعمل بفرع واحد أو بلا فروع
  branches: [
    { name: 'الفرع الاول', address: 'كربلاء — حي العباس — مقابل عمود 7',
      geo: { lat: 32.6350764, lng: 44.0455457, zoom: 15 },
      phone: '07719222273', hours: 'جميع ايام الاسبوع  من 8:00 صباحاً — 11:00 مساءً' },
    { name: 'الفرع الثاني', address: 'كربلاء — شارع محطة سماء كربلاء مقابل الحي الصناعي — قرب تقاطع الوفاء والميلاد',
      geo: { lat: 0, lng: 0, zoom: 15 },
      phone: '07760199193', hours: 'جميع ايام الاسبوع 8:00 صباحاً — 11:00 مساءً' }
  ],
  social: [
    { id: 'facebook', name: 'فيسبوك', url: 'https://web.facebook.com/spotlight.karbala/' },
    { id: 'instagram', name: 'انستغرام', url: 'https://www.instagram.com/p/DXHPmpBFzHg/' },
    { id: 'tiktok', name: 'تيك توك', url: '' },
    { id: 'telegram', name: 'تيليكرام', url: '' }
  ],
  // نظام الطلبات (Firebase) — راجع FIREBASE.md
  firebase: {
    apiKey: 'AIzaSyBbTfF51126q-smnV41XDoml79LCfhKpho',
    projectId: 'spotlight-store-af9bd',
    adminEmail: 'gaith.khu.2003@gmail.com'
  },
  // إعدادات لوحة التحكم (admin.html) — غيّر كلمة السر من داخل اللوحة نفسها
  admin: {
    hash: '6d8a1b94a7c55fdb9c2289bf1bcaa8ed705f139bf0bde4845900ba5ce5b01d33',
    repo: 'ZainAswad/SpotLight-Store',
    branch: 'main'
  },
  orders: {
    prefix: 'SL',
    minOrder: 0,
    deliveryFeeInCity: 5000,
    deliveryFeeOutCity: 15000,
    freeDeliveryOver: 250000,
    webhook: ''
  },
  governorates: [
    'كربلاء', 'بغداد', 'بابل', 'النجف الأشرف', 'الديوانية', 'واسط', 'ذي قار', 'المثنى', 'البصرة', 'ميسان', 'الأنبار', 'صلاح الدين', 'ديالى', 'كركوك', 'نينوى', 'أربيل', 'السليمانية', 'دهوك'
  ]
};

/* ---------- 2) شجرة الأقسام ---------- */
let CATEGORIES = [
  {
    id: 'lighting', name: 'الإنارة الحديثة', icon: 'bulb',
    blurb: 'أنظمة إنارة عصرية توازن بين الجمال وكفاءة الطاقة',
    subs: [
    { id: 'profile', name: 'البروفايل', icon: 'profile' },
    { id: 'ceiling', name: 'الإنارة السقفية والتعليق', icon: 'chandelier' },
    { id: 'wall', name: 'الإنارة الجدارية', icon: 'wallLight' },
    { id: 'magnetic', name: 'الإنارة المغناطيسية', icon: 'magnetic' },
    { id: 'strip', name: 'النشرات وملحقاتها', icon: 'strip' },
    { id: 'spot', name: 'سبوت لايت', icon: 'spot' },
    { id: 'bracket', name: 'براكيت', icon: 'bracket' },
    { id: 'bulbs', name: 'المصابيح', icon: 'bulb' }
    ]
  },
  {
    id: 'cables', name: 'الكيبلات والأسلاك', icon: 'cableRoll',
    blurb: 'أسلاك نحاسية أصلية بمناشئ موثوقة وبكل المقاسات',
    subs: [
    { id: 'zafira', name: 'كيبلات الظفيرة', icon: 'cableRoll' },
    { id: 'tasees', name: 'أسلاك التأسيس', icon: 'wire' },
    { id: 'siemens', name: 'أسلاك سيمنز', icon: 'cableRoll' },
    { id: 'single', name: 'أسلاك السنكل', icon: 'wire' },
    { id: 'fanar', name: 'أسلاك الفنار', icon: 'cableRoll' },
    { id: 'gc', name: 'أسلاك GC', icon: 'wire' },
    { id: 'aqaba', name: 'أسلاك العقبة', icon: 'cableRoll' },
    { id: 'mustaqbal', name: 'أسلاك المستقبل السعودي', icon: 'wire' }
    ]
  },
  {
    id: 'tools', name: 'العدد اليدوية والتأسيسات الكهربائية', icon: 'screwdriver',
    blurb: 'كل ما يحتاجه الفني المحترف من عدد ومواد تأسيس',
    subs: [
    { id: 'qashtat', name: 'القاشطات', icon: 'plier' },
    { id: 'screwdrivers', name: 'الدرنفيس والمفكات', icon: 'screwdriver' },
    { id: 'measuring', name: 'أدوات القياس', icon: 'multimeter' },
    { id: 'taramil', name: 'الترامل', icon: 'drill' },
    { id: 'conduits', name: 'بواري التأسيس الكهربائي', icon: 'conduit' },
    { id: 'trayCable', name: 'التري كيبل', icon: 'tray' },
    { id: 'blades', name: 'الشفرات والمقصات', icon: 'blade' },
    { id: 'screws', name: 'البراغي', icon: 'screw' },
    { id: 'installMats', name: 'مواد التأسيس الكهربائي', icon: 'junction' },
    { id: 'safety', name: 'السلامة المهنية', icon: 'helmet' }
    ]
  },
  {
    id: 'boards', name: 'البوردات ومواد السيطرة ATS', icon: 'board',
    blurb: 'لوحات توزيع وقواطع وأنظمة تحويل تلقائي بمواصفات عالمية',
    subs: [
    { id: 'acb', name: 'القواطع الهوائية', icon: 'breaker' },
    { id: 'ats', name: 'أجهزة التحويل الحديثة', icon: 'ats' },
    { id: 'homeProtect', name: 'أجهزة حماية المنزل', icon: 'protector' },
    { id: 'panels', name: 'البوردات', icon: 'board' },
    { id: 'joints', name: 'الجوزات', icon: 'junction' },
    { id: 'relay', name: 'الريلي', icon: 'relay' },
    { id: 'indicator', name: 'مصابيح الإشارة', icon: 'indicator' }
    ]
  },
  {
    id: 'electrical', name: 'المواد الكهربائية', icon: 'socket',
    blurb: 'أجهزة ومستلزمات كهربائية للمنزل والمشاريع',
    subs: [
    { id: 'protection', name: 'أجهزة الحماية', icon: 'protector' },
    { id: 'changeover', name: 'أجهزة التحويل', icon: 'ats' },
    { id: 'carrier', name: 'السيار الكهربائي', icon: 'extension' },
    { id: 'satellite', name: 'الستلايت وملحقاته', icon: 'satellite' },
    { id: 'exhaust', name: 'المفرغات', icon: 'exhaust' },
    { id: 'fans', name: 'المراوح السقفية والجدارية والعمودية', icon: 'fan' },
    { id: 'pumps', name: 'ماطورات الماء والبوستر', icon: 'pump' },
    { id: 'doorbell', name: 'الجرس المنزلي', icon: 'doorbell' }
    ]
  }
];

/* ---------- 3) العلامات التجارية ---------- */
let BRANDS = [
  { name: 'Aswar', ar: 'أسوار', logo: 'assets/img/brands/aswar.png' },
  { name: 'Siemens', ar: 'سيمنز', logo: 'assets/img/brands/siemens.png' },
  { name: 'Schneider', ar: 'شنايدر', logo: 'assets/img/brands/schneider.png' },
  { name: 'Philips', ar: 'فيليبس', logo: 'assets/img/brands/philips.png' },
  { name: 'Hikvision', ar: 'هيك فيجن', logo: 'assets/img/brands/hikvision.png' },
  { name: 'ABB', ar: 'إيه بي بي', logo: 'assets/img/brands/abb.png' },
  { name: 'Panasonic', ar: 'باناسونيك', logo: 'assets/img/brands/panasonic.png' },
  { name: 'GC', ar: 'جي سي', logo: 'assets/img/brands/gc.png' },
  { name: 'Al-Fanar', ar: 'الفنار', logo: 'assets/img/brands/fanar.png' },
  { name: 'Aqaba', ar: 'العقبة', logo: 'assets/img/brands/aqaba.png' },
  { name: 'Almustaqbal', ar: 'المستقبل السعودي', logo: 'assets/img/brands/mustaqbal.png' },
  { name: 'Ingco', ar: 'إنجكو', logo: 'assets/img/brands/ingco.png' },
  { name: 'CHINT', ar: 'جاينت', logo: 'assets/img/brands/chint.png' },
  { name: 'TOTAL', ar: 'توتال', logo: 'assets/img/brands/total.png' },
  { name: 'dahua', ar: 'داهوا', logo: 'assets/img/brands/dahua.png' }
];

/* ---------- 4) المنتجات ---------- */
let PRODUCTS = [
  { id: 'TEST-001', name: 'منتج تجريبي - للحذف', brand: 'تجريبي', price: 1000, icon: 'bulb',
    cats: ['lighting/bulbs'], desc: 'مادة تجريبية مؤقتة لاختبار دورة الطلب — تُحذف عند إدخال المنتجات الحقيقية.',
    specs: ['للاختبار فقط', 'يُحذف لاحقاً'] }
];
