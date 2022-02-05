/** @param {NS} ns **/
export async function main(ns) {
	var server = ns.args[0];
	ns.killall(server);
	await ns.sleep(50);
	ns.deleteServer(server);
}