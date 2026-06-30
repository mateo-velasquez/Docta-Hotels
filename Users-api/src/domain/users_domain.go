package domain

type User struct {
	Id       int64  `json:"id"`
	Name     string `json:"name" validate:"required"`
	LastName string `json:"last_name" validate:"required"`
	Dni      string `json:"dni" validate:"required"`
	Email    string `json:"email" validate:"required"`
	Password string `json:"password,omitempty"`
	Role     string `json:"role"`
}

type Users []User
