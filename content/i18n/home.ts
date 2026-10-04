import type { IntlLocale } from "@/lib/i18n";
import { facts } from "./ui";

// Arabic and English home-page copy: drafts translated from the approved Persian
// text (app/(fa)/(site)/page.tsx, content/home.ts, content/services.ts). No new
// claims. Needs a native proofread, and the doctor's confirmation of the wording
// of every treatment description, before launch.

export type ServiceText = { name: string; short: string };

export type HomeCopy = {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroLine: string;
  heroText: string;
  heroAlt: string;
  stats: { big: string; small: string }[];
  statsLabel: string;
  about: {
    eyebrow: string;
    title: string;
    body: string;
    rows: { k: string; v: string }[];
    button: string;
    altMain: string;
    altDetail: string;
  };
  cases: { eyebrow: string; title: string; hint: string; button: string; titles: string[] };
  services: { eyebrow: string; title: string; body: string; more: string; gallery: string };
  contact: { eyebrow: string; title: string; body: string };
  faqEyebrow: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  featuredAlt: string;
};

/** Names and one-line summaries of the ten services, keyed by service slug. */
export const serviceText: Record<IntlLocale, Record<string, ServiceText>> = {
  ar: {
    composite: { name: "الكومبوزيت التجميلي", short: "تصحيح لون الأسنان وشكلها والمسافات بينها بأقل قدر من برد السن." },
    veneers: { name: "الفينير الخزفي", short: "ابتسامة متناسقة بقشور خزفية رقيقة وثبات لوني عالٍ." },
    "smile-design": { name: "تصميم الابتسامة", short: "خطة لشكل الأسنان وحجمها ولونها بما يتناسب مع ملامح وجهك." },
    whitening: { name: "تبييض الأسنان", short: "تفتيح لون الأسنان الطبيعي تحت إشراف طبيب الأسنان." },
    implant: { name: "زراعة الأسنان", short: "تعويض السن المفقود بزرعة وتاج." },
    restoration: { name: "ترميم الأسنان", short: "ترميم السن المتضرر بمواد بلون الأسنان." },
    "root-canal": { name: "علاج العصب", short: "علاج الجذور للحفاظ على سنٍّ تضرر عصبها." },
    surgery: { name: "جراحة الفم", short: "جراحات الفم الخارجية دون مبيت، مثل خلع الأسنان المطمورة." },
    orthodontics: { name: "تقويم الأسنان", short: "تصحيح تزاحم الأسنان وإطباق الفكين." },
    consultation: { name: "الفحص والاستشارة", short: "فحص حالة الأسنان ومراجعة خيارات العلاج." },
  },
  en: {
    composite: { name: "Composite bonding", short: "Corrects the colour, shape and gaps of teeth with minimal tooth reduction." },
    veneers: { name: "Ceramic veneers", short: "An even smile with thin ceramic shells and high colour stability." },
    "smile-design": { name: "Smile design", short: "A plan for the shape, size and colour of your teeth, matched to your face." },
    whitening: { name: "Teeth whitening", short: "Lightening the natural shade of your teeth under a dentist's supervision." },
    implant: { name: "Dental implants", short: "Replacing a missing tooth with an implant and a crown." },
    restoration: { name: "Restorations", short: "Rebuilding a damaged tooth with tooth-coloured materials." },
    "root-canal": { name: "Root canal treatment", short: "Root treatment to save a tooth whose nerve is damaged." },
    surgery: { name: "Oral surgery", short: "Outpatient oral surgery, such as removing impacted teeth." },
    orthodontics: { name: "Orthodontics", short: "Correcting crooked teeth and the bite between the jaws." },
    consultation: { name: "Examination and consultation", short: "Checking the state of your teeth and reviewing treatment options." },
  },
};

export const homeCopy: Record<IntlLocale, HomeCopy> = {
  ar: {
    metaTitle: "طبيبة أسنان تجميلية في شيراز، معالي‌آباد | د. فاطمة جعفري",
    metaDescription:
      "الدكتورة فاطمة جعفري، طبيبة أسنان تجميلية بخبرة تزيد عن 10 سنوات في شيراز، معالي‌آباد: الكومبوزيت والفينير الخزفي وتصميم الابتسامة. تواصل لحجز موعد.",
    heroEyebrow: "عيادة طب الأسنان التجميلي",
    heroLine: "الكومبوزيت · الفينير الخزفي",
    heroText: "عيادة مجهزة بأحدث معدات وتقنيات طب الأسنان، لابتسامة طبيعية تدوم.",
    heroAlt: "الدكتورة فاطمة جعفري",
    stats: [
      { big: "+10 سنوات", small: "من الخبرة في طب الأسنان التجميلي" },
      { big: "الكومبوزيت والفينير الخزفي", small: "محور عمل العيادة" },
      { big: "الدفع بالتقسيط", small: "للعلاجات التجميلية" },
    ],
    statsLabel: "عن العيادة",
    about: {
      eyebrow: "تعرّف على الطبيبة",
      title: "العناية بالتفاصيل لابتسامة طبيعية",
      body: "تعمل الدكتورة فاطمة جعفري في طب الأسنان التجميلي في شيراز منذ أكثر من عشر سنوات، ويتركّز عملها على الكومبوزيت والفينير الخزفي. تصمّم كل ابتسامة بما يتناسب مع ملامح الوجه، وتحافظ قدر الإمكان على نسيج السن الطبيعي، لتبدو النتيجة طبيعية وتبقى جميلة لسنوات.",
      rows: [
        { k: "النهج", v: "الحفاظ قدر الإمكان على نسيج السن الطبيعي" },
        { k: "التصميم", v: "بما يتناسب مع الوجه" },
        { k: "الاستشارة", v: "مراجعة جميع الخيارات قبل العلاج" },
        { k: "رقم نظام الأطباء (إيران)", v: facts.ar.council },
      ],
      button: "عن الدكتورة جعفري",
      altMain: "الدكتورة فاطمة جعفري أثناء علاج مريض في العيادة",
      altDetail: "الدكتورة فاطمة جعفري أثناء الفحص",
    },
    cases: {
      eyebrow: "نماذج من أعمالنا",
      title: "قارنوا النتيجة بأنفسكم",
      hint: "اسحب الخط في منتصف كل صورة لترى الحالة قبل العلاج وبعده.",
      button: "عرض جميع النماذج",
      titles: ["فينير الكومبوزيت", "الفينير الخزفي", "تصميم الابتسامة"],
    },
    services: {
      eyebrow: "خدمات العيادة",
      title: "ابتسامتك، بدقة ورقّة",
      body: "يتركّز عمل العيادة على الكومبوزيت والفينير الخزفي، إلى جانب خدمات طب الأسنان الشاملة.",
      more: "اعرف المزيد",
      gallery: "عرض النماذج",
    },
    contact: {
      eyebrow: "حجز موعد",
      title: "ابدأ بجلسة استشارة",
      body: "في هذه الجلسة تُفحص حالة أسنانك ونراجع معًا خيارات العلاج المناسبة لك.",
    },
    faqEyebrow: "أسئلة شائعة",
    faqTitle: "قبل الجلسة الأولى",
    faq: [
      {
        q: "ما الفرق بين الكومبوزيت والفينير الخزفي، وأيهما يناسبني؟",
        a: "كلاهما يجعل الابتسامة أجمل، لكن الكومبوزيت يحتاج إلى برد أقل للسن وتكلفته أقل، بينما يتميّز الفينير الخزفي بثبات لوني أكبر. يعتمد الاختيار المناسب على حالة أسنانك وما ترغب به، ويُحدَّد في جلسة الاستشارة.",
      },
      {
        q: "كيف أحجز موعدًا في عيادة الدكتورة فاطمة جعفري؟",
        a: "راسل العيادة عبر واتساب أو اتصل بها لتحديد موعد. أصحاب الأرقام الإيرانية يمكنهم أيضًا الحجز مباشرة عبر الموقع بتأكيد رقم الجوال برمز نصي.",
      },
      {
        q: "هل يمكن الدفع بالتقسيط؟",
        a: "نعم. تتوفّر إمكانية الدفع بالتقسيط للعلاجات التجميلية مثل الكومبوزيت والفينير، وتُشرح شروطها في جلسة الاستشارة.",
      },
      {
        q: "أين تقع العيادة وما أيام الدوام؟",
        a: `عيادة الدكتورة فاطمة جعفري لطب الأسنان التجميلي في شيراز، معالي‌آباد: ${facts.ar.address}. ساعات العمل: ${facts.ar.hours}؛ ${facts.ar.closedDays}.`,
      },
    ],
    featuredAlt: "ابتسامة بفينير خزفي لامع وطبيعي، من الجانب",
  },
  en: {
    metaTitle: "Cosmetic dentist in Shiraz, Maaliabad | Dr. Fatemeh Jafari",
    metaDescription:
      "Dr. Fatemeh Jafari, a cosmetic dentist with more than 10 years of experience in Maaliabad, Shiraz: composite bonding, ceramic veneers and smile design. Contact us to book.",
    heroEyebrow: "Cosmetic dental clinic",
    heroLine: "Composite · Ceramic veneers",
    heroText: "A clinic equipped with modern dental equipment and technology, for a natural smile that lasts.",
    heroAlt: "Dr. Fatemeh Jafari",
    stats: [
      { big: "10+ years", small: "of experience in cosmetic dentistry" },
      { big: "Composite and ceramic veneers", small: "The clinic's main focus" },
      { big: "Payment in instalments", small: "for cosmetic treatments" },
    ],
    statsLabel: "About the clinic",
    about: {
      eyebrow: "Meet the doctor",
      title: "Attention to detail, for a natural smile",
      body: "Dr. Fatemeh Jafari has practised cosmetic dentistry in Shiraz for more than ten years, with a focus on composite bonding and ceramic veneers. She designs each smile to suit the face and preserves as much natural tooth structure as possible, so the result looks natural and stays beautiful for years.",
      rows: [
        { k: "Approach", v: "Preserving as much natural tooth as possible" },
        { k: "Design", v: "Matched to the face" },
        { k: "Consultation", v: "All options reviewed before treatment" },
        { k: "Iran Medical Council no.", v: facts.en.council },
      ],
      button: "About Dr. Jafari",
      altMain: "Dr. Fatemeh Jafari treating a patient at the clinic",
      altDetail: "Dr. Fatemeh Jafari during an examination",
    },
    cases: {
      eyebrow: "Our work",
      title: "Compare the result yourself",
      hint: "Drag the line in the middle of each image to see before and after treatment.",
      button: "View all our work",
      titles: ["Composite veneers", "Ceramic veneers", "Smile design"],
    },
    services: {
      eyebrow: "Clinic services",
      title: "Your smile, with care and precision",
      body: "The clinic focuses on composite bonding and ceramic veneers, alongside a full range of dental services.",
      more: "Learn more",
      gallery: "View our work",
    },
    contact: {
      eyebrow: "Book an appointment",
      title: "Start with a consultation",
      body: "At this session your teeth are examined and we go through the treatment options that suit you together.",
    },
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Before your first visit",
    faq: [
      {
        q: "Composite bonding or ceramic veneers: which one suits me?",
        a: "Both make a smile look better, but composite needs less tooth reduction and costs less, while ceramic veneers keep their colour better. The right choice depends on the condition of your teeth and what you want, and is settled at the consultation.",
      },
      {
        q: "How do I book an appointment at Dr. Fatemeh Jafari's clinic?",
        a: "Message the clinic on WhatsApp or call to arrange an appointment. Patients with an Iranian mobile number can also book directly on the website by confirming their number with a text-message code.",
      },
      {
        q: "Is payment in instalments available?",
        a: "Yes. Payment in instalments is available for cosmetic treatments such as composite bonding and veneers. The terms are explained at the consultation.",
      },
      {
        q: "Where is the clinic and which days is it open?",
        a: `Dr. Fatemeh Jafari's cosmetic dental clinic is in Maaliabad, Shiraz: ${facts.en.address}. Opening hours: ${facts.en.hours}. ${facts.en.closedDays}.`,
      },
    ],
    featuredAlt: "A smile with glossy, natural-looking ceramic veneers, side view",
  },
};
