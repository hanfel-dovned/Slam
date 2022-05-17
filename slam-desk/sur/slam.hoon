|%
+$  name  @p
+$  defend-score  @ud
+$  invade-score  @ud
::  +$  gora  [whatever a gora is]
::  +$  team  (list gora)
::  +$  profile  (map name [team defend-score invade-score])
+$  profile  (map name [defend-score invade-score])
+$  friends  (list profiles)
+$  myprofile  profile
+$  action
  $%  [%invaded =name]
      [%hiscore =defend-score]
      ::  [%newteam =team]
  ==
--
