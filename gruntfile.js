module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    vars: {
      date: grunt.template.today('yyyy-mm-dd')
    },

    // https://github.com/sindresorhus/grunt-shell
    shell: {
      bower: {
        command: 'bower install'
      }
    },

    bower_concat: {
      all: {
        dest: '../js/_plugins.js',
        cssDest: '../css/_plugins.css',
        exclude: [
          'breakpoint-sass',
          'sassy-maps',
          'compass-mixins'
        ]
      }
    },

    // Grunt-sass
    sass: {
      dist: {
        // Takes every file that ends with .scss from the scss
        // directory and compile them into the css directory.
        // Also changes the extension from .scss into .css.
        // Note: file name that begins with _ are ignored automatically
        files: [{
          expand: true,
          cwd: 'scss',
          src: ['*.scss'],
          dest: 'css',
          ext: '.css'
        }]
      },
      options: {
        sourceMap: false,
        // outputStyle: 'compressed',
        outputStyle: 'expanded',
        imagePath: "img/",
      }
    },

    // Exclude directories that shouldn't be copied.
    //copy: {
    //  main: {
    //    files: [
    //      // makes all src relative to cwd
    //      { expand: true, cwd: '.', src: ['**', '.*', 'js/*', 'js/**', 'lib/*.php', '!scss/**', '!img/*.psd', '!db/**', '!*.config.php'], dest: '../' }
    //    ]
    //  }
    //},

    // Browsersync server
    browserSync: {
        bsFiles: {
            src : [
              '../css/*.css',
              '../*.html',
              '../*.php'
            ]

        },
        options: {
            proxy: 'mila.dev',
            watchTask: true,
            snippetOptions: {
            // Ignore all HTML files within the templates folder
            ignorePaths: "templates/*.html",
            // Provide a custom Regex for inserting the snippet.
            rule: {
                match: /<\/body>/i,
                fn: function (snippet, match) {
                    return snippet + match;
                }
              }
            }
        }
    },

    // Watch the source folder for changes and re-run '.build'
    watch: {
      styles: {
        files: ['**/*.scss'],
        tasks: ['sass']
      },
    },

    rsync: {
      options: {
          args: ["--verbose"],
          exclude: [".git*","*.scss","node_modules", "*.config.php"],
          recursive: true
      },
      production: {
          options: {
              src: "../",
              dest: "/var/www/html",
              host: "username@ipaddress",
              port: "22",
              // delete: true // Careful this option could cause data loss, read the docs!
          }
      }
    }
  });

  // Load the plugins that we need
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browser-sync');

  // Default explaination on how to use the tasks that follow.

  grunt.registerTask('default', 'How to use:', function() {
    grunt.log.writeln('');
    grunt.log.writeln('vivid');
    grunt.log.writeln('--------------------------------');
    grunt.log.writeln('');
    grunt.log.writeln('Commands');
    grunt.log.writeln('');
    grunt.log.writeln('- "grunt dev" - Watch for file changes');
    grunt.log.writeln('- "grunt .build" - Build a fresh version of the site');
    grunt.log.writeln('- "grunt deploy_staging" - Build a fresh version of the site and move front end code to staging');
    grunt.log.writeln('- "grunt package_front" - Package up the compiled site');
    return;
  });

  // .build task: clean .build directory then .build with middleman
  grunt.registerTask('build', 'Build the site', function() {
    grunt.task.run('shell:bower');
    grunt.task.run('bower_concat');
    grunt.task.run('sass');
    //grunt.task.run('copy');
  });

  // dev task: .build tasks -> run webserver -> watch for changes
  grunt.registerTask('dev', '', function() {
    grunt.task.run('build');
    //grunt.task.run('browserSync');
    grunt.task.run('watch');
  });


};
