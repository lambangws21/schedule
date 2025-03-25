import DataTrial from '@/components/doctors/SheetSelector'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import DoctorForm from '@/components/doctors/DoctorForm'
import StaffForm from '@/components/doctors/StafForm'
import CardStaaf from '@/components/doctors/StaffList'
import EditStaff from '@/components/doctors/EditStafCard'


const Motion = () => {
  return (
    <div>
      <ToastContainer/>
        <DataTrial  />
        <DoctorForm/>
        <CardStaaf/>
        <StaffForm/>
        <EditStaff />
    </div>
  )
}

export default Motion