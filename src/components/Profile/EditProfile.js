import React, { useState } from 'react'
import {
  Button,
  GU,
  IconCross,
  Split,
  shortenAddress,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

import ProfileForm from './ProfileForm'
import ProposalSupporting from './ProposalSupporting'
import StakeManagment from './StakesManagment'
import Tabs from './Tabs'
import { useProfile } from '../../providers/Profile'

const IMAGE_DIMENSION = 16 * GU
const CONTENT = [ProfileForm, StakeManagment, ProposalSupporting]

function EditProfile({ onBack }) {
  const [selectedTab, setSelectedTab] = useState(0)

  const theme = useTheme()
  const { name: layout } = useLayout()
  const { account, image, name } = useProfile()
  const oneColumn = layout === 'small' || layout === 'medium'

  const TabContent = CONTENT[selectedTab]

  return (
    <div>
      <div
        css={`
          text-align: right;
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Button label="Change background" />
      </div>
      <Split
        primary={<TabContent onBack={onBack} />}
        secondary={
          <div
            css={`
              position: relative;
              text-align: center;
            `}
          >
            <div
              css={`
                position: absolute;
                top: -${IMAGE_DIMENSION / 2}px;
                width: 100%;
              `}
            >
              <div
                css={`
                  display: inline-block;
                  position: relative;
                `}
              >
                <img
                  src={image}
                  width={IMAGE_DIMENSION}
                  height={IMAGE_DIMENSION}
                  alt=""
                  css={`
                    border-radius: 50%;
                  `}
                />
                <div
                  css={`
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: ${IMAGE_DIMENSION}px;
                    opacity: 0;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;

                    transition: opacity 0.2s ease;

                    &:hover {
                      opacity: 0.5;
                    }
                  `}
                >
                  <div
                    css={`
                      width: ${IMAGE_DIMENSION / 2}px;
                    `}
                  >
                    Change picture
                  </div>
                </div>
              </div>
              <div
                css={`
                  position: absolute;
                  bottom: ${1 * GU}px;
                  left: ${IMAGE_DIMENSION / 2 + 1 * GU}px;
                  color: ${theme.contentSecondary};
                  padding: ${0.5 * GU}px;
                  background: ${theme.surface};
                  border-radius: 50%;
                  display: flex;
                `}
              >
                <IconCross />
              </div>
            </div>
            <div
              css={`
                padding-top: ${IMAGE_DIMENSION / 2 + 3 * GU}px;
              `}
            >
              <div
                css={`
                  margin-bottom: ${3 * GU}px;
                `}
              >
                <div
                  css={`
                    ${textStyle('title4')}
                  `}
                >
                  {name}
                </div>
                <div
                  css={`
                    color: ${theme.contentSecondary};
                  `}
                >
                  {shortenAddress(account)}
                </div>
              </div>
              <Tabs
                items={['Profile', 'Stake Managment', 'Proposals supporting']}
                selected={selectedTab}
                onChange={setSelectedTab}
              />
            </div>
          </div>
        }
        invert={oneColumn ? 'vertical' : 'horizontal'}
      />
    </div>
  )
}

export default EditProfile
