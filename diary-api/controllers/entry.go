package controllers

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/swaggest/usecase"

	"github.com/getnoops/examples/diary-api/data"
	"github.com/getnoops/examples/diary-api/models"
)

func GetEntries(queries data.Queries) usecase.Interactor {
	type GetEntriesInput struct {
	}

	u := usecase.NewInteractor(func(ctx context.Context, input GetEntriesInput, output *[]*models.Entry) error {
		entries, err := queries.GetEntries(ctx)
		if err != nil {
			return err
		}

		*output = entries

		return nil
	})

	u.SetName("Get Entries")
	return u
}

func CreateEntry(queries data.Queries) usecase.Interactor {
	type CreateEntryInput struct {
		Text string `json:"text" required:"true"`
	}

	type CreateEntryOutput struct {
		Id uuid.UUID `json:"id" format:"uuid" required:"true"`
	}

	u := usecase.NewInteractor(func(ctx context.Context, input CreateEntryInput, output *CreateEntryOutput) error {
		raw := &models.Entry{
			Id:        uuid.New(),
			Text:      input.Text,
			CreatedAt: time.Now(),
		}

		entry, err := queries.CreateEntry(ctx, raw)
		if err != nil {
			return err
		}

		output.Id = entry.Id

		return nil
	})

	u.SetName("Get Entries")
	return u
}
