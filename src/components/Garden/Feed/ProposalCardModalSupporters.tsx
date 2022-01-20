import React, { useMemo } from 'react'
import { GU, Modal, textStyle, useViewport } from '@1hive/1hive-ui'
import { ProposalType } from '@/hooks/constants'
import { useGardenState } from '@/providers/GardenState'
import IdentityBadge from '@/components/IdentityBadge'
import { formatTokenAmount } from '@utils/token-utils'

type ModalSupportersProps = {
  proposal: ProposalType
  visible: boolean
  onClose: () => void
}

const ModalSupporters = ({
  proposal,
  visible,
  onClose,
}: ModalSupportersProps) => {
  const { width } = useViewport()
  const { config } = useGardenState()
  const { requestToken } = config.conviction

  const formatAmount = (amount: any) =>
    formatTokenAmount(amount, requestToken.decimals)

  // Show stakes with more than 0.01HNY and DESC
  const filteredSortedtakesByAmount = useMemo(() => {
    return proposal?.stakes
      .filter((stake) => formatAmount(stake?.amount) >= '0.01')
      .sort(
        (s1, s2) =>
          parseFloat(formatAmount(s2?.amount)) -
          parseFloat(formatAmount(s1?.amount))
      )
  }, [])

  return (
    <Modal
      padding={5 * GU}
      visible={visible}
      width={Math.min(55 * GU, width - 40)}
      onClose={onClose}
    >
      <div>
        <h3
          css={`
            ${textStyle('title2')}
            margin-top: 24px;
            margin-bottom: 8px;
          `}
        >
          Supporters
        </h3>

        <div
          style={{
            overflowY: 'scroll',
            height: '300px',
            paddingRight: '10px',
          }}
        >
          {filteredSortedtakesByAmount.map((stake, i) => (
            <div
              key={i}
              css={`
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 4px;
              `}
            >
              <IdentityBadge
                entity={stake?.supporter?.user?.address}
                compact
                badgeOnly
                css="cursor: pointer"
              />

              <span>
                {formatAmount(stake?.amount)} {requestToken.symbol}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default React.memo(ModalSupporters)
