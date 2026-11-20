import { useState } from "react";
import React from "react";
import contentMd from "../content/osszes.md?raw";
import { MarkdownHeader } from "../componets/MarkdownHeader";
import { SzolgaltatasTabla } from "../componets/SzolgaltatasTabla";
import { API_BASE_URL, type Szolgaltatas } from "../types/api";

export function OsszesSzolgaltatasPage() {
  const [adatok, setAdatok] = useState<Szolgaltatas[]>([]);
  const [betoltes, setBetoltes] = useState(false);
  const [hiba, setHiba] = useState<string | null>(null);

  const apiHivas = async () => {
    setBetoltes(true);
    setHiba(null);
    try {
      const res = await fetch(`${API_BASE_URL}/szolgaltatasok`);
      if (!res.ok) throw new Error(`HTTP hiba: ${res.status}`);
      const json: Szolgaltatas[] = await res.json();
      setAdatok(json);
    } catch (err) {
      setHiba(err instanceof Error ? err.message : "Ismeretlen hiba történt.");
    } finally {
      setBetoltes(false);
    }
  };

  return (
    <section>
      <MarkdownHeader content={contentMd} />
      <div className="mb-3">
        <button className="btn btn-primary" onClick={apiHivas} disabled={betoltes}>
          {betoltes ? "Betöltés..." : "API meghívása (GET /szolgaltatasok)"}
        </button>
      </div>
      {hiba && <div className="alert alert-danger">{hiba}</div>}
      <SzolgaltatasTabla adatok={adatok} />
    </section>
  );
}
