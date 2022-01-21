/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0];
	var hostname = ns.args[1];
	var sleep_time = ns.args[2];
	await ns.sleep(sleep_time);
	var currentdate = new Date();
	var datetime = "Last Sync: " + currentdate.getDate() + "/"
					+ (currentdate.getMonth()+1)  + "/" 
					+ currentdate.getFullYear() + " @ "  
					+ currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds() + ":"
					+ currentdate.getMilliseconds();
	
	ns.print(datetime);
	
	ns.print(await ns.hack(target));
	var currentdate = new Date();
	
	var datetime = "Last Sync: " + currentdate.getDate() + "/"
					+ (currentdate.getMonth()+1)  + "/" 
					+ currentdate.getFullYear() + " @ "  
					+ currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds() + ":"
					+ currentdate.getMilliseconds();
	ns.print(datetime);
}