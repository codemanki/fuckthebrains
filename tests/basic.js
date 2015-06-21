var BF     = require('../brain'),
    assert = require('assert');

describe('Basic functionality', function() {
  var options = {cells: 20},
      interpreter = new BF(options);

  it('should return nothing on nothing', function() {
    assert.deepEqual(interpreter.execute(), []);
    assert.deepEqual(interpreter.execute(''), []);
  });

  it('should return 1', function() {
    assert.deepEqual(interpreter.execute('+.'), [1]);
  });

  it('should return 1 and skip unrelated chars', function() {
    assert.deepEqual(interpreter.execute('////###+$$ #R3 #4 $.## #$ JHIUO #y p89#Y*'), [1]);
  });

  it('should return A', function() {
    assert.deepEqual(interpreter.execute('++++++ [ > ++++++++++ < - ] > +++++ .', {as: 'text'}), 'A');
  });

  it('should return 4', function() {
    assert.deepEqual(interpreter.execute('+->+++<[++]>+-<++>+.'), [4]);
  });

  it('should yo!', function() {
    assert.equal(interpreter.execute('+++++++++[>++++++++++>++++++++++++>++++<<<-]>-.>+++.>---.', {as: 'text'}), 'Yo!');
  });

  it('should hello world!', function() {
    assert.equal(interpreter.execute('++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.', {as: 'text'}), 'Hello World!');
  });

  it('should throw exception on wrong syntax', function() {
    assert.throws(interpreter.execute.bind(interpreter, ']'), BF.SyntaxError);
    assert.throws(interpreter.execute.bind(interpreter, '['), BF.SyntaxError);
    assert.throws(interpreter.execute.bind(interpreter, '[[]'), BF.SyntaxError);
    assert.throws(interpreter.execute.bind(interpreter, ']['), BF.SyntaxError);
    assert.throws(interpreter.execute.bind(interpreter, '[]]'), BF.SyntaxError);
  });

  it('should support input', function() {
    assert.equal(interpreter.execute('>,[>,]<[.<]', 'reeB', {as: 'text'}), 'Beer'); // Reverses input string
    assert.equal(interpreter.execute(',.,.,.', 'DeliciousBeer', {as: 'text'}), 'Del'); // Reads only first 3 chars
    //+[->,----------]<[+++++++++++.<] Test this
  });
});
