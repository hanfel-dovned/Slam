/-  slam
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 =profiles:slam]
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
::
++  on-init
  ^-  (quip card _this)
  `this(profiles ~[(my ~[[our.bowl 0 0]])])
::
++  on-save
  ^-  vase
  !>(state)
::
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
    %0  `this(state old)
  ==
::
++  on-poke  on-poke:def
::  |=  [=mark =vase]
::  ^-  (quip card _this)
::  |^
::  ?>  =(src.bowl our.bowl)
::  ?+    mark  (on-poke:def mark vase)
::      %todo-action
::    =^  cards  state
::      (handle-poke !<(action:todo vase))
::    [cards this]
::  ==
::  ::
::  ++  handle-poke
::    |=  =action:todo
::    ^-  (quip card _state)
::    ?-    -.action
::        %hiscore
::      `state(tasks (~(put by tasks) now.bowl [name.action %.n]))
::    ::
::    ::    %invaded
::    ::  `state(friends (~(put in friends) who.action))
::    ==
::  --
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
