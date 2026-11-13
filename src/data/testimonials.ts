// Real recommendations from the school's Facebook page (exact words).
// The live list comes from the database; this is shown if it can't be reached.
export type Testimonial = { name: string; role: string; content: string; rating: number };

export const FACEBOOK_REVIEWS: Testimonial[] = [
  { name: "Chikkie Ezeokoye", role: "Facebook review · Aug 2024", content: "I used to have intense driving phobia (I used to be very scared of driving)… After my trainings in Marvel Driving School… I literally lost my fear… and now I am very confident in driving… All thanks to the staff, team and management of Marvel Driving School. They all contributed to my growth… I’m super excited that I’m a confident driver now", rating: 5 },
  { name: "Ikenga Mark", role: "Facebook review · Aug 2024", content: "Wow I never knew there was such professionalism in Umuahia. My experience was awesome. Guys choose Marvel's one month plan and thank me later. This is litrarily the BEST DRIVING SCHOOL IN ABIA STATE.", rating: 5 },
  { name: "Susan Susan", role: "Facebook review · Sep 2024", content: "With the motto patience and Focus your driving is safe. Is all amazing experience and it Worth both the money and time. Have no regrets in connecting with Marvel Driving School. Another sweet part of it is the CBT exams I Love it.", rating: 5 },
  { name: "Samuel Kindness", role: "Facebook review · Aug 2025", content: "A very nice driving school for beginners to learn driving fast and safe and for professionals to enhance their driving skills", rating: 5 },
  { name: "Barbie Sleek", role: "Facebook review · Aug 2024", content: "Services are top notch... very patient with a good technique", rating: 5 },
  { name: "Skulbaby Mikolo", role: "Facebook review · Aug 2024", content: "Best driving school I've seen", rating: 5 },
];

export const FACEBOOK_PAGE_URL = "https://www.facebook.com/profile.php?id=100063753002842&sk=reviews";
