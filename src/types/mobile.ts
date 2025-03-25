

export interface DataRow {
  id?: string;
  no: number;
  date: string;
  namaPasien: string;
  nomorRekamMedis: string;
  namaDokter: string;
  jenisBius: string;
  jaminanOperasi: string;
  tindakanOperasi: string;
  teamOperasi: string;
  ruangOperasi: string;
  status: string;
}

export interface FormDataTypes {
  id?: string;
  date: string;
  waktuMulai: string;
  waktuSelesai: string;
  namaPasien: string;
  nomorRekamMedis: string;
  namaDokter: string;
  jenisBius: string;
  jaminanOperasi:string;
  tindakanOperasi: string;
  teamOperasi: string;
  ruangOperasi: string;
  pesananKhusus: string;
  tindakanHoldingRoom: string;
  ruangPemulihan: string;
}

export interface FormDataType {
  date: string;
  waktuMulai: string;
  waktuSelesai: string;
  namaPasien: string;
  nomorRekamMedis: string;
  namaDokter: string;
  jenisBius: string;
  jaminanOperasi: string;
  tindakanOperasi: string;
  teamOperasi: string;
  ruangOperasi: string;
  pesananKhusus: string;
  tindakanHoldingRoom: string;
  ruangPemulihan: string;
  file: File | null;
}

export interface DataType {
  date: string;
  namaPasien: string;
  nomorRekamMedis: string;
  namaDokter: string;
  jenisBius: string;
  jaminanOperasi: string;
  tindakanOperasi: string;
  teamOperasi: string;
  ruangOperasi: string;
}

export interface OperationRecord {
  no: number | string;
  date: string;
  namaPasien: string;
  nomorRekamMedis: string;
  namaDokter: string;
  jenisBius: string;
  jaminanOperasi: string;
  tindakanOperasi: string;
  teamOperasi: string;
  ruangOperasi: string;
  status: string;
  sheetName?: string;
}


// types/Doctor.ts
export interface Doctor {
  name: string;
  profile: string;
  imageUrl: string;
  fileId: string;
}
