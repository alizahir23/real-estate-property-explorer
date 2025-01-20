const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const propertiesFilePath =
  "/Users/alizahir/Documents/Web Development/Projects/coding_challenge/data/properties.json";
const propertiesData = JSON.parse(fs.readFileSync(propertiesFilePath, "utf8"));
// Add an id field to each object based on its index
const propertiesWithIds = propertiesData.map((property, index) => ({
  ...property,
  id: index + 1, // Adding 1 to start IDs from 1 instead of 0
}));

fs.writeFileSync(
  propertiesFilePath,
  JSON.stringify(propertiesWithIds, null, 2)
);

console.log("Unique IDs have been added to properties.json");
