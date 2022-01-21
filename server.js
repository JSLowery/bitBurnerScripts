/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");
	var cnt = 0;
	while(true){
		// Port 1, running of tut.script for remote machines.
		// Port 2, targeting 'best' server.
		var pr1 = ns.readPort(1);
		if (pr1 != "NULL PORT DATA"){
			while(pr1 != "NULL PORT DATA"){
				ns.print("Process count: ", ++cnt);
				var res = ns.exec("tut_staging.js", "home", 1, pr1, cnt);
				ns.print("++++++++++")

				pr1 = ns.readPort(1);
				await ns.sleep(500);
			}
		}
		await ns.sleep(1000);
	}
}