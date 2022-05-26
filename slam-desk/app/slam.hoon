/-  slam, pals
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
  :_  this(profiles (my ~[[our.bowl [[0 0] ~]]]))
  :~  [%pass /newpals %agent [our.bowl %pals] %watch /targets]
  ==
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
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  |^
  ?>  =(src.bowl our.bowl)
  ?+    mark  (on-poke:def mark vase)
      %slam-action
    =^  cards  state
      (handle-poke !<(action:slam vase))
    [cards this]
  ==
  ::
  ++  handle-poke
    |=  =action:slam
    ^-  (quip card _state)
    ?-    -.action
        %hiscore
      :: should this check if newscore > oldscore? or can frontend just do that?
      =/  invadescore  +5:(~(got by profiles) our.bowl)
      =/  goralist  +3:(~(got by profiles) our.bowl)
      :_  state(profiles (~(put by profiles) our.bowl [[newscore:action invadescore] goralist]))
      :~  [%give %fact ~[/updates/out] %slam-update !>(`update:slam`profile-update+[[newscore:action invadescore] goralist])]
      ==
    ::
        %new-team
      =/  profilescore  +2:(~(got by profiles) our.bowl)
      =/  goralist  team:action
      :_  state(profiles (~(put by profiles) our.bowl [profilescore goralist]))
      :~  [%give %fact ~[/updates/out] %slam-update !>(`update:slam`profile-update+[profilescore goralist])]
      ==
    ::
        %add-friend
      :_  state(profiles (~(put by profiles) [name:action [0 0] ~]))
      :~  [%pass /updates/in %agent [name:action %slam] %watch /updates/out]
      ==
    ::
        %invaded
      :_  state
      :~  [%give %fact ~[/updates/out] %slam-update !>(`update:slam`invasion-success+[name:action invader:action])]
      ==
    ==
  --
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?+    path  (on-watch:def path)
      [%updates %out ~]
    ?.  (~(has by profiles) src.bowl)
      !!
    :_  this
    :~  [%give %fact ~ %slam-update !>(`update:slam`profile-update+(~(got by profiles) our.bowl))]
        [%pass /updates/in %agent [src.bowl %slam] %watch /updates/out]
    ==
  ==
:: 
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ~&  'update!'
  ?+    wire  (on-agent:def wire sign)
      [%updates %in ~]
    ?+    -.sign  (on-agent:def wire sign)
        %fact
      ?+    p.cage.sign  (on-agent:def wire sign)
          %slam-update
        =/  newupdate  !<(update:slam q.cage.sign)
        ?-    -.newupdate
            %profile-update
          `this(profiles (~(put by profiles) [src.bowl profile:newupdate]))
          ::
            %invasion-success
          =/  defendscore  +4:(~(got by profiles) our.bowl)
          =/  invadescore  +5:(~(got by profiles) our.bowl)
          =/  goralist  +3:(~(got by profiles) our.bowl)
          ?.  =(our.bowl name:newupdate)
            `this
          :_  this(profiles (~(put by profiles) our.bowl [[defendscore +(invadescore)] goralist]))
          :~  [%give %fact ~[/updates/out] %slam-update !>(`update:slam`profile-update+[[defendscore +(invadescore)] goralist])]
          ==
        ==
      ==
        %kick
      :_  this
      :~  [%pass /updates/in %agent [src.bowl %slam] %watch /updates/out]
      ==
    ==
      [%newpals ~]
    ?+    -.sign  (on-agent:def wire sign)
        %fact
      ?+    p.cage.sign  (on-agent:def wire sign)
          %pals-effect
        =/  neweffect  !<(effect:pals q.cage.sign)  ::probably need to import pals/mar?
        ?+    -.neweffect  (on-agent:def wire sign)
            %meet
          :_  this(profiles (~(put by profiles) [+.neweffect [0 0] ~]))
          :~  [%pass /updates/in %agent [+.neweffect %slam] %watch /updates/out]
          ==
            %part
          :_  this(profiles (~(del by profiles) +.neweffect))
          :~  [%pass /updates/in %agent [+.neweffect %slam] %leave ~]
          ==
        ==
      ==
    ==
  ==
::
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--