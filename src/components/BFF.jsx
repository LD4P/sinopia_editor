import React, { Component } from 'react'
import EditorHeader from './EditorHeader'



class BFF extends Component {
  render() {
    return(
      <div>
        <EditorHeader triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>        
      </div>
    )
  }
}

export default BFF
