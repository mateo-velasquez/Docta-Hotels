package domain

type Token struct {
	Token   string `json:"token"`
	User_id int    `json:"user_id"`
	Role    bool   `json:"role"`
}
