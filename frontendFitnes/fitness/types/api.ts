export interface Szolgaltatas {
    id?: number;
    kategoria_id?: number;
    megnevezes: string;
    alapar: number;
    munkaido_perc: number;
    aktiv?: number | boolean;
    kategoria_nev?: string;
}
 
export interface KategoriaStatisztika {
    kategoria_nev: string;
    szolgaltatasok_szama: number;
    atlagos_alapar: number | string | null;
}
 
export const API_BASE_URL ="https://localhost:3000"