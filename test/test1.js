/** @param {NS} ns **/
export async function main(ns) {
 var tmp = ["home", 1, "thing"];
 var str = "";
 for(var i in tmp){

	 str += tmp[i] + ",";
 }
 ns.writePort(20, str);

}