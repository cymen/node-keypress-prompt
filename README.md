# keypress-prompt [![Build Status](https://travis-ci.org/cymen/node-keypress-prompt.png?branch=master)](https://travis-ci.org/cymen/node-keypress-prompt)

[![NPM](https://nodei.co/npm/keypress-prompt.png?downloads=true&stars=true)](https://npmjs.org/package/keypress-prompt)

`keypress-prompt` is a simple prompter to get a single character or digit
on the console:

* returns a promise
* automatically lowercases the answer to avoid any issue with case
* trigged on a single keypress (no need to press enter)
* limited to single character choices
* does work with numeric choices and attempts to coerce input to choice type
* rejects promise if ctrl-c is pressed

## Example of prompting for a character

    $ cat character.js
    var prompter = require('keypress-prompt');

    prompter
      .prompt('Are you crazy', ['y', 'n'])
      .then(function(choice) {
          console.log('choice', choice);
      });

    $ node character.js
    Are you crazy [y, n]: n
    choice n

## Example of prompting for a number

    $ cat number.js
    var prompter = require('./src/keypress-prompt');

    prompter
      .prompt('Number of diners', [1, 2, 3, 4, 5])
      .then(function(choice) {
          console.log('choice', choice);
      });

    $ node number.js
    Number of diners [1, 2, 3, 4, 5]: 2
    choice 2

Note that internally `keypress-prompt` attempts to coerce the input to
the type of the provided choices. If the match is an integer, it will
return an integer so in this example, 2 is of type 'number'. It is
assumed you won't do something silly like prompt with options like
`[1, '1']`. It will work just maybe not quite how you want it to.

## Bailing out

If Ctrl-C is press at the prompt, the promise will be rejected.

## Testing

`fakeKeypress` is provided for use in tests. For example:

    it('lowercases the input to avoid issues with case', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        prompter.fakeKeypress('N');

        promise.then(
            function(key) {
                expect(key).toBe('n');
                done();
            },
            function() {
                expect('promise').toBe('not rejected');
                done();
            }
        );
    });

To send Ctrl-C:

    fakeKeypress('c', {
        name: 'c',
        ctrl: true
    });

