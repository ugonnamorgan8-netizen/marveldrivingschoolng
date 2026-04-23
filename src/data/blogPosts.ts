import classImg from "@/assets/gallery-class.jpg";
import theoryImg from "@/assets/gallery-theory.jpg";
import frscImg from "@/assets/gallery-frsc-cbt.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "10-essential-tips-for-first-time-drivers",
    title: "10 Essential Tips for First-Time Drivers in Nigeria",
    excerpt:
      "From mastering the clutch to navigating Umuahia's busy junctions, these tips will help you build confidence behind the wheel from day one.",
    image: classImg,
    date: "March 12, 2025",
    category: "Beginner Guide",
    readTime: "6 min read",
    content: [
      "Learning to drive in Nigeria is exciting — but it can also be intimidating. Between busy junctions, unpredictable traffic, and the pressure of getting it right, many beginners freeze up in their first few sessions. The good news? Confidence behind the wheel is built one small habit at a time.",
      "1. Master your seating position first. Before you even touch the steering, adjust your seat so your knees are slightly bent when the clutch is fully pressed, and your wrists rest comfortably on the top of the wheel. A good driving position prevents fatigue and gives you full control.",
      "2. Get friendly with the clutch. The clutch is what trips up most first-timers in Nigeria, since the majority of cars here are manual. Practice the 'biting point' on a flat, empty surface until releasing the clutch feels natural — no jerks, no stalls.",
      "3. Use your mirrors every 5–8 seconds. Driving is not just about looking ahead; it's about knowing what's around you at all times. Build the habit early so it becomes automatic by the time you face real traffic.",
      "4. Don't fear the horn — but don't abuse it either. In Nigeria, the horn is a communication tool. A short tap warns a pedestrian or signals your presence at a blind corner. Long, angry blasts only escalate tension.",
      "5. Always assume the other driver won't follow the rules. Defensive driving is the single most important skill on Nigerian roads. Leave gaps, anticipate sudden lane changes, and keep your eyes scanning.",
      "6. Learn to park before you learn to speed. Reverse parking, parallel parking, and three-point turns are required for your FRSC test — and for everyday life. Practice them until they feel boring.",
      "7. Respect roundabouts. Yield to traffic already in the roundabout, signal before exiting, and never stop inside one unless absolutely necessary.",
      "8. Keep both hands on the wheel. The '9 and 3' position gives you the best control and reaction time. Save the one-handed cruising for when you've logged hundreds of hours.",
      "9. Don't drive tired or distracted. Phones, loud arguments, and exhaustion cause more accidents than poor skill. If you're not 100% present, pull over.",
      "10. Get proper training. Self-taught driving leaves dangerous gaps. A structured, FRSC-approved program (like ours at Marvel Driving School) teaches you the road code, defensive driving, and the practical skills you need to pass your test and stay safe for life.",
      "Take it one session at a time. Every confident driver you see on the road today was once a nervous beginner. With the right instruction and consistent practice, you'll get there too.",
    ],
  },
  {
    slug: "understanding-the-frsc-cbt",
    title: "Understanding the FRSC CBT: What to Expect",
    excerpt:
      "A complete walkthrough of the FRSC Computer-Based Test — question format, pass mark, and how Marvel prepares you to ace it the first time.",
    image: frscImg,
    date: "February 28, 2025",
    category: "Licensing",
    readTime: "5 min read",
    content: [
      "Before the FRSC issues your driver's license, you must pass the Computer-Based Test (CBT). For many applicants, this is the most stressful part of the licensing process — mostly because they don't know what to expect. Let's break it down.",
      "What is the FRSC CBT? It's a multiple-choice test taken on a computer at an accredited Driving School Standardisation Scheme (DSSS) centre. The test covers the Nigerian Highway Code, road signs, traffic regulations, and basic vehicle knowledge.",
      "Format and duration. You'll typically face 30–40 multiple-choice questions, with about 30 minutes to complete them. Each question has 3–4 options, and you select the correct one on screen.",
      "Pass mark. You generally need to score at least 50–60% to pass, depending on the centre and category. The score is calculated instantly when you submit, so you'll know your result before leaving the room.",
      "What's tested. Expect questions on: the meaning of warning, regulatory, and informative road signs; right-of-way rules at junctions and roundabouts; speed limits in built-up and rural areas; safe overtaking and lane discipline; what to do at accident scenes; and basic vehicle checks.",
      "How to prepare. The single best preparation is structured study of the Highway Code combined with mock CBT practice. At Marvel Driving School, our Friday theory classes walk you through every category of question, and we run timed mock tests so test day feels familiar — not frightening.",
      "On the day. Arrive 30 minutes early with your registration details and ID. Read each question fully before answering — many wrong answers come from rushing. Flag tricky questions and return to them if your centre's interface allows it.",
      "If you don't pass on the first try, don't panic. You can retake the test, and most students who fail the first time pass on their second attempt with a little more practice. With Marvel's preparation, the vast majority of our students pass on attempt one.",
    ],
  },
  {
    slug: "highway-code-road-signs-every-driver-must-know",
    title: "Highway Code: The Road Signs Every Driver Must Know",
    excerpt:
      "Warning, regulatory, and informative signs explained simply — with real Nigerian road examples you'll see on your driving test.",
    image: theoryImg,
    date: "February 10, 2025",
    category: "Theory",
    readTime: "7 min read",
    content: [
      "Road signs are the silent language of the road. Whether you're driving down BCA Road in Umuahia or heading out on the expressway, understanding these signs keeps you — and everyone around you — safe. Here's a clear guide to the three main categories you'll meet on the road and on your FRSC test.",
      "1. Warning signs. These are usually triangular with a red border and a white or yellow background. They warn you of a hazard ahead — a sharp bend, school crossing, narrow bridge, or slippery road. When you see one, ease off the accelerator and prepare to react. Common examples: 'Bend Ahead', 'Children Crossing', 'Steep Hill', and 'Road Narrows'.",
      "2. Regulatory signs. These tell you what you must or must not do, and breaking them is a traffic offence. They come in two sub-types: prohibitive (round, with a red border and a slash, e.g. 'No Entry', 'No Overtaking', 'No Parking') and mandatory (round, blue background, white symbol, e.g. 'Turn Left', 'Keep Right', 'Roundabout Ahead'). Stop and Give Way signs also fall in this category.",
      "3. Informative signs. These are usually rectangular and provide useful information rather than instructions or warnings. They tell you about distances, directions, services (fuel, hospital, restaurant), or facilities ahead. Examples: 'Hospital 2km', 'Petrol Station', 'Lagos 120km'.",
      "Reading signs in context. A road sign is only useful if you act on it in time. Train your eyes to scan ahead — at least 12 seconds down the road — so you spot signs early and have time to slow, signal, or change lanes safely.",
      "Signs you'll likely see on test day. The FRSC CBT loves to test the difference between similar-looking signs. Pay close attention to: 'Stop' vs 'Give Way', 'No Entry' vs 'No Through Road', 'Pedestrian Crossing' vs 'School Crossing', and the various junction warnings (T-junction, Y-junction, crossroads).",
      "Painted road markings count too. Solid white lines mean no overtaking. Broken white lines allow overtaking when safe. Yellow lines along the edge mean no parking. Zebra crossings give pedestrians right of way — always.",
      "How we teach it at Marvel. In our Friday theory classes, we use real photos of signs from Umuahia and Aba roads, group them by category, and run sign-recognition drills. By the time our students sit the FRSC CBT, recognising any sign is second nature.",
      "The bottom line: signs aren't there to make life difficult — they're there to keep you alive. Learn them well, respect them on the road, and you'll be a safer driver for it.",
    ],
  },
];

export const getPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);