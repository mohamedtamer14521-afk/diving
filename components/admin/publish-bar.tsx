"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Send, CheckCircle2, Clock, Smartphone, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataStore } from "@/lib/data-store";
import { formatDate } from "@/lib/utils";

export function PublishBar() {
  const [publishingStatus, setPublishingStatus] = useState(DataStore.getPublishingStatus());
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const updateStatus = () => {
    setPublishingStatus(DataStore.getPublishingStatus());
  };

  useEffect(() => {
    updateStatus();
    const handleSync = () => updateStatus();
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, []);

  const handlePublishAll = async () => {
    setIsPublishing(true);
    try {
      await DataStore.publishAllChanges();
      setPublishingStatus(DataStore.getPublishingStatus());
      setPublishedSuccess(true);
      setTimeout(() => setPublishedSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return "Never";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return isoString;
    }
  };

  return (
    <aside aria-label="Publishing Status and Actions" className="w-full mb-8 p-4 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Status Info */}
      <div className="flex flex-wrap items-center gap-3.5">
        <div className="flex items-center gap-2">
          {publishingStatus.hasUnpublishedChanges ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5" />
              Unpublished Draft Changes
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Published Live to Public
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            Last Published: {formatTimeAgo(publishingStatus.lastPublishedAt)}
          </span>
          {publishingStatus.pendingEntities.length > 0 && (
            <span className="hidden sm:inline text-cyan-300">
              Pending: {publishingStatus.pendingEntities.join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <Link href="/__dev/device-preview" target="_blank">
          <Button size="sm" variant="glass" className="text-xs">
            <Smartphone className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            Preview in Simulator
          </Button>
        </Link>

        <Button
          size="sm"
          variant={publishingStatus.hasUnpublishedChanges ? "primary" : "secondary"}
          isLoading={isPublishing}
          onClick={handlePublishAll}
          className="text-xs font-semibold px-4 shadow-lg"
        >
          {publishedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Published Live!
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 mr-1" />
              {publishingStatus.hasUnpublishedChanges ? "Publish Changes Live" : "Re-Publish Cache"}
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
