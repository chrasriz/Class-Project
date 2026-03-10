export const SITE_CONFIG = {
  name: "Ras",
  title: "Ras | Cybersecurity Analyst & Network Engineer",
  description:
    "Portfolio of Ras — Cybersecurity Analyst, Network Engineer, and Technical Builder based in Toronto, Canada. Specializing in security infrastructure, network architecture, and systems engineering.",
  url: "https://ras.dev",
  location: "Toronto, Canada",
  role: "Cybersecurity Analyst | Network Engineer | Technical Builder",
  email: "contact@ras.dev",
  socials: {
    github: "https://github.com/ras",
    linkedin: "https://linkedin.com/in/ras",
  },
};

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
] as const;

export const SKILLS = [
  {
    category: "Cybersecurity",
    items: [
      { name: "Threat Analysis", level: 92 },
      { name: "Penetration Testing", level: 88 },
      { name: "SIEM / Log Analysis", level: 90 },
      { name: "Incident Response", level: 85 },
      { name: "Vulnerability Assessment", level: 91 },
      { name: "Security Auditing", level: 87 },
    ],
  },
  {
    category: "Networking",
    items: [
      { name: "TCP/IP & Routing", level: 94 },
      { name: "Firewall Configuration", level: 90 },
      { name: "VPN & Tunneling", level: 88 },
      { name: "Network Monitoring", level: 91 },
      { name: "DNS / DHCP", level: 93 },
      { name: "Wireless Security", level: 86 },
    ],
  },
  {
    category: "Infrastructure",
    items: [
      { name: "Linux Administration", level: 93 },
      { name: "Windows Server", level: 85 },
      { name: "Active Directory", level: 87 },
      { name: "Cloud Platforms (AWS)", level: 82 },
      { name: "Virtualization", level: 89 },
      { name: "Docker & Containers", level: 84 },
    ],
  },
  {
    category: "Development & Automation",
    items: [
      { name: "Python", level: 90 },
      { name: "Bash Scripting", level: 92 },
      { name: "PowerShell", level: 83 },
      { name: "Ansible / Terraform", level: 78 },
      { name: "Git & CI/CD", level: 86 },
      { name: "API Integration", level: 84 },
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
      "Zero trust is a philosophy, not a product — every architectural decision must reinforce the principle of least privilege.",
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
      "The best defense engineers are those who deeply understand offense — building attack labs accelerates defensive maturity.",
    image: "/projects/homelab.svg",
    color: "#10b981",
  },
];

export const EXPERIENCE = [
  {
    period: "2024 — Present",
    title: "Cybersecurity Analyst",
    organization: "Security Operations",
    description:
      "Monitor and analyze security events across enterprise infrastructure. Conduct threat hunting, incident triage, and vulnerability assessments. Develop automated detection rules and response playbooks.",
    type: "work" as const,
  },
  {
    period: "2023 — 2024",
    title: "Network Engineer",
    organization: "Infrastructure & Networking",
    description:
      "Designed and maintained enterprise network architectures including routing, switching, firewall policies, and VPN tunnels. Implemented network monitoring and performance optimization.",
    type: "work" as const,
  },
  {
    period: "2023",
    title: "CompTIA Security+",
    organization: "CompTIA",
    description:
      "Validated knowledge of security concepts, threats, vulnerabilities, cryptography, and identity management.",
    type: "certification" as const,
  },
  {
    period: "2022 — 2023",
    title: "IT Systems Administrator",
    organization: "Technical Operations",
    description:
      "Managed Windows and Linux server environments, Active Directory, group policy, and user provisioning. Maintained backup systems and disaster recovery procedures.",
    type: "work" as const,
  },
  {
    period: "2022",
    title: "CompTIA Network+",
    organization: "CompTIA",
    description:
      "Demonstrated proficiency in network infrastructure, operations, security, and troubleshooting.",
    type: "certification" as const,
  },
  {
    period: "2020 — 2024",
    title: "B.Sc. Computer Science",
    organization: "University of Toronto",
    description:
      "Specialized in systems security, network programming, and distributed computing. Capstone project focused on automated intrusion detection systems.",
    type: "education" as const,
  },
];

export const CERTIFICATIONS = [
  { name: "CompTIA Security+", issuer: "CompTIA", year: "2023", status: "Active" },
  { name: "CompTIA Network+", issuer: "CompTIA", year: "2022", status: "Active" },
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2023", status: "Active" },
  { name: "Cisco CCNA", issuer: "Cisco", year: "2023", status: "In Progress" },
  { name: "CEH (Certified Ethical Hacker)", issuer: "EC-Council", year: "2024", status: "In Progress" },
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
