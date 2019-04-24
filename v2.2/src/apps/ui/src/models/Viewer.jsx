import React, { Component } from 'react';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/styles/properties.less'
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import emptyBpmn from './empty-bpmn';



class Viewer extends Component {

  modeler = null;

  componentDidMount = () => {
    this.modeler = new BpmnViewer({
      container: `#bpmnview-${this.props.id}`,
    });
    if (this.props.model) {
      return this.openBpmnDiagram(this.props.model)
    }
    return this.newBpmnDiagram();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      props,
//      state
    } = this;

    if (props.model !== prevProps.model) {
      return this.openBpmnDiagram(props.model)
    }

  }


  newBpmnDiagram = () => {
    this.openBpmnDiagram(emptyBpmn);
  }

  openBpmnDiagram = (xml) => {
    this.modeler.importXML(xml, (error) => {
      if (error) {
        return console.log('fail import xml');
      }

      var canvas = this.modeler.get('canvas');

      canvas.zoom('fit-viewport');
    });
  }

  render = () => {
    return (
      <div
        id={`bpmnview-${this.props.id}`}
        style={{ flexGrow: 4 }}
      />
    )
  }
}

export default Viewer;