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
    linkedin: "https://linkedin.com/in/chrasriz",
  },
};

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
  { label: "Resume", href: "/resume" },
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

export const PROJECTS = [
  {
    id: "sentinel-siem",
    title: "Sentinel SIEM Platform",
    subtitle: "Security Information & Event Management",
    description:
      "Designed and deployed a custom SIEM solution integrating real-time log aggregation, threat correlation, and automated alerting across a multi-node network environment.",
    problem:
      "Legacy monitoring tools lacked centralized visibility across distributed network segments, creating blind spots in threat detection.",
    architecture:
      "Elastic Stack (Elasticsearch, Logstash, Kibana) with custom Python-based correlation engine, deployed on hardened Linux servers with role-based access.",
    tools: ["Elasticsearch", "Logstash", "Kibana", "Python", "Linux", "Docker"],
    results: [
      "Reduced mean detection time by 73%",
      "Consolidated 12 log sources into unified dashboard",
      "Automated 40+ alert rules for critical events",
    ],
    lessons:
      "Building effective detection requires deep understanding of normal baseline behavior before defining anomalies.",
    image: "/projects/sentinel.svg",
    color: "#06b6d4",
  },
  {
    id: "zero-trust-network",
    title: "Zero Trust Network Architecture",
    subtitle: "Enterprise Network Segmentation",
    description:
      "Implemented a zero-trust network model for a simulated enterprise environment with micro-segmentation, identity-based access, and continuous verification.",
    problem:
      "Flat network topologies enable lateral movement after initial compromise, putting critical assets at risk.",
    architecture:
      "pfSense firewalls with VLAN segmentation, RADIUS authentication, certificate-based device trust, and continuous posture assessment.",
    tools: ["pfSense", "RADIUS", "VLANs", "802.1X", "Wireshark", "Ansible"],
    results: [
      "Eliminated lateral movement paths between segments",
      "Enforced per-device authentication across all zones",
      "Created automated compliance verification scripts",
    ],
    lessons:
      "Zero trust is a philosophy, not a product. Every architectural decision must reinforce the principle of least privilege.",
    image: "/projects/zerotrust.svg",
    color: "#8b5cf6",
  },
  {
    id: "threat-hunter",
    title: "Threat Hunter Automation",
    subtitle: "Proactive Threat Detection Engine",
    description:
      "Built an automated threat hunting framework that runs scheduled queries against endpoint telemetry and network flow data to surface indicators of compromise.",
    problem:
      "Reactive alert-based security misses sophisticated adversaries who operate below detection thresholds.",
    architecture:
      "Python orchestration layer with YARA rules, Sigma detections, and MITRE ATT&CK mapping. Results feed into a custom dashboard.",
    tools: ["Python", "YARA", "Sigma", "MITRE ATT&CK", "SQLite", "Grafana"],
    results: [
      "Identified 3 previously undetected persistence mechanisms",
      "Automated 25 hunting hypotheses into scheduled jobs",
      "Mapped findings to ATT&CK techniques for reporting",
    ],
    lessons:
      "Effective hunting requires structured hypotheses grounded in adversary tradecraft, not random searches.",
    image: "/projects/threathunter.svg",
    color: "#f59e0b",
  },
  {
    id: "secure-homelab",
    title: "Secure Infrastructure Lab",
    subtitle: "Virtualized Security Testing Environment",
    description:
      "Engineered a comprehensive homelab environment for security testing, featuring segmented networks, vulnerable targets, and monitoring infrastructure.",
    problem:
      "Hands-on security skills require a safe, controlled environment that mirrors real-world enterprise architectures.",
    architecture:
      "Proxmox hypervisor hosting segmented VLANs with pfSense routing, Active Directory domain, Kali attack box, and centralized logging.",
    tools: ["Proxmox", "pfSense", "Active Directory", "Kali Linux", "Splunk", "Docker"],
    results: [
      "Simulated 5 enterprise attack scenarios end-to-end",
      "Built reproducible infrastructure-as-code templates",
      "Trained detection engineering against live attacks",
    ],
    lessons:
      "The best defense engineers are those who deeply understand offense. Building attack labs accelerates defensive maturity.",
    image: "/projects/homelab.svg",
    color: "#10b981",
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

export const LAB_NODES = [
  { id: "firewall", label: "Firewall", x: 50, y: 20, type: "security" as const },
  { id: "ids", label: "IDS/IPS", x: 30, y: 40, type: "security" as const },
  { id: "siem", label: "SIEM", x: 70, y: 40, type: "monitoring" as const },
  { id: "server1", label: "Web Server", x: 20, y: 65, type: "server" as const },
  { id: "server2", label: "DB Server", x: 50, y: 65, type: "server" as const },
  { id: "server3", label: "App Server", x: 80, y: 65, type: "server" as const },
  { id: "endpoint", label: "Endpoints", x: 50, y: 85, type: "endpoint" as const },
];

export const LAB_CONNECTIONS = [
  { from: "firewall", to: "ids" },
  { from: "firewall", to: "siem" },
  { from: "ids", to: "server1" },
  { from: "ids", to: "server2" },
  { from: "siem", to: "server2" },
  { from: "siem", to: "server3" },
  { from: "server1", to: "endpoint" },
  { from: "server2", to: "endpoint" },
  { from: "server3", to: "endpoint" },
];
