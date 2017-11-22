const assert = (fx, name) => fx() ? console.log(`${name} works`) : console.log(`${name} broken`);

function one() { return 1; }
function two() { return 2; }
function add(a,b) { return a + b; }
function add2(fa,fb) { return add(fa(), fb()); }
assert(() => add2(one, two) === 3, 'add2')

function addnRecursive(fxa = []) {
  if (fxa.length >= 2) {
    return add2(fxa[0], fxa[1]) + addnRecursive(fxa.slice(2))
  }

  if (fxa.length === 1) {
    return add2(() => 0, fxa[0]);
  }

  return 0;
}

assert(() => addnRecursive([one, two, () => 3, () => 4]) === 10, 'addnRecursive')

function addnLoop(fxa = []) {
  let sum = 0;

  const zero = () => 0;
  for (let i = 0; i < fxa.length; i = i + 2) {
    const fa = fxa[i] || zero;
    const fb = fxa[i + 1] || zero;
    sum = sum + add2(fa, fb);
  }

  return sum;
}

assert(() => addnLoop([one, two, () => 3, () => 4]) === 10, 'addnLoop')

function addnInternal(fxa = []) {
  const groupedInTwos = fxa.reduce((acc, curr) => {
    if (acc[0].length < 2) {
      acc[0].push(curr);
    } else {
      acc.unshift([curr])
    }

    return acc;
  }, [[]]);


  return groupedInTwos.reduce((acc, curr) => {
    const val = (curr.length === 2)
      ? add2(curr[0], curr[1])
      : 0;

    return val + acc;
  }, 0)
}


assert(() => addnInternal([one, two, () => 3, () => 4]) === 10, 'addnInternal')



