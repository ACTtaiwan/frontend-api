class Utils {
  constructor () {
    this.getSelectedFields = this.getSelectedFields.bind(this)
  }

  getSelectedFields (rootQuery) {
    let shellQuery = rootQuery.selectionSet.selections[0]
    let childQuery = shellQuery.selectionSet.selections
    let selectedFields = childQuery.map(field => field.name.value).filter(field => field !== '__typename')
    return selectedFields
  }
}

export default Utils
