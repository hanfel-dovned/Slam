import kaboom from "kaboom"

kaboom({
	background: [ 200, 200, 255 ],
    width: 1200,
    height: 700
})

//speed = 0;
//playermove = 0;
gorasize = 50;

//debug.inspect = true

loadSound("music", "/sounds/music.mp3")

const music = play("music", {
	loop: true,
})

// Adjust global volume
//volume(0.5)


//handle case where gora fails to load
loadSprite("bean", "https://minderimages.nyc3.digitaloceanspaces.com/minder-folden/2022.1.13..22.42.38-Week%2002%202022.png")

//loadSprite("bean", "https://nartes-fasrum.s3.tirefire.pw/nartes-fasrum/2021.11.04..16.04.04-rab-pb-gora.pngd")


loadSprite("player", "https://nyc3.digitaloceanspaces.com/archiv/littel-wolfur/2021.11.02..21.41.08-image.png")

//loadPedit("cursor", "sprites/cursor.pedit")


/*loadSpriteAtlas("https://minderimages.nyc3.digitaloceanspaces.com/minder-folden/2022.1.13..22.42.38-Week%2002%202022.png", {
    "bean": {
        x: 150,
        y: 150,
        width: 150,
        height: 150,
        //sliceX: 9,
    },
})*/


layers([
    "bg",
    "game",
    "ui",
], "game")



/******** PLAYER ********/
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

/*onMousePress(() => {
    if(player.charging == 0 && player.slamming == 0)
        player.charging = 1
})

onMouseDown(() => {
    if(player.charge < player.maxcharge && player.charging == 1)
    {
        player.charge += player.chargerate;
    }
    //shake(player.charge/100)
    player.move(Vec2.fromAngle(player.pos.angle(mousePos())).scale(10))
player.move(Vec2.fromAngle(rand(360)).scale(30))
})

onMouseRelease(() => {
    if(player.charging == 1)
    {
        player.charging = 0;
        player.slamming = 1;
        player.slamdirection = player.pos.angle(mousePos())
        player.color = rgb()
    }
})*/

onMousePress(() => {
        player.charging = 1
})

onMouseDown(() => {
    if(player.charge < player.maxcharge && player.charging == 1)
    {
        player.charge += player.chargerate;
    }
    //shake(player.charge/100)
    player.move(Vec2.fromAngle(player.pos.angle(mousePos())).scale(10))
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

    if(player.pos.x < 0)
        player.pos.x = width() - 1;
    if(player.pos.x > width())
        player.pos.x = 1
    if(player.pos.y < 0)
        player.pos.y = height() - 1;
    if(player.pos.y > height())
        player.pos.y = 1

    //regCursor("pointer", "bean")
    //cursor("bean")

    if(player.slamming == 1)
    {
        // Add slight deceleration to end of slam
        /*if(player.charge < player.maxcharge/5)
            player.move(Vec2.fromAngle(player.slamdirection).scale(-player.charge))
        else
            player.move(Vec2.fromAngle(player.slamdirection).scale(-player.slamspeed))

        player.charge -= player.chargeloss

if(player.charge <= 0)
        {
            player.slamming = 0;
            player.charge = 0;
        }*/

       // if(player.charge < player.maxcharge/5)
            player.move(Vec2.fromAngle(player.slamdirection).scale(-player.slamspeed))
       // else
        ///    player.move(Vec2.fromAngle(player.slamdirection).scale(-player.slamspeed))

        player.slamspeed -= 20

        if(player.slamspeed <= 0)
        {
            player.slamming = 0;
           // player.charge = 0;
        }
    }
    
    //player.color = rgb(player.charge, player.charge, player.charge)
    //player.scale = player.charge/player.maxcharge/4 + 1
})

                        

/*onDraw(() => {

    drawLine({
        p1: player.pos,
        p2: vec2(mousePos().x + Vec2.fromAngle(player.slamdirection).scale(player.charge).x, mousePos().y + Vec2.fromAngle(player.slamdirection).scale(player.charge).y), 
        width: 10,
        color: rgb(255, 255, 255),
    })
    //debug.log(vec2(player.pos.x - mousePos().x, player.pos.y - mousePos().y))
})*/

/*player.onCollide("enemy", (enemy) => {
    if(player.slamming == 1)
    {
        enemy.direction = player.slamdirection
        player.slamdirection = player.slamdirection + 180
        enemy.speed = player.slamspeed
        enemy.charge = player.charge
	    player.charge = 40
        //player.charging = 0
        //player.slamming = 0
        enemy.attacked = 1
        shake(5)
    }
    else
    {
        //player.destroy()
    }
})*/

player.onCollide("enemy", (enemy) => {
    if(player.slamming == 1)
    {
        enemy.direction = player.slamdirection
        player.slamdirection = player.slamdirection + 180
        enemy.speed = player.slamspeed
        enemy.charge = player.slamspeed
	    player.slamspeed = player.slamspeed * .5
        //player.charging = 0
        //player.slamming = 0
        enemy.attacked = 1
        shake(5)
    }
    else
    {
        //player.destroy()
    }
})

goraBackground = rgb(0, 0, 0)
player.onDraw(() => {


    goraBackground = rgb(player.charge*(255/player.maxcharge), 0, 0)
    drawCircle({
        pos: vec2(0),
        radius: gorasize*.8,
        color: goraBackground,
        //outline: {width: 4},
        //fill: false,
        //layer: "bg",
    })
    drawSprite({
        sprite: "player",
        pos: vec2(0),
        width: gorasize, 
        height: gorasize,
        origin: "center"
    })
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



/*onKeyDown("w", () => {
    player.move(0, -player.movespeed)
})

onKeyDown("a", () => {
    player.move(-player.movespeed, 0)
})

onKeyDown("s", () => {
    player.move(0, player.movespeed)
})

onKeyDown("d", () => {
    player.move(player.movespeed, 0)
})*/

/******** ENEMY ********/
/*for(i = 0; i < 1; i++)
{
    if(i < 6)
        tempsprite = "player"
    else
        tempsprite = "player"
*/
tempsprite = "player"
enemy1 = [
	// list of components
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
score = 0
    

//}

buffer = gorasize*.8
onUpdate("enemy", (enemy) => {
    if(enemy.pos.x > width() - buffer || enemy.pos.x < buffer || enemy.pos.y > height() - buffer || enemy.pos.y < buffer)
    {
        enemy.death = 1
        enemy.attacked = 0
    }
    
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

        //if(enemy.charge < player.maxcharge/5)
            enemy.move(Vec2.fromAngle(enemy.direction).scale(-enemy.charge))
        //else
        //enemy.move(Vec2.fromAngle(enemy.direction).scale(-enemy.speed))
        
        //enemy.charge -= 5 //player.chargelosss
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

onDraw("enemy", (enemy) => {
//enemy.onDraw(() => {

    //goraBackground = rgb(enemy.charge*(255/en.maxcharge), 0, 0)
    drawCircle({
        pos: vec2(0),
        radius: gorasize*.8,
        color: rgb(enemy.deathglow, enemy.deathglow, enemy.deathglow),
        //outline: {width: 4},
        //fill: false,
        //layer: "bg",
    })
    drawSprite({
        sprite: "bean",
        pos: vec2(0),
        width: gorasize, 
        height: gorasize,
        origin: "center"
    })
    /*for(i = 0; i < 7; i++)
    {
        drawCircle({
            pos: vec2(0),
            radius: gorasize*(.7-i*.03),
            outline: {width: 4, color: rgb(0,0,0)},
            fill: false,
        })
    }*/
})


tempspeed = 0
/*onCollide("enemy", "enemy", (enemy1, enemy2) => {
    /*const dir1 = enemy1.pos.sub(enemy2.pos).unit()
	enemy1.move(dir1.scale(200)) 

    const dir2 = enemy2.pos.sub(enemy1.pos).unit()
	enemy2.move(dir2.scale(200)) */

    /*if(enemy2.speed > enemy1.speed)
    {
        enemy1.speed = enemy2.speed
        enemy1.direction = enemy2.direction
        enemy2.speed = 0
        enemy2.charge = 0
    }

    debug.log(enemy2.speed)
    
        /*enemy2.direction = enemy1.direction
        enemy1.direction = enemy1.direction + 180
        enemy2.speed = enemy1.speed
        enemy2.charge = enemy1.charge
	    enemy1.charge = 10
        //player.charging = 0
        //player.slamming = 0
        enemy2.attacked = 1*/
        //shake(2)
//})

//


/*scoreboard = add([
	text(score.wavy, {
		width: width(),
		styles: {
			"green": {
				color: rgb(128, 128, 255),
			},
			"wavy": (idx, ch) => ({
				color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
				pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
			}),
		},
	}),
	pos(width()/2, height()/2),
	origin("center"),
	// scale(0.5),
])

scoreboard.onUpdate(() => {
scoreboard.text = score
})*/

const t = (n = 1) => time() * n
const w = (a, b, n) => wave(a, b, t(n))
const px = 160
const py = 200

onDraw(() => {

    const mx = (width() - px * 2) / 2
	const my = (height() - py * 2) / 1
    const p = (x, y) => vec2(x, y).scale(mx, my).add(px, py)

drawText({
		text: score,
		pos: vec2(width()/2, height()/2),
		origin: "center",
		size: w(80, 120, 2),
		color: rgb(w(128, 255, 4), w(128, 255, 8), w(128, 255, 2)),
	})
})