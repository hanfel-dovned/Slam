|%
+$  name  @p
+$  score  [defend=@ud invade=@ud]
+$  gora  @t  ::placeholder typedef
+$  team  (set gora)
+$  profile  [score team]
+$  profiles  (map name profile)
+$  action
  $%  [%hiscore newscore=@ud]
      [%add-friend name=@p]
      ::  [%invaded =name =gora]
      ::  [%newteam =team]
  ==
+$  update
  $%  [%profile-update =profile]
  ::    [%invasion-success]
  ==
--