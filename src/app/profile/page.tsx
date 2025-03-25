import DoctorProfile from "@/components/ui/UIDoctors";
import CardDoctor from "@/components/ui/cardDoctor";
import NurseForm from "@/components/doctors/nurseForm";
import React from "react";

const Profile = () => {
  return (
    <div>
      <DoctorProfile />
      {/* <FormComponent /> */}
      <CardDoctor/>
      <NurseForm/>
      {/* <FotoDoctor/> */}
    </div>
  );
};

export default Profile;
