import React from 'react'
import ProseMirror from 'react-prosemirror'
import style from './WYSIWYGEditor.styl'
import CSSModules from 'browser/lib/CSSModules'

import 'prosemirror/dist/inputrules/autoinput'
import 'prosemirror/dist/markdown'

function buildStyle (fontSize) {
  return {
    fontSize: `${fontSize}px`
  }
}

class WYSIWYGEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value,
      config: props.config
    }
  }

  componentWillReceiveProps (props) {
    this.setState({
      value: props.value,
      config: props.config
    })
  }

  handleOnChange (e) {
    this.setState({
      value: e
    }, () => { this.value = e })
    this.props.onChange(e)
  }

  focus () {
    this.refs.editor.pm.content.focus()
  }

  render () {
    const { value } = this.state
    const { config } = this.props
    const customStyle = buildStyle(config.preview.fontSize)
    return (
      <div styleName='root'
        style={customStyle}>
        <ProseMirror
          value={value}
          onChange={(e) => this.handleOnChange(e)}
          ref='editor'
          options={{
            docFormat: 'markdown',
            autoInput: true
          }} />
      </div>
    )
  }
}

export default CSSModules(WYSIWYGEditor, style)
