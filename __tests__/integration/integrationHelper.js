const nodesWithTextCount = (selector, text, page) => {
  return page.$$eval(selector, (nodes, text) => nodes.reduce((count, node) => (node.innerText === text ? count + 1 : count), 0), text)
}

export { nodesWithTextCount as default }
