class Todo {
    #status
    constructor(id, titre, description, duree  = 0.0) {
        this._id = id;
        this.titre = titre;
        this.description = description;
        this.duree = duree;
        this.#status  =  "not started";
    }
    getStatus (){
        return this.#status ;
    }
}
class Note {
    #id
    #nom
    #todos
    constructor(id, nom) {
        this.#id = id;
        this.#nom = nom;
        this.#todos = [];
    }

    addTodo(todo) {
        const isTodo = todo instanceof Todo;
        if (!isTodo) throw new Error("Doit etre un todo");
        this.#todos.push(todo);
    }
    removeTodoById(id) {
        this.#todos = this.#todos.filter(todo => todo.id != id);
    }
    getId (){
        return this.#id;
    }
    getNom (){
        return this.#nom;
    }
    getTodos (){
        return this.#todos ;
    }
   
    getStats (){
        const todos = this.getTodos ();
        const total = todos.length;
        const pending  = todos.filter (todo => todo.getStatus () === "not started").length;
        const completed  = todos.filter (todo => todo.getStatus () === "completed").length;

        return {total , pending , completed}

    }
   
}
const note = new Note (1 , "Projet");
const todo = new Todo (1 , "Moto" , "Lavage Moto");
note.addTodo (todo);

// note.removeTodoById (note._id);
console.log (note.getTodos ());
console.log (note.getStats ())
