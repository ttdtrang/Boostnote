import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
const { remote } = require('electron')
const { Menu } = remote
import dataApi from 'browser/main/lib/dataApi'
import styles from './SideNav.styl'
import { openModal } from 'browser/main/lib/modal'
import PreferencesModal from '../modals/PreferencesModal'
import ConfigManager from 'browser/main/lib/ConfigManager'
import StorageItem from './StorageItem'
import TagListItem from 'browser/components/TagListItem'
import SideNavFilter from 'browser/components/SideNavFilter'
import StorageList from 'browser/components/StorageList'
import NavToggleButton from 'browser/components/NavToggleButton'
import EventEmitter from 'browser/main/lib/eventEmitter'
import PreferenceButton from './PreferenceButton'
import ListButton from './ListButton'
import TagButton from './TagButton'
import {SortableContainer} from 'react-sortable-hoc'

class SideNav extends React.Component {
  // TODO: should not use electron stuff v0.7

  componentDidMount () {
    EventEmitter.on('side:preferences', this.handleMenuButtonClick)
  }

  componentWillUnmount () {
    EventEmitter.off('side:preferences', this.handleMenuButtonClick)
  }

  handleMenuButtonClick (e) {
    openModal(PreferencesModal)
  }

  handleHomeButtonClick (e) {
    const { router } = this.context
    router.push('/home')
  }

  handleStarredButtonClick (e) {
    const { router } = this.context
    router.push('/starred')
  }

  handleToggleButtonClick (e) {
    const { dispatch, config } = this.props

    ConfigManager.set({isSideNavFolded: !config.isSideNavFolded})
    dispatch({
      type: 'SET_IS_SIDENAV_FOLDED',
      isFolded: !config.isSideNavFolded
    })
  }

  handleTrashedButtonClick (e) {
    const { router } = this.context
    router.push('/trashed')
  }

  handleSwitchFoldersButtonClick () {
    const { router } = this.context
    router.push('/home')
  }

  handleSwitchTagsButtonClick () {
    const { router } = this.context
    router.push('/alltags')
  }

  onSortEnd (storage) {
    return ({oldIndex, newIndex}) => {
      const { dispatch } = this.props
      dataApi
        .reorderFolder(storage.key, oldIndex, newIndex)
        .then((data) => {
          dispatch({ type: 'REORDER_FOLDER', storage: data.storage })
        })
    }
  }

  SideNavComponent (isFolded, storageList) {
    const { location, data } = this.props

    const isHomeActive = !!location.pathname.match(/^\/home$/)
    const isStarredActive = !!location.pathname.match(/^\/starred$/)
    const isTrashedActive = !!location.pathname.match(/^\/trashed$/)

    let component

    if (location.pathname.match('/tags') || location.pathname.match('/alltags')) {
    // Tag mode
      component = (
        <div styleName='tabBody'>
          <div styleName='tag-title'>
            <p>Tags</p>
          </div>
          <div styleName='tagList'>
            {this.tagListComponent(data)}
          </div>
        </div>
      )
    } else if (location.pathname.match('/alldates') || location.pathname.match('/date')) {
    // Date mode
      component = (
        <div styleName='tagBody'>
          <p>Should show notes in hierarchy of date</p>
        </div>
           )
    } else {
    // Folder mode
      component = (
        <div>
          <SideNavFilter
            isFolded={isFolded}
            isHomeActive={isHomeActive}
            handleAllNotesButtonClick={(e) => this.handleHomeButtonClick(e)}
            isStarredActive={isStarredActive}
            isTrashedActive={isTrashedActive}
            handleStarredButtonClick={(e) => this.handleStarredButtonClick(e)}
            handleTrashedButtonClick={(e) => this.handleTrashedButtonClick(e)}
            counterTotalNote={data.noteMap._map.size - data.trashedSet._set.size}
            counterStarredNote={data.starredSet._set.size}
            counterDelNote={data.trashedSet._set.size}
            handleFilterButtonContextMenu={this.handleFilterButtonContextMenu.bind(this)}
          />

          <StorageList storageList={storageList} />
          <NavToggleButton isFolded={isFolded} handleToggleButtonClick={this.handleToggleButtonClick.bind(this)} />
        </div>
      )
    }

    return component
  }

  tagListComponent () {
    const { data, location } = this.props
    const tagList = _.sortBy(data.tagNoteMap.map((tag, name) => {
      return { name, size: tag.size }
    }), ['name'])
    return (
      tagList.map(tag => {
        return (
          <TagListItem
            name={tag.name}
            handleClickTagListItem={this.handleClickTagListItem.bind(this)}
            isActive={this.getTagActive(location.pathname, tag)}
            key={tag.name}
            count={tag.size}
          />
        )
      })
    )
  }

  getTagActive (path, tag) {
    const pathSegments = path.split('/')
    const pathTag = pathSegments[pathSegments.length - 1]
    return pathTag === tag
  }

  handleClickTagListItem (name) {
    const { router } = this.context
    router.push(`/tags/${name}`)
  }

  emptyTrash (entries) {
    const { dispatch } = this.props
    const deletionPromises = entries.map((note) => {
      return dataApi.deleteNote(note.storage, note.key)
    })
    Promise.all(deletionPromises)
    .then((arrayOfStorageAndNoteKeys) => {
      arrayOfStorageAndNoteKeys.forEach(({ storageKey, noteKey }) => {
        dispatch({ type: 'DELETE_NOTE', storageKey, noteKey })
      })
    })
    .catch((err) => {
      console.error('Cannot Delete note: ' + err)
    })
    console.log('Trash emptied')
  }

  handleFilterButtonContextMenu (event) {
    const { data } = this.props
    const trashedNotes = data.trashedSet.toJS().map((uniqueKey) => data.noteMap.get(uniqueKey))
    const menu = Menu.buildFromTemplate([
      { label: 'Empty Trash', click: () => this.emptyTrash(trashedNotes) }
    ])
    menu.popup()
  }

  render () {
    const { data, location, config, dispatch } = this.props

    const isFolded = config.isSideNavFolded

    const storageList = data.storageMap.map((storage, key) => {
      const SortableStorageItem = SortableContainer(StorageItem)
      return <SortableStorageItem
        key={storage.key}
        storage={storage}
        data={data}
        location={location}
        isFolded={isFolded}
        dispatch={dispatch}
        onSortEnd={this.onSortEnd.bind(this)(storage)}
        useDragHandle
      />
    })
    const style = {}
    if (!isFolded) style.width = this.props.width
    const isTagActive = location.pathname.match(/tag/)
    return (
      <div className='SideNav'
        styleName={isFolded ? 'root--folded' : 'root'}
        tabIndex='1'
        style={style}
      >
        <div styleName='top'>
          <div styleName='switch-buttons'>
            <ListButton onClick={this.handleSwitchFoldersButtonClick.bind(this)} isTagActive={isTagActive} />
            <TagButton onClick={this.handleSwitchTagsButtonClick.bind(this)} isTagActive={isTagActive} />
          </div>
          <div>
            <PreferenceButton onClick={this.handleMenuButtonClick} />
          </div>
        </div>
        {this.SideNavComponent(isFolded, storageList)}
      </div>
    )
  }
}

SideNav.contextTypes = {
  router: PropTypes.shape({})
}

SideNav.propTypes = {
  dispatch: PropTypes.func,
  storages: PropTypes.array,
  config: PropTypes.shape({
    isSideNavFolded: PropTypes.bool
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
}

export default CSSModules(SideNav, styles)
