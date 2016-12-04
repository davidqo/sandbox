-module(index_handler).

%% Cowboy_http_handler callbacks
-export([
	init/2,
	terminate/3
]).

init(Req, State) ->
	Body = game_utils:get_request_body(Req),
	Username = game_utils:get_value(<<"username">>, Body, "stranger"),
	{ok, HTML} = index_dtl:render([{username, Username}]),
	{ok, Req3} = cowboy_req:reply(200, #{}, HTML, Req),
	{ok, Req3, State}.
%%+++++++++++++++++++++++++++++++++++++++++++++++++

terminate(_Reason, _Req, _State) ->
	ok.
%%+++++++++++++++++++++++++++++++++++++++++++++++++