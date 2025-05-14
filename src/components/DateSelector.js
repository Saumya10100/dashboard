import React from 'react';
import { FormControl, FormLabel, TextField } from '@mui/material';

const DateSelector = ({ label, value, onChange, minDate, maxDate }) => {
  const handleDateChange = (date) => {
    if (minDate && date < minDate) {
      alert(`${label} cannot be earlier than ${minDate}!`);
    } else if (maxDate && date > maxDate) {
      alert(`${label} cannot be later than ${maxDate}!`);
    } else {
      onChange(date);
    }
  };

  return (
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
        {label}
      </FormLabel>
      <TextField
        type="date"
        value={value}
        onChange={(e) => handleDateChange(e.target.value)}
        variant="outlined"
        fullWidth
        InputProps={{
          style: { color: '#fff' },
        }}
      />
    </FormControl>
  );
};

export default DateSelector;