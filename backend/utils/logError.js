const logError = (err, res) => {
  console.log(err);

  if (err.statusCode !== 500) {
    return res.status(err.statusCode).json({
      error: `${err.message}`,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error!',
  });
};

export default logError;
