(function() {
  var Parser, fs, grammar, nt, o, t,
    __slice = Array.prototype.slice;

  grammar = {
    lex: {
      rules: []
    },
    bnf: {}
  };

  t = function(name, regex) {
    return grammar.lex.rules.push([regex.source, name && ("return " + (JSON.stringify(name)))]);
  };

  nt = function(name, alternatives) {
    return grammar.bnf[name] = alternatives;
  };

  o = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return args;
  };

  t('', /[ \t]+/);

  t('', /[⍝#].*/);

  t('SEPARATOR', /[\n\r◇]/);

  t('NUMBER', /¯?(?:0[xX][\da-fA-F]+|\d*\.?\d+(?:[eE][+¯]?\d+)?)(?:[jJ]¯?(?:0[xX][\da-fA-F]+|\d*\.?\d+(?:[eE][+¯]?\d+)?))?/);

  t('STRING', /(?:'[^\\']*(?:\\.[^\\']*)*')+/);

  t('STRING', /(?:"[^\\"]*(?:\\.[^\\"]*)*")+/);

  t('[', /\[/);

  t(']', /\]/);

  t(';', /;/);

  t('(', /\(/);

  t(')', /\)/);

  t('{', /\{/);

  t('}', /\}/);

  t(':', /:/);

  t('ARROW', /←/);

  t('EMBEDDED', /«[^»]*»/);

  t('SYMBOL', /∘./);

  t('SYMBOL', /⎕?[A-Za-z_][A-Za-z_0-9]*/);

  t('SYMBOL', /[^¯'":«»]/);

  t('EOF', /$/);

  nt('root', [o('body EOF', "return $1")]);

  nt('body', [o('', "$$ = ['body']"), o('guard', "$$ = ['body', $1]"), o('body SEPARATOR', "$$ = $1"), o('body SEPARATOR guard', "($$ = $1).push($3)")]);

  nt('guard', [o('expr', "$$ = $1"), o('expr : expr', "$$ = ['guard', $1, $3]")]);

  nt('expr', [o('sequence', "$$ = $1"), o('assignment', "$$ = $1"), o('sequence assignment', "($$ = $1).push($2)")]);

  nt('assignment', [o('SYMBOL ARROW expr', "$$ = ['assign', $1, $3]")]);

  nt('sequence', [o('item', "$$ = ['seq', $1]"), o('sequence item', "($$ = $1).push($2)")]);

  nt('item', [o('indexable', "$$ = $1"), o("indexable [ indices ]", "$$ = ['index', $1].concat($3)")]);

  nt('indices', [o('expr', "$$ = [$1]"), o(';', "$$ = [null]"), o('indices ; expr', "($$ = $1).push($3)"), o('indices ;', "($$ = $1).push(null)")]);

  nt('indexable', [o('NUMBER', "$$ = ['num', $1]"), o('STRING', "$$ = ['str', $1]"), o('SYMBOL', "$$ = ['sym', $1]"), o('EMBEDDED', "$$ = ['embedded', $1]"), o("( expr )", "$$ = $2"), o("{ body }", "$$ = ['lambda', $2]")]);

  Parser = require('jison').Parser;

  fs = require('fs');

  fs.writeFileSync('../lib/parser.js', new Parser(grammar).generate());

}).call(this);