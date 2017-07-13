require('../less/all.less');
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/css/bootstrap-theme.css');
const testModule = require('jsmp-infra-test/build');

const window = window; // eslint-disable-line no-use-before-define
const document = document; // eslint-disable-line no-use-before-define

window.jQuery = require('jquery/dist/jquery.js');
window.bootstrap = require('bootstrap/dist/js/bootstrap.js');

const btn = document.getElementById('hello-world-btn');

btn.addEventListener('click', () => {
  console.log(testModule.changeRegister('I am updated to uppercase string', 'upper')); // eslint-disable-line no-console
});
