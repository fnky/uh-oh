const stackListView = document.getElementById('mainStackListView')
const listViewItems = stackListView.children

const selectedFrameIndex = parseInt(stackListView.getAttribute('data-selected'), 10)

class HTMLDOMComponent {
  constructor (props) {
    this.props = props
    this.state = {}
  }

  setState (newState) {
    const state = Object.assign(this.state, newState)
    const rendered = this.render()
    this.__PARENT_NODE__.parentNode.replaceChild(rendered, this.__PARENT_NODE__)
    this.__PARENT_NODE__ = rendered
    return state
  }
}

class HTMLDOM {
  static render (componentInstance, element) {
    componentInstance.__PARENT_NODE__ = element
    const rendered = componentInstance.render()

    if (rendered != null) {
      element.appendChild(rendered)
    }
  }

  static createElement (type, props, ...children) {
    const element = document.createElement(type)
    const propKeys = Object.keys(props)

    propKeys.forEach(key => {
      const value = props[key]
      element[key] = value
    })

    children.forEach(child => {
      if (child != null) element.appendChild(child)
    })

    return element
  }
}

class SourceView extends HTMLDOMComponent {
  constructor (props) {
    super(props)
    this.state = {
      selectedFrameIndex: 0
    }
  }

  onFrameIndexChange (index) {
    this.setState({ selectedFrameIndex: index })
  }

  render () {
    const frame = this.props.frames[this.state.selectedFrameIndex]
    const source = frame.source
    const sourceLineNumbers = Object.keys(source)

    const gutterLines = sourceLineNumbers.map(lineNumber => HTMLDOM.createElement('div', {
      className: 'source-view-gutter-line',
      innerText: lineNumber
    }))

    const gutter = HTMLDOM.createElement('div', { className: 'source-view-gutter' }, ...gutterLines)

    const sourceLines = sourceLineNumbers.map(lineNumber => {
      const isSelected = parseInt(lineNumber, 10) === frame.line
      const highlightClass = isSelected
        ? ' source-view-editor-line-highlighted'
        : ''

      const errorCursor = isSelected
        ? HTMLDOM.createElement('div', {
          className: 'source-view-error-cursor',
          style: `left: ${(8 * frame.column) - 14}px;`
        }) : null

      return HTMLDOM.createElement('div', {
        className: `source-view-editor-line${highlightClass}`,
        innerHTML: source[lineNumber].code === '' ? '&nbsp;' : source[lineNumber].code
      }, errorCursor)
    })

    const sourceEditor = HTMLDOM.createElement('div', {
      className: 'source-view-editor'
    }, ...sourceLines)

    return HTMLDOM.createElement('div', {
      className: 'source-view'
    }, gutter, sourceEditor)
  }
}

const sourceViewComponent = new SourceView({
  className: 'source-view',
  frames: errorObject.frames,
  selectedFrame: selectedFrameIndex
})

HTMLDOM.render(sourceViewComponent, document.getElementById('mainSourceView'))

function showSourceViewForFrame (frameIndex) {
  sourceViewComponent.onFrameIndexChange(frameIndex)
}

function onClickItem (event) {
  ([...this.siblings]).forEach(node => node.classList.remove('is-selected'))
  this.node.classList.add('is-selected')
  showSourceViewForFrame(this.index)
  stackListView.setAttribute('data-selected', this.index)
}

([...listViewItems]).forEach((listViewItem, index) => {
  const context = {
    siblings: listViewItems,
    node: listViewItem,
    index
  }

  if (index === selectedFrameIndex) {
    listViewItem.classList.add('is-selected')
  }

  listViewItem.addEventListener('click', onClickItem.bind(context), false)
})
