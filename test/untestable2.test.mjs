import { expect } from "chai";
import { calculateHandValue, diceHandValue, diceRoll } from "../src/untestable2.mjs";

describe("Untestable 2: a dice game", () => {
  it("returns a number", () => {
    expect(diceHandValue()).to.be.a("number");
  });
});

describe("Dice roll", () => {
  const rolls = [];
  for (let i = 0; i < 100; i++) {
    rolls.push(diceRoll())
  }

  it("has a maximum value of 6", () => {
    const max = Math.max(...rolls);
    expect(max).to.equal(6);
  });

  it("has a minimum value of 1", () => {
    const min = Math.min(...rolls);
    expect(min).to.equal(1);
  });
});

describe("Calculations", () => {
  it("calculates pair value", () => {
    expect(calculateHandValue(1, 1)).to.equal(101);
  });

  it("calculates high value", () => {
    expect(calculateHandValue(1, 2)).to.equal(2);
  });  
});