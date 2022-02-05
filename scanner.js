import {scanList} from "scanAction.js";
/** @param {NS} ns **/
export async function main(ns) {
	// ns.rm("hackable.lit.txt");
	ns.disableLog("scan");
	ns.disableLog("getHackingLevel");
	var list_servers = ns.scan();
	var i = 0;
	// ns.rm("servers.txt");
	var list = ns.getPurchasedServers();
	// ns.print(list);
	list_servers.concat(list);
	// ns.print(list_servers);
	
	while( i < list_servers.length ){
		// ns.print("i ", i, " w_server: ", w_server);
		var w_server = list_servers[i];
		var tmp_list = ns.scan(w_server);
		await scanList(ns, w_server);
		
		for(var indx in tmp_list){
			if(!list_servers.includes(tmp_list[indx])){
				list_servers.push(tmp_list[indx]);
				// await ns.write("servers.txt", tmp_list[indx] + "\n", "a");
			}
		}
		i++;
		// await ns.sleep(20);
	}
}