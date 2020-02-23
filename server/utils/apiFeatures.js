class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryStr = { ...this.queryString };
    const excludedFields = ['sort', 'paginate', 'fields', 'limit'];
    excludedFields.forEach(el => delete queryStr[el]);

    let obj = {};
    const { search } = queryStr;

    if (search) {
      obj = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }

    this.query = this.query.find(obj);

    return this;
  }
}

module.exports = ApiFeatures;
