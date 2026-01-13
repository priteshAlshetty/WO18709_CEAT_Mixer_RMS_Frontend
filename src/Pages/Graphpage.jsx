import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Graphpage.css";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const GraphPage = () => {
  const chartRef = useRef(null);
  const printRef = useRef(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState("");

  const [srNos, setSrNos] = useState([]);
  const [srNo, setSrNo] = useState("");

  const [batches, setBatches] = useState([]);
  const [batchNo, setBatchNo] = useState("");

  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [batchCount, setBatchCount] = useState(0);

  const [meta, setMeta] = useState(null);


  /* -------- AUTO FETCH RECIPE -------- */
  useEffect(() => {
    if (from && to) fetchRecipes();
  }, [from, to]);

  /* -------- AUTO FETCH GRAPH ON BATCH CHANGE -------- */
  useEffect(() => {
    if (batchNo && recipeId && srNo) {
      fetchGraph(batchNo);
    }
  }, [batchNo]);

  /* -------- API CALLS -------- */

const fetchRecipes = async () => {
  try {
    const body = { from, to };
    const res = await api.post("/graph/getRecipeIdByDate", body);

    // Update state
    setRecipes(res.data.recipe_id || []);
    setRecipeId("");
    setSrNos([]);
    setBatches([]);
    setGraphData(null);

    // ✅ Show toast based on API result
    if (res.data.recipe_id?.length > 0) {
      toast.success("Recipes loaded successfully!");
    } else {
      toast.info("No recipes found for selected dates.");
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to load recipes";

    toast.error(message);
  }
};



const fetchSrNos = async (rid) => {
  try {
    const body = { from, to, recipe_id: rid };
    const res = await api.post("/graph/getSrNoByRecipeId", body);

    setSrNos(res.data.result?.sr_no || []);
    toast.success("Recipe selected successfully!"); // ✅ success toast
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to load SR numbers"
    );
  }
};



const fetchBatches = async (sr) => {
  try {
    const body = { from, to, recipe_id: recipeId, sr_no: sr };
    const res = await api.post("/graph/getBatchCountBySrno", body);

    setBatchCount(res.data.set_batch || 0);
    setBatches(
      Array.from({ length: res.data.set_batch }, (_, i) => i + 1)
    );
    setBatchNo("");
    toast.success("SR No selected successfully!"); // ✅ success toast
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to load batches"
    );
  }
};



const fetchGraph = async (batch) => {
  try {
    setLoading(true);
    setGraphData(null);
    setMeta(null);

    const body = {
      from,
      to,
      recipe_id: recipeId,
      sr_no: srNo,
      batch_no: batch
    };

    const res = await api.post("/graph/getGraphDataByBatchNo", body);

    setGraphData(res.data.graphData);
    setMeta(res.data.meta);
    toast.success("Batch selected successfully!"); // ✅ success toast
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to load graph"
    );
  } finally {
    setLoading(false);
  }
};



  /* -------- PREVIOUS / NEXT -------- */
  const prevBatch = () => {
    if (batchNo > 1) setBatchNo(batchNo - 1);
  };

  const nextBatch = () => {
    if (batchNo < batches.length) setBatchNo(batchNo + 1);
  };

  /* -------- DOWNLOAD -------- */
  const downloadGraph = async () => {
    if (!printRef.current) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const canvas = await html2canvas(printRef.current, {
      backgroundColor: "#ffffff",
      scale: 2
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `Graph_Generated_${timestamp}.png`;
    link.click();
  };

  /* -------- CHART -------- */
const chartData = graphData && {
  labels: graphData.temp.map((_, i) => i + 1), // X-axis
  datasets: [
    { label: "Temp", data: graphData.temp, borderColor: "red", tension: 0.4, pointRadius: 0 },
    { label: "Power", data: graphData.power, borderColor: "blue", tension: 0.4, pointRadius: 0 },
    { label: "Energy", data: graphData.energy, borderColor: "green", tension: 0.4, pointRadius: 0 },
    { label: "Pressure", data: graphData.pressure, borderColor: "orange", tension: 0.4, pointRadius: 0 },
    { label: "RPM", data: graphData.rpm, borderColor: "purple", tension: 0.4, pointRadius: 0 },
    { label: "Ram Position", data: graphData.ram_position, borderColor: "brown", tension: 0.4, pointRadius: 0 },
    { label: "DD Open", data: graphData.DD_Open, borderColor: "black",  tension: 0.4, pointRadius: 0 } // optional dashed line
  ]
};


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: { mode: "index", intersect: false },
      legend: { position: "top" }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#eee" } }
    }
  };

  return (
    <div ref={printRef} style={{ padding: 50 }}>
      <ToastContainer position="bottom-right" />
      <h2>Graph Page</h2>

      <div className="filter-bar">
        <div className="field">
          <label>Select Date From</label>
          <input
            type="datetime-local"
            onChange={e => setFrom(new Date(e.target.value).toISOString())}
          />
        </div>

        <div className="field">
          <label>Select Date To</label>
          <input
            type="datetime-local"
            onChange={e => setTo(new Date(e.target.value).toISOString())}
          />
        </div>

        <div className="field">
          <label>Recipe Name</label>
          <select onChange={e => {
            setRecipeId(e.target.value);
            fetchSrNos(e.target.value);
          }}>
            <option>Select</option>
            {recipes.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Sr No</label>
          <select onChange={e => {
            setSrNo(e.target.value);
            fetchBatches(e.target.value);
          }}>
            <option>Select</option>
            {srNos.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

          <div className="field">
          <label>Count</label>
          <input type="text" value={batchCount} readOnly disabled />
        </div>

        

      

        <div className="field batch-div">
          <div className="first">
            <label>Batch No</label>
            <select
              value={batchNo}
              onChange={e => setBatchNo(Number(e.target.value))}
            >
              <option>Select</option>
              {batches.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div className="second nav-buttons">
            <button className="btn-prev" onClick={prevBatch} disabled={loading}>
              &lt;&lt;
            </button>
            <button className="btn-next" onClick={nextBatch} disabled={loading}>
              &gt;&gt;
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button className="search_btn" onClick={() => fetchGraph(batchNo)}>
            Search
          </button>
        </div>
      </div>

      {meta && (
  <div className="meta-bar">
    <div><strong>SR No:</strong> {meta.sr_no}</div>
    <div><strong>Recipe ID:</strong> {meta.recipe_id}</div>
    <div><strong>Batch No:</strong> {meta.batch_no}</div>
    <div><strong>Begin Time:</strong> {meta.begin_time}</div>
    <div><strong>End Time:</strong> {meta.end_time}</div>
    <div><strong>Resolution:</strong> {meta.resolution}</div>
  </div>
)}


      {loading && <div className="spinner" />}

      {graphData && !loading && (
        <div style={{ height: 500, marginTop: 25 }}>
          <Line ref={chartRef} data={chartData} options={chartOptions} />
          <button className="Download-button" onClick={downloadGraph}>
            Download Graph
          </button>
        </div>
      )}
    </div>
  );
};

export default GraphPage;
