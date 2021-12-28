import React from 'react'

import { GU, SearchInput, textStyle } from '@1hive/1hive-ui'

const TextFilter = React.memo(({ text, onChange, placeholder = '' }) => {
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
})

export default TextFilter
