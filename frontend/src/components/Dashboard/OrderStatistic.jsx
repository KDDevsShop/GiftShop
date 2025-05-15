import { Card, CardContent, CardHeader } from '@mui/material';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// eslint-disable-next-line react/prop-types
const OrderStatistics = ({ totalOrderByTime, timeFrame, year, time }) => {
  // Chuyển đổi dữ liệu thành định dạng phù hợp với biểu đồ
  const chartData = totalOrderByTime?.map((item) => {
    const orderStatusSummary = item.orderStatusSummary.reduce((acc, status) => {
      acc[status.orderStatus] = status.totalOrders;
      return acc;
    }, {});

    return {
      label:
        timeFrame === 'day' || timeFrame === 'month'
          ? item.time
          : timeFrame === 'year'
            ? item.month
            : [],
      'Chờ xử lý': orderStatusSummary['Chờ xử lý'] || 0, // Tổng đơn hàng chờ xử lý
      'Đã giao hàng': orderStatusSummary['Đã giao hàng'] || 0, // Tổng đơn hàng đã giao
      'Đã hủy': orderStatusSummary['Đã hủy'] || 0, // Tổng đơn hàng đã hủy (nếu có)
    };
  });

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <div className="container mx-auto px-2 py-6">
      {/* Biểu đồ đơn hàng */}
      <Card className="mb-6">
        <CardHeader
          title={
            <span className="text-xl font-semibold italic">
              {`Đơn hàng ${
                timeFrame === 'day'
                  ? `từ ${
                      time?.startDate
                        ? formatDate(time.startDate)
                        : 'ngày bắt đầu không hợp lệ'
                    } đến ${
                      time?.endDate
                        ? formatDate(time.endDate)
                        : 'ngày kết thúc không hợp lệ'
                    }`
                  : timeFrame === 'month'
                    ? `của tháng ${format(new Date(), ` MM/${year}`)}`
                    : `năm ${year}`
              }`}
            </span>
          }
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: '12px' }} />
              <YAxis
                tick={{ fontSize: '12px' }}
                allowDecimals={false}
                tickFormatter={(value) => Math.round(value)}
              />
              <Tooltip />
              {/* Vẽ các đường biểu diễn cho các trạng thái đơn hàng */}
              <Line type="monotone" dataKey="Chờ xử lý" stroke="#ff7300" />
              <Line type="monotone" dataKey="Đã giao hàng" stroke="#00ff00" />
              <Line type="monotone" dataKey="Đã hủy" stroke="#ff0000" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStatistics;
