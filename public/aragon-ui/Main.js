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
var containsComponent = require('./contains-component.js');
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
var url = require('./url.js');
require('./web3.js');
require('./constants.js');
require('./breakpoints.js');
require('./springs.js');
require('./text-styles.js');
require('./theme-dark.js');
require('./theme-light.js');
var Theme = require('./Theme.js');
require('./extends-40571110.js');
require('./objectWithoutProperties-35db8ab0.js');
require('./isObject-bae30f44.js');
var Viewport = require('./Viewport-2b9ed1c1.js');
var Layout = require('./Layout.js');
require('./objectWithoutPropertiesLoose-1af20ad0.js');
require('react-dom');
require('./web-d0294535.js');
require('./getDisplayName-7ab6d318.js');
var index$2 = require('./index-9eb4668d.js');
var ToastHub = require('./ToastHub.js');
var index$1$1 = require('./index-66bfe545.js');
require('./RootPortal.js');
require('./taggedTemplateLiteral-227ed122.js');
var BaseStyles = require('./BaseStyles.js');
var ScrollView = require('./ScrollView.js');

var _initContainsComponen = containsComponent.initContainsComponent(),
    ContainsAppViewProvider = _initContainsComponen.Provider,
    useContainsAppView = _initContainsComponen.useContains,
    useRegisterAppView = _initContainsComponen.useRegister;

var _StyledScrollView = _styled__default(ScrollView.default).withConfig({
  displayName: "Main___StyledScrollView",
  componentId: "sc-1bd8xbf-0"
})(["height:100vh"]);

function Main(_ref) {
  var assetsUrl = _ref.assetsUrl,
      children = _ref.children,
      layout = _ref.layout,
      scrollView = _ref.scrollView,
      theme = _ref.theme;
  var containsAppView = useContainsAppView();

  if (layout === undefined) {
    layout = !containsAppView;
  }

  if (scrollView === undefined) {
    scrollView = !containsAppView;
  } // Optionally wrap `children` with Layout and/or ScrollView


  var content = layout ? /*#__PURE__*/React__default.createElement(Layout.default, null, children) : children;
  content = scrollView ?
  /*#__PURE__*/
  // The main ScrollView is set to 100vh by default (best for Aragon apps)
  // Disable `scrollView` and insert your own if needed.
  React__default.createElement(_StyledScrollView, null, content) : content;
  return /*#__PURE__*/React__default.createElement(index$1$1.Root.Provider, null, /*#__PURE__*/React__default.createElement(Viewport.Viewport.Provider, null, /*#__PURE__*/React__default.createElement(index$2.PublicUrl.Provider, {
    url: url.ensureTrailingSlash(assetsUrl)
  }, /*#__PURE__*/React__default.createElement(Theme.Theme, {
    theme: theme
  }, /*#__PURE__*/React__default.createElement(BaseStyles.default, null), /*#__PURE__*/React__default.createElement(ToastHub.default, null, content)))));
}

Main.propTypes = {
  assetsUrl: index.PropTypes.string,
  children: index.PropTypes.node,
  layout: index.PropTypes.bool,
  scrollView: index.PropTypes.bool,
  theme: Theme.Theme.propTypes.theme
};
Main.defaultProps = {
  assetsUrl: './aragon-ui/'
};
var Main$1 = (function (props) {
  return /*#__PURE__*/React__default.createElement(ContainsAppViewProvider, null, /*#__PURE__*/React__default.createElement(Main, props));
});

exports.default = Main$1;
exports.useContainsAppView = useContainsAppView;
exports.useRegisterAppView = useRegisterAppView;
//# sourceMappingURL=Main.js.map
