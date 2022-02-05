/** @param {NS} ns **/
export async function main(ns) {

	while(true){
		var pr20 = ns.readPort(20);
		if (pr20 != "NULL PORT DATA"){
			while(pr20 != "NULL PORT DATA"){
				ns.tprint(pr20);
				var spl = pr20.split(",");
				ns.tprint(spl);
				await ns.sleep(1);
				pr20 = ns.readPort(20);
			}
		}
		await ns.sleep(50);
	}
}