/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("sleep");
	var last_per_money = -100;
	var hostname_spacing_length = 1;
	
	
	String.prototype.repeat = function(length) {
		return Array(length + 1).join(this);
	};
	
	while(true){
		var tmp_str = " ";
		var split_data = await ns.read("current_best.txt").split(",")
		var hostname = split_data[0];
		var best_hack_ratio = split_data[1];
		var best_grow_ratio = split_data[2];
		var best_weaken_ratio = split_data[3];
		var sug_hack_threads = split_data[4];
		var ratio = split_data[5];
		if(hostname.length <= 9){
			var len = hostname.length;
			for(var o = 0; o < 9 - len; o++){
				hostname += " ";
			}
		}

		hostname_spacing_length = hostname.length;
		var target = "n00dles";
		var pr2 = ns.peek(2);

		if (pr2 != "NULL PORT DATA"){
			target = pr2;
		}
	
		
		var cur_money = ns.getServerMoneyAvailable(target);
		var max_money = ns.getServerMaxMoney(target);
		var per_money = cur_money / max_money;
		per_money = per_money.toFixed(2);
		
		if(last_per_money == -100){
			last_per_money = per_money;
		}
	
		var sec_level = ns.getServerSecurityLevel(target);
		var min_sec_level = ns.getServerMinSecurityLevel(target);
		var prnt_var = sprintf("| hostname%" + (hostname_spacing_length - 8) + "s| hack  | grow  | weaken  | hackt | pr2%" + (hostname_spacing_length - 2) + "s|\n" +
		" %" + hostname_spacing_length + "s | %3s | %3s | %7s | %5s | %-"+hostname_spacing_length+"s |",
			" ",
			" ",
			hostname,
			parseFloat(best_hack_ratio).toFixed(3),
			parseFloat(best_grow_ratio).toFixed(3),
			parseFloat(best_weaken_ratio).toFixed(3),
			sug_hack_threads,
			target);
		var prnt_ln2 = sprintf("| servermoney       |  securitylevel   |  ratio     |\n %5s/%5s(%4s)  |%4s/%4s(%4s)  | %s  |",
			cur_money.toExponential(0),
			max_money.toExponential(0),
			per_money,
			min_sec_level,
			sec_level.toFixed(2),
			(min_sec_level / sec_level).toFixed(2),
			parseFloat(ratio).toExponential(3));
	
	
	
		ns.print(prnt_var + "\n" +
		prnt_ln2);// + "\n" +
	
		await ns.sleep(1000);
		last_per_money = per_money;
	
	}

}