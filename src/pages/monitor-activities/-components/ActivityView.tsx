import { Box, Skeleton } from '@mui/material';
import { DataGrid, GridColDef, GridComparatorFn } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useFilters } from '../../../components/FilterContext';
import { filterData } from '../../../utils/filters.utils';
import { useDataFromSource } from '../../../hooks/useDataFromSource';
import { FilterConfig } from '../../../types/filters.types';

interface ActivityViewProps {
  filterConfigs: FilterConfig[];
  searchTerm: string;
  searchMode: 'text' | 'regex';
}

const dateComparator: GridComparatorFn<string> = (v1, v2) => {
  return dayjs(v1).isAfter(dayjs(v2)) ? 1 : 0;
};

// Table columns for experiments list
const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Run #',
    width: 100,
  },
  {
    field: 'experiment_name',
    headerName: 'Name',
    width: 250,
    flex: 1,
  },
  {
    field: 'cromwell_result',
    headerName: 'Cromwell Result',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
  },
  {
    field: 'user',
    headerName: 'User',
    width: 120,
  },
  {
    field: 'site',
    headerName: 'Site',
    width: 100,
  },
  {
    field: 'start_time',
    headerName: 'Submitted',
    sortComparator: dateComparator,
    width: 150,
  },
  {
    field: 'end_time',
    headerName: 'Updated',
    width: 150,
  },
];

/**
 * Query the experiment data and render as an interactive table with filtering
 */
export const ActivityView: React.FC<ActivityViewProps> = ({
  filterConfigs,
  searchTerm,
  searchMode,
}) => {
  const { activeFilters } = useFilters();
  const navigate = useNavigate();
  const rawData = useDataFromSource('data/runs-all-all-any-7-2025-10-23.csv');

  // Transform CSV data to match expected format
  const experiments = React.useMemo(() => {
    if (!rawData) return null;
    return rawData.map((row: any) => ({
      id: row['Run#'],
      experiment_name: row.Name,
      start_time: row.Submitted,
      end_time: row.Updated,
      status: row.Status,
      cromwell_result: row['Cromwell Result'],
      tag: row.Tag,
      user: row.User,
      site: row.Site,
    }));
  }, [rawData]);

  // Show loading skeleton while data is loading
  if (!experiments) {
    const emptyRows = new Array(10).fill(null);
    const indexedRows = emptyRows.map((row, i) => i);
    return (
      <Box
        sx={{
          padding: 2,
        }}
      >
        {indexedRows.map((row) => (
          <Skeleton key={row} height={50} />
        ))}
      </Box>
    );
  }

  // Apply filters and search to the data
  const filteredData = filterData(
    experiments,
    activeFilters,
    filterConfigs,
    searchTerm,
    searchMode
  );

  return (
    <>
      <DataGrid
        rows={filteredData}
        getRowId={(row) => row.id}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'start_time', sort: 'desc' }],
          },
        }}
        onRowClick={() => navigate({ to: '/monitor-activities/detail' })}
        disableColumnSelector
        disableRowSelectionOnClick
      />
    </>
  );
};
