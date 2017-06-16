import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'

import BigCalendar from 'react-big-calendar'
// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment)


class Calendar extends React.Component {
  render () {
    return (
      <BigCalendar
        style={{height: '420px'}}
        events={[]}
      />
    )
  }
}

export default Calendar; 
