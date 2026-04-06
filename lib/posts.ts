export const posts = [
  {
    id: "1",
    category: "Gear Review",
    title: "First Impressions: Cloudstratus 3 for Long Runs",
    excerpt: "Are these the ultimate long-distance cruisers? We put them to the test over 100 miles.",
    content: "The Cloudstratus 3 is a highly cushioned, supportive shoe designed for long distances. After putting over 100 miles on them, here are my thoughts...\n\nThey offer a great balance of cushioning and responsiveness, making them ideal for those long Sunday runs. The upper is breathable, and the fit is true to size. However, they might feel a bit heavy for speed work.",
    image: "https://picsum.photos/seed/runningshoes/1200/600",
    readTime: "5 min read",
    color: "bg-blue-100 text-blue-700",
    date: "April 5, 2026"
  },
  {
    id: "2",
    category: "Training & Strength",
    title: "5 Essential Glute Exercises for Pain-Free Knees",
    excerpt: "Weak glutes are the #1 cause of runner's knee. Here is a 15-minute routine to bulletproof your legs.",
    content: "Runner's knee is a common ailment, but it's often preventable with the right strength training. The glutes play a crucial role in stabilizing the knee joint.\n\nHere are 5 exercises you should incorporate into your routine:\n1. Glute Bridges\n2. Clamshells\n3. Single-Leg Deadlifts\n4. Lateral Band Walks\n5. Bulgarian Split Squats",
    image: "https://picsum.photos/seed/strength/1200/600",
    readTime: "8 min read",
    color: "bg-green-100 text-green-700",
    date: "April 2, 2026"
  },
];

export function getPostById(id: string) {
  return posts.find(post => post.id === id);
}
