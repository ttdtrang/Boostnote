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
      const currentNode = (
        <li>{k}</li>
        // <p>AAAAAAAAAAA {k}</p>
      )
      let children
      if  (Array.isArray(treeObj[k])) { 
        treeObj[k].map((l) => {console.log(l['createdAt'])})
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

      console.log(currentNode)
      console.log(children)
      return (
        <ol>
          { currentNode }
          { children }
        </ol>
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
    this.renderTreeAsList(this.noteTreeData)
  )
  //   return (
  // <ol>
  // <li>2018</li>
  //    <ol>
  //    <li>01</li>
  //    <ol>
  //      <li>03</li>
  //    </ol>
  //    </ol>
  // <li>2017</li>
  // <ol>
  //   <li>10</li>
  //   <ol>
  //   <li>2</li>
  //     </ol>
  //   </ol>
  // </ol>
  //   )
  // }
}
}
// const NoteTree = ({ noteTreeData, handleNoteClick, handleNoteContextMenu, handleDragStart, pathname }) => (
  // <div styleName={isActive
  //     ? 'item-simple--active'
  //     : 'item-simple'
  //   }
  //   key={`${note.storage}-${note.key}`}
  //   onClick={e => handleNoteClick(e, `${note.storage}-${note.key}`)}
  //   onContextMenu={e => handleNoteContextMenu(e, `${note.storage}-${note.key}`)}
  //   onDragStart={e => handleDragStart(e, note)}
  //   draggable='true'
  // >
  
  //   <div styleName='item-simple-title'>
  //     {note.type === 'SNIPPET_NOTE'
  //       ? <i styleName='item-simple-title-icon' className='fa fa-fw fa-code' />
  //       : <i styleName='item-simple-title-icon' className='fa fa-fw fa-file-text-o' />
  //     }
  //     {note.isPinned && !pathname.match(/\/home|\/starred|\/trash/)
  //       ? <i styleName='item-pin' className='fa fa-thumb-tack' />
  //       : ''
  //     }
  //     {note.createdAt}
  //     {note.title.trim().length > 0
  //       ? note.title
  //       : <span styleName='item-simple-title-empty'>Empty</span>
  //     }
  //   </div>
  // </div>
// )


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
