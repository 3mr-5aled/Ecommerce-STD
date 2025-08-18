class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  /**
   * Filters the MongoDB query based on query string parameters.
   * Excludes pagination and sorting fields (page, sort, limit, fields) from filtering.
   * Converts comparison operators (gte, gt, lte, lt) to MongoDB format by prefixing with $.
   *
   * @returns {Object} Returns this instance for method chaining
   *
   * @example
   *  URL: /api/products?price[gte]=100&category=electronics
   *  Results in MongoDB query: { price: { $gte: 100 }, category: "electronics" }
   */
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    // Apply filtration using [gte, gt, lte, lt]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * Sorts the mongoose query based on the sort parameter from the query string.
   * If no sort parameter (-sort) is provided, defaults to sorting by creation date in descending order.
   * Multiple sort fields can be specified using comma separation (e.g., "price,name").
   * @returns {Object} Returns the instance for method chaining
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createAt");
    }
    return this;
  }

  /**
   * Limits the fields returned in the query results based on the 'fields' parameter.
   * If fields are specified in the query string, only those fields will be returned.
   * If no fields are specified, all fields except '__v' will be returned by default.
   *
   * @returns {Object} Returns the current instance for method chaining
   *
   * @example
   * URL: /api/products?fields=name,price,description
   * Will select only name, price, and description fields
   *
   * @example
   * URL: /api/products
   * Will select all fields except __v
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  /**
   * Performs a search operation on the mongoose query based on the provided keyword.
   * The search behavior varies depending on the model name:
   * - For "Products" model: searches in both title and description fields
   * - For other models: searches in the name field only
   *
   * @param {string} modelName - The name of the model being searched ("Products" or other model names)
   * @returns {Object} Returns this instance for method chaining
   *
   * @example
   *  Search products by keyword in title or description
   *  URL: /api/products?keyword=laptop
   * apiFeatures.search("Products");
   * // MongoDB query: { $or: [{ title: { $regex: "laptop", $options: "i" }}, { description: { $regex: "laptop", $options: "i" }}]}
   *
   * @example
   *  Search categories by keyword in name field
   *  URL: /api/categories?keyword=electronics
   *  apiFeatures.search("Categories");
   *  MongoDB query: { name: { $regex: "electronics", $options: "i" }}
   */
  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  /**
   * Implements pagination functionality for MongoDB queries
   * @param {number} countDocuments - Total number of documents in the collection
   * @returns {Object} Returns the current instance for method chaining
   * @description This method calculates pagination parameters based on query string values,
   * sets up the mongoose query with skip and limit, and creates a pagination result object
   * containing current page, limit, total pages, and next/previous page information.
   * The pagination result is stored in this.paginationResult and the mongoose query
   * is modified with the calculated skip and limit values.
   */
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
