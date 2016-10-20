module.exports = function (grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({
        uglify: {
            minjs: {
                files: {
                    'dist/vue-sortable.min.js': ['lib/Sortable/Sortable.js', 'src/sortable.js']
                }
            }
        },
        clean: {
            all: ["dist/", 'lib/*']
        },
        watch: {
            options: {
                spawn: false,
                debounceDelay: 2500,
            },
            scripts: {
                files: [
                    'src/*.js'
                ],
                tasks: [
                    'uglify'
                ]
            }
        },
        bower: {
            install: {
                options: {
                    copy: true,
                    targetDir: 'lib',
                    layout: 'byType',
                    install: true,
                    verbose: false,
                    prune: false,
                    cleanTargetDir: false,
                    cleanBowerDir: true,
                    bowerOptions: {}
                }
            }
        }

    }
    );
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('dev', ['watch', 'uglify']);
    grunt.registerTask('prod', ['clean', 'bower:install', 'uglify']);

};
