-module(websocket_handler).

-include("../game_events.hrl").

-export([init/2]).
-export([websocket_init/1]).
-export([websocket_handle/2]).
-export([websocket_info/2]).

init(Req, Opts) ->
	{cowboy_websocket, Req, Opts}.
%%+++++++++++++++++++++++++++++++++++++++++++++++++

websocket_init(State) ->
	try
		erlang:start_timer(1000, self(), <<"Hello!">>),
		{ok, State}
	catch
		_:Error ->
			error_logger:error_msg("~p ~p", [Error, erlang:get_stacktrace()])
	end.
%%+++++++++++++++++++++++++++++++++++++++++++++++++

websocket_handle({text, Msg}, State) ->
	try
		{reply, {text, << "That's what she said! ", Msg/binary >>}, State}
	catch
		_:Error ->
			error_logger:error_msg("~p ~p", [Error, erlang:get_stacktrace()])
	end;
websocket_handle(_Data, State) ->
	{ok, State}.
%%+++++++++++++++++++++++++++++++++++++++++++++++++

websocket_info({timeout, _Ref, Msg}, State) ->
	try
		erlang:start_timer(1000, self(), <<"How' you doin'?">>),
		EncodedEvent = game_utils:encode_event(#game_event{name = ?GAME_EVENT_TEXT_NOTIFICATION, body = Msg}),
		error_logger:info_msg("Encoded event: ~p", [EncodedEvent]),
		{reply, {text, EncodedEvent}, State}
	catch
		_:Error ->
			error_logger:error_msg("~p ~p", [Error, erlang:get_stacktrace()])
	end;
websocket_info(_Info, State) ->
	{ok, State}.
%%+++++++++++++++++++++++++++++++++++++++++++++++++