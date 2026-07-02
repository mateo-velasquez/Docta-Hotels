package dao

type Reservation struct {
	Id        int     `gorm:"column:id;primaryKey;autoIncrement"`
	StartDate string  `gorm:"column:start_date"`
	EndDate   string  `gorm:"column:end_date"`
	UserId    int     `gorm:"column:user_id"`
	HotelId   string  `gorm:"column:hotel_id"`
	Amount    float64 `gorm:"column:amount"`
}

func (Reservation) TableName() string {
	return "reservations"
}
