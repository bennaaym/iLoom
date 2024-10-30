import React from 'react';
import { Select, MenuItem, FormControl, SelectChangeEvent, Typography } from '@mui/material';

interface SearchableSelectProps {
  label: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, value, onChange }) => {
  return (
    <FormControl fullWidth>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>
      <Select value={value} onChange={onChange} fullWidth>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SearchableSelect;
