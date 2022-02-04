import { TodoService } from './todo.service';
import { OnInit, Component, NgModule } from '@angular/core';

@Component({
	template: ``
})
export class TodosComponent implements OnInit {
	todos: any[] = [];
	message;

	constructor(private service: TodoService) {}

	ngOnInit() {
		this.service.getTodos().subscribe(t => (this.todos = t));
	}
// first do npm install rewire then
// add this in test file
// const rewire = require("rewire")
// const todos = rewire("./todos.component")
// const TodosComponent = todos.__get__("TodosComponent")
	add() {
		const newTodo = { title: '... ' };
		this.service.add(newTodo).subscribe(
			t => this.todos.push(t),
			err => (this.message = err)
		);
	}

	delete(id) {
		if (confirm('Are you sure?')) {
			this.service.delete(id).subscribe();
		}
	}

	
}

@NgModule({
	declarations: [TodosComponent],
	providers: [TodoService]
})
export class TodosModule {}
