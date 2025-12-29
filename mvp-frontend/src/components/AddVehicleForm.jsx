import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

const initialState = {
  amp_number: "",
  driver_name: "",
  status: "",
  position: "",
  cargo: "",
  alert: ""
};

function AddVehicleForm({ apiUrl, onVehicleAdded }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.amp_number.trim()) err.amp_number = "Required";
    if (!form.driver_name.trim()) err.driver_name = "Required";
    return err;
  };

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

    // Only send the fields with non-empty values, omit empty strings for optionals
    const payload = Object.fromEntries(
      Object.entries(form).filter(
        ([key, v]) =>
          v && v.trim() !== ""
      )
    );
    // Debug print: see what is POSTed
    console.log("Submitting to /vehicles:", payload);

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
        // Also log details for debugging
        console.error("POST /vehicles error details:", data);
      }
    } catch (err) {
      setStatus("error");
      console.error("Request failure:", err);
    }
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 800, mx: "auto" }}>
      <CardHeader title="Add New Vehicle" sx={{ textAlign: "left", pb: 0, pt: 2 }} />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }} useFlexGap>
            <TextField
              required
              label="AMP Number"
              name="amp_number"
              value={form.amp_number}
              size="small"
              onChange={handleChange}
              error={!!errors.amp_number}
              helperText={errors.amp_number}
            />
            <TextField
              required
              label="Driver Name"
              name="driver_name"
              value={form.driver_name}
              size="small"
              onChange={handleChange}
              error={!!errors.driver_name}
              helperText={errors.driver_name}
            />
            <TextField
              label="Status"
              name="status"
              value={form.status}
              size="small"
              onChange={handleChange}
              helperText="e.g. Active, Pending, Blocked"
            />
            <TextField
              label="Position"
              name="position"
              value={form.position}
              size="small"
              onChange={handleChange}
              helperText="Last known checkpoint"
            />
            <TextField
              label="Cargo"
              name="cargo"
              value={form.cargo}
              size="small"
              onChange={handleChange}
              helperText="Cargo type"
            />
            <TextField
              label="Alert"
              name="alert"
              value={form.alert}
              size="small"
              onChange={handleChange}
              helperText="Alert type (if any)"
            />
            <Button
              type="submit"
              size="medium"
              variant="contained"
              sx={{ minWidth: 120, height: 40, alignSelf: "center" }}
            >
              Add
            </Button>
          </Stack>
          {status === "success" && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Vehicle added!
            </Alert>
          )}
          {status && status !== "success" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {status}
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddVehicleForm;
