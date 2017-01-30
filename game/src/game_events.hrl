%%%-------------------------------------------------------------------
%%% -*- coding: utf-8 -*-
%%% @author Dmitry Davidenko system.out@yandex.ru
%%% @copyright (C) 2017, Eltex, Novosibirsk, Russia
%%% @doc
%%%
%%% @end
%%% Created : 30. Jan 2017 12:44
%%%-------------------------------------------------------------------
-author("system.out@yandex.ru").

-define(GAME_EVENT_TEXT_NOTIFICATION, text_notification).

-type event_name() :: ?GAME_EVENT_TEXT_NOTIFICATION.

-record(game_event, {
    name :: event_name(),
    body :: term()
}).

