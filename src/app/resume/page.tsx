"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { Navigation } from "@/components/layout/Navigation";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Link from "next/link";

const RESUME_DATA = {
  name: "Chaudhry Rasikh Rizwan",
  title: "Cyber Security Analyst",
  contact: {
    email: SITE_CONFIG.personalEmail,
    phone: SITE_CONFIG.phone,
    linkedin: "LinkedIn",
  },
  summary: [
    "SOC operations: Triaged Level-1 SIEM alerts and supported daily threat monitoring; strengthened defenses using firewalls and IDS/IPS while assisting in malware triage to improve detection and response.",
    "End-user IT support: Provided technical support for 200+ users across university systems, troubleshooting hardware, software, LAN connectivity, and Duo MFA authentication with 75%+ first-contact resolution.",
    "Network reliability and segmentation: Improved uptime by ~20% through proactive monitoring and switch optimization; implemented VLANs and ACLs to reduce broadcast domains and limit lateral movement.",
    "Access hardening: Secured services using HTTPS, SSH, and VPN while enforcing IAM policies and multi-factor authentication (Duo) to strengthen authentication and authorization controls.",
  ],
  certifications: [
    { name: "CompTIA Security+", date: "August 2025" },
    { name: "Cisco Certified Network Associate (CCNA)", date: "August 2024" },
    { name: "OPSWAT Introduction to Critical Infrastructure Protection (ICIP)", date: "August 2025" },
  ],
  education: [
    {
      degree: "Bachelor of Science, Chemistry",
      school: "York University",
      location: "North York, ON",
      date: "December 2028",
    },
    {
      degree: "Alberta Accredited High School Diploma",
      school: "Maplewood Canadian International School",
      location: "Abu Dhabi, UAE",
      date: "June 2023",
    },
  ],
  experience: [
    {
      title: "Information Technology Assistant",
      company: "Lassonde School of Engineering, York University",
      location: "North York, Canada",
      period: "Jan 2026 – Present",
      bullets: [
        "Diagnose and resolve hardware, software, and network connectivity issues across university workstations and lab systems.",
        "Configure user accounts, endpoints, and multi-factor authentication services within campus IT infrastructure.",
        "Troubleshoot LAN connectivity, access control, and system configuration issues.",
        "Document incidents in the ticketing system, maintain service logs, and escalate advanced technical issues to senior IT staff.",
      ],
    },
    {
      title: "Cyber Security Analyst",
      company: "A Hamson Inc.",
      location: "United Arab Emirates",
      period: "May 2025 – Aug 2025",
      bullets: [
        "Reviewed Level 1 SIEM logs to identify potential security threats and vulnerabilities.",
        "Participated in comprehensive Threat Management training to enhance incident response strategies.",
        "Enhanced skills in malware analysis, implementation of security measures across various domains, including firewalls, IDS and IPS.",
        "Developed skills in cryptographic security, identity and access management, and security automation.",
      ],
    },
    {
      title: "Information Technology Internship",
      company: "Maplewood Canadian International School",
      location: "Abu Dhabi, UAE",
      period: "Sep 2022 – Feb 2023",
      bullets: [
        "Supported MCIS IT team in managing wired/wireless network infrastructure, resolving 200+ IT issues and configuring Cisco switches & Meraki APs.",
        "Achieved 95%+ customer satisfaction through prompt resolution, seamless connectivity, and accurate database maintenance.",
      ],
    },
    {
      title: "Social Media Managing Internship",
      company: "Maplewood Canadian International School",
      location: "Abu Dhabi, UAE",
      period: "Sep 2021 – Feb 2022",
      bullets: [
        "Managed and updated content/advertisements across all school platforms, showcasing MCIS's compliance with COVID-19 health regulations.",
        "Contributed to MCIS achieving the #1 school ranking in Mohammed Bin Zayed City.",
      ],
    },
  ],
  skills: [
    { category: "Security Operations", items: "Malware Analysis, Threat Intelligence, Threat Hunting, Incident Response, Digital Forensics, SIEM (Splunk, QRadar, Microsoft Sentinel), SOAR Automation, MITRE ATT&CK, OSINT" },
    { category: "Access & Identity", items: "IAM, MFA, SSO, Privileged Access Management, Zero Trust Architecture" },
    { category: "Network Security", items: "VLAN Segmentation, ACLs, Firewalls, VPNs, Secure Protocols (HTTPS, SSH, IPSec, TLS/SSL), OSPF, EIGRP, NAT, DHCP" },
    { category: "Endpoint & Server Security", items: "Hardening, Patch Management, Baseline Configurations, Endpoint Detection & Response (EDR)" },
    { category: "Vulnerability Management", items: "Nessus, OpenVAS, Nmap, Penetration Testing, Remediation Planning" },
    { category: "Cryptography", items: "Encryption, Hashing, PKI, Digital Signatures, Key Management" },
    { category: "Compliance & Governance", items: "ISO 27001, NIST CSF, GDPR, HIPAA, PCI-DSS, Risk Assessment" },
    { category: "Management & Coordination", items: "SOC Oversight, Security Policy Development, Security Awareness Training, Change Management, Vendor Management" },
  ],
};

function LockedState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-lg mx-auto px-6 text-center"
      >
        <GlassPanel variant="card" className="p-12 relative overflow-hidden">
          {/* Scan line accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          {/* Terminal header */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-amber-400/70 uppercase">
              authorization required
            </span>
          </div>

          {/* Lock icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} role="img" aria-label="Locked">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2 font-mono tracking-tight">
            Clearance Denied
          </h1>

          <p className="font-mono text-xs text-subtle mb-6 tracking-wider">
            ERR_AUTH_0x4F2 — INSUFFICIENT CLEARANCE LEVEL
          </p>

          <p className="text-muted leading-relaxed mb-3">
            This document requires an established secure connection.
            Scroll to the contact section and let the decryption sequence complete.
          </p>

          <p className="text-sm text-subtle mb-8">
            Once the connection at{" "}
            <span className="text-cyan font-mono">{SITE_CONFIG.email}</span>{" "}
            is established, this page will unlock automatically.
          </p>

          <MagneticButton href="/#contact" variant="primary">
            Establish Connection
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>

          <Link
            href="/"
            className="block mt-6 text-sm text-muted hover:text-foreground transition-colors font-mono text-xs tracking-wider"
          >
            &larr; RETURN TO MAIN TERMINAL
          </Link>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

function ResumeContent() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <GlassPanel variant="card" className="p-8 mb-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {RESUME_DATA.name}
              </h1>
              <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-muted mb-4">
                <span>{RESUME_DATA.contact.email}</span>
                <span className="hidden sm:inline text-border">|</span>
                <span>{RESUME_DATA.contact.phone}</span>
                <span className="hidden sm:inline text-border">|</span>
                <a href={SITE_CONFIG.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">
                  LinkedIn
                </a>
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20">
                <span className="text-sm font-medium text-cyan">{RESUME_DATA.title}</span>
              </div>
            </div>
          </GlassPanel>

          {/* Professional Summary */}
          <GlassPanel variant="card" className="p-8 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
              Professional Summary
            </h2>
            <ul className="space-y-3">
              {RESUME_DATA.summary.map((item, i) => (
                <li key={i} className="text-sm text-muted leading-relaxed pl-4 border-l border-border">
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>

          {/* Certifications */}
          <GlassPanel variant="card" className="p-8 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RESUME_DATA.certifications.map((cert) => (
                <div key={cert.name} className="p-4 rounded-lg bg-white/[0.02] border border-border">
                  <p className="text-sm font-medium text-foreground mb-1">{cert.name}</p>
                  <p className="text-xs text-muted">{cert.date}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Education */}
          <GlassPanel variant="card" className="p-8 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Education
            </h2>
            <div className="space-y-4">
              {RESUME_DATA.education.map((edu) => (
                <div key={edu.degree} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                    <p className="text-sm text-cyan">{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">{edu.date}</p>
                    <p className="text-xs text-subtle">{edu.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Experience */}
          <GlassPanel variant="card" className="p-8 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Experience
            </h2>
            <div className="space-y-8">
              {RESUME_DATA.experience.map((exp) => (
                <div key={`${exp.title}-${exp.period}`} className="relative pl-4 border-l border-border">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{exp.title}</h3>
                      <p className="text-sm text-cyan">{exp.company}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono text-muted">{exp.period}</p>
                      <p className="text-xs text-subtle">{exp.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="text-sm text-muted leading-relaxed flex gap-2">
                        <span className="text-cyan mt-1.5 shrink-0">&#8226;</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Skills */}
          <GlassPanel variant="card" className="p-8 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
              Skills
            </h2>
            <div className="space-y-3">
              {RESUME_DATA.skills.map((skill) => (
                <div key={skill.category}>
                  <span className="text-sm font-medium text-foreground">{skill.category}: </span>
                  <span className="text-sm text-muted">{skill.items}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Back link */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              &larr; Back to portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getUnlockedState(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("resume_unlocked") === "true";
  } catch {
    return false;
  }
}

export default function ResumePage() {
  const [unlocked] = useState<boolean | null>(() => getUnlockedState());

  // Loading state
  if (unlocked === null) {
    return (
      <>
        <AmbientBackground />
        <Navigation />
        <div className="min-h-screen" />
      </>
    );
  }

  return (
    <>
      <AmbientBackground />
      <Navigation />
      {unlocked ? <ResumeContent /> : <LockedState />}
    </>
  );
}
