import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../Login/AuthContext";

function Navigation() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loginTime, setLoginTime] = useState("");

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Guest";
  const email = user?.email || "No email available";
  const avatarUrl = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "default"}`;
  const hasPhotoUrl = user?.photoURL;

  useEffect(() => {
    if (user) {
      setLoginTime(new Date().toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }));
    }
  }, [user]);

  const initials = useMemo(() => {
    if (hasPhotoUrl) return "";
    return displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [hasPhotoUrl, displayName]);

  return (
    <div>
    <header className="navigation-header d-flex justify-content-between align-items-center p-3 border-bottom bg-white shadow-sm">
        <p>Hi,{displayName}!, Here's what happening on your farm today</p>

      <div className="position-relative">
        <button
          type="button"
          className="btn btn-white rounded-pill border d-flex align-items-center gap-2 px-2"
          onClick={() => setOpen((current) => !current)}
          style={{ minHeight: 44 }}
        >
          {hasPhotoUrl ? (
            <img
              src={avatarUrl}
              alt="User avatar"
              className="rounded-circle"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
          ) : (
            <img
              src={avatarUrl}
              alt="User avatar"
              className="rounded-circle"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
          )}
          <p className="mb-0 small text-start" style={{ lineHeight: 1.1 }}>
            {displayName}
          </p>
        </button>

        {open && (
          <div
            className="user-dropdown position-absolute end-0 mt-2 p-3 bg-white border rounded shadow-sm"
            style={{ width: 240, zIndex: 10 }}
          >
            <div className="mb-3 small text-muted">
              <div className="text-muted">{email}</div>
              <div className="mb-1">Logged in</div>
              <div>{loginTime || "Just now"}</div>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger w-100"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>    
    </header>
    </div>
  );
}

export default Navigation;