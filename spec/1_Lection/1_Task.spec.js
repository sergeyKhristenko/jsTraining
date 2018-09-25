const isPalindrome = require('../../1_Lection/1_Task');

describe('1_Task: is palingrome', () => {
  it('word', () => expect(isPalindrome('bob')).toEqual(true));
  it('Sentence', () => expect(isPalindrome('Was it a car or a cat I saw')).toEqual(true));
  it('Sentence', () => expect(isPalindrome('Able was I ere I saw Elba')).toEqual(true));
  it('Sentence with punctuation', () => expect(isPalindrome('A man, a plan, a canal – Panama')).toEqual(true));
  it('Numbers', () => expect(isPalindrome(5885)).toEqual(true));

  //negative
  it('word', () => expect(isPalindrome('dog')).toEqual(false));
  it('Sentence', () => expect(isPalindrome('Was it a car or a cap I saw')).toEqual(false));
  it('Sentence with punctuation', () => expect(isPalindrome('A map, a plan, a canal – Panama')).toEqual(false));
  it('Numbers', () => expect(isPalindrome(5886)).toEqual(false));
});
