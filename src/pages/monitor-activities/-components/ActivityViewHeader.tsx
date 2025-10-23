import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';

interface ActivityViewHeaderProps {
  onToggleFiltersPanel: () => void;
}

/**
 * Activity table header section with filters button
 */
export const ActivityViewHeader: React.FC<ActivityViewHeaderProps> = ({
  onToggleFiltersPanel,
}) => {
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
    </Stack>
  );
};
