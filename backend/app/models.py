from sqlmodel import SQLModel, Field
from uuid import uuid4

class Todo(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True) 
    title: str = Field(index=True)
    description: str | None = Field(default=None)
    status: bool = Field(default=False)
    
class TodoCreate(SQLModel):
    title: str
    description: str | None = Field(default=None)
    status: bool = Field(default=False)
    
class TodoUpdate(SQLModel):
    title: str | None = Field(default=None)
    description: str | None = Field(default=None)
    status: bool | None = Field(default=None)
    
