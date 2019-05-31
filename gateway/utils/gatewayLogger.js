const timestamp = () => new Date().toTimeString().split(" ")[0];

const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`${timestamp()} [GATEWAY]`, ...params);
  }
};

const error = (...params) => {
  console.error(`${timestamp()} [GATEWAY]`, ...params);
};

module.exports = {
  info,
  error
};
