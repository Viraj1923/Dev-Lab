from pydantic import BaseModel


class PostResponse(BaseModel):
    id: int
    title: str
    content: str


class UserResponse(BaseModel):
    id: int
    name: str

class UserWithPostsResponse(BaseModel):
    id: int
    name: str
    posts: list[PostResponse]

class PostWithUserResponse(BaseModel):
    id: int
    title: str
    content: str
    user: UserResponse

class CourseWithUsersResponse(BaseModel):
    id: int
    name: str
    users: list[UserResponse]