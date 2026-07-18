import DashboardAttendance from "../components/dashboard/DashboardAttendance";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceCodeCard from "../components/attendance/AttendanceCodeCard";
import AttendanceStats from "../components/attendance/AttendanceStats";
import { ClipboardCheck } from "lucide-react";

function Attendance() {
  return (
    <div className="space-y-8">

      <div className="flex items-center gap-3">

        <ClipboardCheck
          size={34}
          className="primary-text"
        />

        <div>

          <h1 className="text-4xl font-bold">
            Attendance
          </h1>

          <p className="text-theme-muted">
            View your attendance records.
          </p>

        </div>

      </div>


      <div className="grid lg:grid-cols-2 gap-6">
        <DashboardAttendance />
        <AttendanceCodeCard />
      </div>
        <AttendanceStats />
        <AttendanceTable />
      </div>
  );
}

export default Attendance;