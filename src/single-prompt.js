var Q = require('q'),
    keypress = require('keypress'),
    util = require('util');

keypress(process.stdin);

module.exports = {
    displayPrompt: function(message, choices) {
        process.stdout.write(message + ' [' + choices.join(', ') + ']: ');
    },

    displayInvalidChoice: function(key) {
        console.log(key + ' is not a valid choice, please try again');
    },

    prompt: function(message, choices) {
        var self = this;
        var lowerCaseChoices = choices.map(function(option) {
            return (option.toLowerCase) ? option.toLowerCase() : option;
        });

        return Q.promise(function(resolve, reject) {
            lowerCaseChoices.forEach(function(option) {
                if (option.toString().length > 1) {
                    var error = 'Answers can only be a single character in length!';
                    console.log(error);
                    reject(error);
                }
            });

            self.displayPrompt(message, choices);

            var x = process.stdin.on('keypress', function(key, keyMeta) {
                var keyAsInteger = parseInt(key, 10),
                    valid,
                    value;

                if (keyMeta && keyMeta.name === 'c' && keyMeta.ctrl) {
                    console.log();
                    reject(keyMeta);
                    process.exit(1);
                }

                if (typeof key === 'string') {
                    key = key.toLowerCase();
                }

                if (lowerCaseChoices.indexOf(key) !== -1) {
                    valid = true;
                    value = key;
                } else if (lowerCaseChoices.indexOf(keyAsInteger) !== -1) {
                    valid = true;
                    value = keyAsInteger;
                } else {
                    valid = false;
                }

                if (valid) {
                    process.stdout.write(key + '\n');
                    if (process.stdin.setRawMode) {
                        process.stdin.setRawMode(false);
                    }
                    process.stdin.removeListener('keypress', arguments.callee);
                    resolve(value);
                } else {
                    self.displayInvalidChoice(key);
                    self.displayPrompt(message, choices);
                }
            });

            if (process.stdin.setRawMode) {
                process.stdin.setRawMode(true);
            }
        });
    },

    fakeKeypress: function(key, keyMeta) {
        process.stdin.emit('keypress', key, keyMeta);
    }
};
