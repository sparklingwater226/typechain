import * as CryptoJS from 'crypto-js';

// interface Human {
//   name: string;
//   age: number;
//   gender: string;
// }
// interfaces do not export to index.js

class Human {
  public name: string;
  public age: number;
  public gender: string;
  // private: not accessible outside class Human
  constructor(name: string, age: number, gender: string) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }
}

// const person = {
//   name: 'Nicolas',
//   age: 24,
//   gender: 'male',
// }

const lynn = new Human('Lynn', 18, 'female')
const sayHi = (person: Human): string => {
  return `Hello ${person.name}, you are ${person.age}, and you are ${person.gender}`;
}

//--------------------------------------------

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  // static makes method available before declaring a new Block
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
  
  static validateStructure = (block: Block): boolean => {
    return typeof block.index === 'number' && typeof block.hash === 'string' && typeof block.previousHash === 'string' && typeof block.timestamp === 'number' && typeof block.data === 'string'
  }

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, '2020202020202', '', 'Hello', 123456);

// blockchain is succession of blocks
let blockchain: Block[] = [genesisBlock];

const getBlockChain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const nextTimestamp: number = getNewTimeStamp();
  const nextHash = Block.calculateBlockHash(newIndex, previousBlock.hash, nextTimestamp, data);
  const newBlock: Block = new Block(newIndex, nextHash, previousBlock.hash, data, nextTimestamp);
  addBlock(newBlock);

  return newBlock;
}


const isBlockValid = (candiBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candiBlock)) {
    console.log('candi not valid')
    return false;
  }
  if (previousBlock.index + 1 !== candiBlock.index) {
    console.log('wrong index')
    return false;
  }
  if (previousBlock.hash !== candiBlock.previousHash) {
    console.log('wrong prevhash')
    return false;
  }
  if (Block.calculateBlockHash(candiBlock.index, candiBlock.previousHash, candiBlock.timestamp, candiBlock.data) !== candiBlock.hash) {
    console.log('wrong hash')
    return false;
  }
  return true;
}

const addBlock = (candiBlock: Block): void => {
  if (isBlockValid(candiBlock, getLatestBlock())) {
    blockchain.push(candiBlock)
  }
}

createNewBlock('hello');
createNewBlock('bye');
createNewBlock('byeeeee');
console.log(blockchain)