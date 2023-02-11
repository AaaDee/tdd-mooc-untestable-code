import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

/*
Here the main challenge is provided by the dependency on an external csv file.
While it is possible to test the entire workflow using a test file, a 
better strategy is to extract the logic for creating a person object
to separate and testable functions.

It is also not ideal for testing purposes that every test would
run using the async/await structure, so it's better to limit
the asynchronous part to the actual reading of the file only.
*/

// export async function parsePeopleCsv(filePath) {
//   const csvData = await readFile(filePath, { encoding: "utf8" });
//   const records = parse(csvData, {
//     skip_empty_lines: true,
//     trim: true,
//   });
//   return records.map(([firstName, lastName, age, gender]) => {
//     const person = {
//       firstName,
//       lastName,
//       gender: gender.charAt(0).toLowerCase(),
//     };
//     if (age !== "") {
//       person.age = parseInt(age);
//     }
//     return person;
//   });
// }

export async function parsePeopleCsv(filePath) {
  const csvData = await readCsvFromPath(filePath);
  const records = parseRecordsFromCsv(csvData);
  const persons = createPersonObjects(records);
  return persons;
}

export async function readCsvFromPath(filePath) {
  return await readFile(filePath, { encoding: "utf8" });
}

export function parseRecordsFromCsv(csvData) {
  const records = parse(csvData, {
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}

export function createPersonObjects(records) {
  return records.map(([firstName, lastName, age, gender]) => {
    return createPerson(firstName, lastName, age, gender);
  });
}

export function createPerson(firstName, lastName, age, gender) {
  let person = {
    firstName,
    lastName,
    gender: getGender(gender),
  };
  
  person = setAge(person, age)
  
  return person;
}

function getGender(gender) {
  return gender.charAt(0).toLowerCase()
}

function setAge(person, age) {
  if (age === "") return person;
  return {
    ...person,
    age: parseInt(age)
  }
}
