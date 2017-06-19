import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import NoteCard from './noteCard.js';

import BigCalendar from 'react-big-calendar'
// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment)

class Calendar extends React.Component {
	constructor() {
		super();
		this.state = {
			current: null
		}
	}
 	render () {
 		console.log('o', this.props.notes)
 		const events = this.props.notes.map((item) => {
		  item.title = item.date;
		  item.allDay = true;
		  item.start = new Date(item.date);
		  item.end = new Date(item.date);
		  return item
  	})
  	console.log('n', events)
    return (
    	<div className="big-calender">
    	{this.state.current
	      	? <NoteCard note={this.state.current} key={this.state.current.title} removeNote={() => this.setState({ current: null })} />
	      	: null}
	      <BigCalendar
	        style={{height: '420px', width: '50%', margin: '50px'}}
	        events={events}
	        onSelectEvent={event => {
	        	console.log(event)
	        	this.setState({
	        		current: event
	        	})
	        }}
	      />
      	</div>
    )
  }
}

export default Calendar; 





