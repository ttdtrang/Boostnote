import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './SwitchButton.styl'
import { isDate } from 'date-fns';

const DateButton = ({
  onClick, isDateActive
}) => (
  <button styleName={isDateActive ? 'active-button' : 'non-active-button'} onClick={onClick}>
    <img src={isDateActive
        ? '../resources/icon/icon-calendar-active.svg'
        : '../resources/icon/icon-calendar.svg'
    }
    />
    <span styleName='tooltip'>Date</span>
  </button>
)

DateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isDateActive: PropTypes.bool.isRequired
}

export default CSSModules(DateButton, styles)
