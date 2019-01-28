const getArgv = (index, errorMessage = 'Index out of range') => {
  if (process.argv.length <= index) {
    throw new Error(errorMessage);
  }
  return process.argv[index];
};

module.exports = {
  getArgv,
};
