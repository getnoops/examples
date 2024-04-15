package data

import (
	"context"

	"github.com/contextcloud/goutils/xgorm"
	"github.com/contextcloud/goutils/xlog"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"

	"github.com/getnoops/examples/diary-api/models"
)

type Queries interface {
	GetEntries(ctx context.Context) ([]*models.Entry, error)
	CreateEntry(ctx context.Context, entry *models.Entry) (*models.Entry, error)
}

type queries struct {
	db *gorm.DB
}

func (q *queries) GetEntries(ctx context.Context) ([]*models.Entry, error) {
	var entries []*models.Entry

	err := q.db.Find(&entries).Error
	if err != nil {
		return nil, err
	}

	return entries, nil
}

func (q *queries) CreateEntry(ctx context.Context, entry *models.Entry) (*models.Entry, error) {
	err := q.db.
		Create(entry).
		Error
	if err != nil {
		return nil, err
	}
	return entry, nil
}

func New(ctx context.Context, dbConfig *xgorm.DbConfig) (Queries, error) {
	log := xlog.Logger(ctx)

	opts := []xgorm.Option{
		xgorm.WithTracing(),
		xgorm.WithLogger(log.ZapLogger(), gormlogger.Warn),
		xgorm.WithAutoMigrate(),
		xgorm.WithModels(
			&models.Entry{},
		),
	}

	db, err := xgorm.NewDb(ctx, dbConfig, opts...)
	if err != nil {
		return nil, err
	}

	return &queries{db: db}, nil
}
