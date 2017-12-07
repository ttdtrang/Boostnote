import React from 'react'
import ProseMirror from 'react-prosemirror'
import Editor from 'draft-js-plugins-editor'
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import { stateToMarkdown } from 'draft-js-export-markdown'
import { stateFromHTML } from 'draft-js-import-html'
import markdown from 'browser/lib/markdown'
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
    const mdContent = stateFromHTML(markdown.render(props.value))
    const initialEditorState = EditorState.createWithContent(mdContent)
    this.state = {
      editorState: initialEditorState,
      markdown: props.value
    }
  }

  componentWillReceiveProps (props) {
    const mdContent = stateFromHTML(markdown.render(props.value))
    const newEditorState = EditorState.createWithContent(mdContent)
    if (props.value === this.state.markdown) return
    this.setState({
      editorState: newEditorState
    })
  }

  handleOnChange (editorState) {
    const newMarkdown = stateToMarkdown(editorState.getCurrentContent())
    const { oldMarkdown } = this.state
    this.setState({
      editorState,
      markdown: newMarkdown
    }, () => {this.props.onChange(newMarkdown)})
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
