-module(game_app).

-behaviour(application).

%% Application callbacks
-export([
  start/2,
  stop/1,
  dispatch_rules/0
]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

static_content_rule(Filetype) ->
  {lists:append(["/", Filetype, "/[...]"]), cowboy_static,
    {priv_dir, game, [list_to_binary(Filetype)], [
      {mimetypes, cow_mimetypes, all}
    ]}
  }.
%%+++++++++++++++++++++++++++++++++++++++++++++++++

dispatch_rules() ->
  cowboy_router:compile([
    {'_', [
      static_content_rule("css"),
      static_content_rule("js"),
      static_content_rule("img"),
      {"/", index_handler, []},
      {'_', notfound_handler, []}
    ]}
  ]).
%%+++++++++++++++++++++++++++++++++++++++++++++++++

start(_StartType, _StartArgs) ->
  Dispatch = dispatch_rules(),
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