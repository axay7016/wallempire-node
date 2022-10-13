const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')

module.exports = [{
    method: 'post',
    path: '/signUp',
    handler: PostAPI.handler,
    config: {
        cors: true,
        description: locals["signUp"].Post.ApiDescription,
        tags: ['api', 'signUp'],
        auth: {
            strategy: "basic"
        },
        validate: {
            headers: headerValidator.headerAuth,
            payload: PostAPI.validator,
            failAction: (req, reply, source, error) => {
                headerValidator.faildAction(req, reply, source, error)
            }
        },
        response: PostAPI.response
    }
}]