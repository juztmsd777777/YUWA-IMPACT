import { Link } from "react-router-dom";
import { mockEvaluation } from "../../services/mockData.js";

export default function EvaluationPage() {
  const e = mockEvaluation;
  return (
    <section>
      <h1>Impact / evaluation</h1>
      <p className="muted">FE 2 — replace with GET /api/evaluation.</p>
      <div className="card">
        <p>Before: {e.averageBefore}%</p>
        <p>After: {e.averageAfter}%</p>
        <p>Improvement: +{e.improvement} percentage points</p>
        <p className="muted">{e.participants} participants in this calculation.</p>
      </div>
      <Link to="/dashboard">Back</Link>
    </section>
  );
}
