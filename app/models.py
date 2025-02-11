from sqlmodel import SQLModel, Field

class Todo(SQLModel, table=True):
    id: str = Field(primary_key=True)
    Title: str = Field(index=True)
    Description: str | None = Field(default=None)
    Status: bool = Field(default=False)
    
class TodoUpdate (SQLModel):
    Title: str | None = Field(default=None)
    Description: str | None = Field(default=None)