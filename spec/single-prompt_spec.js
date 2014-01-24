'use strict';

var Q = require('q');

describe('single-prompt', function() {
    var prompter;

    beforeEach(function() {
        prompter = require('../src/single-prompt');
        spyOn(process.stdout, 'write').andCallThrough();
        spyOn(process.stdin, 'on').andCallThrough();
    });

    it('displays the prompt on stdout', function(done) {
        var promise = prompter.prompt('this is a test', ['y', 'n']);

        prompter.fakeKeypress('n');

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

        prompter.fakeKeypress(2);

        expect(typeof promise.then === 'function').toBe(true);
    });

    it('resolves the promise with the key pressed', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        prompter.fakeKeypress('n');

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

        prompter.fakeKeypress('x');
        setTimeout(function() {
            prompter.fakeKeypress('n');
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

    it('provides a fakeKeypress method for ease of testing', function() {
        spyOn(process.stdin, 'emit');

        prompter.fakeKeypress('x');

        expect(process.stdin.emit).toHaveBeenCalledWith('keypress', 'x');
    });

    it('works for a prompt within a prompt (promise-wise)', function(done) {
        var promise = prompter
            .prompt('Yes or no', ['y', 'n'])
            .then(function() {
                return prompter.prompt('Number of drinks', [1, 2, 3]);
            });

        prompter.fakeKeypress('n');
        setTimeout(function() {
            prompter.fakeKeypress(2);
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
});
