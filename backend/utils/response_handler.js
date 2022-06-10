module.exports = {
  handlerSuccess(req, res, data, msg) {
    res.status(200).send({
      code: 200,
      data: data,
      msg: msg,
    });
  },

  handlerError(req, res, msg) {
    res.status(200).send({
      code: 500,
      msg: msg,
      data: null,
    });
  },

  handlerRequire(req, res, msg) {
    res.status(200).send({
      code: 403,
      msg: msg,
      data: null,
    });
  },

  handlerAuthentication(req, res, msg) {
    res.status(200).send({
      code: 401,
      msg: msg,
      data: null,
    });
  },
};
