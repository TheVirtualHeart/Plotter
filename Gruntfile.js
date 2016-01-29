module.exports = function(grunt) {

	// load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');
  	grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

	grunt.initConfig({
		concat: {
			plotter: {
				options: {
					separator: ';\n'
				},
				src: [
					'src/**/*.js',
					'!src/pointObject.js'
				],
				dest: 'plotter.dev.js'
			}
		},
		uglify: {
			plotter: {
				options: {
					mangle: false
				},
				files: {
					'plotter.min.js': ['plotter.dev.js']
				}
			}
		},
		jsdoc2md: {
      		dist: {
        		src: 'src/*.js',
        		dest: 'documentation/README.md'
      		},
  		},
		watch: {
			js: {
				files: ["**/*.js"],
				tasks: ["concat", "uglify", "jsdoc2md"],
				options: {
					spawn: false
				}
			}
		}
	});

	grunt.registerTask('document', ['jsdoc2md']);
	grunt.registerTask('merge', ['concat']);
	grunt.registerTask('build', ['concat', 'uglify']);
	grunt.registerTask('default', ['watch']);
}