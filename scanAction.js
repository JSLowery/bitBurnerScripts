/** @param {NS} ns **/
export async function scanList(ns, scan_item, is_refresh){
	var port_programs = []
	if (ns.fileExists("BruteSSH.exe")){
		port_programs.push("BruteSSH.exe");
	}
	if (ns.fileExists("FTPCrack.exe")){
		port_programs.push("FTPCrack.exe");
	}
	if (ns.fileExists("HTTPWorm.exe")){
		port_programs.push("HTTPWorm.exe");
	}
	if (ns.fileExists("SQLInject.exe")){
		port_programs.push("SQLInject.exe");
	}
	if (ns.fileExists("relaySMTP.exe")){
		port_programs.push("relaySMTP.exe");
	}
	var port_programs_number = port_programs.length;
	
	// var scan_list = scan(hostname);
	var i = 0;
	
	// ns.print("========================");

	var server = ns.getServer(scan_item);

	// ns.print({"Server" : server.hostname});
	// ns.print("Port programs count: ", port_programs_number);

	var has_root = server.hasAdminRights;

	var ports_needed = server.numOpenPortsRequired - server.openPortCount;
	var char_hack_level = ns.getHackingLevel();
	var req_hack_level = server.requiredHackingSkill;
	// ns.print("Ports needed: ", ports_needed);
	
	if(ports_needed <= port_programs_number && ports_needed > 0 && !has_root){

		// run some crackers
		// ns.print({"Running crackers": port_programs})

		if (port_programs.includes("FTPCrack.exe"))	
		ns.ftpcrack(server.hostname);

		if (port_programs.includes("BruteSSH.exe"))	
		ns.brutessh(server.hostname);
		
		if (port_programs.includes("SQLInject.exe"))	
		ns.sqlinject(server.hostname);

		if (port_programs.includes("HTTPWorm.exe"))	
		ns.httpworm(server.hostname);

		if (port_programs.includes("relaySMTP.exe"))	
		ns.relaysmtp(server.hostname);
		
		ns.nuke(server.hostname);
		// ns.print(server.hostname,  " now hackable");
		//get this from source file 4
		// installBackdoor(server.hostname);
	}

	if (ports_needed == 0 && !has_root){
		ns.nuke(server.hostname);
		// ns.print(server.hostname,  " now hackable");
		has_root = true;

	}

	if (ports_needed < port_programs_number && ports_needed > 0 
		|| server.hostname == "home" 
		|| !has_root
		|| char_hack_level < req_hack_level){

		// ns.print({"ports" : ports_needed < port_programs_number,
		// "home": server.hostname == "home",
		// "!root": !has_root});
		i++;
		// await ns.sleep(1);
		return;
	}

	// prune on full
	var security_level = server.hackDifficulty;
	var min_security_level = server.minDifficulty;
	var money = server.moneyAvailable;
	var money_max = server.moneyMax;
	// if(money / money_max > .99 && min_security_level / security_level > .99){
	// 	const script = ns.ps()
	// 	for (script of ps){
	// 		ns.tprint(`${script.filename} ${script.threads}`);
	// 		ns.tprint(script.args);
	// 		script.args[3];
			
	// 	}
	// }
	if(is_refresh == true){
		// ns.print({"Killing all applications on: ": server.hostname})
		ns.killall(server.hostname);
	}

	if(server.maxRam >= 4 && server.ramUsed / server.maxRam < .999 && server.maxRam - server.ramUsed >= 4){
		// ns.print("exec tut.script.script on : "  + server.hostname);
		await ns.writePort(1, server.hostname);
		await ns.write("hackable.lit", server.hostname+ "\n","a");
	}
	i++;
	// await ns.sleep(1);
}