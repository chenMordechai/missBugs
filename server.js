import { bugService } from './services/bug.service.js'
import {loggerService} from './services/logger.service.js'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello there')
})


// Get Bugs(READ):
app.get('/api/bug', (req, res) => {
    bugService.query()
    .then(bugs => {
        res.send(bugs)
    })
    .catch(err => {
        loggerService.error('Cannot get bugs', err)
        res.status(400).send('Cannot get bugs')
    })
})

// Save Bug (CREATE/UPDATE): must be before get bug because the :bugId
app.get('/api/bug/save', (req, res) => {
    const bug = {
        _id : req.query._id,
        title : req.query.title,
        description : req.query.description,
        severity : +req.query.severity,
        createdAt: req.query.createdAt,
    }
    bugService.save(bug)
        .then(bug => {
            res.send(bug)
        })
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Download Pdf Bug (DELETE):
app.get('/api/bug/pdf', (req, res) => {
    bugService.downloadPdf()
        .then(() => {
            console.log('downloadPdf')
        })
        .catch(err => {
            loggerService.error('Cannot downloadPdf bugs', err)
            res.status(400).send('Cannot downloadPdf bugs')
        })
})



// Get Bug (READ):
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId

    let visitedBugs
    if(!req.cookies.visitedBugs) visitedBugs = [bugId]
    else {
        visitedBugs = req.cookies.visitedBugs
        if(!visitedBugs.includes(bugId)) {
            visitedBugs.push(bugId)
            if(visitedBugs.length >=3) {
                console.log('visitedBugs.length:', visitedBugs.length)
                return res.status(401).send('Wait for a bit')
            }
        }
    }
    res.cookie('visitedBugs', visitedBugs,{magAge:7 * 1000}) 
    console.log('visitedBugs:', visitedBugs)
    
         bugService.getById(bugId)
            .then(bug => {
            console.log(bug)
            res.send(bug)
             })
             .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
          })
    
})


// Remove Bug (DELETE):
app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(() => {
            console.log('removed '+ bugId)
            res.redirect('/api/bug')
        })
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})




// app.listen(3031, () => console.log('Server ready at port 3031'))

const port = 3031
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

