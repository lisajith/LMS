import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "react-toastify";

function AttendanceCodeCard() {

  const [code, setCode] = useState("");

  function handleSubmit() {

    if (!code.trim()) {
      toast.error("Please enter the attendance code.");
      return;
    }

    toast.info("No attendance session is currently active.");

    setCode("");
  }

  return (

    <div className="card-theme rounded-2xl shadow p-6">

      <div className="flex items-center gap-3 mb-6">

        <KeyRound
          size={28}
          className="primary-text"
        />

        <div>

          <h2 className="text-2xl font-bold">

            Today's Attendance

          </h2>

          <p className="text-theme-muted">

            Enter the code shared by your trainer.

          </p>

        </div>

      </div>

      <input
        type="text"
        placeholder="Attendance Code"
        value={code}
        onChange={(e)=>
          setCode(
            e.target.value.toUpperCase()
          )
        }
        className="
          w-full
          rounded-xl
          border
          border-theme
          bg-theme
          text-theme
          px-4
          py-4
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      <button
        onClick={handleSubmit}
        className="btn-primary mt-5 w-full py-3 rounded-xl"
      >

        Submit Attendance

      </button>

    </div>

  );

}

export default AttendanceCodeCard;