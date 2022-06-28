/-  slam, pals
/+  default-agent, dbug, server, schooner
/*  slamui  %html  /app/slamui/html
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
  :~  
    :*  %pass  /newpals  %agent
        [our.bowl %pals]  %watch  /targets
    ==  
    :*  %pass  /eyre/connect  %arvo  %e 
        %connect  `/apps/slam  %slam
    ==  
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
      (handle-action !<(action:slam vase))
    [cards this]
      %handle-http-request
    =^  cards  state
      (handle-http !<([@ta =inbound-request:eyre] vase))
    [cards this]
  ==
  ::
  ++  handle-action
    |=  =action:slam
    ^-  (quip card _state)
    ?-    -.action
        %hiscore
      =/  defendscore  +4:(~(got by profiles) our.bowl)
      ?:  (lth newscore:action defendscore)
        `state
      =/  invadescore  +5:(~(got by profiles) our.bowl)
      =/  goralist  +3:(~(got by profiles) our.bowl)
      =/  newprofile  [[newscore:action invadescore] goralist]
      :_  state(profiles (~(put by profiles) our.bowl newprofile))
      :~  :*  %give  %fact  ~[/updates/out]  %slam-update 
              !>(`update:slam`profile-update+newprofile)
      ==  ==
    ::
        %new-team
      =/  profilescore  +2:(~(got by profiles) our.bowl)
      =/  newprofile  [profilescore team:action]
      :_  state(profiles (~(put by profiles) our.bowl newprofile))
      :~  :*  %give  %fact  ~[/updates/out]  %slam-update 
              !>(`update:slam`profile-update+newprofile)
      ==  ==
    ::
        %invaded
      :_  state
      :~  :*  %give  %fact  ~[/updates/out]  %slam-update 
          !>(`update:slam`invasion-success+[name:action invader:action])
      ==  ==
    ==
  ++  handle-http
    |=  [eyre-id=@ta =inbound-request:eyre]
    ^-  (quip card _state)
    =/  ,request-line:server
      (parse-request-line:server url.request.inbound-request)
    =+  send=(cury response:schooner eyre-id)
      ?+  site  :_  state
                %-  send
                :+  404
                  ~
                [%plain "404 - Not Found"]
          [%apps %slam ~]
        :_  state
        %-  send
        :+  200
          ~
        [%html slamui]
     ==
  --
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?+    path  (on-watch:def path)
      [%http-response *]
    `this
      [%updates %out ~]
    ?.  (~(has by profiles) src.bowl)
      !!
    :_  this
    :~  :*  %give  %fact  ~  %slam-update
            !>(`update:slam`profile-update+(~(got by profiles) our.bowl))
        ==
        :*  %pass  /updates/in  %agent  
            [src.bowl %slam]  %watch  /updates/out
        ==
    ==
  ==
:: 
++  on-leave  on-leave:def
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %profiles ~]  ``slam-profiles+!>(profiles)
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
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
          ?.  =(our.bowl name:newupdate)
            `this
          =/  defendscore  +4:(~(got by profiles) our.bowl)
          =/  invadescore  +5:(~(got by profiles) our.bowl)
          =/  goralist  +3:(~(got by profiles) our.bowl)
          =/  newprofile  [[defendscore +(invadescore)] goralist]
          :_  this(profiles (~(put by profiles) our.bowl newprofile))
          :~  :*  %give  %fact  ~[/updates/out]  %slam-update
                  !>(`update:slam`profile-update+newprofile)
          ==  ==
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
        =/  neweffect  !<(effect:pals q.cage.sign)
        ?+    -.neweffect  (on-agent:def wire sign)
            %meet
          :_  this(profiles (~(put by profiles) [+.neweffect [0 0] ~]))
          :~  :*  %pass  /updates/in  %agent
                  [+.neweffect %slam]  %watch  /updates/out
          ==  ==
            %part
          :_  this(profiles (~(del by profiles) +.neweffect))
          :~  [%pass /updates/in %agent [+.neweffect %slam] %leave ~]
          ==
        ==
      ==
    ==
  ==
::
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?+  sign-arvo  (on-arvo:def wire sign-arvo)
      [%eyre %bound *]
    `this
  ==
++  on-fail   on-fail:def
--