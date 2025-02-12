from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy_utils import database_exists, create_database
from typing import Generator
from sqlalchemy.engine import Engine

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/todo_fastapi_db"


def get_engine() -> Engine:
    engine: Engine = create_engine(DATABASE_URL)
    if not database_exists(engine.url):
        create_database(engine.url)
    return engine

engine = get_engine()

print("****** Running database.py ******")

def init_db():
    SQLModel.metadata.create_all(engine)
    
def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
        
