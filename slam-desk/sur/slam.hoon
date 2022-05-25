|%
+$  name  @p
+$  score  [defend=@ud invade=@ud]
+$  invader  [name=@t image-url=@t issuer=@p]
+$  team  (list invader)
+$  profile  [score team]
+$  profiles  (map name profile)
+$  action
  $%  [%hiscore newscore=@ud]
      [%new-team =team]
      [%add-friend name=@p]
      ::  [%invaded =name =gora]
  ==
+$  update
  $%  [%profile-update =profile]
  ::    [%invasion-success]
  ==
--