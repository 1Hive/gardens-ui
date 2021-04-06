import React, { useMemo, useRef, useState } from 'react'
import {
  Button,
  ButtonBase,
  EthIdenticon,
  GU,
  IconCross,
  IconEdit,
  Split,
  shortenAddress,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

import ProfileForm from './ProfileForm'
import Tabs from './Tabs'
import usePicture from '../../hooks/usePicture'

const IMAGE_DIMENSION = 15 * GU
const CONTENT = [ProfileForm]
const TAB_ITEMS = ['Profile']

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
              margin-right: ${oneColumn ? 2 * GU : 0}px;
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
              <Button
                label="Change background"
                icon={<IconEdit />}
                display={oneColumn ? 'icon' : 'label'}
              />
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
                    z-index: 1;
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
                  {selectedTab === 0 &&
                    !profilePic.removed &&
                    (image || (imageInput?.files && imageInput?.files[0])) && (
                      <ButtonBase
                        onClick={onProfilePicRemoval}
                        css={`
                          position: absolute;
                          bottom: ${1 * GU}px;
                          background: ${theme.surface};
                          color: ${theme.contentSecondary};
                          padding: ${0.5 * GU}px;
                          border-radius: 50%;
                          display: flex;
                          box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.2);

                          &:active {
                            background: ${theme.surfacePressed};
                          }
                        `}
                      >
                        <IconCross />
                      </ButtonBase>
                    )}
                </div>
              </div>
              {!oneColumn && (
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
              )}
            </div>
          }
          invert={oneColumn ? 'vertical' : 'horizontal'}
        />
      </div>
    )
  }
)

export default EditProfile
