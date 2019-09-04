#!/usr/bin/env make

.PHONY: backend frontend

backend:
	@$(MAKE) -C backend all

frontend:
	@$(MAKE) -C frontend all
