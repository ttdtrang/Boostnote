import React from 'react'
import ProseMirror from 'react-prosemirror'
import style from './markdown.styl'
import CSSModules from 'browser/lib/CSSModules'


import 'prosemirror/dist/inputrules/autoinput'
import 'prosemirror/dist/markdown'

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
    })
  }

  render () {
    const { value } = this.state
    return (
      <ProseMirror
        value={value}
        onChange={(e) => this.handleOnChange(e)}
        options={{
          docFormat: 'markdown',
          autoInput: true
        }}
        ref='pm' />
    )
  }
}

export default CSSModules(WYSIWYGEditor, style)
