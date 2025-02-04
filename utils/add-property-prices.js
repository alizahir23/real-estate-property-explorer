const fs = require("fs");

// Read the JSON file
const properties = require("/Users/alizahir/Documents/Web Development/Projects/coding_challenge/public/properties.json");

// Function to generate random price between 1M and 10M, rounded to thousands
function generateRandomPrice() {
  const min = 1000000;
  const max = 10000000;
  const randomPrice = Math.floor(Math.random() * (max - min + 1) + min);
  // Round to nearest thousand
  return Math.round(randomPrice / 1000) * 1000;
}

// Add price field to each property
const updatedProperties = properties.map((property) => ({
  ...property,
  price: generateRandomPrice(),
}));

// Write the updated data back to the file
fs.writeFileSync(
  "./property.json",
  JSON.stringify(updatedProperties, null, 2),
  "utf8"
);

console.log("Successfully added random prices to properties");
