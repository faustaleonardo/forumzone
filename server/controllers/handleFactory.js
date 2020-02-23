const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.checkIfUserMatch = Model => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (`${doc.user}` !== `${req.user._id}`) {
      return next(new AppError('Only original user has this permission.', 401));
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
    const docs = await Model.find();

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
};

exports.getOne = Model => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findById(id);
    if (!doc) return next(new AppError(`Can't find doc with that id`, 404));

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

    if (!doc) return next(new AppError(`Can't find doc with that id`, 404));

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

    if (!doc) return next(new AppError(`Can't find doc with that id`, 404));

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};
