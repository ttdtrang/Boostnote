/**
 * @fileoverview Note item component with simple display mode.
 */
import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteTree.styl'

/**
 * @description Note item component when using simple display mode.
 * @param {boolean} isActive
 * @param {Object} noteTreeData
 * @param {Function} handleNoteClick
 * @param {Function} handleNoteContextMenu
 * @param {Function} handleDragStart
 */

class NoteTree extends React.Component {
  constructor (props) {
    super(props)
    this.noteTreeData = props.noteTreeData

  }

  renderTreeAsList (treeObj) {
    const treeDisplay = Object.keys(treeObj).map((k) => {
      let children
      if  (Array.isArray(treeObj[k])) { 
        let liArray = treeObj[k].map((l) => { return ( <li>{l['title']}</li>) })
        children = (
          <ol>
            {liArray}
          </ol>
        )
      } else {
        let subTree = this.renderTreeAsList(treeObj[k])
        children = (
          <ol>
            { subTree }
          </ol>
        )
      }
      return (
        <li>{k}
        { children } 
        </li>
      )
    })
    return (
      <ol>
      { treeDisplay }
      </ol>
    )
  }

render () {
  return (
    <div className='NoteTree' styleName='tree'>
    {this.renderTreeAsList(this.noteTreeData)}
    </div>
  )
}
}

// NoteTree.propTypes = {
//   isActive: PropTypes.bool.isRequired,

//   note: PropTypes.shape({
//     storage: PropTypes.string.isRequired,
//     key: PropTypes.string.isRequired,
//     type: PropTypes.string.isRequired,
//     title: PropTypes.string.isrequired
//   }),
//   handleNoteClick: PropTypes.func.isRequired,
//   handleNoteContextMenu: PropTypes.func.isRequired,
//   handleDragStart: PropTypes.func.isRequired
// }

export default CSSModules(NoteTree, styles)
