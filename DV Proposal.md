# DV Proposal

## Section 1: Basic information

Project title：LOL 2022 World Championship and all last 8 years hero ban/pick rate data visulize
連庭萱 40847024S 40847024s@gapps.ntnu.edu.tw
高子翔 40847011S 40847011s@gapps.ntnu.edu.tw

## Section 2: Overview
Since eSport is going viral nowadays, some people
 are dedicated to the field, and lots of money also is invested in the e-sports industry.
If we can know which player is more valuable, we can invest in the team more accurately. The coach can better analyze each team and formulate better strategies according to the characteristics of the opponents and themselves.
Therefore, our program can provide battlefield information such as the winning percentage and DMG% of each player.
In addition, due to the change of the role value in the version update of LOL, the strong characters on the field over the years have been changed. We also provide a visual graph of the trend in role usage in 2014-2022.



## Section3: Data and Data Processing
1. Games of Legends 2022 World Champioship data: https://gol.gg/players/list/season-ALL/split-ALL/tournament-World%20Championship%202022/
    - We will use following data to visualize bar chart
        - Player: player name
        - Country: player's country (abbreviation)
        - Position: the player's main role in the game
        - KDA: (average kills + average assist) / average deaths
        - DPM: average damage to champions per minute per game
        - DMG%: average share of team's total damage to champions per game
        - GPM: average gold per minute per game
        - KP%: average kill participation per game
        - VSPM: average vision score per minute per game
        - FB%: firstblood participation (kill or assist)
    - there are 86 data
2. Self made player-team data
    - Because we can't find an efficient data set that include the player name related to his team, so we made one by ourselves. It include two column:
        - Player: player name
        - Team: team name
3. Self made country and its latitude and longitude data
    - Because we don't need all countries data in the world, and the country name in 1. is abbreviation, so we made a data table which has three column:
        - Country: country name (abbreviation)
        - latitude: country's latitude
        - longitude: country's longitude
4. World map json:
    https://geojson-maps.ash.ms/
## Section 4: Usage scenarios & tasks
1. If I'm a coach: I can check next opponent's data, like who has the highest DMG%, highest GPM, highest FB% and so on. Then I can make particular decision in ban/pick to against their strategy.
2. If I'm a team manager：After a series, I can check all player at the same role in game. When a player has his characteristic that might help my team, I can try poach him. Like Oner from SKT T1 has highest DMG% amount all TOP players.
3. We can tell in this World Championship's version, which role has higher FB%, DMG%, GMP and so on.
4. We can see the characteristics of players from different countries or teams, such as whether the economy is more inclined to ADC or MID, and what is their DMG%, and so on.
5. Can see different popular character from 8 years ago to now.
## Section 5: Visualization Design & Sketch
Using world map to show the player's nationality like previous D3 homework. Use people amount as radius to draw the circle. If there is a limit to the scope of the data, it will change accordingly.
![](https://img-blog.csdnimg.cn/2021020618390621.gif#pic_center)
On a picture similar to the one below, the distribution of players is presented in the same way as the world map, but divided by their own role. Similarly, if there is a limit to the scope of the data, it will also change accordingly.
![](https://i.imgur.com/rqdrwdr.png)
Users can check specific teams to be displayed.
![](https://i.imgur.com/O6dBoK3.png)
Use the number of players as the y-axis, and KDA, DPM, DMG%, GPM, KP%, VSPM, and FB% as the x-axis to draw their respective bar charts. In order to avoid the screen being too cluttered, users can only display up to three bar graphs at the same time. As with the d3 homework, the user can choose the scope of the data they want to see.
![](https://i.imgur.com/4NdrBq4.png)
Using dynamic bar chart to show the trend of all heroes' ban/pick in last 8 years.
![](https://img-blog.csdnimg.cn/20210206182834129.gif#pic_center)

## Section 6: Work breakdown and schedule


預期完成時間 12/18
Final project Deadline：2022年 12月 21日(三) 23:59
![](https://i.imgur.com/bxn5YhC.png)


## Reference
https://blog.csdn.net/Altair_alpha/article/details/113728267