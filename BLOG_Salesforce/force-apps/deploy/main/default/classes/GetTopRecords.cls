@RestResource(urlMapping='/GetTopRecords/v1')
global with sharing class GetTopRecords {
	@AuraEnabled(cacheable=true)
	public static List<FunnyName__c> lwc(Integer howMany) {
		return data(howMany);
	}

	@HttpPost
	global static List<FunnyName__c> post(Integer howMany) {
		return data(howMany);
	}

	private static List<FunnyName__c> data(Integer howMany) {
		try {
			return [SELECT Id, Name, Points__c, Pronunciation__c, Random__c FROM FunnyName__c ORDER BY Random__c DESC LIMIT :howMany];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
