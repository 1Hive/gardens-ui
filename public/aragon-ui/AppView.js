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
require('./environment.js');
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
var objectWithoutProperties = require('./objectWithoutProperties-35db8ab0.js');
require('./index-ecc57c9f.js');
require('./isObject-bae30f44.js');
require('./Viewport-2b9ed1c1.js');
require('./Layout.js');
require('./objectWithoutPropertiesLoose-1af20ad0.js');
require('react-dom');
require('./web-d0294535.js');
require('./getDisplayName-7ab6d318.js');
require('./index-9eb4668d.js');
require('./ToastHub.js');
require('./index-66bfe545.js');
require('./RootPortal.js');
require('./taggedTemplateLiteral-227ed122.js');
require('./BaseStyles.js');
require('./ScrollView.js');
var Main = require('./Main.js');
require('./Text.js');
var AppBar = require('./AppBar.js');

var _StyledDiv = _styled__default("div").withConfig({
  displayName: "AppView___StyledDiv",
  componentId: "jnsnb0-0"
})(["display:flex;height:", ";flex-direction:column;align-items:stretch;justify-content:stretch;"], function (p) {
  return p.height;
});

var _StyledDiv2 = _styled__default("div").withConfig({
  displayName: "AppView___StyledDiv2",
  componentId: "jnsnb0-1"
})(["position:relative;z-index:2;flex-shrink:0;"]);

var _StyledDiv3 = _styled__default("div").withConfig({
  displayName: "AppView___StyledDiv3",
  componentId: "jnsnb0-2"
})(["position:relative;z-index:1;height:100%;overflow:auto;"]);

var _StyledDiv4 = _styled__default("div").withConfig({
  displayName: "AppView___StyledDiv4",
  componentId: "jnsnb0-3"
})(["display:flex;flex-direction:column;min-height:100%;padding:", ";"], function (_ref) {
  var padding = _ref.padding;
  return "".concat(padding, "px");
});

function AppView(_ref2) {
  var appBar = _ref2.appBar,
      children = _ref2.children,
      height = _ref2.height,
      padding = _ref2.padding,
      tabs = _ref2.tabs,
      title = _ref2.title,
      props = objectWithoutProperties._objectWithoutProperties(_ref2, ["appBar", "children", "height", "padding", "tabs", "title"]);

  // Notify Main that it contains this AppView
  Main.useRegisterAppView();
  return /*#__PURE__*/React__default.createElement(_StyledDiv, _extends$1._extends({
    height: height
  }, props), /*#__PURE__*/React__default.createElement(_StyledDiv2, null, appBar || /*#__PURE__*/React__default.createElement(AppBar.default, {
    title: title,
    tabs: tabs
  })), /*#__PURE__*/React__default.createElement(_StyledDiv3, null, /*#__PURE__*/React__default.createElement(_StyledDiv4, {
    padding: padding
  }, children)));
}

AppView.defaultProps = {
  title: '',
  padding: 30,
  height: '100vh'
};
AppView.propTypes = {
  appBar: index.PropTypes.element,
  title: index.PropTypes.string,
  children: index.PropTypes.node,
  padding: index.PropTypes.number,
  height: index.PropTypes.string,
  tabs: index.PropTypes.element
};

exports.default = AppView;
//# sourceMappingURL=AppView.js.map
