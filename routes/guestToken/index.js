const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')

module.exports = [
    {
        method: 'post',
        path: '/guestToken',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["signUp"].Post.ApiDescription,
            tags: ['api', 'guest'],
            auth: "basic",
            validate: {
                headers: headerValidator.headerAuth,
                payload: PostAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            // response: PostAPI.response
        }
    }
]
