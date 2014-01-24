'use strict';

var Q = require('q'),
    proxyquire = require('proxyquire'),
    fakeKeypress = require('../src/fake-keypress');

describe('single-prompt', function() {
    var prompter;

    beforeEach(function() {
        prompter = require('../src/single-prompt');
        spyOn(console, 'log').andCallThrough();
        spyOn(process.stdout, 'write').andCallThrough();
        spyOn(process.stdin, 'on').andCallThrough();
    });

    it('displays the prompt on stdout', function(done) {
        var promise = prompter.prompt('this is a test', ['y', 'n']);

        fakeKeypress('n');

        promise.then(
            function(key) {
                expect(process.stdout.write).toHaveBeenCalledWith('this is a test [y, n]: ');
                done();
            },
            function() {
                expect('promise').toBe('not rejected');
                done();
            }
        );
    });

    it('returns a promise', function() {
        var promise = prompter.prompt('abc', [1, 2, 3]);

        fakeKeypress(2);

        expect(typeof promise.then === 'function').toBe(true);
    });

    it('resolves the promise with the key pressed', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('n');

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

    it('continues to prompt until one of the expected values is provided', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('x');
        setTimeout(function() {
            fakeKeypress('n');
        }, 100);

        promise.then(
            function(key) {
                expect(key).toBe('n');
                expect(process.stdout.write).toHaveBeenCalledWith('x is not a valid choice, please try again\n');
                done();
            },
            function() {
                expect('promise').toBe('not rejected');
                done();
            }
        );
    });

    it('lowercases the input to avoid issues with case', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('N');

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

    it('correctly handles upper case answers', function(done) {
        var promise = prompter.prompt('Yes or no', ['Y', 'N']);

        fakeKeypress('N');

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

    it('works for a prompt within a prompt (promise-wise)', function(done) {
        var promise = prompter
            .prompt('Yes or no', ['y', 'n'])
            .then(function() {
                return prompter.prompt('Number of drinks', [1, 2, 3]);
            });

        fakeKeypress('n');
        setTimeout(function() {
            fakeKeypress(2);
        }, 50);

        promise.then(
            function(key) {
                expect(key).toBe(2);
                done();
            },
            function() {
                expect('promise').toBe('not rejected');
                done();
            }
        );
    });

    it('logs an error and exits if attempting to use answers longer than a single character', function(done) {
        var promise = prompter
            .prompt('Yes or no', ['yes', 'n']);

        promise.then(
            function(key) {
                expect('promise').toBe('not resolved');
                done();
            },
            function() {
                expect(console.log).toHaveBeenCalledWith('Answers can only be a single character in length!');
                done();
            }
        );
    });

    it('logs an error and exists if attempting to use answer with number greater than 9', function(done) {
        var promise = prompter
            .prompt('Number of drinks', [1, 3, 25]);

        promise.then(
            function(key) {
                expect('promise').toBe('not resolved');
                done();
            },
            function() {
                expect(console.log).toHaveBeenCalledWith('Answers can only be a single character in length!');
                done();
            }
        );
    });

    it('logs an error and exists if attempting to use answer with number less than 0', function(done) {
        var promise = prompter
            .prompt('Number of drinks', [1, 3, 25, -5]);

        promise.then(
            function(key) {
                expect('promise').toBe('not resolved');
                done();
            },
            function() {
                expect(console.log).toHaveBeenCalledWith('Answers can only be a single character in length!');
                done();
            }
        );
    });

    it('exits the program if ctrl-c is press', function(done) {
        spyOn(process, 'exit');
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('c', {
            name: 'c',
            ctrl: true
        });

        promise.then(
            function() {
                expect('promise').toBe('not resolved');
                done();
            },
            function(keyMeta) {
                expect(console.log).toHaveBeenCalledWith();
                expect(process.exit).toHaveBeenCalledWith(1);
                expect(keyMeta.name).toBe('c');
                expect(keyMeta.ctrl).toBe(true);
                done();
            }
        );
    });

    it('provides access to fake keypress', function() {
        var fakeKeypressSpy = jasmine.createSpy('fakeKeypress'),
            anotherPrompter = proxyquire('../src/single-prompt', {
                './fake-keypress': fakeKeypressSpy
            });

        anotherPrompter.fakeKeypress('a', {
            x: 'y'
        });

        expect(fakeKeypressSpy).toHaveBeenCalledWith('a', {
            x: 'y'
        });
    });
});
