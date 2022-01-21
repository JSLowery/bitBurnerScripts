/** @param {NS} ns **/
export async function main(ns) {

	ns.disableLog("scp");
	// Defines the "target server", which is the server
	// that we're going to hack. In this case, it's "n00dles"
	var running_from = ns.args[0];
	var id = ns.args[1];
	var batch_size = 1;
	ns.print("Running from: ", running_from);
	
	var weaken_ram = ns.getScriptRam("weaken.js");
	var grow_ram = ns.getScriptRam("grow.js");
	var hack_ram = ns.getScriptRam("hack.js");
	
	await ns.scp("hack.js", running_from);
	await ns.scp("weaken.js", running_from);
	await ns.scp("grow.js", running_from);
	var threads = 0;
	
	
	var server_ram = ns.getServerMaxRam(running_from);
	var cur_ram = server_ram - ns.getServerUsedRam(running_from);
	
	if (cur_ram < weaken_ram){
		ns.print("Didn't have enough memory to run. cur_ram: ", cur_ram);
		return;
	}
	
	var target = "joesguns";
	var pr2 = ns.peek(2);
	
	if (pr2 != "NULL PORT DATA"){
		target = pr2;
	}
	
	var min_hacking_difficulty = ns.getServerMinSecurityLevel(target)
	var current_hacking_difficulty = ns.getServerSecurityLevel(target)
	
	var weaken_ram = ns.getScriptRam("weaken.js");
	var grow_ram = ns.getScriptRam("grow.js");
	var hack_ram = ns.getScriptRam("hack.js");
	
	var data = ns.read("current_best.txt");
	var data_mut = data.split(",");
	var hack_ratio = data_mut[1];
	var grow_ratio = data_mut[2];
	var weaken_ratio = data_mut[3];
	// var sug_hack_threads = parseInt(data_mut[4]);
	var sug_hack_threads = 20;

	var hack_threads = 0;
	var grow_threads = 0;
	var weaken_threads = 0;
	
	ns.print(hack_ratio, " ",grow_ratio, " ",  weaken_ratio);
	
	if (cur_ram <= 4){
		grow_threads = Math.max(Math.floor(cur_ram / grow_ram), 1);

		ns.print("grow_threads: ", grow_threads);
	}
	
	else{
		ns.print("Ram: " + cur_ram + ", Hack Ratio: " + hack_ratio + ", Hack Ram: " + hack_ram);

		hack_threads = Math.floor(cur_ram * hack_ratio / hack_ram);
		grow_threads = Math.floor(cur_ram * grow_ratio / grow_ram);
		weaken_threads = Math.floor(cur_ram * weaken_ratio / weaken_ram);

		//need at least 1 hack thread
		weaken_threads--;
		hack_threads++;
		ns.print("hack_threads: ", hack_threads);
		ns.print("grow_threads: ", grow_threads);
		ns.print("weaken_threads: ", weaken_threads);
	}
	
	var max_money = ns.getServerMaxMoney(target);
	var cur_money = ns.getServerMoneyAvailable(target);
	var per_money = cur_money / max_money;
	ns.print(sprintf("percent money: %s, current money: %e, max money: %e" , per_money, cur_money, max_money));
	
	// If the system gets below 75% we want to aggressivly grow it.
	if(per_money < .50 && hack_threads > 4){
		ns.print("INFO Changed to growing alg. percent money:" + per_money + " hack threads: " + hack_threads);
		var tmp_thread = Math.floor(hack_threads / 2);
		hack_threads -= tmp_thread;
		tmp_thread -= tmp_thread * Math.abs(hack_ram - weaken_ram);
		var tmp_thread_2 = Math.floor(tmp_thread / 2);
		grow_threads += tmp_thread_2;
		weaken_threads += tmp_thread - tmp_thread_2;
	}
	if(min_hacking_difficulty + 1 < current_hacking_difficulty){
		if(hack_threads > 2){
			var tmp_thread = Math.floor(hack_threads / 2);
			weaken_threads += tmp_thread;
			hack_threads -= tmp_thread;
		}
		if( grow_threads > 0 && min_hacking_difficulty / current_hacking_difficulty < .9){
			var tmp_thread = Math.floor(grow_threads / 2);
			weaken_threads += tmp_thread;
			grow_threads -= tmp_thread;
		}
	}

	if(hack_threads > sug_hack_threads){
		batch_size = Math.floor(hack_threads / sug_hack_threads);
	}

	ns.print(sprintf("WARN Batch size: %s hack threads: %s sugggested hack threads: %s", batch_size, hack_threads, sug_hack_threads));
	// Want weaken to be the base, so 0. Well for half at least...
	var weaken_sleep_time = 0;
	var thread_split = 0;

	// if there are hack_threads run the weaken split time alg.


	var itr = 0;
	while (itr < batch_size){
		var weaken_time = ns.getWeakenTime(target); // slowest
		var grow_time = ns.getGrowTime(target); // mid
		var hack_time = ns.getHackTime(target); //fastest

		if(hack_threads > 0){
			thread_split = Math.floor(weaken_threads / 2);
			// Want hack to run before weaken
			var hack_sleep_time = weaken_time - hack_time;
			ns.exec("hack.js", running_from, hack_threads / batch_size, target, running_from, hack_sleep_time, hack_threads / batch_size, id + itr);
		}
		if(weaken_threads > 0){
			if (thread_split > 0){
				weaken_threads -= thread_split;
			}
			ns.exec("weaken.js", running_from, weaken_threads / batch_size, target, running_from, weaken_sleep_time, weaken_threads / batch_size, id + itr);
		}
		if(grow_threads > 0){
			// Want grow to run after weaken
			var grow_sleep_time = weaken_time - grow_time + 100;
			ns.exec("grow.js", running_from, grow_threads / batch_size, target, running_from, grow_sleep_time, grow_threads / batch_size, id + itr) ;
		}
		if (thread_split > 0){
			weaken_sleep_time = + 200;
			ns.exec("weaken.js", running_from, thread_split / batch_size, target, running_from, weaken_sleep_time, thread_split / batch_size, id + itr);
		}
		itr++;
		await ns.sleep(200);
	}
}