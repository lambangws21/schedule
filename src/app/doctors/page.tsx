"use client";
import React from "react";
import OperationForm from "@/components/doctors/DoctorForm";
import StaffForm from "@/components/doctors/nurseForm";
import OperationDataDisplay from "@/components/doctors/dataListCard";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <OperationDataDisplay />
      <OperationForm />
      <StaffForm />
    </div>
  );
};

export default Home;
