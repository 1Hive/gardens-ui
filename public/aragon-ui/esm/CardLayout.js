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
import { _ as _extends } from './extends-db4f0c26.js';
import { _ as _objectWithoutProperties } from './objectWithoutProperties-234758e1.js';
import { i } from './index-422d37c0.js';
import './isObject-ccc74451.js';
import './Viewport-05d16edd.js';
import { useLayout } from './Layout.js';

var _StyledDiv = _styled("div").withConfig({
  displayName: "CardLayout___StyledDiv",
  componentId: "czuxpj-0"
})(["display:grid;grid-gap:", "px;grid-auto-flow:row;grid-template-columns:repeat( ", ",minmax(", "px,1fr) );grid-auto-rows:", ";align-items:start;padding:0 ", "px ", "px;margin:0 auto;"], function (p) {
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

function CardLayout(_ref) {
  var children = _ref.children,
      columnWidthMin = _ref.columnWidthMin,
      rowHeight = _ref.rowHeight,
      props = _objectWithoutProperties(_ref, ["children", "columnWidthMin", "rowHeight"]);

  var _useLayout = useLayout(),
      layoutName = _useLayout.layoutName;

  var fullWidth = layoutName === 'small';
  var gridAutoRowValue = rowHeight === 'auto' ? rowHeight : "".concat(rowHeight, "px");
  return /*#__PURE__*/React.createElement(i, {
    name: "CardLayout"
  }, /*#__PURE__*/React.createElement(_StyledDiv, _extends({}, props, {
    _css: 2 * GU,
    _css2: fullWidth ? 'auto-fit' : 'auto-fill',
    _css3: columnWidthMin,
    _css4: gridAutoRowValue,
    _css5: fullWidth ? 2 * GU : 0,
    _css6: 3 * GU
  }), children));
}

CardLayout.propTypes = {
  children: PropTypes.node,
  columnWidthMin: PropTypes.number,
  rowHeight: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number])
};
CardLayout.defaultProps = {
  columnWidthMin: 21 * GU,
  rowHeight: 21 * GU
};

export default CardLayout;
export { CardLayout };
//# sourceMappingURL=CardLayout.js.map
