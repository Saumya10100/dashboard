import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Select, MenuItem, FormControl, Typography, FormLabel, TextField } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import DateSelector from './DateSelector';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import StatCard from './StatCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const MainContent = () => {
  const [, setData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [profit, setProfit] = useState(0);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [stateName, setStateName] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const handleStartDateChange = (date) => {
    if (endDate && date > endDate) {
      alert("Start Date cannot be later than End Date!");
    } else {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      alert("End Date cannot be earlier than Start Date!");
    } else {
      setEndDate(date);
    }
  };

  useEffect(() => {
    fetch('/sales.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((salesData) => setSalesData(salesData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => { 
    var state = [];
    if (salesData.length > 0) {
      // eslint-disable-next-line array-callback-return
      salesData.map((item) => {
        state.push(item.State);
      })
      let uniqueArray = [...new Set(state)];
      setStateName(uniqueArray.sort());
      setSelectedState(uniqueArray.sort()[0]);
     }
  }, [salesData]);

  useEffect(() => { 
    const filteredData = salesData.filter((item) => {
      const currentDate = new Date(item["Order Date"]);
      const StartDate = new Date(startDate);
      const EndDate = new Date(endDate);

      const isWithinDateRange = (!startDate || currentDate >= StartDate) &&
                            (!endDate || currentDate <= EndDate);

      const isMatchingState = !selectedState || item.State === selectedState;

      return isWithinDateRange && isMatchingState;
  });
    setFilteredData(filteredData);
  }, [salesData, selectedState, startDate, endDate]);


  useEffect(() => {
    var totalSales = 0;
    var quantity = 0;
    var discount = 0;
    var profit = 0;
    var cityAggregation = {};
    if (filteredData.length > 0) {
      // eslint-disable-next-line array-callback-return
      filteredData.map((item) => {
          totalSales += item.Sales;
          quantity += item.Quantity;
          discount += item.Discount;
          profit += item.Profit;
          cityAggregation = filteredData.reduce((acc, item) => {
              if (!acc[item.City]) {
                acc[item.City] = 0;
              }
              acc[item.City] += item.Quantity;
              return acc;
        }, {});
      })
      setTotalSales(totalSales);
      setQuantity(quantity);
      setDiscount(discount);
      setProfit(profit);
      const cities = Object.keys(cityAggregation);
      const quantities = Object.values(cityAggregation);
      setAggregatedData({ cities, quantities });
     }
      
  }, [endDate, filteredData, salesData, selectedState, startDate]);

  useEffect(() => {
    fetch('/sampleData.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const unqCategory = [...new Set(filteredData.map((item) => item["Category"]))];
    const groupedSales = filteredData.reduce((accumulator, current) => {
    if (!accumulator[current.Category]) {
      accumulator[current.Category] = 0;
    }
    accumulator[current.Category] += current.Sales;
      return accumulator;
    }, {});

    const categoryResult = Object.keys(groupedSales).map((Category) => ({
    category: Category,
    totalSales: groupedSales[Category]
  }));

  const unqSegment = [...new Set(filteredData.map((item) => item["Segment"]))];
    const groupedSengmentSales = filteredData.reduce((accumulator, current) => {
    if (!accumulator[current.Segment]) {
      accumulator[current.Segment] = 0;
    }
    accumulator[current.Segment] += current.Sales; 
      return accumulator;
    }, {});
    const segmentResult = Object.keys(groupedSengmentSales).map((Segment) => ({
    segment: Segment,
    totalSales: groupedSengmentSales[Segment]
  }));

  // eslint-disable-next-line no-unused-vars
  const unqSubCategory = [...new Set(filteredData.map((item) => item["Sub-Category"]))];
    const groupedSubSales = filteredData.reduce((accumulator, current) => {
    if (!accumulator[current["Sub-Category"]]) {
      accumulator[current["Sub-Category"]] = 0;
    }
    accumulator[current["Sub-Category"]] += current.Sales;
      return accumulator;
    }, {});
    const SubResult = Object.keys(groupedSubSales).map((Sub) => ({
    sub: Sub,
      totalSales: groupedSubSales[Sub]
  }));
  
  // eslint-disable-next-line no-unused-vars
  const unqProductName = [...new Set(filteredData.map((item) => item["Product Name"]))];
    const groupedProductName = filteredData.reduce((accumulator, current) => {
    if (!accumulator[current["Product Name"]]) {
      accumulator[current["Product Name"]] = 0;
    }
    accumulator[current["Product Name"]] += current.Sales;
      return accumulator;
    }, {});
    const ProductNameResult = Object.keys(groupedProductName).map((Product) => ({
    product: Product,
    totalSales: groupedProductName[Product]
  }));

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
        },
      },
    },
  };

  const pieChartData = {
    labels: unqCategory,
    datasets: [
      {
        data: categoryResult.map((item) => item.totalSales),
        backgroundColor: [
          '#D26E64',
          '#FFBF65',
          '#227CB4',
        ],
      },
    ],
  };

  const pieChartDataSegment = {
    labels: unqSegment,
    datasets: [
      {
        data: segmentResult.map((item) => item.totalSales),
        backgroundColor: [
          '#D26E64',
          '#FFBF65',
          '#227CB4',
        ],
      },
    ],
  };

  const barChartData = {
    labels: aggregatedData.cities,
    datasets: [
      {
        data: aggregatedData.quantities,
        backgroundColor: '#8BD0E0',
        color: '#fff',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: { legend: { position: 'top' } },
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#161a33' }}>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h5" style={{ fontWeight: 'bold', color: '#fff' }}>
          Sales Overview
        </Typography>

        <Box style={{ display: 'flex', gap: '15px' }}>
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
              '& .MuiSvgIcon-root': {
                color: '#fff',
              },
            }}
          >
            <FormLabel
              component="legend"
              style={{ marginBottom: '10px', color: '#fff' }}
            >
              Select State
            </FormLabel>
            <Select
              variant="outlined"
              fullWidth
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ color: '#fff' }}
            >
              {stateName.map((item) => (
                <MenuItem key={item} value={item} style={{ color: '#000' }}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <FormControl
            size="small"
            sx={{
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
              '& .MuiSvgIcon-root': {
                color: '#fff',
              },
            }}
          >
            <FormLabel
              component="legend"
              style={{ marginBottom: '10px', color: '#fff' }}
            >
              Select From date
            </FormLabel>
            <TextField
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                style: { color: '#fff' },
              }}
            />
          </FormControl>

          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
              '& .MuiSvgIcon-root': {
                color: '#fff',
              },
            }}
          >
            <FormLabel
              component="legend"
              style={{ marginBottom: '10px', color: '#fff' }}
            >
              Select To date
            </FormLabel>
            <TextField
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                style: { color: '#fff' },
              }}
            />
          </FormControl> */}

          <DateSelector
            label="Select From Date"
            value={startDate}
            onChange={handleStartDateChange}
            maxDate={endDate}
          />

          <DateSelector
            label="Select To Date"
            value={endDate}
            onChange={handleEndDateChange}
            minDate={startDate}
          />
        </Box>
      </Box>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div
            style={{
              width: '22%',
              height: '150px',
              backgroundColor: '#262D47',
              borderRadius: '10px',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
        >
          <div style={{ marginLeft: '30px' }}>
            <img src="/Sales Icon.svg" alt="sales" style={{ width: '60px', height: '60px' }} />
          </div>
          <div style={{ marginLeft: '30px' }}>
            <h3 style={{ textAlign: 'left', color: '#fff', margin: '10px 0' }}>Total Sales</h3>
            <p style={{ textAlign: 'left', color: '#fff', marginTop: '8px' }}>{totalSales}</p>
          </div>
          </div>
          <div
            style={{
              width: '22%',
              height: '150px',
              backgroundColor: '#262D47',
              borderRadius: '10px',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
        >
          <div style={{ marginLeft: '30px' }}>
            <img src="/Quantity-Icon.svg" alt="Quantity" style={{ width: '60px', height: '60px' }} />
          </div>
          <div style={{ marginLeft: '30px' }}>
            <h3 style={{ textAlign: 'left', color: '#fff', margin: '10px 0' }}>Quantity Sold</h3>
            <p style={{ textAlign: 'left', color: '#fff', marginTop: '8px' }}>{quantity}</p>
          </div>
          </div>
          <div
            style={{
              width: '22%',
              height: '150px',
              backgroundColor: '#262D47',
              borderRadius: '10px',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
          <div style={{ marginLeft: '30px' }}>
            <img src="/Discount-Icon.svg" alt="discount" style={{ width: '60px', height: '60px' }} />
            </div>
            <div style={{ marginLeft: '30px' }}>
              <h3 style={{ textAlign: 'left', color: '#fff', margin: '10px 0' }}>Discount%</h3>
              <p style={{ textAlign: 'left', color: '#fff', marginTop: '8px' }}>{discount}</p>
            </div>
          </div>
          <div
            style={{
              width: '22%',
              height: '150px',
              backgroundColor: '#262D47',
              borderRadius: '10px',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
        >
          <div style={{ marginLeft: '30px' }}>
            <img src="/Profit-Icon.svg" alt="profit" style={{ width: '60px', height: '60px' }} />
            </div>
            <div style={{ marginLeft: '30px' }}>
              <h3 style={{ textAlign: 'left', color: '#fff', margin: '10px 0' }}>Profit</h3>
              <p style={{ textAlign: 'left', color: '#fff', marginTop: '8px' }}>{profit}</p>
            </div>
          </div>
      </div> */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <StatCard
          icon="/Sales Icon.svg"
          title="Total Sales"
          value={totalSales}
        />
        <StatCard
          icon="/Quantity-Icon.svg"
          title="Quantity Sold"
          value={quantity}
        />
        <StatCard
          icon="/Discount-Icon.svg"
          title="Discount%"
          value={discount}
        />
        <StatCard
          icon="/Profit-Icon.svg"
          title="Profit"
          value={profit}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Box
          style={{
            width: '48%',
            height: '430px',
            backgroundColor: '#262D47',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            padding: '10px',
          }}
        >
          <Typography variant="h6" style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
            Sales by City
          </Typography>
          <Bar data={barChartData} options={barChartOptions} />
        </Box>
        <Box
          style={{
            width: '48%',
            backgroundColor: '#262D47',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            padding: '10px',
            overflowY: 'auto',
            height: '430px',
          }}
        >
          <Typography variant="h6" style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
            Sales by Products
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Sales in $</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ProductNameResult.map((item) => (
                  <TableRow key={item.product}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.totalSales}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Box
          style={{
            width: '30%',
            height: '500px',
            backgroundColor: '#262D47',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            padding: '10px',
          }}
        >
          <Typography variant="h6" style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
            Sales by Category
          </Typography>
          <Pie data={pieChartData} options={pieChartOptions} />
        </Box>

        <Box
          style={{
            width: '30%',
            backgroundColor: '#262D47',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            padding: '10px',
            height: '500px',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
            Sales by Sub-Category
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Sales in $</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SubResult.map((item) => (
                  <TableRow key={item.sub}>
                    <TableCell>{item.sub}</TableCell>
                    <TableCell>{item.totalSales}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          style={{
            width: '30%',
            height: '500px',
            backgroundColor: '#262D47',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            padding: '10px',
          }}
        >
          <Typography variant="h6" style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
            Sales by Segment
          </Typography>
          <Pie data={pieChartDataSegment} options={pieChartOptions} />
        </Box>
      </div>
    </div>
  );
};

export default MainContent;
