var BF     = require('../brain'),
    assert = require('assert');

describe('Basic functionality', function() {
  var options = {cells: 20},
      interprener = new BF(options);

  it('should return nothing on nothing', function() {
    assert.deepEqual(interprener.execute(), []);
    assert.deepEqual(interprener.execute(''), []);
  });

  it('should return 1', function() {
    assert.deepEqual(interprener.execute('+.'), [1]);
  });

  it('should return 1 and skip unrelated chars', function() {
    assert.deepEqual(interprener.execute('////###+$$ #R3 #4 $.## #$ JHIUO #y p89#Y*'), [1]);
  });

  it('should return A', function() {
    interprener.execute('++++++ [ > ++++++++++ < - ] > +++++ .', {as: 'text'}).should.equal('A');
  });
});
