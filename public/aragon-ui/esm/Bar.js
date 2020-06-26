import './slicedToArray-aa16fe4d.js';
import './unsupportedIterableToArray-0301d1c7.js';
import React from 'react';
import './_commonjsHelpers-97e6d7b1.js';
import { P as PropTypes } from './index-097535f1.js';
import './defineProperty-a0480c32.js';
import './toConsumableArray-af8653d9.js';
import _styled from 'styled-components';
import './getPrototypeOf-b2c50af3.js';
import './color.js';
import './components.js';
import './contains-component.js';
import './css.js';
import './dayjs.min-e57fb69a.js';
import './date.js';
import './miscellaneous.js';
import './environment.js';
import './font.js';
import './math-e6d0e93a.js';
import './characters.js';
import './format.js';
import './keycodes.js';
import './url.js';
import './web3.js';
import { BIG_RADIUS, GU } from './constants.js';
import './breakpoints.js';
import './springs.js';
import './text-styles.js';
import './theme-dark.js';
import './theme-light.js';
import { useTheme } from './Theme.js';
import { _ as _extends } from './extends-db4f0c26.js';
import { _ as _objectWithoutProperties } from './objectWithoutProperties-234758e1.js';
import { i } from './index-422d37c0.js';
import './isObject-ccc74451.js';
import './Viewport-05d16edd.js';
import { useLayout } from './Layout.js';

var BAR_PADDING = 2 * GU;

var _StyledDiv = _styled("div").withConfig({
  displayName: "Bar___StyledDiv",
  componentId: "sc-1bhv6q6-0"
})(["display:flex;justify-content:space-between;width:100%;height:100%;"]);

var _StyledDiv2 = _styled("div").withConfig({
  displayName: "Bar___StyledDiv2",
  componentId: "sc-1bhv6q6-1"
})(["display:flex;align-items:center;height:100%;padding-left:", "px;"], BAR_PADDING);

var _StyledDiv3 = _styled("div").withConfig({
  displayName: "Bar___StyledDiv3",
  componentId: "sc-1bhv6q6-2"
})(["display:flex;align-items:center;height:100%;padding-right:", "px;"], BAR_PADDING);

var _StyledDiv4 = _styled("div").withConfig({
  displayName: "Bar___StyledDiv4",
  componentId: "sc-1bhv6q6-3"
})(["border-radius:", "px;background:", ";border-style:solid;border-color:", ";border-width:", ";height:", "px;margin-bottom:", "px;"], function (p) {
  return p._css;
}, function (p) {
  return p._css2;
}, function (p) {
  return p._css3;
}, function (p) {
  return p._css4;
}, function (p) {
  return p._css5;
}, function (p) {
  return p._css6;
});

function Bar(_ref) {
  var children = _ref.children,
      primary = _ref.primary,
      secondary = _ref.secondary,
      props = _objectWithoutProperties(_ref, ["children", "primary", "secondary"]);

  var theme = useTheme();

  var _useLayout = useLayout(),
      layoutName = _useLayout.layoutName;

  var fullScreen = layoutName === 'small';
  var content = children || /*#__PURE__*/React.createElement(_StyledDiv, null, /*#__PURE__*/React.createElement(_StyledDiv2, null, /*#__PURE__*/React.createElement(i, {
    name: "Bar:primary"
  }, primary)), /*#__PURE__*/React.createElement(_StyledDiv3, null, /*#__PURE__*/React.createElement(i, {
    name: "Bar:secondary"
  }, secondary)));
  return /*#__PURE__*/React.createElement(i, {
    name: "Bar"
  }, /*#__PURE__*/React.createElement(_StyledDiv4, _extends({}, props, {
    _css: fullScreen ? 0 : BIG_RADIUS,
    _css2: theme.surface,
    _css3: theme.border,
    _css4: fullScreen ? '1px 0' : '1px',
    _css5: 8 * GU,
    _css6: 2 * GU
  }), content));
}

Bar.propTypes = {
  children: PropTypes.node,
  primary: PropTypes.node,
  secondary: PropTypes.node
};
Bar.PADDING = BAR_PADDING;

export default Bar;
//# sourceMappingURL=Bar.js.map
