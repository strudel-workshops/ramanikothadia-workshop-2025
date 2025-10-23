import {
  Box,
  Breadcrumbs,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FilterContext } from '../../../components/FilterContext';
import { ActivityView } from '../-components/ActivityView';
import { ActivityViewHeader } from '../-components/ActivityViewHeader';
import { LeftPanel } from '../-components/LeftPanel';
import { FilterConfig } from '../../../types/filters.types';

export const Route = createFileRoute('/monitor-activities/_layout/')({
  component: ActivityList,
});

// Filter definitions for the monitor activities task flow
const filterConfigs: FilterConfig[] = [
  {
    field: 'site',
    label: 'Site',
    operator: 'contains-one-of',
    filterComponent: 'MultiSelectDropdown',
    filterProps: {
      options: [
        { label: 'Crux', value: 'crux' },
        { label: 'Defiant', value: 'defiant' },
        { label: 'Dori', value: 'dori' },
        { label: 'JGI', value: 'jgi' },
        { label: 'KBase', value: 'kbase' },
        { label: 'NMDC', value: 'nmdc' },
        { label: 'NMDC Tahoma', value: 'nmdc_tahoma' },
        { label: 'Perlmutter', value: 'perlmutter' },
        { label: 'Tahoma', value: 'tahoma' },
        { label: 'Any', value: 'any' },
      ],
      placeholder: 'Select sites...',
    },
  },
  {
    field: 'days',
    label: 'Days',
    operator: 'equals',
    filterComponent: 'TextField',
    filterProps: {
      type: 'number',
      placeholder: 'Enter number of days...',
    },
  },
  {
    field: 'status',
    label: 'Status',
    operator: 'equals',
    filterComponent: 'SingleSelectDropdown',
    filterProps: {
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Done', value: 'done' },
        { label: 'Any', value: 'any' },
      ],
      placeholder: 'Select status...',
    },
  },
  {
    field: 'cromwell_result',
    label: 'Result',
    operator: 'contains-one-of',
    filterComponent: 'MultiSelectDropdown',
    filterProps: {
      options: [
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Any', value: 'any' },
      ],
      placeholder: 'Select results...',
    },
  },
];

/**
 * List view of all activities in the monitor-activities Task Flow.
 * Custom layout with left panel (logo, project name, filters) and right panel (breadcrumbs, table).
 */
function ActivityList() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <FilterContext>
      <Stack direction="row" sx={{ height: '100vh', overflow: 'hidden' }}>
        {/* Left Panel: Logo, My Project, Filters */}
        <LeftPanel filterConfigs={filterConfigs} />

        {/* Right Panel: Breadcrumbs and Data Table */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Breadcrumbs */}
          <Box
            sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.300' }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/">
                <HomeIcon sx={{ verticalAlign: 'middle' }} />
              </Link>
              <Link underline="hover" color="inherit">
                ...
              </Link>
              <Typography color="text.primary">Monitor Activities</Typography>
            </Breadcrumbs>
          </Box>

          {/* Main Content Area */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ActivityViewHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onToggleFiltersPanel={() => {}} // No-op since filters are always visible
            />
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ActivityView
                filterConfigs={filterConfigs}
                searchTerm={searchTerm}
              />
            </Box>
          </Paper>
        </Box>
      </Stack>
    </FilterContext>
  );
}
