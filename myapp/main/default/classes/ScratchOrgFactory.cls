public with sharing class ScratchOrgFactory {
    public enum ScratchOrgEdition { Developer, Enterprise, Professional }

    public static void createScratchOrg (ScratchOrgEdition sEdition, String sName, String description, Integer durationDays, String features, String sourceId, String username, String namedCredential){
        String endpointURLSuffix = 'https://geminidsystems17-dev-ed.my.salesforce.com//services/data/v53.0/sobjects/ScratchOrgInfo';

        if(durationDays < 0 || durationDays > 30){
			// TODO: raise exception
        }

        ScratchOrgInfo sInfo = new ScratchOrgInfo();

        sInfo.Description = description;
        sInfo.DurationDays = durationDays;
        sInfo.Edition = sEdition.name();
        sInfo.OrgName = sName;

        if(String.isNotBlank(sourceId)){
            sInfo.SourceOrg = sourceId;            
        }

        if(String.isNotBlank(username)){
            sInfo.Username = username;
        }
        HttpRequest req = new HttpRequest();
        
        
		

        String body = JSON.serialize(sInfo);
		System.debug(body);
        
        req.setEndpoint(endpointURLSuffix);
		//req.setEndpoint('https://geminidsystems17-dev-ed.my.salesforce.com/');
        
        
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        req.setBody(body);
        
       	

        Http http = new Http();
        HTTPResponse res = http.send(req);        
        
        System.debug(res.getStatusCode());
        System.debug(res.getBody());
           
    }
}