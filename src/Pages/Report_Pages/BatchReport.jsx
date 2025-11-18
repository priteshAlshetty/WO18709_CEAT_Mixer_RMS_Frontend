import React, { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Paper
} from "@mui/material";



export default function ReportPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [batchNames, setBatchNames] = useState([]);
  const [selectedBatchName, setSelectedBatchName] = useState("");

  const [serialNumbers, setSerialNumbers] = useState([]);
  const [selectedSerial, setSelectedSerial] = useState("");

  const [batchNumbers, setBatchNumbers] = useState([]);
  const [selectedBatchNo, setSelectedBatchNo] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reportReady, setReportReady] = useState(false);

  // Auto-fetch Batch Names when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      fetchBatchNames();
    }
  }, [fromDate, toDate]);

  // Fetch Batch Names
  const fetchBatchNames = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.post(
        `${apiUrl}/report/batch/getBatchName/bydate`,
        { from: fromDate, to: toDate }
      );

      const list = res.data.BATCH_NAME || [];
      setBatchNames(["All", ...list]);

      // Reset child dropdowns
      setSelectedBatchName("");
      setSerialNumbers([]);
      setBatchNumbers([]);
      setSelectedSerial("");
      setSelectedBatchNo("");
      setReportReady(false);

    } catch (err) {
      setErrorMsg("Failed to fetch batch names.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Serial Numbers
  const fetchSerialNumbers = async (batchName) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.post(
        `${apiUrl}/report/batch/getSerial/byBatchName`,
        {
          batchName: batchName === "All" ? batchNames.slice(1) : [batchName],
          from: fromDate,
          to: toDate
        }
      );

      setSerialNumbers(res.data.SERIAL_NO || []);

      // Reset below fields
      setSelectedSerial("");
      setBatchNumbers([]);
      setSelectedBatchNo("");
      setReportReady(false);

    } catch (err) {
      setErrorMsg("Failed to fetch serial numbers.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Batch Numbers
  const fetchBatchNumbers = async (serialNo) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.post(
        `${apiUrl}/report/batch/getbatchNo/bySerialNo`,
        { serialNo }
      );

      setBatchNumbers(["All", ...(res.data.BATCH_NO || [])]);

      // Reset
      setSelectedBatchNo("");
      setReportReady(false);

    } catch (err) {
      setErrorMsg("Failed to fetch batch numbers.");
    } finally {
      setLoading(false);
    }
  };

  // Download Report
  const downloadReport = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.post(
        `${apiUrl}/report/batch/getExcelReport`,
        {
          recipeId: selectedBatchName,
          serialNo: selectedSerial,
          batchNo: selectedBatchNo,
          dttmFrom: fromDate,
          dttmTo: toDate
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Report.xlsx");
      document.body.appendChild(link);
      link.click();

    } catch (err) {
      setErrorMsg("Failed to download report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper elevation={4} sx={{ padding: 4, width: "450px" }}>
        <Typography variant="h5" mb={2}>
          Batch Report Generator
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        {/* Date Inputs */}
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />

        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />

        {/* Batch Name Dropdown */}
        {batchNames.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Batch Name</InputLabel>
            <Select
              value={selectedBatchName}
              label="Batch Name"
              onChange={(e) => {
                setSelectedBatchName(e.target.value);
                fetchSerialNumbers(e.target.value);
              }}
            >
              <MenuItem value="">
                <em>Select Batch</em>
              </MenuItem>

              {batchNames.map((bn, i) => (
                <MenuItem key={i} value={bn}>
                  {bn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Serial No Dropdown */}
        {serialNumbers.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Serial Number</InputLabel>
            <Select
              value={selectedSerial}
              label="Serial Number"
              onChange={(e) => {
                setSelectedSerial(e.target.value);
                fetchBatchNumbers(e.target.value);
              }}
            >
              <MenuItem value="">
                <em>Select Serial No</em>
              </MenuItem>

              {serialNumbers.map((sn, i) => (
                <MenuItem key={i} value={sn}>
                  {sn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Batch No Dropdown */}
        {batchNumbers.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Batch No</InputLabel>
            <Select
              value={selectedBatchNo}
              label="Batch No"
              onChange={(e) => {
                setSelectedBatchNo(e.target.value);
                setReportReady(true);
              }}
            >
              <MenuItem value="">
                <em>Select Batch No</em>
              </MenuItem>

              {batchNumbers.map((bn, i) => (
                <MenuItem key={i} value={bn}>
                  {bn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Download Button */}
        {reportReady && (
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            onClick={downloadReport}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Download Report"}
          </Button>
        )}

        {loading && (
          <Box textAlign="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
