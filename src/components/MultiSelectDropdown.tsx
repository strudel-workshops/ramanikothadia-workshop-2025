import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

interface Option {
  label: string;
  value: string | number;
}

interface MultiSelectDropdownProps {
  values: (string | number)[] | null;
  options: Option[];
  onChange: (values: (string | number)[] | null) => void;
  placeholder?: string;
  label?: string;
}

/**
 * Multi-select dropdown component using Material UI Autocomplete.
 * Allows selecting multiple options from a dropdown list.
 */
export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  values,
  options,
  onChange,
  placeholder = 'Select options...',
  label,
}) => {
  // Convert values array to option objects for Autocomplete
  const selectedOptions = options.filter((option) =>
    values?.includes(option.value)
  );

  const handleChange = (_: any, newValue: Option[]) => {
    const newValues = newValue.map((option) => option.value);

    // Check if "any" was just selected
    const anyJustSelected =
      newValues.includes('any') && !values?.includes('any');

    if (anyJustSelected) {
      // If "any" was just selected, clear the filter completely
      onChange(null);
    } else {
      // Filter out "any" from selections and update
      const filteredValues = newValues.filter((v) => v !== 'any');
      onChange(filteredValues.length > 0 ? filteredValues : null);
    }
  };

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          label={label}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.label}
            {...getTagProps({ index })}
            key={option.value}
          />
        ))
      }
      fullWidth
    />
  );
};
