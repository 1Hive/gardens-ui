import React, { useCallback, useMemo } from "react";
import { Button, GU, Info } from "@1hive/1hive-ui";

import { useGardenState } from "@providers/GardenState";
import { useWallet } from "@providers/Wallet";

import AccountNotConnected from "@components/AccountNotConnected";
import { addressesEqual } from "@utils/web3-utils";
import BigNumber from "@lib/bigNumber";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function ProposalActions({
  proposal,
  onChangeSupport,
  onExecuteProposal,
  onRequestSupportProposal,
}) {
  const { account: connectedAccount } = useWallet();
  const { config, token } = useGardenState();
  const { stakeToken } = config.conviction;

  const { id, currentConviction, hasEnded, stakes, threshold } = proposal;

  const myStake = useMemo(
    () =>
      stakes.find(({ supporter }) =>
        addressesEqual(supporter.user.address, connectedAccount)
      ) || {
        amount: new BigNumber("0"),
      },
    [stakes, connectedAccount]
  );

  const didIStake = myStake?.amount.gt(0);

  const mode = useMemo(() => {
    if (hasEnded) {
      if (didIStake) {
        return "withdraw";
      }
      return null;
    }
    if (currentConviction.gte(threshold)) {
      if (proposal.statusData.open) {
        return "execute";
      }
    }
    if (didIStake) {
      return "update";
    }
    return "support";
  }, [currentConviction, didIStake, hasEnded, proposal.statusData, threshold]);

  const handleExecute = useCallback(() => {
    onExecuteProposal(id);
  }, [id, onExecuteProposal]);

  const buttonProps = useMemo(() => {
    if (!mode) {
      return null;
    }

    if (mode === "withdraw") {
      return {
        text: "Withdraw",
        action: onChangeSupport,
        mode: "normal",
        disabled: false,
      };
    }

    if (mode === "execute") {
      return {
        text: "Execute proposal",
        action: handleExecute,
        mode: "strong",
        disabled: false,
      };
    }

    if (mode === "update") {
      return {
        text: "Change support",
        action: onChangeSupport,
        mode: "normal",
      };
    }
    if (mode === "support") {
      return {
        text: "Support this proposal",
        action: onRequestSupportProposal,
        mode: "strong",
        disabled: !token.accountBalance.gt(0),
      };
    }
  }, [
    handleExecute,
    mode,
    onChangeSupport,
    onRequestSupportProposal,
    token.accountBalance,
  ]);

  if (mode) {
    if (!connectedAccount) {
      return <AccountNotConnected />;
    }
    return (
      <div>
        <Button
          wide
          mode={buttonProps.mode}
          onClick={buttonProps.action}
          disabled={buttonProps.disabled}
        >
          {buttonProps.text}
        </Button>
        {mode === "support" && buttonProps.disabled && (
          <Info
            mode="warning"
            css={css`
              margin-top: ${2 * GU}px;
            `}
          >
            The currently connected account does not hold any{" "}
            <strong>{stakeToken.symbol}</strong> tokens and therefore cannot
            participate in this proposal. Make sure your account is holding{" "}
            <strong>{stakeToken.symbol}</strong>.
          </Info>
        )}
      </div>
    );
  }

  return null;
}

export default ProposalActions;
