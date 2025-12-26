"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { DashboardShell } from "@/components/layout";
import {
  MetricsGrid,
  SecondaryStats,
  RecentReports,
  ThreatChart,
  QuickActions,
  EntityActivity,
  RelationshipGraphMini,
  AIChatMini,
} from "@/components/dashboard";

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [isPending, setIsPending] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("--:--:--");

  // Update time every second (client-side only to avoid hydration mismatch)
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Get session using authClient directly
    authClient.getSession()
      .then((data) => {
        setSession(data?.session || null);
        setIsPending(false);
      })
      .catch(() => {
        setSession(null);
        setIsPending(false);
      });
  }, []);

  const userName = session?.user?.name?.split(" ")[0] || "Operator";

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="text-matrix">{userName}</span>
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Here&apos;s what&apos;s happening with your threat intelligence today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-text-muted">Last updated</p>
              <p className="text-sm font-mono text-white" suppressHydrationWarning>
                {currentTime}
              </p>
            </div>
            <div className="w-px h-8 bg-glass-border" />
            <button className="btn-primary text-sm">
              + New Report
            </button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <MetricsGrid />

        {/* Secondary Stats */}
        <SecondaryStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Reports & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <RecentReports />
            <ThreatChart />
          </div>

          {/* Right Column - Actions & Activity */}
          <div className="space-y-6">
            <QuickActions />
            <EntityActivity />
          </div>
        </div>

        {/* Bottom Grid - Graph & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RelationshipGraphMini />
          <AIChatMini />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-6 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono">SEPTO v1.0.0</span>
            <span>•</span>
            <span>Security & Entity Profiling Threat Observatory</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-matrix transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-matrix transition-colors">
              API Reference
            </a>
            <a href="#" className="hover:text-matrix transition-colors">
              Support
            </a>
          </div>
        </motion.footer>
      </div>
    </DashboardShell>
  );
}


