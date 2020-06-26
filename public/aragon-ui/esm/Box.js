import { _ as _slicedToArray } from './slicedToArray-aa16fe4d.js';
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
import { warnOnce } from './environment.js';
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
import { textStyle } from './text-styles.js';
import './theme-dark.js';
import './theme-light.js';
import { useTheme } from './Theme.js';
import { _ as _extends } from './extends-db4f0c26.js';
import { _ as _objectWithoutProperties } from './objectWithoutProperties-234758e1.js';
import { o, i } from './index-422d37c0.js';
import './isObject-ccc74451.js';
import './Viewport-05d16edd.js';
import { useLayout } from './Layout.js';

var _StyledDiv = _styled("div").withConfig({
  displayName: "Box___StyledDiv",
  componentId: "t9tl4y-0"
})(["position:relative;border-radius:", "px;border-style:solid;border-color:", ";border-width:", ";background:", ";color:", ";& + &{margin-top:", "px;}"], function (p) {
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

var _StyledH = _styled("h1").withConfig({
  displayName: "Box___StyledH",
  componentId: "t9tl4y-1"
})(["display:flex;align-items:center;height:", "px;padding:0 ", "px;border-bottom:1px solid ", ";color:", ";", ";"], function (p) {
  return p._css7;
}, function (p) {
  return p._css8;
}, function (p) {
  return p._css9;
}, function (p) {
  return p._css10;
}, function (p) {
  return p._css11;
});

var _StyledDiv2 = _styled("div").withConfig({
  displayName: "Box___StyledDiv2",
  componentId: "t9tl4y-2"
})(["padding:", "px;"], function (p) {
  return p._css12;
});

function Box(_ref) {
  var heading = _ref.heading,
      children = _ref.children,
      padding = _ref.padding,
      props = _objectWithoutProperties(_ref, ["heading", "children", "padding"]);

  var theme = useTheme();

  var _useInside = o('Split:primary'),
      _useInside2 = _slicedToArray(_useInside, 1),
      insideSplitPrimary = _useInside2[0];

  var _useLayout = useLayout(),
      layoutName = _useLayout.layoutName;

  var fullWidth = layoutName === 'small';
  var defaultPadding = (fullWidth ? 2 : insideSplitPrimary ? 5 : 3) * GU;

  if (padding === true) {
    warnOnce('Box:padding:true', 'Box: setting true on the padding prop is deprecated. Omit it, or set it to undefined instead.');
    padding = defaultPadding;
  }

  if (padding === false) {
    warnOnce('Box:padding:false', 'Box: setting false on the padding prop is deprecated. Use 0.');
    padding = 0;
  }

  var contentPadding = padding === undefined ? defaultPadding : padding;
  return /*#__PURE__*/React.createElement(i, {
    name: "Box"
  }, /*#__PURE__*/React.createElement(_StyledDiv, _extends({
    as: heading ? 'section' : 'div'
  }, props, {
    _css: fullWidth ? 0 : BIG_RADIUS,
    _css2: theme.border,
    _css3: fullWidth ? '1px 0' : '1px',
    _css4: theme.surface,
    _css5: theme.surfaceContent,
    _css6: 2 * GU
  }), heading && /*#__PURE__*/React.createElement(_StyledH, {
    _css7: 4 * GU,
    _css8: defaultPadding,
    _css9: theme.border,
    _css10: theme.surfaceContentSecondary,
    _css11: textStyle('label2')
  }, /*#__PURE__*/React.createElement(i, {
    name: "Box:heading"
  }, heading)), /*#__PURE__*/React.createElement(_StyledDiv2, {
    _css12: contentPadding
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(i, {
    name: "Box:content"
  }, children)))));
}

Box.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node,
  padding: PropTypes.oneOfType([PropTypes.number, // deprecated
  PropTypes.bool])
};

export default Box;
//# sourceMappingURL=Box.js.map
