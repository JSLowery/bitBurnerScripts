/** @param {NS} ns **/
export async function main(ns) {
	
	// // var test = ns.getHackingMultipliers();
	// // ns.tprint(test);
	// // ns.tprint(ns.checkFactionInvitations());
	// // // ns.commitCrime("rob store");
	// // ns.tprint(ns.getPurchasedServerCost(1024));
	// // ns.tprint(ns.tFormat(1000, true));
	// ns.tprint(ns.isRunning("purchase-server.script", "home",16 ));
	
	var lis = ["bannana", "troll", "person", "troll"]
	lis = lis.filter((x, i, a) => a.indexOf(x) == i);
	ns.tprint(lis);
	
}