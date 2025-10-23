import React from 'react';
import { FilterField } from '../../../components/FilterField';
import { Filters } from '../../../components/Filters';
import { FilterConfig } from '../../../types/filters.types';

interface FiltersPanelProps {
  filterConfigs: FilterConfig[];
  onClose: () => any;
}

/**
 * Main filters panel in the monitor-activities Task Flow.
 * Filters are generated based on the configurations.
 * The input values will filter data in the main table.
 */
export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filterConfigs,
  onClose,
}) => {
  return (
    <Filters
      grouped={false}
      onClose={onClose}
      sx={{
        border: 'none',
      }}
    >
      {filterConfigs.map((f, i) => (
        <FilterField
          key={`${f.field}-${i}`}
          field={f.field}
          label={f.label}
          operator={f.operator || 'contains'}
          filterComponent={f.filterComponent}
          filterProps={f.filterProps}
        />
      ))}
    </Filters>
  );
};
