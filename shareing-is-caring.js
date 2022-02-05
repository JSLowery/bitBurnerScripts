/** @param {NS} ns **/
export async function main(ns) {
	while(true){
		for(var i = 0; i < 110; i++){
		ns.run("sharing.js", 500, i);
		}
		await ns.sleep(10001);
	}
}