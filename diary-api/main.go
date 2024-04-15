package main

import (
	"context"

	"github.com/contextcloud/goutils/xgraceful"
	"github.com/contextcloud/goutils/xservice"
	"github.com/getnoops/examples/diary-api/handler"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())

	cfg, err := xservice.NewConfig(ctx)
	if err != nil {
		panic(err)
	}

	handler, err := handler.NewHandler(ctx, cfg)
	if err != nil {
		panic(err)
	}

	xgraceful.Serve(ctx, cfg, handler)
	cancel()

	<-ctx.Done()
}
