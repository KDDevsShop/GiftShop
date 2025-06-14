import { useEffect, useMemo, useRef, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Header from '../../components/Dashboard/Header';
import Dashboard from '../../components/Dashboard/Dashboard';
import RevenueStatistic from '../../components/Dashboard/RevenueStatistic';
import OrderStatistics from '../../components/Dashboard/OrderStatistic';
import TotalSalesChart from '../../components/Dashboard/TotalSalesChart';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ProductSalesChart from '../../components/Dashboard/ProductSalesChart';
import UserStatistic from '../../components/Dashboard/UserStatistic';
import statictisService from '../../services/statictis.service';

const HomePage = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  const [timeFrame, setTimeFrame] = useState('year');
  // const [showDetails, setShowDetails] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [year, setYear] = useState(currentYear);
  const [inputValue, setInputValue] = useState('');
  const [statictisByTime, setStatictisByTime] = useState(null);
  const [statictisByYear, setStatictisByYear] = useState(null);
  const [totalUsersByYear, setTotalUsersByYear] = useState(0);
  const [totalUsersByTime, setTotalUsersBytime] = useState(null);
  const dropdownRef = useRef();
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  console.log(year);

  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const today = new Date();
    let calculatedStartDate;
    let calculatedEndDate = format(today, 'yyyy/MM/dd');

    if (timeFrame === 'day') {
      // Nếu là 'day', lấy 7 ngày trước
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      calculatedStartDate = format(sevenDaysAgo, 'yyyy/MM/dd');
    } else if (timeFrame === 'month') {
      // Nếu là 'month', lấy ngày đầu và cuối của tháng đã chọn
      calculatedStartDate = `${year}/${String(month).padStart(2, '0')}/01`;
      const lastDayOfMonth = new Date(year, month, 0);
      calculatedEndDate = format(lastDayOfMonth, 'yyyy/MM/dd');
    } else if (timeFrame === 'year') {
      // Nếu là 'year', lấy ngày đầu và cuối của năm đã chọn
      calculatedStartDate = `${year}/01/01`;
      calculatedEndDate = `${year}/12/31`;
    }

    setStartDate(calculatedStartDate);
    setEndDate(calculatedEndDate);
  }, [timeFrame, month, year]);

  for (let i = currentYear; i > currentYear - 5; i--) {
    years.push(i);
  }
  const [showDropdown, setShowDropdown] = useState(false); // State để điều khiển việc hiển thị dropdown

  const handleSelectYear = (yearOption) => {
    setYear(yearOption); // Gán giá trị khi người dùng chọn năm
    setShowDropdown(false); // Ẩn dropdown sau khi chọn
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (inputValue) {
        // Nếu khớp, gán giá trị của năm đó
        setYear(inputValue);
        setShowDropdown(false); // Ẩn dropdown sau khi chọn
        setInputValue('');
      } else {
        // Nếu không khớp, chỉ hiện dropdown mà không gán giá trị
        setShowDropdown(true);
      }
    }
  };

  const handleStartDateChange = (date) => {
    if (date) {
      setStartDate(format(date, 'yyyy/MM/dd'));
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      setEndDate(format(date, 'yyyy/MM/dd'));
    }
  };

  useEffect(() => {
    if (!startDate || !endDate) {
      return; // Không gọi API nếu thiếu startDate hoặc endDate
    }
    const fetchData = async () => {
      try {
        // Gọi cả hai API cùng một lúc
        const [
          revenueResponse,
          allRevenueResponse,
          usersResponseByYear,
          usersResponseByTime,
        ] = await Promise.all([
          statictisService.getStatisticsByDateRange(startDate, endDate),
          statictisService.getStatisticsByYear(year),
          statictisService.getTotalUsersByYear(year),
          statictisService.getTotalUsersByDate(startDate, endDate),
        ]);

        console.log(allRevenueResponse);

        if (revenueResponse) {
          setStatictisByTime(allRevenueResponse.data);
        } else {
          console.error('Không có dữ liệu doanh thu.');
        }

        if (allRevenueResponse) {
          setStatictisByYear(allRevenueResponse.data);
        } else {
          console.error('Không có dữ liệu doanh thu.');
        }

        if (usersResponseByYear) {
          setTotalUsersByYear(usersResponseByYear);
        } else {
          console.error('Không có dữ liệu người dùng.');
        }

        if (usersResponseByTime) {
          setTotalUsersBytime(usersResponseByTime);
        } else {
          console.error('Không có dữ liệu người dùng.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, [startDate, endDate, year]);

  const handlePrintReport = async () => {
    const pdf = new jsPDF();
    const imgWidth = pdf.internal.pageSize.getWidth();
    const position = 0;

    try {
      const page1 = document.getElementById('page1');
      const page2 = document.getElementById('page2');

      if (!page1 || !page2) {
        console.error('One of the pages is missing');
        return;
      }

      // Đảm bảo page2 được hiển thị
      page2.style.display = 'block';
      page2.style.visibility = 'visible';

      // Chụp ảnh từ page1
      const imgPage1 = await html2canvas(page1, { useCORS: true });
      let imgHeight = (imgPage1.height * imgWidth) / imgPage1.width;
      pdf.addImage(
        imgPage1.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      pdf.addPage();

      // Chụp ảnh từ page2
      const imgPage2 = await html2canvas(page2, { useCORS: true, scale: 2 });
      const contentDataURL = imgPage2.toDataURL('image/png');

      // Kiểm tra chiều cao và thêm ảnh vào PDF
      imgHeight = (imgPage2.height * imgWidth) / imgPage2.width;
      let currentHeight = 0;
      let pageHeight = pdf.internal.pageSize.getHeight();

      // Nếu chiều cao ảnh lớn hơn chiều cao của một trang, chia thành nhiều trang
      while (currentHeight < imgHeight) {
        pdf.addImage(
          contentDataURL,
          'PNG',
          0,
          position - currentHeight,
          imgWidth,
          imgHeight
        );
        currentHeight += pageHeight;

        // Nếu còn nội dung, thêm trang mới
        if (currentHeight < imgHeight) {
          pdf.addPage();
        }
      }

      // Lưu PDF
      pdf.save('report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const totalRevenue = useMemo(
    () =>
      statictisByYear
        ?.map((item) => item.totalRevenue)
        .reduce((a, b) => a + b, 0),
    [statictisByYear]
  );

  const totalOrders = useMemo(
    () =>
      statictisByYear
        ?.map((item) => item.totalOrders)
        .reduce((a, b) => a + b, 0),
    [statictisByYear]
  );

  const totalProductSolds = useMemo(
    () =>
      statictisByYear
        ?.map((item) => item.totalProducts)
        .reduce((a, b) => a + b, 0),
    [statictisByYear]
  );

  return (
    <>
      <div className='p-2' id='page1'>
        <Header />
        {/* form control */}
        {/* <div className='mb-6 flex justify-between'>
          <FormControl className='w-1/4'>
            <InputLabel>Choose time for statistic</InputLabel>
            <Select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              label='Choose time for statistic'
            >
              <MenuItem value='day'>By range</MenuItem>
              <MenuItem value='month'>By monnth</MenuItem>
              <MenuItem value='year'>By year</MenuItem>
            </Select>
          </FormControl>
          {timeFrame === 'year' && (
            <div ref={dropdownRef} className='relative w-[200px]'>
              <input
                type='text'
                className='w-full rounded border p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Type year here'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
              />
              {showDropdown && (
                <ul className='absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg'>
                  {years.map((yearOption) => (
                    <li
                      key={yearOption}
                      className='cursor-pointer p-2 hover:bg-blue-500 hover:text-white'
                      onClick={() => handleSelectYear(yearOption)}
                    >
                      {yearOption}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {timeFrame === 'month' && (
            <div className='flex items-center space-x-4'>
              <FormControl className='w-[200px]'>
                <InputLabel>Choose month</InputLabel>
                <Select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  label='Choose month'
                >
                  {months.map((monthOption) => (
                    <MenuItem key={monthOption.value} value={monthOption.value}>
                      {monthOption.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div ref={dropdownRef} className='relative w-[200px]'>
                <input
                  type='text'
                  className='w-full rounded border p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Type year'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={handleKeyDown}
                />
                {showDropdown && (
                  <ul className='absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg'>
                    {years.map((yearOption) => (
                      <li
                        key={yearOption}
                        className='cursor-pointer p-2 hover:bg-blue-500 hover:text-white'
                        onClick={() => handleSelectYear(yearOption)}
                      >
                        {yearOption}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {timeFrame === 'day' && (
            <div className='flex items-center space-x-4'>
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={handleStartDateChange}
                dateFormat='yyyy/MM/dd'
                className='rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholderText='Chọn ngày bắt đầu'
              />
              <DatePicker
                selected={endDate ? new Date(endDate) : null}
                onChange={handleEndDateChange}
                dateFormat='yyyy/MM/dd'
                className='rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholderText='Chọn ngày kết thúc'
              />
            </div>
          )}
        </div> */}
        {/* Nội dung chính */}
        <div>
          {console.log(statictisByYear)}
          <Dashboard
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            totalUsers={totalUsersByTime?.totalUsersUntilEndDate}
            totalProductsSold={totalProductSolds}
          />
          <RevenueStatistic
            timeFrame={timeFrame}
            year={year}
            statictisByTime={statictisByTime}
            time={statictisByTime?.dateRange}
          />
          {/* <div className='grid grid-cols-3'>
            <div className='col-span-2'>
              <OrderStatistics
                timeFrame={timeFrame}
                totalOrderByTime={
                  timeFrame === 'year'
                    ? statictisByYear?.statisticsByMonth
                    : statictisByTime?.statisticsByDate
                }
                year={year}
                time={statictisByTime?.dateRange}
              />
            </div>
            <div>
              <TotalSalesChart
                timeFrame={timeFrame}
                productTypeSummary={
                  timeFrame === 'year'
                    ? statictisByYear?.productTypeSummary
                    : statictisByTime?.productTypeSummary
                }
                totalProductsSold={
                  timeFrame === 'year'
                    ? statictisByYear?.totalProductsSold
                    : statictisByTime?.totalProductsSold
                }
                year={year}
                time={statictisByTime?.dateRange}
              />
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className='' id='page2'>
        <ProductSalesChart
          timeFrame={timeFrame}
          year={year}
          statictisByTime={
            timeFrame === 'year'
              ? statictisByYear?.statisticsByMonth
              : statictisByTime?.statisticsByDate
          }
          time={statictisByTime?.dateRange}
        />
        <UserStatistic
          timeFrame={timeFrame}
          year={year}
          statictisByTime={
            timeFrame === 'year'
              ? totalUsersByYear?.totalUsersByMonth
              : totalUsersByTime?.totalUsersByDate
          }
          time={statictisByTime?.dateRange}
          totalUsers={totalUsersByTime?.totalUsersUntilEndDate}
        />
      </div> */}

      {/* <button
        className='mb-4 rounded bg-purple-800 p-2 text-white'
        onClick={handlePrintReport}
      >
        Export to PDF
      </button> */}
    </>
  );
};

export default HomePage;
