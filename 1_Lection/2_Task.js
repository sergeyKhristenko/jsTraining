// Create a function that will take a String value as first parameter,
// Number value as second and String value as third.
// First parameter should be a sentence or set of sentences,
// second parameter should be a number of letter in each word in the sentence that should be replaced by the third parameter.
// That function should return updated sentence.

function replaceByIndex(string, index, stringToReplace) {
  if(index < 1 || !Number.isInteger(index)) throw new Error('index should be integer and bigger than 1');

  const wordsArr = string.split(' ');

  return wordsArr.map(word => {
    if (word.length >= index && !word.charAt(index-1).match(/\W/)) {
      return word.substring(-1, index - 1) + stringToReplace + word.substring(index);
    } else {
      return word;
    }
  }).join(' ');
}

module.exports = replaceByIndex;
