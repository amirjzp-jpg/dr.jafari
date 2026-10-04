import type { IntlLocale } from "@/lib/i18n";
import { facts } from "./ui";

// Arabic and English text for the pages beyond the home page and the services.
// Translated from the approved Persian pages (app/(fa)/(site)/*); no new clinical
// facts. Draft for a native proofread. Sentences marked "addition" below have no
// Persian original (they exist because patients abroad cannot use the SMS-code
// booking) and are listed in TODO-content.md for the clinic to approve.

export type RichSection = { h: string; p?: string[]; ul?: string[] };
// "{phone}" inside a string is replaced by the clinic phone link.

export type PagesCopy = {
  home: string;
  breadcrumbLabel: string;
  cta: { eyebrow: string; title: string; orCall: string; aria: string };
  about: {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    crumb: string;
    paragraphs: string[];
    rows: { k: string; v: string }[];
    altMain: string;
    altDetail: string;
  };
  location: {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    crumb: string;
    lead: string;
    whereTitle: string;
    treatmentsTitle: string;
    treatmentsBody: string;
    bookingTitle: string;
    bookingBody: string;
    doctorTitle: string;
    doctorBody: string;
    doctorLink: string;
  };
  gallery: {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    crumb: string;
    lead: string;
    note: string;
    ctaTitle: string;
    schemaName: string;
  };
  privacy: { metaTitle: string; metaDescription: string; h1: string; crumb: string; sections: RichSection[] };
  policy: { metaTitle: string; metaDescription: string; h1: string; crumb: string; sections: RichSection[] };
  stay: {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    crumb: string;
    lead: string;
    tableTitle: string;
    colTreatment: string;
    colTime: string;
    /** A service row links to its page (`slug`); a row with only a `label` is a general kind of visit. */
    rows: { slug?: string; label?: string; time: string; note?: string }[];
    faq: { q: string; a: string }[];
    ctaTitle: string;
    ctaBody: string;
    footerLink: string;
    contactLink: string;
  };
  contact: {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    crumb: string;
    lead: string;
    waTitle: string;
    waBody: string;
    waButton: string;
    phoneTitle: string;
    visitTitle: string;
    visitBody: string;
    teamNote: string;
    iranTitle: string;
    iranBody: string;
    iranButton: string;
    placeTitle: string;
  };
};

export const pagesCopy: Record<IntlLocale, PagesCopy> = {
  ar: {
    home: "الرئيسية",
    breadcrumbLabel: "مسار الصفحة",
    cta: { eyebrow: "حجز موعد", title: "ابدأ بجلسة استشارة", orCall: "أو اتصل بنا:", aria: "حجز موعد" },
    about: {
      metaTitle: "الدكتورة فاطمة جعفري، طبيبة أسنان تجميلية في شيراز",
      metaDescription:
        "الدكتورة فاطمة جعفري، طبيبة أسنان تجميلية في شيراز، معالي‌آباد، بخبرة تزيد عن عشر سنوات في الكومبوزيت والفينير الخزفي. رقم نظام الأطباء 169473.",
      h1: "عن الدكتورة فاطمة جعفري",
      crumb: "عن الطبيبة",
      paragraphs: [
        "الدكتورة فاطمة جعفري، طبيبة أسنان تجميلية بخبرة تزيد عن 10 سنوات، تستقبل مرضاها في عيادتها في شيراز، معالي‌آباد. ويتركّز عملها على الكومبوزيت والفينير الخزفي.",
        "ترى أن الابتسامة الجميلة هي التي تناسب وجهك أنت، لا قالبًا مكرّرًا. ولهذا يبدأ كل علاج بالإصغاء إلى ما تريده وفحص الأسنان بدقة، ثم يُصمَّم شكل الابتسامة بما يتناسب مع ملامح الوجه والشفتين واللون الطبيعي للأسنان.",
        "الحفاظ على نسيج السن الطبيعي أولوية عندها. فحيثما أمكن الوصول إلى النتيجة المرجوّة بأقل قدر من برد السن اخترنا هذه الطريقة، وتُراجَع معك جميع الخيارات، بمزاياها وقيودها، قبل بدء العلاج.",
        "تقع العيادة في شيراز عند جسر معالي‌آباد؛ وهي عيادة مجهزة بأحدث معدات وتقنيات طب الأسنان.",
      ],
      rows: [
        { k: "النهج", v: "الحفاظ قدر الإمكان على نسيج السن الطبيعي" },
        { k: "التصميم", v: "بما يتناسب مع الوجه" },
        { k: "الاستشارة", v: "مراجعة جميع الخيارات قبل العلاج" },
        { k: "رقم نظام الأطباء (إيران)", v: facts.ar.council },
      ],
      altMain: "الدكتورة فاطمة جعفري أثناء علاج مريض في العيادة",
      altDetail: "الدكتورة فاطمة جعفري أثناء الفحص",
    },
    location: {
      metaTitle: "طب الأسنان التجميلي في معالي‌آباد، شيراز",
      metaDescription:
        "عيادة الدكتورة فاطمة جعفري لطب الأسنان التجميلي في شيراز، جسر معالي‌آباد، بجوار بنك تجارت. العنوان وساعات العمل والخدمات وطريقة الحجز.",
      h1: "طب الأسنان التجميلي في معالي‌آباد، شيراز",
      crumb: "طب الأسنان في معالي‌آباد",
      lead: "تقع عيادة الدكتورة فاطمة جعفري لطب الأسنان التجميلي في شيراز عند جسر معالي‌آباد: في بداية شارع تاچارا، مقابل الجسر وبجوار بنك تجارت، في مبنى «موجودي»، الطابق الرابع.",
      whereTitle: "العنوان وساعات العمل",
      treatmentsTitle: "ما العلاجات التي تُجرى في هذه العيادة؟",
      treatmentsBody:
        "الكومبوزيت والفينير الخزفي وتصميم الابتسامة هي الخدمات الرئيسية للعيادة. كما تُجرى خدمات التبييض والزراعة والترميم وعلاج العصب والجراحة والتقويم. ولكل خدمة صفحة تشرحها.",
      bookingTitle: "كيف أحجز موعدًا؟",
      bookingBody:
        "الزيارة الأولى عادةً جلسة «فحص واستشارة» مدتها 30 دقيقة. يمكنك مراسلة العيادة عبر واتساب أو الاتصال بها لتحديد موعد.",
      doctorTitle: "عن الطبيبة",
      doctorBody: "الدكتورة فاطمة جعفري، طبيبة أسنان تجميلية بخبرة تزيد عن 10 سنوات، رقم نظام الأطباء {council}.",
      doctorLink: "اقرأ المزيد عن الطبيبة",
    },
    gallery: {
      metaTitle: "نماذج من أعمال تجميل الأسنان في شيراز، إيران",
      metaDescription:
        "صور حقيقية قبل العلاج وبعده للكومبوزيت والفينير الخزفي وتصميم الابتسامة والتبييض في عيادة الدكتورة فاطمة جعفري، معالي‌آباد، شيراز.",
      h1: "نماذج من أعمالنا",
      crumb: "نماذج الأعمال",
      lead: "نتائج العلاجات المنفَّذة في العيادة، من الكومبوزيت والفينير إلى تصميم الابتسامة والتبييض. اضغط على أي صورة لتراها أكبر؛ وفي نماذج «قبل وبعد» اسحب الخط في المنتصف.",
      note: "جميع الصور لمرضى العيادة، وقد أُجري عليها القص والتدوير فقط؛ ولم تُعدَّل الأسنان نفسها. وتعتمد نتيجة كل علاج على حالة الفم والأسنان لدى كل شخص.",
      ctaTitle: "ابتسامتك، النموذج التالي",
      schemaName: "نماذج من أعمال عيادة الدكتورة فاطمة جعفري",
    },
    privacy: {
      metaTitle: "الخصوصية",
      metaDescription: "ما المعلومات التي تُحفظ عند حجز موعد عبر موقع عيادة الدكتورة فاطمة جعفري، ولماذا، ولمدة كم.",
      h1: "الخصوصية",
      crumb: "الخصوصية",
      sections: [
        {
          h: "ما المعلومات التي تُحفظ",
          ul: [
            "رقم الجوال والاسم الكامل وسبب المراجعة وما تكتبه عند الحجز.",
            "وقت الموعد وتغييراته (التسجيل والنقل والإلغاء).",
            "يُحفظ رمز التأكيد النصي بصورة مشفّرة (تجزئة تشفيرية) ولبضع دقائق فقط، ولا يُخزَّن الرمز نفسه في أي مكان.",
            "عنوان IP بصورة مؤقتة، لمنع إساءة الاستخدام والحدّ من الطلبات المتكررة.",
          ],
        },
        {
          h: "لماذا نحتاج إلى هذه المعلومات",
          p: [
            "لتسجيل موعدك وإدارته، وإرسال رسالة التأكيد والتذكير، والاتصال بك عند تغيير الموعد. لا نستخدم هذه المعلومات للإعلان ولا نبيعها.",
          ],
        },
        {
          h: "إرسال الرسائل النصية",
          p: [
            "تُرسل رسائل رمز التأكيد وتأكيد الموعد والتذكير وتغيير الموعد عبر منصة الرسائل sms.ir. ولهذا لا يُسلَّم إلى هذه المنصة سوى رقم الجوال ونص الرسالة.",
          ],
        },
        {
          // addition: no Persian original
          h: "واتساب",
          p: [
            "إذا راسلتنا عبر واتساب فإن رسائلك تمر عبر واتساب وتخضع لشروطه وسياسة الخصوصية الخاصة به. ونستخدم ما ترسله إلينا لترتيب موعدك والإجابة عن أسئلتك فقط.",
          ],
        },
        {
          h: "ملفات تعريف الارتباط (الكوكيز)",
          ul: [
            "ملف واحد للاحتفاظ بموعدك أثناء الحجز (يوم واحد على الأكثر).",
            "ملف لمدة تصل إلى 30 يومًا، حتى لا نطلب منك رمزًا جديدًا في الحجز التالي إذا كنت قد أكّدت رقمك.",
            "لا نستخدم ملفات إعلانية أو ملفات تتبّع تابعة لجهات خارجية. وتُجمع إحصاءات زيارة الموقع دون ملفات تعريف ارتباط ودون تحديد هوية الأشخاص.",
          ],
        },
        {
          h: "مدة الحفظ",
          p: [
            "تُحفظ سجلات المواعيد ما دام ذلك لازمًا لمتابعة علاجك وللمتطلبات القانونية. وتنتهي صلاحية رموز التأكيد بعد دقيقتين.",
          ],
        },
        {
          h: "حذف المعلومات",
          p: [
            "إذا أردت حذف معلوماتك فاتصل بالرقم {phone}. وبعد التحقق من هويتك تُحذف معلوماتك، إلا ما يلزم حفظه قانونًا.",
          ],
        },
      ],
    },
    policy: {
      metaTitle: "شروط الحجز",
      metaDescription: "شروط حجز الموعد وإلغائه وتغييره في عيادة الدكتورة فاطمة جعفري في شيراز: مهلة الإلغاء والتأخر وتغيير الموعد.",
      h1: "شروط الحجز",
      crumb: "شروط الحجز",
      sections: [
        {
          h: "الحجز عبر الإنترنت",
          ul: [
            "المواعيد عبر الإنترنت لجلسة الفحص والاستشارة (30 دقيقة). أما جلسات العلاج فتُنظَّم بعد الاستشارة بالتنسيق مع العيادة.",
            "بعد تأكيد رقم الجوال، إذا كان الوقت المختار متاحًا يُسجَّل الموعد فورًا وتُرسل رسالة تأكيد.",
            "يمكن لكل رقم جوال أن يكون له موعد واحد فعّال عبر الإنترنت في كل وقت.",
            // addition: no Persian original
            "الحجز المباشر برمز نصي متاح للأرقام الإيرانية؛ ويمكن لغيرها تحديد موعد عبر واتساب أو الهاتف.",
          ],
        },
        {
          h: "إلغاء الموعد أو تغييره",
          p: [
            "إذا لم تستطع الحضور في موعدك، يُرجى الاتصال بالرقم {phone} قبل 24 ساعة على الأقل ليُتاح الموعد لمريض آخر.",
          ],
        },
        {
          h: "التأخر",
          p: [
            "يُرجى الحضور قبل الموعد ببضع دقائق. وإذا تأخرت أكثر من 15 دقيقة فقد تُقصَّر الجلسة أو تُنقل إلى وقت آخر حتى لا تختل مواعيد المرضى التالين.",
          ],
        },
        {
          h: "عدم الحضور",
          p: ["إذا لم تحضر في موعدك دون إبلاغ مسبق، فقد يحتاج حجزك التالي إلى تأكيد هاتفي من العيادة."],
        },
        {
          h: "التغيير من جانب العيادة",
          p: ["إذا اضطرت العيادة إلى تغيير موعدك أو إلغائه، فسيُبلَّغ ذلك برسالة نصية، وبمكالمة هاتفية عند الحاجة."],
        },
      ],
    },
    stay: {
      metaTitle: "خطّط لزيارتك إلى شيراز: مدة العلاج",
      metaDescription:
        "المدة التقريبية للتخطيط في شيراز: الكومبوزيت نحو يوم واحد، والفينير الخزفي (البورسلين) والزراعة نحو شهر. عيادة د. فاطمة جعفري، شيراز، إيران.",
      h1: "خطّط لزيارتك إلى شيراز",
      crumb: "خطّط لزيارتك",
      lead: "هذه المدد تقريبية لمساعدتك في التخطيط. وتُحدَّد المدة الدقيقة بعد الفحص، بحسب حالة أسنانك وعدد الأسنان.",
      tableTitle: "المدة التقريبية لكل علاج",
      colTreatment: "العلاج",
      colTime: "المدة التي تُخطَّط في شيراز",
      rows: [
        { label: "علاج سريع (زيارة قصيرة لإصلاح مشكلة بسيطة)", time: "نحو يوم واحد" },
        { slug: "composite", time: "نحو يوم واحد" },
        { slug: "veneers", time: "نحو شهر واحد" },
        { slug: "implant", time: "نحو شهر واحد لتركيب الزرعة", note: "مدة التحام الزرعة بالعظم تختلف من شخص إلى آخر، ويشرحها الطبيب بعد الفحص." },
      ],
      faq: [
        { q: "العلاج السريع: كم يستغرق؟", a: "الزيارة القصيرة لإصلاح مشكلة بسيطة تستغرق نحو يوم واحد. وتُحدَّد المدة الدقيقة بعد الفحص." },
        { q: "كم جلسة يحتاج الكومبوزيت؟", a: "نحو يوم واحد: بحسب عدد الأسنان يتم عادةً في جلسة أو جلستين. ويُحدَّد الوقت الدقيق بعد الفحص." },
        { q: "كم جلسة يحتاج الفينير الخزفي؟", a: "نحو شهر واحد: عادةً عدة جلسات على مدى أسابيع، هي الاستشارة والتصميم، ثم التحضير وأخذ الطبعة، وفي النهاية اللصق. ويُحدَّد البرنامج الدقيق بعد الفحص." },
        { q: "كم تستغرق زراعة الأسنان؟", a: "نحو شهر واحد لتركيب الزرعة. وتعتمد مدة العلاج على حالة العظم وعدد الزرعات، وتُحدَّد بعد الفحص والتصوير." },
        { q: "كم تستغرق جلسة الاستشارة؟", a: "نحو 30 دقيقة. وفي هذا الوقت تُفحص الأسنان ونجيب عن أسئلتك حول الخيارات." },
      ],
      ctaTitle: "لمزيد من التفاصيل، تواصل معنا",
      ctaBody: "راسل العيادة عبر واتساب أو اتصل بها.",
      footerLink: "خطّط لزيارتك",
      contactLink: "كم من الوقت أحتاج في شيراز؟ خطّط لزيارتك",
    },
    contact: {
      metaTitle: "احجز موعدًا في عيادة الدكتورة فاطمة جعفري، شيراز",
      metaDescription:
        "كيفية حجز موعد في عيادة الدكتورة فاطمة جعفري لطب الأسنان التجميلي في شيراز: عبر واتساب أو الهاتف، مع العنوان وساعات العمل بتوقيت إيران.",
      h1: "احجز موعدًا",
      crumb: "احجز موعدًا",
      lead: "لتحديد موعد، راسل العيادة عبر واتساب أو اتصل بها. أصحاب أرقام الجوال الإيرانية يمكنهم الحجز مباشرة عبر الموقع.",
      waTitle: "عبر واتساب",
      waBody: "اضغط الزر لفتح محادثة مع العيادة برسالة جاهزة، ثم اكتب اسمك والعلاج الذي يهمّك والأيام التي تناسبك.",
      waButton: "احجز عبر واتساب",
      phoneTitle: "عبر الهاتف",
      visitTitle: "ماذا تتوقع في الزيارة الأولى",
      visitBody: "الزيارة الأولى عادةً جلسة فحص واستشارة مدتها نحو 30 دقيقة، نفحص فيها الأسنان ونراجع معًا خيارات العلاج.",
      teamNote: "يتحدث فريق العيادة الفارسية.",
      iranTitle: "هل لديك رقم جوال إيراني؟",
      iranBody: "يمكنك الحجز مباشرة عبر الموقع، باختيار اليوم والساعة وتأكيد رقمك برمز نصي. صفحة الحجز باللغة الفارسية.",
      iranButton: "الحجز عبر الموقع (بالفارسية)",
      placeTitle: "العنوان وساعات العمل",
    },
  },
  en: {
    home: "Home",
    breadcrumbLabel: "Breadcrumb",
    cta: { eyebrow: "Book an appointment", title: "Start with a consultation", orCall: "Or call:", aria: "Book an appointment" },
    about: {
      metaTitle: "Dr. Fatemeh Jafari, cosmetic dentist in Shiraz",
      metaDescription:
        "Dr. Fatemeh Jafari, a cosmetic dentist in Maaliabad, Shiraz, with more than ten years of experience in composite bonding and ceramic veneers. Iran Medical Council no. 169473.",
      h1: "About Dr. Fatemeh Jafari",
      crumb: "About the doctor",
      paragraphs: [
        "Dr. Fatemeh Jafari, a cosmetic dentist with more than 10 years of experience, sees patients at her own clinic in Maaliabad, Shiraz. Her work focuses on composite bonding and ceramic veneers.",
        "She believes a beautiful smile is one that suits your own face, not a repeated template. That is why every treatment starts with listening to what you want and examining your teeth carefully, and the smile is then designed to suit the shape of your face, your lips and the natural colour of your teeth.",
        "Preserving natural tooth structure is her priority. Wherever we can reach the result you want with less tooth reduction, we choose that way, and all the options, with their advantages and limits, are gone through with you before treatment begins.",
        "The clinic is by the Maaliabad Bridge in Shiraz; it is equipped with modern dental equipment and technology.",
      ],
      rows: [
        { k: "Approach", v: "Preserving as much natural tooth as possible" },
        { k: "Design", v: "Matched to the face" },
        { k: "Consultation", v: "All options reviewed before treatment" },
        { k: "Iran Medical Council no.", v: facts.en.council },
      ],
      altMain: "Dr. Fatemeh Jafari treating a patient at the clinic",
      altDetail: "Dr. Fatemeh Jafari during an examination",
    },
    location: {
      metaTitle: "Cosmetic dentistry in Maaliabad, Shiraz",
      metaDescription:
        "Dr. Fatemeh Jafari's cosmetic dental clinic in Shiraz, by the Maaliabad Bridge, next to Bank Tejarat. Address, opening hours, services and how to book.",
      h1: "Cosmetic dentistry in Maaliabad, Shiraz",
      crumb: "Dentistry in Maaliabad",
      lead: "Dr. Fatemeh Jafari's cosmetic dental clinic is by the Maaliabad Bridge in Shiraz: at the start of Tachara Street, opposite the bridge and next to Bank Tejarat, in the Mojoodi Building, 4th floor.",
      whereTitle: "Address and opening hours",
      treatmentsTitle: "Which treatments are done at this clinic?",
      treatmentsBody:
        "Composite bonding, ceramic veneers and smile design are the clinic's main services. Whitening, implants, restorations, root canal treatment, surgery and orthodontics are also done. Each service has its own page.",
      bookingTitle: "How do I book?",
      bookingBody:
        "The first visit is usually an examination and consultation of 30 minutes. You can message the clinic on WhatsApp or call to arrange an appointment.",
      doctorTitle: "About the doctor",
      doctorBody: "Dr. Fatemeh Jafari, a cosmetic dentist with more than 10 years of experience, Iran Medical Council no. {council}.",
      doctorLink: "Read more about the doctor",
    },
    gallery: {
      metaTitle: "Cosmetic dentistry results in Shiraz, Iran",
      metaDescription:
        "Real before and after photos of composite bonding, ceramic veneers, smile design and whitening at Dr. Fatemeh Jafari's clinic, Maaliabad, Shiraz.",
      h1: "Our work",
      crumb: "Our work",
      lead: "The results of treatments done at the clinic, from composite and veneers to smile design and whitening. Tap any photo to see it larger; on before-and-after examples, drag the line in the middle.",
      note: "All photos are of the clinic's patients and have only been cropped and rotated; the teeth themselves have not been edited. The result of each treatment depends on each person's mouth and teeth.",
      ctaTitle: "Your smile, the next example",
      schemaName: "Work of Dr. Fatemeh Jafari's clinic",
    },
    privacy: {
      metaTitle: "Privacy",
      metaDescription: "What information is stored when you book an appointment on Dr. Fatemeh Jafari's clinic website, why, and for how long.",
      h1: "Privacy",
      crumb: "Privacy",
      sections: [
        {
          h: "What information is stored",
          ul: [
            "Your mobile number, full name, reason for the visit and anything you write when booking.",
            "The time of your appointment and changes to it (booking, moving, cancelling).",
            "The text-message confirmation code is kept only in encrypted (hashed) form and only for a few minutes; the code itself is not stored anywhere.",
            "Your IP address, temporarily, to prevent abuse and to limit repeated requests.",
          ],
        },
        {
          h: "Why this information is needed",
          p: [
            "To make and manage your appointment, to send the confirmation and reminder text messages, and to call you if the time changes. We do not use this information for advertising and we do not sell it.",
          ],
        },
        {
          h: "Text messages",
          p: [
            "Confirmation code, appointment confirmation, reminder and appointment-change messages are sent through the sms.ir messaging service. For this, only the mobile number and the text of the message are given to that service.",
          ],
        },
        {
          // addition: no Persian original
          h: "WhatsApp",
          p: [
            "If you message us on WhatsApp, your messages pass through WhatsApp and are subject to its terms and privacy policy. We use what you send us only to arrange your appointment and answer your questions.",
          ],
        },
        {
          h: "Cookies",
          ul: [
            "One cookie to hold your appointment while you book (one day at most).",
            "One cookie for up to 30 days, so that if you have confirmed your number we do not ask for a code again on your next booking.",
            "We do not use advertising or third-party tracking cookies. Visit statistics for the site are collected without cookies and without identifying people.",
          ],
        },
        {
          h: "How long it is kept",
          p: [
            "Appointment records are kept for as long as they are needed to follow up your treatment and to meet legal requirements. Confirmation codes expire after two minutes.",
          ],
        },
        {
          h: "Deleting your information",
          p: [
            "If you want your information deleted, call {phone}. After your identity is confirmed, your information is deleted, except what the law requires us to keep.",
          ],
        },
      ],
    },
    policy: {
      metaTitle: "Booking policy",
      metaDescription:
        "Rules for booking, cancelling and changing an appointment at Dr. Fatemeh Jafari's clinic in Shiraz: notice for cancelling, lateness and changes to appointments.",
      h1: "Booking policy",
      crumb: "Booking policy",
      sections: [
        {
          h: "Online booking",
          ul: [
            "Online appointments are for the examination and consultation session (30 minutes). Treatment sessions are arranged with the clinic after the consultation.",
            "After your mobile number is confirmed, if the time you chose is free the appointment is booked at once and a confirmation text is sent.",
            "Each mobile number can have one active online appointment at a time.",
            // addition: no Persian original
            "Direct booking with a text-message code is available for Iranian numbers; others can arrange an appointment on WhatsApp or by phone.",
          ],
        },
        {
          h: "Cancelling or changing an appointment",
          p: [
            "If you cannot attend at the time of your appointment, please call {phone} at least 24 hours beforehand so that the slot can be given to another patient.",
          ],
        },
        {
          h: "Lateness",
          p: [
            "Please arrive a few minutes early. If you are more than 15 minutes late, the session may be shortened or moved to another time so that the following patients' appointments are not disrupted.",
          ],
        },
        {
          h: "Missed appointments",
          p: ["If you do not attend at the time of your appointment without telling us beforehand, your next booking may need a phone confirmation from the clinic."],
        },
        {
          h: "Changes made by the clinic",
          p: ["If the clinic has to change or cancel your appointment, you will be told by text message and, if needed, by phone."],
        },
      ],
    },
    stay: {
      metaTitle: "Plan your visit to Shiraz: how long treatments take",
      metaDescription:
        "Approximate time to plan in Shiraz: composite about 1 day; ceramic (porcelain) veneers and implants about 1 month. Dr. Fatemeh Jafari's clinic, Shiraz, Iran.",
      h1: "Plan your visit to Shiraz",
      crumb: "Plan your visit",
      lead: "These times are approximate, to help you plan. The exact time is set after the examination, based on your teeth and how many are treated.",
      tableTitle: "Approximate time for each treatment",
      colTreatment: "Treatment",
      colTime: "Time to plan in Shiraz",
      rows: [
        { label: "Quick treatment (a short visit to fix something small)", time: "About 1 day" },
        { slug: "composite", time: "About 1 day" },
        { slug: "veneers", time: "About 1 month" },
        { slug: "implant", time: "About 1 month for installing the implant", note: "How long the implant takes to bond with the bone differs from person to person, and your dentist explains it after the examination." },
      ],
      faq: [
        { q: "How long does a quick treatment take?", a: "A short visit to fix something small takes about 1 day. The exact time is set after the examination." },
        { q: "How many visits does composite take?", a: "About 1 day: depending on the number of teeth, it is usually done in one or two visits. The exact time is set after the examination." },
        { q: "How many visits do ceramic veneers take?", a: "About 1 month: usually several visits over a few weeks, namely consultation and design, preparation and impression, and finally bonding. The exact schedule is set after the examination." },
        { q: "How long does a dental implant take?", a: "About 1 month for installing the implant. The length of treatment depends on the condition of the bone and the number of implants, and is set after an examination and imaging." },
        { q: "How long does the consultation take?", a: "About 30 minutes. In this time your teeth are examined and we answer your questions about the options." },
      ],
      ctaTitle: "For more details, contact us",
      ctaBody: "Message the clinic on WhatsApp or call.",
      footerLink: "Plan your visit",
      contactLink: "How long do I need in Shiraz? Plan your visit",
    },
    contact: {
      metaTitle: "Book an appointment at Dr. Fatemeh Jafari's clinic, Shiraz",
      metaDescription:
        "How to book an appointment at Dr. Fatemeh Jafari's cosmetic dental clinic in Shiraz: on WhatsApp or by phone, with the address and opening hours in Iran time.",
      h1: "Book an appointment",
      crumb: "Book an appointment",
      lead: "To arrange an appointment, message the clinic on WhatsApp or call. People with an Iranian mobile number can book directly on the website.",
      waTitle: "On WhatsApp",
      waBody: "Tap the button to open a chat with the clinic with a ready message, then write your name, the treatment you are interested in and the days that suit you.",
      waButton: "Book on WhatsApp",
      phoneTitle: "By phone",
      visitTitle: "What to expect at the first visit",
      visitBody: "The first visit is usually an examination and consultation of about 30 minutes, in which your teeth are examined and we go through the treatment options together.",
      teamNote: "The clinic team speaks Persian.",
      iranTitle: "Do you have an Iranian mobile number?",
      iranBody: "You can book directly on the website by choosing a day and time and confirming your number with a text-message code. The booking page is in Persian.",
      iranButton: "Book on the website (in Persian)",
      placeTitle: "Address and opening hours",
    },
  },
};
