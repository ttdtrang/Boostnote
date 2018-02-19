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
import { Subscription } from 'rx';
import { createStore } from 'redux';

/**
 * @description Note item component when using simple display mode.
 * @param {boolean} isActive
 * @param {Object} noteTreeData
 * @param {Function} handleNoteClick
 * @param {Function} handleNoteContextMenu
 * @param {Function} handleDragStart
 */

const reducer = (state, action) => {
  /** 
   * 
  state is a key-value store which records the status of a given path with the following structure
  state = {
     isOpen: {
       '2018/01/10': true,
       '2018/01': true,
       '2018': true,
       '2017/12/12': false,
       '2017/12': false,
       '2017/11/30': true,
       '2017/11': true,
       '201711': true,
     }
   }
  */
  const newState = Object.assign({}, state)
  newState.isOpen= Object.assign({}, newState.isOpen);
  newState.isOpen[action.path] = !newState.isOpen[action.path];
  return newState;
}

const store = createStore(reducer)

const mapStateToProps = state => ({ isOpen: state.nodes.isOpen});
const mapDispatchToProps = dispatch => ({ toggleOpen : path => dispatch(toggleOpen(path)) });

// const intTree = connect(mapStateToProps, mapDispatchToProps)(TreeNode);

class NoteTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: {}
    }
    this.initializeState()    
  }

  initializeState () {
    // close all, then open the first level
    this.closeAll(this.state,this.props.noteTreeData,'/') 
    let newState = Object.assign({}, this.state)
    Object.keys(newState.isOpen).map( k => {
      if (! /\/\/.+\/+/.test(k)) {
        newState.isOpen[k] = true
      }
    }) 
    return newState
  }
  closeAll (state, treeObj, parentPath) {
    // set isOpen = false to all
    let newState = Object.assign({}, state) 
    Object.keys(treeObj).map(k => {
      let pathToMe = parentPath + '/' + k
      newState.isOpen[pathToMe] = false
      if (Array.isArray(treeObj[k])) {
        return newState
      } else {
        this.closeAll(newState, treeObj[k], pathToMe)
      }
    })

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
  // const root = Object.keys(this.props.noteTreeData).map(k => {
  //   return (
  //     <TreeNode treeData={this.props.noteTreeData[k]} label={k}/>
  //   )
  // })
  // return (
  //   <div className='NoteTree' styleName='tree'>
  //     {root}    
  //   </div>
  // )
  console.log(this.state)
  return (
    <p>Place holder</p>
    /*
  <Provider store={store}>
    {<TreeNode /> }
  </Provider>
  */
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


/*
class TreeNode extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false 
    }
  }

  handleToggleButtonClick () {
    this.props.toggleButton(this.props.path)   
  }

  renderNode (label, subTree) {
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
        return ( this.renderNode(k, subTree[k]) )
        })
    return (
      <ol>
          <button className={styles['toggleButton']}
                onMouseDown={e => {this.handleToggleButtonClick(e)}}
              >
                <img src={this.state.isOpen
                  ? '../resources/icon/icon-down.svg'
                  : '../resources/icon/icon-right.svg'
                  }
                />
          </button>
                {label}
        {this.state.isOpen && subTreeDisplay}
      </ol>
    )
  }
  render () {
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
        return (
          <TreeNode label={k} children={subTree[k]} isOpen={this.props.isOpen} />          
        )
        })
    return (
      <ol>
          <button className={styles['toggleButton']}
                onMouseDown={this.handleToggleButtonClick}
              >
                <img src={this.state.isOpen
                  ? '../resources/icon/icon-down.svg'
                  : '../resources/icon/icon-right.svg'
                  }
                />
          </button>
                {label}
        {this.state.isOpen && subTreeDisplay}
      </ol>
    )
  }
}
*/
export default CSSModules(NoteTree, styles)
