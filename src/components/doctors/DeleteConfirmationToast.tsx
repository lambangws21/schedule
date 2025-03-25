import { toast } from "react-toastify";
import { OperationRecord } from "@/types/mobile";

interface DeleteConfirmationToastProps {
  record: OperationRecord;
  targetSheet: string;
  fetchData: () => void;
}

const DeleteConfirmationToast: React.FC<DeleteConfirmationToastProps> = ({ record, targetSheet, fetchData }) => {
  // Handle delete logic
  const handleDelete = async () => {
    const toastId = toast.loading(`Memuat konfirmasi untuk menghapus ${record.namaPasien}...`, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });

    toast.update(toastId, {
      render: (
        <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-2 md:space-y-0">
          <span className="text-sm md:text-base">Apakah Anda yakin ingin menghapus {record.namaPasien}?</span>
          <div className="space-x-2 flex flex-wrap justify-center md:justify-start">
            <button
              onClick={async () => {
                toast.update(toastId, {
                  render: "Deleting...",
                  type: "info",
                  autoClose: false,
                });

                try {
                  const res = await fetch("/api/dataDokter/delput", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      methodOverride: "DELETE",
                      no: record.no,
                      targetSheet,
                    }),
                  });

                  const result = await res.json();

                  if (result.status === "success") {
                    toast.update(toastId, {
                      render: `Record no ${record.no} berhasil dihapus.`,
                      type: "success",
                      autoClose: 5000,
                    });
                    fetchData();
                  } else {
                    toast.update(toastId, {
                      render: `Gagal menghapus: ${result.error || result.message}`,
                      type: "error",
                      autoClose: 5000,
                    });
                  }
                } catch (error) {
                  console.error("Error deleting record:", error);
                  toast.update(toastId, {
                    render: "Error deleting record",
                    type: "error",
                    autoClose: 5000,
                  });
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(toastId)} // Dismiss the toast if "No" is clicked
              className="bg-gray-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            >
              No
            </button>
          </div>
        </div>
      ),
      autoClose: false,
    });
  };

  // Returning null, as this component does not need to render any other UI element
  return null;
};

export default DeleteConfirmationToast;
