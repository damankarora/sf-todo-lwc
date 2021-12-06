import { LightningElement, api } from 'lwc';

export default class TodoItem extends LightningElement {
    @api todo;
    @api done;       

    handleDone(){
        console.log("Updating")
        this.updatetodo(this.todo.id)
        console.log("Updated")
    }

    handleDelete(){
        this.deletetodo(this.todo.id)
    }
}