const timestamp = () => new Date().toTimeString().split(" ")[0];

const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`${timestamp()} [SERVER]`, ...params);
  }
};

const error = (...params) => {
  console.error(`${timestamp()} [SERVER]`, ...params);
};

module.exports = {
  info,
  error
};
