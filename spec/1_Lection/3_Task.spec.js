const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const existPromise = promisify(fs.exists);
const unlinkPromise = promisify(fs.unlink);
const writeFilePromise = promisify(fs.writeFile);

const { validateJSON, _validate } = require('../../1_Lection/3_Task');

const FILE_WITH_ERRORS_NAME = 'validationErrors.json';

describe('3_Task: validate JSON', () => {
  beforeEach(async () => {
    if (await isFileWithErrorsExists()) {
      await unlinkPromise(getPathToFile(FILE_WITH_ERRORS_NAME));
    }
  });

  it('valid json - print OK to console', async () => {
    const validJson = getPathToFile('valid.json');
    spyOn(console, 'log');
    validateJSON(validJson);

    expect(console.log).toHaveBeenCalledWith('OK');
    expect(await isFileWithErrorsExists()).toBeFalsy();
  });

  it('create file with errors if json failed validation', async () => {
    const invalidJson = getPathToFile('1.json');
    spyOn(console, 'log');
    validateJSON(invalidJson);

    expect(console.log).not.toHaveBeenCalled();
    expect(await isFileWithErrorsExists()).toBeTruthy();
  });

  it('if json failed validation json should contains error fields with descriptions', async () => {
    const TEST_JSON = {
      flag: 'true',
      myPromises: { some: [1, 2, 3] },
      element: {
        name: 'title',
        css: '.dd-ui'
      },
      container: {},
      screenshot: '',
      elementText: false,
      allElementsText: 'contain the const',
      counter: 11.3,
      config: 'not a common',
      const: 'the first const',
      parameters: [3, '', 'add', 'delete', 'update', 'more', '--', false],
      description: 'my first project on js'
    };
    const expectedErrors = {
      flag: 'Expected boolean, but got "true"',
      myPromises: 'Expected array, but got {"some":[1,2,3]}',
      screenshot: 'Expected null, but got ""',
      elementText: 'Expected string, but got false',
      config: 'Expected equal "Common", but got "not a common"',
      const: 'Expected equal "FiRst" (case insensitive), but got "the first const"',
      description: 'Expected string with length more than 5 but less than 13, but got "my first project on js"'
    };

    const testInvalidJson = getPathToFile('testInvalidJson.json');
    await writeFilePromise(testInvalidJson, JSON.stringify(TEST_JSON), 'utf8');

    validateJSON(testInvalidJson);

    const fileWithErrors = require(getPathToFile(FILE_WITH_ERRORS_NAME));
    expect(fileWithErrors).toEqual(expectedErrors);
  });

  it('validation rules: flag', async () => {
    expect(_validate({ flag: true })).toEqual({});
    expect(_validate({ flag: 'true' })).toEqual({ flag: 'Expected boolean, but got "true"' });
    expect(_validate({ flag: [true] })).toEqual({ flag: 'Expected boolean, but got [true]' });
    expect(_validate({ flag: { param: true } })).toEqual({ flag: 'Expected boolean, but got {"param":true}' });
    expect(_validate({ flag: null })).toEqual({ flag: 'Expected boolean, but got null' });
    expect(_validate({ flag: 1 })).toEqual({ flag: 'Expected boolean, but got 1' });
    expect(_validate({ flag: undefined })).toEqual({ flag: 'Expected boolean, but got undefined' });
  });

  it('validation rules: myPromises', async () => {
    expect(_validate({ myPromises: [] })).toEqual({});
    expect(_validate({ myPromises: 'true' })).toEqual({ myPromises: 'Expected array, but got "true"' });
    expect(_validate({ myPromises: true })).toEqual({ myPromises: 'Expected array, but got true' });
    expect(_validate({ myPromises: { param: true } })).toEqual({ myPromises: 'Expected array, but got {"param":true}' });
    expect(_validate({ myPromises: null })).toEqual({ myPromises: 'Expected array, but got null' });
    expect(_validate({ myPromises: 1 })).toEqual({ myPromises: 'Expected array, but got 1' });
    expect(_validate({ myPromises: undefined })).toEqual({ myPromises: 'Expected array, but got undefined' });
  });

  it('validation rules: element', async () => {
    expect(_validate({ element: {} })).toEqual({});
    expect(_validate({ element: 'true' })).toEqual({ element: 'Expected object, but got "true"' });
    expect(_validate({ element: true })).toEqual({ element: 'Expected object, but got true' });
    expect(_validate({ element: [] })).toEqual({ element: 'Expected object, but got []' });
    expect(_validate({ element: null })).toEqual({ element: 'Expected object, but got null' });
    expect(_validate({ element: 1 })).toEqual({ element: 'Expected object, but got 1' });
    expect(_validate({ element: undefined })).toEqual({ element: 'Expected object, but got undefined' });
  });

  it('validation rules: screenshot', async () => {
    expect(_validate({ screenshot: null })).toEqual({});
    expect(_validate({ screenshot: 'true' })).toEqual({ screenshot: 'Expected null, but got "true"' });
    expect(_validate({ screenshot: true })).toEqual({ screenshot: 'Expected null, but got true' });
    expect(_validate({ screenshot: [] })).toEqual({ screenshot: 'Expected null, but got []' });
    expect(_validate({ screenshot: {} })).toEqual({ screenshot: 'Expected null, but got {}' });
    expect(_validate({ screenshot: 1 })).toEqual({ screenshot: 'Expected null, but got 1' });
    expect(_validate({ screenshot: undefined })).toEqual({ screenshot: 'Expected null, but got undefined' });
  });

  it('validation rules: elementText', async () => {
    expect(_validate({ elementText: 'string' })).toEqual({});
    expect(_validate({ elementText: null })).toEqual({ elementText: 'Expected string, but got null' });
    expect(_validate({ elementText: true })).toEqual({ elementText: 'Expected string, but got true' });
    expect(_validate({ elementText: [] })).toEqual({ elementText: 'Expected string, but got []' });
    expect(_validate({ elementText: {} })).toEqual({ elementText: 'Expected string, but got {}' });
    expect(_validate({ elementText: 1 })).toEqual({ elementText: 'Expected string, but got 1' });
    expect(_validate({ elementText: undefined })).toEqual({ elementText: 'Expected string, but got undefined' });
  });

  it('validation rules: allElementsText', async () => {
    expect(_validate({ allElementsText: 'string contains const' })).toEqual({});
    expect(_validate({ allElementsText: 'string without keyword' })).toEqual({
      allElementsText: 'Expected contain "const" in string, but got "string without keyword"'
    });
    expect(_validate({ allElementsText: 'string without ConSt in mixed case' })).toEqual({
      allElementsText: 'Expected contain "const" in string, but got "string without ConSt in mixed case"'
    });
    expect(_validate({ allElementsText: null })).toEqual({ allElementsText: 'Expected contain "const" in string, but got null' });
    expect(_validate({ allElementsText: true })).toEqual({ allElementsText: 'Expected contain "const" in string, but got true' });
    expect(_validate({ allElementsText: [] })).toEqual({ allElementsText: 'Expected contain "const" in string, but got []' });
    expect(_validate({ allElementsText: {} })).toEqual({ allElementsText: 'Expected contain "const" in string, but got {}' });
    expect(_validate({ allElementsText: 1 })).toEqual({ allElementsText: 'Expected contain "const" in string, but got 1' });
    expect(_validate({ allElementsText: undefined })).toEqual({ allElementsText: 'Expected contain "const" in string, but got undefined' });
  });

  it('validation rules: counter', async () => {
    expect(_validate({ counter: 11 })).toEqual({});
    expect(_validate({ counter: 10 })).toEqual({ counter: 'Expected more than 10, but got 10' });
    expect(_validate({ counter: -1 })).toEqual({ counter: 'Expected more than 10, but got -1' });
    expect(_validate({ counter: 0.1 })).toEqual({ counter: 'Expected more than 10, but got 0.1' });
    expect(_validate({ counter: null })).toEqual({ counter: 'Expected more than 10, but got null' });
    expect(_validate({ counter: true })).toEqual({ counter: 'Expected more than 10, but got true' });
    expect(_validate({ counter: [] })).toEqual({ counter: 'Expected more than 10, but got []' });
    expect(_validate({ counter: {} })).toEqual({ counter: 'Expected more than 10, but got {}' });
    expect(_validate({ counter: undefined })).toEqual({ counter: 'Expected more than 10, but got undefined' });
  });

  it('validation rules: config', async () => {
    expect(_validate({ config: 'Common' })).toEqual({});
    expect(_validate({ config: 'common' })).toEqual({ config: 'Expected equal "Common", but got "common"' });
    expect(_validate({ config: ' Common ' })).toEqual({ config: 'Expected equal "Common", but got " Common "' });
    expect(_validate({ config: 'Common something' })).toEqual({ config: 'Expected equal "Common", but got "Common something"' });
    expect(_validate({ config: null })).toEqual({ config: 'Expected equal "Common", but got null' });
    expect(_validate({ config: true })).toEqual({ config: 'Expected equal "Common", but got true' });
    expect(_validate({ config: [] })).toEqual({ config: 'Expected equal "Common", but got []' });
    expect(_validate({ config: {} })).toEqual({ config: 'Expected equal "Common", but got {}' });
    expect(_validate({ config: 1 })).toEqual({ config: 'Expected equal "Common", but got 1' });
    expect(_validate({ config: undefined })).toEqual({ config: 'Expected equal "Common", but got undefined' });
  });

  it('validation rules: const', async () => {
    expect(_validate({ const: 'FiRst' })).toEqual({});
    expect(_validate({ const: 'first' })).toEqual({});
    expect(_validate({ const: 'FIRST' })).toEqual({});
    expect(_validate({ const: ' FIRST ' })).toEqual({ const: 'Expected equal "FiRst" (case insensitive), but got " FIRST "' });
    expect(_validate({ const: 'FiRst some' })).toEqual({ const: 'Expected equal "FiRst" (case insensitive), but got "FiRst some"' });
    expect(_validate({ const: null })).toEqual({ const: 'Expected equal "FiRst" (case insensitive), but got null' });
    expect(_validate({ const: true })).toEqual({ const: 'Expected equal "FiRst" (case insensitive), but got true' });
    expect(_validate({ const: [] })).toEqual({ const: 'Expected equal "FiRst" (case insensitive), but got []' });
    expect(_validate({ const: {} })).toEqual({ const: 'Expected equal "FiRst" (case insensitive), but got {}' });
    expect(_validate({ const: 1 })).toEqual({ const: 'Expected equal "FiRst" (case insensitive), but got 1' });
    expect(_validate({ const: undefined })).toEqual({ const: 'Expected equal "FiRst" (case insensitive), but got undefined' });
  });

  it('validation rules: parameters', async () => {
    expect(_validate({ parameters: [1, 2, 3, 4, 5, 6, 7, 8] })).toEqual({});
    expect(_validate({ parameters: [1, 2, 3, 4, 5, 6, 7, [1, 2, 3, 4]] })).toEqual({});
    expect(_validate({ parameters: [1, 2, 3, 4, 5, 6, 7] })).toEqual({ parameters: 'Expected array with length 8, but got [1,2,3,4,5,6,7]' });
    expect(_validate({ parameters: [1, 2, 3, 4, 5, 6, 7, 8, 9] })).toEqual({
      parameters: 'Expected array with length 8, but got [1,2,3,4,5,6,7,8,9]'
    });
    expect(_validate({ parameters: null })).toEqual({ parameters: 'Expected array with length 8, but got null' });
    expect(_validate({ parameters: true })).toEqual({ parameters: 'Expected array with length 8, but got true' });
    expect(_validate({ parameters: [] })).toEqual({ parameters: 'Expected array with length 8, but got []' });
    expect(_validate({ parameters: {} })).toEqual({ parameters: 'Expected array with length 8, but got {}' });
    expect(_validate({ parameters: 1 })).toEqual({ parameters: 'Expected array with length 8, but got 1' });
    expect(_validate({ parameters: undefined })).toEqual({ parameters: 'Expected array with length 8, but got undefined' });
  });

  it('validation rules: description', async () => {
    expect(_validate({ description: 'some string' })).toEqual({});
    expect(_validate({ description: 'ddd' })).toEqual({description: 'Expected string with length more than 5 but less than 13, but got "ddd"'});
    expect(_validate({ description: 'too long string' })).toEqual({description: 'Expected string with length more than 5 but less than 13, but got "too long string"'});
    expect(_validate({ description: null })).toEqual({ description: 'Expected string with length more than 5 but less than 13, but got null' });
    expect(_validate({ description: true })).toEqual({ description: 'Expected string with length more than 5 but less than 13, but got true' });
    expect(_validate({ description: [] })).toEqual({ description: 'Expected string with length more than 5 but less than 13, but got []' });
    expect(_validate({ description: {} })).toEqual({ description: 'Expected string with length more than 5 but less than 13, but got {}' });
    expect(_validate({ description: 1 })).toEqual({ description: 'Expected string with length more than 5 but less than 13, but got 1' });
    expect(_validate({ description: undefined })).toEqual({ description: 'Expected string with length more than 5 but less than 13, but got undefined' });
  });
});

function isFileWithErrorsExists() {
  return existPromise(getPathToFile(FILE_WITH_ERRORS_NAME));
}

function getPathToFile(filename) {
  const path_to_file = path.join(process.cwd(), '1_Lection', 'testData', filename);
  return path_to_file;
}
