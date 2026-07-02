package domain

// DTO para Reservaciones
type Reservation struct {
	Id        int     `json:"id"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
	UserId    int     `json:"user_id"`
	HotelId   string  `json:"hotel_id"`
	Amount    float64 `json:"amount"`
}
