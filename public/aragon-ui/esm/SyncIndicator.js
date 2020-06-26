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
import { GU } from './constants.js';
import './breakpoints.js';
import './springs.js';
import './text-styles.js';
import './theme-dark.js';
import './theme-light.js';
import './Theme.js';
import { _ as _extends } from './extends-db4f0c26.js';
import { _ as _objectWithoutProperties } from './objectWithoutProperties-234758e1.js';
import './index-422d37c0.js';
import './isObject-ccc74451.js';
import './Viewport-05d16edd.js';
import './objectWithoutPropertiesLoose-9606ad13.js';
import 'react-dom';
import './web-a351a0a1.js';
import LoadingRing from './LoadingRing.js';
import './ToastHub.js';
import './index-a705d0f4.js';
import './RootPortal.js';
import FloatIndicator from './FloatIndicator.js';

var _StyledDiv = _styled("div").withConfig({
  displayName: "SyncIndicator___StyledDiv",
  componentId: "rvvma9-0"
})(["margin-left:", "px;"], function (p) {
  return p._css;
});

var _StyledSpan = _styled("span").withConfig({
  displayName: "SyncIndicator___StyledSpan",
  componentId: "rvvma9-1"
})(["white-space:nowrap"]);

function SyncIndicator(_ref) {
  var children = _ref.children,
      label = _ref.label,
      shift = _ref.shift,
      visible = _ref.visible,
      props = _objectWithoutProperties(_ref, ["children", "label", "shift", "visible"]);

  return /*#__PURE__*/React.createElement(FloatIndicator, _extends({
    visible: visible,
    shift: shift
  }, props), /*#__PURE__*/React.createElement(LoadingRing, null), /*#__PURE__*/React.createElement(_StyledDiv, {
    _css: 1.5 * GU
  }, children || /*#__PURE__*/React.createElement(_StyledSpan, null, label, " \uD83D\uDE4F")));
}

SyncIndicator.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  shift: PropTypes.number,
  visible: PropTypes.bool
};
SyncIndicator.defaultProps = {
  label: 'Syncing data…'
};

export default SyncIndicator;
//# sourceMappingURL=SyncIndicator.js.map
