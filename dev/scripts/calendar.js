import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.momentLocalizer(moment);

export default class Calendar extends Component {
    render() {
      return (
        <div>
          <BigCalendar
            culture='en-GB'
            events={this.props.tasks}
            views={['month', 'week']} />
        </div>
      )
    }
 }


