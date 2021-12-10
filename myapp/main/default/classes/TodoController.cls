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
        ToDos task_to_add = new ToDos();
        task_to_add.task = task;
        task_to_add.done = done;   
        task_to_add.order = order;     

        SObject item_to_add = (Sobject) Type.forName('ToDo__c').newInstance();
        item_to_add.put('Name', task_to_add.task);
        item_to_add.put('Done__c', task_to_add.done);
        item_to_add.put('Order__c', task_to_add.order);

        insert item_to_add;

        return item_to_add.Id;
    }

    @AuraEnabled
    public static Boolean deleteTask(String id){
        try{
            SObject item_to_delete = (Sobject) Type.forName('ToDo__c').newInstance();
            item_to_delete.Id = id;
            delete item_to_delete;        
            return true;
        }catch(DmlException err){
            return false;
        }
    }

    @AuraEnabled
    public static Boolean updateTaskStatus(String id, Boolean done){
        try{
            SObject item_to_update = (Sobject) Type.forName('ToDo__c').newInstance();
            item_to_update.Id = id;
            item_to_update.put('Done__c', done);

            update item_to_update;
            return true;
            
        }catch(DmlException err){
            System.debug('error occured');            
            System.debug(err.getMessage());
            return false;
        }
    }

    @AuraEnabled
    public static Boolean updateTaskOrder(List<String> tasks_received){
        
        try {
            List<SObject> tasks_to_update = new List<SObject>();

            for(String task : tasks_received){
                ToDos converted_task = (ToDos)JSON.deserialize(task, ToDos.class);
                SObject updated_task = (Sobject) Type.forName('ToDo__c').newInstance();
                updated_task.Id = converted_task.id;
                updated_task.put('Done__c', converted_task.done);
                updated_task.put('Order__c', converted_task.order);

                tasks_to_update.add(updated_task);                
            }
            update tasks_to_update;            
            return true;
        } catch (DmlException e) {
            System.debug(e.getMessage());
            return false;
        }
    }



    class ToDos{
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

