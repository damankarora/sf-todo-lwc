import addNewTask from '@salesforce/apex/TodoController.addNewTask';
import getTasks from '@salesforce/apex/TodoController.getTasks';
import { LightningElement, track } from 'lwc';

export default class Todo extends LightningElement {

    @track todos=[];

    connectedCallback(){
        this.fetchTodos();
    }

    printName(){
        let inputField = this.template.querySelector('lightning-input');
            
        
        
        addNewTask({task: inputField.value, done: false}).then(()=>{
            this.fetchTodos();
        }).catch((err)=>{
            console.log("SOMETHING WENT WRONG");
            console.log(err);
        })        
        inputField.value = "";     
    }

    fetchTodos(){
        console.log("Fetching todos")
        getTasks().then((todosToAdd)=>{
            console.log("Got something");
            console.log(todosToAdd);
            console.log(this.todos);
            this.todos = todosToAdd;
            console.log("Tasks fetched");
            console.log(this.todos);
        }).catch((err)=>{
            console.log("Err", err);
        })
    }

    updateTodo(id_to_change){
        this.todos = this.todos.map((todo)=>{
            if(todo.id == id_to_change){
                todo.id = !todo.id;
            }
            return todo;
        })
    }

    updateHandler(){
        this.fetchTodos();
    }

    deleteTodo(id_to_delete){
        this.todos = this.todos.filter((todo)=> todo.id !== id_to_delete);
    }
    
}