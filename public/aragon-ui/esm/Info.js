import './slicedToArray-aa16fe4d.js';
import './unsupportedIterableToArray-0301d1c7.js';
import React, { useMemo } from 'react';
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
import { textStyle } from './text-styles.js';
import './theme-dark.js';
import './theme-light.js';
import { useTheme } from './Theme.js';
import { _ as _extends } from './extends-db4f0c26.js';
import { _ as _objectWithoutProperties } from './objectWithoutProperties-234758e1.js';

function getModeStyles(theme, mode) {
  if (mode === 'warning') {
    return {
      background: theme.warningSurface,
      borderColor: theme.warning,
      color: theme.warningSurfaceContent,
      titleColor: theme.warningSurfaceContent
    };
  }

  if (mode === 'error') {
    return {
      background: theme.negativeSurface,
      borderColor: theme.negative,
      color: theme.negativeSurfaceContent,
      titleColor: theme.negativeSurfaceContent
    };
  }

  if (mode === 'description') {
    return {
      background: theme.infoSurface,
      borderColor: theme.info,
      color: theme.surfaceContent,
      titleColor: theme.surfaceContentSecondary
    };
  }

  return {
    background: theme.infoSurface,
    borderColor: theme.info,
    color: theme.infoSurfaceContent,
    titleColor: theme.infoSurfaceContent
  };
}

var _StyledSection = _styled("section").withConfig({
  displayName: "Info___StyledSection",
  componentId: "sc-12553bt-0"
})(["color:", ";background:", ";border:1px solid ", ";padding:", "px;border-radius:", "px;word-wrap:break-word;", ";"], function (p) {
  return p._css;
}, function (p) {
  return p._css2;
}, function (p) {
  return p._css3;
}, function (p) {
  return p._css4;
}, BIG_RADIUS, function (p) {
  return p._css5;
});

var _StyledH = _styled("h1").withConfig({
  displayName: "Info___StyledH",
  componentId: "sc-12553bt-1"
})(["display:flex;align-items:center;color:", ";", ";margin-bottom:", "px;"], function (p) {
  return p._css6;
}, function (p) {
  return p._css7;
}, function (p) {
  return p._css8;
});

function Info(_ref) {
  var children = _ref.children,
      mode = _ref.mode,
      color = _ref.color,
      titleColor = _ref.titleColor,
      background = _ref.background,
      borderColor = _ref.borderColor,
      title = _ref.title,
      props = _objectWithoutProperties(_ref, ["children", "mode", "color", "titleColor", "background", "borderColor", "title"]);

  var theme = useTheme(); // Get styles from the current mode

  var modeStyles = useMemo(function () {
    var styles = getModeStyles(theme, mode);
    return styles;
  }, [mode, theme]);
  return /*#__PURE__*/React.createElement(_StyledSection, _extends({}, props, {
    _css: color || modeStyles.color,
    _css2: background || modeStyles.background,
    _css3: borderColor || modeStyles.borderColor,
    _css4: 2 * GU,
    _css5: textStyle('body3')
  }), title && /*#__PURE__*/React.createElement(_StyledH, {
    _css6: titleColor || modeStyles.titleColor,
    _css7: textStyle('label2'),
    _css8: 1 * GU
  }, title), children);
}

Info.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  mode: PropTypes.oneOf(['info', 'description', 'warning', 'error']),
  color: PropTypes.string,
  titleColor: PropTypes.string,
  background: PropTypes.string,
  borderColor: PropTypes.string
}; // Backward compatibility

function Warning(props) {
  return /*#__PURE__*/React.createElement(Info, _extends({
    mode: "warning"
  }, props));
}

Info.Action = Info;
Info.Permissions = Warning;
Info.Alert = Warning;

export default Info;
//# sourceMappingURL=Info.js.map
