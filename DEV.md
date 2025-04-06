Development
==========================

Wikiploy is a Node.js project and is configured to use VSCode for development.

## Prepararion

### Install Nodejs
Obviously you'll need [Node.js](https://nodejs.org/en).
Node 14+ should be fine for Wikiploy alone, but Puppeteer has certain expectations and 16+ is a better choice. In any case, I would recommend using the latest LTS version of Node.

Note that you can use [NVM-windows](https://github.com/coreybutler/nvm-windows) if you need multiple Node.js versions installed on Windows.

### Install modules
Run first `npm i`.
You might want to run `npm up` to update some scripts too.

Recomended global modules/tools:
```bash
npm install -g eslint
npm install -g mocha
```
You mostly need above if you will be using your shell (command line).

## Running tests
To run tests in your shell you can use npm: `npm test`. Or just run `mocha`.

Better yet install [VSCode](https://code.visualstudio.com/download) and the recommended extenstions. It will make things easier (especially for debugging tests).

In VSC, you should see a laboratory flask icon on the sidebar. From there, you can run individual tests or all at once.
Note that you might need to reload the testing sidebar to see all tests, especially after adding new test files.
To view output of individual tests use the testing sidebar. Navigate to the test and click on it.

You can also run (and debug) each test case directly from a test file. You might need to press reload in the sidebar if you don't see buttons to run and debug tests.

## PHP tests

```powershell
#composer update
composer install
composer test
```

## Publishing

Step 1. Check and update versions.
```bash
# check mwn updates and update test assets
php ./check_up.php
# force update of assets
php ./check_up.php --force
# npm up
# npm test
```

Step 2. Test MWN:
 - Run `ploy_test_lite.js`.

Step 3. Publish.
```bash
npm publish
```
