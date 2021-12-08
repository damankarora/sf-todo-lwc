import addNewTask from '@salesforce/apex/TodoController.addNewTask';
import getTasks from '@salesforce/apex/TodoController.getTasks';
import { LightningElement, track } from 'lwc';

export default class Todo extends LightningElement {

    todos=[];

    

    @track pendingTodos = [];
    @track doneTodos = [];

    connectedCallback(){
        this.fetchTodos();
        this.draggables = this.template.querySelectorAll('.draggable');
        this.containers = this.template.querySelectorAll('.dropContainer');
        
    }

    renderedCallback(){
        // Configuring Drag and Drop
        
    }

    touchyEventHandler(e){
        let currectContainer = e.currentTarget;
        e.preventDefault();        
        currectContainer.appendChild(this.template.querySelector('.dragging'));
    }

    handleDragStart(e){        
        e.target.classList.add('dragging');
    }

    handleDragEnd(e){
        e.target.classList.remove('dragging');
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

            this.pendingTodos = this.todos.filter((task)=> !task.done);
            this.doneTodos = this.todos.filter((task)=> task.done);

            

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