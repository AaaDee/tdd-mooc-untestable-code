import { expect } from "chai";
import { calculateDifferenceInDays, daysToChristmasFromDate, daysUntilChristmas, determineNextChristmasDay } from "../src/untestable1.mjs";

describe("Untestable 1: days until Christmas", () => {
  it("returns a number", () => {
    expect(daysUntilChristmas()).to.be.a("number");
  });
});

describe("Calculating days", () => {
  it("counts correctly when day in year before Christmas", () => {
    const date = new Date(2000, 12-1, 24);
    expect(daysToChristmasFromDate(date)).to.equal(1);
  });

  it("counts correctly when day in year after Christmas", () => {
    const date = new Date(2000, 12-1, 26);
    expect(daysToChristmasFromDate(date)).to.equal(364);
  });
});

describe("Determining next Christmas day ", () => {
  it("Determines year when date before Christmas correctly", () => {
    const date = new Date(2000, 12-1, 24);
    const christmasDay = determineNextChristmasDay(date);
    expect(christmasDay.getFullYear()).to.equal(2000);
  });

  it("Determines month when date before Christmas correctly", () => {
    const date = new Date(2000, 12-1, 24);
    const christmasDay = determineNextChristmasDay(date);
    const month = christmasDay.toLocaleString('en-US', { month: 'short' });
    expect(month).to.equal('Dec');
  });

  it("Determines day when date before Christmas correctly", () => {
    const date = new Date(2000, 12-1, 24);
    const christmasDay = determineNextChristmasDay(date);
    expect(christmasDay.getDate()).to.equal(25);
  });

  it("Determines year when date after Christmas correctly", () => {
    const date = new Date(2000, 12-1, 26);
    const christmasDay = determineNextChristmasDay(date);
    expect(christmasDay.getFullYear()).to.equal(2001);
  });
});

describe("Day difference calculations", () => {
  it("calculates differences correctly", () => {
    const date1 = new Date(2000, 12-1, 24);
    const date2 = new Date(2000, 12-1, 25);
    const diff = calculateDifferenceInDays(date1, date2);

    expect(diff).to.equal(1);
  });
});