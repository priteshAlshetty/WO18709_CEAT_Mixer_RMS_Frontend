import React, { useState, useEffect, useRef } from "react";
import API from "../utils/api";
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

  /* -------- AUTO FETCH RECIPE -------- */
  useEffect(() => {
    if (from && to) fetchRecipes();
  }, [from, to]);

  /* -------- API CALLS -------- */

  const fetchRecipes = async () => {
    try {
      const body = { from, to };
      console.log("getRecipeIdByDate:", body);

      const res = await API.post("/getRecipeIdByDate", body);
      setRecipes(res.data.recipe_id || []);
      setRecipeId("");
      setSrNos([]);
      setBatches([]);
      setGraphData(null);
    } catch {
      toast.error("Failed to load recipes");
    }
  };

  const fetchSrNos = async (rid) => {
    try {
      const body = { from, to, recipe_id: rid };
      console.log("getSrNoByRecipeId:", body);

      const res = await API.post("/getSrNoByRecipeId", body);
      setSrNos(res.data.result?.sr_no || []);
    } catch {
      toast.error("Failed to load SR numbers");
    }
  };

  const fetchBatches = async (sr) => {
    try {
      const body = { from, to, recipe_id: recipeId, sr_no: sr };
      console.log("getBatchCountBySrno:", body);

      const res = await API.post("/getBatchCountBySrno", body);
      setBatches(
        Array.from({ length: res.data.set_batch }, (_, i) => i + 1)
      );
      setBatchNo("");
    } catch {
      toast.error("Failed to load batches");
    }
  };

  const fetchGraph = async (batch) => {
    try {
      setLoading(true);
      setGraphData(null);

      const body = {
        from,
        to,
        recipe_id: recipeId,
        sr_no: srNo,
        batch_no: batch
      };

      console.log("getGraphDataByBatchNo:", body);

      // artificial 2 sec spinner
      await new Promise(res => setTimeout(res, 1000));

      const res = await API.post("/getGraphDataByBatchNo", body);
      setGraphData(res.data.graphData);
    } catch {
      toast.error("Failed to load graph");
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

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

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
  labels: graphData.temp.map((_, i) => i + 1),
  datasets: [
    {
      label: "Temp",
      data: graphData.temp,
      borderColor: "red",
      tension: 0.4,
      pointRadius: 0
    },
    {
      label: "Power",
      data: graphData.power,
      borderColor: "blue",
      tension: 0.4,
      pointRadius: 0
    },
    {
      label: "Energy",
      data: graphData.energy,
      borderColor: "green",
      tension: 0.4,
      pointRadius: 0
    },
    {
      label: "Pressure",
      data: graphData.pressure,
      borderColor: "orange",
      tension: 0.4,
      pointRadius: 0
    },
    {
      label: "RPM",
      data: graphData.rpm,
      borderColor: "purple",
      tension: 0.4,
      pointRadius: 0
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
      display: true,
      text: `Graph Generated on ${new Date().toLocaleString()}`
    },
  interaction: {
    mode: "index",
    intersect: false
  },
  plugins: {
    tooltip: {
      mode: "index",
      intersect: false
    },
    legend: {
      position: "top"
    }
  },
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      grid: { color: "#eee" }
    }
  }
};



  return (
    <div ref={printRef} style={{ padding: 50 }}>
      <ToastContainer position="bottom-right" />

      <h2>Graph Page</h2>

      {/* -------- FILTER BAR -------- */}
      <div className="filter-bar">

  <div className="field">
    <label>Select Date From</label>
    <input type="datetime-local"
      onChange={e => setFrom(new Date(e.target.value).toISOString())} />
  </div>

  <div className="field">
    <label>Select Date To</label>
    <input type="datetime-local"
      onChange={e => setTo(new Date(e.target.value).toISOString())} />
  </div>

  <div className="field">
    <label>Recipe Name</label>
    <select
      onChange={e => { setRecipeId(e.target.value); fetchSrNos(e.target.value); }}>
      <option>Select</option>
      {recipes.map(r => <option key={r}>{r}</option>)}
    </select>
  </div>

  <div className="field">
    <label>Sr No</label>
    <select
      onChange={e => { setSrNo(e.target.value); fetchBatches(e.target.value); }}>
      <option>Select</option>
      {srNos.map(s => <option key={s}>{s}</option>)}
    </select>
  </div>

  <div className="nav-buttons">
    <button className="btn-prev" onClick={prevBatch}>&lt;&lt;</button>
    <button className="btn-next" onClick={nextBatch}>&gt;&gt;</button>
  </div>

  <div className="field">
    <label>Batch No</label>
    <select
      value={batchNo}
      onChange={e => setBatchNo(Number(e.target.value))}>
      <option>Select</option>
      {batches.map(b => <option key={b}>{b}</option>)}
    </select>
  </div>

  <div className="action-buttons">
    <button className="search_btn" onClick={() => fetchGraph(batchNo)}>Search</button>
     {/* <button onClick={downloadGraph}>Print</button> */}
  </div>

</div>


      {/* -------- LOADER -------- */}
      {loading && <div className="spinner" />}

      {/* -------- GRAPH -------- */}
      {graphData && !loading && (
        <div style={{ height: 500, marginTop: 25 }}>
         <Line
  ref={chartRef}
  data={chartData}
  options={chartOptions}
/>

          <button onClick={downloadGraph} style={{ marginTop: 10 }} className="Download-button">
            Download Graph
          </button>
        </div>
      )}
    </div>
  );
};

export default GraphPage;
