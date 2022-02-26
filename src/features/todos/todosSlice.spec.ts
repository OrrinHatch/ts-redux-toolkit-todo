import todoReducer, { TodoState, Status } from "./todosSlice";

describe('todos reducer', () => {
    const initialState: TodoState =  {
        status: Status.idle,
        entities: [
            { id: 0, text: 'Test text', completed: false}
        ]
    }

    it('should handle initial state', () => {
        expect(todoReducer(initialState, { type: 'unknown'})).toEqual({
            status: Status.idle,
            entities: [
                { id: 0, text: 'Test text', completed: false}
            ]
        })
    });

    it('should hanlde todoAdded', () => {
        const actual = todoReducer(initialState, { type: 'todos/todoAdded', payload: 'Learn about actions' });
        expect(actual.entities[1].text).toBe('Learn about actions');
    })

    it('should handle colorSelected', ()=> {
        const actual = todoReducer(initialState, { type: 'todos/colorSelected', payload: { todoId: 0, color: 'red'}})
        expect(actual.entities[0].color).toBe('red');
    })

    it('should handle todoToggled', () => {
        const actual = todoReducer(initialState, { type: 'todos/todoToggled', payload: 0});
        expect(actual.entities[0].completed).toBe(true)
    })
})