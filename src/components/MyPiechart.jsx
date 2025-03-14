import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const MyPieChart = ({ chartData }) => {
  // Map the chartData into the format needed by Recharts
  const data = [
    { name: "Above 95", value: chartData.above95 },
    { name: "85-95", value: chartData.between85And95 },
    { name: "75-85", value: chartData.between75And85 },
    { name: "Below 75", value: chartData.below75 },
  ];

  const dataFail = [
    { name: "Pass Percentage", value: chartData.passPercentage },
    { name: "Fail Percentage", value: 100-chartData.passPercentage },
 
  ];

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {/* Pie Chart 1 */}
      <PieChart width={400} height={400}>
        <text
          x={200}
          y={20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={20}
        >
          Marks Distribution
        </text>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Pie Chart 2 */}
      <PieChart width={400} height={400}>
        <text
          x={200}
          y={20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={20}
        >
          Pass/Fail Percentage
        </text>
        <Pie
          data={dataFail}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#82ca9d"
          label
        >
          {dataFail.map((entry, index) => (
            <Cell key={`cell-fail-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default MyPieChart;
