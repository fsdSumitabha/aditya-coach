// ============================================================
// The Lifestyle Blueprint — document content (VERBATIM).
// This is the author's own copy. The body text below must NOT be edited,
// reworded, or "improved" — it is rendered exactly as written. Design and
// animation live in the renderer components; the words live here.
// ============================================================

export type Block =
  | { t: "p"; text: string; tone?: "lead" | "strong" | "muted" }
  /** stacked short lines with their own rhythm (each animates in on its own beat) */
  | { t: "stack"; items: string[]; tone?: "lead" | "strong" | "muted" }
  /** a sub-heading inside a change */
  | { t: "h"; text: string }
  /** ordered protocol steps */
  | { t: "steps"; items: { n: string; title: string; body: string }[] }
  /** term → body definition rows (protocols, levels, supplements, sources) */
  | { t: "defs"; items: { term: string; body: string }[] }
  /** a simple checked list, optional group label */
  | { t: "list"; label?: string; items: string[] }
  /** a highlighted note box */
  | { t: "callout"; label: string; lines: string[] };

export type Change = {
  id: string;
  num: string;
  /** short label for the chapter rail */
  short: string;
  title: string;
  lead: string;
  image: { label: string; alt: string };
  blocks: Block[];
};

export const META = {
  docTitle: "The Lifestyle Blueprint",
  author: "By Aditya Kumar Upadhyay",
  subtitle: "10 Lifestyle Changes That Rebuild a Man Completely",
  coverTag:
    "Free Digital Product · Men's Lifestyle & Personality Coach · Kolkata, India",
  coverImage: {
    label: "BLUEPRINT COVER",
    alt: "Cover of The Lifestyle Blueprint — a premium, dark charcoal and gold digital guide for men, with the title 'The Lifestyle Blueprint' and author name Aditya Kumar Upadhyay in an elegant editorial layout",
  },
};

export const INTRO = {
  kicker: "Before You Begin",
  blocks: [
    {
      t: "stack",
      tone: "strong",
      items: [
        "This is not a diet plan.",
        "This is not a 30 day challenge.",
        "This is not a list of supplements to buy.",
      ],
    },
    {
      t: "p",
      tone: "lead",
      text: "This is the exact framework I use with every single client I work with.",
    },
    {
      t: "p",
      text: "I went from 100kg with zero confidence to coaching some of the most successful men in Kolkata.",
    },
    {
      t: "p",
      text: "I did not do it with a complicated program. I did it by changing how I lived — one small decision at a time.",
    },
    {
      t: "p",
      text: "Most coaches give you a diet on day one. I give you this first.",
    },
    {
      t: "p",
      text: "Because no diet, gym program or supplement will work if the foundation of how you live is broken.",
    },
    {
      t: "stack",
      tone: "strong",
      items: ["Fix the lifestyle first.", "Everything else follows."],
    },
    { t: "h", text: "How to use this blueprint:" },
    {
      t: "p",
      text: "Do not try to implement all 10 changes at once. Pick one. Do it for 7 days. Then add the next one. Compounded over 90 days — this becomes a completely different life.",
    },
  ] as Block[],
};

/** The verbatim line the pinned showpiece pulls out of the intro. */
export const PULL_QUOTE = {
  lines: ["Fix the lifestyle first.", "Everything else follows."],
};

export const CHANGES: Change[] = [
  {
    id: "change-01",
    num: "01",
    short: "Fix Your Morning",
    title: "Fix Your Morning",
    lead: "What you do in the first 30 minutes of waking up either builds your body or slowly destroys it. Most men are destroying it without realizing it.",
    image: {
      label: "MORNING RITUAL",
      alt: "A man's calm morning routine at dawn — a bottle of green-tea-infused water on a bedside table, warm sunlight coming through a window, phone left face-down, quiet and disciplined",
    },
    blocks: [
      { t: "h", text: "THE MORNING PROTOCOL — IN THIS EXACT ORDER:" },
      {
        t: "steps",
        items: [
          {
            n: "1",
            title: "No phone for the first 10 minutes.",
            body: "Your brain is in its most suggestible state when you wake up. Start with 30 seconds of gratitude instead. Just be thankful you woke up. That mindset shift sets your entire day.",
          },
          {
            n: "2",
            title: "Green tea water immediately.",
            body: "This is the most underrated morning habit alive. The night before you sleep — put one green tea bag in a bottle of 500ml of water. By morning that water is packed with antioxidants, anti-inflammatory properties and compounds that clean your body from the inside out. Drink this before anything else. Not milk tea. Not coffee. This.",
          },
          {
            n: "3",
            title: "Morning sunlight within 30 minutes of waking.",
            body: "Get outside or stand by your window for 10 minutes. Morning sunlight sets your circadian rhythm — your body's internal clock. That clock controls when you feel sleepy at night and when you feel awake in the morning. No morning sunlight means broken sleep, low energy all day and poor hormonal health. 10 minutes. That is all it takes.",
          },
          {
            n: "4",
            title: "Vitamin C with breakfast.",
            body: "It eliminates free radicals and toxins from your body every single morning. Think of it as cleaning your system before you start your day. Your skin, your immunity and your energy all improve when this becomes consistent.",
          },
          {
            n: "5",
            title: "High protein breakfast.",
            body: "Eggs, paneer, curd, chicken — whatever you prefer. A high protein breakfast fires up your metabolism for the entire day and keeps you full and focused for hours.",
          },
        ],
      },
      {
        t: "callout",
        label: "Start tonight:",
        lines: [
          "Put a green tea bag in a bottle of water before you sleep. Drink it first thing tomorrow morning. That one change alone will improve your energy, gut health and skin within one week.",
        ],
      },
    ],
  },
  {
    id: "change-02",
    num: "02",
    short: "Fix Your Sleep",
    title: "Fix Your Sleep",
    lead: "Sleep is not rest. Sleep done right is the most powerful recovery tool your body has. And most men are wasting it completely.",
    image: {
      label: "DEEP SLEEP",
      alt: "A dark, cool bedroom at night with a man sleeping deeply, faint moonlight, no screens — the picture of restorative, fasted sleep",
    },
    blocks: [
      { t: "h", text: "Why you wake up tired even after 8 hours:" },
      {
        t: "p",
        text: "Most men wake up exhausted even after a full night of sleep. The reason is simple. They are not sleeping fasted.",
      },
      {
        t: "p",
        text: "When you eat close to bedtime — your body spends the entire night digesting that food.",
      },
      {
        t: "stack",
        items: [
          "Not repairing your cells.",
          "Not burning fat.",
          "Not fixing your gut.",
          "Not rebuilding your testosterone.",
          "Not restoring your energy.",
        ],
      },
      { t: "p", tone: "strong", text: "Just digesting." },
      {
        t: "p",
        text: "That is why you wake up feeling like you barely slept. Your body never actually rested. It was working all night on your last meal.",
      },
      { t: "h", text: "THE SLEEP PROTOCOL:" },
      {
        t: "defs",
        items: [
          {
            term: "Last meal minimum 2 to 3 hours before sleep.",
            body: "This is the most important sleep change you can make. When your body is fasted during sleep — your cells repair, your gut heals, your fat burns, your testosterone is produced and your energy restores completely.",
          },
          {
            term: "No coffee after 2pm.",
            body: "Caffeine stays in your body for 7 to 8 hours. A 4pm coffee is still fully active at midnight. That is why you cannot fall asleep or why your sleep is restless.",
          },
          {
            term: "Write your worries down before sleeping.",
            body: "Your brain runs in circles at night trying to remember unfinished things. Put them on paper. Your mind will stop trying to hold them and allow you to rest deeply.",
          },
          {
            term: "Dark room. Cool temperature. Same sleep time every single night.",
            body: "Your body loves routine. A consistent sleep schedule is more powerful than any sleeping supplement on the market.",
          },
          {
            term: "Minimum 7 to 8 hours every night.",
            body: "Poor sleep raises cortisol. High cortisol stores belly fat, kills testosterone and destroys muscle tissue. You cannot out-train bad sleep. Ever.",
          },
        ],
      },
      {
        t: "callout",
        label: "Do this for 7 days.",
        lines: [
          "Your energy will change.",
          "Your mood will change.",
          "Your body will change.",
          "Sleep is free. Use it properly.",
        ],
      },
    ],
  },
  {
    id: "change-03",
    num: "03",
    short: "Fix Your Protein",
    title: "Fix Your Protein",
    lead: "Most Indian men eat 30 to 40 grams of protein per day. They need 100 to 150 grams minimum.",
    image: {
      label: "PROTEIN PLATE",
      alt: "A high-protein Indian meal spread — paneer, eggs, curd, dal, chickpeas and grilled chicken arranged cleanly on dark stoneware",
    },
    blocks: [
      {
        t: "p",
        text: "Indian kings were over 6 feet tall with pure muscle and dense bones. They had genetics the world respected. We traded that for processed food, simple carbs and zero quality protein.",
      },
      {
        t: "p",
        tone: "strong",
        text: "The belly fat, the low energy, the weak frame — that is not your genetics. That is your diet betraying your bloodline.",
      },
      { t: "h", text: "YOUR DAILY PROTEIN TARGET FORMULA:" },
      {
        t: "p",
        text: "Take your ideal body weight in kg. Not what you weigh right now. The lean weight you want to be.",
      },
      {
        t: "p",
        text: "Multiply that number by 2.2 to convert to pounds. Then multiply by your activity level:",
      },
      {
        t: "list",
        items: [
          "Not very active = multiply by 14",
          "Gym 3 to 4 times a week = multiply by 16",
          "Very active daily = multiply by 18",
        ],
      },
      {
        t: "p",
        text: "That final number is your daily calorie target. Because you used your ideal weight and not your current weight — you are already automatically in a calorie deficit. You are eating for your future body. Not your current one. That is the smartest approach to fat loss most people will never know about.",
      },
      {
        t: "callout",
        label: "For protein specifically:",
        lines: [
          "Your ideal body weight in kg multiplied by 1.5 to 2 equals your daily protein target in grams.",
        ],
      },
      { t: "h", text: "Best protein sources:" },
      {
        t: "defs",
        items: [
          {
            term: "Vegetarian:",
            body: "Paneer, tofu, curd, dal, chickpeas, soya chunks, whey protein, plant protein.",
          },
          {
            term: "Non-vegetarian:",
            body: "Eggs, chicken, fish, lean meat.",
          },
        ],
      },
      {
        t: "p",
        text: "Add protein to every single meal. Not once a day. Every meal. Breakfast, lunch and dinner.",
      },
      {
        t: "p",
        text: "Use whey protein on busy days. It is not magic. It is just convenient food. Use it to fill gaps — never as a replacement for real food when you have time to eat.",
      },
      {
        t: "callout",
        label: "The fat loss secret most people miss:",
        lines: [
          "A high protein diet is more effective for fat loss than starving yourself. Protein is filling, it burns more energy to digest and it protects your muscle while your body loses fat. Eat more protein. Lose more fat.",
        ],
      },
    ],
  },
  {
    id: "change-04",
    num: "04",
    short: "Cut The Sugar",
    title: "Cut The Sugar",
    lead: "Sugar is not just making you fat. It is quietly destroying your hormones every single day.",
    image: {
      label: "SUGAR VS FRUIT",
      alt: "A visual contrast — packaged biscuits, cola and white bread on one side, fresh bananas, apples and dates on the other, showing what to swap out",
    },
    blocks: [
      {
        t: "p",
        text: "Every time you eat sugar your insulin spikes. High insulin tells your body to store fat and suppress testosterone production. The more sugar you eat daily — the lower your testosterone gets. The lower your testosterone — the more tired, soft and unmotivated you feel. It is that simple.",
      },
      {
        t: "list",
        label: "What to avoid:",
        items: [
          "White rice, white bread, white flour.",
          "Packaged juices and cold drinks — pure liquid sugar with zero nutrition.",
          "Biscuits, namkeen and packaged snacks — hidden sugar and refined oils.",
          "Milk tea with sugar on empty stomach — spikes insulin and destroys your gut lining before your day even begins.",
        ],
      },
      { t: "h", text: "What to do instead:" },
      {
        t: "defs",
        items: [
          {
            term: "Apple cider vinegar with mother.",
            body: "One tablespoon in a glass of water every morning on an empty stomach. This alone stabilizes your insulin response before your first meal of the day.",
          },
          {
            term: "Walk for 10 to 15 minutes after every meal.",
            body: "This drops your blood sugar faster than most fat burners on the market. Free. Requires zero equipment.",
          },
          {
            term: "Replace sugar cravings with fruit.",
            body: "Bananas, apples, dates — natural sweetness with fiber that slows sugar absorption significantly.",
          },
        ],
      },
    ],
  },
  {
    id: "change-05",
    num: "05",
    short: "Move Every Day",
    title: "Move Every Day",
    lead: "You do not need a gym membership to start. You need your body and 30 minutes.",
    image: {
      label: "DAILY MOVEMENT",
      alt: "A man walking briskly outdoors after dinner at dusk, and a second frame of him lifting weights — everyday movement and strength training",
    },
    blocks: [
      {
        t: "p",
        text: "Your body was designed to move. Every hour you sit — your metabolism slows, your insulin sensitivity drops, your posture deteriorates and your energy crashes.",
      },
      {
        t: "p",
        tone: "strong",
        text: "Movement is not optional. It is the foundation of every other positive change in your body.",
      },
      {
        t: "defs",
        items: [
          {
            term: "Level 1 — Start here:",
            body: "Walk 30 minutes every day. After dinner is the best time. It drops blood sugar, improves sleep, reduces cortisol and produces endorphins. Every single day. Without exception.",
          },
          {
            term: "Level 2 — Add this:",
            body: "Strength training 3 to 4 times a week. Lifting weights builds muscle. Muscle burns fat 24 hours a day — not just during the workout. You cannot out-cardio a bad lifestyle. Build muscle and your body becomes a fat burning machine permanently.",
          },
          {
            term: "Level 3 — The gym rule:",
            body: "45 minutes maximum per session. After 45 minutes your cortisol spikes and your testosterone drops. Your body starts breaking down muscle instead of building it. More is not better. 45 focused minutes beats 2 hours of distracted training every single time.",
          },
        ],
      },
      { t: "h", text: "The most important fitness truth:" },
      {
        t: "p",
        text: "Your body is not built in the gym. It is built in the other 23 hours of your day. Your diet, your sleep, your recovery — that is where real results happen. The gym is just the trigger.",
      },
      { t: "h", text: "The 4 levels of body transformation:" },
      {
        t: "defs",
        items: [
          {
            term: "Level 1: Eat less and move more.",
            body: "You will lose weight. Good start.",
          },
          {
            term: "Level 2: Eat less, move more and eat more protein.",
            body: "Now you are losing fat — not just weight. Big difference.",
          },
          {
            term: "Level 3: Eat less, move more, eat more protein and lift weights.",
            body: "Now you are losing fat and building muscle simultaneously. Your body starts to completely change shape.",
          },
          {
            term: "Level 4: Do all of the above and fix your sleep.",
            body: "This is where everything transforms. Your energy comes back. Your hormones balance. Your confidence returns. You feel like a completely different man.",
          },
        ],
      },
      {
        t: "stack",
        tone: "strong",
        items: ["This is not a 30 day challenge.", "This is a lifestyle."],
      },
    ],
  },
  {
    id: "change-06",
    num: "06",
    short: "Drink More Water",
    title: "Drink More Water",
    lead: "Most men are chronically dehydrated. They think they are hungry. They are thirsty.",
    image: {
      label: "HYDRATION",
      alt: "A large glass bottle of water beside a fresh coconut and a glass of buttermilk, with cucumber and watermelon slices — natural hydration and cooling",
    },
    blocks: [
      { t: "h", text: "THE WATER PROTOCOL:" },
      {
        t: "defs",
        items: [
          {
            term: "500ml of water immediately upon waking.",
            body: "Your body has been fasting for 7 to 8 hours. Hydrate before anything else enters your body. Non-negotiable.",
          },
          {
            term: "Drink water before every meal — not after.",
            body: "Water before food aids digestion. Water after food dilutes your digestive enzymes and slows the entire digestion process. Drink before. Wait 30 minutes. Then eat.",
          },
          {
            term: "Minimum 3 to 4 litres per day.",
            body: "More if you are exercising or if it is summer.",
          },
          {
            term: "Never drink cold water after meals.",
            body: "Cold water after food shocks your gut and stops digestion completely.",
          },
        ],
      },
      { t: "h", text: "In summer specifically:" },
      {
        t: "p",
        text: "Coconut water in the morning. Buttermilk after meals. These cool your body naturally, support gut health and restore electrolytes. Add cucumber and watermelon to your meals. Natural cooling. Natural fiber. Natural gut support.",
      },
    ],
  },
  {
    id: "change-07",
    num: "07",
    short: "Manage Your Stress",
    title: "Manage Your Stress",
    lead: "Stress is not a personality trait. It is a hormonal problem. And it is destroying your body silently.",
    image: {
      label: "CALM UNDER STRESS",
      alt: "A composed man doing slow breathing by a window in soft daylight — a calm, grounded picture of managed stress and lowered cortisol",
    },
    blocks: [
      {
        t: "stack",
        items: [
          "Chronic stress raises cortisol.",
          "High cortisol stores fat — especially around your belly.",
          "High cortisol kills testosterone.",
          "High cortisol breaks down muscle tissue.",
          "High cortisol destroys your sleep.",
        ],
      },
      {
        t: "p",
        text: "You can train hard every single day and eat perfectly — but if your stress is unmanaged your body will not change. Cortisol is the silent destroyer of results.",
      },
      { t: "h", text: "STRESS MANAGEMENT TOOLS:" },
      {
        t: "defs",
        items: [
          {
            term: "10 minutes of morning sunlight.",
            body: "It activates cortisol naturally at the right time — morning — so it stays low for the rest of the day. This one habit regulates your entire stress hormone cycle naturally.",
          },
          {
            term: "Move your body daily.",
            body: "Any physical activity produces endorphins and drops cortisol within 20 minutes. Walking counts. Use it.",
          },
          {
            term: "Write your worries down at night.",
            body: "Do not carry them to bed. Paper holds them so your brain does not have to.",
          },
          {
            term: "Limit social media especially before sleep.",
            body: "Every notification is a small cortisol spike. Your nervous system does not know it is just a phone. It responds as if it is a real threat. Every single time.",
          },
          {
            term: "Connect with something bigger than yourself.",
            body: "Sunlight. Nature. Prayer. Purpose. Legacy. Men without a sense of purpose carry chronic low-level anxiety that looks like laziness but is actually disconnection.",
          },
          {
            term: "Reduce alcohol significantly.",
            body: "Alcohol is a depressant. It feels like relief in the moment. It creates the anxiety the next day.",
          },
        ],
      },
    ],
  },
  {
    id: "change-08",
    num: "08",
    short: "Fix Your Gut",
    title: "Fix Your Gut",
    lead: "Your mood, your energy, your skin, your sleep and your confidence all start in one place. Your gut.",
    image: {
      label: "GUT HEALTH",
      alt: "Gut-friendly foods on a clean surface — a bowl of curd, a glass of buttermilk, fermented foods, carrots and cucumber sticks",
    },
    blocks: [
      {
        t: "p",
        text: "Your gut produces 90% of your serotonin — your mood chemical. Bad gut equals bad mood, bad skin, bad sleep, low energy and poor immunity.",
      },
      {
        t: "p",
        tone: "strong",
        text: "Fix your gut and everything else improves alongside it.",
      },
      { t: "h", text: "GUT HEALTH BASICS:" },
      {
        t: "defs",
        items: [
          {
            term: "Add one probiotic food daily.",
            body: "Curd, buttermilk, fermented foods. Feed the good bacteria. One serving a day changes your digestion and energy levels within 2 weeks.",
          },
          {
            term: "Add fiber daily.",
            body: "Vegetables, fruits, whole grains. Carrot and cucumber as snacks are the simplest and most effective options.",
          },
          {
            term: "Eat smaller meals more frequently especially in summer.",
            body: "Heavy meals in heat force your body to use massive energy just to digest. That energy should be cooling you down and keeping your organs functioning properly.",
          },
          {
            term: "Avoid milk tea on an empty stomach.",
            body: "It spikes your insulin, irritates your gut lining and crashes your energy before your day even begins.",
          },
          {
            term: "Never drink cold water after meals.",
            body: "Cold water after food shocks your gut completely and stops the entire digestion process.",
          },
        ],
      },
    ],
  },
  {
    id: "change-09",
    num: "09",
    short: "Supplement Stack",
    title: "The Basic Supplement Stack",
    lead: "You do not need expensive supplements. You need the right ones at the right time.",
    image: {
      label: "SUPPLEMENT STACK",
      alt: "A clean flat-lay of essential supplement bottles — Vitamin C, D3, Omega 3 fish oil, multivitamin, creatine, collagen and zinc — on a dark surface",
    },
    blocks: [
      {
        t: "callout",
        label: "Important note:",
        lines: [
          "Supplements support a good lifestyle. They cannot replace one.",
        ],
      },
      {
        t: "stack",
        items: [
          "Fix your lifestyle first.",
          "Then your nutrition.",
          "Then add supplements as the final layer.",
          "This is the correct order. Always.",
        ],
      },
      { t: "h", text: "MORNING WITH BREAKFAST:" },
      {
        t: "defs",
        items: [
          {
            term: "Vitamin C",
            body: "Eliminates free radicals and toxins. Boosts immunity. Improves skin. Essential every single morning.",
          },
          {
            term: "Multivitamin",
            body: "Fills the nutritional gaps that most Indian diets miss on a daily basis. The foundation of your supplement stack.",
          },
          {
            term: "Omega 3 Fish Oil — 1000mg",
            body: "Brain health, heart health and inflammation reduction. Works best when taken with a fatty meal.",
          },
          {
            term: "Vitamin D3",
            body: "80% of Indian men are deficient. Directly linked to testosterone production and immune function. If you cannot get morning sunlight daily — supplement this without question.",
          },
          {
            term: "Vitamin E",
            body: "Skin health, antioxidant protection and cellular repair. Most men skip this. Most men also look older than they are.",
          },
          {
            term: "Creatine",
            body: "Strength, muscle recovery and brain function. Not just for gym users. Every man benefits from creatine daily.",
          },
          {
            term: "Collagen",
            body: "Joints, skin, hair and gut lining. Especially important for men above 30. This one ages you backwards when taken consistently.",
          },
        ],
      },
      { t: "h", text: "AT NIGHT BEFORE SLEEP:" },
      {
        t: "defs",
        items: [
          {
            term: "Zinc",
            body: "Natural testosterone support during your overnight recovery. Taken at night it works with your body's natural hormonal repair cycle.",
          },
        ],
      },
      {
        t: "callout",
        label: "Where to start if you are new to supplements:",
        lines: [
          "Begin with Vitamin C, Vitamin D3 and Omega 3. These three alone will change your energy, immunity and hormones within 30 days. Add the rest gradually.",
        ],
      },
    ],
  },
  {
    id: "change-10",
    num: "10",
    short: "Build Identity",
    title: "Build Identity Not Habits",
    lead: "Motivated men quit. Identity-driven men do not.",
    image: {
      label: "IDENTITY",
      alt: "A strong, composed man looking at his reflection with quiet resolve — the image of a decided identity rather than fleeting motivation",
    },
    blocks: [
      {
        t: "p",
        text: "Most men try to build habits by waiting to feel motivated. Motivation is a feeling. Feelings come and go. When motivation leaves — and it always does — they stop.",
      },
      {
        t: "p",
        text: "The men who actually change their lives do not ask themselves if they feel like it. They ask who they have decided to be. That is identity. And identity does not negotiate.",
      },
      { t: "h", text: "The identity shift:" },
      {
        t: "stack",
        tone: "strong",
        items: [
          "Stop asking: Do I feel like doing this?",
          "Start asking: Who am I becoming?",
        ],
      },
      {
        t: "p",
        text: "When you wake up and do not want to go to the gym — go anyway. Not because you are motivated. Because you are someone who goes to the gym. That is your identity. Non-negotiable.",
      },
      {
        t: "list",
        label: "DAILY NON-NEGOTIABLES — PICK 3 TO START:",
        items: [
          "Green tea water every morning without exception.",
          "No phone for the first 10 minutes of the day.",
          "10 minutes of morning sunlight.",
          "Walk at least 30 minutes every day.",
          "Hit your protein goal at every single meal.",
          "Last meal at least 2 to 3 hours before sleep.",
          "No coffee after 2pm.",
          "Write your worries on paper before bed.",
        ],
      },
      {
        t: "p",
        text: "Pick 3. Do them for 7 days. Then add one more. Then one more.",
      },
      {
        t: "p",
        tone: "strong",
        text: "The man you want to become is built one decision at a time. Not one motivation at a time.",
      },
    ],
  },
];

export const START = {
  kicker: "How To Start Tonight",
  lead: "Do not try to do everything at once. Start with these three things only.",
  phases: [
    {
      title: "Tonight before you sleep:",
      items: [
        "Put a green tea bag in a bottle of 500ml water. Leave it on your bedside table.",
        "Write down 3 things that are on your mind on paper.",
        "Eat nothing for the next 2 to 3 hours before sleep.",
      ],
      time: "Time required: 5 minutes.",
    },
    {
      title: "Tomorrow morning:",
      items: [
        "Wake up and drink the green tea water before you touch your phone.",
        "Go outside for 10 minutes of sunlight.",
        "Take Vitamin C with a high protein breakfast.",
      ],
      time: "Time required: 30 minutes.",
    },
    {
      title: "This week:",
      items: [
        "Walk 30 minutes every evening after dinner.",
        "Drink water before every meal.",
        "Cut the milk tea in the morning.",
        "Add protein to every single meal.",
        "Reduce sugar as much as you can.",
        "Repeat for 7 days. Then notice the difference.",
      ],
      time: "",
    },
  ],
  close: [
    {
      t: "p",
      tone: "strong",
      text: "This is not about being perfect. This is about being slightly better than you were yesterday.",
    },
    { t: "p", text: "Pick one thing. Do it for 7 days. Then add another." },
    {
      t: "p",
      tone: "strong",
      text: "The man you want to become is built one decision at a time.",
    },
  ] as Block[],
};

export const FINAL = {
  kicker: "Final Note From Aditya",
  image: {
    label: "ADITYA PORTRAIT",
    alt: "Portrait of Aditya Kumar Upadhyay, men's lifestyle and personality coach in Kolkata, confident and composed in premium dark editorial styling",
  },
  blocks: [
    {
      t: "p",
      tone: "lead",
      text: "I built this blueprint from everything I know — from my own transformation, from years of coaching men and from every client result I have seen.",
    },
    { t: "p", tone: "strong", text: "This is the foundation." },
    {
      t: "p",
      text: "If you want to go deeper — if you want a complete lifestyle and personality transformation built specifically around your body, your goals and your life —",
    },
    { t: "p", tone: "strong", text: "I am here." },
    {
      t: "p",
      text: "Book a consultation and let us build the complete version of you.",
    },
    {
      t: "stack",
      tone: "strong",
      items: [
        "Not just the body.",
        "The presence. The confidence.",
        "The communication. The mindset. The health.",
      ],
    },
    { t: "p", text: "All of it." },
    { t: "p", tone: "strong", text: "Together." },
  ] as Block[],
};

export const COLOPHON = [
  "© 2026 Aditya Kumar Upadhyay · Men's Lifestyle & Personality Coach",
  "Instagram: @adityakumarupadhyay_",
  "Website: adityaupadhyay.com",
  "This document is free to share.",
  "Please do not sell or modify it.",
];
