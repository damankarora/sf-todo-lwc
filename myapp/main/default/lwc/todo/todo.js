import addNewTask from '@salesforce/apex/TodoController.addNewTask';
import getTasks from '@salesforce/apex/TodoController.getTasks';
import { LightningElement, track } from 'lwc';

export default class Todo extends LightningElement {

    todos=[];

    // TODO: Save order of tasks in Database after successful re-ordering.

    dragAvailable = false;

    @track pendingTodos = [];
    @track doneTodos = [];

    connectedCallback(){
        this.fetchTodos();
        this.draggables = this.template.querySelectorAll('.draggable');
        this.containers = this.template.querySelectorAll('.dropContainer');
        
    }

    renderedCallback(){
        // Configuring Drag and Drop
        this.refreshDraggable();
    }

    dragoverEventHandler(e){
        let currentContainer = e.currentTarget;        
        e.preventDefault();
        const insertBeforeElement = this.getDragAfterElement(currentContainer, e.clientY);
        console.log(insertBeforeElement);
        
        let moveTodo = this.template.querySelector('.dragging').todo;

        // No elements below (Dropped at bottom of section)
        if(insertBeforeElement === undefined){

            // Removing from current
            let source = (moveTodo.done)?this.doneTodos : this.pendingTodos;

            let modifiedSource = [...source];
            let currentIndex = this.getTaskIndex(modifiedSource, moveTodo.id);
            modifiedSource.splice(currentIndex, 1);

            if(moveTodo.done){
                this.doneTodos = modifiedSource;
            }else{
                this.pendingTodos = modifiedSource;
            }
            
            // Adding to target.
            if(currentContainer.classList[2] === 'pendingContainer'){                
                moveTodo.done = false;
                this.pendingTodos.push(moveTodo);
            }else{                
                moveTodo.done = true;
                this.doneTodos.push(moveTodo);
            }

            return;
        }

        let moveBeforeTodo = insertBeforeElement.todo;
        
        console.log(moveBeforeTodo.id, moveTodo.id, moveBeforeTodo.done, moveTodo.done);
        
        

        // Moving in same container.
        if(moveBeforeTodo.done === moveTodo.done){            

            let targetTodo = (moveBeforeTodo.done)?this.doneTodos:this.pendingTodos;

            let modifiedTodos = [...targetTodo];
            let currentIndex = this.getTaskIndex(modifiedTodos, moveTodo.id);
            console.log(currentIndex);
            modifiedTodos.splice(currentIndex, 1);
            let newIndex = this.getTaskIndex(modifiedTodos, moveBeforeTodo.id);
            modifiedTodos.splice(newIndex, 0, moveTodo);
            if(moveBeforeTodo.done){
                this.doneTodos = modifiedTodos;
            }else{
                this.pendingTodos = modifiedTodos;
            }        
        }else{

            // Moving into different container


            console.log("MOVING INTO DIFFERENT CONTAINER");
            let targetTodo = (moveBeforeTodo.done) ? this.doneTodos : this.pendingTodos;
            let modifiedTargetTodos = [...targetTodo];

            let sourceTodo = (moveTodo.done)?this.doneTodos : this.pendingTodos;

            let modifiedSourceTodos = [...sourceTodo];

            let currentIndex = this.getTaskIndex(modifiedSourceTodos, moveTodo.id);

            modifiedSourceTodos.splice(currentIndex, 1);

            let newIndex = this.getTaskIndex(modifiedTargetTodos, moveBeforeTodo.id);
            moveTodo.done = moveBeforeTodo.done;
            modifiedTargetTodos.splice(newIndex, 0, moveTodo);

            if(moveBeforeTodo.done){
                this.doneTodos = modifiedTargetTodos;
                this.pendingTodos = modifiedSourceTodos;
            }else{
                this.pendingTodos = modifiedTargetTodos;
                this.doneTodos = modifiedSourceTodos;
            }                
        }
        
        

        // console.log("Getting data: ", e.dataTransfer.getData('text'));

        
        // if(insertBefore){
        //     currentContainer.insertBefore(this.template.querySelector('.dragging'), insertBeforeElement);
        // }
        // else{
        //     currentContainer.appendChild(this.template.querySelector('.dragging'));
        // }
        
    }


    getTaskIndex(array_to_traverse, id){
        for(let i = 0; i < array_to_traverse.length; i++){
            console.log(array_to_traverse[i].id, id);
            if(array_to_traverse[i].id === id){                
                return i;
            }
        }
        return -1;
    }


    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
}

    handleDragStart(e){        
        e.target.classList.add('dragging');
    }

    handleDragEnd(e){
        e.target.classList.remove('dragging');
    }

    addTodo(){
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
    
    customDragHandler(e){
        console.log("Drag start catched");
        this.draggingId = e.detail;
    }


    refreshDraggable(){
        let draggables = this.template.querySelectorAll('.draggable');

        for (let i = 0; i < draggables.length; i++) {
            draggables[i].setAttribute('draggable', this.dragAvailable);
        }
    }

    enableDrag(e){
                
        let draggables = this.template.querySelectorAll('.draggable');

        let enable = true;
        if(this.dragAvailable){
            enable = false;
            e.target.classList.remove('reordering');
            e.target.innerText = 'Re-order'
        }else{
            this.dragAvailable = true;
            e.target.classList.add('reordering');
            e.target.innerText = 'Done';
        }


        for(let i = 0 ; i < draggables.length; i ++){
            draggables[i].setAttribute('draggable', enable);
        }
    }
}