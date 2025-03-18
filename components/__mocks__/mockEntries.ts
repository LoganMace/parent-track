const MOCK_ENTRIES = [
  {
    date: new Date("2024-03-20"),
    type: "Favorite",
    category: "Color",
    answer:
      "Deep ocean blue - it reminds me of diving in the Great Barrier Reef",
    profileId: "1", // Assuming a profile ID exists
  },
  {
    date: new Date("2024-02-14"),
    type: "Measurement",
    measurement: "Height",
    value: 120,
    unit: "cm",
    profileId: "1",
  },
  {
    date: new Date("2023-12-25"),
    type: "Memory",
    title: "Christmas Celebration",
    description: "Had a wonderful time with family and friends.",
    profileId: "1",
  },
  {
    date: new Date("2023-10-31"),
    type: "Journal",
    title: "Halloween Fun",
    content: "Dressed up as a superhero and went trick-or-treating.",
    profileId: "1",
  },
  {
    date: new Date("2023-08-15"),
    type: "Milestone",
    category: "First Day of School",
    description: "Started kindergarten today!",
    profileId: "1",
  },
  {
    date: new Date("2023-07-04"),
    type: "Favorite",
    category: "Food",
    answer: "Homemade lasagna with my grandmother's secret recipe",
    profileId: "1",
  },
  {
    date: new Date("2023-05-01"),
    type: "Measurement",
    measurement: "Weight",
    value: 25,
    unit: "kg",
    profileId: "1",
  },
  {
    date: new Date("2023-03-15"),
    type: "Memory",
    title: "Family Vacation",
    description: "Went to the beach and built sandcastles.",
    profileId: "1",
  },
];

export default MOCK_ENTRIES;
