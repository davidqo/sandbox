-module(game_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

start(_StartType, _StartArgs) ->
    Dispatch = cowboy_router:compile([
        {'_', [
            {"/", index_handler, #{}},
            {'_', notfound_handler, #{}}
        ]}
    ]),
    Port = 18080,
    {ok, _} = cowboy:start_clear(http_listener, 100,
        [{port, Port}],
        #{env => #{dispatch => Dispatch}}
    ),
    game_sup:start_link().
%%+++++++++++++++++++++++++++++++++++++++++++++++++

stop(_State) ->
    ok.
%%+++++++++++++++++++++++++++++++++++++++++++++++++
