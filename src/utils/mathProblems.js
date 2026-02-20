function rand(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr){
  return arr[rand(0, arr.length - 1)];
}

export function generateProblem(difficulty){
  const diff = difficulty || "medium";

  // ranges by difficulty
  const ranges = {
    easy:   { addSub: 20, mul: 10, divQ: 10 },
    medium: { addSub: 50, mul: 12, divQ: 12 },
    hard:   { addSub: 100, mul: 15, divQ: 15 }
  };

  const r = ranges[diff] || ranges.medium;

  const op = pick(["+", "-", "×", "÷"]);

  let a = 0, b = 0, ans = 0;

  if(op === "+"){
    a = rand(0, r.addSub);
    b = rand(0, r.addSub);
    ans = a + b;
  }

  if(op === "-"){
    a = rand(0, r.addSub);
    b = rand(0, r.addSub);
    if(b > a) [a,b] = [b,a]; // avoid negatives
    ans = a - b;
  }

  if(op === "×"){
    a = rand(0, r.mul);
    b = rand(0, r.mul);
    ans = a * b;
  }

  if(op === "÷"){
    // integer-only division: a ÷ b = q
    b = rand(1, r.mul);
    const q = rand(0, r.divQ);
    a = b * q;
    ans = q;
  }

  return {
    text: `${a} ${op} ${b} = ?`,
    answer: ans
  };
}
