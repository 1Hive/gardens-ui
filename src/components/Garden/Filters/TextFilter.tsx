import React from 'react'
import { GU, SearchInput, textStyle } from '@1hive/1hive-ui'

type TextFilterProps = {
  text: string
  placeholder: string
  onChange: () => void
}

const TextFilter = ({ text, onChange, placeholder = '' }: TextFilterProps) => {
  return (
    <div>
      <label
        css={`
          display: block;
          ${textStyle('label2')};
          margin-bottom: ${1 * GU}px;
        `}
      >
        Name
      </label>
      <SearchInput
        value={text}
        onChange={onChange}
        placeholder={placeholder}
        wide
      />
    </div>
  )
}

export default React.memo(TextFilter)
