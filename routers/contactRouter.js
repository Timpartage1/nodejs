const app =require('express')
const contactRouter=app.Router()


contactRouter.get('/', (req, res) => {
    res.render('contact')
})