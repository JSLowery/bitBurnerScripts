/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("scp");
	// Defines the "target server", which is the server
	// that we're going to hack. In this case, it's "n00dles"

	var running_from = ns.args[0];
	var id = ns.args[1];
	var batch_size = 1;
	// ns.print("Running from: ", running_from);
	
	var weaken_ram = ns.getScriptRam("weaken.js");
	var grow_ram = ns.getScriptRam("grow.js");
	var hack_ram = ns.getScriptRam("hack.js");
	
	await ns.scp("hack.js", running_from);
	await ns.scp("weaken.js", running_from);
	await ns.scp("grow.js", running_from);
	// var threads = 0;
	
	
	var server_ram = ns.getServerMaxRam(running_from);
	var cur_ram = server_ram - ns.getServerUsedRam(running_from);
	
	if (cur_ram < weaken_ram){
		// ns.print("Didn't have enough memory to run. cur_ram: ", cur_ram);
		return;
	}
	
	var target = "n00dles";
	var pr2 = ns.peek(2);
	
	if (pr2 != "NULL PORT DATA"){
		target = pr2;
	}

	//***************************************************************************************** */
	// put in a section that checks if targets money and security level are within 90%, if not return


	// var min_hacking_difficulty = ns.getServerMinSecurityLevel(target)
	// var current_hacking_difficulty = ns.getServerSecurityLevel(target)
	
	var weaken_ram = ns.getScriptRam("weaken.js");
	var grow_ram = ns.getScriptRam("grow.js");
	var hack_ram = ns.getScriptRam("hack.js");
	
	var data = ns.read("current_best.txt");
	var data_mut = data.split(",");
	var hack_ratio = data_mut[1];
	var grow_ratio = data_mut[2];
	var weaken_ratio = data_mut[3];
	var sug_hack_threads = parseInt(data_mut[4]);


	var hack_threads = 0;
	var grow_threads = 0;
	var weaken_threads = 0;
	
	// ns.print(hack_ratio, " ",grow_ratio, " ",  weaken_ratio);
	
	if (cur_ram <= 4){
		grow_threads = Math.max(Math.floor(cur_ram / grow_ram), 1);

		// ns.print("grow_threads: ", grow_threads);

	}
	else{

		hack_threads = Math.floor(cur_ram * hack_ratio / hack_ram);
		grow_threads = Math.floor(cur_ram * grow_ratio / grow_ram);
		weaken_threads = Math.floor(cur_ram * weaken_ratio / weaken_ram);
	}
	
	var sug_hack_threads = 400;

	if(hack_threads > sug_hack_threads){
		batch_size = Math.round(hack_threads / sug_hack_threads);
	}

	// ns.print(sprintf("WARN Batch size: %s hack threads: %s sugggested hack threads: %s", batch_size, hack_threads, sug_hack_threads));
	// Want weaken to be the base, so 0. Well for half at least...
	var weaken_sleep_time = 0;
	var thread_split = 0;

	// if there are hack_threads run the weaken split time alg.


	var itr = 0;
	var itr_cnt = 1;
	while (itr < batch_size){
		weaken_sleep_time = 0;
		var weaken_time = ns.getWeakenTime(target); // slowest
		var grow_time = ns.getGrowTime(target); // mid
		var hack_time = ns.getHackTime(target); //fastest

		if(hack_threads > 0){
			// Want hack to run before weaken
			var hack_sleep_time = weaken_time - hack_time;

				// var script = split[0];
				// var threads = split[1];
				// var batch_size = split[2];
				// var target = split[3];
				// var sleep_time = split[4];
				// var running_from = split[5];
				// var id = split[6];
			var tmp = ["hack.js", Math.round(hack_threads / batch_size), target, hack_sleep_time, running_from, id, itr, itr_cnt];
 			var data = "";
 			for(var i in tmp){

	 			data += tmp[i] + ",";
 			}
			//  ns.print("write");
			await ns.writePort(20, data);
		}
		if(weaken_threads > 0){
			thread_split = Math.floor(weaken_threads / 2);
			var tmp = ["weaken.js", Math.round((weaken_threads - thread_split) / batch_size), target, weaken_sleep_time, running_from, id, itr, itr_cnt];
 			var data = "";
 			for(var i in tmp){

	 			data += tmp[i] + ",";
 			}
			//  ns.print("write");
			await ns.writePort(20, data);
		}
		if(grow_threads > 0){
			// Want grow to run after weaken
			var grow_sleep_time = weaken_time - grow_time + 100;
			// ns.tprint("id: " + id, "id: " + itr, "id: " + itr_cnt);
			var tmp = ["grow.js", Math.round(grow_threads / batch_size), target, grow_sleep_time, running_from, id , itr , itr_cnt];
 			var data = "";
 			for(var i in tmp){

	 			data += tmp[i] + ",";
 			}
			//  ns.print("write");
			await ns.writePort(20, data);
		}
		if (thread_split > 0){
			weaken_sleep_time = + 200;
			var tmp = ["weaken.js", Math.round(thread_split / batch_size), target, weaken_sleep_time, running_from, id , itr , itr_cnt];
 			var data = "";
 			for(var i in tmp){

	 			data += tmp[i] + ",";
 			}
			//  ns.print("write");
			await ns.writePort(20, data);
		}
		itr++;
		itr_cnt++;
	}
}