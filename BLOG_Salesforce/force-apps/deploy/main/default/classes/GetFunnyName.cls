@RestResource(urlMapping='/GetFunnyName/v1')
global with sharing class GetFunnyName {
	@AuraEnabled(cacheable=true)
	public static FunnyName__c lwc(Id recordId) {
		return data(recordId);
	}

	@HttpPost
	global static FunnyName__c post(Id recordId) {
		return data(recordId);
	}

	private static FunnyName__c data(Id recordId) {
		FunnyName__c output = null;

		try {
			if (recordId != null) {
				output = [SELECT Id, Name, Points__c, Pronunciation__c, Random__c FROM FunnyName__c WHERE Id = :recordId];
			}
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
		return output;
	}
}
