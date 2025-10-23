import { Box } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/monitor-activities/_layout')({
  component: MonitorActivitiesLayout,
});

/**
 * Layout wrapper for the monitor-activities Task Flow.
 * This layout intentionally does not include the TopBar component.
 */
function MonitorActivitiesLayout() {
  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Outlet />
    </Box>
  );
}
