import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface Option {
  label: string;
  value: string | number;
}

interface SingleSelectDropdownProps {
  value: string | number | null;
  options: Option[];
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  label?: string;
}

/**
 * Single-select dropdown component using Material UI Select.
 * Allows selecting only one option at a time from a dropdown list.
 */
export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Select an option...',
  label,
}) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const newValue = event.target.value;
    // Clear filter if empty string or "any" is selected
    if (newValue === '' || newValue === 'any') {
      onChange(null);
    } else {
      onChange(newValue);
    }
  };

  return (
    <FormControl fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value || ''}
        onChange={handleChange}
        label={label}
        displayEmpty
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
