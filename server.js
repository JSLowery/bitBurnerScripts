/** @param {NS} ns **/

async function check20(ns, hold_buff = {}){
		var pr20 = ns.readPort(20);
		if (pr20 != "NULL PORT DATA"){
			while(pr20 != "NULL PORT DATA"){
				var split = pr20.split(",");
				
			// var tmp = ["grow.js", grow_threads, batch_size, target, grow_sleep_time, running_from, id + itr + itr_cnt];
				var script = split[0];
				var threads = split[1];
				// var batch_size = split[2];
				var target = split[2];
				var sleep_time = split[3];
				var running_from = split[4];
				var id = split[5];
				var itr = split[6];
				var itr_cnt = split[7];
				var cur_ram = ns.getServerMaxRam(running_from) - ns.getServerUsedRam(running_from)
				var script_ram = ns.getScriptRam(script)
				var threads_possible =  cur_ram / script_ram;
				// ns.print(sprintf("TP: %s, CR: %s SR: %s", threads_possible, cur_ram, script_ram));
				if(threads_possible < threads){
					threads = Math.floor(threads_possible);
				}
				if(!Object.keys(hold_buff).includes(running_from)){
					var ret = ns.exec(script,
						running_from,
						Math.max(1, Math.floor(threads)),
						target,
						running_from,
						sleep_time,
						Math.max(1, Math.floor(threads)),
						id,
						itr,
						itr_cnt);
				}
				ns.print(sprintf("script: %-10s | ret: %-8s | running from: %-17s | on: %-17s | sleep: %-20s | threads: %-12s |", script, ret, running_from, target, ns.tFormat(sleep_time), threads));
				pr20 = ns.readPort(20);
				// ns.tprint("ran " + script);
			}
		}
}
export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("exec");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("getServerMaxRam");
	var cnt = 0;
	var hold_buff = {};
	var ran_list = [];

	while(true){
		// Port 1, running of tut.script for remote machines.
		// Port 2, targeting 'best' server.
		var pr1 = ns.readPort(1);
		if (pr1 != "NULL PORT DATA"){
			while(pr1 != "NULL PORT DATA"){
				if (!Object.keys(hold_buff).includes(pr1)|| new Date().getTime() - hold_buff[pr1]["last_seen"] > 15000){
					if(cnt > 60000){
						cnt = 0;
					}
					// ns.print("Process count: ", ++cnt);
					var res = ns.exec("tut_staging.js", "home", 1, pr1, cnt);
					ns.print(sprintf("script: %-10s | ret: %-8s | running from: %-17s | on: %-17s | id: %-20s", "staging.js", res, "home", pr1, cnt));
					ran_list.push(pr1);
					ran_list = ran_list.filter((x, i, a) => a.indexOf(x) == i);
					hold_buff[pr1] = {}
					hold_buff[pr1]["last_seen"] = new Date().getTime();
					// ns.print("Servers running: " + ran_list.length);
					cnt++;
					await check20(ns, hold_buff);
				}
				else{
					hold_buff[pr1]["time_in_q"] = new Date().getTime() - hold_buff[pr1]["last_seen"];
					if (hold_buff[pr1]["time_in_q"] / 1000 > 10){
						// ns.print(sprintf("Already running: %s time in q: %s", pr1, hold_buff[pr1]["time_in_q"] / 1000));
					}
				}
				pr1 = ns.readPort(1);
				var currentdate = new Date();
				var datetime = "Last Sync: " + currentdate.getDate() + "/"
								+ (currentdate.getMonth()+1)  + "/" 
								+ currentdate.getFullYear() + " @ "  
								+ currentdate.getHours() + ":"  
								+ currentdate.getMinutes() + ":" 
								+ currentdate.getSeconds() + ":"
								+ currentdate.getMilliseconds();
				
				await ns.sleep(15);
				await check20(ns);
			}
		}

		await ns.sleep(50);
	}
}