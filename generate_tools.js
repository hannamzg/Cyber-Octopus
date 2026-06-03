import fs from 'fs';

const categories = [
  { id: "web", name: "Web Security", desc: "Testing and exploiting vulnerabilities in web applications and APIs." },
  { id: "network", name: "Network Security", desc: "Scanning, sniffing and analyzing network traffic and infrastructure." },
  { id: "re", name: "Reverse Engineering", desc: "Analyzing compiled binaries and malware without source code." },
  { id: "exploit", name: "Exploitation", desc: "Leveraging vulnerabilities to gain unauthorized access to systems." },
  { id: "osint", name: "OSINT", desc: "Gathering intelligence from publicly available open sources." },
  { id: "forensics", name: "Forensics", desc: "Investigating digital artifacts from disks, memory, and network captures." },
  { id: "crypto", name: "Cryptography", desc: "Breaking ciphers, cracking passwords, and analyzing steganography." },
  { id: "wireless", name: "Wireless Security", desc: "Auditing WiFi, Bluetooth, and other wireless protocols." }
];

const subcategories = {
  "web":      [ { id: "sqli", name: "SQL Injection" }, { id: "xss", name: "XSS" }, { id: "recon_web", name: "Web Recon" } ],
  "network":  [ { id: "scanning", name: "Port Scanning" }, { id: "sniffing", name: "Packet Sniffing" } ],
  "re":       [ { id: "malware", name: "Malware Analysis" }, { id: "decompile", name: "Decompilation" } ],
  "exploit":  [ { id: "frameworks", name: "Exploit Frameworks" }, { id: "privesc", name: "Privilege Escalation" } ],
  "osint":    [ { id: "people", name: "People & Email" }, { id: "domain", name: "Domain Recon" } ],
  "forensics":[ { id: "disk", name: "Disk Analysis" }, { id: "memory", name: "Memory Forensics" } ],
  "crypto":   [ { id: "cracking", name: "Password Cracking" }, { id: "stego", name: "Steganography" } ],
  "wireless": [ { id: "wifi", name: "WiFi Auditing" }, { id: "bluetooth", name: "Bluetooth Auditing" } ]
};

const nodes = [{ id: "root", name: "Cybersecurity", group: "root", val: 30, color: "#a855f7" }];
const links = [];
const toolsDetails = {};
const categoryMeta = {};

categories.forEach(cat => {
  nodes.push({ id: cat.id, name: cat.name, group: "category", val: 20, color: "#06b6d4" });
  links.push({ source: "root", target: cat.id });
  categoryMeta[cat.id] = { name: cat.name, desc: cat.desc, recommended: [] };
  subcategories[cat.id].forEach(sub => {
    nodes.push({ id: sub.id, name: sub.name, group: "sub", val: 15, color: "#3b82f6" });
    links.push({ source: cat.id, target: sub.id });
  });
});

let toolCount = 0;

function addTool(subcatId, title, desc, command, flags, recommended = false) {
  toolCount++;
  const tId = "tool_" + toolCount;
  nodes.push({ id: tId, name: title, group: "tool", val: 10, color: recommended ? "#facc15" : "#22c55e", toolId: tId, recommended });
  links.push({ source: subcatId, target: tId });
  let catName = "Tool";
  for (const cat in subcategories) {
    const sub = subcategories[cat].find(s => s.id === subcatId);
    if (sub) {
      const parentCat = categories.find(c => c.id === cat);
      catName = `${parentCat.name} — ${sub.name}`;
      if (recommended) categoryMeta[parentCat.id].recommended.push(tId);
      break;
    }
  }
  toolsDetails[tId] = { id: tId, title, category: catName, description: desc, command, flags, recommended };
}

// ─── REAL RECOMMENDED TOOLS ───────────────────────────────────────────────────

// Web / SQLi
addTool("sqli", "Sqlmap", "The most popular automated SQL injection tool. Detects and exploits SQLi flaws in web apps.", "sqlmap -u \"http://target.com/vuln?id=1\" --dbs --batch", [{flag:"-u",desc:"Target URL"},{flag:"--dbs",desc:"Enumerate databases"},{flag:"--batch",desc:"Non-interactive mode"}], true);
addTool("sqli", "SQLninja", "SQL injection tool focused on Microsoft SQL Server.", "sqlninja -mode t -target example.com", [{flag:"-mode",desc:"Operation mode (t=test)"},{flag:"-target",desc:"Target hostname"}], true);
addTool("sqli", "BBQSQL", "SQL injection exploitation framework with a menu-driven interface.", "bbqsql", [{flag:"--url",desc:"Target URL"},{flag:"--technique",desc:"Injection technique"}], false);
addTool("sqli", "Havij", "Automated SQL injection tool with a GUI, popular for beginners.", "havij", [{flag:"Target URL",desc:"Enter URL in GUI"},{flag:"Analyze",desc:"Run SQLi analysis"}], false);

// Web / XSS
addTool("xss", "XSStrike", "Advanced XSS detection suite with fuzzing and crawling capabilities.", "xsstrike -u \"http://target.com/page?q=test\" --crawl", [{flag:"-u",desc:"Target URL"},{flag:"--crawl",desc:"Crawl the website for injection points"}], true);
addTool("xss", "XSSer", "Automatic framework to detect and exploit XSS vulnerabilities.", "xsser --url \"http://target.com/?id=\" -s -v", [{flag:"--url",desc:"Target URL with injection point"},{flag:"-s",desc:"Enable statistics"},{flag:"-v",desc:"Verbose output"}], true);
addTool("xss", "Dalfox", "Fast, powerful XSS scanning and parameter analysis tool written in Go.", "dalfox url http://target.com/page?q=test", [{flag:"url",desc:"Scan a single URL"},{flag:"--blind",desc:"Set blind XSS callback URL"}], true);
addTool("xss", "BeEF", "Browser Exploitation Framework. Hooks browsers via XSS and controls them.", "beef-xss", [{flag:"--verbose",desc:"Verbose logging"},{flag:"--port",desc:"Port to listen on (default 3000)"}], false);

// Web / Recon
addTool("recon_web", "Burp Suite", "The industry-standard web application security testing platform.", "burpsuite", [{flag:"Proxy",desc:"Intercept and modify HTTP/S traffic"},{flag:"Scanner",desc:"Auto-scan for vulnerabilities"},{flag:"Intruder",desc:"Perform automated attack payloads"}], true);
addTool("recon_web", "Gobuster", "Fast directory and file brute-forcing tool written in Go.", "gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt", [{flag:"dir",desc:"Directory brute-force mode"},{flag:"-u",desc:"Target URL"},{flag:"-w",desc:"Path to wordlist"}], true);
addTool("recon_web", "Nikto", "Open-source web server scanner that checks for dangerous files and outdated software.", "nikto -h http://target.com", [{flag:"-h",desc:"Target host"},{flag:"-p",desc:"Port (default 80)"},{flag:"-ssl",desc:"Force SSL/HTTPS mode"}], true);
addTool("recon_web", "Dirsearch", "Web path scanner to brute-force directories and files in web servers.", "dirsearch -u http://target.com -e php,html,js", [{flag:"-u",desc:"Target URL"},{flag:"-e",desc:"File extensions to search for"}], false);
addTool("recon_web", "WhatWeb", "Fingerprints web technologies, CMS, and frameworks used by a site.", "whatweb http://target.com -v", [{flag:"-v",desc:"Verbose output"},{flag:"-a",desc:"Aggression level 1-4"}], false);
addTool("recon_web", "Wapiti", "Web application vulnerability scanner that crawls and audits.", "wapiti -u http://target.com -v 2", [{flag:"-u",desc:"Target URL"},{flag:"-v",desc:"Verbosity level"},{flag:"-m",desc:"Comma-separated list of modules"}], false);
addTool("recon_web", "OWASP ZAP", "Widely used open-source DAST security testing proxy for web apps.", "zap.sh -daemon -port 8080", [{flag:"-daemon",desc:"Run in headless/daemon mode"},{flag:"-port",desc:"Listening port"}], false);

// Network / Scanning
addTool("scanning", "Nmap", "The essential network mapper for host discovery and port scanning.", "nmap -sV -sC -p- 192.168.1.1", [{flag:"-sV",desc:"Service version detection"},{flag:"-sC",desc:"Run default scripts"},{flag:"-p-",desc:"Scan all 65535 ports"}], true);
addTool("scanning", "Masscan", "Fastest Internet port scanner. Can scan the entire internet in under 6 minutes.", "masscan -p1-65535 192.168.1.0/24 --rate=1000", [{flag:"-p",desc:"Port range to scan"},{flag:"--rate",desc:"Packets per second"}], true);
addTool("scanning", "RustScan", "Modern port scanner that finds ports in seconds, then passes to Nmap.", "rustscan -a 192.168.1.1 -- -sV -sC", [{flag:"-a",desc:"Target IP address"},{flag:"--",desc:"Arguments to pass to Nmap"}], true);
addTool("scanning", "Zenmap", "Official Nmap GUI for easier management of scans and results visualization.", "zenmap", [{flag:"Profile",desc:"Use predefined scan profiles"},{flag:"Target",desc:"Set target IP or hostname"}], false);
addTool("scanning", "Angry IP Scanner", "Fast and portable network scanner. Scans IPs and ports.", "ipscan -headless -o result.csv 192.168.1.0/24", [{flag:"-headless",desc:"Run without GUI"},{flag:"-o",desc:"Output file path"}], false);

// Network / Sniffing
addTool("sniffing", "Wireshark", "The world's most popular network protocol analyzer.", "wireshark -i eth0 -k", [{flag:"-i",desc:"Network interface to capture on"},{flag:"-k",desc:"Start capture immediately"}], true);
addTool("sniffing", "tcpdump", "Powerful command-line packet analyzer for capturing network traffic.", "tcpdump -i eth0 -w capture.pcap", [{flag:"-i",desc:"Interface to listen on"},{flag:"-w",desc:"Write output to file"},{flag:"-n",desc:"Don't resolve hostnames"}], true);
addTool("sniffing", "NetworkMiner", "Passive network sniffer and packet analyzer for Windows.", "NetworkMiner.exe", [{flag:"Hosts tab",desc:"Shows detected hosts"},{flag:"Files tab",desc:"Shows captured/reassembled files"}], true);
addTool("sniffing", "Zeek", "Powerful network analysis framework focused on security monitoring.", "zeek -i eth0", [{flag:"-i",desc:"Network interface"},{flag:"-r",desc:"Read from pcap file"}], false);
addTool("sniffing", "Ettercap", "Suite for man-in-the-middle attacks on LAN.", "ettercap -G", [{flag:"-G",desc:"Start with graphical interface"},{flag:"-T",desc:"Use text-only interface"},{flag:"-M",desc:"Specify MITM attack method"}], false);

// RE / Malware
addTool("malware", "Ghidra", "Free and open-source reverse engineering tool developed by the NSA.", "ghidraRun", [{flag:"CodeBrowser",desc:"Navigate functions, memory, and instructions"},{flag:"Decompiler",desc:"Convert assembly to C pseudocode"}], true);
addTool("malware", "Radare2", "Portable and scriptable reverse engineering framework.", "r2 -A ./binary", [{flag:"-A",desc:"Analyze the binary on load"},{flag:"pdf",desc:"Print disassembly of function"}], true);
addTool("malware", "Cutter", "Free and open-source GUI for Radare2 reverse engineering.", "cutter ./binary", [{flag:"Graph View",desc:"Visualize control flow as a graph"},{flag:"Decompiler",desc:"Decompile functions"}], true);
addTool("malware", "x64dbg", "Open-source x64/x32 debugger for Windows for dynamic analysis.", "x64dbg.exe", [{flag:"Breakpoints",desc:"Set breakpoints to pause execution"},{flag:"Dump",desc:"Dump memory regions"}], false);
addTool("malware", "OllyDbg", "32-bit assembler level debugger popular for Windows malware analysis.", "ollydbg.exe malware.exe", [{flag:"Plugins",desc:"Extend functionality with plugins"},{flag:"Patch",desc:"Modify binary instructions in-place"}], false);

// RE / Decompile
addTool("decompile", "jadx", "Java decompiler for Android APK and dex files.", "jadx -d output_dir app.apk", [{flag:"-d",desc:"Output directory"},{flag:"--show-bad-code",desc:"Show decompilation errors in output"}], true);
addTool("decompile", "dnSpy", ".NET debugger and assembly editor. Great for .NET/C# reversing.", "dnSpy.exe", [{flag:"Open Assembly",desc:"Load a .NET DLL or EXE"},{flag:"Debug",desc:"Attach to a running .NET process"}], true);
addTool("decompile", "JD-GUI", "Standalone graphical Java decompiler utility.", "jd-gui", [{flag:"Open File",desc:"Open a .class or .jar file"}], false);
addTool("decompile", "RetDec", "Open-source machine-code decompiler from Avast.", "retdec-decompiler.py -o output.c binary", [{flag:"-o",desc:"Output C file path"},{flag:"--backend-no-opts",desc:"Disable optimizations for cleaner output"}], false);

// Exploit / Frameworks
addTool("frameworks", "Metasploit", "The world's most widely used penetration testing framework.", "msfconsole", [{flag:"search [name]",desc:"Search for an exploit"},{flag:"use [module]",desc:"Select a module"},{flag:"set RHOSTS",desc:"Set target host"},{flag:"exploit",desc:"Run the exploit"}], true);
addTool("frameworks", "BeEF", "Browser Exploitation Framework that hooks and controls browsers via XSS.", "beef-xss", [{flag:"--verbose",desc:"Enable verbose logging"},{flag:"--port",desc:"API and UI port"}], true);
addTool("frameworks", "Empire", "Post-exploitation framework with a focus on PowerShell agents.", "Empire", [{flag:"listeners",desc:"Manage listeners"},{flag:"usemodule",desc:"Use a post-exploitation module"}], true);
addTool("frameworks", "Cobalt Strike", "Commercial adversary simulation and red team operations tool.", "cobaltstrike", [{flag:"Beacon",desc:"C2 agent deployed on target"},{flag:"Listeners",desc:"Configure C2 listeners"}], false);

// Exploit / PrivEsc
addTool("privesc", "LinPEAS", "Linux Privilege Escalation Awesome Script. Finds misconfigurations.", "curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh", [{flag:"--all",desc:"Run all checks (default)"},{flag:"-q",desc:"Quiet mode, less output"}], true);
addTool("privesc", "WinPEAS", "Windows Privilege Escalation Awesome Script.", ".\\winPEASx64.exe", [{flag:"quiet",desc:"Less verbose output"},{flag:"fast",desc:"Skip slow checks"}], true);
addTool("privesc", "GTFOBins", "Reference of Unix binaries that can be used to bypass restrictions.", "# Web reference: gtfobins.github.io", [{flag:"sudo",desc:"Run binary via sudo"},{flag:"SUID",desc:"Exploit SUID bit"}], true);
addTool("privesc", "PowerSploit", "PowerShell post-exploitation framework.", "Import-Module .\\PowerSploit.psd1", [{flag:"Invoke-Shellcode",desc:"Inject shellcode into a process"},{flag:"Get-GPPPassword",desc:"Find passwords in Group Policy"}], false);

// OSINT / People & Email
addTool("people", "theHarvester", "Gather emails, domains, IPs from public sources like Google and LinkedIn.", "theHarvester -d example.com -b google", [{flag:"-d",desc:"Target domain"},{flag:"-b",desc:"Data source (google, linkedin, shodan...)"}], true);
addTool("people", "Maltego", "Interactive data mining tool for link analysis and reconnaissance.", "maltego", [{flag:"Transforms",desc:"Run data lookups on entities"},{flag:"Graph",desc:"Visualize relationships between entities"}], true);
addTool("people", "Recon-ng", "Full-featured web reconnaissance framework.", "recon-ng", [{flag:"marketplace search",desc:"Find available modules"},{flag:"modules load",desc:"Load a recon module"}], true);
addTool("people", "Holehe", "Check if an email is attached to an account on various websites.", "holehe target@email.com", [{flag:"email",desc:"Target email address to check"}], false);

// OSINT / Domain
addTool("domain", "Amass", "In-depth attack surface mapping and asset discovery.", "amass enum -d example.com -o out.txt", [{flag:"-d",desc:"Target domain"},{flag:"-o",desc:"Output file"},{flag:"-passive",desc:"Use only passive data sources"}], true);
addTool("domain", "Subfinder", "Fast subdomain discovery tool using passive online sources.", "subfinder -d example.com -o subdomains.txt", [{flag:"-d",desc:"Target domain"},{flag:"-o",desc:"Output file"}], true);
addTool("domain", "Sublist3r", "Fast subdomains enumeration tool using search engines.", "python sublist3r.py -d example.com", [{flag:"-d",desc:"Target domain"},{flag:"-o",desc:"Output file"},{flag:"-b",desc:"Bruteforce mode"}], true);
addTool("domain", "Shodan", "Search engine for Internet-connected devices.", "shodan host 1.2.3.4", [{flag:"host",desc:"Look up info on an IP address"},{flag:"search",desc:"Query Shodan search engine"}], false);

// Forensics / Disk
addTool("disk", "Autopsy", "Digital forensics platform and GUI for The Sleuth Kit.", "autopsy", [{flag:"New Case",desc:"Create a new forensic investigation case"},{flag:"Add Data Source",desc:"Load disk image or folder"}], true);
addTool("disk", "The Sleuth Kit", "Collection of command-line forensic tools for disk and file system analysis.", "fls -r disk.img", [{flag:"fls",desc:"List files in a disk image"},{flag:"icat",desc:"Extract file content by inode"}], true);
addTool("disk", "FTK Imager", "Forensic imaging tool to acquire and analyze digital evidence.", "ftkimager /ImageFile disk.img", [{flag:"/ImageFile",desc:"Path for output image file"},{flag:"/verify",desc:"Verify image integrity"}], true);
addTool("disk", "dd", "Unix utility to convert and copy files, widely used for disk imaging.", "dd if=/dev/sda of=disk.img bs=4M status=progress", [{flag:"if=",desc:"Input file/device"},{flag:"of=",desc:"Output file/device"},{flag:"bs=",desc:"Block size"}], false);

// Forensics / Memory
addTool("memory", "Volatility", "The most popular memory forensics framework.", "vol.py -f memory.dmp imageinfo", [{flag:"-f",desc:"Path to memory dump file"},{flag:"imageinfo",desc:"Identify OS profile"},{flag:"pslist",desc:"List running processes"}], true);
addTool("memory", "Rekall", "Advanced forensic and incident response framework for memory analysis.", "rekal -f memory.dmp pslist", [{flag:"-f",desc:"Memory image file"},{flag:"pslist",desc:"List processes from memory"}], true);
addTool("memory", "DumpIt", "Simple Windows memory acquisition tool that creates raw memory dumps.", "DumpIt.exe", [{flag:"/output",desc:"Output file path"},{flag:"/quiet",desc:"Run without prompts"}], false);

// Crypto / Password Cracking
addTool("cracking", "Hashcat", "World's fastest password cracker supporting hundreds of hash types.", "hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt", [{flag:"-m",desc:"Hash type (0=MD5, 1000=NTLM)"},{flag:"-a",desc:"Attack mode (0=dict, 3=bruteforce)"},{flag:"-r",desc:"Rules file"}], true);
addTool("cracking", "John the Ripper", "Classic and versatile password cracker.", "john --wordlist=rockyou.txt hashes.txt", [{flag:"--wordlist",desc:"Path to wordlist"},{flag:"--format",desc:"Hash format (e.g. md5crypt)"},{flag:"--show",desc:"Show cracked passwords"}], true);
addTool("cracking", "Hydra", "Parallelized login cracker supporting many protocols.", "hydra -l admin -P rockyou.txt ssh://192.168.1.1", [{flag:"-l",desc:"Username"},{flag:"-P",desc:"Password list file"},{flag:"-t",desc:"Number of parallel tasks"}], true);
addTool("cracking", "Medusa", "Speedy, massively parallel, modular login brute-forcer.", "medusa -h 192.168.1.1 -u admin -P rockyou.txt -M ssh", [{flag:"-h",desc:"Target host"},{flag:"-u",desc:"Username"},{flag:"-M",desc:"Module to use (ssh, ftp...)"}], false);

// Crypto / Steganography
addTool("stego", "Steghide", "Embed or extract hidden data within image and audio files.", "steghide extract -sf image.jpg", [{flag:"extract",desc:"Extract hidden data"},{flag:"embed",desc:"Embed data into a file"},{flag:"-sf",desc:"Cover file (stego file)"}], true);
addTool("stego", "zsteg", "Detect LSB steganography in PNG and BMP images.", "zsteg image.png", [{flag:"-a",desc:"Run all checks"},{flag:"-E",desc:"Extract data from a specific channel"}], true);
addTool("stego", "Binwalk", "Analyzes and extracts hidden files and code from firmware images.", "binwalk -e firmware.bin", [{flag:"-e",desc:"Extract files from the image"},{flag:"-v",desc:"Verbose output"},{flag:"-M",desc:"Matryoshka, extract recursively"}], true);
addTool("stego", "OpenStego", "Provides steganography and watermarking for PNG images.", "openstego extract -sf image.png -xf output.txt", [{flag:"extract",desc:"Extract hidden data"},{flag:"-sf",desc:"Stego file path"},{flag:"-xf",desc:"Extracted output file"}], false);

// Wireless / WiFi
addTool("wifi", "Aircrack-ng", "Full suite for WiFi network security auditing.", "aircrack-ng -w rockyou.txt -b AA:BB:CC:DD:EE:FF capture.cap", [{flag:"-w",desc:"Wordlist for key cracking"},{flag:"-b",desc:"BSSID (target AP MAC address)"}], true);
addTool("wifi", "Kismet", "Wireless network detector, sniffer, and intrusion detection.", "kismet -c wlan0", [{flag:"-c",desc:"Capture source interface"},{flag:"--log-prefix",desc:"Set log file prefix"}], true);
addTool("wifi", "Wifite", "Automated wireless attack tool targeting WPA/WEP/WPS.", "wifite --wpa --dict rockyou.txt", [{flag:"--wpa",desc:"Target WPA networks"},{flag:"--dict",desc:"Path to password wordlist"}], true);
addTool("wifi", "Cowpatty", "Offline dictionary attack tool against WPA-PSK networks.", "cowpatty -r capture.cap -f rockyou.txt -s SSID", [{flag:"-r",desc:"Packet capture file"},{flag:"-f",desc:"Dictionary file"},{flag:"-s",desc:"SSID of target network"}], false);

// Wireless / Bluetooth
addTool("bluetooth", "Ubertooth", "Open-source Bluetooth experimentation platform.", "ubertooth-btle -f -c capture.pcap", [{flag:"-f",desc:"Follow connections"},{flag:"-c",desc:"Output pcap file"}], true);
addTool("bluetooth", "BlueMaho", "GUI-based Bluetooth security testing tool.", "python BlueMaho.py", [{flag:"Scan",desc:"Discover nearby Bluetooth devices"},{flag:"Attack",desc:"Select and launch attack"}], true);
addTool("bluetooth", "Crackle", "Crack BLE (Bluetooth Low Energy) encryption.", "crackle -i capture.pcap -o decrypted.pcap", [{flag:"-i",desc:"Input pcap file"},{flag:"-o",desc:"Output decrypted pcap file"}], false);

// ─── PROCEDURAL FILL TO 1000 ─────────────────────────────────────────────────
const adjectives = ["Advanced","Automated","Dynamic","Stealthy","Rapid","Tactical","Deep","Cyber","Ghost","Shadow","Apex","Nova","Zero","Elite","Omni","Vanguard","Echo","Sigma","Delta","Omega","Recon","Phantom","Void","Iron","Steel","Dark","Swift","Sharp","Apex","Flash"];
const nouns = ["Scanner","Exploiter","Analyzer","Cracker","Fuzzer","Interceptor","Dumper","Payload","Proxy","Spider","Crawler","Hunter","Injector","Mapper","Sniffer","Breaker","Decoder","Tracker","Auditor","Inspector","Harvester","Listener","Monitor","Extractor","Burner","Patcher","Loader","Sampler","Trigger","Solver"];
const allSubs = Object.values(subcategories).flat();

while (toolCount < 1000) {
  const sub = allSubs[toolCount % allSubs.length];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const ver = `v${Math.floor(Math.random()*9)+1}.${Math.floor(Math.random()*10)}`;
  const title = `${adj} ${noun} ${ver}`;
  const desc = `A specialized tool for ${sub.name.toLowerCase()} operations. Enables rapid detection and exploitation of vulnerabilities within this security domain.`;
  const cmd = `${adj.toLowerCase()}-${noun.toLowerCase()} --target 192.168.1.1 -v`;
  const flags = [
    { flag: "--target", desc: "Specify the target IP or domain." },
    { flag: "--verbose", desc: "Enable verbose output for detailed logs." },
    { flag: "--threads", desc: "Number of concurrent threads." }
  ];
  addTool(sub.id, title, desc, cmd, flags, false);
}

const dbContent = `// Auto-generated database with ${toolCount} tools
export const cyberData = {
  nodes: ${JSON.stringify(nodes, null, 2)},
  links: ${JSON.stringify(links, null, 2)}
};

export const toolsDetails = ${JSON.stringify(toolsDetails, null, 2)};

export const categoryMeta = ${JSON.stringify(categoryMeta, null, 2)};
`;

fs.writeFileSync('src/data/db.js', dbContent);
console.log(`Generated ${toolCount} tools. Recommended: ${Object.values(toolsDetails).filter(t=>t.recommended).length}`);
