import React from 'react'
import {
  GU,
  Modal,
  useViewport,
  IconConnect,
  textStyle,
  ButtonBase,
} from '@1hive/1hive-ui'
import { switchNetwork } from '@/networks'

type ChangeNetworkModalProps = {
  compact: any
  visible: boolean
  onClose: () => void
}

export default function ChangeNetworkModal({
  compact,
  visible,
  onClose,
}: ChangeNetworkModalProps) {
  const { width } = useViewport()

  const handleSwitch = async () => {
    try {
      await switchNetwork(100)
      onClose()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  return (
    <Modal
      padding={5 * GU}
      visible={visible}
      width={Math.min(60 * GU, width - 40)}
      onClose={onClose}
    >
      <div
        css={`
          display: flex;
          gap: 8px;
          align-items: center;
          ${textStyle('title2')}
        `}
      >
        {!compact ? (
          <>
            <IconConnect
              css={`
                font-size: 15px;
              `}
            />{' '}
          </>
        ) : null}
        You Must Change Networks
      </div>

      <p
        css={`
          ${textStyle('body2')}
          margin-top: 15px;
          margin-bottom: 15px;
        `}
      >
        {`We've detected that you need to switch your wallets network from `}
        <strong
          css={`
            font-weight: 800;
          `}
        >
          mainnet
        </strong>{' '}
        to{' '}
        <strong
          css={`
            font-weight: 800;
          `}
        >
          gnosis chain
        </strong>{' '}
        for this Dapp
      </p>

      <div
        css={`
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <ButtonBase
          onClick={handleSwitch}
          css={`
            height: 35px;
            padding: 0 15px;
            border: 1px solid #000;
            border-radius: 20px;
          `}
        >
          Switch
        </ButtonBase>
      </div>
    </Modal>
  )
}
