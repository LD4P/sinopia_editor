module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['builds'],
    concat: {
      options: {
        stripBanners: true,
        banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      dist: {
        files: {
          'builds/bfe.js': [
            'build_support/mini_require.js',
            'src/bfe.js',
            'src/bfestore.js',
            'src/bfelogging.js',
            'src/bfelookups.js',
            'src/lib/aceconfig.js'
          ],
          'builds/bfe.css': ['src/css/bootstrap.css', 'src/css/typeahead.css'],
        }
      },
    },
    uglify: {
      options: {
        stripBanners: true,
        banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      static_mappings: {
        files: [
          {src: 'static/js/config.js', dest: 'builds/config.js'},
          {src: 'static/js/jsonld-vis.js', dest: 'builds/jsonld-vis.js'},
          {src: 'static/js/n3-browser.min.js', dest: 'builds/n3-browser.min.js'},
          {src: 'static/js/rdf-ext.js', dest: 'builds/rdf-et.js'},
          {src: 'static/js/rdfstore.js', dest: 'builds/rdfstore.js'},
          {src: 'static/js/require.js', dest: 'builds/require.js'},
          {src: 'static/js/short-uuid.min.js', dest: 'builds/short-uuid.min.js'},
          {src: 'static/js/twitter-typeahead-0.10.2.js', dest: 'builds/twitter-typeahead-0.10.2.js'}
        ]
      },
      dist: {
        files: [{
          src: 'builds/bfe.js',
          dest: 'builds/bfe.min.js'
        }]
      },
    },
    cssmin: {
      combine: {
        files: {
          'builds/bfe.min.css': ['builds/bfe.css']
        }
      }
    },
    eslint: {
        target: ['src/*.js']
    },
    run: {
      npm_jest: {
        cmd: 'npm',
        args: [
          'run',
          'test',
          '--silent'
        ]
      },
      npm_jest_cov: {
        cmd: 'npm',
        args: [
          'run',
          'jest-cov',
          '--silent'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin']);
  grunt.registerTask('test', [ 'default', 'run:npm_jest' ]);
  grunt.registerTask('test-cov', [ 'default', 'run:npm_jest_cov' ]);
};
