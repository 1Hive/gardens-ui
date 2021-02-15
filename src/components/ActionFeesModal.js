import React from 'react'
import {
  Button,
  Field,
  GU,
  h2,
  h3,
  Modal,
  textStyle,
  theme,
} from '@1hive/1hive-ui'
import iconFees from '../assets/iconFees.svg'

function ActionFeesModal({ showModal }) {
  return (
    <div>
      <Modal visible={showModal} title="Create post">
        <h2
          css={`
            ${textStyle('title2')};
          `}
        >
          Action fees
        </h2>
        <Field
          label="TRANSACTION FEES"
          css={`
            margin-top: ${3 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        />
        <div
          css={`
            text-align: left;
            ${textStyle('body2')}
          `}
        >
          Fees are required for your action to be submitted and the transaction
          to be processed. Part of them will go to the Ethereum network and the
          other part to Aragon Network, in compensation for dispute resolution
          services.
        </div>
        <div
          css={`
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            width: 100%;
            margin-top: ${GU * 3}px;
          `}
        >
          <div
            css={`
              flex: 0.25;
            `}
          >
            <img src={iconFees} alt="" />
          </div>
          <div
            css={`
              flex: 2;
              align-self: center;
              padding: 0 0 0 ${2 * GU}px;
            `}
          >
            <h3>Estimated fees</h3>
            <div
              css={`
                text-align: left;
                ${textStyle('body3')}
              `}
            >
              Ethereum network (withdraw from wallet balance)
            </div>
            <div
              css={`
                text-align: left;
                ${textStyle('body3')}
              `}
            >
              Action fee (withdraw from your staking balance)
            </div>
          </div>
          <div
            css={`
              flex: 0.5;
              align-self: center;
            `}
          >
            <div
              css={`
                text-align: right;
              `}
            >
              $3.765
            </div>
            <div
              css={`
                text-align: right;
              `}
            >
              $2.157
            </div>
            <div
              css={`
                text-align: right;
              `}
            >
              $1.805
            </div>
          </div>
          <div
            css={`
              flex: 0.65;
              align-self: center;
            `}
          >
            <div
              css={`
                text-align: right;
                height: ${3 * GU}px;
                margin-right: ${GU}px;
              `}
            >
              0.061 ETH
            </div>
            <div
              css={`
                text-align: right;
                height: ${3 * GU}px;
                margin-right: ${GU}px;
              `}
            >
              0.004 ETH
            </div>
            <div
              css={`
                text-align: right;
                height: ${3 * GU}px;
                margin-right: ${GU}px;
              `}
            >
              1.5 DAI
            </div>
          </div>
        </div>
        <Button
          label="Continue"
          mode="strong"
          type="submit"
          css={`
            margin-top: ${3.125 * GU}px;
            width: 100%;
          `}
        />
      </Modal>
    </div>
  )
}

export default ActionFeesModal
