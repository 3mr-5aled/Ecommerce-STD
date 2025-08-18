const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError.utils");
const ApiFeatures = require("../utils/apiFeatures.utils");

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    /**
     * Creates a new ApiFeatures instance with query filtering, pagination, search, field limiting, and sorting capabilities.
     * Chains multiple methods to build a comprehensive query for the specified model.
     *
     * @description This creates an ApiFeatures instance that processes the incoming request query parameters
     * to apply pagination based on document count, filtering, searching by model name, field limitation, and sorting.
     *
     * @param {Object} Model.find(filter) - Mongoose query object with initial filter applied
     * @param {Object} req.query - Express request query parameters containing filter, pagination, search, field, and sort options
     * @param {number} documentsCounts - Total count of documents for pagination calculations
     * @param {string} modelName - Name of the model used for search functionality
     *
     * @returns {ApiFeatures} Configured ApiFeatures instance with all query transformations applied
     *
     * @example
     * // The resulting apiFeatures object will have a processed query ready for execution
     * const results = await apiFeatures.mongooseQuery;
     */
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    /**
     * Creates a Mongoose query to find a document by its ID
     * @type {Query} Mongoose query object for finding a document by ID
     */
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    /**
     * Finds a document by ID and updates it with the provided data
     * @async
     * @function
     * @param {Object} req - Express request object
     * @param {Object} req.params - Request parameters
     * @param {string} req.params.id - The ID of the document to update
     * @param {Object} req.body - Request body containing update data
     * @param {mongoose.Model} Model - Mongoose model to perform the operation on
     * @returns {Promise<Object>} The updated document
     * @throws {Error} Throws error if document is not found or update fails
     */
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update document
    document.save();
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    /**
     * Finds and deletes a document by its ID from the database
     * @async
     * @function
     * @param {string|ObjectId} id - The unique identifier of the document to delete
     * @returns {Promise<Object|null>} Promise that resolves to the deleted document or null if not found
     * @throws {Error} Throws an error if the deletion operation fails
     */
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    document.remove();
    res.status(204).send();
  });
