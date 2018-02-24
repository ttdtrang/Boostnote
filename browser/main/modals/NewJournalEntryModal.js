import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NewNoteModal.styl'
import dataApi from 'browser/main/lib/dataApi'
import { hashHistory } from 'react-router'
import ee from 'browser/main/lib/eventEmitter'
import ModalEscButton from 'browser/components/ModalEscButton'
import AwsMobileAnalyticsConfig from 'browser/main/lib/AwsMobileAnalyticsConfig'

class NewJournalEntryModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  handleCloseButtonClick (e) {
    this.props.close()
  }

  handleJournalNoteButtonClick (e) {
    AwsMobileAnalyticsConfig.recordDynamicCustomEvent('ADD_MARKDOWN')
    AwsMobileAnalyticsConfig.recordDynamicCustomEvent('ADD_ALLNOTE')
    const { storage, folder, dispatch, location, folderNoteMap, noteMap } = this.props
    const targetDate = new Date() // TODO get from date picker
    // TODO make sure the current folder is of type JOURNAL
    const notesInSameFolder = folderNoteMap.get(storage + '-' + folder)
    let noteFoundOnThisDate
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
      console.log('bring me to that one - ' + noteMap.get(noteFoundOnThisDate).createdAt)
      // console.log(noteMap.get(noteFoundOnThisDate))
    } else {
      console.log('TODO: create new note for ' + targetDate)
    }
    this.props.close()
  }

  handleJournalNoteButtonKeyDown (e) {
    if (e.keyCode === 9) {
      e.preventDefault()
      this.refs.journalButton.focus()
    }
  }

  handleKeyDown (e) {
    if (e.keyCode === 27) {
      this.props.close()
    }
  }

  render () {
    return (
      <div styleName='root'
        tabIndex='-1'
        onKeyDown={(e) => this.handleKeyDown(e)}
      >
        <div styleName='header'>
          <div styleName='title'>Pick a date</div>
        </div>
        <ModalEscButton handleEscButtonClick={(e) => this.handleCloseButtonClick(e)} />
        <div styleName='control'>
          <button styleName='control-button'
            onClick={(e) => this.handleJournalNoteButtonClick(e)}
            onKeyDown={(e) => this.handleJournalNoteButtonKeyDown(e)}
            ref='journalButton'
          >
            <i styleName='control-button-icon'
              className='fa fa-calendar-o'
            /><br />
            <span styleName='control-button-label'>Journal Entry</span><br />
            <span styleName='control-button-description'>Generating a journal entry for today, in Markdown format.</span>
          </button>

          {/* <button styleName='control-button'
            onClick={(e) => this.handleMarkdownNoteButtonClick(e)}
            onKeyDown={(e) => this.handleMarkdownNoteButtonKeyDown(e)}
            ref='markdownButton'
          >
            <i styleName='control-button-icon'
              className='fa fa-file-text-o'
            /><br />
            <span styleName='control-button-label'>Markdown Note</span><br />
            <span styleName='control-button-description'>This format is for creating text documents. Checklists, code blocks and Latex blocks are available.</span>
          </button> */}

          {/* <button styleName='control-button'
            onClick={(e) => this.handleSnippetNoteButtonClick(e)}
            onKeyDown={(e) => this.handleSnippetNoteButtonKeyDown(e)}
            ref='snippetButton'
          >
            <i styleName='control-button-icon'
              className='fa fa-code'
            /><br />
            <span styleName='control-button-label'>Snippet Note</span><br />
            <span styleName='control-button-description'>This format is for creating code snippets. Multiple snippets can be grouped into a single note.
            </span>
          </button> */}

        </div>
        <div styleName='description'><i className='fa fa-arrows-h' /> Tab to switch format</div>

      </div>
    )
  }
}

NewJournalEntryModal.propTypes = {
}

export default CSSModules(NewJournalEntryModal, styles)
