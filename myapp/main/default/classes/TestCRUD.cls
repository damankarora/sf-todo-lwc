@isTest
public with sharing class TestCRUD {
    
    @isTest
    static void testInsert(){
        
        Test.startTest();
        TodoController.addNewTask('Testing', false, 1);
        Test.stopTest();
        System.assertEquals(1, [SELECT COUNT() FROM ToDo__c WHERE Name = 'Testing']);

    }

    @isTest
    static void testDeleteTask(){   

        ToDo__c item_to_add = new ToDo__c();
        item_to_add.Name = 'Task to delete';
        item_to_add.Done__c = false;
        item_to_add.Order__c = 2;

        insert item_to_add;

        Test.startTest();
        TodoController.deleteTask(item_to_add.Id);
        Test.stopTest();

        System.assertEquals(0, [SELECT COUNT() FROM ToDo__c WHERE Id=:item_to_add.Id]);
    }


    @isTest
    static void testUpdateTaskStatus(){        

        ToDo__c item_to_add = new ToDo__c();
        item_to_add.Name = 'Task to update';
        item_to_add.Done__c = false;
        item_to_add.Order__c = 2;


        insert item_to_add;

        Test.startTest();
        TodoController.updateTaskStatus(item_to_add.Id, true);
        Test.stopTest();

        System.assertEquals(true, [SELECT Done__c FROM ToDo__c WHERE Id=:item_to_add.Id][0].Done__c);
    }

    @isTest
    static void testupdateTaskOrder(){
        List<ToDo__c> tasksToAdd = new List<ToDo__c>();
        
        for(Integer i = 0; i < 10; i ++){
            ToDo__c item_to_add = new ToDo__c();
            item_to_add.Name = 'Task to update order' + i;
            item_to_add.Done__c = false;
            item_to_add.Order__c = i+1;
            tasksToAdd.add(item_to_add);
        }

        insert tasksToAdd;

        String jsonString = '{"id":"'+tasksToAdd[0].Id+'", "order": 100, "done": true}';

        List<String> listOfJsonStrings = new List<String>();
        listOfJsonStrings.add(jsonString);

        Test.startTest();

        TodoController.updateTaskOrder(listOfJsonStrings);
        Test.stopTest();

        System.assertEquals(100, [SELECT Order__c FROM ToDo__c WHERE Id=:tasksToAdd[0].Id][0].Order__c);
    }
    

    @isTest
    static void sendingEmptyIdUpdateTaskStatus(){
        Test.startTest();
        Boolean result = TodoController.updateTaskStatus('', true);
        Test.stopTest();

        System.assertEquals(false, result);
    }
}
