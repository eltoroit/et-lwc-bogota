@RestResource(urlMapping='/Shuffle/v1')
global with sharing class Shuffle {
	@AuraEnabled
	public static void lwc(Integer max) {
		data(max);
	}

	@HttpPost
	global static void post(Integer max) {
		data(max);
	}

	private static void data(Integer max) {
		try {
			List<FunnyName__c> records = [SELECT Id, Name, Points__c, Pronunciation__c, Random__c FROM FunnyName__c];
			for (FunnyName__c record : records) {
				record.Random__c = Integer.valueof((Math.random() * max));
			}
			update records;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
