import React from "react";
import { useRouteMatch } from "react-router";
import Lottie from "react-lottie-player";

import beeAnimation from "@assets/lotties/bee-animation.json";
import gardensLoader from "@assets/lotties/gardens-loader.json";
import { is1HiveGarden } from "@/utils/garden-utils";
import { css, jsx } from "@emotion/react";
import styled from "styled-components";

const Wrapper = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export function GardenLoader() {
  return (
    <div
      css={css`
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 100%;
      `}
    >
      <Loader />
    </div>
  );
}

function Loader() {
  const match = useRouteMatch<{
    daoId;
  }>("/garden/:daoId");
  const is1Hive = is1HiveGarden(match?.params.daoId);

  return (
    <Wrapper>
      <Lottie
        animationData={is1Hive ? beeAnimation : gardensLoader}
        play
        loop
        style={{
          height: is1Hive ? 100 : 150,
          width: is1Hive ? 100 : 150,
        }}
      />
    </Wrapper>
  );
}

export default Loader;
