export const extendError = (name, { defaultMessage }) =>
  class extends Error {
    name = name
    constructor(message = defaultMessage) {
      super(message)
    }
  }

export class DAONotFound extends Error {
  name = 'DAONotFound'
  constructor(dao, chainId) {
    super('The address of this garden could not be resolved')
    this.chainId = chainId
    this.dao = dao
  }
}
