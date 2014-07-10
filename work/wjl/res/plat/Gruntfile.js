module.exports = function(grunt) {
    // var transport = require('grunt-cmd-transport');
    // var style = transport.style.init(grunt);
    // var text = transport.text.init(grunt);
    // var script = transport.script.init(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        less: {
            options: {
                cleancss: true,
                modifyVars: {
                    v: '201403281743'
                }
            },
            files: {
                expand: true,
                cwd: "static/css/",
                src: ['**/*.less'],
                dest: 'release/static/css',
                ext: '.css'
            }
        },
        concat: {
            options: {
                separator: ';',
                process: function(src, filepath) {
                    return src.replace(/-debug/ig, "");
                }
            },
            widget: {
                src: [
                     'sea-modules/arale/base/**/*-debug.js', 
                     'sea-modules/arale/class/**/*-debug.js', 
                     'sea-modules/arale/easing/**/*-debug.js', 
                     'sea-modules/arale/events/**/*-debug.js', 
                     'sea-modules/arale/position/**/*-debug.js',
                     'sea-modules/arale/iframe-shim/**/*-debug.js',
                     'sea-modules/arale/templatable/**/*-debug.js',
                     'sea-modules/arale/overlay/**/*-debug.js',
                     'sea-modules/arale/select/**/*-debug.js',
                     //'sea-modules/arale/dialog/**/*-debug.js',
                     'sea-modules/arale/widget/**/*-debug.js',
                     'sea-modules/arale/validator/**/*-debug.js',
                     'sea-modules/arale/tip/**/*-debug.js',
                     'sea-modules/arale/popup/**/*-debug.js',
                     'sea-modules/arale/calendar/**/*-debug.js',
                     'sea-modules/custom/**/*-debug.js'],
                dest: 'release/.tmp/widget.js'
            }
            // 原始版本 
            //widget: {
            //     src: [
            //          'sea-modules/arale/**/*-debug.js', 
            //          'sea-modules/gallery/**/*-debug.js', 
            //          'sea-modules/custom/**/*-debug.js'],
            //     dest: 'release/.tmp/widget.js'
            // }
        },

        uglify: {
            options: {
                // sourceMap : true,
                // sourceMapName : function(v){
                    
                //     return v.replace(/-debug/ig, "");
                // }
            },
            ue: {
                src: "static/js/umeditor.min.js",
                dest: "release/static/js/umeditor.min.js"
            },  
            uec: {
                src: "static/js/umeditor.config.js",
                dest: "release/static/js/umeditor.config.js"
            },   
            static: {
                files: [{
                    expand: true,
                    cwd: 'static/',
                    src: [
                        'js/badmin/*.js',
                        'js/badmin/**/*.js',
                        'js/padmin/*.js',
                        'js/padmin/**/*.js',
                        'js/config.js',
                        'js/html5shiv.js',
                        'js/jquery-ui.js',
                        'js/jquery.js',
                        'js/sea.js'
                    ],
                    dest: 'release/static/',
                    ext: '.js'
                }]
            },
            widget: {
                src: "release/.tmp/widget.js",
                dest: "release/static/js/widget.js"
            },
            seamodules: {
                files: [{
                    expand: true,
                    cwd: 'sea-modules/',
                    src: ['**/**/*-debug.js'],
                    dest: 'release/sea-modules/',
                    ext: '.js'
                }]
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            minify: {
                expand: true,
                cwd: 'static/css/',
                src: ['**/*.css'],
                dest: 'release/static/css'
            },
            css: {
                expand: true,
                cwd: 'sea-modules/',
                src: ['**/*.css'],
                dest: 'release/sea-modules/'
            }
        },
        copy: {
            images: {
                src: 'static/images/**',
                dest: 'release/'
            },
            
            dialogs: {
                src: 'static/js/dialogs/**',
                dest: 'release/'
            },
            lang: {
                src: 'static/js/lang/**',
                dest: 'release/'
            },
            themes: {
                src: 'static/js/themes/**',
                dest: 'release/'
            },
            thirdparty: {
                src: 'static/js/third-party/**',
                dest: 'release/'
            }

        },
        clean: {
            release: ['release'],
            tmp: ["release/.tmp"]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    // grunt.registerTask('default', ['clean', "uglify:seamodules"]);
    // grunt.registerTask('default', ['clean:release',"copy", "clean:tmp"]);
    grunt.registerTask('default', ['clean:release', "less", "cssmin", 'concat', "uglify", "copy", "clean:tmp"]);
};