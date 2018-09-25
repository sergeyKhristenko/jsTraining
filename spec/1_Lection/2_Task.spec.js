const replaceByIndex = require('../../1_Lection/2_Task');

describe('2_Task: replace char in string by index', () => {
  it('first char', () => expect(replaceByIndex('Hello World!', 1, '#')).toEqual('#ello #orld!'));
  it('index outside the word', () => expect(replaceByIndex('Hello Worldddd', 6, '#')).toEqual('Hello World#dd'));
  it('index on boundary', () => expect(replaceByIndex('Hello World!', 5, '#')).toEqual('Hell# Worl#!'));
  it('index on comma', () => expect(replaceByIndex('A man, a plan, a canal – Panama', 4, '#')).toEqual('A man, a pla#, a can#l – Pan#ma'));
  it('index on non-char', () => expect(replaceByIndex('A ,man, !a %plan, a canal – Panama', 1, '#')).toEqual('# ,man, !a %plan, # #anal – #anama'));
  it('other delimiter', () => expect(replaceByIndex('Hello World!', 4, '%%%')).toEqual('Hel%%%o Wor%%%d!'));

  // negative
  it('zero char', () => expect(() => replaceByIndex('Hello World!', 0, '#')).toThrow());
  it('negative index', () => expect(() => replaceByIndex('Hello World!', -1, '#')).toThrow());
  it('string index', () => expect(() => replaceByIndex('Hello World!', 'index', '#')).toThrow());
  it('no index', () => expect(() => replaceByIndex('Hello World!', undefined, '#')).toThrow());
});
