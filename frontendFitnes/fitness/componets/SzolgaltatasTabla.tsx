import React from "react";
import type { Szolgaltatas } from "../types/api";

interface SzolgaltatasTablaProps {
  adatok: Szolgaltatas[];
}

export function SzolgaltatasTabla({ adatok }: SzolgaltatasTablaProps) {
  if (adatok.length === 0) {
    return (
      <div className="alert alert-secondary mb-0">
        Nincs megjeleníthető adat. Kattints az <strong>API meghívása</strong> gombra!
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Megnevezés</th>
            <th>Kategória</th>
            <th>Alapár (Ft)</th>
            <th>Munkaidő</th>
            <th>Állapot</th>
          </tr>
        </thead>
        <tbody>
          {adatok.map((item, index) => (
            <tr key={item.id ?? index}>
              <td>{item.id ?? index + 1}</td>
              <td className="fw-medium">{item.megnevezes ?? "—"}</td>
              <td>
                {item.kategoria_nev ??
                  (item.kategoria_id !== undefined ? `ID: ${item.kategoria_id}` : "—")}
              </td>
              <td>
                {item.alapar !== undefined
                  ? `${Number(item.alapar).toLocaleString("hu-HU")} Ft`
                  : "—"}
              </td>
              <td>
                {item.munkaido_perc !== undefined ? `${item.munkaido_perc} perc` : "—"}
              </td>
              <td>
                {item.aktiv === undefined ? (
                  <span className="badge text-bg-secondary">—</span>
                ) : Boolean(item.aktiv) ? (
                  <span className="badge text-bg-success">Aktív</span>
                ) : (
                  <span className="badge text-bg-danger">Inaktív</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
