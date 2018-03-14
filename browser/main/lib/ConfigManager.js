import _ from 'lodash'
import RcParser from 'browser/lib/RcParser'

const OSX = global.process.platform === 'darwin'
const win = global.process.platform === 'win32'
const electron = require('electron')
const { ipcRenderer } = electron
const consts = require('browser/lib/consts')

let isInitialized = false

export const DEFAULT_CONFIG = {
  zoom: 1,
  isSideNavFolded: false,
  listWidth: 280,
  navWidth: 200,
  sortBy: 'UPDATED_AT', // 'CREATED_AT', 'UPDATED_AT', 'APLHABETICAL'
  listStyle: 'DEFAULT', // 'DEFAULT', 'SMALL', 'DATETREE'
  amaEnabled: true,
  hotkey: {
    toggleMain: OSX ? 'Cmd + Alt + L' : 'Super + Alt + E'
  },
  ui: {
    theme: 'default',
    showCopyNotification: true,
    disableDirectWrite: false,
    defaultNote: 'ALWAYS_ASK' // 'ALWAYS_ASK', 'SNIPPET_NOTE', 'MARKDOWN_NOTE'
  },
  editor: {
    theme: 'base16-light',
    keyMap: 'sublime',
    fontSize: '14',
    fontFamily: win ? 'Segoe UI' : 'Monaco, Consolas',
    indentType: 'space',
    indentSize: '2',
    displayLineNumbers: true,
    switchPreview: 'BLUR', // Available value: RIGHTCLICK, BLUR
    scrollPastEnd: false,
    type: 'SPLIT',
    fetchUrlTitle: true
  },
  preview: {
    fontSize: '14',
    fontFamily: win ? 'Segoe UI' : 'Lato',
    codeBlockTheme: 'dracula',
    lineNumber: true,
    latexInlineOpen: '$',
    latexInlineClose: '$',
    latexBlockOpen: '$$',
    latexBlockClose: '$$',
    scrollPastEnd: false,
    smartQuotes: true
  },
  blog: {
    type: 'wordpress', // Available value: wordpress, add more types in the future plz
    address: 'http://wordpress.com/wp-json',
    authMethod: 'JWT', // Available value: JWT, USER
    token: '',
    username: '',
    password: ''
  }
}

function validate (config) {
  if (!_.isObject(config)) return false
  if (!_.isNumber(config.zoom) || config.zoom < 0) return false
  if (!_.isBoolean(config.isSideNavFolded)) return false
  if (!_.isNumber(config.listWidth) || config.listWidth <= 0) return false

  return true
}

function _save (config) {
  window.localStorage.setItem('config', JSON.stringify(config))
}

function get () {
  const rawStoredConfig = window.localStorage.getItem('config')
  const storedConfig = Object.assign({}, DEFAULT_CONFIG, JSON.parse(rawStoredConfig))
  let config = storedConfig

  try {
    const boostnotercConfig = RcParser.parse()
    config = assignConfigValues(storedConfig, boostnotercConfig)

    if (!validate(config)) throw new Error('INVALID CONFIG')
  } catch (err) {
    console.warn('Boostnote resets the invalid configuration.')
    config = DEFAULT_CONFIG
    _save(config)
  }

  if (!isInitialized) {
    isInitialized = true
    let editorTheme = document.getElementById('editorTheme')
    if (editorTheme == null) {
      editorTheme = document.createElement('link')
      editorTheme.setAttribute('id', 'editorTheme')
      editorTheme.setAttribute('rel', 'stylesheet')
      document.head.appendChild(editorTheme)
    }

    config.editor.theme = consts.THEMES.some((theme) => theme === config.editor.theme)
      ? config.editor.theme
      : 'default'

    if (config.editor.theme !== 'default') {
      if (config.editor.theme.startsWith('solarized')) {
        editorTheme.setAttribute('href', '../node_modules/codemirror/theme/solarized.css')
      } else {
        editorTheme.setAttribute('href', '../node_modules/codemirror/theme/' + config.editor.theme + '.css')
      }
    }
  }

  return config
}

function set (updates) {
  const currentConfig = get()
  const newConfig = Object.assign({}, DEFAULT_CONFIG, currentConfig, updates)
  if (!validate(newConfig)) throw new Error('INVALID CONFIG')
  _save(newConfig)

  if (newConfig.ui.theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark')
  } else if (newConfig.ui.theme === 'white') {
    document.body.setAttribute('data-theme', 'white')
  } else if (newConfig.ui.theme === 'solarized-dark') {
    document.body.setAttribute('data-theme', 'solarized-dark')
  } else {
    document.body.setAttribute('data-theme', 'default')
  }

  let editorTheme = document.getElementById('editorTheme')
  if (editorTheme == null) {
    editorTheme = document.createElement('link')
    editorTheme.setAttribute('id', 'editorTheme')
    editorTheme.setAttribute('rel', 'stylesheet')
    document.head.appendChild(editorTheme)
  }
  const newTheme = consts.THEMES.some((theme) => theme === newConfig.editor.theme)
    ? newConfig.editor.theme
    : 'default'

  if (newTheme !== 'default') {
    if (newTheme.startsWith('solarized')) {
      editorTheme.setAttribute('href', '../node_modules/codemirror/theme/solarized.css')
    } else {
      editorTheme.setAttribute('href', '../node_modules/codemirror/theme/' + newTheme + '.css')
    }
  }

  ipcRenderer.send('config-renew', {
    config: get()
  })
}

function assignConfigValues (originalConfig, rcConfig) {
  const config = Object.assign({}, DEFAULT_CONFIG, originalConfig, rcConfig)
  config.hotkey = Object.assign({}, DEFAULT_CONFIG.hotkey, originalConfig.hotkey, rcConfig.hotkey)
  config.blog = Object.assign({}, DEFAULT_CONFIG.blog, originalConfig.blog, rcConfig.blog)
  config.ui = Object.assign({}, DEFAULT_CONFIG.ui, originalConfig.ui, rcConfig.ui)
  config.editor = Object.assign({}, DEFAULT_CONFIG.editor, originalConfig.editor, rcConfig.editor)
  config.preview = Object.assign({}, DEFAULT_CONFIG.preview, originalConfig.preview, rcConfig.preview)
  return config
}

export default {
  get,
  set,
  validate
}
