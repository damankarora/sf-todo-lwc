import { LightningElement, api } from 'lwc';
import updateTaskStatus from '@salesforce/apex/TodoController.updateTaskStatus';
import deleteTask from '@salesforce/apex/TodoController.deleteTask';

export default class TodoItem extends LightningElement {
    @api todo;

    @api get taskid(){
        return this.todo.id;
    }

    handleDone(){        
        updateTaskStatus({id: this.todo.id, done: !this.todo.done}).then((done)=>{
            if(done){
                console.log("Done")
                this.sendUpdateEvent();
            }else{
                console.log("Error")
            }
        }).catch((err)=>{
            console.log(err);
        })
        console.log("Updated")
    }

    

    handleDelete(){
        deleteTask({id: this.todo.id})
        .then((done)=>{
            if(done){
                console.log("Deleted")
                this.sendUpdateEvent();
            }else{
                console.log("Not deleted")
            }
        })
        .catch((err)=>{
            console.log("ERROR OCCURED ", err);
        })
    }

    sendUpdateEvent(){
        const updateEvent = new CustomEvent('update');
        this.dispatchEvent(updateEvent);
    }
}