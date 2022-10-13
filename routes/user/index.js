const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const GetAPI = require('./Get')
const PostAPI = require('./Post')

module.exports = [{
        method: 'post',
        path: '/users',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["user"].Post.ApiDescription,
            tags: ['api', 'users'],
            auth: {
                strategies: ['admin']
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
        method: 'get',
        path: '/users',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["user"].Get.ApiDescription,
            tags: ['api', 'users'],
            auth: {
                strategies: ['admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                query: GetAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            // response: GetAPI.response
        }
    }
]
