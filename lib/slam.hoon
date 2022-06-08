/-  *slam
|%
++  enjs-profiles
  =,  enjs:format
  |=  profs=profiles
  ^-  json
  %-  pairs:enjs:format
  %+  turn 
    %~  tap  by  profiles
  |=  prof=[@p [[@ud @ud] (list [@t @t @p])]]
  :-  `@t`(scot %p -.prof)
  :-  %a
  :~ 
      (numb:enjs:format +<-:prof)
      (numb:enjs:format +<+.prof)
      %-  pairs:enjs:format 
      %+  turn
        +>.prof
      |=  gora=[@t @t @p]
      :-  -.gora
      :-  %a
      :~
         (frond:enjs:format 'gora-url' s++<.gora)
         (frond:enjs:format 'issuer' s+(scot %p +>.gora))
      ==
  ==