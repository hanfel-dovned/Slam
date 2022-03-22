import kaboom from "kaboom"

kaboom({
	background: [ 200, 200, 255 ],
    width: 1200,
    height: 700
})

loadSound("music", "/sounds/music.mp3")
const music = play("music", {
	loop: true,
})
//volume(0.5)

//TODO: handle case where gora fails to load
loadSprite("bean", "https://minderimages.nyc3.digitaloceanspaces.com/minder-folden/2022.1.13..22.42.38-Week%2002%202022.png")
loadSprite("player", "https://nyc3.digitaloceanspaces.com/archiv/littel-wolfur/2021.11.02..21.41.08-image.png")

gorasize = 50
score = 0

onDraw(() => {
    drawText({
		text: score,
		pos: vec2(width()/2, height()/2),
		origin: "center",
	})
})




/**************** PLAYER ****************/
player = add([
	sprite("player", {width: gorasize, height: gorasize}),
    //scale(.7, .7),
	pos(120, 120),
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
        enemy.speed = player.slamspeed
        enemy.charge = player.slamspeed
	    player.slamspeed = player.slamspeed * .5
        enemy.attacked = 1
        shake(5)
    }
    else
    {
        //???
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
    })
    drawSprite({
        sprite: "player",
        pos: vec2(0),
        width: gorasize, 
        height: gorasize,
        origin: "center"
    })
    //Draw rings to make sprite look circular
    for(i = 0; i < 7; i++)
    {
        drawCircle({
            pos: vec2(0),
            radius: gorasize*(.7-i*.03),
            outline: {width: 4, color: goraBackground},
            fill: false,
        })
    }
})




/**************** ENEMY ****************/
tempsprite = "player"
enemy1 = [
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
]

add(enemy1)

buffer = gorasize*.8
onUpdate("enemy", (enemy) => {
    //Enemies die when they hit the edge of the screen
    if(enemy.pos.x > width() - buffer || enemy.pos.x < buffer || enemy.pos.y > height() - buffer || enemy.pos.y < buffer)
    {
        enemy.death = 1
        enemy.attacked = 0
    }

    //Death Animation
    if(enemy.death == 1)
    {
        if(enemy.deathglow > 255)
        {   
            enemy.pos.x = rand(gorasize, width() - gorasize)
            enemy.pos.y = rand(gorasize, height() - gorasize)
            add(enemy1)
            destroy(enemy)
            score += 1
        }
        
        enemy.deathglow += 50
        enemy.scale = 1 + enemy.deathglow/100
    }
    
    if(enemy.attacked == 1)
    {
        enemy.move(Vec2.fromAngle(enemy.direction).scale(-enemy.charge))
        enemy.charge -= 20

        if(enemy.charge <= 600)
        {
            enemy.attacked = 0;
            enemy.charge = 0;
            enemy.death = 1
        }
    }
    else if(enemy.death == 0)
    {
        if (!player.exists()) return
	    const dir = player.pos.sub(enemy.pos).unit()
	    enemy.move(dir.scale(200)) 
    }
})

//Enemies don't have circular sprites because that slows the game down too much
//Should the player not have a circular sprite either then?
onDraw("enemy", (enemy) => {
    drawCircle({
        pos: vec2(0),
        radius: gorasize*.8,
        color: rgb(enemy.deathglow, enemy.deathglow, enemy.deathglow),
    })
    drawSprite({
        sprite: "bean",
        pos: vec2(0),
        width: gorasize, 
        height: gorasize,
        origin: "center"
    })
})