/*
The original code has following features, which make it harder to test:
- It uses the current time in the new Date() command, making tests dependend on the time they are called
- It does everything in a single function, which makes the subparts difficult to test individually.
-- In particular for a person who doesn't work regularly with Date objects, it is hard to establish intuitively
   that everything works as it should
- The naming could be improved to make the steps easier to understand and testable
-- In particular, the calculation of days from milliseconds in the return statement can
   be considered as a separate subproblem. Giving this result a name would clarify the structure.
*/

const millisPerDay = 24 * 60 * 60 * 1000;

// export function daysUntilChristmas() {
//   const now = new Date();
//   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   const christmasDay = new Date(now.getFullYear(), 12 - 1, 25);
//   if (today.getTime() > christmasDay.getTime()) {
//     christmasDay.setFullYear(new Date().getFullYear() + 1);
//   }
//   const diffMillis = christmasDay.getTime() - today.getTime();
//   return Math.floor(diffMillis / millisPerDay);
// }

export function daysUntilChristmas() {
  const now = new Date();
  return daysToChristmasFromDate(now);
}
  

export function daysToChristmasFromDate(time) {
  const date = new Date(time.getFullYear(), time.getMonth(), time.getDate());
  const christmasDay = determineNextChristmasDay(date);
  const days = calculateDifferenceInDays(date, christmasDay);
  return days;
}

export function determineNextChristmasDay(date) {
  const christmasDay = new Date(date.getFullYear(), 12 - 1, 25);
  if (date.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(date.getFullYear() + 1);
  }
  return christmasDay;
}

export function calculateDifferenceInDays(earlierDate, laterDate) {
  const diffMillis = laterDate.getTime() - earlierDate.getTime();
  const diffDays = Math.floor(diffMillis / millisPerDay);
  return diffDays;
}


