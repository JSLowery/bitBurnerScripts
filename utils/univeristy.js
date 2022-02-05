/** @param {NS} ns **/
export async function main(ns) {

	while(true){
		if(!ns.isBusy()){
			ns.universityCourse("rothman university", "algorithms", false);
			
		}
	await ns.sleep(1000);
	}
}