const express = require('express');
const app = express()

const games = [
    3937036363,
    5158823702,
]

const glikes = {}
const likeApi = 'https://games.roblox.com/v1/games/votes?universeIds='

app.get('/likes/:game', (req, res) => {
    const game = parseInt(req.params.game)
    if (glikes[game]) {
        res.send(glikes[game])
    } else {
        res.send("none")
    }
})

app.use('/', (req, res) => {
    res.send('Hello ben!')
})

app.listen(80, () => {
    console.log("Listening on port 80")
})

async function check() {
    /*const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    
    for (let i = 0; i < games.length; i++) {
        const game = games[i]
        const link = baseLink + game
        await page.goto(link)

        try {
            let tries = 0
            async function check() {
                tries++
                if (tries > 10) {
                    return
                }
                const likes = await page.evaluate(() => {
                    const likes = document.querySelector('#vote-up-text')
                    if (likes) {
                        return likes.innerText
                    } else {
                        return null
                    }
                })
                if (likes) {
                    glikes[game] = likes
                    return
                }
                setTimeout(() => {
                    check()
                }, 1000 * 1);
            }
            await check()
        } catch (error) {
            console.log("No likes", game)
        }
    }

    await page.close()
    await browser.close()*/

    const likes = await fetch(likeApi + games.join(",")).then(res => res.json())

    if (!likes.data) {
        return
    }

    for (let i = 0; i < likes.data.length; i++) {
        const game = likes.data[i]
        glikes[game.id] = game.upVotes.toString()
    }

    console.log("Updated likes", glikes)
}

function loop() {
    check()
    setTimeout(() => {
        loop()
    }, 1000 * 60);
}
loop()