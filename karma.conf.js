// karma.conf.js

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/test.ts'
    ],
    preprocessors: {
      'src/test.ts': ['@angular-devkit/build-angular']
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: false,
        timeoutInterval: 10000
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    browsers: ['ChromeHeadless'],
    restartOnFileChange: true
  });
};
