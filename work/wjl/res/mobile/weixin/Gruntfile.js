module.exports = function(grunt) {
    // var transport = require('grunt-cmd-transport');
    // var style = transport.style.init(grunt);
    // var text = transport.text.init(grunt);
    // var script = transport.script.init(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        less: { // Set up to detect files dynamically versus statically
            mini: {
                options: {
                    cleancss: true
                },
                expand: true, // set to true to enable options following options:
                cwd: "wx/css/", // all sources relative to this path
                src: "**/*.less", // source folder patterns to match, relative to cwd
                dest: "release/wx/css/", // destination folder path prefix
                ext: ".css", // replace any existing extension with this value in dest folder
                flatten: false // flatten folder structure to single level
            }
        },
        copy: {
            js: {
                files: [{
                    expand: true,
                    cwd: 'wx/js',
                    src: ['**'],
                    dest: 'release/wx/js'
                }]
            }
        },
        imagemin: { // Task
            dynamic: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'wx/img', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'release/wx/img' // Destination path prefix
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');


    // grunt.registerTask('default', ['clean', "uglify:seamodules"]);
    grunt.registerTask('default', ["less", "copy","imagemin"]);
};
