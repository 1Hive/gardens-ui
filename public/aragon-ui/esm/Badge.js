import './slicedToArray-aa16fe4d.js';
import './unsupportedIterableToArray-0301d1c7.js';
import React from 'react';
import './_commonjsHelpers-97e6d7b1.js';
import './index-097535f1.js';
import './defineProperty-a0480c32.js';
import './toConsumableArray-af8653d9.js';
import 'styled-components';
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
import './constants.js';
import './breakpoints.js';
import './springs.js';
import './text-styles.js';
import './theme-dark.js';
import './theme-light.js';
import { useTheme } from './Theme.js';
import { _ as _extends } from './extends-db4f0c26.js';
import { _ as _objectWithoutProperties } from './objectWithoutProperties-234758e1.js';
import Tag from './Tag.js';

function deprecationWarning() {
  warnOnce('Badge', '"Badge" and its variants have been deprecated. Please use "Tag" instead.');
}
/* eslint-disable react/prop-types */


function Badge(_ref) {
  var background = _ref.background,
      foreground = _ref.foreground,
      shape = _ref.shape,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ["background", "foreground", "shape", "children"]);

  deprecationWarning();
  return /*#__PURE__*/React.createElement(Tag, _extends({
    background: background,
    color: foreground,
    size: shape === 'smalldisc' || shape === 'compact' ? 'small' : 'normal'
  }, props), children);
}

function BadgeNumber(_ref2) {
  var background = _ref2.background,
      children = _ref2.children,
      foreground = _ref2.foreground,
      label = _ref2.label,
      shape = _ref2.shape,
      small = _ref2.small,
      props = _objectWithoutProperties(_ref2, ["background", "children", "foreground", "label", "shape", "small"]);

  deprecationWarning();

  if (!children && typeof label === 'number') {
    return /*#__PURE__*/React.createElement(Badge, _extends({
      limitDigits: true,
      background: background,
      color: foreground,
      label: label,
      size: small ? 'small' : 'normal'
    }, props));
  }

  return /*#__PURE__*/React.createElement(Tag, _extends({
    count: true,
    background: background,
    color: foreground
  }, props), children || label);
}

function BadgeInfo(props) {
  return /*#__PURE__*/React.createElement(BadgeNumber, props);
}

function BadgeIdentity(props) {
  return /*#__PURE__*/React.createElement(Badge, _extends({}, props, {
    uppercase: false
  }));
}

function BadgeApp(props) {
  return /*#__PURE__*/React.createElement(Badge, _extends({}, props, {
    mode: "identifier"
  }));
}

function BadgeNotification(props) {
  var theme = useTheme();
  return /*#__PURE__*/React.createElement(BadgeNumber, _extends({
    background: String(theme.positive),
    foreground: String(theme.positiveContent)
  }, props));
}
/* eslint-enable react/prop-types */


Badge.Info = BadgeInfo;
Badge.Notification = BadgeNotification;
Badge.Identity = BadgeIdentity;
Badge.App = BadgeApp;

export default Badge;
export { BadgeNumber };
//# sourceMappingURL=Badge.js.map
