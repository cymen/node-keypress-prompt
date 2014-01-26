var Q = require('q'),
    keypress = require('keypress'),
    fakeKeypress = require('./fake-keypress');

keypress(process.stdin);

var displayPrompt = function(message, choices) {
    process.stdout.write(message + ' [' + choices.join(', ') + ']: ');
};

var displayInvalidChoice = function(key) {
    console.log(key + ' is not a valid choice, please try again');
};

var validChoices = function(allChoices) {
    var valid = true;
    allChoices.forEach(function(choice) {
        if (choice.toString().length > 1) {
            valid = false;
        }
    });
    return valid;
};

module.exports = {
    fakeKeypress: fakeKeypress,

    prompt: function(message, choices) {
        var lowerCaseChoices = choices.map(function(option) {
            return (option.toLowerCase) ? option.toLowerCase() : option;
        });

        return Q.promise(function(resolve, reject) {
            if (!validChoices(lowerCaseChoices)) {
                var error = 'Answers can only be a single character in length!';
                console.log(error);
                reject(error);
            }

            displayPrompt(message, choices);

            var handleKeypress = function(key, keyMeta) {
                var keyAsInteger = parseInt(key, 10),
                    keyAsLowerCase = (key && key.toLowerCase) ? key.toLowerCase() : key,
                    valid,
                    value;

                if (keyMeta && keyMeta.name === 'c' && keyMeta.ctrl) {
                    console.log();
                    if (process.stdin.setRawMode) {
                        process.stdin.setRawMode(false);
                    }
                    reject(keyMeta);
                }

                if (lowerCaseChoices.indexOf(keyAsLowerCase) !== -1) {
                    valid = true;
                    value = keyAsLowerCase;
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
                    process.stdin.removeListener('keypress', handleKeypress);
                    resolve(value);
                }
            };

            process.stdin.on('keypress', handleKeypress);

            if (process.stdin.setRawMode) {
                process.stdin.setRawMode(true);
            }
        });
    }
};
