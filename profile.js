/** @param {NS} ns **/
export async function main(ns) {

	ns.disableLog("scan");
	ns.disableLog("sleep");
	ns.disableLog("getServerRequiredHackingLevel");
	ns.disableLog("getServerGrowth");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerSecurityLevel");
	var list_servers = ns.scan();
	var i = 0;
	var profile = {};
	profile["max_server"] = {
		"hostname": "n00dles"
		};
	
	var max_ratio = 0;
	var hack_threads = 0;
	while( i < list_servers.length ){
		// ns.tprint("i: " + i, " servers_length: " + list_servers.length);
		var w_server = list_servers[i];
		if(w_server.includes("pserv-") || w_server.includes("home") || w_server.includes("darkweb")){
			i++;
			continue;
		}
		// ns.print("===============================");
		// ns.print("i ", i, " w_server: ", w_server);
		// if( i % 2 == 0){
			// await ns.sleep(50);
		// }
		if(typeof w_server == "undefined"){
			i++;
			continue;
		};
		var tmp_list = ns.scan(w_server);
		
		var required_hacking = ns.getServerRequiredHackingLevel(w_server);
		var character_hacking = ns.getPlayer().hacking;
		var min_security_level = ns.getServerMinSecurityLevel(w_server);
		var cur_money = ns.getServerMoneyAvailable(w_server);
		var max_money = ns.getServerMaxMoney(w_server);
		var grow_rate = ns.getServerGrowth(w_server);
		var multipliers = ns.getHackingMultipliers();
		var growth_amount = max_money / 2;
		if (max_money < growth_amount){
			growth_amount = 200000;
		}
	
		var hack_time = ns.getHackTime(w_server);
	
		hack_threads = Math.max(1, Math.floor(ns.hackAnalyzeThreads(w_server, growth_amount)));
		
		if (!isFinite(hack_threads)){
			hack_threads = 0
		}
		var serv_sec_level = ns.getServerSecurityLevel(w_server);
		var serv_min_sec_level = ns.getServerMinSecurityLevel(w_server);
		// hack_threads *= serv_min_sec_level / serv_sec_level;
		hack_threads = Math.pow(hack_threads, serv_min_sec_level / serv_sec_level);
		hack_threads = Math.round(hack_threads);

		hack_threads = Math.pow(hack_threads, cur_money / max_money);
		hack_threads = Math.round(hack_threads);

		var weaken_scalar = 1//12 + 1 * (((10 + multipliers.growth) / 10) * (1.2 + (1 / hack_threads)));
		// var weaken_scalar = 15;
		// var grow_scalar = 2;
		var grow_scalar = 1;

		var ratio = (max_money * max_money * (grow_rate / hack_time * hack_threads) / min_security_level + 1)  / 1000000;
	
		// ns.print("ratio: ", ratio);
		// profile[w_server] = {"min_security_level": min_security_level,
		// 					"max_money": max_money,
		// 					"ratio": ratio};
		if(ratio > max_ratio && character_hacking >= required_hacking && ns.hasRootAccess(w_server)){
			max_ratio = ratio;
			profile["max_server"] = {
				"hostname": w_server,
				"ratio": ratio
				};
			
			// hackAnalyzeThreads takes w_server and dollar ammount
			var hack_ana_security = ns.hackAnalyzeSecurity(hack_threads);
			
			// Grow
			// ====================================================================================================
			
			//the 1+ is because growth is a percent, need 1.percent not 0.percent
			var grow_threads = ns.growthAnalyze(w_server, 1  + (multipliers.money * grow_scalar)) ;
			var grow_ana_security = ns.growthAnalyzeSecurity(grow_threads);
			
			// Weaken
			// ====================================================================================================

			var total_security_gain = (hack_ana_security * weaken_scalar) + (grow_ana_security * weaken_scalar);
			// var total_security_gain = hack_ana_security  + grow_ana_security ;
			var weaken_threads = 1;
	
			var weaken_ana = ns.weakenAnalyze(weaken_threads, 1);
			if (weaken_ana < total_security_gain && isFinite(total_security_gain)){
				weaken_threads = Math.ceil(total_security_gain / weaken_ana);
				// ns.print(weaken_ana + " " +  total_security_gain + " " +  weaken_threads);
				ns.print(sprintf("weaken security depletion: %0.2d total security: %0.2d", (weaken_ana * weaken_threads), total_security_gain));
			}

			var weaken_threads_min = 1;
			var weaken_ana_min = ns.weakenAnalyze(weaken_threads_min, 1);
			if(weaken_ana_min < serv_sec_level - serv_min_sec_level){
				weaken_threads_min = Math.ceil((serv_sec_level - serv_min_sec_level) / weaken_ana_min);
				// ns.print("Test");
				// ns.print(weaken_ana_min + " " +  ((ns.getServerSecurityLevel(w_server) - ns.getServerMinSecurityLevel(w_server)) / weaken_ana_min) + " " +  weaken_threads_min);
				ns.print("        weaken_ana security depletion: " + (weaken_ana_min * weaken_threads_min) + " sec_level/min_sec_level: " + (ns.getServerSecurityLevel(w_server) - ns.getServerMinSecurityLevel(w_server)));
			}
			weaken_threads += weaken_threads_min;

			profile["max_server"]["hack_threads"] = hack_threads;	
			var total_threads = grow_threads + weaken_threads + hack_threads;
			var hack_ratio = hack_threads / total_threads;
			var grow_ratio = grow_threads / total_threads;
			var weaken_ratio = weaken_threads / total_threads;
			profile["max_server"]["hack_ratio"] = hack_ratio;
			profile["max_server"]["grow_ratio"] = grow_ratio;
			profile["max_server"]["weaken_ratio"] = weaken_ratio;
		}
	
		for(var indx in tmp_list){
			if(!list_servers.includes(tmp_list[indx])){
				list_servers.push(tmp_list[indx]);
			}
		}
		i++;
	}
	ns.clearPort(2);
	await ns.writePort(2, profile["max_server"].hostname);
	await ns.write("current_best.txt", [profile["max_server"].hostname, profile["max_server"].hack_ratio, profile["max_server"].grow_ratio, profile["max_server"].weaken_ratio, profile["max_server"].hack_threads, profile["max_server"].ratio],"w")
}