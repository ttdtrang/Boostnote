import React from 'react'
import ProseMirror from 'react-prosemirror'
import Editor from 'draft-js-plugins-editor'
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import { mdToDraftjs } from 'draftjs-md-converter'
import { EditorState, ContentState, convertFromRaw } from 'draft-js'

import style from './WYSIWYGEditor.styl'
import CSSModules from 'browser/lib/CSSModules'

function buildStyle (fontSize) {
  return {
    fontSize: `${fontSize}px`
  }
}

const plugins = [createMarkdownShortcutsPlugin()]

class WYSIWYGEditor extends React.Component {
  constructor (props) {
    super(props)
    const mdContent = convertFromRaw(mdToDraftjs(props.value))
    const initialEditorState = EditorState.createWithContent(mdContent)
    this.state = {
      editorState: initialEditorState
    }
  }

  componentWillReceiveProps (props) {
    const mdContent = convertFromRaw(mdToDraftjs(props.value))
    const initialEditorState = EditorState.createWithContent(mdContent)
    this.setState({
      editorState: initialEditorState
    })
  }

  handleOnChange (editorState) {
    // this.setState({
    //   value: e
    // }, () => { this.value = e })
    // this.props.onChange(e)
    this.setState({editorState})
  }

  focus () {
    this.editor.focus()
  }

  render () {
    const { config } = this.props
    const customStyle = buildStyle(config.preview.fontSize)
    return (
      <div styleName='root'
        style={customStyle}>
        <Editor
          ref={e => (this.editor = e)}
          editorState={this.state.editorState}
          onChange={e => this.handleOnChange(e)}
          plugins={plugins}
        />
      </div>
    )
  }
}

export default CSSModules(WYSIWYGEditor, style)
