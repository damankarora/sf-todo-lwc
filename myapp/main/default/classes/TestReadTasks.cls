@isTest
public with sharing class TestReadTasks {
    
    @isTest
    static void readTasks(){
        
        List<ToDo__c> tasksToAdd = new List<ToDo__c>();

        for(Integer i = 0; i < 10; i ++){
            ToDo__c singleTask = new ToDo__c();
            singleTask.Name = 'Test '+i;
            singleTask.Order__c = i + 1;
            singleTask.Done__c = false;

            tasksToAdd.add(singleTask);            
        }

        insert tasksToAdd;
        
        Test.startTest();
        List<TodoController.ToDos> resultTasks =  TodoController.getTasks();
        Test.stopTest();

        System.assertEquals(10, resultTasks.size());
    }
}
