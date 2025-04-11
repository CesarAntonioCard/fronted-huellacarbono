import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const RADIAN = Math.PI / 180;

const Simulador = () => {
  const [numHojas, setNumHojas] = useState(0);
  const [huellaCarbono, setHuellaCarbono] = useState(0);

  const [numDispositivos, setNumDispositivos] = useState(0);
  const [huellaDispositivos, setHuellaDispositivos] = useState(0);

  const [espacioNube, setEspacioNube] = useState(0);
  const [huellaNube, setHuellaNube] = useState(0);

  const [numEmails, setNumEmails] = useState(0);
  const [huellaEmails, setHuellaEmails] = useState(0);

  const handleInputChangeNube = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const espacio = Number(event.target.value);
    setEspacioNube(espacio);
    const carbono = espacio * 0.125;
    setHuellaNube(carbono);
  };

  const handleInputChangeEmails = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const emails = Number(event.target.value);
    setNumEmails(emails);
    const carbono = emails * 0.02;
    setHuellaEmails(carbono);
  };

  const handleInputChangeHojas = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hojas = Number(event.target.value);
    setNumHojas(hojas);
    const carbono = hojas * 0.008575;
    setHuellaCarbono(carbono);
  };

  const handleInputChangeDispositivos = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const dispositivos = Number(event.target.value);
    setNumDispositivos(dispositivos);
    const carbono = dispositivos * 0.6;
    setHuellaDispositivos(carbono);
  };

  const SCALING_FACTOR = 100;
  const scaledCarbonFootprint = huellaCarbono * SCALING_FACTOR;
  const scaledCarbonFootprintDispositivos = huellaDispositivos * SCALING_FACTOR;
  const scaledCarbonFootprintNube = huellaNube * SCALING_FACTOR;
  const scaledCarbonFootprintEmails = huellaEmails * SCALING_FACTOR;

  const chartSegments = [
    { name: "Verde", value: 15, color: "#4CAF50" },
    { name: "Amarillo", value: 15, color: "#FF9800" },
    { name: "Rojo", value: 15, color: "#F44336" },
  ];

  const chartSegmentsDispositivos = [
    { name: "Bajo", value: 200, color: "#4CAF50" },
    { name: "Moderado", value: 400, color: "#FF9800" },
    { name: "Alto", value: 400, color: "#F44336" },
  ];

  const chartSegmentsNube = [
    { name: "Bajo", value: 100, color: "#4CAF50" },
    { name: "Moderado", value: 100, color: "#FF9800" },
    { name: "Alto", value: 200, color: "#F44336" },
  ];

  const chartSegmentsEmails = [
    { name: "Bajo", value: 10, color: "#4CAF50" },
    { name: "Moderado", value: 10, color: "#FF9800" },
    { name: "Alto", value: 20, color: "#F44336" },
  ];

  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-10 p-8 w-full max-w-6xl">
          <div className=" w-[90%] bg-blue-50 border-l-4 border-blue-400 text-blue-900 rounded-xl shadow-md max-w-4xl mx-auto flex items-start p-3">
            <div className="text-blue-500 text-2xl mr-3">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </div>
            <div>
              <p className="font-medium">
                Estos simuladores muestran estimaciones promedio del consumo y
                la huella de carbono.
              </p>
              <p className="text-sm text-blue-800">
                Los resultados pueden variar dependiendo de múltiples factores
                específicos del contexto real.
              </p>
            </div>
          </div>

          <div className="w-[90%] bg-white p-8 rounded-2xl shadow-xl border-4 border-transparent min-h-[300px] mx-auto">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-6">
              Simulador de Huella de Carbono por Hojas de Papel
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl font-semibold text-green-900 mb-4">
                  Introduce el número de hojas:
                </h3>
                <input
                  type="number"
                  value={numHojas}
                  onChange={handleInputChangeHojas}
                  className="p-3 w-full border border-gray-300 rounded-lg"
                  min="0"
                  placeholder="Ejemplo: 5 hojas"
                />
                <p className="mt-6 text-lg text-green-800">
                  La huella de carbono de {numHojas} hojas de papel es:{" "}
                  <span className="font-bold text-green-700">
                    {huellaCarbono.toFixed(2)} kg de CO2
                  </span>
                  {""}.
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer
                  width={400}
                  height={200}
                  className="ml-[-50px] lg:ml-0"
                >
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
                    {needle(
                      scaledCarbonFootprint,
                      chartSegments,
                      cx,
                      cy,
                      iR,
                      oR,
                      "#d0d000"
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="w-[90%] bg-white p-8 rounded-2xl shadow-xl border-4 border-transparent min-h-[300px] mx-auto">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-6">
              Simulador de Huella de Carbono por Dispositivos Electrónicos
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl font-semibold text-green-900 mb-4">
                  ¿Cuántos dispositivos electrónicos tienes en tu hogar?
                </h3>
                <input
                  type="number"
                  value={numDispositivos}
                  onChange={handleInputChangeDispositivos}
                  className="p-3 w-full border border-gray-300 rounded-lg"
                  min="0"
                  placeholder="Ejemplo: 5 dispositivos"
                />
                <p className="mt-6 text-lg text-green-800">
                  La huella de carbono de {numDispositivos} dispositivos es:{" "}
                  <span className="font-bold text-green-700">
                    {huellaDispositivos.toFixed(2)} kg de CO2 al mes
                  </span>
                  {""}.
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer
                  width={400}
                  height={200}
                  className="ml-[-50px] lg:ml-0"
                >
                  <PieChart width={400} height={200}>
                    <Pie
                      dataKey="value"
                      startAngle={180}
                      endAngle={0}
                      data={chartSegmentsDispositivos}
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
                    {needle(
                      scaledCarbonFootprintDispositivos,
                      chartSegmentsDispositivos,
                      cx,
                      cy,
                      iR,
                      oR,
                      "#d0d000"
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="w-[90%] bg-white p-8 rounded-2xl shadow-xl border-4 border-transparent min-h-[300px] mx-auto">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-6">
              Simulador de Huella de Carbono por Uso de espacio en la Nube
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl font-semibold text-green-900 mb-4">
                  Introduce el espacio usado en la nube:
                </h3>
                <input
                  type="number"
                  value={espacioNube}
                  onChange={handleInputChangeNube}
                  className="p-3 w-full border border-gray-300 rounded-lg"
                  min="0"
                  placeholder="Ejemplo: 5 hojas"
                />
                <p className="mt-6 text-lg text-green-800">
                  La huella de carbono de {espacioNube} GB en la nube es:{" "}
                  <span className="font-bold text-green-700">
                    {huellaNube.toFixed(2)} kg de CO2
                  </span>
                  {""}.
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer
                  width={400}
                  height={200}
                  className="ml-[-50px] lg:ml-0"
                >
                  <PieChart width={400} height={200}>
                    <Pie
                      dataKey="value"
                      startAngle={180}
                      endAngle={0}
                      data={chartSegmentsNube}
                      cx={cx}
                      cy={cy}
                      innerRadius={iR}
                      outerRadius={oR}
                      stroke="none"
                    >
                      {chartSegmentsNube.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {needle(
                      scaledCarbonFootprintNube,
                      chartSegmentsNube,
                      cx,
                      cy,
                      iR,
                      oR,
                      "#d0d000"
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="w-[90%] bg-white p-8 rounded-2xl shadow-xl border-4 border-transparent min-h-[300px] mx-auto">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-6">
              Simulador de Huella de Carbono por Correo electronicos
            </h1>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl font-semibold text-green-900 mb-4">
                  Introduce el numero de correos electronicos enviados:
                </h3>
                <input
                  type="number"
                  value={numEmails}
                  onChange={handleInputChangeEmails}
                  className="p-3 w-full border border-gray-300 rounded-lg"
                  min="0"
                  placeholder="Ejemplo: 5 hojas"
                />
                <p className="mt-6 text-lg text-green-800">
                  La huella de carbono de {numEmails} correos enviados es:{" "}
                  <span className="font-bold text-green-700">
                    {huellaEmails.toFixed(2)} kg de CO2
                  </span>
                  {""}.
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer
                  width={400}
                  height={200}
                  className="ml-[-50px] lg:ml-0"
                >
                  <PieChart width={400} height={200}>
                    <Pie
                      dataKey="value"
                      startAngle={180}
                      endAngle={0}
                      data={chartSegmentsEmails}
                      cx={cx}
                      cy={cy}
                      innerRadius={iR}
                      outerRadius={oR}
                      stroke="none"
                    >
                      {chartSegmentsEmails.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {needle(
                      scaledCarbonFootprintEmails,
                      chartSegmentsEmails,
                      cx,
                      cy,
                      iR,
                      oR,
                      "#d0d000"
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Simulador;
