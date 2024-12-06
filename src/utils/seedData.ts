import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const initialLessons = [
  {
    title: "Basic Greetings",
    description: "Learn essential greetings and introductions",
    content: "Hello = Hola\nGoodbye = Adiós\nGood morning = Buenos días\nGood afternoon = Buenas tardes\nGood night = Buenas noches",
    level: "beginner",
    duration: 15
  },
  {
    title: "Numbers 1-20",
    description: "Master counting and basic numbers",
    content: "1 = uno\n2 = dos\n3 = tres\n4 = cuatro\n5 = cinco\n...",
    level: "beginner",
    duration: 20
  },
  {
    title: "Common Phrases",
    description: "Essential phrases for daily conversations",
    content: "Please = Por favor\nThank you = Gracias\nYou're welcome = De nada\nExcuse me = Perdón",
    level: "beginner",
    duration: 25
  },
  {
    title: "Present Tense Verbs",
    description: "Learn regular verb conjugations",
    content: "to speak = hablar\nto eat = comer\nto live = vivir",
    level: "intermediate",
    duration: 30
  },
  {
    title: "Advanced Conversation",
    description: "Complex dialogue scenarios",
    content: "Practice advanced conversation patterns and idioms",
    level: "advanced",
    duration: 45
  }
];

export async function seedLessons() {
  try {
    for (const lesson of initialLessons) {
      await addDoc(collection(db, 'lessons'), lesson);
    }
    console.log('Lessons seeded successfully');
  } catch (error) {
    console.error('Error seeding lessons:', error);
  }
}