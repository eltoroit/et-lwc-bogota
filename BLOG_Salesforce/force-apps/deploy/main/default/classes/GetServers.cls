public without sharing class GetServers {
	@AuraEnabled
	public static Map<String, String> lwc() {
		Map<String, String> output = new Map<String, String>();
		for (Server__mdt server : [SELECT Id, DeveloperName, URL__c FROM Server__mdt]) {
			output.put(server.DeveloperName, server.URL__c);
		}
		return output;
	}
}
