// References for why config directly does not work
// https://stackoverflow.com/questions/35176036/es6-exporting-module-with-a-getter

import config, { obj } from './obj';

console.log('opened');

window.__config__ = config;
window.__obj__ = obj;