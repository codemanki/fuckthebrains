module.exports = BF;
var DEFAULT_CELLS = 30000,
    NON_BRAINFUCK_CHARS = /[^\x2B-\x2E\x3C\x3E\x5B\x5D]/g;  // https://github.com/mathiasbynens/brnfckr/blob/master/brnfckr.js

function BF(options) {
  options.cells = options.cells || DEFAULT_CELLS;

  if (options.cells < 0) {
    options.cells = DEFAULT_CELLS;
  }

  this.options = options;
  reset.call(this);
}

BF.prototype.execute = function(sourceCode, options) {
  reset.call(this);

  var sourceCodePointer = 0;
  this.memory[0] = 0; // Set first byte as 0 automatically
  sourceCode = (typeof sourceCode == 'string' || sourceCode instanceof String) ? sourceCode : '';
  sourceCode = sourceCode.replace(NON_BRAINFUCK_CHARS, '');

  for(var i = 0; i < sourceCode.length; i++) {
    var currentChar = sourceCode[i];
    switch (currentChar) {
      case '>':
        sourceCodePointer++; // TODO: Overflow?
        if (this.memory[sourceCodePointer] === null) {
          this.memory[sourceCodePointer] = 0;
        }
        break;
      case '<':
        sourceCodePointer--;
        if (sourceCodePointer < 0) {
          sourceCodePointer = 0;
        }
        break;
      case '+':
        this.memory[sourceCodePointer]++;
        break;
      case '-':
        this.memory[sourceCodePointer]--;
        break;
      case '.':
        this.output.push(this.memory[sourceCodePointer]);
        break;
    }
  }

  if (options && options.as === 'text') {
    this.output = this.output.map(function(c) {
      return String.fromCharCode(c);
    });
  }

  return this.output;
};

function reset() {
  // TODO: Optimize this and not create huge array
  this.memory = new Array(this.options.cells);
  this._memoryPointer = 0;
  this.output = [];
}
