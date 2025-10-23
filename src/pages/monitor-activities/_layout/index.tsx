import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CodeIcon from '@mui/icons-material/Code';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { FilterContext, useFilters } from '../../../components/FilterContext';
import { ActivityView } from '../-components/ActivityView';
import { ActivityViewHeader } from '../-components/ActivityViewHeader';
import { LeftPanel } from '../-components/LeftPanel';
import { FilterConfig } from '../../../types/filters.types';
import {
  convertToCSV,
  downloadCSV,
  generateExportFilename,
} from '../../../utils/csv.utils';

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
 * Inner component that has access to FilterContext
 */
function ActivityListContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'regex'>('text');
  const [showMyRuns, setShowMyRuns] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { activeFilters } = useFilters();

  // Callback to receive filtered data from ActivityView
  const handleFilteredDataChange = useCallback((data: any[]) => {
    setFilteredData(data);
  }, []);

  // Handle CSV export
  const handleExport = () => {
    if (filteredData.length === 0) {
      return;
    }

    // Define headers matching the data structure
    const headers = [
      'id',
      'experiment_name',
      'cromwell_result',
      'status',
      'user',
      'site',
      'start_time',
      'end_time',
    ];

    // Convert data to CSV
    const csvContent = convertToCSV(filteredData, headers);

    // Generate filename based on active filters
    const filename = generateExportFilename(activeFilters);

    // Download the file
    downloadCSV(csvContent, filename);
  };

  return (
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
        {/* Breadcrumbs and Search */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
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
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              variant="outlined"
              label="Search"
              size="small"
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
              sx={{ minWidth: 250 }}
            />
            <ToggleButtonGroup
              value={searchMode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode !== null) {
                  setSearchMode(newMode);
                }
              }}
              size="small"
              aria-label="search mode"
            >
              <ToggleButton value="text" aria-label="text search">
                <TextFieldsIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="regex" aria-label="regex search">
                <CodeIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={showMyRuns ? 'mine' : 'all'}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setShowMyRuns(newValue === 'mine');
                }
              }}
              size="small"
              aria-label="user filter"
            >
              <ToggleButton value="all" aria-label="all runs">
                <GroupsIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="mine" aria-label="my runs">
                <PersonIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={filteredData.length === 0}
              aria-label="export to CSV"
              sx={{
                height: '40px',
                minHeight: '40px',
              }}
            >
              Export
            </Button>
          </Stack>
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
            onToggleFiltersPanel={() => {}} // No-op since filters are always visible
          />
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ActivityView
              filterConfigs={filterConfigs}
              searchTerm={searchTerm}
              searchMode={searchMode}
              showMyRuns={showMyRuns}
              onFilteredDataChange={handleFilteredDataChange}
            />
          </Box>
        </Paper>
      </Box>
    </Stack>
  );
}

/**
 * List view of all activities in the monitor-activities Task Flow.
 * Custom layout with left panel (logo, project name, filters) and right panel (breadcrumbs, table).
 */
function ActivityList() {
  return (
    <FilterContext>
      <ActivityListContent />
    </FilterContext>
  );
}
