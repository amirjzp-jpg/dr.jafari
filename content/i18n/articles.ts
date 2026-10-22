import type { Block } from "@/content/journal";
import type { IntlLocale } from "@/lib/i18n";

// Journal articles in Arabic and English. Translated from the Persian articles in
// content/journal.ts, sentence by sentence, with no new claims. Titles are written as
// the questions people ask and the first paragraph answers the question directly (for
// search snippets and AI answers). Gulf wording: «البورسلين» is named next to «الخزفي»,
// and every description ends with «شيراز، إيران». No review line: the doctor has not
// reviewed this text. Draft for a native proofread.

export type ArticleText = {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  imageAlt: string;
  body: Block[];
};

export const articleText: Record<IntlLocale, Record<string, ArticleText>> = {
  ar: {
    "composite-vs-veneers": {
      title: "الكومبوزيت أم الفينير الخزفي: أيهما يناسب ابتسامتك؟",
      excerpt: "مقارنة بين مدة البقاء والتكلفة ومقدار برد السن في طريقتين شائعتين لتجميل الأسنان.",
      metaTitle: "الكومبوزيت أم الفينير الخزفي (البورسلين)؟ أيهما يناسبك",
      metaDescription:
        "مقارنة الكومبوزيت والفينير الخزفي (البورسلين) من حيث مدة البقاء والتكلفة ومقدار برد السن. مقال من عيادة د. فاطمة جعفري في شيراز، إيران.",
      category: "الكومبوزيت والفينير",
      imageAlt: "مقارنة بين ابتسامة بالكومبوزيت وابتسامة بالفينير",
      body: [
        { p: "الكومبوزيت والفينير الخزفي (البورسلين) طريقتان شائعتان لتحسين مظهر الأسنان الأمامية. كلتاهما تصحّح لون الأسنان وشكلها والمسافات بينها، لكنهما تختلفان في المادة وطريقة التنفيذ ومدة البقاء والتكلفة." },
        { h2: "الفرق في المادة وطريقة التنفيذ" },
        { p: "الكومبوزيت راتنج بلون السن يضعه طبيب الأسنان مباشرة على السن ويشكّله. أما الفينير فقشرة رقيقة من الخزف تُصنع في المختبر ثم تُلصق على السن." },
        { h2: "مقدار برد السن" },
        { p: "يُجرى الكومبوزيت في كثير من الحالات مع برد قليل جدًا للسن أو دونه. أما الفينير فيحتاج عادةً إلى برد جزء من مينا السن، وهذا البرد لا رجعة فيه. ويختلف مقدار البرد من شخص إلى آخر ويُحدَّد في الفحص." },
        { h2: "ثبات اللون ومدة البقاء" },
        { p: "الخزف أكثر مقاومة لتغيّر اللون، أما الكومبوزيت فقد يكتسب لونًا مع الوقت، خصوصًا مع الشاي والقهوة والتدخين. وفي الطريقتين تعتمد مدة البقاء على جودة التنفيذ وعنايتك اليومية؛ ويحتاج الفينير عادةً إلى تجديد في وقت أبعد، بينما يحتاج الكومبوزيت إلى تلميع دوري." },
        { h2: "التكلفة وقابلية الإصلاح" },
        { p: "الكومبوزيت أقل تكلفة عادةً، ويمكن إصلاح تلفه البسيط. أما الفينير فتكلفته أعلى، وإذا انكسر فعادةً يجب استبداله." },
        { h2: "أيهما يناسبك أكثر؟" },
        {
          ul: [
            "إذا كانت التغييرات المطلوبة صغيرة، مثل حافة متشظية أو مسافة ضيقة، فالكومبوزيت خيار أقل تدخلًا.",
            "إذا كان ثبات اللون العالي وتغيير عدة أسنان بشكل متناسق هو المهم، ففكّر في الفينير.",
            "وتؤثر في الاختيار حالة اللثة والإطباق وعادات مثل صرير الأسنان.",
          ],
        },
        { p: "ولاتخاذ القرار، تساعد جلسة الفحص والاستشارة على مراجعة الخيارات بحسب حالة أسنانك وتوقعاتك." },
      ],
    },
    "composite-longevity": {
      title: "كم يدوم الكومبوزيت التجميلي وما الذي يحدد عمره؟",
      excerpt: "من جودة المواد إلى العادات اليومية؛ ما الذي يطيل عمر الكومبوزيت أو يقصّره.",
      metaTitle: "كم يدوم الكومبوزيت التجميلي؟ العوامل المؤثرة في عمره",
      metaDescription:
        "ما تأثير جودة المواد والعادات اليومية في مدة بقاء الكومبوزيت التجميلي؟ دليل من عيادة د. فاطمة جعفري في شيراز، إيران.",
      category: "الكومبوزيت",
      imageAlt: "العادات اليومية التي تؤثر في مدة بقاء الكومبوزيت",
      body: [
        { p: "«كم يدوم الكومبوزيت؟» يعتمد الجواب على عدة عوامل: بعضها بيد طبيب الأسنان وبعضها بيدك أنت. والخبر الجيد أن عادات بسيطة تُبقي الكومبوزيت جميلًا لسنوات." },
        { h2: "جودة المواد ودقة التنفيذ" },
        { p: "نوع الراتنج وطريقة وضع الطبقات وتحضير سطح السن بشكل صحيح والصقل النهائي، كلها تؤثر في متانة الكومبوزيت ومظهره." },
        { h2: "العادات الغذائية" },
        { p: "المشروبات الملوِّنة كالشاي والقهوة، وكذلك التدخين، تغيّر لون الكومبوزيت مع الوقت. ويساعد غسل الفم بعد هذه المشروبات." },
        { h2: "الضغط والصدمات" },
        { ul: ["مضغ الأجسام الصلبة مثل الثلج أو نوى الفاكهة الصلبة.", "فتح العبوات بالأسنان.", "صرير الأسنان، خصوصًا أثناء النوم."] },
        { p: "تزيد هذه العادات احتمال تشظّي الكومبوزيت. وإذا كنت تعاني من صرير الأسنان فتحدّث مع طبيب الأسنان عن الواقي الليلي." },
        { h2: "النظافة والمراجعة الدورية" },
        { p: "تنظيف الأسنان بالفرشاة والخيط بانتظام والمراجعة الدورية للتلميع يساعدان في الحفاظ على المظهر وسلامة حواف الكومبوزيت." },
      ],
    },
    "veneer-care": {
      title: "العناية بالفينير الخزفي (البورسلين) بعد العلاج",
      excerpt: "نصائح بسيطة للحفاظ على لمعان الفينير وسلامته في السنوات التالية.",
      metaTitle: "العناية بالفينير الخزفي (البورسلين) بعد التركيب",
      metaDescription:
        "نصائح بسيطة للحفاظ على لمعان الفينير الخزفي (البورسلين) وسلامته بعد العلاج. مقال من عيادة د. فاطمة جعفري في شيراز، إيران.",
      category: "الفينير",
      imageAlt: "نصائح العناية بالفينير الخزفي",
      body: [
        { p: "الفينير الخزفي يقاوم تغيّر اللون، لكن الأسنان تحته واللثة المحيطة به لا تزال تحتاج إلى عناية. وبضع عادات بسيطة تساعد في الحفاظ على الفينير." },
        { h2: "النظافة اليومية" },
        { ul: ["فرشاة ناعمة مرتين يوميًا.", "خيط الأسنان يوميًا، خصوصًا عند حافة الفينير واللثة.", "معجون أسنان غير كاشط."] },
        { h2: "الحماية من الصدمات والضغط" },
        { p: "تجنّب مضغ الأجسام الصلبة وفتح العبوات بالأسنان. وإذا كنت تعاني من صرير الأسنان أو تمارس رياضة فيها احتكاك، فاستخدم واقيًا مناسبًا." },
        { h2: "الحساسية في الأيام الأولى" },
        { p: "قد تشعر في الأيام الأولى بعد لصق الفينير بحساسية للبرودة والحرارة. وإذا استمرت الحساسية فاتصل بالعيادة." },
        { h2: "المراجعة الدورية" },
        { p: "المراجعة المنتظمة لفحص الحواف واللاصق وصحة اللثة تكشف المشاكل الصغيرة قبل أن تكبر." },
      ],
    },
    "whitening-longevity": {
      title: "كم تدوم نتيجة تبييض الأسنان؟",
      excerpt: "ما الذي يحدد لون الأسنان بعد التبييض، وما العادات التي تقصّر النتيجة.",
      metaTitle: "كم تدوم نتيجة تبييض الأسنان؟",
      metaDescription:
        "ما الذي تعتمد عليه مدة بقاء نتيجة تبييض الأسنان، وما العادات التي تقصّرها؟ دليل من عيادة د. فاطمة جعفري في شيراز، إيران.",
      category: "التبييض",
      imageAlt: "ابتسامة طبيعية فاتحة إلى جانب فنجان قهوة وفرشاة أسنان وكوب ماء؛ صورة توضيحية",
      body: [
        { p: "تختلف مدة بقاء التبييض من شخص إلى آخر وليس لها رقم ثابت. فلون الأسنان يعود إلى الدكنة مع الوقت ومع تناول الشاي والقهوة والمشروبات الملوِّنة والتدخين؛ ولذلك فإن عاداتك اليومية أكثر ما يؤثر في مدة بقاء النتيجة." },
        { h2: "لماذا يعود لون الأسنان إلى الدكنة؟" },
        { p: "تتعرّض الأسنان كل يوم للأطعمة والمشروبات الملوِّنة. والتبييض يفتّح لون السن الحالي، لكنه لا يمنع اكتسابه اللون من جديد؛ ولذلك لا تبقى نتيجته ثابتة إلى الأبد." },
        { h2: "ما الذي يؤثر في مدة البقاء؟" },
        { ul: ["تناول الشاي والقهوة والمشروبات الملوِّنة", "التدخين", "نظافة الفم وإزالة الجير بانتظام", "اللون الأصلي للأسنان ودرجة تفتيحها", "اتباع توصيات طبيب الأسنان بعد التبييض"] },
        { h2: "ما الذي يساعد على بقاء النتيجة أطول؟" },
        { ul: ["تنظيف الأسنان بالفرشاة مرتين يوميًا واستخدام خيط الأسنان يوميًا", "غسل الفم بالماء بعد المشروبات الملوِّنة", "تقليل التدخين أو الإقلاع عنه", "المراجعة الدورية لإزالة الجير والفحص"] },
        { h2: "وإذا كان لدي كومبوزيت أو فينير؟" },
        { p: "لا يتغيّر لون الكومبوزيت والتيجان والفينير بالتبييض؛ فإذا كان لديك أي منها أو تنوي إجراءها فإن ترتيب العلاجات مهم ويُحدَّد في الفحص." },
        { p: "ولمعرفة إن كان التبييض مناسبًا لأسنانك، تساعد جلسة الفحص والاستشارة." },
      ],
    },
    "whitening-doctor-shiraz": {
      title: "طبيب تبييض الأسنان في شيراز، إيران: كيف تختاره؟",
      excerpt: "ما الذي يجب التحقق منه عند اختيار طبيب لتبييض الأسنان في شيراز: الفحص الأول وشرح الحدود والعناية بعد العلاج.",
      metaTitle: "طبيب تبييض الأسنان في شيراز، إيران: كيف تختاره؟",
      metaDescription:
        "ما الذي تنظر إليه عند اختيار طبيب تبييض الأسنان في شيراز، إيران؟ الفحص الأول، رقم نقابة الأطباء، شرح الحدود والعناية بعد العلاج؛ قائمة بسيطة.",
      category: "التبييض",
      imageAlt: "ابتسامة طبيعية فاتحة إلى جانب كوب ماء وفرشاة أسنان؛ صورة توضيحية",
      body: [
        { p: "عند اختيار طبيب لتبييض الأسنان في شيراز، تحقّق من خمسة أمور: ترخيص ساري ورقم نقابة الأطباء، وفحص الأسنان قبل البدء، وشرحًا واضحًا لحدود التبييض، وحماية اللثة أثناء العلاج، وشرحًا للعناية بعده. ولأن درجة التفتيح تختلف من شخص إلى آخر، فإن الوعد بنتيجة محددة ليس علامة جيدة." },
        { h2: "ما هو التبييض ومن يجب أن يجريه؟" },
        { p: "التبييض طريقة لتفتيح اللون الطبيعي للأسنان بمواد مبيّضة وتحت إشراف طبيب الأسنان. تؤثر هذه المواد في الأصباغ داخل نسيج السن فتجعله أفتح. والتبييض لا يبرد السن ولا يزيل من نسيجه." },
        { h2: "على أي أساس نختار طبيب التبييض؟" },
        { ul: [
          "الترخيص ورقم نقابة الأطباء: اطلب رقم النقابة وتحقّق منه عبر خدمة الاستعلام لدى منظمة نظام الأطباء الإيرانية.",
          "الفحص قبل العلاج: يجب فحص صحة الأسنان واللثة أولًا. فإن وُجد تسوّس أو مشكلة في اللثة عولجت أولًا ثم يأتي التبييض.",
          "شرح صريح للحدود: يؤثر التبييض في السن الطبيعي فقط ولا يغيّر لون الكومبوزيت أو التيجان أو الفينير. وعلى الطبيب أن يقول لك ذلك قبل البدء.",
          "حماية اللثة والشفتين أثناء العمل من المادة المبيّضة",
          "شرح العناية بعد العلاج: ما المأكولات والمشروبات التي تقلّلها مؤقتًا، وماذا تفعل إذا أصبحت أسنانك حساسة.",
          "أعمال حقيقية: اطّلع على صور قبل وبعد من عمل الطبيب نفسه، لا على صور عامة.",
        ] },
        { h2: "ماذا يجب أن يحدث في الزيارة الأولى؟" },
        { ul: [
          "الفحص: مراجعة الأسنان واللثة؛ وعلاج التسوّس أو مشكلة اللثة إن وُجدا قبل التبييض",
          "الحديث: شرح ما إذا كان التبييض مناسبًا لحالتك وما التوقع الواقعي",
          "الخطة: إن كنت تنوي كومبوزيت أو فينير فيُجرى التبييض قبلهما لتنسجم الألوان",
          "التكلفة: تعتمد على طريقة العمل وحالة الأسنان وتُعلَن بعد الفحص",
        ] },
        { h2: "ما العلامات التي تستدعي الحذر؟" },
        { ul: [
          "وعد بنتيجة مؤكدة أو بلون محدد دون رؤية الأسنان",
          "البدء بالتبييض دون فحص",
          "إهمال التسوّس أو مشكلة اللثة",
          "عدم الإشارة إلى أن التبييض لا يؤثر في الحشوات والتيجان الموجودة",
          "عدم الاكتراث بأسئلتك عن الحساسية أو العناية بعد العلاج",
        ] },
        { h2: "هل يؤثر التبييض في الكومبوزيت أو الفينير؟" },
        { p: "لا. المواد المبيّضة تؤثر في السن الطبيعي فقط. وإن كان لديك كومبوزيت أو تيجان أو فينير فقد لا تنسجم مع الأسنان الأفتح بعد التبييض؛ فتحدّث إلى الطبيب عن ذلك بعد الفحص." },
        { h2: "كم تبلغ تكلفة التبييض في شيراز؟" },
        { p: "تعتمد التكلفة الدقيقة على طريقة العمل وحالة أسنانك، ولا يمكن ذكر رقم دقيق دون رؤية الأسنان. وفي عيادتنا تُعلَن التكلفة بعد الفحص." },
        { h2: "كم تدوم نتيجة التبييض؟" },
        { p: "يعود لون الأسنان إلى الدكنة مع الوقت ومع تناول الشاي والقهوة والمشروبات الملوِّنة والتدخين. وتختلف مدة البقاء من شخص إلى آخر. التفاصيل الكاملة في مقال «كم تدوم نتيجة تبييض الأسنان؟»." },
        { h2: "ما العناية اللازمة بعد التبييض؟" },
        { ul: [
          "تجنّب المشروبات والأطعمة الداكنة في الأيام الأولى",
          "تنظيف الأسنان بالفرشاة مرتين يوميًا واستخدام الخيط يوميًا",
          "عند الحساسية للبرودة، وهي عادةً قصيرة وتزول من تلقاء نفسها، استشر الطبيب في معجون مناسب",
          "راجع العيادة دوريًا لإزالة الجير والفحص",
        ] },
        { h2: "التبييض في عيادة د. فاطمة جعفري، شيراز" },
        { p: "الدكتورة فاطمة جعفري طبيبة أسنان تجميلية بخبرة تزيد عن 10 سنوات، وعيادتها في معالي‌آباد بمدينة شيراز. رقمها في نقابة الأطباء الإيرانية 169473. الزيارة الأولى فحص واستشارة مدتها نحو 30 دقيقة. ساعات العمل: من السبت إلى الأربعاء، من 10:00 إلى 13:00 ومن 14:00 إلى 19:00؛ الخميس والجمعة عطلة." },
        { p: "للحجز راسل العيادة عبر واتساب أو اتصل بها." },
      ],
    },
  },
  en: {
    "composite-vs-veneers": {
      title: "Composite bonding or ceramic veneers: which suits your smile?",
      excerpt: "A comparison of how long they last, what they cost and how much tooth reduction each needs, for two popular cosmetic treatments.",
      metaTitle: "Composite bonding or ceramic (porcelain) veneers?",
      metaDescription:
        "Composite bonding or ceramic (porcelain) veneers? Compare durability, cost and tooth reduction. From Dr. Fatemeh Jafari's clinic in Shiraz, Iran.",
      category: "Composite and veneers",
      imageAlt: "A comparison of a smile with composite and with veneers",
      body: [
        { p: "Composite bonding and ceramic (porcelain) veneers are two common ways of improving the look of the front teeth. Both can correct the colour, shape and gaps of your teeth, but they differ in material, method, how long they last and cost." },
        { h2: "How they differ in material and method" },
        { p: "Composite is tooth-coloured resin that the dentist places directly on the tooth and shapes. A veneer is a thin ceramic shell made in the laboratory and then bonded to the tooth." },
        { h2: "How much the tooth is reduced" },
        { p: "Composite is often done with very little tooth reduction, or none. A veneer usually needs part of the tooth's enamel to be removed, and this is not reversible. How much is removed differs from person to person and is decided at the examination." },
        { h2: "Colour stability and how long they last" },
        { p: "Ceramic resists discolouration better, while composite may stain over time, especially with tea, coffee and smoking. With both, how long they last depends on the quality of the work and your daily care; a veneer usually needs renewing later, while composite needs periodic polishing." },
        { h2: "Cost and repair" },
        { p: "Composite usually costs less, and slight damage to it can be repaired. A veneer costs more, and if it breaks it usually has to be replaced." },
        { h2: "Which suits you better?" },
        {
          ul: [
            "If you want small changes, such as a chipped edge or a narrow gap, composite is the less invasive choice.",
            "If high colour stability and an even change to several teeth matter most, look into veneers.",
            "The condition of your gums and bite, and habits such as teeth grinding, also affect the choice.",
          ],
        },
        { p: "To decide, an examination and consultation helps review the options in light of your teeth and what you expect." },
      ],
    },
    "composite-longevity": {
      title: "How long does composite bonding last, and what decides it?",
      excerpt: "From the quality of materials to daily habits: what makes composite last longer or wear out sooner.",
      metaTitle: "How long does composite bonding last?",
      metaDescription:
        "How do material quality and daily habits affect how long composite bonding lasts? A guide from Dr. Fatemeh Jafari's clinic in Shiraz, Iran.",
      category: "Composite",
      imageAlt: "Daily habits that affect how long composite lasts",
      body: [
        { p: "“How long does composite last?” The answer depends on several things: some are in the dentist's hands and some are in yours. The good news is that a few simple habits keep composite looking good for years." },
        { h2: "Quality of materials and care in placing it" },
        { p: "The type of resin, the way the layers are placed, proper preparation of the tooth surface and the final polish all affect how long composite lasts and how it looks." },
        { h2: "Eating and drinking habits" },
        { p: "Coloured drinks such as tea and coffee, and also smoking, change the colour of composite over time. Rinsing your mouth after these drinks helps." },
        { h2: "Pressure and impact" },
        { ul: ["Chewing hard objects such as ice or hard fruit stones.", "Opening packages with your teeth.", "Teeth grinding, especially during sleep."] },
        { p: "These habits make chipping of the composite more likely. If you grind your teeth, talk to your dentist about a night guard." },
        { h2: "Hygiene and regular check-ups" },
        { p: "Regular brushing and flossing, and periodic visits for polishing, help keep the look and the health of the composite edges." },
      ],
    },
    "veneer-care": {
      title: "Caring for ceramic (porcelain) veneers after treatment",
      excerpt: "Simple tips to keep veneers shiny and healthy in the years that follow.",
      metaTitle: "Caring for ceramic (porcelain) veneers after treatment",
      metaDescription:
        "Simple tips to keep ceramic (porcelain) veneers shiny and healthy in the years after treatment. From Dr. Fatemeh Jafari's clinic in Shiraz, Iran.",
      category: "Veneers",
      imageAlt: "Tips for caring for ceramic veneers",
      body: [
        { p: "Ceramic veneers resist discolouration, but the teeth under them and the gums around them still need care. A few simple habits help keep veneers in good condition." },
        { h2: "Daily hygiene" },
        { ul: ["A soft brush twice a day.", "Floss daily, especially at the edge of the veneer and the gum.", "A non-abrasive toothpaste."] },
        { h2: "Protection from impact and pressure" },
        { p: "Avoid chewing hard objects and opening packages with your teeth. If you grind your teeth or play contact sports, use a suitable guard." },
        { h2: "Sensitivity in the first days" },
        { p: "In the first days after the veneers are bonded you may have sensitivity to cold and heat. If it continues, contact the clinic." },
        { h2: "Regular check-ups" },
        { p: "Regular visits to check the edges, the adhesive and the health of the gums show small problems before they become big." },
      ],
    },
    "whitening-longevity": {
      title: "How long does teeth whitening last?",
      excerpt: "What decides the colour of your teeth after whitening, and which habits shorten the result.",
      metaTitle: "How long does teeth whitening last?",
      metaDescription:
        "What decides how long teeth whitening lasts, and which habits shorten the result? A guide from Dr. Fatemeh Jafari's clinic in Shiraz, Iran.",
      category: "Whitening",
      imageAlt: "A natural, light smile next to a cup of coffee, a toothbrush and a glass of water; illustrative image",
      body: [
        { p: "How long whitening lasts differs from person to person and there is no fixed figure. Teeth darken again with time and with tea, coffee, coloured drinks and smoking; so your daily habits affect how long the result lasts more than anything else." },
        { h2: "Why do teeth darken again?" },
        { p: "Teeth are exposed to coloured foods and drinks every day. Whitening lightens the current colour of the tooth, but it does not stop it taking up colour again; that is why its result does not stay fixed for ever." },
        { h2: "What affects how long it lasts?" },
        { ul: ["Tea, coffee and coloured drinks", "Smoking", "Oral hygiene and regular scaling", "The starting colour of the teeth and how much lighter they became", "Following your dentist's advice after whitening"] },
        { h2: "What helps the result last longer?" },
        { ul: ["Brushing twice a day and flossing daily", "Rinsing your mouth with water after coloured drinks", "Smoking less, or stopping", "Coming back periodically for scaling and a check-up"] },
        { h2: "What if I have composite or veneers?" },
        { p: "Whitening does not change the colour of composite, crowns or veneers; so if you have any of them or plan to, the order of treatments matters and is decided at the examination." },
        { p: "To find out whether whitening is suitable for your teeth, an examination and consultation helps." },
      ],
    },
    "whitening-doctor-shiraz": {
      title: "How Do You Choose a Teeth Whitening Dentist in Shiraz?",
      excerpt: "What to check when choosing a dentist for teeth whitening in Shiraz: the first examination, honest limits and aftercare.",
      metaTitle: "Choosing a Teeth Whitening Dentist in Shiraz, Iran",
      metaDescription:
        "What to look for in a teeth whitening dentist in Shiraz, Iran: the first examination, the medical council number, honest limits and aftercare. A simple checklist.",
      category: "Whitening",
      imageAlt: "A natural, bright smile beside a glass of water and a toothbrush; illustrative image",
      body: [
        { p: "To choose a teeth whitening dentist in Shiraz, check five things: a valid licence and medical council number, an examination of your teeth before starting, a clear explanation of what whitening cannot do, protection of the gums during treatment, and an explanation of aftercare. Because how much the teeth lighten differs from person to person, a promise of a fixed result is not a good sign." },
        { h2: "What is teeth whitening, and who should do it?" },
        { p: "Whitening is a way to lighten the natural colour of the teeth with whitening materials, under the supervision of a dentist. These materials act on the pigments inside the tooth and make it lighter. Whitening does not grind the tooth or remove its tissue." },
        { h2: "How do you choose a whitening dentist?" },
        { ul: [
          "Licence and medical council number: ask for the council number and check it through the Iran Medical Council's lookup service.",
          "Examination before treatment: the health of the teeth and gums should be checked first. If there is decay or a gum problem, that is treated first and whitening comes after.",
          "Honest limits: whitening works on natural teeth only and does not change the colour of composite, crowns or veneers. The dentist should tell you this before starting.",
          "Protection of the gums and lips from the whitening material during the work",
          "An explanation of aftercare: which foods and drinks to cut back on for a while, and what to do if your teeth become sensitive.",
          "Real work: look at before-and-after photos of the dentist's own cases, not generic images.",
        ] },
        { h2: "What should happen at the first visit?" },
        { ul: [
          "Examination: a check of the teeth and gums; any decay or gum problem is treated before whitening",
          "Conversation: whether whitening suits your situation, and what result is realistic",
          "Plan: if you plan composite or veneers, whitening is done first so the colours match",
          "Cost: it depends on the method and the condition of the teeth, and is given after the examination",
        ] },
        { h2: "What signs should make you cautious?" },
        { ul: [
          "A promise of a fixed result or a specific shade without seeing your teeth",
          "Starting whitening without an examination",
          "Ignoring decay or a gum problem",
          "Not saying that whitening does not affect existing fillings and crowns",
          "Brushing aside your questions about sensitivity or aftercare",
        ] },
        { h2: "Does whitening work on composite or veneers?" },
        { p: "No. Whitening materials act on natural teeth only. If you have composite, crowns or veneers, they may not match the lighter teeth afterwards; talk to the dentist about this after the examination." },
        { h2: "How much does teeth whitening cost in Shiraz?" },
        { p: "The exact cost depends on the method and the condition of your teeth, and no exact figure can be given without seeing them. At our clinic the cost is given after the examination." },
        { h2: "How long do the results last?" },
        { p: "Tooth colour darkens again over time, and with tea, coffee, coloured drinks and smoking. How long it lasts differs from person to person. The full explanation is in the article “How long does teeth whitening last?”." },
        { h2: "What aftercare is needed after whitening?" },
        { ul: [
          "Avoid dark drinks and foods in the first days",
          "Brush twice a day and floss daily",
          "If your teeth are sensitive to cold, which is usually short and goes away on its own, ask the dentist about a suitable toothpaste",
          "Come back regularly for scaling and a check-up",
        ] },
        { h2: "Whitening at Dr. Fatemeh Jafari's clinic in Shiraz" },
        { p: "Dr. Fatemeh Jafari is a cosmetic dentist with more than 10 years of experience, and her clinic is in Maaliabad, Shiraz. Her Iran Medical Council number is 169473. The first visit is an examination and consultation of about 30 minutes. Opening hours: Saturday to Wednesday, 10:00 to 13:00 and 14:00 to 19:00; closed on Thursday and Friday." },
        { p: "To book, message the clinic on WhatsApp or call." },
      ],
    },
  },
};

/** UI words for the journal, per language. */
export const journalLabels = {
  ar: {
    crumb: "المجلة",
    indexTitle: "اعرف أكثر قبل أن تقرّر",
    indexLead: "مقالات عن الكومبوزيت والفينير والعناية بالابتسامة.",
    metaTitle: "المجلة",
    metaDescription:
      "مجلة عيادة الدكتورة فاطمة جعفري في شيراز، إيران: مقالات عن الكومبوزيت والفينير الخزفي (البورسلين) والتبييض والعناية بالابتسامة، لتعرف أكثر قبل أن تقرّر العلاج.",
    minutes: (n: number) => `وقت القراءة: ${n} دقائق`,
    related: "مقالات ذات صلة",
    allArticles: "كل المقالات",
    asideTitle: (service: string) => `هل لديك سؤال عن ${service}؟`,
    asideBody: "في جلسة الفحص والاستشارة نراجع معك الخيارات المناسبة لك.",
    asideLink: (service: string) => `اقرأ المزيد عن ${service} ←`,
    homeEyebrow: "المجلة",
    homeTitle: "اعرف أكثر قبل أن تقرّر",
  },
  en: {
    crumb: "Journal",
    indexTitle: "Know more before you decide",
    indexLead: "Articles on composite bonding, veneers and caring for your smile.",
    metaTitle: "Journal",
    metaDescription:
      "The journal of Dr. Fatemeh Jafari's clinic in Shiraz, Iran: articles on composite bonding, ceramic (porcelain) veneers, whitening and caring for your smile, so you know more before you decide on treatment.",
    minutes: (n: number) => `${n} min read`,
    related: "Related articles",
    allArticles: "All articles",
    asideTitle: (service: string) => `Questions about ${service}?`,
    asideBody: "At an examination and consultation we go through the options that suit you together.",
    asideLink: (service: string) => `Read more about ${service} →`,
    homeEyebrow: "Journal",
    homeTitle: "Know more before you decide",
  },
} as const;

/** Question-and-answer pairs taken straight from an article, for FAQ markup and AI answers. */
export function qaFromArticle(lang: IntlLocale, title: string, body: Block[]): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const isQ = (t: string) => /[?؟]$/.test(t.trim());
  const sep = lang === "ar" ? "؛ " : "; ";
  const text = (blocks: Block[]) =>
    blocks
      .map((b) => ("p" in b ? b.p : "ul" in b ? b.ul.map((x) => x.replace(/\.$/, "")).join(sep) + "." : ""))
      .filter(Boolean)
      .join(" ");
  const firstP = body.find((b): b is { p: string } => "p" in b);
  if (isQ(title) && firstP) out.push({ q: title, a: firstP.p });
  body.forEach((b, i) => {
    if (!("h2" in b) || !isQ(b.h2)) return;
    const rest: Block[] = [];
    for (let j = i + 1; j < body.length && !("h2" in body[j]); j++) rest.push(body[j]);
    const a = text(rest);
    if (a) out.push({ q: b.h2, a });
  });
  return out;
}

/** "27 September 2026" / «27 سبتمبر 2026» (Gregorian, Latin digits, no day shift). */
export function articleDate(iso: string, lang: IntlLocale): string {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-u-ca-gregory-nu-latn" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}
