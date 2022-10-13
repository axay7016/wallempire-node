const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')
const PatchAPI = require('./patch')

module.exports = [{
        method: 'post',
        path: '/signIn',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["signIn"].Post.ApiDescription,
            tags: ['api', 'signIn'],
            auth: {
                strategies: ["basic"]
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
    },
    {
        method: 'patch',
        path: '/activate',
        handler: PatchAPI.handler,
        config: {
            cors: true,
            description: locals["signIn"].Post.ApiDescription,
            tags: ['api', 'signIn'],
            auth: {
                strategies: ['admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: PatchAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: PatchAPI.response
        }
    }
]