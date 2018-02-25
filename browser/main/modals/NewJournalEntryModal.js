import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NewNoteModal.styl'
import dataApi from 'browser/main/lib/dataApi'
import { hashHistory } from 'react-router'
import ee from 'browser/main/lib/eventEmitter'
import ModalEscButton from 'browser/components/ModalEscButton'
import AwsMobileAnalyticsConfig from 'browser/main/lib/AwsMobileAnalyticsConfig'
import DatePicker from 'browser/components/DatePicker.js'

class NewJournalEntryModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedDate: new Date()
    }
  }

  handleCloseButtonClick (e) {
    this.props.close()
  }

  handleDayFocus (day) {
    this.setState({selectedDate: day})
    console.log(day)
  }

  handleDayMouseEnter (day) {
    console.log(day)
  }

  handleDayMouseDown (day) {
    const targetDate = this.state.selectedDate
    const JOURNAL_TITLE = targetDate.toDateString({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    AwsMobileAnalyticsConfig.recordDynamicCustomEvent('ADD_MARKDOWN')
    AwsMobileAnalyticsConfig.recordDynamicCustomEvent('ADD_ALLNOTE')
    const { storage, folder, dispatch, location, folderNoteMap, noteMap } = this.props
    const notesInSameFolder = folderNoteMap.get(storage + '-' + folder)
    let noteFoundOnThisDate // TODO and not in trash
    if (notesInSameFolder) {
      for (const uniqueKey of notesInSameFolder) {
        const note = noteMap.get(uniqueKey)
        const theDate = new Date(note.createdAt)
        if (theDate.getFullYear() === targetDate.getFullYear() &&
          theDate.getMonth() === targetDate.getMonth() &&
          theDate.getDate() === targetDate.getDate()
        ) {
          noteFoundOnThisDate = uniqueKey
          break
        }
      }
    }
    if (noteFoundOnThisDate) {
      // TODO: may need another field to record journal entry date. maybe title?
      console.log('bring me to that one - ' + noteMap.get(noteFoundOnThisDate).createdAt)
      // console.log(noteMap.get(noteFoundOnThisDate))
    } else {
      console.log('create new note for ' + targetDate)
      // dataApi
      // .createNote(storage, {
      //   type: 'MARKDOWN_NOTE',
      //   folder: folder,
      //   title: targetDate.getDate(),
      //   content: '# ' + JOURNAL_TITLE
      // })
      // .then((note) => {
      //   const noteHash = `${note.storage}-${note.key}`
      //   dispatch({
      //     type: 'UPDATE_NOTE',
      //     note: note
      //   })
      //   hashHistory.push({
      //     pathname: location.pathname,
      //     query: {key: noteHash}
      //   })
      //   ee.emit('list:jump', noteHash)
      //   ee.emit('detail:focus')
      // })
    }
    // this.props.close()
  }

  handleKeyUp (e) {
    if (e.keyCode === 27) {
      console.log(e)
      // this.props.close()
    }
  }

  render () {
    return (
      <div styleName='root'
        tabIndex='-1'
        onKeyUp={(e) => this.handleKeyUp(e)}
      >
        <div styleName='header'> <div styleName='title'>Pick a date</div> </div>
        <ModalEscButton handleEscButtonClick={(e) => this.handleCloseButtonClick(e)} />
        <div>
        {/* <DatePicker
          onDayFocus={(d) => { this.handleDayFocus(d) }}
          onDayMouseDown={(d) => { this.handleDayMouseDown(d) }} 
          onDayMouseEnter={(d) => {this.handleDayMouseEnter(d)}}
          selectedDays={this.state.selectedDate}
          /> */}
        </div>
      </div>
    )
  }
}

NewJournalEntryModal.propTypes = {
}

export default CSSModules(NewJournalEntryModal, styles)
