export const ToVietnamCurrencyFormat = (value) => {
  return value
    .toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
    .replace('₫', 'đ');
};
