const path = require('path')
const fs = require('fs')

const friendDBpath = './app/data/friends.js'
module.exports = (app) => {
    app.get('/api/friends', (req, res) => {
         fs.readFile(friendDBpath, (err, data) => {
            if (err && (err.errno === -2) && (err.code === 'ENOENT')) {
                res.write('No friends currently in database!!')
                res.end()
            } else {
                res.write(JSON.stringify(JSON.parse(data)))
                res.end()
            }
         })
    })
  
    app.post('/api/friends', (req, res) => {
        const newFriend = req.body
        fs.readFile(friendDBpath, (err, data) => {
            // If no friend file exists, just create it and add this user's data
            if (err && (err.errno === -2) && (err.code === 'ENOENT')) {
                let friendDB = []
                friendDB[0] = newFriend
                fs.writeFile(friendDBpath, JSON.stringify(friendDB), 'utf8', err => {
                    if (err) throw err
                    res.write('Error writing file' + friendDBpath)
                    res.end()
                })
            } else {
                // Read in the friend file
                let friendDB = JSON.parse(data)
                let bestFriendMatch = {
                    name: "",
                    photo: "",
                    aggScoreDiff: 40 // Since the greatest difference for any question is 5 - 1 = 4, and there are 10 questions, 40 would be the worst possible total.
                }
                // Search through friend file for best match
                for (let i = 0; i < friendDB.length; ++i) {
                    let scoreDiffSum = 0
                    for (let j = 0; j < friendDB[i].score.length; ++j) {
                        scoreDiffSum += Math.abs(newFriend.score[j] - friendDB[i].score[j])
                    }

                    // Current record is better than best match so far, so this becomes the newest contender
                    if (scoreDiffSum < bestFriendMatch.aggScoreDiff) {
                        bestFriendMatch.name = friendDB[i].name,
                        bestFriendMatch.photo = friendDB[i].photo,
                        bestFriendMatch.aggScoreDiff = scoreDiffSum
                    }
                }
                //console.log(JSON.parse(data))
                friendDB.push(newFriend)
                fs.writeFile(friendDBpath, JSON.stringify(friendDB), 'utf8', err => {
                    if (err) throw err
                    res.write(JSON.stringify(bestFriendMatch))
                    res.end()
                })
            }
        })
    })
}