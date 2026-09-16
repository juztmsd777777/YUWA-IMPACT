import useOnlineStatus from "../hooks/useOnlineStatus.js";

export default function StatusChip() {
  const online = useOnlineStatus();
  return (
    <span className={`status-chip ${online ? "online" : "offline"}`}>
      {online ? "Online" : "Offline"}
    </span>
  );
}
