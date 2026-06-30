package domain

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Id    int64  `json:"id"`
	Token string `json:"token"`
	Role  string `json:"role"`
}
