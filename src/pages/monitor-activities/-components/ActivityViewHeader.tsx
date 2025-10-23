import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

interface ActivityViewHeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onToggleFiltersPanel: () => void;
}

/**
 * Activity table header section with filters button and search bar
 */
export const ActivityViewHeader: React.FC<ActivityViewHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onToggleFiltersPanel,
}) => {
  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setSearchTerm(evt.target.value);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <Typography variant="h6" component="h2" flex={1}>
        Experiments List
      </Typography>
      <Button startIcon={<FilterListIcon />} onClick={onToggleFiltersPanel}>
        Filters
      </Button>
      <TextField
        variant="outlined"
        label="Search"
        size="small"
        value={searchTerm}
        onChange={handleSearch}
      />
    </Stack>
  );
};
