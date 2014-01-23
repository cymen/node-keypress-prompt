'use strict';

module.exports = function(grunt) {

    var files = [
        'package.json',
        'Gruntfile.js',
        'src/**/*.js',
        'spec/**/*.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsbeautifier: {
            files: files,
            js: {
                indentSize: 2
            }
        },

        jshint: {
            files: files,
            options: {
                globals: {
                    afterEach: true,
                    beforeEach: true,
                    describe: true,
                    xdescribe: true,
                    expect: true,
                    it: true,
                    xit: true,
                    jasmine: true,
                    spyOn: true
                },
                boss: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                globalstrict: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                node: true,
                sub: true,
                undef: true
            }
        },

        jasmine_node: {
            specNameMatcher: "spec",
            projectRoot: ".",
            forceExit: true
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['jshint', 'jsbeautifier', 'jasmine_node']);
};
