package dao

type User struct {
	Id       int64  `gorm:"column:id;primaryKey;autoIncrement"`
	Name     string `gorm:"column:name"`
	LastName string `gorm:"column:last_name"`
	Dni      string `gorm:"column:dni"`
	Email    string `gorm:"column:email"`
	Password string `gorm:"column:password"`
	Role     string `gorm:"column:role"`
}

func (User) TableName() string {
	return "users"
}

type Users []User
