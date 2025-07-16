"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase"; // Adjust the import path as needed
import { collection, addDoc, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Install with `npm install uuid`

// Function to generate mock recipient data
const generateMockRecipients = () => {
  const recipients = new Set(); // Use Set to ensure uniqueness
  const nameCategories = {
    people: {
      firstNames: [
        "James",
        "Emily",
        "Michael",
        "Sophia",
        "William",
        "Olivia",
        "Alexander",
        "Charlotte",
        "Daniel",
        "Amelia",
      ],
      lastNames: [
        "Smith",
        "Johnson",
        "Brown",
        "Taylor",
        "Wilson",
        "Davis",
        "Clark",
        "Lewis",
        "Walker",
        "Harris",
      ],
    },
    charities: [
      "American Red Cross",
      "Oxfam GB",
      "Save the Children USA",
      "Médecins Sans Frontières (Doctors Without Borders)",
      "St. Jude Children's Research Hospital",
    ],
    institutions: [
      "Harvard University",
      "University of Oxford",
      "Stanford University",
      "University College London",
      "Massachusetts General Hospital",
      "Charité - Universitätsmedizin Berlin",
      "Yale University",
      "Sorbonne University",
      "Johns Hopkins Hospital",
      "University of Cambridge",
    ],
  };

  const getRandomName = (category: keyof typeof nameCategories) => {
    if (category === "people") {
      const { firstNames, lastNames } = nameCategories.people;
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }
    return nameCategories[category][
      Math.floor(Math.random() * nameCategories[category].length)
    ];
  };

  const getRandomAccountNumber = () =>
    Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit number
  const getRandomIdNumber = () =>
    Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit number

  while (recipients.size < 100) {
    const category =
      Math.random() < 0.5
        ? "people"
        : Math.random() < 0.75
          ? "charities"
          : "institutions";
    const name = getRandomName(category as keyof typeof nameCategories);
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

  console.log("100 unique recipients added to Firestore.");
};

// Component to trigger the data insertion
export default function PopulateRecipients() {
  useEffect(() => {
    // Check if data has already been added to avoid duplicates
    const checkAndAddRecipients = async () => {
      const recipientsCollection = collection(db, "recipients");
      const snapshot = await getDocs(recipientsCollection);
      if (snapshot.size === 0) {
        await addRecipientsToFirestore();
      } else {
        console.log("Recipients already exist in Firestore.");
      }
    };

    checkAndAddRecipients();
  }, []); // Empty dependency array runs once on mount

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold">Populating Recipients...</h1>
      <p>Check the console for confirmation after page load.</p>
    </div>
  );
}
