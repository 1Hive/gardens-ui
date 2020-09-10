import React, { useCallback, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Popover, GU, RADIUS, useTheme } from '@1hive/1hive-ui'
import DatePicker from './DatePicker'
import Labels from './Labels'
import { SINGLE_DATE } from './consts'
import { dayjs, dateFormat } from '../../utils/date-utils'
import handleSingleDateSelect from './utils'

function SingleDatePicker({
  format,
  initialDate,
  onChange,
  validFromToday = false,
}) {
  const theme = useTheme()
  const labelsRef = useRef()
  const [showPicker, setShowPicker] = useState(false)

  const handlePopoverClose = useCallback(() => setShowPicker(false), [])

  const handleLabelsClick = useCallback(() => {
    setShowPicker(show => !show)
  }, [])

  const handleDateClick = useCallback(
    date => {
      setShowPicker(false)
      if (date) {
        const result = handleSingleDateSelect({
          date,
          initialDate,
        })
        onChange(result.initialDate)
      }
    },
    [onChange, initialDate]
  )

  const labelProps = useMemo(() => {
    const _initialDate = initialDate
    return {
      startText: _initialDate ? dateFormat(_initialDate, format) : SINGLE_DATE,
    }
  }, [format, initialDate])

  return (
    <div>
      <Labels
        ref={labelsRef}
        enabled={showPicker}
        hasSetDates={Boolean(initialDate)}
        onClick={handleLabelsClick}
        {...labelProps}
      />
      <Popover
        closeOnOpenerFocus
        onClose={handlePopoverClose}
        opener={labelsRef.current}
        placement="bottom-start"
        visible={showPicker}
        css={`
          min-width: ${37.5 * GU + 2}px;
          border: 0;
          filter: none;
          background: none;
          margin: 2px 0 0 0;
          width: 100%;
        `}
      >
        <div
          css={`
            padding: ${2.5 * GU}px ${3 * GU}px ${3 * GU}px;
            border: 1px solid ${theme.border};
            border-radius: ${RADIUS}px;
            background: ${theme.surface};
          `}
        >
          <div
            css={`
              display: flex;
              flex-direction: row;
              align-items: baseline;
            `}
          >
            <DatePicker
              initialDate={dayjs(initialDate || undefined)
                .subtract(0, 'month')
                .toDate()}
              onSelect={handleDateClick}
              validFromToday={validFromToday}
            />
          </div>

          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: ${GU * 2.25}px;
            `}
          />
        </div>
      </Popover>
    </div>
  )
}

SingleDatePicker.propTypes = {
  format: PropTypes.string,
  initialDate: PropTypes.string,
  onChange: PropTypes.func,
}

SingleDatePicker.defaultProps = {
  format: 'MM/DD/YYYY',
  onChange: () => {},
}

export default SingleDatePicker
