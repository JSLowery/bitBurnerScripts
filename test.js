/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("sleep");
	var last_per_money = -100;
	var last_growth_indicator = "";
	var time_change_str = "";
	var prev_time = new Date().getTime();;
	var last_duration = 0; 
	var duration = 0;
	var prev_growth_indicator = "";
	var hostname_spacing_length = 0;
	var timings = {
		"==": [],
		"++": [],
		"--": [],
		"==prnt": 0,
		"++prnt": 0,
		"--prnt": 0,
		"==avg": 0,
		"++avg": 0,
		"--avg": 0,
	
	};
	
	
	String.prototype.repeat = function(length) {
		return Array(length + 1).join(this);
	};
	
	while(true){
		var tmp_str = "";
		var split_data = await ns.read("current_best.txt").split(",")
		for (var i in split_data){
			if(parseFloat(split_data[i])){
				if(i == split_data.length - 1){
					tmp_str += " ";	
					tmp_str += parseFloat(split_data[i]).toFixed(2) + "  |";
	
				}
				else{
					tmp_str += parseFloat(split_data[i]).toFixed(2) + " | ";
				}
			}
			else{
				tmp_str += split_data[i] + " | ";
				// print(split_data[i], split_data[i].length);
				hostname_spacing_length = split_data[i].length;
			}
		}
		// tmp_str = tmp_str.substring(0, tmp_str.length-1)
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
	
		var growth_indicator = "";
		var now = new Date().getTime();
	
	
		if (last_per_money == per_money){
			growth_indicator = "==";
			timings["=="].push(now - prev_time);
		}
		else if (last_per_money < per_money){
			growth_indicator = "++";
			timings["++"].push(now - prev_time);
	
		}
		else if (last_per_money > per_money){
			growth_indicator = "--";
			timings["--"].push(now - prev_time);
	
		}
		else{
			growth_indicator = "error";
		}
		duration = (now - prev_time) / 1000;
		if(growth_indicator != last_growth_indicator){
			last_duration = duration;
			prev_growth_indicator = last_growth_indicator;
			prev_time = now;
		}
		for(var timmers in timings){
			// print(timmers);
			// print(timings);
			// print(timings[timmers]);
	
			// timings[timmers + "prnt"] = timings[timmers].reduce(function (a, b) { a + b}, 0) / timings[timmers].length;
			if(!timmers.includes("prnt") && timings[timmers].length > 0){
				var sum = 0;
				var cnt = 0;
				for(var tmp_num in timings[timmers]){
					sum += timings[timmers][tmp_num];
					cnt++;
				}
				// print("INFO " + timings[timmers].reduce(function (a, b, index, _cur) { a + b;}, 0));
				// print(sum);
	
				timings[timmers + "prnt"] = sum / timings[timmers].length / 1000;
	
				if(timings["--prnt"] && timings["++prnt"] && timings["==prnt"]){
					var sum_arr = 0;
					for( var j in timings){
						if(j.includes("prnt")){
							sum_arr += timings[j];
						}
					}
					timings[timmers + "avg"] = timings[timmers + "prnt"] / sum_arr;
				}
			}
			// print(timings);
	
		}
		// print( timmers);
		// sleep(1500);
		// var hostname_spacing = "";
		// for(var tmp in hostname_spacing_length){
		// 	hostname_spacing += " ";
		// }
		var prnt_var = sprintf("| hostname%s| hack | grow | weaken | pr2%s|\n  %-"+ (hostname_spacing_length - 2) + "s %-"+(hostname_spacing_length-2)+"s |",
			" ".repeat(hostname_spacing_length- 7),
			" ".repeat(hostname_spacing_length- 2),
			tmp_str,
			target);
		var prnt_ln2 = sprintf("| servermoney  |  securitylevel  |\n%13s  |%15s  |",
			per_money,
			ns.getServerSecurityLevel(target).toFixed(2));
	
		// if(timings["--prnt"] && timings["++prnt"] && timings["==prnt"]){
		var prnt_ln3 = sprintf("|  hack cycle  |  grow cycle  |  equal cycle  |  hack avg  |  grow avg  |  equal avg  |\n%13s  |%12s  |%13s  |%10s  |%10s  |%11s  |",
			timings["--prnt"].toFixed(2),
			timings["++prnt"].toFixed(2),
			timings["==prnt"].toFixed(2),
			timings["--avg"].toFixed(2),
			timings["++avg"].toFixed(2),
			timings["==avg"].toFixed(2));
	
	
		ns.print(prnt_var + "\n" +
		//  "\n=============================================================================\n" +
		prnt_ln2 + "\n" +
		//  "\n=============================================================================\n" +
		prnt_ln3);
	
		await ns.sleep(50);
		// print(tmp_str + " " + target);
		// print("Servers money ratio: " +
		//  per_money + " " +
		//  growth_indicator +
		//  " Duration: " + duration +
		//  " " + prev_growth_indicator +
		//  " last duration: " +
		//  last_duration +
		//  " security level: " + 
		//  + getServerSecurityLevel(target).toFixed(2));
	
		// print("hostname, hack, grow, weaken, pr2 ");
		// print(tmp_str + " " + target);
		// print("Servers money ratio: " +
		//  per_money + " " +
		//  growth_indicator +
		//  " Duration: " + duration +
		//  " " + prev_growth_indicator +
		//  " last duration: " +
		//  last_duration +
		//  " security level: " + 
		//  + getServerSecurityLevel(target).toFixed(2));
	
	
	
		last_growth_indicator = growth_indicator;
		last_per_money = per_money;
	
	}

}