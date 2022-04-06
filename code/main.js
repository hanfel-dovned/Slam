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

loadSound("music", "/sounds/delete-this-music2.wav")
//const music = play("music", {
//	loop: true,
//})
music = play("music", {loop: true})
//volume(0.5)

loadSound("explosion", "/sounds/explosion.wav")
loadSound("charge", "/sounds/charge.wav")
loadSound("slam", "/sounds/slam.wav")
loadSound("bump", "/sounds/bump.wav")

//TODO: handle case where gora fails to load
loadSprite("bean", "https://minderimages.nyc3.digitaloceanspaces.com/minder-folden/2022.1.13..22.42.38-Week%2002%202022.png")
loadSprite("player", "https://nyc3.digitaloceanspaces.com/archiv/littel-wolfur/2021.11.02..21.41.08-image.png")
loadSprite("ship", "sprites/sampel-palnet.png")

gorasize = 50
score = 0
gameover = 0

layers([
    "bg",
    "game",
    "ui",
    "gameover"
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
    if(gameover == 0)
        play("charge", {volume: .5})
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
        if(gameover == 0)
            play("slam", {volume: .5})
    }
})

player.onUpdate(() => {
    //Loop around edge of screen
    if(player.pos.x < 0)
        player.pos.x = 0
    if(player.pos.x > width())
        player.pos.x = width()
    if(player.pos.y < 0)
        player.pos.y = 0
    if(player.pos.y > height())
        player.pos.y = height()

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
        if(gameover == 0)
        {
            shake(5)
            play("bump", {volume: .5})
        }
    }
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
})



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

    if(gameover == 0)
    {
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
    }
})

buffer = gorasize*.8
onUpdate("enemy", (enemy) => {
    //Enemies die when they hit the edge of the screen
    if(enemy.pos.x > width() + buffer || enemy.pos.x < -buffer || enemy.pos.y > height() + buffer || enemy.pos.y < -buffer)
    {
        if(enemy.attacked == 1)
        {
            destroy(enemy)
            play("explosion")
            if(gameover == 0)
                score += 1
        }
    }

    //Death Animation
    if(enemy.death == 1)
    {
        if(enemy.deathglow > 255)
        {   
            destroy(enemy)
            play("explosion")
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
        if(!enemy.isColliding(player)) 
            enemy.moveTo(width()/2, height()/2, enemy.invasionspeed*200)
        else
            enemy.move(Vec2.fromAngle(enemy.direction).scale(-100))
    }
})

onCollide("enemy", "enemy", (enemy1, enemy2) => {
    enemy1.death = 1
    enemy2.death = 1
})


onDraw("enemy", (enemy) => {
    //if(enemy.isColliding(player) && enemy.attacked == 1) 
    //    drawcolor = rgb(255, 255, 255)
    //else
        drawcolor = rgb(enemy.color[0], enemy.color[1], enemy.color[2])
    
    drawCircle({
        pos: vec2(0),
        radius: enemy.size*.8,
        color: drawcolor,
        //color: rgb(enemy.color[0], enemy.color[1], enemy.color[2]),
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




ship = add([
	sprite("ship", {width: gorasize, height: gorasize}),
    //scale(.7, .7),
	pos(width()/2, height()/2),
	area(),
    origin("center"),
    layer("bg")
])

ship.onDraw(() => {
    drawCircle({
        pos: vec2(0),
        radius: gorasize*.8 + Math.sin(time())*3,
        color: rgb(0,0,0)
    })
    drawSprite({
        sprite: "ship",
        pos: vec2(0),
        width: gorasize*.8 + Math.sin(time())*3, 
        height: gorasize*.8 + Math.sin(time())*3,
        origin: "center"
    })
})

gameoverenemypos = vec2(0)
gameoverenemysize = 0

ship.onCollide("enemy", (enemy) => {
    if(gameover == 0 && enemy.death == 0)
    {
        play("explosion")
        music.pause()
        gameover = 1
        gameoverenemypos = enemy.pos 
        gameoverenemysize = enemy.size
        destroyAll("enemy")
    }
})

gameoverdrawer = add([
    layer("gameover"),
    pos(0, 0)
])

scoreopacity = -10
gameoverdrawer.onDraw(() => {
    if(gameover == 1)
    {
        drawRect({
            pos: vec2(-20, -20),
            width: width() + 40,
            height: height() + 40,
            color: rgb(255, 255, 255),
        })
        drawCircle({
            pos: center(),
            radius: gorasize*.8+3,
            color: rgb(0,0,0)
        })
        drawSprite({
            sprite: "ship",
            pos: center(),
            origin: "center",
            width: gorasize,
            height: gorasize
        })
        
        drawCircle({
            pos: gameoverenemypos,
            radius: gameoverenemysize*.8,
            color: rgb(0, 0, 0),
        })

        drawText({
    		text: score,
            font: "sink",
    		pos: vec2(width()*.5, height()*.25),
    		origin: "center",
            size: scoreboard.size*.25,
            color: rgb(0, 0, 0),
            opacity: scoreopacity
	    })

        if(scoreopacity < 1)
            scoreopacity += .1
    }
})