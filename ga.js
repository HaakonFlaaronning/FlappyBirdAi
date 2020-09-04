
var genMax;
var scores = [];

// Create the next generation
function nextGeneration() {
  genMax = 0;
  normalizeFitness(savedBirds);
  birds = generate(savedBirds);
  birds[0] = pickBestBird(savedBirds);
  birds[0].bestBird = true;
  savedBirds = [];
}

// Generate a new population of birds
function generate(oldBirds) {
  let newBirds = [];
  for (let i = 1; i < oldBirds.length; i++) {
    // Select a bird based on fitness
    let bird = poolSelection(oldBirds);
    bird.mutateBrain();
    newBirds[i] = bird;
  }
  return newBirds;
}

// Normalize the fitness of all birds
function normalizeFitness(birds) {
  scores = [];
  // Increase probability of picking one of the best birds
  for (let i = 0; i < birds.length; i++) {
    scores.push(birds[i].score);
    birds[i].score = pow(birds[i].score, 2);
  }
  genMax = Math.max.apply(null, scores);

  let sum = 0;
  for (let i = 0; i < birds.length; i++) {
    sum += birds[i].score;
  }
  // Divide by sum to get fitness between 0 and 1
  for (let i = 0; i < birds.length; i++) {
    birds[i].fitness = birds[i].score / sum;
  }
}

function getGenMax() {
  return genMax;
}


// Pick a parent based on fitness probability
function poolSelection(birds) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  while (r > 0) {
    r -= birds[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one to get the right bird
  index -= 1;

  // Make a copy of the bird. This also mutates the birds brain
  return birds[index].copy();
}


function pickBestBird(oldBirds) {
  let temp = genMax;
  index = oldBirds.findIndex(x => x.score === pow(temp,2));
  return oldBirds[index].copy();
}
