// Configuration
const config = {
  numPassphrases: 3,
  adjectivesFile: 'adjectives.txt',
  nounsFile: 'nouns.txt',
  verbsFile: 'verbs.txt',
  pluralsFile: 'plural_nouns.txt',
  minLength: 4,
  maxLength: 8,
  minLeetChars: 1,
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
  document.getElementById('minLeetChars').value = 1;
  document.getElementById('maxLeetChars').value = 2;
  document.getElementById('minLeetCharsValue').textContent = 1;
  document.getElementById('maxLeetCharsValue').textContent = 2;
  document.getElementById('pattern').value = 'AVNP';
}

/**
 * Updates the global configuration object from form values.
 */
function updateConfig() {
  config.numPassphrasesPassphrases = parseInt(document.getElementById('numPassphrases').value, 10);
  config.minLength = parseInt(document.getElementById('minLength').value, 10);
  config.maxLength = parseInt(document.getElementById('maxLength').value, 10);
  config.minLeetChars = parseInt(document.getElementById('minLeetChars').value, 10);
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
  const minLeet = Math.floor(Math.random() * 5);
  const maxLeet = minLeet + Math.floor(Math.random() * (10 - minLeet));
  document.getElementById('minLeetChars').value = minLeet;
  document.getElementById('maxLeetChars').value = maxLeet;
  document.getElementById('minLeetCharsValue').textContent = minLeet;
  document.getElementById('maxLeetCharsValue').textContent = maxLeet;
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
 * @param {number} minLeetChars - Minimum number of leet characters to apply.
 * @param {number} maxLeetChars - Maximum number of leet characters to apply.
 * @returns {string} The transformed passphrase.
 */
function transformation(plainPassphrase, transformationType, positions, minLeetChars, maxLeetChars) {
  switch (transformationType) {
    case 'leet':
      return leet(plainPassphrase, positions, minLeetChars, maxLeetChars);
    case 'miniLeet':
      return miniLeet(plainPassphrase, positions, minLeetChars, maxLeetChars);
    case 'plain':
    default:
      return plainPassphrase;
  }
}

/**
 * Transforms the given phrase to Leet Speak.
 * @param {string} phrase - The original phrase.
 * @param {number[]} positions - Array of positions eligible for transformation.
 * @param {number} minLeetChars - Minimum number of leet characters to apply.
 * @param {number} maxLeetChars - Maximum number of leet characters to apply.
 * @returns {string} The transformed phrase.
 */
function leet(phrase, positions, minLeetChars, maxLeetChars) {
  const leetMap = { 'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '$', 't': '7' };
  let phraseArray = Array.from(phrase);
  let leetApplied = 0;

  // Shuffle positions
  let shuffledPositions = positions.sort(() => 0.5 - Math.random());

  // Apply leet transformations
  for (const pos of shuffledPositions) {
    const char = phraseArray[pos].toLowerCase();
    if (leetMap[char] && leetApplied < maxLeetChars) {
      phraseArray[pos] = leetMap[char];
      leetApplied++;
    }
    if (leetApplied >= maxLeetChars) break;
  }

  // Ensure minimum leet characters are applied
  while (leetApplied < minLeetChars) {
    for (const pos of shuffledPositions) {
      const char = phraseArray[pos].toLowerCase();
      if (leetMap[char] && phraseArray[pos] !== leetMap[char]) {
        phraseArray[pos] = leetMap[char];
        leetApplied++;
        break;
      }
    }
  }

  return phraseArray.join('');
}

/**
 * Transforms the given word to Mini Leet Speak.
 * @param {string} word - The original word.
 * @param {number[]} positions - Array of positions eligible for transformation.
 * @param {number} minLeetChars - Minimum number of leet characters to apply.
 * @param {number} maxLeetChars - Maximum number of leet characters to apply.
 * @returns {string} The transformed word.
 */
function miniLeet(word, positions, minLeetChars, maxLeetChars) {
  const miniLeetMap = { 'a': '4', 'e': '3', 'i': '1', 'o': '0' };
  let wordArray = Array.from(word);
  let leetApplied = 0;

  // Shuffle positions
  let shuffledPositions = positions.sort(() => 0.5 - Math.random());

  // Apply mini leet transformations
  for (const pos of shuffledPositions) {
    const char = wordArray[pos].toLowerCase();
    if (miniLeetMap[char] && leetApplied < maxLeetChars) {
      wordArray[pos] = miniLeetMap[char];
      leetApplied++;
    }
    if (leetApplied >= maxLeetChars) break;
  }

  // Ensure minimum leet characters are applied
  while (leetApplied < minLeetChars) {
    for (const pos of shuffledPositions) {
      const char = wordArray[pos].toLowerCase();
      if (miniLeetMap[char] && wordArray[pos] !== miniLeetMap[char]) {
        wordArray[pos] = miniLeetMap[char];
        leetApplied++;
        break;
      }
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
 * Capitalizes the first letter of a word with a 50% chance.
 * @param {string} word - The word to potentially capitalize.
 * @returns {string} The word with its first letter possibly capitalized.
 */
function randomlyCapitalize(word) {
  return Math.random() < 0.5 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

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
      return randomlyCapitalize(word); // Apply random capitalization
    }
    return char;
  });

  const plainPassphrase = plainPassphraseArray.join(separator);

  // Identify positions that are eligible for leet transformation
  let leetEligiblePositions = [];
  for (let i = 0; i < plainPassphrase.length; i++) {
    if ('aeiost'.includes(plainPassphrase[i].toLowerCase())) {
      leetEligiblePositions.push(i);
    }
  }

  return transformation(plainPassphrase, config.transformation, leetEligiblePositions, config.minLeetChars, config.maxLeetChars);
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
  const minLeetElement = document.getElementById('minLeetChars');
  const maxLeetElement = document.getElementById('maxLeetChars');
  const transformationValue = this.value;

  if (transformationValue === 'plain') {
    minLeetElement.value = 0;
    maxLeetElement.value = 0;
    document.getElementById('minLeetCharsValue').textContent = 0;
    document.getElementById('maxLeetCharsValue').textContent = 0;
  } else if (transformationValue !== 'plain' && minLeetElement.value === '0' && maxLeetElement.value === '0') {
    minLeetElement.value = 1;
    maxLeetElement.value = 2;
    document.getElementById('minLeetCharsValue').textContent = 1;
    document.getElementById('maxLeetCharsValue').textContent = 2;
  }
  
  updateConfig(); // Update the config object
});

document.getElementById('minLeetChars').addEventListener('input', function() {
  const minValue = parseInt(this.value);
  const maxElement = document.getElementById('maxLeetChars');
  const maxValue = parseInt(maxElement.value);
  
  document.getElementById('minLeetCharsValue').textContent = minValue;
  
  if (minValue > maxValue) {
    maxElement.value = minValue;
    document.getElementById('maxLeetCharsValue').textContent = minValue;
  }
  
  updateConfig(); // Update the config object
});

document.getElementById('maxLeetChars').addEventListener('input', function() {
  const maxValue = parseInt(this.value);
  const minElement = document.getElementById('minLeetChars');
  const minValue = parseInt(minElement.value);
  
  document.getElementById('maxLeetCharsValue').textContent = maxValue;
  
  if (maxValue < minValue) {
    minElement.value = maxValue;
    document.getElementById('minLeetCharsValue').textContent = maxValue;
  }
  
  updateConfig(); // Update the config object
});