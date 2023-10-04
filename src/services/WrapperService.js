export const WrapperService = (model) => {
  const Services = {}

  Services.create = async (objToSave) => {
    return await model.create(objToSave)
  }

  Services.getOne = async (criteria, projection, options = {}) => {
    options.lean = true
    options.virtuals = true
    return await model.findOne(criteria, projection, options)
  }

  Services.getMany = async (criteria, projection, options = {}) => {
    return await model.find(criteria, projection, { ...options, lean: true, virtuals: true })
  }

  Services.updateOne = async (criteria, dataToUpdate, options = {}) => {
    options.new = true
    options.lean = true
    options.virtuals = true
    return await model.findOneAndUpdate(criteria, dataToUpdate, options)
  }

  Services.updateMany = async (criteria, dataToUpdate, options = {}) => {
    options.virtuals = true
    options.lean = true
    return await model.updateMany(criteria, dataToUpdate, { ...options })
  }

  Services.deleteOne = async (criteria) => {
    return await model.deleteOne(criteria)
  }

  Services.deleteMany = async (criteria) => {
    return await model.deleteMany(criteria)
  }

  return Services
}
