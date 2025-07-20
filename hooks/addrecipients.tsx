"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Adjust the import path as needed
import { collection, addDoc, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Install with `npm install uuid`

// List of provided names for people
const providedNames = [
  "Jacob Thompson",
  "Mia Rodriguez",
  "Leon Schulz",
  "Avery Bennett",
  "Takashi Yamada",
  "Valentina Morales",
  "Sophie Wagner",
  "Lucas Harris",
  "Sakura Inoue",
  "Ella Foster",
  "Felix Neumann",
  "Camila Fernandez",
  "Nathan Carter",
  "Emma Klein",
  "Mateo Castillo",
  "Isabella Reed",
  "Kenta Hashimoto",
  "Zoey Coleman",
  "Jonas Hoffmann",
  "Santiago Ortiz",
  "Harper Evans",
  "Lena Becker",
  "Caleb Morgan",
  "Hina Saito",
  "Diego Vargas",
  "Lily Peterson",
  "Maximilian Fischer",
  "Aria Sullivan",
  "Riku Watanabe",
  "Luna Ramirez",
  "Elijah Murphy",
  "Clara Meyer",
  "Mason Brooks",
  "Mio Nakamura",
  "Julian Alvarez",
  "Chloe Hayes",
  "Niklas Schmidt",
  "Scarlett Gordon",
  "Anna Weber",
  "Alejandro Gomez",
  "Owen Russell",
  "Yui Kobayashi",
  "Evelyn Price",
  "Paul Richter",
  "Sofia Torres",
  "Gabriel Ward",
  "Aoi Fujimoto",
  "Amelia Cox",
  "Thomas Braun",
  "Lucas Diaz",
  "Layla Simmons",
  "Marie Schulz",
  "Asuka Mori",
  "Logan Fisher",
  "Klara Wagner",
  "Isabel Mendoza",
  "Carter Powell",
  "Ren Takahashi",
  "Grace Perry",
  "Finn Hoffmann",
  "Javier Castro",
  "Ava Stewart",
  "Julia Neumann",
  "Hana Yamamoto",
  "Wyatt Jenkins",
  "Laura Fischer",
  "Gabriela Rojas",
  "Hudson Gray",
  "Elisa Klein",
  "Kaito Suzuki",
  "Lila Hunter",
  "Moritz Weber",
  "Natalia Lopez",
  "Nolan Bryant",
  "Sophie Meyer",
  "Sora Ito",
  "Zoe Freeman",
  "Lukas Schneider",
  "Diego Jimenez",
  "Madeline Ellis",
  "Katharina Becker",
  "Yuma Hayashi",
  "Emiliano Rivera",
  "Piper Walsh",
  "Ben Wagner",
  "Ellie Dunn",
  "Emilia Hoffmann",
  "Riku Sato",
  "Victoria Perez",
  "Miles Tucker",
  "Lisa Schmidt",
  "Kaori Aoki",
  "Elena Gonzalez",
  "Grayson Knight",
  "Timo Fischer",
  "Camila Morales",
  "Violet Webb",
  "Leon Braun",
];

// Function to generate mock recipient data
const generateMockRecipients = () => {
  const recipients = new Set(); // Use Set to store recipient objects
  const usedNames = new Set(); // Track used names to ensure uniqueness
  const nameCategories = {
    people: providedNames,
    charities: [
      "American Red Cross",
      "Oxfam GB",
      "Save the Children USA",
      "Médecins Sans Frontières (Doctors Without Borders)",
      "St. Jude Children's Research Hospital",
    ],
    institutions: [
      "Loyola University Chicago",
      "University of Warwick",
      "Santa Clara University",
      "King's College London",
      "Rush University Medical Center",
      "Hannover Medical School",
      "Fairfield University",
      "University of Strasbourg",
      "Mayo Clinic Hospital, Rochester",
      "Durham University",
    ],
  };

  const getRandomName = (category: keyof typeof nameCategories) => {
    const availableNames = nameCategories[category].filter(
      (name) => !usedNames.has(name)
    );
    if (availableNames.length === 0) {
      return null; // No more unique names available in this category
    }
    const name =
      availableNames[Math.floor(Math.random() * availableNames.length)];
    usedNames.add(name); // Mark name as used
    return name;
  };

  const getRandomAccountNumber = () =>
    Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit number
  const getRandomIdNumber = () =>
    Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit number

  while (recipients.size < 35) {
    const category =
      Math.random() < 0.5
        ? "people"
        : Math.random() < 0.75
          ? "charities"
          : "institutions";
    const name = getRandomName(category as keyof typeof nameCategories);
    if (!name) continue; // Skip if no unique names are available in the category
    const id = uuidv4().replace(/-/g, "-"); // Unique ID with hyphens
    const accountNumber = getRandomAccountNumber();
    const idNumber = getRandomIdNumber();

    // Ensure uniqueness by checking the combination of name and id
    const recipientKey = `${name}-${id}`;
    if (!recipients.has(recipientKey)) {
      recipients.add({
        accountNumber,
        id,
        idNumber,
        name,
      });
    }
  }

  return Array.from(recipients);
};

// Function to add recipients to Firestore
const addRecipientsToFirestore = async () => {
  const recipients = generateMockRecipients();
  const recipientsCollection = collection(db, "recipients");

  for (const recipient of recipients) {
    await addDoc(recipientsCollection, recipient);
  }

  console.log("35 unique recipients added to Firestore.");
};

// Component to trigger the data insertion
export default function PopulateRecipients() {
  const [loading, setLoading] = useState(false);
  // Check if data has already been added to avoid duplicates
  const checkAndAddRecipients = async () => {
    setLoading(true);
    const recipientsCollection = collection(db, "recipients");
    const snapshot = await getDocs(recipientsCollection);
    if (snapshot.size === 0) {
      await addRecipientsToFirestore();
    } else {
      console.log("Recipients already exist in Firestore.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 text-white">
      <button
        onClick={checkAndAddRecipients}
        className="font-montserrat border-2 border-red-600 px-4 py-2 rounded-lg"
      >
        {loading ? "generating..." : "Generate Recipients"}
      </button>
    </div>
  );
}
