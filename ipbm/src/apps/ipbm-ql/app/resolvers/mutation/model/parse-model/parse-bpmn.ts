import BpmnModdle from 'bpmn-moddle'

export default bpmnDoc => {
  return new Promise((resolve, reject) => {
      new BpmnModdle().fromXML(bpmnDoc, (err, definitions) => {
          if (!err) resolve(definitions)
          else reject(err)
      })
  })
}