// Create a function that will take a String value in parameters and return message that will say is that string a Palindrome or not;

function isPalindrome(string) {
  const testString = `${string}`.replace(/\W/g, '').toLowerCase();  
  
  return testString === testString.split('').reverse().join('')
}

module.exports = isPalindrome;