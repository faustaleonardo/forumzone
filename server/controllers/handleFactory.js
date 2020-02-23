const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.checkIfDocExist = Model => {
  return catchAsync(async (req, res, next) => {
    const { questionId, commentId } = req.params;
    let id;

    if (questionId) id = questionId;
    if (commentId) id = commentId;

    if (!(await Model.findById(id))) {
      return next(
        new AppError(`Can't find ${Model.modelName} with that id`, 400)
      );
    }

    next();
  });
};

exports.createOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

exports.getAll = Model => {
  return catchAsync(async (req, res, next) => {
    let filter = {};
    // for filtering out nested comments or bookmarks on question
    if (req.params.questionId) filter = { question: req.params.questionId };

    // for filtering out nested votes on comment
    if (req.params.commentId) filter = { comment: req.params.commentId };

    const features = new APIFeatures(Model.find(filter), req.query).filter();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
};

exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const query = Model.findById(id);
    if (popOptions) query.populate(popOptions);

    const doc = await query;

    if (!doc)
      return next(
        new AppError(`Can't find ${Model.modelName} with that id`, 404)
      );

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

exports.updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const obj = { ...req.body, updatedAt: Date.now() };

    const doc = await Model.findByIdAndUpdate(id, obj, {
      new: true,
      runValidators: true
    });

    if (!doc)
      return next(
        new AppError(`Can't find ${Model.modelName} with that id`, 404)
      );

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

exports.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc)
      return next(
        new AppError(`Can't find ${Model.modelName} with that id`, 404)
      );

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};
