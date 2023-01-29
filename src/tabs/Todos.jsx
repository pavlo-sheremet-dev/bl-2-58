import { nanoid } from 'nanoid';
import { Grid, GridItem, SearchForm, Text, Todo } from 'components';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

export const Todos = function () {
  const [todos, setTodo] = useState(
    () => JSON.parse(localStorage.getItem('todos')) ?? []
  );
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = text => {
    const todo = {
      id: nanoid(),
      text,
    };

    setTodo(prevTodos => [...prevTodos, todo]);
  };

  const deleteTodo = id => {
    setTodo(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <>
      <SearchForm onSubmit={addTodo} />

      {todos.length === 0 && (
        <Text textAlign="center">There are no any todos ... </Text>
      )}

      <Grid>
        {todos.length > 0 &&
          todos.map((todo, index) => (
            <GridItem key={todo.id}>
              <Todo
                id={todo.id}
                text={todo.text}
                counter={index + 1}
                onClick={deleteTodo}
              />
            </GridItem>
          ))}
      </Grid>
    </>
  );
};
