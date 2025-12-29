import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  }
}));

function VehicleTable({ vehicles, onDelete, onEdit }) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <Paper sx={{ mt: 4, p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No vehicle records found. Use the form above to add a new entry.
        </Typography>
      </Paper>
    );
  }

  // Columns for displayed fields only (skip id for now)
  const columns = ["amp_number", "driver_name", "status", "position", "cargo", "alert"];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Vehicles List
      </Typography>
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                {col.replace("_", " ")}
              </TableCell>
            ))}
            {(onDelete || onEdit) && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((row, i) => (
            <StyledTableRow key={row.id || i}>
              <TableCell>{i + 1}</TableCell>
              {columns.map((col) => (
                <TableCell key={col}>{row[col]}</TableCell>
              ))}
              {(onDelete || onEdit) && (
                <TableCell align="center">
                  {onEdit && (
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(row)}
                        sx={{ mr: onDelete ? 1 : 0 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}

export default VehicleTable;
