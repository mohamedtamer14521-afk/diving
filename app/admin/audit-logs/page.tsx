"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { DataStore } from "@/lib/data-store";
import { AuditLog } from "@/lib/types";
import { History, Shield, Clock, User } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setLogs(DataStore.getAuditLogs());
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
            Security & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable chronological logging of all administrative operations, settings changes, and status transitions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {log.action}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Entity: {log.entity_type}
                  </span>
                </div>
                <p className="text-sm text-white font-medium">{log.details}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{log.user_email}</span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono flex items-center gap-1.5 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{new Date(log.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
