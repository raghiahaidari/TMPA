import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import VehicleTable from "./components/VehicleTable";
import AddVehicleForm from "./components/AddVehicleForm";

const API_URL = "http://localhost:8000"; // FastAPI backend

function App() {
  const [vehicles, setVehicles] = useState([]);

  // Load vehicles from API
  const fetchVehicles = () => {
    fetch(`${API_URL}/vehicles`)
      .then((res) => res.json())
      .then((data) => setVehicles(data || []));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Port Operations MVP Dashboard
      </Typography>
      <Box sx={{ my: 2 }}>
        <AddVehicleForm apiUrl={API_URL} onVehicleAdded={fetchVehicles} />
      </Box>
      <VehicleTable vehicles={vehicles} onDelete={async (id) => {
        if (!window.confirm("Delete this vehicle?")) return;
        await fetch(`${API_URL}/vehicles/${id}`, { method: "DELETE" });
        fetchVehicles();
      }} />
    </Container>
  );
}

export default App;
