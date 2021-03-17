export default (node: any) =>
  node.name ? node.name.replace(/\s+/g, "_") : node.id