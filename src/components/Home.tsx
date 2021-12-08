import React, { useCallback, useState } from "react";
import { GU, useToast } from "@1hive/1hive-ui";
import { useGardens } from "@/providers/Gardens";
import { useNodeHeight } from "@hooks/useNodeHeight";

import GardensFilters from "./GardensFilters";
import GardensList from "./GardensList";
import LandingBanner from "./LandingBanner";
import { useWallet } from "@providers/Wallet";
import MultiModal from "./MultiModal/MultiModal";
import ConnectWalletScreens from "./MultiModal/ConnectWallet/ConnectWalletScreens";
import Loader from "./Loader";
import Onboarding from "./Onboarding";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function Home() {
  const { height, customRef } = useNodeHeight();
  const { externalFilters, internalFilters, gardens, loading } = useGardens();
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);

  const { account } = useWallet();
  const toast = useToast();

  const handleOnboardingOpen = useCallback(() => {
    if (!account) {
      setConnectModalVisible(true);
      return;
    }
    setOnboardingVisible(true);
  }, [account]);

  const handleOnboardingClose = useCallback(() => {
    setOnboardingVisible(false);
    toast("Saved!");
  }, [toast]);

  const handleCloseModal = useCallback(() => {
    setConnectModalVisible(false);
  }, []);

  return (
    <div>
      <LandingBanner ref={customRef} onCreateGarden={handleOnboardingOpen} />
      <div
        css={css`
          padding: 0 ${2 * GU}px;
          margin-top: ${height + 3 * GU}px;
        `}
      >
        <GardensFilters
          itemsSorting={externalFilters.sorting.items}
          nameFilter={internalFilters.name.filter}
          sortingFilter={externalFilters.sorting.filter}
          onNameFilterChange={internalFilters.name.onChange}
          onSortingFilterChange={externalFilters.sorting.onChange}
        />
        <div
          css={css`
            margin: ${5 * GU}px 0;
          `}
        >
          {!loading ? <GardensList gardens={gardens} /> : <Loader />}
        </div>
      </div>
      <Onboarding onClose={handleOnboardingClose} visible={onboardingVisible} />
      <MultiModal visible={connectModalVisible} onClose={handleCloseModal}>
        <ConnectWalletScreens
          onClose={handleCloseModal}
          onSuccess={handleOnboardingOpen}
        />
      </MultiModal>
    </div>
  );
}

export default Home;
