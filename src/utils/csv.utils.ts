/**
 * Utility functions for CSV export
 */

/**
 * Convert an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Array of header names in desired order
 * @returns CSV string
 */
export function convertToCSV(data: any[], headers: string[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Create CSV header row
  const headerRow = headers.join(',');

  // Create data rows
  const dataRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header];
        // Handle null/undefined values
        if (value === null || value === undefined) {
          return '';
        }
        // Convert to string and escape quotes
        const stringValue = String(value);
        // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
        if (
          stringValue.includes(',') ||
          stringValue.includes('"') ||
          stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download a CSV file
 * @param csvContent CSV string content
 * @param filename Name of the file to download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate filename for export based on filter values
 * @param filters Array of DataFilter objects from FilterContext
 * @returns Filename string
 */
export function generateExportFilename(
  filters: Array<{ field: string; value: any; operator: string }>
): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format

  // Helper function to find filter value by field name
  const getFilterValue = (fieldName: string): any => {
    const filter = filters.find((f) => f.field === fieldName);
    return filter?.value;
  };

  // Extract filter values or use defaults
  const siteValues = getFilterValue('site');
  let site: string;
  if (Array.isArray(siteValues) && siteValues.length > 0) {
    if (siteValues.length === 1) {
      site = capitalize(siteValues[0]);
    } else {
      // Multiple sites: use 'sites' prefix + capitalized names concatenated
      site = 'sites' + siteValues.map(capitalize).join('');
    }
  } else {
    site = 'all';
  }

  const status = getFilterValue('status') || 'all';

  const resultValues = getFilterValue('cromwell_result');
  let result: string;
  if (Array.isArray(resultValues) && resultValues.length > 0) {
    result = resultValues.map(capitalize).join('');
  } else {
    result = 'any';
  }

  const days = getFilterValue('days') || '7';

  return `runs-${site}-${status}-${result}-${days}-${date}_${time}.csv`;
}
