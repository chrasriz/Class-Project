"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { LAB_NODES, LAB_CONNECTIONS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useInView } from "@/hooks/useInView";

const NODE_COLORS = {
  security: { bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.4)", text: "#06b6d4" },
  monitoring: { bg: "rgba(139, 92, 246, 0.15)", border: "rgba(139, 92, 246, 0.4)", text: "#8b5cf6" },
  server: { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)", text: "#10b981" },
  endpoint: { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#f59e0b" },
};

const LIVE_STATS = [
  { label: "Network Uptime", value: "99.97%", icon: "shield" },
  { label: "Threats Blocked", value: "12,847", icon: "block" },
  { label: "Packets Inspected", value: "2.4M", icon: "scan" },
  { label: "Active Rules", value: "342", icon: "rules" },
];

const LOG_ENTRIES = [
  { time: "14:23:07", level: "INFO", msg: "Firewall rule updated — port 443 inbound allowed" },
  { time: "14:23:12", level: "WARN", msg: "Suspicious login attempt from 203.0.113.42 — blocked" },
  { time: "14:23:18", level: "INFO", msg: "IDS signature update completed — 47 new rules" },
  { time: "14:23:25", level: "CRIT", msg: "Port scan detected from 198.51.100.7 — auto-quarantined" },
  { time: "14:23:31", level: "INFO", msg: "SSL certificate renewed for internal services" },
  { time: "14:23:38", level: "WARN", msg: "Elevated DNS queries to unknown TLD — flagged for review" },
  { time: "14:23:45", level: "INFO", msg: "VPN tunnel re-established — latency nominal" },
  { time: "14:23:52", level: "INFO", msg: "Backup verification passed — all snapshots intact" },
];

function NetworkDiagram() {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div ref={ref} className="relative w-full aspect-[16/10] overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Connections */}
        {LAB_CONNECTIONS.map((conn, i) => {
          const from = LAB_NODES.find((n) => n.id === conn.from)!;
          const to = LAB_NODES.find((n) => n.id === conn.to)!;
          const isActive = activeNode === conn.from || activeNode === conn.to;
          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isActive ? "rgba(6, 182, 212, 0.5)" : "rgba(255, 255, 255, 0.08)"}
              strokeWidth={isActive ? 0.4 : 0.2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          );
        })}

        {/* Nodes */}
        {LAB_NODES.map((node, i) => {
          const colors = NODE_COLORS[node.type];
          const isActive = activeNode === node.id;
          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className="cursor-pointer"
            >
              {/* Glow */}
              {isActive && (
                <circle cx={node.x} cy={node.y} r={5} fill={colors.bg} opacity={0.6} />
              )}
              {/* Ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={3}
                fill={colors.bg}
                stroke={colors.border}
                strokeWidth={isActive ? 0.4 : 0.2}
              />
              {/* Center dot */}
              <circle cx={node.x} cy={node.y} r={1} fill={colors.text} />
              {/* Label */}
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                fill={isActive ? colors.text : "rgba(148, 163, 184, 0.8)"}
                fontSize={2.2}
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

function LiveLogFeed() {
  const [visibleCount, setVisibleCount] = useState(0);
  const { ref, isInView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setVisibleCount((prev) => (prev < LOG_ENTRIES.length ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [isInView]);

  const levelColor = (level: string) => {
    switch (level) {
      case "CRIT": return "text-red-400";
      case "WARN": return "text-amber-400";
      default: return "text-cyan";
    }
  };

  return (
    <div ref={ref} className="font-mono text-xs space-y-1.5 max-h-[280px] overflow-hidden">
      {LOG_ENTRIES.slice(0, visibleCount).map((entry, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-3"
        >
          <span className="text-subtle shrink-0">{entry.time}</span>
          <span className={`shrink-0 w-10 ${levelColor(entry.level)}`}>[{entry.level}]</span>
          <span className="text-muted truncate">{entry.msg}</span>
        </motion.div>
      ))}
      {visibleCount >= LOG_ENTRIES.length && (
        <div className="flex items-center gap-2 text-subtle pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Monitoring active — awaiting events</span>
        </div>
      )}
    </div>
  );
}

export function Lab() {
  return (
    <section id="lab" className="section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Digital Lab"
          title="Mission Control"
          description="Interactive overview of security infrastructure, network topology, and real-time monitoring systems."
        />

        {/* Stats Bar */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {LIVE_STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <GlassPanel variant="subtle" className="p-5 text-center">
                <div className="text-xl font-bold text-gradient-cyan mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] text-muted tracking-wide uppercase">
                  {stat.label}
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Diagram */}
          <GlassPanel variant="card" className="p-6" animate={true}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              <h3 className="text-sm font-medium text-foreground tracking-wide">
                Network Topology
              </h3>
              <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>
            <NetworkDiagram />
            <div className="mt-4 flex flex-wrap gap-4">
              {Object.entries(NODE_COLORS).map(([type, colors]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: colors.text }} />
                  <span className="text-[10px] text-muted capitalize">{type}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Live Log */}
          <GlassPanel variant="card" className="p-6" animate={true}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <h3 className="text-sm font-medium text-foreground tracking-wide">
                Security Event Log
              </h3>
              <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                STREAMING
              </span>
            </div>
            <div className="glass-subtle p-4 rounded-lg">
              <LiveLogFeed />
            </div>
          </GlassPanel>
        </div>

        {/* Architecture Overview */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8"
        >
          <GlassPanel variant="card" className="p-8">
            <h3 className="text-sm font-medium text-foreground tracking-wide mb-6">
              Security Architecture Layers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  layer: "Perimeter Defense",
                  description: "Firewalls, IDS/IPS, DDoS mitigation, and edge filtering providing the first line of defense against external threats.",
                  components: ["Next-Gen Firewall", "IDS/IPS", "WAF", "DDoS Protection"],
                },
                {
                  layer: "Internal Security",
                  description: "Network segmentation, access control, and lateral movement prevention ensuring containment of potential breaches.",
                  components: ["Micro-Segmentation", "NAC", "Zero Trust", "PAM"],
                },
                {
                  layer: "Monitoring & Response",
                  description: "Continuous monitoring, log correlation, and automated response workflows enabling rapid threat neutralization.",
                  components: ["SIEM", "SOAR", "EDR", "Threat Intel"],
                },
              ].map((layer) => (
                <div key={layer.layer} className="space-y-3">
                  <h4 className="text-sm font-semibold text-cyan">{layer.layer}</h4>
                  <p className="text-xs text-muted leading-relaxed">{layer.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.components.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 text-[10px] font-mono text-muted bg-white/5 rounded border border-border"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
