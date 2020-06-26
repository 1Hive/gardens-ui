'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('./slicedToArray-91557a6f.js');
require('./unsupportedIterableToArray-d83f5963.js');
var React = require('react');
var React__default = _interopDefault(React);
require('./_commonjsHelpers-72d386ba.js');
var index = require('./index-b0606964.js');
require('./defineProperty-0921a47c.js');
require('./toConsumableArray-058507b6.js');
var _styled = require('styled-components');
var _styled__default = _interopDefault(_styled);
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
var constants = require('./constants.js');
require('./breakpoints.js');
require('./springs.js');
require('./text-styles.js');
require('./theme-dark.js');
require('./theme-light.js');
require('./Theme.js');
var _extends = require('./extends-40571110.js');
var objectWithoutProperties = require('./objectWithoutProperties-35db8ab0.js');
require('./index-ecc57c9f.js');
require('./isObject-bae30f44.js');
require('./Viewport-2b9ed1c1.js');
require('./Layout.js');
require('./FocusVisible.js');
var ButtonBase = require('./ButtonBase.js');
var Button = require('./Button.js');

var _StyledButtonBase = _styled__default(ButtonBase.default).withConfig({
  displayName: "ButtonIcon___StyledButtonBase",
  componentId: "sc-14eq7o9-0"
})(["display:inline-flex;justify-content:center;align-items:center;width:", "px;height:", "px;&:active{background:rgba(220,234,239,0.3);}"], function (p) {
  return p._css;
}, function (p) {
  return p._css2;
});

function ButtonIcon(_ref) {
  var label = _ref.label,
      children = _ref.children,
      mode = _ref.mode,
      props = objectWithoutProperties._objectWithoutProperties(_ref, ["label", "children", "mode"]);

  if (mode !== undefined) {
    environment.warnOnce('ButtonIcon:mode', 'ButtonIcon: the mode prop is deprecated. Please use Button with the icon prop instead.');
  }

  if (mode === 'button') {
    return /*#__PURE__*/React__default.createElement(Button.default, _extends._extends({
      label: label,
      icon: children,
      display: "icon"
    }, props));
  }

  return /*#__PURE__*/React__default.createElement(_StyledButtonBase, _extends._extends({
    title: label
  }, props, {
    _css: 4 * constants.GU,
    _css2: 4 * constants.GU
  }), children);
}

ButtonIcon.propTypes = {
  label: index.PropTypes.string.isRequired,
  children: index.PropTypes.node.isRequired,
  // deprecated
  mode: index.PropTypes.oneOf(['button'])
};

exports.default = ButtonIcon;
//# sourceMappingURL=ButtonIcon.js.map
