|%
+$  name  @p
+$  defend-score  @ud
+$  invade-score  @ud
+$  profile  (map name [defend-score invade-score])
+$  profiles  (list profile)
+$  action
  $%  [%hiscore =defend-score]
      ::  [%invaded =name]
      ::  [%newteam =team]
  ==
--


::  Implement these later
::  +$  gora  [whatever a gora is]
::  +$  team  (list gora)
::  +$  profile  (map name [team defend-score invade-score])

::  Seperate out myprofile?
::  +$  friends  (list profile)
::  +$  myprofile  profile
