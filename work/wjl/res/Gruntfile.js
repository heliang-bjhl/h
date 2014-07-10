module.exports = function(grunt) {
    // var transport = require('grunt-cmd-transport');
    // var style = transport.style.init(grunt);
    // var text = transport.text.init(grunt);
    // var script = transport.script.init(grunt);

    grunt.initConfig({

        copy: {
            plat: {
                expand: true,
                cwd: 'plat/release/',
                src: '**',
                dest: 'release'
            },
            wx: {
                expand: true,
                cwd: 'mobile/weixin/release/',
                src: '**',
                dest: 'release'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');


    // grunt.registerTask('default', ['clean', "uglify:seamodules"]);
    grunt.registerTask('default', ['copy']);
};
