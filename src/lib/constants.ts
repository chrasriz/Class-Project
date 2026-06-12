export const SITE_CONFIG = {
  name: "Rasikh",
  title: "Rasikh Rizwan | Cybersecurity Analyst",
  description:
    "Portfolio of Chaudhry Rasikh Rizwan, Cybersecurity Analyst and IT Professional based in Toronto, Canada. Specializing in SOC operations, network security, and access hardening.",
  url: "https://chrasriz.com",
  location: "Toronto, Canada",
  role: "Cybersecurity Analyst | IT Professional",
  socials: {
    linkedin: "https://www.linkedin.com/in/ch-rasikh-rizwan/",
  },
};

// Email kept base64-encoded so the literal address never sits in the page
// source or JS bundle as plaintext. Decoded at runtime only.
const EMAIL_ENCODED = "Y29ubmVjdEBjaHJhc3Jpei5jb20=";

export function getEmail(): string {
  return atob(EMAIL_ENCODED);
}

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

// Proficiency tiers instead of self-assigned percentages: core (daily-driver
// depth), advanced (independent, production-grade), working (solid grounding).
export type SkillTier = "core" | "advanced" | "working";

export const SKILLS: { category: string; items: { name: string; tier: SkillTier }[] }[] = [
  {
    category: "Security Operations",
    items: [
      { name: "SIEM (Splunk, QRadar, Sentinel)", tier: "core" },
      { name: "Malware Analysis", tier: "core" },
      { name: "Incident Response", tier: "advanced" },
      { name: "MITRE ATT&CK / OSINT", tier: "advanced" },
      { name: "Threat Intelligence & Hunting", tier: "advanced" },
      { name: "Digital Forensics", tier: "working" },
    ],
  },
  {
    category: "Network Security",
    items: [
      { name: "VLAN Segmentation & ACLs", tier: "core" },
      { name: "Secure Protocols (HTTPS, SSH, IPSec)", tier: "core" },
      { name: "Firewalls & VPNs", tier: "core" },
      { name: "IDS/IPS", tier: "core" },
      { name: "OSPF / EIGRP / NAT / DHCP", tier: "core" },
      { name: "Wireless Security", tier: "advanced" },
    ],
  },
  {
    category: "Access & Compliance",
    items: [
      { name: "IAM & MFA (Duo)", tier: "core" },
      { name: "Risk Assessment", tier: "advanced" },
      { name: "Zero Trust Architecture", tier: "advanced" },
      { name: "ISO 27001 / NIST CSF", tier: "advanced" },
      { name: "Privileged Access Management", tier: "working" },
      { name: "GDPR / HIPAA / PCI-DSS", tier: "working" },
    ],
  },
  {
    category: "Infrastructure & Tools",
    items: [
      { name: "Linux Administration", tier: "core" },
      { name: "Nessus / OpenVAS / Nmap", tier: "advanced" },
      { name: "Patch Management & Hardening", tier: "advanced" },
      { name: "Endpoint Detection & Response", tier: "advanced" },
      { name: "Penetration Testing", tier: "advanced" },
      { name: "Cryptography & PKI", tier: "working" },
    ],
  },
];

export const EXPERIENCE = [
  {
    period: "Jan 2026 - Present",
    title: "Information Technology Assistant",
    organization: "Lassonde School of Engineering, York University",
    description:
      "Diagnose and resolve hardware, software, and network connectivity issues across university workstations and lab systems. Configure user accounts, endpoints, and multi-factor authentication services within campus IT infrastructure. Document incidents in the ticketing system and escalate advanced issues to senior IT staff.",
    type: "work" as const,
  },
  {
    period: "May 2025 - Aug 2025",
    title: "Cyber Security Analyst",
    organization: "A Hamson Inc., UAE",
    description:
      "Reviewed Level 1 SIEM logs to identify potential security threats and vulnerabilities. Enhanced skills in malware analysis, firewalls, IDS/IPS implementation. Developed skills in cryptographic security, identity and access management, and security automation.",
    type: "work" as const,
  },
  {
    period: "Sep 2022 - Feb 2023",
    title: "Information Technology Internship",
    organization: "Maplewood Canadian International School, Abu Dhabi",
    description:
      "Supported IT team in managing wired/wireless network infrastructure, resolving 200+ IT issues and configuring Cisco switches & Meraki APs. Achieved 95%+ customer satisfaction through prompt resolution and accurate database maintenance.",
    type: "work" as const,
  },
  {
    period: "Sep 2021 - Feb 2022",
    title: "Social Media Managing Internship",
    organization: "Maplewood Canadian International School, Abu Dhabi",
    description:
      "Managed and updated content/advertisements across all school platforms. Contributed to MCIS achieving the #1 school ranking in Mohammed Bin Zayed City.",
    type: "work" as const,
  },
  {
    period: "2024 - Present",
    title: "B.Sc. Chemistry",
    organization: "York University, North York, ON",
    description:
      "Currently pursuing a Bachelor of Science in Chemistry. Expected graduation December 2028.",
    type: "education" as const,
  },
  {
    period: "2023",
    title: "Alberta Accredited High School Diploma",
    organization: "Maplewood Canadian International School, Abu Dhabi",
    description:
      "Graduated from Maplewood Canadian International School in Abu Dhabi, UAE.",
    type: "education" as const,
  },
];

export const CERTIFICATIONS = [
  { name: "CompTIA Security+", issuer: "CompTIA", year: "2025", status: "Active" },
  { name: "Cisco CCNA", issuer: "Cisco", year: "2024", status: "Active" },
  { name: "OPSWAT ICIP", issuer: "OPSWAT", year: "2025", status: "Active" },
];

