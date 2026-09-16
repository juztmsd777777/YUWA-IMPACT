import { useState } from "react";
import { Link } from "react-router-dom";
import { newLocalId, putPendingRecord } from "../../offline/db.js";

const empty = {
  activityType: "",
  date: "",
  participants: "",
  averageScore: "",
  notes: "",
};

export default function ActivityForm() {
  const [form, setForm] = useState(empty);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function onSave(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.activityType || !form.date || !form.participants) {
      setError("Activity type, date, and participants are required.");
      return;
    }
    const record = {
      localId: newLocalId(),
      type: "activity",
      syncStatus: "pending",
      data: {
        ...form,
        programId: sessionStorage.getItem("yuwa.programId"),
        schoolId: sessionStorage.getItem("yuwa.schoolId"),
      },
    };
    try {
      await putPendingRecord(record);
      setMessage("Saved locally. Will sync when online (BE 2 + FE 1).");
      setForm(empty);
    } catch (err) {
      setError(err.message || "Could not save locally.");
    }
  }

  return (
    <section>
      <h1>Activity</h1>
      {error ? <div className="banner err">{error}</div> : null}
      {message ? <div className="banner ok">{message}</div> : null}
      <form onSubmit={onSave} className="card">
        <label htmlFor="activityType">Activity type</label>
        <input
          id="activityType"
          value={form.activityType}
          onChange={(e) => setField("activityType", e.target.value)}
          placeholder="Climate Quiz"
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={form.date}
          onChange={(e) => setField("date", e.target.value)}
        />
        <label htmlFor="participants">Number of participants</label>
        <input
          id="participants"
          type="number"
          min="0"
          value={form.participants}
          onChange={(e) => setField("participants", e.target.value)}
        />
        <label htmlFor="averageScore">Average score</label>
        <input
          id="averageScore"
          type="number"
          min="0"
          value={form.averageScore}
          onChange={(e) => setField("averageScore", e.target.value)}
        />
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          rows="3"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
        <label htmlFor="photo">Photo (capture or file)</label>
        <input id="photo" type="file" accept="image/*" capture="environment" onChange={onPhoto} />
        {preview ? (
          <p>
            <img src={preview} alt="Preview" width="200" />
          </p>
        ) : null}
        <p>
          <button type="submit">Save</button>{" "}
          <Link to="/participants">Participants</Link>{" "}
          <Link to="/">Home</Link>
        </p>
      </form>
    </section>
  );
}
