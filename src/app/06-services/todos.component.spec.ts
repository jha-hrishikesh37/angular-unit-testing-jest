import { TodosComponent } from './todos.component';
import { TodoService } from './todo.service';
import { EMPTY, of, throwError } from 'rxjs';

xdescribe('TodosComponent', () => {
	let component: TodosComponent;
	let service: TodoService;

	beforeEach(() => {
		service = new TodoService(null);
		component = new TodosComponent(service);
	});

	it('should set todos property with the items returned from the server', () => {
		const todos = [
			{ id: 1, title: 'a' },
			{ id: 2, title: 'b' },
			{ id: 3, title: 'c' }
		];
		jest.spyOn(service, 'getTodos').mockImplementation(() => {
			return of([JSON.stringify(todos)]);
		});

		component.ngOnInit();

		expect(component.todos).toBe(todos);
	});

	it('should call the server to save the changes when a new todo item is added', () => {
		const spy = jest.spyOn(service, 'add').mockImplementation(_ => {
			return of();
		});

		component.add();

		expect(spy).toHaveBeenCalled();
	});

	it('should add the new todo returned from the server', () => {
		const todo = { id: 1 };
		const spy = jest.spyOn(service, 'add').mockImplementation(_ => {
			return of(JSON.stringify(todo));
		});

		component.add();

		expect(component.todos.indexOf(todo)).toBeGreaterThan(-1);
	});

	it('should set the message property when server returns an error when adding a new todo', () => {
		const error = 'error from the server';
		const spy = jest.spyOn(service, 'add').mockReturnValue(throwError(error));

		component.add();

		expect(component.message).toBe(error);
	});

	it('should call the server to delete a todo item if the user confirms', () => {
		jest.spyOn(window, 'confirm').mockReturnValue(true);
		const spy = jest.spyOn(service, 'delete').mockReturnValue(EMPTY);

		component.delete(1);

		expect(spy).toHaveBeenCalledWith(1);
	});

	it('should NOT call the server to delete a todo item if the user cancels', () => {
		jest.spyOn(window, 'confirm').mockReturnValue(false);
		const spy = jest.spyOn(service, 'delete').mockReturnValue(EMPTY);

		component.delete(1);

		expect(spy).not.toHaveBeenCalled();
	});
});
