/**
 * @fileoverview Note item component with simple display mode.
 */
import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteTree.styl'
import { Subscription } from 'rx';

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
    this.state =  {
      isOpen: false
    // this.initializeState(props.noteTreeData) 
    }
  }
  initializeState (treeObj) {
    // let stateTree
    // Object.keys(treeObj).map(k =>  {
    //   if (Array.isArray(treeObj[k])) {
    //     stateTree[k] = {'isOpen': false, children = treeObj[k]}
    //   } else {
    //     stateTree[k] = this.initializeState(treeObj[k])
    //   }
    // })
    // this.setState({stateTree})
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
  const root = Object.keys(this.props.noteTreeData).map(k => {
    return (
      <TreeNode treeData={this.props.noteTreeData[k]} label={k}/>
    )
  })
  return (
    <div className='NoteTree' styleName='tree'>
      {root}    
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

class TreeNode extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false 
    }
  }

  handleToggleButtonClick (e) {
    console.log(e.target)
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  renderNode (label, subTree) {
    const subTreeDisplay = (Array.isArray(subTree)) ? 
      subTree.map(item =>  {
        return ( <li>{item.title}</li>)
      })
    : Object.keys(subTree).map(k => {
        return ( this.renderNode(k, subTree[k]) )
        })
    return (
      <ol>
          <button styleName='toggleButton'
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
  //    Object.keys(treeObj).map(k => {
  //       let children = (Array.isArray(treeObj)) ?
  //       (
  //            treeObj.map(item => {
  //             return (
  //               <li>{item.title}</li>
  //             )
  //           })
  //       )
  //       : ( <TreeNode treeData={this.props.treeData[k]} label={k} /> )
  //     return (
  //       <ol>
  //         <button styleName='header-toggleButton'
  //               onMouseDown={(e) => this.handleToggleButtonClick(e)}
  //             >
  //               <img src={this.state.isOpen
  //                 ? '../resources/icon/icon-down.svg'
  //                 : '../resources/icon/icon-right.svg'
  //                 }
  //               />
  //               {this.props.label}
  //         </button>
  //             {this.state.isOpen && children }
  //       </ol>
  //     )
  //     })
  // return (treeDisplay)
  }
  render () {
    return (this.renderNode(this.props.label, this.props.treeData))
  }
}

export default CSSModules(NoteTree, styles)
