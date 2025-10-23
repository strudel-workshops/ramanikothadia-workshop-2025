import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { cleanPath } from '../../../utils/queryParams.utils';
import { ImageWrapper } from '../../../components/ImageWrapper';
import { AppLink } from '../../../components/AppLink';
import { FiltersPanel } from './FiltersPanel';
import { FilterConfig } from '../../../types/filters.types';

interface LeftPanelProps {
  filterConfigs: FilterConfig[];
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ filterConfigs }) => {
  // FiltersPanel requires onClose prop, but we don't need close functionality
  // in the left panel since filters are always visible
  const handleClose = () => {
    // No-op since we don't want to close the filters panel
  };

  return (
    <Box
      sx={{
        width: '350px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid',
        borderColor: 'grey.300',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo and Project Name */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <AppLink to="/">
            <ImageWrapper height={30}>
              <img
                src={cleanPath(
                  `${import.meta.env.BASE_URL}/strudel-logo-icon.png`
                )}
                alt="Logo"
              />
            </ImageWrapper>
          </AppLink>
          <AppLink to="/">
            <Typography variant="h6" component="div" fontWeight="bold">
              My Project
            </Typography>
          </AppLink>
        </Stack>
      </Box>

      {/* Filters Panel */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <FiltersPanel filterConfigs={filterConfigs} onClose={handleClose} />
      </Box>
    </Box>
  );
};
