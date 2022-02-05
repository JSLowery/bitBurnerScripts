/** @param {NS} ns **/
export async function main(ns) {
	var ram = ns.args[0];
	ns.tprint(sprintf("Cost: %e Cost for all: %e Cost for 12: %e",
						ns.getPurchasedServerCost(ram),
						25 * ns.getPurchasedServerCost(ram),
						12 * ns.getPurchasedServerCost(ram)));
}