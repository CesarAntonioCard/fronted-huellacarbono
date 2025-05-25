export const getFechaLima = (): string => {
  const fecha = new Date();
  const formatter = new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [{ value: day }, , { value: month }, , { value: year }] =
    formatter.formatToParts(fecha);

  return `${year}-${month}-${day}`;
};

export const getFechaAyerLima = (): string => {
  const fecha = new Date();

  const fechaUtc = new Date(
    fecha.toLocaleString("en-US", { timeZone: "America/Lima" })
  );
  fechaUtc.setDate(fechaUtc.getDate() - 1);

  const formatter = new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [{ value: day }, , { value: month }, , { value: year }] =
    formatter.formatToParts(fechaUtc);

  return `${year}-${month}-${day}`;
};
