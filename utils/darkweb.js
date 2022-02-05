/** @param {NS} ns **/
export async function main(ns) {
	// BruteSSH.exe - $500.000k - Opens up SSH Ports.
	// FTPCrack.exe - [OWNED] - Opens up FTP Ports.
	// relaySMTP.exe - [OWNED] - Opens up SMTP Ports.
	// HTTPWorm.exe - $30.000m - Opens up HTTP Ports.
	// SQLInject.exe - $250.000m - Opens up SQL Ports.
	// ServerProfiler.exe - $500.000k - Displays detailed information about a server.
	// DeepscanV1.exe - $500.000k - Enables 'scan-analyze' with a depth up to 5.
	// DeepscanV2.exe - $25.000m - Enables 'scan-analyze' with a depth up to 10.
	// AutoLink.exe - $1.000m - Enables direct connect via 'scan-analyze'.
	// Formulas.exe - $5.000b - Unlock access to the formulas API.
	var tor = ns.purchaseTor();
	var brute = ns.purchaseProgram("BruteSSH.exe");
	var ftp = ns.purchaseProgram("FTPCrack.exe");
	var smtp = ns.purchaseProgram("relaySMTP.exe");
	var http = ns.purchaseProgram("HTTPWorm.exe");
	var sql = ns.purchaseProgram("SQLInject.exe");
	// var prof = ns.purchaseProgram("ServerProfiler.exe");
	// var scan1 = ns.purchaseProgram("DeepscanV1.exe");
	var scan2 = ns.purchaseProgram("DeepscanV2.exe");
	var link = ns.purchaseProgram("AutoLink.exe");
	// var formula = ns.purchaseProgram("Formulas.exe");
	var str = sprintf("Tor Router: %s\nSSH: %s FTP: %s\nSMTP: %s HTTP: %s\nSQL: %s scan2: %s\nlink: %s",
	tor,
	brute,
	ftp,
	smtp,
	http,
	sql,
	scan2,
	link);
	ns.tprint(str);
}