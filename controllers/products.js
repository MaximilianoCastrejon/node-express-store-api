const Product = require("../models/product.js");

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;

  // QUERYING/Filtering THE OBJECT
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    // From user frinedly to mongoDB operators
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const filterRegex = /\b(<|<=|=|>=|>)\b/g;
    let filters = numericFilters.replace(
      filterRegex,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  // QUERY
  console.log(queryObject);
  let result = Product.find(queryObject);

  // FORMATING DATA
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    //DEFAULT SORTING
    result = result.sort("created_at");
  }
  if (fields) {
    const selectFieldsList = fields.split(",").join(" ");
    result = result.select(selectFieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const toPage = limit * (page - 1);
  result = result.skip(toPage).limit(limit);

  // AWAITING FOR QUERY RESULT
  const products = await result;
  res.status(200).json({ response: products, objNum: products.length });
};

const getAllProductsStatic = async (req, res) => {
  const data = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price company")
    .limit(5)
    .skip(0);
  res.status(200).json({ data, objNum: data.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
