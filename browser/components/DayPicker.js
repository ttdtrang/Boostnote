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
      month: date,
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
    return this.state.month.clone()
  }

  handlePreviousMonth () {
    const month = this.month.subtract(1, 'month')
    this.setState({
      month,
      keyPrefix: month.format('YYYY.MM')
    })
  }
  handleNextMonth () {
    const month = this.month.add(1, 'month')
    this.setState({
      month,
      keyPrefix: month.format('YYYY.MM')
    })
  }

  handleDayClick (event) {
    const dayOfMonth = event.nativeEvent.target.innerText
    const day = this.state.month.date(dayOfMonth)
    this.props.onDayClick(day)
  }

  renderDay (day, index) {
    const { keyPrefix } = this.state
    const { active } = this.props
    const currentMonth = this.state.month
    const today = moment()
    // const currentMonth = this.state.month
    const isToday = day &&
      currentMonth.year() == today.year() &&
      currentMonth.month() == today.month() &&
      day == today.date()
    const isActive = day &&
      active &&
      currentMonth.year() == active.year() &&
      currentMonth.month() == active.month() &&
      day == active.date()
    return (
      <td
        className={classNames('day', {
          active: isActive,
          empty: !day,
          today: isToday
        })}
        key={`${keyPrefix}.day.${index}`}
        onClick={(e) => { this.handleDayClick(e) }}
      >{day || ''}</td>
    )
  }

  renderWeek (days, index) {
    const { keyPrefix } = this.state
    const dayComponents = days.map((d, i) => {
      return (this.renderDay(d, i))
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

    const weekRows = weeks.map((days, i) => {
      return (this.renderWeek(days, i))
    })

    return (
      <div className='react-daypicker-root'>
        <div className='header'>
          <div className='previous-month' onClick={() => { this.handlePreviousMonth() }}>◀</div>
          <div className='month-year'>{this.state.month.format('MMMM YYYY')}</div>
          <div className='next-month' onClick={() => { this.handleNextMonth() }}>▶</div>
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
  active: momentPropTypes.momentObj,
  onDayClick: PropTypes.func.isRequired
}
export default CSSModules(DayPicker, styles)