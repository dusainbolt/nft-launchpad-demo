function eventListener() {
  try {
  } catch (error) {
    _logger.error(new Error(error));
  }
}
module.exports = eventListener;
