import React, {Component} from 'react';
import Moment from 'moment-timezone';

export default class Timezone extends Component {

	render() {

		const ts = this.props.ts;
		const zone = Moment.tz.guess();
		const tz = Moment.tz(zone).zoneAbbr();

		return (
			<div className='glossary'>
				<h2 className='center'><span className='editMode'>Transaction date/time converted to your local timezone</span>{`${this.props.local} ${tz}`}</h2>
				<h2 style={{ marginBottom: 0 }} className='center'>Transaction Timezone for Date and Times</h2>
				<h3 style={{ margin: '20px 0' }}className='center'>All date/time's are based on the Coordinated Universal Time indicated by UTC.</h3>
				<ul>
					<strong>Coordinated Universal Time (UTC)</strong>
					<li>Coordinated Universal Time (abbreviated to UTC) is the primary time standard by which the world regulates clocks and time. It is within about 1 second of mean solar time at 0° longitude, and is not adjusted for daylight saving time.</li>
					<li>A transaction's date and time is based on UTC to accurately record when the transaction occurred independent from a specific timezone.</li>
					<li>The UTC date and time can be easily converted to a local timezone.</li>
				</ul>
			</div>
		)
	}
}
