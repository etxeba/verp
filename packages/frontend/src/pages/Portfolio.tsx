import { Box, Paper, Typography } from '@mui/material';

// Placeholder component until we implement the full portfolio management features
export default function Portfolio() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Portfolio Companies
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Portfolio Management
          </Typography>
          <Typography color="text.secondary">
            This feature is coming soon. You'll be able to:
          </Typography>
          <Box component="ul" sx={{ mt: 2, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            <li>View all portfolio companies</li>
            <li>Track investment performance</li>
            <li>Monitor key metrics</li>
            <li>Generate performance reports</li>
            <li>Manage documents and communications</li>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}