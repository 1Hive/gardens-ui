import React, { useMemo, useRef, useState } from 'react'
import {
  Button,
  EthIdenticon,
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
import usePicture from '../../hooks/usePicture'

const IMAGE_DIMENSION = 16 * GU
const CONTENT = [ProfileForm, StakeManagment, ProposalSupporting]
const TAB_ITEMS = ['Profile', 'Stake management', 'Proposals supporting']

const EditProfile = React.forwardRef(
  (
    {
      coverPic,
      coverPicRemovalEnabled,
      onBack,
      onCoverPicChange,
      onCoverPicRemoval,
      profile,
    },
    coverPicInputRef
  ) => {
    const [selectedTab, setSelectedTab] = useState(0)
    const [profilePic, onProfilePicChange, onProfilePicRemoval] = usePicture(
      true
    )

    const theme = useTheme()
    const { name: layout } = useLayout()
    const { account, image, name } = profile || {}
    const oneColumn = layout === 'small' || layout === 'medium'

    const imageInput = useRef(null)

    const [Content, props] = useMemo(() => {
      const TabContent = CONTENT[selectedTab]

      const props = {}
      if (selectedTab === 0) {
        props.coverPic = coverPic
        props.profile = profile
        props.profilePic = profilePic
      }

      return [TabContent, props]
    }, [coverPic, profile, profilePic, selectedTab])

    return (
      <div>
        <div
          css={`
            display: flex;
            justify-content: flex-end;
            margin-bottom: ${2 * GU}px;
          `}
        >
          {selectedTab === 0 && coverPicRemovalEnabled && (
            <Button
              label="Remove cover"
              onClick={onCoverPicRemoval}
              icon={<IconCross />}
              display="icon"
              css={`
                border-radius: 50%;
                margin-right: ${2 * GU}px;
              `}
            />
          )}
          <div
            css={`
              position: relative;
            `}
          >
            <label htmlFor="coverPic">
              <input
                id="coverPic"
                type="file"
                accept="image/*"
                ref={coverPicInputRef}
                onChange={onCoverPicChange}
                css={`
                  opacity: 0;
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  width: 100%;
                  z-index: 1;
                  cursor: pointer;
                `}
              />
              <Button label="Change background" />
            </label>
          </div>
        </div>
        <Split
          primary={<Content onBack={onBack} {...props} />}
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
                  {!profilePic.removed &&
                  (image ||
                    (imageInput.current?.files &&
                      imageInput.current.files[0])) ? (
                    <img
                      src={
                        imageInput.current?.files && imageInput.current.files[0]
                          ? URL.createObjectURL(imageInput.current?.files[0])
                          : image
                      }
                      width={IMAGE_DIMENSION}
                      height={IMAGE_DIMENSION}
                      alt=""
                      css={`
                        border-radius: 50%;
                        object-fit: cover;
                      `}
                    />
                  ) : (
                    <EthIdenticon address={account} radius={100} scale={5} />
                  )}
                  {selectedTab === 0 && (
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

                        transition: opacity 0.2s ease;

                        &:hover {
                          opacity: 0.5;
                        }
                      `}
                    >
                      <label
                        htmlFor="profilePic"
                        css={`
                          width: 100%;
                          height: 100%;
                          display: flex;
                          flex-direction: column;
                          justify-content: center;

                          cursor: pointer;
                        `}
                      >
                        <input
                          id="profilePic"
                          type="file"
                          accept="image/*"
                          ref={imageInput}
                          onChange={onProfilePicChange}
                          css={`
                            visibility: hidden;
                            height: 0;
                          `}
                        />
                        <div>Change picture</div>
                      </label>
                    </div>
                  )}
                </div>
                {selectedTab === 0 &&
                  !profilePic.removed &&
                  (image || (imageInput?.files && imageInput?.files[0])) && (
                    <div
                      onClick={onProfilePicRemoval}
                      css={`
                        position: absolute;
                        bottom: ${1 * GU}px;
                        left: ${IMAGE_DIMENSION / 2 + 1 * GU}px;
                        color: ${theme.contentSecondary};
                        padding: ${0.5 * GU}px;
                        background: ${theme.surface};
                        border-radius: 50%;
                        display: flex;
                        cursor: pointer;

                        & :hover {
                          bacgkround: ${theme.surfacePressed};
                        }
                      `}
                    >
                      <IconCross />
                    </div>
                  )}
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
                  items={TAB_ITEMS}
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
)

export default EditProfile
