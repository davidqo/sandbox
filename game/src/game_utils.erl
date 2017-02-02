-module(game_utils).

-include("game_events.hrl").

%% Cowboy_http_handler callbacks
-export([
	get_request_info/2,
	get_request_body/1,
	get_value/2,
	get_value/3,
	encode_event/1,
	encode_events/1
]).

get_request_body(Request) ->
	cowboy_req:parse_qs(Request).
%%+++++++++++++++++++++++++++++++++++++++++++++++++

get_value(Key, Body) ->
	get_value(Key, Body, undefined).
%%+++++++++++++++++++++++++++++++++++++++++++++++++

get_value(Key, Body, Default) ->
	proplists:get_value(Key, Body, Default).
%%+++++++++++++++++++++++++++++++++++++++++++++++++

get_request_info(url, Req) ->
	cowboy_req:uri(Req).
%%+++++++++++++++++++++++++++++++++++++++++++++++++

encode_event(Event) ->
	encode_events([Event]).
%%+++++++++++++++++++++++++++++++++++++++++++++++++

encode_events(Events) ->
	events_to_json(Events).
%%+++++++++++++++++++++++++++++++++++++++++++++++++

events_to_json(Events) ->
	jsx:encode([do_event_to_json(E) || E <- Events]).
%%+++++++++++++++++++++++++++++++++++++++++++++++++

do_event_to_json(#game_event{name = EventName, body = Body}) ->
	[
		{<<"name">>, atom_to_binary(EventName, latin1)},
		{<<"body">>, body_to_json(EventName, Body)}
	].
%%+++++++++++++++++++++++++++++++++++++++++++++++++

body_to_json(?GAME_EVENT_TEXT_NOTIFICATION, Text) ->
	unicode:characters_to_binary(Text).
%%+++++++++++++++++++++++++++++++++++++++++++++++++