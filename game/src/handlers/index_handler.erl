-module(index_handler).

%% Cowboy_http_handler callbacks
-export([
	init/2,
	terminate/3
]).

init(Req, State) ->
	Body = <<"<h1>It works!</h1>">>,
	{ok, Req2} = cowboy_req:reply(200, #{}, Body, Req),
	{ok, Req2, State}.
%%+++++++++++++++++++++++++++++++++++++++++++++++++

terminate(_Reason, _Req, _State) ->
	ok.
%%+++++++++++++++++++++++++++++++++++++++++++++++++