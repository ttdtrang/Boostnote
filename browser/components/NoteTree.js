/**
 * @fileoverview Note item component with simple display mode.
 */
import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteTree.styl'
import NoteItemSimple from 'browser/components/NoteItemSimple'
import getNoteKey from 'browser/main/NoteList'
import { connect, Provider} from 'react-redux'
import { Subscription } from 'rx'

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
  }

  render () {
    const subTree = this.props.children
    const fullpath = this.props.fullpath
    console.log(this.props)
    // return (this.renderNode(this.props.label, this.props.treeData))
    const subTreeDisplay = (Array.isArray(subTree)) ? 
      subTree.map(note =>  {
        // const uniqueKey = getNoteKey(note)
        return ( 
            // <NoteItemSimple
            //     isActive={isActive}
            //     note={note}
            //     key={uniqueKey}
            //     handleNoteContextMenu={this.handleNoteContextMenu.bind(this)}
            //     handleNoteClick={this.handleNoteClick.bind(this)}
            //     handleDragStart={this.handleDragStart.bind(this)}
            //     pathname={location.pathname}
            //   />
        <li>{note.title}</li>
      )
      })
    : Object.keys(subTree).map(k => {
        console.log("where is my subtree? " + k)
        const newPath = this.props.fullpath + '/' + k
        return (
          <NoteTree className='NoteTree'
          label={k} 
          children={subTree[k]}
          fullpath={newPath}
          isOpen={this.props.isOpen}
          // handleToggleButtonClick={this.props.handleToggleButtonClick}
          />
        )
        })
    console.log(subTreeDisplay)
    const isOpen = this.props.isOpen.get(fullpath)
    return (
      <ol>
          <button className={styles['toggleButton']}
                onMouseDown={this.props.handleToggleButtonClick}
              >
                <img src={ isOpen
                  ? '../resources/icon/icon-down.svg'
                  : '../resources/icon/icon-right.svg'
                  }
                />
          </button>
                {this.props.label}
        { isOpen && subTreeDisplay}
      </ol>
    )
  }
}
const actionToggleOpen =  path => ({type:'TOGGLE_TREE', path})
const mapStateToProps = state => ({ isOpen: state.treeVisibilityMap});
const mapDispatchToProps = dispatch => ({ handleToggleButtonClick: path => dispatch(actionToggleOpen(path)) });
const ResponsiveTree = connect(mapStateToProps, mapDispatchToProps)(NoteTree);

class NoteTreeContainer extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
        <ResponsiveTree {...this.props}/> 
    )
  }
}


export default CSSModules(NoteTree, styles)