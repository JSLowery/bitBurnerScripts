/** @param {NS} ns **/
export async function main(ns) {
	ns.run("server.js", 1);
	ns.run("hacknet.script");
	ns.run("utils/purchase-server.script", 1);
	var twenty_mins = 60000
	var ten_mins = 30000
	var dw_pass_one = false;
	var dw_pass_two = false;
	var darkweb_timer = new Date().getTime();
	
	while(true){
		if(!dw_pass_one && new Date().getTime() - darkweb_timer > twenty_mins) {
			ns.run("./utils/darkweb.js", 1)
			dw_pass_one = true;
		} 
		if(!dw_pass_one && !dw_pass_two && new Date().getTime() - darkweb_timer > ten_mins) {
			ns.run("./utils/darkweb.js", 1)
			dw_pass_two = true;
		} 
		if (!ns.isRunning("scanner.js")){
			ns.run("scanner.js", 1);
			await ns.sleep (1000);
			if(!ns.isRunning("profile.js")){
				ns.run("profile.js", 1);
			}
		}
	}

}