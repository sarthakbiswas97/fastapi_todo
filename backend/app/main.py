# to start the server 
# uvicorn main:app --reload
from fastapi import FastAPI, HTTPException, Depends, Query
from typing import Annotated, List
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from .database import get_session, init_db
from .models import Todo, TodoCreate,TodoUpdate
from fastapi.middleware.cors import CORSMiddleware


SessionDep = Annotated[Session, Depends(get_session)]

@asynccontextmanager
async def lifespan(app:FastAPI):
    print("starting up ...")
    init_db()
    yield
    print("shutting down ...")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# read
@app.get("/todos", response_model=List[Todo])
def read_todos(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100):
    # to get all from the table
    todos = session.exec(select(Todo).offset(offset).limit(limit)).all()
    if len(todos) == 0:
        raise HTTPException(status_code=404, detail="No todo found")
    return todos


# read by id
@app.get("/todos/{todo_id}", response_model=Todo)
def read_by_id(todo_id: str, session: SessionDep) -> Todo:
    # to get selective from the table 
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo
    


# create
@app.post("/todos", response_model=Todo)
def create_todo(todo:TodoCreate, session: SessionDep) -> Todo:
    try:
        new_todo = Todo(
            title=todo.title,
            description=todo.description,
            status=todo.status
        )
        session.add(new_todo)
        session.commit()
        session.refresh(new_todo)
        return new_todo
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Todo not created: {str(e)}")


# update
@app.patch("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: str, todo:TodoUpdate, session: SessionDep)->Todo:
    try:
        todo_to_update = session.get(Todo,todo_id)
        if not todo_to_update:
            raise HTTPException(status_code=404, detail="Todo not found")
        if todo.title is not None:
            todo_to_update.title = todo.title
        if todo.description is not None:
            todo_to_update.description = todo.description
        if todo.status is not None:
            todo_to_update.status = todo.status
        session.commit()
        return todo_to_update
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"todo not updated: {str(e)}")

    

# delete
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: str, session: SessionDep):
    try:
        todo_to_delete = session.get(Todo, todo_id)
        if not todo_to_delete:
            raise HTTPException(status_code=404, detail=f"todo not found to be deleted")
        session.delete(todo_to_delete)
        session.commit()
        return {"message": "Todo deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Todo not deleted: {str(e)}")





@app.get("/")
def index():
    return {"message":"server is working"}
