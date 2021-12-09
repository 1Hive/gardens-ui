import React from "react";
import {
  Button,
  GU,
  ProgressBar,
  textStyle,
  useTheme,
  useViewport,
} from "@1hive/1hive-ui";
import { animated } from "react-spring/renderprops";
import flowerSvg from "./assets/flower.svg";
import gardensLogoMark from "@assets/gardensLogoMark.svg";
import linesSvg from "./assets/lines.svg";
import { TransactionStatusType } from "../../../constants";

import { css, jsx } from "@emotion/react";

const AnimDiv = animated.div;
const AnimSection = animated.section;

type BoxBaseProps = {
  children: React.ReactNode;
  background: string;
  boxTransform;
  direction?: "column" | "column-reverse" | "row" | "row-reverse";
  opacity: any;
};

function BoxBase({
  children,
  background,
  boxTransform,
  direction = "column",
  opacity,
}: BoxBaseProps) {
  const theme = useTheme();
  const { below } = useViewport();
  const fullWidth = below("large");
  return (
    <AnimDiv
      style={{ opacity }}
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${fullWidth ? 0 : 8 * GU}px;
        background: ${background || theme.background.toString()};
      `}
    >
      <AnimSection
        style={{ transform: boxTransform }}
        css={css`
          flex-grow: 1;
          display: ${direction === "column" ? "grid" : "flex"};
          flex-direction: ${direction};
          align-items: center;
          justify-content: center;
          max-width: ${fullWidth ? "none" : `${128 * GU}px`};
          height: ${fullWidth ? "auto" : `${80 * GU}px`};
          background: ${theme.surface.toString()};
          border-radius: ${fullWidth ? 0 : 12}px;
          box-shadow: ${fullWidth
            ? "none"
            : "0px 10px 28px rgba(0, 0, 0, 0.15)"};
          position: ${fullWidth ? "absolute" : "static"};
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: ${fullWidth ? "auto" : "visible"};
        `}
      >
        {children}
      </AnimSection>
    </AnimDiv>
  );
}

type BoxProgressProps = {
  allSuccess: boolean;
  boxTransform;
  opacity;
  pending: number;
  transactionsStatus: [
    {
      name: string;
      status: TransactionStatusType;
      txHash?: any;
    }
  ];
};

export function BoxProgress({
  allSuccess,
  boxTransform,
  opacity,
  pending,
  transactionsStatus,
}: BoxProgressProps) {
  const theme = useTheme();
  const { below } = useViewport();
  const fullWidth = below("large");

  const progress = Math.max(
    0,
    Math.min(1, allSuccess ? 1 : pending / transactionsStatus.length)
  );

  return (
    <>
      <img
        src={flowerSvg}
        height="44"
        alt=""
        css={css`
          position: absolute;
          top: 32px;
          right: 32px;
          z-index: 2;
        `}
      />
      <BoxBase
        background="#8DE995"
        boxTransform={boxTransform}
        direction={fullWidth ? "column" : "row-reverse"}
        opacity={opacity}
      >
        <div
          css={css`
            width: ${fullWidth ? 100 : 50}%;
            height: ${fullWidth ? "430px" : "100%"};
            background: linear-gradient(300deg, #3dcb60 -17%, #8de995 280%);
            display: flex;
            align-items: center;
            justify-content: center;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            position: relative;
          `}
        >
          <img src={gardensLogoMark} height="272" alt="" />
          <div
            css={css`
              background: url(${linesSvg});
              background-repeat: no-repeat;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            `}
          />
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: ${fullWidth ? 100 : 50}%;
            height: ${fullWidth ? "auto" : "100%"};
            padding: ${6 * GU}px;
          `}
        >
          <h1
            css={css`
              margin-bottom: ${2 * GU}px;
              ${textStyle("title1")};
              width: 320px;
            `}
          >
            Gardens are digital economies
          </h1>
          <p
            css={css`
              ${textStyle("body1")}
              line-height: 2;
              color: ${theme.surfaceContentSecondary.toString()};
            `}
          >
            Providing a beautiful foundation for public communities to
            coordinate around shared resources in a bottom-up fashion.
          </p>

          {fullWidth && (
            <div
              css={css`
                padding-top: ${2 * GU}px;
              `}
            >
              <div
                css={css`
                  font-size: 13px;
                  font-weight: 800;
                  text-align: center;
                  padding-bottom: ${1 * GU}px;
                `}
              >
                {Math.round(progress * 100)}%
              </div>
              <ProgressBar value={progress} />
              <div
                css={css`
                  padding: ${3 * GU}px 0 ${3 * GU}px;
                  ${textStyle("body1")};
                  text-align: center;
                  color: ${theme.surfaceContentSecondary.toString()};
                `}
              >
                Launching your Garden
              </div>
            </div>
          )}
        </div>
      </BoxBase>
    </>
  );
}

type BoxReadyProps = {
  isFinalized;
  onOpenGarden: () => void;
  opacity;
  boxTransform;
};

export function BoxReady({
  isFinalized,
  onOpenGarden,
  opacity,
  boxTransform,
}: BoxReadyProps) {
  const { below } = useViewport();
  const fullWidth = below("large");
  const small = below("medium");

  return (
    <BoxBase background="#8DE995" opacity={opacity} boxTransform={boxTransform}>
      <div
        css={css`
          ${textStyle("title1")};
          text-align: center;
          padding: ${6 * GU}px ${small ? 6 * GU : 10 * GU}px;
        `}
      >
        <img
          src={gardensLogoMark}
          alt=""
          width="250"
          height="250"
          css={css`
            width: ${fullWidth ? 230 : 253}px;
            height: auto;
          `}
        />
        <div
          css={css`
            margin: ${6 * GU}px 0;
          `}
        >
          {isFinalized ? (
            <div>
              <p>
                <strong>All done!</strong>
              </p>
              <p
                css={css`
                  font-weight: 400;
                `}
              >
                Your garden is ready
              </p>
              <Button
                label="Get started"
                mode="strong"
                onClick={onOpenGarden}
                css={css`
                  margin-top: ${2 * GU}px;
                `}
              />
            </div>
          ) : (
            <div
              css={css`
                height: 152px;
              `}
            >
              Finalizing garden…
            </div>
          )}
        </div>
      </div>
    </BoxBase>
  );
}
