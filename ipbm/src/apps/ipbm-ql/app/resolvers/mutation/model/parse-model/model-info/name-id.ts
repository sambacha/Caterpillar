export default ({
  definitions
}) => {
  // Sanity checks
  let proc = definitions.diagrams[0].plane.bpmnElement
  if (proc.$type !== "bpmn:Process") {
    if (proc.$type === "bpmn:Collaboration") {
      for (let i = 0; i < definitions.rootElements.length; i++)
        if (definitions.rootElements[i].$type === "bpmn:Process") {
          proc = definitions.rootElements[i]
          return {
            name: proc.name ? proc.name.replace(/\s+/g, "_") : proc.id,
            id: proc.id
          }
        }
    } else {
      throw new Error("ERROR: No root process model found")
    }
  }
  return {
    name: proc.name ? proc.name.replace(/\s+/g, "_") : proc.id,
    id: proc.id,
  }
}