import { UsersComponent } from './users.component';
import { UserService } from './user.service';
import { from, EMPTY, throwError } from 'rxjs';

xdescribe('UsersComponent', () => {
	let component: UsersComponent;
	let service: UserService;

	beforeEach(() => {
		service = new UserService(null);
		component = new UsersComponent(service);
	});

	it('should set users property with the users retrieved from the server', () => {
		const users = [1, 2, 3];
		jest.spyOn(service, 'getUsers').mockReturnValue(from([users]));

		component.ngOnInit();

		expect(component.users).toBe(users);
	});

	describe('When deleting a user', () => {
		let user;

		beforeEach(() => {
			component.users = [{ id: 1 }, { id: 2 }];

			user = component.users[0];
		});

		it('should remove the selected user from the list if the user confirms deletion', () => {
			jest.spyOn(window, 'confirm').mockReturnValue(true);
			jest.spyOn(service, 'deleteUser').mockReturnValue(EMPTY);

			component.deleteUser(user);

			expect(component.users.indexOf(user)).toBe(-1);
		});

		it('should NOT remove the seleted user from the list if the user cancels', () => {
			jest.spyOn(window, 'confirm').mockReturnValue(false);

			component.deleteUser(user);

			expect(component.users.indexOf(user)).toBeGreaterThan(-1);
		});

		it('should call the server to delete the selected user if the user confirms deletion', () => {
			jest.spyOn(window, 'confirm').mockReturnValue(true);
			const spy = jest.spyOn(service, 'deleteUser').mockReturnValue(EMPTY);

			component.deleteUser(user);

			expect(spy).toHaveBeenCalledWith(user.id);
		});

		it('should NOT call the server to delete the selected user if the user cancels', () => {
			jest.spyOn(window, 'confirm').mockReturnValue(false);
			const spy = jest.spyOn(service, 'deleteUser').mockReturnValue(EMPTY);

			component.deleteUser(user);

			expect(spy).not.toHaveBeenCalled();
		});

		it('should undo deletion if the call to the server fails', () => {
			jest.spyOn(window, 'confirm').mockReturnValue(true);
			// We need to change the implementation of alert, otherwise
			// it will popup a dialog when running our unit tests.
			jest.spyOn(window, 'alert').mockImplementation(() => {});
			jest.spyOn(service, 'deleteUser').mockReturnValue(throwError('error'));

			component.deleteUser(user);

			expect(component.users.indexOf(user)).toBeGreaterThan(-1);
		});

		it('should display an error if the call to the server fails', () => {
			jest.spyOn(window, 'confirm').mockReturnValue(true);
			const spy = jest.spyOn(window, 'alert').mockImplementation(() => {});
			jest.spyOn(service, 'deleteUser').mockReturnValue(throwError('error'));

			component.deleteUser(user);

			expect(spy).toHaveBeenCalled();
		});
	});
});
