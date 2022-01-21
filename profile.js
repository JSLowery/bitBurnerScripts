/** @param {NS} ns **/
export async function main(ns) {

	ns.disableLog("scan");
	var list_servers = ns.scan();
	var i = 0;
	var profile = {};
	profile["max_server"] = {
		"hostname": "n00dles"
		};
	
	var max_ratio = 0;
	var hack_threads = 0;
	while( i < list_servers.length ){
		var w_server = list_servers[i];
		if(w_server.includes("pserv-") || w_server.includes("home") || w_server.includes("darkweb")){
			i++;
			continue;
		}
		ns.print("===============================");
		ns.print("i ", i, " w_server: ", w_server);
		if(typeof w_server == "undefined"){
			i++;
			continue;
		};
		var tmp_list = ns.scan(w_server);
		var required_hacking = ns.getServerRequiredHackingLevel(w_server);
		var character_hacking = ns.getPlayer().hacking;
		var min_security_level = ns.getServerMinSecurityLevel(w_server);
		var max_money = ns.getServerMaxMoney(w_server);
		var grow_rate = ns.getServerGrowth(w_server);
		var growth_amount = max_money / 2;
		if (max_money < growth_amount){
			growth_amount = 200000;
		}
	
		var hack_time = ns.getHackTime(w_server);
	
		hack_threads = Math.max(1, Math.floor(ns.hackAnalyzeThreads(w_server, growth_amount)));

		var ratio = (max_money * max_money * (grow_rate / hack_time) / min_security_level + 1) * hack_threads / 1000000;
	
		ns.print("ratio: ", ratio);
		profile[w_server] = {"min_security_level": min_security_level,
							"max_money": max_money,
							"ratio": ratio};
		if(ratio > max_ratio && character_hacking >= required_hacking && ns.hasRootAccess(w_server)){
			max_ratio = ratio;
			profile["max_server"] = {
				"hostname": w_server
				};
			
			// how many hacks would it take to make  100000
			// hackAnalyzeThreads takes w_server and dollar ammount
			var hack_ana_security = ns.hackAnalyzeSecurity(hack_threads);
			
			// Grow
			// ====================================================================================================
			var multipliers = ns.getHackingMultipliers();
			var grow_amt = (multipliers.money * growth_amount) / max_money;
			//the 1+ is because growth is a percent, need 1.percent not 0.percent
			var grow_threads = ns.growthAnalyze(w_server, 1  + multipliers.money) ;
			var grow_ana_security = ns.growthAnalyzeSecurity(grow_threads);
			
			var total_security_gain = hack_ana_security * 10 + grow_ana_security * 10;
			var weaken_threads = 1;
	
			// Weaken
			// ====================================================================================================

			var weaken_ana = ns.weakenAnalyze(weaken_threads, 1);
				ns.print("    Weaken thread generator:");
			while(weaken_ana < total_security_gain){
				ns.print("        weaken security depletion: " + weaken_ana);
				weaken_threads++;
				weaken_ana = ns.weakenAnalyze(weaken_threads, 1);
			}

			var weaken_threads_min = 1;
			var weaken_ana_min = ns.weakenAnalyze(weaken_threads_min, 1);
			while(weaken_ana_min < ns.getServerSecurityLevel(w_server) - ns.getServerMinSecurityLevel(w_server)){
				weaken_threads_min++;
				weaken_ana_min = ns.weakenAnalyze(weaken_threads_min, 1);
			}
			weaken_threads += weaken_threads_min;

			var p_hack_security = "hack security: " + hack_ana_security;
			ns.print(p_hack_security);
			await ns.write(w_server + ".profile", p_hack_security + "\n\r", "w");	
	
			var p_grow_security = "grow security: " + grow_ana_security;
			ns.print(p_grow_security);
			await ns.write(w_server + ".profile", p_grow_security + "\n\r", "a");	
	
			var p_weaken_threads = "weaken threads: " + weaken_threads;
			ns.print(p_weaken_threads);
			await ns.write(w_server + ".profile", p_weaken_threads + "\n\r", "a");	
	
			var p_grow_threads = "grow threads: " + grow_threads;
			ns.print(p_grow_threads);
			await ns.write(w_server + ".profile", p_grow_threads + "\n\r", "a");	
	
			var p_hack_threads = "hack threads: " + hack_threads;
			ns.print(p_hack_threads);
			await ns.write(w_server + ".profile", p_hack_threads + "\n\r", "a");	
	
			
			var total_threads = grow_threads + weaken_threads + hack_threads;
			var ram_calc = ns.getServerMaxRam(w_server) - ns.getServerUsedRam(w_server);
			var p_server_threads = "server threads: " + ram_calc;
			ns.print(p_server_threads);
			var threads = ns.read("ThreadCount.txt");
			threads += ram_calc;
			await ns.write("ThreadCount.txt", threads, "w");
			await ns.write(w_server + ".profile", p_server_threads + "\n\r", "a");	
	
			var p_total_threads = "total threads: " + total_threads;
			ns.print(p_total_threads);
			await ns.write(w_server + ".profile", p_total_threads + "\n\r", "a");	
	
			
			var hack_ratio = hack_threads / total_threads;
			var grow_ratio = grow_threads / total_threads;
			var weaken_ratio = weaken_threads / total_threads;
			profile["max_server"]["hack_ratio"] = hack_ratio;
			profile["max_server"]["grow_ratio"] = grow_ratio;
			profile["max_server"]["weaken_ratio"] = weaken_ratio;
			profile["max_server"]["hack_threads"] = hack_threads;

			await ns.write(w_server + ".profile", "hack ratio: " + hack_ratio + "\n\r", "a");	
			await ns.write(w_server + ".profile", "grow ratio: " + grow_ratio + "\n\r", "a");	
			await ns.write(w_server + ".profile", "weaken ratio: " + weaken_ratio + "\n\r", "a");	
	
			await ns.write(w_server + ".profile", "min security level: " + min_security_level + "\n\r", "a");	
	
	
			ns.print(profile["max_server"]);
			
			// write("current_best.txt", [profile["max_server"].hostname, hack_ratio, grow_ratio, weaken_ratio],"w")
	
	
		}
	
		for(var indx in tmp_list){
			if(!list_servers.includes(tmp_list[indx])){
				list_servers.push(tmp_list[indx]);
			}
		}
		i++;
	}
	if (profile["max_server"].hostname){
		ns.print(profile["max_server"].hostname);
	
	}
	else{
		profile["max_server"] = {
							"hostname": "joesguns"};
	
	}
	ns.print(profile["max_server"]);
	ns.clearPort(2);
	await ns.writePort(2, profile["max_server"].hostname);
	await ns.write("current_best.txt", [profile["max_server"].hostname, profile["max_server"].hack_ratio, profile["max_server"].grow_ratio, profile["max_server"].weaken_ratio, profile["max_server"].hack_threads],"w")
}