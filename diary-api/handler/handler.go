package handler

import (
	"context"
	"net/http"

	"github.com/contextcloud/goutils/xes"
	"github.com/contextcloud/goutils/xgorm"
	"github.com/contextcloud/goutils/xopenapi"
	"github.com/contextcloud/goutils/xservice"
	"github.com/getnoops/examples/diary-api/controllers"
	"github.com/getnoops/examples/diary-api/data"

	"github.com/rs/cors"
	"github.com/swaggest/rest/nethttp"
)

type Config struct {
	DB xgorm.DbConfig

	Security struct {
		SignKey string
	}
}

func NewCors() *cors.Cors {
	return cors.New(cors.Options{
		AllowCredentials: true,
		AllowedHeaders: []string{
			"Accept",
			"Accept-Language",
			"Authorization",
			"Content-Type",
			"Origin",
			"X-Requested-With",
		},
		AllowedMethods: []string{
			http.MethodHead,
			http.MethodOptions,
			http.MethodGet,
			http.MethodPost,
		},
		ExposedHeaders: []string{
			"Location",
			"Content-Length",
		},
		AllowedOrigins: []string{
			"http://localhost:3000",
			"https://diary.dev.playground.n-cc.net",
			"https://diary.prod.playground.n-cc.net",
		},
	})
}

func NewHandler(ctx context.Context, cfg *xservice.ServiceConfig) (http.Handler, error) {
	appcfg := &Config{}
	if err := cfg.Parse(appcfg); err != nil {
		return nil, err
	}

	queries, err := data.New(ctx, &appcfg.DB)
	if err != nil {
		return nil, err
	}

	security, err := xes.NewSecurity(appcfg.Security.SignKey)
	if err != nil {
		return nil, err
	}

	cors := NewCors()

	s := xopenapi.New(cfg, cors.Handler, security.Anonymous())

	s.Get("/entries", controllers.GetEntries(queries), nethttp.SuccessStatus(http.StatusOK))
	s.Post("/entry", controllers.CreateEntry(queries), nethttp.SuccessStatus(http.StatusCreated))

	return s, nil
}
