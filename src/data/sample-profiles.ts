export interface SampleProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Woman' | 'Man' | 'Non-binary';
  image: any;
  profession: string;
  distanceKm: number;
  isVerified: boolean;
  bio: string;
  interests: string[];
}

export const INITIAL_SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'p1',
    name: 'Anna',
    age: 25,
    gender: 'Woman',
    image: require('@/assets/images/profile-1.png'),
    profession: 'Freelance Designer',
    distanceKm: 1,
    isVerified: true,
    bio: 'Art lover, coffee enthusiast & looking for someone to explore hidden spots with ✨',
    interests: ['Art and design', 'Travel', 'Photography', 'Food and dining'],
  },
  {
    id: 'p2',
    name: 'Marcus',
    age: 28,
    gender: 'Man',
    image: require('@/assets/images/profile-2.png'),
    profession: 'Landscape Photographer',
    distanceKm: 4,
    isVerified: true,
    bio: 'Golden hour chaser 📷. Love hiking mountain trails and listening to vinyl records on rainy Sundays.',
    interests: ['Photography', 'Nature and outdoors', 'Music', 'Fitness'],
  },
  {
    id: 'p3',
    name: 'Elena',
    age: 23,
    gender: 'Woman',
    image: require('@/assets/images/profile-3.png'),
    profession: 'Medical Student',
    distanceKm: 7,
    isVerified: true,
    bio: 'Aspiring neurologist who knows the best taco trucks in the city 🌮. Passionate about indie films and salsa dancing.',
    interests: ['Dancing', 'Movies and TV', 'Reading', 'Cooking'],
  },
  {
    id: 'p4',
    name: 'Liam',
    age: 30,
    gender: 'Man',
    image: require('@/assets/images/profile-4.png'),
    profession: 'Software Engineer',
    distanceKm: 12,
    isVerified: false,
    bio: 'Building things, rock climbing, and constantly searching for the city’s best ramen broth 🍜.',
    interests: ['Technology', 'Gaming', 'Fitness', 'Sports'],
  },
  {
    id: 'p5',
    name: 'Sophia',
    age: 26,
    gender: 'Woman',
    image: require('@/assets/images/profile-5.png'),
    profession: 'Yoga Instructor',
    distanceKm: 18,
    isVerified: true,
    bio: 'Mindfulness, matcha lattes, and golden retriever energy 🐾. Let’s do sunrise yoga or grab gelato.',
    interests: ['Fitness', 'Animals and pets', 'Nature and outdoors', 'Travel'],
  },
  {
    id: 'p6',
    name: 'Kai',
    age: 27,
    gender: 'Non-binary',
    image: require('@/assets/images/profile-6.png'),
    profession: 'Architectural Designer',
    distanceKm: 24,
    isVerified: true,
    bio: 'Modernist lines, urban sketches, and live jazz nights 🎷. Always down to swap book recommendations.',
    interests: ['Art and design', 'Music', 'Reading', 'Fashion'],
  },
];

