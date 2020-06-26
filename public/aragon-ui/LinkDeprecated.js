'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('./slicedToArray-91557a6f.js');
require('./unsupportedIterableToArray-d83f5963.js');
var React = require('react');
var React__default = _interopDefault(React);
require('./_commonjsHelpers-72d386ba.js');
require('./index-b0606964.js');
require('./defineProperty-0921a47c.js');
require('./toConsumableArray-058507b6.js');
require('styled-components');
require('./getPrototypeOf-ed0e3293.js');
require('./color.js');
require('./components.js');
require('./contains-component.js');
require('./css.js');
require('./dayjs.min-e07657bf.js');
require('./date.js');
require('./miscellaneous.js');
var environment = require('./environment.js');
require('./font.js');
require('./math-f4029164.js');
require('./characters.js');
require('./format.js');
require('./keycodes.js');
require('./url.js');
require('./web3.js');
require('./constants.js');
require('./breakpoints.js');
require('./springs.js');
require('./text-styles.js');
require('./theme-dark.js');
require('./theme-light.js');
require('./Theme.js');
var _extends$1 = require('./extends-40571110.js');
require('./objectWithoutProperties-35db8ab0.js');
require('./FocusVisible.js');
require('./ButtonBase.js');
var Link = require('./Link.js');

function ExternalLink(props) {
  environment.warnOnce('ExternalLink', 'ExternalLink is deprecated. Please use Link instead.');
  return /*#__PURE__*/React__default.createElement(Link.default, _extends$1._extends({
    external: true
  }, props));
}

function SafeLink(props) {
  environment.warnOnce('SafeLink', 'SafeLink is deprecated. Please use Link instead.');
  return /*#__PURE__*/React__default.createElement(Link.default, props);
}

exports.ExternalLink = ExternalLink;
exports.SafeLink = SafeLink;
//# sourceMappingURL=LinkDeprecated.js.map
