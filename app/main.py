# to start the server 
# uvicorn main:app --reload
from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
from sqlmodel import Session
import uuid
from contextlib import asynccontextmanager
from .database import get_session, init_db
from .models import Todo, TodoUpdate


SessionDep = Annotated[Session, Depends(get_session)]

@asynccontextmanager
async def lifespan(app:FastAPI):
    print("starting up ...")
    init_db()
    yield
    print("shutting down ...")


app = FastAPI(lifespan=lifespan)


# read


# read by id

    
# create


# update


# delete






@app.get("/")
def index():
    return {"message":"server is working"}
