class StoredList {
  // name: the key used by StoredList to save the list in localStorage.
  // preStringify: use this to transform an item of the list before being saved.
  // postParse: use this to transform an item of the list after it got loaded.
  constructor(name, { preStringify = v => v, postParse = v => v } = {}) {
    this.options = { preStringify, postParse }
    this.name = name
    this.items = this.loadItems()
  }

  loadItems() {
    let items = null
    const value = localStorage.getItem(this.name)

    if (value === null) {
      return []
    }

    try {
      items = JSON.parse(value)
    } catch (err) {
      console.error(
        `StoredList (${this.name}) couldn’t parse the loaded items`,
        err
      )
    }

    if (!Array.isArray(items)) {
      items = null
      console.error(
        `The data loaded by StoredList (${this.name}) is not an array`,
        items
      )
    }

    return items === null ? [] : items.map(this.options.postParse)
  }

  saveItems() {
    localStorage.setItem(
      this.name,
      JSON.stringify(this.items.map(this.options.preStringify))
    )
  }

  getItems() {
    return this.items
  }

  update(items = []) {
    this.items = items
    this.saveItems()
    return items
  }

  add(value) {
    return this.update([...this.items, value])
  }

  remove(index) {
    return this.update([
      ...this.items.slice(0, index),
      ...this.items.slice(index + 1),
    ])
  }

  has(cond) {
    return this.items.some(cond)
  }
}

export default StoredList
