public with sharing class TodoController {
            

    @AuraEnabled    
	public static List<ToDos> getTasks(){                     
        List<SObject> todos = [SELECT Name, Done__c, Order__c FROM ToDo__c ORDER BY Order__c];        

        List<ToDos> todos_to_return = new List<ToDos>();

        for(SObject todo : todos){
            ToDos converted_todo = new ToDos();
            converted_todo.id = todo.Id;
            converted_todo.task = String.valueOf(todo.get('Name'));
            converted_todo.done = Boolean.valueOf(todo.get('Done__c'));
            converted_todo.order = Integer.valueOf(todo.get('Order__c'));
            todos_to_return.add(converted_todo);
        }
 
        return todos_to_return;
    }

    @AuraEnabled
    public static String addNewTask(String task,Boolean done, Integer order){

        try{
             // SObject item_to_add = (Sobject) Type.forName('ToDo__c').newInstance();
            ToDo__c item_to_add = new ToDo__c();
            item_to_add.Name = task;
            item_to_add.Done__c = done;
            item_to_add.Order__c = order;

            insert item_to_add;

            return item_to_add.Id;
        }catch(DmlException err){
            System.debug('DML error occured');            
            System.debug(err.getMessage());
            return 'ERROR';
        }
        catch(Exception e){
            System.debug('Exception occured');
            System.debug(e.getMessage());
            return 'ERROR';
        }
       
    }

    @AuraEnabled
    public static Boolean deleteTask(String id){
        try{
            // SObject item_to_delete = (Sobject) Type.forName('ToDo__c').newInstance();
            ToDo__c item_to_delete = new ToDo__c();
            item_to_delete.Id = id;
            delete item_to_delete;        
            return true;
        }catch(DmlException err){
            return false;
        }
        catch(Exception e){
            System.debug('Exception occured');
            System.debug(e.getMessage());
            return false;
        }
    }

    @AuraEnabled
    public static Boolean updateTaskStatus(String id, Boolean done){
        try{
            // SObject item_to_update = (Sobject) Type.forName('ToDo__c').newInstance();
            ToDo__c item_to_update = new ToDo__c();
            item_to_update.Id = id;
            item_to_update.Done__c=done;

            update item_to_update;
            return true;
            
        }catch(DmlException err){
            System.debug('error occured');            
            System.debug(err.getMessage());
            return false;
        }
        catch(Exception e){
            System.debug('Exception occured');
            System.debug(e.getMessage());
            return false;
        }
    }

    @AuraEnabled
    public static Boolean updateTaskOrder(List<String> tasks_received){
        
        try {
            List<SObject> tasks_to_update = new List<SObject>();

            for(String task : tasks_received){
                ToDos converted_task = (ToDos)JSON.deserialize(task, ToDos.class);
                // SObject updated_task = (Sobject) Type.forName('ToDo__c').newInstance();
                ToDo__c updated_task = new ToDo__c();
                updated_task.Id = converted_task.id;
                updated_task.Done__c = converted_task.done;
                updated_task.Order__c = converted_task.order;

                tasks_to_update.add(updated_task);                
            }
            update tasks_to_update;            
            return true;
        } catch (DmlException e) {
            System.debug(e.getMessage());
            return false;
        }
        catch(Exception e){
            System.debug('Exception occured');
            System.debug(e.getMessage());
            return false;
        }
    }



    public class ToDos{
        @AuraEnabled        
        public String id;
        @AuraEnabled        
        public String task;
        @AuraEnabled
        public Boolean done;
        @AuraEnabled
        public Integer order;
    }
}

