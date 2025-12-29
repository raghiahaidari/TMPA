import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const initialState = {
  amp_number: "",
  driver_name: "",
  status: "",
  position: "",
  cargo: "",
  alert: ""
};

const statusOptions = [
  { value: "Active", color: "success" },
  { value: "Pending", color: "warning" },
  { value: "Blocked", color: "error" },
  { value: "Maintenance", color: "default" }
];

const alertOptions = [
  "None",
  "Delay",
  "Maintenance Required",
  // "Route Deviation",
  // "Low Fuel",
  "Emergency"
];

function AddVehicleForm({
  apiUrl,
  onVehicleAdded,
  vehicleToEdit,
  onVehicleUpdated,
  onCancelEdit,
}) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.amp_number.trim()) err.amp_number = "Required";
    if (!form.driver_name.trim()) err.driver_name = "Required";
    return err;
  };

  React.useEffect(() => {
    if (vehicleToEdit) {
      setForm({ ...initialState, ...vehicleToEdit });
      setStatus("");
      setErrors({});
    } else {
      setForm(initialState);
      setStatus("");
      setErrors({});
    }
  }, [vehicleToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus("");
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    const validateErrors = validate();
    if (Object.keys(validateErrors).length) {
      setErrors(validateErrors);
      setStatus("");
      return;
    }

    if (vehicleToEdit && vehicleToEdit.id) {
      const payload = {
        ...form,
        id: vehicleToEdit.id,
      };
      try {
        const res = await fetch(`${apiUrl}/vehicles/${vehicleToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setStatus("success");
          setForm(initialState);
          onVehicleUpdated && onVehicleUpdated();
        } else {
          let data;
          try {
            data = await res.json();
          } catch (_) {
            data = { detail: "No JSON in error response" };
          }
          setStatus(
            typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail || data)
          );
          console.error(`PUT /vehicles/${vehicleToEdit.id} error details:`, data);
        }
      } catch (err) {
        setStatus("error");
        console.error("Request failure:", err);
      }
    } else {
      const payload = Object.fromEntries(
        Object.entries(form).filter(
          ([key, v]) => v && v.trim() !== ""
        )
      );
      try {
        const res = await fetch(`${apiUrl}/vehicles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setStatus("success");
          setForm(initialState);
          onVehicleAdded && onVehicleAdded();
        } else {
          let data;
          try {
            data = await res.json();
          } catch (_) {
            data = { detail: "No JSON in error response" };
          }
          setStatus(
            typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail || data)
          );
          console.error("POST /vehicles error details:", data);
        }
      } catch (err) {
        setStatus("error");
        console.error("Request failure:", err);
      }
    }
  };

  return (
    <Card 
      elevation={4} 
      sx={{ 
        maxWidth: 900, 
        mx: "auto",
        borderRadius: 3,
        background: "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)"
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalShippingIcon sx={{ fontSize: 28, color: "primary.main" }} />
            {vehicleToEdit ? "Edit Vehicle" : "Add New Vehicle"}
          </Box>
        }
        subheader={
          vehicleToEdit 
            ? `Updating vehicle ${vehicleToEdit.amp_number}` 
            : "Fill in the details to register a new vehicle"
        }
        sx={{ 
          textAlign: "left", 
          pb: 1, 
          pt: 2.5,
          "& .MuiCardHeader-title": {
            fontSize: "1.5rem",
            fontWeight: 600
          }
        }}
      />
      <Divider />
      <CardContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Vehicle Information Section */}
            <Box>
              <Chip 
                label="Vehicle Information" 
                size="small" 
                sx={{ mb: 2, fontWeight: 600 }}
                color="primary"
                variant="outlined"
              />
              <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                <TextField
                  required
                  fullWidth
                  label="AMP Number"
                  name="amp_number"
                  value={form.amp_number}
                  onChange={handleChange}
                  error={!!errors.amp_number}
                  helperText={errors.amp_number || "Unique vehicle identifier"}
                  disabled={!!vehicleToEdit}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalShippingIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: vehicleToEdit ? "#f5f5f5" : "white"
                    }
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Driver Name"
                  name="driver_name"
                  value={form.driver_name}
                  onChange={handleChange}
                  error={!!errors.driver_name}
                  helperText={errors.driver_name || "Full name of the driver"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>

            {/* Status and Location Section */}
            <Box>
              <Chip 
                label="Status & Location" 
                size="small" 
                sx={{ mb: 2, fontWeight: 600 }}
                color="secondary"
                variant="outlined"
              />
              <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  helperText="Current operational status"
                >
                  <MenuItem value="">
                    <em>Select Status</em>
                  </MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: 
                              option.color === "success" ? "success.main" :
                              option.color === "warning" ? "warning.main" :
                              option.color === "error" ? "error.main" : "grey.400"
                          }}
                        />
                        {option.value}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  helperText="Last known checkpoint or location"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>

            {/* Cargo and Alerts Section */}
            <Box>
              <Chip 
                label="Cargo & Alerts" 
                size="small" 
                sx={{ mb: 2, fontWeight: 600 }}
                color="info"
                variant="outlined"
              />
              <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                <TextField
                  fullWidth
                  label="Cargo"
                  name="cargo"
                  value={form.cargo}
                  onChange={handleChange}
                  helperText="Type or description of cargo"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  select
                  fullWidth
                  label="Alert"
                  name="alert"
                  value={form.alert}
                  onChange={handleChange}
                  helperText="Select alert type if any"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WarningIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">
                    <em>No Alert</em>
                  </MenuItem>
                  {alertOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Box>

            {/* Status Messages */}
            {status === "success" && (
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ 
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    fontWeight: 500
                  }
                }}
              >
                {vehicleToEdit 
                  ? "Vehicle updated successfully!" 
                  : "Vehicle added successfully!"}
              </Alert>
            )}
            {status && status !== "success" && (
              <Alert 
                severity="error"
                sx={{ 
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    fontWeight: 500
                  }
                }}
              >
                {status}
              </Alert>
            )}

            {/* Action Buttons */}
            <Divider sx={{ my: 1 }} />
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="flex-end"
              sx={{ pt: 1 }}
            >
              {vehicleToEdit && (
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={onCancelEdit}
                  type="button"
                  sx={{ 
                    minWidth: 120,
                    textTransform: "none",
                    fontWeight: 600
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="large"
                variant="contained"
                color={vehicleToEdit ? "primary" : "success"}
                sx={{ 
                  minWidth: 140,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: 3,
                  "&:hover": {
                    boxShadow: 6
                  }
                }}
              >
                {vehicleToEdit ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddVehicleForm;