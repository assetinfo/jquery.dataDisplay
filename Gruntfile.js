module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // pkg: '<json:package.json>',
        uglify: {
            options: {
                banner: '/*! \n' +
                        ' * Script: jQuery.dataDisplay.js \n' +
                        ' * Description: <%= pkg.description %>  \n' +
                        ' * Copyright: Copyright (c) 2014-' + (new Date()).getFullYear() + ' Graham Dixon - http://gdixon.co.uk/  \n' +
                        ' * Author: GDixon  \n' +
                        ' * Email: gdixon@assetinfo.co.uk  \n' +
                        ' * Licensed: MIT \n' +
                        ' * Requires: jQuery > 1.9 \n' +
                        ' * Version: <%= pkg.version %> \n' +
                        ' */'
            },
            min: {
                options: {
                    beautify: false,
                    mangle: true
                },
                files: {
                    'dist/jquery.dataDisplay.min.js': ['src/js/jquery.dataDisplay.js']
                }
            },
            dist: {
                options: {
                    beautify: true,
                    mangle: false
                },
                files: {
                    'dist/jquery.dataDisplay.js': ['src/js/jquery.dataDisplay.js']
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "",
                    name: "src/js/jquery.dataDisplay",
                    mainConfigFile: "config.js",
                    out: "dist/jquery.dataDisplay.optimised.js"
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/jquery.dataDisplay.optimised.css': ['./src/css/jquery.dataDisplay.css']
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/js/*.js', 'README.md'],
                options: {
                    destination: 'docs',
                    configure: './docsConf.json',
                    template: './node_modules/jsdoc-oblivion/template'
                }
            }
        },
        jasmine: {
            full: {
                src: "dist/jquery.dataDisplay.optimised.js",
                options: {
                    specs: "spec/*[S|s]pec.js",
                    vendor: ['spec/lib/waitsForAndRuns.js']
                }
            }
        }
    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load the plugin that optimises AMD loads.
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    // Load the plugin that optimises CSS.
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-jsdoc');
    // Default task(s).
    grunt.registerTask('default', ['uglify', 'requirejs', 'cssmin', 'jsdoc']);
    // Load the plugin that provides testing.
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('docs', ['jsdoc']);
};
