// Generated by CoffeeScript 1.4.0
var actual, builtins, code, d, exec, expected, f, fail, fs, line, m, match, message, nFailed, nTests, path, repr, t0, trim, _i, _j, _len, _len1, _ref, _ref1;

fs = require('fs');

path = require('path');

exec = require('../lib/compiler').exec;

builtins = require('../lib/builtins').builtins;

match = builtins['≡'];

repr = JSON.stringify;

trim = function(s) {
  return s.replace(/(^ +| +$)/g, '');
};

nTests = nFailed = 0;

fail = function(reason, err) {
  nFailed++;
  console.error(reason);
  if (err) {
    return console.error(err.stack);
  }
};

t0 = Date.now();

d = __dirname + '/../src';

_ref = fs.readdirSync(d);
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  f = _ref[_i];
  if (f.match(/^\w+.coffee$/)) {
    _ref1 = fs.readFileSync(d + '/' + f, 'utf8').split('\n');
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      line = _ref1[_j];
      if (m = line.match(/^ *# {4,}(.*)⍝ *returns +(.+)$/)) {
        code = trim(m[1]);
        expected = exec(trim(m[2]));
        nTests++;
        try {
          actual = exec(code);
          if (!match(exec(code), expected)) {
            fail("Test " + (repr(code)) + " failed: expected " + (repr(expected)) + " but got " + (repr(actual)));
          }
        } catch (e) {
          fail("Test " + (repr(code)) + " failed with " + e, e);
        }
      }
    }
  }
}

message = nFailed ? "" + nFailed + " of " + nTests + " tests failed" : "All " + nTests + " tests passed";

message += " in " + (Date.now() - t0) + " ms.";

console.info(message);
