import type { ServiceContent } from "./services";

// English service pages. Translated from the approved Persian copy in
// content/services.ts, sentence by sentence, with no new clinical claims and no
// prices or instalments (the clinic says instalments do not apply to patients
// abroad). Draft for a native proofread.

export const servicesEn: Record<string, ServiceContent> = {
  composite: {
    name: "Composite bonding",
    title: "Composite bonding in Shiraz",
    short: "Corrects the colour, shape and gaps of teeth with minimal tooth reduction.",
    metaDescription:
      "Composite bonding in Shiraz, Maaliabad, with Dr. Fatemeh Jafari: correcting the colour, shape and gaps of teeth with minimal tooth reduction, in a short time. The treatment process, aftercare and common questions.",
    intro: [
      "A composite veneer is a thin layer of tooth-coloured resin shaped directly on the tooth to correct the colour, shape and gaps of your teeth, usually with very little tooth reduction or none at all.",
    ],
    detail: {
      whatTitle: "What is composite bonding?",
      whatItIs: [
        "In composite bonding, resin is placed on the tooth surface layer by layer, shaped with care and hardened with light. All of the work is done in the clinic and needs no laboratory.",
        "Because most of the natural enamel is kept, composite is one of the most conservative ways to improve a smile.",
      ],
      whoTitle: "Who is it suitable for?",
      whoItSuits: [
        "Chipped or uneven edges",
        "Small gaps between the front teeth",
        "Discolouration that whitening does not remove",
        "Small or uneven teeth",
        "Anyone who wants a striking change with as little work on the teeth as possible",
      ],
      process: [
        { title: "Examination and consultation", body: "We examine your teeth and gums and talk about the smile you have in mind." },
        { title: "Design and shade selection", body: "The shape and shade of the composite are chosen to suit your face and natural teeth." },
        { title: "Preparation", body: "The tooth surface is cleaned and prepared for better bonding; in most cases with no reduction, or very little." },
        { title: "Layering and shaping", body: "The composite is placed layer by layer, shaped and hardened with light." },
        { title: "Finishing and polishing", body: "The surface is smoothed and polished so that it looks like a real tooth in natural light." },
      ],
      benefits: [
        "Preserves as much natural tooth structure as possible",
        "Results in a short time, usually in one or two visits",
        "Can be repaired if it is slightly damaged",
        "Lower cost than ceramic veneers",
      ],
      limitations: [
        "It can stain over time, especially with tea, coffee and smoking",
        "Its colour stability and wear resistance are lower than ceramic",
        "Edges can chip and need repair",
        "Periodic polishing is needed to keep its shine",
      ],
      longevityTitle: "How long does it last?",
      longevity: [
        "How long composite lasts depends on the quality of the materials, the care taken in placing it and your daily care. With proper care and periodic visits for polishing, composite stays attractive for years.",
        "Teeth grinding, chewing hard objects and plenty of coloured drinks shorten its life.",
      ],
      aftercare: [
        "Brush twice a day and floss daily",
        "Avoid chewing ice or nails, or opening packages with your teeth",
        "Cut down on tea, coffee and coloured drinks, or rinse your mouth after them",
        "Come back periodically for a check and polishing",
        "Use a night guard if you grind your teeth",
      ],
      faq: [
        {
          q: "Is composite bonding painful?",
          a: "Usually not. Because very little reduction is needed, anaesthetic is not required in most cases, and if it is needed, a local anaesthetic is used.",
        },
        {
          q: "How many visits does composite take?",
          a: "Depending on the number of teeth, it is usually done in one or two visits. The exact time is set after the examination.",
        },
        {
          q: "Can composite be whitened?",
          a: "No; whitening materials have no effect on composite. If you want lighter teeth, we do the whitening before the composite.",
        },
        {
          q: "Composite bonding or ceramic veneers: which one suits me?",
          a: "Composite needs less tooth reduction, costs less and can be repaired, while ceramic veneers keep their colour better. The right choice is settled at the consultation, based on the condition of your teeth.",
        },
        {
          q: "How much does composite bonding cost in Shiraz?",
          a: "The cost depends on the number of teeth and the type of work, and is given after a careful examination.",
        },
      ],
    },
  },

  veneers: {
    name: "Ceramic veneers",
    title: "Ceramic veneers in Shiraz",
    short: "An even smile with thin ceramic shells and high colour stability.",
    metaDescription:
      "Ceramic veneers in Shiraz, Maaliabad, with Dr. Fatemeh Jafari: an even, natural smile with thin ceramic shells and high colour stability. The treatment process, aftercare and common questions.",
    intro: [
      "A ceramic veneer is a very thin ceramic shell bonded to the front surface of a tooth to even out the colour, shape and size of your teeth, with a natural look and a colour that stays stable.",
    ],
    detail: {
      whatTitle: "What are ceramic veneers?",
      whatItIs: [
        "Veneers are made in the laboratory for each tooth separately, based on your smile design. Ceramic reflects light like natural enamel and resists discolouration.",
        "To make room for a veneer, a small amount of enamel is usually removed from the tooth surface. This reduction is not reversible, which is why the final decision is always made after a full consultation.",
      ],
      whoTitle: "Who is it suitable for?",
      whoItSuits: [
        "Persistent discolouration that whitening does not fix",
        "Teeth with a shape or size that does not suit the face",
        "Gaps or mild crowding of the front teeth",
        "Anyone for whom colour stability and a perfectly even look matter",
      ],
      process: [
        { title: "Examination and consultation", body: "Your teeth, gums and bite are examined and we talk about the smile you want." },
        { title: "Smile design", body: "The shape, size and shade of the veneers are designed to suit your face." },
        { title: "Preparation and impression", body: "The teeth are prepared as much as needed and an impression or scan is taken." },
        { title: "Made in the laboratory", body: "The veneers are made precisely; in the meantime you wear a temporary cover if needed." },
        { title: "Bonding and final adjustment", body: "The veneers are tried in, bonded and adjusted so that the bite and the look are both right." },
      ],
      benefits: [
        "High colour stability and resistance to staining",
        "A natural look, with light reflecting like tooth enamel",
        "Correcting colour, shape and size at the same time",
        "A smooth surface that gathers less tartar and staining",
      ],
      limitations: [
        "It usually needs enamel reduction, and this reduction is not reversible",
        "It costs more than composite",
        "If one breaks, it usually has to be replaced",
        "There may be sensitivity to cold and heat in the first days",
      ],
      longevityTitle: "How long do they last?",
      longevity: [
        "With proper care, ceramic veneers stay attractive for many years. How long they last depends on the quality of the work, the care taken in bonding them and your daily habits.",
        "Grinding and impact are the main causes of damage to veneers; a night guard helps a great deal in these cases.",
      ],
      aftercare: [
        "Brush with a soft brush twice a day and floss daily",
        "Avoid chewing hard objects or opening packages with your teeth",
        "Use a night guard if you grind your teeth",
        "Come back periodically to check the edges and the health of the gums",
      ],
      faq: [
        {
          q: "Do ceramic veneers stain?",
          a: "The ceramic itself does not stain. The edge of the adhesive and the natural teeth around the veneers may change colour with time, which can be managed with daily care and periodic check-ups.",
        },
        {
          q: "Do veneers look natural?",
          a: "Yes, when the shape and shade are designed to suit the face. The final design is reviewed with you before the veneers are made.",
        },
        {
          q: "How many visits do veneers take?",
          a: "Usually several visits over a few weeks: consultation and design, preparation and impression, and finally bonding. The exact schedule is set after the examination.",
        },
        {
          q: "Can the teeth go back to how they were after veneers?",
          a: "No; because part of the enamel is usually removed, the teeth do not go back to their original state without a covering. That is why the final decision is made after a full consultation.",
        },
        {
          q: "How much do ceramic veneers cost in Shiraz?",
          a: "The cost depends on the number of teeth and the type of ceramic, and is given after the examination.",
        },
      ],
    },
  },

  "smile-design": {
    name: "Smile design",
    title: "Smile design in Shiraz",
    short: "A plan for the shape, size and colour of your teeth, matched to your face.",
    metaDescription:
      "Smile design in Shiraz, Maaliabad, with Dr. Fatemeh Jafari: planning the shape, size and colour of your teeth to suit your face, with composite, veneers or a combination of treatments.",
    intro: [
      "Smile design means planning the shape, size, colour and arrangement of your teeth so that they suit your face, lips and gums.",
      "The result of the plan may be carried out with composite, veneers, whitening or a combination of them. Before any work starts, we review the final plan together so that you know what your smile will look like.",
    ],
    detail: {
      whatTitle: "What is smile design?",
      whatItIs: [
        "Smile design is more than choosing a tooth shape. In this approach your teeth are seen together with your lips, gums and facial expression, so that the result is natural and in harmony.",
        "Every face is different, so every plan is different; a smile that suits one person does not necessarily suit another.",
      ],
      whoTitle: "Who is it suitable for?",
      whoItSuits: [
        "People who are not happy with the size or shape of their front teeth",
        "Teeth that are not the same size or colour",
        "Uneven edges, gaps between teeth or discolouration",
        "People who want to know the overall shape of the smile before they start",
      ],
      process: [
        { title: "Examination and consultation", body: "We ask about your taste and expectations and examine your teeth, gums and the way your teeth meet." },
        { title: "Planning", body: "The shape, size and colour of the teeth are drawn up to suit your face, lips and gums." },
        { title: "Reviewing the plan", body: "Before starting, we review the final plan together so that you know what your smile will look like." },
        { title: "Carrying it out", body: "The plan is carried out with composite, veneers, whitening or a combination of them." },
        { title: "Follow-up", body: "After the work, the result and the way the teeth meet are checked again." },
      ],
      benefits: [
        "A plan that is in harmony with your face from the start",
        "Knowing the course of treatment before it begins",
        "The option to choose between several methods or combine them",
      ],
      limitations: [
        "The result depends on the condition of the teeth and gums and on the method chosen.",
        "Some changes take more than one visit.",
      ],
      longevityTitle: "How long does it last?",
      longevity: [
        "How long a smile lasts depends on the methods used and on your daily care. Each method is explained on its own service page: composite, ceramic veneers and whitening.",
      ],
      aftercare: [
        "Brush twice a day and floss daily",
        "Come back periodically for a check-up",
        "Follow the advice you are given for the method chosen",
      ],
      faq: [
        {
          q: "Is smile design done with composite or veneers?",
          a: "Either is possible. The choice of method depends on the condition of your teeth, how much change you want and your budget, and is settled at the consultation.",
        },
        {
          q: "Can I see the plan before starting?",
          a: "Yes. Before any work, we review the final plan together so that you know what your smile will look like.",
        },
        {
          q: "How many visits does smile design take?",
          a: "It varies with the method and the number of teeth, and is set after the examination and once the plan is drawn up.",
        },
        {
          q: "How much does smile design cost in Shiraz?",
          a: "The cost depends on the method, or combination of methods, and on the number of teeth, and is given after the examination.",
        },
      ],
    },
  },

  whitening: {
    name: "Teeth whitening",
    title: "Teeth whitening in Shiraz",
    short: "Lightening the natural shade of your teeth under a dentist's supervision.",
    metaDescription:
      "Teeth whitening in Shiraz with Dr. Fatemeh Jafari: lightening the natural shade of your teeth with whitening agents, safely and under a dentist's supervision.",
    intro: [
      "Whitening is a way of lightening the natural colour of your teeth, carried out with whitening agents under a dentist's supervision.",
      "Whitening only works on natural teeth and does not change the colour of composite, crowns or veneers. How much lighter the teeth become varies from person to person, and the condition of your teeth is checked before starting.",
    ],
    detail: {
      whatTitle: "How does whitening work?",
      whatItIs: [
        "Whitening agents act on the pigments inside the tooth and make it lighter. Whitening does not reduce the tooth or remove any of its structure.",
        "Because these agents only work on natural teeth, if you plan to have composite or veneers, we do the whitening first so that the shades match.",
      ],
      whoTitle: "Who is it suitable for?",
      whoItSuits: [
        "People whose teeth have gradually turned yellow or dull",
        "Discolouration caused by tea, coffee or smoking",
        "People who want lighter teeth before composite or veneers",
        "Healthy teeth; decay or gum problems are treated before whitening",
      ],
      process: [
        { title: "Examination", body: "The health of the teeth and gums is checked, and if there is decay or a gum problem, that is treated first." },
        { title: "Protecting the gums", body: "The gums and lips are protected from the whitening agent." },
        { title: "Whitening", body: "The whitening agent is applied to the teeth according to the treatment method." },
        { title: "Checking the result", body: "The colour of the teeth is compared with how it was before treatment." },
        { title: "Advice after treatment", body: "We explain what to do about coloured foods and drinks and about daily care." },
      ],
      benefits: [
        "A change of colour without reducing the tooth",
        "Matching the colour of the teeth before composite or veneers",
        "A conservative way of making a smile lighter",
      ],
      limitations: [
        "Existing fillings and crowns do not change colour with whitening; after whitening they may not match the lighter teeth.",
        "How much lighter the teeth become varies from person to person.",
        "There may be sensitivity to cold for a short time, which usually goes away by itself.",
      ],
      longevityTitle: "How long does the result last?",
      longevity: [
        "Teeth darken again with time and with tea, coffee, coloured drinks and smoking. How long the result lasts differs from person to person.",
      ],
      aftercare: [
        "In the first days, avoid dark drinks and foods",
        "Brush twice a day and floss daily",
        "If you have sensitivity, ask your dentist about a suitable toothpaste",
        "Come back periodically for scaling and a check-up",
      ],
      faq: [
        {
          q: "Does whitening damage the teeth?",
          a: "It is a safe method when it is carried out under a dentist's supervision with suitable materials. There may be sensitivity to cold for a short time, which usually goes away by itself.",
        },
        {
          q: "Does whitening work on composite or veneers too?",
          a: "No; whitening agents only work on natural teeth.",
        },
        {
          q: "How much does teeth whitening cost in Shiraz?",
          a: "The cost depends on the method used and the condition of the teeth, and is given after the examination.",
        },
      ],
    },
  },

  implant: {
    name: "Dental implants",
    title: "Dental implants in Shiraz",
    short: "Replacing a missing tooth with an implant and a crown.",
    metaDescription:
      "Dental implants in Shiraz with Dr. Fatemeh Jafari: replacing a missing tooth with an implant in the jawbone and a crown that matches your other teeth.",
    intro: [
      "An implant replaces a missing tooth: a post placed in the jawbone in place of the root, with a crown made on top of it.",
      "Whether an implant is suitable depends on your general health and the condition of your jawbone and gums, and is decided after an examination and imaging.",
    ],
    detail: {
      whatTitle: "What is a dental implant and what problem does it solve?",
      whatItIs: [
        "When a tooth is lost, its place is left empty and chewing and the look of the smile change. An implant takes the place of the tooth root in the bone, and a crown is made on top of it so that the tooth looks and works like a tooth again.",
      ],
      whoTitle: "Who is assessed for an implant?",
      whoItSuits: [
        "People who have lost one or more teeth",
        "People with healthy jawbone and gums, or whose condition can be corrected",
        "People whose illness or medication does not stand in the way; always tell your dentist your medical history",
      ],
      process: [
        { title: "Examination and imaging", body: "General health, the neighbouring teeth, the gums and the jawbone are checked." },
        { title: "Planning", body: "The position and number of the implants and the stages of treatment are decided." },
        { title: "Placing the implant", body: "The implant post is placed in the jawbone." },
        { title: "Bonding to the bone", body: "The implant needs time to bond with the bone; how long depends on each person." },
        { title: "Making and fitting the crown", body: "A crown that matches your other teeth is made and fitted on the implant." },
        { title: "Follow-up", body: "The condition of the implant and gums is checked at later visits." },
      ],
      benefits: [
        "Replacing a tooth without reducing the neighbouring teeth",
        "A look and function close to a natural tooth",
        "Filling the gap left by the missing tooth",
      ],
      limitations: [
        "Treatment has several stages and takes time.",
        "Not everyone is suitable for an implant.",
        "Healthy gums and careful daily care are essential for it to last.",
      ],
      longevityTitle: "How long does it last?",
      longevity: [
        "How long an implant lasts depends on the health of the gums and bone, good hygiene and periodic check-ups.",
      ],
      aftercare: [
        "Brush twice a day and clean between the teeth as your dentist teaches you",
        "Avoid smoking, because it harms healing and the health of the gums",
        "Come back periodically to check the implant and gums",
        "Follow your dentist's instructions after surgery",
      ],
      faq: [
        {
          q: "Who is suitable for a dental implant?",
          a: "Whether an implant is suitable depends on your general health and the condition of your jawbone and gums, and is decided after an examination and imaging.",
        },
        {
          q: "How many months does a dental implant take?",
          a: "The length of treatment depends on the condition of the bone and the number of implants, and is set after an examination and imaging.",
        },
        {
          q: "Is an implant the only way to replace a tooth?",
          a: "An implant is one way of replacing a tooth. The suitable method is chosen after examining the teeth, gums and bone.",
        },
        {
          q: "How much does a dental implant cost in Shiraz?",
          a: "The cost depends on the number of implants and the stages needed, and is given after an examination and imaging.",
        },
      ],
    },
  },

  restoration: {
    name: "Restorations",
    title: "Tooth restoration in Shiraz",
    short: "Rebuilding a damaged tooth with tooth-coloured materials.",
    metaDescription:
      "Tooth restoration in Shiraz with Dr. Fatemeh Jafari: repairing a decayed or broken tooth with tooth-coloured materials, for a natural look and function.",
    intro: [
      "A restoration means removing the decayed or damaged part of a tooth and rebuilding it with tooth-coloured materials, so that the tooth works and looks natural again.",
      "The sooner decay is treated, the more healthy tooth structure is kept.",
    ],
    detail: {
      whatTitle: "When is a tooth restoration needed?",
      whatItIs: [
        "When a tooth becomes decayed, broken or worn, the damaged part has to be removed and the tooth rebuilt. Some decay is painless at first, which is why regular check-ups matter.",
      ],
      whoTitle: "Which teeth are restored?",
      whoItSuits: [
        "Teeth with decay",
        "Broken or chipped teeth",
        "Old fillings that have been damaged",
        "Teeth that need a restoration before a crown or another treatment",
      ],
      process: [
        { title: "Examination and assessment", body: "The extent of the damage is determined by examination and, if needed, imaging." },
        { title: "Anaesthetic", body: "A local anaesthetic is used if needed." },
        { title: "Removing the damaged part", body: "The decay is removed and healthy tooth structure is kept as far as possible." },
        { title: "Rebuilding", body: "The tooth is rebuilt with a tooth-coloured material, layer by layer, and hardened with light." },
        { title: "Adjusting and polishing", body: "The way the teeth meet is checked and the tooth surface is smoothed and polished." },
      ],
      benefits: [
        "Keeping more healthy tooth structure with early treatment",
        "A natural, tooth-coloured look",
        "The tooth works again",
      ],
      limitations: [
        "Large restorations may need a crown or another treatment.",
        "If the decay reaches the nerve, a restoration alone is not enough and root treatment is needed.",
      ],
      longevityTitle: "How long does it last?",
      longevity: [
        "How long a restoration lasts depends on its size and position, the material used, oral hygiene and habits such as teeth grinding.",
      ],
      aftercare: [
        "If you have been numbed, do not eat until the numbness has gone",
        "Brush twice a day and floss daily",
        "Avoid chewing hard objects",
        "Come back periodically for a check-up",
      ],
      faq: [
        {
          q: "What happens if I do not treat tooth decay?",
          a: "The sooner decay is treated, the more healthy tooth structure is kept. Untreated decay can become deeper and need a more complicated treatment.",
        },
        {
          q: "How long does a tooth restoration last?",
          a: "How long it lasts depends on the size of the restoration, where it is and how you look after it.",
        },
        {
          q: "How much does a tooth restoration cost in Shiraz?",
          a: "The cost depends on the number and size of the restorations, and is given after the examination.",
        },
      ],
    },
  },

  "root-canal": {
    name: "Root canal treatment",
    title: "Root canal treatment in Shiraz",
    short: "Root treatment to save a tooth whose nerve is damaged.",
    metaDescription:
      "Root canal treatment in Shiraz with Dr. Fatemeh Jafari: a treatment to save a tooth whose nerve is damaged or infected.",
    intro: [
      "Root canal treatment is a treatment to save a tooth whose nerve is damaged or infected; the root canals are cleaned and filled and the tooth is kept.",
      "After root canal treatment, the tooth usually needs a restoration or a crown to protect it from breaking.",
    ],
    detail: {
      whatTitle: "When is root canal treatment needed?",
      whatItIs: [
        "When deep decay, a blow or a crack damages or infects the nerve of a tooth, root treatment is needed to keep the tooth.",
        "Signs such as spontaneous or night-time pain, strong and lasting sensitivity to hot and cold, pain when chewing or swollen gums can be a reason to see a dentist; but these signs do not always mean root canal treatment is needed, and this can only be decided by an examination.",
      ],
      whoTitle: "Which teeth are treated?",
      whoItSuits: [
        "Teeth with deep decay that has reached the nerve",
        "Teeth whose nerve has been damaged by a blow or a crack",
        "Teeth that are judged savable after an examination and imaging",
      ],
      process: [
        { title: "Examination and imaging", body: "The condition of the nerve and the root of the tooth is checked." },
        { title: "Anaesthetic", body: "A local anaesthetic is used for your comfort." },
        { title: "Removing the damaged tissue", body: "The damaged or infected nerve tissue is removed from the root canals." },
        { title: "Cleaning the canals", body: "The root canals are cleaned and shaped." },
        { title: "Filling the canals", body: "The canals are filled so that they do not become infected again." },
        { title: "Restoration or crown", body: "The tooth is rebuilt to protect it from breaking." },
      ],
      benefits: [
        "Keeping the natural tooth instead of extracting it",
        "Removing the cause of the pain and infection",
        "Preventing the infection from spreading to the surrounding tissue",
      ],
      limitations: [
        "A tooth may become weaker after root canal treatment and needs a restoration or crown.",
        "There may be mild sensitivity or discomfort for a few days after treatment.",
        "In some cases further treatment may be needed.",
      ],
      longevityTitle: "How long does it last?",
      longevity: [
        "With a suitable restoration or crown and good hygiene, a tooth that has had root canal treatment can stay in the mouth for years.",
      ],
      aftercare: [
        "Until the final restoration, do not chew hard food with the treated tooth",
        "Come back in good time for the restoration or crown",
        "Brush and floss daily",
        "Take medication only as your dentist advises",
        "If the pain gets severe or the swelling increases, tell the clinic quickly",
      ],
      faq: [
        {
          q: "Is a crown needed after root canal treatment?",
          a: "After root canal treatment the tooth usually needs a restoration or crown to protect it from breaking. The type is decided after the examination.",
        },
        {
          q: "Is root canal treatment painful?",
          a: "The treatment is usually done under local anaesthetic. Afterwards there may be mild sensitivity for a few days; if the pain is severe, contact the clinic.",
        },
        {
          q: "Wouldn't it be better to extract the tooth instead?",
          a: "The aim of root canal treatment is to keep the natural tooth. The final decision is made after the examination and imaging, based on the condition of the tooth.",
        },
        {
          q: "How much does root canal treatment cost in Shiraz?",
          a: "The cost depends on the tooth and the number of its canals, and is given after the examination.",
        },
      ],
    },
  },

  surgery: {
    name: "Oral surgery",
    title: "Oral surgery in Shiraz",
    short: "Outpatient oral surgery, such as removing impacted teeth.",
    metaDescription:
      "Outpatient oral and dental surgery in Shiraz with Dr. Fatemeh Jafari, such as removing impacted teeth, with a careful assessment before treatment.",
    intro: [
      "Outpatient oral surgery, such as removing impacted teeth, is carried out after an examination and, if needed, imaging.",
      "Before the surgery, we go through the procedure, the aftercare and the recovery time with you.",
    ],
    detail: {
      whatTitle: "When is oral surgery needed?",
      whatItIs: [
        "Some problems of the mouth and teeth are treated with outpatient surgery; for example an impacted tooth that has not come through and is causing a problem. Whether surgery is needed is decided after an examination and imaging.",
      ],
      whoTitle: "Which cases are assessed for surgery?",
      whoItSuits: [
        "An impacted tooth that has not come through or has caused a problem",
        "A tooth that cannot be kept and that it is advised to extract",
      ],
      process: [
        { title: "Examination and imaging", body: "The position of the tooth or the area of surgery is checked." },
        { title: "Explaining the procedure", body: "We go through the procedure, the aftercare and the recovery time with you." },
        { title: "Anaesthetic and surgery", body: "Surgery is usually done under local anaesthetic so that you are comfortable during the work." },
        { title: "Instructions after surgery", body: "We tell you the care you need in the days that follow." },
        { title: "Follow-up visit", body: "If needed, you come back to check how you are healing." },
      ],
      benefits: [
        "Solving the problem of the tooth or the damaged area",
        "Done as an outpatient",
        "A full explanation of the procedure and the aftercare before starting",
      ],
      limitations: [
        "After surgery there may be pain, swelling or limits on eating for a while.",
        "Tell your dentist about your medical history and the medication you take before surgery.",
      ],
      longevityTitle: "Recovery time",
      longevity: [
        "Recovery time depends on the type of surgery and on each person, and is explained to you before the surgery.",
      ],
      aftercare: [
        "Follow your dentist's instructions exactly",
        "In the first hours, avoid smoking, spitting and strong mouthwash",
        "Eat soft, cool food",
        "Take medication only as prescribed",
        "If bleeding gets heavy, or a fever or more swelling develops, contact the clinic at once",
      ],
      faq: [
        {
          q: "Is removing an impacted tooth painful?",
          a: "Surgery is usually done under anaesthetic. Afterwards there may be pain or swelling for a few days, and your dentist explains how to control it.",
        },
        {
          q: "How long should I rest after oral surgery?",
          a: "The length of rest depends on the type of surgery, and your dentist explains it before the surgery.",
        },
        {
          q: "How much does oral surgery cost in Shiraz?",
          a: "The cost depends on the type and difficulty of the surgery, and is given after an examination and imaging.",
        },
      ],
    },
  },

  orthodontics: {
    name: "Orthodontics",
    title: "Orthodontics in Shiraz",
    short: "Correcting crooked teeth and the bite between the jaws.",
    metaDescription:
      "Orthodontics in Shiraz with Dr. Fatemeh Jafari: correcting crooked teeth and the way the jaws meet, with gentle, gradual force.",
    intro: [
      "Orthodontics is a treatment for straightening teeth and correcting the way the jaws meet, carried out with gentle, gradual force.",
      "The suitable method and the length of treatment are decided after an examination and a check of your bite.",
    ],
    detail: {
      whatTitle: "What problems does orthodontics correct?",
      whatItIs: [
        "Orthodontics corrects crooked or crowded teeth, gaps between teeth and upper and lower teeth that do not meet properly (the bite). This is done with gentle, gradual force.",
      ],
      whoTitle: "Who is it suitable for?",
      whoItSuits: [
        "People who are not happy with how their teeth are arranged",
        "People whose bite affects chewing or appearance",
      ],
      process: [
        { title: "Examination", body: "The teeth, gums and bite are checked." },
        { title: "Imaging and treatment plan", body: "The method and the approximate length of treatment are decided after the assessment." },
        { title: "Starting treatment", body: "The orthodontic appliance is fitted and force is applied to the teeth gradually." },
        { title: "Regular visits", body: "The appliance is adjusted and progress is checked." },
        { title: "Retainer", body: "After treatment ends, a retainer is used to keep the result." },
      ],
      benefits: [
        "Straighter teeth and a better bite between the jaws",
        "Gentle, gradual force",
        "Straightened teeth are easier to clean",
      ],
      limitations: [
        "Treatment takes time and needs regular visits.",
        "There may be discomfort or sensitivity in the first days and after adjustments.",
        "The result depends on the patient's co-operation, including keeping up hygiene and wearing the retainer.",
      ],
      longevityTitle: "Keeping the result",
      longevity: [
        "After orthodontics, teeth may tend to drift back over time; that is why wearing the retainer as your dentist advises matters.",
      ],
      aftercare: [
        "Brush and floss in the way you are taught for your orthodontic appliance",
        "Avoid hard or sticky foods",
        "Attend your visits regularly",
        "Wear the retainer as your dentist instructs",
      ],
      faq: [
        {
          q: "How long does orthodontic treatment take?",
          a: "The suitable method and the length of treatment are decided after an examination and a check of your bite.",
        },
        {
          q: "Is orthodontic treatment painful?",
          a: "Orthodontics uses gentle, gradual force. There may be mild discomfort or sensitivity in the first days and after adjustments.",
        },
        {
          q: "Is a retainer needed after orthodontics?",
          a: "Usually yes, to keep the result. Your dentist decides the type and how long to wear it.",
        },
        {
          q: "How much does orthodontic treatment cost in Shiraz?",
          a: "The cost depends on the method and the length of treatment, and is given after the examination.",
        },
      ],
    },
  },

  consultation: {
    name: "Examination and consultation",
    title: "Dental examination and consultation in Shiraz",
    short: "Checking the state of your teeth and reviewing treatment options.",
    metaDescription:
      "Dental examination and consultation in Shiraz with Dr. Fatemeh Jafari: checking your teeth and reviewing treatment options.",
    intro: [
      "Every treatment starts with an examination and consultation; we check your teeth and gums and go through the treatment options that suit you together.",
      "Online appointments on the website (for Iranian numbers) are for this session. Treatment sessions after it are arranged with the clinic, at a time that suits you.",
    ],
    faq: [
      {
        q: "How long does the consultation take?",
        a: "About 30 minutes. In this time your teeth are examined and we answer your questions about the options and the cost.",
      },
    ],
  },
};
