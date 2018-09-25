// Create a Function that will take a path to the .json file will read it and confirm that that json is satisfied to conditions:
// "flag" - boolean
// "myPromises" - array
// "element" - object
// "screenshot" - null
// "elementText" – string
// "allElementsText" - contain "const" in string
// "counter" - more than 10
// "config" - equal "Common"
// "const" - equal "FiRst" (case insensitive)
// "parameters" - array with length 8
// "description" - string with length more than 5 but less than 13
// If it satisfied show “OK” in console, if not, create new file with properties that not satisfied and reason why.
const fs = require('fs');
const path = require('path');

exports.validateJSON = (pathToJson) => {
  const json = require(pathToJson);

  const validationErrors = this._validate(json);

  if (Object.keys(validationErrors).length) {
    fs.writeFileSync(path.join(path.dirname(pathToJson), 'validationErrors.json'), JSON.stringify(validationErrors, null, 2), 'utf8');
  } else {
    console.log('OK');
  }

  return;
}

// for testing purposes
exports._validate = function(jsonObject) {
  const validationRules = {
    flag: {
      expected: 'boolean',
      rule: (value) => typeof value === 'boolean'
    },
    myPromises: {
      expected: 'array',
      rule: (value) => Array.isArray(value)
    },
    element: {
      expected: 'object',
      rule: (value) => value && typeof value === 'object' && typeof value !== 'function' && !Array.isArray(value)
    },
    screenshot: {
      expected: 'null',
      rule: (value) => value === null
    },
    elementText: {
      expected: 'string',
      rule: (value) => typeof value === 'string'
    },
    allElementsText: {
      expected: 'contain "const" in string',
      rule: (value) => value && typeof value === 'string' && value.includes('const')
    },
    counter: {
      expected: 'more than 10',
      rule: (value) => value > 10
    },
    config: {
      expected: 'equal "Common"',
      rule: (value) => value === 'Common'
    },
    const: {
      expected: 'equal "FiRst" (case insensitive)',
      rule: (value) => value && typeof value === 'string' && value.match(/^FiRst$/i)
    },
    parameters: {
      expected: 'array with length 8',
      rule: (value) => Array.isArray(value) && value.length === 8
    },
    description: {
      expected: 'string with length more than 5 but less than 13',
      rule: (value) => value && typeof value === 'string' && (value.length > 5 && value.length < 13)
    }
  };

  const validationErrors = Object.entries(jsonObject).reduce((total, property) => {
    const [key, value] = property;
    
    if(validationRules[key] && !validationRules[key].rule(value)) {
      total[key] = `Expected ${validationRules[key].expected}, but got ${JSON.stringify(jsonObject[key])}`;
    }

    return total;
  }, {});

  return validationErrors;
}

