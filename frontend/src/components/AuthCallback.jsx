import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

/**
 * Handles the Emergent Google Auth callback (`#session_id=...`).
 * We exchange the session_id for our auth cookies, then navigate.
 */
export default function AuthCallback() {
  const nav = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const hash = window.location.hash || "";
    const m = hash.match(/session_id=([^&]+)/);
    if (!m) {
      nav("/login");
      return;
    }
    const session_id = decodeURIComponent(m[1]);
    (async () => {
      try {
        const { data } = await api.post("/auth/google/session", { session_id });
        if (data?.token) localStorage.setItem("jc_token", data.token);
        window.history.replaceState(null, "", window.location.pathname);
        nav("/profile", { replace: true });
      } catch (e) {
        nav("/login?error=google", { replace: true });
      }
    })();
  }, [nav]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white/60 label-mono">
      AUTHORIZING WITH GOOGLE…
    </div>
  );
}
