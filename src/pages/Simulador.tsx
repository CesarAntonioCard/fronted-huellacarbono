import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import Navbar from "../components/Navbar/Navbar";

const RADIAN = Math.PI / 180;

const Simulador = () => {
  const [numHojas, setNumHojas] = useState(0);
  const [huellaCarbono, setHuellaCarbono] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hojas = Number(event.target.value);
    setNumHojas(hojas);
    const carbono = hojas * 0.008575;
    setHuellaCarbono(carbono);
  };

  const SCALING_FACTOR = 100;

  const scaledCarbonFootprint = huellaCarbono * SCALING_FACTOR;

  const chartSegments = [
    { name: "Verde", value: 15, color: "#4CAF50" },
    { name: "Amarillo", value: 15, color: "#FF9800" },
    { name: "Rojo", value: 15, color: "#F44336" },
  ];

  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;
  const value = scaledCarbonFootprint;

  const needle = (
    value: number,
    data: Array<{ name: string; value: number }>,
    cx: number,
    cy: number,
    iR: number,
    oR: number,
    color: string
  ) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });

    const ang = Math.min(180, 180.0 * (1 - value / total));
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 10;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle
        cx={x0}
        cy={y0}
        r={r}
        fill={color}
        stroke="none"
        key="needle-circle"
      />,
      <path
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="none"
        fill={color}
        key="needle-path"
      />,
    ];
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-green-500 to-teal-500 p-6 mt-5">
        <div className="container mx-auto text-center text-green-950">
          <h1 className="text-4xl font-extrabold mb-6">
            Simulador de Huella de Carbono por Hojas de Papel
          </h1>

          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto mb-8">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">
              Introduce el número de hojas:
            </h3>
            <input
              type="number"
              value={numHojas}
              onChange={handleInputChange}
              className="p-3 w-full border border-gray-300 rounded-lg"
              min="0"
              placeholder="Ejemplo: 5 hojas"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto mb-8">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">
              Resultado de la Huella de Carbono:
            </h3>
            <p className="text-lg text-green-800">
              La huella de carbono de {numHojas} hojas de papel es:{" "}
              <span className="font-bold">
                {huellaCarbono.toFixed(2)} kg de CO2
              </span>{" "}
              .
            </p>
            <PieChart width={400} height={200}>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={chartSegments}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                stroke="none"
              >
                {chartSegments.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>

              {needle(value, chartSegments, cx, cy, iR, oR, "#d0d000")}
            </PieChart>
          </div>
        </div>
      </div>
    </>
  );
};

export default Simulador;
