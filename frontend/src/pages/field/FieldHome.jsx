import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useOnlineStatus from "../../hooks/useOnlineStatus.js";
import { getPendingRecords, markRecordsSynced, countPending } from "../../offline/db.js";
import { api } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";

export default function FieldHome() {
  const online = useOnlineStatus();
  const [pending, setPending] = useState(0);
  const [localRecords, setLocalRecords] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  const loadData = useCallback(async () => {
    try {
      const records = await getPendingRecords();
      setLocalRecords(records);
      const pendingCount = records.filter((r) => r.syncStatus === "pending").length;
      setPending(pendingCount);
    } catch {
      setLocalRecords([]);
      setPending(0);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync action
  const handleSync = async () => {
    if (!online) {
      setSyncMsg("You are currently offline. Connect to the internet to sync.");
      return;
    }
    try {
      setIsSyncing(true);
      setSyncMsg("");
      const records = await getPendingRecords();
      const unsynced = records.filter((r) => r.syncStatus === "pending");

      if (unsynced.length === 0) {
        setSyncMsg("Everything is already up to date.");
        setIsSyncing(false);
        return;
      }

      const res = await api.sync(unsynced);
      if (res.synced && res.synced.length > 0) {
        await markRecordsSynced(res.synced);
        setSyncMsg(`Successfully synced ${res.synced.length} record(s)!`);
      } else if (res.failed && res.failed.length > 0) {
        setSyncMsg(`Sync completed with ${res.failed.length} failure(s).`);
      }
      await loadData();
    } catch (err) {
      setSyncMsg(`Sync error: ${err.message || "Failed to reach server"}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section>
      <h1>Field Home</h1>
      <p className="muted">Record school activities and sync when connectivity is available.</p>

      {syncMsg ? <div className="banner ok">{syncMsg}</div> : null}

      {pending > 0 ? (
        <div className="banner warn">
          {pending} record(s) pending sync.
          {online ? (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              style={{ marginLeft: "1rem", padding: "0.25rem 0.75rem", fontSize: "0.85rem" }}
            >
              {isSyncing ? "Syncing..." : "Sync Now"}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="banner ok">All local records synced</div>
      )}

      <div className="row">
        <div className="stat">
          <span>Local records</span>
          <strong>{localRecords.length}</strong>
        </div>
        <div className="stat">
          <span>Pending sync</span>
          <strong>{pending}</strong>
        </div>
        <div className="stat">
          <span>Connection</span>
          <strong>{online ? "Online" : "Offline"}</strong>
        </div>
      </div>

      <p style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link className="button" to="/programs">
          + Add Activity
        </Link>
        {online && (
          <button onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync Records"}
          </button>
        )}
      </p>

      <div className="card">
        <h2>Local Activity Records</h2>
        {localRecords.length === 0 ? (
          <p className="muted">No activities recorded on this device yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Activity</th>
                <th>Participants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {localRecords.map((r) => (
                <tr key={r.localId}>
                  <td><strong>{r.type}</strong></td>
                  <td>{r.data?.activityType || r.data?.name || "Activity"}</td>
                  <td>{r.data?.participants || r.data?.age || "—"}</td>
                  <td>
                    <span className={`status-chip ${r.syncStatus === "synced" ? "online" : "offline"}`}>
                      {r.syncStatus || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

