import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  AplicacionData,
  AppUsageEvent,
  CategoriaData,
} from "@/api/updateDashboardApi";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2e7d32",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
    color: "#2e7d32",
  },
  summaryText: {
    fontSize: 13,
    marginBottom: 6,
    color: "#333",
  },
  table: {
    width: "auto",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#a5d6a7",
    height: 35,
    paddingHorizontal: 8,
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    height: 30,
    paddingHorizontal: 8,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    color: "#2e7d32",
  },
  cellNumeric: {
    flex: 1,
    fontSize: 12,
    color: "#2e7d32",
    textAlign: "right",
  },
});

interface PDFReportProps {
  eventos: AppUsageEvent[];
  eventosPorAplicacion: AplicacionData[];
  eventosPorCategoria: CategoriaData[];
  totalMwh: number;
  totalCO2: number;
  calcularPorcentaje: (valor: number) => number;
}

const PDFReport: React.FC<PDFReportProps> = ({
  eventos,
  eventosPorAplicacion,
  eventosPorCategoria,
  totalMwh,
  totalCO2,
  calcularPorcentaje,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Huella de Carbono</Text>

        <View style={styles.card}>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: "bold" }}>
              Total Consumo Energético:
            </Text>{" "}
            {Number.isFinite(totalMwh) ? totalMwh.toFixed(2) : "0.00"} mWh
          </Text>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: "bold" }}>Huella CO₂ estimada:</Text>{" "}
            {Number.isFinite(totalCO2) ? totalCO2.toFixed(4) : "0.0000"} kg
          </Text>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: "bold" }}>Eventos Registrados:</Text>{" "}
            {eventos.length}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Top Aplicaciones por Emisión</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>Aplicación</Text>
              <Text style={styles.cellNumeric}>Emisión (kg CO₂)</Text>
              <Text style={styles.cellNumeric}>%</Text>
            </View>
            {eventosPorAplicacion.slice(0, 5).map((app, idx) => (
              <View
                key={app.app}
                style={[
                  styles.tableRow,
                  ...(idx === eventosPorAplicacion.slice(0, 5).length - 1
                    ? [styles.tableRowLast]
                    : []),
                ]}
              >
                <Text style={styles.cell}>{app.app}</Text>
                <Text style={styles.cellNumeric}>
                  {(app.total_energy_mwh * 0.000475).toFixed(4)}
                </Text>
                <Text style={styles.cellNumeric}>
                  {calcularPorcentaje(app.total_energy_mwh).toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Top Categorías por Emisión</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>Categoría</Text>
              <Text style={styles.cellNumeric}>Emisión (kg CO₂)</Text>
              <Text style={styles.cellNumeric}>Duración (seg)</Text>
            </View>
            {eventosPorCategoria.slice(0, 5).map((cat, idx) => (
              <View
                key={cat.category}
                style={[
                  styles.tableRow,
                  ...(idx === eventosPorCategoria.slice(0, 5).length - 1
                    ? [styles.tableRowLast]
                    : []),
                ]}
              >
                <Text style={styles.cell}>{cat.category}</Text>
                <Text style={styles.cellNumeric}>
                  {(cat.total_energy_mwh * 0.000475).toFixed(4)}
                </Text>
                <Text style={styles.cellNumeric}>
                  {cat.total_duracion_segundos}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default PDFReport;
