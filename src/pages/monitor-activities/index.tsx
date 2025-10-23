import { Box, Paper, Stack } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FilterContext } from '../../components/FilterContext';
import { PageHeader } from '../../components/PageHeader';
import { ActivityView } from './-components/ActivityView';
import { ActivityViewHeader } from './-components/ActivityViewHeader';
import { FiltersPanel } from './-components/FiltersPanel';
import { FilterConfig } from '../../types/filters.types';

export const Route = createFileRoute('/monitor-activities/')({
  component: ActivityList,
});

// Filter definitions for the monitor activities task flow
const filterConfigs: FilterConfig[] = [
  {
    field: 'status',
    label: 'Status',
    operator: 'contains-one-of',
    filterComponent: 'CheckboxList',
    filterProps: {
      options: [
        {
          label: 'Running',
          value: 'Running',
        },
        {
          label: 'Complete',
          value: 'Complete',
        },
        {
          label: 'Interrupted',
          value: 'Interrupted',
        },
        {
          label: 'Failed',
          value: 'Failed',
        },
      ],
    },
  },
  {
    field: 'experiment_name',
    label: 'Experiment Name',
    operator: 'contains',
    filterComponent: 'TextField',
    filterProps: {
      placeholder: 'Filter by name...',
    },
  },
];

/**
 * List view of all activities in the monitor-activities Task Flow.
 * This page includes the page header, filters panel, and main table.
 */
function ActivityList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);

  const handleCloseFilters = () => {
    setShowFiltersPanel(false);
  };

  const handleToggleFilters = () => {
    setShowFiltersPanel(!showFiltersPanel);
  };

  return (
    <FilterContext>
      <Box>
        <PageHeader
          pageTitle="Monitor Activities"
          description="View and filter experiment activities"
          sx={{
            marginBottom: 1,
            padding: 2,
          }}
        />
        <Box>
          <Stack direction="row">
            {showFiltersPanel && (
              <Box
                sx={{
                  width: '350px',
                }}
              >
                <FiltersPanel
                  filterConfigs={filterConfigs}
                  onClose={handleCloseFilters}
                />
              </Box>
            )}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minHeight: '600px',
                minWidth: 0,
              }}
            >
              <ActivityViewHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onToggleFiltersPanel={handleToggleFilters}
              />
              <ActivityView
                filterConfigs={filterConfigs}
                searchTerm={searchTerm}
              />
            </Paper>
          </Stack>
        </Box>
      </Box>
    </FilterContext>
  );
}
