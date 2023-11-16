import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/pdf.service.js'
import { userService } from './services/user.service.js'

const app = express()

// App Configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json()) // for req.body

// Get Bugs(READ):
app.get('/api/bug', (req, res) => {
    const { title, severity, labels, pageIdx, type, des } = req.query
    const filterBy = {
        title,
        severity,
        labels,
        pageIdx
    }
    const sortBy = {
        type,
        des: (des === 'true') ? -1 : 1
    }
    bugService.query(filterBy, sortBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Get Bug (READ):
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    const { visitedBugs = [] } = req.cookies
    if (visitedBugs.length > 3) {
        console.log('visitedBugs.length:', visitedBugs.length)
        return res.status(401).send('Wait for a bit')
    }
    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })

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

// Add Bug
app.post('/api/bug', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, severity, description, createdAt, labels } = req.body
    const bug = {
        title,
        severity: +severity,
        description,
        createdAt,
        labels,
    }
    bugService.save(bug , loggedinUser)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Edit Bug
app.put('/api/bug', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot edit bug')
   
    const { _id, title, severity, description, createdAt, labels } = req.body
    const bug = {
        _id,
        title,
        severity: +severity,
        description,
        createdAt,
        labels,
    }
    bugService.save(bug ,loggedinUser)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot edit bug', err)
            res.status(400).send('Cannot edit bug')
        })
})

// Remove Bug (DELETE):
app.delete('/api/bug/:bugId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')
   

    const { bugId } = req.params

    bugService.remove(bugId,loggedinUser)
        .then(() => {
            console.log('removed ' + bugId)
            // res.redirect('/api/bug')
            res.send('Bug removed successfully')
        })
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

////////////////////////////////////////////////////


app.post('/api/auth/signup', (req, res) => {
    console.log('req.body:', req.body)
    const credentials = req.body
    userService.signup(credentials)
        .then((savedUser) => res.send(savedUser))
        .catch((err) => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })

})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
        .catch((err) => {
            loggerService.error('Cannot login', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout..')
})

app.get('/api/auth/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
    .then(user=>{
        if (user) {
            res.send(user)
        } else {
            res.status(401).send('Invalid User')
        }
    })
    .catch((err) => {
        loggerService.error('Cannot get user', err)
        res.status(400).send('Cannot get user')
    })
})


////////////////////////////////////////////////////

// Download Pdf Bug :
app.get('/api/bug/export', (req, res) => {

    bugService.query().then(pdfService.buildPDF).then((pdfFileName) => {
        const pdfFilePath = path.join(process.cwd(), pdfFileName)
        // Send the PDF file to the client
        return res.sendFile(pdfFilePath) //SaveTheBugs.pdf
    }).catch(err => {
        loggerService.error('Cannot get Pdf', err)
        res.status(400).send('Cannot get Pdf')
    })
})

////////////////////////////////////////////////////

// for using ReactRouterDOM.BrowserRouter
app.get('/**', (req, res) => {
    console.log('/**')
    res.sendFile(path.resolve('public/index.html'))
})

// app.listen(3030, () => console.log('Server ready at port 3031'))

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

