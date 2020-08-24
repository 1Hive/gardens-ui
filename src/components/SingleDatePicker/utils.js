import { dayjs } from '../../utils/date-utils'

function handleSingleDateSelect({ date, initialDate }) {
  // clicking on initial date resets it, so it can be re-picked
  if (initialDate && dayjs(date).isSame(initialDate, 'day')) {
    return {
      initialDate: null,
    }
  }

  return {
    [(initialDate = 'initialDate')]: date,
  }
}

export default handleSingleDateSelect
