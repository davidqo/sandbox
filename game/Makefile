REBAR = ./rebar

all: deps compile

deps:
	@( $(REBAR) get-deps )

compile: 
	@( $(REBAR) compile )

clean:
	@( $(REBAR) clean )

run:
	@( erl -pa $(PWD)/ebin -pa deps/*/ebin -s game_webserver )

.PHONY: all deps compile clean run
