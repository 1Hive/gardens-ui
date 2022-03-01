import React from 'react'
import { EthIdenticon, Tag } from '@1hive/1hive-ui'

const EthIdenticonIcon = ({ address, ...props }) => {
  return <EthIdenticon address={address} {...props} />
}

const TagElement = ({ text }) => {
  return <Tag>{text}</Tag>
}

export const HiveUiElements = {
  EthIdenticonIcon,
  TagElement,
}
