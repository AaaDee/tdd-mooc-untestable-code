import { expect } from "chai";
import { parseRecordsFromCsv, readCsvFromPath, createPerson, createPersonObjects } from "../src/untestable3.mjs";
import fs from 'fs-extra';

// example input:
// Loid,Forger,,Male
// Anya,Forger,6,Female
// Yor,Forger,27,Female

describe("File read", () => {
  const file = `${process.cwd()}/test/test.csv`
  
  it("reads a file", async () => {
    const input = "Hello!"
    await fs.outputFile(file, input)
    const content = await readCsvFromPath(file)
    expect(content).to.equal(input);
  });

  afterEach(() => {
    fs.remove(file)
  });
});

describe("Parse csv", () => {
  const input = "Loid,Forger,,Male\nAnya,Forger,6,Female\nYor,Forger,27,Female"

  
  it("returns correct number of records", () => {
    const records = parseRecordsFromCsv(input);
    expect(records.length).to.equal(3);
  });

  it("rows are parsed to correct number of entries", () => {
    const records = parseRecordsFromCsv(input);
    expect(records[0].length).to.equal(4);
  });

  it("removes empty lines", () => {
    const appendedInput = input + "\n\n";
    const records = parseRecordsFromCsv(appendedInput);
    expect(records.length).to.equal(3);
  });
});

describe("Create single person object", () => {

  it("returns correctly a person with four fields", () => {
    const input = ["Anya","Forger","6","Female"]

    const expectedPerson = {
      firstName: "Anya",
      lastName: "Forger",
      age: 6,
      gender: "f"
    }

    const person =  createPerson(...input);

    expect(person).to.deep.equal(expectedPerson);
  });

  it("clears age when no value provided", () => {
    const input = ["Anya","Forger","","Female"]

    const expectedPerson = {
      firstName: "Anya",
      lastName: "Forger",
      gender: "f"
    }

    const person =  createPerson(...input);

    expect(person).to.deep.equal(expectedPerson);
  });
});

describe("Create persons", () => {
  const input = "Loid,Forger,,Male\nAnya,Forger,6,Female\nYor,Forger,27,Female"
  const records = parseRecordsFromCsv(input);
  const persons = createPersonObjects(records);

  it("returns right number of persons", () => {
    expect(persons.length).equal(3);
  });
});