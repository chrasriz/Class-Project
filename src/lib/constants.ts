export const SITE_CONFIG = {
  name: "Rasikh",
  title: "Rasikh Rizwan | Cybersecurity Analyst",
  description:
    "Portfolio of Chaudhry Rasikh Rizwan, Cybersecurity Analyst and IT Professional based in Toronto, Canada. Specializing in SOC operations, network security, and access hardening.",
  url: "https://chrasriz.com",
  location: "Toronto, Canada",
  role: "Cybersecurity Analyst | IT Professional",
  email: "connect@chrasriz.com",
  phone: "+1(647)594-0449",
  personalEmail: "Rizwan.rasikh@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/ch-rasikh-rizwan/",
  },
};

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export const SKILLS = [
  {
    category: "Security Operations",
    items: [
      { name: "Malware Analysis", level: 88 },
      { name: "Threat Intelligence & Hunting", level: 85 },
      { name: "Incident Response", level: 87 },
      { name: "SIEM (Splunk, QRadar, Sentinel)", level: 90 },
      { name: "MITRE ATT&CK / OSINT", level: 86 },
      { name: "Digital Forensics", level: 82 },
    ],
  },
  {
    category: "Network Security",
    items: [
      { name: "VLAN Segmentation & ACLs", level: 92 },
      { name: "Firewalls & VPNs", level: 90 },
      { name: "Secure Protocols (HTTPS, SSH, IPSec)", level: 91 },
      { name: "OSPF / EIGRP / NAT / DHCP", level: 88 },
      { name: "IDS/IPS", level: 89 },
      { name: "Wireless Security", level: 85 },
    ],
  },
  {
    category: "Access & Compliance",
    items: [
      { name: "IAM & MFA (Duo)", level: 92 },
      { name: "Zero Trust Architecture", level: 85 },
      { name: "Privileged Access Management", level: 83 },
      { name: "ISO 27001 / NIST CSF", level: 84 },
      { name: "GDPR / HIPAA / PCI-DSS", level: 82 },
      { name: "Risk Assessment", level: 86 },
    ],
  },
  {
    category: "Infrastructure & Tools",
    items: [
      { name: "Linux Administration", level: 88 },
      { name: "Endpoint Detection & Response", level: 85 },
      { name: "Nessus / OpenVAS / Nmap", level: 87 },
      { name: "Penetration Testing", level: 84 },
      { name: "Patch Management & Hardening", level: 86 },
      { name: "Cryptography & PKI", level: 83 },
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

