package models

import (
	"time"

	"github.com/google/uuid"
)

type Entry struct {
	Id        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id" format:"uuid"`
	Text      string    `gorm:"not null" json:"text"`
	CreatedAt time.Time `gorm:"not null" json:"createdAt"`
}
