import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { eachDayOfInterval, GU } from '@1hive/1hive-ui'
import MonthDay from './MonthDay'
import { Selector } from './components'
import { dayjs } from '../../utils/date-utils'

function DatePicker({
  initialDate,
  onSelect,
  hideYearSelector,
  yearFormat,
  hideMonthSelector,
  monthFormat,
  monthYearFormat,
  hideWeekDays,
  weekDayFormat,
  validFromToday,
  ...props
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate)

  const setDate = ({ year, add }) => event => {
    setSelectedDate(
      dayjs(selectedDate)
        .startOf('month')
        [add ? 'add' : 'subtract'](1, year ? 'year' : 'month')
        .toDate()
    )
  }

  const today = dayjs()
    .startOf('day')
    .toDate()

  const selectedDayjs = dayjs(selectedDate || today)

  const isSelected = day => {
    if (initialDate) {
      return day.isSame(initialDate, 'day')
    }
    return false
  }

  return (
    <div
      css={`
        display: grid;
      `}
      {...props}
    >
      {!hideYearSelector && (
        <Selector
          prev={setDate({ year: true, add: false })}
          next={setDate({ year: true, add: true })}
          small
        >
          {selectedDayjs.format(yearFormat)}
        </Selector>
      )}

      {!hideMonthSelector && (
        <Selector
          prev={setDate({ year: false, add: false })}
          next={setDate({ year: false, add: true })}
        >
          {selectedDayjs.format(
            !hideYearSelector ? monthFormat : monthYearFormat
          )}
        </Selector>
      )}

      <div
        css={`
          display: grid;
          grid-template: auto / repeat(7, 1fr);
          width: ${31.5 * GU}px;
        `}
      >
        {!hideWeekDays &&
          eachDayOfInterval({
            start: selectedDayjs.startOf('week'),
            end: selectedDayjs.endOf('week'),
          }).map(day => {
            const dayJs = dayjs(day)
            return (
              <MonthDay key={dayJs.format('dd')} weekDay>
                {dayJs.format(weekDayFormat)}
              </MonthDay>
            )
          })}

        {eachDayOfInterval({
          start: selectedDayjs.startOf('month').startOf('week'),
          end: selectedDayjs.endOf('month').endOf('week'),
        }).map(day => {
          const dayJs = dayjs(day)
          return (
            <MonthDay
              key={dayJs.valueOf()}
              disabled={
                !selectedDayjs.isSame(dayJs, 'month') ||
                (validFromToday && dayJs.isBefore(today))
              }
              selected={isSelected(dayJs)}
              today={dayJs.isSame(today, 'day')}
              onClick={() => onSelect(dayJs.toDate())}
            >
              {dayJs.format(props.dayFormat)}
            </MonthDay>
          )
        })}
      </div>
    </div>
  )
}

DatePicker.propTypes = {
  /**
   * Initial date - calendar will start from here.
   */
  initialDate: PropTypes.instanceOf(Date),

  // Events
  onSelect: PropTypes.func,

  // Visibility
  hideMonthSelector: PropTypes.bool,
  hideWeekDays: PropTypes.bool,
  hideYearSelector: PropTypes.bool,

  // Formatting
  dayFormat: PropTypes.string,
  monthFormat: PropTypes.string,
  monthYearFormat: PropTypes.string,
  weekDayFormat: PropTypes.string,
  yearFormat: PropTypes.string,

  validFromToday: PropTypes.bool,
}

DatePicker.defaultProps = {
  onSelect: () => {},
  dayFormat: 'D',
  monthFormat: 'MMMM',
  monthYearFormat: 'MMMM YYYY',
  weekDayFormat: 'ddd',
  yearFormat: 'YYYY',
}

export default DatePicker
