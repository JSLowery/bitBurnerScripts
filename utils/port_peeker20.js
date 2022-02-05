/** @param {NS} ns **/
export async function main(ns) {

	ns.disableLog("sleep");
	while(true){
		var pr20 = ns.peek(20);
		if (pr20 != "NULL PORT DATA"){
			var currentdate = new Date();
			var datetime =  currentdate.getDate() + "/"
							+ (currentdate.getMonth()+1)  + "/" 
							+ currentdate.getFullYear() + " @ "  
							+ currentdate.getHours() + ":"  
							+ currentdate.getMinutes() + ":" 
							+ currentdate.getSeconds() + ":"
							+ currentdate.getMilliseconds();
			
			ns.print(datetime + " Server: " + pr20);
		};
		await ns.sleep(520);
	}
}