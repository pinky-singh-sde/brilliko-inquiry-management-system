"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Log = {
  id: string;
  action: string;
  notes: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    role: string;
  } | null;
};

function formatDateTime(date: string) {
  const utcDate = new Date(date + "Z"); // 👈 FORCE UTC

  return utcDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}


export default function InquiryTimeline({ inquiryId }: { inquiryId: string }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("inquiry_logs")
      .select(`
        id,
        action,
        notes,
        created_at,
        profiles (
          full_name,
          role
        )
      `)
      .eq("inquiry_id", inquiryId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLogs(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (inquiryId) loadLogs();
  }, [inquiryId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-medium">Inquiry Timeline</h3>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-gray-500">Loading timeline...</p>
      )}

      {/* Empty */}
      {!loading && logs.length === 0 && (
        <p className="text-sm text-gray-500">
          No activity recorded yet.
        </p>
      )}

      {/* Timeline */}
      {logs.map((log) => (
        <div
          key={log.id}
          className="border-l-2 border-orange-500 pl-4 space-y-1"
        >
          <p className="text-sm font-medium text-gray-800">
            {log.action.replaceAll("_", " ")}
          </p>

          {log.notes && (
            <p className="text-sm text-gray-600">
              {log.notes}
            </p>
          )}

          <p className="text-xs text-gray-400">
            {log.profiles?.full_name ?? "System"} •{" "}
            {log.profiles?.role ?? ""} •{" "}
            {/* {new Date(log.created_at).toLocaleString()} */}
            {formatDateTime(log.created_at)}

          </p>
        </div>
      ))}
    </div>
  );
}
