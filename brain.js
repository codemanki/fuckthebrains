module.exports = BF;
var DEBUG_LOG,
    DEFAULT_CELLS = 30000,
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

  var sourceCodePointer = 0,
      jumps;
  this.memory[0] = 0; // Set first byte as 0 automatically
  sourceCode = (typeof sourceCode == 'string' || sourceCode instanceof String) ? sourceCode : '';
  sourceCode = sourceCode.replace(NON_BRAINFUCK_CHARS, '');

  jumps = preCalcJumps (sourceCode);
  for(var i = 0; i < sourceCode.length; i++) {
    var currentChar = sourceCode[i];
    switch (currentChar) {
      case '>':
        debugLog('Incrementing from ' + sourceCodePointer + ' to ' + (sourceCodePointer+1) + '. Value is ' + (this.memory[sourceCodePointer]+1));
        sourceCodePointer++; // TODO: Overflow?
        if (this.memory[sourceCodePointer] === undefined) {
          this.memory[sourceCodePointer] = 0;
        }
        break;
      case '<':
        debugLog('Decrementing from ' + sourceCodePointer + ' to ' + (sourceCodePointer - 1) + '. Value is ' + (this.memory[sourceCodePointer] - 1));
        sourceCodePointer--;
        if (sourceCodePointer < 0) {
          sourceCodePointer = 0;
        }
        break;
      case '+':
        this.memory[sourceCodePointer]++;
        debugLog('Incrementing at ' + sourceCodePointer + '. Value is ' + (this.memory[sourceCodePointer]));
        break;
      case '-':
        this.memory[sourceCodePointer]--;
        debugLog('Decrementing at ' + sourceCodePointer + '. Value is ' + (this.memory[sourceCodePointer]));
        break;
      case '.':
        debugLog('Print at ' + sourceCodePointer + '. Value is ' + (this.memory[sourceCodePointer]));
        this.output.push(this.memory[sourceCodePointer]);
        break;
      case '[':
        if (this.memory[sourceCodePointer] == 0) {
          i = jumps[i];
          // Jump after ]
        } else {
          // continue execution
        }
        break;
      case ']':
        if (this.memory[sourceCodePointer] != 0) {
          i = jumps[i];
        } else {
          // continue execution
        }
        break;

    }
  }

  if (options && options.as === 'text') {
    this.output = this.output.map(function(c) {
      return String.fromCharCode(c);
    }).join('');
  }

  return this.output;
};

BF.prototype.debugLog = function() {
  return DEBUG_LOG;
}

function reset() {
  // TODO: Optimize this and not create huge array
  this.memory = new Array(this.options.cells);
  this._memoryPointer = 0;
  this.output = [];
  DEBUG_LOG = [];
}

function debugLog(message) {
  DEBUG_LOG.push(message);
}

function preCalcJumps(sourceCode) {
  // Go through the source code and build map of jumps
  // Currently doesnt support nested loops
  var stack = [],
      jumps  = {},
      position;

  for(var i = 0; i < sourceCode.length; i++) {
    var currentChar = sourceCode[i];

    switch (currentChar) {
      case '[':
        stack.push(i);
        break;
      case ']':
        position = stack.pop();
        if (position === undefined) {
          throw new BF.SyntaxError('Bad jump syntax');
        }
        jumps[position] = i;
        jumps[i] = position;
        break;
    }
  }
  if (stack.length) {
    throw new BF.SyntaxError('Bad jump syntax');
  }

  return jumps;
}


BF.SyntaxError = function(message) {
    this.name = 'SyntaxError';
    this.message = message;
}

BF.SyntaxError.prototype = Error.prototype;
