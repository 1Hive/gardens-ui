export const extendError = (name, { defaultMessage }) =>
  class extends Error {
    name = name
    constructor(message = defaultMessage) {
      super(message)
    }
  }

export class DAONotFound extends Error {
  name = 'DAONotFound'
  constructor(dao) {
    super('Thes address of this dao could not be resolved')
    this.dao = dao
  }
}
