import dayjs from 'dayjs';
import { DataFilter, FilterConfig } from '../types/filters.types';

export const filterBySearchText = (
  allData: any[],
  searchText?: string,
  searchMode: 'text' | 'regex' = 'text'
) => {
  let filteredData = allData;
  if (searchText) {
    if (searchMode === 'regex') {
      try {
        // Create regex with case-insensitive flag
        const regex = new RegExp(searchText, 'i');
        filteredData = allData.filter((d) => {
          const rowString = JSON.stringify(d);
          return regex.test(rowString);
        });
      } catch (error) {
        // If regex is invalid, return all data (no filtering)
        // This prevents crashes from malformed regex patterns
        // console.warn('Invalid regex pattern:', searchText, error);
        return allData;
      }
    } else {
      // Text search mode (default)
      filteredData = allData.filter((d) => {
        const rowString = JSON.stringify(d).toLowerCase();
        return rowString.indexOf(searchText.toLowerCase()) > -1;
      });
    }
  }
  return filteredData;
};

export const filterByDataFilters = (
  allData: any[],
  filters: DataFilter[],
  filterConfigs: FilterConfig[]
) => {
  let filteredData = allData;
  if (allData && filters.length > 0) {
    // Pre build map of filter to operator for performance boost
    const filterOperatorMap: Record<string, string | undefined> = {};
    filters.forEach((f) => {
      if (filterConfigs) {
        const filterConfig = filterConfigs.find((c) => c.field === f.field);
        filterOperatorMap[f.field] = filterConfig?.operator;
      }
    });
    filteredData = allData.filter((d) => {
      let include = true;
      // All filters have to be matched for a row to be included in the filtered data
      filters.forEach((f) => {
        let match = false;
        if (include === true) {
          switch (filterOperatorMap[f.field]) {
            case 'equals': {
              // Special handling for status field
              if (f.field === 'status') {
                if (f.value === 'active') {
                  // "active" means show all rows that are not "done"
                  if (d[f.field] !== 'done') {
                    match = true;
                  }
                } else if (f.value === 'done') {
                  // "done" means show only "done" rows
                  if (d[f.field] === 'done') {
                    match = true;
                  }
                }
              } else {
                // Default equals behavior for other fields
                if (d[f.field] === f.value) {
                  match = true;
                }
              }
              break;
            }
            case 'contains': {
              if (d[f.field].indexOf(f.value) > -1) {
                match = true;
              }
              break;
            }
            case 'contains-one-of': {
              if (Array.isArray(f.value)) {
                f.value.forEach((v) => {
                  if (!match) {
                    if (Array.isArray(d[f.field])) {
                      if (d[f.field].indexOf(v) > -1) {
                        match = true;
                      }
                    } else {
                      if (d[f.field] === v) {
                        match = true;
                      }
                    }
                  }
                });
              }
              break;
            }
            case 'equals-one-of': {
              if (Array.isArray(f.value)) {
                f.value.forEach((v) => {
                  if (!match) {
                    if (d[f.field] === v) {
                      match = true;
                    }
                  }
                });
              }
              break;
            }
            case 'between-inclusive': {
              if (Array.isArray(f.value)) {
                const min = f.value[0];
                const max = f.value[1];
                if (d[f.field] >= min && d[f.field] <= max) {
                  match = true;
                }
              }
              break;
            }
            case 'between-dates-inclusive': {
              if (
                typeof d[f.field] === 'string' &&
                Array.isArray(f.value) &&
                f.value[0] &&
                f.value[1]
              ) {
                const dateValue = dayjs(d[f.field]);
                if (
                  dateValue.isAfter(f.value[0]) &&
                  dateValue.isBefore(f.value[1])
                ) {
                  match = true;
                }
              } else {
                match = true;
              }
              break;
            }
            default:
              break;
          }
        }
        if (!match) include = false;
      });
      return include;
    });
  }
  return filteredData;
};

export const filterData = (
  allData: any[],
  filters: DataFilter[],
  filterConfigs: FilterConfig[],
  searchText?: string,
  searchMode: 'text' | 'regex' = 'text'
) => {
  const filteredByText = filterBySearchText(allData, searchText, searchMode);
  const filteredByTextAndDataFilters = filterByDataFilters(
    filteredByText,
    filters,
    filterConfigs
  );
  return filteredByTextAndDataFilters;
};

export const initSliderTicks = (
  ticks: number | null,
  domain: number[],
  scale?: any
) => {
  if (ticks === 2) {
    return domain;
  } else if (ticks !== null) {
    return scale.ticks(ticks);
  } else {
    return;
  }
};
