import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import PropTypes from 'prop-types'
import moment from 'moment'
import momentPropTypes from 'react-moment-proptypes'
import classNames from 'classnames'
import styles from './DayPicker.styl'

class DayPicker extends React.Component {
  constructor (props) {
    super(props)
    const date = moment()
    this.state = {
      active: date,
      keyPrefix: date.format('YYYY.MM')
    }
    this.renderWeek = this.renderWeek.bind(this)
    this.renderDay = this.renderDay.bind(this)
  }

  getDays (month) {
    const days = []
    const daysInMonth = month.daysInMonth()
    const offset = month.date(0).day() + 1
    if (offset < 7) {
      for (let i = 0; i < offset; i++) {
        days.push(null)
      }
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  getWeeks (days) {
    const weeks = []
    const weekCount = Math.ceil(days.length / 7)
    for (let i = 0; i < weekCount; i++) {
      weeks.push(days.slice(i * 7, (i + 1) * 7))
    }
    return weeks
  }

  getMonth () {
    return this.state.active.clone()
  }

  handlePreviousMonth () {
    const active = this.state.active.subtract(1, 'month')
    this.setState({
      active,
      keyPrefix: active.format('YYYY.MM')
    })
  }
  handleNextMonth () {
    const active = this.state.active.add(1, 'month')
    this.setState({
      active,
      keyPrefix: active.format('YYYY.MM')
    })
  }

  handleDayClick (event) {
    const dayOfMonth = event.nativeEvent.target.innerText
    const active = this.state.active.date(dayOfMonth)

    this.setState({ active })
    this.props.onDayClick(active)
  }

  renderDay (day, index, isToday, isActive) {
    const { keyPrefix } = this.state
    const mystyle = day
    ? (isToday
        ? 'day-today'
        : (isActive ? 'day-active' : 'day'))
    : 'day-empty'
    return (
      <td styleName={mystyle}
        key={`${keyPrefix}.day.${index}`}
        onClick={(e) => { this.handleDayClick(e) }}
      >{day || ''}</td>
    )
  }

  renderWeek (days, index) {
    const { keyPrefix, active } = this.state
    const today = moment()
    // console.log(`${active.year()} - ${active.month()} - ${active.date()}`)

    const isActive = days.map((d) => {
      return d && active.date() === d
    })
    const isToday = days.map((d) => {
      const day = moment(active)
      day.date(d)
      return day && today.year() === day.year() && today.month() === day.month() && today.date() === day.date()
    })
    const dayComponents = days.map((d, i) => {
      return (this.renderDay(d, i, isToday[i], isActive[i]))
    })
    return (
      <tr
        key={`${keyPrefix}.week.${index}`}
    >
        {dayComponents}
      </tr>
    )
  }

  render () {
    const month = this.getMonth()
    const days = this.getDays(month)
    const weeks = this.getWeeks(days)

    const { keyPrefix, active } = this.state
    const today = moment()
    // console.log(`${active.year()} - ${active.month()} - ${active.date()}`)

    const weekRows = weeks.map((days, i) => {
      return (this.renderWeek(days, i))
    })

    return (
      <div className='DayPicker' styleName='root'>
        <div styleName='header'>
          <div styleName='previous-month' onClick={() => { this.handlePreviousMonth() }}>◀</div>
          <div styleName='month-year'>{this.state.active.format('MMMM YYYY')}</div>
          <div styleName='next-month' onClick={() => { this.handleNextMonth() }}>▶</div>
        </div>
        <table>
          <thead>
            <tr>
              <th scope='col'>
                <abbr title='Sunday'>Sun</abbr>
              </th>
              <th scope='col'>
                <abbr title='Monday'>Mon</abbr>
              </th>
              <th scope='col'>
                <abbr title='Tuesday'>Tue</abbr>
              </th>
              <th scope='col'>
                <abbr title='Wednesday'>Wed</abbr>
              </th>
              <th scope='col'>
                <abbr title='Thursday'>Thu</abbr>
              </th>
              <th scope='col'>
                <abbr title='Friday'>Fri</abbr>
              </th>
              <th scope='col'>
                <abbr title='Saturday'>Sat</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {weekRows}
          </tbody>
        </table>
      </div>
    )
  }
}

DayPicker.propTypes = {
  onDayClick: PropTypes.func.isRequired
}
export default CSSModules(DayPicker, styles)
