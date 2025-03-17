export interface Profile {
    name: string;
    level: string;
    stars: number;
  }
  
  export interface Tournament {
    name: string;
    entryFee: number;
    endDate: string;
  }
  
  export interface Stats {
    progress: number;
    arenaScore: number;
    ranking: number;
    following: number;
    totalAmount: number; // ✅ Pastikan ini tetap number
  }
  
  export interface Transaction {
    date: string;
    jenisBiaya: string;
    jumlah: string;
    amount: number;
  }
  
  export interface DashboardData {
    totalAmount: number; // ✅ Harus number, bukan Stats
    profile: Profile;
    tournament: Tournament;
    stats: Stats;
    transactions: Transaction[];
  }
  