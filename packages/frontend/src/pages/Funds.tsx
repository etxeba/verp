import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Fund, formatCurrency } from '@verp/shared';

// API functions
const API_URL = 'http://localhost:3000';

const fetchFunds = async (): Promise<Fund[]> => {
  const response = await fetch(`${API_URL}/funds`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function Funds() {
  // Query funds data
  const { data: funds, isLoading, error } = useQuery({
    queryKey: ['funds'],
    queryFn: fetchFunds,
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        Loading funds...
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
        Error loading funds: {error instanceof Error ? error.message : 'Unknown error'}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Funds
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Implement fund creation dialog
            console.log('Add fund clicked');
          }}
        >
          Add Fund
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Total Capital</TableCell>
              <TableCell align="right">Vintage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funds?.map((fund) => (
              <TableRow key={fund.id}>
                <TableCell>{fund.name}</TableCell>
                <TableCell>{fund.description}</TableCell>
                <TableCell align="right">
                  {formatCurrency(fund.totalCapital)}
                </TableCell>
                <TableCell align="right">{fund.vintage}</TableCell>
              </TableRow>
            ))}
            {(!funds || funds.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No funds found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}