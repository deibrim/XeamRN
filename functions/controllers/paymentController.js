exports.payWithCard = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "payment successful",
    },
  });
};
exports.directBankTransfer = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "payment successful",
    },
  });
};
