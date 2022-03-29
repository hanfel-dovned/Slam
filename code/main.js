import kaboom from "kaboom"

function hsv2rgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5)*255,f(3)*255,f(1)*255];       
}   

bghue = Math.random()*360
bgcolor = hsv2rgb(bghue, .75, .75)

kaboom({
	background: [ bgcolor[0], bgcolor[1], bgcolor[2] ],
    width: 1200,
    height: 700
})

loadSound("music", "/sounds/delete-this-music.mp3")
//const music = play("music", {
//	loop: true,
//})
play("music")
//volume(0.5)

//TODO: handle case where gora fails to load
loadSprite("bean", "https://minderimages.nyc3.digitaloceanspaces.com/minder-folden/2022.1.13..22.42.38-Week%2002%202022.png")
loadSprite("player", "https://nyc3.digitaloceanspaces.com/archiv/littel-wolfur/2021.11.02..21.41.08-image.png")
loadSprite("zod", "sprites/zod.png")

gorasize = 50
score = 0

layers([
    "bg",
    "game",
    "ui",
], "game")

bgdrawer = add([
    layer("bg"),
    pos(-10, -10),
    {
        size: 500,
        color: hsv2rgb(bghue, .8, .4)
    }
])

colorcounter = 0
bgdrawer.onDraw(() => {
    drawRect({
        pos: vec2(0),
        width: width() + 20,
        height: height() + 20,
        color: rgb(bgcolor[0] + colorcounter, bgcolor[1] + colorcounter, bgcolor[2] + colorcounter),
    })
    colorcounter = Math.sin(time()*2)*20
})

scoreboard = add([
    layer("bg"),
    pos(-1000, -1000),
    {
        size: 500,
        color: hsv2rgb(bghue, .8, .4)
    }
])

scoreboard.onUpdate(() => {
    scoreboard.pos.x -= .5
    if(scoreboard.pos.x < -scoreboard.size)
    {
        scoreboard.pos.x = width()
        scoreboard.pos.y = rand(scoreboard.size, height() - scoreboard.size)
    }
})

scoreboard.onDraw(() => {
    drawText({
		text: score,
        font: "sink",
		pos: vec2(0, 0),
		origin: "center",
        size: scoreboard.size,
        color: rgb(scoreboard.color[0], scoreboard.color[1], scoreboard.color[2]),
        opacity: .1
	})
})


effectdrawer = add([
    layer("ui"),
    pos(0, height()/2),
    {
        color: hsv2rgb(bghue, .8, .4)
    }
])

effectdrawer.onDraw(() => {
    for(i = 0; i < 12; i++)
    {
        drawRect({
            pos: (100*i+Math.sin(time())*1000, 100*i+Math.cos(time())*800),
            width: 20,
            height: 20,
            //color: rgb(0, 0, 0)
            color: rgb(effectdrawer.color[0], effectdrawer.color[1], effectdrawer.color[2]),
            opacity: .4
        })
    }
})

effectdrawer.onUpdate(() => {
    effectdrawer.pos.y = Math.sin(time())*100
    /*if(effectdrawer.pos.x < -effectdrawer.size)
    {
        effectdrawer.pos.x = width()
        effectdrawer.pos.y = rand(effectdrawer.size, height() - effectdrawer.size)
    }*/
})



/**************** PLAYER ****************/
player = add([
	sprite("player", {width: gorasize, height: gorasize}),
    //scale(.7, .7),
	pos(width()/2, height()/2 - 100),
	area(),
    origin("center"),
    {
        charging: 0,
        slamming: 0,
        slamdirection: 0,
        
        slamspeed: 2500,

        //charge impacts the distance/duration of slamming
        //slamming speed is constant regardless of charge level
        charge: 0,
        maxcharge: 120,
        chargerate: 5,
        chargeloss: 15,
        movespeed: 400,
    }
])

//Mouse Controls - Charging and Slamming
onMousePress(() => {
        player.charging = 1
})

onMouseDown(() => {
    if(player.charge < player.maxcharge && player.charging == 1)
        player.charge += player.chargerate;
    player.move(Vec2.fromAngle(rand(360)).scale(30))
})

onMouseRelease(() => {
    if(player.charging == 1)
    {
        player.charging = 0;
        player.slamming = 1;
        player.slamdirection = player.pos.angle(mousePos())
        player.color = rgb()
        player.slamspeed = player.charge * 10
        player.charge = 0
    }
})

player.onUpdate(() => {
    //Loop around edge of screen
    if(player.pos.x < 0)
        player.pos.x = width() - 1;
    if(player.pos.x > width())
        player.pos.x = 1
    if(player.pos.y < 0)
        player.pos.y = height() - 1;
    if(player.pos.y > height())
        player.pos.y = 1

    if(player.slamming == 1)
    {
        player.move(Vec2.fromAngle(player.slamdirection).scale(-player.slamspeed))
        player.slamspeed -= 20

        if(player.slamspeed <= 0)
            player.slamming = 0;
    }
})

player.onCollide("enemy", (enemy) => {
    if(player.slamming == 1)
    {
        enemy.direction = player.slamdirection
        player.slamdirection = player.slamdirection + 180
        //enemy.speed = player.slamspeed 
        enemy.charge = player.slamspeed
	    player.slamspeed = player.slamspeed * .5
        enemy.attacked = 1
        shake(5)
    }
    /*else
    {
        enemy.direction = rand(360)
        enemy.speed = 100
        enemy.charge = 100
        enemy.attacked = 1
    }*/
})

player.isColliding("enemy", (enemy) => {
   // if(player.slamming == 0)
    //{
        enemy.direction = 150
        player.slamdirection = player.slamdirection + 180
        //enemy.speed = player.slamspeed 
        enemy.charge = player.slamspeed
	    player.slamspeed = player.slamspeed * .5
        enemy.attacked = 1
        shake(5)
    //}
})

//Draw the black circle around the gora sprite
goraBackground = rgb(0, 0, 0)
player.onDraw(() => {
    goraBackground = rgb(player.charge*(255/player.maxcharge), 0, 0)
    drawCircle({
        pos: vec2(0),
        radius: gorasize*.8,
        color: goraBackground,
        outline: {width: 1, color: rgb(0, 0, 0)}
    })
    drawSprite({
        sprite: "player",
        pos: vec2(0),
        width: gorasize, 
        height: gorasize,
        origin: "center"
    })
    //Draw rings to make sprite look circular
    /*for(i = 0; i < 7; i++)
    {
        drawCircle({
            pos: vec2(0),
            radius: gorasize*(.7-i*.03),
            outline: {width: 4, color: goraBackground},
            fill: false,
        })
    }
    drawCircle({
            pos: vec2(0),
            radius: gorasize*(.7-i*.03),
            outline: {width: 4, color: goraBackground},
            fill: false,
        })*/
})



ship = add([
	sprite("zod", {width: gorasize, height: gorasize}),
    //scale(.7, .7),
	pos(width()/2, height()/2),
	area(),
    origin("center"),
    layer("bg")
])




/**************** ENEMY ****************/
tempsprite = "player"

/*enemy1 = [
	sprite(tempsprite, {width: gorasize, height: gorasize}),
	pos(rand(gorasize, width()-gorasize), rand(gorasize, height()-gorasize)),
	area({scale: 1.2}),
    origin("center"),
    color = rgb(100, 100, 0),
    {
        direction: 0,
        charge: 0,
        attacked: 0,
        death: 0,
        deathglow: 0
    },
    "enemy"
]*/

//add(enemy1)


spawnpositionx = -20
spawnpositiony = -20
spawnseed = 0

invasionspeed = 1
spawntime = 3
wavesize = 1

loop(2, () => {
    //wavesize += 1

    //invasionspeed += .01
    //if(spawntime > .2)
    //    spawntime -= .2

    
    //invasionspeed = rand(2)

    issuer = rand(255)
    pal = rand(255)
    hue = pal * 360/255
    
    weight = issuer/255
    size = gorasize + (gorasize * (weight-.5))
    invasionspeed = 1 - weight

    
    spawnseed = rand(4)
    if(spawnseed < 1)
    {
        spawnpositionx = -100
        spawnpositiony = rand(height())
    }
    else if(spawnseed < 2)
    {
        spawnpositionx = width() + 100
        spawnpositiony = rand(height())
    }
    else if(spawnseed < 3)
    {
        spawnpositionx = rand(width())
        spawnpositiony = -100
    }
    else if(spawnseed < 4)
    {
        spawnpositionx = rand(width())
        spawnpositiony = height() + 100
    }

    add([
        sprite(tempsprite, {width: size, height: size}),
        pos(spawnpositionx, spawnpositiony),
        //move(ship.pos.angle(pos), 12),
        area({scale: 1.2}),
        origin("center"),
        //color = rgb(100, 100, 0),
        {
            direction: 0,
            charge: 0,
            attacked: 0,
            death: 0,
            deathglow: 0,
            issuer: issuer,
            invasionspeed: invasionspeed,
            weight: weight,
            size: size,
            pal: pal,
            color: hsv2rgb(hue, 1, 1 - weight*.7)
        },
        "enemy"
    ])
})

buffer = gorasize*.8
onUpdate("enemy", (enemy) => {
    //Enemies die when they hit the edge of the screen
    if(enemy.pos.x > width() + buffer || enemy.pos.x < -buffer || enemy.pos.y > height() + buffer || enemy.pos.y < -buffer)
    {
        if(enemy.attacked == 1)
        {
            destroy(enemy)
            score += 1
            //enemy.death = 1
            //enemy.attacked = 0
        }
    }

    //Death Animation
    if(enemy.death == 1)
    {
        if(enemy.deathglow > 255)
        {   
            //enemy.pos.x = rand(gorasize, width() - gorasize)
            //enemy.pos.y = rand(gorasize, height() - gorasize)
            //add(enemy1)
            destroy(enemy)
            score += 1
        }
        
        enemy.deathglow += 50
        enemy.scale = 1 + enemy.deathglow/100
    }
    
    if(enemy.attacked == 1 && enemy.death == 0)
    {
        enemy.move(Vec2.fromAngle(enemy.direction).scale(-enemy.charge))
        //enemy.charge -= 0
        enemy.charge -= enemy.weight*100 //make this weight

        if(enemy.charge <= 0)
        {
            enemy.attacked = 0;
            enemy.charge = 0;
        }
    }
    else if(enemy.death == 0)
    {
        //if (!player.exists()) return
	    //const dir = player.pos.sub(enemy.pos).unit()
	    //enemy.move(dir.scale(200)) 
        //enemy.move(vec2(width()/2, height()/2).angle(enemy.pos).scale(.1*invasionspeed))
        enemy.moveTo(width()/2, height()/2, enemy.invasionspeed*200)
        //enemy.move(Math.cos(width()/2), Math.sin(height()/2))
    }
})

onCollide("enemy", "enemy", (enemy1, enemy2) => {
    enemy1.death = 1
    enemy2.death = 1
})



//Enemies don't have circular sprites because that slows the game down too much
//Should the player not have a circular sprite either then?
onDraw("enemy", (enemy) => {
    drawCircle({
        pos: vec2(0),
        radius: enemy.size*.8,
        //color: rgb(255-enemy.issuer, 255-enemy.issuer, 255-enemy.issuer),
        color: rgb(enemy.color[0], enemy.color[1], enemy.color[2]),
        outline: {width: 1, color: rgb(0, 0, 0)}
    })
    drawSprite({
        sprite: "bean",
        pos: vec2(0),
        width: enemy.size, 
        height: enemy.size,
        origin: "center"
    })
})



