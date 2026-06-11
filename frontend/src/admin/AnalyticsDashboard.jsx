import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const monthNames = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AnalyticsDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = user?.token;

        const { data } = await axios.get(
          "http://localhost:5000/api/analytics/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(data);
      } catch (error) {
        console.log("Analytics error:", error);
      }
    };

    if (user?.role === "admin") {
      fetchStats();
    }
  }, [user]);

  if (!stats) {
    return <h2 style={{ padding: "40px" }}>Loading analytics...</h2>;
  }

  const monthlySales = stats.monthlySales || [];
  const labels = monthlySales.map((item) => monthNames[item._id]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#aaa" },
        grid: { color: "#222" },
      },
      y: {
        ticks: { color: "#aaa" },
        grid: { color: "#222" },
      },
    },
  };

  const revenueChartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: monthlySales.map((item) => item.revenue || 0),
        borderColor: "#ff3b1f",
        backgroundColor: "rgba(255, 59, 31, 0.2)",
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  const ordersChartData = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: monthlySales.map((item) => item.orders || 0),
        backgroundColor: "rgba(255, 59, 31, 0.6)",
        borderColor: "#ff3b1f",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <h1>Analytics Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div>
          <h3>Total Orders</h3>
          <h2>{stats.totalOrders}</h2>
        </div>

        <div>
          <h3>Total Products</h3>
          <h2>{stats.totalProducts}</h2>
        </div>

        <div>
          <h3>Total Users</h3>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div>
          <h3>Total Revenue</h3>
          <h2>₹{Number(stats.totalRevenue || 0).toFixed(2)}</h2>
        </div>
      </div>

      {monthlySales.length === 0 ? (
        <h2>No monthly sales data found</h2>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
          }}
        >
          <div
            style={{
              background: "#111",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <h2>Monthly Revenue</h2>
            <Line data={revenueChartData} options={chartOptions} />
          </div>

          <div
            style={{
              background: "#111",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <h2>Monthly Orders</h2>
            <Bar data={ordersChartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;