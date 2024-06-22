export default {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    testTimeout: 30000, // 30 seconds timeout for each test
    reporters: [
      'default',
      ['jest-html-reporter', {
        "pageTitle": "Test Report",
        "outputPath": "test-report.html",
        "includeFailureMsg": true,
        "includeConsoleLog": true
      }]
    ],
  };  