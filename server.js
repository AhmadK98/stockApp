const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const expressGraphQL = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql')


const schema1 = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Ahmad',
        fields: () =>({
            message: {
            type: GraphQLString,
            resolve: () => 'Hi'
            }
        })
    })
    
})



const stockRoute = require('./backend/routes/stockRoute')
const loginRoute = require('./backend/routes/loginRoute')
const dashboardRoute = require('./backend/routes/dashboardRoute')
const { isLoggedIn, isAuth } = require('./backend/isLoggedIn')

require('dotenv').config()


const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(cors({
    credentials: true
}))
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/graphql',expressGraphQL({
    schema: schema1,
    graphiql:true
    
}))
app.use('/stocks', stockRoute)
app.use('/users', loginRoute)
app.use('/dashboard', isLoggedIn, dashboardRoute)


if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        // res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
        console.log(`Youre in production \n File path: ${path.join(__dirname + '/client/build/index.html')}`)

        res.sendFile(path.join(__dirname + '/client/build/index.html'))

    })
}
port = process.env.PORT || 3001
app.listen(port, (res) => {

    console.log(`connected on port ${port}`)
})