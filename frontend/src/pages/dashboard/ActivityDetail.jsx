import { Link, useParams } from "react-router-dom";
import { mockDashboard } from "../../services/mockData.js";
import { formatDate } from "../../utils/format.js";

export default function ActivityDetail() {
  const { id } = useParams();
  const activity = mockDashboard.activities.find((a) => a.id === id);

  if (!activity) {
    return (
      <section>
        <h1>Activity</h1>
        <div className="banner warn">Not found (still using mock data).</div>
        <Link to="/dashboard">Back</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>{activity.activityType}</h1>
      <div className="card">
        <p>School: {activity.school}</p>
        <p>Program: {activity.program}</p>
        <p>Date: {formatDate(activity.date)}</p>
        <p>Participants: {activity.participants}</p>
        <p>Score: {activity.averageScore}</p>
      </div>
      <Link to="/dashboard">Back to dashboard</Link>
    </section>
  );
}
