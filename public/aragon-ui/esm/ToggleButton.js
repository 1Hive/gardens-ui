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
import { BIG_RADIUS } from './constants.js';
import './breakpoints.js';
import './springs.js';
import './text-styles.js';
import './theme-dark.js';
import './theme-light.js';
import { useTheme } from './Theme.js';
import './extends-db4f0c26.js';
import './objectWithoutProperties-234758e1.js';
import './index-422d37c0.js';
import './isObject-ccc74451.js';
import './Viewport-05d16edd.js';
import './Layout.js';
import './FocusVisible.js';
import './ButtonBase.js';
import './IconPropTypes-73aade7b.js';
import './IconAddUser.js';
import './IconAlert.js';
import './IconAlignCenter.js';
import './IconAlignJustify.js';
import './IconAlignLeft.js';
import './IconAlignRight.js';
import './IconAragon.js';
import './IconArrowDown.js';
import './IconArrowLeft.js';
import './IconArrowRight.js';
import './IconArrowUp.js';
import './IconAtSign.js';
import './IconBlock.js';
import './IconBookmark.js';
import './IconCalendar.js';
import './IconCanvas.js';
import './IconCaution.js';
import './IconCenter.js';
import './IconChart.js';
import './IconChat.js';
import './IconCheck.js';
import './IconChip.js';
import './IconCircleCheck.js';
import './IconCircleMinus.js';
import './IconCirclePlus.js';
import './IconClock.js';
import './IconCloudDownload.js';
import './IconCloudUpload.js';
import './IconCoin.js';
import './IconConfiguration.js';
import './IconConnect.js';
import './IconConnection.js';
import './IconConsole.js';
import './IconCopy.js';
import './IconCross.js';
import './IconDashedSquare.js';
import IconDown from './IconDown.js';
import './IconDownload.js';
import './IconEdit.js';
import './IconEllipsis.js';
import './IconEnter.js';
import './IconEthereum.js';
import './IconExternal.js';
import './IconFile.js';
import './IconFilter.js';
import './IconFlag.js';
import './IconFolder.js';
import './IconGraph2.js';
import './IconGraph.js';
import './IconGrid.js';
import './IconGroup.js';
import './IconHash.js';
import './IconHeart.js';
import './IconHide.js';
import './IconHome.js';
import './IconImage.js';
import './IconInfo.js';
import './IconLabel.js';
import './IconLayers.js';
import './IconLeft.js';
import './IconLink.js';
import './IconLocation.js';
import './IconLock.js';
import './IconMail.js';
import './IconMaximize.js';
import './IconMenu.js';
import './IconMinimize.js';
import './IconMinus.js';
import './IconMove.js';
import './IconNoPicture.js';
import './IconPicture.js';
import './IconPlus.js';
import './IconPower.js';
import './IconPrint.js';
import './IconProhibited.js';
import './IconQuestion.js';
import './IconRefresh.js';
import './IconRemoveUser.js';
import './IconRight.js';
import './IconRotateLeft.js';
import './IconRotateRight.js';
import './IconSearch.js';
import './IconSettings.js';
import './IconShare.js';
import './IconSquareMinus.js';
import './IconSquarePlus.js';
import './IconSquare.js';
import './IconStarFilled.js';
import './IconStar.js';
import './IconSwap.js';
import './IconTarget.js';
import './IconToken.js';
import './IconTrash.js';
import './IconUnlock.js';
import IconUp from './IconUp.js';
import './IconUpload.js';
import './IconUser.js';
import './IconView.js';
import './IconVote.js';
import './IconWallet.js';
import './IconWarning.js';
import './IconWorld.js';
import './IconWrite.js';
import './IconZoomIn.js';
import './IconZoomOut.js';
import './Button.js';
import ButtonIcon from './ButtonIcon.js';

var _StyledButtonIcon = _styled(ButtonIcon).withConfig({
  displayName: "ToggleButton___StyledButtonIcon",
  componentId: "sc-1dx9ojh-0"
})(["display:flex;flex-direction:column;color:", ";& > div{display:flex;transform-origin:50% 50%;transition:transform 250ms ease-in-out;}"], function (p) {
  return p._css;
});

var _StyledDiv = _styled("div").withConfig({
  displayName: "ToggleButton___StyledDiv",
  componentId: "sc-1dx9ojh-1"
})(["transform:rotate3d(", ",0,0,180deg);transform:rotate3d(0,0,", ",180deg);"], function (p) {
  return p._css2;
}, function (p) {
  return p._css3;
});

var _StyledDiv2 = _styled("div").withConfig({
  displayName: "ToggleButton___StyledDiv2",
  componentId: "sc-1dx9ojh-2"
})(["transform:rotate3d(", ",0,0,180deg);transform:rotate3d(0,0,", ",180deg);"], function (p) {
  return p._css4;
}, function (p) {
  return p._css5;
});

function ToggleButton(_ref) {
  var onClick = _ref.onClick,
      opened = _ref.opened;
  var theme = useTheme();
  return /*#__PURE__*/React.createElement(_StyledButtonIcon, {
    label: opened ? 'Close' : 'Open',
    focusRingRadius: BIG_RADIUS,
    onClick: onClick,
    _css: theme.surfaceContentSecondary
  }, /*#__PURE__*/React.createElement(_StyledDiv, {
    _css2: opened ? 1 : 0,
    _css3: opened ? 1 : 0
  }, /*#__PURE__*/React.createElement(IconUp, {
    size: "small"
  })), /*#__PURE__*/React.createElement(_StyledDiv2, {
    _css4: opened ? -1 : 0,
    _css5: opened ? -1 : 0
  }, /*#__PURE__*/React.createElement(IconDown, {
    size: "small"
  })));
}

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired
};

export { ToggleButton };
//# sourceMappingURL=ToggleButton.js.map
