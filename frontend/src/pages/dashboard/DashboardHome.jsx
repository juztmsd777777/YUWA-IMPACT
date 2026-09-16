import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockDashboard } from "../../services/mockData.js";
import { formatDate } from "../../utils/format.js";

export default function DashboardHome() {
  const [program, setProgram] = useState("");
  const [school, setSchool] = useState("");
  const data = mockDashboard;

  const filtered = useMemo(() => {
    return data.activities.filter((a) => {
      if (program && a.program !== program) return false;
      if (school && a.school !== school) return false;
      return true;
    });
  }, [data.activities, program, school]);

  return (
    <section>
      <h1>Admin dashboard</h1>
      <p className="muted">FE 2 — swap mockDashboard for GET /api/dashboard when BE 3 is ready.</p>
      <div className="row">
        <div className="stat">
          <span>Schools reached</span>
          <strong>{data.totalSchools}</strong>
        </div>
        <div className="stat">
          <span>Participants</span>
          <strong>{data.totalParticipants}</strong>
        </div>
        <div className="stat">
          <span>Activities</span>
          <strong>{data.totalActivities}</strong>
        </div>
        <div className="stat">
          <span>Photos</span>
          <strong>{data.totalPhotos}</strong>
        </div>
      </div>
      <div className="card">
        <h2>Program statistics</h2>
        {data.byProgram.map((p) => (
          <p key={p.name}>
            <strong>{p.name}</strong>: {p.schools} schools, {p.participants} participants,{" "}
            {p.activities} activities, avg score {p.averageScore}
          </p>
        ))}
        <p>
          <Link to="/dashboard/evaluation">Impact / evaluation</Link>
        </p>
      </div>
      <div className="card">
        <h2>Filters</h2>
        <label htmlFor="f-program">Program</label>
        <select id="f-program" value={program} onChange={(e) => setProgram(e.target.value)}>
          <option value="">All</option>
          <option>Ecolympics</option>
          <option>Green Gurukul</option>
        </select>
        <label htmlFor="f-school">School</label>
        <select id="f-school" value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="">All</option>
          <option>ABC School</option>
        </select>
      </div>
      <div className="card">
        <h2>Activities</h2>
        {filtered.length === 0 ? (
          <p className="muted">No activities match filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Program</th>
                <th>Type</th>
                <th>Date</th>
                <th>Participants</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link to={`/dashboard/activities/${a.id}`}>{a.school}</Link>
                  </td>
                  <td>{a.program}</td>
                  <td>{a.activityType}</td>
                  <td>{formatDate(a.date)}</td>
                  <td>{a.participants}</td>
                  <td>{a.averageScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
