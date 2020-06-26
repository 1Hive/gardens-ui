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
import { warnOnce } from './environment.js';
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
import { textStyle } from './text-styles.js';
import './theme-dark.js';
import './theme-light.js';
import { useTheme } from './Theme.js';
import { _ as _extends } from './extends-db4f0c26.js';
import { _ as _objectWithoutProperties } from './objectWithoutProperties-234758e1.js';
import { i } from './index-422d37c0.js';
import './FocusVisible.js';
import './ButtonBase.js';
import './getDisplayName-d5fc7707.js';
import { u as usePublicUrl } from './index-de84a7ef.js';
import Card from './Card.js';

var illustrationDefault = "48526b4ed811c6ff.png";

var _StyledCard = _styled(Card).withConfig({
  displayName: "EmptyStateCard___StyledCard",
  componentId: "sc-1c9c9zj-0"
})(["display:grid;grid-template-columns:1fr;grid-template-rows:", "px 1fr auto;height:", "px;padding:", "px;text-align:center;"], function (p) {
  return p._css;
}, function (p) {
  return p._css2;
}, function (p) {
  return p._css3;
});

var _StyledDiv = _styled("div").withConfig({
  displayName: "EmptyStateCard___StyledDiv",
  componentId: "sc-1c9c9zj-1"
})(["display:flex;justify-content:center;overflow:hidden;"]);

var _StyledDiv2 = _styled("div").withConfig({
  displayName: "EmptyStateCard___StyledDiv2",
  componentId: "sc-1c9c9zj-2"
})(["color:", ";", ";"], function (p) {
  return p._css4;
}, function (p) {
  return p._css5;
});

var EmptyStateCard = React.memo(function EmptyStateCard(_ref) {
  var action = _ref.action,
      icon = _ref.icon,
      illustration = _ref.illustration,
      text = _ref.text,
      props = _objectWithoutProperties(_ref, ["action", "icon", "illustration", "text"]);

  var theme = useTheme();
  var publicUrl = usePublicUrl();

  if (icon !== undefined) {
    warnOnce('EmptyStateCard:icon', 'EmptyStateCard: the `icon` prop is deprecated, please use `illustration` instead.');

    if (illustration === undefined) {
      illustration = icon;
    }
  } // default illustration


  if (!illustration) {
    illustration = /*#__PURE__*/React.createElement("img", {
      src: publicUrl + illustrationDefault,
      alt: "",
      height: 20 * GU
    });
  }

  return /*#__PURE__*/React.createElement(i, {
    name: "EmptyStateCard"
  }, /*#__PURE__*/React.createElement(_StyledCard, _extends({}, props, {
    _css: 20 * GU,
    _css2: 42 * GU,
    _css3: 2 * GU
  }), /*#__PURE__*/React.createElement(_StyledDiv, null, illustration), /*#__PURE__*/React.createElement(_StyledDiv2, {
    _css4: theme.surfaceContent,
    _css5: textStyle('title4')
  }, text), /*#__PURE__*/React.createElement("div", null, action)));
});
EmptyStateCard.propTypes = {
  action: PropTypes.node,
  illustration: PropTypes.node,
  text: PropTypes.node.isRequired,
  // deprecated
  icon: PropTypes.node
};

export default EmptyStateCard;
//# sourceMappingURL=EmptyStateCard.js.map
