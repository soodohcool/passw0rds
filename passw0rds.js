// Configuration
const config = {
  numPassphrases: 3,
  adjectivesFile: 'adjectives.txt',
  nounsFile: 'nouns.txt',
  verbsFile: 'verbs.txt',
  pluralsFile: 'plural_nouns.txt',
  minLength: 4,
  maxLength: 8,
  maxLeetChars: 2,
  pattern: 'AVNP'
};

/**
 * Validates the configuration settings.
 * @throws {Error} Throws an error if the configuration is invalid.
 */
function validateConfig() {
  if (config.numPassphrases <= 0 || config.maxLength < config.minLength) {
    throw new Error('Must generate at least one passphrase and min length must be less than max length.');
  }
}

/**
 * Sets the default configuration values in the form.
 */
function setDefaultConfig() {
  document.getElementById('numPassphrases').value = 3;
  document.getElementById('minLength').value = 4;
  document.getElementById('maxLength').value = 8;
  document.getElementById('maxLeetChars').value = 2;
  document.getElementById('pattern').value = 'AVNP';
}

/**
 * Updates the global configuration object from form values.
 */
function updateConfig() {
  config.numPassphrasesPassphrases = parseInt(document.getElementById('numPassphrases').value, 10);
  config.minLength = parseInt(document.getElementById('minLength').value, 10);
  config.maxLength = parseInt(document.getElementById('maxLength').value, 10);
  config.maxLeetChars = parseInt(document.getElementById('maxLeetChars').value, 10);
  config.transformation = document.getElementById('transformation').value;
  config.pattern = document.getElementById('pattern').value;
}

/**
 * Generates random passphrase configuration settings and triggers passphrase generation.
 * @param {HTMLTextAreaElement} outputTextArea - The text area where the passphrases will be displayed.
 */
function randomizeConfig(outputTextArea) {
  const transformationElement = document.getElementById('transformation');
  const transformationTypes = ['leet', 'miniLeet', 'plain'];

  const randomTransformation = transformationTypes[Math.floor(Math.random() * transformationTypes.length)];

  const patternOptions = ['A', 'V', 'N', 'P'];
  let patternLength = Math.floor(Math.random() * 4) + 2;
  let randomPattern = '';

  for (let i = 0; i < patternLength; i++) {
    const randomIndex = Math.floor(Math.random() * patternOptions.length);
    randomPattern += patternOptions[randomIndex];
  }

  document.getElementById('numPassphrases').value = Math.floor(Math.random() * 10) + 1;
  document.getElementById('minLength').value = 4;
  document.getElementById('maxLength').value = 99;
  document.getElementById('maxLeetChars').value = randomTransformation === 'plain' ? 0 : Math.floor(Math.random() * 10) + 1;
  document.getElementById('pattern').value = randomPattern;
  transformationElement.value = randomTransformation;

  displayPassphrases(outputTextArea);
}

//-----------------------------------------------------------------------------

/**
 * Gets a random separator character.
 * @returns {string} A random separator character.
 */
function getRandomSeparator() {
  const separators = ['~', '-', '_', '.'];
  return separators[Math.floor(Math.random() * separators.length)];
}

//-----------------------------------------------------------------------------

/**
 * Transforms the given passphrase according to the specified type.
 * @param {string} plainPassphrase - The original passphrase.
 * @param {string} transformationType - The type of transformation ('leet', 'miniLeet', 'plain').
 * @param {number[]} positions - Array of positions eligible for transformation.
 * @param {number} maxLeetChars - Maximum number of leet characters to apply.
 * @returns {string} The transformed passphrase.
 */
function transformation(plainPassphrase, transformationType, positions, maxLeetChars) {
  switch (transformationType) {
    case 'leet':
      return leet(plainPassphrase, positions, maxLeetChars);
    case 'miniLeet':
      return miniLeet(plainPassphrase, positions, maxLeetChars);
    case 'plain':
    default:
      return plainPassphrase;
  }
}

/**
 * Transforms the given phrase to Leet Speak.
 * @param {string} phrase - The original phrase.
 * @param {number[]} positions - Array of positions eligible for transformation.
 * @param {number} maxLeetChars - Maximum number of leet characters to apply.
 * @returns {string} The transformed phrase.
 */
function leet(phrase, positions, maxLeetChars) {
  const leetMap = { 'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '$', 't': '7' };
  let phraseArray = Array.from(phrase);
  let leetApplied = false;

  // Shuffle and select the first `maxLeetChars` positions
  let shuffledPositions = positions.sort(() => 0.5 - Math.random());

  // Ensure at least one leet character is applied
  while (!leetApplied) {
    for (const pos of shuffledPositions.slice(0, maxLeetChars)) {
      const char = phraseArray[pos];
      if (leetMap[char]) {
        phraseArray[pos] = leetMap[char];
        leetApplied = true;
      }
    }

    // Reshuffle positions if no leet character was applied
    if (!leetApplied) {
      shuffledPositions = positions.sort(() => 0.5 - Math.random());
    }
  }

  return phraseArray.join('');
}

/**
 * Transforms the given word to Mini Leet Speak.
 * @param {string} word - The original word.
 * @param {number[]} positions - Array of positions eligible for transformation.
 * @param {number} maxLeetChars - Maximum number of leet characters to apply.
 * @returns {string} The transformed word.
 */
function miniLeet(word, positions, maxLeetChars) {
  const miniLeetMap = { 'a': '4', 'e': '3', 'i': '1', 'o': '0' };
  let wordArray = Array.from(word);
  let leetApplied = false;

  // Shuffle and select the first `maxLeetChars` positions
  let shuffledPositions = positions.sort(() => 0.5 - Math.random());

  // Ensure at least one leet character is applied
  while (!leetApplied) {
    for (const pos of shuffledPositions.slice(0, maxLeetChars)) {
      const char = wordArray[pos];
      if (miniLeetMap[char]) {
        wordArray[pos] = miniLeetMap[char];
        leetApplied = true;
      }
    }

    // Reshuffle positions if no leet character was applied
    if (!leetApplied) {
      shuffledPositions = positions.sort(() => 0.5 - Math.random());
    }
  }

  return wordArray.join('');
}

//-----------------------------------------------------------------------------

/**
 * Generates a list of words from a given file.
 * @param {string} filename - The name of the file containing words.
 * @returns {string[]} An array of words.
 */
function generateWordList(filename) {
  const content = fetch(`./${filename}`);
  return content.split('\n').filter(word => word.length >= config.minLength && word.length <= config.maxLength);
}

/**
 * Fetches a list of words from a given file.
 * @param {string} filename - The name of the file containing words.
 * @returns {Promise<string[]>} A promise that resolves to an array of words.
 */
async function fetchWordList(filename) {
  const response = await fetch(`./${filename}`);
  const text = await response.text();
  return text.split('\n').filter(word => word.length >= config.minLength && word.length <= config.maxLength);
}

//-----------------------------------------------------------------------------

/**
 * Generates a single passphrase.
 * @param {string[]} adjectives - List of adjectives.
 * @param {string[]} nouns - List of nouns.
 * @param {string[]} verbs - List of verbs.
 * @param {string[]} plurals - List of plural nouns.
 * @returns {string} A generated passphrase.
 */
function generatePassphrase(adjectives, nouns, verbs, plurals) {
  const wordMap = {
    'A': [...adjectives],
    'V': [...verbs],
    'N': [...nouns],
    'P': [...plurals]
  };

  const separator = getRandomSeparator();
  const plainPassphraseArray = Array.from(config.pattern).map(char => {
    if (wordMap[char] && wordMap[char].length > 0) {
      const index = Math.floor(Math.random() * wordMap[char].length);
      const word = wordMap[char][index];
      wordMap[char].splice(index, 1); // Remove the selected word
      return word;
    }
    return char;
  });

  const plainPassphrase = plainPassphraseArray.join(separator);

  // Identify positions that are eligible for leet transformation
  let leetEligiblePositions = [];
  for (let i = 0; i < plainPassphrase.length; i++) {
    if ('aeiost'.includes(plainPassphrase[i])) {
      leetEligiblePositions.push(i);
    }
  }

  return transformation(plainPassphrase, config.transformation, leetEligiblePositions, config.maxLeetChars);
}

/**
 * Handles the passphrase generation logic and displays the result.
 * @param {HTMLTextAreaElement} outputTextArea - The text area where the passphrases will be displayed.
 */
async function displayPassphrases(outputTextArea) {
  updateConfig();
  outputTextArea.value = '';

  const passphrases = await passphrase();
  if (passphrases) {
    outputTextArea.value = passphrases.join('\n');
  }
}

/**
 * Main passphrase generation logic.
 * @returns {Promise<string[]>} A promise that resolves to an array of generated passphrases.
 */
async function passphrase() {
  try {
    validateConfig();

    // Fetch and generate word lists
    const [adjectives, nouns, verbs, plurals] = await Promise.all([
      fetchWordList(config.adjectivesFile),
      fetchWordList(config.nounsFile),
      fetchWordList(config.verbsFile),
      fetchWordList(config.pluralsFile)
    ]);
    const passphrases = [];
    for (let i = 0; i < config.numPassphrasesPassphrases; i++) {
      const newPassphrase = generatePassphrase(adjectives, nouns, verbs, plurals);
      passphrases.push(newPassphrase);
    }
    return passphrases;
  } catch (error) {
    console.error(error);
  }
}

//-----------------------------------------------------------------------------

/**
 * Event handlers
 */
document.getElementById("generate").addEventListener("click", async function () {
  const outputTextArea = document.getElementById('outputTextArea');
  displayPassphrases(outputTextArea);
});

document.getElementById('randomize').addEventListener('click', function () {
  const outputTextArea = document.getElementById('outputTextArea');
  randomizeConfig(outputTextArea);
});

document.getElementById('default').addEventListener('click', function () {
  const outputTextArea = document.getElementById('outputTextArea');
  setDefaultConfig();
  displayPassphrases(outputTextArea);
});

document.getElementById('transformation').addEventListener('change', function () {
  const maxLeet = document.getElementById('maxLeetChars');
  const transformationValue = this.value; // or event.target.value

  if (transformationValue === 'plain') {
    maxLeet.value = 0;
  } else if (transformationValue !== 'plain' && maxLeet.value === '0') { // note the value is a string
    maxLeet.value = 2;
  }
});