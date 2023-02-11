/*
  Here the main source difficulty in testing is the randomness from the dice rolls.
  The main testing challenge is that the calculation of the score is done in the
  same function as the rolls, making it difficult to test the scoring logic independently
*/

// function diceRoll() {
//   const min = 1;
//   const max = 6;
//   return Math.floor(Math.random() * (max + 1 - min) + min);
// }

// export function diceHandValue() {
//   const die1 = diceRoll();
//   const die2 = diceRoll();
//   if (die1 === die2) {
//     // one pair
//     return 100 + die1;
//   } else {
//     // high die
//     return Math.max(die1, die2);
//   }
// }

export function diceRoll() {
  const min = 1;
  const max = 6;
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function diceHandValue() {
  const die1 = diceRoll();
  const die2 = diceRoll();
  return calculateHandValue(die1, die2);
}

export function calculateHandValue(die1, die2) {
  if (die1 === die2) {
    return calculatePairValue(die1)
  } else {
    return calculateHighValue(die1, die2)
  }
}

function calculatePairValue(die1) {
  return 100 + die1;
}

function calculateHighValue(die1, die2) {
  return Math.max(die1, die2);
}
